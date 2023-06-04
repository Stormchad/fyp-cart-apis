            const express = require('express')
            const User = require('../models/User')
            const Cart = require('../models/Cart')
            const Inventory = require('../models/Inventory')
            const Product = require('../models/Product')
            const verifyToken = require('../middleware/verifyToken')
            const router = new express.Router()


            //update inventory for a product
            router.post('/admin/inventory',async (req, res) => {

                const productCode = req.body.productCode
                const q = req.body.quantity

                if(productCode == null || productCode == "")
                {
                    res.status(400).send({message:"Please enter productCode"})
                }
                else if(q == null)
                {
                    res.status(400).send({message:"Please enter quantity"})
                }
                else
                {
                    try
                    {
                        const product = await Product.findOne({ productCode })
                        const inventory = await Inventory.findOne({ productCode })
                    
                        if(!product)
                        {
                        console.log("1")
                        res.status(400).send({message:"Product not found - Try creating the product first"})   
                        }
                        if(!inventory)
                        {   
                            console.log("2")
                            var i1 = new Inventory ({productCode, quantity:q})
                            await i1.save()
                            res.status(200).send({message: "SUCCESS", i1})   
                        }
                        else if(inventory)
                        {
                            console.log("3")
                            const inventory1 = await Inventory.findOneAndUpdate({productCode},{quantity:q}) 
                            res.status(200).send({message: "SUCCESS", inventory1})
                        }
                    }   
                    catch(e)
                    {
                        res.status(500).send({message:"Error occurred",e})   
                    } 
                }

            })

            //get inventory by inventoryId
            router.get('/admin/inventory/:inventoryId', async (req, res) =>{

                _id = req.params.inventoryId

                if(_id == null || _id == "")
                {
                    res.status(400).send({message: "Please enter inventoryId"})
                }

                try
                {
                    const inventory = await Inventory.findOne({ _id })
                    if(!inventory)
                    {
                        res.status(404).send({message: "Inventory not found"})
                    }
                    else
                    {
                        res.status(200).send({inventory})                        
                    }

                }
                catch(e)
                {
                    res.status(500).send({message: "Some error occurred", e})
                }
            })

            //get inventory by productCode
            router.get('/admin/inventory/' ,async ( req, res ) => {
                
                productCode = req.body.productCode

                if(productCode == null || productCode == "")
                {
                    res.status(400).send({message:"Please enter a product code"})
                }
                else
                {
                    try
                    {
                        const inventory = await Inventory.findOne({productCode})
                        res.status(200).send({inventory})
                    }
                    catch(e)
                    {
                        res.status(500).send({message:"Error occurred",e})
                    }
                    

                }
            })

            //get all Inventory
            router.get('/inventories/all', async( req , res ) => {

            const inventory = await Inventory.find()
            res.status(200).send(inventory)

            })


            module.exports = router