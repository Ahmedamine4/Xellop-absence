import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Cards.css"
import CustomSelect from './Congeoptions';

function Nouvelledemande({ userid, setLeaveRequests, setShowForm, showForm }) {

      const [typeConge, setTypeConge] = useState('');
      const [dateDebut, setDateDebut] = useState('');
      const [dateFin, setDateFin] = useState('');
const SetBrouillon = async () => {
  if (!userid) {
    alert('Utilisateur non identifié');
    return;
  }
  try {
    await axios.post('http://localhost:5000/api/leaves', {
      employee_id: userid,
      start_date: dateDebut,
      end_date: dateFin,
      type: typeConge,
      status: 'Brouillon'
    });

    const response = await axios.get(`http://localhost:5000/api/leaves/${userid}`);
    setLeaveRequests(response.data);

    alert('Brouillon enregistré !');
    setTypeConge('');
    setDateDebut('');
    setDateFin('');
    setShowForm(false);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du brouillon :", error);
    alert("Erreur lors de l'enregistrement du brouillon");
  }
};

      const handleSubmit = async (e) => { //quand l'utilisateur soumet le formulaire de demande de congé.
    e.preventDefault();
    if (!userid) {
      alert('Utilisateur non identifié');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/leaves', {
        employee_id: userid,
        start_date: dateDebut,
        end_date: dateFin,
        type: typeConge
      });

      const response = await axios.get(`http://localhost:5000/api/leaves/${userid}`);
      setLeaveRequests(response.data);

      alert('Demande soumise !');
      setTypeConge('');
      setDateDebut('');
      setDateFin('');
      setShowForm(false);
    } catch (error) {
      console.error('Erreur lors de la soumission :', error);
      alert('Erreur lors de la soumission');
    }
  };

      if (!showForm) return null;

      return (
        <div className='formpage'>
      {showForm && (
        <div className="absence-request-form">
          <h2>Demande d'Absence</h2>
          <form className='form-choix' onSubmit={handleSubmit}>
            
            <div className="choix">
              <label>Date de début&nbsp;</label>
              <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)} required />
            </div>
            <div className="choix">
              <label>Date de fin&nbsp;</label>
              <input type="date" value={dateFin} onChange={e => setDateFin(e.target.value)} required />
            </div >
            <div className="choix">
              <label>Type de congé&nbsp;</label>
              <CustomSelect value={typeConge} onChange={setTypeConge} required />
            </div>
            <div className='bouttonsform'>
            <button className="annulerdemande" onClick={() => setShowForm(false)}>Annuler</button>
            <button 
              className="brouillondemande" 
              type="button"
              onClick={SetBrouillon}
            >
              Enregistrer comme brouillon
            </button>
            <button 
              className="enregistrerdemande" 
              type="submit"
              > 
              Soumettre la demande
            </button>
            </div>
          </form>
        </div>
      )}
      </div>
      )
}
export default Nouvelledemande