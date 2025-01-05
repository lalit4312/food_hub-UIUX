import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../components/context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { paymentApi } from '../../apis/Api';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: ""
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  }

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount(),
    }

    try {
      let response = await axios.post(url + '/api/order/place', orderData, {
        headers: { token }
      });

      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        alert('Error processing your order. Please try again.');
      }
    } catch (error) {
      alert('Something went wrong. Please try again later.');
    }
  }

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate('/cart');
    }
  }, [token, getTotalCartAmount, navigate]);

  const handleCheckout = async () => {
    const totalAmount = getTotalCartAmount() + 20; // Including delivery fee
    try {
      // Format cart items with proper structure
      const cartItemsFormatted = food_list
        .filter(item => cartItems[item._id] > 0)
        .map(item => ({
          productId: item._id,
          quantity: cartItems[item._id],
          price: item.price
        }));

      console.log('Sending request with data:', {
        totalAmount,
        cartItems: cartItemsFormatted
      });

      const response = await paymentApi({
        totalAmount,
        cartItems: cartItemsFormatted
      });

      console.log('Server response:', response.data);

      if (!response.data || !response.data.formData) {
        throw new Error('Invalid response from server');
      }

      const { formData } = response.data;

      // Log the form data before submission
      console.log('eSewa form data:', formData);

      // Create and submit form to eSewa
      const form = document.createElement('form');
      form.setAttribute('method', 'POST');
      form.setAttribute('action', 'https://rc-epay.esewa.com.np/api/epay/main/v2/form');

      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value);
        form.appendChild(input);

        // Log each field for debugging
        console.log(`Form field - ${key}:`, value);
      });

      // Log the complete form HTML before submission
      console.log('Form HTML:', form.innerHTML);

      document.body.appendChild(form);
      form.submit();

      // Clean up form after submission
      setTimeout(() => {
        form.remove();
      }, 1000);

    } catch (error) {
      console.error('Checkout error:', error);
      if (error.response) {
        console.error('Server error response:', error.response.data);
      }
      alert('Failed to initiate checkout. Please try again.');
    }
  };
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
                    required
                    id="firstName"
                    name='firstName'
                    onChange={onChangeHandler}
                    value={data.firstName}
                    type="text"
                    placeholder='Enter your first name'
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    required
                    id="lastName"
                    name='lastName'
                    onChange={onChangeHandler}
                    value={data.lastName}
                    type="text"
                    placeholder='Enter your last name'
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  required
                  id="email"
                  name='email'
                  onChange={onChangeHandler}
                  value={data.email}
                  type="email"
                  placeholder='Enter your email address'
                />
              </div>

              <div className="input-group">
                <label htmlFor="address">Delivery Address</label>
                <input
                  required
                  id="address"
                  name='address'
                  onChange={onChangeHandler}
                  value={data.address}
                  type="text"
                  placeholder='Enter your full address'
                />
              </div>

              <div className="input-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  required
                  id="phone"
                  name='phone'
                  onChange={onChangeHandler}
                  value={data.phone}
                  type="text"
                  placeholder='Enter your phone number'
                />
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
              <button onClick={handleCheckout} type='submit' className="payment-button">
                PROCEED TO PAYMENT
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PlaceOrder;

// import React, { useContext, useEffect, useState } from 'react';
// import './PlaceOrder.css';
// import { StoreContext } from '../../components/context/StoreContext';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

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

//   // const handleEsewaPayment = (formData) => {
//   //   const form = document.createElement('form');
//   //   form.setAttribute('method', 'POST');
//   //   form.setAttribute('action', 'https://uat.esewa.com.np/epay/main');

//   //   // Add all the fields from formData to the form
//   //   Object.keys(formData).forEach(key => {
//   //     const hiddenField = document.createElement('input');
//   //     hiddenField.setAttribute('type', 'hidden');
//   //     hiddenField.setAttribute('name', key);
//   //     hiddenField.setAttribute('value', formData[key]);
//   //     form.appendChild(hiddenField);
//   //   });

//   //   document.body.appendChild(form);
//   //   form.submit();
//   // };

//   const handleEsewaPayment = (formData) => {
//     const form = document.createElement('form');
//     form.setAttribute('method', 'POST');
//     form.setAttribute('action', 'https://uat.esewa.com.np/epay/main');

//     // Add all the fields from formData to the form
//     Object.keys(formData).forEach(key => {
//       const hiddenField = document.createElement('input');
//       hiddenField.setAttribute('type', 'hidden');
//       hiddenField.setAttribute('name', key);
//       hiddenField.setAttribute('value', formData[key]);
//       form.appendChild(hiddenField);
//     });

//     document.body.appendChild(form);
//     form.submit();
//     form.remove(); // Clean up the form after submission
//   };

//   const placeOrder = async (event) => {
//     event.preventDefault();

//     // Prepare cart items in the format expected by the backend
//     let orderItems = food_list
//       .filter(item => cartItems[item._id] > 0)
//       .map(item => ({
//         productId: item._id,
//         quantity: cartItems[item._id],
//         price: item.price
//       }));

//     const totalAmount = getTotalCartAmount() + 20; // Including delivery fee

//     try {
//       // First, initiate the payment process
//       const response = await axios.post(
//         `${url}/api/payment/checkout`,
//         {
//           totalAmount,
//           cartItems: orderItems
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         }
//       );

//       if (response.data.formData) {
//         // If we got the form data, initiate eSewa payment
//         handleEsewaPayment(response.data.formData);
//       } else {
//         alert('Error processing your order. Please try again.');
//       }
//     } catch (error) {
//       console.error('Error during checkout:', error);
//       alert('Something went wrong. Please try again later.');
//     }
//   }

//   useEffect(() => {
//     if (!token || getTotalCartAmount() === 0) {
//       navigate('/cart');
//     }
//   }, [token, getTotalCartAmount, navigate]);

//   return (
//     <div className='place-order-container'>
//       <h1>Checkout</h1>
//       <form onSubmit={placeOrder} className='place-order'>
//         {/* Your existing form fields remain the same */}
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
//                   // required
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
//                 <span>NPR {getTotalCartAmount() === 0 ? 0 : 20}</span>
//               </div>
//               <div className="order-row total">
//                 <span>Total Amount</span>
//                 <span>NPR {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 20}</span>
//               </div>
//               <button type='submit' className="payment-button">
//                 PAY WITH ESEWA
//               </button>
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default PlaceOrder;