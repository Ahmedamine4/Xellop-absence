import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import PageManager from './Pages/PageManager';
import PageEmploye from './Pages/PageEmploye';

function MainApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Page-manager" element={<PageManager />} />
        <Route path="/Page-employé" element={<PageEmploye />} />
      </Routes>
    </BrowserRouter>
  );
}

export default MainApp;