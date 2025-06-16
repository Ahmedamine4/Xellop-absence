import "./Cards.css"
import deleteIcon from '../assets/Delete.svg';
import editIcon from '../assets/edit.svg';
import sendIcon from '../assets/send.svg';

function Demandecard({ id, date_soumission, start_date, end_date, type, statut, onEdit, onDelete, onSend }) {
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
      <span>
        {date_soumission
          ? new Date(date_soumission).toLocaleDateString("fr-FR")
          : "Date non renseignée"}
      </span>
      <span>{new Date(start_date).toLocaleDateString("fr-FR")}</span>
      <span>{new Date(end_date).toLocaleDateString("fr-FR")}</span>
      <span>{calculateDays(start_date, end_date)}</span>
      <span>{type}</span>
      <span className={statutstyle}>{statut}</span>
    </section>
    {statut === "Brouillon" && (
        <span>
          <div className="icon-container"><img onClick={() => onEdit(id)} src={editIcon} alt="Modifier" /></div>
          <div className="icon-container"><img onClick={() => onDelete(id)} src={deleteIcon} alt="Supprimer" /></div>
          <div className="icon-container"><img onClick={() => onSend(id)} src={sendIcon} alt="Envoyer" /></div>
        </span>
      )}
    </div>
  )
}
export default Demandecard;
