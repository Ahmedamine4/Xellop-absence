##🖥️ Overview
Ce projet est une **application web de gestion des absences** développée dans le cadre d’un stage chez **XELOPS Technology**.  
Elle permet aux employés d’envoyer des demandes de congés et aux managers de **les approuver ou les refuser** via un tableau de bord intuitif.  
L’application a été conçue pour offrir une **expérience utilisateur simple, rapide et sécurisée**, en intégrant l’authentification Google et des notifications par e-mail.

---

## 🚀 Features
- Authentification sécurisée via **Google OAuth2.0**  
- Gestion des **demandes d’absence** (création, modification, suppression, envoi)  
- **Pagination, filtres et recherche** pour faciliter la gestion côté manager  
- Gestion des **brouillons et des statuts** (En attente, Validé, Refusé)  
- **Notifications e-mail automatiques** pour informer les employés du statut de leur demande  
- Gestion des **rôles utilisateurs** (Employé / Manager)  
- Interface **responsive** adaptée à tous les appareils  

---

## 🧰 Technologies Used
- **Frontend :** React.js, JavaScript, CSS, HTML  
- **Backend :** Node.js, Express.js, MySQL  
- **Authentification :** Google OAuth2.0  
- **Email :** Nodemailer  
- **Design & UI :** Figma, Adobe Photoshop  
- **Versioning :** GitHub  

---

## ⚙️ Installation and Setup

1️⃣ Cloner le dépôt
git clone https://github.com/Ahmedamine4/Xellop-absence-management.git
2️⃣ Installer les dépendances
cd backend
npm install
cd ../frontend
npm install
3️⃣ Configurer les variables d’environnement
Créer un fichier .env dans le dossier backend :
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=ton_mot_de_passe
DB_NAME=absence_db
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
EMAIL_USER=ton_email@gmail.com
EMAIL_PASS=mot_de_passe_app
4️⃣ Lancer le projet
Backend :
cd backend
npm start
Frontend :
cd frontend
npm run dev
##✨ Highlights
Projet professionnel réalisé lors d’un stage
Conception full-stack (front-end + back-end)
Interface intuitive et ergonomique
Intégration réelle avec Google Auth et notifications e-mail
Gestion complète des rôles, statuts et flux utilisateur

yaml
Copier le code
