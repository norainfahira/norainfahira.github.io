/**
 * GitHub Portfolio - Minimal JavaScript Enhancement
 * 
 * This script follows progressive enhancement principles:
 * - All core content works without JavaScript
 * - JavaScript only enhances the experience
 * - Graceful degradation for older browsers
 */

// Configuration
const CONFIG = {
    GITHUB_USERNAME: 'norainfahira',
    GITHUB_API: 'https://api.github.com',
    UPDATE_INTERVAL: 5 * 60 * 1000, // 5 minutes
    CONTRIBUTION_DAYS: 371 // GitHub contribution graph days
};

// State Management
const State = {
    theme: localStorage.getItem('theme') || 'light',
    repos: [],
    userData: null
};

// DOM Elements
const DOM = {
    themeToggle: document.getElementById('themeToggle'),
    repoCount: document.getElementById('repo-count'),
    followersCount: document.getElementById('followers-count'),
    followingCount: document.getElementById('following-count'),
    memberSince: document.getElementById('member-since'),
    profileBio: document.getElementById('profile-bio'),
    profileInfo: document.getElementById('profile-info'),
    reposContainer: document.getElementById('repos-container'),
    contributionsContainer: document.getElementById('contributions-container'),
    totalContributions: document.getElementById('total-contributions'),
    longestStreak: document.getElementById('longest-streak'),
    currentStreak: document.getElementById('current-streak'),
    contactForm: document.getElementById('contactForm'),
    currentYear: document.getElementById('current-year'),
    lastUpdated: document.getElementById('last-updated'),
    filterButtons: document.querySelectorAll('.filter-btn')
};

