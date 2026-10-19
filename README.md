# 🪔 Kanjak Puja (कंजक पूजा) • Sacred Devotional Platform

A devotional, privacy-first platform connecting devotee **Host Families** offering Navratri Kanya Pujan with **Kanjak & Langur Families**, ensuring absolute child safety, satvik prasad, dakshina, and concurrency-protected slot bookings.

---

## 🌟 Key Features

1. **Divine Gold Aesthetic**:
   - Devotional palette (`#D4AF37` Gold, Warm Ivory, Deep Saffron).
   - Animated Diya flame with pulsating radiant aura.
   - Sacred Sanskrit shlok banner and synthesized temple bell chime (Web Audio API).
   - Floating marigold petals and ornamental golden borders.
   - Full accessibility with high-contrast text and `prefers-reduced-motion` compliance.

2. **Kanjak / Guardian Portal (`👧 Kanjak Parivar`)**:
   - Register child name & age (2–14 years, Kanjak / Langur role).
   - Guardian contact details, approximate neighborhood, and dietary preferences.
   - **Mandatory Explicit Legal Consent** checkbox.
   - **Zero Child Tracking**: Children are strictly shielded from public directories, search engines, and public APIs.
   - **Private Guardian Token**: Self-service management and **1-click withdrawal / permanent deletion**.

3. **Host / Feeding Family Portal (`🪔 Pujari Parivar`)**:
   - Register Puja date (Maha Ashtami / Maha Navami), time windows, and total capacity.
   - Offerings: Pure Desi Ghee Prasad menu, Dakshina (₹), and traditional gifts (Chunri, Bangles, etc.).
   - **Location Privacy**: Only approximate neighborhood and landmarks are displayed publicly. Exact addresses are kept private.
   - **Host Management Console**: Toggle status (`open` / `closed`) and monitor booked slots.

4. **Atomic Slot Booking & Concurrency Protection**:
   - **Zero Race Conditions**: Server-side mutex locking guarantees that if two families book the final slot simultaneously, the 1st request succeeds (200 OK) and the 2nd is safely rejected (409 Conflict).
   - **Address Disclosure**: Exact host address and contact are securely revealed **only** upon confirmed booking pass generation.
   - **Live Concurrency Simulator**: Interactive test suite included directly in the UI.

---

## 🚀 Running Locally (Localhost Setup)

To start the website locally on your computer:

```bash
# 1. Install dependencies (if not already installed)
npm install

# 2. Run local development server
npm run dev
```

Open your browser and visit: **[http://localhost:3000](http://localhost:3000)**

---

## 🧪 Verification & Testing

- **Production Build Check**:
  ```bash
  npm run build
  ```
  *(Verified: Compiles cleanly with zero errors or warnings).*

- **Live Concurrency Test**:
  Open the web app at `http://localhost:3000`, click the **"⚡ Test Concurrency"** tab in the navigation bar, and click **"▶ Run Live Concurrency Collision Test"**.

---

## 🌐 How to Push to GitHub & Deploy on Vercel

### Step 1: Create a GitHub Repository
1. Go to [github.com](https://github.com) and log into your account.
2. Click **New Repository** (green button).
3. Name your repository (e.g. `kanjak-puja`).
4. Keep it Public or Private, and leave "Initialize with README" **unchecked** (we already have all files ready).
5. Copy the repository URL (e.g., `https://github.com/your-username/kanjak-puja.git`).

### Step 2: Link and Push from your Computer
In your VS Code or Windows PowerShell terminal in this folder (`c:\Users\ansh\Documents\kanjak`), run:

```bash
# Link your remote repository
git remote add origin https://github.com/YOUR_USERNAME/kanjak-puja.git

# Push the code to GitHub
git push -u origin main
```

*(Enter your GitHub username and Personal Access Token or login via browser when prompted).*

### Step 3: 1-Click Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and click **Sign Up** / **Log In** with your GitHub account.
2. Click **Add New...** -> **Project**.
3. Select your newly pushed `kanjak-puja` repository and click **Import**.
4. Vercel automatically detects **Next.js**! Leave all default build settings as is (`npm run build`).
5. Click **Deploy**.
6. Within 60 seconds, Vercel will give you a live production URL (e.g., `https://kanjak-puja.vercel.app`)!

---

## 🗄️ Optional: Connecting Cloud Database (PostgreSQL / Supabase)

The platform works out of the box with built-in persistent storage. For enterprise cloud scaling on Vercel:
1. Create a free project at [supabase.com](https://supabase.com).
2. Open the SQL Editor in Supabase, copy the contents of [`supabase_schema.sql`](file:///c:/Users/ansh/Documents/kanjak/supabase_schema.sql), and click **Run**.
3. Add your `DATABASE_URL` in Vercel **Project Settings -> Environment Variables**.

---

🙏 **शुभ नवरात्रि • माँ दुर्गा की कृपा आप सब पर बनी रहे!**
