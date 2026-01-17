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
}
