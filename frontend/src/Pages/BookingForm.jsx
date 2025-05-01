import { useState, useMemo, useEffect } from "react";
import API from "../services/axios";
import BookingSummaryPopup from "../partials/BookingSummaryPopup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/BookingForm.css";
import { toast } from "react-toastify";
import { createBooking } from "../services/BookingService";
import { useNavigate } from "react-router-dom";
import paymentService from "../services/PaymentService";

const tierMultiplier = {
    TIER1_AC: 2,
    TIER2_SLEEPER: 1,
    TIER3_GENERAL: 0.8,
};

const dayMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
};

export default function BookingForm({ train, onCancel }) {
    const navigate = useNavigate();
    const [formState, setFormState] = useState({
        seats: 1,
        seatTier: "TIER2_SLEEPER",
        travelDate: null,
        loading: false,
        message: "",
        showSummary: false,
        bookingPayload: null,
        summaryData: null,
        paymentError: null,
        razorpayLoaded: false
    });

    const totalPrice = useMemo(() => {
        if (!train) return 0;
        const basePrice = train.price || 0;
        const multiplier = tierMultiplier[formState.seatTier] || 1;
        return basePrice * formState.seats * multiplier;
    }, [formState.seats, formState.seatTier, train]);

    const getAllowedDays = () => {
        return train?.runningDays?.map((day) => dayMap[day.toLowerCase()]) || [];
    };

    const isDateAllowed = (date) => {
        const allowedDays = getAllowedDays();
        return allowedDays.length === 0 || allowedDays.includes(date.getDay());
    };

    useEffect(() => {
        const loadRazorpayScript = () => {
            if (window.Razorpay) {
                setFormState(prev => ({...prev, razorpayLoaded: true}));
                return;
            }

            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            script.onload = () => {
                setFormState(prev => ({...prev, razorpayLoaded: true}));
            };
            script.onerror = () => {
                toast.error("Failed to load payment gateway. Please refresh the page.");
                setFormState(prev => ({...prev, razorpayLoaded: false}));
            };
            document.body.appendChild(script);
        };

        loadRazorpayScript();
    }, []);

    const updateFormState = (updates) => {
        setFormState(prev => ({...prev, ...updates}));
    };

    const handlePrepareBooking = () => {
        if (!formState.travelDate) {
            toast.error("Please select a travel date.");
            return;
        }

        if (!train) {
            updateFormState({message: "❌ Train data is not available."});
            return;
        }

        const apiPayload = {
            trainNumber: train.number,
            seatTier: formState.seatTier,
            seatsBooked: formState.seats,
            travelDate: formState.travelDate.toISOString().split("T")[0],
        };

        const popupSummary = {
            trainName: train.name,
            seatsBooked: formState.seats,
            seatTier: formState.seatTier,
            travelDate: formState.travelDate.toISOString().split("T")[0],
            departureTime: train.departureTime,
            arrivalTime: train.arrivalTime,
            bookedPrice: totalPrice,
        };

        updateFormState({
            bookingPayload: apiPayload,
            summaryData: popupSummary,
            showSummary: true,
            paymentError: null
        });
    };

    const handleConfirmBooking = async () => {
        if (!formState.bookingPayload) return;

        if (!formState.razorpayLoaded || !window.Razorpay) {
            toast.error("Failed to load payment gateway. Please refresh the page.");
            updateFormState({paymentError: "Razorpay script not loaded. Please try again."});
            return;
        }

        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!razorpayKey) {
            toast.error("Payment configuration error: API key missing.");
            updateFormState({paymentError: "Payment configuration error: API key missing."});
            return;
        }

        try {
            updateFormState({loading: true, paymentError: null});

            // Create booking
            const bookingResponse = await createBooking(formState.bookingPayload);
            const responseData = bookingResponse.data || bookingResponse;
            const bookingId = responseData.bookingId || responseData.id || responseData.booking_id;
            const bookedPrice = responseData.bookedPrice || responseData.price;

            if (!bookingId || bookedPrice == null) {
                throw new Error("Booking creation failed: Invalid response from server");
            }

            // Create Razorpay order
            const paymentRequest = {
                bookingId,
                amount: bookedPrice,
                currency: "INR",
                userEmail: localStorage.getItem("userEmail") || "",
                metadata: {
                    trainName: train.name,
                    seatsBooked: formState.seats,
                    travelDate: formState.travelDate.toISOString().split("T")[0],
                },
            };

            const orderResponse = await paymentService.createOrder(paymentRequest);
            const orderData = orderResponse.data;

            if (!orderData?.id || orderData.status !== "created") {
                throw new Error(orderData?.error?.description || "Failed to create payment order");
            }

            // Initialize Razorpay checkout
            const options = {
                key: razorpayKey,
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Railease",
                description: `Payment for booking ${bookingId}`,
                order_id: orderData.id,
                handler: async (response) => {
                    try {
                        const verificationResponse = await paymentService.verifyPayment({
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                        });

                        if (verificationResponse.data?.success) {
                            updateFormState({
                                showSummary: false,
                                message: "✅ Booking Successful!"
                            });
                            toast.success("Booking confirmed successfully!");
                            navigate(`/bookings/${bookingId}`);
                        } else {
                            throw new Error("Payment verification failed");
                        }
                    } catch (error) {
                        toast.error("Payment verification failed. Please contact support.");
                        updateFormState({paymentError: "Payment verification failed"});
                    } finally {
                        updateFormState({loading: false});
                    }
                },
                prefill: {
                    email: paymentRequest.userEmail,
                    contact: localStorage.getItem("userPhone") || "",
                },
                theme: { color: "#3399cc" },
                modal: {
                    ondismiss: () => {
                        toast.error("Payment was cancelled. Please try again.");
                        updateFormState({
                            loading: false,
                            paymentError: "Payment was cancelled"
                        });
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("Booking error:", error);
            toast.error(`Booking Failed: ${error.message}`);
            updateFormState({
                loading: false,
                paymentError: error.message
            });
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

    if (formState.message) {
        return (
            <div className="message-container">
                <p className={formState.message.includes("✅") ? "success" : "error"}>{formState.message}</p>
                <button onClick={onCancel} className="cancel-button">Back</button>
            </div>
        );
    }

    if (!formState.razorpayLoaded || !import.meta.env.VITE_RAZORPAY_KEY_ID) {
        return (
            <div className="message-container">
                <p className="error">❌ Payment gateway is currently unavailable.</p>
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
                    value={formState.seats}
                    onChange={(e) => updateFormState({seats: parseInt(e.target.value) || 1})}
                    step="1"
                />
            </div>

            <div className="form-group">
                <label>Seat Tier:</label>
                <select 
                    value={formState.seatTier} 
                    onChange={(e) => updateFormState({seatTier: e.target.value})}
                >
                    <option value="TIER2_SLEEPER">Sleeper</option>
                    <option value="TIER1_AC">AC</option>
                    <option value="TIER3_GENERAL">General</option>
                </select>
            </div>

            <div className="form-group">
                <label>Travel Date:</label>
                <DatePicker
                    selected={formState.travelDate}
                    onChange={(date) => updateFormState({travelDate: date})}
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
                    disabled={formState.loading}
                    className="confirm-button"
                >
                    {formState.loading ? 'Processing...' : 'Confirm Booking'}
                </button>
                <button onClick={onCancel} className="cancel-button">Cancel</button>
            </div>

            <BookingSummaryPopup
                show={formState.showSummary}
                handleClose={() => updateFormState({showSummary: false})}
                bookingData={formState.summaryData}
                handleConfirm={handleConfirmBooking}
                loading={formState.loading}
                paymentError={formState.paymentError}
            />
        </div>
    );
}