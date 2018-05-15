<template>
  <div class="index-links">
    <a  :href="infoList.twitter" target="_blank">
      <img src="../../assets/twitter.svg" alt="">
    </a>
    <a  :href="infoList.github " target="_blank">
      <img src="../../assets/github.svg" alt="">
    </a>
    <a  :href="infoList.weibo" target="_blank">
      <img src="../../assets/weibo.svg" alt="">
    </a>
    <a href="" @click.prevent="login">
      <img src="../../assets/user.svg" alt="">
    </a>
  </div>
</template>

<script type="text/ecmascript-6">
export default{
  name: 'BlogLinks',
  props: ['infoList'],
  methods: {
    login () {
      this.$emit('openDialog')
    }
  }

}
</script>


