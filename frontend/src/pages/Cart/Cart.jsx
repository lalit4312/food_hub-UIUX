import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../components/context/StoreContext'
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, food_list,removeFromCart, addToCart, getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleIncreaseQuantity = (itemId) => {
    addToCart(itemId);
  };

  const handleDecreaseQuantity = (itemId) => {
    removeFromCart(itemId);
  };


  const hasItems = Object.values(cartItems).some(quantity => quantity > 0);

  if (!hasItems) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-content">
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <button onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    )
  }

  return (
    <div className='cart'>
      <h1>Shopping Cart</h1>
      <div className="cart-main">
        <div className="cart-items">
          <div className="cart-items-title">
            <p>Items</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
          </div>
          <div className="cart-items-list">
            {food_list.map((item) => {
              if (cartItems[item._id] > 0) {
                return (
                  <div key={item._id} className="cart-item">
                    <div className="cart-items-content">
                      <div className="cart-item-image">
                        <img src={url + '/images/' + item.image} alt={item.name} />
                      </div>
                      <div className="cart-item-name">{item.name}</div>
                      <div className="cart-item-price">NPR {item.price}</div>
                      {/* <div className="cart-item-quantity">{cartItems[item._id]}</div> */}

                      <div className="cart-item-quantity">
                        <button
                          className="quantity-btn"
                          onClick={() => handleDecreaseQuantity(item._id)}
                        >
                          -
                        </button>
                        <span>{cartItems[item._id]}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => handleIncreaseQuantity(item._id)}
                        >
                          +
                        </button>
                      </div>
                      <div className="cart-item-total">NPR {item.price * cartItems[item._id]}</div>
                      <button
                        className="cart-item-remove"
                        onClick={() => removeFromCart(item._id)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )
              }
              return null;
            })}
          </div>
        </div>

        <div className="cart-summary">
          <div className="cart-total">
            <h2>Order Summary</h2>
            <div className="cart-total-details">
              <div className="cart-total-row">
                <span>Subtotal</span>
                <span>NPR {getTotalCartAmount()}</span>
              </div>
              <div className="cart-total-row">
                <span>Delivery Fee</span>
                <span>NPR {getTotalCartAmount() === 0 ? 0 : 20}</span>
              </div>
              <div className="cart-total-row grand-total">
                <span>Total</span>
                <span>NPR {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 20}</span>
              </div>
              <button
                className="checkout-button"
                onClick={() => navigate('/order')}
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart