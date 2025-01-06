import Payment from "../models/paymentModel.js";
import userModel from "../models/userModel.js";

export const getAllOrders = async (req, res) => {
    try {
        // First check if userModel exists to prevent schema errors
        await userModel.exists({});

        // Fetch all payments and populate user and product details
        const orders = await Payment.find()
            .populate({
                path: 'userId',
                model: userModel,  // Using userModel directly
                select: 'name email phone'
            })
            .populate('cartItems.productId')
            .sort({ createdAt: -1 });

        // Transform the data to match the expected format in the admin panel
        const formattedOrders = orders.map(order => {
            const user = order.userId || {};
            return {
                _id: order._id,
                items: order.cartItems.map(item => ({
                    name: item.productId?.name || 'Product Not Found',
                    quantity: item.quantity,
                    price: item.price
                })),
                amount: order.totalAmount,
                status: order.status || 'Food Processing',
                paymentMethod: 'esewa',
                paymentStatus: 'COMPLETE',
                transactionId: order.transactionUuid,
                address: {
                    firstName: user.name?.split(' ')[0] || 'N/A',
                    lastName: user.name?.split(' ')[1] || '',
                    phone: user.phone || 'N/A',
                    email: user.email || 'N/A',
                    city: 'N/A',
                    state: 'N/A',
                    country: 'N/A',
                    zipcode: 'N/A'
                },
                createdAt: order.createdAt
            };
        });

        res.json({
            success: true,
            data: formattedOrders
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        const order = await Payment.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.status = status;
        await order.save();

        res.json({
            success: true,
            message: 'Order status updated successfully'
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
};