import API from './axios';


const createOrder = async (paymentRequest) => {
    try {
        const response = await API.post(`/payment/create-order`, paymentRequest);
        return response.data;
    } catch (error) {
        console.error('Failed to create Razorpay order:', error);
        throw error;
    }
};

const verifyPayment = async ({ orderId, paymentId, signature }) => {
    try {
        const response = await API.post(`/payment/verify`, {
            orderId,
            paymentId,
            signature,
        });
        return response.data;
    } catch (error) {
        console.error('Failed to verify Razorpay payment:', error);
        throw error;
    }
};

const getOrderDate = async (razorpayOrderId) => {
    try {
        const response = await API.get(`/payment/order-date/${razorpayOrderId}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch Razorpay order date:', error);
        throw error;
    }
};

export default {
    createOrder,
    verifyPayment,
    getOrderDate,
};
