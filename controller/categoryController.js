import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";
export const createCategoryController = async(req,res) => {
    try {
        const {name} = req.body;
        if(!name){
           return res.status(420).send({message: 'Name is required'});
        }
        const existingCategory = await categoryModel.findOne({name});
        if(existingCategory){
            return res.status(200).send({
                success: true,
                message: 'Category already exists!'
            })
        }
        const category = await new categoryModel({name, slug:slugify(name)}).save();
        res.status(200).send({
            success: true,
            message: 'New Category Created',
            category,
        })
    } catch (error) {
        console.error(error);
        res.status(420).send({
            success: false,
            error,
            message: 'Error in category',
        });
        
    }

};

// update Operation on Category
export const updateCategoryController = async(req,res)=>{
    try {
        const {name} = req.body;
        const {id} = req.params;
        const category = await categoryModel.findByIdAndUpdate(id,{name, slug: slugify(name)},{new: true});
        res.status(200).send({
            success: true,
            message: 'Category Updated Successfully',
            category,
        });
        
    } catch (error) {
        console.error(error);
        res.status(420).send({
            success: false,
            error,
            message: 'Error while updating Category'
        });
        
        
    }
};

// Get all category controller
export const categoryController = async(req,res) => {
    try {
        const category = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: 'All Categories List',
            category
        });
    } catch (error) {
        console.error(error);
        res.status(420).send({
            success: false,
            error,
            message: 'Error Occured! While fetching categories'
        });
        
    };
};

// Get Single Category
export const singleCategoryController = async(req,res) =>{
    try {
        const category = await categoryModel.findOne({slug: req.params.slug});
        res.status(200).send({
            success: true,
            message:'Your Category Fetched Successfully',
            category
        })
        
    } catch (error) {
        console.error(error);
        res.status(421).send({
            success: false,
            message:'Error While fetching a Uni Category',
            error,
        })
        
    }
};

// Deleting Category
export const deleteCategoryController = async(req,res) => {
    try {
        const {id} = req.params;
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message:"Category Deleted Successfully",
        })
    } catch (error) {
        console.error(error);
        res.status(420).send({
            error,
            success: false,
            message: 'Error in deleting Category',
        });
        
    }

};