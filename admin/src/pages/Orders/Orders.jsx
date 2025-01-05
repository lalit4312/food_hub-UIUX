import React, { useState, useEffect } from 'react'
import './Orders.css'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../../../../frontend/src/assets/assets'

const Orders = ({ url }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchAllOrders = async () => {
    try {
      setLoading(true)
      console.log('Fetching orders from:', `${url}/api/order/list`)

      const response = await axios.get(`${url}/api/order/list`)
      console.log('Server response:', response.data)

      if (response.data.success) {
        setOrders(response.data.data)
      } else {
        toast.error(response.data.message || "Failed to fetch orders")
      }
    } catch (error) {
      console.error('Error details:', error.response || error)
      toast.error(error.response?.data?.message || "Error fetching orders")
    } finally {
      setLoading(false)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: event.target.value
      })

      if (response.data.success) {
        await fetchAllOrders()
        toast.success("Order status updated successfully")
      }
    } catch (error) {
      console.error('Status update error:', error.response || error)
      toast.error(error.response?.data?.message || "Failed to update order status")
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [url])

  if (loading) {
    return <div className="loading">Loading orders...</div>
  }

  return (
    <div className='order add'>
      <div className="order-header">
        <h3>Order Management</h3>
        <span className="order-count">Total Orders: {orders.length}</span>
      </div>

      <div className="order-list">
        {orders.length === 0 ? (
          <div className="no-orders">No orders found</div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-item">
              <div className="order-item-header">
                <img src={assets.parcel_icon} alt="" className="order-icon" />
                <div className="order-id">Order ID: {order._id}</div>
                <div className="order-date">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="order-content">
                <div className="order-details">
                  <h4>Order Items</h4>
                  <div className="order-items">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="order-product">
                        <span className="product-name">{item.name}</span>
                        <span className="product-quantity">×{item.quantity}</span>
                        <span className="product-price">NPR {item.price}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-total">
                    Total Amount: NPR {order.amount}
                  </div>
                </div>

                <div className="customer-info">
                  <h4>Customer Details</h4>
                  <p>{order.address.firstName} {order.address.lastName}</p>
                  <p>{order.address.email}</p>
                  <p>{order.address.phone}</p>
                </div>

                <div className="order-actions">
                  <div className="status-control">
                    <label>Order Status:</label>
                    <select
                      onChange={(e) => statusHandler(e, order._id)}
                      value={order.status}
                      className={`status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <option value="Food Processing">Food Processing</option>
                      <option value="Out for delivery">Out for delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>

                  <div className="payment-info">
                    <p>Payment Method: {order.paymentMethod}</p>
                    <p>Payment Status: {order.paymentStatus}</p>
                    <p>Transaction ID: {order.transactionId}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Orders