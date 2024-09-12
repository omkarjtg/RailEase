import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddTrains.css';
import { getAllLocations } from '../locationService';

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
        const data = await getAllLocations();
        setLocations(data || []);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setFlashMessage('Failed to load locations.');
      }
    };

    fetchLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const processedData = {
      ...formData,
      totalCoach: Number(formData.totalCoach),
      seatPerCoach: Number(formData.seatPerCoach),
      price: Number(formData.price),
      schedule: formData.schedule,
      departureTime: `${formData.departureTime}:00`,  
      arrivalTime: `${formData.arrivalTime}:00`,      
    };
  
    console.log('Processed Form Data:', processedData);
  
    try {
      const response = await axios.post('http://localhost:8080/trains', processedData, {
        headers: { 'Content-Type': 'application/json' }
      });
  
      console.log('Success:', response.data);
      setFlashMessage('Train added successfully!');
      setFormData({
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
      navigate('/trains');
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response);
        setFlashMessage(`Failed to add train. ${error.response.data}`);
      } else if (error.request) {
        console.error('Error request:', error.request);
        setFlashMessage('Failed to add train. No response from server.');
      } else {
        console.error('Error:', error.message);
        setFlashMessage('Failed to add train. Please try again.');
      }
    }
  };

  return (
    <div>
      {flashMessage && <div className="flash-message">{flashMessage}</div>}
      <Form onSubmit={handleSubmit} className="form">
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formTrainName">
            <Form.Label>Train Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter Train Name"
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formTrainNumber">
            <Form.Label>Train Number</Form.Label>
            <Form.Control
              type="text"
              name="number"
              value={formData.number}
              onChange={handleChange}
              placeholder="Enter Train Number"
            />
          </Form.Group>
        </Row>

        <Form.Group className="mb-3" controlId="formSourceLocation">
          <Form.Label>Source Location</Form.Label>
          <Form.Select
            name="source"
            value={formData.source}
            onChange={handleChange}
          >
            <option value="">Select Source</option>
            {locations.map(location => (
              <option key={location.id} value={location.city}>
                {location.city}, {location.state}, {location.country}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formDestinationLocation">
          <Form.Label>Destination Location</Form.Label>
          <Form.Select
            name="destination"
            value={formData.destination}
            onChange={handleChange}
          >
            <option value="">Select Destination</option>
            {locations.map(location => (
              <option key={location.id} value={location.city}>
                {location.city}, {location.state}, {location.country}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formCoach">
            <Form.Label>Total Coach</Form.Label>
            <Form.Control
              type="number"
              name="totalCoach"
              value={formData.totalCoach}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formPrice">
            <Form.Label>Price</Form.Label>
            <Form.Select
              name="price"
              value={formData.price}
              onChange={handleChange}
            >
              <option value="500">500</option>
              <option value="1500">1500</option>
              <option value="2500">2500</option>
              <option value="3500">3500</option>
            </Form.Select>
          </Form.Group>

          <Form.Group as={Col} controlId="formSeats">
            <Form.Label>Total Seats</Form.Label>
            <Form.Control
              type="number"
              name="seatPerCoach"
              value={formData.seatPerCoach}
              onChange={handleChange}
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formArrivalTime">
            <Form.Label>Arrival Time</Form.Label>
            <Form.Control
              type="time"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formDepartureTime">
            <Form.Label>Departure Time</Form.Label>
            <Form.Control
              type="time"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formScheduleDate">
            <Form.Label>Schedule Date</Form.Label>
            <Form.Control
              type="date"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
            />
          </Form.Group>
        </Row>

        <Button variant="primary" type="submit">
          Add Train
        </Button>
      </Form>
    </div>
  );
}

export default AddTrains;
