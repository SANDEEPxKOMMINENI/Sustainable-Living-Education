import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { pool } from '../db.js';

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const [courses] = await pool.execute(`
      SELECT c.*, 
        u.name as instructor_name, 
        u.avatar as instructor_avatar,
        COUNT(DISTINCT ce.user_id) as student_count
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      LEFT JOIN course_enrollments ce ON c.id = ce.course_id
      GROUP BY c.id
    `);
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const [courses] = await pool.execute(
      `SELECT c.*, 
        u.name as instructor_name, 
        u.avatar as instructor_avatar
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE c.id = ?`,
      [req.params.id]
    );
    
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(courses[0]);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Enroll in a course
router.post('/:id/enroll', authenticateToken, async (req, res) => {
  try {
    const [existing] = await pool.execute(
      'SELECT * FROM course_enrollments WHERE course_id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    await pool.execute(
      'INSERT INTO course_enrollments (course_id, user_id) VALUES (?, ?)',
      [req.params.id, req.user.id]
    );

    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;