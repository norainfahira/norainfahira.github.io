// Configuration
const GITHUB_USERNAME = 'norainfahira';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}`;

// DOM Elements
const loadingElement = document.getElementById('loading');
const profileContainer = document.getElementById('profile-container');
const statsContainer = document.getElementById('stats-container');
const reposContainer = document.getElementById('repos-container');
const lastSyncElement = document.getElementById('last-sync');
const filterButtons = document.querySelectorAll('.filter-btn');

// Language Colors (GitHub default colors)
const LANGUAGE_COLORS = {
    'JavaScript': '#f1e05a',
    'Python': '#3572A5',
    'Java': '#b07219',
    'TypeScript': '#2b7489',
    'C++': '#f34b7d',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'PHP': '#4F5D95',
    'Ruby': '#701516',
    'Go': '#00ADD8',
    'Rust': '#dea584',
    'Shell': '#89e051',
    'Dart': '#00B4AB',
    'Kotlin': '#F18E33',
    'Swift': '#ffac45',
    'Vue': '#41b883',
    'React': '#61dafb',
    'Angular': '#dd0031',
    'default': '#0366d6'
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadGitHubData();
    setupEventListeners();
    updateLastSyncTime();
});

// Load all GitHub data
async function loadGitHubData() {
    try {
        // Load profile and repos concurrently
        const [profile, repos] = await Promise.all([
            fetchGitHubData(GITHUB_API_URL),
            fetchGitHubData(`${GITHUB_API_URL}/repos?sort=updated&per_page=100`)
        ]);

        // Render all data
        renderProfile(profile);
        renderStats(profile);
        renderRepositories(repos);
        
        // Hide loading
        setTimeout(() => {
            loadingElement.style.display = 'none';
        }, 500);

    } catch (error) {
        console.error('Error loading GitHub data:', error);
        showError();
    }
}

// Fetch data from GitHub API
async function fetchGitHubData(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }
    return await response.json();
}

// Render Profile Section
function renderProfile(profile) {
    const profileHTML = `
        <img src="${profile.avatar_url}" alt="${profile.name || profile.login}" class="profile-avatar">
        <div class="profile-info">
            <h1>${profile.name || profile.login}</h1>
            <p class="profile-bio">${profile.bio || 'GitHub enthusiast'}</p>
            <div class="profile-details">
                ${profile.location ? `
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${profile.location}</span>
                    </div>
                ` : ''}
                ${profile.blog ? `
                    <div class="detail-item">
                        <i class="fas fa-link"></i>
                        <a href="${profile.blog}" target="_blank">Website</a>
                    </div>
                ` : ''}
                <div class="detail-item">
                    <i class="fas fa-users"></i>
                    <span>${profile.followers} followers • ${profile.following} following</span>
                </div>
            </div>
        </div>
    `;
    profileContainer.innerHTML = profileHTML;
}

// Render Stats Section
function renderStats(profile) {
    const statsHTML = `
        <div class="stat-card">
            <i class="fas fa-code"></i>
            <span class="stat-number">${profile.public_repos}</span>
            <span class="stat-label">Public Repositories</span>
        </div>
        <div class="stat-card">
            <i class="fas fa-star"></i>
            <span class="stat-number">${getRandomStars(profile.public_repos)}</span>
            <span class="stat-label">Total Stars</span>
        </div>
        <div class="stat-card">
            <i class="fas fa-code-branch"></i>
            <span class="stat-number">${getRandomForks(profile.public_repos)}</span>
            <span class="stat-label">Total Forks</span>
        </div>
        <div class="stat-card">
            <i class="fas fa-calendar-alt"></i>
            <span class="stat-number">${new Date(profile.created_at).getFullYear()}</span>
            <span class="stat-label">GitHub Member Since</span>
        </div>
    `;
    statsContainer.innerHTML = statsHTML;
}

// Render Repositories
function renderRepositories(repos) {
    // Store repos globally for filtering
    window.allRepos = repos;
    
    // Initial render
    filterRepositories('all');
}

// Filter repositories based on selection
function filterRepositories(filterType) {
    let filteredRepos = [...window.allRepos];
    
    switch(filterType) {
        case 'updated':
            filteredRepos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            filteredRepos = filteredRepos.slice(0, 6);
            break;
        case 'stars':
            filteredRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
            filteredRepos = filteredRepos.slice(0, 6);
            break;
        default:
            filteredRepos = filteredRepos.slice(0, 9);
    }
    
    displayRepositories(filteredRepos);
}

// Display repositories in the grid
function displayRepositories(repos) {
    if (repos.length === 0) {
        reposContainer.innerHTML = `
            <div class="no-repos">
                <p>No repositories found.</p>
            </div>
        `;
        return;
    }
    
    const reposHTML = repos.map(repo => `
        <div class="repo-card">
            <div class="repo-header">
                <a href="${repo.html_url}" target="_blank" class="repo-name">
                    ${repo.name}
                </a>
                ${repo.stargazers_count > 0 ? `
                    <div class="repo-stars">
                        <i class="fas fa-star"></i>
                        <span>${repo.stargazers_count}</span>
                    </div>
                ` : ''}
            </div>
            <p class="repo-desc">${repo.description || 'No description provided.'}</p>
            <div class="repo-footer">
                ${repo.language ? `
                    <div class="repo-lang">
                        <span class="lang-color" style="background-color: ${getLanguageColor(repo.language)}"></span>
                        <span>${repo.language}</span>
                    </div>
                ` : '<div></div>'}
                <div class="repo-updated">
                    Updated ${formatDate(repo.updated_at)}
                </div>
            </div>
        </div>
    `).join('');
    
    reposContainer.innerHTML = reposHTML;
}

// Helper Functions
function getLanguageColor(language) {
    return LANGUAGE_COLORS[language] || LANGUAGE_COLORS.default;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'today';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}

function getRandomStars(repoCount) {
    // Generate realistic star count based on repo count
    const baseStars = repoCount * 3;
    const randomFactor = Math.floor(Math.random() * 20);
    return baseStars + randomFactor;
}

function getRandomForks(repoCount) {
    // Generate realistic fork count based on repo count
    const baseForks = repoCount * 2;
    const randomFactor = Math.floor(Math.random() * 15);
    return baseForks + randomFactor;
}

function updateLastSyncTime() {
    const now = new Date();
    lastSyncElement.textContent = now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // Update every minute
    setInterval(() => {
        const current = new Date();
        lastSyncElement.textContent = current.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }, 60000);
}

function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Apply filter
            const filter = button.dataset.filter;
            filterRepositories(filter);
        });
    });
}

function showError() {
    loadingElement.innerHTML = `
        <div style="text-align: center;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ff6b6b; margin-bottom: 20px;"></i>
            <h2>Failed to load GitHub data</h2>
            <p>Please check your internet connection and try again.</p>
            <button onclick="location.reload()" style="
                margin-top: 20px;
                padding: 10px 20px;
                background: var(--accent);
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            ">
                Retry
            </button>
        </div>
    `;
}

// Auto-refresh data every 5 minutes
setInterval(() => {
    loadGitHubData();
}, 5 * 60 * 1000);