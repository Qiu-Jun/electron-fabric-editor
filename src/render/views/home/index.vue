<template>
  <div class="home">
    <!-- <el-button @click="test">测试UseModal</el-button> -->
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div class="flex items-center">
          <Logo />
          <el-divider direction="vertical" />
          <ImportJson />
          <el-divider direction="vertical" />
          <ImportFile />
          <el-divider direction="vertical" />
          <router-link custom v-slot="{ navigate }" to="/editor/template" target="_blank">
            <el-button text @click="navigate">全部模板</el-button>
          </router-link>
          <el-divider direction="vertical" />
          <MyTemplName />

          <el-tooltip :content="$t('grid')">
            <el-switch v-model="state.ruler" @change="rulerSwitch" size="small" class="mx-10px" />
          </el-tooltip>
          <el-divider direction="vertical" />
          <History />
        </div>
        <div class="flex items-center">
          <a
            class="mr-10px"
            href="https://github.com/ikuaitu/element-fabric-editor"
            target="_blank"
          >
            <img
              src="https://img.shields.io/badge/GitHub-ElementFbricEditor-blue"
              alt="element-fbric-editor"
            />
          </a>
          <PreviewCurrent />
          <el-divider direction="vertical" />
          <Save />
          <el-divider direction="vertical" />
          <Login />
        </div>
      </el-header>
      <el-main>
        <!-- 左侧区域 -->
        <div v-if="state.show" :class="`left-bar ${state.toolsBarShow && 'show-tools-bar'}`">
          <!-- 左侧菜单 -->
          <el-menu :default-active="menuActive" @select="showToolsBar" width="65px">
            <el-menu-item v-for="item in leftBar" :key="item.key" :index="item.key">
              <template #title>
                <span class="mt-10px">
                  <SvgIcon :style="{ width: '20px', height: '20px' }" :name="item.icon" />
                </span>
                <span> {{ item.name }} </span>
              </template>
            </el-menu-item>
          </el-menu>
          <!-- 左侧组件 -->
          <div class="flex-1 px-10px h-full overflow-y-auto" v-show="state.toolsBarShow">
            <div class="left-panel">
              <KeepAlive>
                <component :is="leftBarComponent[menuActive]"></component>
              </KeepAlive>
            </div>
          </div>
          <!-- 关闭按钮 -->
          <div
            :class="`close-btn left-btn ${state.toolsBarShow && 'left-btn-open'}`"
            @click="hideToolsBar"
          ></div>
        </div>

        <!-- 画布区域 -->
        <div class="flex-1 w-full relative overflow-hidden" id="workspace">
          <div class="relative">
            <div class="absolute w-full z-2 inside-shadow"></div>
            <canvas
              class="w-300px h-300px mx-auto"
              id="canvas"
              :class="state.ruler ? 'design-stage-grid' : ''"
            ></canvas>
            <DragMode v-if="state.show" />
            <Zoom />
          </div>
        </div>

        <!-- 属性区域 380-->
        <div class="right-bar" v-show="state.attrBarShow">
          <div v-if="state.show" style="padding-top: 10px">
            <!-- 未选择元素时 展示背景设置 -->
            <div v-show="!mixinState.mSelectMode">
              <SetSize />
              <BgBar />
            </div>

            <!-- 多选时展示 -->
            <div v-show="mixinState.mSelectMode === 'multiple'">
              <!-- 分组 -->
              <Group />
              <!-- 组对齐方式 -->
              <Align />
              <!-- 居中对齐 -->
              <CenterAlign />
            </div>

            <div v-show="mixinState.mSelectMode === 'one'" class="attr-item-box">
              <Group />
              <el-divider content-position="left">
                <h4>快捷操作</h4>
              </el-divider>
              <div class="bg-item" v-show="mixinState.mSelectMode">
                <Lock />
                <Delete />
                <Clone />
                <Hide />
                <Edit />
              </div>

              <!-- 居中对齐 -->
              <CenterAlign />
              <!-- 替换图片 -->
              <ReplaceImg />
              <!-- 图片裁切 -->
              <ClipImage />
              <!-- 翻转 -->
              <Flip />
              <!-- 条形码属性 -->
              <AttributeBarcode />
              <!-- 二维码 -->
              <AttributeQrCode />
              <!-- 图片滤镜 -->
              <Filters />
              <!-- 图片描边 -->
              <ImgStroke />
              <!-- 颜色 -->
              <AttributeColor />
              <!-- 字体属性 -->
              <AttributeFont />
              <!-- 字体小数点 -->
              <AttributeTextFloat />
              <!-- 文字内容  -->
              <AttributeTextContent />
              <!-- 位置信息 -->
              <AttributePostion />
              <!-- 阴影 -->
              <AttributeShadow />
              <!-- 边框 -->
              <AttributeBorder />
              <!-- 圆角 -->
              <AttributeRounded />
              <!-- 关联数据 -->
              <AttributeId />

              <!-- 新增字体样式使用 -->
              <el-button @click="canvasEditor.getFontJson()" size="small">获取元素数据</el-button>
            </div>
          </div>
        </div>

        <!-- 右侧关闭按钮 -->
        <div
          :class="`close-btn right-btn ${state.attrBarShow && 'right-btn-open'}`"
          @click="switchAttrBar"
        ></div>
      </el-main>
    </el-container>
  </div>
