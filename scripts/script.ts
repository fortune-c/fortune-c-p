interface Project {
    title: string;
    subtitle: string;
    description: string;
    github: string;
    live: string;
    imageClass: string;
}

const projects: Project[] = [
    {
        title: "CivicVotes",
        subtitle: "Election & Voting Management System",
        description: "CivicVotes is a production-ready Election & Voting Management System built with ASP.NET Core Web API. It provides comprehensive features for managing elections, candidates, and secure voting with role-based access control.",
        github: "https://github.com/fortune-c/civicvote",
        live: "#",
        imageClass: "url('../assets/projects-preview/CivicVotes.png')"
    },
    {
        title: "PORTFOLIO",
        subtitle: "Personal Website ",
        description: "A modern developer portfolio website built to showcase my projects, skills, and experience. The site is designed with performance, responsiveness, and maintainability in mind.",
        github: "https://github.com/fortune-c/fortune-c-p",
        live: "#",
        imageClass: "url('../assets/projects-preview/portfolio.png')"
    },
    {
        title: "Netus",
        subtitle: "C Networking Project",
        description: "Netus is a minimal HTTP server written from scratch in C, implementing core components directly on top of POSIX sockets to explore low-level networking.",
        github: "https://github.com/fortune-c/netus",
        live: "#",
        imageClass: "url('../assets/projects-preview/Netus.png')"
    },
    {
        title: "",
        subtitle: "",
        description: "",
        github: "#",
        live: "#",
        imageClass: ""
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const mainTitle = document.getElementById('project-title') as HTMLElement | null;
    const mainSubtitle = document.getElementById('project-subtitle') as HTMLElement | null;
    const mainDescription = document.getElementById('project-desc') as HTMLElement | null;
    const mainGithub = document.getElementById('project-github') as HTMLAnchorElement | null;
    const mainLive = document.getElementById('project-live') as HTMLAnchorElement | null;
    const mainImage = document.getElementById('project-main-image') as HTMLElement | null;
    const thumbnails = document.querySelectorAll<HTMLElement>('.project-thumbnail');

    if (!mainTitle || !thumbnails.length) return;

    thumbnails.forEach((thumb: HTMLElement, index: number) => {
        const p: Project | undefined = projects[index];
        if (!p) return;

        thumb.style.backgroundImage = p.imageClass;
        thumb.classList.add('bg-cover', 'bg-center');

        thumb.addEventListener('click', () => {
            if (mainTitle) mainTitle.style.opacity = '0';
            if (mainSubtitle) mainSubtitle.style.opacity = '0';
            if (mainDescription) mainDescription.style.opacity = '0';
            if (mainImage) mainImage.style.opacity = '0';

            setTimeout(() => {
                if (mainTitle) mainTitle.textContent = p.title;
                if (mainSubtitle) mainSubtitle.textContent = p.subtitle;
                if (mainDescription) mainDescription.textContent = p.description;
                if (mainGithub) mainGithub.href = p.github;
                if (mainLive) mainLive.href = p.live;

                if (mainImage) {
                    mainImage.className = 'w-full h-full rounded-sm transition-opacity duration-300 bg-cover bg-center';
                    mainImage.style.backgroundImage = p.imageClass;
                }

                thumbnails.forEach((t: Element) => {
                    t.classList.remove('border-light-yellow', 'scale-105');
                    t.classList.add('border-dark-yellow');
                });
                thumb.classList.remove('border-dark-yellow');
                thumb.classList.add('border-light-yellow', 'scale-105');

                if (mainTitle) mainTitle.style.opacity = '1';
                if (mainSubtitle) mainSubtitle.style.opacity = '1';
                if (mainDescription) mainDescription.style.opacity = '1';
                if (mainImage) mainImage.style.opacity = '1';
            }, 300);
        });
    });

    (thumbnails[0] as HTMLElement).click();
});
