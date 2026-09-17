# Global Opportunities Local Setup

This workspace contains three apps:

- `kredibble-backend`: Express API and Prisma database layer.
- `kredibble-admin`: Next.js admin web app.
- `kredibble-app`: Expo mobile app.

## 1. Configure Local Database

Edit `kredibble-backend/.env` and replace the MongoDB placeholders with local values:

```env
MONGODB_ROOT_USERNAME=your-mongodb-root-username
MONGODB_ROOT_PASSWORD=your-mongodb-root-password
MONGODB_DATABASE=kredibble
MONGODB_PORT=27017
DATABASE_URL="mongodb://your-mongodb-root-username:your-mongodb-root-password@localhost:27017/kredibble?authSource=admin"
```

Use the same values in `kredibble-backend/.env.example` when sharing setup defaults with other developers, but never commit real secrets.

## 2. Start Local MongoDB

Open PowerShell and go to the workspace root:

```powershell
cd "C:\Users\suadi\OneDrive\Desktop\Global-Opportunities"
docker compose --env-file .\kredibble-backend\.env up -d db
```

## 3. Prepare and Run the Backend API

In the same PowerShell window:

```powershell
cd "C:\Users\suadi\OneDrive\Desktop\Global-Opportunities\kredibble-backend"
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

The API runs at `http://localhost:4000/api`.

Useful database commands:

```powershell
cd "C:\Users\suadi\OneDrive\Desktop\Global-Opportunities\kredibble-backend"
npm run db:studio
npm run db:push
npm run db:seed
```

## 4. Run the Admin Web App

Open a second terminal:

```powershell
cd "C:\Users\suadi\OneDrive\Desktop\Global-Opportunities\kredibble-admin"
npm install
npm run dev
```

The admin app runs at `http://localhost:3000`.
Admin login and signup use the backend at `NEXT_PUBLIC_API_URL` from `kredibble-admin/.env`.

## 5. Run the Mobile App

Open a third terminal:

```powershell
cd "C:\Users\suadi\OneDrive\Desktop\Global-Opportunities\kredibble-app"
npm install
npm run start
```

From the Expo prompt, choose the target:

- Press `a` for Android emulator.
- Scan the QR code with Expo Go for a physical device.
- Run `npm run web` to test the Expo app in a browser.

The Expo start scripts set `EXPO_NO_DEPENDENCY_VALIDATION=1` before starting Expo. This avoids `TypeError: fetch failed` when Expo CLI cannot reach its online dependency-version API, while still starting the local Metro bundler.

If testing on a physical phone, the phone and computer must be on the same network. Use your computer LAN IP instead of `localhost` for any mobile API URL you add later.

## 6. Test Accounts

After running `npm run db:seed` in `kredibble-backend`, you can test backend login with:

```text
Admin:  nana.adjei@kredibble.com / password123
Seeker: enoch.mensah@gmail.com / password123
Hirer:  s.jenkins@google.com / password123
```

The admin web app accepts admin accounts. The mobile app accepts seeker and hirer accounts.
