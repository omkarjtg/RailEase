import React from 'react';
import { useLocation } from 'react-router-dom';
import './Search.css';

const Results = () => {
    const location = useLocation();
    const { From, To, Date, Category, SeatTier } = location.state;

    const mockTrains = [
        {number: '12345', name: 'Goa Express', departure: '10:00 AM', arrival: '4:00 PM', class: 'Sleeper', availability: 'Available', fare: '500' },
        {number: '54321', name: 'Vande-Bharat Express', departure: '2:00 PM', arrival: '8:00 PM', class: '3-AC', availability: 'Waiting', fare: '1000' },
        {number: '54320', name: 'Pune-Danapur SF', departure: '9:00 PM', arrival: '8:45 PM', class: '2-AC', availability: 'Waiting', fare: '2000'},
        {number: '53490', name: 'Jhelum Express', departure: '7:00 AM', arrival: '8:45 PM', class: '1-AC', availability: 'Waiting', fare: '3000'},
        {number: '54320', name: 'Pune-Danapur SF', departure: '9:00 PM', arrival: '8:45 PM', class: '1-AC', availability: 'Waiting', fare: '2000'},
        {number: '54320', name: 'Duronto SF', departure: '9:00 PM', arrival: '8:45 PM', class: '1-AC', availability: 'Waiting', fare: '2000'},
        {number: '54320', name: 'Sachkhand SF', departure: '6:45 PM', arrival: '6:35 PM', class: '1-AC', availability: 'Waiting', fare: '2000'},
        {number: '54320', name: 'Humsafar SF', departure: '4:55 AM', arrival: '4:45 AM', class: '1-AC', availability: 'Waiting', fare: '2000'}
    ];

    const filteredTrains = mockTrains.filter(train =>
        train.class === SeatTier || SeatTier === 'All Classes'
    );

    return (
        <div id='div1'>
            <h2>Trains from {From} to {To} on {Date}</h2>
            <table>
                <thead>
                    <tr>
                        <th>Train No</th>
                        <th>Train Name</th>
                        <th>Departure</th>
                        <th>Arrival</th>
                        <th>Class</th>
                        <th>Availability</th>
                        <th>Fare</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTrains.map((train) => (
                        <tr key={train.number}>
                            <td>{train.number}</td>
                            <td>{train.name}</td>
                            <td>{train.departure}</td>
                            <td>{train.arrival}</td>
                            <td>{train.class}</td>
                            <td>{train.availability}</td>
                            <td>{train.fare}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Results;
