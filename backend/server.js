const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
    }
});
const PORT = process.env.PORT || 8000;

app.use(express.json());

const API_PROVIDERS = [
    'https://gya7b1xubh.execute-api.eu-west-2.amazonaws.com/default/HotelsSimulator',
    // Add more API_PROVIDERS here
];

const destinations = [
    { id: 1, name: 'Val Thorens' },
    { id: 2, name: 'Courchevel' },
    { id: 3, name: 'Tignes' },
    { id: 4, name: 'La Plagne' },
    { id: 5, name: 'Chamonix' }
];

const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };

    return new Date(dateString).toLocaleDateString('en-GB', options);
};

app.get('/destinations', (req, res) => {
    res.json(destinations);
});

io.on('connection', (socket) => {
    console.log(`a user ${socket.id} connected`);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('search', async ({ skiSite, fromDate, toDate, groupSize }) => {
        const formattedFromDate = formatDate(fromDate);
        const formattedToDate = formatDate(toDate);

        try {
            let groupSizes = [groupSize];
            if (groupSize === 1) {
                groupSizes = [1, 2, 3];
            } else {
                groupSizes = [groupSize, groupSize + 1, groupSize + 2];
            }

            const searchResults = await Promise.all(API_PROVIDERS.map(async (apiProvider) => {
                const responses = await Promise.all(groupSizes.map(async (size) => {
                    const response = await axios.post(apiProvider, {
                        query: {
                            ski_site: skiSite,
                            from_date: formattedFromDate,
                            to_date: formattedToDate,
                            group_size: size,
                        },
                    });
        
                    return response.data.body.accommodations;
                }));

                return responses.flat();
            }));

            const mergedResults = mergeAndFilterResults(searchResults.flat());
            const sortedResults = mergedResults.sort((a, b) => a.PricesInfo.AmountAfterTax - b.PricesInfo.AmountAfterTax);

            io.to(socket.id).emit('newResults', sortedResults);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    });
});

const mergeAndFilterResults = (results) => {
    const merged = {};

    results.forEach(result => {
        const key = result.HotelCode;
        if (!merged[key] || merged[key].PricesInfo.AmountAfterTax > result.PricesInfo.AmountAfterTax) {
            merged[key] = result;
        }
    });

    return Object.values(merged);
};

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
