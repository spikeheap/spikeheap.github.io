<template>
<div class="home">
    <header class="hero">
        <h1 id="main-title">I'm now writing on Medium</h1>

        <p class="description">After spending more time maintaining my blog's build process than writing, I've started writing new things over on Medium.</p>

        <hr>

        <p>Keeping things synced between Medium and here was a pain, so older articles will continue to live here (and links won't break). One day I'll procrastinate and figure out a clean way to cross-post, but today isn't that day.</p>

        <p class="action">
            <a class="nav-link action-button" href="https://spikeheap.medium.com" role="button">Read the new stuff</a>
        </p>
    </header>
</div>
</template>

<script>
export default {
    computed: {
        posts() {
            return this.$site.pages
                .filter(x => x.path.startsWith('/posts/') && x.frontmatter.published != false && !x.frontmatter.blog_index)
                .sort((a, b) => { 
                    console.log(b.frontmatter.date);
                    return Date.parse(b.frontmatter.date) - Date.parse(a.frontmatter.date)
                });
        }
    }
}
</script>