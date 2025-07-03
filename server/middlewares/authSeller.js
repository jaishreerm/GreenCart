import jwt from "jsonwebtoken";

const authSeller = async(req, res, next) => {
    const { sellerToken } = req.cookies;
    
    if(!sellerToken) {
        return res.json({ success: false, message: 'Not Authorized'});
    }
     try {
            // in the try block we will decode the token to extract the id
            const tokenDecode = jwt.verify(sellerToken, process.env.JWT_SECRET)
            if(tokenDecode.email == process.env.SELLER_EMAIL){
                next(); // if matches simply do next()     
                // req.body is only defined for POST/PUT/PATCH requests, so don't do for 🚫GET fn
            }else{
                return res.json({ success: false, message: 'Not Authorized'});
            }
            next();
    
        } catch (error) {
            res.json({ success: false, message: error.message});
        }
}

export default authSeller;