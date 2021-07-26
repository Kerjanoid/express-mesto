const Error400 = 400;
const Error401 = 401;
const Error403 = 403;
const Error404 = 404;
const Error409 = 409;
const Error500 = 500;

module.exports = (err, req, res, next) => {
  console.log(err);
  if (err.name === "CastError") {
    res.status(Error400).send({ message: "Переданы некорректные данные." });
  } else if (err.name === "ValidationError") {
    res.status(Error400).send({ message: `${Object.values(err.errors).map((error) => error.message).join(" ")}` });
  } else if (err.name === "MongoError" && err.code === 11000) {
    res.status(Error409).send({ message: "Пользователь с таким 'email' уже существует." });
  } else if (err.message === "UnauthorizedError") {
    res.status(err.statusCode).send({ message: "Необходима авторизация" });
  } else if (err.message === "ForbiddenError") {
    res.status(err.statusCode).send({ message: "Недостаточно полномочий" });
  } else if (err.message === "IncorrectID") {
    res.status(Error404).send({ message: "Пользователь с указанным _id не найден." });
  } else if (err.message === "EmptyField") {
    res.status(Error400).send({ message: "Email или пароль отсутствуют" });
  } else if (err.message === "EmptyAvatarField") {
    res.status(Error400).send({ message: "Поле 'avatar' должно быть заполнено." });
  } else if (err.message === "IncorrectEmail") {
    res.status(Error401).send({ message: "Указан некорректный Email или пароль." });
  } else if (err.message === "IncorrectPassword") {
    res.status(err.statusCode).send({ message: "Указан некорректный Email или пароль." });
  } else {
    res.status(Error500).send({ message: "На сервере произошла ошибка" });
  }

  return next();
};
