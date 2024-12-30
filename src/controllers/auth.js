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

const isProduction = process.env.NODE_ENV === "production";

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
    
    let user = await prismaClient.user.findFirst({where: {email}})
  
    if (!user) {
        // Throw a specific error for "User not found"
        return res.status(404).json({ message: "User not found", code: "USER_NOT_FOUND" });
      }
  
      // Check if the password matches
      if (!compareSync(password, user.password)) {
        return res.status(401).json({ message: "Credentials not recognised.", code: "INCORRECT_PASSWORD" });
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