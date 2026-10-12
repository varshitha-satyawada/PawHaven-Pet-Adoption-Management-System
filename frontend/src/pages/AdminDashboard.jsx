import { useEffect, useState } from "react";
import { api } from "../api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await api("/admin/dashboard");
        setStats(data);
      } catch (err) {
        setError(err.message || "Unable to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return <main className="admin-dashboard">Loading dashboard...</main>;
  }

  if (error) {
    return (
      <main className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        <p role="alert">{error}</p>
      </main>
    );
  }

  const cards = [
    { label: "Total Users", value: stats.totalUsers },
    { label: "Adopters", value: stats.totalAdopters },
    { label: "Shelters", value: stats.totalShelters },
    { label: "Total Pets", value: stats.totalPets },
    {
      label: "Adoption Requests",
      value: stats.totalAdoptionRequests,
    },
  ];

  return (
    <main className="admin-dashboard">
      <header className="admin-header">
        <div>
          <p className="admin-eyebrow">PAWHAVEN ADMINISTRATION</p>
          <h1>Admin Dashboard</h1>
          <p>Manage your pet adoption community.</p>
        </div>
      </header>

      <section className="admin-stats">
        {cards.map((card) => (
          <article className="admin-stat-card" key={card.label}>
            <p>{card.label}</p>
            <h2>{card.value}</h2>
          </article>
        ))}
      </section>

      <section className="admin-welcome">
        <h2>Welcome to PawHaven!</h2>
        <p>
          Monitor registered users, shelter accounts, pets,
          and adoption requests from one place.
        </p>
      </section>
    </main>
  );
}