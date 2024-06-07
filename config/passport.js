const jwtStrtegy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = require('../models/User')
const dotenv = require('dotenv');
dotenv.config();

const opts = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

module.exports = passport => {
    passport.use(
        new jwtStrtegy(opts, (jwt_payload, done) => {
            User.findById(jwt_payload.user.id)
            .then(user => {
                if( user) {
                    return done(null, user);
                }
                return done(null, false)
            })
            .catch (err => console.error(err));
        })
    );
};