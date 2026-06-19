<div align="center">

<p align="center">
  <img src="./Rydr_banner.png" alt="Rydr Banner" width="90%" />
</p>
<h1>🚘 Rydr</h1>

<p><em>Ride Smart. Ride Fast.</em></p>

<p>A real-time ride booking app where customers book rides on a live map<br/>and riders receive instant ride requests.</p>

![React Native](https://img.shields.io/badge/React%20Native-149ECA?style=for-the-badge&logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-5C4B99?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-2563EB?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-15803D?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB%20Atlas-0F766E?style=for-the-badge&logo=mongodb&logoColor=white)

---

[![Download App](https://img.shields.io/badge/⬇️_Download_App-2563EB?style=for-the-badge&logo=android&logoColor=white)](https://github.com/shubhmrwt01/Rydr/releases/tag/Rydr)
&nbsp;
[![Report Bug](https://img.shields.io/badge/🐛_Report_Bug-DC2626?style=for-the-badge&logo=github&logoColor=white)](https://github.com/shubhmrwt01/Rydr/issues)
&nbsp;
[![Request Feature](https://img.shields.io/badge/✨_Request_Feature-7C3AED?style=for-the-badge&logo=github&logoColor=white)](https://github.com/shubhmrwt01/Rydr/issues)

</div>

## Features

|     |                                                                              |
| :-: | ---------------------------------------------------------------------------- |
| ✅  | Separate Customer and Rider experiences                                      |
| ✅  | Real-time ride matching and live status updates via Socket.IO                |
| ✅  | Live GPS streaming — rider position broadcast to customer map                |
| ✅  | Secure authentication with access and refresh tokens                         |
| ✅  | Smart fare calculation using geo-location utilities                          |
| ✅  | End-to-end ride lifecycle: Create → Offer → Accept → In Progress → Completed |

---

## 🛠️ Tech Stack

### 🖥️ Frontend &nbsp;·&nbsp; `client/`

| Tech                                                                                                              | Purpose                  |
| :---------------------------------------------------------------------------------------------------------------- | :----------------------- |
| ![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat-square&logo=react&logoColor=61DAFB)   | Cross-platform mobile UI |
| ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)   | Static typing & safety   |
| ![Expo Router](https://img.shields.io/badge/Expo_Router-000020?style=flat-square&logo=expo&logoColor=white)       | File-based navigation    |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)                  | HTTP client              |
| ![Google Maps](https://img.shields.io/badge/Google_Maps-4285F4?style=flat-square&logo=googlemaps&logoColor=white) | Live maps & location     |

---

### ⚙️ Backend &nbsp;·&nbsp; `server/`

| Tech                                                                                                           | Purpose            |
| :------------------------------------------------------------------------------------------------------------- | :----------------- |
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)       | JS runtime         |
| ![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)   | REST API framework |
| ![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat-square&logo=socketdotio&logoColor=white) | Real-time events   |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)           | Stateless auth     |

---

### 🚀 Infrastructure

| Tech                                                                                                               | Purpose              |
| :----------------------------------------------------------------------------------------------------------------- | :------------------- |
| ![Render](https://img.shields.io/badge/Render-7C3AED?style=flat-square&logo=render&logoColor=white)                | Backend hosting      |
| ![Expo EAS](https://img.shields.io/badge/Expo_EAS-111827?style=flat-square&logo=expo&logoColor=white)              | Build & OTA delivery |
| ![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white) | Cloud database       |

---

## Project Structure

```
Rydr/
├── client/               # React Native · Expo · TypeScript
│   ├── src/              # Screens, components, context, services
│   ├── android/ & ios/   # Native projects
│   └── app.config.js
│
├── server/               # Express · Socket.io
│   ├── controllers/      # Auth & ride logic
│   ├── models/           # User, Ride (Mongoose)
│   ├── routes/           # /auth  /ride
│   ├── utils/            # mapUtils — geo & fare
│   ├── errors/           # Error classes + middleware
│   ├── sockets.js        # All Socket.io event handlers
│   └── app.js
│
└── docs/
    └── architecture.png
```

---

## Architecture

<div align="center">
  <img src="./docs/architecture.png" width="100%" />
</div>

---

## 🎥 Real-Time Ride Lifecycle Demo

<div align="center">

### 📱 Customer App ↔ 🏍️ Rider App

https://github.com/user-attachments/assets/ae40e496-4a72-4db9-ab44-a6ba618c1dc4

</div>

### 🔄 End-to-End Ride Flow

1. Customer selects pickup & destination
2. Ride request is broadcast in real time via Socket.IO
3. Rider instantly receives the request
4. Rider accepts the ride
5. Live GPS tracking updates both devices
6. OTP verification before trip start
7. Ride progresses with real-time status updates
8. Ride successfully completed

### ✨ Highlights

- Real-time bidirectional communication using Socket.IO
- Live rider location streaming
- Separate Customer and Rider applications
- Secure JWT authentication
- Complete ride lifecycle management

---

## 📱 Screenshots

### 🚀 Onboarding

<div align="center">

|                        Splash                        |                        Role Selection                        |
| :--------------------------------------------------: | :----------------------------------------------------------: |
| <img src="./screenshots/01-splash.png" width="180"/> | <img src="./screenshots/02-role-selection.png" width="180"/> |

</div>

---

### 👤 Customer Flow

<div align="center">

|                          Login                          |                            Home                             |                              Search                              |                        Ride Options                        |
| :-----------------------------------------------------: | :---------------------------------------------------------: | :--------------------------------------------------------------: | :--------------------------------------------------------: |
| <img src="./screenshots/03-custlogin.png" width="160"/> | <img src="./screenshots/04-customer-home.png" width="160"/> | <img src="./screenshots/05-destination-search.png" width="160"/> | <img src="./screenshots/06-ride-options.png" width="160"/> |

|                         Finding Rider                         |                       OTP Verify                       |                        Ride Completed                        |
| :-----------------------------------------------------------: | :----------------------------------------------------: | :----------------------------------------------------------: |
| <img src="./screenshots/07-searching-rider.png" width="160"/> | <img src="./screenshots/14-otp-cust.png" width="160"/> | <img src="./screenshots/11-ride-completed.png" width="160"/> |

</div>

---

### 🏍️ Rider Flow

<div align="center">

|                          Login                           |                        Ride Request                         |                           OTP Verify                           |                           Navigation                           |                          Off Duty                           |
| :------------------------------------------------------: | :---------------------------------------------------------: | :------------------------------------------------------------: | :------------------------------------------------------------: | :---------------------------------------------------------: |
| <img src="./screenshots/13-riderlogin.png" width="140"/> | <img src="./screenshots/09-rider-request.png" width="140"/> | <img src="./screenshots/08-otp-verification.png" width="140"/> | <img src="./screenshots/10-rider-navigation.png" width="140"/> | <img src="./screenshots/12-rider-offduty.png" width="140"/> |

</div>

---

## Development & Deployment

**Prerequisites:** Node.js ≥ 20, MongoDB Atlas, Expo Go, Android emulator, or a physical device

### 1) Clone the repository

```bash
git clone https://github.com/shubhmrwt01/Rydr.git
cd Rydr
```

### 2) Backend setup

For local development:

```bash
cd server
cp ".env-template copy" .env
npm install
npm start
```

For production, the backend is deployed on Render:

- **Backend URL:** [https://rydr-o2d5.onrender.com](https://rydr-o2d5.onrender.com)

> Note: Render free services may sleep after inactivity. Opening the backend URL once will wake the server before using the app.

### 3) Frontend setup

For local development:

```bash
cd client
npm install
npx expo start
```

For production builds, the frontend is distributed using Expo EAS.
Set the following environment variables in your EAS project:

```env
EXPO_PUBLIC_BASE_URL=https://rydr-o2d5.onrender.com
EXPO_PUBLIC_SOCKET_URL=https://rydr-o2d5.onrender.com
```

### 📦 Download App

> [!NOTE]
> **Backend runs on Render's free tier** — if the app feels slow on first launch, [wake the server](https://rydr-o2d5.onrender.com) first and wait ~30 seconds.

<div align="center">

[![Download APK](https://img.shields.io/badge/⬇️_Download_APK-Android-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://github.com/shubhmrwt01/Rydr/releases/tag/Rydr)
&nbsp;&nbsp;
[![Wake Server](https://img.shields.io/badge/⚡_Wake_Server-Render-7C3AED?style=for-the-badge&logo=render&logoColor=white)](https://rydr-o2d5.onrender.com)

</div>

---

## 🚀 Future Enhancements

| Feature            | Description                                                           |
| ------------------ | --------------------------------------------------------------------- |
| 🤖 AI Assistant    | Conversational support for bookings, ride queries, and real-time help |
| ⏱️ Predictive ETA  | Smarter estimates powered by live traffic and historical trip data    |
| 💳 In-App Payments | Secure checkout via Stripe and Razorpay with saved cards and UPI      |
| 🎙️ Voice Controls  | Hands-free ride booking and navigation using voice commands           |
| 🗺️ Smart Routing   | Routes that adapt in real time to traffic and road closures           |

---

## 🤝 Contributing

We love contributions! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

## 🐛 Found a Bug?

If you find a bug or have a feature request, please [open an issue](https://github.com/shubhmrwt01/Rydr/issues) with:

- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

<div align="center">

**Shubham Rawat**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/shubhmrwt01)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/shubhmrwt01)

</div>

---

<div align="center">

### ⭐ Star this repo if you find it helpful!

**Made with ❤️ to book your ride**

_© 2026 Shubham Rawat. All rights reserved._

</div>
