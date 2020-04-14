<template>
	<div id="app">
		<el-container>
			<el-aside width="310px" style="background:#0c1631;">
				<el-tree style="background: #0c1631;color: #fff;" :data="treeDataList" node-key="id" :default-expanded-keys="expanded"
				 :props="defaultProps" @node-click="handleNodeClick">
				</el-tree>
			</el-aside>
			<el-container>
				<el-main>
					<div class="drawMainWrap">
						<div class="importAndExport" @click="optionPanlBool = false">
							<input type="file" id="svgImport" name="image" @click="snapLoad" @change="preview($event)" />
							<div @click="downLoad" class="downLoad">
								<img src="./assets/img/item/export.png" alt="" />
								<span>导出</span>
							</div>
						</div>
						<div id="workarea" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
						 element-loading-background="rgba(0, 0, 0)">
							<div id="svgroot">
								<svg id="svgContent" :width="svgOpt.width" :height="svgOpt.height" :viewBox="svgOpt.viewBox"
								 preserveaspectratio="xMidYMid meet"></svg>
							</div>
						</div>
					</div>
				</el-main>
			</el-container>
			<!-- <attrOpt></attrOpt> -->
		</el-container>
	</div>
</template>

<script>
	import treeData from "./views/data.json";
	import axios from "axios"
	import req from "./config/req.js"
	export default {
		data() {
			return {
				treeDataList: treeData.result,
				defaultProps: {
					children: "children",
					label: "name"
				},
				svgContent: null, //svg内容对象
				svgBg: null, //svg背景对象
				svgMag: 1, //svg放大倍数
				svgMagMin: 0.1, //svg缩放最小比例
				svgMagMax: 20, //svg缩放最大比例
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
				svgOpt: {
					width: "100%",
					height: "100%",
					viewBox: `0 0 ${document.body.clientWidth} ${document.body.clientHeight}`
				},
				scaleNum: 1, //svg缩放倍数
				loading: false, //导入svg时样式
				importBgObj: null, //导入时 的背景对象
				timer: null,
				expanded: ["766-40D7-ACF4-FEA945102112-02703"]
			};
		},
		created() {
			this.$nextTick(function() {
				this.init();
			});
		},
		mounted() {
			document.querySelector(".el-aside").style.height =
				document.body.clientHeight + "px";
		},
		methods: {
			handleNodeClick(data) {
				if (!data.name.endsWith(".svg")) return;
				let svgroot = $('#svgroot')
				let svgContent = svgroot.find('svg')
				if (svgContent) {
					svgContent.remove()
				}
				this.getSvgSource(data.filepath, data.filename, data.id)
			},
			getSvgSource(filepath, filename, attachmentid) {
				let that = this
				axios.defaults.timeout = 20000
				axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
				axios.post(req.ip + "/attachment/showImg?attachmentid=" + attachmentid, {}, {
					responseType: "blob"
				}).then(res => {
					this.snapLoad(res.config.url, 1000);
				})
			},
			//初始化
			init() {
				this.svgContent = Snap("#svgContent").drag().click(function() {
					this.attr({
						cursor: "pointer"
					});
				}).mousemove(function(e) {
					console.log("e",e)
				});
				this.cancelBH();
				let svgContent = document.querySelector("#svgContent");
				if (document.attachEvent) {
					svgContent.attachEvent("onmousewheel", this.svgScaleOption);
				} else {
					svgContent.addEventListener("mousewheel", this.svgScaleOption, false);
				}
			},
			//点击svg外框 添加拖动事件
			cancelBH() {
				let that = this;
				let svg = document.querySelector("#svgContent");
				svg.addEventListener(
					"click",
					function() {
						that.svgContent.drag();
					},
					false
				);
			},
			//导入svg图
			snapLoad(svgUrl, wait = 10000) {
				let that = this;
				this.loading = true;
				//导入时 先删除已有的 svg#svgContent
				let svgroot = document.querySelector("#svgroot");
				let svgContent = svgroot.querySelector("#svgContent");
				if (svgContent) {
					svgroot.removeChild(svgContent);
				}
				Snap.load(
					svgUrl,
					function(g) {
						this.appendChild(g.node);
					},
					document.querySelector("#svgroot")
				);
				setTimeout(() => {
					//导入完成时 给新的svg加上id=svgroot 并转化为svg对象
					let svgroot = document.querySelector("#svgroot");
					let importSvgContent = svgroot.querySelector("svg");
					if (!importSvgContent) {
						importSvgContent = document.createElement('svg')
						svgroot.appendChild(importSvgContent)
					}
					importSvgContent.id = "svgContent";
					that.loading = false;
					that.init()
				}, wait);
			},
			//获取导入svg图片本地路径
			preview() {
				console.log(document.getElementById("svgImport").files[0]);
				this.snapLoad(
					this.getObjectURL(document.getElementById("svgImport").files[0])
				);
			},
			//svg图片浏览器兼容
			getObjectURL(file) {
				let url = null;
				if (window.createObjectURL != undefined) {
					// basic
					url = window.createObjectURL(file);
				} else if (window.webkitURL != undefined) {
					// webkit or chrome
					url = window.webkitURL.createObjectURL(file);
				} else if (window.URL != undefined) {
					// mozilla(firefox)
					url = window.URL.createObjectURL(file);
				}
				return url;
			},
			//svg缩放
			svgScaleOption(e) {
				let m = new Snap.Matrix();
				if (e.wheelDelta === -120 || e.detail === 3) {
					e.preventDefault();
					this.svgMag -= 0.05;
					if (this.svgMag < this.svgMagMin) {
						this.svgMag = this.svgMagMin;
					}
					m.scale(this.svgMag, this.svgMag);
				} else if (e.wheelDelta === 120 || e.detail === -3) {
					e.preventDefault();
					this.svgMag += 0.05;
					if (this.svgMag > this.svgMagMax) {
						this.svgMag = this.svgMagMax;
					}
					m.scale(this.svgMag, this.svgMag);
					// m.e = 
				}
				this.svgContent.transform(m);
			},
			//导出svg格式图片
			downLoad() {
				let node = document.querySelector("#svgContent").innerHTML;
				let start =
					`
            <?xml version="1.0" encoding="UTF-8"?>
            <svg width="1272.6000001977" height="900" viewBox="0 0 1272.6000001977 900" coordinateExtent="119.99883653741 29.9969463000312 120.00668763559 30.0024987032688" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  xmlns:cge="http://iec.ch/TC57/2005/SVG-schema#" preserveAspectRatio="xMidYMid">
          `;
				let end = "</svg>";
				let nodeStr = start + node + end;
				var file = new File([nodeStr], "手机号.svg", {
					type: "text/plain;charset=utf-8"
				});
				saveAs(file);
			}
		},
		watch: {}
	};
