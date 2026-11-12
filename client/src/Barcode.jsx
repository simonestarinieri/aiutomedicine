import { useRef, useState } from 'react';
import bwipjs from '@bwip-js/browser';

export default function Barcode({ code, name }) {
  const shellRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);

  const draw = (canvas) => {
    if (!canvas) return;
    try {
      bwipjs.toCanvas(canvas, {
        bcid: 'code32',
        text: code,
        scale: 3,
        height: 9,
        includetext: true,
        textxalign: 'center',
        textsize: 9,
        paddingwidth: 0,
        paddingheight: 0,
      });
      setFailed(false);
    } catch (error) {
      console.error(error);
      setFailed(true);
    }
  };

  const toggleFullscreen = () => {
    const shell = shellRef.current;
    if (!shell) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
      return;
    }
    const request = shell.requestFullscreen?.();
    if (request?.catch) request.catch(() => {});
  };

  return (
    <div className={`barcode${open ? ' barcode--open' : ''}`} ref={shellRef}>
      <button
        type="button"
        className="barcode__toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        {open ? 'Nascondi codice' : 'Mostra codice'}
      </button>
      {failed ? (
        <p className="barcode__fallback">{code}</p>
      ) : (
        <button
          type="button"
          className="barcode__button"
          onClick={toggleFullscreen}
          aria-label={`Codice a barre ${code} di ${name}. Tocca per lo schermo intero.`}
        >
          <canvas className="barcode__canvas" ref={draw} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
