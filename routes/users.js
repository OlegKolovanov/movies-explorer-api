const router = require('express').Router();
const { validatePatchUser } = require('../middlewares/validation');

const {
  getUser,
  updateUser,
} = require('../controllers/users');

router.get('/me', getUser);
router.patch('/me', validatePatchUser, updateUser);

module.exports = router;
