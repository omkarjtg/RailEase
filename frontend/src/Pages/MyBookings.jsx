import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './MyBookings.css';

const BookingDetails = () => {

  const { userId } = useParams();

  const [bookingDetails, setBookingDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8084/booking')
      .then(response => {
        setBookingDetails(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching booking details:', error);
        setError('Failed to load booking details.');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="booking-table-container">
      <h2>Ticket Booking Details</h2>
      <table className="booking-table">
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>Train Name</th>
            <th>Train Number</th>
            <th>From</th>
            <th>To</th>
            <th>Date</th>
            <th>Fare</th>
            <th>Seat Number</th>
            <th>Class</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookingDetails.map((booking, index) => (
            <tr key={index}>
              <td>{booking.CustomerName}</td>
              <td>{booking.TrainName}</td>
              <td>{booking.TrainNumber}</td>
              <td>{booking.From}</td>
              <td>{booking.To}</td>
              <td>{booking.Date}</td>
              <td>{booking.Fare}</td>
              <td>{booking.SeatNumber}</td>
              <td>{booking.class}</td>
              <td>{booking.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingDetails;
