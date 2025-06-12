
import "./Styles.css"
import Demandecard from "../Components/DemandesCard"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PageEmploye() {

  const firstName = localStorage.getItem('first_name');
  const lastName = localStorage.getItem('last_name');
  const jour_res = localStorage.getItem('Jour_restant');
  const role = localStorage.getItem('role');
  const id_manager = localStorage.getItem('manager_id');
  const userid = localStorage.getItem('employee_id'); 

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [typeConge, setTypeConge] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (userid) {
      axios.get(`http://localhost:5000/api/leaves/${userid}`)
        .then(response => setLeaveRequests(response.data))
        .catch(error => console.error('Erreur de chargement des congés :', error));
    }
  }, [userid]);

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

  

  return (
    <div className="employee-dashboard">
      <div className="employee-info">
        <div className="inner">
          <h1>{firstName} {lastName}</h1>
          <div className="description">
            <p>Rôle: {role}</p>
            <p>Manager ID: {id_manager}</p>
          </div>
        </div>
      </div>
      <div className="leave-requests">
        <h2>Historique des demandes de congé</h2>
        {leaveRequests.map(request => (
          <Demandecard  key={request.id} startDate={request.start_date} endDate={request.end_date} type={request.type} statut={request.status} />
        ))};

      </div>

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? "Fermer le formulaire" : "Faire une demande d'absence"}
      </button>

      {showForm && (
        <div className="absence-request-form">
          <h2>Faire une demande d'absence</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Type de congé&nbsp;:</label>
              <select value={typeConge} onChange={e => setTypeConge(e.target.value)} required>
                <option value="">--Choisir--</option>
                <option value="Congé payé">Congé payé</option>
                <option value="RTT">RTT</option>
                <option value="Congé sans solde">Congé sans solde</option>
              </select>
            </div>
            <div>
              <label>Date de début&nbsp;:</label>
              <input type="date" value={dateDebut} onChange={e => setDateDebut(e.target.value)} required />
            </div>
            <div>
              <label>Date de fin&nbsp;:</label>
              <input type="date" value={dateFin} onChange={e => setDateFin(e.target.value)} required />
            </div>
            <button type="submit">Soumettre la demande</button>
          </form>
        </div>
      )}
    </div>

  );
}

export default PageEmploye;

