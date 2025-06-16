import React, { useEffect, useState } from 'react';
import "./Styles.css"
import Navbar from '../Components/navbar';
import Managercard from '../Components/ManagerCard';
import axios from 'axios';

function PageEmploye() {

    const firstName = localStorage.getItem('first_name');
    const lastName = localStorage.getItem('last_name');
    const jour_res = localStorage.getItem('Jour_restant');
    const role = localStorage.getItem('role');
    const id_manager = localStorage.getItem('manager_id');
    const userid = localStorage.getItem('employee_id'); 
  
    const [leaveRequests, setLeaveRequests] = useState([]);

      useEffect(() => {
    if (userid) {
      axios.get(`http://localhost:5000/api/leaves/${userid}`)
        .then(response => setLeaveRequests(response.data))
        .catch(error => console.error('Erreur de chargement des congés :', error));
    }
  }, [userid]);


return (
<div className='manager-dashboard'>
<Navbar role={role} />
 <div className='managerheader'>
  <h1>Bonjour {firstName} {lastName} tu es un {role}</h1>
          {leaveRequests
          .filter(leaveRequests => leaveRequests.manager_id === userid && leaveRequests.status === "En Cours")
          .map(request => (
          <Managercard
            key={request.id}
            first_name={request.first_name}
            last_name={request.last_name}
            start_date={request.start_date}
            end_date={request.end_date}
            type={request.type}
            statut={request.status}
            employee_id={request.employee_id}
/>
        ))}
 </div>

</div>
)

}

export default PageEmploye;