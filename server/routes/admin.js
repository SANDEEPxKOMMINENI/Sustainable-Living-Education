import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { pool } from '../db';

const router = express.Router();

// Middleware to check admin role
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// Student Management
router.get('/students', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [students] = await pool.execute(`
      SELECT u.*, 
        COUNT(DISTINCT ce.course_id) as enrolled_courses,
        COUNT(DISTINCT es.exam_id) as completed_exams
      FROM users u
      LEFT JOIN course_enrollments ce ON u.id = ce.user_id
      LEFT JOIN exam_submissions es ON u.id = es.user_id
      WHERE u.role = 'student'
      GROUP BY u.id
    `);
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Exam Management
router.get('/exams', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [exams] = await pool.execute(`
      SELECT e.*, 
        c.title as course_title,
        COUNT(q.id) as question_count,
        COUNT(DISTINCT es.user_id) as submission_count
      FROM exams e
      LEFT JOIN courses c ON e.course_id = c.id
      LEFT JOIN questions q ON e.id = q.exam_id
      LEFT JOIN exam_submissions es ON e.id = es.exam_id
      GROUP BY e.id
    `);
    res.json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/exams', authenticateToken, isAdmin, async (req, res) => {
  const { courseId, title, duration, passingPercentage } = req.body;
  
  try {
    const [result] = await pool.execute(
      'INSERT INTO exams (course_id, title, duration, passing_percentage) VALUES (?, ?, ?, ?)',
      [courseId, title, duration, passingPercentage]
    );
    
    const [newExam] = await pool.execute('SELECT * FROM exams WHERE id = ?', [result.insertId]);
    res.status(201).json(newExam[0]);
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/exams/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, duration, passingPercentage } = req.body;
  
  try {
    await pool.execute(
      'UPDATE exams SET title = ?, duration = ?, passing_percentage = ? WHERE id = ?',
      [title, duration, passingPercentage, id]
    );
    
    const [updatedExam] = await pool.execute('SELECT * FROM exams WHERE id = ?', [id]);
    res.json(updatedExam[0]);
  } catch (error) {
    console.error('Error updating exam:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/exams/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  
  try {
    await pool.execute('DELETE FROM questions WHERE exam_id = ?', [id]);
    await pool.execute('DELETE FROM exam_submissions WHERE exam_id = ?', [id]);
    await pool.execute('DELETE FROM exams WHERE id = ?', [id]);
    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;