</script>
<style lang="less" scoped>
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		height: 100%;
	}

	.el-aside {
		overflow-y: auto;
	}

	.el-main {
		overflow: hidden;
	}
	.drawMainWrap {
		position: absolute;
		width: 100%;
		height: calc(100% - 40px);
	}

	.importAndExport {
		height: 40px;
		line-height: 40px;
		background: rgb(12, 22, 49);
	}

	#svgImport {
		margin: 0 20px;
	}

	input[type="file"] {
		color: #fff;
	}

	#workarea {
		width: 100%;
		height: 100%;
		background: #000;
		position: absolute;
		overflow: auto;
	}

	#svgroot {
		// width: 1200px;
		height: 100%;
	}

	#svgContent {
		overflow: visible;
		z-index: 101;
	}

	#svgroot {
		position: relative;
	}

	svg {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 100;
	}

	#editor-container {
		position: absolute;
		width: 120px;
		height: auto;
		z-index: 1000;
		background: #ccc;
		cursor: pointer;
		border-radius: 5px;
		padding: 20px;

		p {
			text-align: right;
		}

		ul {
			li {
				line-height: 35px;

				&:hover {
					color: #fff;
				}
			}
		}
	}

	.downLoad {
		background: rgb(12, 22, 49);
		border-color: #121a1f;
		color: #fff;
		display: inline-block;
		height: 30px;
		line-height: 35px;
		padding: 0 6px;
		position: absolute;
		top: 5px;
		border: 1px solid #121a1f;
		cursor: pointer;

		img {
			position: relative;
			top: 3px;
			margin-right: 3px;
		}
	}

	.toggle {
		color: #fff;
		line-height: 40px;
		margin-right: 20px;
		cursor: pointer;
	}
</style>
