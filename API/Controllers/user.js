const mongoose = require('mongoose');
const User = require('../Models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.user_signup = (req, res, next) => {
    User.find({ email : req.body.email })
    .exec()
    .then(user => {
        if(user.length >= 1) {
            return res.status(409).json({
                message : "EMail Exists"
            });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error : err
                    });
                } else {
                    const user = new User({
                        _id : new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password : hash
                    });
                    user
                    .save()
                    .then(result => {
                        console.log("USER : " + result);
                        res.status(201).json({
                            message : 'User Created'
                        });
                    })
                    .catch(err => {
                        console.log("ERROR : " + err);
                        res.status(500).json({
                            error : err
                        });
                    });
                }
            });
        }
    })
};

exports.user_login = (req, res, next) => {
    User.findOne({ email : req.body.email })
    .exec()
    .then(user => {
        if(!user) {
            return res.status(404).json({
                message : "Auth Failed"
            });
        }
        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if(err) {
                return res.status(404).json({
                    message : "Auth Failed"
                });
            }
            if(result) {
                const token = jwt.sign({
                    email : user.email,
                    userId : user._id
                },
                process.env.JWT_KEY,
                {
                    expiresIn : "1h"
                });
                return res.status(200).json({
                    message : "Auth Successful",
                    token : token
                });
            }
            res.status(404).json({
                message : "Auth Failed"
            });
        });
    })
    .catch(err => {
        console.log("ERROR : " + err);
        res.status(500).json({
            error : err
        });
    });
};

exports.user_delete = (req, res, next) => {
    User.deleteOne({_id : req.params.userId})
    .exec()
    .then(result => {
        res.status(200).json({
            message : "User Deleted"
        });
    })
    .catch(err => {
        console.log("ERROR : " + err);
        res.status(500).json({
            error : err
        })
    });
};