const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt.js');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');


// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

// Register user
router.post('register', async (req, res) => {
    const { name, email, password} = req.body;
    try {
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({ msg: 'User already exists'});
        }
        user = new User ({ name, email, password });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.status(200).json({
            msg: 'User registered successfully'
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
})

// Authenticate user and get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne( { email });
        if(!user){
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch){
            return res.status(200).json({ msg: 'Invalid credentials' });
        }
        const payload = { user: {id: user.id} };
        jwt.sign(
            payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
                if(err) throw err;
                res.status(200).json({ token })
            }
        );
    } catch (err){
        console.error(err.message);
        res.status(500).send('Server error')
    }
})