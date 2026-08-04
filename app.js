const STORAGE_KEY = "autumn-recruitment-tracker-v8";
const DATA_REVISION_KEY = "autumn-recruitment-tracker-data-revision";
const DATA_REVISION = 14;
const RECORDS_URL = "records.json";
const IS_LOCAL_ADMIN = ["127.0.0.1", "localhost"].includes(window.location.hostname);
const PUBLIC_REFRESH_INTERVAL = 30_000;

const sampleRecords = [
  { id: crypto.randomUUID(), company: "东芯半导体", role: "模拟电路工程师", type: "校招", status: "已投递", date: "2026-06-28", progress: "已投递简历", location: "上海", website: "https://www.dosilicon.com/", notes: "秋招提前批；校招多为邮件投递，留意邮件通知" },
  { id: crypto.randomUUID(), company: "高德红外", role: "模拟电路工程师", type: "校招", status: "已投递", date: "2026-07-01", progress: "已投递简历", location: "武汉", website: "https://www.wuhan-guide.com/company-culture/", notes: "最新投递；校招入口需关注官网/公众号公告" },
  { id: crypto.randomUUID(), company: "歌尔微电子", role: "模拟电路工程师", type: "校招", status: "已投递", date: "2026-06-25", progress: "已投递简历", location: "青岛", website: "https://campus.goertek.com", notes: "秋招提前批" },
  { id: crypto.randomUUID(), company: "格见半导体", role: "模拟 IC 设计工程师", type: "校招", status: "已投递", date: "2026-06-28", progress: "已投递简历", location: "上海", website: "https://gejian-semi.zhiye.com/", notes: "秋招提前批" },
  { id: crypto.randomUUID(), company: "海信", role: "模拟电路工程师", type: "校招", status: "已投递", date: "2026-06-27", progress: "已投递简历", location: "青岛", website: "https://jobs.hisense.com", notes: "秋招提前批" },
  { id: crypto.randomUUID(), company: "禾赛科技", role: "模拟 IC 设计", type: "校招", status: "已投递", date: "2026-06-27", progress: "已投递简历", location: "上海", website: "https://www.hesaitech.com/cn/careers", notes: "秋招提前批" },
  { id: crypto.randomUUID(), company: "澜起科技", role: "模拟设计工程师", type: "校招", status: "已投递", date: "2026-06-28", progress: "已投递简历", location: "昆山 / 南京", website: "https://www.moseeker.com/positions/index/cid/8721227", notes: "秋招职位页；模拟设计工程师地点为昆山、南京；另有数字设计、数字验证、产品工程师岗位" },
  { id: crypto.randomUUID(), company: "乐鑫半导体", role: "模拟 IC 设计工程师", type: "校招", status: "已结束", date: "2026-07-04", progress: "简历筛选未通过", location: "上海", website: "https://www.espressif.com/zh-hans/join-us/job-search", notes: "简历筛选未通过，流程结束" },
  { id: crypto.randomUUID(), company: "思瑞浦", role: "模拟 IC 设计工程师", type: "校招", status: "已投递", date: "2026-07-04", progress: "已投递简历", location: "上海", website: "https://www.3peak.com/careers", notes: "最新投递；完成投递后留意邮件通知" },
  { id: crypto.randomUUID(), company: "纳芯微", role: "模拟 IC 设计工程师", type: "校招", status: "一面中", date: "2026-07-18", progress: "一面中，等待后续通知", location: "", website: "https://careers.novosns.com/campus", notes: "2027 届秋招；已进入一面" },
  { id: crypto.randomUUID(), company: "芯迈半导体", role: "模拟 IC 设计工程师", type: "校招", status: "已投递", date: "2026-07-20", progress: "已投递简历", location: "", website: "https://www.silicon-magic.com/joinus", notes: "2027 届秋招" },
  { id: crypto.randomUUID(), company: "兆易创新", role: "模拟 IC 设计工程师", type: "校招", status: "已投递", date: "2026-07-29", progress: "已投递简历", location: "", website: "https://www.gigadevice.com.cn/about/career", notes: "2027 届秋招" },
  { id: crypto.randomUUID(), company: "南芯科技", role: "模拟 IC 设计工程师", type: "校招", status: "已投递", date: "2026-07-30", progress: "已投递简历", location: "上海", website: "https://www.southchip.com/recruitment", notes: "2027 届秋招" },
  { id: crypto.randomUUID(), company: "圣邦微电子", role: "模拟 IC 设计工程师", type: "校招", status: "已投递", date: "2026-07-30", progress: "已投递简历", location: "", website: "https://www.sg-micro.com/cn/recruitment", notes: "2027 届秋招" },
  { id: crypto.randomUUID(), company: "芯原股份", role: "模拟 IC 设计工程师", type: "校招", status: "已投递", date: "2026-07-30", progress: "已投递简历", location: "上海", website: "https://www.verisilicon.com/recruit/RecruitCampus.html", notes: "2027 届秋招" },
  { id: crypto.randomUUID(), company: "中兴微电子", role: "模拟电路工程师", type: "校招", status: "已投递", date: "2026-07-31", progress: "已投递简历", location: "深圳", website: "https://www.sanechips.com.cn/", notes: "2027 届秋招" },
  { id: crypto.randomUUID(), company: "艾为电子", role: "模拟 IC 设计工程师", type: "校招", status: "已投递", date: "2026-08-02", progress: "已投递简历", location: "上海", website: "https://awinic1.zhiye.com/", notes: "2027 届秋招" },
  { id: crypto.randomUUID(), company: "大疆", role: "模拟 IC 设计工程师", type: "校招", status: "已投递", date: "2026-08-02", progress: "已投递简历", location: "深圳", website: "https://careers.dji.com/zh-CN/campus", notes: "2027 届秋招" },
  { id: crypto.randomUUID(), company: "联发科", role: "模拟 IC 设计工程师", type: "校招", status: "已投递", date: "2026-08-02", progress: "已投递简历", location: "上海", website: "https://mediatek.zhiye.com/campus", notes: "2027 届秋招" },
  { id: crypto.randomUUID(), company: "RoboSense 速腾聚创", role: "模拟 IC 设计工程师", type: "校招", status: "已投递", date: "2026-08-02", progress: "已投递简历", location: "深圳", website: "https://www.robosense.ai/about/joinus", notes: "2027 届秋招" },
  { id: crypto.randomUUID(), company: "昂瑞微", role: "模拟研发工程师", type: "校招", status: "已投递", date: "2026-08-02", progress: "已投递简历", location: "北京 / 大连", website: "https://www.onmicro.com.cn/xyzp/230.html", notes: "2027 届秋招" },
  { id: crypto.randomUUID(), company: "中茵微电子", role: "模拟 IC 设计工程师", type: "校招", status: "已投递", date: "2026-08-02", progress: "已投递简历", location: "", website: "https://www.joinsilicon.com/", notes: "2027 届秋招" },
  { id: crypto.randomUUID(), company: "士兰微电子", role: "模拟 IC 设计师", type: "校招", status: "已投递", date: "2026-08-02", progress: "已投递简历", location: "", website: "https://www.silan.com.cn/about/post.html", notes: "2027 届秋招" },
  { id: crypto.randomUUID(), company: "紫光国芯", role: "模拟设计工程师", type: "校招", status: "待投递", date: "", progress: "简历已准备，待投递", location: "西安", website: "https://www.unisemicon.com/index.php?a=lists&c=index&catid=28&m=content", notes: "2027 届秋招" },
  { id: crypto.randomUUID(), company: "中科芯", role: "模拟 IC 设计工程师", type: "校招", status: "待投递", date: "", progress: "简历已准备，待投递", location: "", website: "https://cksic.zhiye.com/campus", notes: "2027 届秋招" },
  { id: crypto.randomUUID(), company: "MPS芯源", role: "模拟 IC 设计工程师", type: "校招", status: "待投递", date: "", progress: "简历已准备，待投递", location: "", website: "https://xz.51job.com/mps/list4.html", notes: "2027 届秋招" },
  { id: crypto.randomUUID(), company: "星宸科技", role: "模拟 IC 设计工程师", type: "校招", status: "待投递", date: "", progress: "待自行投递", location: "上海 / 厦门", website: "https://sigmastar.zhiye.com/campus/jobs", notes: "2027 届秋招；上海 J10573 / 厦门 J10574" },
  { id: crypto.randomUUID(), company: "字节跳动", role: "芯片工程师 - 芯片研发", type: "校招", status: "待投递", date: "", progress: "简历待对应修改", location: "北京 / 上海 / 杭州 / 深圳", website: "https://jobs.bytedance.com/campus", notes: "2027 届校园招聘；职位 ID：A115240；正式 / 研发-硬件" },
  { id: crypto.randomUUID(), company: "升宇科技", role: "模拟 IC 设计工程师", type: "校招", status: "待投递", date: "", progress: "待确认岗位后投递", location: "北京", website: "https://mp.weixin.qq.com/s/c6ybVk47TULMgVVrL2zZ8A", notes: "微信公众号招聘信息；岗位名称、批次和截止时间待打开页面确认" },
  { id: crypto.randomUUID(), company: "联影集团", role: "模拟设计工程师", type: "校招", status: "待投递", date: "", progress: "待确认正式岗位后投递", location: "上海 / 武汉 / 深圳", website: "https://global.united-imaging.com/zh-cn/careers", notes: "2027 届招聘方向含模拟设计、芯片应用、射频、传感器等；优先核对正式秋招入口" },
  { id: crypto.randomUUID(), company: "长江存储", role: "模拟电路设计", type: "校招", status: "面试中", date: "2026-06-19", progress: "二面复试已完成，等待结果", location: "上海", website: "https://ymtc-campus.zhiye.com/", notes: "秋招提前批" },
  { id: crypto.randomUUID(), company: "长鑫存储", role: "模拟电路", type: "校招", status: "综合评估中", date: "2026-07-04", progress: "已进入综合评估中", location: "上海", website: "https://jobs.cxmt.com/Campus", notes: "秋招提前批" },
  { id: crypto.randomUUID(), company: "中兴通讯", role: "模拟电路工程师", type: "校招", status: "已投递", date: "2026-07-01", progress: "已完成测评，等待后续通知", location: "上海", website: "https://job.zte.com.cn/cn/campus-recruitment/Recruitment_positions/freshstudent.html", notes: "秋招提前批" },
  { id: crypto.randomUUID(), company: "紫光同创", role: "模拟电路工程师", type: "校招", status: "面试中", date: "2026-06-24", progress: "二面已完成，等待结果", location: "上海", website: "https://www.pangomicro.com/join_school/", notes: "秋招提前批；面试通知来自邮件" }
];

