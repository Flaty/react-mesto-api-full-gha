const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-errors');
const ConflictError = require('../errors/conflict-error');

module.exports.createUsers = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User
      .create({
        name, about, avatar, email, password: hash,
      })
      .then(() => res.status(201).send(
        {
          data: {
            name, about, avatar, email,
          },
        },
      ))
      .catch((err) => {
        if (err.code === 11000) {
          return next(new ConflictError('Пользователь с таким email уже существует'));
        }
        if (err.name === 'ValidationError') {
          return next(new BadRequestError('Некорректные данные'));
        }
        next(err);
      });
  })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(next);
};
