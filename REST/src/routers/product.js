const express = require('express')
const User = require('../models/user')
const Cart = require('../models/cart')
const Inventory = require('../models/Inventory')
const Product = require('../models/Product')
const auth = require('../middleware/verifyToken')
const router = new express.Router()


//create new product
router.post('/admin/product/create', async (req,res) =>{

    productCode = req.body.productCode
    productName = req.body.productName
    productPrice = req.body.productPrice

    if(productCode == null)
    {
        res.status(400).send({message:"Enter productCode"})
    }
    else if(productName == null)
    {
        res.status(400).send({message:"Enter productName"})
    }
    else if(productPrice == null)
    {
        res.status(400).send({message:"Enter productPrice"})
    }
    else
    {
        try
        {
            const product = new Product({ productName, productPrice, productCode })
            await product.save()
            res.status(200).send({message:"SUCCESS",product})
        }
        catch(e)
        {
            res.status(200).send({message:"Error Occured",e})
        }
    
    }


})


//get all products
router.get('/products',async( req , res ) => {

    const products = await Product.find()
    res.status(200).send(products)

})


//get product by product id
router.get('/product/:productId', async ( req, res) => {

    _id = req.params.productId

    if(_id == null)
    {
        res.status(400).send({message:"Please enter productId"})
    }
    else
    {
        try
        {
            const product = await Product.findOne({_id})
            res.status(200).send(product)
        }
        catch(e)
        {
            res.status(400).send({message:"Error occurred",e})
        }
        
    }

})

//get product by product name
router.get('/product', async ( req , res ) => {

    productName = req.body.productName

    if(productName == null || productName == "")
    {
        res.status(400).send({message:"Please enter productName"})
    }
    else
    {
        try
        {
            const product = await Product.findOne({productName})
            res.send({message:"SUCCESS",product})
        }
        catch(e)
        {
            res.status(500).send({message:"Error occurred"})
        }
        
    }

})

router.delete('/admin/product/:productId', async ( req , res ) => {

    _id  = req.params.productId

    if(_id == null)
    {
        res.status(400).send({message:"please enter id"})
    }
    else
    {
        try
        {
            const product = await Product.findOneAndDelete({_id})
            res.status(200).send({message:"SUCCESS",product})
        }
        catch(e)
        {
            res.status(500).send({message:"Error occured",e})
        }
        
    }
})

//update user
router.put('/product/:productId', async (req, res) => {

    _id = req.params.productId
    jsonBody = req.body

    if(_id == null)
    {
        res.status(400).send({ message: "Please enter productId"})
    }
    else
    {
        try
        {
            for (var key in jsonBody) 
            {

                if(key.trim() == "productName")
                {
                    await Product.findOneAndUpdate({_id},{productName: jsonBody[key]})
                }
                else if(key.trim() == "productPrice")
                {
                    await Product.findOneAndUpdate({_id},{productPrice: jsonBody[key]})
                }
                else if(key.trim() == "productCode")
                {
                    await Product.findOneAndUpdate({_id},{productCode: jsonBody[key]})
                }
                else
                {
                    console.log("no key value match")
                }

            }

            const productNew = await Product.findOne({_id})
            res.status(200).send({productNew})

        }
        catch(e)
        {
            res.status(400).send({ message: "Some error occured", e})
        }
    }
    
})



module.exports = router