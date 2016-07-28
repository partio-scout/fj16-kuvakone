export function getCurrentLanguage() {
  return document.documentElement.lang || 'fi';
}

export function getTranslatedString(string) {
  const lang = getCurrentLanguage();

  const strings = {
    'fi': {
      'title': 'Kuvat',
      'description': 'Etsitkö kuvia Hurmasta, Tempo-kahvilasta tai vaikkapa tiistain vesilaaksosta? Voit nyt selailla kuvia sijainnin, päivämäärän ja aiheen mukaan!',
      'flickrLink': 'Katso kaikki kuvat Flickristä',
      'select-photoset': 'Rajaa aiheen mukaan',
    },
    'sv': {
      'title': 'Bilder',
      'description': '',
      'flickrLink': 'Flickr',
      'select-photoset': '',
    },
    'en': {
      'title': 'Photos',
      'description': 'Are you looking for photos from Hurma, Tempo café or Thursday\'s creativity valley? You can now browse photos by location, date and topic.',
      'flickrLink': 'Browse photos in Flickr.',
      'select-photoset': 'Filter by topic',
    }
  };

  return strings[lang][string];
}
