// middleware is the function that gets executed before executing the controller fn of any route, example before the register or login or isAuth or Logout function
import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => { // next will going to execute the controller function 
    const {token} = req.cookies;

    if(!token){ // if token is not available
        return res.json({ success: false, message: 'Not Authorized'});
    }
    

    // suppose the token is avilable, then we will add the try catch statement
    try {
        // in the try block we will decode the token to extract the id
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        if(tokenDecode.id){
            req.userId = tokenDecode.id; // don't do req.body.userId, req.body is only defined for POST/PUT/PATCH requests, so don't do for 🚫GET fn
        }else{
            return res.json({ success: false, message: 'Not Authorized'});
        }
        next();

    } catch (error) {
        res.json({ success: false, message: error.message});
    }
}

export default authUser;