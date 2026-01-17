using { uthm.scr as db } from '../db/schema';

service AdminService @(path: '/api/admin') {
    
    // Expose entities for dashboard
    entity Students as projection on db.Students;
    entity Courses as projection on db.Courses;
    entity Registrations as projection on db.Registrations;
    entity Admins as projection on db.Admins;
    
    // Login action
    action login(username: String, password: String) returns {
        success: Boolean;
        message: String;
        adminName: String;
    };
    
    // Dashboard statistics function
    function getDashboardStats() returns {
        totalStudents: Integer;
        totalCourses: Integer;
        totalRegistrations: Integer;
        pendingRegistrations: Integer;
    };
    
    // Chart data: Students per course
    function getStudentsPerCourse() returns array of {
        courseName: String;
        courseCode: String;
        studentCount: Integer;
    };
    
    // Chart data: Students per year by faculty
    function getStudentsPerYear() returns array of {
        year: Integer;
        facultyComputing: Integer;
        facultyElectrical: Integer;
        facultyMechanical: Integer;
        facultyCivil: Integer;
    };
    
    // Chart data: Registration status per course
    function getRegistrationStatus() returns array of {
        courseCode: String;
        courseName: String;
        registered: Integer;
        notRegistered: Integer;
    };
}
