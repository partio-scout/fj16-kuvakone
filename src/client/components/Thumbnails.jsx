import React from 'react';

export function Thumbnails({ photos, onSelected }) {
  return (
    <div className="thumbnails">
      {
        photos.map((photo, index) => (
          <a onClick={ function() { onSelected(index); } }>
            <img src={ photo.thumbnail } />
          </a>
        ))
      }
    </div>
  );
}

Thumbnails.propTypes = {
  photos: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onSelected: React.PropTypes.func.isRequired,
};
