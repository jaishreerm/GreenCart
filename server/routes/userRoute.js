import express from 'express';
import { isAuth, login, logout, register } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';

const userRouter = express.Router();

userRouter.post('/register', register) // whenever this '/register' api got hit it will call the register function in userController.js
userRouter.post('/login', login)       // whenever this '/login' api got hit it will call the login function in userController.js
userRouter.get('/is-auth', authUser ,isAuth) //why GET:- This is just checking whether the user is authenticated.It doesn't modify any data — it only returns a true/false or some user info.
userRouter.get('/logout', authUser, logout) //why GET:- ✅ It can also be done via POST, but GET is acceptable if you're not sending sensitive data or modifying backend storage.

// req.body is only defined for POST/PUT/PATCH requests, so dont do req.body for 🚫GET fn

/* 
🔐 What Does authUser Do?
authUser checks:
Does the user have a valid token (i.e., are they logged in)?
If yes → allow them to continue.
If not → block the request.

🚫 Why Not Add authUser to /register or /login?
Because:
A new user trying to register doesn’t have a token yet.
A user trying to log in also doesn't have a token yet.
If you added authUser, it would block them and say “Unauthorized” every time — even before they can register or log in!

✅ When to Use Middleware:
Use it only for protected routes, where:
The user must be logged in.
You need to verify the token or session.
*/



export default userRouter