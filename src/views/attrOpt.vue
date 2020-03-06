<template>
  <div class="attrOpt" v-show="attrPalToggle">
    <p class="title">
      <span>属性控制</span>
      <i @click="changeAttrPalToggle" class="el-icon-d-arrow-right fr"></i>
    </p>
    <ul>
      <li>
        <span>背景颜色：</span>
        <el-color-picker
          v-model="bgColor"
          show-alpha
          :predefine="predefineColors"
        >
        </el-color-picker>
      </li>
      <li>
        <span>线条颜色：</span>
        <el-color-picker
          v-model="strokeColor"
          show-alpha
          :predefine="predefineColors"
        >
        </el-color-picker>
      </li>
      <li>
        <span>线条宽度：</span>
        <el-input-number
          v-model="strokeWidth"
          @change="handleChange"
          :min="1"
          :max="10"
        ></el-input-number>
      </li>

      <li>
        <span>填充颜色：</span>
        <el-color-picker
          v-model="fillColor"
          show-alpha
          :predefine="predefineColors"
        >
        </el-color-picker>
      </li>
      <li>
        <span>连接线类型：</span>
        <el-popover placement="bottom" width="400" trigger="click">
          <el-button slot="reference">类型</el-button>
          <div v-for="it in joinLine" :key="it.id" class="commonItem">
            <svg
              width="145"
              height="15"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              @click="getJoinLineType(it)"
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
            </svg>
          </div>
        </el-popover>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bgColor: "#000",
      strokeColor: "red",
      strokeWidth: 1,
      fillColor: "#000",
      predefineColors: [
        //默认预选颜色
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
        "#1e90ff",
        "#c71585",
        "rgba(255, 69, 0, 0.68)",
        "rgb(255, 120, 0)",
        "hsv(51, 100, 98)",
        "hsva(120, 40, 94, 0.5)",
        "hsl(181, 100%, 37%)",
        "hsla(209, 100%, 56%, 0.73)",
        "#c7158577"
      ],
      joinLine: [
        {
          id: "commonline",
          x1: 5,
          y1: 5,
          x2: 200,
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
          y1: 5,
          x2: 200,
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
          y1: 5,
          x2: 200,
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
          y1: 5,
          x2: 200,
          y2: 5,
          style: {
            stroke: "#fff",
            strokeWidth: 1,
            fill: "#1f272f"
          },
          dasharray: "20,10,5,10,20,10"
        }
      ]
    };
  },
  methods: {
    handleChange(val) {
      console.log(val);
    },
    changeAttrPalToggle() {
      this.$store.commit("changeAttrPalToggle", false);
    },
    getJoinLineType(it) {
      this.$store.commit("changeJoinLineType", it);
    }
  },
  computed: {
    attrPalToggle() {
      return this.$store.state.attrPalToggle;
    }
  },
  watch: {
    bgColor() {
      this.$store.commit("changebgColor", this.bgColor);
    },
    strokeColor() {
      this.$store.commit("changeStrokeColor", this.strokeColor);
    },
    strokeWidth() {
      this.$store.commit("changeStrokeWidth", this.strokeWidth);
    },
    fillColor() {
      this.$store.commit("changeFillColor", this.fillColor);
    }
  }
};
</script>

<style lang="less" scoped>
.attrOpt {
  background: #1f2631;
  .title {
    padding: 0 20px;
    height: 40px;
    background: #2a353d;
    color: #b8b8b8;
    font-size: 14px;
    line-height: 40px;
    i {
      line-height: 40px;
      cursor: pointer;
    }
  }
  ul {
    width: 200px;
    padding: 0 20px;
    li {
      color: #b8b8b8;
      font-size: 14px;
      line-height: 50px;
    }
  }
  /deep/.commonItem {
    display: inline-block;
    margin-left: 90px;
    width: 100%;
    height: 5px;
    margin: 2px;
    position: relative;
    cursor: pointer;
  }
}
</style>
