import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './NotFoundPage.scss'

// Food items drifting in the background
const FLOATERS = [
  { emoji: '🍛', x: '8%',  y: '15%', size: '2.8rem', delay: 0,    duration: 14 },
  { emoji: '🥗', x: '88%', y: '10%', size: '2.2rem', delay: 2,    duration: 18 },
  { emoji: '🍚', x: '75%', y: '70%', size: '2.6rem', delay: 1,    duration: 16 },
  { emoji: '🥘', x: '5%',  y: '72%', size: '2rem',   delay: 3,    duration: 20 },
  { emoji: '🍲', x: '50%', y: '5%',  size: '2.4rem', delay: 0.5,  duration: 15 },
  { emoji: '🫕', x: '92%', y: '45%', size: '2rem',   delay: 4,    duration: 17 },
  { emoji: '🥙', x: '18%', y: '88%', size: '2.2rem', delay: 1.5,  duration: 19 },
  { emoji: '🍜', x: '62%', y: '90%', size: '2.6rem', delay: 2.5,  duration: 13 },
];

const floatKeyframes = `
  @keyframes nf-float {
    0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.18; }
    33%       { transform: translateY(-18px) rotate(6deg); opacity: 0.25; }
    66%       { transform: translateY(10px) rotate(-4deg); opacity: 0.15; }
  }
  @keyframes nf-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
`;

export default function NotFoundPage() {
  return (
    <>
      <style>{floatKeyframes}</style>

      <div className="nf-page">

        {/* Radial glow */}
        <div className="nf-radial-glow" />

        {/* Floating food emojis */}
        {FLOATERS.map((f, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: f.x, top: f.y,
            fontSize: f.size,
            lineHeight: 1,
            pointerEvents: 'none',
            animation: `nf-float ${f.duration}s ease-in-out ${f.delay}s infinite`,
            userSelect: 'none',
          }}>
            {f.emoji}
          </div>
        ))}

        {/* ── Main card ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="nf-main-card"
        >

          {/* Plate icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1, type: 'spring', stiffness: 160 }}
            className="nf-plate-icon"
          >
            🍽️
          </motion.div>

          {/* 404 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="nf-404-number"
          >
            404
          </motion.div>

          {/* Ornamental divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="nf-divider"
          >
            <div className="nf-divider-line" />
            <span className="nf-divider-star">✦</span>
            <div className="nf-divider-line" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.45 }}
            className="nf-text-block"
          >
            <h1 className="nf-heading">
              This dish is off the menu
            </h1>
            <p className="nf-description">
              The page you're looking for has been removed,
              renamed, or never existed. Head back home and
              we'll take care of you.
            </p>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/" className="nf-home-link">
                Back to Home
              </Link>
            </motion.div>
          </motion.div>

        </motion.div>
      </div>
    </>
  );
}
