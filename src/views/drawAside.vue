<template>
  <div class="drawAside">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="通用" name="1">
        <div v-for="it in dataList.common" :key="it.id" class="commonItem">
          <div v-if="it.id === 'text'" @click="getPicInfo(it)" class="text">
            Text
          </div>
          <svg
            width="35"
            v-else
            height="35"
            version="1.1"
            @click="getPicInfo(it)"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              v-if="it.id === 'commonline'"
              :x1="it.x1"
              :y1="it.y1"
              :x2="it.x2"
              :y2="it.y2"
              :style="it.style"
            />
            <line
              v-if="it.id === 'dashLine1'"
              :x1="it.x1"
              :y1="it.y1"
              :x2="it.x2"
              :stroke-dasharray="it.dasharray"
              :y2="it.y2"
              :style="it.style"
            />
            <line
              v-if="it.id === 'dashLine2'"
              :x1="it.x1"
              :y1="it.y1"
              :x2="it.x2"
              :stroke-dasharray="it.dasharray"
              :y2="it.y2"
              :style="it.style"
            />
            <line
              v-if="it.id === 'dashLine3'"
              :x1="it.x1"
              :y1="it.y1"
              :x2="it.x2"
              :stroke-dasharray="it.dasharray"
              :y2="it.y2"
              :style="it.style"
            />
            <polyline
              v-if="it.id === 'polyline'"
              :points="it.points"
              :style="it.style"
            />
            <!-- <polygon v-if='it.id==="polygon"' :points="it.points" :style="it.style"/>
            <polygon v-if='it.id==="path"' :points="it.points" :style="it.style"/> -->
            <circle
              v-if="it.id === 'circle'"
              :cx="it.cx"
              :cy="it.cy"
              :r="it.r"
              :style="it.style"
            />
            <ellipse
              v-if="it.id === 'ellipse'"
              :cx="it.cx"
              :cy="it.cy"
              :rx="it.rx"
              :ry="it.ry"
              :style="it.style"
            />
            <rect
              v-if="it.id === 'rect'"
              :x="it.x"
              :y="it.y"
              :width="it.width"
              :height="it.height"
              :style="it.style"
            />
          </svg>
        </div>
      </el-collapse-item>
      <el-collapse-item title="变压器" name="2">
        <div
          v-for="it in dataList.byqList"
          :key="it.id"
          @click="getPicInfo(it)"
          class="pelStyle"
          @mouseenter="getId(it)"
          @mouseout="getId"
        >
          <img :src="it.img" />
          <p class="noticeText" v-show="curId === it.id">{{ it.name }}</p>
        </div>
      </el-collapse-item>
      <el-collapse-item title="开关" name="3">
        <div
          v-for="it in dataList.kgList"
          :key="it.id"
          @click="getPicInfo(it)"
          class="pelStyle"
        >
          <img :src="it.img" />
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: "drawAside",
  data() {
    return {
      activeNames: ["1"],
      curId: "",
      dataList: {
        common: [
          {
            id: "text"
          },
          {
            id: "commonline",
            x1: 0,
            y1: 35,
            x2: 35,
            y2: 0,
            style: "stroke:rgb(99,99,99);stroke-width:1"
          },
          {
            id: "dashLine1",
            x1: 0,
            y1: 35,
            x2: 35,
            y2: 0,
            style: "stroke:rgb(99,99,99);stroke-width:1",
            dasharray: "5,5"
          },
          {
            id: "dashLine2",
            x1: 0,
            y1: 35,
            x2: 35,
            y2: 0,
            style: "stroke:rgb(99,99,99);stroke-width:1",
            dasharray: "10,10"
          },
          {
            id: "dashLine3",
            x1: 0,
            y1: 35,
            x2: 35,
            y2: 0,
            style: "stroke:rgb(99,99,99);stroke-width:1",
            dasharray: "8,4,1,1,1,4"
          },
          {
            id: "polyline",
            points: "2,2 2,33 33,33",
            style: "stroke:rgb(99,99,99);stroke-width:2;fill:white;"
          },
          // {
          //   id:'polygon',
          //   points:'2,2 2,33 33,33',
          //   style:'stroke:rgb(99,99,99);stroke-width:2;fill:white;',
          // },
          // {
          //   id:'path',
          //   points:'2,2 2,33 33,26 33,0',
          //   style:'stroke:rgb(99,99,99);stroke-width:2;fill:white;',
          // },
          {
            id: "circle",
            cx: 17,
            cy: 17,
            r: 16,
            style: "stroke:rgb(99,99,99);stroke-width:2;fill:white;"
          },
          {
            id: "ellipse",
            cx: 17,
            cy: 17,
            rx: 16,
            ry: 12,
            style: "stroke:rgb(99,99,99);stroke-width:2;fill:white;"
          },
          {
            id: "rect",
            x: 2,
            y: 2,
            width: 30,
            height: 30,
            style: "stroke:rgb(99,99,99);stroke-width:2;fill:white;"
          }
        ],
        byqList: [
          {
            id: "BYQ_ZS",
            name: "柱上变压器（公用变）",
            img: require("../assets/img/byq/BYQ_ZS.png")
          },
          {
            id: "BYQ_SRZ_110_10",
            name: "110kV-10kV双绕组变压器",
            img: require("../assets/img/byq/BYQ_SRZ_110_10.png")
          },
          {
            id: "BYQ_SRZ_35_10",
            name: "35kV-10kV双绕组变压器",
            img: require("../assets/img/byq/BYQ_SRZ_35_10.png")
          },
          {
            id: "BYQ_SRZ_10_380",
            name: "10kV-380V双绕组变压器",
            img: require("../assets/img/byq/BYQ_SRZ_10_380.png")
          }
        ],
        kgList: [
          {
            id: "KG_DLQ_H",
            name: "断路器（合）",
            img: require("../assets/img/kg/KG_DLQ_H.png")
          },
          {
            id: "KG_DLQ_F",
            name: "断路器（分）",
            img: require("../assets/img/kg/KG_DLQ_F.png")
          },
          {
            id: "KG_FHKG_H",
            name: "断路器（合）",
            img: require("../assets/img/kg/KG_FHKG_H.png")
          },
          {
            id: "KG_FHKG_F",
            name: "断路器（分）",
            img: require("../assets/img/kg/KG_FHKG_F.png")
          }
        ]
      }
    };
  },
  created() {},
  methods: {
    handleChange(val) {
      console.log(val);
    },
    //获取图元信息
    getPicInfo(it) {
      console.log(it);
      this.$store.commit("changePencelType", it.id);
    },
    getId(it) {
      this.curId = (it && it.id) || "";
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.el-collapse-item__content {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  position: relative;
}
.commonItem {
  flex: 1;
  cursor: pointer;
  margin: 8px;
}
.pelStyle {
  display: inline-block;
  // width: 50px;
  // height: 50px;
  cursor: pointer;
  img {
    width: 35px;
    height: 35px;
    margin: 7px 7px 8px 8px;
    z-index: 1;
  }
  .noticeText {
    position: absolute;
    top: 0;
    left: 50px;
    z-index: 2;
    padding: 4px;
    background: #f2f2f2;
    border: 1px solid #ddd;
    color: #666;
  }
}
.text {
  cursor: pointer;
  text-align: center;
  line-height: 35px;
}
</style>
