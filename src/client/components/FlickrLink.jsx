import React from 'react';
import { host } from '../utils';

export function FlickrLink({ url }) {
  return (
    <a href={ url } className="flickr-logo">
      <img src={ `${host}/img/flickr-black.png` } />
    </a>
  );
}

FlickrLink.propTypes = {
  url: React.PropTypes.string,
};
