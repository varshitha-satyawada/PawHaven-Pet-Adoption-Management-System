export default function PetCard({ pet, onAdopt, canAdopt }) {
  const emoji = ({ Dog: '🐶', Cat: '🐱', Rabbit: '🐰', Bird: '🐦', Other: '🐾' })[pet.species] || '🐾';
  return (
    <article className="pet-card">
      <div className="pet-art">
        {pet.imageUrl ? <img src={pet.imageUrl} alt={pet.name} /> : <span>{emoji}</span>}
        <span className={`status-tag ${pet.status !== 'AVAILABLE' ? 'status-muted' : ''}`}>
          {pet.status.replaceAll('_', ' ')}
        </span>
      </div>
      <div className="pet-card-body">
        <div className="pet-title-row"><h3>{pet.name}</h3><span className="pet-age">{pet.age} {pet.age === 1 ? 'year' : 'years'}</span></div>
        <p className="pet-meta">{pet.breed || pet.species} · {pet.gender}</p>
        <p className="pet-description">{pet.description || 'A lovely companion waiting for a home.'}</p>
        <div className="pet-card-footer">
          <span className="shelter-name">♡ {pet.shelterName}</span>
          {canAdopt && pet.status === 'AVAILABLE' && <button className="button button-primary" onClick={() => onAdopt(pet)}>Meet {pet.name}</button>}
        </div>
      </div>
    </article>
  );
}
