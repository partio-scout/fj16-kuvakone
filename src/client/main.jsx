import './styles.scss';

import React from 'react';
import { render } from 'react-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import superagent from 'superagent';
import superagentAsPromised from 'superagent-as-promised';

const request = superagentAsPromised(superagent);

class App extends React.Component {
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
          <Col>
            <h1>Kuvakone</h1>
          </Col>
        </Row>
        <Row>
          {
            this.state.photos.map(photo => (
              <Col key={ photo.id } sm={ 2 }>
                <img src={ photo.thumbnail } />
              </Col>
            ))
          }
        </Row>
      </Grid>
    );
  }
}

render(<App />, document.getElementById('kuvakone'));
