# We Ski - Plan Your Trip

The **We Ski - Plan Your Trip** is a web application designed to help users search for ski accommodations across various destinations. It integrates multiple APIs to provide comprehensive search results based on user preferences.

## Features

- **Destination Selection**: Choose from a list of popular ski destinations.
- **Group Size**: Specify the number of people for accommodation.
- **Date Range**: Select dates for the ski trip.
- **Search Results**: Display accommodations sorted by price and filtered by group size availability.
- **Real-Time Updates**: Receive live updates of search results using WebSocket technology.
- **Responsive UI**: User-friendly interface for easy navigation and interaction.

## Installation and Setup

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
2. Install dependencies:
   ```bash
   npm install
3. Start the server:
   ```bash
   npm start
The server will start running on http://localhost:8000.

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
2. Install dependencies:
   ```bash
   npm install
3. Start the server:
   ```bash
   npm start
The frontend will be accessible on http://localhost:3000.

## Usage

1. Open your web browser and go to http://localhost:3000.
2. Select a destination, specify group size, and choose dates for your ski trip.
3. Click on the "Search" button to fetch and display accommodation options.
4. View the results sorted by price and filtered by group size availability.
5. Make adjustments to search criteria and click "Search" again for updated results.

## Technologies Used

- **Backend**: Node.js, Express.js, Socket.IO, Axios.
- **Frontend**: React.js, Socket.IO Client, Axios.
- **APIs**: External hotel booking APIs.
- **Deployment**: Local development environment.

## Contributing

Contributions are welcome! Feel free to fork this repository and submit pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
