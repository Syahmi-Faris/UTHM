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
            const { Students, Courses, Registrations } = this.entities;

            // Get counts
            const students = await SELECT.from(Students);
            const courses = await SELECT.from(Courses);
            const registrations = await SELECT.from(Registrations);
            const pendingRegs = await SELECT.from(Registrations).where({ status: 'Pending' });

            return {
                totalStudents: students.length,
                totalCourses: courses.length,
                totalRegistrations: registrations.length,
                pendingRegistrations: pendingRegs.length
            };
        });

        // Get students per course
        this.on('getStudentsPerCourse', async (req) => {
            const { Courses, Registrations } = this.entities;

            const courses = await SELECT.from(Courses);
            const registrations = await SELECT.from(Registrations);

            const result = courses.map(course => {
                const count = registrations.filter(r => r.course_ID === course.ID).length;
                return {
                    courseName: course.name,
                    courseCode: course.code,
                    studentCount: count
                };
            });

            return result;
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

        await super.init();
    }
};
