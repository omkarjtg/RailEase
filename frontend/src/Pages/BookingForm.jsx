import { useState, useMemo } from 'react';
import API from '../services/axios';
import BookingSummaryPopup from '../partials/BookingSummaryPopup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/BookingForm.css';
import { toast } from 'react-toastify';
import { createBooking } from '../services/BookingService';
import paymentService from '../services/PaymentService';

export default function BookingForm({ train, onCancel }) {
    const [seats, setSeats] = useState(1);
    const [seatTier, setSeatTier] = useState('TIER2_SLEEPER'); // Align default with options
    const [travelDate, setTravelDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showSummary, setShowSummary] = useState(false);
    const [bookingPayload, setBookingPayload] = useState(null);
    const [summaryData, setSummaryData] = useState(null);
    const [paymentError, setPaymentError] = useState(null);

    const tierMultiplier = {
        TIER1_AC: 2,
        TIER2_SLEEPER: 1,
        TIER3_GENERAL: 0.8,
    };

    const totalPrice = useMemo(() => {
        if (!train) return 0;
        const basePrice = train.price || 0;
        const multiplier = tierMultiplier[seatTier] || 1;
        return basePrice * seats * multiplier;
    }, [seats, seatTier, train]);

    const getAllowedDays = () => {
        const dayMap = {
            sunday: 0,
            monday: 1,
            tuesday: 2,
            wednesday: 3,
            thursday: 4,
            friday: 5,
            saturday: 6,
        };
        return train?.runningDays?.map((day) => dayMap[day.toLowerCase()]) || [];
    };

    const isDateAllowed = (date) => {
        const allowedDays = getAllowedDays();
        if (!allowedDays.length) return true;
        return allowedDays.includes(date.getDay());
    };

    const handlePrepareBooking = () => {
        if (!travelDate) {
            toast.error('Please select a travel date.');
            return;
        }

        if (!train) {
            setMessage('❌ Train data is not available.');
            return;
        }

        const apiPayload = {
            trainNumber: train.number,
            seatTier: seatTier,
            seatsBooked: seats,
            travelDate: travelDate.toISOString().split('T')[0],
        };

        const popupSummary = {
            trainName: train.name,
            seatsBooked: seats,
            seatTier: seatTier,
            travelDate: travelDate.toISOString().split('T')[0],
            departureTime: train.departureTime,
            arrivalTime: train.arrivalTime,
            bookedPrice: totalPrice,
        };

        setBookingPayload(apiPayload);
        setSummaryData(popupSummary);
        setShowSummary(true);
        setPaymentError(null);
    };

    const handleConfirmBooking = async () => {
        if (!bookingPayload) return;

        // Check if Razorpay script is loaded
        if (!window.Razorpay) {
            setPaymentError('Razorpay script not loaded. Please try again.');
            toast.error('Failed to load payment gateway. Please refresh the page.');
            return;
        }

        // Check if Razorpay API key is available
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!razorpayKey) {
            setPaymentError('Payment configuration error: API key missing. Please contact support.');
            toast.error('Payment configuration error: API key missing.');
            return;
        }

        try {
            setLoading(true);
            setPaymentError(null);

            // Step 1: Create booking using the service method
            const bookingResponse = await createBooking(bookingPayload);
            if (!bookingResponse.bookingId) {
                throw new Error('Booking creation failed: No booking ID returned');
            }

            // Step 2: Initiate payment
            const paymentRequest = {
                bookingId: bookingResponse.bookingId,
                amount: totalPrice,
                currency: 'INR',
                metadata: {
                    trainName: train.name,
                    seatsBooked: seats,
                    travelDate: travelDate.toISOString().split('T')[0]
                }
            };
            
            await paymentService.createOrder(paymentRequest);
    

            setShowSummary(false);
            setMessage('✅ Booking Successful!');
            toast.success('Booking confirmed successfully!');
        } catch (error) {
            console.error('Booking error:', error);
            let errorMessage = 'Failed to complete booking. Please try again.';
            if (error.message.includes('Payment cancelled')) {
                errorMessage = 'Payment was cancelled. Please try again.';
            } else if (error.message.includes('Payment verification failed')) {
                errorMessage = 'Payment verification failed. Please contact support.';
            } else if (error.message.includes('Razorpay script not loaded')) {
                errorMessage = 'Payment gateway not loaded. Please refresh the page.';
            } else if (error.message.includes('Razorpay API key missing')) {
                errorMessage = 'Payment configuration error. Please contact support.';
            }
            setPaymentError(errorMessage);
            toast.error(`Booking Failed: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    if (!train) {
        return (
            <div className="message-container">
                <p className="error">❌ Train data is not available.</p>
                <button onClick={onCancel} className="cancel-button">Back</button>
            </div>
        );
    }

    if (message) {
        return (
            <div className="message-container">
                <p className={message.includes('Success') ? 'success' : 'error'}>{message}</p>
                <button onClick={onCancel} className="cancel-button">Back</button>
            </div>
        );
    }

    // Fallback UI if payment gateway is unavailable
    if (!import.meta.env.VITE_RAZORPAY_KEY_ID || !window.Razorpay) {
        return (
            <div className="message-container">
                <p className="error">❌ Payment gateway is currently unavailable. Please try again later or contact support.</p>
                <button onClick={onCancel} className="cancel-button">Back</button>
            </div>
        );
    }

    return (
        <div className="booking-form-container">
            <h2>Booking for {train.name}</h2>

            <div className="form-group">
                <label>Seats:</label>
                <input
                    type="number"
                    min="1"
                    value={seats}
                    onChange={(e) => setSeats(parseInt(e.target.value) || 1)}
                    step="1"
                />
            </div>

            <div className="form-group">
                <label>Seat Tier:</label>
                <select value={seatTier} onChange={(e) => setSeatTier(e.target.value)}>
                    <option value="TIER2_SLEEPER">Sleeper</option>
                    <option value="TIER1_AC">AC</option>
                    <option value="TIER3_GENERAL">General</option>
                </select>
            </div>

            <div className="form-group">
                <label>Travel Date:</label>
                <DatePicker
                    selected={travelDate}
                    onChange={(date) => setTravelDate(date)}
                    filterDate={isDateAllowed}
                    minDate={new Date()}
                    dateFormat="yyyy-MM-dd"
                    className="form-control"
                    placeholderText="Select a date"
                />
            </div>

            <div className="form-group total-price">
                <strong>Total Price: ₹{totalPrice.toFixed(2)}</strong>
            </div>

            <div className="button-group">
                <button
                    onClick={handlePrepareBooking}
                    disabled={loading}
                    className="confirm-button"
                >
                    {loading ? 'Processing...' : 'Confirm Booking'}
                </button>

                <button onClick={onCancel} className="cancel-button">
                    Cancel
                </button>
            </div>

            <BookingSummaryPopup
                show={showSummary}
                handleClose={() => setShowSummary(false)}
                bookingData={summaryData}
                handleConfirm={handleConfirmBooking}
                loading={loading}
                paymentError={paymentError}
            />
        </div>
    );
}