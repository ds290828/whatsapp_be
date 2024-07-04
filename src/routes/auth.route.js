import express from "express"
import {login ,logout, refreshToken, register} from "../controllers/auth.controller.js";
import trimRequest from 'trim-request';
import authMiddleware from "../middlewares/authMiddleware.js";


const router = express.Router();

// there are two way to add routes
// router.post('/login', (req, res) => {
//     res.send("Hello from the login api.");
// });

router.route('/register').post(trimRequest.all,register);
router.route('/login').post(trimRequest.all,login);
router.route('/logout').post(trimRequest.all,logout);
router.route('/refreshtoken').post(trimRequest.all,refreshToken);

router.route('/testingauthMiddleware').get(trimRequest.all,authMiddleware,(req,res)=>{
    res.send(req.user);
})


export default router;