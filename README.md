# TravelTrack Pro - Travel Agency Driver Tracking App

A comprehensive web-based application for travel agencies to track and manage their drivers in real-time.

## Features

### 🚗 Driver Management
- Add new drivers with detailed information (name, phone, license, vehicle type)
- Real-time status tracking (Available, Busy, Offline)
- Driver profile management with location data
- Complete driver information display

### 📊 Dashboard Analytics
- Live statistics showing total, available, busy, and offline drivers
- Recent activity feed with timestamps
- Quick action buttons for common tasks
- Color-coded status indicators

### 🗺️ Live Tracking
- Real-time location tracking with GPS coordinates
- Address-based location display
- Manual refresh and auto-refresh capabilities
- Last update timestamps for each driver

### 🧳 Trip Management
- Create and assign trips to available drivers
- Track trip status (Pending, In Progress, Completed)
- Trip details including pickup/destination locations
- Passenger information management

### 📱 Responsive Design
- Mobile-friendly interface
- Tablet and desktop optimized layouts
- Touch-friendly controls
- Cross-platform compatibility

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: Local Storage (browser-based)
- **UI Framework**: Custom CSS with Font Awesome icons
- **Architecture**: Single Page Application (SPA)

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/brandoriumofficial/brand.git
   cd brand
   ```

2. Start a local web server:
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

## Usage Guide

### Adding Drivers
1. Navigate to the "Drivers" section
2. Click "Add Driver" button
3. Fill in driver information:
   - Full Name
   - Phone Number
   - License Number
   - Vehicle Type (Sedan, SUV, Van, Bus)
4. Click "Add Driver" to save

### Managing Driver Status
- Click status buttons (Available, Busy, Offline) on driver cards
- Status changes are reflected immediately across all sections
- Location updates automatically when status changes

### Creating Trips
1. Go to "Trips" section
2. Click "Create Trip" button
3. Select an available driver
4. Enter trip details:
   - Pickup location
   - Destination
   - Passenger name
   - Pickup time
5. Submit to assign trip

### Live Tracking
1. Visit "Live Tracking" section
2. View current locations of all drivers
3. Use "Refresh" for manual location updates
4. Enable "Auto Refresh" for continuous tracking

## Data Persistence

The application uses browser Local Storage to persist data:
- Driver information and status
- Trip records
- Activity logs

**Note**: Data is stored locally in the browser and will be lost if browser data is cleared.

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Security Considerations

- Data is stored locally in the browser
- No server-side storage or external API calls
- Suitable for demonstration and small-scale deployments
- For production use, consider implementing proper backend storage

## Future Enhancements

- Real GPS integration
- Backend database storage
- User authentication
- Route optimization
- Push notifications
- Advanced reporting and analytics

## Screenshots

### Dashboard
![Dashboard](https://github.com/user-attachments/assets/7dad463f-2874-4f37-817c-1f523893e70f)

### Driver Management
![Drivers](https://github.com/user-attachments/assets/6954987e-574d-4454-a33f-a036a6fea384)

### Live Tracking
![Tracking](https://github.com/user-attachments/assets/b385cca5-b29c-422a-90f7-8a36385ea9a4)

### Mobile Responsive
![Mobile](https://github.com/user-attachments/assets/d3529a8f-1e9a-4ad4-a81f-db3a8191dd72)

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Support

For support or feature requests, please open an issue on GitHub.
