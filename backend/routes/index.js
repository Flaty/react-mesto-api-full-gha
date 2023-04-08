const express = require('express');

const router = require('express').Router();

const usersRouter = require('./userRoutes');
const cardsRouter = require('./cardRoutes');
const NotFoundError = require('../errors/not-found-errors');

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);
router.use((req, res, next) => {
  next(new NotFoundError('Такая страница не существует'));
});

module.exports = router;
