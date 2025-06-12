import React from "react";
import "./Cards.css"


function Demandecard({ start_date, end_date, type, statut}) {
    
  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = Math.abs(endDate - startDate);
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  };
  
  const statutstyle = `badge ${statut.toLowerCase().replace(" ", "-")}`;
  return (
      <section className="Card-container">
          <span>JJ-MM-YYYY</span>
          <span>{start_date}</span>
          <span>{end_date}</span>
          <span>{calculateDays(start_date, end_date)}</span>
          <span>{type}</span>
          <span className={statutstyle}>{statut}</span>
      </section>
  )
}
export default Demandecard