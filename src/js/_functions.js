
import { isMobile, isTablet, isDesktop } from './functions/check-viewport';
window.isMobile = isMobile

import { aPixels } from './functions/aPixels';
window.aPixels = aPixels

import Swiper, { Navigation, Pagination } from 'swiper';
Swiper.use([Navigation, Pagination]);
window.Swiper = Swiper

