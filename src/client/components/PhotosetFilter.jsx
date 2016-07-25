import React from 'react';
import _ from 'lodash';
import { Checkbox, FormGroup } from 'react-bootstrap';

export function PhotosetFilter({ onChange, photosets, selectedPhotosetIds }) {
  return (
    <FormGroup>
      {
        photosets.map(photoset => {
          const checked = _.includes(selectedPhotosetIds, photoset.id);
          return (
            <Checkbox
              key={ photoset.id }
              checked={ checked }
              onChange={
                function() {
                  const newSelectedPhotosetIds = checked ? _.without(selectedPhotosetIds, photoset.id) : _.concat(selectedPhotosetIds, photoset.id);
                  onChange(newSelectedPhotosetIds);
                }
              }>
              { photoset.title }
            </Checkbox>
          );
        })
      }
    </FormGroup>
  );
}

PhotosetFilter.propTypes = {
  onChange: React.PropTypes.func.isRequired,
  photosets: React.PropTypes.arrayOf(React.PropTypes.object),
  selectedPhotosetIds: React.PropTypes.arrayOf(React.PropTypes.string),
};
