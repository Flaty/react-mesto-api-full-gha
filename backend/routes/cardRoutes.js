const cardRoutes = require('express').Router();

const {
  getCards,
  createCard,
  deleteCard,
  getLikes,
  deleteLikes,
} = require('../controllers/cards');

const {
  validationCreateCard,
  validationCardById,
} = require('../middlewares/validation');

cardRoutes.get('/', getCards);
cardRoutes.post('/', validationCreateCard, createCard);
cardRoutes.delete('/:cardId', validationCardById, deleteCard);
cardRoutes.put('/:cardId/likes', validationCardById, getLikes);
cardRoutes.delete('/:cardId/likes', validationCardById, deleteLikes);
module.exports = cardRoutes;
