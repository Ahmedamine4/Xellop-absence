
  
  export default function PageEmploye() {
  const firstName = localStorage.getItem('first_name');
  const lastName = localStorage.getItem('last_name');
  const role=localStorage.getItem('role');

return <h1>Bonjour {firstName} {lastName} tu es un {role}</h1>;

}