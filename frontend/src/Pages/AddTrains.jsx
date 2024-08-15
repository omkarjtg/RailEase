import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import './AddTrains.css';

function AddTrains() {
  const [formData, setFormData] = useState({
    trainName: '',
    trainNumber: '',
    sourceLocation: '',
    destinationLocation: '',
    totalCoach: '',
    price: '500',
    totalSeats: '',
    confirm: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
   await fetch('https://localhost:8080/api/addtrains', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });

    // Reset form data after submission
    setFormData({
      trainName: '',
      trainNumber: '',
      sourceLocation: '',
      destinationLocation: '',
      totalCoach: '',
      price: '500',
      totalSeats: '',
      confirm: false
    });
  };

  return (
    <Form onSubmit={handleSubmit} className="form">
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formTrainName">
          <Form.Label>Train Name</Form.Label>
          <Form.Control 
            type="text" 
            name="trainName" 
            value={formData.trainName} 
            onChange={handleChange} 
            placeholder="Enter Train Name" 
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formTrainNumber">
          <Form.Label>Train Number</Form.Label>
          <Form.Control 
            type="text" 
            name="trainNumber" 
            value={formData.trainNumber} 
            onChange={handleChange} 
            placeholder="Enter Train Number" 
          />
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" controlId="formSourceLocation">
        <Form.Label>Source Location</Form.Label>
        <Form.Control 
          name="sourceLocation" 
          value={formData.sourceLocation} 
          onChange={handleChange} 
          placeholder="Enter Location" 
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formDestinationLocation">
        <Form.Label>Destination Location</Form.Label>
        <Form.Control 
          name="destinationLocation" 
          value={formData.destinationLocation} 
          onChange={handleChange} 
          placeholder="Enter Location" 
        />
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
            name="totalSeats" 
            value={formData.totalSeats} 
            onChange={handleChange} 
          />
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" id="formConfirm">
        <Form.Check 
          type="checkbox" 
          name="confirm" 
          checked={formData.confirm} 
          onChange={handleChange} 
          label="Confirm" 
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Add Train
      </Button>
    </Form>
  );
}

export default AddTrains;