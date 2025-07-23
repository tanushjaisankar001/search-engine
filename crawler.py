import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import json
import re

STOP_WORDS = set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 
    'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 
    'were', 'will', 'with', 'i', 'you', 'your', 'we', 'us', 'our', 'css', 
    'js', 'html', 'http', 'https'
])

inverted_index = {}

def fetch_page_content(url):
    try:
        headers = {'User-Agent': 'MySimpleSearchEngine/1.0'}
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        print(f"Successfully fetched: {url}")
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"An error occurred while fetching {url}: {e}")
        return None

def parse_links(url, html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    links = []
    for a_tag in soup.find_all('a', href=True):
        href = a_tag['href']
        link = urljoin(url, href)
        parsed_link = urlparse(link)
        clean_link = parsed_link._replace(fragment="").geturl()
        links.append(clean_link)
    return links

def index_page(url, html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    
    text = soup.get_text()
    
    words = re.findall(r'\b[a-z0-9]{2,}\b', text.lower())
    
    indexed_word_count = 0
    for word in words:
        if word in STOP_WORDS:
            continue

        if word not in inverted_index:
            inverted_index[word] = []
        if url not in inverted_index[word]:
            inverted_index[word].append(url)
        indexed_word_count += 1
    
    print(f"Found {len(words)} words, indexed {indexed_word_count} useful words from {url}")

if __name__ == "__main__":
    start_url = "https://toscrape.com/"
    
    urls_to_visit = [start_url]
    visited_urls = set()
    
    max_pages = 10
    pages_crawled = 0

    while urls_to_visit and pages_crawled < max_pages:
        current_url = urls_to_visit.pop(0)
        
        if current_url in visited_urls:
            continue
            
        visited_urls.add(current_url)
        pages_crawled += 1
        
        print(f"\nCrawling ({pages_crawled}/{max_pages}): {current_url}")
        
        html = fetch_page_content(current_url)
        
        if html:
            index_page(current_url, html)
            
            found_links = parse_links(current_url, html)
            print(f"Found {len(found_links)} links.")
            
            for link in found_links:
                if link.startswith(start_url) and link not in visited_urls and link not in urls_to_visit:
                    urls_to_visit.append(link)

    print("\n--- Crawling Complete ---")
    
    index_file_path = 'index.json'
    print(f"Saving index to {index_file_path}...")
    with open(index_file_path, 'w') as f:
        json.dump(inverted_index, f, indent=2)
        
    print("Done!")