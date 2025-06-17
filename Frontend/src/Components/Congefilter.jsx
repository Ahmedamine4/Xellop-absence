import React, { useState, useRef, useEffect } from 'react';
import './Cards.css'; // CSS file we'll define next

const options = ["All","Congé payé", "RTT", "Congé sans solde"];

function Congefilter({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-filter-container margin" ref={dropdownRef}>
      <button    type="button" className="select-button-filter" onClick={() => setOpen(!open)} required>
        {value || "Type de Congé"}
        <span className="arrow">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <ul className="select-options">
          {options.map((option) => (
            <li
              key={option}
              className={`option-item ${value === option ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation(); 
                onChange(option);
                setOpen(false);
              }}
              type="button"
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Congefilter;
