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

    const [activeFormId, setActiveFormId] = useState(null);
  
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterName, setFilterName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    
    const [searchTerm, setSearchTerm] = useState("");
    const [showNames, setShowNames] = useState(false);
    const[allEmployees, setAllEmployees] = useState([]);

    useEffect(() => {
  const fetchLeaves = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/leaves/manager/paginated/${userid}?page=${currentPage}`);
      setLeaveRequests(response.data.data);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Erreur chargement des congés manager :", error);
    }
  };

  if (userid) fetchLeaves();
}, [userid, currentPage]);



useEffect(() => {
  const fetchAllNames = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/leaves/manager/allnames/${userid}`);
      console.log("All leave requests:", res.data);
      setAllEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (userid) fetchAllNames();
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
          Recherche par nom
        </h2>
       
<div className="search-container">
  <div className="content">
    <input
      type="text"
      placeholder="Rechercher"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="input-search-custom"
    />
  </div>
</div>

<div className='filtrerparnom'>
  {searchTerm.trim() !== "" &&
    allEmployees
      .filter(emp =>
        `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(emp => (
        <button
          key={emp.employee_id}
          className={`boutton-filtre-nom ${filterName === emp.employee_id ? "active" : ""}`}
          onClick={() => setFilterName(emp.employee_id)}
        >
          {emp.first_name} {emp.last_name}
        </button>
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
    .filter(request => 
      (!filterName || filterName === "All" || request.employee_id === filterName) &&
      `${request.first_name} ${request.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
    )
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
        isActive={activeFormId === request.id}
            onToggle={() => {
              setActiveFormId(prev => prev === request.id ? null : request.id);
              }}
      />
  ))}
</div>
              <div className="pagination">
    
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

        
        </div>
 </section>

</div>
)

}

export default PageManager;