/**
 * USER CONTROLLER TESTS
 * =====================
 * Unit tests for user controller functions
 */

const userController = require('../../../controllers/user.controller');
const User = require('../../../models/user.model');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../../models/user.model');
jest.mock('jsonwebtoken');

describe('User Controller - Unit Tests', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  // Setup: Runs before each test
  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      user: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();

    // Clear all mocks
    jest.clearAllMocks();
  });

  /**
   * ========================================
   * AUTHENTICATION TESTS
   * ========================================
   */

  describe('register()', () => {
    test('should register a new user successfully', async () => {
      // Arrange
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        middleInitial: 'A',
        email: 'john@example.com',
        age: 25,
        gender: 'male',
        password: 'password123',
        role: 'staff',
      };

      const mockUser = {
        _id: '123abc',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        age: 25,
        role: 'staff',
      };

      User.findOne = jest.fn().mockResolvedValue(null); // User doesn't exist
      User.create = jest.fn().mockResolvedValue(mockUser);
      jwt.sign = jest.fn().mockReturnValue('mockJWTToken');

      // Act
      await userController.register(mockReq, mockRes, mockNext);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
      expect(User.create).toHaveBeenCalledWith({
        firstName: 'John',
        lastName: 'Doe',
        middleInitial: 'A',
        email: 'john@example.com',
        age: 25,
        gender: 'male',
        password: 'password123',
        role: 'staff',
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: '123abc', email: 'john@example.com', role: 'staff' },
        process.env.JWT_SECRET,
        { expiresIn: '2d' }
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: '123abc',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            role: 'staff',
            age: 25,
          },
          token: 'mockJWTToken',
        },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return 400 if user already exists', async () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'existing@example.com',
        password: 'password123',
      };

      User.findOne = jest.fn().mockResolvedValue({
        email: 'existing@example.com',
      });

      await userController.register(mockReq, mockRes, mockNext);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'existing@example.com' });
      expect(User.create).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'User with this email already exists',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should default role to "staff" if not provided', async () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        age: 25,
        gender: 'male',
        password: 'password123',
        // role is not provided
      };

      const mockUser = {
        _id: '123abc',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        age: 25,
        role: 'staff',
      };

      User.findOne = jest.fn().mockResolvedValue(null);
      User.create = jest.fn().mockResolvedValue(mockUser);
      jwt.sign = jest.fn().mockReturnValue('mockJWTToken');

      await userController.register(mockReq, mockRes, mockNext);

      expect(User.create).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'staff',
        })
      );
    });

    test('should handle database errors gracefully', async () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const dbError = new Error('Database connection failed');
      User.findOne = jest.fn().mockRejectedValue(dbError);

      await userController.register(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(dbError);
    });
  });

  describe('login()', () => {
    test('should login user successfully with valid credentials', async () => {
      mockReq.body = {
        email: 'john@example.com',
        password: 'password123',
      };

      const mockUser = {
        _id: '123abc',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'staff',
        comparePassword: jest.fn().mockResolvedValue(true),
      };

      User.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });
      jwt.sign = jest.fn().mockReturnValue('mockJWTToken');

      await userController.login(mockReq, mockRes, mockNext);

      expect(User.findOne).toHaveBeenCalledWith({ email: 'john@example.com' });
      expect(mockUser.comparePassword).toHaveBeenCalledWith('password123');
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: '123abc', email: 'john@example.com', role: 'staff' },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: '123abc',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            role: 'staff',
          },
          token: 'mockJWTToken',
        },
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return 400 if email is missing', async () => {
      mockReq.body = {
        password: 'password123',
      };

      await userController.login(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email and password are required',
      });
      expect(User.findOne).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return 400 if password is missing', async () => {
      mockReq.body = {
        email: 'john@example.com',
      };

      await userController.login(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email and password are required',
      });
      expect(User.findOne).not.toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return 401 if user not found', async () => {
      mockReq.body = {
        email: 'notfound@example.com',
        password: 'password123',
      };

      User.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await userController.login(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email or password',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return 401 if password is incorrect', async () => {
      mockReq.body = {
        email: 'john@example.com',
        password: 'wrongpassword',
      };

      const mockUser = {
        email: 'john@example.com',
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      User.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await userController.login(mockReq, mockRes, mockNext);

      expect(mockUser.comparePassword).toHaveBeenCalledWith('wrongpassword');
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid email or password',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle errors and call next()', async () => {
      mockReq.body = {
        email: 'john@example.com',
        password: 'password123',
      };

      const error = new Error('Database error');
      User.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockRejectedValue(error),
      });

      await userController.login(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe('getProfile()', () => {
    test('should return user profile successfully', async () => {
      mockReq.user = { id: '123abc' };

      const mockUser = {
        _id: '123abc',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'staff',
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      await userController.getProfile(mockReq, mockRes, mockNext);

      expect(User.findById).toHaveBeenCalledWith('123abc');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return 404 if user not found', async () => {
      mockReq.user = { id: 'nonexistent' };

      User.findById = jest.fn().mockResolvedValue(null);

      await userController.getProfile(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle errors', async () => {
      mockReq.user = { id: '123abc' };

      const error = new Error('Database error');
      User.findById = jest.fn().mockRejectedValue(error);

      await userController.getProfile(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  /**
   * ========================================
   * CRUD OPERATION TESTS
   * ========================================
   */

  describe('getAllUsers()', () => {
    test('should return all users successfully', async () => {
      const mockUsers = [
        { _id: '1', firstName: 'John', email: 'john@example.com' },
        { _id: '2', firstName: 'Jane', email: 'jane@example.com' },
      ];

      User.find = jest.fn().mockResolvedValue(mockUsers);

      await userController.getAllUsers(mockReq, mockRes, mockNext);

      expect(User.find).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        count: 2,
        data: mockUsers,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return 404 if no users found', async () => {
      User.find = jest.fn().mockResolvedValue(null);

      await userController.getAllUsers(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Users Not Found',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle errors', async () => {
      const error = new Error('Database error');
      User.find = jest.fn().mockRejectedValue(error);

      await userController.getAllUsers(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('createUser()', () => {
    test('should create a new user successfully', async () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const mockUser = {
        _id: '123abc',
        ...mockReq.body,
      };

      User.create = jest.fn().mockResolvedValue(mockUser);

      await userController.createUser(mockReq, mockRes, mockNext);

      expect(User.create).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle errors', async () => {
      mockReq.body = { firstName: 'John' };

      const error = new Error('Validation error');
      User.create = jest.fn().mockRejectedValue(error);

      await userController.createUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getUserById()', () => {
    test('should return user by ID successfully', async () => {
      mockReq.params.id = '123abc';

      const mockUser = {
        _id: '123abc',
        firstName: 'John',
        email: 'john@example.com',
      };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      await userController.getUserById(mockReq, mockRes, mockNext);

      expect(User.findById).toHaveBeenCalledWith('123abc');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockUser,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return 404 if user not found', async () => {
      mockReq.params.id = 'nonexistent';

      User.findById = jest.fn().mockResolvedValue(null);

      await userController.getUserById(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'User Not Found',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle errors', async () => {
      mockReq.params.id = '123abc';

      const error = new Error('Database error');
      User.findById = jest.fn().mockRejectedValue(error);

      await userController.getUserById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateUser()', () => {
    test('should update user successfully', async () => {
      mockReq.params.id = '123abc';
      mockReq.user = { id: 'different-id' }; // Different from the user being updated
      mockReq.body = {
        firstName: 'Jane',
        lastName: 'Smith',
      };

      const mockUpdatedUser = {
        _id: '123abc',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
      };

      User.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedUser);

      await userController.updateUser(mockReq, mockRes, mockNext);

      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(
        '123abc',
        mockReq.body,
        { new: true, runValidators: true }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockUpdatedUser,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return 403 if user tries to change their own role', async () => {
      mockReq.params.id = '123abc';
      mockReq.user = { id: '123abc' }; // Same as the user being updated
      mockReq.body = {
        role: 'admin',
      };

      await userController.updateUser(mockReq, mockRes, mockNext);

      expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'You cannot change your own role',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return 404 if user not found', async () => {
      mockReq.params.id = 'nonexistent';
      mockReq.user = { id: 'different-id' };
      mockReq.body = { firstName: 'Jane' };

      User.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await userController.updateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'User Not Found',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle errors', async () => {
      mockReq.params.id = '123abc';
      mockReq.user = { id: 'different-id' };
      mockReq.body = { firstName: 'Jane' };

      const error = new Error('Database error');
      User.findByIdAndUpdate = jest.fn().mockRejectedValue(error);

      await userController.updateUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteUser()', () => {
    test('should delete user successfully', async () => {
      mockReq.params.id = '123abc';
      mockReq.user = { id: 'different-id' }; // Different from the user being deleted

      const mockUser = {
        _id: '123abc',
        firstName: 'John',
      };

      User.findByIdAndDelete = jest.fn().mockResolvedValue(mockUser);

      await userController.deleteUser(mockReq, mockRes, mockNext);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith('123abc');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'User deleted',
        data: mockUser,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return 403 if user tries to delete their own profile', async () => {
      mockReq.params.id = '123abc';
      mockReq.user = { id: '123abc' }; // Same as the user being deleted

      await userController.deleteUser(mockReq, mockRes, mockNext);

      expect(User.findByIdAndDelete).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'You cannot delete your own profile',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should return 404 if user not found', async () => {
      mockReq.params.id = 'nonexistent';
      mockReq.user = { id: 'different-id' };

      User.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await userController.deleteUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle errors', async () => {
      mockReq.params.id = '123abc';
      mockReq.user = { id: 'different-id' };

      const error = new Error('Database error');
      User.findByIdAndDelete = jest.fn().mockRejectedValue(error);

      await userController.deleteUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteAllUsers()', () => {
    test('should delete all users successfully', async () => {
      const mockResult = { deletedCount: 5 };

      User.deleteMany = jest.fn().mockResolvedValue(mockResult);

      await userController.deleteAllUsers(mockReq, mockRes, mockNext);

      expect(User.deleteMany).toHaveBeenCalledWith({});
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: '5 users deleted',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle case when no users to delete', async () => {
      const mockResult = { deletedCount: 0 };

      User.deleteMany = jest.fn().mockResolvedValue(mockResult);

      await userController.deleteAllUsers(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: '0 users deleted',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should handle errors', async () => {
      const error = new Error('Database error');
      User.deleteMany = jest.fn().mockRejectedValue(error);

      await userController.deleteAllUsers(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});