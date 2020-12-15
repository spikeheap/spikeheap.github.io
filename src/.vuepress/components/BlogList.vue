<template>
<div>
    <div v-for="post in posts">
        <h2>
            <router-link :to="post.path">{{ post.frontmatter.title }}</router-link>,
            <small>{{ new Date(post.frontmatter.date).toLocaleDateString() }}</small>
        </h2>
        <p>{{ post.frontmatter.description }}</p>

        <p><router-link :to="post.path">Read more</router-link> ({{ post.readingTime.text }})</p>
        <hr>
    </div>
</div>
</template>

<script>
export default {
    computed: {
        posts() {
            return this.$site.pages
                .filter(x => x.path.startsWith('/posts/') && x.frontmatter.published != false && !x.frontmatter.blog_index)
                .sort((a, b) => {
                    return Date.parse(b.frontmatter.date) - Date.parse(a.frontmatter.date)
                });
        }
    }
}
</script>
