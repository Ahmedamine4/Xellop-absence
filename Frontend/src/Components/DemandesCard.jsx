import React from "react";
import "./Cards.css"

function Demandecard({statut}) {
  
  const statutstyle = `badge ${statut.toLowerCase().replace(" ", "-")}`;
  return (
      <section className="Card-container">
          <span>JJ-MM-YYYY</span>
          <span>JJ-MM-YYYY</span>
          <span>JJ-MM-YYYY</span>
          <span>JJ</span>
          <span>Congé payé</span>
          <span className={statutstyle}>{statut}</span>
      </section>
  )
}
export default Demandecard