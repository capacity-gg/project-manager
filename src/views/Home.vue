<template>
  <div class="home">
    <h1>Welcome</h1>
    <HelloWorld></HelloWorld>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld'

export default {
  components: {
    HelloWorld // make the <HelloWorld> tag available
  },
  data: function () {
    return {}
  },
  methods: {}
}
</script>

<style lang='scss'>
</style>