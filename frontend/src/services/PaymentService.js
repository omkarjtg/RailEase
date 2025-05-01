import API from './axios';

const handleApiError = (error, context) => {
    console.error(`Payment Error (${context}):`, {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
    });
    
    const defaultMessage = `Payment ${context} failed`;
    throw new Error(error.response?.data?.error?.description || 
                   error.response?.data?.message || 
                   error.message || 
                   defaultMessage);
};

export const createOrder = async (paymentRequest) => {
    try {
        const response = await API.post('/payment/create-order', paymentRequest);
        const orderData = response.data;
        
        if (!orderData?.id || orderData.status !== "created") {
            throw new Error(orderData?.error?.description || "Invalid order creation response");
        }
        
        return { data: orderData };
    } catch (error) {
        handleApiError(error, 'order creation');
    }
};

export const verifyPayment = async (verificationData) => {
    try {
        const response = await API.post('/payment/verify', verificationData);
        return response;
    } catch (error) {
        handleApiError(error, 'verification');
    }
};

export default {
    createOrder,
    verifyPayment
};