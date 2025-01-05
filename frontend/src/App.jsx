import React, { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import SearchPage from './pages/search/Search';
import LoginPopup from './components/LoginPopup/LoginPopup'
import FoodDetail from './pages/FoodDetail/FoodDetail';
import Profile from './pages/Profile/Profile';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import ForgotPassword from './pages/ForgotPassword/ForgotPassword';

const App = () => {
    const [showLogin, setShowLogin] = useState(false);
    return (
        <>
            {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
            <div className="app">
                <Navbar setShowLogin={setShowLogin} />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/food/:id" element={<FoodDetail />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path='/cart' element={<Cart />} />
                    <Route path='/order' element={<PlaceOrder />} />
                    <Route path='/forgot_password' element={<ForgotPassword/>}/>
                </Routes>
            </div>
            <Footer />
        </>
    );
};

export default App;
