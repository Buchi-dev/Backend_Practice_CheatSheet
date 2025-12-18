/**
 * VALIDATION MIDDLEWARE TESTS
 * ============================
 * Unit tests for request validation middleware
 * Tests aligned with actual smu.edu.ph validation rules
 */

const { validateUser, validateRegistration } = require('../../../middlewares/validation.middleware');

describe('Validation Middleware - Unit Tests', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();

    jest.clearAllMocks();
  });

  describe('validateUser - Valid Data', () => {
    test('should pass validation with all valid fields', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@smu.edu.ph',
        age: 25,
        gender: 'male',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    test('should accept minimum age (1)', () => {
      mockReq.body = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@smu.edu.ph',
        age: 1,
        gender: 'female',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test('should accept maximum age (500)', () => {
      mockReq.body = {
        firstName: 'Old',
        lastName: 'Person',
        email: 'old@smu.edu.ph',
        age: 500,
        gender: 'male',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test('should accept female gender (lowercase)', () => {
      mockReq.body = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@smu.edu.ph',
        age: 25,
        gender: 'female',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test('should accept "rather not say" gender', () => {
      mockReq.body = {
        firstName: 'Alex',
        lastName: 'Smith',
        email: 'alex@smu.edu.ph',
        age: 30,
        gender: 'rather not say',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test('should accept names with spaces', () => {
      mockReq.body = {
        firstName: 'Mary Jane',
        lastName: 'Watson Smith',
        email: 'mary@smu.edu.ph',
        age: 30,
        gender: 'female',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test('should accept valid smu.edu.ph email', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe123@smu.edu.ph',
        age: 25,
        gender: 'male',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test('should accept email with dots and hyphens', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe-123@smu.edu.ph',
        age: 25,
        gender: 'male',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test('should accept user with middleInitial', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        age: 25,
        gender: 'male',
        middleInitial: 'A',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('validateUser - Missing Required Fields', () => {
    test('should reject when firstName is missing', () => {
      mockReq.body = {
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        age: 25,
        gender: 'male',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Some Fields are Missing',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should reject when lastName is missing', () => {
      mockReq.body = {
        firstName: 'John',
        email: 'john@smu.edu.ph',
        age: 25,
        gender: 'male',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Some Fields are Missing',
      });
    });

    test('should reject when email is missing', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
        gender: 'male',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Some Fields are Missing',
      });
    });

    test('should reject when age is missing', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        gender: 'male',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Some Fields are Missing',
      });
    });

    test('should reject when gender is missing', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        age: 25,
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Some Fields are Missing',
      });
    });

    test('should reject when all fields are missing', () => {
      mockReq.body = {};

      validateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Some Fields are Missing',
      });
    });
  });

  describe('validateUser - Invalid Names', () => {
    test('should reject firstName with numbers', () => {
      mockReq.body = {
        firstName: 'John123',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        age: 25,
        gender: 'male',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Names must contain only letters and spaces',
      });
    });

    test('should reject firstName with special characters', () => {
      mockReq.body = {
        firstName: 'John@',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        age: 25,
        gender: 'male',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    test('should reject lastName with numbers', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe123',
        email: 'john@smu.edu.ph',
        age: 25,
        gender: 'male',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Names must contain only letters and spaces',
      });
    });

    test('should reject middleInitial with numbers', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        age: 25,
        gender: 'male',
        middleInitial: 'A1',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateUser - Invalid Email', () => {
    test('should reject invalid email format', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        age: 25,
        gender: 'male',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Only smu.edu.ph Emails Onlys',
      });
    });

    test('should reject email from gmail domain', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@gmail.com',
        age: 25,
        gender: 'male',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Only smu.edu.ph Emails Onlys',
      });
    });

    test('should reject email from yahoo domain', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@yahoo.com',
        age: 25,
        gender: 'male',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    test('should reject email without @', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johnsmu.edu.ph',
        age: 25,
        gender: 'male',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateUser - Invalid Age', () => {
    test('should reject age below 1', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        age: 0,
        gender: 'male',
      };

      validateUser(mockReq, mockRes, mockNext);

      // Note: age 0 is falsy, so !age check catches it first
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Some Fields are Missing',
      });
    });

    test('should reject age above 500', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        age: 501,
        gender: 'male',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Age Must Be Between 1 and 500',
      });
    });

    test('should reject negative age', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        age: -5,
        gender: 'male',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateUser - Invalid Gender', () => {
    test('should reject invalid gender', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        age: 25,
        gender: 'other',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Gender is Invalid',
      });
    });

    test('should reject uppercase gender (case-sensitive)', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        age: 25,
        gender: 'Male',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    test('should reject empty gender', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        age: 25,
        gender: '',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateRegistration - Valid Data', () => {
    test('should pass validation with all valid registration fields', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@smu.edu.ph',
        password: 'password123',
        age: 25,
        gender: 'male',
      };

      validateRegistration(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    test('should accept minimum password length (6 characters)', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        password: '123456',
        age: 25,
        gender: 'male',
      };

      validateRegistration(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test('should accept long passwords', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        password: 'verylongpassword1234567890',
        age: 25,
        gender: 'male',
      };

      validateRegistration(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    test('should accept password with special characters', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        password: 'Pass@123!',
        age: 25,
        gender: 'male',
      };

      validateRegistration(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('validateRegistration - Missing Password', () => {
    test('should reject when password is missing', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        age: 25,
        gender: 'male',
      };

      validateRegistration(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Some Fields are Missing',
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should reject empty password', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        password: '',
        age: 25,
        gender: 'male',
      };

      validateRegistration(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateRegistration - Invalid Password Length', () => {
    test('should reject password shorter than 6 characters', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        password: '12345',
        age: 25,
        gender: 'male',
      };

      validateRegistration(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    });

    test('should reject 1 character password', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        password: 'P',
        age: 25,
        gender: 'male',
      };

      validateRegistration(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('validateRegistration - Includes validateUser checks', () => {
    test('should also validate firstName', () => {
      mockReq.body = {
        firstName: 'John123',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        password: 'password123',
        age: 25,
        gender: 'male',
      };

      validateRegistration(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    test('should also validate email domain', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@gmail.com',
        password: 'password123',
        age: 25,
        gender: 'male',
      };

      validateRegistration(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    test('should also validate age range', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        password: 'password123',
        age: 0,
        gender: 'male',
      };

      validateRegistration(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe('Error Response Format', () => {
    test('should return proper error structure', () => {
      mockReq.body = {
        firstName: '',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        age: 25,
        gender: 'male',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.any(String),
        })
      );
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty strings as missing fields', () => {
      mockReq.body = {
        firstName: '',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        age: 25,
        gender: 'male',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    test('should accept typical student age', () => {
      mockReq.body = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@smu.edu.ph',
        age: 20,
        gender: 'male',
      };

      validateUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
