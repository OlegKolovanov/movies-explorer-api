const Movie = require('../models/movies');
const NotFoundErr = require('../errors/NotFoundErr');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');

module.exports.getMovie = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ data: movies }))
    .catch((err) => next(err));
};

module.exports.createMovie = (req, res, next) => {
  const {
    name,
    image,
    country,
    director,
    duration,
    year,
    description,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    name,
    image,
    country,
    director,
    duration,
    year,
    description,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданны некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundErr('Фильм не найден'));
      } else if (String(movie.owner) === req.user._id) {
        Movie.findByIdAndRemove(req.params.movieId)
          .then(() => res.send({ message: 'Фильм успешно удален' }))
          .catch(next);
      } else {
        throw new Forbidden('У вас нет прав на удаление данного фильма');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданны некорректные данные'));
      } else {
        next(err);
      }
    });
};
