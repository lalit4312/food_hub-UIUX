import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../components/context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { paymentApi } from '../../apis/Api';

// const PlaceOrder = () => {
//   const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
//   const navigate = useNavigate();

//   const [data, setData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     address: "",
//     phone: ""
//   });

//   const onChangeHandler = (event) => {
//     const name = event.target.name;
//     const value = event.target.value;
//     setData(data => ({ ...data, [name]: value }));
//   }

//   const placeOrder = async (event) => {
//     event.preventDefault();
//     let orderItems = [];
//     food_list.map((item) => {
//       if (cartItems[item._id] > 0) {
//         let itemInfo = item;
//         itemInfo["quantity"] = cartItems[item._id];
//         orderItems.push(itemInfo);
//       }
//     });

//     let orderData = {
//       address: data,
//       items: orderItems,
//       amount: getTotalCartAmount(),
//     }

//     try {
//       let response = await axios.post(url + '/api/order/place', orderData, {
//         headers: { token }
//       });

//       if (response.data.success) {
//         const { session_url } = response.data;
//         window.location.replace(session_url);
//       } else {
//         alert('Error processing your order. Please try again.');
//       }
//     } catch (error) {
//       alert('Something went wrong. Please try again later.');
//     }
//   }

//   useEffect(() => {
//     if (!token || getTotalCartAmount() === 0) {
//       navigate('/cart');
//     }
//   }, [token, getTotalCartAmount, navigate]);

//   const handleCheckout = async () => {
//     const totalAmount = getTotalCartAmount() + 20; // Including delivery fee
//     try {
//       // Format cart items with proper structure
//       const cartItemsFormatted = food_list
//         .filter(item => cartItems[item._id] > 0)
//         .map(item => ({
//           productId: item._id,
//           quantity: cartItems[item._id],
//           price: item.price
//         }));

//       console.log('Sending request with data:', {
//         totalAmount,
//         cartItems: cartItemsFormatted
//       });

//       const response = await paymentApi({
//         totalAmount,
//         cartItems: cartItemsFormatted
//       });

//       console.log('Server response:', response.data);

//       if (!response.data || !response.data.formData) {
//         throw new Error('Invalid response from server');
//       }

//       const { formData } = response.data;

//       // Log the form data before submission
//       console.log('eSewa form data:', formData);

//       // Create and submit form to eSewa
//       const form = document.createElement('form');
//       form.setAttribute('method', 'POST');
//       form.setAttribute('action', 'https://rc-epay.esewa.com.np/api/epay/main/v2/form');

//       // Add form fields
//       Object.entries(formData).forEach(([key, value]) => {
//         const input = document.createElement('input');
//         input.type = 'hidden';
//         input.name = key;
//         input.value = String(value);
//         form.appendChild(input);

//         // Log each field for debugging
//         console.log(`Form field - ${key}:`, value);
//       });

//       // Log the complete form HTML before submission
//       console.log('Form HTML:', form.innerHTML);

//       document.body.appendChild(form);
//       form.submit();

//       // Clean up form after submission
//       setTimeout(() => {
//         form.remove();
//       }, 1000);

//     } catch (error) {
//       console.error('Checkout error:', error);
//       if (error.response) {
//         console.error('Server error response:', error.response.data);
//       }
//       alert('Failed to initiate checkout. Please try again.');
//     }
//   };
//   return (
//     <div className='place-order-container'>
//       <h1>Checkout</h1>
//       <form onSubmit={placeOrder} className='place-order'>
//         <div className="place-order-left">
//           <div className="form-section">
//             <h2>Delivery Information</h2>
//             <div className="form-fields">
//               <div className="multi-fields">
//                 <div className="input-group">
//                   <label htmlFor="firstName">First Name</label>
//                   <input
//                     required
//                     id="firstName"
//                     name='firstName'
//                     onChange={onChangeHandler}
//                     value={data.firstName}
//                     type="text"
//                     placeholder='Enter your first name'
//                   />
//                 </div>
//                 <div className="input-group">
//                   <label htmlFor="lastName">Last Name</label>
//                   <input
//                     required
//                     id="lastName"
//                     name='lastName'
//                     onChange={onChangeHandler}
//                     value={data.lastName}
//                     type="text"
//                     placeholder='Enter your last name'
//                   />
//                 </div>
//               </div>

//               <div className="input-group">
//                 <label htmlFor="email">Email Address</label>
//                 <input
//                   required
//                   id="email"
//                   name='email'
//                   onChange={onChangeHandler}
//                   value={data.email}
//                   type="email"
//                   placeholder='Enter your email address'
//                 />
//               </div>

//               <div className="input-group">
//                 <label htmlFor="address">Delivery Address</label>
//                 <input
//                   required
//                   id="address"
//                   name='address'
//                   onChange={onChangeHandler}
//                   value={data.address}
//                   type="text"
//                   placeholder='Enter your full address'
//                 />
//               </div>

