# 🌐 fortune-c | Personal Portfolio

A modern, highly interactive **developer portfolio** built to showcase my projects, skills, and experience.
Designed with a focus on aesthetics, smooth animations, and full responsiveness across all devices.

It includes a **public-facing portfolio website** and a planned **C# / ASP.NET Core admin panel** for managing portfolio content dynamically.

---

## 🚀 Tech Stack

### Frontend

* **HTML5** — Semantic page structure
* **Tailwind CSS v4** — Utility-first styling with custom theme tokens
* **TypeScript** — Type-safe scripting compiled to JS
* **Vanilla CSS** — Custom animations (crossfade, dust particles, page transitions)

### Backend (Admin Panel — Planned)

* **C# / ASP.NET Core** — REST API for managing portfolio content
* **Entity Framework Core** — ORM for database access
* **SQL Server / PostgreSQL** — Persistent data storage
* **JWT Authentication** — Secure admin access

### Fonts & Assets

* **Porter Sans Block** — Local custom font for headings
* **Chela One** — Google Fonts, navigation & display text
* **JetBrains Mono** — Monospace body/code text
* **Bitcount Ink** — Decorative display use
* **Poppins** — Secondary display font

### Development Tools

* **Git & GitHub** — Version control
* **npm** — Dependency management & build scripts
* **tsc** — TypeScript compiler

---

## ✨ Features

* 🎨 **Premium UI Design** — Dark green palette, golden accents, glassmorphism
* 📱 **Fully Responsive** — Mobile, tablet, and desktop layouts
* 🎞️ **Page Transition Animations** — Smooth dark fade between all pages
* 🖼️ **Staggered Entrance Animations** — Content fades and slides in on load
* 🧩 **Interactive Project Gallery** — Click thumbnails to switch between projects
* 🎭 **ASCII Art Avatar** — Animated crossfade with dust particle effects (About page)
* 📬 **Contact Section** — Social media links with hover effects
* ⚡ **Fast & Lightweight** — No heavy frameworks, pure HTML/CSS/TS
* 🔐 **Admin Panel** — C# / ASP.NET Core REST API for dynamic content management
* 📝 **Dynamic Content** — Manage projects, bio, and links via an authenticated dashboard

---

## 📂 Project Structure

```
├── admin/               # Admin Panel
│   ├── frontend/        # Admin UI (Login & Dashboard)
│   └── backend/         # C# / ASP.NET Core Solution
│       └── backend/     # Core API Project
│           ├── Controllers/ 
│           ├── Models/      
│           ├── Services/    
│           └── Program.cs   
│
├── assets/              # Images, SVGs, fonts, icons
│   ├── ascii-me/        # ASCII avatar animation frames + dust particles
│   └── fonts/           # Local font files
│
├── structure/           # Public HTML pages
│   ├── index.html       # Home / landing page
│   ├── about.html       # About me page
│   ├── project.html     # Project gallery page
│   └── contact.html     # Contact page
│
├── scripts/             # TypeScript source files
│   ├── script.ts        # Project gallery logic
│   ├── admin.ts         # Admin panel logic
│   ├── transitions.ts   # Page transition engine
│   └── dist/            # Compiled JS output
│
├── styles/
│   ├── input.css        # Tailwind source + tokens
│   └── output.css       # Compiled CSS
│
├── pyscript/
│   └── generate_ascii.py # ASCII generation script
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🖥️ Installation & Setup

Clone the repository:

```bash
git clone https://github.com/fortune-c/fortune-c-p.git
```

Navigate into the project folder:

```bash
cd fortune-c-p
```

Install dependencies:

```bash
npm install
```

Run the development watchers (CSS + TypeScript in parallel):

```bash
npm run dev
```

> This runs `tailwindcss --watch` and `tsc --watch` concurrently.

To build once without watching:

```bash
npm run build:css   # Compile Tailwind CSS
npx tsc             # Compile TypeScript
```

---

## 📸 Screenshots

*Screenshots coming soon.*

---

## 🌍 Live Demo

Coming soon.

---

## 📬 Contact

If you'd like to collaborate or connect:

* GitHub: [fortune-c](https://github.com/fortune-c)

---

⭐ If you like this project, consider giving it a star!

---
