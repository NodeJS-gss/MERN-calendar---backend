 const { response, request } = require('express');
 const jwt = require('jsonwebtoken');

const validateJWT = (req = request, res = response, next) => {

    const authHeader = req.header('Authorization');

    if(!authHeader) {
        return res.status(401).json({
            ok: false,
            msg: "Token not found"
        });
    }

    const [ scheme, token ] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({
            msg: 'Token not valid'
        });
    }

    try {

        const payload = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        req.user = payload;
        next();
        
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: "Token not valid"
        });
    }
}

module.exports = {
    validateJWT
}