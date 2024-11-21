const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  getUserDetails,
  createUser,
  updateUser,
  deleteUser,
  getAllAdminUsers,
  getAdminUserDetails,
} = require("../Controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../Middlewares/auth");
const { getUserEvents } = require("../Controllers/registerationController");

const Router = express.Router();

Router.route("/register").post(registerUser);

Router.route("/login").post(loginUser);

Router.route("/logout").get(logout);

Router.route("/me").get(isAuthenticatedUser, getUserDetails);

Router.route("/user/events").get(isAuthenticatedUser, getUserEvents);

Router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllAdminUsers);

Router.route("/admin/user/new").post(isAuthenticatedUser, authorizeRoles("admin"), createUser);

Router.route("/admin/user/:id")
.get(isAuthenticatedUser, authorizeRoles("admin"), getAdminUserDetails)
.put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
.delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = Router;