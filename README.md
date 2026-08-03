# 秋招进度追踪

一个无需安装第三方依赖的秋招投递管理网页。GitHub Pages 提供公开只读视图，本地管理页面保存记录后会自动提交并推送到 GitHub。

## 使用

在当前目录启动本地管理服务：

```powershell
python sync_server.py
```

浏览器访问 <http://127.0.0.1:4173>。

投递数据保存在 `records.json` 中。每次在本地页面保存或删除记录后，服务会自动执行：

```powershell
git add records.json
git commit
git push origin main
```

GitHub Pages 会读取同一份数据，并每 30 秒检查一次已经部署的新版本。公开页面不提供编辑入口。

页面支持：

- 新增、编辑、删除投递记录
- 按公司或岗位搜索
- 按状态和求职类型筛选
- 按公司、岗位和日期排序
- 自动计算投递、面试与 Offer 数据
- 将当前筛选结果导出为 UTF-8 CSV

## 注意

- 自动同步服务仅监听 `127.0.0.1`，不能被局域网或互联网直接访问。
- 需要提前配置好当前仓库的 Git 凭据和 `origin/main` 推送权限。
- GitHub Pages 的发布仍需要一定时间，因此公开网页是近实时更新，不是逐秒更新。
