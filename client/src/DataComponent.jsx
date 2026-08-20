import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Barcode({exists,code}){
  console.log(exists,code);
  if(exists){
    return(<img src={"data:image/png;base64,"+code} alt="barcode"/>);
  }
  return null;
}
export default function DataComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8080/api/medicine').then((data) => {
    //this console.log will be in our frontend console
    let medicines = data.data.map(med =>
      <li key={med.id}>
        <p>{med.nome}</p>
        <p>{med.quantità}</p>
        <Barcode exists={med.codice ? true : false} code={med.codice} />
        <form action="modificaMedicine" method="get">
          <input type='hidden' name="id" value={med.id}/>
          <button type="submit" name="action" value="elimina">x</button>
          <button type='submit' name='action' value='modifica'>edit</button>
        </form>
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

  if (loading) return <div>Loading...</div>;
  return (
  <ul>
    {data}
  </ul>
  );
}   