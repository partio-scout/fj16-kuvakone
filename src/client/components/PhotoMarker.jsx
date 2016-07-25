import React from 'react';
import { Marker } from 'react-leaflet';
import L from 'leaflet';

export function PhotoMarker({ photo }) {
  const icon = L.icon({
    iconUrl: photo.thumbnail,
    iconSize: [ 50, 50 ],
  });

  return (
    <Marker
      position={ { lat: photo.latitude, lon: photo.longitude } }
      draggable={ false }
      icon={ icon }
    />
  );
}

PhotoMarker.propTypes = {
  photo: React.PropTypes.object,
};
