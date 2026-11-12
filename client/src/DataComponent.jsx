import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import MedicineCard from './components/MedicineCard';
import EditMedicineDialog from './components/EditMedicineDialog';
import { compareMedicines } from './utils/medicine';

const baseUrl =
  process.env.REACT_APP_API_URL ||
  (() => {
    const url = new URL(document.location.origin);
    url.port = 8080;
    return url.origin;
  })();

const PATIENTS = [
  { id: 'all', label: 'Tutti' },
  { id: 'alberto', label: 'Alberto', field: 'alberto' },
  { id: 'dina', label: 'Dina', field: 'dina' },
];

function normalize(medicine) {
  return { ...medicine, quantità: Number(medicine.quantità) || 0 };
}

export default function DataComponent() {
  const [medicines, setMedicines] = useState([]);
  const [status, setStatus] = useState('loading');
  const [activePatient, setActivePatient] = useState('all');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const { data } = await axios.get(`${baseUrl}/api/medicine`);
      setMedicines(Array.isArray(data) ? data.map(normalize) : []);
      setStatus('ready');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const result = { all: medicines.length };
    for (const patient of PATIENTS) {
      if (patient.field) {
        result[patient.id] = medicines.filter((item) => item[patient.field] === 1).length;
      }
    }
    return result;
  }, [medicines]);

  const visibleMedicines = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return medicines
      .filter((item) => {
        const patient = PATIENTS.find((entry) => entry.id === activePatient);
        if (patient?.field) return item[patient.field] === 1;
        return true;
      })
      .filter((item) => {
        if (!needle) return true;
        return [item.nome, item.nome_alternativo, item.codice].some((value) =>
          String(value ?? '').toLowerCase().includes(needle)
        );
      })
      .sort(compareMedicines);
  }, [medicines, activePatient, query]);

  const handleSave = async (id, amount) => {
    await axios.post(`${baseUrl}/api/edit`, { id, amount });
    setMedicines((current) =>
      current.map((item) => (item.id === id ? { ...item, quantità: amount } : item))
    );
  };

  const handleTabKeyDown = (event, index) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
    event.preventDefault();
    const offset = event.key === 'ArrowRight' ? 1 : -1;
    const next = (index + offset + PATIENTS.length) % PATIENTS.length;
    setActivePatient(PATIENTS[next].id);
    document.getElementById(`patient-tab-${PATIENTS[next].id}`)?.focus();
  };

  return (
    <>
      <div className="toolbar">
        <div className="tabs" role="tablist" aria-label="Filtra per persona">
          {PATIENTS.map((patient, index) => (
            <button
              key={patient.id}
              type="button"
              id={`patient-tab-${patient.id}`}
              role="tab"
              className={`tab${activePatient === patient.id ? ' tab--active' : ''}`}
              aria-selected={activePatient === patient.id}
              tabIndex={activePatient === patient.id ? 0 : -1}
              onClick={() => setActivePatient(patient.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              {patient.label}
              <span className="tab__count">{counts[patient.id] ?? 0}</span>
            </button>
          ))}
        </div>

        <div className="search">
          <label className="visually-hidden" htmlFor="medicine-search">
            Cerca farmaco
          </label>
          <input
            id="medicine-search"
            className="search__input"
            type="search"
            placeholder="Cerca per nome o codice"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div
        className="panel"
        role="tabpanel"
        id="medicine-panel"
        aria-labelledby={`patient-tab-${activePatient}`}
      >
        <p className="visually-hidden" role="status">
          {status === 'ready' ? `${visibleMedicines.length} farmaci` : ''}
        </p>
        {status === 'loading' && (
          <ul className="medicine-list" aria-busy="true" aria-label="Caricamento farmaci">
            {[0, 1, 2].map((item) => (
              <li key={item} className="skeleton-card" />
            ))}
          </ul>
        )}

        {status === 'error' && (
          <div className="state state--error">
            <p className="state__title">Impossibile caricare i farmaci.</p>
            <p className="state__text">Controlla la connessione al server e riprova.</p>
            <button type="button" className="button button--primary" onClick={load}>
              Riprova
            </button>
          </div>
        )}

        {status === 'ready' && visibleMedicines.length === 0 && (
          <div className="state">
            <p className="state__title">Nessun farmaco trovato.</p>
            <p className="state__text">Modifica la ricerca o seleziona un&apos;altra persona.</p>
          </div>
        )}

        {status === 'ready' && visibleMedicines.length > 0 && (
          <ul className="medicine-list">
            {visibleMedicines.map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} onEdit={setEditing} />
            ))}
          </ul>
        )}
      </div>

      <EditMedicineDialog
        medicine={editing}
        onClose={() => setEditing(null)}
        onSave={handleSave}
      />
    </>
  );
}
