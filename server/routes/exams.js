import express from 'express';
import { query } from '../database/init.js';

const router = express.Router();

// Get all exams
router.get('/', async (req, res) => {
  try {
    const exams = await query(`
      SELECT e.*, c.title as course_title 
      FROM exams e
      LEFT JOIN courses c ON e.course_id = c.id
      ORDER BY e.created_at DESC
    `);

    res.json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get exam by id with questions
router.get('/:id', async (req, res) => {
  try {
    const [exam] = await query(
      `SELECT e.*, c.title as course_title 
       FROM exams e
       LEFT JOIN courses c ON e.course_id = c.id
       WHERE e.id = ?`,
      [req.params.id]
    );

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    const questions = await query(
      'SELECT * FROM exam_questions WHERE exam_id = ?',
      [req.params.id]
    );

    res.json({ ...exam, questions });
  } catch (error) {
    console.error('Error fetching exam:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create exam
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      course_id,
      passing_score,
      duration_minutes,
      questions,
    } = req.body;

    // Validate required fields
    if (!title || !description || !course_id || !passing_score || !duration_minutes) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate questions array
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Questions must be a non-empty array' });
    }

    // Insert exam
    const [result] = await query(
      `INSERT INTO exams (
        title, description, course_id, passing_score, 
        duration_minutes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
      [title, description, course_id, passing_score, duration_minutes]
    );

    const examId = result.insertId;

    // Insert questions
    for (const q of questions) {
      if (!q.question || !q.option_a || !q.option_b || !q.option_c || !q.option_d || !q.correct_answer) {
        throw new Error('Invalid question format');
      }

      await query(
        `INSERT INTO exam_questions (
          exam_id, question, option_a, option_b, option_c, option_d,
          correct_answer, points, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          examId,
          q.question,
          q.option_a,
          q.option_b,
          q.option_c,
          q.option_d,
          q.correct_answer,
          q.points || 1,
        ]
      );
    }

    res.status(201).json({
      id: examId,
      message: 'Exam created successfully',
    });
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ 
      message: 'Server error during exam creation',
      error: error.message 
    });
  }
});

// Update exam
router.put('/:id', async (req, res) => {
  try {
    const {
      title,
      description,
      course_id,
      passing_score,
      duration_minutes,
      questions,
    } = req.body;

    // Validate required fields
    if (!title || !description || !course_id || !passing_score || !duration_minutes) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate questions array
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Questions must be a non-empty array' });
    }

    await query(
      `UPDATE exams SET 
        title = ?, description = ?, course_id = ?,
        passing_score = ?, duration_minutes = ?,
        updated_at = NOW()
       WHERE id = ?`,
      [
        title,
        description,
        course_id,
        passing_score,
        duration_minutes,
        req.params.id,
      ]
    );

    // Delete existing questions
    await query('DELETE FROM exam_questions WHERE exam_id = ?', [
      req.params.id,
    ]);

    // Insert updated questions
    for (const q of questions) {
      if (!q.question || !q.option_a || !q.option_b || !q.option_c || !q.option_d || !q.correct_answer) {
        throw new Error('Invalid question format');
      }

      await query(
        `INSERT INTO exam_questions (
          exam_id, question, option_a, option_b, option_c, option_d,
          correct_answer, points, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          req.params.id,
          q.question,
          q.option_a,
          q.option_b,
          q.option_c,
          q.option_d,
          q.correct_answer,
          q.points || 1,
        ]
      );
    }

    res.json({ message: 'Exam updated successfully' });
  } catch (error) {
    console.error('Error updating exam:', error);
    res.status(500).json({ 
      message: 'Server error during exam update',
      error: error.message 
    });
  }
});

// Delete exam
router.delete('/:id', async (req, res) => {
  try {
    // Delete exam questions first (cascade delete will handle this if set up)
    await query('DELETE FROM exam_questions WHERE exam_id = ?', [
      req.params.id,
    ]);
    await query('DELETE FROM exams WHERE id = ?', [req.params.id]);

    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit exam
router.post('/:id/submit', async (req, res) => {
  try {
    const { answers, cheatingDetected } = req.body;
    const userId = req.session.userId;
    const examId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    // Get exam questions and calculate score
    const questions = await query(
      'SELECT * FROM exam_questions WHERE exam_id = ?',
      [examId]
    );

    let score = 0;
    let totalPoints = 0;

    questions.forEach(question => {
      totalPoints += question.points;
      if (answers[question.id] === question.correct_answer) {
        score += question.points;
      }
    });

    const percentage = Math.round((score / totalPoints) * 100);
    const [exam] = await query('SELECT passing_score FROM exams WHERE id = ?', [examId]);
    const passed = percentage >= exam.passing_score;

    // Record attempt
    const [result] = await query(
      `INSERT INTO exam_attempts (
        user_id, exam_id, score, passed, completed_at, cheating_detected
      ) VALUES (?, ?, ?, ?, NOW(), ?)`,
      [userId, examId, percentage, passed, cheatingDetected]
    );

    // Generate certificate if passed
    let certificateId = null;
    if (passed && !cheatingDetected) {
      const [courseResult] = await query(
        'SELECT course_id FROM exams WHERE id = ?',
        [examId]
      );

      const [certResult] = await query(
        `INSERT INTO certificates (
          user_id, course_id, exam_score, certificate_number, issued_at
        ) VALUES (?, ?, ?, ?, NOW())`,
        [
          userId,
          courseResult.course_id,
          percentage,
          `CERT-${Date.now()}-${userId}`,
        ]
      );
      certificateId = certResult.insertId;
    }

    res.json({
      score: percentage,
      passed,
      certificateId,
      cheatingDetected,
    });
  } catch (error) {
    console.error('Error submitting exam:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;