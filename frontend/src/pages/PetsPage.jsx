import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../AuthContext';
import PetCard from '../components/PetCard';

export default function PetsPage() {
  const { user } = useAuth();
  const [pageData, setPageData] = useState({ content: [], number: 0, totalPages: 0, totalElements: 0 });
  const [page, setPage] = useState(0);
  const [species, setSpecies] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function loadPets() {
    setError('');
    try {
      const result = await api(`/pets?page=${page}&size=50&sortBy=${sortBy}&direction=desc`);
      setPageData(result);
    } catch (e) { setError(e.message); }
  }
  useEffect(() => { loadPets(); }, [page, sortBy]);

  const visiblePets = pageData.content.filter(p => species === 'All' || p.species.toLowerCase() === species.toLowerCase());

  async function submitAdoption(event) {
    event.preventDefault();
    setBusy(true); setError(''); setNotice('');
    try {
      await api('/adoptions', { method: 'POST', body: JSON.stringify({ petId: selectedPet.id, message }) });
      setNotice(`Your adoption request for ${selectedPet.name} was submitted.`);
      setSelectedPet(null); setMessage('');
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">A LITTLE LOVE CHANGES EVERYTHING</span>
          <h1>Find your <em>forever</em><br />friend.</h1>
          <p>Wonderful companions are waiting for a safe, loving home. Your next chapter together starts here.</p>
          <a className="button button-dark" href="#pets">Meet your match <span>↘</span></a>
          <div className="hero-note"><span className="avatar-stack">🐶 🐱 🐰</span><span><strong>Every pet deserves a home.</strong><br />Adopt kindness. Adopt a friend.</span></div>
        </div>
        <div className="hero-illustration">
          <div className="sun-shape"></div><div className="hero-emoji">🐕</div>
          <div className="floating-note note-one">♡ <span>Love lives here</span></div>
          <div className="floating-note note-two">✦ <span>Adopt, don't shop</span></div>
          <div className="hero-ground"></div>
        </div>
      </section>

      <section className="stats-strip">
        <div><strong>{pageData.totalElements ?? 0}</strong><span>friends to meet</span></div>
        <div><strong>100%</strong><span>love guaranteed</span></div>
        <div><strong>One</strong><span>beautiful new beginning</span></div>
      </section>

      <section className="pets-section" id="pets">
        <div className="section-heading">
          <div><span className="eyebrow">YOUR NEW BEST FRIEND</span><h2>Meet the <em>cuties</em></h2><p>Each one has a story. Maybe you're the happy ending.</p></div>
          <div className="filters">
            <label className="sr-only" htmlFor="species">Filter species</label>
            <select id="species" value={species} onChange={e => setSpecies(e.target.value)}>
              <option>All</option><option>Dog</option><option>Cat</option><option>Rabbit</option><option>Bird</option>
            </select>
            <label className="sr-only" htmlFor="sort">Sort pets</label>
            <select id="sort" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="createdAt">Newest</option><option value="name">Name</option><option value="age">Age</option>
            </select>
          </div>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        {notice && <div className="alert alert-success">{notice}</div>}
        {visiblePets.length ? <div className="pet-grid">{visiblePets.map(pet =>
          <PetCard key={pet.id} pet={pet} canAdopt={user?.role === 'ADOPTER'} onAdopt={setSelectedPet} />
        )}</div> : <div className="empty-state"><span>🐾</span><h3>No pets found just yet</h3><p>Try another filter, or check back soon.</p></div>}
        {pageData.totalPages > 1 && <div className="pagination"><button disabled={page <= 0} onClick={() => setPage(page - 1)}>← Previous</button><span>Page {page + 1} of {pageData.totalPages}</span><button disabled={page + 1 >= pageData.totalPages} onClick={() => setPage(page + 1)}>Next →</button></div>}
      </section>

      {selectedPet && <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setSelectedPet(null); }}>
        <form className="modal-card" onSubmit={submitAdoption}>
          <button type="button" className="modal-close" onClick={() => setSelectedPet(null)} aria-label="Close">×</button>
          <span className="eyebrow">MAKE IT OFFICIAL</span><h2>Meet {selectedPet.name}?</h2>
          <p>Tell the shelter a little about the home you can offer.</p>
          <label htmlFor="adoption-message">Your message <span className="optional">(optional)</span></label>
          <textarea id="adoption-message" rows="4" maxLength="1000" value={message} onChange={e => setMessage(e.target.value)} placeholder="Share why you'd be a great match..." />
          <button className="button button-primary button-wide" disabled={busy}>{busy ? 'Sending…' : 'Send adoption request'}</button>
        </form>
      </div>}
      {!user && <section className="join-banner"><div><span className="eyebrow">READY TO MEET YOUR MATCH?</span><h2>Your best friend is out there.</h2><p>Create a free adopter account to send a request to a shelter.</p></div><a className="button button-dark" href="/register">Create an account ↗</a></section>}
    </>
  );
}
