<template>
  <div id="waifu">
    <div id="waifu-tips" />
    <canvas id="live2d" width="800" height="800" />
  </div>
</template>

<script lang="ts" setup>
import './live2d.min.js'
import { nextTick, onMounted, reactive, toRefs } from 'vue'
import { cuteEmits, cuteProps } from './cute'

defineOptions({
  name: 'LittleCute',
  inheritAttrs: false,
})
const props = defineProps(cuteProps)
const { className } = toRefs(props)
const emit = defineEmits(cuteEmits)
const forwardEmitFn = (event: any, index: any) => {
  emit(event, index)
}

const data = reactive<{
  modelList: any
  text: string | Array<string>
  now: number
  messageTimer?: NodeJS.Timer
  waifuPath: string
  cuteMode: any
}>({
  modelList: '',
  text: '',
  now: new Date().getHours(),
  messageTimer: undefined,
  waifuPath: '',
  cuteMode: {
    model: 4,
    textures: 0,
  },
})

onMounted(() => {
  nextTick(() => {
    loadlimit()
    window.addEventListener('copy', () => {
      showMessage('你都复制了些什么呀，转载要记得加上出处哦！', 6000, 9)
    })
    window.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        showMessage('哇，你终于回来了～', 6000, 9)
      }
    })
  })
})

const loadlimit = () => {
  if (screen.width >= 768) {
    loadWidget({
      cdnPath: 'https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/',
    })
  }
}

function loadWidget(config: { cdnPath: string }) {
  data.waifuPath = config.cdnPath
  sessionStorage.removeItem('waifu-text')
  let userAction = false
  let userActionTimer: NodeJS.Timer
  const messageArray = [
    '好久不见，日子过得好快呢……',
    '大坏蛋！你都多久没理人家了呀，嘤嘤嘤～',
    '嗨～快来逗我玩吧！',
    '拿小拳拳锤你胸口！',
    '记得把小家加入 Adblock 白名单哦！',
  ]
  window.addEventListener('mousemove', () => (userAction = true))
  window.addEventListener('keydown', () => (userAction = true))
  setInterval(() => {
    if (userAction) {
      userAction = false
      clearInterval(userActionTimer)
    } else if (!userActionTimer) {
      userActionTimer = setInterval(() => {
        showMessage(randomSelection(messageArray), 6000, 9)
      }, 20000)
    }
  }, 1000)

  welcomeMessage()
  showHitokoto()
  loadModelList()
  // this.initModel()
  loadModel(data.cuteMode.model, data.cuteMode.textures, '你好呀')
}

function showMessage(
  text: string | Array<string>,
  timeout: number,
  priority: number
) {
  if (
    !text ||
    (sessionStorage.getItem('waifu-text') &&
      (sessionStorage.getItem('waifu-text') || 0) > priority)
  )
    return
  if (data.messageTimer) {
    clearTimeout(data.messageTimer)
  }
  sessionStorage.setItem('waifu-text', String(priority))
  const tips = document.querySelector('#waifu-tips')
  if (tips) {
    tips.innerHTML = randomSelection(text)
    tips.classList.add('waifu-tips-active')
    data.messageTimer = setTimeout(() => {
      sessionStorage.removeItem('waifu-text')
      tips.classList.remove('waifu-tips-active')
    }, timeout)
  }
}

function randomSelection(obj: any) {
  return Array.isArray(obj) ? obj[Math.floor(Math.random() * obj.length)] : obj
}

function welcomeMessage() {
  const now = new Date().getHours()
  if (now > 5 && now <= 7)
    data.text = '早上好！一日之计在于晨，美好的一天就要开始了。'
  else if (data.now > 7 && data.now <= 11)
    data.text = '上午好！工作顺利嘛，不要久坐，多起来走动走动哦！'
  else if (data.now > 11 && data.now <= 13)
    data.text = '中午了，工作了一个上午，现在是午餐时间！'
  else if (data.now > 13 && data.now <= 17)
    data.text = '午后很容易犯困呢，今天的运动目标完成了吗？'
  else if (data.now > 17 && data.now <= 19)
    data.text = '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红～'
  else if (data.now > 19 && data.now <= 21)
    data.text = '晚上好，今天过得怎么样？'
  else if (data.now > 21 && data.now <= 23)
    data.text = ['已经这么晚了呀，早点休息吧，晚安～', '深夜时要爱护眼睛呀！']
  else data.text = '你是夜猫子呀？这么晚还不睡觉，明天起的来嘛？'
  showMessage(data.text, 7000, 8)
}

function showHitokoto() {
  fetch('https://v1.hitokoto.cn')
    .then((response) => response.json())
    .then((result) => {
      const text = `这句一言来自 <span>「${result.from}」</span>，是 <span>${result.creator}</span> 在 hitokoto.cn 投稿的。`
      showMessage(result.hitokoto, 6000, 9)
      setTimeout(() => {
        showMessage(text, 4000, 9)
      }, 6000)
    })
}

async function loadModelList() {
  const response = await fetch(`${data.waifuPath}model_list.json`)
  data.modelList = await response.json()
}

async function loadModel(modelId: any, modelTexturesId: any, message: any) {
  localStorage.setItem('modelId', modelId)
  localStorage.setItem('modelTexturesId', modelTexturesId)
  showMessage(message, 4000, 10)
  if (!data.modelList) await loadModelList()
  const target = randomSelection(data.modelList.models[modelId])
  loadlive2d('live2d', `${data.waifuPath}model/${target}/index.json`)
}
</script>
<style lang="scss" scoped>
#waifu {
  left: 0;
  bottom: 0;
  line-height: 0;
  position: fixed;
  z-index: 1000;
}
@media (max-width: 768px) {
  #waifu {
    display: none;
  }
}

