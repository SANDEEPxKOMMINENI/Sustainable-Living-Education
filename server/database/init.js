import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'ecolearn',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Helper function for database queries
export async function query(sql, params) {
  try {
    const [results] = await pool.execute(sql, params || []);
    return results;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}

// Helper function for transactions
export async function transaction(callback) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function createDefaultAdmin() {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await query(
      'INSERT INTO users (email, password, role, name) VALUES (?, ?, ?, ?)',
      ['admin@ecolearn.com', hashedPassword, 'admin', 'Admin User']
    );

    console.log('Default admin user created successfully');
  } catch (error) {
    console.error('Error creating default admin:', error);
    throw error;
  }
}

// Add sample course data
async function createSampleCourses(adminId) {
  try {
    const courses = [
      {
        title: 'Introduction to Sustainable Living',
        description:
          'Learn the basics of sustainable living and how to reduce your environmental impact.',
        image_url:
          'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3',
        category: 'sustainability',
        duration: 8,
        instructor_id: adminId,
      },
      {
        title: 'Zero Waste Living',
        description:
          'Discover practical ways to reduce waste and live a more sustainable lifestyle.',
        image_url:
          'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3',
        category: 'waste-management',
        duration: 6,
        instructor_id: adminId,
      },
    ];

    for (const course of courses) {
      await query(
        'INSERT INTO courses (title, description, image_url, category, duration, instructor_id) VALUES (?, ?, ?, ?, ?, ?)',
        [
          course.title,
          course.description,
          course.image_url,
          course.category,
          course.duration,
          course.instructor_id,
        ]
      );
    }

    console.log('Sample courses created successfully');
  } catch (error) {
    console.error('Error creating sample courses:', error);
    throw error;
  }
}

export async function initializeDatabase() {
  try {
    // Users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'student') NOT NULL,
        name VARCHAR(255) NOT NULL,
        avatar_url VARCHAR(255),
        location VARCHAR(255),
        phone VARCHAR(50),
        website VARCHAR(255),
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL
      )
    `);

    // Courses table with updated schema
    await query(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image_url VARCHAR(255),
        video_url VARCHAR(255),
        category VARCHAR(50) NOT NULL,
        duration INT NOT NULL,
        instructor_id INT NOT NULL,
        enrollment_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (instructor_id) REFERENCES users(id)
      )
    `);

    // Course Content table
    await query(`
      CREATE TABLE IF NOT EXISTS course_content (
        id INT PRIMARY KEY AUTO_INCREMENT,
        course_id INT NOT NULL,
        content LONGTEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )
    `);

    // Enrollments table with updated schema
    await query(`
      CREATE TABLE IF NOT EXISTS enrollments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        course_id INT NOT NULL,
        status ENUM('pending', 'in_progress', 'completed', 'failed') DEFAULT 'pending',
        progress INT DEFAULT 0,
        enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (course_id) REFERENCES courses(id)
      )
    `);

    // Activity Log table
    await query(`
      CREATE TABLE IF NOT EXISTS activity_log (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        type VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        course_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (course_id) REFERENCES courses(id)
      )
    `);

    // Lessons table
    await query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id INT PRIMARY KEY AUTO_INCREMENT,
        course_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        duration INT NOT NULL,
        order_index INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id)
      )
    `);

    // Exams table
    await query(`
      CREATE TABLE IF NOT EXISTS exams (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        course_id INT NOT NULL,
        passing_score INT NOT NULL DEFAULT 65,
        duration_minutes INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )
    `);

    // Exam Questions table
    await query(`
      CREATE TABLE IF NOT EXISTS exam_questions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        exam_id INT NOT NULL,
        question TEXT NOT NULL,
        option_a TEXT NOT NULL,
        option_b TEXT NOT NULL,
        option_c TEXT NOT NULL,
        option_d TEXT NOT NULL,
        correct_answer ENUM('a', 'b', 'c', 'd') NOT NULL,
        points INT NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE
      )
    `);

    // Exam Attempts table
    await query(`
      CREATE TABLE IF NOT EXISTS exam_attempts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        exam_id INT NOT NULL,
        score INT NOT NULL,
        passed BOOLEAN NOT NULL,
        started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        cheating_detected BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (exam_id) REFERENCES exams(id)
      )
    `);

    // Certificates table
    await query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        course_id INT NOT NULL,
        exam_score INT NOT NULL,
        certificate_number VARCHAR(50) UNIQUE NOT NULL,
        issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (course_id) REFERENCES courses(id)
      )
    `);

    // Check if admin exists
    const [adminExists] = await query('SELECT id FROM users WHERE role = ?', [
      'admin',
    ]);

    if (!adminExists) {
      await createDefaultAdmin();
      const [admin] = await query('SELECT id FROM users WHERE role = ?', [
        'admin',
      ]);
      await createSampleCourses(admin.id);
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

export default {
  query,
  pool,
  transaction,
};