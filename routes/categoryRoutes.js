import express from "express";
import  {isAdmin,requireSignIn} from './../middlewares/authMiddleware.js'
import { categoryController, createCategoryController, deleteCategoryController, singleCategoryController, updateCategoryController } from "../controller/categoryController.js";
const router = express.Router();

//routes
router.post('/create-category',requireSignIn,isAdmin,createCategoryController);

//Update Route
router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController);

//Get All category
router.get('/get-category',categoryController);

//Get Single Category
router.get('/single-category/:slug', singleCategoryController);

// Deleting Route
router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategoryController);
export default router