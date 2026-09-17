# Kredibble Mobile App

Expo mobile app for Kredibble.

## Get Started On Windows

Open PowerShell and go to the mobile app directory:

```powershell
cd "C:\Users\suadi\OneDrive\Desktop\Global-Opportunities\kredibble-app"
```

Install dependencies:

```powershell
npm install
```

Start Expo:

```powershell
npm run start
```

The start script skips Expo's online dependency-version check and starts the local Metro bundler. This avoids `TypeError: fetch failed` when Expo CLI cannot reach Expo's API.

## Run Targets

Android emulator:

```powershell
npm run android:windows
```

Web browser:

```powershell
npm run web
```

Expo Go on a physical phone:

```powershell
npm run start
```

Then scan the QR code from the Expo terminal.

## Useful Commands

```powershell
npm run lint
npm run web
npm run start
```

If testing against the backend from a physical phone, the phone cannot use `localhost` for your computer. Use your computer's LAN IP address for API URLs.

## Backend Login

Login and signup call the backend auth routes:

```text
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me
```

The mobile API URL is controlled by `EXPO_PUBLIC_API_URL` in `.env`.

- Leave it blank for defaults.
- Android emulator default: `http://10.0.2.2:4000/api`
- Expo web default: `http://localhost:4000/api`
- Physical phone: set it to your computer LAN IP, for example `http://192.168.1.25:4000/api`

Seeded demo accounts after `npm run db:seed`:

```text
Seeker: enoch.mensah@gmail.com / password123
Hirer:  s.jenkins@google.com / password123
```
