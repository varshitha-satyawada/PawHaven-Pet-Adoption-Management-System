import { useEffect, useState } from 'react';
import { api } from '../api';

export default function MyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => { api('/adoptions/my').then(setRequests).catch(e => setError(e.message)); }, []);
  return <main className="dashboard-page">
    <span className="eyebrow">YOUR ADOPTION JOURNEY</span><h1>My requests</h1><p className="page-lead">Keep track of the friends you're hoping to welcome home.</p>
    {error && <div className="alert alert-error">{error}</div>}
    {!requests.length && !error ? <div className="empty-state"><span>💌</span><h3>No requests yet</h3><p>When you request to meet a pet, it'll show up here.</p><a className="button button-primary" href="/">Browse pets</a></div> :
      <div className="table-wrap"><table><thead><tr><th>Pet</th><th>Message</th><th>Requested</th><th>Status</th></tr></thead><tbody>{requests.map(r => <tr key={r.id}><td><strong>{r.petName}</strong><small>Pet #{r.petId}</small></td><td>{r.message || '—'}</td><td>{new Date(r.requestedAt).toLocaleDateString()}</td><td><span className={`status-tag status-${r.status.toLowerCase()}`}>{r.status}</span></td></tr>)}</tbody></table></div>}
  </main>;
}
