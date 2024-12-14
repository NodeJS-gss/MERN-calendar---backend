
/**
 * Auth routes
 * host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { createUser, loginUser, renewtoken } = require('../controllers/auth');
const { fieldValidator } = require('../middlewares/field-validator');
const { validateJWT } = require('../middlewares/validate-jwt');

router.post(
    '/new', 
    [
        check('name', 'The name is required').not().isEmpty(),
        check('email', 'The email is not valid').isEmail(),
        check('password', 'The password must be at least 6 caracters').isLength({ min: 6 }),
        fieldValidator
    ], 
    createUser
);
router.post(
    '/', 
    [
        check('email', 'The email is not valid').isEmail(),
        check('password', 'The password must be at least 6 caracters').isLength({ min: 6 }),
        fieldValidator
    ],
    loginUser
);
router.get(
    '/renew',
    validateJWT,
    renewtoken
);

module.exports = router;