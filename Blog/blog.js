// Blog posts configuration - add new posts here
const BLOG_POSTS = [
    { filename: '3-29-2026.html', date: new Date('2026-03-29') },
    // Add more posts as needed: { filename: '3-30-2026.html', date: new Date('2026-03-30') }
];

// Fetch and extract h1 from a blog post HTML file
async function extractPostTitle(filename) {
    try {
        const response = await fetch(filename);
        if (!response.ok) return null;
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const h1 = doc.querySelector('h1');
        return h1 ? h1.textContent.trim() : null;
    } catch (error) {
        console.error(`Error fetching ${filename}:`, error);
        return null;
    }
}

// Generate the thumbnail grid
async function generateBlogThumbnails() {
    const container = document.getElementById('blog-thumbnails');
    if (!container) return;

    // Sort by date, most recent first
    const sortedPosts = [...BLOG_POSTS].sort((a, b) => b.date - a.date);

    // Fetch titles for all posts
    const postsWithTitles = await Promise.all(
        sortedPosts.map(async (post) => {
            const title = await extractPostTitle(post.filename);
            return { ...post, title };
        })
    );

    // Filter out posts where title couldn't be extracted
    const validPosts = postsWithTitles.filter(post => post.title);

    // Create grid container
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    grid.style.gap = '20px';
    grid.style.marginTop = '20px';

    // Create thumbnail for each post
    validPosts.forEach(post => {
        const thumbnail = document.createElement('a');
        thumbnail.href = post.filename;
        thumbnail.style.textDecoration = 'none';
        thumbnail.style.color = 'inherit';

        const box = document.createElement('div');
        box.style.display = 'flex';
        box.style.alignItems = 'center';
        box.style.gap = '15px';
        box.style.padding = '15px';
        box.style.border = '3px solid #5a2900';
        box.style.borderRadius = '5px';
        box.style.transition = 'all 0.3s ease';
        box.style.backgroundColor = '#854613';

        // Hover effect
        box.addEventListener('mouseover', () => {
            box.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            box.style.transform = 'translateY(-2px)';
        });
        box.addEventListener('mouseout', () => {
            box.style.boxShadow = 'none';
            box.style.transform = 'translateY(0)';
        });

        // Image
        const imageBasename = post.filename.replace('.html', '.png');
        const img = document.createElement('img');
        img.src = imageBasename;
        img.alt = post.title;
        img.style.width = '100px';
        img.style.height = '100px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '3px';
        img.style.flexShrink = '0';

        // Text
        const text = document.createElement('div');
        text.textContent = post.title;
        text.style.fontSize = '14px';
        text.style.fontWeight = 'bold';
        text.style.lineHeight = '1.4';
        text.style.flex = '1';

        box.appendChild(img);
        box.appendChild(text);
        thumbnail.appendChild(box);
        grid.appendChild(thumbnail);
    });

    container.appendChild(grid);
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', generateBlogThumbnails);
} else {
    generateBlogThumbnails();
}
