import express from 'express';
import { query, transaction } from '../database/init.js';

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await query(`
      SELECT 
        c.*, 
        u.name as instructor_name, 
        COUNT(DISTINCT e.id) as enrollment_count
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      LEFT JOIN enrollments e ON c.id = e.course_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);

    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get course by id
router.get('/:id', async (req, res) => {
  try {
    const [course] = await query(
      `
      SELECT c.*, u.name as instructor_name
      FROM courses c
      LEFT JOIN users u ON c.instructor_id = u.id
      WHERE c.id = ?
    `,
      [req.params.id]
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Get lessons
    const lessons = await query(
      'SELECT * FROM lessons WHERE course_id = ? ORDER BY order_index',
      [req.params.id]
    );

    // Get course content
    const [content] = await query(
      'SELECT content FROM course_content WHERE course_id = ?',
      [req.params.id]
    );

    // Get enrollment status if user is logged in
    let enrollment = null;
    if (req.session.userId) {
      const [enrollmentResult] = await query(
        'SELECT * FROM enrollments WHERE course_id = ? AND user_id = ?',
        [req.params.id, req.session.userId]
      );
      enrollment = enrollmentResult;
    }

    res.json({
      ...course,
      lessons,
      content: content?.content || '',
      enrollment,
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Enroll in a course
router.post('/:id/enroll', async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.session.userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required',
        requiresAuth: true
      });
    }

    const courseId = req.params.id;
    const userId = req.session.userId;

    // Check if course exists
    const [course] = await query('SELECT * FROM courses WHERE id = ?', [courseId]);
    if (!course) {
      return res.status(404).json({ 
        success: false,
        message: 'Course not found' 
      });
    }

    // Check if already enrolled
    const [existingEnrollment] = await query(
      'SELECT * FROM enrollments WHERE course_id = ? AND user_id = ?',
      [courseId, userId]
    );

    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course',
        enrollment: existingEnrollment
      });
    }

    // Create enrollment
    const [result] = await query(
      `INSERT INTO enrollments (
        user_id, course_id, status, enrolled_at
      ) VALUES (?, ?, 'pending', NOW())`,
      [userId, courseId]
    );

    // Log activity
    await query(
      `INSERT INTO activity_log (
        user_id, type, description, course_id, created_at
      ) VALUES (?, 'enrollment', 'Enrolled in course', ?, NOW())`,
      [userId, courseId]
    );

    res.status(201).json({
      success: true,
      message: 'Enrollment request submitted successfully',
      enrollment: {
        id: result.insertId,
        status: 'pending',
        enrolled_at: new Date()
      }
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during enrollment'
    });
  }
});

// Create new course
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      imageUrl,
      videoUrl,
      category,
      duration,
      lessons = [],
    } = req.body;
    const userId = req.session.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Validate required fields
    if (!title || !description || !imageUrl || !category || !duration) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await transaction(async (connection) => {
      // Insert course
      const [courseResult] = await connection.execute(
        'INSERT INTO courses (title, description, image_url, video_url, category, duration, instructor_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [title, description, imageUrl, videoUrl, category, duration, userId]
      );

      // Insert course content
      if (content) {
        await connection.execute(
          'INSERT INTO course_content (course_id, content) VALUES (?, ?)',
          [courseResult.insertId, content]
        );
      }

      // Insert lessons if provided
      if (Array.isArray(lessons) && lessons.length > 0) {
        for (let i = 0; i < lessons.length; i++) {
          const lesson = lessons[i];
          await connection.execute(
            'INSERT INTO lessons (course_id, title, content, duration, order_index) VALUES (?, ?, ?, ?, ?)',
            [
              courseResult.insertId,
              lesson.title,
              lesson.content,
              lesson.duration,
              i + 1,
            ]
          );
        }
      }

      return courseResult;
    });

    res.status(201).json({
      id: result.insertId,
      title,
      description,
      imageUrl,
      videoUrl,
      category,
      duration,
      instructor_id: userId,
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update course
router.put('/:id', async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      imageUrl,
      videoUrl,
      category,
      duration,
      lessons = [],
    } = req.body;
    const userId = req.session.userId;
    const courseId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if user is admin or course creator
    const [course] = await query(
      'SELECT instructor_id FROM courses WHERE id = ?',
      [courseId]
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const [user] = await query('SELECT role FROM users WHERE id = ?', [userId]);

    if (user.role !== 'admin' && course.instructor_id !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await transaction(async (connection) => {
      // Update course
      await connection.execute(
        'UPDATE courses SET title = ?, description = ?, image_url = ?, video_url = ?, category = ?, duration = ?, updated_at = NOW() WHERE id = ?',
        [title, description, imageUrl, videoUrl, category, duration, courseId]
      );

      // Update course content
      if (content !== undefined) {
        await connection.execute(
          'INSERT INTO course_content (course_id, content) VALUES (?, ?) ON DUPLICATE KEY UPDATE content = ?',
          [courseId, content, content]
        );
      }

      // Update lessons
      if (Array.isArray(lessons)) {
        // Delete existing lessons
        await connection.execute('DELETE FROM lessons WHERE course_id = ?', [
          courseId,
        ]);

        // Insert updated lessons
        for (let i = 0; i < lessons.length; i++) {
          const lesson = lessons[i];
          await connection.execute(
            'INSERT INTO lessons (course_id, title, content, duration, order_index) VALUES (?, ?, ?, ?, ?)',
            [courseId, lesson.title, lesson.content, lesson.duration, i + 1]
          );
        }
      }
    });

    res.json({ message: 'Course updated successfully' });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete course
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.session.userId;
    const courseId = req.params.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if user is admin or course creator
    const [course] = await query(
      'SELECT instructor_id FROM courses WHERE id = ?',
      [courseId]
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const [user] = await query('SELECT role FROM users WHERE id = ?', [userId]);

    if (user.role !== 'admin' && course.instructor_id !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await transaction(async (connection) => {
      // Delete related data
      await connection.execute(
        'DELETE FROM course_content WHERE course_id = ?',
        [courseId]
      );
      await connection.execute('DELETE FROM enrollments WHERE course_id = ?', [
        courseId,
      ]);
      await connection.execute('DELETE FROM lessons WHERE course_id = ?', [
        courseId,
      ]);
      await connection.execute('DELETE FROM courses WHERE id = ?', [courseId]);
    });

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;