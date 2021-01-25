const router = require('express').Router();
const User = require('../models/user.model');

router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/getUser').post((req, res) => {
    User.find({username:req.body.user})
        .then(user => {
            if (user.length == 0){
                res.json({user: req.body.user, result: 'user not found!'})
            }
            else if(user[0].password === req.body.password){
                res.json({user: req.body.user, result: 'success'})
            }
            else{
                res.json({user: req.body.user, result: 'password incorrect'})
            }
        })
        .catch(err => res.status(400).json('Error: ' + err.message));
});


router.route('/add').post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const newUser = new User({username, password});

    newUser.save()
        .then(() => {
            console.log('user added');
            res.json('user added!')
        })
        .catch(err => {
            res.status(400).json('Error: ' + err.message)
        });
});

module.exports=router;