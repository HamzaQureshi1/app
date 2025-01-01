import { hashSync, compareSync } from "bcrypt";
import { prismaClient } from '../index.js'
import  jwt from 'jsonwebtoken'
const { sign, verify } = jwt;
import { JWT_SECRET, REDIS_URL } from "../secrets.js";
import { BadRequestsException } from "../exceptions/bad-request.js";
import { Validation } from "../exceptions/validation.js";
import { NotFoundException } from "../exceptions/not-found.js";
import { ErrorCodes } from "../exceptions/root.js";
import { SignUpSchema } from '../schema/users.js';
import { logger } from "../index.js";
import {createClient} from "redis";


const isProduction = process.env.NODE_ENV === "production";
// In-memory maps for tracking failed attempts and blocked IPs
const failedAttempts = new Map();
const blockedIps = new Map();
const BLOCK_DURATION = 5 * 60 * 1000; // Block for 5 minutes
const MAX_FAILED_ATTEMPTS = 10;


const redisClient = createClient({
  url: REDIS_URL, // Render provides REDIS_URL in the environment variables
});
redisClient.connect();

const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  return forwarded ? forwarded.split(",")[0] : req.ip;
};

export const signup = async (req, res, next) =>{

    try {
     SignUpSchema.parse(req.body)}catch (error) {
         
        throw new Validation(error?.issues, 'Unprocessable entity', ErrorCodes.UNPROCESSABLE_ENTITY)
        }
   
    const {email, password, name} = req.body;

    let user = await prismaClient.user.findFirst({where: {email}})

if (user) {
  
    throw ( new BadRequestsException('User already exists', ErrorCodes.USER_ALREADY_EXISTS))
}

user = await prismaClient.user.create({
    data:{
        fullName: name,
        email,
        password: hashSync(password, 10)
    }
})

res.json(user)}


export const login = async (req, res, next) => {
  try {
      const { email, password } = req.body;
      const ip = getClientIp(req);

      // Check if the IP is blocked
      if (await isIpBlocked(ip)) {
          return res.status(403).json({
              message: "Too many failed attempts. Try again later.",
          });
      }

      let user = await prismaClient.user.findFirst({ where: { email } });

      if (!user) {
          await incrementFailedAttempts(ip);
          logger.info(`Failed login attempt from IP ${ip}: user not found`);
          return res.status(404).json({ message: "User not found" });
      }

      if (!compareSync(password, user.password)) {
          await incrementFailedAttempts(ip);
          logger.info(`Failed login attempt from IP ${ip}: incorrect password`);
          return res.status(401).json({ message: "Invalid credentials" });
      }

      // Reset failed attempts on successful login
      await redisClient.del(`fail:${ip}`);

      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

      res.cookie("token", token, {
          httpOnly: true,
          secure: isProduction,
          sameSite: "None",
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      });

      res.json({ user, token });
  } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};



    export const me = async (req, res, next) =>{
  
        
        res.json(req.user)
        } 

    export const logout = async (req, res, next) => {
        
        res.cookie("token", "", {

            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
            expires: new Date(0),
          });
          res.status(200).json({ message: "Logged out successfully" })
  
        }

    const incrementFailedAttempts = async (ip) => {
      const attempts = await redisClient.get(`fail:${ip}`);
      const updatedAttempts = (parseInt(attempts) || 0) + 1;
  
      if (updatedAttempts >= MAX_FAILED_ATTEMPTS) {
          // Block IP for 5 minutes
          await redisClient.set(`block:${ip}`, "1", "EX", BLOCK_DURATION);
          await redisClient.del(`fail:${ip}`); // Clear failed attempts
          logger.warn(`IP ${ip} blocked due to too many failed login attempts.`);
      } else {
          // Increment failed attempts with a TTL
          await redisClient.set(`fail:${ip}`, updatedAttempts, "EX", BLOCK_DURATION);
      }
  };

  const isIpBlocked = async (ip) => {
    const isBlocked = await redisClient.get(`block:${ip}`);
    return !!isBlocked;
};