// Travel Agency Driver Tracking App - JavaScript

class TravelTrackingApp {
    constructor() {
        this.drivers = JSON.parse(localStorage.getItem('drivers')) || [];
        this.trips = JSON.parse(localStorage.getItem('trips')) || [];
        this.activities = JSON.parse(localStorage.getItem('activities')) || [];
        this.autoRefreshInterval = null;
        this.isAutoRefreshing = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDashboard();
        this.renderDrivers();
        this.renderTrips();
        this.renderTracking();
        this.populateDriverSelect();
        
        // Add some sample data if none exists
        if (this.drivers.length === 0) {
            this.addSampleData();
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.switchSection(e.target.dataset.section);
            });
        });

        // Forms
        document.getElementById('add-driver-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addDriver();
        });

        document.getElementById('add-trip-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTrip();
        });

        // Modal close on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    switchSection(section) {
        // Update nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update sections
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        // Update content if needed
        if (section === 'tracking') {
            this.renderTracking();
        }
    }

    addSampleData() {
        const sampleDrivers = [
            {
                id: this.generateId(),
                name: 'John Smith',
                phone: '+1-555-0123',
                license: 'DL123456',
                vehicle: 'sedan',
                status: 'available',
                location: { lat: 40.7128, lng: -74.0060, address: 'New York, NY' },
                lastUpdate: new Date().toISOString()
            },
            {
                id: this.generateId(),
                name: 'Sarah Johnson',
                phone: '+1-555-0124',
                license: 'DL789012',
                vehicle: 'suv',
                status: 'busy',
                location: { lat: 40.7589, lng: -73.9851, address: 'Times Square, NY' },
                lastUpdate: new Date().toISOString()
            },
            {
                id: this.generateId(),
                name: 'Mike Wilson',
                phone: '+1-555-0125',
                license: 'DL345678',
                vehicle: 'van',
                status: 'offline',
                location: { lat: 40.6892, lng: -74.0445, address: 'Statue of Liberty, NY' },
                lastUpdate: new Date(Date.now() - 30 * 60000).toISOString()
            }
        ];

        sampleDrivers.forEach(driver => {
            this.drivers.push(driver);
            this.addActivity(`Driver ${driver.name} added to system`, 'info');
        });

        this.saveData();
        this.updateDashboard();
        this.renderDrivers();
        this.populateDriverSelect();
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    addDriver() {
        const name = document.getElementById('driver-name').value;
        const phone = document.getElementById('driver-phone').value;
        const license = document.getElementById('driver-license').value;
        const vehicle = document.getElementById('driver-vehicle').value;

        const driver = {
            id: this.generateId(),
            name,
            phone,
            license,
            vehicle,
            status: 'available',
            location: this.generateRandomLocation(),
            lastUpdate: new Date().toISOString()
        };

        this.drivers.push(driver);
        this.saveData();
        this.updateDashboard();
        this.renderDrivers();
        this.populateDriverSelect();
        this.addActivity(`New driver ${name} added`, 'success');
        this.closeModal('add-driver-modal');
        this.resetForm('add-driver-form');
        this.showMessage('Driver added successfully!', 'success');
    }

    addTrip() {
        const driverId = document.getElementById('trip-driver').value;
        const pickup = document.getElementById('trip-pickup').value;
        const destination = document.getElementById('trip-destination').value;
        const passenger = document.getElementById('trip-passenger').value;
        const time = document.getElementById('trip-time').value;

        const driver = this.drivers.find(d => d.id === driverId);
        if (!driver) {
            this.showMessage('Please select a valid driver', 'error');
            return;
        }

        if (driver.status !== 'available') {
            this.showMessage('Selected driver is not available', 'error');
            return;
        }

        const trip = {
            id: this.generateId(),
            driverId,
            driverName: driver.name,
            pickup,
            destination,
            passenger,
            time,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        this.trips.push(trip);
        
        // Update driver status
        driver.status = 'busy';
        
        this.saveData();
        this.updateDashboard();
        this.renderDrivers();
        this.renderTrips();
        this.populateDriverSelect();
        this.addActivity(`Trip assigned to ${driver.name}`, 'info');
        this.closeModal('add-trip-modal');
        this.resetForm('add-trip-form');
        this.showMessage('Trip created successfully!', 'success');
    }

    updateDriverStatus(driverId, newStatus) {
        const driver = this.drivers.find(d => d.id === driverId);
        if (driver) {
            const oldStatus = driver.status;
            driver.status = newStatus;
            driver.lastUpdate = new Date().toISOString();
            
            // If driver becomes available, update location
            if (newStatus === 'available') {
                driver.location = this.generateRandomLocation();
            }
            
            this.saveData();
            this.updateDashboard();
            this.renderDrivers();
            this.renderTracking();
            this.populateDriverSelect();
            this.addActivity(`${driver.name} status changed from ${oldStatus} to ${newStatus}`, 'info');
        }
    }

    deleteDriver(driverId) {
        const driver = this.drivers.find(d => d.id === driverId);
        if (driver && confirm(`Are you sure you want to delete driver ${driver.name}?`)) {
            this.drivers = this.drivers.filter(d => d.id !== driverId);
            // Also remove any trips assigned to this driver
            this.trips = this.trips.filter(t => t.driverId !== driverId);
            
            this.saveData();
            this.updateDashboard();
            this.renderDrivers();
            this.renderTrips();
            this.populateDriverSelect();
            this.addActivity(`Driver ${driver.name} removed from system`, 'warning');
            this.showMessage('Driver deleted successfully!', 'success');
        }
    }

    updateTripStatus(tripId, newStatus) {
        const trip = this.trips.find(t => t.id === tripId);
        if (trip) {
            trip.status = newStatus;
            
            // If trip is completed, make driver available
            if (newStatus === 'completed') {
                const driver = this.drivers.find(d => d.id === trip.driverId);
                if (driver) {
                    driver.status = 'available';
                    driver.location = this.generateRandomLocation();
                    driver.lastUpdate = new Date().toISOString();
                }
            }
            
            this.saveData();
            this.updateDashboard();
            this.renderDrivers();
            this.renderTrips();
            this.renderTracking();
            this.addActivity(`Trip ${tripId.substr(-6)} status updated to ${newStatus}`, 'info');
        }
    }

    deleteTrip(tripId) {
        const trip = this.trips.find(t => t.id === tripId);
        if (trip && confirm('Are you sure you want to delete this trip?')) {
            // Make driver available again
            const driver = this.drivers.find(d => d.id === trip.driverId);
            if (driver && trip.status !== 'completed') {
                driver.status = 'available';
                driver.lastUpdate = new Date().toISOString();
            }
            
            this.trips = this.trips.filter(t => t.id !== tripId);
            this.saveData();
            this.updateDashboard();
            this.renderDrivers();
            this.renderTrips();
            this.addActivity(`Trip ${tripId.substr(-6)} cancelled`, 'warning');
            this.showMessage('Trip deleted successfully!', 'success');
        }
    }

    generateRandomLocation() {
        // Generate random coordinates within New York City area
        const baseLatitude = 40.7128;
        const baseLongitude = -74.0060;
        const radius = 0.1; // Roughly 10km radius
        
        const lat = baseLatitude + (Math.random() - 0.5) * 2 * radius;
        const lng = baseLongitude + (Math.random() - 0.5) * 2 * radius;
        
        // Generate a realistic address
        const streets = ['Broadway', 'Fifth Avenue', 'Park Avenue', 'Madison Avenue', 'Lexington Avenue'];
        const street = streets[Math.floor(Math.random() * streets.length)];
        const number = Math.floor(Math.random() * 9999) + 1;
        
        return {
            lat: parseFloat(lat.toFixed(6)),
            lng: parseFloat(lng.toFixed(6)),
            address: `${number} ${street}, New York, NY`
        };
    }

    updateDashboard() {
        const totalDrivers = this.drivers.length;
        const availableDrivers = this.drivers.filter(d => d.status === 'available').length;
        const busyDrivers = this.drivers.filter(d => d.status === 'busy').length;
        const offlineDrivers = this.drivers.filter(d => d.status === 'offline').length;

        document.getElementById('total-drivers').textContent = totalDrivers;
        document.getElementById('available-drivers').textContent = availableDrivers;
        document.getElementById('busy-drivers').textContent = busyDrivers;
        document.getElementById('offline-drivers').textContent = offlineDrivers;

        this.renderActivities();
    }

    renderDrivers() {
        const driversGrid = document.getElementById('drivers-grid');
        driversGrid.innerHTML = '';

        this.drivers.forEach(driver => {
            const driverCard = document.createElement('div');
            driverCard.className = 'driver-card';
            driverCard.innerHTML = `
                <div class="driver-header">
                    <div class="driver-name">${driver.name}</div>
                    <div class="driver-status status-${driver.status}">${driver.status}</div>
                </div>
                <div class="driver-info">
                    <p><i class="fas fa-phone"></i> ${driver.phone}</p>
                    <p><i class="fas fa-id-card"></i> ${driver.license}</p>
                    <p><i class="fas fa-car"></i> ${driver.vehicle}</p>
                    <p><i class="fas fa-map-marker-alt"></i> ${driver.location.address}</p>
                </div>
                <div class="driver-actions">
                    <button class="btn-secondary" onclick="app.updateDriverStatus('${driver.id}', 'available')">
                        <i class="fas fa-check"></i> Available
                    </button>
                    <button class="btn-secondary" onclick="app.updateDriverStatus('${driver.id}', 'busy')">
                        <i class="fas fa-clock"></i> Busy
                    </button>
                    <button class="btn-secondary" onclick="app.updateDriverStatus('${driver.id}', 'offline')">
                        <i class="fas fa-times"></i> Offline
                    </button>
                    <button class="btn-secondary" onclick="app.deleteDriver('${driver.id}')" style="background: #e74c3c; color: white;">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            driversGrid.appendChild(driverCard);
        });
    }

    renderTrips() {
        const tripsList = document.getElementById('trips-list');
        tripsList.innerHTML = '';

        this.trips.forEach(trip => {
            const tripCard = document.createElement('div');
            tripCard.className = 'trip-card';
            tripCard.innerHTML = `
                <div class="trip-header">
                    <div class="trip-id">Trip #${trip.id.substr(-6)}</div>
                    <div class="trip-status status-${trip.status}">${trip.status}</div>
                </div>
                <div class="trip-details">
                    <div class="trip-detail">
                        <i class="fas fa-user"></i>
                        <span><strong>Driver:</strong> ${trip.driverName}</span>
                    </div>
                    <div class="trip-detail">
                        <i class="fas fa-user-tie"></i>
                        <span><strong>Passenger:</strong> ${trip.passenger}</span>
                    </div>
                    <div class="trip-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span><strong>From:</strong> ${trip.pickup}</span>
                    </div>
                    <div class="trip-detail">
                        <i class="fas fa-flag-checkered"></i>
                        <span><strong>To:</strong> ${trip.destination}</span>
                    </div>
                    <div class="trip-detail">
                        <i class="fas fa-clock"></i>
                        <span><strong>Time:</strong> ${new Date(trip.time).toLocaleString()}</span>
                    </div>
                </div>
                <div class="driver-actions" style="margin-top: 1rem;">
                    ${trip.status === 'pending' ? `
                        <button class="btn-secondary" onclick="app.updateTripStatus('${trip.id}', 'in-progress')">
                            <i class="fas fa-play"></i> Start Trip
                        </button>
                    ` : ''}
                    ${trip.status === 'in-progress' ? `
                        <button class="btn-secondary" onclick="app.updateTripStatus('${trip.id}', 'completed')" style="background: #27ae60; color: white;">
                            <i class="fas fa-check"></i> Complete Trip
                        </button>
                    ` : ''}
                    <button class="btn-secondary" onclick="app.deleteTrip('${trip.id}')" style="background: #e74c3c; color: white;">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            tripsList.appendChild(tripCard);
        });
    }

    renderTracking() {
        const trackingGrid = document.getElementById('tracking-grid');
        trackingGrid.innerHTML = '';

        this.drivers.forEach(driver => {
            const trackingCard = document.createElement('div');
            trackingCard.className = 'tracking-card';
            trackingCard.innerHTML = `
                <div class="tracking-header">
                    <div class="driver-name">${driver.name}</div>
                    <div class="driver-status status-${driver.status}">${driver.status}</div>
                </div>
                <div class="location-info">
                    <p><strong>Current Location:</strong></p>
                    <p>${driver.location.address}</p>
                    <div class="coordinates">
                        Lat: ${driver.location.lat}, Lng: ${driver.location.lng}
                    </div>
                </div>
                <div class="last-update">
                    Last updated: ${new Date(driver.lastUpdate).toLocaleString()}
                </div>
            `;
            trackingGrid.appendChild(trackingCard);
        });
    }

    renderActivities() {
        const activityList = document.getElementById('activity-list');
        activityList.innerHTML = '';

        // Show latest 10 activities
        const recentActivities = this.activities.slice(-10).reverse();
        
        recentActivities.forEach(activity => {
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <div class="activity-time">${new Date(activity.timestamp).toLocaleString()}</div>
                <div>${activity.message}</div>
            `;
            activityList.appendChild(activityItem);
        });
    }

    populateDriverSelect() {
        const select = document.getElementById('trip-driver');
        select.innerHTML = '<option value="">Select Driver</option>';
        
        this.drivers.filter(d => d.status === 'available').forEach(driver => {
            const option = document.createElement('option');
            option.value = driver.id;
            option.textContent = `${driver.name} (${driver.vehicle})`;
            select.appendChild(option);
        });
    }

    addActivity(message, type) {
        this.activities.push({
            id: this.generateId(),
            message,
            type,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 100 activities
        if (this.activities.length > 100) {
            this.activities = this.activities.slice(-100);
        }
        
        this.saveData();
    }

    refreshTracking() {
        // Simulate location updates for active drivers
        this.drivers.forEach(driver => {
            if (driver.status !== 'offline') {
                driver.location = this.generateRandomLocation();
                driver.lastUpdate = new Date().toISOString();
            }
        });
        
        this.saveData();
        this.renderTracking();
        this.addActivity('Driver locations refreshed', 'info');
        this.showMessage('Tracking data refreshed!', 'success');
    }

    toggleAutoRefresh() {
        if (this.isAutoRefreshing) {
            clearInterval(this.autoRefreshInterval);
            this.isAutoRefreshing = false;
            document.getElementById('auto-refresh-text').textContent = 'Start Auto Refresh';
            document.querySelector('[onclick="toggleAutoRefresh()"] i').className = 'fas fa-play';
        } else {
            this.autoRefreshInterval = setInterval(() => {
                this.refreshTracking();
            }, 10000); // Refresh every 10 seconds
            this.isAutoRefreshing = true;
            document.getElementById('auto-refresh-text').textContent = 'Stop Auto Refresh';
            document.querySelector('[onclick="toggleAutoRefresh()"] i').className = 'fas fa-stop';
        }
    }

    showAddDriverModal() {
        document.getElementById('add-driver-modal').style.display = 'block';
    }

    showAddTripModal() {
        document.getElementById('add-trip-modal').style.display = 'block';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    resetForm(formId) {
        document.getElementById(formId).reset();
    }

    showMessage(message, type) {
        // Create a temporary message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type} show`;
        messageDiv.textContent = message;
        
        // Insert at the top of the current section
        const activeSection = document.querySelector('.section.active');
        activeSection.insertBefore(messageDiv, activeSection.firstChild);
        
        // Remove after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    saveData() {
        localStorage.setItem('drivers', JSON.stringify(this.drivers));
        localStorage.setItem('trips', JSON.stringify(this.trips));
        localStorage.setItem('activities', JSON.stringify(this.activities));
    }
}

// Global functions for onclick handlers
let app;

function showAddDriverModal() {
    app.showAddDriverModal();
}

function showAddTripModal() {
    app.showAddTripModal();
}

function closeModal(modalId) {
    app.closeModal(modalId);
}

function refreshTracking() {
    app.refreshTracking();
}

function toggleAutoRefresh() {
    app.toggleAutoRefresh();
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    app = new TravelTrackingApp();
});