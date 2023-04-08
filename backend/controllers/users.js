const BadRequestError = require('../errors/bad-request-errors');
const NotFoundError = require('../errors/not-found-errors');
const User = require('../models/user');

module.exports.getUserInfo = (req, res, next) => {
  User
    .find({})
    .then((users) => res.send(users))
    .catch(next);
};

// get users
module.exports.getUsers = (req, res, next) => {
  const { _id } = req.user;
  User
    .find({ _id })
    .then((user) => res.status(200).send({ data: user[0] }))
    .catch(next);
};

module.exports.getlUserById = (req, res, next) => {
  const { userId } = req.params;
  User
    .findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Запрошенный пользователь не найден');
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Неверный идентификатор'));
        return;
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Идентификатор пользователя не найден');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('При обновлении профиля переданы неверные данные'));
        return;
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Идентификатор пользователя неверен'));
        return;
      }
      next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь с идентификатором ${userId} не найден`);
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Invalid data passed when updating profile'));
        return;
      }
      if (err.name === 'CastError') {
        next(new BadRequestError('Идентификатор пользователя неверен'));
        return;
      }
      next(err);
    });
};
