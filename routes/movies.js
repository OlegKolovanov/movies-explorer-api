const router = require('express').Router();
const { validateBodyMovie, validateDeleteMovie } = require('../middlewares/validation');

const {
  getMovie,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovie);

router.post('/', validateBodyMovie, createMovie);

router.delete('/:movieId', validateDeleteMovie, deleteMovie);

module.exports = router;
