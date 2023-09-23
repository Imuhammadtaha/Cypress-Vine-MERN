import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";
import bannerModel from "../models/bannerModel.js";

dotenv.config();

//payment Gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    // Validation
    switch (true) {
      case !name:
        return res.status(420).send({ error: "Name is required " });
      case !description:
        return res.status(420).send({ error: "Description is required " });
      case !price:
        return res.status(420).send({ error: "Price is required " });
      case !category:
        return res.status(420).send({ error: "Category is required " });
      case !quantity:
        return res.status(420).send({ error: "Quantity is required " });
      case !photo && photo.size > 10000:
        return res
          .status(420)
          .send({ error: "Picture Is Required and should be less than 10MB " });
    }
    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(200).send({
      success: true,
      message: "Products Created Successfully",
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error Occured While Creating Product",
    });
  }
};

export const createBannerController = async(req, res)=>{
  try {
    const { photo } = req.files;
    switch(true){
      case !photo && photo.size > 10000:
        return res.status(420).send({

         error: "Picture Is Required and should be less than 10MB "
        })
    }
    const banner = new bannerModel();
    if (photo) {
      banner.photo.data = fs.readFileSync(photo.path);
      banner.photo.contentType = photo.type;
    }
    await banner.save();
    res.status(200).send({
      success: true,
      message: "Banner Created Successfully",
      banner,
    });

  } catch (error) {
    console.error(error);
    res.status(420).send({
      success: false,
      error,
      message: "Problem in Creating Banner",
    })
    
  }
};


// Getting Products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      totalProducts: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(420).send({
      success: false,
      error,
      message: "Error While Fetching Products",
    });
  }
};

//Get Banner Controller
export const getBannerController = async(req, res) => {
  try {
    const banner = await bannerModel.find({}).sort({ createdAt: -1 });
    

    res.status(200).send({
      success: true,
      message: "Banner",
      banner,
      
      
    });
  } catch (error) {
    console.error(error);
    res.status(420).send({
      success: false,
      error,
      message: "Error While Fetching Products",
    });
  }
}

//delete banner
export const deleteBannerController = async(req, res) => {
  try {
    const { id } = req.params;
    const deletedBanner = await bannerModel.findByIdAndDelete(id);

    if (!deletedBanner) {
      return res.status(404).send({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while deleting banner",
    });
  }
};

// Single Product Controller

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(420).send({
      success: false,
      message: "Message While Fetching Single Product",
    });
  }
};

// GET PHOTO ROUTE
export const getProductPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.error(error);
    res.status(420).send({
      success: false,
      error,
      message: "Error Occured While fetching Picture",
    });
  }
};

// Delete Product
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(490).send({
      success: false,
      error,
      message: "Error While Deleting",
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    // Validation
    switch (true) {
      case !name:
        return res.status(420).send({ error: "Name is required " });
      case !description:
        return res.status(420).send({ error: "Description is required " });
      case !price:
        return res.status(420).send({ error: "Price is required " });
      case !category:
        return res.status(420).send({ error: "Category is required " });
      case !quantity:
        return res.status(420).send({ error: "Quantity is required " });
      case photo && photo.size > 10000:
        return res
          .status(420)
          .send({ error: "Picture Is Required and should be less than 10MB " });
    }
    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(200).send({
      success: true,
      message: "Products Updated Successfully",
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error Occured While Updating Product",
    });
  }
};

///filter
export const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error Occured While Filtering",
      error,
    });
  }
};

// Product Count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.error(error);
    res.status(420).send({
      message: "Error in product Count",
      error,
      success: false,
    });
  }
};

//Product Per Page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(420).send({
      success: false,
      message: "Error In Per Page CTRL",
      error,
    });
  }
};

export const searchController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(400).send({
      success: false,
      message: "Errorn in Searching product",
      error,
    });
  }
};

//Related product
export const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(12)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(420).send({
      success: false,
      message: "Error while getting related products",
      error,
    });
  }
};

// Category wise Product

export const categoryProductController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      message: "Product on basis of category fetched Successfully",
      products,
      category,
    });
  } catch (error) {
    console.error(error);
    res.status(420).send({
      success: false,
      error,
      message: "Error Occured While getting category-wise product",
    });
  }
};

//Payment Gateway api
export const brainTreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

//payments
export const brainTreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale({amount: total, paymentMethodNonce: nonce, options:{submitForSettlement: true},}, function(error, result){
      if(result){
        const order = new orderModel({
          products: cart,
          payment: result,
          buyer: req.user._id,
        }).save();
        res.json({ ok: true});
      }else{
        res.status(500).send(error);
      }
    });
  } catch (error) {
    console.error(error);
  }
};
