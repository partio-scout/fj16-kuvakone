import './styles.scss';

import React from 'react';
import { render } from 'react-dom';
import { Grid, Row, Col } from 'react-bootstrap';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      photos: [
        {
          id: '27859607903',
          thumbnail: 'https://farm9.staticflickr.com/8191/27859607903_01b392ba0c_q.jpg',
          large: 'https://farm9.staticflickr.com/8191/27859607903_01b392ba0c_h.jpg',
          title: '20160720_NooraQvick_Rakentelu1',
          dateTaken: '2016-07-20',
          geo: { lat: '61.209260', lon: '25.116956' }
        },
        {
          id: '28442735206',
          thumbnail: 'https://farm9.staticflickr.com/8567/28442735206_b536f930b8_q.jpg',
          large: 'https://farm9.staticflickr.com/8567/28442735206_b536f930b8_h.jpg',
          title: '20160721-TuomasSauliala-Rakennusleiri_9678',
          dateTaken: '2016-07-21',
          geo: { lat: '61.206689', lon: '25.115078' }
        },
        {
          id: '28397009701',
          thumbnail: 'https://farm9.staticflickr.com/8470/28397009701_555dbaa0d5_q.jpg',
          large: 'https://farm9.staticflickr.com/8470/28397009701_555dbaa0d5_h.jpg',
          title: '20160721-TuomasSauliala-Rakennusleiri_9577',
          dateTaken: '2016-07-21',
          geo: { lat: '61.207602', lon: '25.128703' }
        },
        {
          id: '27859188003',
          thumbnail: 'https://farm9.staticflickr.com/8821/27859188003_98658490ba_q.jpg',
          large: 'https://farm9.staticflickr.com/8821/27859188003_98658490ba_h.jpg',
          title: '20160721-TuomasSauliala-Keidas-0147',
          dateTaken: '2016-07-21',
          geo: { lat: '61.202606', lon: '25.118766' }
        },
        {
          id: '28191966400',
          thumbnail: 'https://farm9.staticflickr.com/8788/28191966400_e2d2340df9_q.jpg',
          large: 'https://farm9.staticflickr.com/8788/28191966400_e2d2340df9_h.jpg',
          title: '20160721-TuomasSauliala-Keidas-0153',
          dateTaken: '2016-07-21',
          geo: { lat: '61.202606', lon: '25.118766' }
        },
        {
          id: '27854440514',
          thumbnail: 'https://farm9.staticflickr.com/8670/27854440514_5a63a1ce38_q.jpg',
          large: 'https://farm9.staticflickr.com/8670/27854440514_5a63a1ce38_h.jpg',
          title: '20160722_NooraQvick_Globaalilaakso_017',
          dateTaken: '2016-07-22',
          geo: { lat: '61.206315', lon: '25.112999' }
        },
      ],
    };
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
              <Col sm={ 2 }>
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
