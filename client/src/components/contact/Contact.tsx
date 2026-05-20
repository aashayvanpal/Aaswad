import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../../config/axios.js';
import Footer from '../Footer';
import '../../css/contact.scss';

// ─── Types ──────────────────────────────────────────────────
interface FormFields {
  email:   string;
  subject: string;
  mobile:  string;
  message: string;
}

interface FormErrors {
  email?:   string;
  subject?: string;
  mobile?:  string;
  message?: string;
}

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

// ─── Animation variants ─────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, x: -20 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// ─── Contact info data ───────────────────────────────────────
const INFO_CARDS = [
  {
    icon: '📍',
    label: 'Address',
    value: '#34 Soundarya, 1st Main, 4th Cross, GMR Layout, Bangalore – 560094',
    link: {
      href: 'https://www.google.com/maps/place/33,+3rd+Main+Rd,+Geddalahalli,+KEB+Layout,+GMR+Layout,+Bengaluru,+Karnataka+560094',
      text: 'Get Directions →',
    },
  },
  {
    icon: '📞',
    label: 'Phone',
    value: '+91 97434 19673',
    link: { href: 'tel:+919743419673', text: 'Call us →' },
  },
  {
    icon: '✉',
    label: 'Email',
    value: 'aaswadcaterers@gmail.com',
    link: { href: 'mailto:aaswadcaterers@gmail.com', text: 'Send email →' },
  },
  {
    icon: '⏰',
    label: 'Working Hours',
    value: 'Monday – Saturday\n9:00 AM – 8:00 PM',
  },
];

// ─── Validation ─────────────────────────────────────────────
function validate(fields: FormFields): FormErrors {
  const errors: FormErrors = {};

  if (!fields.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!fields.email.includes('@')) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!fields.subject.trim()) {
    errors.subject = 'Subject is required.';
  }

  if (!fields.mobile.trim()) {
    errors.mobile = 'Phone number is required.';
  } else if (fields.mobile.replace(/\D/g, '').length < 10) {
    errors.mobile = 'Enter a valid 10-digit phone number.';
  }

  if (!fields.message.trim()) {
    errors.message = 'Message is required.';
  }

  return errors;
}

