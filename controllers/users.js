const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

module.exports.getUserByID = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => { res.status(200).send(user); })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then((user) => {
          const userDoc = user._doc;
          delete userDoc.password;
          res.status(200).send(user);
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    })
    .orFail(new Error("IncorrectID"))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  if (!avatar) {
    throw new Error("EmptyAvatarField");
  } else {
    User.findByIdAndUpdate(req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
        upsert: false,
      })
      .orFail(new Error("IncorrectID"))
      .then((user) => { res.status(200).send(user); })
      .catch(next);
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new Error("EmptyField");
  } else {
    User.findOne({ email }).select("+password")
      .orFail(new Error("IncorrectEmail"))
      .then((user) => {
        bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              const err = new Error("IncorrectPassword");
              err.statusCode = 401;
              next(err);
            } else {
              const token = jwt.sign({ _id: user._id }, "super-strong-secret", { expiresIn: "7d" });
              res.status(201).send({ token });
            }
          })
          .catch(next);
      }).catch(next);
  }
};