const recordMigrations = {
  东芯半导体: { website: "https://www.dosilicon.com/", notes: "秋招提前批；校招多为邮件投递，留意邮件通知" },
  高德红外: { website: "https://www.wuhan-guide.com/company-culture/" },
  格见半导体: { website: "https://gejian-semi.zhiye.com/" },
  澜起科技: { website: "https://www.moseeker.com/positions/index/cid/8721227", location: "昆山 / 南京", notes: "秋招职位页；模拟设计工程师地点为昆山、南京；另有数字设计、数字验证、产品工程师岗位" },
  乐鑫半导体: { status: "已结束", progress: "简历筛选未通过", website: "https://www.espressif.com/zh-hans/join-us/job-search", notes: "简历筛选未通过，流程结束" },
  思瑞浦: { website: "https://www.3peak.com/careers" },
  长江存储: { status: "面试中", progress: "二面复试已完成，等待结果", website: "https://ymtc-campus.zhiye.com/" },
  长鑫存储: { status: "综合评估中", date: "2026-07-04", progress: "已进入综合评估中", website: "https://jobs.cxmt.com/Campus" },
  中兴通讯: { progress: "已完成测评，等待后续通知", website: "https://job.zte.com.cn/cn/campus-recruitment/Recruitment_positions/freshstudent.html", notes: "秋招提前批" },
  紫光同创: { status: "面试中", progress: "二面已完成，等待结果", website: "https://www.pangomicro.com/join_school/", notes: "秋招提前批；面试通知来自邮件" }
};

