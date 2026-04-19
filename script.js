// ========== GLOBAL FUNCTIONS ==========

// Function untuk format date (guna dekat footer)
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
        followers: 7,
        following: 10,
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
function goToSection(sectionId) {
    document.querySelector('header').style.display = 'none';
    document.querySelector('.container').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
    
    document.querySelectorAll('.semester-folder').forEach(folder => {
        folder.style.display = 'none';
    });
    
    document.querySelectorAll('.subject-section').forEach(section => {
        section.style.display = 'none';
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function goBackHome() {
    document.querySelector('header').style.display = 'block';
    document.querySelector('.container').style.display = 'flex';
    document.querySelector('footer').style.display = 'block';
    
    document.querySelectorAll('.semester-folder').forEach(folder => {
        folder.style.display = 'block';
    });
    
    document.querySelectorAll('.subject-section').forEach(section => {
        section.style.display = 'none';
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== QUOTES & LYRICS IKUT HARI ==========
const quotesByDay = {
    Sunday:    { text: "I let things come in their own time, quietly.", author: "Anonymous" },
    Monday:    { text: "I’m learning quietly, but I’m moving forward.", author: "Anonymous" },
    Tuesday:   { text: "I notice you, even when I try not to.", author: "Anonymous" },
    Wednesday: { text: "Everything I see reminds me to think deeper.", author: "Anonymous" },
    Thursday:  { text: "I’d choose simplicity if it means it’s real.", author: "Anonymous" },
    Friday:    { text: "I trust myself to rise, again and again.", author: "Anonymous" },
    Saturday:  { text: "Parting leaves marks, but it won’t break me.", author: "Anonymous" }
};

const lyricsByDay = {
    Sunday:    { text: "Not everything loud is love…", artist: "inspired by Love Me Not / The 1975 vibe" },
    Monday:    { text: "I’m doing better than I ever was…", artist: "Call It What You Want (Taylor Swift)" },
    Tuesday:   { text: "I don’t need you, but I miss you…", artist: "Love Me Not (Ravyn Lenae ft. Rex Orange County)" },
    Wednesday: { text: "Everything feels like it’s about you…", artist: "About You (The 1975)" },
    Thursday:  { text: "I’d marry you with paper rings…", artist: "Paper Rings (Taylor Swift)" },
    Friday:    { text: "Loves me like I’m brand new…", artist: "Call It What You Want (Taylor Swift)" },
    Saturday:  { text: "Goodbyes are bittersweet, but it’s not the end…", artist: "Walking in the Wind (One Direction)" }
};

// ========== DAILY QUOTE & LYRIC (IKUT HARI) ==========
function updateDailyContent() {
    // Dapatkan tarikh hari ini
    const today = new Date();
    
    // Dapatkan nama hari dalam format Sunday, Monday, etc. (huruf besar)
    const dayName = today.toLocaleDateString('en-MY', { weekday: 'long' });
    // Contoh: "Monday", "Tuesday"
    
    // Format hari & tarikh penuh
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-day').innerText = today.toLocaleDateString('en-MY', options);

    // DEBUG (boleh tengok kat console F12)
    console.log("Hari ni:", dayName);
    console.log("Quote untuk hari ni:", quotesByDay[dayName]);
    console.log("Lirik untuk hari ni:", lyricsByDay[dayName]);

    // Ambil quote berdasarkan hari
    const todaysQuote = quotesByDay[dayName];
    if (todaysQuote) {
        document.getElementById('daily-quote').innerText = `"${todaysQuote.text}"`;
        document.getElementById('quote-author').innerText = `— ${todaysQuote.author}`;
    } else {
        document.getElementById('daily-quote').innerText = '"Quote tidak dijumpai"';
        document.getElementById('quote-author').innerText = '— Unknown';
    }

    // Ambil lirik berdasarkan hari
    const todaysLyric = lyricsByDay[dayName];
    if (todaysLyric) {
        document.getElementById('daily-lyric').innerText = `"${todaysLyric.text}"`;
        document.getElementById('lyric-artist').innerText = `— ${todaysLyric.artist}`;
    } else {
        document.getElementById('daily-lyric').innerText = '"Lirik tidak dijumpai"';
        document.getElementById('lyric-artist').innerText = '— Unknown';
    }
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
