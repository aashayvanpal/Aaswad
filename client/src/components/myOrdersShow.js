import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from '../config/axios.js';
import Star from '../assets/Star.js';
import '../css/myOrdersShow.scss';

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
};

const STATUS_META = {
  pending:   { label: 'Pending',   className: 'mos__badge--pending'   },
  approved:  { label: 'Approved',  className: 'mos__badge--approved'  },
  completed: { label: 'Completed', className: 'mos__badge--completed' },
  rejected:  { label: 'Rejected',  className: 'mos__badge--rejected'  },
};

function formatDate(iso) {
  if (!iso) return '—';
  const s = iso.toString();
  return s.substr(8, 2) + '/' + s.substr(5, 2) + '/' + s.substr(0, 4);
}

export default function MyOrdersShow() {
  const { id } = useParams();

  const [order,         setOrder]         = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [overallRating, setOverallRating] = useState(0);
  const [feedback,      setFeedback]      = useState(false);
  const [feedbackNote,  setFeedbackNote]  = useState('');
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    axios.get(`/myOrders/show/${id}`, {
      headers: { 'x-auth': localStorage.getItem('token') },
    })
      .then(res => {
        const o = res.data;
        setOrder(o);
        setSelectedItems(o.items ?? []);
        setOverallRating(o.overallRating ?? 0);
        setFeedback(!!o.feedback);
        setFeedbackNote(o.feedbackNote ?? '');
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const submitFeedback = () => {
    axios.put(`/orders/${id}`,
      { items: selectedItems, overallRating, feedback: true, feedbackNote },
      { headers: { 'x-auth': localStorage.getItem('token') } },
    ).catch(err => console.error(err));
    setFeedback(true);
  };

  const changeItemRating = (newRating, itemId) => {
    setSelectedItems(prev => {
      const next = [...prev];
      const idx  = next.findIndex(o => o._id === itemId);
      if (idx !== -1) next[idx] = { ...next[idx], rating: newRating };
      return next;
    });
  };

  const status   = order?.status ?? '';
  const meta     = STATUS_META[status] ?? { label: status, className: '' };
  const customer = order?.customer ?? {};

  const DETAIL_ROWS = [
    { icon: '🪪', label: 'Order ID',      value: order?._id },
    { icon: '👤', label: 'Name',           value: customer.fullName },
    { icon: '📅', label: 'Event Date',     value: formatDate(customer.eventDate) },
    { icon: '⏰', label: 'Event Time',     value: customer.eventTime },
    { icon: '👥', label: 'Guests',         value: customer.numberOfPeople },
    { icon: '📍', label: 'Address',        value: customer.address },
    { icon: '📞', label: 'Phone',          value: customer.phoneNumber },
    { icon: '✉',  label: 'Email',          value: customer.email },
    { icon: '🍽', label: 'Service',        value: customer.service      ? 'Yes' : 'No' },
    { icon: '🚚', label: 'Home Delivery',  value: customer.homeDelivery ? 'Yes' : 'No' },
  ].filter(r => r.value !== undefined && r.value !== null && r.value !== '');

  if (loading) {
    return (
      <div className="mos">
        <div className="mos__nav">
          <Link to="/myOrders" className="mos__back">← Back to Orders</Link>
        </div>
        <div className="mos__skeleton-body">
          <div className="mos__skeleton mos__skeleton--card" />
          <div className="mos__skeleton mos__skeleton--card" />
        </div>
      </div>
    );
  }

  return (
    <div className="mos">

      {/* ── Back nav ───────────────────────────────────── */}
      <div className="mos__nav">
        <Link to="/myOrders" className="mos__back">← Back to Orders</Link>
      </div>

      {/* ── Main body ──────────────────────────────────── */}
      <div className="mos__body">
        <motion.div
          className="mos__grid"
          initial="hidden"
          animate="show"
          variants={stagger}
        >

          {/* ── Details card ─────────────────────────── */}
          <motion.div className="mos__card" variants={fadeUp}>
            {/* Event name + status at top */}
            <div className="mos__card-header">
              <h2 className="mos__card-event-name">
                {customer.eventName || 'Your Order'}
              </h2>
              <span className={`mos__badge ${meta.className}`}>{meta.label}</span>
            </div>

            <ul className="mos__detail-list">
              {DETAIL_ROWS.map(({ icon, label, value }) => (
                <li key={label} className="mos__detail-item">
                  <span className="mos__detail-icon" aria-hidden="true">{icon}</span>
                  <span className="mos__detail-label">{label}</span>
                  <span className="mos__detail-value">{value}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Items card ───────────────────────────── */}
          <motion.div className="mos__card" variants={fadeUp}>
            <h2 className="mos__card-title">
              Order Items
              <span className="mos__item-count">{selectedItems.length}</span>
            </h2>

            {selectedItems.length === 0 ? (
              <p className="mos__no-items">No items recorded.</p>
            ) : (
              <ul className="mos__item-list">
                {selectedItems.map((item, i) => (
                  <li key={item._id ?? i} className="mos__item-row">
                    <span className="mos__item-index">{i + 1}</span>
                    <div className="mos__item-info">
                      <span className="mos__item-name">{item.name}</span>
                      <span className="mos__item-qty">
                        {item.quantity} {item.measured}
                      </span>
                    </div>
                    {status === 'completed' && (
                      <div className="mos__item-rating">
                        <Star
                          name={item.name}
                          id={item._id}
                          rating={item.rating}
                          ChangeItemRating={changeItemRating}
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <p className="mos__billing-note">
              Billing estimate will be shared after order approval.
            </p>
          </motion.div>

        </motion.div>

        {/* ── Feedback section (completed orders only) ── */}
        <AnimatePresence>
          {status === 'completed' && (
            <motion.div
              className="mos__card mos__feedback"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="mos__card-title">Your Feedback</h2>

              {feedback ? (
                <div className="mos__feedback-done">
                  <span className="mos__feedback-check">✓</span>
                  <div>
                    <p className="mos__feedback-done-title">Feedback submitted — thank you!</p>
                    {feedbackNote && (
                      <p className="mos__feedback-note-display">"{feedbackNote}"</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mos__feedback-form">
                  <div className="mos__overall-rating">
                    <span className="mos__overall-label">Overall Rating</span>
                    <Star
                      name="overallRating"
                      id={id}
                      rating={overallRating}
                      overallRating={true}
                      ChangeOverallRating={setOverallRating}
                    />
                  </div>
                  <textarea
                    className="mos__feedback-textarea"
                    placeholder="Share your experience — how was the food, service, and overall event?"
                    value={feedbackNote}
                    onChange={e => setFeedbackNote(e.target.value)}
                  />
                  <button className="mos__submit-btn" onClick={submitFeedback}>
                    Submit Feedback
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
