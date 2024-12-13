
import { ErrorCodes, HttpException } from "./exceptions/root.js"
import { InternalException } from "./exceptions/internal-exception.js"

export const errorHandler = (method) => {
return async(req, res, next) => {
    try{
        await method(req, res, next)
    }
    catch(error) {
        let exception
        if( error instanceof HttpException ) {
            exception = error;
        } else {
            exception = new InternalException('Something went wrong', error, ErrorCodes.INTERNAL_EXCEPTION)
        }
        next(exception)
    }
}
}

// we use this error handler which allows us to not use mutltiple try catch blocks in auth.ts