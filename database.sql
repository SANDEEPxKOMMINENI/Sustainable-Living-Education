CREATE DATABASE IF NOT EXISTS ecolearn;
USE ecolearn;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'admin') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  duration VARCHAR(50),
  instructor_id INT,
  exam_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (instructor_id) REFERENCES users(id)
);

CREATE TABLE course_enrollments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT,
  user_id INT,
  progress INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE exams (
  id INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT,
  title VARCHAR(255) NOT NULL,
  duration INT NOT NULL, -- in minutes
  passing_percentage INT DEFAULT 65,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

CREATE TABLE questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  exam_id INT,
  question_text TEXT NOT NULL,
  options JSON NOT NULL,
  correct_option INT NOT NULL,
  FOREIGN KEY (exam_id) REFERENCES exams(id)
);

CREATE TABLE exam_submissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  exam_id INT,
  user_id INT,
  score INT NOT NULL,
  passed BOOLEAN DEFAULT false,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES exams(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);