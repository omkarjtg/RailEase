import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { getBookingById, cancelBooking } from '../services/BookingService';
import '../styles/BookingDetail.css';

const BookingDetail = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        // if (!user) {
        //     toast.error('Please log in to view booking details');
        //     navigate('/login');
        //     return;
        // }
        fetchBooking();
    }, [id, user, navigate]);

    const fetchBooking = async () => {
        try {
            const bookingData = await getBookingById(id);
            setBooking(bookingData);
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to load booking details');
            toast.error(err.message || 'Failed to load booking details');
            setLoading(false);
        }
    };

    const handleCancel = async () => {
        const travelDateObj = new Date(booking.travelDate);
        if (travelDateObj <= new Date()) {
            toast.error('Cannot cancel past bookings');
            return;
        }

        const result = await Swal.fire({
            title: 'Cancel Booking?',
            text: 'Refund will be processed within 2-5 business days.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e53e3e',
            cancelButtonColor: '#a0aec0',
            confirmButtonText: 'Yes, cancel it!'
        });

        if (!result.isConfirmed) return;

        try {
            setCancelling(true);
            const token = localStorage.getItem('token') || user?.token;
            if (!token) throw new Error('Authentication token not found');

            await cancelBooking(booking.id, token);
            toast.success('Booking cancelled successfully');
            navigate('/myBookings'); // Redirect back to bookings list
        } catch (err) {
            toast.error(err.message || 'Failed to cancel booking');
        } finally {
            setCancelling(false);
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Booking #${booking.id}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .print-container { max-width: 600px; margin: 0 auto; }
                        .print-header { text-align: center; margin-bottom: 20px; }
                        .print-detail { margin-bottom: 10px; }
                        .detail-label { font-weight: bold; display: inline-block; width: 150px; }
                        .print-footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
                        @page { size: auto; margin: 10mm; }
                    </style>
                </head>
                <body>
                    <div class="print-container">
                        <div class="print-header">
                            <h2>Booking Confirmation</h2>
                            <p>Booking ID: #${booking.id}</p>
                        </div>
                        <div class="print-detail">
                            <span class="detail-label">Train:</span>
                            <span>${booking.trainNumber} - ${booking.trainName}</span>
                        </div>
                        <div class="print-detail">
                            <span class="detail-label">Route:</span>
                            <span>${booking.source} to ${booking.destination}</span>
                        </div>
                        <div class="print-detail">
                            <span class="detail-label">Travel Date:</span>
                            <span>${formatDate(booking.travelDate)}</span>
                        </div>
                        <div class="print-detail">
                            <span class="detail-label">Departure:</span>
                            <span>${booking.departureTime || 'N/A'}</span>
                        </div>
                        <div class="print-detail">
                            <span class="detail-label">Seat Tier:</span>
                            <span>${booking.seatTier}</span>
                        </div>
                        <div class="print-detail">
                            <span class="detail-label">Seats Booked:</span>
                            <span>${booking.seatsBooked}</span>
                        </div>
                        <div class="print-detail">
                            <span class="detail-label">Price:</span>
                            <span>₹${booking.bookedPrice?.toFixed(2) || 'N/A'}</span>
                        </div>
                        <div class="print-detail">
                            <span class="detail-label">Status:</span>
                            <span>${booking.status}</span>
                        </div>
                        <div class="print-footer">
                            <p>Thank you for choosing our service</p>
                            <p>Printed on ${new Date().toLocaleString()}</p>
                        </div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        }).format(new Date(date));
    };

    if (loading) return <div className="booking-detail-container">Loading booking details...</div>;
    if (error) return <div className="booking-detail-container error-text">{error}</div>;
    if (!booking) return <div className="booking-detail-container">Booking not found</div>;

    const isUpcoming = new Date(booking.travelDate) > new Date();

    return (
        <div className="booking-detail-container">
            <div className="booking-detail-header">
                <h2>Booking Details #{booking.id}</h2>
                <button
                    className="close-button"
                    onClick={() => navigate('/myBookings')}
                >
                    &times;
                </button>
            </div>

            <div className="booking-detail-card">
                <div className="booking-detail">
                    <span className="detail-label">Train:</span>
                    <span>{booking.trainNumber} - {booking.trainName}</span>
                </div>
                <div className="booking-detail">
                    <span className="detail-label">Route:</span>
                    <span>{booking.source} to {booking.destination}</span>
                </div>
                <div className="booking-detail">
                    <span className="detail-label">Travel Date:</span>
                    <span>{formatDate(booking.travelDate)}</span>
                </div>
                <div className="booking-detail">
                    <span className="detail-label">Departure:</span>
                    <span>{booking.departureTime || 'N/A'}</span>
                </div>
                <div className="booking-detail">
                    <span className="detail-label">Seat Tier:</span>
                    <span>{booking.seatTier}</span>
                </div>
                <div className="booking-detail">
                    <span className="detail-label">Seats Booked:</span>
                    <span>{booking.seatsBooked}</span>
                </div>
                <div className="booking-detail">
                    <span className="detail-label">Price:</span>
                    <span>₹{booking.bookedPrice?.toFixed(2) || 'N/A'}</span>
                </div>
                <div className="booking-detail">
                    <span className="detail-label">Status:</span>
                    <span className={`status ${booking.status?.toLowerCase()}`}>
                        {booking.status}
                    </span>
                </div>

                <div className="booking-actions">
                    {isUpcoming && booking.status === 'CONFIRMED' && (
                        <button
                            className="cancel-button"
                            onClick={handleCancel}
                            disabled={cancelling}
                        >
                            {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                    )}
                    <button
                        className="print-button"
                        onClick={handlePrint}
                    >
                        🖨️ Print Booking
                    </button>
                    {/* <button
                        className="back-button"
                        onClick={() => navigate('/bookings')}
                    >
                        Back to My Bookings
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export default BookingDetail;