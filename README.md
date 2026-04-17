# 🎮 PulsePlay

> Match your heartbeat to music. Connect an Arduino pulse sensor or enter your BPM manually — PulsePlay finds songs that sync with your rhythm.

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/isajunio/WSICS-Mentorship-Spring-2026.git
cd WSICS-Mentorship-Spring-2026
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in **Chrome or Edge** (required for Arduino Web Serial support).

---

## 🔌 Arduino Setup (optional)

PulsePlay supports live BPM reading from a [PulseSensor](https://pulsesensor.com/) connected to an Arduino.

**Hardware needed:**
- Arduino Uno (or compatible)
- PulseSensor Amped (connected to pin A0)

**Steps:**
1. Install the [PulseSensor Playground library](https://github.com/WorldFamousElectronics/PulseSensorPlayground) in Arduino IDE
2. Open `File → Examples → PulseSensor Playground → PulseSensor_BPM`
3. Upload the sketch to your Arduino
4. Close Arduino IDE's Serial Monitor / Serial Plotter completely
5. In PulsePlay, click **Connect Arduino** and select your port
6. Place your finger on the sensor and hold still

> ⚠️ Web Serial API requires **Chrome or Edge**. Safari and Firefox are not supported.

---

## ✏️ Manual Mode

No Arduino? No problem. Switch to **Manual Input**, enter your BPM using the `+` / `−` buttons or the slider, and click **Find Songs**.

---

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 16 + Turbopack | Framework |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| Web Serial API | Arduino communication |
| iTunes Search API | Song discovery |
| Vercel Analytics | Usage tracking |
| R Studio | User pulse comparer to existing data |

---

## 📦 Build for Production

```bash
npm run build
npm run start
```

---

## 🌐 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Or connect the GitHub repo directly at [vercel.com](https://vercel.com).

---

Built for WICS Mentorship Spring 2026 · Arizona State University
