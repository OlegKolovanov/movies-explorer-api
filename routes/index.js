const router = require('express').Router();
const { login, register } = require('../controllers/users');
const auth = require('../middlewares/auth');
const NotFoundErr = require('../errors/NotFoundErr');
const { validateSignIn, validateRegister } = require('../middlewares/validation');

router.post('/signin', validateSignIn, login);

router.post('/signup', validateRegister, register);

router.use(auth);

router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', (req, res, next) => {
  next(new NotFoundErr('Страница не найдена'));
});

module.exports = router;
