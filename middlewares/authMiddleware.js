import JWT from "jsonwebtoken";
import userModels from "../models/userModels.js";

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.error(error);
  }
};

// Admin accesss
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModels.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(420).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(420).send({
      success: false,
      error,
      message: "Error in admin middleware",
    });
  }
};
