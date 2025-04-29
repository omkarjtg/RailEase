import React from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';

export default function BookingSummaryPopup({
    show,
    handleClose,
    bookingData,
    handleConfirm,
    loading
}) {
    if (!bookingData) return null;

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Booking Summary</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p><strong>Train:</strong> {bookingData.trainName}</p>
                <p><strong>Seats:</strong> {bookingData.seatsBooked}</p>
                <p><strong>Seat Tier:</strong> {bookingData.seatTier}</p>
                <p><strong>Travel Date:</strong> {bookingData.travelDate}</p>
                <p><strong>Departure Time:</strong> {bookingData.departureTime}</p>
                <p><strong>Arrival Time:</strong> {bookingData.arrivalTime}</p>
                <hr />
                <h5><strong>Total Price: ₹{bookingData.bookedPrice.toFixed(2)}</strong></h5>
            </Modal.Body>

            <Modal.Footer>
                
                <Button
                    variant="primary"
                    onClick={handleConfirm}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Booking...
                        </>
                    ) : (
                        'Head to Payment'
                    )}
                </Button>
                <Button variant="secondary" onClick={handleClose}>
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
};
