<template>
  <div class="drawAside">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item title="通用" name="1">
        <div v-for="it in dataList.common" :key="it.id" class="commonItem">
          <div v-if="it.id === 'text'" @click="getPicInfo(it)" class="text">
            T
          </div>
          <svg
            width="60"
            v-else
            height="60"
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
              :stroke="it.style.stroke"
              :strokeWidth="it.style.strokeWidth"
              :fill="it.style.fill"
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
            x1: 5,
            y1: 55,
            x2: 55,
            y2: 5,
            style: {
              stroke: "#fff",
              strokeWidth: 1,
              fill: "#1f272f"
            }
          },
          {
            id: "dashLine1",
            x1: 5,
            y1: 55,
            x2: 55,
            y2: 5,
            style: {
              stroke: "#fff",
              strokeWidth: 1,
              fill: "#1f272f"
            },
            dasharray: "5,5"
          },
          {
            id: "dashLine2",
            x1: 5,
            y1: 55,
            x2: 55,
            y2: 5,
            style: {
              stroke: "#fff",
              strokeWidth: 1,
              fill: "#1f272f"
            },
            dasharray: "10,10"
          },
          {
            id: "dashLine3",
            x1: 5,
            y1: 55,
            x2: 55,
            y2: 5,
            style: {
              stroke: "#fff",
              strokeWidth: 1,
              fill: "#1f272f"
            },
            dasharray: "8,4,1,1,1,4"
          },
          {
            id: "polyline",
            points: "2,2 2,55 55,55",
            style: {
              stroke: "#fff",
              strokeWidth: 1,
              fill: "#1f272f"
            }
          },
          {
            id: "circle",
            cx: 27,
            cy: 27,
            r: 26,
            style: {
              stroke: "#fff",
              strokeWidth: 1,
              fill: "#1f272f"
            }
          },
          {
            id: "rect",
            x: 2,
            y: 2,
            width: 52,
            height: 52,
            style: {
              stroke: "#fff",
              strokeWidth: 1,
              fill: "#1f272f"
            }
          },
          {
            id: "ellipse",
            cx: 27,
            cy: 27,
            rx: 26,
            ry: 18,
            style: {
              stroke: "#fff",
              strokeWidth: 1,
              fill: "#1f272f"
            }
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
  position: relative;
}
.commonItem {
  display: inline-block;
  width: 55px;
  height: 55px;
  cursor: pointer;
  margin: 2px;
  position: relative;
}
.pelStyle {
  width: 53px;
  height: 53px;
  margin: 2px;
  display: inline-block;
  cursor: pointer;
  img {
    width: 53px;
    height: 53px;
    margin: 2px;
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
  position: absolute;
  width: 53px;
  height: 53px;
  color: #fff;
  font-size: 24px;
  text-align: center;
  line-height: 60px;
  border: 1px solid rgba(62, 74, 82);
  background: #2a353d;
}
</style>
