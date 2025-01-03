import express from 'express';
import { query } from '../database/init.js';

const router = express.Router();

// Get student dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const [activeCourses, completedCourses, totalHours, recentActivity] =
      await Promise.all([
        query(
          'SELECT COUNT(*) as count FROM enrollments WHERE user_id = ? AND status = ?',
          [userId, 'in_progress']
        ),
        query(
          'SELECT COUNT(*) as count FROM enrollments WHERE user_id = ? AND status = ?',
          [userId, 'completed']
        ),
        query(
          'SELECT COALESCE(SUM(l.duration), 0) as total FROM lessons l JOIN enrollments e ON l.course_id = e.course_id WHERE e.user_id = ?',
          [userId]
        ),
        query(
          `SELECT 
            a.id,
            a.type,
            a.description,
            a.created_at,
            c.title as course_title
          FROM activity_log a
          LEFT JOIN courses c ON a.course_id = c.id
          WHERE a.user_id = ?
          ORDER BY a.created_at DESC
          LIMIT 10`,
          [userId]
        ),
      ]);

    res.json({
      activeCourses: activeCourses[0].count,
      completedCourses: completedCourses[0].count,
      hoursSpent: Math.round((totalHours[0].total || 0) / 60),
      recentActivity: recentActivity.map((activity) => ({
        id: activity.id,
        type: activity.type,
        description: activity.description,
        datetime: activity.created_at,
        time: new Date(activity.created_at).toLocaleTimeString(),
        course: activity.course_title,
      })),
    });
  } catch (error) {
    console.error('Error fetching student dashboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get enrolled courses
router.get('/courses', async (req, res) => {
  try {
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const courses = await query(
      `SELECT 
        c.*,
        e.status,
        e.progress,
        u.name as instructor_name
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      JOIN users u ON c.instructor_id = u.id
      WHERE e.user_id = ?
      ORDER BY e.enrolled_at DESC`,
      [userId]
    );

    res.json(courses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;