const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-errors');
const NotFoundError = require('../errors/not-found-errors');
const ForbiddenError = require('../errors/forbidden-error');

// return all cards
module.exports.getCards = (req, res, next) => {
  Card
    .find({})
    .populate(['likes', 'owner'])
    .then((cards) => res.send(cards))
    .catch(next);
};
// create card
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card
    .create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};
// delete Card
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findById(cardId)
    .populate(['likes', 'owner'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Пользователь не найден');
      }
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Вы не можете удалить чужую карточку'));
      }
      return card.remove().then(() => res.send({ message: 'Карточка успешно удалена' }, card));
    })
    .catch(next);
};
// setLike
module.exports.getLikes = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .populate(['likes', 'owner'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные для постановки лайка'));
      }
      return next(err);
    });
};
// unSetLike
module.exports.deleteLikes = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .populate(['likes', 'owner'])
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Запрос не найден');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Идентификатор карточки неверен'));
        return;
      }
      next(err);
    });
};
