// import React, { useState, useEffect } from 'react';
// import { Camera } from 'lucide-react';
// import Api from '../../apis/Api';
// import './Profile.css';

// const Profile = () => {
//     const [userDetails, setUserDetails] = useState(null);
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [isEditing, setIsEditing] = useState(false);
//     const [previewImage, setPreviewImage] = useState(null);
//     const [editFormData, setEditFormData] = useState({
//         name: '',
//         email: '',
//         phone: '',
//         profileImage: null
//     });

//     const baseURL = 'http://localhost:4000';

//     const getProfileImageUrl = (profileImage) => {
//         if (!profileImage) return "/api/placeholder/150/150";

//         // If the profileImage already starts with http/https, return as is
//         if (profileImage.startsWith('http')) return profileImage;

//         // If profileImage is a full path starting with /images/profiles
//         if (profileImage.startsWith('/images/profiles')) {
//             return `${baseURL}${profileImage}`;
//         }

//         // If it's just the filename
//         return `${baseURL}/images/profiles/${profileImage}`;
//     };

//     const fetchUserDetails = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 setError('Please login to view profile');
//                 setLoading(false);
//                 return;
//             }

//             const payload = token.split('.')[1];
//             const decodedPayload = JSON.parse(atob(payload));
//             const userId = decodedPayload.id;

//             const response = await Api.get(`/api/user/get_user/${userId}`);
//             setUserDetails(response.data.userDetails);
//             setEditFormData({
//                 name: response.data.userDetails.name,
//                 email: response.data.userDetails.email,
//                 phone: response.data.userDetails.phone || '',
//                 profileImage: null
//             });
//             setLoading(false);
//         } catch (err) {
//             console.error('Error fetching user details:', err);
//             setError('Failed to load user details');
//             setLoading(false);
//         }
//     };

//     const fetchUserOrders = async () => {
//         try {
//             const response = await Api.get('/api/payment/user-orders');
//             if (response.data.success) {
//                 setOrders(response.data.data);
//             }
//         } catch (err) {
//             console.error('Error fetching orders:', err);
//         }
//     };

//     useEffect(() => {
//         const loadData = async () => {
//             await fetchUserDetails();
//             await fetchUserOrders();
//         };
//         loadData();

//         if (userDetails) {
//             console.log('User Details:', userDetails);
//             console.log('Profile Image Path:', `${baseURL}/images/${userDetails.profileImage}`);
//         }
//     }, []);

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         window.location.href = '/';
//     };

//     const handleEditClick = () => {
//         setIsEditing(true);
//     };

//     const handleCancelEdit = () => {
//         setIsEditing(false);
//         setPreviewImage(null);
//         setEditFormData({
//             name: userDetails.name,
//             email: userDetails.email,
//             phone: userDetails.phone || ''
//         });
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setEditFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const previewURL = URL.createObjectURL(file);
//             setPreviewImage(previewURL);
//             setEditFormData(prev => ({
//                 ...prev,
//                 profileImage: file
//             }));
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const token = localStorage.getItem('token');
//             const payload = token.split('.')[1];
//             const decodedPayload = JSON.parse(atob(payload));
//             const userId = decodedPayload.id;

//             const formData = new FormData();
//             formData.append('name', editFormData.name);
//             formData.append('email', editFormData.email);
//             formData.append('phone', editFormData.phone);
//             if (editFormData.profileImage) {
//                 formData.append('profileImage', editFormData.profileImage);
//             }

//             const response = await Api.put(`/api/user/update_profile/${userId}`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 }
//             });

//             setIsEditing(false);
//             if (response.data.success) {
//                 setUserDetails(response.data.user);
//                 setIsEditing(false);
//                 // Refresh the page to show the new image
//                 window.location.reload();
//             }
//         } catch (err) {
//             console.error('Update error:', err);
//         }
//     };

//     if (loading) {
//         return <div className="loading">Loading...</div>;
//     }

//     if (error) {
//         return <div className="error">{error}</div>;
//     }

