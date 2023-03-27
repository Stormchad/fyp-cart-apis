const express = require('express')
const User = require('../models/user')
const Cart = require('../models/cart')
const Inventory = require('../models/Inventory')
const Product = require('../models/Product')
const auth = require('../middleware/verifyToken')
const verifyToken = require('../middleware/verifyToken')
const router = new express.Router()



router.post('/admin/cart/create', async (req, res) => {

    let cartNumber = req.body.cartNumber
    const cart = await Cart.findOne({cartNumber})
    if(cart)
    {
        res.status(400).send({message: "Cart with this cart number already exists"})
    }
    else
    {
        try
        {

            const cart1 = new Cart({ cartNumber,userConnection: false })
            await cart1.save()
            res.status(200).send({message: "SUCCESS", cart1})

        }
        catch(e)
        {
            res.status(400).send({ message: "Some error occured", e})
        }
    }

})


//delete cart by cart id
router.delete('/cart/:cartId',async (req,res) => {
    
    _id = req.params.cartId
    if(_id == null)
    {
        res.status(400).send({message: "Please enter a cartId"})
    }
    else
    {
        try
        {
           const cart = await Cart.findOne({_id})
           if(!cart)
           {
                res.status(400).send({message: "cart does not exist"})
           }
           else
           {
                await Cart.findOneAndDelete({_id})
                res.status(200).send({message:"SUCCESS",cart})
           }
        }
        catch(e)
        {
            res.status(400).send({message: "Error occured", e})
        }
    }

    
})

//get all carts
router.get('/carts',async(req,res)=>{
    try
    {
        const carts = await Cart.find()
        res.status(200).send(carts)
    }
    catch(e)
    {
        res.status(400).send({message: "Error occured", e})
    }
})


//get cart by cartId
router.get('/cart/:cartId', async (req,res)=>{

    _id = req.params.cartId
    try
    {
        const cart = await Cart.findOne({_id})
        res.status(200).send(cart)
    }
    catch(e)
    {
        res.status(400).send({message:"Error Occured"})
    }

})

//add to cart
router.post('/cart/addToCart/:cartNumber', verifyToken , async (req,res) => {

        productCode = req.body.productCode
        cartNumber = req.params.cartNumber

        if(cartNumber == null)
        {
            res.status(400).send({message:"Please enter cart number"})
        }
        else if(productCode == null)
        (
            res.status(400).send({message:"Please enter product code"})
        )
        else
        {

            try
            {
                const product = await Product.findOne({productCode: productCode})
                const cart = await Cart.findOne({cartNumber})
                const inventory = await Inventory.findOne({productCode:productCode})
        
                if(!product)
                {
                    res.status(400).send({message: "product with this product code not found"})
                }
                else if(!inventory)
                {
                    res.status(400).send({message: "Inventory not found for this product"})
                }
                else if(!cart)
                {
                    res.status(400).send({message: "Cart not found"})
                }
                else if(cart.userConnection == false)
                {
                    res.status(400).send({message: "Please connect to a cart first"})
                }                
                else
                {
                    let total = 0;
                    for(var i = 0; i < cart.products.length;i++)
                    {
	                    total = total + cart.products[i].productPrice
                    }
                    let q = inventory.quantity
                    await Inventory.findOneAndUpdate({productCode:productCode},{ quantity : q - 1 })
                    await Cart.findOneAndUpdate({cartNumber},{$push:{products: product}})
                    await Cart.findOneAndUpdate({cartNumber},{$set: {totalBill: total}})
                    res.status(200).send(await Cart.findOne({cartNumber}))
                }
            }
            catch(e)
            {
                res.status(400).send({message: "Error occured",e})
            }

        }
    
})

