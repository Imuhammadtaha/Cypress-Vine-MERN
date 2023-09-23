import userModels from "../models/userModels.js";
import { comparePassword, hashpassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import orderModel from "../models/orderModel.js";

export const registerController = async (req, res) => {
  try {
    const { name, email, phone, password, address, answer } = req.body;
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }
    if (!address) {
      return res.send({ message: "address is required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is required" });
    }

    //chech user
    const existingUser = await userModels.findOne({ email });
    //existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registerd. You can login.",
      });
    }
    // register User
    const hashedPassword = await hashpassword(password);
    // save
    const user = await new userModels({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();
    res.status(201).send({
      success: true,
      message: "User registered Successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(420).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};
//Login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(420).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //Check user
    const user = await userModels.findOne({ email });
    if (!user) {
      return res.status(420).send({
        message: "Email is not registerd",
        success: false,
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(420).send({
        success: false,
        message: "Invalid password",
      });
    }
    //token
    const token = JWT.sign({ _id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(420).send({
      success: false,
      message: "Problem in login",
      error,
    });
  }
};
//Forgot Password
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }

    //Check
    const user = await userModels.findOne({ email, answer });
    // validation
    if (!user) {
      return res.status(420).send({
        success: false,
        message: "Wrong Email or Answer",
      });
    }
    const hashed = await hashpassword(newPassword);
    await userModels.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(420).send({
      success: false,
      message: "something went wrong",
      error,
    });
  }
};

// testing
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.error(error);
    res.send({ error });
  }
};

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModels.findById(req.user._id);
    if (password && password.length < 6) {
      return res.json({
        error: "Password is required and must be longer than 6 characters",
      });
    }

    const hashedPassword = password ? await hashpassword(password) : undefined;

    const updatedUser = await userModels.findByIdAndUpdate(
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
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(420).send({
      success: false,
      message: "Error Occured While Updating Profile",
      error,
    });
  }
};
//order
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error While getting Orders",
      error,
    });
  }
};

export const getAllOrdersController = async (req,res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1"});
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error While getting Orders",
      error,
    });
  }
};

export const orderStatusController = async(req,res)=>{
 try {
  const {orderId} = req.params;
  const {status} = req.body;
  const orders = await orderModel.findByIdAndUpdate(orderId,{status},{new:true});
  res.json(orders);
  
 } catch (error) {
  console.error(error);
  res.status(420).send({
    success: false,
    message: 'Errpr While Updating Order',
    error
  })
  
 }
};
