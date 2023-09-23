import express from "express";
import cors from "cors";

import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
} from "../controller/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

// router object
const router = express.Router();

//routing
router.use(cors());

// Register
router.post("/register", registerController);

//login route
router.post("/login", loginController);

//testing Route
router.get("/test", requireSignIn, isAdmin, testController);

//Forgot Password Route
router.post("/forgot-password", forgotPasswordController);

// protcted User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

// protcted Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//Update Profile
router.put('/profile', requireSignIn,updateProfileController);

//Orders
router.get('/orders', requireSignIn, getOrdersController);


//All-Orders
router.get('/all-orders', requireSignIn, isAdmin, getAllOrdersController);

//Order status Update
router.put('/order-status/:orderId', requireSignIn,isAdmin, orderStatusController)

export default router;
