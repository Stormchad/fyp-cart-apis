        const express = require('express')
        const User = require('../models/user')
        const Cart = require('../models/cart')
        const verifyToken = require('../middleware/verifyToken')
        const jwt = require('jsonwebtoken')
        const router = new express.Router()
        const dotenv = require('dotenv');
        const bcrypt = require('bcrypt')
        dotenv.config()


        const generateSpecialCode = () =>{
        return Math.random().toString(36).slice(2, 7);
        }

        const isAdmin = (token) =>{
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const adminPrevilages = decoded.user.adminPrevilages
        if(adminPrevilages == true){   return true  }
        else{   return false;   }

        }


        //admin login
        router.post('/admin/login', async (req, res) =>{

        username = req.body.username
        password = req.body.password

        if(username == null || password == null || username == "" || password == "" || username == " " || password == " ")
        {
            res.status(400).send({message:"Please enter username or password"})
        }
        else
        {
            try
            {
                let user = await User.findOne({ username, adminPrevilages: true })

                if(!user)
                {
                    res.status(404).send({message: "user not found"})
                }
                else
                {
                    
                    const validPass = await bcrypt.compare( password, user.password )

                    if(validPass)
                    {
                        const newUser = { username: user.username, email: user.email, password: user.password, adminPrevilages: user.adminPrevilages, displayName: user.displayName}

                        const token = jwt.sign({ newUser }, "IOTCART", { expiresIn:'300s' })
                        const newUser1 = await User.findOneAndUpdate({ username,password },{ $set: {token} })
                        res.status(200).send({ newUser1 })
                    }
                    else
                    {
                        res.status(500).send({message:"login failed."})        
                    }
                    

                }
                
            }
            catch(e)
            {
                res.status(500).send({message:"Some error occurred"})
            }
        }


        })

        //user login
        router.post('/user/login',async( req, res) => {


        let username = req.body.username
        let password = req.body.password

        if(username == null || password == null || username == "" || password == "" || username == " " || password == " ")
        {
            res.status(400).send({message:"Please enter username or password"})
        }

        else
        {
            try
            {
                
                let user = await User.findOne({ username })

                if(!user)
                {
                    res.status(404).send({message: "user not found"})
                }
                else
                {
                    
                    const validPass = await bcrypt.compare( password, user.password )

                    if(validPass)
                    {
                        const newUser = { username: user.username, email: user.email, password: user.password, adminPrevilages: user.adminPrevilages, displayName: user.displayName}

                        const token = jwt.sign({ newUser }, "IOTCART", { expiresIn:'300s' })
                        const user1 = await User.findOneAndUpdate({ username,password },{ $set: {token} })
                        res.status(200).send({ user })
                    }
                    else
                    {
                        res.status(500).send({message:"login failed."})        
                    }
                    

                }

                
            }
            catch(e)
            {
                res.status(500).send({message:"Some error occurred"})
            }
        }

        })


        //create new user
        router.post('/users/register', async (req, res) => {

            let username = req.body.username
            let email = req.body.email
            let password = req.body.password
            let displayName = req.body.displayName

            const hashedPassword = await bcrypt.hash(password, 8)
            
            try
            {
                var user = await User.findOne({ username: username , email: email })
                if(!user)
                {
                    const user1 = new User({ username, email, password: hashedPassword, displayName, adminPrevilages:false })

                    await user1.save()
                    res.status(200).send({message: "SUCCESS", user1 })
                }
                else
                {
                    res.status(400).send({ message: "user already exists" })
                }
            }
            catch(e)
            {
                res.status(400).send({ message: "Some error occured", e})
            }
        })

        //create new admin
        router.post('/admins/register', async (req, res) => {

        let username = req.body.username
        let email = req.body.email
        let password = req.body.password
        let displayName = req.body.displayName

        try{

        var user = await User.findOne({ username: username , email: email })
        if(!user)
        {
            
            const hashedPassword = await bcrypt.hash(password, 10)

            const user1 = new User({ username, email, password: hashedPassword, displayName, adminPrevilages:true })
            await user1.save()
            res.status(200).send({message: "SUCCESS", user1 })
        }
        else{
            res.status(400).send({ message: "user already exists" })
        }
        }
        catch(e)
        {
            res.status(400).send({ message: "Some error occured", e})
        }

        })


        //get all users
        router.get('/users', async (req, res) => {
                const list = await User.find()
                res.status(200).send({list})

        })


        //get user by id
        router.get('/user/:userId', verifyToken , async (req, res) => {
        try 
        {
            let _id = req.params.userId
            const user = await User.findOne({_id})
            if(user)
            {
            res.status(200).send({message: "SUCCESS",user})
            }
            else
            {
                res.status(400).send({message: "user with this id not found"})
            }
        }
        catch (e) 
        {
            res.status(400).send({mesage: "Error occured"})
        }
        })


        //get user by username
        router.get('/users/username', verifyToken , async (req, res) => {
        try 
        {
            let username = req.body.username
            const user = await User.findOne({username})
            if(user)
            {
                res.status(200).send({message: "SUCCESS", user})
            }
            else
            {
                res.status(400).send({message: "User with this username not found", e})
            }
        }
        catch (e) 
        {
            res.status(400).send({mesage: "Error occured", e})
        }
        })


        //connect to cart
        router.post('/users/:userId/connect', async (req, res) => {

        let specialCode = req.body.specialCode
        let _id = req.params.userId

        if(specialCode == null || specialCode == "")
        {
            res.status(400).send({message: "Please enter special Code"})
        }
        else if(_id == null || _id == "")
        {
            res.status(400).send({message: "Please enter id"})
        }
        else
        {
            try
            {
                const user = await User.findOne({_id})
                const cart = await Cart.findOne({ specialCode })
                if(!user)
                {
                    res.status(400).send({message: "User not found"})
                }
                else if(!cart)
                {
                    res.status(400).send({message: "Cart not found"})
                }
                else if(user.cartConnection == true)
                {
                    res.status(500).send({message: "User is already connected to a cart"})
                }
                else if(cart.userConnection == true)
                {
                    res.status(500).send({message:"Cart is already linked to a user"})
                }
                else
                {
                    const dispUser = await User.findOneAndUpdate({ _id },{ cartConnection:true })
                    const dispCart = await Cart.findOneAndUpdate({ specialCode },{ username:user.username , userConnection:true })
                    res.status(200).send({message: "SUCCESS",dispCart, dispUser})
                }
                
        }
        catch(e)
        {
            res.status(400).send({ message: "Some error occured", e})
        }

        }

        })


        //remove cart connection
        router.post('/users/:userId/disconnect',async (req,res) => {

        try
        {
            _id = req.params.userId
            const user = await User.findOne({_id})

            if(!user)
            {
                res.status(400).send({message:"User not found"})
            }
            else
            {
                const username = user.username
                const cart = await Cart.findOne({username})
                if(!cart)
                {
                    res.status(400).send({message: "User is not connected to any cart"})
                }
                else
                {
                    const user1 = await User.findOneAndUpdate({_id},{cartConnection:false})
                    const cart1 = await Cart.findOneAndUpdate({ username },{userConnection:false, username:null})
                    res.status(200).send({message:"SUCCESS",user1, cart1})
                }
            }
            
        }
        catch(e)
        {
            res.status(400).send({message: "Error occured", e})
        }
        })


        //delete user
        router.delete('/user/:userId', verifyToken ,async (req,res) => {


        try
        {
            let _id = req.params.userId
            if(_id == null)
            {
                res.status(400).send({message:"Please enter user id"})
            }
            else
            {
                const user = await User.findOneAndDelete({_id})
                res.status(200).send({message: "SUCCESS",user})
            }
            
        }
        catch(e)
        {
            res.status(500).send({message: "Error occured", e})
        }
        })

        

        // logout
        router.post('/user/logout', verifyToken, async (req, res) => {

            try
            {
                const token = req.header('Authorization')
                const decoded = jwt.verify(token, "IOTCART")
                const username = decoded.user.username
                const user = await User.findOneAndUpdate({ username },{$set: {token: null}})
                res.status(200).send({message:"user logged out successfully!"})

            }
            catch(e)
            {
                res.status(400).send({ message: "Some error occured", e})
            }
        })
        

        //update user
        router.put('/user/:userId', verifyToken , async (req, res) => {

            _id = req.params.userId
            jsonBody = req.body

            if(_id == null)
            {
                res.status(400).send({ message: "Please enter userId"})
            }
            else
            {
                try
                {
                    for (var key in jsonBody) 
                    {

                        if(key.trim() == "username")
                        {
                            await User.findOneAndUpdate({_id},{username: jsonBody[key]})
                        }
                        else if(key.trim() == "email")
                        {
                            await User.findOneAndUpdate({_id},{email: jsonBody[key]})
                        }
                        else if(key.trim() == "password")
                        {
                            await User.findOneAndUpdate({_id},{password: jsonBody[key]})
                        }
                        else if(key.trim() == "displayName")
                        {
                            await User.findOneAndUpdate({_id},{displayName: jsonBody[key]})
                        }
                        else if(key.trim() == "cartConnection")
                        {
                            await User.findOneAndUpdate({_id},{cartConnection: jsonBody[key]})
                        }
                        else if(key.trim() == "specialCode")
                        {
                            await User.findOneAndUpdate({_id},{specialCode: jsonBody[key]})
                        }
                        else
                        {
                            console.log("no key value match")
                        }

                    }

                    const userNew = await User.findOne({_id})
                    res.status(200).send({userNew})

                }
                catch(e)
                {
                    res.status(400).send({ message: "Some error occured", e})
                }
            }
            
        })
        

        module.exports = router