import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { pool } from '../db.js';

const router = express.Router();

// Get exam by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [exams] = await pool.execute(
      'SELECT * FROM exams WHERE id = ?',
      [req.params.id]
    );

    if (exams.length === 0) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const [questions] = await pool.execute(
      'SELECT * FROM questions WHERE exam_id = ?',
      [req.params.id]
    );

    const exam = {
      ...exams[0],
      questions: questions.map(q => ({
        ...q,
        options: JSON.parse(q.options)
      }))
    };

    res.json(exam);
  } catch (error) {
    console.error('Error fetching exam:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit exam
router.post('/:id/submit', authenticateToken, async (req, res) => {
  try {
    const { answers } = req.body;
    const examId = req.params.id;
    const userId = req.user.id;

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

    await pool.execute(
      'INSERT INTO exam_submissions (exam_id, user_id, score, passed) VALUES (?, ?, ?, ?)',
      [examId, userId, score, percentage >= 65]
    );

    res.json({ score, percentage, passed: percentage >= 65 });
  } catch (error) {
    console.error('Error submitting exam:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;