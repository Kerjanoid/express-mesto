const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const Error400 = 400;
const Error401 = 401;
const Error404 = 404;
const Error409 = 409;
const Error500 = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => res.status(Error500).send({ message: "На сервере произошла ошибка." }));
};

module.exports.getUserByID = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(Error400).send({ message: "Переданы некорректные данные." });
      } else {
        res.status(Error500).send({ message: "На сервере произошла ошибка." });
      }
    });
};

module.exports.createUser = (req, res) => {
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
        .catch((err) => {
          if (err.name === "ValidationError") {
            res.status(Error400).send({ message: `${Object.values(err.errors).map((error) => error.message).join(" ")}` });
          } else if (err.name === "MongoError") {
            res.status(Error409).send({ message: "Пользователь с таким 'email' уже существует." });
          } else {
            res.status(Error500).send({ message: "На сервере произошла ошибка." });
          }
        });
    });
};

module.exports.updateProfile = (req, res) => {
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
    .catch((err) => {
      if (err.message === "IncorrectID") {
        res.status(Error404).send({ message: "Пользователь с указанным _id не найден." });
      } else if (err.name === "ValidationError") {
        res.status(Error400).send({ message: `${Object.values(err.errors).map((error) => error.message).join(" ")}` });
      } else {
        res.status(Error500).send({ message: "На сервере произошла ошибка." });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;

  if (!avatar) {
    res.status(Error400).send({ message: "Поле 'avatar' должно быть заполнено." });
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
      .catch((err) => {
        if (err.message === "IncorrectID") {
          res.status(Error404).send({ message: "Пользователь с указанным _id не найден." });
        } else {
          res.status(Error500).send({ message: "На сервере произошла ошибка." });
        }
      });
  }
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).send({ message: "Email или пароль отсутствуют" });
  } else {
    User.findOne({ email })
      .orFail(new Error("IncorrectEmail"))
      .then((user) => {
        bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              res.status(Error401).send({ message: "Указан некорректный Email или пароль." });
            } else {
              const token = jwt.sign({ _id: user._id }, "super-strong-secret", { expiresIn: "7d" });
              res.status(200).send({ token });
            }
          });
      })
      .catch((err) => {
        if (err.message === "IncorrectEmail") {
          res.status(Error401).send({ message: "Указан некорректный Email или пароль." });
        } else {
          res.status(Error500).send({ message: "На сервере произошла ошибка." });
        }
      });
  }
};
