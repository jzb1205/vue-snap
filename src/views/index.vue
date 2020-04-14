<template>
  <div class="geograph">
    <div class="nav" style>
      <el-tree
        :data="treeDate"
        node-key="id"
        :load="loadNode"
        lazy
        :default-expanded-keys="[2, 3]"
        :default-checked-keys="[5]"
        :props="defaultProps"
        highlight-current
      >
        <span class="span-ellipsis" slot-scope="{node}">
          <span v-if="node.data.parentid!=''" style="display:flex; justify-content:flex-end">
            <div @click.stop="locationPlace(node)" title="定位" style="padding:10px;">
              <img class="img" :src="locationInco" />
            </div>
            <div @click.stop="searchAccount(node)" title="查看台账" style="padding:10px;">
              <img class="img" :src="eyeInco" v-if="selectIndex==node.id" />
              <img class="img" :src="closeEye" v-else />
            </div>
          </span>

          <span :title="node.label" class="span-ellipsis-title">{{ node.label }}</span>
        </span>
      </el-tree>
    </div>
    <div class="map">
      <map-content ref="mapContentRef"></map-content>
    </div>
  </div>
</template>

<script>
import { homePageLineTree, lineTreeLocation } from "@/api/index.js";

import { mapState, mapActions } from "vuex";
import mapContent from "./map.vue";
export default {
  data() {
    return {
      selectIndex: "",
      treeDate: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      eyeInco: require("@/assets/imgs/eye.png"),
      closeEye: require("@/assets/imgs/location.png"),
      locationInco: require("@/assets/imgs/dingwei.png"),
      queryInfo: {
        id: "",
        sbzlx: "",
        parentid: "",
        oid: ""
      },
      locationInfo: {
        sbzlx: "",
        parentid: "",
        oid: "",
        versionid: "",
        csys: "1",
        scale: "",
        isParent: ""
      }
    };
  },
  created() {
    this.homePageLineTree();
  },
  computed: {
    ...mapState(["isShowAccount", "currentMapType"])
  },
  components: {
    mapContent
  },
  methods: {
    ...mapActions([
      "locationDataAction",
      "isShowAccountAction",
      "currentLeftTreeObjAction"
    ]),
    async homePageLineTree() {
      const { success, msg, result } = await homePageLineTree(this.queryInfo);
      if (!success) return this.$message(msg);
      this.treeDate = result;
    },
    async loadNode(node, resolve) {
      let nodeInfo = node.data;
      if (!nodeInfo.isParent) return resolve([]);
      this.queryInfo = {
        id: nodeInfo.id,
        sbzlx: nodeInfo.sbzlx,
        parentid: nodeInfo.parentid,
        oid: nodeInfo.oid
      };
      // if (node.level > 1) return resolve([]);
      const { success, msg, result } = await homePageLineTree(this.queryInfo);
      if (!success) {
        return this.$notify({
          title: "提示",
          message: msg,
          type: "info",
          duration: 1000
        });
      }
      let rightData = this.filterData(result);
      resolve(rightData);
    },
    filterData(result) {
      const rightData = result.filter(item => {
        return item.name != null;
      });
      return rightData;
    },
    // 定位
    async locationPlace(node) {
      let nodeInfo = node.data;
      let csys = "";
      if (this.currentMapType === "siji") {
        csys = "4";
      } else {
        csys = "3";
      }
      this.locationInfo = {
        sbzlx: nodeInfo.sbzlx,
        parentid: nodeInfo.parentid,
        oid: nodeInfo.oid,
        versionid: "",
        csys: csys,
        scale: "",
        isParent: nodeInfo.isParent
      };
      const { success, msg, result } = await lineTreeLocation(
        this.locationInfo
      );
      // if (!success) return this.$message(msg);
      if (result.length == 0) {
        return;
      } else {
        this.locationDataAction(result);
        this.$refs.mapContentRef.locationToPlace();
      }
    },
    searchAccount(node) {
      this.currentLeftTreeObjAction(node.data);
      this.selectIndex = node.id;
      this.isShowAccountAction(true);
    }
  }
};
</script>

<style lang="less" scoped>
.geograph {
  display: flex;
  height: 100%;
  .nav {
    width: 310px;
    min-height: 100%;
    background: #0c1631;
    .span-ellipsis {
      .img {
        width: 15px;
        height: 15px;
        display: inline-block;
      }
    }
  }

  .map {
    flex: 1;
    position: relative;
  }
}
</style>

<style lang="less">
.geograph .nav .el-tree {
  background: #0c1631;
  color: #ffffff;
  max-height: 100%;
  overflow: auto;
  .el-tree-node__content {
    height: 40px;
    .el-tree-node__label {
      font-size: 12px;
    }
  }
}
.geograph
  .nav
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  color: #000;
}
.geograph .nav .el-tree :hover {
  background: #11233d;
  color: #a7c3d1;
}

.span-ellipsis {
  width: 100%;
  display: flex;
  align-content: center;
  // justify-content: space-between;
  // padding-right: 8px;
  .span-ellipsis-title {
    line-height: 40px;
    max-width: 180px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
    font-size: 14px;
  }
}

// .geograph
//   .nav
//   .el-tree--highlight-current
//   .el-tree-node.is-current
//   > .el-tree-node__content
//   > .span-ellipsis:hover {
//   background: #ffffff !important;
// }
// .geograph
//   .nav
//   .el-tree--highlight-current
//   .el-tree-node.is-current
//   > .el-tree-node__content
//   > .span-ellipsis
//   > .span-ellipsis-title:hover {
//   background: #ffffff !important;
// }
// .el-tree--highlight-current > .span-ellipsis > .span-ellipsis-title:hover {
//   background: #ffffff !important;
// }

.geograph {
  .nav {
    .el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content {
      background: #144066;
      color: #a7c3d1;
    }
  }
}
</style>