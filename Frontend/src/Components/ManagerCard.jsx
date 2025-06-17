import "./Cards.css"


function Managercard({ start_date, end_date, type, statut, first_name, last_name, date_soumission }) {

    
  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = Math.abs(endDate - startDate);
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
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
<form className="statutssubmit">
  <label className="mstatut en-cours">
    <input type="radio" name="statut" value="En Cours" />
    <span className="checkmark">✓</span>
    En Cours
  </label>
  <label className="mstatut validé">
    <input type="radio" name="statut" value="Validé" />
    <span className="checkmark">✓</span>
    Accepter
  </label>
  <label className="mstatut refusé">
    <input type="radio" name="statut" value="Refusé" />
    <span className="checkmark">✓</span>
    Refuser
  </label>
  <button className="msubmitboutton">Submit</button>
</form>
      </section>
  )
}
export default Managercard