const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Course = require('./src/models/Course');
const Attendance = require('./src/models/Attendance');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cryptus')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('DB Connection error:', err));

const populateDB = async () => {
    try {
        await User.deleteMany();
        await Course.deleteMany();
        await Attendance.deleteMany();

        console.log('Database cleared');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // 1. Create Users
        const admin = await User.create({
            name: 'Cryptus Admin',
            email: 'admin@cryptus.in',
            password: hashedPassword,
            role: 'Admin'
        });

        const teacher1 = await User.create({
            name: 'Mr. Anderson',
            email: 'anderson@cryptus.in',
            password: hashedPassword,
            role: 'Teacher'
        });

        const teacher2 = await User.create({
            name: 'Ms. Smith',
            email: 'smith@cryptus.in',
            password: hashedPassword,
            role: 'Teacher'
        });

        const student1 = await User.create({
            name: 'Alice Johnson',
            email: 'alice@student.com',
            password: hashedPassword,
            role: 'Student'
        });

        const student2 = await User.create({
            name: 'Bob Williams',
            email: 'bob@student.com',
            password: hashedPassword,
            role: 'Student'
        });

        // 2. Create Courses
        const course1 = await Course.create({
            title: 'Cyber Security Basics',
            description: 'Introduction to info sec',
            teacherID: teacher1._id,
            enrolledStudents: [student1._id, student2._id]
        });

        const course2 = await Course.create({
            title: 'Network Defense',
            description: 'Advanced networking concepts',
            teacherID: teacher2._id,
            enrolledStudents: [student1._id]
        });

        // 3. Update Students with enrolled courses
        await User.findByIdAndUpdate(student1._id, {
            enrolledCourses: [course1._id, course2._id]
        });

        await User.findByIdAndUpdate(student2._id, {
            enrolledCourses: [course1._id]
        });

        // 4. Create dummy attendance
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        await Attendance.create({
            studentID: student1._id,
            courseID: course1._id,
            status: 'approved',
            date: yesterday
        });

        await Attendance.create({
            studentID: student2._id,
            courseID: course1._id,
            status: 'rejected',
            date: yesterday
        });

        console.log('Dummy Data populated!');
        process.exit();
    } catch (error) {
        console.error('Error populating DB:', error);
        process.exit(1);
    }
};

populateDB();
