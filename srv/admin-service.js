const cds = require('@sap/cds');

module.exports = class AdminService extends cds.ApplicationService {

    async init() {

        // Handle login action
        this.on('login', async (req) => {
            const { username, password } = req.data;

            const { Admins } = this.entities;

            // Find admin with matching credentials
            const admin = await SELECT.one.from(Admins)
                .where({ username: username, password: password });

            if (admin) {
                return {
                    success: true,
                    message: 'Login successful',
                    adminName: admin.name
                };
            } else {
                return {
                    success: false,
                    message: 'Invalid username or password',
                    adminName: null
                };
            }
        });

        // Handle dashboard statistics
        this.on('getDashboardStats', async (req) => {
            const { Courses } = this.entities;

            const courses = await SELECT.from(Courses);

            // Fixed statistics as per requirements
            return {
                totalStudents: 2639,
                totalCourses: courses.length,
                totalRegistrations: 1567,
                pendingRegistrations: 156
            };
        });

        // Get students per course (fixed data: Bioinfo least, Data Eng second least)
        this.on('getStudentsPerCourse', async (req) => {
            // Distribution: Total 2,639
            // SECJH (Software Engineering) - highest: 749
            // SECVH (Graphic & Multimedia): 600
            // SECRH (Network & Cybersecurity): 550
            // SECPH (Data Engineering) - second least: 420
            // SECBH (Bioinformatics) - least: 320

            return [
                { courseName: 'Software Engineering', courseCode: 'SECJH', studentCount: 749 },
                { courseName: 'Network and Cybersecurity', courseCode: 'SECRH', studentCount: 550 },
                { courseName: 'Graphic and Computer Multimedia', courseCode: 'SECVH', studentCount: 600 },
                { courseName: 'Bioinformatics', courseCode: 'SECBH', studentCount: 320 },
                { courseName: 'Data Engineering', courseCode: 'SECPH', studentCount: 420 }
            ];
        });

        // Get students per year by faculty (last 5 years)
        this.on('getStudentsPerYear', async (req) => {
            const { Students } = this.entities;

            const students = await SELECT.from(Students);
            const years = [2022, 2023, 2024, 2025, 2026];

            const result = years.map(year => {
                const yearStudents = students.filter(s => s.enrollmentYear === year);

                return {
                    year: year,
                    facultyComputing: yearStudents.filter(s => s.faculty === 'Faculty of Computing').length,
                    facultyElectrical: yearStudents.filter(s => s.faculty === 'Faculty of Electrical Engineering').length,
                    facultyMechanical: yearStudents.filter(s => s.faculty === 'Faculty of Mechanical Engineering').length,
                    facultyCivil: yearStudents.filter(s => s.faculty === 'Faculty of Civil Engineering').length
                };
            });

            return result;
        });

        // Get registration status per course (registered vs not registered)
        // Total students: 2639, Registered: 1567, Not Registered: 1072
        this.on('getRegistrationStatus', async (req) => {
            return [
                { courseCode: 'SECJH', courseName: 'Software Engineering', registered: 445, notRegistered: 304 },
                { courseCode: 'SECRH', courseName: 'Network and Cybersecurity', registered: 328, notRegistered: 222 },
                { courseCode: 'SECVH', courseName: 'Graphic and Computer Multimedia', registered: 356, notRegistered: 244 },
                { courseCode: 'SECBH', courseName: 'Bioinformatics', registered: 185, notRegistered: 135 },
                { courseCode: 'SECPH', courseName: 'Data Engineering', registered: 253, notRegistered: 167 }
            ];
        });

        await super.init();
    }
};
