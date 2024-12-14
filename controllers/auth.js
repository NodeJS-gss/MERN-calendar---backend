const { response } = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const createUser = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        let user = await User.findOne({ email });

        if(user) {
            return res.status(400).json({
                ok: false,
                msg: 'The email has already been taken'
            });
        }

        user = new User( req.body );

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        const token = await generateJWT(user.id, user.name);
    
        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
        
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            ok: false,
            msg: "Something went wrong"
        });
        
    }
}

const loginUser = async(req, res = response) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({
                ok: false,
                msg: 'These credentials do not match our records.'
            });
        }

        const validPassword = bcrypt.compareSync( password, user.password );

        if(!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'These credentials do not match our records.'
            });
        }

        // JWT
        const token = await generateJWT(user.id, user.name);

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token 
        });
        
    } catch (error) {
        console.log(error);
        
        res.status(500).json({
            ok: false,
            msg: "Something went wrong"
        });
        
    }
}

const renewtoken = async(req, res = response) => {

    const user = req.user;
    const token = await generateJWT(user.uid, user.name);

    res.json({
        ok: true,
        token
    });

}

module.exports = {
    createUser,
    loginUser,
    renewtoken
}