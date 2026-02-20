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
// Sebenarnya kita tak guna API betul, just simulate je untuk nampak macam sync dengan GitHub
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
    
    // Update profile data — nama, bio, location, links, avatar
    document.getElementById('github-name').textContent = githubData.name;
    document.getElementById('github-bio').textContent = githubData.bio;
    document.getElementById('github-location').textContent = githubData.location;
    document.getElementById('github-profile').textContent = githubData.html_url;
    document.getElementById('github-profile').href = githubData.html_url;
    document.getElementById('github-avatar').src = githubData.avatar_url;
    
    // Update stats — repositories, gists, followers
    document.getElementById('repo-count').textContent = githubData.public_repos;
    document.getElementById('gist-count').textContent = githubData.public_gists;
    document.getElementById('follower-count').textContent = githubData.followers;
    
    // Update buttons — redirect to GitHub profile
    document.getElementById('visit-github-btn').href = githubData.html_url;
    
    // Update sync status — tunjuk masa last sync
    document.getElementById('sync-status').innerHTML = `Status : <strong>Synced with GitHub</strong> (Last update : ${new Date().toLocaleTimeString()})`;
}

// ========== FUNCTION UNTUK TOGGLE SEMUA FOLDER ==========
// Function ni untuk buka/tutup folder semester (dropdown)
function toggleSemester(contentId, arrowId) {
    const content = document.getElementById(contentId);
    const arrow = document.getElementById(arrowId);
    
    // Toggle class 'show' — kalau ada, buang; kalau takde, tambah
    content.classList.toggle('show');
    
    // Tukar arrow ikut keadaan folder (buka/tutup)
    if (content.classList.contains('show')) {
        arrow.innerHTML = '▲'; // arrow up kalau buka
    } else {
        arrow.innerHTML = '▼'; // arrow down kalau tutup
    }
}

// ========== FUNCTIONS UNTUK SUBJECT NAVIGATION ==========
// Function untuk pergi ke section (bila click subject)
function goToSection(sectionId) {
    // Hide homepage elements — header, container, footer
    document.querySelector('header').style.display = 'none';
    document.querySelector('.container').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
    
    // Hide all semester folders — supaya tak nampak dekat belakang
    document.querySelectorAll('.semester-folder').forEach(folder => {
        folder.style.display = 'none';
    });
    
    // Hide all sections dulu — penting supaya yang sebelumnya tutup
    document.querySelectorAll('.subject-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show section yang dipilih
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
        // Scroll ke atas — smooth scrolling
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Function untuk balik ke homepage (bila click back button)
function goBackHome() {
    // Show semua homepage elements — header, container, footer
    document.querySelector('header').style.display = 'block';
    document.querySelector('.container').style.display = 'flex';
    document.querySelector('footer').style.display = 'block';
    
    // Show semester folders — paparkan balik folder SEM 1 & SEM 2
    document.querySelectorAll('.semester-folder').forEach(folder => {
        folder.style.display = 'block';
    });
    
    // Hide all sections — tutup subject yang tengah dibuka
    document.querySelectorAll('.subject-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Scroll ke atas — balik paling atas
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========== DAILY QUOTE & LYRIC ==========
// Function ni untuk update quote dan lirik setiap hari
function updateDailyContent() {

// ===== QUOTES BERDASARKAN HARI =====
const quotesByDay = {
    sunday:    { text: " ", author: "Anonymous" },
    monday:    { text: "I’m learning quietly, but I’m moving forward.", author: "Anonymous" },
    tuesday:   { text: "Quote untuk Selasa", author: "Anonymous" },
    wednesday: { text: "Quote untuk Rabu", author: "Anonymous" },
    thursday:  { text: "Quote untuk Khamis", author: "Anonymous" },
    friday:    { text: "I trust myself to rise, again and again.", author: "Anonymous" },
    saturday:  { text: "Quote untuk Sabtu", author: "Anonymous" }
};

// ===== LYRICS BERDASARKAN HARI =====
const lyricsByDay = {
    sunday:    { text: "Lirik untuk Ahad", artist: "Penyanyi Ahad" },
    monday:    { text: "I’m doing better than I ever was…", artist: "Call It What You Want (Taylor Swift)" },
    tuesday:   { text: "Lirik untuk Selasa", artist: "Penyanyi Selasa" },
    wednesday: { text: "Lirik untuk Rabu", artist: "Penyanyi Rabu" },
    thursday:  { text: "Lirik untuk Khamis", artist: "Penyanyi Khamis" },
    friday:    { text: "Loves me like I’m brand new…", artist: "Call It What You Want (Taylor Swift)" },
    saturday:  { text: "Lirik untuk Sabtu", artist: "Penyanyi Sabtu" }
};

    // Dapatkan tarikh hari ini (untuk pilih quote yang sama sepanjang hari)
    // Guna day, month, year sebagai seed — supaya semua orang nampak quote sama pada hari yang sama
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth();
    const year = today.getFullYear();

    // Format hari & tarikh — contoh: "Thursday, 19 February 2026"
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-day').innerText = today.toLocaleDateString('en-MY', options);

    // Pilih quote berdasarkan tarikh (supaya sama setiap hari)
    // Guna modulo supaya index tak melebihi panjang array
    const quoteIndex = (day + month + year) % quotes.length;
    document.getElementById('daily-quote').innerText = `"${quotes[quoteIndex].text}"`;
    document.getElementById('quote-author').innerText = `— ${quotes[quoteIndex].author}`;

    // Pilih lirik berdasarkan tarikh (guna offset +3 supaya tak sama dengan quote)
    const lyricIndex = (day + month + year + 3) % lyrics.length;
    document.getElementById('daily-lyric').innerText = `"${lyrics[lyricIndex].text}"`;
    document.getElementById('lyric-artist').innerText = `— ${lyrics[lyricIndex].artist}`;
}

// ========== INITIALIZATION FUNCTION ==========
// Function utama yang jalan masa website mula-mula dibuka
function initWebsite() {
    // Set current date di footer — panggil function formatDate()
    document.getElementById('current-date').textContent = formatDate();
    
    // Simulate API call dengan delay 1.5 saat — biar nampak macam loading sikit
    setTimeout(simulateGitHubAPI, 1500);
    
    // Setup contact button — terus buka email client
    document.getElementById('contact-btn').href = "mailto:norainfahira@gmail.com";
    
// PANGGIL FUNCTION QUOTE & LYRIC — update content
    function updateDailyContent() {
    // Dapatkan hari ini (dalam Bahasa Inggeris)
    const today = new Date();
    const dayName = today.toLocaleDateString('en-MY', { weekday: 'long' }).toLowerCase();
    // 'monday', 'tuesday', etc.

    // Format hari & tarikh
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-day').innerText = today.toLocaleDateString('en-MY', options);

    // Ambil quote berdasarkan hari
    const todaysQuote = quotesByDay[dayName] || quotesByDay.sunday; // fallback ke Ahad
    document.getElementById('daily-quote').innerText = `"${todaysQuote.text}"`;
    document.getElementById('quote-author').innerText = `— ${todaysQuote.author}`;

    // Ambil lirik berdasarkan hari
    const todaysLyric = lyricsByDay[dayName] || lyricsByDay.sunday;
    document.getElementById('daily-lyric').innerText = `"${todaysLyric.text}"`;
    document.getElementById('lyric-artist').innerText = `— ${todaysLyric.artist}`;
}
}

// ========== WINDOW ONLOAD ==========
// Trigger function bila page siap loading
window.onload = initWebsite;
