<template>
  <h1>index page</h1>
  <HelloWorldVue msg="helloworldeVue"></HelloWorldVue>
  <div class="test-viewport">测试转换</div>

</template>

<script lang="ts" setup>
import HelloWorldVue from '@components/HelloWorld.vue';
</script>

<style scoped lang="less">
.test-viewport {
  width: 375px;
  height: 50px;
  font-size: 20px;
  text-align: center;
  line-height: 50px;
  background: #13b5b1;
}
</style>