// Utility Functions
const Utils = {
    /**
     * Format date to relative time
     */
    formatDate(dateString) {
        if (!dateString) return 'Unknown';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    },

    /**
     * Format number with commas
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    /**
     * Get language color
     */
    getLanguageColor(language) {
        const colors = {
            'JavaScript': '#f1e05a',
            'Python': '#3572A5',
            'Java': '#b07219',
            'TypeScript': '#2b7489',
            'HTML': '#e34c26',
            'CSS': '#563d7c',
            'PHP': '#4F5D95',
            'Ruby': '#701516',
            'Go': '#00ADD8',
            'Rust': '#dea584',
            'Shell': '#89e051'
        };
        return colors[language] || '#0366d6';
    },

    /**
     * Debounce function for performance
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Theme Management
const ThemeManager = {
    init() {
        this.applyTheme();
        this.setupEventListeners();
    },

    applyTheme() {
        document.documentElement.setAttribute('data-theme', State.theme);
        this.updateToggleIcon();
    },

    updateToggleIcon() {
        const icon = DOM.themeToggle.querySelector('i');
        const text = DOM.themeToggle.querySelector('.visually-hidden');
        
        if (State.theme === 'dark') {
            icon.className = 'fas fa-sun';
            text.textContent = 'Light Mode';
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = 'Dark Mode';
        }
    },

    toggleTheme() {
        State.theme = State.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', State.theme);
        this.applyTheme();
    },

    setupEventListeners() {
        if (DOM.themeToggle) {
            DOM.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
};

// GitHub Data Fetcher
const GitHubFetcher = {
    /**
     * Fetch data from GitHub API
     */
    async fetch(endpoint) {
        try {
            const response = await fetch(`${CONFIG.GITHUB_API}${endpoint}`);
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            // Check rate limit
            const remaining = response.headers.get('X-RateLimit-Remaining');
            if (remaining && parseInt(remaining) < 10) {
                console.warn('GitHub API rate limit low:', remaining);
            }
            
            return await response.json();
        } catch (error) {
            console.error('GitHub fetch error:', error);
            throw error;
        }
    },

    /**
     * Load all GitHub data
     */
    async loadAllData() {
        try {
            const [user, repos] = await Promise.all([
                this.fetch(`/users/${CONFIG.GITHUB_USERNAME}`),
                this.fetch(`/users/${CONFIG.GITHUB_USERNAME}/repos?per_page=100&sort=updated`)
            ]);

            State.userData = user;
            State.repos = repos;

            return { user, repos };
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    },

    /**
     * Handle fetch errors gracefully
     */
    handleError(error) {
        // Show error in UI but don't break the page
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.innerHTML = `
            <div class="card" style="background: #fee; border-color: #f00;">
                <h3>Unable to Load GitHub Data</h3>
                <p>The page will still work, but live data from GitHub is unavailable.</p>
                <p><small>Error: ${error.message}</small></p>
            </div>
        `;
        
        const firstSection = document.querySelector('section');
        if (firstSection) {
            firstSection.parentNode.insertBefore(errorMessage, firstSection);
        }
    }
};

// UI Renderer
const UIRenderer = {
    /**
     * Render profile statistics
     */
    renderProfile(user) {
        if (!user) return;

        // Update stats
        if (DOM.repoCount) {
            DOM.repoCount.textContent = Utils.formatNumber(user.public_repos);
        }
        
        if (DOM.followersCount) {
            DOM.followersCount.textContent = Utils.formatNumber(user.followers);
        }
        
        if (DOM.followingCount) {
            DOM.followingCount.textContent = Utils.formatNumber(user.following);
        }
        
        if (DOM.memberSince) {
            DOM.memberSince.textContent = new Date(user.created_at).getFullYear();
        }

        // Update bio
        if (DOM.profileBio) {
            DOM.profileBio.innerHTML = `
                <p>${user.bio || 'Passionate about coding and open source.'}</p>
            `;
        }

        // Update profile info
        if (DOM.profileInfo) {
            const location = user.location ? `<li><i class="fas fa-map-marker-alt"></i> ${user.location}</li>` : '';
            const website = user.blog ? `<li><i class="fas fa-link"></i> <a href="${user.blog}" target="_blank">${user.blog.replace('https://', '')}</a></li>` : '';
            const company = user.company ? `<li><i class="fas fa-building"></i> ${user.company}</li>` : '';
            
            DOM.profileInfo.innerHTML = `
                <ul class="info-list" aria-label="Contact information">
                    ${location}
                    ${website}
                    ${company}
                </ul>
            `;
        }
    },

    /**
     * Render repositories
     */
    renderRepositories(repos, filter = 'all') {
        if (!DOM.reposContainer || !repos) return;

        // Filter repos
        let filteredRepos = [...repos];
        
        switch(filter) {
            case 'stars':
                filteredRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
                break;
            case 'updated':
                filteredRepos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
                break;
            case 'forks':
                filteredRepos.sort((a, b) => b.forks_count - a.forks_count);
                break;
        }

        // Take only 6 repos for display
        filteredRepos = filteredRepos.slice(0, 6);

        // Generate HTML
        const reposHTML = filteredRepos.map(repo => `
            <article class="card" role="listitem">
                <header class="repo-header">
                    <h3>
                        <a href="${repo.html_url}" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="repo-link">
                            ${repo.name}
                        </a>
                    </h3>
                    ${repo.stargazers_count > 0 ? `
                        <span class="repo-stats" aria-label="${repo.stargazers_count} stars">
                            <i class="fas fa-star"></i> ${repo.stargazers_count}
                        </span>
                    ` : ''}
                </header>
                
                <div class="repo-content">
                    <p>${repo.description || 'No description available.'}</p>
                    
                    <footer class="repo-footer">
                        ${repo.language ? `
                            <span class="repo-language">
                                <span class="language-color" 
                                      style="background-color: ${Utils.getLanguageColor(repo.language)}"></span>
                                ${repo.language}
                            </span>
                        ` : ''}
                        
                        <span class="repo-updated" aria-label="Last updated">
                            Updated ${Utils.formatDate(repo.updated_at)}
                        </span>
                    </footer>
                </div>
            </article>
        `).join('');

        DOM.reposContainer.innerHTML = reposHTML;
    },

    /**
     * Render contribution graph (mock data for demo)
     */
    renderContributions() {
        if (!DOM.contributionsContainer) return;

        // Generate mock contribution grid
        let contributionsHTML = '';
        
        for (let i = 0; i < CONFIG.CONTRIBUTION_DAYS; i++) {
            const level = Math.floor(Math.random() * 5); // 0-4
            contributionsHTML += `
                <div class="contribution-cell" 
                     data-level="${level}"
                     title="Contributions"
                     aria-label="Contribution day"></div>
            `;
        }

        DOM.contributionsContainer.innerHTML = contributionsHTML;

        // Update stats with mock data
        if (DOM.totalContributions) {
            DOM.totalContributions.textContent = Utils.formatNumber(Math.floor(Math.random() * 1000) + 500);
        }
        
        if (DOM.longestStreak) {
            DOM.longestStreak.textContent = `${Math.floor(Math.random() * 30) + 10} days`;
        }
        
        if (DOM.currentStreak) {
            DOM.currentStreak.textContent = `${Math.floor(Math.random() * 10) + 1} days`;
        }
    },

    /**
     * Update last updated timestamp
     */
    updateLastUpdated() {
        if (DOM.lastUpdated) {
            const now = new Date();
            DOM.lastUpdated.textContent = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
};

// Form Handler
const FormHandler = {
    init() {
        if (!DOM.contactForm) return;

        DOM.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    },

    async handleSubmit() {
        const formData = new FormData(DOM.contactForm);
        const data = Object.fromEntries(formData.entries());

        // Simple validation
        if (!data.name || !data.email || !data.message) {
            this.showMessage('Please fill in all fields.', 'error');
            return;
        }

        // In a real application, you would send this to a server
        console.log('Form submitted:', data);
        
        // Show success message
        this.showMessage('Thank you for your message! (This is a demo form)', 'success');
        
        // Reset form
        DOM.contactForm.reset();
    },

    showMessage(text, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const message = document.createElement('div');
        message.className = `form-message ${type}`;
        message.textContent = text;
        message.setAttribute('role', 'alert');

        // Style based on type
        message.style.cssText = `
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 0.5rem;
            font-weight: 500;
        `;

        if (type === 'success') {
            message.style.backgroundColor = '#d1fae5';
            message.style.color = '#065f46';
            message.style.border = '1px solid #10b981';
        } else {
            message.style.backgroundColor = '#fee2e2';
            message.style.color = '#991b1b';
            message.style.border = '1px solid #ef4444';
        }

        DOM.contactForm.prepend(message);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
};

// Filter Manager
const FilterManager = {
    init() {
        if (!DOM.filterButtons.length) return;

        DOM.filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleFilterClick(e);
            });
        });
    },

    handleFilterClick(e) {
        const button = e.currentTarget;
        const filter = button.dataset.filter;

        // Update button states
        DOM.filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });

        button.classList.add('active');
        button.setAttribute('aria-pressed', 'true');

        // Apply filter
        if (State.repos.length > 0) {
            UIRenderer.renderRepositories(State.repos, filter);
        }
    }
};

