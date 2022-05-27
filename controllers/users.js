require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const NotFoundErr = require('../errors/NotFoundErr');
const BadRequest = require('../errors/BadRequest');
const Unauthorized = require('../errors/Unauthorized');
const Conflict = require('../errors/Conflict');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('Пользователь не найден');
      } else {
        res.send({ data: user });
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

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('Пользователь не найден');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданны некорректные данные для обновления'));
      } else {
        next(err);
      }
    });
};

module.exports.register = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  User.find({ email })
    .then((result) => {
      if (result.length === 0) {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            name, email, password: hash,
          }))
          .then(() => {
            res.status(200).send({
              data: {
                name,
                email,
              },
            });
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new BadRequest('Переданны некорректные данные'));
            } else {
              next(err);
            }
          });
      } else {
        next(new Conflict('Такая почта уже зарегистрирована'));
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      console.log(token);
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: true,
        });
      res.send({ token, user });
    })
    .catch(() => {
      next(new Unauthorized('Неверно указана электронная почта или пaроль'));
    });
};
