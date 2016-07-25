import React from 'react';

export function Thumbnails({ photos, onSelected }) {
  return (
    <div className="thumbnails">
      {
        photos.map((photo, index) => (
          <a onClick={ function() { onSelected(index); } } key={ index }>
            <img
              src={ photo.square }
              srcSet={ `${ photo.square } 150w, ${ photo.medium } 500w` }
              sizes="(min-width: 501px) 150px, 100vw"
            />
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
