import React from 'react';

export function getCurrentLanguage() {
  return document.documentElement.lang || 'fi';
}

export function getTranslatedString(string) {
  const lang = getCurrentLanguage();

  const strings = {
    'fi': {
      'title': 'Kuvakone',
      'description': 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu.',
    },
    'sv': {
      'title': 'Kuvakone SV',
      'description': 'Sed arcu lectus auctor vitae, consectetuer et venenatis eget velit. Sed augue orci, lacinia eu tincidunt et eleifend nec lacus. Donec ultricies nisl ut felis, suspendisse potenti. Lorem ipsum ligula ut hendrerit mollis, ipsum erat vehicula risus, eu suscipit sem libero nec erat.',
    },
    'en': {
      'title': 'Kuvakone EN',
      'description': 'Mauris sed libero. Suspendisse facilisis nulla in lacinia laoreet, lorem velit accumsan velit vel mattis libero nisl et sem. Proin interdum maecenas massa turpis sagittis in, interdum non lobortis vitae massa.',
    }
  };

  return strings[lang][string];
}