const projects = [
    {
        title: "VOTER API",
        subtitle: "Voter Api design",
        description: "CivicVotes is a production-ready Election & Voting Management System built with ASP.NET Core Web API. It provides comprehensive features for managing elections, candidates, and secure voting with role-based access control.",
        github: "#",
        live: "#",
        imageClass: "url('../assets/project-bg.png')"
    },
    {
        title: "PORTFOLIO",
        subtitle: "Personal Website Redesign",
        description: "A highly interactive, aesthetic portfolio featuring ASCII art translations, custom CSS animations, and a responsive Tailwind CSS grid layout tailored carefully from Figma designs.",
        github: "#",
        live: "#",
        imageClass: "url('../assets/project-thumbnails-bg.png')"
    },
    {
        title: "P2P SERVER",
        subtitle: "C++ Networking Project",
        description: "A custom multithreaded Peer-to-Peer server built from scratch in C++. Handles concurrent connections, HTTP routing, and custom binary protocols without memory leaks.",
        github: "#",
        live: "#",
        imageClass: "url('../assets/bg.png')"
    },
    {
        title: "INVENTORY APP",
        subtitle: "Fullstack Dashboard App",
        description: "A comprehensive pharmacy inventory app featuring secure database access, interactive component views, and complex backend deployment configurations on Render.",
        github: "#",
        live: "#",
        imageClass: "url('../assets/hero.svg')"
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const mainTitle = document.getElementById('project-title');
    const mainSubtitle = document.getElementById('project-subtitle');
    const mainDescription = document.getElementById('project-desc');
    const mainGithub = document.getElementById('project-github');
    const mainLive = document.getElementById('project-live');
    const mainImage = document.getElementById('project-main-image');
    const thumbnails = document.querySelectorAll('.project-thumbnail');

    if (!mainTitle || !thumbnails.length) return;

    thumbnails.forEach((thumbElement, index) => {
        const thumb = thumbElement;
        const p = projects[index];
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

                thumbnails.forEach(t => {
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

    (thumbnails[0]).click();
});
