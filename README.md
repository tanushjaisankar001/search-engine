# My Mini Search Engine

A simple, local search engine built from scratch using Python and vanilla JavaScript. This project demonstrates the core principles of web crawling, indexing, and information retrieval.

*(Feel free to replace this with a screenshot of your own project!)*

## How It Works

The project is split into two main components:

1.  **The Back-End Crawler (`crawler.py`)**: A Python script that:
    * Starts at a specific URL.
    * Downloads the HTML of the page.
    * Parses the text content and creates an **inverted index** (a map of words to the URLs where they appear).
    * Finds all links on the page and adds them to a queue to visit next.
    * Saves the final index as an `index.json` file.

2.  **The Front-End Search Page (`frontend/`)**: A pure HTML, CSS, and JavaScript interface that:
    * Loads the `index.json` file created by the crawler.
    * Provides a search bar for the user to enter queries.
    * Looks up the search term in the loaded index.
    * Dynamically displays the results on the page.

## How to Run This Project

Follow these steps to get the search engine running on your local machine.

### 1. Prerequisites

Make sure you have Python 3 installed on your system.

### 2. Setup

First, clone or download the project files. Then, install the necessary Python libraries by running this command in your terminal:

```bash
pip install requests beautifulsoup4
```

*(On macOS or Linux, you may need to use `pip3`)*

### 3. Run the Crawler

Before you can search, you need to build the search index.

Navigate to the project's root directory in your terminal and run the crawler:

```bash
python3 crawler.py
```

This will start crawling the website defined in `start_url` and will create an `index.json` file in the root directory.

### 4. Move the Index File

Move the newly created `index.json` file from the root directory into the `frontend/` folder.

### 5. Launch the Search Page

Because of browser security policies regarding local files, you need to use a simple local server to run the front-end. Python has one built-in.

1.  Navigate into the frontend directory:
    ```bash
    cd frontend
    ```

2.  Start the local server:
    ```bash
    python3 -m http.server
    ```

3.  Open your web browser and go to the following address:
    [**http://localhost:8000**](http://localhost:8000)

You should now see the search engine interface, ready to accept queries!

## Credits

This project was built as a learning exercise. The idea and step-by-step guidance were inspired by the fantastic [**Build your own X**](https://github.com/codecrafters-io/build-your-own-x) repository.
