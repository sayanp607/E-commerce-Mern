import express from "express"
import { isadmin, requireSignin } from "../middlewares/authMiddleware.js";
import { createproductcontroller , getproductcontroller,getsingleproductcontroller,productphotocontroller,deleteproductcontroller, updateproductcontroller,productfilterscontroller,productcountcontroller,productlistcontroller,productsearchcontroller,relatedproductcontroller,productcategorycontroller,braintreetokencontroller,braintreepaymentscontroller} from "../controllers/productController.js";

import formidable from "express-formidable"
const router = express.Router();

//routes
router.post('/create-product',requireSignin,isadmin,formidable(), createproductcontroller)

//get products
router.get('/get-product',getproductcontroller)

//single product
router.get('/get-product/:slug',getsingleproductcontroller)


//get photo
router.get('/product-photo/:pid', productphotocontroller)


//delete product
router.delete('/delete-product/:pid',deleteproductcontroller)

//update product
router.put('/update-product/:pid',requireSignin,isadmin,formidable(),updateproductcontroller)


//filter product
router.post('/product-filters',productfilterscontroller)

//product count
router.get('/product-count', productcountcontroller)

//product per page
router.get('/product-list/:page',productlistcontroller)

//search product
router.get('/search/:keyword',productsearchcontroller)


//similar products
router.get('/related-product/:pid/:cid', relatedproductcontroller)

router.get('/product-category/:slug', productcategorycontroller)

//payment routes

///token
router.get ('/braintree/token',braintreetokencontroller)

//payments
router.post('/braintree/payment',requireSignin,braintreepaymentscontroller)
export default router;