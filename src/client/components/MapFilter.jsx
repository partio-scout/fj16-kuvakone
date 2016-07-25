import React from 'react';
import { Map, TileLayer, ImageOverlay } from 'react-leaflet';
import { PhotoMarker } from '../components';

export function MapFilter({ photos }) {
  const bounds = [
    { lat: 61.2141, lon: 25.1471 }, //ne
    { lat: 61.1985, lon: 25.1028 }, //sw
  ];

  return (
    <div className="map-filter">
      <Map
        center={ { lat: 61.207459, lon: 25.121329 } }
        zoom={ 15 }
        style={ { height: '400px', width: '100%' } }>
        <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        <ImageOverlay
          bounds={ bounds }
          url="roihu_kartta.png"
        />
        {
          photos.map(photo => (
            <PhotoMarker photo={ photo } />
          ))
        }
      </Map>
    </div>
  );
}

MapFilter.propTypes = {
  photos: React.PropTypes.array,
};
