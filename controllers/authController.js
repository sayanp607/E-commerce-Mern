import userModel from "../models/userModel.js"
import orderModel from "../models/orderModel.js"
import { comparepassword, hashPassword } from "../helpers/authHelper.js"
import JWT from "jsonwebtoken"
 export const registerController = async(req,res)=>{
      try{
            const {name,email,password,phone,address,answer} = req.body
            //validation
            if(!name){
              return res.send({message:'name is required'})
            }
            if(!email){
              return res.send({message:'email is required'})
            }
            if(!password){
              return res.send({message:'password is required'})
            }
            if(!phone){
              return res.send({message:'phone is required'})
            }
            if(!address){
              return res.send({message:'address is required'})
            }
            if(!answer){
              return res.send({message:'answer is required'})
            }
            //check user
              const existinguser = await userModel.findOne({email})
              //existing user
              if(existinguser){
                return res.status(200).send({
                  success:false,
                  message:'Already register, please login'
                })
              }
              //register user
              const hashedpassword = await hashPassword(password)
              //save
              const user = await new userModel({name,email,phone,address,password:hashedpassword,answer}).save()

              res.status(201).send({
                success:true,
                message:'user register successfully',
                user
              })

      }
      catch(error){
        console.log(error);
        res.status (500).send({
          success : false,
          message:'Error in registration',
          error
        })
      }
}
//post login
export const loginController = async(req,res)=>{
  try{
      const {email,password}=req.body
      //validation
      if(!email || !password){
        return res.status(404).send({
          success:false,
          message:'Invalid email or password'
        })
      }
      //check user
      const user = await userModel.findOne({email})
      if(!user){
        return res.status(404).send({
          success:false,
          message:'Email is not registered!'
        })
      }
      const match = await comparepassword(password,user.password)
      if(!match){
        return res.status(200).send({
          success:false,
          message:"invalid password"
        })
      }
      //token
      const token = await JWT.sign({_id:user._id},process.env.JWT_secret,{expiresIn:'7d'})
      res.status(200).send({
        success:true,
        message:'login successfully',
        user:{
          name:user.name,
          email:user.email,
          phone:user.phone,
          address:user.address,
          role:user.role,
        },
      token,
      })
  }
  catch(error){
   console.log(error) 
   res.status(500).send({
    success:false,
    message:'Error in login',
    error
   })
  }
};

//forgotpassword controller

export const forgotPasswordController =async(req,res)=>{
 try{
    const {email,answer,newpassword} = req.body
    if(!email){
      res.status(400).send({message:"Email is required"})
    }
    if(!answer){
      res.status(400).send({message:"answer is required"})
    }
    if(!newpassword){
      res.status(400).send({message:"new password is required"})
    }
    //check
    const user = await userModel.findOne({email,answer})

    //validation
    if(!user){
      return res.status(404).send({
        success:false,
        message:"Wrong Email or Answer",
      });
    }
    const hashed = await hashPassword(newpassword);
    await userModel.findByIdAndUpdate(user._id, {password:hashed});
    res.status(200).send({
      success:true,
      message:"Password reset done!"
    })
 }
 catch(error){
  console.log(error)
  res.status(500).send({
    success:false,
    message:'Something went wrong'.
    error
  })
 }
};
//test controller
export const testController=(req,res)=>{
  res.send('protected route')
}

//update profile
export const updateprofilecontroller = async (req,res)=>{
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
}


//orders
export const getorderscontroller = async(req,res)=>{
  try {
    const orders = await orderModel
      .find({buyer:req.user._id})
      .populate("products", "-photo")
      .populate("buyer", "name")
      // .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
}

//get all orders
export const getallorderscontroller = async(req,res)=>{
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      //  .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
}


//order status controller
export const orderStatuscontroller=async(req,res)=>{
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
}; 
