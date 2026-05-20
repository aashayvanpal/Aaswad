import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getUserDetails } from '../assets/user-functions.js';
import '../css/myorders.scss';

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
};

const STATUS_META = {
  pending:   { label: 'Pending',   className: 'mo__badge--pending'   },
  approved:  { label: 'Approved',  className: 'mo__badge--approved'  },
  completed: { label: 'Completed', className: 'mo__badge--completed' },
  rejected:  { label: 'Rejected',  className: 'mo__badge--rejected'  },
};

function formatDate(iso) {
  if (!iso) return '—';
  return iso.substr(8, 2) + '/' + iso.substr(5, 2) + '/' + iso.substr(0, 4);
}

export default function MyOrdersList() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserDetails()
      .then(() => {
        axios.get('/account', { headers: { 'x-auth': localStorage.getItem('token') } })
          .then(res => {
            axios.get(`/myOrders/${res.data.id}`, {
              headers: { 'x-auth': localStorage.getItem('token') },
            })
              .then(r => {
                setOrders(r.data);
                setLoading(false);
              })
              .catch(() => setLoading(false));
          })
          .catch(() => setLoading(false));
      })
      .catch(() => {
        window.alert('Please login, you will be redirected');
        window.location.href = '/Signin';
      });
  }, []);

  return (
    <div className="mo">

      {/* ── Content ────────────────────────────────────── */}
      <div className="mo__body">

        <div className="mo__toolbar">
          <span className="mo__count">
            {!loading && `${orders.length} order${orders.length !== 1 ? 's' : ''}`}
          </span>
          <Link to="/request" className="mo__new-btn">+ New Order</Link>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (

            /* ── Skeleton ── */
            <motion.div
              key="loading"
              className="mo__skeletons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[1, 2, 3].map(n => (
                <div key={n} className="mo__skeleton" />
              ))}
            </motion.div>

          ) : orders.length === 0 ? (

            /* ── Empty state ── */
            <motion.div
              key="empty"
              className="mo__empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="mo__empty-icon">🍽</span>
              <h2 className="mo__empty-title">No orders yet</h2>
              <p className="mo__empty-sub">
                Place your first catering order and it will show up here.
              </p>
              <Link to="/request" className="mo__new-btn">Place an Order</Link>
            </motion.div>

          ) : (

            /* ── Order cards ── */
            <motion.div
              key="list"
              className="mo__list"
              initial="hidden"
              animate="show"
              variants={stagger}
            >
              {orders.map(order => {
                const meta = STATUS_META[order.status] ?? { label: order.status, className: '' };
                return (
                  <motion.div key={order._id} className="mo__card" variants={fadeUp}>

                    <div className="mo__card-top">
                      <div>
                        <div className="mo__card-event">
                          {order.customer.eventName || '—'}
                        </div>
                        <div className="mo__card-date">
                          {formatDate(order.customer.eventDate)}
                        </div>
                      </div>
                      <span className={`mo__badge ${meta.className}`}>
                        {meta.label}
                      </span>
                    </div>

                    <div className="mo__card-address">
                      <span className="mo__card-address-icon">📍</span>
                      {order.customer.address || '—'}
                    </div>

                    <div className="mo__card-actions">
                      <Link to={`/myOrders/show/${order._id}`} className="mo__action-link">
                        View Details →
                      </Link>
                      {order.status === 'completed' && (
                        <Link to={`/myOrders/feedback/${order._id}`} className="mo__action-link mo__action-link--muted">
                          Leave Feedback
                        </Link>
                      )}
                    </div>

                  </motion.div>
                );
              })}
            </motion.div>

          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
