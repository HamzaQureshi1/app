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
    const {email, password, name} = req.body;
    
    let user = await prismaClient.user.findFirst({where: {email}})
  
    if (!user) {

        throw (new NotFoundException('User not found', ErrorCodes.USER_NOT_FOUND));
    }

    
    if(!compareSync(password, user.password)) {
        throw new Error('Incorrect password')
    }

    const token = jwt.sign({
        userId: user.id
    },JWT_SECRET)

    const isProduction = process.env.NODE_ENV === "production";
    const maxAge = 1000 * 60 * 60 * 24 * 7; // 7 days

  res.cookie("token", token, {

    httpOnly: true,
    secure: isProduction,
    sameSite: "None",
    path: "/",
    expires: new Date(Date.now() + maxAge),
  });

  
    
      res.json({user, token})
     
    }

    export const me = async (req, res, next) =>{
        
        
        res.json(req.user)
        }
