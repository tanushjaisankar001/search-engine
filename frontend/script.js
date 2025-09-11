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
          resultsContainer.innerHTML = '<p style="color: red;">Could not load search index. Please run the crawler and place index.json in the correct folder.</p>';
      });

  function performSearch() {
      const query = searchInput.value.trim().toLowerCase();
      resultsContainer.innerHTML = '';

      if (!query) {
          return;
      }

      const queryTerms = query.split(/\s+/);
      const docScores = {};

      const { inverted_index, idf_scores, document_store } = searchIndex;

      let candidateUrls = new Set();
      
      queryTerms.forEach(term => {
          if (inverted_index[term]) {
              for (const url in inverted_index[term]) {
                  candidateUrls.add(url);
              }
          }
      });

      candidateUrls.forEach(url => {
          let totalScore = 0;
          queryTerms.forEach(term => {
              if (inverted_index[term] && inverted_index[term][url]) {
                  const doc_length = document_store[url]?.length || 1;
                  const tf = inverted_index[term][url] / doc_length;
                  const idf = idf_scores[term] || 0;
                  totalScore += tf * idf;
              }
          });
          if (totalScore > 0) {
              docScores[url] = totalScore;
          }
      });

      const sortedResults = Object.entries(docScores)
          .sort(([, a], [, b]) => b - a);
          
      if (sortedResults.length > 0) {
          sortedResults.forEach(([url, score]) => {
              const docInfo = document_store[url];
              const resultItem = document.createElement('div');
              resultItem.className = 'result-item';
              
              const link = document.createElement('a');
              link.href = url;
              link.textContent = docInfo?.title || url;
              link.target = '_blank';
              
              const urlDisplay = document.createElement('p');
              urlDisplay.className = 'result-url';
              urlDisplay.textContent = url;

              resultItem.appendChild(link);
              resultItem.appendChild(urlDisplay);
              resultsContainer.appendChild(resultItem);
          });
      } else {
          resultsContainer.innerHTML = '<p>No results found for that query.</p>';
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