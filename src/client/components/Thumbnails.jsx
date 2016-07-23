import React from 'react';
import { Row, Col } from 'react-bootstrap';

export function Thumbnails({ photos, onSelected }) {
  return (
    <Row>
      {
        photos.map((photo, index) => (
          <Col key={ photo.id } sm={ 2 }>
            <a onClick={ function() { onSelected(index); } }>
              <img src={ photo.thumbnail } />
            </a>
          </Col>
        ))
      }
    </Row>
  );
}

Thumbnails.propTypes = {
  photos: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onSelected: React.PropTypes.func.isRequired,
};
