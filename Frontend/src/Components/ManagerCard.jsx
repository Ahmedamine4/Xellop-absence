import "./Cards.css"


function Managercard({ start_date, end_date, type, statut, first_name, last_name}) {
    
  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = Math.abs(endDate - startDate);
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1;
  };
  
  const statutstyle = `badge ${statut.toLowerCase().replace(" ", "-")}`;
  return (
      <section className="manager-card">
          <span> {first_name} {last_name} </span>
          <span>{type}</span>
          <span>Demande fait le JJ-MM-YYYY</span>
          <span>{new Date(start_date).toLocaleDateString("fr-FR")}</span>
          <span>{new Date(end_date).toLocaleDateString("fr-FR")}</span>
          <span>{calculateDays(start_date, end_date)}</span>
          <span className={statutstyle}>{statut}</span>
      </section>
  )
}
export default Managercard