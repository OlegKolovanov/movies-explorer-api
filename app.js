const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, errors, Joi } = require('celebrate');
const cors = require('cors');
const { login, register } = require('./controllers/users');
const auth = require('./middlewares/auth');
const handleError = require('./middlewares/handleError');
const NotFoundErr = require('./errors/NotFoundErr');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', () => {
  console.log('Yes');
});

app.use(requestLogger);

app.use(cors());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), register);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use('*', (req, res, next) => {
  next(new NotFoundErr('Страница не найдена'));
});

app.use(errorLogger);

app.use(errors());

app.use(handleError);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
