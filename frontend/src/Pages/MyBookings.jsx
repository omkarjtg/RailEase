import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { getMyBookings, cancelBooking } from '../services/BookingService';
import '../styles/MyBookings.css';

const BookingDetails = ({ user }) => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelling, setCancelling] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            toast.error('Please log in to view your bookings');
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            const bookingsData = await getMyBookings();
            setBookings(bookingsData);
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to load bookings');
            toast.error(err.message || 'Failed to load bookings');
            setLoading(false);
        }
    };

    const handleCancel = async (bookingId, travelDate) => {
        const travelDateObj = new Date(travelDate);
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
            setCancelling(bookingId);
            const token = localStorage.getItem('token') || user?.token;
            if (!token) throw new Error('Authentication token not found');

            await cancelBooking(bookingId, token);
            toast.success('Booking cancelled successfully');
            await fetchBookings();
            setShowModal(false);
        } catch (err) {
            toast.error(err.message || 'Failed to cancel booking');
        } finally {
            setCancelling(null);
        }
    };

    const handleRowClick = (booking) => {
        setSelectedBooking(booking);
        setShowModal(true);
    };

    const handlePrint = () => {
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Booking #${selectedBooking.id}</title>
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
                            <p>Booking ID: #${selectedBooking.id}</p>
                        </div>
                        <div class="print-detail">
                            <span class="detail-label">Train:</span>
                            <span>${selectedBooking.trainNumber} - ${selectedBooking.trainName}</span>
                        </div>
                        <div class="print-detail">
                            <span class="detail-label">Route:</span>
                            <span>${selectedBooking.source} to ${selectedBooking.destination}</span>
                        </div>
                        <div class="print-detail">
                            <span class="detail-label">Travel Date:</span>
                            <span>${formatDate(selectedBooking.travelDate)}</span>
                        </div>
                        <div class="print-detail">
                            <span class="detail-label">Seat Tier:</span>
                            <span>${selectedBooking.seatTier}</span>
                        </div>
                        <div class="print-detail">
                            <span class="detail-label">Price:</span>
                            <span>₹${selectedBooking.bookedPrice?.toFixed(2) || 'N/A'}</span>
                        </div>
                        <div class="print-detail">
                            <span class="detail-label">Status:</span>
                            <span>${selectedBooking.status}</span>
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
            month: 'short', // Abbreviated month (e.g., Apr)
            year: 'numeric',
        }).format(new Date(date));
    };

    const currentDate = new Date();
    const upcomingBookings = bookings.filter(b => new Date(b.travelDate) > currentDate);
    const pastBookings = bookings.filter(b => new Date(b.travelDate) <= currentDate);

    const renderTable = (list, title) => (
        <>
            <h3>{title}</h3>
            {list.length === 0 ? (
                <p className="no-bookings">No {title.toLowerCase()} found.</p>
            ) : (
                <div className="booking-list">
                    <table className="booking-table">
                        <thead>
                            <tr>
                                <th>Booking ID</th>
                                <th>Train</th>
                                <th>Source</th>
                                <th>Destination</th>
                                <th>Travel Date</th>
                                <th>Price</th>
                                <th>Seat Tier</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((booking) => (
                                <tr
                                    key={booking.bookingId}
                                    onClick={() => handleRowClick(booking)}
                                    className="clickable-row"
                                >
                                    <td>#{booking.bookingId}</td>
                                    <td>{booking.trainNumber} - {booking.trainName}</td>
                                    <td>{booking.source || 'N/A'}</td>
                                    <td>{booking.destination || 'N/A'}</td>
                                    <td>{booking.travelDate ? formatDate(booking.travelDate) : 'N/A'}</td>
                                    <td>{booking.bookedPrice ? `₹${booking.bookedPrice.toFixed(2)}` : 'N/A'}</td>
                                    <td>{booking.seatTier || 'N/A'}</td>
                                    <td>
                                        <span className={`status ${booking.status?.toLowerCase()}`}>
                                            {booking.status || 'N/A'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );

    if (loading) return <div className="booking-container">Loading bookings...</div>;
    if (error) return <div className="booking-container error-text">{error}</div>;

    return (
        <div className="booking-container">
            <h2>My Bookings</h2>

            {renderTable(upcomingBookings, 'Upcoming Bookings')}
            {renderTable(pastBookings, 'Past Bookings')}

            {/* Booking Details Modal */}
            {showModal && selectedBooking && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Booking Details #{selectedBooking.id}</h3>
                            <button
                                className="close-button"
                                onClick={() => setShowModal(false)}
                            >
                                &times;
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="booking-detail">
                                <span className="detail-label">Train:</span>
                                <span>{selectedBooking.trainNumber} - {selectedBooking.trainName}</span>
                            </div>
                            <div className="booking-detail">
                                <span className="detail-label">Route:</span>
                                <span>{selectedBooking.source} to {selectedBooking.destination}</span>
                            </div>
                            <div className="booking-detail">
                                <span className="detail-label">Travel Date:</span>
                                <span>{formatDate(selectedBooking.travelDate)}</span>
                            </div>
                            <div className="booking-detail">
                                <span className="detail-label">Seat Tier:</span>
                                <span>{selectedBooking.seatTier}</span>
                            </div>
                            <div className="booking-detail">
                                <span className="detail-label">Price:</span>
                                <span>₹{selectedBooking.bookedPrice?.toFixed(2) || 'N/A'}</span>
                            </div>
                            <div className="booking-detail">
                                <span className="detail-label">Status:</span>
                                <span className={`status ${selectedBooking.status?.toLowerCase()}`}>
                                    {selectedBooking.status}
                                </span>
                            </div>
                        </div>

                        <div className="modal-footer">
                            {new Date(selectedBooking.travelDate) > currentDate && selectedBooking.status === 'CONFIRMED' && (
                                <button
                                    className="cancel-button"
                                    onClick={() => handleCancel(selectedBooking.id, selectedBooking.travelDate)}
                                    disabled={cancelling === selectedBooking.id}
                                >
                                    {cancelling === selectedBooking.id ? 'Cancelling...' : 'Cancel Booking'}
                                </button>
                            )}
                            <button
                                className="print-button"
                                onClick={handlePrint}
                            >
                                🖨️ Print Booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingDetails;