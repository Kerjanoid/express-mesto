const express = require("express");

const app = express();
const { PORT = 3000 } = process.env;
const mongoose = require("mongoose");

const Error400 = 400;
const Error401 = 401;
const Error404 = 404;
const Error409 = 409;
const Error500 = 500;

const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/error");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/mestodb", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.post("/signup", createUser);
app.post("/signin", login);

app.use(auth);

app.use("/", require("./routes/users"));
app.use("/", require("./routes/cards"));

app.use("*", (req, res) => {
  res.status(Error404).send({ message: "Ресурс не найден." });
});

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Ссылка на сервер: http://localhost:${PORT}`);
});
