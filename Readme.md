# BarberShop Desktop Application

A complete desktop application for barbershop management built with **Tauri**, **React**, **TypeScript**, and **Supabase**.

> Developed by **Ary Hauffe Neto**  
> Email: aryhauffeneto@gmail.com  
> Personal Website: [arynelson.github.io/Site](https://arynelson.github.io/Site/)

---

## 📦 Technologies Used

- **Frontend Desktop**: React + TypeScript with Tauri
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Calendar**: FullCalendar.js
- **Styling**: Tailwind CSS
- **Charts**: Recharts

---

## 🧠 Project Overview

This is a fully offline-capable, authentication-protected management system for small to medium-sized barbershops. It covers customer management, service and schedule handling, professional tracking, financial controls, and graphical reporting — all within a clean and intuitive interface.

---

## 🖥️ Pages and Functionalities

### 🏠 Home
**Menu Navigation**:
- Agenda
- Clients
- Services
- Professionals
- Cash Register
- Reports

**Overview Panel**:
- Displays a snapshot of the day: upcoming appointments, financial summary
- Shows pending/unconfirmed bookings

---

### 📅 Agenda
**Calendar View**:
- Full month display via FullCalendar
- Color-coded events by status: confirmed, pending, canceled
- Filter by day or view all
- Responsive layout with real-time updates

**Booking List**:
- Chronological list of appointments
- Each appointment includes client name, phone, professional, and service
- Allows confirmation, completion, or cancellation
- Filter by professional

**Add Appointment**:
- Select client, service, professional, and date/time
- Integrates directly with client and service database

---

### 🧑‍🤝‍🧑 Clients
**Client Registry**:
- View, register, and remove clients
- Shows name and phone
- Filter/search functionality for quick access

---

### ✂️ Services and Professionals
**Services**:
- Register services with name, price, optional duration, and commission percentage
- Remove existing services

**Professionals**:
- Register professionals with name and optional phone
- Assign services and automatic commission tracking
- Remove existing professionals

---

### 💰 Cash Register (Caixa)
**Daily Payment Log**:
- Record income and expenses with value, type (entry/exit), and payment method
- See real-time transaction history

**Summary Panel**:
- Auto-calculated net balance
- Separate cash-in / cash-out categorization

---

### 📊 Reports
**Financial Metrics**:
- Daily, weekly, monthly revenue tracking
- Average ticket value per appointment
- Growth comparison with previous periods

**Attendance Metrics**:
- Number of clients attended
- Most requested services
- Busiest hours (bar chart)
- Cancellation/no-show rate

**Professional Metrics**:
- Ranking by revenue generated
- Commissions earned
- Working hours or number of appointments

**Cash Metrics**:
- Entries and exits from cash register
- End-of-day balance
- Pending payments if applicable

---

![login](https://github.com/Arynelson/BarberShop/tree/main/BarberShop/src/assets/print/login.png)

![inicio](https://github.com/Arynelson/BarberShop/tree/main/BarberShop/src/assets/print/inicio.png)

![agenda](https://github.com/Arynelson/BarberShop/tree/main/BarberShop/src/assets/print/agenda.jpeg)

![service](https://github.com/Arynelson/BarberShop/tree/main/BarberShop/src/assets/print/service.png)

![relatorio](https://github.com/Arynelson/BarberShop/tree/main/BarberShop/src/assets/print/relatorio.png)


## ⚙️ Setup & Installation
1. Clone this repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Start development with Tauri
   ```bash
   npm run tauri dev
   ```
4. Make sure to configure `.env` with your Supabase credentials

---

## 📌 Final Notes
This project was designed with MVP-first philosophy, but has room for features like:
- Notification integrations (e.g., WhatsApp confirmations)
- Dark mode
- Multi-user support
- Export to PDF / Excel

> Contributions and feedback are welcome!

