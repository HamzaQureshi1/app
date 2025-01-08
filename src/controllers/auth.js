import { hashSync, compareSync } from "bcrypt";
import { prismaClient } from '../index.js'
import  jwt from 'jsonwebtoken'
const { sign, verify } = jwt;
import { JWT_SECRET } from "../secrets.js";
import { BadRequestsException } from "../exceptions/bad-request.js";
import { Validation } from "../exceptions/validation.js";
import { NotFoundException } from "../exceptions/not-found.js";
import { ErrorCodes } from "../exceptions/root.js";
import { SignUpSchema } from '../schema/users.js';
import { logger } from "../index.js";

const isProduction = process.env.NODE_ENV === "production";
// In-memory maps for tracking failed attempts and blocked IPs
const failedAttempts = new Map();
const blockedIps = new Map();
const BLOCK_DURATION = 1 * 60 * 1000 // Block for 5 minutes
const MAX_FAILED_ATTEMPTS = 2;

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


export const login = async (req, res, next) =>{
    try{
    const {email, password, name} = req.body;

    const currentTime = Date.now();
    if (blockedIps.has(req.ip) && currentTime < blockedIps.get(req.ip)) {
        return res.status(403).json({
            message: "Too many failed attempts. Try again later.",
        });
    }
    
    let user = await prismaClient.user.findFirst({where: {email}})
  if (!user) {
        // Log failed attempt
        try {
          await incrementFailedAttempts(req.ip);
        } catch (error) {
          console.error("Error incrementing failed attempts:", err);
        }
     
        logger.info({
          message: "Failed login attempt: user not found",
          email: req.body.email,
          ip: req.ip,
          timestamp: new Date().toISOString(),
        });
  
        return res.status(404).json({
          message: "Credentials not recognised",
          code: "INCORRECT_PASSWORD",
        });
      }
     
       if (!compareSync(password, user.password)) {
        try {
          await incrementFailedAttempts(req.ip);
        } catch (error) {
          console.error("Error incrementing failed attempts:", err);
        }    
            logger.info({
              message: "Failed login attempt: incorrect password",
              email: req.body.email,
              ip: req.ip,
              timestamp: new Date().toISOString(),
            });
      
            return res.status(401).json({
              message: "Credentials not recognised",
              code: "INCORRECT_PASSWORD",
            });
          }

          try {
            failedAttempts.delete(req.ip);
          } catch (error) {
            console.error("Error resetting failed attempts:", err);
          }
         

    const token = jwt.sign({
        id: user.id
    },JWT_SECRET)

       
    const maxAge = 1000 * 60 * 60 * 24 * 7; // 7 days

  res.cookie("token", token, {

    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    expires: new Date(Date.now() + maxAge),
  });

      res.json({user, token})
     
    } catch (error) {
        console.error("Error during login:", error);
    
        // Handle unexpected errors
        return res.status(500).json({
          message: "An unexpected error occurred",
          code: "INTERNAL_SERVER_ERROR",
        });
      }}

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

    export const incrementFailedAttempts = (ip) => {
      const attempts = failedAttempts.get(ip) || 0;
      const updatedAttempts = attempts + 1;
      logger.info({
        message: "Failed login attempt: incorrect password",
        timestamp: new Date().toISOString(),
      });
      failedAttempts.set(ip, updatedAttempts);
    
      if (updatedAttempts >= MAX_FAILED_ATTEMPTS) {
        blockedIps.set(ip, Date.now() + BLOCK_DURATION);
        failedAttempts.delete(ip); // Reset failed attempts after blocking
        logger.warn({
          message: `IP ${ip} blocked due to too many failed attempts`,
          ip,
          timestamp: new Date().toISOString(),
        });
      }
    };    