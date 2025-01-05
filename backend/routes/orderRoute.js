// import express from "express"
// import authMiddleware from './../middleware/auth.js';
// import { placeOrder, verifyOrder, userOrders,listOrders,updateStatus } from "../controllers/orderController.js";

// const orderRouter = express.Router();

// orderRouter.post("/place",authMiddleware,placeOrder);
// orderRouter.post("/verify", verifyOrder)
// orderRouter.post("/userorders",authMiddleware,userOrders)
// orderRouter.get('/list',listOrders)
// orderRouter.post('/status', updateStatus)

// export default orderRouter;


import express from 'express';
import { getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import authMiddleware from '../middleware/auth.js';

const orderRouter = express.Router();

// Get all orders for admin panel
orderRouter.get('/list', getAllOrders);

// Update order status
orderRouter.post('/status', updateOrderStatus);

export default orderRouter;