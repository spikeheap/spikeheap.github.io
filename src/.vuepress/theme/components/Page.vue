<template>
  <main class="page">
    <slot name="top" />

    <div class="theme-default-content">
      <h1 v-if="frontmatter.title">{{ frontmatter.title }}</h1>
      <small v-if="frontmatter.date" class="publication-date">Published on {{ new Date(frontmatter.date).toLocaleDateString() }}</small>
      <Content  />
    </div>

    <PageEdit />

    <PageNav v-bind="{ sidebarItems }" />

    <slot name="bottom" />
  </main>
</template>

<script>
import PageEdit from '@theme/components/PageEdit.vue'
import PageNav from '@theme/components/PageNav.vue'

export default {
  components: { PageEdit, PageNav },
  props: ['sidebarItems'],
  computed: {
    frontmatter () {
      return this.$page.frontmatter
    }
  }
}
</script>

<style lang="stylus">
@require '../styles/wrapper.styl'

.page
  padding-bottom 2rem
  display block

</style>
