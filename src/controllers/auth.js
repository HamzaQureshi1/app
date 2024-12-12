import { hashSync, compareSync } from "bcrypt";
import { prismaClient } from '../index.js'
import  jwt from 'jsonwebtoken'
const { sign, verify } = jwt;
import { JWT_SECRET } from "../secrets.js";

export const signup = async (req, res) =>{
const {email, password, name} = req.body;

let user = await prismaClient.user.findFirst({where: {email}})

if (user) {
    throw Error('User already exists!')
}

user = await prismaClient.user.create({
    data:{
        fullName: name,
        email,
        password: hashSync(password, 10)
    }
})

res.json(user)
}

export const login = async (req, res) =>{
    const {email, password, name} = req.body;
    
    let user = await prismaClient.user.findFirst({where: {email}})
    
    if (!user) {
        throw Error('User does not exist!')
    }
    
    if(!compareSync(password, user.password)) {
        throw Error('Incorrect password')
    }

    const token = jwt.sign({
        userId: user.id
    },JWT_SECRET)

    
   
    
    res.json({user, token})
    }