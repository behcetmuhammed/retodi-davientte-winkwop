// Bu dosya Winkwop CLI tarafından üretilir - elle düzenlemeyin.
// Geliştirme editöründe yaptığınız değişiklikleri almak için: npx create-winkwop-theme pull

import type { ComponentType } from 'react';
import '../tailwind.css';
import Header from '../sections/Header';
import HeroBanner from '../sections/HeroBanner';
import Footer from '../sections/Footer';

/** Winkwop bu haritayı kullanarak bölümlerinizi çizer. */
export const sections: Record<string, ComponentType<any>> = {
  Header,
  HeroBanner,
  Footer,
};
