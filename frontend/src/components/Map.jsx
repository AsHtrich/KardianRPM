import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import '../style/App.css';

const redDotIcon = new L.DivIcon({
    className: 'custom-red-dot',  // Reference to the CSS class
    iconSize: [12, 12],  // Size of the dot
    popupAnchor: [0, -6],  // Position of the popup relative to the dot
  });

const center = [12.751903,80.196089]; 

const MyLeafletMap = () => {
  return (
    <MapContainer center={center} zoom={13} style={{ height: '300px', width: '100%' }} icon={redDotIcon}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={center}>
        <Popup>
            SSN. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MyLeafletMap;