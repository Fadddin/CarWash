import express, { Request, Response } from 'express';
import User from '../model/User';

const router = express.Router();


router.post('/signup', async (req, res) => {
    const {name , email, password , phone} = req.body;

    try {    

        const newUser = new User({name, email, password, phone});
        await newUser.save();

        res.status(201).json({
            message : 'User created successfully'
        })

    } catch (error) {
        
        res.status(500).json({
            message : error
        })
    }
})

router.post('/signin', async (req, res) => {
    const {email, password} = req.body;

    try {    

        const user = await User.findOne({ email , password});

        if(user) {
            res.status(201).json({
                message : 'Signed in successfully'
            })
        } else {
            res.status(404).json({
                message : 'User not found'
            })
        }

    } catch (error) {
        
        res.status(500).json({
            message : error
        })
    }
})

router.get('/all', async (req, res) => {
    try {    

        const users = await User.find();

        res.status(201).json({
            users
        })

    } catch (error) {
        
        res.status(500).json({
            message : error
        })
    }
})





export const userRoutes = router;