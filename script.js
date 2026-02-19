// ========== GLOBAL FUNCTIONS ==========

// Function untuk format date
function formatDate() {
    const now = new Date();
    return now.toLocaleDateString('en-MY', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Function untuk simulate GitHub API call
function simulateGitHubAPI() {
    const githubData = {
        name: "Nor Ain Fahira binti Muhamad Fariq",
        bio: "Undergraduate Student of Computer Science in Data Engineering at Universiti Teknologi Malaysia",
        location: "Johor Bahru, Malaysia",
        html_url: "https://github.com/norainfahira",
        avatar_url: "https://avatars.githubusercontent.com/u/242617684?v=4",
        public_repos: 3,
        public_gists: 0,
        followers: 5,
        following: 4,
    };
    
    // Update profile data
    document.getElementById('github-name').textContent = githubData.name;
    document.getElementById('github-bio').textContent = githubData.bio;
    document.getElementById('github-location').textContent = githubData.location;
    document.getElementById('github-profile').textContent = githubData.html_url;
    document.getElementById('github-profile').href = githubData.html_url;
    document.getElementById('github-avatar').src = githubData.avatar_url;
    
    // Update stats
    document.getElementById('repo-count').textContent = githubData.public_repos;
    document.getElementById('gist-count').textContent = githubData.public_gists;
    document.getElementById('follower-count').textContent = githubData.followers;
    
    // Update buttons
    document.getElementById('visit-github-btn').href = githubData.html_url;
    
    // Update sync status
    document.getElementById('sync-status').innerHTML = `Status : <strong>Synced with GitHub</strong> (Last update : ${new Date().toLocaleTimeString()})`;
}

// ========== FUNCTION UNTUK TOGGLE SEMUA FOLDER ==========
function toggleSemester(contentId, arrowId) {
    const content = document.getElementById(contentId);
    const arrow = document.getElementById(arrowId);
    
    content.classList.toggle('show');
    
    if (content.classList.contains('show')) {
        arrow.innerHTML = '▲';
    } else {
        arrow.innerHTML = '▼';
    }
}

// ========== FUNCTIONS UNTUK SUBJECT NAVIGATION ==========
// Function untuk pergi ke section
function goToSection(sectionId) {
    // Hide homepage elements
    document.querySelector('header').style.display = 'none';
    document.querySelector('.container').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
    
    // Hide all semester folders
    document.querySelectorAll('.semester-folder').forEach(folder => {
        folder.style.display = 'none';
    });
    
    // Hide all sections dulu
    document.querySelectorAll('.subject-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show section yang dipilih
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        // Scroll ke atas
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Function untuk balik ke homepage
function goBackHome() {
    // Show semua homepage elements
    document.querySelector('header').style.display = 'block';
    document.querySelector('.container').style.display = 'flex';
    document.querySelector('footer').style.display = 'block';
    
    // Show semester folders
    document.querySelectorAll('.semester-folder').forEach(folder => {
        folder.style.display = 'block';
    });
    
    // Hide all sections
    document.querySelectorAll('.subject-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Scroll ke atas
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== DAILY QUOTE & LYRIC ==========
function updateDailyContent() {
    // ===== QUOTES =====
    const quotes = [
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
        { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
        { text: "It's not a bug; it's an undocumented feature.", author: "Anonymous" },
        { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
        { text: "Programming isn't about what you know; it's about what you can figure out.", author: "Chris Pine" },
        { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
        { text: "Your limitation—it's only your imagination.", author: "Unknown" }
    ];

    // ===== LYRICS =====
    const lyrics = [
        { text: "We don't need to fall in love, we don't need to fall apart", artist: "Pastel Ghost" },
        { text: "I'm still standing better than I ever did", artist: "Elton John" },
        { text: "And I will always love you", artist: "Whitney Houston" },
        { text: "Somewhere over the rainbow, way up high", artist: "Israel Kamakawiwoʻole" },
        { text: "Cause I'm yours, I'm yours", artist: "Jason Mraz" },
        { text: "Counting stars, one, two, three", artist: "OneRepublic" },
        { text: "We don't talk anymore, we don't talk anymore", artist: "Charlie Puth" },
        { text: "Hello from the other side", artist: "Adele" }
    ];

    // Dapatkan tarikh hari ini (untuk pilih quote yang sama sepanjang hari)
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();

    // Format hari & tarikh
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-day').innerText = today.toLocaleDateString('en-MY', options);

    // Pilih quote berdasarkan tarikh (supaya sama setiap hari)
    const quoteIndex = (day + month + year) % quotes.length;
    document.getElementById('daily-quote').innerText = `"${quotes[quoteIndex].text}"`;
    document.getElementById('quote-author').innerText = `— ${quotes[quoteIndex].author}`;

    // Pilih lirik berdasarkan tarikh (atau nak random?)
    const lyricIndex = (day + month + year + 3) % lyrics.length; // +3 supaya tak sama dengan quote
    document.getElementById('daily-lyric').innerText = `"${lyrics[lyricIndex].text}"`;
    document.getElementById('lyric-artist').innerText = `— ${lyrics[lyricIndex].artist}`;
}

// ========== INITIALIZATION FUNCTION ==========
function initWebsite() {
    // Set current date di footer
    document.getElementById('current-date').textContent = formatDate();
    
    // Simulate API call dengan delay 1.5 saat
    setTimeout(simulateGitHubAPI, 1500);
    
    // Setup contact button
    document.getElementById('contact-btn').href = "mailto:norainfahira@gmail.com";
    
    // PANGGIL FUNCTION QUOTE & LYRIC
    updateDailyContent();
}

// ========== WINDOW ONLOAD ==========
window.onload = initWebsite;
