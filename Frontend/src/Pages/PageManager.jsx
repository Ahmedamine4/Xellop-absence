import React, { useEffect, useState } from 'react';
import "./Styles.css"
import Navbar from '../Components/navbar';
import Managercard from '../Components/ManagerCard';
import axios from 'axios';

function PageManager() {

    const firstName = localStorage.getItem('first_name');
    const lastName = localStorage.getItem('last_name');
    const jour_res = localStorage.getItem('Jour_restant');
    const role = localStorage.getItem('role');
    const id_manager = localStorage.getItem('manager_id');
    const userid = localStorage.getItem('employee_id'); 
  
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const totalPages = Math.ceil(leaveRequests.filter(r => r.employee_id === userid).length / itemsPerPage);

    const [filterName, setfilterName] = useState('');

      useEffect(() => {
    if (userid) {
      axios.get(`http://localhost:5000/api/leaves/one/${userid}`)
        .then(response => setLeaveRequests(response.data))
        .catch(error => console.error('Erreur de chargement des congés :', error));
    }
  }, [userid]);


return (
<div className='manager-dashboard'>
<section className="navigation-bar-left">
        <div className="navigation-employee">
        <h2>
          Navigation
        </h2>
        <Navbar role={role} />
        <h2>
          Filtrer par collaborateur
        </h2>
        <div className='filtrerparnom'>
          <boutton className={`boutton-filtre-nom ${filterName === "All" ? "active" : ""}`}  onClick={() => { setfilterName("All") }} > All </boutton>
        {[...new Map(
          leaveRequests
            .filter(request => request.manager_id === userid && request.status === "En Cours")
            .map(request => [`${request.first_name} ${request.last_name}`, request])
          ).values()]
          .map(request => (
            <boutton  className={`boutton-filtre-nom ${filterName === request.employee_id ? "active" : ""}`} key={request.id} onClick={() => { setfilterName(request.employee_id) }} >{request.first_name} {request.last_name}</boutton>
          ))}
          </div>
        </div>
        <div className="employee-info">
          <div className="inner">
            <h1>{firstName} {lastName}</h1>
            <div className="description">
              <p>Rôle: {role}</p>
              <p>Manager ID: {id_manager}</p>
            </div>
        </div>
      </div>
      
      </section>
 <section className='managerheader'>
          <h2>Gestion des abscence</h2>
          <div className='managerdemandeabscence'>
          {leaveRequests
          .filter(leaveRequests => leaveRequests.manager_id === userid && leaveRequests.status === "En Cours")
          .filter(leaveRequests=> !filterName || filterName === "All" || leaveRequests.employee_id === filterName )
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map(request => (
          <Managercard
            key={request.id}
            id={request.id}
            first_name={request.first_name}
            last_name={request.last_name}
            start_date={request.start_date}
            end_date={request.end_date}
            type={request.type}
            statut={request.status}
            employee_id={request.employee_id}
            date_soumission={request.date_soumission}
/>
        ))}
        </div>
              <div className="pagination">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
        {'|<'}
        </button>

        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          {'<'}
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(page =>
          page === 1 || 
          page === totalPages || 
          (page >= currentPage - 1 && page <= currentPage + 1)
         )
        .map(page => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={currentPage === page ? "active" : ""}
        >
          {page}
        </button>
        ))}

        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          {'>'}
        </button>

        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
         {'>|'}
        </button>
        </div>
 </section>

</div>
)

}

export default PageManager;