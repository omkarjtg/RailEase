import { useLocation } from 'react-router-dom';

const MockBookedPage = () => {
    const location = useLocation();
    const { bookingId, name, from, to, date, price } = location.state || {};

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">Booking Confirmation</h1>
            <div className="card" style={{ maxWidth: '600px', margin: 'auto' }}>
                <div className="card-body">
                    <h5 className="card-title text-center">Booking Details</h5>
                    <p className="card-text"><strong>Booking ID:</strong> {bookingId || 'N/A'}</p>
                    <p className="card-text"><strong>Name:</strong> {name || 'N/A'}</p>
                    <p className="card-text"><strong>From:</strong> {from || 'N/A'}</p>
                    <p className="card-text"><strong>To:</strong> {to || 'N/A'}</p>
                    <p className="card-text"><strong>Date:</strong> {date ? new Date(date).toLocaleDateString() : 'N/A'}</p>
                    <p className="card-text"><strong>Price:</strong> ₹{price || 'N/A'}</p>
                    <div className="text-center">
                        <button className="btn btn-primary">View Booking Details</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MockBookedPage;
