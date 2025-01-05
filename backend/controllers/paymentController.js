import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import Payment from '../models/paymentModel.js';

dotenv.config();

// Define createSignature as a regular function
const createSignature = (message) => {
    const secret = "8gBm/:&EnhH.1/q";
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(message);

    const hashInBase64 = hmac.digest("base64");
    return hashInBase64;
};

const checkout = async (req, res) => {
    try {
        const { totalAmount, cartItems } = req.body;
        console.log('Received checkout request:', { totalAmount, cartItems });

        if (!req.user || !req.user.id) {
            console.log('User ID missing in request');
            return res.status(400).json({ message: "User ID is missing in the request." });
        }

        const uid = `${req.user.id}-${uuidv4()}`;
        console.log('Generated transaction UUID:', uid);

        // Store the transaction data
        const payment = await Payment.create({
            userId: req.user.id,
            transactionUuid: uid,
            cartItems,
            totalAmount,
            status: 'Food Processing'
        });
        console.log('Payment record created:', payment);

        // Format amount to two decimal places
        const formattedAmount = Number(totalAmount).toFixed(2);

        // Prepare signed fields
        const signedFieldsString = `total_amount=${formattedAmount},transaction_uuid=${uid},product_code=EPAYTEST`;
        const signature = createSignature(signedFieldsString);
        console.log('Generated signature:', signature);

        const formData = {
            amount: formattedAmount,
            failure_url: `${process.env.BASE_URL}/api/payment/failed`,
            product_delivery_charge: "0.00",
            product_service_charge: "0.00",
            product_code: "EPAYTEST",
            signature,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            success_url: `${process.env.BASE_URL}/api/payment/verify-esewa`,
            tax_amount: "0.00",
            total_amount: formattedAmount,
            transaction_uuid: uid,
        };

        console.log('Prepared eSewa form data:', formData);

        res.json({
            message: "Order Created Successfully",
            formData,
            payment_method: "esewa"
        });
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
};

const verifyEsewa = async (req, res) => {
    try {
        const { data } = req.query;
        const decodedData = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));

        if (decodedData.status !== "COMPLETE") {
            return res.status(400).json({ message: "Error in transaction status" });
        }

        const message = decodedData.signed_field_names
            .split(",")
            .map(field => `${field}=${decodedData[field] || ""}`)
            .join(",");

        const expectedSignature = createSignature(message); // Call it directly

        if (decodedData.signature !== expectedSignature) {
            return res.status(400).json({ message: "Invalid signature" });
        }

        const userId = decodedData.transaction_uuid.split("-").pop();

        if (!userId || userId === 'undefined') {
            return res.status(400).json({ message: "User ID is missing in transaction UUID." });
        }

        // Retrieve the payment record with cartItems associated with this transaction_uuid
        const payment = await Payment.findOne({ transactionUuid: decodedData.transaction_uuid });

        if (!payment || !payment.cartItems) {
            return res.status(400).json({ message: "No cart items found." });
        }

        // Mark the payment as complete
        payment.status = 'COMPLETE';
        await payment.save();

        res.redirect("http://localhost:5173/cart");
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({ error: err.message || "No Orders found" });
    }
};

const getUserOrders = async (req, res) => {
    try {
        // Find all payments/orders for the current user and populate full product details
        const orders = await Payment.find({ userId: req.user.id })
            .populate({
                path: 'cartItems.productId',
                model: 'food', // Make sure this matches your food model name
                select: 'name price image' // Include the image field
            })
            .sort({ createdAt: -1 });

        // Format the orders for frontend, now including image
        const formattedOrders = orders.map(order => ({
            _id: order._id,
            items: order.cartItems.map(item => ({
                name: item.productId?.name || 'Product Not Found',
                quantity: item.quantity,
                price: item.price,
                image: item.productId?.image || null // Include the image URL
            })),
            totalAmount: order.totalAmount,
            status: order.status,
            createdAt: order.createdAt,
        }));

        res.json({
            success: true,
            data: formattedOrders
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

export { checkout, verifyEsewa, getUserOrders };