router.post('/cart/removeFromCart/:cartNumber', async (req,res) => {

    cartNumber = req.params.cartNumber
    productCode = req.body.productCode


    if(cartNumber = null)
    {
        res.status(400).send({message: "Please enter a cart number"})
    }
    else if(productCode == null)
    {
        res.status(400).send({message: "Please enter a product code"})
    }
    cartNumber = req.params.cartNumber
        productCode = req.body.productCode

        if(cartNumber == null)
        {
            res.status(400).send({message:"Please enter cart number"})
        }
        else if(productCode == null)
        (
            res.status(400).send({message:"Please enter product code"})
        )
        else
        {

            try
            {
                const product = await Product.findOne({productCode: productCode})
                const cart = await Cart.findOne({cartNumber})
                const inventory = await Inventory.findOne({productCode:productCode})
        
                if(!product)
                {
                res.status(400).send({message: "product with this product code not found"})
                }
                else if(!inventory)
                {
                    res.status(400).send({message: "Inventory not found for this product"})
                }
                else if(!cart)
                {
                    res.status(400).send({message: "Cart not found"})
                }
                else if(cart.userConnection == false)
                {
                    res.status(400).send({message: "Please connect to a cart first"})
                }                
                else
                {
                    let total = 0;
                    for(var i = 0; i < cart.products.length;i++)
                    {
	                    total = total + cart.products[i].productPrice
                    }
                    let q = inventory.quantity
                    await Inventory.findOneAndUpdate({productCode:productCode},{ quantity : q + 1 })
                    await Cart.findOneAndUpdate({cartNumber},{$pull:{products: product}})
                    await Cart.findOneAndUpdate({cartNumber},{$set: {totalBill: total}})
                    res.status(200).send(await Cart.findOne({cartNumber}))
                }
            }
            catch(e)
            {
                res.status(400).send({message: "Error occured",e})
            }

        }
    

})

//reset cart
router.post('/admin/cart/reset/:cartId', async (req,res)=>{

    _id = req.params.cartId

    if(cartNumber == null)
    {
        res.status(400).send({message:"Please enter cartId"})
    }
    else
    {
        try
        {
            const cart = await Cart.findOneAndUpdate({_id},{ $set: {products:[], totalBill:0, checkoutComplete: false, userConnection:false, username: null}})
            res.status(200).send({message:"SUCCESS",cart})
        }
        catch(e)
        {
            res.status(400).send({message:"Error ocurred"})
        }
        

    }

})


//delete cart by cartId
router.delete('/admin/cart/:cartId', async(req,res)=>{

    _id = req.params.cartId
    if(_id == null)
    {
        res.send(400).status({message:"Please enter cartId"})
    }
    else
    {
        const cart = await Cart.findOneAndDelete({_id})
        res.status(200).send({message:"SUCCESS",cart})
    }

})


//delete cart by cart number
router.delete('/admin/cart/', async(req,res)=>{

    cartNumber = req.body.cartNumber
    if(cartNumber == null)
    {
        res.status(400).send({message:"Please enter cart number"})
    }
    else
    {
        const cart = await Cart.findOneAndDelete({cartNumber})
        res.status(200).send({message:"SUCCESS",cart})
    }

})

router.get('/carts/connection', async(req,res)=>{

    userConnection=req.body.userConnection

    if(userConnection == true || userConnection == false)
    {
        const carts = await Cart.find({userConnection})
        res.status(200).send({carts})
    }
    else
    {
        res.status(500).send({message:"Incorrect input"})
    }

})

//payment 
router.post('/payment/:cartId', async (req,res)=>{

        try
        {
            
            

        }
        catch(e)
        {
            res.status(400).send({message:"Error ocurred"})
        }
        



//cartTotal 
router.post('/getTotal/:cartId', async (req,res)=>{

    _id = req.params.cartId

    if(_id == null || _id == "")
    {
        res.status(400).send({message:"please enter _id"})
    }
    try
    {
        const cart = await Cart.findOne({_id})
        res.status(200).send({total: cart.totalBill})
    }
    catch(e)
    {
        res.status(400).send({message:"some error occured",e})
    }
    

})



module.exports = router