class Apperror extends Error {
    public statusCode: number;
    
    constructor(statusCode: number, message: string, stack = '') {
        super(message) 
        this.statusCode = statusCode
        console.log('hitting');
        
        if (stack) {
            this.stack = stack
            console.log('hitting');
        } else {
            Error.captureStackTrace(this, this.constructor)
            console.log('hitting');
        }
    }
}

export default Apperror