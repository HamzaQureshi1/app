import { ErrorCodes } from "../exceptions/root.js"
import  jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../secrets.js";
import { prismaClient } from '../index.js'
import {UnauthorizedException} from '../exceptions/unauthorized.js'

const { verify } = jwt;

const authMiddleware = async (req, res, next) =>{
// 1.extract the token from the header

const token = req.headers.authorization
console.log(token);
// 2. if token is not present, throw an error of unauthorized.
if (!token) {
    next(new UnauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED))
}

// 3. if the token is present, verify the token and extract the payload
try {
    const payload = jwt.verify(token, JWT_SECRET)
    console.log(payload.userId, 'PAYLOAD')

 //4. get user from payload
 const user = await prismaClient.user.findFirst({where: {id: payload.userId}})   

 if (!user) {
    next(new UnauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED))
 }
    
    req.user = user;
    console.log(req.user.id, 'LIN 30')
    next()
} catch (error) {
    next(new UnauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED))
}



}

export default authMiddleware