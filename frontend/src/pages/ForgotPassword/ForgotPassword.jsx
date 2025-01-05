import '../ForgotPassword/ForgotPassword.css'
import React, { useState } from 'react';
import { forgotPasswordApi, verifyOtpApi } from '../../apis/Api.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { assets } from "./../../assets/assets";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Custom toast configurations
    const toastConfig = {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
    };

    const successToast = (message) => {
        toast.success(message, {
            ...toastConfig,
            icon: "✉️",
            style: {
                background: "#10B981",
                color: "white",
                fontSize: "16px",
                padding: "16px",
                borderRadius: "10px"
            }
        });
    };

    const errorToast = (message) => {
        toast.error(message, {
            ...toastConfig,
            icon: "⚠️",
            style: {
                background: "#EF4444",
                color: "white",
                fontSize: "16px",
                padding: "16px",
                borderRadius: "10px"
            }
        });
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            errorToast('Please enter your email address');
            return;
        }
        setIsLoading(true);
        try {
            const res = await forgotPasswordApi({ email });
            if (res.status === 200) {
                successToast('Verification code has been sent to your email! 📧');
                setIsSent(true);
            } else {
                errorToast('Failed to send verification code. Please try again.');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                errorToast(error.response.data.message);
            } else {
                errorToast('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!otp || !password) {
            errorToast('Please enter both OTP and new password');
            return;
        }
        setIsLoading(true);
        const data = { email, otp, password };
        try {
            const res = await verifyOtpApi(data);
            if (res.status === 200) {
                successToast('Password reset successful! 🎉 Redirecting to home...');
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                errorToast(error.response.data.message);
            } else {
                errorToast('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogin = () => {
        navigate('/');
    };

    return (
        <div className='forgot-password-container11'>
            <div className='card11'>
                <div className='image-container11'>
                    <img
                        src={assets.forgot_img}
                        alt='Forgot Password Illustration'
                        loading="lazy"
                    />
                </div>
                <div className='form-container11'>
                    <h3>{isSent ? 'Verify OTP' : 'Forgot Your Password?'}</h3>
                    <form onSubmit={isSent ? handleVerify : handleForgotPassword}>
                        <div className='form-group11'>
                            {!isSent && (
                                <label htmlFor='email'>
                                    Enter your email address and we'll send you a verification code to reset your password
                                </label>
                            )}
                            <input
                                type='email'
                                className='form-control11'
                                id='email'
                                placeholder='Enter your email'
                                disabled={isSent || isLoading}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        {isSent && (
                            <>
                                <span className='text-success11'>
                                    ✉️ OTP has been sent to {email}
                                </span>
                                <div className='form-group11'>
                                    <input
                                        onChange={(e) => setOtp(e.target.value)}
                                        type='number'
                                        className='form-control11'
                                        placeholder='Enter OTP'
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <div className='form-group11'>
                                    <div className='password-wrapper'>
                                        <input
                                            onChange={(e) => setPassword(e.target.value)}
                                            type={showPassword ? "text" : "password"}
                                            className='form-control11'
                                            placeholder='Set New Password'
                                            minLength={8}
                                            disabled={isLoading}
                                            required
                                        />
                                        <span
                                            className="password-icon-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <i className="fas fa-eye-slash"></i>
                                            ) : (
                                                <i className="fas fa-eye"></i>
                                            )}
                                        </span>
                                    </div>


                                </div>
                                <button
                                    type="submit"
                                    className='btn btn-primary11'
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Resetting Password...' : 'Reset Password'}
                                </button>
                            </>
                        )}
                        {!isSent && (
                            <button
                                type="submit"
                                className='btn btn-dark11'
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending Code...' : 'Send Verification Code'}
                            </button>
                        )}
                    </form>
                    <div style={{ textAlign: 'center' }}>
                        <span className='back-to-login11' onClick={handleLogin}>
                            Back to Home
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;