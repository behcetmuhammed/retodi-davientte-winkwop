import type { HeaderProps } from '../generated/types';
import { Probe } from '../components/__probe/Probe';

/**
 * Header
 *
 * Prop'lar geliştirme editöründe tanımlanır; tipleri otomatik güncellenir.
 */
export default function Header(_props: HeaderProps) {
  return (
    <section>
      <p>Bu bölümü kodlamaya başlayın.</p>
      <Probe />
    </section>
  );
}
