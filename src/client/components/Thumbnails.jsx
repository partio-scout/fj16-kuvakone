import React from 'react';
import { Row, Col } from 'react-bootstrap';

export function Thumbnails({ photos }) {
  return (
    <Row>
      {
        photos.map(photo => (
          <Col key={ photo.id } sm={ 2 }>
            <img src={ photo.thumbnail } />
          </Col>
        ))
      }
    </Row>
  );
}

Thumbnails.propTypes = {
  photos: React.PropTypes.arrayOf(React.PropTypes.object),
};
