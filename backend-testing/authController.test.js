import { describe, it, expect, vi, beforeEach } from "vitest";
import { signup, login, me } from "../src/controllers/auth.js";
import { prismaClient } from "../src/index.js";
import { hashSync, compareSync } from "bcrypt";
import jwt from "jsonwebtoken";



// Mock external modules
vi.mock("../src/index.js", () => ({
  prismaClient: {
    user: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
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

      expect(jwt.sign).toHaveBeenCalledWith({ userId: 1 }, expect.any(String));
      expect(res.cookie).toHaveBeenCalledWith("token", "test-token", {
        httpOnly: true,
        secure: false, // Assuming non-production environment
        sameSite: "None",
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

      await expect(login(req, res, mockNext)).rejects.toThrow("User not found");
    });

    it("should throw an error if the password is incorrect", async () => {
      const req = mockRequest({
        email: "test@example.com",
        password: "wrong-password",
      });
      const res = mockResponse();

      prismaClient.user.findFirst.mockResolvedValue({
        id: 1,
        email: "test@example.com",
        password: "hashed-password",
      });
      compareSync.mockReturnValue(false); // Password mismatch

      await expect(login(req, res, mockNext)).rejects.toThrow(
        "Incorrect password"
      );
    });
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