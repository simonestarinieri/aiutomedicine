import { useEffect, useRef, useState } from 'react';
import { stockOf } from '../utils/medicine';

export default function EditMedicineDialog({ medicine, onClose, onSave }) {
  const dialogRef = useRef(null);
  const [value, setValue] = useState('0');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (medicine) {
      setValue(String(stockOf(medicine)));
      setError(null);
      setPending(false);
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
      await onSave(medicine.id, amount);
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
        <h2 className="dialog__title">{medicine?.nome ?? ''}</h2>
        {medicine?.nome_alternativo && (
          <p className="dialog__hint">{medicine.nome_alternativo}</p>
        )}

        <label className="dialog__label" htmlFor="medicine-amount">
          Scorte attuali
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