</template>

<script name="Home" setup>
import { useRoute } from 'vue-router'
import { fabric } from 'fabric'
import ImportTmpl from '@/components/ImportTmpl.vue'
import Tools from '@/components/Tools.vue'
import Material from '@/components/Material.vue'
import FontStyle from '@/components/FontStyle.vue'
import Layer from '@/components/Layer.vue'
import MyMaterial from '@/components/myMaterial/index.vue'
// hooks
import useSelectListen from '@/hooks/useSelectListen'
import { useI18n } from 'vue-i18n'
import { apiHost } from '@/constants/app'
const { t } = useI18n()
// import { useModal } from '@/hooks/useModal'
// const { Modal } = useModal()

// const test = () => {
//   Modal.show({
//     title: '我是hook纯函数式模态框',
//     content: 'Tools'
//   })
// }
const APIHOST = apiHost

import Editor, {
  DringPlugin,
  AlignGuidLinePlugin,
  ControlsPlugin,
  // ControlsRotatePlugin,
  CenterAlignPlugin,
  LayerPlugin,
  CopyPlugin,
  MoveHotKeyPlugin,
  DeleteHotKeyPlugin,
  GroupPlugin,
  DrawLinePlugin,
  GroupTextEditorPlugin,
  GroupAlignPlugin,
  WorkspacePlugin,
  HistoryPlugin,
  FlipPlugin,
  RulerPlugin,
  MaterialPlugin,
  FontPlugin,
  PolygonModifyPlugin,
  DrawPolygonPlugin,
  FreeDrawPlugin,
  PathTextPlugin,
  PsdPlugin,
  SimpleClipImagePlugin,
  BarCodePlugin,
  QrCodePlugin,
  ImageStroke,
  ResizePlugin,
  LockPlugin,
  AddBaseTypePlugin
} from '@/lib/core'

// 创建编辑器
const canvasEditor = new Editor()

const state = reactive({
  show: false,
  toolsBarShow: true,
  attrBarShow: true,
  select: null,
  ruler: true
})

// 左侧菜单渲染
const menuActive = ref('ImportTmpl')
const leftBarComponent = {
  ImportTmpl,
  Tools,
  Material,
  FontStyle,
  Layer,
  MyMaterial
}

// fix: 修复vue-i18n function "t" not reactive inside ref object
// https://github.com/intlify/vue-i18n/issues/1396#issuecomment-1716123143
const leftBar = reactive([
  {
    //模板
    key: 'ImportTmpl',
    name: computed(() => t('templates')),
    icon: 'editor-template'
  },
  {
    //基础元素
    key: 'Tools',
    name: computed(() => t('elements')),
    icon: 'editor-tag'
  },
  {
    //字体样式
    key: 'FontStyle',
    name: computed(() => t('font_style')),
    icon: 'editor-text'
  },
  {
    // 图片元素
    key: 'Material',
    name: computed(() => t('material.cartoon')),
    icon: 'editor-tag'
  },
  {
    // 图层
    key: 'Layer',
    name: computed(() => t('layers')),
    icon: 'editor-layer'
  },
  {
    // 用户素材
    key: 'MyMaterial',
    name: computed(() => t('mine')),
    icon: 'mine'
  }
])

