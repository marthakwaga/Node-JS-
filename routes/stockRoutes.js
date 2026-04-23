const express = require('express');
const router = express.Router();

router.get('/add-stock', (req,res)=>{
    res.render('addstock')
})
router.post('/add-stock', (req,res)=>{
    console.log(req.body)
})





module.exports = router;