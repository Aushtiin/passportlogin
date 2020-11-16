const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');

module.exports = async (passport) => {
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        let user = User.findOne(email);
        if (!user) return done(null, false, {message: 'Email not registered'})

        bcrypt.compare(password, user.password), (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, {message: 'Invalid password'})
            }
        }
    });
    passport.serialize((user, done) => {
        done(null, user.id);
    })

    passport.deserialize((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        })
    })
} 