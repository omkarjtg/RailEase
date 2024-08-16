import React, { useState, useEffect } from 'react';
import './ViewScheduledTrain.css';

const trainSchedule = [
  { id: 1, name: 'Express 101', departure: '10:00 AM', arrival: '1:00 PM', status: 'On Time' },
  { id: 2, name: 'Regional 202', departure: '11:30 AM', arrival: '2:30 PM', status: 'Delayed' },
  { id: 3, name: 'Intercity 303', departure: '1:00 PM', arrival: '4:00 PM', status: 'On Time' },
  { id: 3, name: 'Intercity 303', departure: '1:00 PM', arrival: '4:00 PM', status: 'On Time' },
  { id: 3, name: 'Intercity 303', departure: '1:00 PM', arrival: '4:00 PM', status: 'On Time' },
  { id: 3, name: 'Intercity 303', departure: '1:00 PM', arrival: '4:00 PM', status: 'On Time' },
  { id: 3, name: 'Intercity 303', departure: '1:00 PM', arrival: '4:00 PM', status: 'On Time' },
  { id: 3, name: 'Intercity 303', departure: '1:00 PM', arrival: '4:00 PM', status: 'On Time' },
  { id: 3, name: 'Intercity 303', departure: '1:00 PM', arrival: '4:00 PM', status: 'On Time' },
  { id: 3, name: 'Intercity 303', departure: '1:00 PM', arrival: '4:00 PM', status: 'On Time' }

];

const ScheduledTrainComponent = () => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    setSchedule(trainSchedule);
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 id='h2'>Scheduled Trains</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead id='color'>
          <tr>
            <th>Train Name</th>
            <th>Departure</th>
            <th>Arrival</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((train) => (
            <tr key={train.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{train.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{train.departure}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{train.arrival}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', color: train.status === 'Delayed' ? 'red' : 'green' }}>
                {train.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduledTrainComponent;
