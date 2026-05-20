import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUserDetails } from '../assets/user-functions.js';
import '../css/profile.scss';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1 } },
};

const INFO_FIELDS = [
  { icon: '✉', label: 'Email',        key: 'email'       },
  { icon: '📞', label: 'Phone',        key: 'phonenumber' },
  { icon: '📍', label: 'Address',      key: 'address'     },
];

export default function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserDetails()
      .then(res => setUser(res))
      .catch(() => {
        window.alert('Please login, you will be redirected');
        window.location.href = '/Signin';
      });
  }, []);

  const initials = user?.username
    ? user.username.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';

  return (
    <div className="up">

      {/* ── Banner ─────────────────────────────────────── */}
      <div className="up__banner">
        <motion.div
          className="up__avatar"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          {initials}
        </motion.div>

        <motion.div
          className="up__banner-text"
          initial="hidden"
          animate="show"
          variants={stagger}
        >
          <motion.h1 className="up__name" variants={fadeUp}>
            {user?.username || '—'}
          </motion.h1>
          {user?.userType && (
            <motion.span className="up__badge" variants={fadeUp}>
              {user.userType}
            </motion.span>
          )}
        </motion.div>
      </div>

      {/* ── Body ───────────────────────────────────────── */}
      <motion.div
        className="up__body"
        initial="hidden"
        animate="show"
        variants={stagger}
      >
        <motion.h2 className="up__section-title" variants={fadeUp}>
          Account Details
        </motion.h2>

        <motion.div className="up__cards" variants={stagger}>
          {INFO_FIELDS.map(({ icon, label, key }) => (
            <motion.div key={key} className="up__card" variants={fadeUp}>
              <span className="up__card-icon" aria-hidden="true">{icon}</span>
              <div>
                <div className="up__card-label">{label}</div>
                <div className="up__card-value">{user?.[key] || '—'}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="up__actions" variants={fadeUp}>
          <button className="up__btn">Change Password</button>
        </motion.div>
      </motion.div>

    </div>
  );
}
