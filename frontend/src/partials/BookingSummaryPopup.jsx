import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../styles/BookingSummaryPopup.css';

export default function BookingSummaryPopup({
    show,
    handleClose,
    bookingData,
    handleConfirm,
    loading,
    paymentError,
}) {
    if (!bookingData) return null;

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            aria-labelledby="booking-summary-modal"
            backdrop="static"
            keyboard={!loading}
        >
            <Modal.Header closeButton>
                <Modal.Title id="booking-summary-modal">Booking Summary</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="summary-details">
                    <p>
                        <strong>Train:</strong> {bookingData.trainName}
                    </p>
                    <p>
                        <strong>Seats:</strong> {bookingData.seatsBooked}
                    </p>
                    <p>
                        <strong>Seat Tier:</strong> {bookingData.seatTier}
                    </p>
                    <p>
                        <strong>Travel Date:</strong> {bookingData.travelDate}
                    </p>
                    <p>
                        <strong>Departure Time:</strong> {bookingData.departureTime}
                    </p>
                    <p>
                        <strong>Arrival Time:</strong> {bookingData.arrivalTime}
                    </p>
                    <hr />
                    <h5>
                        <strong>Total Price: ₹{bookingData.bookedPrice.toFixed(2)}</strong>
                    </h5>
                </div>

                {paymentError && (
                    <div className="alert alert-danger mt-3" role="alert">
                        {paymentError} <button className="btn btn-link p-0" onClick={handleConfirm}>Retry Payment</button>
                    </div>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button
                    variant="primary"
                    onClick={handleConfirm}
                    disabled={loading}
                    aria-label="Proceed to payment"
                >
                    {loading ? (
                         <div className="loading-overlay">
                            <Spinner animation="border" size="sm" className="me-2" />
                            Processing Payment...
                        </div>
                    ) : (
                        'Head to Payment'
                    )}
                </Button>
                <Button
                    variant="secondary"
                    onClick={handleClose}
                    disabled={loading}
                    aria-label="Cancel booking"
                >
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

BookingSummaryPopup.propTypes = {
    show: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    bookingData: PropTypes.object,
    handleConfirm: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    paymentError: PropTypes.string,
};