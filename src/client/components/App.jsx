import React from 'react';
import _ from 'lodash';
import { request } from '../utils';
import { Thumbnails, PhotoViewer, DateFilter, PhotosetFilter, MapFilter, BottomWatcher } from '../components';

const IMAGES_PER_PAGE = 50;

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
      startDate: new Date('2016-07-15'),
      endDate: new Date('2016-07-31'),
      bounds: undefined,
      imageCount: IMAGES_PER_PAGE,
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
    request.get('/photos')
      .accept('application/json')
      .query(this.getQueryFilters())
      .then(response => this.setState({ photos: response.body, imageCount: IMAGES_PER_PAGE }));
  }

  loadPhotoSets() {
    request.get('/photosets')
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
    const imageCount = this.state.imageCount += IMAGES_PER_PAGE;
    this.setState({ imageCount: imageCount });
  }

  mapDateToISODateString(date) {
    return `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`;
  }

  render() {
    return (
      <div>
        <h1>Kuvakone</h1>
        <PhotosetFilter onChange={ this.handlePhotosetSelectionChange } photosets={ this.state.photosets } selectedPhotosetIds={ this.state.selectedPhotosetIds } />
        <MapFilter photos={ this.state.photos } onChange={ this.handleMapChange } />
        <DateFilter onChange={ this.handleDateFilterChange } startDate={ this.state.startDate } endDate={ this.state.endDate } />
        <Thumbnails photos={ this.state.photos } onSelected={ this.handleThumbnailSelected } imageCount={ this.state.imageCount } />
        <BottomWatcher onBottomReached={ this.handleThumbnailsBottomReached } />
        <PhotoViewer isVisible={ this.state.selectedPhotoIndex !== undefined } photos={ this.state.photos } selectedPhotoIndex={ this.state.selectedPhotoIndex } onSelectionChanged={ this.handleThumbnailSelected } />
      </div>
    );
  }
}
