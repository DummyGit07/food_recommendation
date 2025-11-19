import React, { useState, useEffect } from "react";

const demoLocations = [
  { name: "Current Location", latitude: null, longitude: null },
  { name: "New Delhi, India", latitude: 28.6139, longitude: 77.2090 },
  { name: "New York, USA", latitude: 40.7128, longitude: -74.0060 },
  { name: "London, UK", latitude: 51.5074, longitude: -0.1278 },
  { name: "Tokyo, Japan", latitude: 35.6895, longitude: 139.6917 },
  { name: "Sydney, Australia", latitude: -33.8688, longitude: 151.2093 },
  { name: "Honolulu, Hawaii", latitude: 21.3069, longitude: -157.8583 },
  { name: "Reykjavik, Iceland", latitude: 64.1466, longitude: -21.9426 },
];

function LocationInput({ location, setLocation }) {
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(0);

  // helper to request current geolocation and update state
  function requestCurrentLocation(fallbackIndex = 1) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            name: "Current Location",
          });
          setSelectedLocationIndex(0);
        },
        () => {
          // on error, fall back to a demo city
          setLocation(demoLocations[fallbackIndex]);
          setSelectedLocationIndex(fallbackIndex);
        }
      );
    } else {
      setLocation(demoLocations[fallbackIndex]);
      setSelectedLocationIndex(fallbackIndex);
    }
  }

  // initial effect: same logic as before, but via helper
  useEffect(() => {
    requestCurrentLocation(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(e) {
    const idx = parseInt(e.target.value, 10);
    setSelectedLocationIndex(idx);

    if (idx === 0) {
      // user chose "Current Location" again → re-run geolocation
      requestCurrentLocation(1);
    } else {
      // normal fixed demo location
      setLocation(demoLocations[idx]);
    }
  }

  return (
    <div>
      <label htmlFor="location-select">Select Location for Demo: </label>
      <select
        id="location-select"
        value={selectedLocationIndex}
        onChange={handleChange}
      >
        {demoLocations.map((loc, index) => (
          <option key={loc.name} value={index}>
            {loc.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LocationInput;
