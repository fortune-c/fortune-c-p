const ABOUT_API_URL = 'https://fortune-c-p-api.onrender.com/api/about';

async function fetchAboutInfo() {
    try {
        const response = await fetch(ABOUT_API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error('About info fetch failed:', error);
        return null;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const aboutContent = document.getElementById('about-content');
    const links = {
        github: document.getElementById('link-github') as HTMLAnchorElement,
        linkedin: document.getElementById('link-linkedin') as HTMLAnchorElement,
        instagram: document.getElementById('link-instagram') as HTMLAnchorElement,
        dribbble: document.getElementById('link-dribbble') as HTMLAnchorElement,
        behance: document.getElementById('link-behance') as HTMLAnchorElement
    };

    const data = await fetchAboutInfo();
    if (!data) return;

    // Populate Bio
    if (aboutContent && data.bio) {
        // Split by double newline to create paragraphs
        const paragraphs = data.bio.split('\n\n');
        aboutContent.innerHTML = paragraphs.map((p: string, index: number) => {
            const marginClass = index === 1 ? 'mt-4 max-sm:mt-3 ml-6 max-sm:ml-2' : 
                               (index > 1 ? 'mt-4 max-sm:mt-3' : '');
            
            return `<p class="font-jetbrains text-[13px] max-lg:text-[12px] max-sm:text-[11px] leading-[1.7] text-white/90 tracking-wider ${marginClass}">${p}</p>`;
        }).join('');
    }

    // Populate Socials
    if (data.socials) {
        const socials = data.socials;
        if (socials.gitHub && links.github) {
            links.github.href = socials.gitHub;
            links.github.classList.remove('hidden');
        }
        if (socials.linkedIn && links.linkedin) {
            links.linkedin.href = socials.linkedIn;
            links.linkedin.classList.remove('hidden');
        }
        if (socials.instagram && links.instagram) {
            links.instagram.href = socials.instagram;
            links.instagram.classList.remove('hidden');
        }
        if (socials.dribbble && links.dribbble) {
            links.dribbble.href = socials.dribbble;
            links.dribbble.classList.remove('hidden');
        }
        if (socials.behance && links.behance) {
            links.behance.href = socials.behance;
            links.behance.classList.remove('hidden');
        }
    }
});
