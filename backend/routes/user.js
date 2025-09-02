
const express = require('express');
const router = express.Router();
const zod = require('zod');
const jwt = require('jsonwebtoken');
const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddlware } = require('../middleware');

const signupBody = zod.object({
    username: zod.email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
})
const signinBody = zod.object({
    username: zod.email(),
    password: zod.string()
})

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.post("/signup", async (req, res) => {
    // const body = req.body;
    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken/incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/incorret inputs"
        })
    }
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })
    const userId = user._id ;
    
    await Account.create({
        userId , balance: 1 + Math.random()*10000
    })

    
    const token = jwt.sign({
        userId
    }, JWT_SECRET);
    res.json({
        message: "User created Successfully",
        token: token
    })
})


router.post("/signin", async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Incorrect inputs"
        })
    }
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    })

    if (user) {
        const token = jwt.sign({
            userid: user._id
        }, JWT_SECRET);

        res.json({
            token: token
        })
        return
    }

    res.status(411).json({
        message: "Error while loggin in"
    })
})

router.put("/", authMiddlware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            messsage: "Error while updating information"
        })
    }

    await User.updateOne({ _id: req.userId }, req.body)
    res.json({
        message: "Updated Successfully"
    })
})

// very imp
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})
module.exports = router