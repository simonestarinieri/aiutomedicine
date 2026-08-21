import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Barcode from './Barcode';
const baseUrl = new URL(document.location.origin);
baseUrl.port = 8080;

export default function DataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(baseUrl.origin+'/api/medicine').then((data) => {
    //this console.log will be in our frontend console
    let medicines = data.data.map(med =>
      <li className='item' key={med.id}>
        <p className='medName'>{med.nome}</p>
        <Barcode exists={med.codice ? true : false} code={med.codice} />
        <div className='rightSide'>
          <p className='medAmount'>{med.quantità}</p>
          <form className='buttons' action="modificaMedicine" method="get">
            <input type='hidden' name="id" value={med.id}/>
            <button className='delButton' type="submit" name="action" value="elimina">x</button>
            <button className='editButton' type='submit' name='action' value='modifica'>edit</button>
          </form>
        </div>
      </li>
    );
    setData(medicines);
    setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []); // Empty array ensures this runs only on mount

  if (loading) return <div className='loader'>Loading...</div>;
  return (
  <ul className='list'>
    {data}
  </ul>
  );
}   