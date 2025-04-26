import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTrainByNumber, updateTrain } from '../services/TrainService';
import LocationService from '../services/LocationService';

const UpdateTrainForm = () => {
  const navigate = useNavigate();
  const { trainId: trainNumber } = useParams();
  const [locations, setLocations] = useState([]);
  const [train, setTrain] = useState({
    name: '',
    number: '',
    source: '',
    destination: '',
    totalCoach: '',
    seatPerCoach: '',
    price: '',
    schedule: '',
    arrivalTime: '',
    departureTime: ''
  });

  useEffect(() => {
    const fetchTrain = async () => {
      try {
        const fetchedTrain = await getTrainByNumber(trainNumber);
        setTrain(fetchedTrain || {
          name: '',
          number: '',
          source: '',
          destination: '',
          totalCoach: '',
          seatPerCoach: '',
          price: '',
          schedule: '',
          departureTime: '',
          arrivalTime: '',
        });
      } catch (error) {
        console.error('Error fetching train data:', error);
      }
    };
    fetchTrain();
    fetchLocations()
  }, [trainNumber]);

  const fetchLocations = async () => {
    try {
      const data = await getAllLocations();
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTrain({ ...train, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedTrain = {
      ...train,
      departureTime: train.departureTime.length === 5 ? `${train.departureTime}:00` : train.departureTime,
      arrivalTime: train.arrivalTime.length === 5 ? `${train.arrivalTime}:00` : train.arrivalTime,
    };

    try {
      console.log("payload", formattedTrain);  //debugging line
      await updateTrain(formattedTrain);
      navigate('/trains');
    } catch (error) {
      console.error('Error updating train:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Update Train</h2>
      <form onSubmit={handleSubmit} className="form-group">
      <div className="mb-3">
          <label className="form-label">Train Name:</label>
          <input
            type="text"
            name="name"
            value={train.name || ''}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Enter Train Name"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Train Number:</label>
          <input
            type="text"
            name="number"
            value={train.number || ''}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Enter Train Number"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Total Coach:</label>
          <input
            type="number"
            name="totalCoach"
            value={train.totalCoach || ''}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Seats Per Coach:</label>
          <input
            type="number"
            name="seatPerCoach"
            value={train.seatPerCoach || ''}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Source Location:</label>
          <select
            name="source"
            value={train.source}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="">Select Source</option>
            {locations.map(location => (
              <option key={location.id} value={location.city}>
                {location.city}, {location.state}, {location.country}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Destination Location:</label>
          <select
            name="destination"
            value={train.destination}
            onChange={handleInputChange}
            className="form-control"
          >
            <option value="">Select Destination</option>
            {locations.map(location => (
              <option key={location.id} value={location.city}>
                {location.city}, {location.state}, {location.country}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Price:</label>
          <input
            type="text"
            name="price"
            value={train.price || ''}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Enter Price"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Departure Time:</label>
          <input
            type="time"
            name="departureTime"
            value={train.departureTime || ''}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Arrival Time:</label>
          <input
            type="time"
            name="arrivalTime"
            value={train.arrivalTime || ''}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Schedule Date:</label>
          <input
            type="date"
            name="schedule"
            value={train.schedule || ''}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Update Train
        </button>
      </form>
    
      
    </div>
  );
};

export default UpdateTrainForm;
