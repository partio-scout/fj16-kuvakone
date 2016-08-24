import { host } from './utils';

export const startDate = new Date('2016-07-15');
export const dayCount = 16;
export const mapInitialCenter = { lat: 61.207459, lon: 25.121329 };
export const mapInitialZoom = 15;
export const mapImageOverlay = {
  ne: { lat: 61.2141, lon: 25.1471 },
  sw: { lat: 61.1985, lon: 25.1028 },
  url: `${host}/img/roihu_kartta.png`,
};
export const imagesPerPage = window.innerWidth < 500 ? 20 : 50;
