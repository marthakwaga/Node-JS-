const express = require('express');
const router = express.Router();

router.get('/supplier-reg', (req,res)=>{
    res.render('supplier_reg')
})
router.post('/supplier_reg', (req,res)=>{
    console.log(req.body)
})

module.exports = router;