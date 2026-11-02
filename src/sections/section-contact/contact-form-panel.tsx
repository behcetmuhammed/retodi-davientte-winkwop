import { useState, type FormEvent } from 'react';
import { Button } from '../../components/ui/button';
import { Field, FieldLabel } from '../../components/ui/field';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { toast } from '../../components/ui/toast';
import { v, validate } from '../../lib/validation';
import { cn } from '../../lib/utils';

type ContactFormPanelProps = {
  namePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  submitButtonLabel: string;
  className?: string;
};

export function ContactFormPanel({
  namePlaceholder,
  emailPlaceholder,
  messagePlaceholder,
  submitButtonLabel,
  className,
}: ContactFormPanelProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = { name: name.trim(), email: email.trim(), message: message.trim() };
    const errors = validate(values, {
      name: v.required('Ad soyad girin'),
      email: [v.required('E-posta girin'), v.email()],
      message: v.required('Mesaj girin'),
    });
    const first = errors.name || errors.email || errors.message;
    if (first) {
      toast.error(first);
      return;
    }
    toast.success('Mesajınız alındı. En kısa sürede dönüş yapacağız.');
    setName('');
    setEmail('');
    setMessage('');
  }

  return (
    <div className={cn('bg-muted p-6 md:p-8 lg:p-10', className)}>
      <form className="flex flex-col gap-4 md:gap-5" onSubmit={onSubmit} noValidate>
        <Field required>
          <FieldLabel className="sr-only">{namePlaceholder || 'Ad soyad'}</FieldLabel>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={namePlaceholder}
            autoComplete="name"
          />
        </Field>
        <Field required>
          <FieldLabel className="sr-only">{emailPlaceholder || 'E-posta'}</FieldLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={emailPlaceholder}
            autoComplete="email"
          />
        </Field>
        <Field required>
          <FieldLabel className="sr-only">{messagePlaceholder || 'Mesaj'}</FieldLabel>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={messagePlaceholder}
            rows={6}
            className="min-h-40 resize-y font-mono text-sm md:min-h-48"
          />
        </Field>
        <div>
          <Button type="submit" className="min-w-40 px-10 uppercase tracking-wide">
            {submitButtonLabel || 'Gönder'}
          </Button>
        </div>
      </form>
    </div>
  );
}
