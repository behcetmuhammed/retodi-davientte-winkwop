// Bu dosya Winkwop CLI tarafından üretilir - elle düzenlemeyin.
// Geliştirme editöründe yaptığınız değişiklikleri almak için: npx create-winkwop-theme pull

import type { ComponentType } from 'react';
import '../tailwind.css';
import Header from '../sections/Header';
import HeroBanner from '../sections/HeroBanner';
import Text from '../sections/Text';
import RichText from '../sections/RichText';
import Footer from '../sections/Footer';
import SectionMediaGrid from '../sections/SectionMediaGrid';

/** Winkwop bu haritayı kullanarak bölümlerinizi çizer. */
export const sections: Record<string, ComponentType<any>> = {
  Header,
  HeroBanner,
  Text,
  RichText,
  Footer,
  SectionMediaGrid,
};
