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

        await super.init();
    }
};
