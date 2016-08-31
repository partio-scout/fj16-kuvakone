import React from 'react';
import { Map, TileLayer, ImageOverlay } from 'react-leaflet';
import { PhotoMarker } from '../components';
import _ from 'lodash';

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
      initialCenter,
      initialZoom,
      imageOverlay,
    } = this.props;

    const nth = Math.ceil(photos.length / 50);

    return (
      <div className="map">
        <Map
          center={ initialCenter }
          zoom={ initialZoom }
          style={ { height: '400px', width: '100%' } }
          animate={ false }
          ref="map"
          onMoveend={ this.handleMapChange }
          onZoomend={ this.handleMapChange }>
          <TileLayer
            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
          />
          {
            imageOverlay ? (
                <ImageOverlay
                  bounds={
                    [
                      imageOverlay.ne, // North-east
                      imageOverlay.sw, // South-west
                    ]
                  }
                  url={ imageOverlay.url }
                />
            ) : null
          }
          {
            _(photos)
              .filter((photo, index) => index % nth === 0 || nth === 1)
              .map(photo => (
                <PhotoMarker photo={ photo } />
              ))
              .value()
          }
        </Map>
      </div>
    );
  }
}

const coordinatePair = React.PropTypes.shape({
  lat: React.PropTypes.number.isRequired,
  lon: React.PropTypes.number.isRequired,
});

MapFilter.propTypes = {
  photos: React.PropTypes.array.isRequired,
  onChange: React.PropTypes.func.isRequired,
  initialCenter: coordinatePair.isRequired,
  initialZoom: React.PropTypes.number.isRequired,
  imageOverlay: React.PropTypes.shape({
    url: React.PropTypes.string.isRequired,
    ne: coordinatePair.isRequired,
    sw: coordinatePair.isRequired,
  }),
};
