import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import buffet1   from '../images/landing-page-images/buffet1.jpg';
import buffet2   from '../images/landing-page-images/buffet2.jpg';
import buffet3   from '../images/landing-page-images/buffet3.jpg';
import buffet4   from '../images/landing-page-images/buffet4.jpg';
import buffet5   from '../images/landing-page-images/buffet5.jpg';
import buffet21  from '../images/landing-page-images/buffet21.png';
import orderfood from '../images/landing-page-images/order-food.svg';
import cook      from '../images/landing-page-images/cook.svg';
import deliver   from '../images/landing-page-images/deliver.svg';
import Footer from './Footer';

import '../css/HomePage/homepage.scss';

// ─── Types ──────────────────────────────────────────────────
interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Stat {
  number: string;
  label: string;
}

// ─── Data ───────────────────────────────────────────────────
const STATS: Stat[] = [
  { number: '15+',  label: 'Years of Service' },
  { number: '500+', label: 'Events Catered'   },
  { number: '100%', label: 'Pure Vegetarian'  },
  { number: '∞',    label: 'Happy Families'   },
];

const FEATURES: Feature[] = [
  {
    icon: orderfood,
    title: 'Fully Customised Orders',
    description:
      'Pick your dishes, flavours, and portions. Every order is tailored exactly to your taste and event requirements.',
  },
  {
    icon: deliver,
    title: 'Deliver or Pickup',
    description:
      'Flexible service — we deliver to your venue or you can pick up from us, adapted to your event type and convenience.',
  },
  {
    icon: cook,
    title: 'Expert Chef, Home Recipes',
    description:
      'Supervised by expert chef Varsha Vanpal. Homely, hygienic, and delicious pure vegetarian food in every bite.',
  },
];

const GALLERY_IMAGES = [buffet1, buffet2, buffet3, buffet4, buffet5, buffet21];

// ─── Component ──────────────────────────────────────────────
export default function HomePage() {
  const [scrolled, setScrolled]   = useState(false);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Sticky nav
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-reveal feature cards
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) (e.target as HTMLElement).classList.add('visible');
      }),
      { threshold: 0.18 },
    );
    featureRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="hp">

      {/* ── Navbar ──────────────────────────────────────── */}
      <nav className={`hp__nav${scrolled ? ' scrolled' : ''}`}>
        <Link to="/" className="hp__nav-logo">Aaswad</Link>
        <ul className="hp__nav-links">
          <li><Link to="/menu">Menu</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/SignIn" className="hp__nav-order">Order Now</Link></li>
        </ul>
      </nav>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="hp__hero">
        <div
          className="hp__hero-bg"
          style={{ backgroundImage: `url(${buffet1})` }}
          aria-hidden="true"
        />
        <div className="hp__hero-content">
          <div className="hp__hero-badge">
            <span className="hp__hero-badge-dot" aria-hidden="true" />
            Pure Vegetarian &nbsp;·&nbsp; Est. 2010
          </div>
          <h1 className="hp__hero-title">
            Home is where,<br />
            I&apos;m with <em>food</em>
          </h1>
          <p className="hp__hero-subtitle">
            Freshly crafted pure vegetarian catering for weddings, events, and
            daily meals. Taste the warmth of home in every bite.
          </p>
          <div className="hp__hero-actions">
            <Link to="/SignIn" className="hp__btn-primary">Order Now</Link>
            <Link to="/menu"   className="hp__btn-ghost">View Menu</Link>
          </div>
        </div>
        <span className="hp__hero-scroll" aria-hidden="true">Scroll</span>
      </section>

      {/* ── Stats ───────────────────────────────────────── */}
      <section className="hp__stats" aria-label="At a glance">
        {STATS.map(({ number, label }) => (
          <div className="hp__stat" key={label}>
            <div className="hp__stat-number">{number}</div>
            <div className="hp__stat-label">{label}</div>
          </div>
        ))}
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section className="hp__features" aria-labelledby="features-heading">
        <div className="hp__container">
          <div className="hp__section-header">
            <span className="hp__section-eyebrow">Why Choose Us</span>
            <h2 className="hp__section-title" id="features-heading">
              Benefits &amp; Features
            </h2>
          </div>
          <div className="hp__features-grid">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="hp__feature-card"
                ref={(el) => { featureRefs.current[i] = el; }}
                style={{ transitionDelay: `${i * 0.13}s` }}
              >
                <div className="hp__feature-icon">
                  <img src={feature.icon} alt="" aria-hidden="true" />
                </div>
                <h3 className="hp__feature-title">{feature.title}</h3>
                <p  className="hp__feature-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gallery ─────────────────────────────────────── */}
      <section className="hp__gallery" aria-label="Food gallery">
        <div className="hp__gallery-header hp__container">
          <span className="hp__section-eyebrow">Our Food</span>
          <h2 className="hp__section-title hp__section-title--light">
            A Feast for the Eyes
          </h2>
        </div>
        <div className="hp__gallery-track-wrapper" aria-hidden="true">
          <div className="hp__gallery-track">
            {[...GALLERY_IMAGES, ...GALLERY_IMAGES].map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`Buffet spread ${(i % GALLERY_IMAGES.length) + 1}`}
                className="hp__gallery-img"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="hp__cta" aria-labelledby="cta-heading">
        <div className="hp__cta-inner">
          <span className="hp__cta-eyebrow">Let&apos;s Get Started</span>
          <h2 className="hp__cta-title" id="cta-heading">
            Ready to place an order?
          </h2>
          <p className="hp__cta-sub">
            Whether it&apos;s a small family gathering or a grand wedding —
            we&apos;ve got you covered with fresh, homely food.
          </p>
          <div className="hp__cta-actions">
            <Link to="/SignIn"    className="hp__btn-primary">Get Started</Link>
            <Link to="/contact" className="hp__btn-ghost hp__btn-ghost--dark">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}