onMounted(() => {
  // 初始化fabric
  const canvas = new fabric.Canvas('canvas', {
    fireRightClick: true, // 启用右键，button的数字为3
    stopContextMenu: true, // 禁止默认右键菜单
    controlsAboveOverlay: true, // 超出clipPath后仍然展示控制条
    // imageSmoothingEnabled: false, // 解决文字导出后不清晰问题
    preserveObjectStacking: true // 当选择画布中的对象时，让对象不在顶层。
  })

  // 初始化编辑器
  canvasEditor.init(canvas)
  canvasEditor.use(DringPlugin)
  canvasEditor.use(PolygonModifyPlugin)
  canvasEditor.use(AlignGuidLinePlugin)
  canvasEditor.use(ControlsPlugin)
  // canvasEditor.use(ControlsRotatePlugin);
  canvasEditor.use(CenterAlignPlugin)
  canvasEditor.use(LayerPlugin)
  canvasEditor.use(CopyPlugin)
  canvasEditor.use(MoveHotKeyPlugin)
  canvasEditor.use(DeleteHotKeyPlugin)
  canvasEditor.use(GroupPlugin)
  canvasEditor.use(DrawLinePlugin)
  canvasEditor.use(GroupTextEditorPlugin)
  canvasEditor.use(GroupAlignPlugin)
  canvasEditor.use(WorkspacePlugin)
  canvasEditor.use(HistoryPlugin)
  canvasEditor.use(FlipPlugin)
  canvasEditor.use(RulerPlugin)
  canvasEditor.use(DrawPolygonPlugin)
  canvasEditor.use(FreeDrawPlugin)
  canvasEditor.use(PathTextPlugin)
  canvasEditor.use(SimpleClipImagePlugin)
  canvasEditor.use(BarCodePlugin)
  canvasEditor.use(QrCodePlugin)
  canvasEditor.use(FontPlugin, {
    repoSrc: APIHOST
  })
  canvasEditor.use(MaterialPlugin, {
    repoSrc: APIHOST
  })
  canvasEditor.use(PsdPlugin)
  canvasEditor.use(ImageStroke)
  canvasEditor.use(ResizePlugin)
  canvasEditor.use(LockPlugin)
  canvasEditor.use(AddBaseTypePlugin)

  state.show = true
  // 默认打开标尺
  if (state.ruler) {
    canvasEditor.rulerEnable()
  }

  // 有ID时，打开作品面板
  const route = useRoute()
  if (route?.query?.id) {
    menuActive.value = 'MyMaterial'
  }
})

onUnmounted(() => canvasEditor.destory())
const rulerSwitch = (val) => {
  if (val) {
    canvasEditor.rulerEnable()
  } else {
    canvasEditor.rulerDisable()
  }
  // 使标尺开关组件失焦，避免响应键盘的空格事件
  document.activeElement.blur()
}

// 隐藏工具条
const hideToolsBar = () => {
  state.toolsBarShow = !state.toolsBarShow
}
// 展示工具条
const showToolsBar = (val) => {
  console.log(val)
  menuActive.value = val
  state.toolsBarShow = true
}
// 属性面板开关
const switchAttrBar = () => {
  state.attrBarShow = !state.attrBarShow
}

const { mixinState } = useSelectListen(canvasEditor)

provide('fabric', fabric)
provide('canvasEditor', canvasEditor)
provide('mixinState', mixinState)
</script>

