import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import Barcode from '../Barcode';
import { humanizeSchedule, severityOf, stockOf } from '../utils/medicine';

export default function MedicineCard({ medicine, onEdit }) {
  const quantity = stockOf(medicine);
  const severity = severityOf(medicine);
  const schedule = humanizeSchedule(medicine.istruzione);

  return (
    <li className={`card card--${severity.level}`}>
      <div className="card__head">
        <h2 className="card__name">{medicine.nome}</h2>
        {severity.level !== 'ok' && (
          <span className={`badge badge--${severity.level}`}>{severity.label}</span>
        )}
      </div>

      {medicine.nome_alternativo && (
        <p className="card__hint">{medicine.nome_alternativo}</p>
      )}

      {schedule && (
        <p className="card__schedule">
          <FontAwesomeIcon icon={faClock} aria-hidden="true" />
          <span>{schedule}</span>
        </p>
      )}

      {medicine.codice && <Barcode code={medicine.codice} name={medicine.nome} />}

      <div className="card__foot">
        <p className="stock">
          <span className="stock__label">Scorte</span>
          <span className="stock__value">{quantity}</span>
        </p>
        <button
          type="button"
          id={`edit-${medicine.id}`}
          className="icon-button"
          onClick={() => onEdit(medicine)}
          aria-label={`Modifica ${medicine.nome}`}
        >
          <FontAwesomeIcon icon={faPenToSquare} aria-hidden="true" />
        </button>
      </div>
    </li>
  );
}
