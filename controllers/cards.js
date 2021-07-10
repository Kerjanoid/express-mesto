const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send(cards))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then(card => res.send( card ))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.deleteCardByID = (req, res) => {
  Card.findById(req.params.cardId)
    .then(card => card.remove())
    .then(res.send(`Карточка c id:${req.params.cardId} успешно удалена`))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.likeCard = (req, res) =>
Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)

module.exports.dislikeCard = (req, res) =>
Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
