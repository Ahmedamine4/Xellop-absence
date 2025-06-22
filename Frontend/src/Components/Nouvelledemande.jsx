import  { useState, useEffect } from 'react';
import axios from 'axios';
import "./Cards.css";
import CustomSelect from './Congeoptions';
import { IoIosClose } from "react-icons/io";

function Nouvelledemande({ userid, setLeaveRequests, setShowForm, showForm, editDraft , id_manager, first_name, last_name, soldeConge}) {

      const [typeConge, setTypeConge] = useState('');
      const [dateDebut, setDateDebut] = useState('');
      const [dateFin, setDateFin] = useState('');

      const calculateDays = (start, end) => {
      const startDate = new Date(start);
      const endDate = new Date(end);
      const timeDiff = Math.abs(endDate - startDate);
      return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
        };

      const joursDemandes = calculateDays(dateDebut, dateFin);

  
  useEffect(() => {
    console.log("editDraft reçu dans Nouvelledemande :", editDraft);
    if (editDraft) { 
      setTypeConge(editDraft.type || '');
      setDateDebut(editDraft.start_date ? editDraft.start_date.slice(0, 10) : '');
      setDateFin(editDraft.end_date ? editDraft.end_date.slice(0, 10) : '');
    } else {
      setTypeConge('');
      setDateDebut('');
      setDateFin('');
    }
  }, [editDraft]);

  const SetBrouillon = async () => {
    if (!userid) {
      alert('Utilisateur non identifié');
      return;
    }
    if (!typeConge) {
      alert("Veuillez sélectionner un type de congé pour enregistrer un brouillon.");
      return;
    }
    try {
      if (editDraft) {
        await axios.put(`http://localhost:5000/api/leaves/${editDraft.id}`, {
          start_date: dateDebut,
          end_date: dateFin,
          type: typeConge,
          status: 'Brouillon',
          manager_id: id_manager,
          first_name: first_name,
          last_name: last_name,
        });
        alert(`Brouillon mis à jour !`);
        setShowForm(false);
      } else {
        await axios.post('http://localhost:5000/api/leaves', {
          employee_id: userid,
          start_date: dateDebut,
          end_date: dateFin,
          type: typeConge,
          status: 'Brouillon',
          manager_id: id_manager,
          first_name: first_name,
          last_name: last_name,
        });

        const response = await axios.get(`http://localhost:5000/api/leaves/${userid}`);
        setLeaveRequests(response.data);

      alert('Brouillon enregistré !');
      setTypeConge('');
      setDateDebut('');
      setDateFin('');
      setShowForm(false);
    }
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
    if (joursDemandes > soldeConge ) {
    alert(`Vous n'avez que ${soldeConge} jour(s) de congé restant.`);
    return;
    }

  try {
    if (editDraft) {
      await axios.put(`http://localhost:5000/api/leaves/${editDraft.id}`, {
        start_date: dateDebut,
        end_date: dateFin,
        type: typeConge,
        status: 'En Cours'
      });
      alert('Brouillon modifié et soumis !');
    } else {
      await axios.post('http://localhost:5000/api/leaves', {
        employee_id: userid,
        start_date: dateDebut,
        end_date: dateFin,
        type: typeConge,
        manager_id: id_manager,
        status: 'En Cours',
        first_name: first_name,
        last_name: last_name,
      });
    }

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
          <div className="manager-header nouvelle">
          <h3>Demande d'Absence</h3>
          <IoIosClose size={32} onClick={() => setShowForm(false)} style={{ cursor: "pointer", color: "white" }} />
            </div>
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
            <button 
              className="brouillondemande" 
              type="button"
              onClick={SetBrouillon}
            >
              Brouillant
            </button>
            <button 
              className="enregistrerdemande" 
              type="submit"
              > 
              Soumettre
            </button>
            </div>
          </form>
        </div>
      )}
      </div>
      )
}
export default Nouvelledemande