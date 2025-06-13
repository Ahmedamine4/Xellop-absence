import React, { useEffect, useState } from 'react';
import "./Styles.css"

function PageEmploye() {
  const [selectcollab, setSelectcollab] = useState(true);
  const firstName = localStorage.getItem('first_name');
  const lastName = localStorage.getItem('last_name');
  const role=localStorage.getItem('role');


return (
<div>
            <div className="navbar">
        <div className="collaborateurnav" type="button" onClick={() => {
           setSelectcollab(false); 
          window.location.href = '/Page-Employé';
          }}>
          <h1>Collaborateur</h1>
        </div>
        <div className="managernav" type="button">
          <h1>Manager</h1>
        </div>
      </div>

<h1>Bonjour {firstName} {lastName} tu es un {role}</h1>

</div>
)

}

export default PageEmploye;