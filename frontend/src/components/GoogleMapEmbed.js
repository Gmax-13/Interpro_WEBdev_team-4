import React from 'react';

function GoogleMapEmbed({ address, height = 250 }) {
  if (!address) return null;
  const query = encodeURIComponent(address);
  const src = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${query}`;
  return (
    <div className="rounded overflow-hidden border shadow" style={{ height }}>
      <iframe
        title="Google Map"
        width="100%"
        height={height}
        frameBorder="0"
        style={{ border: 0 }}
        src={src}
        allowFullScreen
      />
    </div>
  );
}

export default GoogleMapEmbed;
