const Card = require("../models/card");

const Error400 = 400;
const Error404 = 404;
const Error500 = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      res.status(Error500).send({ message: "На сервере произошла ошибка." });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(Error400).send({ message: "Переданы некорректные данные при создании карточки." });
      } else {
        res.status(Error500).send({ message: "На сервере произошла ошибка." });
      }
    });
};

module.exports.deleteCardByID = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(new Error("IncorrectCardID"))
    .then((card) => {
      card.remove();
      res.status(200).send({ message: `Карточка c _id: ${card._id} успешно удалена.` });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(Error400).send({ message: "Переданы некорректные данные." });
      } else if (err.message === "IncorrectCardID") {
        res.status(Error404).send({ message: "Карточка с указанным _id не найдена." });
      } else {
        res.status(Error500).send({ message: "На сервере произошла ошибка." });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error("IncorrectCardID"))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(Error400).send({ message: "Переданы некорректные данные для постановки лайка." });
      } else if (err.message === "IncorrectCardID") {
        res.status(Error404).send({ message: "Карточка с указанным _id не найдена." });
      } else {
        res.status(Error500).send({ message: "На сервере произошла ошибка." });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error("IncorrectCardID"))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(Error400).send({ message: "Переданы некорректные данные для снятия лайка." });
      } else if (err.message === "IncorrectCardID") {
        res.status(Error404).send({ message: "Карточка с указанным _id не найдена." });
      } else {
        res.status(Error500).send({ message: "На сервере произошла ошибка." });
      }
    });
};