// Main Application
const App = {
    async init() {
        // Set current year in footer
        if (DOM.currentYear) {
            DOM.currentYear.textContent = new Date().getFullYear();
        }

        // Initialize components
        ThemeManager.init();
        FormHandler.init();
        FilterManager.init();

        // Load GitHub data
        try {
            const data = await GitHubFetcher.loadAllData();
            
            // Update UI with data
            UIRenderer.renderProfile(data.user);
            UIRenderer.renderRepositories(data.repos);
            UIRenderer.renderContributions();
            UIRenderer.updateLastUpdated();

            // Remove skeletons
            this.removeSkeletons();
        } catch (error) {
            // Page still works without GitHub data
            console.log('App running in fallback mode');
        }

        // Set up auto-refresh
        this.setupAutoRefresh();
    },

    removeSkeletons() {
        const skeletons = document.querySelectorAll('.repo-skeleton');
        skeletons.forEach(skeleton => {
            skeleton.style.display = 'none';
        });
    },

    setupAutoRefresh() {
        // Auto-refresh GitHub data periodically
        setInterval(async () => {
            try {
                const data = await GitHubFetcher.loadAllData();
                UIRenderer.renderProfile(data.user);
                UIRenderer.updateLastUpdated();
            } catch (error) {
                console.log('Auto-refresh failed:', error);
            }
        }, CONFIG.UPDATE_INTERVAL);
    }
};

// Initialize application when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// Export for debugging
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { App, Utils, GitHubFetcher, UIRenderer };
}