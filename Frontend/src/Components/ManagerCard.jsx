import "./Cards.css"
import { useState } from "react";
import axios from "axios";


function Managercard({id, start_date, end_date, type, statut, first_name, last_name, date_soumission }) {

  const [selectedStatus, setSelectedStatus] = useState(statut);
  const employee_id = localStorage.getItem("employee_id");

    
  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = Math.abs(endDate - startDate);
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/leaves/one/${id}`, {
        status: selectedStatus,
      });
      alert("Statut mis à jour avec succès !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Erreur lors de la mise à jour du statut");
    }
  };
  
  const statutstyle = `mcheck ${statut.toLowerCase().replace(" ", "-")}`;
  return (
      <section className="manager-card">
        <div className="mcard-info">
          <span className="mname"> {first_name} {last_name} </span>
          <span>Type de congé : <strong>{type}</strong></span>
          <span>Demande fait le : <strong>{new Date(date_soumission).toLocaleDateString("fr-FR")}</strong></span>
          <span>Date de début : <strong>{new Date(start_date).toLocaleDateString("fr-FR")}</strong></span>
          <span>Date de fin : <strong>{new Date(end_date).toLocaleDateString("fr-FR")}</strong></span>
          <span>Nombre de jours : <strong>{calculateDays(start_date, end_date)}</strong></span>
        </div>
 <form className="statutssubmit" onSubmit={handleSubmit}>
        <label className="mstatut en-cours">
          <input 
            type="radio" 
            name={`statut-${employee_id}`} 
            value="En Cours" 
            checked={selectedStatus === "En Cours"}
            onChange={(e) => setSelectedStatus(e.target.value)} 
          />
          <span className="checkmark">✓</span>
          En Cours
        </label>
        <label className="mstatut validé">
          <input 
            type="radio" 
            name={`statut-${employee_id}`} 
            value="Validé"
            checked={selectedStatus === "Validé"}
            onChange={(e) => setSelectedStatus(e.target.value)} 
          />
          <span className="checkmark">✓</span>
          Accepter
        </label>
        <label className="mstatut refusé">
          <input 
            type="radio" 
            name={`statut-${employee_id}`} 
            value="Refusé"
            checked={selectedStatus === "Refusé"}
            onChange={(e) => setSelectedStatus(e.target.value)} 
          />
          <span className="checkmark">✓</span>
          Refuser
        </label>

        <button className="msubmitboutton" type="submit">Submit</button>
      </form>
      </section>
  )
}
export default Managercard