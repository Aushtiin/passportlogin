const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

router.get('/login', (req, res) => {
    res.render('login')
});

router.get('/register', (req, res) => {
    res.render('register')
});

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'please fill in all fields' })
    }

    if (password2 !== password) {
        errors.push({ msg: 'passowords do not match' });
    }

    if (password.length < 8) {
        errors.push({ msg: 'password must be at least 8 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    errors.push({ msg: 'email is already exists' })
                    res.render('register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newUser.password, salt, async (err, hash) => {
                            if (err) throw err;
                            //set new password to hash
                            newUser.password = hash;
                            //save user
                            await newUser.save();
                            req.flash('success_msg', 'Registration Successful');
                            res.redirect('/users/login');
                        }))
                }
            })
    }

})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You logged out successfully');
    res.redirect('/users/login');
})

module.exports = router;