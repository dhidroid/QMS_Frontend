import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../api/endpoints';
import styles from '../styles/AdminDashboard.module.css';
import { FaClipboardList, FaWpforms, FaUsers, FaDesktop, FaMobileAlt, FaCog, FaTrash, FaLink, FaEdit, FaEye } from 'react-icons/fa';
import Toast from '../components/Toast';
import ConfirmModal from '../components/ConfirmModal';

const AdminDashboard = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counterName, setCounterName] = useState(localStorage.getItem('qms_counter') || 'Counter 1');
  const [view, setView] = useState('dashboard'); // dashboard | tokens | settings | users

  // Settings state
  const [pushSubs, setPushSubs] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'handler', displayName: '' });

  // UI State
  const [toast, setToast] = useState(null); // { message, type }
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, formId: null, title: '' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchTokens = async () => {
    // ... same as before
    try {
      const res = await api.admin.getTokens();
      if (res.tokens) {
        setTokens(res.tokens);
      }
    } catch (err) {
      console.error('Failed to fetch tokens', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
    const interval = setInterval(fetchTokens, 5000);
    return () => clearInterval(interval);
  }, []);

  // Save counter preference
  useEffect(() => {
    localStorage.setItem('qms_counter', counterName);
  }, [counterName]);

  const handleStatusUpdate = async (tokenGuid, status) => {
    try {
      await api.admin.updateStatus({ tokenGuid, status });
      fetchTokens();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleCallNext = async () => {
    try {
      const res = await api.admin.callNext({ counterName });
      if (res.success) {
        fetchTokens();
        // optionally play a sound here
      } else {
        showToast(res.message || 'Failed to call next token', 'error');
      }
    } catch (err) {
      showToast('Error calling next token', 'error');
    }
  };

  const stats = useMemo(() => {
    const total = tokens.length;
    const pending = tokens.filter(t => (t.Status || '').toLowerCase() === 'pending').length;
    const called = tokens.filter(t => (t.Status || '').toLowerCase() === 'called').length;
    const served = tokens.filter(t => (t.Status || '').toLowerCase() === 'served' || (t.Status || '').toLowerCase() === 'completed').length;
    return { total, pending, called, served };
  }, [tokens]);

  const [query, setQuery] = useState('');
  const filteredTokens = useMemo(() => {
    if (!query) return tokens;
    const q = query.toLowerCase();
    return tokens.filter(t => (t.FullName || '').toLowerCase().includes(q) || String(t.TokenNumber).includes(q));
  }, [tokens, query]);

  const fetchPushSubs = async () => {
    try {
      const res = await api.admin.getPushSubs();
      if (res && res.subs) setPushSubs(res.subs);
    } catch (err) {
      console.error('Failed to load push subscriptions', err);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await api.admin.createUser(newUser);
      if (res && res.success) {
        showToast('User created', 'success');
        setNewUser({ username: '', password: '', role: 'handler', displayName: '' });
        fetchUsers(); // Refresh users list after creation
      }
    } catch (err) {
      showToast('Failed to create user', 'error');
    }
  };

  const [users, setUsers] = useState([]);
  const [forms, setForms] = useState([]);

  const fetchUsers = async () => { /* ... */ }; // simplified for brevity in replace, keep existing

  const fetchForms = async () => {
    try {
      const res = await api.forms.list();
      if (res.success && res.forms) setForms(res.forms);
    } catch (err) {
      console.error("Failed to fetch forms");
    }
  };

  useEffect(() => {
    if (view === 'users') fetchUsers();
    if (view === 'forms') fetchForms();
  }, [view]);

  // Main Polling - Reduced to 2s
  useEffect(() => {
    fetchTokens();
    const interval = setInterval(fetchTokens, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      {/* ... header ... */}
      <header className={styles.header}>
        <div className={styles.logoGroup}>
             <h1>Queue Management</h1>
             <div className={styles.counterConfig}>
                <label>My Counter:</label>
                <select value={counterName} onChange={(e) => setCounterName(e.target.value)} className={styles.counterSelect}>
                    <option value="Counter 1">Counter 1</option>
                    <option value="Counter 2">Counter 2</option>
                    <option value="Counter 3">Counter 3</option>
                    <option value="Counter 4">Counter 4</option>
                    <option value="Reception">Reception</option>
                </select>
             </div>
        </div>
        
        <button onClick={() => {
          localStorage.removeItem('authToken');
          window.location.href = '/admin';
        }}>Logout</button>
      </header>

      <main className={styles.main}>
        {loading ? (
          <div className={styles.loader}>Loading Data...</div>
        ) : (
            <div className={styles.dashboardGrid}>
              <aside className={styles.sidebar}>
                <div className={styles.sideBrand}>
                  <h2>QMS Admin</h2>
                </div>
                <nav className={styles.nav}>
                  <button className={`${styles.navBtn} ${view === 'dashboard' ? styles.navBtnActive : ''} `} onClick={() => setView('dashboard')}>Dashboard</button>
                  <button className={`${styles.navBtn} ${view === 'tokens' ? styles.navBtnActive : ''} `} onClick={() => setView('tokens')}>Tokens</button>
                  <button className={`${styles.navBtn} ${view === 'users' ? styles.navBtnActive : ''}`} onClick={() => setView('users')}>Users</button> {/* Added Users Tab */}
                  <button className={`${styles.navBtn} ${view === 'forms' ? styles.navBtnActive : ''}`} onClick={() => setView('forms')}>Form Builder</button>
                  <button className={`${styles.navBtn} ${view === 'settings' ? styles.navBtnActive : ''}`} onClick={() => { setView('settings'); fetchPushSubs(); }}>Settings</button>
                </nav>
                <div className={styles.sideFooter}>
                  <small>Signed in as Admin</small>
                </div>
              </aside>

              <section className={styles.content}>
                {(view === 'dashboard' || view === 'tokens') && (
                  <div className={styles.topRow}>
                    <div className={styles.statsRow}>
                      <div className={styles.statCard}>
                        <div className={styles.statLabel}>Total</div>
                        <div className={styles.statValue}>{stats.total}</div>
                      </div>
                      <div className={styles.statCard}>
                        <div className={styles.statLabel}>Pending</div>
                        <div className={styles.statValue}>{stats.pending}</div>
                      </div>
                      <div className={styles.statCard}>
                        <div className={styles.statLabel}>Called</div>
                        <div className={styles.statValue}>{stats.called}</div>
                      </div>
                      <div className={styles.statCard}>
                        <div className={styles.statLabel}>Served</div>
                        <div className={styles.statValue}>{stats.served}</div>
                      </div>
                    </div>

                    <div className={styles.controlsRow}>
                      <input type="text" placeholder="Search name or number" value={query} onChange={e => setQuery(e.target.value)} className={styles.searchInput} />
                      <button onClick={handleCallNext} className={styles.nextBtn}>📢 Call Next</button>
                    </div>
                  </div>
                )}

                {/* Conditional content per view */}
                {view === 'dashboard' && (
                  <div className={styles.menuGrid}>
                    <div className={styles.menuCard} onClick={() => setView('tokens')}>
                      <div className={styles.menuIcon}>📋</div>
                      <div className={styles.menuTitle}>Live Queue</div>
                      <div className={styles.menuDesc}>Monitor and manage active tokens</div>
                    </div>

                    <div className={styles.menuCard} onClick={() => setView('forms')}>
                      <div className={styles.menuIcon}>✨</div>
                      <div className={styles.menuTitle}>Form Builder</div>
                      <div className={styles.menuDesc}>Create & edit booking forms</div>
                    </div>

                    <div className={styles.menuCard} onClick={() => setView('users')}>
                      <div className={styles.menuIcon}>👥</div>
                      <div className={styles.menuTitle}>User Manager</div>
                      <div className={styles.menuDesc}>Manage system admins & handlers</div>
                    </div>

                    <div className={styles.menuCard} onClick={() => window.open('/display', '_blank')}>
                      <div className={styles.menuIcon}>🖥️</div>
                      <div className={styles.menuTitle}>Display Screen</div>
                      <div className={styles.menuDesc}>Launch the public display screen Active</div>
                    </div>

                    <div className={styles.menuCard} onClick={() => window.open('/book', '_blank')}>
                      <div className={styles.menuIcon}>📱</div>
                      <div className={styles.menuTitle}>Booking Page</div>
                      <div className={styles.menuDesc}>Open the public booking interface</div>
                    </div>

                    <div className={styles.menuCard} onClick={() => setView('settings')}>
                      <div className={styles.menuIcon}>⚙️</div>
                      <div className={styles.menuTitle}>System Settings</div>
                      <div className={styles.menuDesc}>Configure counters & subscriptions</div>
                    </div>
                  </div>
                )}

                {view === 'tokens' && (
                  <div className={styles.tableWrap}>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th style={{ width: '30%' }}>Details</th>
                          <th>Counter</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTokens.map(token => {
                          const status = (token.Status || '').toLowerCase();
                          let extraData = null;
                          try { extraData = token.Extra ? JSON.parse(token.Extra) : null; } catch (e) { }

                          return (
                            <tr key={token.TokenGuid} className={styles.row}>
                              <td>{token.TokenNumber}</td>
                              <td>{token.FullName}</td>
                              <td>
                                <div>{token.Purpose}</div>
                                {extraData && (
                                  <div style={{ fontSize: '0.8em', color: '#666', marginTop: 4 }}>
                                    {Object.entries(extraData).map(([k, v]) => (
                                      <div key={k}><b>{k}:</b> {typeof v === 'object' ? JSON.stringify(v) : v}</div>
                                    ))}
                                  </div>
                                )}
                              </td>
                              <td>{token.CounterName || '-'}</td>
                              <td className={styles.statusCell}>{token.Status}</td>
                              <td>
                                {status === 'pending' && <button onClick={() => handleStatusUpdate(token.TokenGuid, 'called')} className={styles.smallBtn}>Call</button>}
                                {status === 'called' && (
                                  <>
                                    <button onClick={() => handleStatusUpdate(token.TokenGuid, 'served')} className={styles.smallBtn}>Serve</button>
                                    <button onClick={() => handleStatusUpdate(token.TokenGuid, 'noshow')} className={styles.smallBtnDanger}>No Show</button>
                                  </>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                        {filteredTokens.length === 0 && <tr><td colSpan="6" style={{ textAlign: 'center', padding: 20 }}>No tokens found</td></tr>}
                      </tbody>
                    </table>
                  </div>
                )}

                {view === 'users' && (
                  <div className={styles.tableWrap}>
                    <h3>System Users</h3>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Username</th>
                          <th>Role</th>
                          <th>Display Name</th>
                          <th>Active</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.UserId} className={styles.row}>
                            <td>{u.UserId}</td>
                            <td>{u.Username}</td>
                            <td>{u.Role}</td>
                            <td>{u.DisplayName || '-'}</td>
                            <td>{u.IsActive ? 'Yes' : 'No'}</td>
                          </tr>
                        ))}
                        {users.length === 0 && <tr><td colSpan="5" style={{ textAlign: 'center', padding: 20 }}>No users found</td></tr>}
                      </tbody>
                    </table>
                  </div>
                )}

                {view === 'forms' && (
                  <div className={styles.tableWrap}>
                    <h3>Form Management</h3>
                    <div style={{ marginBottom: 16 }}>
                      <button onClick={() => window.location.href = '/admin/forms'} className={styles.addBtn}>+ Create New Form</button>
                    </div>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Status</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {forms.map(f => (
                          <tr key={f.FormId} className={styles.row}>
                            <td>{f.Title}</td>
                            <td>{f.IsActive ? 'Active' : 'Inactive'}</td>
                            <td>{new Date(f.CreatedAt).toLocaleDateString()}</td>
                            <td>
                              <button onClick={() => window.location.href = `/admin/forms/${f.FormId}`} className={styles.smallBtn} title="Edit"><FaEdit /> Edit</button>
                              <button
                                onClick={() => {
                                  const url = `${window.location.origin}/book/form/${f.FormId}`;
                                  navigator.clipboard.writeText(url);
                                  showToast('Link Copied: ' + url, 'success');
                                }}
                                className={styles.smallBtn}
                                style={{ marginLeft: 8, background: '#64748b' }}
                                title="Copy Link"
                              >
                                <FaLink /> Link
                              </button>
                              <button
                                onClick={() => window.open(`/book/form/${f.FormId}`, '_blank')}
                                className={styles.smallBtn}
                                style={{ marginLeft: 8, background: 'transparent', color: '#3b82f6', border: '1px solid #3b82f6' }}
                                title="View"
                              >
                                <FaEye /> View
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteModal({
                                    isOpen: true,
                                    formId: f.FormId,
                                    title: f.Title
                                  });
                                }}
                                className={styles.smallBtnDanger}
                                style={{ marginLeft: 8 }}
                                title="Delete"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {forms.length === 0 && <tr><td colSpan="4" style={{ textAlign: 'center', padding: 20 }}>No forms created yet</td></tr>}
                      </tbody>
                    </table>
                  </div>
                )}

                {view === 'settings' && (
                  <div className={styles.tableWrap}>
                    <h3>Admin Settings</h3>
                    <form className={styles.settingsForm} onSubmit={handleCreateUser}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input placeholder="Username" value={newUser.username} onChange={e => setNewUser({ ...newUser, username: e.target.value })} />
                        <input placeholder="Display Name" value={newUser.displayName} onChange={e => setNewUser({ ...newUser, displayName: e.target.value })} />
                        <input placeholder="Password" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} />
                        <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                          <option value="handler">Handler</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button type="submit" className={styles.smallBtn}>Create</button>
                      </div>
                    </form>

                    <div style={{ marginTop: 16 }}>
                      <h4>Push Subscriptions</h4>
                      <button onClick={fetchPushSubs} className={styles.smallBtn}>Refresh</button>
                      <div style={{ marginTop: 12 }}>
                        {pushSubs.length === 0 ? <div style={{ color: '#666' }}>No subscriptions</div> : (
                          <ul>
                            {pushSubs.map(s => <li key={s.Id || s.SubscriptionId}>{s.Endpoint || s.SubscriptionEndpoint || JSON.stringify(s)}</li>)}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
        )}
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Form"
        message={`Are you sure you want to delete "${deleteModal.title}"? This action cannot be undone.`}
        confirmText="Delete Form"
        confirmColor="danger"
        onCancel={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={async () => {
          try {
            await api.forms.delete(deleteModal.formId);
            showToast('Form deleted successfully', 'success');
            fetchForms();
          } catch (err) {
            showToast('Failed to delete form', 'error');
          } finally {
            setDeleteModal({ ...deleteModal, isOpen: false });
          }
        }}
      />
    </div>
  );
};

export default AdminDashboard;
