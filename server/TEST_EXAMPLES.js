/**
 * API TESTING EXAMPLES
 * ====================
 * Use these examples with Postman, Thunder Client, or any REST client
 */

// ============================================
// 1. REGISTER A NEW USER (ADMIN)
// ============================================
// POST http://localhost:5000/api/users/register
// Content-Type: application/json

const registerAdmin = {
  "firstName": "Admin",
  "lastName": "User",
  "middleInitial": "A",
  "email": "admin.user@smu.edu.ph",
  "age": 30,
  "gender": "male",
  "password": "admin123",
  "role": "admin"
};

// Expected Response:
// {
//   "success": true,
//   "message": "User registered successfully",
//   "data": {
//     "user": { ... },
//     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
//   }
// }

// ============================================
// 2. REGISTER A NEW USER (STAFF)
// ============================================
// POST http://localhost:5000/api/users/register

const registerStaff = {
  "firstName": "John",
  "lastName": "Doe",
  "middleInitial": "M",
  "email": "john.doe@smu.edu.ph",
  "age": 25,
  "gender": "male",
  "password": "password123",
};

// ============================================
// 3. LOGIN
// ============================================
// POST http://localhost:5000/api/users/login
// Content-Type: application/json

const loginData = {
  "email": "admin.user@smu.edu.ph",
  "password": "admin123"
};

// Save the token from response!

// ============================================
// 4. GET MY PROFILE (Any authenticated user)
// ============================================
// GET http://localhost:5000/api/users/profile
// Authorization: Bearer YOUR_TOKEN_HERE

// ============================================
// 5. GET ALL USERS (Admin only)
// ============================================
// GET http://localhost:5000/api/users
// Authorization: Bearer ADMIN_TOKEN_HERE

// ============================================
// 6. GET USER BY ID (Admin only)
// ============================================
// GET http://localhost:5000/api/users/:userId
// Authorization: Bearer ADMIN_TOKEN_HERE

// ============================================
// 7. UPDATE USER (Admin only)
// ============================================
// PUT http://localhost:5000/api/users/:userId
// Authorization: Bearer ADMIN_TOKEN_HERE
// Content-Type: application/json

const updateData = {
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@smu.edu.ph",
  "age": 26,
  "gender": "male"
};

// ============================================
// 8. DELETE USER (Admin only)
// ============================================
// DELETE http://localhost:5000/api/users/:userId
// Authorization: Bearer ADMIN_TOKEN_HERE

// ============================================
// TEST SCENARIOS
// ============================================

/**
 * Scenario 1: Staff tries to access admin route
 * - Register as staff
 * - Login to get staff token
 * - Try GET /api/users with staff token
 * - Expected: 403 Forbidden
 */

/**
 * Scenario 2: Access without token
 * - Try GET /api/users/profile without Authorization header
 * - Expected: 401 Unauthorized
 */

/**
 * Scenario 3: Invalid token
 * - Try any protected route with invalid/expired token
 * - Expected: 401 Unauthorized - "Invalid or expired token"
 */

/**
 * Scenario 4: Validation errors
 * - Try to register with invalid email (not @smu.edu.ph)
 * - Expected: 400 Bad Request with validation message
 */

// ============================================
// POSTMAN COLLECTION STRUCTURE
// ============================================

/**
 * Create folders:
 * 1. Auth
 *    - Register (Admin)
 *    - Register (Staff)
 *    - Login
 * 
 * 2. User Profile
 *    - Get My Profile
 * 
 * 3. Admin - User Management
 *    - Get All Users
 *    - Get User By ID
 *    - Create User
 *    - Update User
 *    - Delete User
 *    - Delete All Users
 * 
 * Environment Variables:
 * - baseUrl: http://localhost:5000
 * - adminToken: (set after admin login)
 * - staffToken: (set after staff login)
 * - userId: (set for testing specific user)
 */
