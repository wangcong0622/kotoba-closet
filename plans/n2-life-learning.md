# N2 生活日语升级

面向已有 N2 基础、希望自然进行生活交流的玩家。难度体现在理解条件与转折、说明顾虑、提出替代方案和选择合适语气。N2 是目标学习者水平，不是对每个句型的官方定级。

## 已实现

- 32 条原创口语例句，分为日常购物、上衣／外套、下装、鞋子、包包、帽子、发型、首饰八组。分别标注店员、朋友或发型师语境，解释口语省略、委婉表达与常用搭配。
- 「会话」面板现有三组完整会话，共 16 轮：试衣店六轮、咖啡店五轮、朋友改约五轮。分别练习尺寸和库存条件、点单调整和时间限制、婉拒和替代时间。试衣店与朋友会话各有两种合理结局。
- 十二道完整对话听力题，检查条件、问题、库存、顺序、时间地点与言外之意。听完一次完整对话后才开放答题，原文在结束后显示；可主动开启阅读辅助，但辅助答题不提升听力复习等级。听力使用固定版本，界面说明不会跟随接话练习里的其他结局变化。
- 新增八道「语气与意图」题：结合前后文判断「大丈夫」是接受还是婉拒、理解省略的推辞、接住缺货后的替代方案、区分熟人消息与郑重措辞、辨认试穿请求、未确定的参加意向和理发限制。每个选项有自己的解释，不把表达脱离语境设成固定翻译。
- 双音色固定会话音频、整段连续播放、停止播放、慢速、单句播放和本地跟读录音。录音最多 60 秒，只在页面内存保留，关闭时释放麦克风并撤销音频 URL，不上传、不进入备份。
- 共 284 条固定音频，包含 200 条单品描述、32 条口语例句、会话台词、语气题与校准词汇。全部进入离线核心缓存，总计约 6.81 MB，本次增加约 1.06 MB。
- 看过的词和表达自动安排一天后复习；短时间重复答对保留原间隔，只有首次独立答对或到期复习才推进。错题安排十分钟后再练，连续错答不会把已有更早的复习推迟。
- 口语表达、接话、听力和语气题使用独立、稳定的学习目标 ID；三个场景的接话与听力进度分别保存，刷新、切换场景和导入备份后恢复。原来的单场景存档自动迁移。选择题去除重复日文或中文干扰项。
- 待巩固清单保存错题，即时纠正不会清除，到期后独立答对才移出。复习一轮每项只出现一次，跳过不会改变该项复习安排；结束后显示本轮作答与答对数量。今日进度按设备本地日期统计独立作答的不同学习目标，浏览、播放和辅助答题不增加数量。
- 普通听力和听力复习同样要求先听完题目，可使用阅读辅助并保留不提升等级的标记。切到后台会结束跟读录音并释放麦克风；麦克风尚在授权时的请求也会取消。

## 验证

```powershell
node tests/life-learning.test.mjs
node tests/life-upgrade.test.mjs
node tests/learning.test.mjs
node tests/study-state.test.mjs
node tests/wardrobe-upgrade.test.mjs
node tests/image-cache.test.mjs
node scripts/build-offline-core.mjs
node scripts/check-life-learning.cjs
node scripts/check-round-two.cjs
node scripts/check-round-one.cjs
```

浏览器检查使用 Edge 手机模拟，覆盖试衣店两种结局、朋友替代结局、三组独立进度、十二题会话听力、语气题、错题复习轮次与每日计数、原文隐藏、阅读辅助、播放取消、真实 MediaRecorder（合成麦克风输入）、关闭及后台录音资源释放、原生 MP3 解码、离线启动与音频 Range，以及五种屏幕尺寸。浏览器流程测试缩短了每段音频的结束等待，不代表完整听力教学验收。

录音需要 HTTPS 或 localhost 及浏览器麦克风授权；HTTP 局域网访问会保留文字和原音跟读，并提示录音不可用。真实 iPhone Safari／主屏幕 PWA、真实人声录音与教材自然度仍需实际验收。

## 音频重新生成

运行 `node scripts/collect-life-audio.mjs`，再使用安装了 `edge-tts` 的 Python 运行 `scripts/build-life-audio.py`。脚本沿用现有 `.tools/tts`，复用已生成的文件，完整失败报告写入 `outputs/life-learning/audio-report.json`。修改音频或教材后重新运行离线核心生成脚本。

原创会话组织参考日本国际交流基金 [《いろどり》的生活任务与角色扮演方向](https://www.irodori.jpf.go.jp/en/about.html)。录音生命周期依照 [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder) 和 [getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) 的浏览器接口设计。
