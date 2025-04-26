import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { addTrain } from '../services/TrainService';
import LocationService from '../services/LocationService';

function AddTrains() {
  const navigate = useNavigate();
  const [flashMessage, setFlashMessage] = useState('');
  const [locations, setLocations] = useState([]);
  

  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user.isAdmin) {
    return <div className='ErrorWindow'>ERROR 403 FORBIDDEN
      <br /> Access denied. You must be an admin to view this page.</div>;
  }

  const [formData, setFormData] = useState({
    name: '',
    number: '',
    source: '',
    destination: '',
    totalCoach: '',
    seatPerCoach: '',
    price: '500',
    schedule: '',
    arrivalTime: '',
    departureTime: ''
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await LocationService.getAllLocations();

        setLocations(data || []);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setFlashMessage('Failed to load locations.');
      }
    };

    fetchLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addTrain(formData);
      setFlashMessage('Train added successfully!');
      navigate('/trains');
    } catch (error) {
      setFlashMessage(error.response?.data?.message || 'Failed to add train. Please try again.');
    }
  };

  return (
    <div className="container mt-4">
      {flashMessage && (
        <div className={`alert ${flashMessage.includes('success') ? 'alert-success' : 'alert-danger'}`}>
          {flashMessage}
        </div>
      )}
      <h2 className="mb-4">Add New Train</h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formTrainName">
            <Form.Label>Train Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formTrainNumber">
            <Form.Label>Train Number</Form.Label>
            <Form.Control
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formSourceLocation">
            <Form.Label>Source Location</Form.Label>
            <Form.Select
              name="source"
              value={formData.source}
              onChange={handleChange}
              required
            >
              <option value="">Select Source</option>
              {locations.map(location => (
                <option key={location.id} value={location.city}>
                  {location.city}, {location.state}, {location.country}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col} controlId="formDestinationLocation">
            <Form.Label>Destination Location</Form.Label>
            <Form.Select
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              required
            >
              <option value="">Select Destination</option>
              {locations.map(location => (
                <option key={location.id} value={location.city}>
                  {location.city}, {location.state}, {location.country}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formCoach">
            <Form.Label>Total Coach</Form.Label>
            <Form.Control
              type="number"
              name="totalCoach"
              value={formData.totalCoach}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formSeats">
            <Form.Label>Seats Per Coach</Form.Label>
            <Form.Control
              type="number"
              name="seatPerCoach"
              value={formData.seatPerCoach}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formScheduleDate">
            <Form.Label>Schedule Date</Form.Label>
            <Form.Control
              type="date"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formDepartureTime">
            <Form.Label>Departure Time</Form.Label>
            <Form.Control
              type="time"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formArrivalTime">
            <Form.Label>Arrival Time</Form.Label>
            <Form.Control
              type="time"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Row>

        <Button variant="primary" type="submit" className="mt-3">
          Add Train
        </Button>
      </Form>
    </div>
  );
}

export default AddTrains;