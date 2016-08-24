import React from 'react';
import _ from 'lodash';
import { request, host, getTranslatedString, addDays } from '../utils';
import { Thumbnails, PhotoViewer, DateFilter, PhotosetFilter, MapFilter, BottomWatcher } from '../components';
import * as Config from '../config';

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleThumbnailSelected = this.handleThumbnailSelected.bind(this);
    this.handleDateFilterChange = this.handleDateFilterChange.bind(this);
    this.handlePhotosetSelectionChange = this.handlePhotosetSelectionChange.bind(this);
    this.handleMapChange = this.handleMapChange.bind(this);
    this.reloadPhotos = _.debounce(this.reloadPhotos.bind(this), 1000);
    this.handleThumbnailsBottomReached = this.handleThumbnailsBottomReached.bind(this);

    this.state = {
      photos: [],
      photosets: [],
      selectedPhotoIndex: undefined,
      selectedPhotosetIds: [],
      startDate: Config.startDate,
      endDate: addDays(Config.startDate, Config.dayCount),
      bounds: undefined,
      imageCount: Config.imagesPerPage,
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
      .then(response => this.setState({ photos: response.body, imageCount: Config.imagesPerPage }));
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

  handleThumbnailsBottomReached() {
    const imageCount = this.state.imageCount + Config.imagesPerPage;
    this.setState({ imageCount: imageCount });
  }

  mapDateToISODateString(date) {
    return `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`;
  }

  render() {
    const title = getTranslatedString('title');
    const description = getTranslatedString('description');
    const flickrLink = getTranslatedString('flickrLink');
    return (
      <div>
        <h1>{ title }</h1>
        <p>{ description } <a href="https://www.flickr.com/photos/roihu2016">{ flickrLink }</a></p>
        <PhotosetFilter onChange={ this.handlePhotosetSelectionChange } photosets={ this.state.photosets } selectedPhotosetIds={ this.state.selectedPhotosetIds } />
        <MapFilter photos={ this.state.photos } onChange={ this.handleMapChange } initialCenter={ Config.mapInitialCenter } initialZoom={ Config.mapInitialZoom } imageOverlay={ Config.mapImageOverlay } />
        <DateFilter onChange={ this.handleDateFilterChange } selectedStartDate={ this.state.startDate } selectedEndDate={ this.state.endDate } startDate={ Config.startDate } dayCount={ Config.dayCount } />
        <Thumbnails photos={ this.state.photos } onSelected={ this.handleThumbnailSelected } imageCount={ this.state.imageCount } />
        <BottomWatcher onBottomReached={ this.handleThumbnailsBottomReached } />
        <PhotoViewer isVisible={ this.state.selectedPhotoIndex !== undefined } photos={ this.state.photos } selectedPhotoIndex={ this.state.selectedPhotoIndex } onSelectionChanged={ this.handleThumbnailSelected } />
      </div>
    );
  }
}
