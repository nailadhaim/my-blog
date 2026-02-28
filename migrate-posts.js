const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'posts.json');
const posts = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const migratedPosts = posts.map(post => {
    // If 'categories' already exists, keep it. If not, use 'category' (if exists) wrapped in array.
    if (post.categories) return post;
    const { category, ...rest } = post;
    return {
        ...rest,
        categories: category ? [category] : []
    };
});

fs.writeFileSync(filePath, JSON.stringify(migratedPosts, null, 2));
console.log('Migration complete!');
