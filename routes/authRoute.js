import express from "express"
import {registerController,loginController,testController,forgotPasswordController,updateprofilecontroller,getorderscontroller,getallorderscontroller,orderStatuscontroller} from "../controllers/authController.js"
const router = express.Router()
import { isadmin, requireSignin } from "../middlewares/authMiddleware.js"
//routing
//register||method post
router.post('/register',registerController)

//login||post
router.post('/login',loginController)

//forgot password || post

router.post('/forgot-password',forgotPasswordController)

//test routes
router.get('/test',requireSignin,isadmin, testController)

//protected User route
router.get('/user-auth',requireSignin,(req,res)=>{
  res.status(200).send({ok:true});
})

//protected admin route
router.get('/admin-auth',requireSignin,isadmin,(req,res)=>{
  res.status(200).send({ok:true});
})
//update profile
router.put('/profile', requireSignin,updateprofilecontroller)

//orders
router.get('/orders', requireSignin, getorderscontroller)
//all orders
router.get('/all-orders', requireSignin, isadmin,getallorderscontroller)
//order status update
router.put('/order-status/:orderId',isadmin,requireSignin,orderStatuscontroller)
export default router