import express from "express"
import {isadmin,requireSignin} from "../middlewares/authMiddleware.js";
import { createCategoryController } from "../controllers/categoryController.js";

import { updatecategorycontroller } from "../controllers/categoryController.js";
import { categoryController ,singlecategorycontroller,deletecategorycontroller} from "../controllers/categoryController.js";
const router = express.Router()

//routes
//create category
router.post('/create-category',requireSignin,isadmin,createCategoryController)

//update category
router.put('/update-category/:id',requireSignin,isadmin,updatecategorycontroller)


//getall category
router.get('/get-category',categoryController)

//single category
router.get('/single-category/:slug',singlecategorycontroller)

//delete
router.delete('/delete-category/:id',requireSignin,isadmin,deletecategorycontroller)
export default router;