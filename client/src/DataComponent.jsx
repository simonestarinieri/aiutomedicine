import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Barcode from './Barcode';
import Popup from 'reactjs-popup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPenToSquare} from '@fortawesome/free-solid-svg-icons';
const baseUrl = new URL(document.location.origin);
baseUrl.port = 8080;


function Form({quantità,id}){
  const handleSubmit = async (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    let qId = formData.get('id');
    let amount = formData.get('amount');
    try{
      const response = await axios.post(baseUrl.origin+'/api/edit',{'id':qId,'amount':amount})
      console.log(response);
    }catch(error){
      console.error('Error:',error);
    }
  }
  return (
    <form className="buttons" onSubmit={handleSubmit} method='post'>
      <input className='amountText' type='text' name='amount' defaultValue={quantità} placeholder={quantità}/>
      <input type='hidden' name="id" value={id}/>
      <button className="submitButton" type='submit'>Aggiorna</button>
    </form>
  )
}

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
          <Popup trigger={<button className='editButton'><FontAwesomeIcon icon={faPenToSquare} /></button>} modal nested>{
              close => (
              <div className='modal'>
                  <h1 className='medName'>{med.nome}</h1>
                  <Form quantità={med.quantità} id={med.id}/>
                </div>
            )}
            </Popup>
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