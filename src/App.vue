<template>
  <div id="app">
    <el-container>
      <el-aside width="200px">
        <draw-aside></draw-aside>
      </el-aside>
      <el-container>
        <el-main>
          <draw-main></draw-main>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import drawAside from "./views/drawAside";
import drawMain from "./views/drawMain";
export default {
  components: {
    drawAside,
    drawMain
  },
  data() {
    return {
    };
  },
  mounted(){
    document.querySelector('.el-aside').style.height = document.body.clientHeight + 'px'
  },
  methods: {
  }
};
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
.el-main{
  overflow:hidden;
}
</style>
