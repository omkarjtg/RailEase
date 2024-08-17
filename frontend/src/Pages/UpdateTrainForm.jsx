import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getTrainByNumber, updateTrain } from '../trainService';

const UpdateTrainForm = () => {
  const { trainId } = useParams();
  const [train, setTrain] = useState({
    name: '',
    number: '',
    departureTime: '',
    arrivalTime: '',
  });

  useEffect(() => {
    const fetchTrain = async () => {
      try {
        const fetchedTrain = await getTrainByNumber(trainId);
        setTrain(fetchedTrain || { name: '', number: '', departureTime: '', arrivalTime: '' });
      } catch (error) {
        console.error('Error fetching train data:', error);
      }
    };

    fetchTrain();
  }, [trainId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTrain({ ...train, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTrain(train);
      console.log('Train updated successfully:', train); // Debugging line
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
        <button type="submit" className="btn btn-primary">
          Update Train
        </button>
      </form>
    </div>
  );
};

export default UpdateTrainForm;
