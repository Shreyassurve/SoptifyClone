let currentPage = 0; // Track the current page of results
let albums = []; // Store albums globally for filtering

// Fetch songs from Spotify API
async function searchSongs() {
    const url = `https://spotify117.p.rapidapi.com/new_releases/?country=IN&page=${currentPage}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '1597d3a971mshdf9d837bad8de35p108db0jsnae7d40230e6f',
            'x-rapidapi-host': 'spotify117.p.rapidapi.com'
        }
    };

    const songList = document.getElementById('songList');
    const loader = document.getElementById('loader');
    loader.style.display = 'block'; // Show the loader

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        loader.style.display = 'none';

        if (data && data.albums && data.albums.items) {
            albums = data.albums.items; // Save albums globally
            displayAlbums(albums);
        } else {
            songList.innerHTML = '<p>No new releases found.</p>';
        }
    } catch (error) {
        console.error('Error fetching new releases:', error);
        loader.style.display = 'none';
        songList.innerHTML = '<p>Something went wrong. Please try again later.</p>';
    }
}

// Display the albums on the page
function displayAlbums(albumList) {
    const songList = document.getElementById('songList');
    songList.innerHTML = ''; // Clear previous results

    albumList.forEach(album => {
        const songDiv = document.createElement('div');
        songDiv.className = 'song';
        songDiv.innerHTML = `
            <img src="${album.images[0]?.url}" alt="${album.name}">
            <p><strong>${album.name}</strong></p>
            <p>By ${album.artists.map(artist => artist.name).join(', ')}</p>
            <a href="${album.external_urls.spotify}" target="_blank" class="spotify-link">Listen on Spotify</a>
            <button class="learn-more" onclick="showAlbumDetails(${encodeURIComponent(JSON.stringify(album))})">Learn More</button>
            <audio controls>
                <source src="${album.preview_url}" type="audio/mpeg">
                Your browser does not support the audio element.
            </audio>
        `;
        songList.appendChild(songDiv);
    });
}

// Load more albums when clicking the button
function loadMoreSongs() {
    currentPage++;
    searchSongs();
}

// Toggle between light and dark themes
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('light-theme');

    const themeButton = document.getElementById('themeButton');
    themeButton.innerText = body.classList.contains('light-theme') ? 'Switch to Dark Theme' : 'Switch to Light Theme';
}

// Filter albums based on search input
function filterAlbums() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const filteredAlbums = albums.filter(album =>
        album.name.toLowerCase().includes(searchInput) ||
        album.artists.some(artist => artist.name.toLowerCase().includes(searchInput))
    );
    displayAlbums(filteredAlbums);
}

// Show album details in a modal
function showAlbumDetails(encodedAlbum) {
    const album = JSON.parse(decodeURIComponent(encodedAlbum)); // Decode the album details
    const modal = document.getElementById('albumModal');
    modal.style.display = 'flex';

    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <h2>${album.name}</h2>
        <img src="${album.images[0]?.url}" alt="${album.name}" style="width: 100%; border-radius: 10px;">
        <p><strong>Artists:</strong> ${album.artists.map(artist => artist.name).join(', ')}</p>
        <p><strong>Release Date:</strong> ${album.release_date}</p>
        <p><strong>Tracks:</strong></p>
        <ul>
            ${(album.tracks ? album.tracks.map(track => `<li>${track.name}</li>`).join('') : 'No tracks available.')}
        </ul>
        <a href="${album.external_urls.spotify}" target="_blank" class="spotify-link">Listen on Spotify</a>
        <button onclick="closeModal()">Close</button>
    `;
}

// Close the modal when the close button is clicked
function closeModal() {
    const modal = document.getElementById('albumModal');
    modal.style.display = 'none';
}

// Load the top charts
async function loadTopCharts() {
    const url = `https://spotify117.p.rapidapi.com/top_charts/?country=IN`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '1597d3a971mshdf9d837bad8de35p108db0jsnae7d40230e6f',
            'x-rapidapi-host': 'spotify117.p.rapidapi.com'
        }
    };

    const songList = document.getElementById('songList');
    const loader = document.getElementById('loader');
    loader.style.display = 'block';

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        loader.style.display = 'none';

        if (data && data.songs && data.songs.items) {
            displayAlbums(data.songs.items);
        } else {
            songList.innerHTML = '<p>No top charts found.</p>';
        }
    } catch (error) {
        console.error('Error fetching top charts:', error);
        loader.style.display = 'none';
        songList.innerHTML = '<p>Something went wrong. Please try again later.</p>';
    }
}

// Initialize the first load of songs when the page loads
searchSongs();
