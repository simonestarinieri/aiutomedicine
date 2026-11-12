import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { parseInstruction, stockOf } from '../utils/medicine';

export default function EditMedicineDialog({ medicine, onClose, onSave }) {
  const dialogRef = useRef(null);
  const [value, setValue] = useState('0');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  // Expanded form state for all medicine fields
  const [nome, setNome] = useState('');
  const [nomeAlternativo, setNomeAlternativo] = useState('');
  const [quantita, setQuantita] = useState('0');
  const [codice, setCodice] = useState('');
  const [schedule, setSchedule] = useState('');
  const [task, setTask] = useState('1');
  const [alberto, setAlberto] = useState(false);
  const [dina, setDina] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (medicine) {
      // Check if we are adding a new medicine (_new flag) or editing existing
      if (!medicine._new) {
        // Pre-fill form from medicine record
        setNome(medicine.nome ?? '');
        setNomeAlternativo(medicine.nome_alternativo ?? '');
        setQuantita(String(stockOf(medicine)));
        setCodice(medicine.codice ?? '');
        // Parse istruzione JSON into schedule + task
        const config = parseInstruction(medicine.istruzione);
        if (config) {
          setSchedule(config.schedule ?? '');
          setTask(String(config.task ?? '1'));
        } else {
          setSchedule('');
          setTask('1');
        }
        setAlberto(Boolean(medicine.alberto));
        setDina(Boolean(medicine.dina));
      } else {
        // Add mode: reset all fields
        setNome('');
        setNomeAlternativo('');
        setQuantita('0');
        setCodice('');
        setSchedule('0 8 * * *');
        setTask('1');
        setAlberto(false);
        setDina(false);
      }
      if (!dialog.open) dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  }, [medicine]);

  const requestClose = () => {
    if (!pending) onClose();
  };

  const adjust = (delta) => {
    const next = Math.max(0, (Number.parseInt(value, 10) || 0) + delta);
    setValue(String(next));
    // Also keep quantita in sync for the quantity field
    setQuantita(String(next));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const amount = Number.parseInt(value, 10);
    if (!Number.isInteger(amount) || amount < 0) {
      setError('Inserisci un numero intero maggiore o uguale a 0.');
      return;
    }

    setPending(true);
    setError(null);
    try {
      const payload = {
        nome: nome.trim() || undefined,
        nome_alternativo: nomeAlternativo.trim() || undefined,
        quantità: amount,
        codice: codice.trim() || undefined,
        istruzione: JSON.stringify({
          name: nome.trim() || 'farmaco',
          schedule: schedule.trim() || '0 0 * * *',
          task: Number.parseInt(task, 10) || 1,
        }),
        alberto: alberto ? 1 : 0,
        dina: dina ? 1 : 0,
        ...(medicine._new ? { _new: true } : { id: medicine.id }),
      };
      await onSave(payload);
      onClose();
    } catch (saveError) {
      console.error(saveError);
      setError('Aggiornamento non riuscito. Riprova.');
      setPending(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      className="dialog"
      onCancel={(event) => {
        event.preventDefault();
        requestClose();
      }}
      onClose={() => {
        if (medicine) onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current) requestClose();
      }}
    >
      <form className="dialog__form" onSubmit={handleSubmit}>
        <h2 className="dialog__title">
          {medicine?._new ? 'Nuovo farmaco' : medicine?.nome ?? ''}
          {medicine && !medicine._new ? ' (modifica)' : medicine?._new ? '' : ''}</h2>
        {medicine?.nome_alternativo && !medicine._new && (
          <p className="dialog__hint">{medicine.nome_alternativo}</p>
        )}

        {/* Nome */}
        <label className="dialog__label" htmlFor="medicine-nome">
          Nome
        </label>
        <input
          id="medicine-nome"
          className="dialog__input"
          type="text"
          value={nome}
          onChange={(event) => setNome(event.target.value)}
          required
        />

        {/* Nome alternativo */}
        <label className="dialog__label" htmlFor="medicine-nome-alternativo">
          Nome alternativo
        </label>
        <input
          id="medicine-nome-alternativo"
          className="dialog__input"
          type="text"
          value={nomeAlternativo}
          onChange={(event) => setNomeAlternativo(event.target.value)}
        />

        {/* Quantità (stepper synchronised with value) */}
        <label className="dialog__label" htmlFor="medicine-amount">
          Quantità
        </label>
        <div className="stepper">
          <button
            type="button"
            className="stepper__button"
            onClick={() => adjust(-1)}
            disabled={pending}
            aria-label="Diminuisci di uno"
          >
            −
          </button>
          <input
            id="medicine-amount"
            className="stepper__input"
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            disabled={pending}
          />
          <button
            type="button"
            className="stepper__button"
            onClick={() => adjust(1)}
            disabled={pending}
            aria-label="Aumenta di uno"
          >
            +
          </button>
        </div>

        {/* Codice */}
        <label className="dialog__label" htmlFor="medicine-codice">
          Codice
        </label>
        <input
          id="medicine-codice"
          className="dialog__input"
          type="text"
          value={codice}
          onChange={(event) => setCodice(event.target.value)}
        />

        {/* Istruzione: schedule e task */}
        <label className="dialog__label" htmlFor="medicine-schedule">
          Istruzione oraria
        </label>
        <input
          id="medicine-schedule"
          className="dialog__input"
          type="text"
          value={schedule}
          onChange={(event) => setSchedule(event.target.value)}
          placeholder="es. 0 8 * * * (ogni giorno alle 8)"
        />

        <label className="dialog__label" htmlFor="medicine-task">
          Task
        </label>
        <input
          id="medicine-task"
          className="dialog__input"
          type="number"
          min="1"
          value={task}
          onChange={(event) => setTask(event.target.value)}
          placeholder="es. 1"
        />

        {/* Patient assignment: Alberto / Dina */}
        <label className="dialog__label">
          Alberto
        </label>
        <input
          type="checkbox"
          checked={alberto}
          onChange={() => setAlberto(!alberto)}
        />

        <label className="dialog__label">
          Dina
        </label>
        <input
          type="checkbox"
          checked={dina}
          onChange={() => setDina(!dina)}
        />

        {error && (
          <p className="dialog__error" role="alert">
            {error}
          </p>
        )}

        <div className="dialog__actions">
          <button
            type="button"
            className="button button--ghost"
            onClick={requestClose}
            disabled={pending}
          >
            Annulla
          </button>
          <button type="submit" className="button button--primary" disabled={pending}>
            {pending ? 'Salvataggio…' : 'Salva'}
          </button>
        </div>
      </form>
    </dialog>
  );
}