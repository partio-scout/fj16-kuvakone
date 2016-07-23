import React from 'react';
import Lightbox from 'react-image-lightbox';

export function PhotoViewer({ isVisible, photos, selectedPhotoIndex, onSelectionChanged }) {
  const nextIndex = (selectedPhotoIndex + 1) % photos.length;
  const prevIndex = (selectedPhotoIndex + photos.length - 1) % photos.length;
  if (isVisible) {
    const currentPhoto = photos[selectedPhotoIndex];
    const nextPhoto = photos[nextIndex];
    const previousPhoto = photos[prevIndex];

    return (
      <Lightbox
        mainSrc={ currentPhoto.large }
        nextSrc={ nextPhoto.large }
        prevSrc={ previousPhoto.large }
        imageTitle={ currentPhoto.title }
        onCloseRequest={ closeLightBox }
        onMoveNextRequest={ selectNextPhoto }
        onMovePrevRequest={ selectPreviousPhoto }
      />
    );
  } else {
    return null;
  }

  function closeLightBox() {
    onSelectionChanged(undefined);
  }

  function selectNextPhoto() {
    onSelectionChanged(nextIndex);
  }

  function selectPreviousPhoto() {
    onSelectionChanged(prevIndex);
  }
}

PhotoViewer.propTypes = {
  isVisible: React.PropTypes.bool.isRequired,
  photos: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  selectedPhotoIndex: React.PropTypes.number,
  onSelectionChanged: React.PropTypes.func.isRequired,
};
