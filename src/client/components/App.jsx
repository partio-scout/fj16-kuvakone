import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { request } from '../utils';
import { Thumbnails, PhotoViewer } from '../components';

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.onThumbnailSelected = this.onThumbnailSelected.bind(this);

    this.state = {
      photos: [],
    };
  }

  componentWillMount() {
    this.reloadPhotos();
  }

  reloadPhotos() {
    request.get('/photos')
      .accept('application/json')
      .then(response => this.setState({ photos: response.body }));
  }

  onThumbnailSelected(photoIndex) {
    this.setState({ selectedPhotoIndex: photoIndex });
  }

  render() {
    return (
      <div>
        <Grid>
          <Row>
            <Col xs={ 12 }>
              <h1>Kuvakone</h1>
            </Col>
          </Row>
          <Row>
            <Col xs={ 12 }>
              <Thumbnails photos={ this.state.photos } onSelected={ this.onThumbnailSelected } />
            </Col>
          </Row>
        </Grid>
        <PhotoViewer isVisible={ this.state.selectedPhotoIndex !== undefined } photos={ this.state.photos } selectedPhotoIndex={ this.state.selectedPhotoIndex } onSelectionChanged={ this.onThumbnailSelected } />
      </div>
    );
  }
}

