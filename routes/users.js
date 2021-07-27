const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  getUsers, getUserByID, updateProfile, updateAvatar,
} = require("../controllers/users");

router.get("/users", getUsers);
router.get("/users/me", getUserByID);
router.patch("/users/me", updateProfile);
router.patch("/users/me/avatar", updateAvatar);

module.exports = router;
