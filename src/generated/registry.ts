// Bu dosya Winkwop CLI tarafından üretilir - elle düzenlemeyin.
// Geliştirme editöründe yaptığınız değişiklikleri almak için: npx create-winkwop-theme pull

import type { ComponentType } from 'react';
import '../tailwind.css';
import Header from '../sections/Header';
import HeroBanner from '../sections/HeroBanner';
import Text from '../sections/Text';
import RichText from '../sections/RichText';
import SectionMediaGrid from '../sections/SectionMediaGrid';
import SectionFeaturedCollection from '../sections/SectionFeaturedCollection';
import SectionPageIntro from '../sections/SectionPageIntro';
import SectionImageText from '../sections/SectionImageText';
import SectionContact from '../sections/SectionContact';
import SectionNumberedList from '../sections/SectionNumberedList';
import SectionFaq from '../sections/SectionFaq';
import Footer from '../sections/Footer';

/** Winkwop bu haritayı kullanarak bölümlerinizi çizer. */
export const sections: Record<string, ComponentType<any>> = {
  Header,
  HeroBanner,
  Text,
  RichText,
  SectionMediaGrid,
  SectionFeaturedCollection,
  SectionPageIntro,
  SectionImageText,
  SectionContact,
  SectionNumberedList,
  SectionFaq,
  Footer,
};
