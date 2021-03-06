const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const sendMail = require('../config/sendMailOpt');
const UserModel = require('../model/UserModel');
const path = require('path');

const bcrypt = require('bcrypt');
const saltRounds = 10;
//////


// forgotPassword
router.post('/forgot-password', function (req, res, next) {
    let email = req.body.email;
    console.log(email);
    let password = getPassword(8)  //length randomPassword is 8
    let html = `<p>new password: ${password} click here to login <a href="${req.protocol + '://' + req.get('host')}/login">Tai day</a></p>`
    UserModel.findOne({ email: email })
        .then(function (value) {
            if (value) {
                return bcrypt.hash(password, saltRounds)
            }
            else {
                throw 'Account not actived'
            }
            })
        .then(function (hash) {
            return UserModel.updateOne({ email: email }, { password: hash })
        })
        .then(function (value) {
            sendMail(email, 'new password', html)
            res.json({
                code: 200,
                message: 'success'
            })
        })
        .catch(function (err) {
            res.json({
                code: 404,
                error: err,
                message: err
            })
        })
})


module.exports = router;



function getPassword(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}