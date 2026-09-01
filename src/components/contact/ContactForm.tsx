import React, { useState } from 'react';
import { Button } from '../ui/Button';

export interface ContactFormProps {
  initialSubject?: string;
  onSuccess?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ initialSubject, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectScope: initialSubject || '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      onSuccess?.();
    }, 800);
  };

  if (status === 'success') {
    return (
      <div className="bg-surface-primary p-8 md:p-12 border border-outline-variant shadow-sm text-center">
        <div className="w-16 h-16 bg-primary-fixed text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-3xl">check_circle</span>
        </div>
        <h3 className="font-headline-md text-2xl text-ink-dark mb-3">Conversation Started</h3>
        <p className="font-body-md text-on-surface-variant mb-6 leading-relaxed">
          Thank you, <span className="font-semibold text-ink-dark">{formData.name}</span>. Our lead
          architects have received your project inquiry and will reach out to{' '}
          <span className="font-semibold text-ink-dark">{formData.email}</span> within 24 hours.
        </p>
        <button
          onClick={() => {
            setFormData({ name: '', email: '', phone: '', projectScope: '' });
            setStatus('idle');
          }}
          className="btn-secondary text-xs uppercase tracking-wider py-2.5 px-6"
        >
          Send Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface-primary p-8 md:p-12 border border-outline-variant shadow-sm rounded-none">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <label className="font-label-bold text-label-bold text-ink-dark" htmlFor="name">
            Name <span className="text-accent-orange">*</span>
          </label>
          <input
            className="form-input-line w-full font-body-md text-body-md text-on-surface placeholder:text-outline"
            id="name"
            name="name"
            placeholder="Your full name"
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-label-bold text-label-bold text-ink-dark" htmlFor="email">
            Email <span className="text-accent-orange">*</span>
          </label>
          <input
            className="form-input-line w-full font-body-md text-body-md text-on-surface placeholder:text-outline"
            id="email"
            name="email"
            placeholder="hello@company.com"
            required
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-label-bold text-label-bold text-ink-dark" htmlFor="phone">
            Phone Number
          </label>
          <input
            className="form-input-line w-full font-body-md text-body-md text-on-surface placeholder:text-outline"
            id="phone"
            name="phone"
            placeholder="+1 (555) 000-0000"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-label-bold text-label-bold text-ink-dark" htmlFor="projectScope">
            Project Overview or Technology Needs
          </label>
          <input
            className="form-input-line w-full font-body-md text-body-md text-on-surface placeholder:text-outline"
            id="projectScope"
            name="projectScope"
            placeholder="e.g. Web platform, API integration, ERP system..."
            type="text"
            value={formData.projectScope}
            onChange={(e) => setFormData({ ...formData, projectScope: e.target.value })}
          />
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={status === 'submitting'}
            className="w-full py-4 text-center justify-center font-label-bold uppercase tracking-wider"
          >
            {status === 'submitting' ? 'Connecting...' : 'Start a Conversation'}
          </Button>
        </div>
      </form>
    </div>
  );
};
