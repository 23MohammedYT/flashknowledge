async function loadPartial(selector, file) {
    try {
        const res = await fetch(file);
        if (!res.ok) throw new Error(`Cannot load ${file}`);
        const html = await res.text();
        document.querySelector(selector).innerHTML = html;
    } catch (err) {
        console.error(err);
    }
}

// Make loadPartial return a Promise
function loadPartial(selector, url) {
    return fetch(url)
        .then(response => response.text())
        .then(html => {
            document.querySelector(selector).innerHTML = html;
        });
}

// Dark mode functions
function loadDarkModeState() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    const darkmodeCheckbox = document.getElementById('darkmode-checkbox');
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        if (darkmodeCheckbox) {
            darkmodeCheckbox.checked = true;
        }
    }
    
    return isDarkMode;
}

function saveDarkModeState(isDarkMode) {
    localStorage.setItem('darkMode', isDarkMode.toString());
}

document.addEventListener("DOMContentLoaded", () => {
    // Load all partials
    Promise.all([
        loadPartial("#top-bar", "http://127.0.0.1:5500/components/topbar.html"),
        loadPartial("#rightbar", "http://127.0.0.1:5500/components/rightbar.html"),
        loadPartial("#leftbar", "http://127.0.0.1:5500/components/leftbar.html"),
        loadPartial("#footer", "http://127.0.0.1:5500/components/footer.html")
    ]).then(() => {
        console.log("All partials loaded");

        // Load dark mode state after partials are loaded
        loadDarkModeState();

        // Now safe to run your UI setup code
        document.querySelectorAll(".title-img").forEach(element => {
            element.addEventListener("click", () => {
                window.location.href = "http://127.0.0.1:5500/index.html";
            });
        });

        initializeSearch();

        // Dark mode toggle with localStorage
        const darkmodeCheckbox = document.getElementById('darkmode-checkbox');
        if (darkmodeCheckbox) {
            darkmodeCheckbox.addEventListener('change', () => {
                const isDarkMode = darkmodeCheckbox.checked;
                document.body.classList.toggle('dark-mode', isDarkMode);
                saveDarkModeState(isDarkMode);
            });
        }

        const mobileSearchIcon = document.getElementById('mobile-search-icon');
        const searchWrapper = document.getElementById('search-wrapper');
        const searchBarBackground = document.querySelector('.search-bar-background');
        const mobileMenuIconOpen = document.getElementById('mobile-menu-icon-open');
        const mobileMenuIconClose = document.getElementById('mobile-menu-icon-close');
        const section1 = document.querySelector('.section1');

        if (mobileSearchIcon) {
            mobileSearchIcon.addEventListener('click', () => {
                searchWrapper.classList.add('active');
            });
        }

        if (searchBarBackground) {
            searchBarBackground.addEventListener('click', () => {
                searchWrapper.classList.remove('active');
            });
        }

        if (mobileMenuIconOpen) {
            mobileMenuIconOpen.addEventListener('click', () => {
                section1.style.top = '0%';
            });
        }

        if (mobileMenuIconClose) {
            mobileMenuIconClose.addEventListener('click', () => {
                section1.style.top = '100%';
            });
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                section1.style.display = 'block';
                searchWrapper.classList.remove('active');
            }
        });
    });
});

function initializeSearch() {
    const searchInput = document.querySelector('.search-bar');
    const searchIcon = document.querySelector('.search-bar-container i');
    const searchWrapper = document.getElementById('search-wrapper');

    function executeSearch() {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `results.html?query=${encodeURIComponent(query)}`;
        }
    }

    if (searchInput && searchIcon) {
        searchInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                executeSearch();
            }
        });

        searchIcon.addEventListener('click', (event) => {
            event.preventDefault();
            executeSearch();
        });
    }
}