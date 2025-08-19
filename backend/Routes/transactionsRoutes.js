const express = require('express'); 
const router = express.Router();   
const transactionsController = require('../Controllers/transactionsControllers');
const verifyToken = require('../middlewares/authMiddleware');

router.use(verifyToken); 

router.get('/getAll/', transactionsController.getAll);
router.post('/create', transactionsController.create);
router.post('/search', transactionsController.search);
router.put('/update/:id', transactionsController.update);
router.patch('/patch/:id', transactionsController.partialUpdate);
router.delete('/delete/:id', transactionsController.remove);

module.exports = router;