#waifu-tips {
  animation: shake 50s ease-in-out 5s infinite;
  background-color: rgba(236, 217, 188, 0.5);
  border: 1px solid rgba(224, 186, 140, 0.62);
  border-radius: 12px;
  box-shadow: 0 3px 15px 2px rgba(191, 158, 118, 0.2);
  font-size: 14px;
  line-height: 24px;
  margin: -30px 20px;
  min-height: 70px;
  opacity: 0;
  overflow: hidden;
  padding: 5px 10px;
  position: absolute;
  text-overflow: ellipsis;
  transition: opacity 1s;
  width: 250px;
  word-break: break-all;
}

#waifu-tips.waifu-tips-active {
  opacity: 1;
  transition: opacity 0.2s;
}

#waifu #live2d {
  cursor: grab;
  height: 300px;
  position: relative;
  width: 300px;
}

#waifu #live2d:active {
  cursor: grabbing;
}

#waifu-tool {
  color: #aaa;
  opacity: 0;
  position: absolute;
  right: 290px;
  top: 70px;
  transition: opacity 1s;
}

#waifu:hover #waifu-tool {
  opacity: 1;
}

@keyframes shake {
  2% {
    transform: translate(0.5px, -1.5px) rotate(-0.5deg);
  }

  4% {
    transform: translate(0.5px, 1.5px) rotate(1.5deg);
  }

  6% {
    transform: translate(1.5px, 1.5px) rotate(1.5deg);
  }

  8% {
    transform: translate(2.5px, 1.5px) rotate(0.5deg);
  }

  10% {
    transform: translate(0.5px, 2.5px) rotate(0.5deg);
  }

  12% {
    transform: translate(1.5px, 1.5px) rotate(0.5deg);
  }

  14% {
    transform: translate(0.5px, 0.5px) rotate(0.5deg);
  }

  16% {
    transform: translate(-1.5px, -0.5px) rotate(1.5deg);
  }

  18% {
    transform: translate(0.5px, 0.5px) rotate(1.5deg);
  }

  20% {
    transform: translate(2.5px, 2.5px) rotate(1.5deg);
  }

  22% {
    transform: translate(0.5px, -1.5px) rotate(1.5deg);
  }

  24% {
    transform: translate(-1.5px, 1.5px) rotate(-0.5deg);
  }

  26% {
    transform: translate(1.5px, 0.5px) rotate(1.5deg);
  }

  28% {
    transform: translate(-0.5px, -0.5px) rotate(-0.5deg);
  }

  30% {
    transform: translate(1.5px, -0.5px) rotate(-0.5deg);
  }

  32% {
    transform: translate(2.5px, -1.5px) rotate(1.5deg);
  }

  34% {
    transform: translate(2.5px, 2.5px) rotate(-0.5deg);
  }

  36% {
    transform: translate(0.5px, -1.5px) rotate(0.5deg);
  }

  38% {
    transform: translate(2.5px, -0.5px) rotate(-0.5deg);
  }

  40% {
    transform: translate(-0.5px, 2.5px) rotate(0.5deg);
  }

  42% {
    transform: translate(-1.5px, 2.5px) rotate(0.5deg);
  }

  44% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }

  46% {
    transform: translate(1.5px, -0.5px) rotate(-0.5deg);
  }

  48% {
    transform: translate(2.5px, -0.5px) rotate(0.5deg);
  }

  50% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }

  52% {
    transform: translate(-0.5px, 1.5px) rotate(0.5deg);
  }

  54% {
    transform: translate(-1.5px, 1.5px) rotate(0.5deg);
  }

  56% {
    transform: translate(0.5px, 2.5px) rotate(1.5deg);
  }

  58% {
    transform: translate(2.5px, 2.5px) rotate(0.5deg);
  }

  60% {
    transform: translate(2.5px, -1.5px) rotate(1.5deg);
  }

  62% {
    transform: translate(-1.5px, 0.5px) rotate(1.5deg);
  }

  64% {
    transform: translate(-1.5px, 1.5px) rotate(1.5deg);
  }

  66% {
    transform: translate(0.5px, 2.5px) rotate(1.5deg);
  }

  68% {
    transform: translate(2.5px, -1.5px) rotate(1.5deg);
  }

  70% {
    transform: translate(2.5px, 2.5px) rotate(0.5deg);
  }

  72% {
    transform: translate(-0.5px, -1.5px) rotate(1.5deg);
  }

  74% {
    transform: translate(-1.5px, 2.5px) rotate(1.5deg);
  }

  76% {
    transform: translate(-1.5px, 2.5px) rotate(1.5deg);
  }

  78% {
    transform: translate(-1.5px, 2.5px) rotate(0.5deg);
  }

  80% {
    transform: translate(-1.5px, 0.5px) rotate(-0.5deg);
  }

  82% {
    transform: translate(-1.5px, 0.5px) rotate(-0.5deg);
  }

  84% {
    transform: translate(-0.5px, 0.5px) rotate(1.5deg);
  }

  86% {
    transform: translate(2.5px, 1.5px) rotate(0.5deg);
  }

  88% {
    transform: translate(-1.5px, 0.5px) rotate(1.5deg);
  }

  90% {
    transform: translate(-1.5px, -0.5px) rotate(-0.5deg);
  }

  92% {
    transform: translate(-1.5px, -1.5px) rotate(1.5deg);
  }

  94% {
    transform: translate(0.5px, 0.5px) rotate(-0.5deg);
  }

  96% {
    transform: translate(2.5px, -0.5px) rotate(-0.5deg);
  }

  98% {
    transform: translate(-1.5px, -1.5px) rotate(-0.5deg);
  }

  0%,
  100% {
    transform: translate(0, 0) rotate(0);
  }
}
</style>
