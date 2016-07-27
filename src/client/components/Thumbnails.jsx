import React from 'react';

export function Thumbnails({ photos, imageCount, onSelected }) {
  return (
    <div className="thumbnails">
      {
        photos.slice(0, imageCount).map((photo, index) => (
          <a onClick={ function() { onSelected(index); } } key={ index }>
            <img
              src={ photo.thumbnail }
              srcSet={ `${ photo.thumbnail } 150w, ${ photo.medium } 500w` }
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
