import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../AuthContext';

const blankPet = { name: '', species: 'Dog', breed: '', age: 1, gender: 'Female', description: '', imageUrl: '', status: 'AVAILABLE' };

export default function ShelterPage() {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState(blankPet);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const [petPage, adoptionRows] = await Promise.all([api('/pets?page=0&size=50&sortBy=createdAt&direction=desc'), api('/adoptions')]);
      setPets(petPage.content || []);
      setRequests(adoptionRows || []);
    } catch (e) { setError(e.message); }
  }
  useEffect(() => { load(); }, []);

  function startEdit(pet) {
    setEditingId(pet.id);
    setForm({ name: pet.name, species: pet.species, breed: pet.breed || '', age: pet.age, gender: pet.gender, description: pet.description || '', imageUrl: pet.imageUrl || '', status: pet.status });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function resetForm() { setEditingId(null); setForm(blankPet); }

  async function savePet(event) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    try {
      await api(editingId ? `/pets/${editingId}` : '/pets', {
        method: editingId ? 'PUT' : 'POST', body: JSON.stringify({ ...form, age: Number(form.age) })
      });
      setNotice(editingId ? 'Pet details updated.' : 'Pet added successfully.');
      resetForm(); await load();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  async function deletePet(pet) {
    if (!window.confirm(`Delete ${pet.name}? This cannot be undone.`)) return;
    try { await api(`/pets/${pet.id}`, { method: 'DELETE' }); setNotice(`${pet.name} was deleted.`); await load(); }
    catch (e) { setError(e.message); }
  }

  async function reviewRequest(requestId, status) {
    try {
      await api(`/adoptions/${requestId}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
      setNotice(`Request ${status.toLowerCase()}.`); await load();
    } catch (e) { setError(e.message); }
  }

  return <main className="dashboard-page">
    <span className="eyebrow">SHELTER WORKSPACE</span><h1>Good work, {user.name.split(' ')[0]}.</h1><p className="page-lead">Help every animal find a safe place to call home.</p>
    {error && <div className="alert alert-error">{error}</div>}{notice && <div className="alert alert-success">{notice}</div>}
    <section className="dashboard-panel">
      <div className="panel-heading"><div><span className="eyebrow">{editingId ? 'UPDATE LISTING' : 'NEW LISTING'}</span><h2>{editingId ? 'Edit a pet' : 'Add a pet'}</h2></div></div>
      <form className="pet-form" onSubmit={savePet}>
        <label>Pet name<input required maxLength="80" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
        <label>Species<select value={form.species} onChange={e => setForm({ ...form, species: e.target.value })}><option>Dog</option><option>Cat</option><option>Rabbit</option><option>Bird</option><option>Other</option></select></label>
        <label>Breed<input maxLength="80" value={form.breed} onChange={e => setForm({ ...form, breed: e.target.value })} /></label>
        <label>Age (years)<input type="number" min="0" max="60" required value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} /></label>
        <label>Gender<select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}><option>Female</option><option>Male</option><option>Unknown</option></select></label>
        <label>Image URL (optional)<input type="url" maxLength="500" value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." /></label>
        <label className="form-full">Description<textarea rows="3" maxLength="1200" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
        <div className="form-actions form-full"><button className="button button-primary" disabled={busy}>{busy ? 'Saving…' : editingId ? 'Save changes' : 'Add pet'}</button>{editingId && <button type="button" className="button button-quiet" onClick={resetForm}>Cancel edit</button>}</div>
      </form>
    </section>
    <section className="dashboard-panel">
      <div className="panel-heading"><div><span className="eyebrow">YOUR CATALOGUE</span><h2>Pet listings <span className="count-badge">{pets.length}</span></h2></div></div>
      <div className="table-wrap"><table><thead><tr><th>Pet</th><th>Species</th><th>Status</th><th>Actions</th></tr></thead><tbody>{pets.filter(p => user.role === 'ADMIN' || p.shelterId === user.id).map(p => <tr key={p.id}><td><strong>{p.name}</strong><small>{p.breed || 'Breed not listed'}</small></td><td>{p.species}</td><td><span className="status-tag">{p.status.replaceAll('_', ' ')}</span></td><td><div className="table-actions"><button className="text-button" onClick={() => startEdit(p)}>Edit</button><button className="text-button danger-text" onClick={() => deletePet(p)}>Delete</button></div></td></tr>)}</tbody></table></div>
    </section>
    <section className="dashboard-panel">
      <div className="panel-heading"><div><span className="eyebrow">HELP THEM FIND HOME</span><h2>Adoption requests <span className="count-badge">{requests.length}</span></h2></div></div>
      {!requests.length ? <p className="muted-copy">No adoption requests yet.</p> : <div className="table-wrap"><table><thead><tr><th>Pet</th><th>Adopter</th><th>Message</th><th>Status</th><th>Review</th></tr></thead><tbody>{requests.map(r => <tr key={r.id}><td><strong>{r.petName}</strong></td><td>{r.adopterName}<small>{r.adopterEmail}</small></td><td>{r.message || '—'}</td><td><span className={`status-tag status-${r.status.toLowerCase()}`}>{r.status}</span></td><td>{r.status === 'PENDING' ? <div className="table-actions"><button className="text-button" onClick={() => reviewRequest(r.id, 'APPROVED')}>Approve</button><button className="text-button danger-text" onClick={() => reviewRequest(r.id, 'REJECTED')}>Reject</button></div> : 'Reviewed'}</td></tr>)}</tbody></table></div>}
    </section>
  </main>;
}
