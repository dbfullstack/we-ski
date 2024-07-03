import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:8000';
const socket = io(serverUrl);

const SearchPage = () => {
    const [destinations, setDestinations] = useState([]);
    const [destination, setDestination] = useState(1);
    const [groupSize, setGroupSize] = useState(1);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [hotels, setHotels] = useState([]);
    const [searchButtonDisabled, setSearchButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);

    let currentSearchId = 0;
    let searchTimeout = null;

    useEffect(() => {
        fetchDestinations();
    }, []);

    useEffect(() => {
        if (destination && groupSize && fromDate && toDate) {
            setSearchButtonDisabled(false);
        } else {
            setSearchButtonDisabled(true);
        }
    }, [destination, groupSize, fromDate, toDate]);

    const fetchDestinations = async () => {
        try {
            const response = await axios.get(`${serverUrl}/destinations`);
            setDestinations(response.data);
            setDestination(response.data[0]?.id);
        } catch (error) {
            console.error('Error fetching destinations:', error);
        }
    };

    const handleSearch = () => {
        setLoading(true);
        setHotels([]);
        setNoResults(false);
        currentSearchId++;
        const currentId = currentSearchId;

        socket.emit('search', {
            searchId: currentId,
            skiSite: destination,
            fromDate,
            toDate,
            groupSize,
        });

        searchTimeout = setTimeout(() => {
            if (hotels.length === 0) {
                setNoResults(true);
                setLoading(false);
            }
        }, 30000);
    };

    useEffect(() => {
        socket.on('newResults', handleNewResults);

        return () => {
            socket.off('newResults', handleNewResults);
        };
    });

    const handleNewResults = (newHotels) => {
        setLoading(false);
        clearTimeout(searchTimeout);
        setHotels(newHotels);
        setNoResults(false);
    };

    return (
        <div className='search-page'>
            <header className='App-header'>
                <h1>We Ski - Plan Your Trip</h1>
                <div className='search-bar'>
                    <select
                        value={destination}
                        onChange={(e) => setDestination(Number(e.target.value))}
                    >
                        {destinations.map((dest) => (
                            <option key={dest.id} value={dest.id}>{dest.name}</option>
                        ))}
                    </select>
                    <input
                        type='number'
                        placeholder='Group Size'
                        value={groupSize}
                        onChange={(e) => setGroupSize(Number(e.target.value))}
                        min='1'
                        max='10'
                    />
                    <input
                        type='date'
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                    />
                    <input
                        type='date'
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                    />
                    <button onClick={handleSearch} disabled={searchButtonDisabled || loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
                <div className='results'>
                    {noResults && <p>No results found</p>}
                    {hotels.length > 0 && (
                        <ul>
                            {hotels.map((hotel) => (
                                <li key={hotel.HotelCode}>
                                    <h2>{hotel.HotelName}</h2>
                                    <p>Price: £{hotel.PricesInfo.AmountAfterTax}</p>
                                    <p>Rating: {hotel.HotelInfo.Rating}</p>
                                    <p>Beds: {hotel.HotelInfo.Beds}</p>
                                    <img src={hotel.HotelDescriptiveContent.Images[0]?.URL} />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </header>
        </div>
    );
};

export default SearchPage;
