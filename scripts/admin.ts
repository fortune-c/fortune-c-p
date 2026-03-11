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

const getApiBase = () => {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    return isLocal ? 'http://localhost:5000/api' : 'https://fortune-c-p-api.onrender.com/api';
};

const ADMIN_API_BASE = getApiBase();

const AUTH_URL = `${ADMIN_API_BASE}/auth`;
const PROJECTS_URL = `${ADMIN_API_BASE}/projects`;
const ABOUT_URL = `${ADMIN_API_BASE}/about`;
const UPLOAD_URL = `${ADMIN_API_BASE}/upload`;

// ── UTILITIES ──────────────────────────────────────────────────────────
const getToken = () => localStorage.getItem('fortune_token');
const setToken = (token: string) => localStorage.setItem('fortune_token', token);
const removeToken = () => localStorage.removeItem('fortune_token');

const authHeaders = () => ({
    'Authorization': `Bearer ${getToken()}`,
    'Content-Type': 'application/json'
});

const isAdminPage = () => window.location.pathname.startsWith('/admin');
const isLoginPage = () => window.location.pathname === '/admin/login';

// ── AUTHENTICATION ─────────────────────────────────────────────────────
async function checkAuth() {
    if (isLoginPage()) {
        const token = getToken();
        if (token) {
            window.location.href = '/admin/dashboard';
            return;
        }

        // Check if admin exists to show setup
        try {
            const resp = await fetch(`${AUTH_URL}/me`, { headers: authHeaders() });
            if (resp.status === 401) {
                // Not logged in, but check if we should show setup
                const existsResp = await fetch(`${AUTH_URL}/setup`, { 
                    method: 'POST', 
                    body: JSON.stringify({ username: '', password: '' }),
                    headers: { 'Content-Type': 'application/json' }
                });
                if (existsResp.status !== 409) {
                    document.getElementById('setup-container')?.classList.remove('hidden');
                }
            }
        } catch (e) {}
        return;
    }

    const token = getToken();
    if (!token) {
        window.location.href = '/admin/login';
        return;
    }

    try {
        const resp = await fetch(`${AUTH_URL}/me`, { headers: authHeaders() });
        if (!resp.ok) throw new Error();
        const data = await resp.json();
        const userEl = document.getElementById('admin-user');
        if (userEl) userEl.textContent = `logged in as @${data.username}`;
    } catch (error) {
        removeToken();
        window.location.href = '/admin/login';
    }
}

// ── PROJECT OPERATIONS ─────────────────────────────────────────────────
async function loadProjects() {
    const container = document.getElementById('projects-list');
    if (!container) return;

    try {
        const resp = await fetch(PROJECTS_URL);
        const projects: Project[] = await resp.json();

        container.innerHTML = '';
        if (projects.length === 0) {
            container.innerHTML = '<div class="col-span-full py-20 text-center font-jetbrains text-white/40 italic">No projects found. Create one!</div>';
            return;
        }

        projects.forEach(p => {
            const card = document.createElement('div');
            card.className = 'group relative bg-black/40 border border-white/10 rounded-sm overflow-hidden hover:border-dark-yellow transition-all duration-300';
            card.innerHTML = `
                <div class="h-48 bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-500" style="background-image: url('${p.imageUrl}')"></div>
                ${p.featured ? '<span class="absolute top-2 left-2 bg-dark-yellow text-dark-green text-[10px] font-bold px-2 py-1 uppercase">Featured</span>' : ''}
                <div class="p-6">
                    <h4 class="font-jetbrains font-bold text-lg text-white mb-1 uppercase">${p.title}</h4>
                    <p class="font-jetbrains text-white/50 text-xs truncate mb-4">${p.subtitle}</p>
                    <div class="flex flex-row gap-3 pt-4 border-t border-white/5">
                        <button class="edit-btn text-dark-yellow text-xs font-jetbrains hover:underline uppercase" data-id="${p.id}">Edit</button>
                        <button class="delete-btn text-red-500/60 text-xs font-jetbrains hover:text-red-500 hover:underline uppercase" data-id="${p.id}">Delete</button>
                    </div>
                </div>
            `;

            card.querySelector('.edit-btn')?.addEventListener('click', () => openModal(p));
            card.querySelector('.delete-btn')?.addEventListener('click', () => deleteProject(p.id!));
            
            container.appendChild(card);
        });
    } catch (err) {
        container.innerHTML = '<div class="col-span-full py-20 text-center text-red-500">Error loading projects.</div>';
    }
}

