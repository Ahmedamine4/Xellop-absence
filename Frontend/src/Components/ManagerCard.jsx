import "./Cards.css"
import { useState } from "react";
import axios from "axios";
import { IoIosClose } from "react-icons/io";


function Managercard({id, start_date, end_date, type, statut, first_name, last_name, date_soumission, isActive, onToggle }) {

  const [selectedStatus, setSelectedStatus] = useState(statut);
  const employee_id = localStorage.getItem("employee_id");

    
  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = Math.abs(endDate - startDate);
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  };
  
 const handleStatusChange = async (newStatus) => {
  try {
    await axios.put(`http://localhost:5000/api/leaves/one/${id}`, {
      status: newStatus,
    });
    alert(`Demande ${newStatus.toLowerCase()} avec succès !`);
  } catch (error) {
    console.error("Erreur lors de la mise à jour :", error);
    if (error.response && error.response.data && error.response.data.message) {
      // Affiche le message envoyé par le backend
      alert(error.response.data.message);
    } else {
      alert("Erreur lors de la mise à jour du statut");
    }
  }
};
  
  const statutstyle = `mcheck ${statut.toLowerCase().replace(" ", "-")}`;
  return (
    <>
      <section className="manager-card">
        <div className="managercard-right">
        <div className="mcard-info">
          <h1 className="mname"> {first_name} {last_name} </h1>
          <span className="spandessous bigger" >Demande fait le {new Date(date_soumission).toLocaleDateString("fr-FR")}</span>
        </div>
        <div className="mcard-details">
        <div className="mcard-info first">
          <span>Type de congé </span>
          <p>{type}</p>
          <span className="spandessous" >Durée </span>
          <p>{calculateDays(start_date, end_date)}J</p>
        </div>
        <div className="mcard-info second">
          <span>Début</span>
          <p>{new Date(start_date).toLocaleDateString("fr-FR")}</p>
          <span className="spandessous">Fin</span>
          <p>{new Date(end_date).toLocaleDateString("fr-FR")}</p>
        </div>
        </div>
        </div>
        <button className="openboutton-manager" onClick={onToggle}>
          Ouvrir
        </button>
      </section>
      {isActive && (
        <div className="formpage">
          <div className="absence-request-form-manager">
            <div className="manager-header">
            <h3>Gérer la demande d'abscence</h3>
            <IoIosClose size={32} onClick={onToggle} style={{ cursor: "pointer", color: "white" }} />
            </div>
            <div className="formpage-info">
              <div className="mcard-info form top">
               <h1 className="mname"> {first_name} {last_name} </h1>
               <span className="spandessous bigger" >Demande fait le {new Date(date_soumission).toLocaleDateString("fr-FR")}</span>
              </div>
              <div className="mcard-details">
             <div className="mcard-info form">
               <span>Type de congé </span>
               <p>{type}</p>
              </div>
              <div className="mcard-info form">
                <span>Début</span>
                <p>{new Date(start_date).toLocaleDateString("fr-FR")}</p>
                <span className="spandessous">Fin</span>
                <p>{new Date(end_date).toLocaleDateString("fr-FR")}</p>
              </div>
              <div className="mcard-info form">
                <span className="spandessous" >Durée </span>
                <p>{calculateDays(start_date, end_date)}J</p>
              </div>
            </div>
          </div>
          <form onSubmit={handleStatusChange}>
            <div className="action-buttons">
           <button
            type="button"
             className="btn-refuse"
              onClick={() => handleStatusChange("Refusé")}
            >
            Refuser
            </button>
            <button
              type="button"
              className="btn-accept"
              onClick={() => handleStatusChange("Validé")}
              >
            Accepter
            </button>
            </div>
           </form>
      </div>
  </div>
)}
      </>
  )
}
export default Managercard