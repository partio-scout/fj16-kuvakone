import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { request } from '../utils';
import { Thumbnails } from '../components';

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      photos: [],
    };
  }

  componentWillMount() {
    this.reloadPhotos();
  }

  reloadPhotos() {
    request.get('/test/photos')
      .accept('application/json')
      .then(response => this.setState({ photos: response.body }));
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={ 12 }>
            <h1>Kuvakone</h1>
          </Col>
        </Row>
        <Row>
          <Col xs={ 12 }>
            <Thumbnails photos={ this.state.photos } />
          </Col>
        </Row>
      </Grid>
    );
  }
}

