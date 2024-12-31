import { hashSync, compareSync } from "bcrypt";
import { prismaClient } from "../index.js";
import jwt from "jsonwebtoken";
const { sign } = jwt;
import { JWT_SECRET } from "../secrets.js";
import { BadRequestsException } from "../exceptions/bad-request.js";
import { Validation } from "../exceptions/validation.js";
import { NotFoundException } from "../exceptions/not-found.js";
import { ErrorCodes } from "../exceptions/root.js";
import { SignUpSchema } from "../schema/users.js";
import { logger } from "../index.js";

const isProduction = process.env.NODE_ENV === "production";

// In-memory maps for tracking failed attempts and blocked IPs
const failedAttempts = new Map();
const blockedIps = new Map();
const BLOCK_DURATION = 5 * 60 * 1000; // Block for 5 minutes
const MAX_FAILED_ATTEMPTS = 10;


// Login function with IP blocking
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const currentTime = Date.now();

    // Check if the IP is blocked
    if (blockedIps.has(req.ip) && currentTime < blockedIps.get(req.ip)) {
      return res.status(403).json({
        message: "Too many failed attempts. Try again later.",
      });
    }

    let user = await prismaClient.user.findFirst({ where: { email } });

    if (!user) {
      // Log failed attempt
      incrementFailedAttempts(req.ip);
      logger.info({
        message: "Failed login attempt: user not found",
        email: req.body.email,
        ip: req.ip,
        timestamp: new Date().toISOString(),
      });

      return res.status(404).json({
        message: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    // Check if the password matches
    if (!compareSync(password, user.password)) {
      incrementFailedAttempts(req.ip);
      logger.info({
        message: "Failed login attempt: incorrect password",
        email: req.body.email,
        ip: req.ip,
        timestamp: new Date().toISOString(),
      });

      return res.status(401).json({
        message: "Credentials not recognised.",
        code: "INCORRECT_PASSWORD",
      });
    }

    // Reset failed attempts on successful login
    failedAttempts.delete(req.ip);

    const token = jwt.sign(
      {
        id: user.id,
      },
      JWT_SECRET
    );

    const maxAge = 1000 * 60 * 60 * 24 * 7; // 7 days

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      expires: new Date(Date.now() + maxAge),
    });

    res.json({ user, token });
  } catch (error) {
    console.error("Error during login:", error);

    // Handle unexpected errors
    return res.status(500).json({
      message: "An unexpected error occurred",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
};

// Middleware to increment failed attempts and block IP if threshold is exceeded
const incrementFailedAttempts = (ip) => {
  const attempts = failedAttempts.get(ip) || 0;
  const updatedAttempts = attempts + 1;

  failedAttempts.set(ip, updatedAttempts);

  if (updatedAttempts >= MAX_FAILED_ATTEMPTS) {
    // Block the IP for 5 minutes
    blockedIps.set(ip, Date.now() + BLOCK_DURATION);
    failedAttempts.delete(ip); // Reset failed attempts after blocking
    logger.warn({
      message: `IP blocked due to too many failed attempts`,
      ip,
      timestamp: new Date().toISOString(),
    });
  }
};
