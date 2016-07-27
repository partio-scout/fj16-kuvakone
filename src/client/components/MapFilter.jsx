import React from 'react';
import { Map, TileLayer, ImageOverlay } from 'react-leaflet';
import { PhotoMarker } from '../components';

export class MapFilter extends React.Component {
  constructor(props) {
    super(props);

    this.handleMapChange = this.handleMapChange.bind(this);
  }

  handleMapChange() {
    const bounds = this.refs.map.leafletElement.getBounds();

    this.props.onChange({
      north: bounds._northEast.lat,
      east: bounds._northEast.lng,
      south: bounds._southWest.lat,
      west: bounds._southWest.lng,
    });
  }

  render() {
    const {
      photos,
    } = this.props;

    return (
      <div className="map">
        <Map
          center={ { lat: 61.207459, lon: 25.121329 } }
          zoom={ 15 }
          style={ { height: '400px', width: '100%' } }
          animate={ false }
          ref="map"
          onMoveend={ this.handleMapChange }
          onZoomend={ this.handleMapChange }>
          <TileLayer
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          <ImageOverlay
            bounds={
              [
                { lat: 61.2141, lon: 25.1471 }, // North-east
                { lat: 61.1985, lon: 25.1028 }, // South-west
              ]
            }
            url="img/roihu_kartta.png"
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
}

MapFilter.propTypes = {
  photos: React.PropTypes.array,
  onChange: React.PropTypes.func,
};
