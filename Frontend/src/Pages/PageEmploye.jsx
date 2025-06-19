import Demandecard from "../Components/DemandesCard"
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Nouvelledemande from "../Components/Nouvelledemande";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import Navbar from "../Components/navbar";
import Congefilter from "../Components/Congefilter";
import Anneefilter from "../Components/Anneefilter";
import Statutfilter from "../Components/Staturfilter";

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
  const [typeConge, setTypeConge] = useState('');
  const [statutConge, setStatutConge] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const percentage = (jour_res / 30) * 100;

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(leaveRequests.filter(r => r.employee_id === userid).length / itemsPerPage);


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
    const response = await axios.get(`http://localhost:5000/api/leaves/two/${id}`);
    console.log(" Données reçues depuis backend  :", response.data);
    setShowForm(true);
    setEditDraft(response.data[0]); 

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
      <section className="navigation-bar-left">
        <div className="navigation-employee">
        <h2>
          Navigation
        </h2>
        <Navbar role={role} />

        <h2>
          Solde de Congé 
        </h2>
        <div className="solde-nouvelledemande">
            <div className="circularprogresssolde">
              <div className="progress-bar">
                <div className="solde-progress" style={{ width: `${percentage}%` }}>
                  <p>{jour_res}</p>
                </div>
              </div>
            </div>
        </div>
          <button className='submitboutton' onClick={() => { setShowForm(!showForm); setEditDraft(null); }}>
              {showForm ? "Fermer le formulaire" : "Faire une demande d'absence"}
          </button>
        </div>
        <div className="employee-info">
          <div className="inner">
            <h1>{firstName} {lastName}</h1>
            <div className="description">
              <p>Rôle: {role}</p>
              <p>Manager ID: {id_manager}</p>
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
      </section>
      <section className="tableau-historique-right">
      <div className="titleandfiltres">

      <div className="Title-leave-requests">
      <h2>Historique des demandes de congé</h2>
      </div>
      <div className="filtres">
        <div className="filtreboutton">
              <Congefilter value={typeConge} onChange={setTypeConge} />
        </div>
        <div className="filtreboutton">
              <Anneefilter value={selectedYear} onChange={setSelectedYear} leaveRequests={leaveRequests} />
        </div>
        <div className="filtreboutton">
              <Statutfilter value={statutConge} onChange={setStatutConge} />
        </div>
      </div>
      </div>
      <div className="leave-requests">
        <div className="Title">
          <span>Date de soumission</span>
          <span>Date de début</span>
          <span>Date de fin</span>
          <span>Nombre de jours</span>
          <span>Type</span>
          <span className="statut">Statut</span>
          <span className="modification-brouillant">Modification</span>
        </div>
        {leaveRequests
          .filter(leaveRequests => leaveRequests.employee_id === userid)
          .filter(leaveRequests => !typeConge || typeConge === "All" || leaveRequests.type === typeConge)
          .filter(leaveRequests => !statutConge || statutConge === "All" || leaveRequests.status === statutConge)
          .filter(leaveRequest => !selectedYear || selectedYear === "All" || new Date(leaveRequest.date_soumission).getFullYear().toString() === selectedYear )
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
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
      <div className="pagination">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
        {'|<'}
        </button>

        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          {'<'}
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(page =>
          page === 1 || 
          page === totalPages || 
          (page >= currentPage - 1 && page <= currentPage + 1)
         )
        .map(page => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={currentPage === page ? "active" : ""}
        >
          {page}
        </button>
        ))}

        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          {'>'}
        </button>

        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
         {'>|'}
        </button>
        </div>
        </section>
    </div>
  );
}

export default PageEmploye;