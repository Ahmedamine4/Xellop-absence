import "./Cards.css"
import React, { useEffect, useState } from 'react';


function Navbar({role}) {
    
    const [selectcollab, setSelectcollab] = useState(false);
       useEffect(() => {
        if (window.location.pathname.includes('Page-manager')) {
            setSelectcollab(true);
        } else if (window.location.pathname.includes('Page-Employé')) {
            setSelectcollab(false);
        }
    }, []);

  return (
        <div className="navbar">
            <div className={`collaborateurnav ${selectcollab ? 'active' : ''}`}
                type="button" 
                onClick={() => {
                    window.location.href = '/Page-Employé';
                }}>
                    <h1>Collaborateur</h1>
            </div>
            <div className={`managernav ${!selectcollab ? 'active' : ''}`} type="button" 
                onClick={() => {
                    if( role === "manager" ){
                        window.location.href = '/Page-manager'
                        }
                    }}>
                <h1>Manager</h1>
            </div>
      </div>
  )
}
export default Navbar