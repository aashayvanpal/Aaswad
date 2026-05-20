import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import contactsData from '../../json/contacts.json';
import styles from './Contacts.module.scss';

interface Contact {
  name: string;
  phonenumber: number | number[];
  type: string;
  notes: string;
  address: string;
}

const contacts = contactsData as Contact[];

const NOTES_LIMIT = 90;

const Contacts: React.FC = () => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'name' | 'type'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [activeType, setActiveType] = useState<string | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  // All unique non-empty types, sorted alphabetically
  const uniqueTypes = useMemo(
    () => Array.from(new Set(contacts.map(c => c.type).filter(Boolean))).sort(),
    []
  );

  // Count contacts per type for chip labels
  const typeCounts = useMemo(() => {
    const map: Record<string, number> = {};
    contacts.forEach(c => { if (c.type) map[c.type] = (map[c.type] ?? 0) + 1; });
    return map;
  }, []);

  // Filter by search query and active type chip
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return contacts.filter(c => {
      const phones = Array.isArray(c.phonenumber) ? c.phonenumber : [c.phonenumber];
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.type.toLowerCase().includes(q) ||
        phones.some(p => String(p).includes(q)) ||
        c.notes.toLowerCase().includes(q);
      const matchesType = !activeType || c.type === activeType;
      return matchesSearch && matchesType;
    });
  }, [search, activeType]);

  // Sort filtered results
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const va = (a[sortField] ?? '').toLowerCase();
      const vb = (b[sortField] ?? '').toLowerCase();
      return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }, [filtered, sortField, sortDir]);

  const handleSort = (field: 'name' | 'type') => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const copyPhone = (num: number, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigator.clipboard.writeText(String(num)).then(() => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      setToast(`Copied ${num}`);
      toastTimer.current = setTimeout(() => setToast(null), 2000);
    });
  };

  const toggleNote = (name: string) => {
    setExpandedNotes(prev => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  const renderPhones = (phonenumber: number | number[]) => {
    const nums = Array.isArray(phonenumber) ? phonenumber : [phonenumber];
    return (
      <div className={styles.phoneGroup}>
        {nums.map((num, i) => (
          <a
            key={i}
            href={`tel:${num}`}
            className={styles.phone}
            onClick={e => copyPhone(num, e)}
            title="Click to copy"
          >
            {num}
          </a>
        ))}
      </div>
    );
  };

  const renderNotes = (notes: string, name: string) => {
    if (!notes) return <span className={styles.muted}>—</span>;
    const isExpanded = expandedNotes.has(name);
    const isTruncated = notes.length > NOTES_LIMIT && !isExpanded;
    return (
      <div className={styles.noteText}>
        {isTruncated ? `${notes.slice(0, NOTES_LIMIT)}…` : notes}
        {notes.length > NOTES_LIMIT && (
          <button className={styles.showMore} onClick={() => toggleNote(name)}>
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    );
  };

  const sortArrow = (field: 'name' | 'type') => {
    if (sortField !== field) return <span className={styles.sortInactive}>⇅</span>;
    return <span className={styles.sortActive}>{sortDir === 'asc' ? '↑' : '↓'}</span>;
  };

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          &#8592; Back
        </button>
        <h2 className={styles.title}>Contacts</h2>
        <span className={styles.countBadge}>
          {sorted.length} of {contacts.length}
        </span>
      </div>

      {/* ── Search + Sort ── */}
      <div className={styles.controls}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search by name, phone, type…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className={styles.sortControls}>
          <span className={styles.sortLabel}>Sort:</span>
          <button
            className={`${styles.sortBtn}${sortField === 'name' ? ` ${styles.sortBtnActive}` : ''}`}
            onClick={() => handleSort('name')}
          >
            Name {sortArrow('name')}
          </button>
          <button
            className={`${styles.sortBtn}${sortField === 'type' ? ` ${styles.sortBtnActive}` : ''}`}
            onClick={() => handleSort('type')}
          >
            Type {sortArrow('type')}
          </button>
        </div>
      </div>

      {/* ── Type filter chips ── */}
      <div className={styles.chipsRow}>
        <button
          className={`${styles.chip}${activeType === null ? ` ${styles.chipActive}` : ''}`}
          onClick={() => setActiveType(null)}
        >
          All ({contacts.length})
        </button>
        {uniqueTypes.map(type => (
          <button
            key={type}
            className={`${styles.chip}${activeType === type ? ` ${styles.chipActive}` : ''}`}
            onClick={() => setActiveType(activeType === type ? null : type)}
          >
            {type} ({typeCounts[type]})
          </button>
        ))}
      </div>

      {/* ── Desktop table ── */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>#</th>
              <th
                className={`${styles.th} ${styles.thSortable}`}
                onClick={() => handleSort('name')}
              >
                Name {sortArrow('name')}
              </th>
              <th className={styles.th}>Phone</th>
              <th
                className={`${styles.th} ${styles.thSortable}`}
                onClick={() => handleSort('type')}
              >
                Type {sortArrow('type')}
              </th>
              <th className={styles.th}>Notes</th>
              <th className={styles.th}>Address</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyRow}>
                  No contacts match your search.
                </td>
              </tr>
            ) : (
              sorted.map((contact, idx) => (
                <tr key={contact.name} className={styles.row}>
                  <td className={styles.td}>{idx + 1}</td>
                  <td className={`${styles.td} ${styles.tdName}`}>{contact.name}</td>
                  <td className={styles.td}>{renderPhones(contact.phonenumber)}</td>
                  <td className={styles.td}>
                    {contact.type
                      ? <span className={styles.typeBadge}>{contact.type}</span>
                      : <span className={styles.muted}>—</span>
                    }
                  </td>
                  <td className={styles.td}>{renderNotes(contact.notes, contact.name)}</td>
                  <td className={`${styles.td} ${styles.tdAddress}`}>
                    {contact.address || <span className={styles.muted}>—</span>}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ── */}
      <div className={styles.cardGrid}>
        {sorted.length === 0 ? (
          <p className={styles.emptyRow}>No contacts match your search.</p>
        ) : (
          sorted.map(contact => (
            <div key={contact.name} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardName}>{contact.name}</span>
                {contact.type && (
                  <span className={styles.typeBadge}>{contact.type}</span>
                )}
              </div>
              <div className={styles.cardPhones}>
                {renderPhones(contact.phonenumber)}
              </div>
              {contact.notes && (
                <div className={styles.cardNotes}>
                  {renderNotes(contact.notes, contact.name)}
                </div>
              )}
              {contact.address && (
                <div className={styles.cardAddress}>{contact.address}</div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ── Clipboard toast ── */}
      {toast && <div className={styles.toast}>{toast}</div>}

    </div>
  );
};

export default Contacts;