//     return (
//         <div className="profile-container">
//             <div className="profile-layout">
//                 <div className="profile-left-section">
//                     <div className="profile-image-container">
//                         <div className="profile-image">
//                             <img
//                                 src={previewImage || userDetails?.profileImage ?
//                                     `${baseURL}/images/profiles/${userDetails.profileImage}` :
//                                     "/api/placeholder/150/150"}
//                                 alt="Profile"
//                             />
//                             {isEditing && (
//                                 <label htmlFor="profile-image-input" className="camera-overlay">
//                                     <Camera size={20} />
//                                     <input
//                                         type="file"
//                                         id="profile-image-input"
//                                         accept="image/*"
//                                         onChange={handleImageChange}
//                                     />
//                                 </label>
//                             )}
//                             {!isEditing && (
//                                 <div className="camera-overlay">
//                                     <Camera size={20} />
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {isEditing ? (
//                         <form onSubmit={handleSubmit} className="edit-form">
//                             <input
//                                 type="text"
//                                 name="name"
//                                 value={editFormData.name}
//                                 onChange={handleInputChange}
//                                 placeholder="Name"
//                                 required
//                             />
//                             <input
//                                 type="email"
//                                 name="email"
//                                 value={editFormData.email}
//                                 onChange={handleInputChange}
//                                 placeholder="Email"
//                                 required
//                             />
//                             <input
//                                 type="tel"
//                                 name="phone"
//                                 value={editFormData.phone}
//                                 onChange={handleInputChange}
//                                 placeholder="Phone"
//                             />
//                             <div className="edit-actions">
//                                 <button type="submit" className="save-btn">
//                                     Save Changes
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className="cancel-btn"
//                                     onClick={handleCancelEdit}
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </form>
//                     ) : (
//                         <div className="profile-info">
//                             <h3>{userDetails?.name}</h3>
//                             <p>{userDetails?.email}</p>
//                             <p>{userDetails?.phone || 'No phone number'}</p>
//                             <button className="edit-profile-btn" onClick={handleEditClick}>
//                                 Edit Profile
//                             </button>
//                             <button className="logout-btn" onClick={handleLogout}>
//                                 Logout
//                             </button>
//                         </div>
//                     )}
//                 </div>

//                 <div className="vertical-separator"></div>

//                 <div className="profile-right-section">
//                     <h2>My Orders</h2>
//                     <div className="orders-list">
//                         {orders.length === 0 ? (
//                             <div className="no-orders">No orders found</div>
//                         ) : (
//                             orders.map((order) => (
//                                 <div key={order._id} className="order-group">
//                                     {order.items.map((item, idx) => (
//                                         <div key={`${order._id}-${idx}`} className="order-item">
//                                             <div className="order-product">
//                                                 <div className="product-image-container">
//                                                     <img
//                                                         src={item.image ? `${baseURL}/images/${item.image}` : "/api/placeholder/60/60"}
//                                                         alt={item.name}
//                                                         className="product-image"
//                                                     />
//                                                 </div>
//                                                 <div className="product-details">
//                                                     <span className="product-name">{item.name}</span>
//                                                     <span className="product-price">Rs {item.price}</span>
//                                                     <span className="product-quantity">{item.quantity}</span>
//                                                     <span className={`status status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
//                                                         {order.status}
//                                                     </span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                     <div className="order-total-section">
//                                         <div className="order-date">
//                                             Ordered on: {new Date(order.createdAt).toLocaleDateString()}
//                                         </div>
//                                         <div className="total-price">
//                                             Total Amount: <span>Rs {order.totalAmount}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Profile;

// import React, { useState, useEffect } from 'react';
// import { Camera } from 'lucide-react';
// import Api from '../../apis/Api';
// import './Profile.css'

// const Profile = () => {
//     const [userDetails, setUserDetails] = useState(null);
//     const [orders, setOrders] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [isEditing, setIsEditing] = useState(false);
//     const [previewImage, setPreviewImage] = useState(null);
//     const [editFormData, setEditFormData] = useState({
//         name: '',
//         email: '',
//         phone: '',
//         profileImage: null
//     });

//     const baseURL = 'http://localhost:4000';

//        // Add a function to handle order removal
//        const handleDeliveredOrders = () => {
//         setOrders(prevOrders => {
//             return prevOrders.map(order => {
//                 // If order status is delivered, schedule its removal
//                 if (order.status.toLowerCase() === 'delivered') {
//                     setTimeout(() => {
//                         setOrders(currentOrders => 
//                             currentOrders.filter(o => o._id !== order._id)
//                         );
//                     }, 60000); // 1 minute = 60000 milliseconds
//                 }
//                 return order;
//             });
//         });
//     };

//     const getProfileImageUrl = (profileImage) => {
//         if (!profileImage) return "/api/placeholder/150/150";
//         if (profileImage.startsWith('http')) return profileImage;
//         if (profileImage.startsWith('/images/profiles')) {
//             return `${baseURL}${profileImage}`;
//         }
//         return `${baseURL}/images/profiles/${profileImage}`;
//     };

//     const fetchUserDetails = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 setError('Please login to view profile');
//                 setLoading(false);
//                 return;
//             }

//             const payload = token.split('.')[1];
//             const decodedPayload = JSON.parse(atob(payload));
//             const userId = decodedPayload.id;

//             const response = await Api.get(`/api/user/get_user/${userId}`);
//             setUserDetails(response.data.userDetails);
//             setEditFormData({
//                 name: response.data.userDetails.name,
//                 email: response.data.userDetails.email,
//                 phone: response.data.userDetails.phone || '',
//                 profileImage: null
//             });
//             setLoading(false);
//         } catch (err) {
//             console.error('Error fetching user details:', err);
//             setError('Failed to load user details');
//             setLoading(false);
//         }
//     };

//     const fetchUserOrders = async () => {
//         try {
//             const response = await Api.get('/api/payment/user-orders');
//             if (response.data.success) {
//                 setOrders(response.data.data);
//                 handleDeliveredOrders();
//             }
//         } catch (err) {
//             console.error('Error fetching orders:', err);
//         }
//     };

//     useEffect(() => {
//         const loadData = async () => {
//             await fetchUserDetails();
//             await fetchUserOrders();
//         };
//         loadData();
//     }, []);

//     const handleLogout = () => {
//         localStorage.removeItem('token');
//         window.location.href = '/';
//     };

//     const handleEditClick = () => {
//         setIsEditing(true);
//     };

//     const handleCancelEdit = () => {
//         setIsEditing(false);
//         setPreviewImage(null);
//         setEditFormData({
//             name: userDetails.name,
//             email: userDetails.email,
//             phone: userDetails.phone || '',
//             profileImage: null
//         });
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setEditFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const previewURL = URL.createObjectURL(file);
//             setPreviewImage(previewURL);
//             setEditFormData(prev => ({
//                 ...prev,
//                 profileImage: file
//             }));
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const token = localStorage.getItem('token');
//             const payload = token.split('.')[1];
//             const decodedPayload = JSON.parse(atob(payload));
//             const userId = decodedPayload.id;

//             const formData = new FormData();
//             formData.append('name', editFormData.name);
//             formData.append('email', editFormData.email);
//             formData.append('phone', editFormData.phone);
//             if (editFormData.profileImage) {
//                 formData.append('profileImage', editFormData.profileImage);
//             }

//             const response = await Api.put(`/api/user/update_profile/${userId}`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 }
//             });

//             if (response.data.success) {
//                 setUserDetails(response.data.user);
//                 setIsEditing(false);
//                 setPreviewImage(null);
//                 if (previewImage) {
//                     URL.revokeObjectURL(previewImage);
//                 }
//                 // Refresh user details
//                 await fetchUserDetails();
//             }
//         } catch (err) {
//             console.error('Update error:', err);
//         }
//     };

//     if (loading) return <div className="loading">Loading...</div>;
//     if (error) return <div className="error">{error}</div>;

//     return (
//         <div className="profile-container">
//             <div className="profile-layout">
//                 <div className="profile-left-section">
//                     <div className="profile-image-container">
//                         <div className="profile-image">
//                             <img
//                                 src={previewImage || getProfileImageUrl(userDetails?.profileImage)}
//                                 alt="Profile"
//                                 onError={(e) => {
//                                     console.error('Image load error:', e);
//                                     e.target.src = "/api/placeholder/150/150";
//                                 }}
//                             />
//                             {isEditing ? (
//                                 <label htmlFor="profile-image-input" className="camera-overlay">
//                                     <Camera size={20} />
//                                     <input
//                                         type="file"
//                                         id="profile-image-input"
//                                         accept="image/*"
//                                         onChange={handleImageChange}
//                                     />
//                                 </label>
//                             ) : (
//                                 <div className="camera-overlay">
//                                     <Camera size={20} />
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {isEditing ? (
//                         <form onSubmit={handleSubmit} className="edit-form">
//                             <input
//                                 type="text"
//                                 name="name"
//                                 value={editFormData.name}
//                                 onChange={handleInputChange}
//                                 placeholder="Name"
//                                 required
//                             />
//                             <input
//                                 type="email"
//                                 name="email"
//                                 value={editFormData.email}
//                                 onChange={handleInputChange}
//                                 placeholder="Email"
//                                 required
//                             />
//                             <input
//                                 type="tel"
//                                 name="phone"
//                                 value={editFormData.phone}
//                                 onChange={handleInputChange}
//                                 placeholder="Phone"
//                             />
//                             <div className="edit-actions">
//                                 <button type="submit" className="save-btn">
//                                     Save Changes
//                                 </button>
//                                 <button
//                                     type="button"
//                                     className="cancel-btn"
//                                     onClick={handleCancelEdit}
//                                 >
//                                     Cancel
//                                 </button>
//                             </div>
//                         </form>
//                     ) : (
//                         <div className="profile-info">
//                             <h3>{userDetails?.name}</h3>
//                             <p>{userDetails?.email}</p>
//                             <p>{userDetails?.phone || 'No phone number'}</p>
//                             <button className="edit-profile-btn" onClick={handleEditClick}>
//                                 Edit Profile
//                             </button>
//                             <button className="logout-btn" onClick={handleLogout}>
//                                 Logout
//                             </button>
//                         </div>
//                     )}
//                 </div>

//                 <div className="vertical-separator"></div>

//                 <div className="profile-right-section">
//                     <h2>My Orders</h2>
//                     <div className="orders-list">
//                         {orders.length === 0 ? (
//                             <div className="no-orders">No orders found</div>
//                         ) : (
//                             orders.map((order) => (
//                                 <div key={order._id} className="order-group">
//                                     {order.items.map((item, idx) => (
//                                         <div key={`${order._id}-${idx}`} className="order-item">
//                                             <div className="order-product">
//                                                 <div className="product-image-container">
//                                                     <img
//                                                         src={item.image ? `${baseURL}/images/${item.image}` : "/api/placeholder/60/60"}
//                                                         alt={item.name}
//                                                         className="product-image"
//                                                     />
//                                                 </div>
//                                                 <div className="product-details">
//                                                     <span className="product-name">{item.name}</span>
//                                                     <span className="product-quantity">Qty: {item.quantity}</span>
//                                                     <span className="product-price">Rs {item.price}</span>
//                                                     <span className={`status status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
//                                                         {order.status}
//                                                     </span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                     <div className="order-total-section">
//                                         <div className="order-date">
//                                             Ordered on: {new Date(order.createdAt).toLocaleDateString()}
//                                         </div>
//                                         <div className="total-price">
//                                             Total Amount: <span>Rs {order.totalAmount}</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Profile;



import React, { useState, useEffect } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import Api from '../../apis/Api';
import './Profile.css'

const Profile = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [editFormData, setEditFormData] = useState({
        name: '',
        email: '',
        phone: '',
        profileImage: null
    });

    const baseURL = 'http://localhost:4000';

    const getUserId = () => {
        const token = localStorage.getItem('token');
        if (!token) return null;
        const payload = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));
        return decodedPayload.id;
    };

    const getProfileImageUrl = (profileImage) => {
        if (!profileImage) return "/api/placeholder/150/150";
        if (profileImage.startsWith('http')) return profileImage;
        if (profileImage.startsWith('/images/profiles')) {
            return `${baseURL}${profileImage}`;
        }
        return `${baseURL}/images/profiles/${profileImage}`;
    };

    const removeOrderFromHistory = (orderId) => {
        const userId = getUserId();
        if (!userId) return;

        const storageKey = `hiddenOrders_${userId}`;
        const hiddenOrders = JSON.parse(localStorage.getItem(storageKey) || '[]');
        localStorage.setItem(storageKey, JSON.stringify([...hiddenOrders, orderId]));
        setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
    };

    const fetchUserDetails = async () => {
        try {
            const userId = getUserId();
            if (!userId) {
                setError('Please login to view profile');
                setLoading(false);
                return;
            }

            const response = await Api.get(`/api/user/get_user/${userId}`);
            setUserDetails(response.data.userDetails);
            setEditFormData({
                name: response.data.userDetails.name,
                email: response.data.userDetails.email,
                phone: response.data.userDetails.phone || '',
                profileImage: null
            });
            setLoading(false);
        } catch (err) {
            console.error('Error fetching user details:', err);
            setError('Failed to load user details');
            setLoading(false);
        }
    };

    const fetchUserOrders = async () => {
        try {
            const userId = getUserId();
            if (!userId) {
                setError('User not authenticated');
                return;
            }

            const response = await Api.get('/api/payment/user-orders');
            if (response.data.success) {
                const storageKey = `hiddenOrders_${userId}`;
                const hiddenOrders = JSON.parse(localStorage.getItem(storageKey) || '[]');
                const filteredOrders = response.data.data.filter(
                    order => !hiddenOrders.includes(order._id)
                );
                setOrders(filteredOrders);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchUserDetails();
            await fetchUserOrders();
        };
        loadData();

        return () => {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        if (previewImage) {
            URL.revokeObjectURL(previewImage);
            setPreviewImage(null);
        }
        setEditFormData({
            name: userDetails.name,
            email: userDetails.email,
            phone: userDetails.phone || '',
            profileImage: null
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (previewImage) {
                URL.revokeObjectURL(previewImage);
            }
            const previewURL = URL.createObjectURL(file);
            setPreviewImage(previewURL);
            setEditFormData(prev => ({
                ...prev,
                profileImage: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = getUserId();
            if (!userId) return;

            const formData = new FormData();
            formData.append('name', editFormData.name);
            formData.append('email', editFormData.email);
            formData.append('phone', editFormData.phone);
            if (editFormData.profileImage) {
                formData.append('profileImage', editFormData.profileImage);
            }

            const response = await Api.put(`/api/user/update_profile/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.success) {
                setUserDetails(response.data.user);
                setIsEditing(false);
                if (previewImage) {
                    URL.revokeObjectURL(previewImage);
                    setPreviewImage(null);
                }
                await fetchUserDetails();
            }
        } catch (err) {
            console.error('Update error:', err);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="profile-container">
            <div className="profile-layout">
                <div className="profile-left-section">
                    <div className="profile-image-container">
                        <div className="profile-image">
                            <img
                                src={previewImage || getProfileImageUrl(userDetails?.profileImage)}
                                alt="Profile"
                                onError={(e) => {
                                    console.error('Image load error:', e);
                                    e.target.src = "/api/placeholder/150/150";
                                }}
                            />
                            {isEditing ? (
                                <label htmlFor="profile-image-input" className="camera-overlay">
                                    <div className="camera-icon-wrapper">
                                        <Camera size={24} />
                                        <span className="camera-text">Change Photo</span>
                                    </div>
                                    <input
                                        type="file"
                                        id="profile-image-input"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            ) : (
                                <div className="camera-overlay">
                                    <div className="camera-icon-wrapper">
                                        <Camera size={24} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSubmit} className="edit-form">
                            <input
                                type="text"
                                name="name"
                                value={editFormData.name}
                                onChange={handleInputChange}
                                placeholder="Name"
                                required
                            />
                            <input
                                type="email"
                                name="email"
                                value={editFormData.email}
                                onChange={handleInputChange}
                                placeholder="Email"
                                required
                            />
                            <input
                                type="tel"
                                name="phone"
                                value={editFormData.phone}
                                onChange={handleInputChange}
                                placeholder="Phone"
                            />
                            <div className="edit-actions">
                                <button type="submit" className="save-btn">
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="profile-info">
                            <h3>{userDetails?.name}</h3>
                            <p>{userDetails?.email}</p>
                            <p>{userDetails?.phone || 'No phone number'}</p>
                            <button className="edit-profile-btn" onClick={handleEditClick}>
                                Edit Profile
                            </button>
                            <button className="logout-btn" onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                <div className="vertical-separator"></div>

                <div className="profile-right-section">
                    <h2>My Orders</h2>
                    <div className="orders-list">
                        {orders.length === 0 ? (
                            <div className="no-orders">No orders found</div>
                        ) : (
                            orders.map((order) => (
                                <div key={order._id} className="order-group">
                                    <div className="order-header">
                                        <button
                                            onClick={() => removeOrderFromHistory(order._id)}
                                            className="remove-order-btn"
                                            title="Remove from history"
                                        >
                                            <Trash2 size={16} />
                                            Remove
                                        </button>
                                    </div>
                                    {order.items.map((item, idx) => (
                                        <div key={`${order._id}-${idx}`} className="order-item">
                                            <div className="order-product">
                                                <div className="product-image-container">
                                                    <img
                                                        src={item.image ? `${baseURL}/images/${item.image}` : "/api/placeholder/60/60"}
                                                        alt={item.name}
                                                        className="product-image"
                                                    />
                                                </div>
                                                <div className="product-details">
                                                    <span className="product-name">{item.name}</span>
                                                    <span className="product-quantity">Qty: {item.quantity}</span>
                                                    <span className="product-price">Rs {item.price}</span>
                                                    <span className={`status status-${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="order-total-section">
                                        <div className="order-date">
                                            Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="total-price">
                                            Total Amount: <span>Rs {order.totalAmount}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;