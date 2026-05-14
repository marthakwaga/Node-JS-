const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale')
const Stock = require('../models/Stock')

// Todo: Add authentication middleware to restrict access to sales routes
const {isAttendant, isManager, isAdmin} = require('../middleware/auth') 

//Add sale to Db
// router.get('/addsale', async(req,res)=>{
//     try{
//         const items = await Stock.find({quantity:{$gt:0}});
//         res.render('add_sale', {items});
//     }catch(error){
//         res.status(500).send('server error');
//         console.error('error', error.message);
//     }
// });
// router.post('/addsale', async(req,res)=>{
//     // console.log(req.body)
//     try{
//         const {saleDate, representative, customerPhone, qty, unitPrice, grandTotal, transportFee} = req.body;
//         const stockItem = await Stock.findOne({productSelect: req.body.productSelect});
//         if(!stockItem) return res.status(404).send('Item not found');
//         if(stockItem.quantity < qty){
//             return res.status(400).send('Not enough stock available');
//         }
//          // Deduct quantity sold from stock quantity and save the new quantity to the stock collection

//          stockItem.quantity -= qty
//          await stockItem.save()

//          //Record Sale
//          const newSale = new Sale({
//             saleDate,
//             representative: req.user._id,
//             customerPhone: req.body.customerPhone,
//             items: [{
//                 productSelect: req.body.productSelect,
//                 qty: req.body.qty,
//                 unitPrice: req.body.unitPrice,
//                 grandTotal: req.body.grandTotal
//             }],
//             transportCharge: req.body.transportFee
//          });
//          console.log(newSale);
//          await newSale.save().then((result)=>{
//             console.log(result);}).catch((err)=>{
//                 console.error(err);
//             });
//          res.redirect(`/receipt/${newSale._id}`);
//     } catch (error) {
//         res.render("add_sale", {error:error.message});
//     }
// });

//Get sales from the Db
// router.get("/inventory", (req, res) => {
//   res.render("saleslist");
// });

//Api route to fetch sales data for the sales list page
// router.post('/addsale', async (req, res) => {

//     try {

//         const sale = new Sale({

//             saleDate: req.body.saleDate,

//             representative: req.body.representative,

//             customerPhone: req.body.customerPhone,

//             items: req.body.items,

//             transportFee: req.body.transportFee,

//             grandTotal: req.body.grandTotal
//         });

//         await sale.save();

//         res.status(201).json({
//             success: true,
//             message: 'Sale saved successfully'
//         });

//     } catch (error) {

//         console.log(error);

//         res.status(500).json({
//             success: false,
//             message: 'Server Error'
//         });
//     }
// });

router.post('/addsale', async (req, res) => {

    try {

        const {
            saleDate,
            representative,
            customerPhone,
            items,
            transportFee,
            grandTotal
        } = req.body;

        // Check stock
        for (const item of items) {

            const stockItem = await Stock.findOne({
                productName: item.product
            });

            if (!stockItem) {

                return res.status(404).json({
                    success: false,
                    message: `${item.product} not found`
                });
            }

            if (stockItem.quantity < item.qty) {

                return res.status(400).json({
                    success: false,
                    message: `Not enough stock for ${item.product}`
                });
            }

            stockItem.quantity -= item.qty;

            await stockItem.save();
        }

        // Save sale
        const sale = new Sale({

            saleDate,
            representative,
            customerPhone,
            items,
            transportFee,
            grandTotal
        });

        await sale.save();

        res.status(201).json({

            success: true,
            message: 'Sale saved successfully'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: 'Server Error'
        });
    }
});

//Delete Route
router.delete('/deletesale/:id', async(req,res)=>{
    try{
        await Sale.findByIdAndDelete(req.params.id);
        res.redirect('/salesList');
    }catch(error){
        console.error(error.message);
        res.status(500).send('Unable to delete sale from the DB');
    }
});

//Receipt Route - view and print a sale receipt
router.get('/receipt/:id', async(req,res)=>{
    try{
        const sale = await Sale.findById(req.params.id)
        .populate("productCode", "productName")
        .populate("representative", "name");
        if(!sale) return res.status(404).send('Receipt not found');
        res.render('receipt', {sale});
    }catch(error){
        console.error(error.message);
        res.status(500).send('Unable to fetch sale details');
    }
}); 
module.exports = router; 