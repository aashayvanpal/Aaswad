import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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

      <div style={{
        minHeight: 'calc(100vh - 64px)',
        background: '#0d0d0d',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Radial glow */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(201,162,39,0.07) 0%, transparent 70%)',
        }} />

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
          style={{
            position: 'relative', zIndex: 1,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0',
          }}
        >

          {/* Plate icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1, type: 'spring', stiffness: 160 }}
            style={{ fontSize: '5rem', lineHeight: 1, marginBottom: '1.5rem' }}
          >
            🍽️
          </motion.div>

          {/* 404 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(6rem, 18vw, 11rem)',
              fontWeight: 700,
              lineHeight: 0.9,
              color: '#C9A227',
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem',
            }}
          >
            404
          </motion.div>

          {/* Ornamental divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              marginBottom: '1.75rem',
            }}
          >
            <div style={{ width: '60px', height: '1px', background: 'rgba(201,162,39,0.35)' }} />
            <span style={{ fontSize: '1rem', color: 'rgba(201,162,39,0.6)' }}>✦</span>
            <div style={{ width: '60px', height: '1px', background: 'rgba(201,162,39,0.35)' }} />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.45 }}
            style={{ maxWidth: '420px' }}
          >
            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
              fontWeight: 700,
              color: '#ffffff',
              margin: '0 0 0.9rem',
            }}>
              This dish is off the menu
            </h1>
            <p style={{
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.4)',
              lineHeight: 1.8,
              fontWeight: 300,
              margin: '0 0 2.5rem',
            }}>
              The page you're looking for has been removed,
              renamed, or never existed. Head back home and
              we'll take care of you.
            </p>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link to="/" style={{
                display: 'inline-block',
                padding: '1rem 3rem',
                background: '#C9A227',
                color: '#000',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.9rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                boxShadow: '0 4px 24px rgba(201,162,39,0.25)',
                transition: 'background 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#e8c84d';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(201,162,39,0.45)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#C9A227';
                  e.currentTarget.style.boxShadow = '0 4px 24px rgba(201,162,39,0.25)';
                }}
              >
                Back to Home
              </Link>
            </motion.div>
          </motion.div>

        </motion.div>
      </div>
    </>
  );
}
