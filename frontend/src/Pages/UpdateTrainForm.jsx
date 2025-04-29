import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { getTrainByNumber, updateTrain, getTrainById } from '../services/TrainService';
import { getAllLocations } from '../services/LocationService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/AddTrains.css'; // Reuse AddTrains styling for consistency

const UpdateTrainForm = () => {
  const navigate = useNavigate();
  const { trainId: trainNumber } = useParams();
  const [locations, setLocations] = useState([]);
  const [flashMessage, setFlashMessage] = useState(''); // Added for consistent error/success messaging
  const [train, setTrain] = useState({
    name: '',
    number: '',
    source: '',
    destination: '',
    totalCoach: '',
    seatPerCoach: '',
    price: '',
    runningDays: [], // Added to match TrainRequestDTO
    departureTime: '',
    arrivalTime: '',
  });

  const daysOfWeek = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ];

  useEffect(() => {
    const fetchTrain = async () => {
      try {
        const fetchedTrain = await getTrainById(trainNumber); // Use trainNumber here
        setTrain({
          name: fetchedTrain.name || '',
          number: fetchedTrain.number || '',
          source: fetchedTrain.source || '',
          destination: fetchedTrain.destination || '',
          totalCoach: fetchedTrain.totalCoach || '',
          seatPerCoach: fetchedTrain.seatPerCoach || '',
          price: fetchedTrain.price || '',
          runningDays: fetchedTrain.runningDays || [], // Ensure this matches backend response
          departureTime:
            fetchedTrain.departureTime?.slice(0, 5) || '', // Convert HH:mm:ss to HH:mm
          arrivalTime: fetchedTrain.arrivalTime?.slice(0, 5) || '', // Convert HH:mm:ss to HH:mm
        });
      } catch (error) {
        console.error('Error fetching train data:', error);
        setFlashMessage('Failed to fetch train data.');
        toast.error('Failed to fetch train data.');
      }
    };

    const fetchLocations = async () => {
      try {
        const data = await getAllLocations();
        setLocations(data || []);
      } catch (error) {
        console.error('Error fetching locations:', error);
        setFlashMessage('Failed to fetch locations.');
        toast.error('Failed to fetch locations.');
      }
    };

    fetchTrain();
    fetchLocations();
  }, [trainNumber]); // Ensure trainNumber is used here

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTrain({ ...train, [name]: value });
  };

  const handleDayChange = (e) => {
    const { value, checked } = e.target;
    setTrain((prev) => ({
      ...prev,
      runningDays: checked
        ? [...prev.runningDays, value]
        : prev.runningDays.filter((d) => d !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (train.runningDays.length === 0) {
      setFlashMessage('Please select at least one operating day.');
      toast.error('Please select at least one operating day.');
      return;
    }

    const formattedTrain = {
      ...train,
      departureTime:
        train.departureTime.length === 5 ? `${train.departureTime}:00` : train.departureTime,
      arrivalTime: train.arrivalTime.length === 5 ? `${train.arrivalTime}:00` : train.arrivalTime,
      totalCoach: parseInt(train.totalCoach, 10) || 0,
      seatPerCoach: parseInt(train.seatPerCoach, 10) || 0,
      price: parseFloat(train.price) || 0,
    };

    try {
      console.log('Sending payload:', formattedTrain);
      await updateTrain(formattedTrain); // Pass formattedTrain directly
      setFlashMessage('Train updated successfully!');
      toast.success('Train updated successfully!');
      setTimeout(() => navigate('/trains'), 1500);
    } catch (error) {
      console.error('Error updating train:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update train.';
      setFlashMessage(errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="add-train-container">
      {flashMessage && (
        <div className={`alert ${flashMessage.includes('success') ? 'alert-success' : 'alert-danger'}`}>
          {flashMessage}
        </div>
      )}
      <h2 className="mb-4">Update Train</h2>
      <Form onSubmit={handleSubmit} className="train-form">
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formTrainName">
            <Form.Label>Train Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={train.name || ''}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formTrainNumber">
            <Form.Label>Train Number</Form.Label>
            <Form.Control
              type="text"
              name="number"
              value={train.number || ''}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formSourceLocation">
            <Form.Label>Source Location</Form.Label>
            <Form.Select
              name="source"
              value={train.source || ''}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Source</option>
              {locations.map((location) => (
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
              value={train.destination || ''}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Destination</option>
              {locations.map((location) => (
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
              value={train.totalCoach || ''}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formSeats">
            <Form.Label>Seats Per Coach</Form.Label>
            <Form.Control
              type="number"
              name="seatPerCoach"
              value={train.seatPerCoach || ''}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={train.price || ''}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formDaysOfWeek">
            <Form.Label>Days of Operation</Form.Label>
            <div className="days-of-week-container">
              {daysOfWeek.map((day) => (
                <div key={day} className="train-days-checkbox">
                  <Form.Check
                    type="checkbox"
                    id={`day-${day}`}
                    label={day.charAt(0) + day.slice(1).toLowerCase()}
                    name="runningDays"
                    value={day}
                    checked={train.runningDays.includes(day)}
                    onChange={handleDayChange}
                  />
                </div>
              ))}
            </div>
            {train.runningDays.length === 0 && (
              <Form.Text className="text-danger">Please select at least one day.</Form.Text>
            )}
          </Form.Group>

          <Form.Group as={Col} controlId="formDepartureTime">
            <Form.Label>Departure Time</Form.Label>
            <Form.Control
              type="time"
              name="departureTime"
              value={train.departureTime || ''}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group as={Col} controlId="formArrivalTime">
            <Form.Label>Arrival Time</Form.Label>
            <Form.Control
              type="time"
              name="arrivalTime"
              value={train.arrivalTime || ''}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
        </Row>

        <Button variant="success" type="submit" className="submit-btn mt-3">
          Update Train
        </Button>
      </Form>
    </div>
  );
};

export default UpdateTrainForm;