import "./Styles.css"
import Demandecard from "../Components/DemandesCard"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nouvelledemande from "../Components/Nouvelledemande";

function PageEmploye() {

  const firstName = localStorage.getItem('first_name');
  const lastName = localStorage.getItem('last_name');
  const jour_res = localStorage.getItem('Jour_restant');
  const role = localStorage.getItem('role');
  const id_manager = localStorage.getItem('manager_id');
  const userid = localStorage.getItem('employee_id'); 

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (userid) {
      axios.get(`http://localhost:5000/api/leaves/${userid}`)
        .then(response => setLeaveRequests(response.data))
        .catch(error => console.error('Erreur de chargement des congés :', error));
    }
  }, [userid]);

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
            <div >
                <button className='submitboutton' onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Fermer le formulaire" : "Faire une demande d'absence"}
                </button>
            </div>
            <Nouvelledemande setLeaveRequests={setLeaveRequests} userid={userid}  setShowForm={setShowForm} showForm={showForm} />
      <div className="leave-requests">
        <h2>Historique des demandes de congé</h2>
        <div className="Title">
          <span>Dates Demande</span>
          <span>Date de début</span>
          <span>Date de fin</span>
          <span>Nombre de jours</span>
          <span>Type</span>
          <span>Statut</span>
        </div>
        {leaveRequests.map(request => (
          <Demandecard
            key={request.id}
            start_date={request.start_date}
            end_date={request.end_date}
            type={request.type}
            statut={request.status}
/>
        ))}

      </div>
    </div>

  );
}

export default PageEmploye;