<style lang="scss" scoped>
.home {
  :deep(.el-header) {
    --height: 45px;
    padding: 0 10px;
    border-bottom: 1px solid #eef2f8;
    background: #fff;
    height: var(--height);
    line-height: var(--height);
    display: flex;
    justify-content: space-between;
  }

  :deep(.el-main) {
    display: flex;
    height: calc(100vh - 45px);
    padding: 0;
    overflow: hidden;
  }

  :deep(.el-menu-item) {
    flex-direction: column;
    justify-content: center;
    height: 60px;
    line-height: 20px;
  }

  // 画布内阴影
  .inside-shadow {
    box-shadow: inset 0 0 9px 2px #0000001f;
    pointer-events: none;
  }

  #workspace {
    background: #f1f1f1;
  }

  // 网格背景
  .design-stage-grid {
    --offsetX: 0px;
    --offsetY: 0px;
    --size: 16px;
    --color: #dedcdc;
    background-image: linear-gradient(
        45deg,
        var(--color) 25%,
        transparent 0,
        transparent 75%,
        var(--color) 0
      ),
      linear-gradient(45deg, var(--color) 25%, transparent 0, transparent 75%, var(--color) 0);
    background-position: var(--offsetX) var(--offsetY),
      calc(var(--size) + var(--offsetX)) calc(var(--size) + var(--offsetY));
    background-size: calc(var(--size) * 2) calc(var(--size) * 2);
  }

  // 左侧容器
  .left-bar {
    box-sizing: border-box;
    width: 65px;
    height: 100%;
    background: #fff;
    display: flex;
    position: relative;

    &.show-tools-bar {
      width: 380px;
    }
  }
  // 右侧容器
  .right-bar {
    box-sizing: border-box;
    width: 304px;
    height: 100%;
    padding: 10px;
    overflow-y: auto;
    background: #fff;
  }

  // 关闭按钮
  .close-btn {
    width: 20px;
    height: 64px;
    cursor: pointer;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAACACAMAAABOb9vcAAAAhFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAADHx8cODg50dHTx8fF2dnZ1dXWWlpZHR0c4ODhQpkZ5AAAAIXRSTlMA9t+/upkRAnPq5NXDfDEsKQjMeGlRThkMsquljTwzIWhBHpjgAAABJElEQVRYw+3YyW7CQBCEYbxig8ELGJyQkJRJyPb+75dj3zy/lD7kMH3+ZEuzSFO1mlZwhjOE2uwhVHJYMygNVwilhz2EUvNaMigledUFoE1anKYAtA9nVRuANpviOQBt0t2ZQSnZ9QxK6Qih9LSGUHkJobYlhGp6CPW4hlAVhckLhMop1InCjEK1FBYU1hSqo/BI4YXCjMIthTWFijDCCB3g7fuO4O1t/rkvQXPz/LUIzX0oAM0tQHOfCkBzC9DcuwLQXACao9Dv1yb9lsek2xaaxMcMH1x6Ff79dY0wwgj/DGv3p2tG4cX9wd55h4rCO/hk3uEs9w6QlXPIbXrfIJ6XrmVBOtJCA1YkXqVLkh1aUgyNk1fV1BxLxzpsuNLKzrME/AWr0ywwvyj83AAAAABJRU5ErkJggg==);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 50%;
    position: absolute;
    right: -20px;
    z-index: 1;
    top: 50%;
    margin-top: -10px;

    &.left-btn {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAACACAYAAAB5sSvuAAAAAXNSR0IArs4c6QAAAFBlWElmTU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKKADAAQAAAABAAAAgAAAAAAobJzlAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoZXuEHAAADf0lEQVR4Ae2cvYsTQRjGE7FQkICFB1pZRyzEJkUKmzOpBEHwX9DCQkmChf4JahewsLpWFOQUzwMRPEgEy0PLpPADvEISDrVyfZ6cK0tIZrI7u7MPMi+8mb35uPnlmXczyeXmrURRdKyibAB8Dz8pywg42if4OUnIGd7Bww8Ut+GHpEATgPEll/y8DGRMtaB8hrryl30B2HzVW1Rcgx8vQ9UqaVac+Cf67cC34C+q1erHFcc5dUsDOD/RGBWv4M/hrwG8jzJ3cwFMwlDdd/BN+BZgd5ONLtd5Ac4zfEYFld0ALMMisxUFmAQa44dHdMB+TTasdM2bxJNxI7gDP7ISWNzJE1xymhF+uBzPbyvL2NZOA+oJIO/BrfP7iEGTSNtovIrY/L6sU9mA5PoAby6DtEq87JnlWF/H7+K+v/DmUQDkc23CNxbFpAogIa/Ab/IiaQoxmOThlnkG8TiKK5UUJNNR+MMYjqUaIJnWEYuXeEFTBCTXv1hUi0HCxXYWsbirqiAhb/BBWcE9KLimDEgB68pLTMAL6oBNdcBT6oBr6oAn1O9i2a2Od/DM1Jc4KBivVOYyLHFm6f4ODAoGBV0VcB0fYjAo6KqA6/gQg0FBVwVcx4cYDAq6KuA6/v+Mwel0Wmm325XhcOgqkH08/h6cyiaTSdRoNPhvBFGtVosGg0Gq8Wk7V9IO6Pf7MzgC+oBMDcgn1Ov1vEFmAvQJmRmQkN1ut3AlnQB9QDoDErLT6RSmZC6ARULmBlgUpPxWl5uCRcVhLoBFwTFsnAGLfi10AiwazklBX/txJgV9wWVSUP7tlvwbVspOyFarVfi7ac4Vvquzfyoy95DfiwOgeQHtrUFBu0bmHkFBsz721qCgXSNzj6CgWR97a1DQrpG5R1DQrI+9NSho18jcIyho1sfauqeuoDzgN3UFv6gD7qh/cK8rA84OGygv8VO+CCkrKH3g5Q1P41BB1SV+QDia4hJvQ72LB3h6gPIH/+5CvVGsntoSPwYQzxr/VgRkJoF1wP1KwvFa4SaRPgDNI+RLT2dTwTJfB+9j/jaWden5dgIe5oNnG2O+WwCb7bXWuflliSfLlAjCh4JULHMqjaIAc0tGkhdgnM6FyXI2EV+5pXNxAeTSMSHOSzg3+H2UuVsaQKq0A/eaUmiVb9yZlOk6vJSkTCZA2bRWsonBpFOrySan+wNoJmOM0LyBGwAAAABJRU5ErkJggg==);
    }

    &.left-btn-open {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAACACAMAAABOb9vcAAAAhFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAADHx8cODg50dHTx8fF2dnZ1dXWWlpZHR0c4ODhQpkZ5AAAAIXRSTlMA9t+/upkRAnPq5NXDfDEsKQjMeGlRThkMsquljTwzIWhBHpjgAAABJElEQVRYw+3YyW7CQBCEYbxig8ELGJyQkJRJyPb+75dj3zy/lD7kMH3+ZEuzSFO1mlZwhjOE2uwhVHJYMygNVwilhz2EUvNaMigledUFoE1anKYAtA9nVRuANpviOQBt0t2ZQSnZ9QxK6Qih9LSGUHkJobYlhGp6CPW4hlAVhckLhMop1InCjEK1FBYU1hSqo/BI4YXCjMIthTWFijDCCB3g7fuO4O1t/rkvQXPz/LUIzX0oAM0tQHOfCkBzC9DcuwLQXACao9Dv1yb9lsek2xaaxMcMH1x6Ff79dY0wwgj/DGv3p2tG4cX9wd55h4rCO/hk3uEs9w6QlXPIbXrfIJ6XrmVBOtJCA1YkXqVLkh1aUgyNk1fV1BxLxzpsuNLKzrME/AWr0ywwvyj83AAAAABJRU5ErkJggg==);
      transform: rotateY(360deg);
    }

    &.right-btn {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAACACAYAAAB5sSvuAAAAAXNSR0IArs4c6QAAAFBlWElmTU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKKADAAQAAAABAAAAgAAAAAAobJzlAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoZXuEHAAADf0lEQVR4Ae2cvYsTQRjGE7FQkICFB1pZRyzEJkUKmzOpBEHwX9DCQkmChf4JahewsLpWFOQUzwMRPEgEy0PLpPADvEISDrVyfZ6cK0tIZrI7u7MPMi+8mb35uPnlmXczyeXmrURRdKyibAB8Dz8pywg42if4OUnIGd7Bww8Ut+GHpEATgPEll/y8DGRMtaB8hrryl30B2HzVW1Rcgx8vQ9UqaVac+Cf67cC34C+q1erHFcc5dUsDOD/RGBWv4M/hrwG8jzJ3cwFMwlDdd/BN+BZgd5ONLtd5Ac4zfEYFld0ALMMisxUFmAQa44dHdMB+TTasdM2bxJNxI7gDP7ISWNzJE1xymhF+uBzPbyvL2NZOA+oJIO/BrfP7iEGTSNtovIrY/L6sU9mA5PoAby6DtEq87JnlWF/H7+K+v/DmUQDkc23CNxbFpAogIa/Ab/IiaQoxmOThlnkG8TiKK5UUJNNR+MMYjqUaIJnWEYuXeEFTBCTXv1hUi0HCxXYWsbirqiAhb/BBWcE9KLimDEgB68pLTMAL6oBNdcBT6oBr6oAn1O9i2a2Od/DM1Jc4KBivVOYyLHFm6f4ODAoGBV0VcB0fYjAo6KqA6/gQg0FBVwVcx4cYDAq6KuA6/v+Mwel0Wmm325XhcOgqkH08/h6cyiaTSdRoNPhvBFGtVosGg0Gq8Wk7V9IO6Pf7MzgC+oBMDcgn1Ov1vEFmAvQJmRmQkN1ut3AlnQB9QDoDErLT6RSmZC6ARULmBlgUpPxWl5uCRcVhLoBFwTFsnAGLfi10AiwazklBX/txJgV9wWVSUP7tlvwbVspOyFarVfi7ac4Vvquzfyoy95DfiwOgeQHtrUFBu0bmHkFBsz721qCgXSNzj6CgWR97a1DQrpG5R1DQrI+9NSho18jcIyho1sfauqeuoDzgN3UFv6gD7qh/cK8rA84OGygv8VO+CCkrKH3g5Q1P41BB1SV+QDia4hJvQ72LB3h6gPIH/+5CvVGsntoSPwYQzxr/VgRkJoF1wP1KwvFa4SaRPgDNI+RLT2dTwTJfB+9j/jaWden5dgIe5oNnG2O+WwCb7bXWuflliSfLlAjCh4JULHMqjaIAc0tGkhdgnM6FyXI2EV+5pXNxAeTSMSHOSzg3+H2UuVsaQKq0A/eaUmiVb9yZlOk6vJSkTCZA2bRWsonBpFOrySan+wNoJmOM0LyBGwAAAABJRU5ErkJggg==);
      transform: rotateY(180deg);
      right: 0px;
    }

    &.right-btn-open {
      background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAACACAMAAABOb9vcAAAAhFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAADHx8cODg50dHTx8fF2dnZ1dXWWlpZHR0c4ODhQpkZ5AAAAIXRSTlMA9t+/upkRAnPq5NXDfDEsKQjMeGlRThkMsquljTwzIWhBHpjgAAABJElEQVRYw+3YyW7CQBCEYbxig8ELGJyQkJRJyPb+75dj3zy/lD7kMH3+ZEuzSFO1mlZwhjOE2uwhVHJYMygNVwilhz2EUvNaMigledUFoE1anKYAtA9nVRuANpviOQBt0t2ZQSnZ9QxK6Qih9LSGUHkJobYlhGp6CPW4hlAVhckLhMop1InCjEK1FBYU1hSqo/BI4YXCjMIthTWFijDCCB3g7fuO4O1t/rkvQXPz/LUIzX0oAM0tQHOfCkBzC9DcuwLQXACao9Dv1yb9lsek2xaaxMcMH1x6Ff79dY0wwgj/DGv3p2tG4cX9wd55h4rCO/hk3uEs9w6QlXPIbXrfIJ6XrmVBOtJCA1YkXqVLkh1aUgyNk1fV1BxLxzpsuNLKzrME/AWr0ywwvyj83AAAAABJRU5ErkJggg==);
      right: 304px;
    }
  }
}
</style>
