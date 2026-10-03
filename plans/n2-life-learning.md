# N2 生活日语升级

面向已有 N2 基础、希望自然进行生活交流的玩家。难度体现在理解条件与转折、说明顾虑、提出替代方案和选择合适语气。N2 是目标学习者水平，不是对每个句型的官方定级。

## 已实现

- 32 条原创口语例句，分为日常购物、上衣／外套、下装、鞋子、包包、帽子、发型、首饰八组。分别标注店员、朋友或发型师语境，解释口语省略、委婉表达与常用搭配。
- 新增「会话」面板：六轮试衣店接话练习，包含购买需求、试穿、说明肩膀处紧、请求大一码与海军蓝、听懂缺货后试米色，以及购买／礼貌不买两个结局。
- 四道完整对话听力题，检查条件、试穿问题、库存与下一步行动。听完一次完整对话后才开放答题，原文在结束后显示；可主动开启阅读辅助，但辅助答题不提升听力复习等级。
- 双音色固定会话音频、整段连续播放、停止播放、慢速、单句播放和本地跟读录音。录音最多 60 秒，只在页面内存保留，关闭时释放麦克风并撤销音频 URL，不上传、不进入备份。
- 共 252 条固定音频，包含上一轮缺少的 200 条单品描述、32 条新口语例句、会话台词与校准词汇。全部进入离线核心缓存，新增约 5.75 MB。
- 看过的词和表达自动安排一天后复习；短时间重复答对保留原间隔，只有首次独立答对或到期复习才推进。错题安排十分钟后再练，连续错答不会把已有更早的复习推迟。
- 口语表达、接话与听力使用独立、稳定的学习目标 ID；会话两种练习进度分别保存，刷新和导入备份后恢复。选择题去除重复日文或中文干扰项。

## 验证

```powershell
node tests/life-learning.test.mjs
node tests/learning.test.mjs
node tests/study-state.test.mjs
node tests/wardrobe-upgrade.test.mjs
node tests/image-cache.test.mjs
node scripts/build-offline-core.mjs
node scripts/check-life-learning.cjs
node scripts/check-round-two.cjs
node scripts/check-round-one.cjs
```

浏览器检查使用 Edge 手机模拟，覆盖两个结局、错答重试、进度恢复、原文隐藏、阅读辅助、播放取消、真实 MediaRecorder（合成麦克风输入）、关闭录音后的资源释放、原生 MP3 解码、离线启动与音频 Range，以及五种屏幕尺寸。浏览器流程测试缩短了每段音频的结束等待，不代表完整听力教学验收。

录音需要 HTTPS 或 localhost 及浏览器麦克风授权；HTTP 局域网访问会保留文字和原音跟读，并提示录音不可用。真实 iPhone Safari／主屏幕 PWA、真实人声录音与教材自然度仍需实际验收。

## 音频重新生成

运行 `node scripts/collect-life-audio.mjs`，再使用安装了 `edge-tts` 的 Python 运行 `scripts/build-life-audio.py`。脚本沿用现有 `.tools/tts`，复用已生成的文件，完整失败报告写入 `outputs/life-learning/audio-report.json`。修改音频或教材后重新运行离线核心生成脚本。

原创会话组织参考日本国际交流基金 [《いろどり》的生活任务与角色扮演方向](https://www.irodori.jpf.go.jp/en/about.html)。录音生命周期依照 [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder) 和 [getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) 的浏览器接口设计。
