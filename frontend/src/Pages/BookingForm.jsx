import { useState, useMemo } from 'react';
import API from '../services/axios';
import BookingSummaryPopup from '../partials/BookingSummaryPopup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/BookingForm.css';
import { toast } from 'react-toastify';

export default function BookingForm({ train, onCancel }) {
    const [seats, setSeats] = useState(1);
    const [seatTier, setSeatTier] = useState('SLEEPER');
    const [travelDate, setTravelDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showSummary, setShowSummary] = useState(false);
    const [bookingPayload, setBookingPayload] = useState(null);
    const [summaryData, setSummaryData] = useState(null);


    const tierMultiplier = {
        SLEEPER: 1,
        AC: 2,
        GENERAL: 0.8,
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
        if (!allowedDays.length) return true; // Allow all dates if no runningDays
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
            bookedPrice: totalPrice, // << important for popup
        };

        setBookingPayload(apiPayload);
        setSummaryData(popupSummary);
        setShowSummary(true);
    };



    const handleConfirmBooking = async () => {
        if (!bookingPayload) return;
        try {
            setLoading(true);
            await API.post('/api/booking', bookingPayload);
            toast.success('Booking Successful');
            setMessage('✅ Booking Successful!');
        } catch (error) {
            console.error('Booking error:', error);
            toast.error('Booking Failed, try again');
            setMessage('❌ Booking Failed. Try again.');
        } finally {
            setLoading(false);
            setShowSummary(false);
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
                <select
                    value={seatTier}
                    onChange={(e) => setSeatTier(e.target.value)}
                >
                    <option value="SLEEPER">Sleeper</option>
                    <option value="AC">AC</option>
                    <option value="GENERAL">General</option>
                </select>
            </div>

            <div className="form-group">
                <label>Travel Date:</label>
                <DatePicker
                    selected={travelDate}
                    onChange={(date) => setTravelDate(date)}
                    filterDate={isDateAllowed}
                    minDate={new Date()} // Prevent past dates
                    dateFormat="yyyy-MM-dd"
                    className="form-control" // Match form input styling
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
                    {loading ? 'Booking...' : 'Confirm Booking'}
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
            />

        </div>
    );
}