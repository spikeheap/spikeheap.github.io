<template>
  <main class="page">
    <slot name="top" />

    <div class="theme-default-content">
      <h1>{{ frontmatter.title }}</h1>
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
