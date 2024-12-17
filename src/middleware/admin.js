import { ErrorCodes } from "../exceptions/root.js"
import {UnauthorizedException} from '../exceptions/unauthorized.js'


const adminMiddleware = async (req, res, next) =>{

const user = req.user
console.log(req.user)
console.log(req.user.id, 'Inside admin middleware')
if (user.role == 'ADMIN') {
    next()
}
else {
    next(new UnauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED))
}
}

export default adminMiddleware