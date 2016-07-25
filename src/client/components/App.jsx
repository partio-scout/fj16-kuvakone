import React from 'react';
import { request } from '../utils';
import { Thumbnails, PhotoViewer, DateFilter } from '../components';

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleThumbnailSelected = this.handleThumbnailSelected.bind(this);
    this.handleDateFilterChange = this.handleDateFilterChange.bind(this);

    this.state = {
      photos: [],
      startDate: new Date('2016-07-15'),
      endDate: new Date('2016-07-31'),
    };
  }

  componentWillMount() {
    this.reloadPhotos();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.filterChanged(prevState)) {
      this.reloadPhotos();
    }
  }

  filterChanged(prevState) {
    return this.state.startDate !== prevState.startDate || this.state.endDate !== prevState.endDate;
  }

  reloadPhotos() {
    request.get('/photos')
      .accept('application/json')
      .query(this.getQueryFilters())
      .then(response => this.setState({ photos: response.body }));
  }

  getQueryFilters() {
    const {
      startDate,
      endDate,
    } = this.state;

    return {
      startdate: startDate && this.mapDateToISODateString(startDate),
      enddate: endDate && this.mapDateToISODateString(endDate),
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

  mapDateToISODateString(date) {
    return `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`;
  }

  render() {
    return (
      <div>
        <h1>Kuvakone</h1>
        <DateFilter onChange={ this.handleDateFilterChange } startDate={ this.state.startDate } endDate={ this.state.endDate } />
        <Thumbnails photos={ this.state.photos } onSelected={ this.handleThumbnailSelected } />
        <PhotoViewer isVisible={ this.state.selectedPhotoIndex !== undefined } photos={ this.state.photos } selectedPhotoIndex={ this.state.selectedPhotoIndex } onSelectionChanged={ this.handleThumbnailSelected } />
      </div>
    );
  }
}

