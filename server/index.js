import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ecolearn',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    const user = users[0];
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ user: { ...user, password: undefined }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, 'student']
    );

    const token = jwt.sign(
      { id: result.insertId, email, role: 'student' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      user: { id: result.insertId, name, email, role: 'student' },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Course routes
app.get('/api/courses', async (req, res) => {
  try {
    const [courses] = await pool.execute('SELECT * FROM courses');
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Exam routes
app.get('/api/exams/:courseId', authenticateToken, async (req, res) => {
  try {
    const [exams] = await pool.execute(
      'SELECT * FROM exams WHERE course_id = ?',
      [req.params.courseId]
    );
    res.json(exams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/exams/:examId/submit', authenticateToken, async (req, res) => {
  try {
    const { answers } = req.body;
    const examId = req.params.examId;
    const userId = req.user.id;

    // Calculate score
    const [questions] = await pool.execute(
      'SELECT * FROM questions WHERE exam_id = ?',
      [examId]
    );

    let score = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correct_option) {
        score++;
      }
    });

    const percentage = (score / questions.length) * 100;

    // Save submission
    await pool.execute(
      'INSERT INTO exam_submissions (exam_id, user_id, score, passed) VALUES (?, ?, ?, ?)',
      [examId, userId, score, percentage >= 65]
    );

    res.json({ score, percentage, passed: percentage >= 65 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});