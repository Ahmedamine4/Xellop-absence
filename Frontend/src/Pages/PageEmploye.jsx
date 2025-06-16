
import Demandecard from "../Components/DemandesCard"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nouvelledemande from "../Components/Nouvelledemande";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Navbar from "../Components/navbar";

function PageEmploye() {

  const firstName = localStorage.getItem('first_name');
  const lastName = localStorage.getItem('last_name');
  const jour_res = localStorage.getItem('Jour_restant');
  const role = localStorage.getItem('role');
  const id_manager = localStorage.getItem('manager_id');
  const userid = localStorage.getItem('employee_id'); 

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const percentage = (jour_res / 30)*100;

  useEffect(() => {
    if (userid) {
      axios.get(`http://localhost:5000/api/leaves/${userid}`)
        .then(response => setLeaveRequests(response.data))
        .catch(error => console.error('Erreur de chargement des congés :', error));
    }
  }, [userid]);

  return (
    <div className="employee-dashboard">
      <Navbar role={role} />
      <div className="info-submit-solde">

      <div className="employee-info">
        <div className="inner">
          <h1>{firstName} {lastName}</h1>
          <div className="description">
            <p>Rôle: {role}</p>
            <p>Manager ID: {id_manager}</p>
          </div>
        </div>
      </div>

        <div className="solde-nouvelledemande">
            <div className="circularprogresssolde">
              <h1>Solde de Congé </h1>
              <div className="progress-bar">
                <div className="solde-progress" style={{ width: `${percentage}%` }}>
                  <p>{jour_res}</p>
                </div>
              </div>
            </div>
            <div >
                <button className='submitboutton' onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Fermer le formulaire" : "Faire une demande d'absence"}
                </button>
            </div>
            </div>
        </div>
            <Nouvelledemande 
              setLeaveRequests={setLeaveRequests} 
              userid={userid} 
              id_manager={id_manager} 
              setShowForm={setShowForm} 
              showForm={showForm} 
              first_name={firstName} 
              last_name={lastName}
              />
      <div className="leave-requests">
        <h2>Historique des demandes de congé</h2>
        <div className="Title">
          <span>Dates Demande</span>
          <span>Date de début</span>
          <span>Date de fin</span>
          <span>Nombre de jours</span>
          <span>Type</span>
          <span className="statut">Statut</span>
        </div>
        {leaveRequests
          .filter(leaveRequests => leaveRequests.employee_id === userid )
          .map(request => (
          <Demandecard
            key={request.id}
            start_date={request.start_date}
            end_date={request.end_date}
            type={request.type}
            statut={request.status}
            employee_id={request.employee_id}
/>
        ))}

      </div>
    </div>

  );
}

export default PageEmploye;

