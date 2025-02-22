const express = require("express");
const router = express.Router();
const AuthController = require("../apps/controllers/AuthController");

router.get("/sign-up", AuthController.signUpShow);
router.get("/sign-in", AuthController.signInShow);
router.get("/sign-out", AuthController.signOut);
router.post("/sign-up", AuthController.signUp);
router.post("/sign-in", AuthController.signIn);

module.exports = router;
