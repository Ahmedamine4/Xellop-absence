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
  const jour_res = Number(localStorage.getItem('Jour_restant')) || 0;
  const role = localStorage.getItem('role');
  const id_manager = localStorage.getItem('manager_id');
  const userid = localStorage.getItem('employee_id');

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editDraft, setEditDraft] = useState(null);
  const percentage = (jour_res / 30) * 100;

  const loadLeaves = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/leaves/${userid}`);
      setLeaveRequests(response.data);
    } catch (error) {
      console.error('Erreur de chargement des congés :', error);
    }
  };
  useEffect(() => {
    if (userid) loadLeaves();
  }, [userid]);
const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce brouillon ?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/leaves/${id}`);
      loadLeaves();
      alert("Brouillon supprimé !");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Erreur lors de la suppression");
    }
  };

  // Envoyer une demande : mettre à jour le statut
  const handleSend = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/leaves/one/${id}`, {
        status: "En Cours"
      });
      loadLeaves();
      alert("Demande envoyée !");
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      alert("Erreur lors de l'envoi");
    }
  };

  // Modifier un brouillon 
  const handleEdit = async (id) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/leaves/one/${id}`);
    console.log(" Données reçues depuis backend pour modification :", response.data);
    setShowForm(true);
    setEditDraft(response.data); 

  } catch (error) {
    console.error("Erreur lors de la modification :", error);
    alert("Erreur lors de la modification");
  }
};


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
                <button className='submitboutton' onClick={() => { setShowForm(!showForm); setEditDraft(null); }}>
              {showForm ? "Fermer le formulaire" : "Faire une demande d'absence"}
            </button>
          </div>
        </div>
      </div>

       <Nouvelledemande
        userid={userid}
        setLeaveRequests={setLeaveRequests}
        setShowForm={setShowForm}
        showForm={showForm}
        editDraft={editDraft}
        id_manager={id_manager}
        first_name={firstName} 
        last_name={lastName} 
        soldeConge={jour_res}
        onUpdateDone={() => {
          setEditDraft(null);
          setShowForm(false);
          loadLeaves();
        }}
      />
      <div className="Title-leave-requests">
      <h2>Historique des demandes de congé</h2>
      </div>
      <div className="leave-requests">
        <div className="Title">
          <span>Date de soumission</span>
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
            id={request.id}
            date_soumission={request.date_soumission}
            start_date={request.start_date}
            end_date={request.end_date}
            type={request.type}
            statut={request.status}
            employee_id={request.employee_id}
            onEdit={handleEdit}      
            onDelete={handleDelete}
            onSend={handleSend}
          />
        ))}
      </div>
    </div>
  );
}

export default PageEmploye;