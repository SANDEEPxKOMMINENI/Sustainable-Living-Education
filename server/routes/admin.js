import express from 'express';
import { query } from '../database/init.js';

const router = express.Router();

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all enrollments
router.get('/enrollments', async (req, res) => {
  try {
    const enrollments = await query(`
      SELECT 
        e.*,
        u.name as student_name,
        u.email as student_email,
        c.title as course_title,
        c.image_url as course_image
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      JOIN courses c ON e.course_id = c.id
      ORDER BY e.enrolled_at DESC
    `);

    const formattedEnrollments = enrollments.map(enrollment => ({
      id: enrollment.id,
      status: enrollment.status,
      enrolledAt: enrollment.enrolled_at,
      student: {
        name: enrollment.student_name,
        email: enrollment.student_email
      },
      course: {
        title: enrollment.course_title,
        imageUrl: enrollment.course_image
      }
    }));

    res.json(formattedEnrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update enrollment status
router.patch('/enrollments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'denied'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await query(
      'UPDATE enrollments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    // If approved, update course enrollment count
    if (status === 'approved') {
      await query(`
        UPDATE courses c
        SET enrollment_count = (
          SELECT COUNT(*) 
          FROM enrollments e 
          WHERE e.course_id = c.id AND e.status = 'approved'
        )
        WHERE id = (SELECT course_id FROM enrollments WHERE id = ?)
      `, [id]);
    }

    // Log activity
    const enrollment = await query(
      'SELECT user_id, course_id FROM enrollments WHERE id = ?',
      [id]
    );

    if (enrollment.length > 0) {
      await query(
        'INSERT INTO activity_log (user_id, type, description, course_id) VALUES (?, ?, ?, ?)',
        [
          enrollment[0].user_id,
          'enrollment_update',
          `Enrollment ${status}`,
          enrollment[0].course_id,
        ]
      );
    }

    res.json({ message: 'Enrollment status updated successfully' });
  } catch (error) {
    console.error('Error updating enrollment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    await query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [totalStudents, activeCourses, courseCompletions, totalEnrollments] =
      await Promise.all([
        query('SELECT COUNT(*) as count FROM users WHERE role = ?', [
          'student',
        ]),
        query('SELECT COUNT(*) as count FROM courses'),
        query('SELECT COUNT(*) as count FROM enrollments WHERE status = ?', [
          'completed',
        ]),
        query('SELECT COUNT(*) as count FROM enrollments'),
      ]);

    const successRate =
      totalEnrollments[0].count > 0
        ? (courseCompletions[0].count / totalEnrollments[0].count) * 100
        : 0;

    res.json({
      totalStudents: totalStudents[0].count,
      activeCourses: activeCourses[0].count,
      courseCompletions: courseCompletions[0].count,
      successRate: Math.round(successRate),
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;