import slugify from "slugify"
import productModel from "../models/productModel.js"
import fs from 'fs'
import categoryModel from "../models/categoryModel.js"
import braintree from "braintree"
import orderModel from "../models/orderModel.js"
import dotenv from "dotenv"

dotenv.config();
//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey:process.env.BRAINTREE_PRIVATE_KEY,
});


export const createproductcontroller=async(req,res)=>{
try{
  const{name,slug,description,price,category,quantity,shipping} = req.fields
  const {photo} = req.files
  //validation

  switch(true){
    case !name :
      return res.status(500).send({
        error:"Name is required"
      })
    case !description :
      return res.status(500).send({
        error:"Description is required"
      })
    case !price :
      return res.status(500).send({
        error:"Price is required"
      })
    case !category :
      return res.status(500).send({
        error:"Category is required"
      })
    case !quantity :
      return res.status(500).send({
        error:"Quantity is required"
      })
    case  photo && photo.size > 100000 :
      return res.status(500).send({
        error:"Photo is required & should be less than 1 mb."
      })
  }
const products = new productModel({...req.fields,slug:slugify(name)})
if(photo){
  products.photo.data = fs.readFileSync(photo.path);
  products.photo.contentType = photo.type;
}
await products.save();
res.status(201).send({
  success:true,
  message:"Product created succesfully",
  products,
})
}
catch(error){
  console.log(error)
  res.status(500).send({
    success:false,
    error,
    message:"Error in creating product"
  })
}
}


//get all products

export const getproductcontroller = async(req,res)=>{
try{
  const products = await productModel.find({})
  .populate('category').select("-photo").limit(12).sort({createdAt:-1});
  res.status(200).send({
    success:true,
    total_count:products.length,
    message:"All products",
    products,
  })
}
catch(error){
  console.log(error)
  res.status(500).send({
    success:false,
    message:"Error in getting products",
    error:error.message

  })
}
}

//get single product
export const getsingleproductcontroller=async(req,res)=>{
try{
const product = await productModel.findOne({slug:req.params.slug})
.select('-photo')
.populate('category');
res.status(200).send({
  success:true,
  message:"Single product fetched.",
  product,
})
}
catch(error){
  console.log(error),
  res.status(500).send({
      success:false,
      message:"Error while getting single product",
      error,
  })
}
}

//product photo

export const productphotocontroller = async(req,res)=>{

  try{
      const product = await productModel.findById (req.params.pid).select("photo")
      if(product.photo.data){
        res.set('content-type',product.photo.contentType)
        return res.status(200).send(product.photo.data)
      }
  }
  catch(error){
    console.log(error),
    res.status(500).send({
        success:false,
        message:"Error while getting photo",
        error,
    })
  }
}


//delete products
export const deleteproductcontroller =async(req,res)=>{

  try{
        await productModel.findByIdAndDelete (req.params.pid).select('-photo')
        res.status(200).send({
          success:true,
          message:"Product Deleted successfully",
      })
  }
  catch(error){
    console.log(error),
    res.status(500).send({
        success:false,
        message:"Error while deleting product",
        error,
    })
  }
}

//update product 
export const updateproductcontroller=async(req,res)=>{
  try{
    const{name,slug,description,price,category,quantity,shipping} = req.fields
    const {photo} = req.files
    //validation
  
    switch(true){
      case !name :
        return res.status(500).send({
          error:"Name is required"
        })
      case !description :
        return res.status(500).send({
          error:"Description is required"
        })
      case !price :
        return res.status(500).send({
          error:"Price is required"
        })
      case !category :
        return res.status(500).send({
          error:"Category is required"
        })
      case !quantity :
        return res.status(500).send({
          error:"Quantity is required"
        })
      case  photo && photo.size > 100000 :
        return res.status(500).send({
          error:"Photo is required & should be less than 1 mb."
        })
    }
  const products = await productModel.findByIdAndUpdate(req.params.pid,{...req.fields,slug:slugify(name)},{new:true})
  if(photo){
    products.photo.data = fs.readFileSync(photo.path);
    products.photo.contentType = photo.type;
  }
  await products.save();
  res.status(201).send({
    success:true,
    message:"Product Updated succesfully",
    products,
  })
  }
  catch(error){
    console.log(error)
    res.status(500).send({
      success:false,
      error,
      message:"Error in Updating product"
    })
  }
  }
  

  //filters
export const productfilterscontroller = async(req,res)=>{

  try{
      const {checked,radio} = req.body 
      let args = {}

      if(checked.length>0) args.category = checked
      if(radio.length) args.price={$gte:radio[0], $lte:radio[1]}

      const products = await productModel.find(args)
      res.status(200).send({
        success:true,
        products,
      })
  }
  catch(error){
    console.log(error)
    res.status(400).send({
      success:false,
      error,
      message:"Error in Filtering product"
    })
  }
}

//product count controller
export const productcountcontroller= async(req,res)=>{
try{
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success:true,
      total,
    })
}
catch(error){
  console.log(error)
  res.status(400).send({
    success:false,
    error,
    message:"Error in counting product"
  })
}
}

//product list based on page
export const productlistcontroller = async(req,res)=>{
  try{
const perpage =3;
const page = req.params.page ? req.params.page:1;
const products = await productModel.find({}).select("-photo").skip((page - 1)*perpage).limit(perpage).sort({createdAt:-1})
res.status(200).send({
  success:true,
  products,
})
  }
  catch(error){
    console.log(error)
    res.status(400).send({
      success:false,
      error,
      message:"Error in per page product"
    })
  }
}

//search product
export const productsearchcontroller = async(req,res)=>{
  try{
    const {keyword} = req.params
    const results = await productModel.find({
      $or:[
        {name:{$regex: keyword, $options: "i"}},
        {description : {$regex: keyword, $options:"i"}},
      ]
    })
    .select("-photo");
    res.json(results);
  }
  catch(error){
    console.log(error)
    res.status(400).send({
      success:false,
      error,
      message:"Error in per page product"
    })
  }
}

//similar product
export const relatedproductcontroller = async (req,res) =>{
  try{
const {pid,cid} = req.params;
const products = await productModel.find({
  category:cid,
  _id:{$ne:pid},
})
.select("-photo")
.limit(3)
.populate("category");
res.status(200).send({
  success:true,
  products,
});
  }
  catch(error){
    console.log(error)
    res.status(400).send({
      success:false,
      error,
      message:"Error in similar product"
    })
  }
}

//get product by category
export const productcategorycontroller = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

//payment gateway api
//token
export const braintreetokencontroller = async(req,res)=>{

  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

//payment
export const braintreepaymentscontroller =async(req,res)=>{
  try {
    const {  cart,nonce } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }
}