const state = {
  records: [],
  query: "",
  status: "all",
  type: "all",
  sortKey: "date",
  sortDirection: "desc",
  pendingDeleteId: null
};

const elements = {
  body: document.querySelector("#records-body"),
  empty: document.querySelector("#empty-state"),
  count: document.querySelector("#record-count"),
  search: document.querySelector("#search-input"),
  statusFilter: document.querySelector("#status-filter"),
  typeFilter: document.querySelector("#type-filter"),
  dialog: document.querySelector("#record-dialog"),
  form: document.querySelector("#record-form"),
  deleteDialog: document.querySelector("#delete-dialog"),
  toast: document.querySelector("#toast"),
  syncStatus: document.querySelector("#sync-status")
};

async function loadRecords() {
  try {
    const response = await fetch(`${RECORDS_URL}?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`读取记录失败：${response.status}`);
    const records = await response.json();
    if (!Array.isArray(records)) throw new Error("记录数据格式错误");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return records;
  } catch {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  }
}

function mergeSampleRecords(records) {
  const merged = records.map((record) => ({ ...record }));
  sampleRecords.forEach((sample) => {
    const index = merged.findIndex((record) => record.company === sample.company);
    if (index === -1) {
      merged.push(sample);
      return;
    }
  });
  return merged;
}

function applyRecordMigrations(records) {
  return records.map((record) => {
    const update = recordMigrations[record.company];
    return update ? { ...record, ...update } : record;
  });
}

async function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.records));
  if (!IS_LOCAL_ADMIN) return { saved: true, pushed: false };

  setSyncStatus("正在同步到 GitHub…", "syncing");
  try {
    const response = await fetch("/api/records", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state.records)
    });
    const result = await response.json();
    if (!response.ok || !result.pushed) throw new Error(result.error || "同步失败");
    setSyncStatus(result.changed ? `已同步 · ${result.commit}` : "已同步 · 无变更", "synced");
    return result;
  } catch (error) {
    setSyncStatus("本地已保存 · GitHub 同步失败", "error");
    throw error;
  }
}

function setSyncStatus(message, status = "") {
  elements.syncStatus.textContent = message;
  elements.syncStatus.dataset.status = status;
}

function configureAccessMode() {
  document.body.classList.toggle("read-only", !IS_LOCAL_ADMIN);
  document.querySelectorAll('[data-action="add"]').forEach((button) => {
    button.hidden = !IS_LOCAL_ADMIN;
  });
  setSyncStatus(IS_LOCAL_ADMIN ? "本地管理模式 · 保存后自动同步 GitHub" : "公开只读视图 · 每 30 秒检查更新");
}

function escapeHtml(value = "") {
  const node = document.createElement("div");
  node.textContent = value;
  return node.innerHTML;
}

function safeWebsiteUrl(value = "") {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function filteredRecords() {
  const query = state.query.trim().toLocaleLowerCase("zh-CN");
  return state.records
    .filter((record) => !query || `${record.company} ${record.role}`.toLocaleLowerCase("zh-CN").includes(query))
    .filter((record) => state.status === "all" || record.status === state.status)
    .filter((record) => state.type === "all" || record.type === state.type)
    .sort((a, b) => {
      const left = a[state.sortKey] || "";
      const right = b[state.sortKey] || "";
      const result = left.localeCompare(right, "zh-CN");
      return state.sortDirection === "asc" ? result : -result;
    });
}

function render() {
  const records = filteredRecords();
  elements.body.innerHTML = records.map((record) => {
    const website = safeWebsiteUrl(record.website);
    const actions = IS_LOCAL_ADMIN
      ? `<div class="row-actions">
          <button class="text-button" type="button" data-action="edit" data-id="${record.id}">编辑</button>
          <button class="text-button delete" type="button" data-action="delete" data-id="${record.id}">删除</button>
        </div>`
      : `<span class="read-only-label">只读</span>`;
    return `
    <tr>
      <td class="company-cell" title="${escapeHtml(record.company)}">${escapeHtml(record.company)}</td>
      <td class="role-cell" title="${escapeHtml(record.role)}">${escapeHtml(record.role)}</td>
      <td>${escapeHtml(record.type)}</td>
      <td><span class="status-pill status-${escapeHtml(record.status)}">${escapeHtml(record.status)}</span></td>
      <td>${escapeHtml(record.date || "—")}</td>
      <td title="${escapeHtml(record.progress)}">${escapeHtml(record.progress || "—")}</td>
      <td title="${escapeHtml(record.location)}">${escapeHtml(record.location || "—")}</td>
      <td>${website ? `<a class="website-link" href="${escapeHtml(website)}" target="_blank" rel="noopener noreferrer">打开官网 ↗</a>` : escapeHtml(record.website || "—")}</td>
      <td title="${escapeHtml(record.notes)}">${escapeHtml(record.notes || "—")}</td>
      <td>${actions}</td>
    </tr>`;
  }).join("");

  elements.empty.hidden = records.length > 0;
  document.querySelector("table").hidden = records.length === 0;
  elements.count.textContent = `显示 ${records.length} 条，共 ${state.records.length} 条记录`;
  renderStats();
}

function renderStats() {
  const inProgress = ["笔试中", "面试中", "综合评估中"];
  document.querySelector("#stat-total").textContent = state.records.length;
  document.querySelector("#stat-applied").textContent = state.records.filter((r) => r.status === "已投递").length;
  document.querySelector("#stat-progress").textContent = state.records.filter((r) => inProgress.includes(r.status)).length;
  document.querySelector("#stat-offer").textContent = state.records.filter((r) => r.status === "Offer").length;
}

function openForm(record = null) {
  elements.form.reset();
  document.querySelector("#record-id").value = record?.id || "";
  document.querySelector("#dialog-title").textContent = record ? "编辑投递记录" : "添加投递记录";
  if (record) {
    ["company", "role", "type", "status", "date", "location", "website", "progress", "notes"].forEach((key) => {
      document.querySelector(`#${key}`).value = record[key] || "";
    });
  } else {
    document.querySelector("#date").value = new Date().toISOString().slice(0, 10);
    document.querySelector("#status").value = "已投递";
  }
  elements.dialog.showModal();
  setTimeout(() => document.querySelector("#company").focus(), 50);
}

