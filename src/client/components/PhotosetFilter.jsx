import React from 'react';
import _ from 'lodash';
import { getCurrentLanguage, getTranslatedString } from '../utils';

export function PhotosetFilter({ onChange, photosets, selectedPhotosetIds }) {
  return (
    <div className="photoset-filters">
      <h3>{ getTranslatedString('select-photoset') }</h3>
      {
        photosets.map(photoset => {
          const checked = _.includes(selectedPhotosetIds, photoset.id);
          const titleKey = ( getCurrentLanguage() == 'fi' ? 'title' : `title_${getCurrentLanguage()}` );
          return (
            <label key={ photoset.id }>
              <input
                type="checkbox"
                checked={ checked }
                onChange={
                  function() {
                    const newSelectedPhotosetIds = checked ? _.without(selectedPhotosetIds, photoset.id) : _.concat(selectedPhotosetIds, photoset.id);
                    onChange(newSelectedPhotosetIds);
                  }
                }
              />
              { photoset[titleKey] || photoset.title }
            </label>
          );
        })
      }
    </div>
  );
}

PhotosetFilter.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  photosets: React.PropTypes.arrayOf(React.PropTypes.object),
  selectedPhotosetIds: React.PropTypes.arrayOf(React.PropTypes.string),
};
