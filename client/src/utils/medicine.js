const DAYS = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

export function parseInstruction(istruzione) {
  if (!istruzione) return null;
  if (typeof istruzione === 'object') return istruzione;
  try {
    return JSON.parse(istruzione);
  } catch {
    return null;
  }
}

export function taskOf(medicine) {
  const config = parseInstruction(medicine?.istruzione);
  const task = Number(config?.task);
  return Number.isFinite(task) && task > 0 ? task : 1;
}

export function stockOf(medicine) {
  const quantity = Number(medicine?.['quantità']);
  return Number.isFinite(quantity) ? quantity : 0;
}

// Mirrors the backend rule: warn when quantity - task < 2.
export function severityOf(medicine) {
  const quantity = stockOf(medicine);
  if (quantity <= 0) return { level: 'out', label: 'Esaurito' };
  if (quantity <= taskOf(medicine) + 1) return { level: 'low', label: 'In esaurimento' };
  return { level: 'ok', label: '' };
}

const SEVERITY_RANK = { out: 0, low: 1, ok: 2 };

export function compareMedicines(a, b) {
  const rankA = SEVERITY_RANK[severityOf(a).level];
  const rankB = SEVERITY_RANK[severityOf(b).level];
  if (rankA !== rankB) return rankA - rankB;
  const quantityDiff = stockOf(a) - stockOf(b);
  if (quantityDiff !== 0) return quantityDiff;
  return String(a?.nome ?? '').localeCompare(String(b?.nome ?? ''), 'it');
}

export function humanizeSchedule(istruzione) {
  const config = parseInstruction(istruzione);
  if (!config?.schedule) return null;
  return humanizeCron(config.schedule);
}

export function humanizeCron(expression) {
  if (typeof expression !== 'string') return null;
  const parts = expression.trim().split(/\s+/);
  if (parts.length < 5) return expression;

  const [minute, hour, dayOfMonth, , dayOfWeek] = parts;
  if (/^\*\/\d+$/.test(minute)) {
    return hour === '*' ? `Ogni ${minute.slice(2)} minuti` : expression;
  }
  if (!/^\d{1,2}$/.test(minute)) return expression;

  const paddedMinute = minute.padStart(2, '0');
  const hours = describeHours(hour, paddedMinute);
  if (!hours) return expression;

  const days = describeDays(dayOfMonth, dayOfWeek);
  return days ? `${days} · ${hours}` : hours;
}

function describeHours(hour, paddedMinute) {
  if (hour === '*') {
    return paddedMinute === '00' ? 'Ogni ora' : `Ogni ora al minuto ${paddedMinute}`;
  }

  if (/^\*\/\d+$/.test(hour)) {
    return `Ogni ${hour.slice(2)} ore`;
  }

  const values = hour.split(',');
  const times = [];
  for (const value of values) {
    if (!/^\d{1,2}$/.test(value)) return null;
    const numeric = Number(value);
    if (numeric > 23) return null;
    times.push(`${String(numeric).padStart(2, '0')}:${paddedMinute}`);
  }
  return times.join(' · ');
}

function describeDays(dayOfMonth, dayOfWeek) {
  if (dayOfMonth === '*' && dayOfWeek === '*') return '';

  if (dayOfWeek !== '*') {
    const label = describeWeekdays(dayOfWeek);
    if (label) return label;
  }

  if (dayOfMonth !== '*') {
    if (/^\*\/\d+$/.test(dayOfMonth)) {
      return `Ogni ${dayOfMonth.slice(2)} giorni`;
    }
    if (/^\d{1,2}$/.test(dayOfMonth)) {
      return `Il giorno ${Number(dayOfMonth)}`;
    }
  }

  return '';
}

function describeWeekdays(dayOfWeek) {
  const range = dayOfWeek.split('-');
  if (range.length === 2) {
    const from = toDay(range[0]);
    const to = toDay(range[1]);
    if (from === null || to === null) return '';
    return `${DAYS[from]}–${DAYS[to]}`;
  }

  const labels = [];
  for (const value of dayOfWeek.split(',')) {
    const day = toDay(value);
    if (day === null) return '';
    labels.push(DAYS[day]);
  }
  return labels.join(', ');
}

function toDay(value) {
  if (!/^\d$/.test(value)) return null;
  const day = Number(value);
  if (day === 7) return 0;
  return day >= 0 && day <= 6 ? day : null;
}
