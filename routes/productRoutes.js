import express from "express";
import {requireSignIn,isAdmin} from '../middlewares/authMiddleware.js'
import { brainTreePaymentController, brainTreeTokenController, categoryProductController, createBannerController, createProductController, deleteBannerController, deleteProductController, getBannerController, getProductController, getProductPhotoController, getSingleProductController, productCountController, productFilterController, productListController, relatedProductController, searchController, updateProductController } from "../controller/productController.js";
import formidable from "express-formidable";
const router = express.Router();

//Create Product routes
router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController);

//Banners
router.post('/create-banner',requireSignIn,isAdmin,formidable(),createBannerController);


//Get All Products
router.get('/get-product',getProductController);

//Banners
router.get('/get-banner',getBannerController);

//Delete Banner
router.delete('/delete-banner/:id',deleteBannerController)

// Get Single Products
router.get('/get-product/:slug',getSingleProductController);

// Get Pictuer 
router.get('/product-photo/:pid',getProductPhotoController)

// Delete
router.delete('/delete-product/:pid',deleteProductController);

// Filter Product
router.post('/product-filters',productFilterController);

//Update Product
router.put('/update-product/:pid',requireSignIn,isAdmin,formidable(),updateProductController);

//Product Count
router.get('/product-count',productCountController)

//Product per page
router.get('/product-list/:page', productListController);

//Search product
router.get('/search/:keyword',searchController);

//Related or Similar Products
router.get('/related-product/:pid/:cid',relatedProductController)

//Category wise Product
router.get('/product-category/:slug',categoryProductController);


//Payment routes token
router.get('/braintree/token', brainTreeTokenController);

//Payemnts
router.post('/braintree/payment', requireSignIn, brainTreePaymentController)
export default router;