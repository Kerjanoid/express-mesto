const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.getUserByID = (req, res) => {
  User.findById(req.params.userId)
    .then(user => res.send(user))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send(`Профиль успешно создан. ${user}`))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name: name, about: about })
    .then(res.send("Запрос на обновление профиля успешно выполнен."))
    .catch(err => res.status(500).send({ message: err.message }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar: avatar })
    .then(res.send("Запрос на обновление аватара успешно выполнен."))
    .catch(err => res.status(500).send({ message: err.message }));
};

