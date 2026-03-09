# 🌐 fortune-c | Personal Portfolio

A modern, highly interactive **developer portfolio** built to showcase my projects, skills, and experience. 
Designed with a focus on aesthetics, smooth animations, and full responsiveness across all devices.

It features a **monorepo architecture** containing a public-facing portfolio website and a fully operational **C# / ASP.NET Core admin panel** for managing content dynamically via a real-time database.

---

## 🚀 Tech Stack

### Frontend (Portfolio & Admin)
*   **HTML5 & TypeScript** — Semantic structure with type-safe scripting
*   **Tailwind CSS v4** — Utility-first styling with custom theme tokens
*   **Vanilla CSS** — Custom animations (crossfade, dust particles, page transitions)

### Backend (Admin API)
*   **C# / ASP.NET Core (net10.0)** — REST API following modern practices
*   **MongoDB Atlas** — NoSQL database for flexible data management
*   **JWT Authentication** — Secure token-based access for the admin dashboard
*   **Docker** — Containerized deployment for consistent environments

### Infrastructure
*   **Vercel** — Automated frontend deployment
*   **Render** — Container-based backend hosting (Docker)

---

## ✨ Features

*   🎨 **Premium UI Design** — Dark green palette, golden accents, and glassmorphism
*   📱 **Fully Responsive** — Seamless transitions between mobile, tablet, and desktop
*   🎞️ **Page Transitions** — Smooth interactive dark fade between all pages
*   🧩 **Dynamic Project Gallery** — Interactive thumbnails synchronized with the MongoDB collection
*   🎭 **ASCII Art Avatar** — Animated character with dust effects on the About page
*   🔐 **Secure Admin Panel** — Authenticated dashboard for real-time bio and project updates
*   🔄 **Cross-Page Sync** — Social media links are managed in one place and updated across the whole site automatically

---

## 📂 Project Structure

```
├── admin/               # Admin Portal
│   ├── frontend/        # Dashboard & Login UI
│   └── backend/         # ASP.NET Core monorepo entry
│       ├── backend/     # Core Business Logic
│       │   ├── Controllers/ # API Endpoints (Projects, About, Auth)
│       │   ├── Models/      # MongoDB Schema & DTOs
│       │   ├── Services/    # Data persistence & Business Logic
│       │   └── Program.cs   # API Configuration & CORS
│       └── Dockerfile   # Container configuration for Render
│
├── assets/              # Static assets (Images, SVGs, Fonts)
├── structure/           # Public Portfolio HTML pages
├── scripts/             # TypeScript source & compiled JS output
├── styles/              # Tailwind and custom CSS tokens
├── package.json         # Main project dependencies
└── README.md
```

---

## 🖥️ Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/fortune-c/fortune-c-p.git
    cd fortune-c-p
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

3.  **Run Dev Watchers (UI):**
    ```bash
    npm run dev
    ```

4.  **Launch Backend (Requires .NET 10 SDK):**
    ```bash
    cd admin/backend/backend
    dotnet run
    ```
    *Note: Ensure you have your MongoDB connection string in a local `appsettings.json` or as an environment variable.*

---

## 🌍 Live Project

*   **Portfolio Website:** [fortune-c.vercel.app](https://fortune-c.vercel.app/)
*   **API Base:** [fortune-c-p-api.onrender.com](https://fortune-c-p-api.onrender.com/health)

---

## 📬 Contact

If you'd like to collaborate or connect:

*   GitHub: [fortune-c](https://github.com/fortune-c)

---

⭐ If you like this project, consider giving it a star!

