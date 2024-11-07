import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

async function setupDatabase() {
  let connection;
  try {
    // Create initial connection without database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'ecolearn'}`);
    
    // Use the database
    await connection.query(`USE ${process.env.DB_NAME || 'ecolearn'}`);

    // Create tables
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('student', 'admin') DEFAULT 'student',
        avatar VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS courses (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        duration VARCHAR(50),
        instructor_id INT,
        exam_enabled BOOLEAN DEFAULT false,
        video_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (instructor_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS lessons (
        id INT PRIMARY KEY AUTO_INCREMENT,
        course_id INT,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        video_url VARCHAR(255),
        duration VARCHAR(50),
        order_index INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id)
      );

      CREATE TABLE IF NOT EXISTS course_enrollments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        course_id INT,
        user_id INT,
        progress INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS completed_lessons (
        id INT PRIMARY KEY AUTO_INCREMENT,
        course_id INT,
        lesson_id INT,
        user_id INT,
        completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses(id),
        FOREIGN KEY (lesson_id) REFERENCES lessons(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS resources (
        id INT PRIMARY KEY AUTO_INCREMENT,
        lesson_id INT,
        title VARCHAR(255) NOT NULL,
        type ENUM('pdf', 'video', 'link') NOT NULL,
        url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (lesson_id) REFERENCES lessons(id)
      );
    `);

    // Insert default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await connection.query(`
      INSERT IGNORE INTO users (name, email, password, role)
      VALUES (
        'Admin User',
        'admin@ecolearn.com',
        ?,
        'admin'
      )
    `, [hashedPassword]);

    // Insert sample course
    await connection.query(`
      INSERT IGNORE INTO courses (title, description, image_url, duration, instructor_id, video_url)
      VALUES (
        'Introduction to Sustainable Living',
        'Learn the fundamentals of sustainable living and how to reduce your environmental impact.',
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09',
        '6 weeks',
        1,
        'https://www.youtube.com/embed/dQw4w9WgXcQ'
      )
    `);

    console.log('✅ Database setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

setupDatabase();