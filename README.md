<div align="center">

<img src="https://img.shields.io/badge/🏀_篮球记分牌-orange?style=for-the-badge&logo=basketball&logoColor=white" alt="badge">

<h1>篮球记分牌</h1>

<p><em>纯前端篮球比赛记分网页 — 无需后端，数据保存在浏览器中</em></p>

<p>
  <img src="https://img.shields.io/badge/纯前端-HTML%20CSS%20JS-blueviolet?style=flat-square" alt="frontend">
  <img src="https://img.shields.io/badge/零依赖-无框架-green?style=flat-square" alt="zero-dep">
  <img src="https://img.shields.io/badge/响应式-手机适配-orange?style=flat-square" alt="responsive">
  <img src="https://img.shields.io/badge/PWA-支持-57a5f5?style=flat-square" alt="pwa">
</p>

<br>

<a href="./demo.html"><img src="https://img.shields.io/badge/🎮_在线体验-Demo-green?style=for-the-badge" alt="demo"></a>

<br>

---

</div>

## 在线体验

<a href="./demo.html">

<img src="https://img.shields.io/badge/点击打开交互式Demo-22c55e?style=for-the-badge&logo=demo&logoColor=white" alt="open demo">

</a>

点击上方按钮打开可交互的记分牌演示，支持：
- 🏀 实时计分（+1/+2/+3 分）
- 👥 队伍切换
- ⚠️ 犯规记录
- 📊 导出 CSV 统计

> 💡 完整功能请使用 [手机单文件版](./basketball-scorekeeper-mobile.html) 或 [微信链接版](./wechat-h5/index.html)

---

## 功能特性

<table>
<tr>
<td width="50%">

### 📊 记分功能
- 实时记录球员得分
- 记录犯规次数
- 操作记录与撤销
- 比赛阶段管理

</td>
<td width="50%">

### 👥 球员管理
- 添加/删除球员
- 切换球队分组
- 预设阵容保存
- 球员头像支持

</td>
</tr>
<tr>
<td>

### 📋 数据导出
- 导出球员统计 CSV
- 保存比赛记录 JSON
- 记录码导入/导出

</td>
<td>

### ⚙️ 比赛设置
- 自定义比赛名称
- 设置日期与场地
- 设置两队队名
- 比赛阶段标记

</td>
</tr>
</table>

---

## 快速开始

<div align="center">

### 📱 手机单文件版

> 球场边没有电脑？直接用这个

```
basketball-scorekeeper-mobile.html
```

发到手机上，用浏览器打开即可

---

### 💬 微信链接版

> 需要通过 HTTPS 在微信里打开

```
wechat-h5/index.html
```

上传到静态托管后，把链接发给记分员即可

---

### 🖥️ 局域网访问

> 电脑启动服务，手机扫码访问

双击运行：

```
start-phone-link.bat
```

或手动运行：

```powershell
python -m http.server 8787 --bind 0.0.0.0
```

</div>

---

## 预设名单

编辑 `player-config.js` 统一维护预设阵容：

```js
window.BASKETBALL_PLAYER_CONFIG = {
  presets: [
    {
      name: "示例阵容",
      teams: [
        { id: "home", name: "队伍A", players: [...] },
        { id: "away", name: "队伍B", players: [...] }
      ]
    }
  ]
};
```

---

## 文件结构

```
scoreboard/
├── demo.html                           # 交互式 Demo（可直接打开）
├── index.html                          # 主页面（电脑版）
├── basketball-scorekeeper-mobile.html  # 手机单文件版
├── app.js                              # 核心逻辑
├── styles.css                          # 样式文件
├── player-config.js                    # 预设球员名单
├── wechat-h5/                          # 微信适配版本
│   └── index.html
├── start-phone-link.bat                # 一键启动局域网服务
├── start-phone-link.ps1                # PowerShell 版启动脚本
├── build-mobile-standalone.ps1         # 构建手机独立版
├── build-wechat-h5.ps1                 # 构建微信 H5 版
├── service-worker.js                   # PWA Service Worker
├── manifest.webmanifest                # PWA 配置
└── screenshot.png                      # 截图
```

---

<div align="center">

### 📄 许可证

MIT License © [wizenard](https://github.com/wizenard)

</div>