//               <div className="input-group">
//                 <label htmlFor="phone">Phone Number</label>
//                 <input
//                   required
//                   id="phone"
//                   name='phone'
//                   onChange={onChangeHandler}
//                   value={data.phone}
//                   type="text"
//                   placeholder='Enter your phone number'
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="place-order-right">
//           <div className="order-summary">
//             <h2>Order Summary</h2>
//             <div className="order-details">
//               <div className="order-row">
//                 <span>Subtotal</span>
//                 <span>NPR {getTotalCartAmount()}</span>
//               </div>
//               <div className="order-row">
//                 <span>Delivery Fee</span>
//                 <span>NPR {getTotalCartAmount() === 0 ? 0 : 2}</span>
//               </div>
//               <div className="order-row total">
//                 <span>Total Amount</span>
//                 <span>NPR {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</span>
//               </div>
//               <button onClick={handleCheckout} type='submit' className="payment-button">
//                 PROCEED TO PAYMENT
//               </button>
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default PlaceOrder;

// import React, { useContext, useEffect, useState } from 'react';
// import './PlaceOrder.css';
// import { StoreContext } from '../../components/context/StoreContext';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { StoreContext } from '../context/StoreContext';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: ""
  });

  const [errors, setErrors] = useState({});

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));

    if (value.trim() !== "") {
      setErrors(errors => ({ ...errors, [name]: "" }));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^\+?[\d\s-]{10,}$/;
    return re.test(phone);
  };

  const isFormValid = () => {
    let valid = true;
    const newErrors = {};

    Object.entries(data).forEach(([key, value]) => {
      if (value.trim() === "") {
        valid = false;
        newErrors[key] = `Please fill in your ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}.`;
      } else {
        if (key === 'email' && !validateEmail(value)) {
          valid = false;
          newErrors[key] = 'Please enter a valid email address.';
        }
        if (key === 'phone' && !validatePhone(value)) {
          valid = false;
          newErrors[key] = 'Please enter a valid phone number.';
        }
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleEsewaPayment = (formData) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

    // Add all form data as hidden inputs
    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    if (!isFormValid()) {
      return;
    }

    setIsLoading(true);

    try {
      // Validate cart has items and calculate total
      const cartTotal = getTotalCartAmount();
      if (cartTotal === 0) {
        throw new Error('Your cart is empty');
      }

      // Create formatted cart items
      const formattedCartItems = food_list
        .filter(item => cartItems[item._id] && cartItems[item._id] > 0)
        .map(item => ({
          productId: item._id,
          quantity: cartItems[item._id],
          price: item.price
        }));

      if (formattedCartItems.length === 0) {
        throw new Error('No valid items in cart');
      }

      // Make the checkout request
      const response = await axios.post(`${url}/api/payment/checkout`, {
        totalAmount: cartTotal,
        cartItems: formattedCartItems
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.formData) {
        // Handle eSewa payment
        handleEsewaPayment(response.data.formData);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Order placement error:', error);
      alert(error.response?.data?.message || error.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const total = getTotalCartAmount();
    if (total === 0) {
      navigate('/cart');
    }
  }, [token, getTotalCartAmount, navigate]);

  return (
    <div className='place-order-container'>
      <h1>Checkout</h1>
      <form onSubmit={placeOrder} className='place-order'>
        <div className="place-order-left">
          <div className="form-section">
            <h2>Delivery Information</h2>
            <div className="form-fields">
              <div className="multi-fields">
                <div className="input-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    name='firstName'
                    onChange={onChangeHandler}
                    value={data.firstName}
                    type="text"
                    placeholder='Enter your first name'
                    disabled={isLoading}
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
                <div className="input-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    name='lastName'
                    onChange={onChangeHandler}
                    value={data.lastName}
                    type="text"
                    placeholder='Enter your last name'
                    disabled={isLoading}
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name='email'
                  onChange={onChangeHandler}
                  value={data.email}
                  type="email"
                  placeholder='Enter your email address'
                  disabled={isLoading}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="address">Delivery Address</label>
                <input
                  id="address"
                  name='address'
                  onChange={onChangeHandler}
                  value={data.address}
                  type="text"
                  placeholder='Enter your full address'
                  disabled={isLoading}
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name='phone'
                  onChange={onChangeHandler}
                  value={data.phone}
                  type="tel"
                  placeholder='Enter your phone number'
                  disabled={isLoading}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="place-order-right">
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-details">
              <div className="order-row">
                <span>Subtotal</span>
                <span>NPR {getTotalCartAmount()}</span>
              </div>
              <div className="order-row">
                <span>Delivery Fee</span>
                <span>NPR {getTotalCartAmount() === 0 ? 0 : 2}</span>
              </div>
              <div className="order-row total">
                <span>Total Amount</span>
                <span>NPR {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</span>
              </div>
              <button
                type='submit'
                className="payment-button"
                disabled={isLoading || Object.values(errors).some(error => error !== "")}
              >
                {isLoading ? 'PROCESSING...' : 'PAY WITH ESEWA'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;

