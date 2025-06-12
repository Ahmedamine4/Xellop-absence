import "./Styles.css"
import Demandecard from "../Components/DemandesCard"
  
 function PageEmploye() {
  const firstName = localStorage.getItem('first_name');
  const lastName = localStorage.getItem('last_name');
  const jour_res=localStorage.getItem('Jour_restant');
   const role=localStorage.getItem('role');
  const id_manager=localStorage.getItem('manager_id');
  const leaveRequests = [
    {
      id: 1,
      startDate: '2023-07-10',
      endDate: '2023-07-15',
      daysCount: 5,
      type: 'Congé payé',
      status: 'Approuvé'
    },
    {
      id: 2,
      startDate: '2023-08-01',
      endDate: '2023-08-02',
      daysCount: 2,
      type: 'RTT',
      status: 'En attente'
    },
    {
      id: 3,
      startDate: '2023-09-10',
      endDate: '2023-09-20',
      daysCount: 10,
      type: 'Congé sans solde',
      status: 'Refusé'
    }
  ];
  



  return (
    <div className="employee-dashboard">
      <div className="employee-info">
        <div className="inner">
          <h1>{firstName} {lastName}</h1>
          <div className="description">
            <p>Rôle: {role}</p>
            <p>Manager ID: {id_manager}</p>
          </div>
        </div>
      </div>
      <div className="leave-requests">
        <h2>Historique des demandes de congé</h2>
        <Demandecard statut="Validé"/>
        <Demandecard statut="Refusé"/>
        <Demandecard statut="Brouillant"/>
        <Demandecard statut="En Cours"/>
      </div>
    </div>

  );
};

export default PageEmploye; 