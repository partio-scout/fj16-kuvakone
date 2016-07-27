import React from 'react';

export function FlickrLink({ url }) {
  return (
    <a href={ url }>
      <img src={ `${process.env.HOST}/img/flickr-black.png` } />
    </a>
  );
}

FlickrLink.propTypes = {
  url: React.PropTypes.string,
};
