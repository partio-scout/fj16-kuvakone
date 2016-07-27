import React from 'react';
import _ from 'lodash';
import { request } from '../utils';
import { Thumbnails, PhotoViewer, DateFilter, PhotosetFilter, MapFilter, getTranslatedString } from '../components';

const host = process.env.HOST || '';

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleThumbnailSelected = this.handleThumbnailSelected.bind(this);
    this.handleDateFilterChange = this.handleDateFilterChange.bind(this);
    this.handlePhotosetSelectionChange = this.handlePhotosetSelectionChange.bind(this);
    this.handleMapChange = this.handleMapChange.bind(this);
    this.reloadPhotos = _.debounce(this.reloadPhotos.bind(this), 1000);

    this.state = {
      photos: [],
      photosets: [],
      selectedPhotoIndex: undefined,
      selectedPhotosetIds: [],
      startDate: new Date('2016-07-15'),
      endDate: new Date('2016-07-31'),
      bounds: undefined,
    };
  }

  componentWillMount() {
    this.reloadPhotos();
    this.loadPhotoSets();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.filterChanged(prevState)) {
      this.reloadPhotos();
    }
  }

  filterChanged(prevState) {
    return !_.isEqual(getFilters(this.state), getFilters(prevState));

    function getFilters(state) {
      return {
        startDate: state.startDate,
        endDate: state.endDate,
        selectedPhotosetIds: state.selectedPhotosetIds,
        bounds: state.bounds,
      };
    }
  }

  reloadPhotos() {
    request.get(`${host}/photos`)
      .accept('application/json')
      .query(this.getQueryFilters())
      .then(response => this.setState({ photos: response.body }));
  }

  loadPhotoSets() {
    request.get(`${host}/photosets`)
      .accept('application/json')
      .then(response => this.setState({ photosets: response.body }));
  }

  getQueryFilters() {
    const {
      startDate,
      endDate,
      selectedPhotosetIds,
      bounds,
    } = this.state;

    return {
      startdate: startDate && this.mapDateToISODateString(startDate),
      enddate: endDate && this.mapDateToISODateString(endDate),
      photosets: selectedPhotosetIds && selectedPhotosetIds.join(',') || undefined,
      bounds: bounds,
    };
  }

  handleThumbnailSelected(photoIndex) {
    this.setState({ selectedPhotoIndex: photoIndex });
  }

  handleDateFilterChange(startDate, endDate) {
    this.setState({
      startDate: startDate,
      endDate: endDate,
    });
  }

  handlePhotosetSelectionChange(newSelectedPhotosetIds) {
    this.setState({
      selectedPhotosetIds: newSelectedPhotosetIds,
    });
  }

  handleMapChange(bounds) {
    this.setState({
      bounds: bounds,
    });
  }

  mapDateToISODateString(date) {
    return `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`;
  }

  render() {
    const title = getTranslatedString('title');
    const description = getTranslatedString('description');
    return (
      <div>
        <h1>{ title }</h1>
        <p>{ description }</p>
        <PhotosetFilter onChange={ this.handlePhotosetSelectionChange } photosets={ this.state.photosets } selectedPhotosetIds={ this.state.selectedPhotosetIds } />
        <MapFilter photos={ this.state.photos } onChange={ this.handleMapChange } />
        <DateFilter onChange={ this.handleDateFilterChange } startDate={ this.state.startDate } endDate={ this.state.endDate } />
        <Thumbnails photos={ this.state.photos } onSelected={ this.handleThumbnailSelected } />
        <PhotoViewer isVisible={ this.state.selectedPhotoIndex !== undefined } photos={ this.state.photos } selectedPhotoIndex={ this.state.selectedPhotoIndex } onSelectionChanged={ this.handleThumbnailSelected } />
      </div>
    );
  }
}
