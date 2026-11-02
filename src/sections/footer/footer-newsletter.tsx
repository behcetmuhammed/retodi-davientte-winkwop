import { useState, type CSSProperties, type FormEvent } from 'react';
import { Button } from '../../components/ui/button';
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
      <form className="flex flex-col gap-6" onSubmit={onSubmit} noValidate>
        <div className="relative flex items-end gap-4 border-b border-border pb-2">
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
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            style={textStyle}
          />
          <Button type="submit" variant="ghost" size="sm" className="shrink-0 px-0 font-medium tracking-widest uppercase">
            {subscribeButtonLabel || 'Abone ol'}
          </Button>
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
