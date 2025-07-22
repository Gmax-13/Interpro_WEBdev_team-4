// Location service using Leaflet.js and OpenStreetMap

// Request location permission from user
export const requestLocationPermission = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        
        // Store location in localStorage for later use
        localStorage.setItem('userLocation', JSON.stringify(location));
        
        console.log('Location permission granted:', location);
        resolve(location);
      },
      (error) => {
        console.warn('Location permission denied or error:', error.message);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

// Get stored user location
export const getUserLocation = () => {
  try {
    const storedLocation = localStorage.getItem('userLocation');
    return storedLocation ? JSON.parse(storedLocation) : null;
  } catch (error) {
    console.error('Error retrieving user location:', error);
    return null;
  }
};

// Initialize Leaflet Map with OpenStreetMap
export const initializeLeafletMap = (containerId, center = [17.3850, 78.4867], zoom = 8) => {
  return new Promise((resolve, reject) => {
    if (!window.L) {
      reject(new Error('Leaflet library not loaded'));
      return;
    }

    try {
      const mapContainer = document.getElementById(containerId);
      if (!mapContainer) {
        reject(new Error(`Container with id '${containerId}' not found`));
        return;
      }

      // Initialize the map
      const map = window.L.map(containerId).setView(center, zoom);

      // Add OpenStreetMap tile layer
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(map);

      console.log('Leaflet Map initialized successfully');
      resolve(map);
    } catch (error) {
      console.error('Error initializing Leaflet Map:', error);
      reject(error);
    }
  });
};

// Add markers to Leaflet Map
export const addMarkersToLeafletMap = (map, locations, onMarkerClick) => {
  if (!window.L) {
    console.error('Leaflet library not available');
    return [];
  }

  const markers = [];

  locations.forEach((location, index) => {
    try {
      // Create custom icon for different types
      const customIcon = window.L.divIcon({
        html: `<div style="
          background-color: #007bff;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
        ">${location.type === 'hospital' ? 'H' : 'C'}</div>`,
        className: 'custom-div-icon',
        iconSize: [25, 25],
        iconAnchor: [12, 12]
      });

      const marker = window.L.marker([location.lat, location.lng], {
        icon: customIcon
      }).addTo(map);

      // Create popup content
      const popupContent = `
        <div style="padding: 10px; max-width: 250px;">
          <h3 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">${location.name}</h3>
          <p style="margin: 0 0 5px 0; color: #666; font-size: 13px;"><strong>Address:</strong> ${location.address}</p>
          <p style="margin: 0 0 5px 0; color: #666; font-size: 13px;"><strong>Phone:</strong> ${location.phone}</p>
          <p style="margin: 0 0 10px 0; color: #666; font-size: 13px;"><strong>Specialties:</strong> ${location.specialties ? location.specialties.join(', ') : 'General'}</p>
          <button 
            onclick="selectLocation('${location.name}')"
            style="
              padding: 6px 12px;
              background: #007bff;
              color: white;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 13px;
            "
          >
            Select Location
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        if (onMarkerClick) {
          onMarkerClick(location);
        }
      });

      markers.push(marker);
    } catch (error) {
      console.error(`Error creating marker for location ${location.name}:`, error);
    }
  });

  console.log(`Added ${markers.length} markers to the map`);
  return markers;
};

// Add user location marker
export const addUserLocationMarker = (map, userLocation) => {
  if (!window.L || !userLocation) {
    return null;
  }

  try {
    const userIcon = window.L.divIcon({
      html: `<div style="
        background-color: #28a745;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        animation: pulse 2s infinite;
      "></div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      </style>`,
      className: 'user-location-icon',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    const userMarker = window.L.marker([userLocation.latitude, userLocation.longitude], {
      icon: userIcon
    }).addTo(map);

    userMarker.bindPopup('<div style="text-align: center; padding: 5px;"><strong>Your Location</strong></div>');
    
    return userMarker;
  } catch (error) {
    console.error('Error adding user location marker:', error);
    return null;
  }
};

// Calculate distance between two points (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in kilometers
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

// Geocode address using Nominatim (OpenStreetMap's geocoding service)
export const geocodeAddress = async (address) => {
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      const result = data[0];
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        formatted_address: result.display_name
      };
    } else {
      throw new Error('No results found for the given address');
    }
  } catch (error) {
    console.error('Geocoding failed:', error);
    throw error;
  }
};

// Reverse geocode coordinates to address using Nominatim
export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.display_name) {
      return {
        formatted_address: data.display_name,
        city: data.address?.city || data.address?.town || data.address?.village,
        state: data.address?.state,
        country: data.address?.country
      };
    } else {
      throw new Error('No address found for the given coordinates');
    }
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    throw error;
  }
};
