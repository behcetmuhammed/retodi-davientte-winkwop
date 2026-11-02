import { useState, type CSSProperties, type FormEvent } from 'react';
import { toast } from '../../components/ui/toast';
import { v } from '../../lib/validation';
import { cn } from '../../lib/utils';
import { FooterSocial } from './footer-social';

type FooterNewsletterProps = {
  title: string;
  description: string;
  emailPlaceholder: string;
  subscribeButtonLabel: string;
  textStyle?: CSSProperties;
  instagramLink: string;
  facebookLink: string;
  xLink: string;
  openSocialLinksInNewTab: boolean;
  className?: string;
};

export function FooterNewsletter({
  title,
  description,
  emailPlaceholder,
  subscribeButtonLabel,
  textStyle,
  instagramLink,
  facebookLink,
  xLink,
  openSocialLinksInNewTab,
  className,
}: FooterNewsletterProps) {
  const [email, setEmail] = useState('');

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = email.trim();
    const error = v.required('E-posta adresi girin')(trimmed, {}) ?? v.email()(trimmed, {});
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Abonelik talebiniz alındı.');
    setEmail('');
  }

  return (
    <div className={cn('flex flex-col gap-6 lg:max-w-sm lg:justify-self-end', className)}>
      {title.trim() ? (
        <h2 className="font-heading text-sm font-medium tracking-widest uppercase" style={textStyle}>
          {title}
        </h2>
      ) : null}
      {description.trim() ? (
        <p className="text-sm leading-relaxed text-muted-foreground" style={textStyle}>
          {description}
        </p>
      ) : null}
      <form className="w-full max-w-md" onSubmit={onSubmit} noValidate>
        <div className="flex items-center gap-3 border-b border-foreground/25 pb-2">
          <label className="sr-only" htmlFor="footer-newsletter-email">
            {emailPlaceholder || 'E-posta'}
          </label>
          <input
            id="footer-newsletter-email"
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={emailPlaceholder}
            className="min-w-0 flex-1 border-0 bg-transparent py-1 text-sm leading-none outline-none placeholder:text-muted-foreground"
            style={textStyle}
          />
          <button
            type="submit"
            className="shrink-0 border-0 bg-transparent p-0 text-sm font-semibold leading-none tracking-widest uppercase outline-none transition-opacity hover:opacity-70 focus-visible:ring-2 focus-visible:ring-ring"
            style={textStyle}
          >
            {subscribeButtonLabel || 'Abone ol'}
          </button>
        </div>
      </form>
      <FooterSocial
        instagramLink={instagramLink}
        facebookLink={facebookLink}
        xLink={xLink}
        openInNewTab={openSocialLinksInNewTab}
        iconStyle={textStyle}
      />
    </div>
  );
}
