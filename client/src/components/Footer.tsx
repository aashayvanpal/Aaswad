import React from 'react';
import { Link } from 'react-router-dom';
import facebook from '../images/landing-page-images/facebook-logo.png';
import gmail    from '../images/landing-page-images/gmail-icon.png';
import whatsApp from '../images/landing-page-images/whatsApp-icon.png';
import '../css/footer.scss';

export default function Footer() {
  return (
    <footer className="ft">

      <div className="ft__body">

        {/* Brand */}
        <div>
          <span className="ft__brand-name">Aaswad Caterers</span>
          <p className="ft__brand-desc">
            Serving pure vegetarian food with love since 2010. From intimate
            family meals to grand events, every dish is crafted with care.
          </p>
          <div className="ft__socials">
            <a href="#" className="ft__social-link" aria-label="Facebook">
              <img src={facebook} alt="Facebook" />
            </a>
            <a href="#" className="ft__social-link" aria-label="WhatsApp">
              <img src={whatsApp} alt="WhatsApp" />
            </a>
            <a href="#" className="ft__social-link" aria-label="Email">
              <img src={gmail} alt="Gmail" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="ft__col-title">Quick Links</h3>
          <nav className="ft__links">
            <Link to="/SignIn">Order Now</Link>
            <Link to="/menu">Menu</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/SignIn">Sign In</Link>
          </nav>
        </div>

        {/* Services */}
        <div>
          <h3 className="ft__col-title">Services</h3>
          <nav className="ft__links">
            <Link to="/SignIn">Catering Orders</Link>
            <Link to="/SignIn">Event Orders</Link>
            <Link to="/SignIn">Multi-Date Orders</Link>
            <Link to="/SignIn">Custom Menus</Link>
          </nav>
        </div>

        {/* Reach Us */}
        <div>
          <h3 className="ft__col-title">Reach Us</h3>
          <ul className="ft__contact-list">
            <li className="ft__contact-item">
              <span className="ft__contact-icon">✉</span>
              aaswadcaterers@gmail.com
            </li>
            <li className="ft__contact-item">
              <span className="ft__contact-icon">📍</span>
              Bangalore, Karnataka, India
            </li>
            <li className="ft__contact-item">
              <span className="ft__contact-icon">⏰</span>
              Mon – Sat, 9 AM – 8 PM
            </li>
          </ul>
        </div>

      </div>

      <div className="ft__bar">
        <div className="ft__bar-inner">
          <span>© 2026 Aaswad Caterers. All rights reserved.</span>
          <div className="ft__bar-links">
            <Link to="/contact">Contact</Link>
            <Link to="/SignIn">Order Now</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