async function handleSubmit(event) {
  event.preventDefault();
  const id = document.querySelector("#record-id").value;
  const record = { id: id || crypto.randomUUID() };
  ["company", "role", "type", "status", "date", "location", "website", "progress", "notes"].forEach((key) => {
    record[key] = document.querySelector(`#${key}`).value.trim();
  });
  const existingIndex = state.records.findIndex((item) => item.id === id);
  if (existingIndex >= 0) state.records[existingIndex] = record;
  else state.records.unshift(record);
  elements.dialog.close();
  render();
  try {
    await saveRecords();
    showToast(existingIndex >= 0 ? "记录已更新并同步" : "记录已添加并同步");
  } catch (error) {
    showToast(`记录已保存到本地：${error.message}`);
  }
}

function requestDelete(id) {
  state.pendingDeleteId = id;
  elements.deleteDialog.showModal();
}

async function confirmDelete() {
  state.records = state.records.filter((record) => record.id !== state.pendingDeleteId);
  state.pendingDeleteId = null;
  elements.deleteDialog.close();
  render();
  try {
    await saveRecords();
    showToast("记录已删除并同步");
  } catch (error) {
    showToast(`记录已从本地删除：${error.message}`);
  }
}

function exportCsv() {
  const headers = ["公司", "岗位", "类型", "状态", "投递日期", "面试进展", "地点", "投递入口", "备注"];
  const keys = ["company", "role", "type", "status", "date", "progress", "location", "website", "notes"];
  const rows = filteredRecords().map((record) => keys.map((key) => `"${String(record[key] || "").replaceAll('"', '""')}"`).join(","));
  const blob = new Blob(["\ufeff" + [headers.join(","), ...rows].join("\r\n")], { type: "text/csv;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `秋招投递记录-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast(`已导出 ${rows.length} 条记录`);
}

let toastTimer;
function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 2200);
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const { action, id } = target.dataset;
  if (action === "add") openForm();
  if (action === "edit") openForm(state.records.find((record) => record.id === id));
  if (action === "delete") requestDelete(id);
  if (action === "close") elements.dialog.close();
  if (action === "cancel-delete") elements.deleteDialog.close();
});

elements.search.addEventListener("input", (event) => { state.query = event.target.value; render(); });
elements.statusFilter.addEventListener("change", (event) => { state.status = event.target.value; render(); });
elements.typeFilter.addEventListener("change", (event) => { state.type = event.target.value; render(); });
elements.form.addEventListener("submit", handleSubmit);
document.querySelector("#confirm-delete").addEventListener("click", confirmDelete);
document.querySelector("#export-button").addEventListener("click", exportCsv);
document.querySelectorAll(".sort-button").forEach((button) => button.addEventListener("click", () => {
  const nextKey = button.dataset.sort;
  state.sortDirection = state.sortKey === nextKey && state.sortDirection === "asc" ? "desc" : "asc";
  state.sortKey = nextKey;
  render();
}));

async function refreshPublicRecords() {
  const previous = JSON.stringify(state.records);
  const latest = await loadRecords();
  if (JSON.stringify(latest) !== previous) {
    state.records = latest;
    render();
    showToast("投递记录已自动更新");
  }
}

async function initialize() {
  configureAccessMode();
  state.records = await loadRecords();
  render();
  if (!IS_LOCAL_ADMIN) setInterval(refreshPublicRecords, PUBLIC_REFRESH_INTERVAL);
}

initialize();
