import express from "express"
import {searchUsers} from "../controllers/user.controller.js";
import trimRequest from 'trim-request';
import authMiddleware from "../middlewares/authMiddleware.js";


const router = express.Router();

// there are two way to add routes
// router.post('/login', (req, res) => {
//     res.send("Hello from the login api.");
// });

router.route('/').get(trimRequest.all,authMiddleware,searchUsers);


export default router;