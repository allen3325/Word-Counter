# Word Counter

A modern, minimalist web-based word counter that supports English and Traditional Chinese. The interface now defaults to Traditional Chinese, but you can switch to English using the language dropdown. The page updates statistics in real time and estimates reading and speaking time. Statistics can be exported as a text file or PDF.

## Usage

Open `index.html` in a web browser. Enter or paste text into the textarea. Select the desired language, and view the statistics below the text box. Use the **Clear** button to reset the input. Use **Export Text** to download a `.txt` file or **Export PDF** for a `.pdf` file containing the stats.

## Deploying to GitHub Pages

1. Create a repository on GitHub and push this project to it.
2. Copy the workflow in `.github/workflows/deploy.yml` included in this repo. GitHub Actions will build and publish the site whenever changes are pushed to `main`.
3. In the repository's **Settings > Pages**, choose **GitHub Actions** as the source.
4. After the workflow finishes, your site will be available at `https://<username>.github.io/<repository>`.

Alternatively, you can enable GitHub Pages directly from the settings without using Actions by selecting the `main` branch as the source and saving.