async function handleProjectSubmit(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const id = formData.get('id') as string;
    const project: any = {
        title: formData.get('title'),
        subtitle: formData.get('subtitle'),
        description: formData.get('description'),
        github: formData.get('github'),
        live: formData.get('live') || '#',
        imageUrl: formData.get('imageUrl'),
        featured: form.querySelector<HTMLInputElement>('#p-featured')?.checked || false,
        order: parseInt(formData.get('order') as string) || 0
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${PROJECTS_URL}/${id}` : PROJECTS_URL;

    try {
        const resp = await fetch(url, {
            method,
            headers: authHeaders(),
            body: JSON.stringify(project)
        });

        if (resp.ok) {
            closeModal();
            loadProjects();
        } else {
            alert('Failed to save project. Status: ' + resp.status);
        }
    } catch (err) {
        alert('Error communicating with server.');
    }
}

async function deleteProject(id: string) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
        const resp = await fetch(`${PROJECTS_URL}/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        });

        if (resp.ok) loadProjects();
        else alert('Delete failed.');
    } catch (er) {
        alert('Server error.');
    }
}

// ── MODAL LOGIC ────────────────────────────────────────────────────────
const modal = document.getElementById('project-modal');
const form = document.getElementById('project-form') as HTMLFormElement;

function openModal(project?: Project) {
    if (!modal || !form) return;
    
    const titleEl = document.getElementById('modal-title');
    if (titleEl) titleEl.textContent = project ? 'Edit Project' : 'New Project';

    // Reset form
    form.reset();
    (document.getElementById('p-id') as HTMLInputElement).value = project?.id || '';
    (document.getElementById('p-title') as HTMLInputElement).value = project?.title || '';
    (document.getElementById('p-subtitle') as HTMLInputElement).value = project?.subtitle || '';
    (document.getElementById('p-desc') as HTMLTextAreaElement).value = project?.description || '';
    (document.getElementById('p-github') as HTMLInputElement).value = project?.github || '';
    (document.getElementById('p-live') as HTMLInputElement).value = project?.live || '';
    (document.getElementById('p-image') as HTMLInputElement).value = project?.imageUrl || '';
    (document.getElementById('p-featured') as HTMLInputElement).checked = project?.featured || false;
    (document.getElementById('p-order') as HTMLInputElement).value = (project?.order ?? 0).toString();

    updatePreview(project?.imageUrl || '');

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeModal() {
    modal?.classList.add('hidden');
    modal?.classList.remove('flex');
}

// ── INITIALIZATION ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();

    if (!isLoginPage()) {
        loadProjects();
        
        document.getElementById('add-project-btn')?.addEventListener('click', () => openModal());
        document.getElementById('close-modal')?.addEventListener('click', closeModal);
        document.getElementById('cancel-modal')?.addEventListener('click', closeModal);
        document.getElementById('logout-btn')?.addEventListener('click', () => {
            removeToken();
            window.location.href = '/admin/login';
        });

        loadAboutInfo();
        document.getElementById('save-about-btn')?.addEventListener('click', saveAboutInfo);
        
        form?.addEventListener('submit', handleProjectSubmit);

        // Image Upload & Preview Listeners
        const uploadInput = document.getElementById('p-upload') as HTMLInputElement;
        uploadInput?.addEventListener('change', handleImageUpload);

        const imageInput = document.getElementById('p-image') as HTMLInputElement;
        imageInput?.addEventListener('input', (e) => {
            updatePreview((e.target as HTMLInputElement).value);
        });
    } else {
        // Login Page Handlers
        const loginForm = document.getElementById('login-form');
        loginForm?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const f = e.target as HTMLFormElement;
            const errEl = document.getElementById('error-message');
            if (errEl) errEl.textContent = '';

            try {
                const resp = await fetch(`${AUTH_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: (f.elements.namedItem('username') as HTMLInputElement).value,
                        password: (f.elements.namedItem('password') as HTMLInputElement).value
                    })
                });

                if (resp.ok) {
                    const data = await resp.json();
                    setToken(data.token);
                    window.location.href = '/admin/dashboard';
                } else {
                    const data = await resp.json();
                    if (errEl) errEl.textContent = data.message || 'Login failed';
                }
            } catch (err) {
                if (errEl) errEl.textContent = 'Server unreachable';
            }
        });

        document.getElementById('setup-btn')?.addEventListener('click', async () => {
            const username = (document.getElementById('username') as HTMLInputElement).value;
            const password = (document.getElementById('password') as HTMLInputElement).value;
            const errEl = document.getElementById('error-message');

            if (!username || !password) {
                if (errEl) errEl.textContent = 'Enter credentials first for setup';
                return;
            }

            try {
                const resp = await fetch(`${AUTH_URL}/setup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                if (resp.ok) {
                    alert('Admin created! Now you can login.');
                    document.getElementById('setup-container')?.classList.add('hidden');
                } else {
                    const data = await resp.json();
                    alert(data.message);
                }
            } catch (e) {
                alert('Connection error during setup.');
            }
        });
    }
});

