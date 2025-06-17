import React, { useState, useRef, useEffect } from 'react';
import './Cards.css'; // CSS file we'll define next


function Anneefilter({ value, onChange, leaveRequests }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

    const getAvailableYears = () => {
    const years = new Set();
    leaveRequests.forEach(request => {
      if (request.date_soumission) {
        const year = new Date(request.date_soumission).getFullYear();
        years.add(year);
      }
    });
    return Array.from(years).sort((a, b) => b - a);
  };

      useEffect(() => {
        const handleClickOutside = (e) => {
          if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

  const availableYears = getAvailableYears();
  const options = ["All", ...availableYears.map(year => year.toString())];

  return (
    <div className="custom-filter-container margin" ref={dropdownRef}>
      <button    type="button" className="select-button-filter" onClick={() => setOpen(!open)} required>
        {value || "Date de soumission"}
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

export default Anneefilter;