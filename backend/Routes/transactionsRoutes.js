const express = require('express'); 
const router = express.Router();   
const transactionsController = require('../Controllers/transactionsControllers');
const verifyToken = require('../middlewares/authMiddleware');

router.use(verifyToken); 

router.get('transactions/getAll/', transactionsController.getAll);
router.post('transactions/create', transactionsController.create);
router.post('transactions/search', transactionsController.search);
router.put('transactions/update/:id', transactionsController.update);
router.patch('transactions/patch/:id', transactionsController.partialUpdate);
router.delete('transactions/delete/:id', transactionsController.remove);

module.exports = router;

