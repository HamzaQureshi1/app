import { describe, it, expect, vi, beforeEach } from "vitest";
import { signup, login, me, incrementFailedAttempts } from "../src/controllers/auth.js";
import { prismaClient, logger } from "../src/index.js";
import { hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";

vi.mock("../src/controllers/auth.js", async (importOriginal) => {
  const actual = await importOriginal(); // Import the original module
  return {
    ...actual, // Spread the original exports
    incrementFailedAttempts: vi.fn(), // Mock incrementFailedAttempts
  };
});

// Mock external modules
vi.mock("../src/index.js", () => ({
  prismaClient: {
    user: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
  logger: {
    info: vi.fn(), // Mock the `info` method
  },
}));

vi.mock("jsonwebtoken", async (importOriginal) => {
  const actual = await importOriginal(); // Import the actual module
  return {default: {
    ...actual, // Keep original functionality
    sign: vi.fn(), // Mock the "sign" method
    verify: vi.fn(), // Mock the "verify" method
  }}
});


vi.mock("bcrypt", () => ({
  hashSync: vi.fn(),
  compareSync: vi.fn(),
}));

vi.mock("../secrets.js", () => ({
  JWT_SECRET: "test-secret",
}));

// Mock Express.js request and response objects
const mockRequest = (body = {}, user = null) => ({
  body,
  user,
});

const mockResponse = () => {
  const res = {};
  res.json = vi.fn().mockReturnValue(res);
  res.cookie = vi.fn().mockReturnValue(res);
  res.status = vi.fn().mockReturnValue(res);
  return res;
};

const mockNext = vi.fn();

describe("Auth Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("signup", () => {
    it("should create a new user if email does not exist", async () => {
      const req = mockRequest({
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      });
      const res = mockResponse();

      prismaClient.user.findFirst.mockResolvedValue(null); // No user found
      prismaClient.user.create.mockResolvedValue({
        id: 1,
        fullName: "Test User",
        email: "test@example.com",
      });

      hashSync.mockReturnValue("hashed-password");

      await signup(req, res, mockNext);

      expect(prismaClient.user.findFirst).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(prismaClient.user.create).toHaveBeenCalledWith({
        data: {
          fullName: "Test User",
          email: "test@example.com",
          password: "hashed-password",
        },
      });
      expect(res.json).toHaveBeenCalledWith({
        id: 1,
        fullName: "Test User",
        email: "test@example.com",
      });
    });

    it("should throw an error if the user already exists", async () => {
      const req = mockRequest({
        email: "test@example.com",
        password: "password123",
        name: "Test User",
      });
      const res = mockResponse();

      prismaClient.user.findFirst.mockResolvedValue({
        id: 1,
        email: "test@example.com",
      });

      await expect(signup(req, res, mockNext)).rejects.toThrow(
        "User already exists"
      );
    });
  });

  describe("login", () => {
    it("should log in an existing user with valid credentials", async () => {
      const req = mockRequest({
        email: "test@example.com",
        password: "password123",
      });
      const res = mockResponse();
      jwt.sign.mockReturnValue("mocked-jwt-token"); 

      prismaClient.user.findFirst.mockResolvedValue({
        id: 1,
        email: "test@example.com",
        password: "hashed-password",
      });
      compareSync.mockReturnValue(true); // Password matches
      jwt.sign.mockReturnValue("test-token");

      await login(req, res, mockNext);

      expect(prismaClient.user.findFirst).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
      });
      expect(compareSync).toHaveBeenCalledWith(
        "password123",
        "hashed-password"
      );

      expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, expect.any(String));
      expect(res.cookie).toHaveBeenCalledWith("token", "test-token", {
        httpOnly: true,
        secure: false, // Assuming non-production environment
        sameSite: "Lax",
        expires: expect.any(Date),
      });

      expect(res.json).toHaveBeenCalledWith({
        user: { id: 1, email: "test@example.com", password: "hashed-password" },
        token: "test-token",
      });
    });

    it("should throw an error if the user does not exist", async () => {
      const req = mockRequest({
        email: "test@example.com",
        password: "password123",
      });
      const res = mockResponse();

      prismaClient.user.findFirst.mockResolvedValue(null); // No user found

      await login(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    message: "User not found",
    code: "USER_NOT_FOUND",
  });
});



    

// it("should return a 401 response if the password is incorrect", async () => {
//   const req = mockRequest({
//     body: {
//       email: "test@example.com",
//       password: "wrong-password",
//     },
//     ip: "127.0.0.1", 
//   });
//   const res = mockResponse();

//   // Mock Prisma's findFirst method to return a user object
//   prismaClient.user.findFirst.mockResolvedValue({
//     id: 1,
//     email: "test@example.com",
//     password: "hashed-password",
//   });

//   // Mock compareSync to return false (password mismatch)
//   compareSync.mockReturnValue(false);

//   await login(req, res, mockNext);

  
//   // Assert that the response status is 401 and the correct JSON error is sent
//   expect(res.status).toHaveBeenCalledWith(401);
//   expect(res.json).toHaveBeenCalledWith({
//     message: "Credentials not recognised.",
//     code: "INCORRECT_PASSWORD",
//   });
// });


// it.only("should return a 401 response if the password is incorrect", async () => {
//   const req = mockRequest({
//     body: {
//       email: "test@example.com",
//       password: "wrong-password",
//     },
//     ip: "127.0.0.1", 
//   });
//   const res = mockResponse();

//   // Mock Prisma's findFirst method to return a user object
//   prismaClient.user.findFirst.mockResolvedValue({
//     id: 1,
//     email: "test@example.com",
//     password: "hashed-password",
//   });

//   // Mock incrementFailedAttempts to ensure it's called
//   incrementFailedAttempts.mockResolvedValue();

//   await login(req, res, mockNext);

//   // Verify incrementFailedAttempts is called with the correct IP
//   expect(incrementFailedAttempts).toHaveBeenCalledWith("127.0.0.1");

//   // Verify logger.info is called with correct details
//   expect(logger.info).toHaveBeenCalledWith({
//     message: "Failed login attempt: incorrect password",
//     email: "test@example.com",
//     ip: "127.0.0.1",
//     timestamp: expect.any(String),
//   });

//   // Assert that the response status is 401 and the correct JSON error is sent
//   expect(res.status).toHaveBeenCalledWith(401);
//   expect(res.json).toHaveBeenCalledWith({
//     message: "Credentials not recognised.",
//     code: "INCORRECT_PASSWORD",
//   });
// });

  });

  describe("me", () => {
    it("should return the authenticated user's data", async () => {
      const req = mockRequest({}, { id: 1, email: "test@example.com" });
      const res = mockResponse();

      await me(req, res, mockNext);

      expect(res.json).toHaveBeenCalledWith({ id: 1, email: "test@example.com" });
    });
  });
});