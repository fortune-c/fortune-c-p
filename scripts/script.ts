export {};

interface Project {
    id?: string;
    title: string;
    subtitle: string;
    description: string;
    github: string;
    live: string;
    imageUrl: string;
    tags?: string[];
    featured?: boolean;
    order?: number;
}

const API_URL = 'https://fortune-c-p-api.onrender.com/api/projects';

// Local Fallback Data (used only if backend is unreachable)
const localFallbackProjects: Project[] = [
    {
        title: "CivicVotes",
        subtitle: "Election & Voting Management System",
        description: "CivicVotes is a production-ready Election & Voting Management System built with ASP.NET Core Web API. It provides comprehensive features for managing elections, candidates, and secure voting with role-based access control.",
        github: "https://github.com/fortune-c/civicvote",
        live: "#",
        imageUrl: "../assets/projects-preview/CivicVotes.png"
    },
    {
        title: "PORTFOLIO",
        subtitle: "Personal Website",
        description: "A modern developer portfolio website built to showcase my projects, skills, and experience. The site is designed with performance, responsiveness, and maintainability in mind.",
        github: "https://github.com/fortune-c/fortune-c-p",
        live: "#",
        imageUrl: "../assets/projects-preview/portfolio.png"
    },
    {
        title: "Netus",
        subtitle: "C Networking Project",
        description: "Netus is a minimal HTTP server written from scratch in C, implementing core components directly on top of POSIX sockets to explore low-level networking.",
        github: "https://github.com/fortune-c/netus",
        live: "#",
        imageUrl: "../assets/projects-preview/Netus.png"
    }
];

async function fetchProjects(): Promise<Project[]> {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.length > 0 ? data : localFallbackProjects;
    } catch (error) {
        console.warn('Backend fetch failed, using local fallback:', error);
        return localFallbackProjects;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const mainTitle = document.getElementById('project-title') as HTMLElement | null;
    const mainSubtitle = document.getElementById('project-subtitle') as HTMLElement | null;
    const mainDescription = document.getElementById('project-desc') as HTMLElement | null;
    const mainGithub = document.getElementById('project-github') as HTMLAnchorElement | null;
    const mainLive = document.getElementById('project-live') as HTMLAnchorElement | null;
    const mainImage = document.getElementById('project-main-image') as HTMLElement | null;
    const thumbnailsContainer = document.getElementById('thumbnails-container');

    if (!mainTitle || !thumbnailsContainer) return;

    // Clear and fetch projects
    thumbnailsContainer.innerHTML = '';
    const projects = await fetchProjects();

    // Create thumbnails dynamically
    const thumbnailElements: HTMLElement[] = [];

    projects.forEach((p, index) => {
        const thumb = document.createElement('div');
        thumb.className = 'project-thumbnail flex-1 border border-dark-yellow rounded-sm cursor-pointer hover:border-light-yellow transition-all duration-200 bg-cover bg-center';
        thumb.style.backgroundImage = `url(${p.imageUrl})`;
        
        // Add click listener
        thumb.addEventListener('click', () => {
            // Animate disappearance
            const elementsToAnimate = [mainTitle, mainSubtitle, mainDescription, mainImage];
            elementsToAnimate.forEach(el => { if (el) el.style.opacity = '0'; });

            setTimeout(() => {
                if (mainTitle) mainTitle.textContent = p.title;
                if (mainSubtitle) mainSubtitle.textContent = p.subtitle;
                if (mainDescription) mainDescription.textContent = p.description;
                if (mainGithub) mainGithub.href = p.github;
                if (mainLive) mainLive.href = p.live;

                if (mainImage) {
                    mainImage.className = 'w-full h-full rounded-sm transition-opacity duration-300 bg-cover bg-center';
                    mainImage.style.backgroundImage = `url(${p.imageUrl})`;
                }

                // Update thumbnail states
                thumbnailElements.forEach((t) => {
                    t.classList.remove('border-light-yellow', 'scale-105');
                    t.classList.add('border-dark-yellow');
                });
                thumb.classList.remove('border-dark-yellow');
                thumb.classList.add('border-light-yellow', 'scale-105');

                // Animate appearance
                elementsToAnimate.forEach(el => { if (el) el.style.opacity = '1'; });
            }, 300);
        });

        thumbnailElements.push(thumb);
        thumbnailsContainer.appendChild(thumb);
    });

    // Select the first project by default
    const firstThumb = thumbnailElements[0];
    if (firstThumb) {
        firstThumb.click();
    }
});
