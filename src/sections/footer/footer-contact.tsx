import type { CSSProperties } from 'react';
import { cn } from '../../lib/utils';

type FooterContactProps = {
  phone: string;
  email: string;
  textStyle?: CSSProperties;
  className?: string;
};

function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, '');
  return digits ? `tel:${digits}` : undefined;
}

export function FooterContact({ phone, email, textStyle, className }: FooterContactProps) {
  const phoneTrim = phone.trim();
  const emailTrim = email.trim();
  if (!phoneTrim && !emailTrim) return null;

  return (
    <div className={cn('mt-2 flex flex-col gap-2 pt-2', className)}>
      {phoneTrim ? (
        <a href={telHref(phoneTrim)} className="text-sm hover:underline" style={textStyle}>
          {phoneTrim}
        </a>
      ) : null}
      {emailTrim ? (
        <a href={`mailto:${emailTrim}`} className="text-sm hover:underline" style={textStyle}>
          {emailTrim}
        </a>
      ) : null}
    </div>
  );
}
