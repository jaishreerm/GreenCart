import jwt from "jsonwebtoken";

// Function for Seller Login
// Login Seller : /api/seller/login

export const sellerLogin = async (req, res) =>{
    try {
        const { email, password } = req.body;
    
        if(password === process.env.SELLER_PASSWORD && email == process.env.SELLER_EMAIL){
            // if both email and password are matching then we will generate a token for the Login
            const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: '7d'});
    
            res.cookie('sellerToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', 
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
                maxAge: 7*24*60*1000, 
            });
    
            return res.json({success: true, message: 'Logged In'});
        }
        // suppose this email and password is not matching, then we will add the else statement
        else{
            return res.json({success: false, message: 'Invalid Credentials'});
    
        }
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// Seller Auth : /api/seller/is-auth
export const isSellerAuth = async(req, res)=>{
    try {
        return res.json({success: true}) // now if everything is fine with isAuth, print this as response
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}


// Logout Seller: /api/seller/logout
export const sellerLogout = async(req, res)=>{
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
        });
        return res.json({success: true, message: 'Logged Out'}); 
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }

}