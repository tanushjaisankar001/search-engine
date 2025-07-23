document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsContainer = document.getElementById('resultsContainer');

    let searchIndex = {};

    fetch('index.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            searchIndex = data;
            console.log('Search index loaded successfully!');
            searchButton.disabled = false; 
        })
        .catch(error => {
            console.error('Error loading search index:', error);
            resultsContainer.innerHTML = '<p style="color: red;">Could not load search index. Make sure you have moved index.json into the "frontend" folder.</p>';
        });
    
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();
        resultsContainer.innerHTML = '';

        if (!query) {
            return;
        }

        const results = searchIndex[query];

        if (results && results.length > 0) {
            results.forEach(url => {
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';
                
                const link = document.createElement('a');
                link.href = url;
                link.textContent = url;
                link.target = '_blank';
                
                const urlPath = new URL(url).pathname;
                const description = document.createElement('p');
                description.textContent = `Found on page: ${urlPath}`;

                resultItem.appendChild(link);
                resultItem.appendChild(description);
                resultsContainer.appendChild(resultItem);
            });
        } else {
            resultsContainer.innerHTML = '<p>No results found for that term.</p>';
        }
    }

    searchButton.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    searchButton.disabled = true;
});