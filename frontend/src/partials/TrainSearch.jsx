import React, { useState, useEffect } from 'react';
import { searchTrains, getTrainByNumber } from '../services/TrainService';
import { getAllLocations } from '../services/LocationService';
import '../styles/TrainSearchForm.css';

const TrainSearchForm = ({ onSearchResults, onClearSearch }) => {
    const [searchType, setSearchType] = useState('route');
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [trainNumber, setTrainNumber] = useState('');
    const [travelDate, setTravelDate] = useState('');
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [locationsLoading, setLocationsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [locationsError, setLocationsError] = useState(null);

    useEffect(() => {
        setTravelDate(new Date().toISOString().split('T')[0]);
        const fetchLocations = async () => {
            setLocationsLoading(true);
            try {
                const data = await getAllLocations();
                setLocations(data);
            } catch (err) {
                setLocationsError(err.message || 'Failed to load stations');
            } finally {
                setLocationsLoading(false);
            }
        };
        fetchLocations();
    }, []);

    const handleClear = () => {
        setSource('');
        setDestination('');
        setTrainNumber('');
        setTravelDate(new Date().toISOString().split('T')[0]);
        setError(null);
        onClearSearch();
    };
    const handleRouteSearch = async (e) => {
        e.preventDefault();
        if (source === destination) {
            setError('Source and destination cannot be the same');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const sourceCity = locations.find(loc => loc.stationCode === source)?.city;
            const destinationCity = locations.find(loc => loc.stationCode === destination)?.city;
            if (!sourceCity || !destinationCity) throw new Error('Invalid station selection');
            const results = await searchTrains(sourceCity, destinationCity, travelDate);
            onSearchResults(results);
        } catch (err) {
            setError(err.message || 'Failed to find trains');
            onSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleNumberSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const result = await getTrainByNumber(trainNumber);
            onSearchResults(result ? [result] : []);
        } catch (err) {
            setError(err.message || 'Train not found');
            onSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="train-search-form">
            <div className="search-toggle">
                <button
                    className={`toggle-btn ${searchType === 'route' ? 'active' : ''}`}
                    onClick={() => setSearchType('route')}
                >
                    By Route
                </button>
                <button
                    className={`toggle-btn ${searchType === 'number' ? 'active' : ''}`}
                    onClick={() => setSearchType('number')}
                >
                    By Number
                </button>
            </div>

            {searchType === 'route' ? (
                <form onSubmit={handleRouteSearch} className="form">
                    <div className="form-group">
                        <label>From</label>
                        {locationsLoading ? <Spinner /> : locationsError ? (
                            <p className="error">{locationsError}</p>
                        ) : (
                            <select
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                                required
                                disabled={locationsLoading}
                            >
                                <option value="">Select Source</option>
                                {locations.map(loc => (
                                    <option key={loc.locationId} value={loc.stationCode}>
                                        {loc.city} ({loc.stationCode})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="form-group">
                        <label>To</label>
                        {locationsLoading ? <Spinner /> : locationsError ? (
                            <p className="error">{locationsError}</p>
                        ) : (
                            <select
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                required
                                disabled={locationsLoading}
                            >
                                <option value="">Select Destination</option>
                                {locations.map(loc => (
                                    <option key={loc.locationId} value={loc.stationCode}>
                                        {loc.city} ({loc.stationCode})
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                    <div className="form-group">
                        <label>Date</label>
                        <input
                            type="date"
                            value={travelDate}
                            onChange={(e) => setTravelDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" disabled={loading || locationsLoading || locationsError}>
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                        <button type="button" className="clear-btn" onClick={handleClear}>
                            Clear
                        </button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleNumberSearch} className="form">
                    <div className="form-group">
                        <label>Train Number</label>
                        <input
                            type="text"
                            value={trainNumber}
                            onChange={(e) => setTrainNumber(e.target.value)}
                            placeholder="e.g., 12001"
                            required
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" disabled={loading || locationsLoading || locationsError}>
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                        <button type="button" className="clear-btn" onClick={handleClear}>
                            Clear
                        </button>
                    </div>
                </form>
            )}

            {error && <div className="error">{error}</div>}
            {loading && <div className="loading"><Spinner /> Searching...</div>}
        </div>
    );
};

const Spinner = () => (
    <div className="spinner-border spinner-border-sm" role="status">
        <span className="visually-hidden">Loading...</span>
    </div>
);

export default TrainSearchForm;