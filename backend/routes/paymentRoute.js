import { checkout, verifyEsewa, getUserOrders, removeOrder } from '../controllers/paymentController.js';
import authMiddleware from './../middleware/auth.js';
import express from 'express';

const paymentRouter = express.Router();

paymentRouter.post('/checkout', authMiddleware, checkout);
paymentRouter.get('/verify-esewa', verifyEsewa);
paymentRouter.get('/failed', (req, res) => {
    res.redirect('http://localhost:3000/payment/failed'); // Update with your frontend failure page URL
});


paymentRouter.get('/user-orders', authMiddleware, getUserOrders);

paymentRouter.delete('/remove-order/:orderId', authMiddleware, removeOrder);

export default paymentRouter
