const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const isEmail = require("validator/lib/isEmail");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, "Минимальная длина поля 'name' - 2 символа"],
    maxlength: [30, "Максимальная длина поля 'name' - 30 символов"],
    default: "Жак-Ив Кусто",
  },
  about: {
    type: String,
    minlength: [2, "Минимальная длина поля 'about' - 2 символа"],
    maxlength: [30, "Максимальная длина поля 'about' - 30 символов"],
    default: "Исследователь",
  },
  avatar: {
    type: String,
    default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
  },
  email: {
    type: String,
    unique: [true, "Пользователь с таким 'email' уже существует"],
    required: [true, "Поле 'email' должно быть заполнено"],
    validate: {
      validator: (v) => isEmail(v),
      message: "Неправильный формат почты",
    },
  },
  password: {
    type: String,
    minlength: [8, "Минимальная длина поля 'password' - 8 символов"],
    required: [true, "Поле 'password' должно быть заполнено"],
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = (email, password) => this.findOne({ email })
  .then((user) => {
    if (!user) {
      return Promise.reject(new Error("Неправильные почта или пароль"));
    }

    return bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Неправильные почта или пароль"));
        }

        return user;
      });
  });

module.exports = mongoose.model("user", userSchema);
