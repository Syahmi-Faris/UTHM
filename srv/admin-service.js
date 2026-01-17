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

        // Get Faculty of Computing enrollment trends
        // Shows realistic growth pattern - 2026 ends at 2639 (total students)
        this.on('getEnrollmentTrend', async (req) => {
            const yearsBack = req.data.yearsBack || 5;

            // Full 10-year data (2017-2026) with realistic fluctuations
            const fullData = [
                { year: 2017, studentCount: 2456 },
                { year: 2018, studentCount: 2312 },
                { year: 2019, studentCount: 2589 },
                { year: 2020, studentCount: 2234 },
                { year: 2021, studentCount: 2478 },
                { year: 2022, studentCount: 2356 },
                { year: 2023, studentCount: 2687 },
                { year: 2024, studentCount: 2512 },
                { year: 2025, studentCount: 2745 },
                { year: 2026, studentCount: 2639 }
            ];

            // Return based on yearsBack parameter
            if (yearsBack === 10) {
                return fullData;
            } else {
                // Default: last 5 years (2022-2026)
                return fullData.slice(-5);
            }
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

        // Get pending registrations (summary by course + detailed list)
        this.on('getPendingRegistrations', async (req) => {
            // Summary: 156 total pending registrations by course
            const summary = [
                { courseCode: 'SECJH', courseName: 'Software Engineering', pendingCount: 45 },
                { courseCode: 'SECRH', courseName: 'Network and Cybersecurity', pendingCount: 32 },
                { courseCode: 'SECVH', courseName: 'Graphic and Computer Multimedia', pendingCount: 38 },
                { courseCode: 'SECBH', courseName: 'Bioinformatics', pendingCount: 18 },
                { courseCode: 'SECPH', courseName: 'Data Engineering', pendingCount: 23 }
            ];

            // Sample pending registrations (showing 10)
            const registrations = [
                { studentId: 'A23CS0156', studentName: 'Muhammad Syahmi Faris bin Rusli', courseCode: 'SECJH', courseName: 'Software Engineering', submittedDate: '2026-01-15' },
                { studentId: 'A23CS0234', studentName: 'Muhammad Naim bin Abdullah', courseCode: 'SECRH', courseName: 'Network and Cybersecurity', submittedDate: '2026-01-15' },
                { studentId: 'A23CS0189', studentName: 'Muhammad Afiq Danish bin Mohd Hazni', courseCode: 'SECVH', courseName: 'Graphic and Computer Multimedia', submittedDate: '2026-01-14' },
                { studentId: 'A23CS0312', studentName: 'Welson Woong Lu Bin', courseCode: 'SECBH', courseName: 'Bioinformatics', submittedDate: '2026-01-14' },
                { studentId: 'A23CS0098', studentName: 'Ang Chun Wei', courseCode: 'SECPH', courseName: 'Data Engineering', submittedDate: '2026-01-14' },
                { studentId: 'A23CS0445', studentName: 'Muhammad Adam bin Razali', courseCode: 'SECJH', courseName: 'Software Engineering', submittedDate: '2026-01-13' },
                { studentId: 'A23CS0267', studentName: 'Nuraisyah binti Zikre', courseCode: 'SECRH', courseName: 'Network and Cybersecurity', submittedDate: '2026-01-13' },
                { studentId: 'A23CS0178', studentName: 'Hoe Zhi Wan', courseCode: 'SECVH', courseName: 'Graphic and Computer Multimedia', submittedDate: '2026-01-13' },
                { studentId: 'A23CS0523', studentName: 'Danish Hakim bin Aziz', courseCode: 'SECJH', courseName: 'Software Engineering', submittedDate: '2026-01-12' },
                { studentId: 'A23CS0334', studentName: 'Muhammad Amirun Irfan bin Samsul Shah', courseCode: 'SECPH', courseName: 'Data Engineering', submittedDate: '2026-01-12' }
            ];

            return { summary, registrations };
        });

        await super.init();
    }
};