// ─── Component ──────────────────────────────────────────────
export default function ContactUs() {
  // Form state
  const [fields, setFields] = useState<FormFields>({
    email: '', subject: '', mobile: '', message: '',
  });
  const [errors, setErrors]   = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormFields, boolean>>>({});
  const [status, setStatus]   = useState<FormStatus>('idle');
  const [serverError, setServerError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (touched[name as keyof FormFields]) {
      const newErrors = validate({ ...fields, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof FormErrors] }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const newErrors = validate(fields);
    setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof FormErrors] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched = { email: true, subject: true, mobile: true, message: true };
    setTouched(allTouched);
    const newErrors = validate(fields);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setStatus('submitting');
    setServerError('');

    try {
      const response = await axios.post('/contactus', fields, {
        headers: { 'x-auth': localStorage.getItem('token') },
      });
      if (response.data?.errors) {
        setServerError(response.data.message || 'Something went wrong.');
        setStatus('error');
      } else {
        setStatus('success');
      }
    } catch {
      setServerError('Unable to send message. Please try again later.');
      setStatus('error');
    }
  };

  const resetForm = () => {
    setFields({ email: '', subject: '', mobile: '', message: '' });
    setErrors({});
    setTouched({});
    setStatus('idle');
    setServerError('');
  };

  return (
    <div className="ct">

      {/* ── Hero ──────────────────────────────────────── */}
      <section className="ct__hero">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          <motion.span className="ct__hero-eyebrow" variants={fadeUp}>
            Contact Us
          </motion.span>
          <motion.h1 className="ct__hero-title" variants={fadeUp}>
            Get in Touch
          </motion.h1>
          <motion.p className="ct__hero-sub" variants={fadeUp}>
            Have a question, want to place a custom order, or just say hello?
            We&apos;d love to hear from you.
          </motion.p>
        </motion.div>
      </section>

      {/* ── Main Grid ─────────────────────────────────── */}
      <section className="ct__main">
        <div className="ct__grid">

          {/* Left: Contact info cards */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
          >
            <motion.h2 className="ct__info-heading" variants={fadeUp}>
              Contact Details
            </motion.h2>
            <motion.p className="ct__info-sub" variants={fadeUp}>
              Reach us through any of the channels below.
              We typically respond within a few hours.
            </motion.p>

            <motion.div className="ct__cards" variants={stagger}>
              {INFO_CARDS.map((card) => (
                <motion.div
                  key={card.label}
                  className="ct__card"
                  variants={cardVariant}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="ct__card-icon" aria-hidden="true">
                    {card.icon}
                  </div>
                  <div className="ct__card-body">
                    <div className="ct__card-label">{card.label}</div>
                    <div className="ct__card-value" style={{ whiteSpace: 'pre-line' }}>
                      {card.value}
                    </div>
                    {card.link && (
                      <a
                        href={card.link.href}
                        className="ct__card-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {card.link.text}
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            className="ct__form-panel"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (

                /* ── Success state ── */
                <motion.div
                  key="success"
                  className="ct__success"
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35 }}
                >
                  <motion.div
                    className="ct__success-icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.1 }}
                  >
                    ✓
                  </motion.div>
                  <h3 className="ct__success-title">Message Sent!</h3>
                  <p className="ct__success-msg">
                    Thanks for reaching out. We&apos;ll get back to you within a few hours.
                  </p>
                  <button className="ct__success-reset" onClick={resetForm}>
                    Send Another Message
                  </button>
                </motion.div>

              ) : (

                /* ── Form ── */
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="ct__form-heading">Send a Message</h2>
                  <p className="ct__form-sub">
                    Fill in the form and we&apos;ll get back to you shortly.
                  </p>

                  {status === 'error' && serverError && (
                    <motion.div
                      className="ct__form-error-banner"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {serverError}
                    </motion.div>
                  )}

                  <form className="ct__form" onSubmit={handleSubmit} noValidate>

                    {/* Email + Subject row */}
                    <div className="ct__form-row">
                      <div className="ct__field">
                        <label className="ct__label" htmlFor="email">Email</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          value={fields.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`ct__input${errors.email ? ' ct__input--error' : ''}`}
                        />
                        {errors.email && (
                          <span className="ct__field-error">{errors.email}</span>
                        )}
                      </div>

                      <div className="ct__field">
                        <label className="ct__label" htmlFor="mobile">Phone</label>
                        <input
                          id="mobile"
                          name="mobile"
                          type="tel"
                          autoComplete="tel"
                          placeholder="+91 98765 43210"
                          value={fields.mobile}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`ct__input${errors.mobile ? ' ct__input--error' : ''}`}
                        />
                        {errors.mobile && (
                          <span className="ct__field-error">{errors.mobile}</span>
                        )}
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="ct__field">
                      <label className="ct__label" htmlFor="subject">Subject</label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        placeholder="e.g. Wedding catering enquiry"
                        value={fields.subject}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`ct__input${errors.subject ? ' ct__input--error' : ''}`}
                      />
                      {errors.subject && (
                        <span className="ct__field-error">{errors.subject}</span>
                      )}
                    </div>

                    {/* Message */}
                    <div className="ct__field">
                      <label className="ct__label" htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="Tell us about your event, number of guests, date..."
                        value={fields.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`ct__textarea${errors.message ? ' ct__input--error' : ''}`}
                      />
                      {errors.message && (
                        <span className="ct__field-error">{errors.message}</span>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="ct__submit"
                      disabled={status === 'submitting'}
                    >
                      {status === 'submitting' ? 'Sending…' : 'Send Message'}
                    </button>

                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </section>

      {/* ── Map ───────────────────────────────────────── */}
      <section className="ct__map">
        <div className="ct__map-header">
          <span className="ct__map-eyebrow">Find Us</span>
          <h2 className="ct__map-title">Our Location</h2>
        </div>
        <motion.div
          className="ct__map-iframe-wrap"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242.9414729208432!2d77.57857370734024!3d13.031624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17c22c67e5d5%3A0xb78ebc83bd03aa60!2s33%2C%203rd%20Main%20Rd%2C%20Geddalahalli%2C%20KEB%20Layout%2C%20GMR%20Layout%2C%20Bengaluru%2C%20Karnataka%20560094%2C%20India!5e0!3m2!1sen!2sus!4v1679814589260!5m2!1sen!2sus"
            title="Aaswad Caterers location"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
