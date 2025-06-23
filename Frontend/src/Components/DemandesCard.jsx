import "./Cards.css"
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";
import { IoIosSend } from "react-icons/io";
import React, { useState, useRef, useEffect } from 'react';
import { IoMdMore } from "react-icons/io";

function Demandecard({ id, date_soumission, start_date, end_date, type, statut, onEdit, onDelete, onSend }) {

  const [more, setMore] = useState(false);
  const moreRef = useRef(null);
   useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreRef.current && !moreRef.current.contains(event.target)) {
        setMore(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (endDate < startDate) {
      alert("La date de fin ne peut pas être antérieure à la date de début");
      return 0;
    }
    const timeDiff = Math.abs(endDate - startDate);
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  };

  const statutstyle = `badge ${statut.toLowerCase().replace(" ", "-")}`;
  return (
    <div className="Card-modif">
    <section className="Card-container">
      <span className="date-soummisssion">
        {date_soumission
          ? new Date(date_soumission).toLocaleDateString("fr-FR")
          : "Date non renseignée"}
      </span>
      <span>{new Date(start_date).toLocaleDateString("fr-FR")}</span>
      <span>{new Date(end_date).toLocaleDateString("fr-FR")}</span>
      <span >{calculateDays(start_date, end_date)}</span>
      <span>{type}</span>
      <span className={statutstyle}>{statut}</span>
    {statut === "Brouillon" && (
        <span className="modification-brouillant-icon">
          <IoMdMore size={26}  type="button" className={`more-button ${more ? "active" : ""}`} onClick={() => setMore(!more)} />
          {more && (
            <div className="more-dropdown" ref={moreRef} >
              <h3 className="more-title">Brouillon</h3>
              <span className="more-actions"  onClick={() => onEdit(id)} type="button"> <MdEdit className="more-icons"/> Modifier</span>
              <span className="more-actions" onClick={() => onDelete(id)} type="button"> <MdDelete className="more-icons" /> Supprimer  </span>
              <span className="more-actions" onClick={() => onSend(id)} type="button"> <IoIosSend className="more-icons" /> Soumettre  </span>
            </div>    
          )}
        </span>
      )}
    </section>
    </div>
  )
}
export default Demandecard;
