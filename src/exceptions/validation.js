import { HttpException } from "./root.js";

export class Validation extends HttpException {
    constructor(message, errorCode, errors) {
        super(message, errorCode,422, errors)
    }
}