async function loadAboutInfo() {
    try {
        const resp = await fetch(ABOUT_URL);
        if (resp.ok) {
            const data = await resp.json();
            const bioField = document.getElementById('about-bio') as HTMLTextAreaElement;
            if (bioField) bioField.value = data.bio || '';
            
            const gitHubField = document.getElementById('social-github') as HTMLInputElement;
            if (gitHubField) gitHubField.value = data.socials?.gitHub || '';
            
            const linkedInField = document.getElementById('social-linkedin') as HTMLInputElement;
            if (linkedInField) linkedInField.value = data.socials?.linkedIn || '';
            
            const instagramField = document.getElementById('social-instagram') as HTMLInputElement;
            if (instagramField) instagramField.value = data.socials?.instagram || '';
            
            const dribbbleField = document.getElementById('social-dribbble') as HTMLInputElement;
            if (dribbbleField) dribbbleField.value = data.socials?.dribbble || '';
            
            const behanceField = document.getElementById('social-behance') as HTMLInputElement;
            if (behanceField) behanceField.value = data.socials?.behance || '';
        }
    } catch (err) {
        console.error('Failed to load about info:', err);
    }
}

async function saveAboutInfo() {
    const btn = document.getElementById('save-about-btn') as HTMLButtonElement;
    if (!btn) return;

    const originalText = btn.textContent;
    btn.textContent = 'SAVING...';
    btn.disabled = true;

    const info = {
        bio: (document.getElementById('about-bio') as HTMLTextAreaElement).value,
        socials: {
            gitHub: (document.getElementById('social-github') as HTMLInputElement).value,
            linkedIn: (document.getElementById('social-linkedin') as HTMLInputElement).value,
            instagram: (document.getElementById('social-instagram') as HTMLInputElement).value,
            dribbble: (document.getElementById('social-dribbble') as HTMLInputElement).value,
            behance: (document.getElementById('social-behance') as HTMLInputElement).value
        }
    };

    try {
        const resp = await fetch(ABOUT_URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(info)
        });

        if (resp.ok) {
            alert('About information updated successfully!');
        } else {
            alert('Failed to update about information.');
        }
    } catch (err) {
        console.error('Error saving about info:', err);
        alert('Error connecting to server.');
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

// ── IMAGE UPLOAD HANDLING ────────────────────────────────────────────────
async function handleImageUpload(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const formData = new FormData();
    formData.append('file', file!);

    // Show loading state in preview
    const placeholder = document.getElementById('preview-placeholder');
    if (placeholder) placeholder.textContent = 'Uploading...';

    try {
        const resp = await fetch(UPLOAD_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${getToken()}`
                // Note: Don't set Content-Type header for FormData, browser does it automatically with boundary
            },
            body: formData
        });

        if (resp.ok) {
            const data = await resp.json();
            const imageUrl = data.url;
            
            // Update input and preview
            const imageInput = document.getElementById('p-image') as HTMLInputElement;
            if (imageInput) imageInput.value = imageUrl;
            updatePreview(imageUrl);
        } else {
            alert('Upload failed. Status: ' + resp.status);
            if (placeholder) placeholder.textContent = 'Upload failed';
        }
    } catch (err) {
        console.error('Upload Error:', err);
        alert('Error uploading image.');
        if (placeholder) placeholder.textContent = 'Error uploading';
    } finally {
        input.value = ''; // Reset file input
    }
}

function updatePreview(url: string) {
    const preview = document.getElementById('p-preview') as HTMLImageElement;
    const placeholder = document.getElementById('preview-placeholder');
    
    if (!url) {
        preview?.classList.add('hidden');
        if (placeholder) {
            placeholder.classList.remove('hidden');
            placeholder.textContent = 'No image selected';
        }
        return;
    }

    if (preview) {
        // Handle both relative and absolute URLs
        // Note: Backend returns /uploads/..., which needs to be prefixed with backend URL if not on main domain
        const apiDomain = ADMIN_API_BASE.replace('/api', '');
        const fullUrl = url.startsWith('http') ? url : (url.startsWith('/') ? `${apiDomain}${url}` : url);
        
        preview.src = fullUrl;
        preview.classList.remove('hidden');
        placeholder?.classList.add('hidden');
    }
}
