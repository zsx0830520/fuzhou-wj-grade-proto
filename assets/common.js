/* 福州网监 · 分级分类工作台 共享数据与交互 */
const STORAGE_KEY = "fz-wj-grade-proto-v2";

const DEFAULT_STATE = {
  models: {},
  results: {},
  approvals: {},
  subjects: {},
  subjectLogs: null,
  subjectEdits: null,
  specials: {},
  specialApplies: {},
  clues: {},
  packs: {},
  checks: {},
  whitelist: {},
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    return { ...structuredClone(DEFAULT_STATE), ...JSON.parse(raw) };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}
function saveState(partial) {
  const next = { ...loadState(), ...partial };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

function resetDemo() {
  if (!confirm("将演示数据恢复为初始样例，已操作的调级、审批等会清掉。确定重置？")) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}
function qs(k) {
  return new URLSearchParams(location.search).get(k);
}
function antIco(name, text) {
  const icon = `<i class="el-icon ant-icon-${name}" aria-hidden="true"></i>`;
  if (text == null || text === "") return icon;
  return `${icon}<span class="el-btn-text">${text}</span>`;
}

const MODEL_TYPES = [
  { id: "platform", name: "电商平台" },
  { id: "seller", name: "平台内经营者" },
  { id: "live", name: "直播间运营者" },
];

const MODELS = [
  { id: "M01", type: "platform", name: "模型1", period: "每年一次", created: "2025-12-12", creator: "王帅帅", remark: "运行中，无法删除、修改", status: "使用中", weights: [30, 25, 20, 25] },
  { id: "M02", type: "platform", name: "模型2", period: "每季度一次", created: "2025-12-12", creator: "王帅帅", remark: "这个不用了", status: "未启用", weights: [28, 22, 25, 25] },
  { id: "M03", type: "platform", name: "模型3", period: "每季度一次", created: "2025-12-12", creator: "王帅帅", remark: "点击复用，新增一条一样的模型", status: "未启用", weights: [30, 20, 20, 30] },
  { id: "M04", type: "seller", name: "模型1", period: "每年一次", created: "2025-12-12", creator: "王帅帅", remark: "运行中，无法删除、修改", status: "使用中", weights: [40, 20, 20, 20] },
  { id: "M05", type: "seller", name: "模型2", period: "每季度一次", created: "2025-12-12", creator: "王帅帅", remark: "这个不用了", status: "未启用", weights: [35, 25, 20, 20] },
  { id: "M06", type: "live", name: "模型1", period: "每年一次", created: "2025-12-12", creator: "王帅帅", remark: "运行中，无法删除、修改", status: "使用中", weights: [20, 40, 40] },
  { id: "M07", type: "live", name: "模型2", period: "每季度一次", created: "2025-12-12", creator: "王帅帅", remark: "这个不用了", status: "未启用", weights: [20, 35, 45] },
];

function modelInUse(m) {
  return m && (m.status === "使用中" || m.status === "运行中");
}

const RESULTS = [
  { id: "R01", type: "platform", name: "淘宝", company: "淘宝（中国）软件有限公司", credit: "91330000716100482B", format: "电子产品", biz: "网络零售", carrier: "网站", domain: "www.taobao.com", org: "福州市市场监督管理局", address: "鼓楼区华林路123号", tag: "交易型", source: "自动采集", area: "鼓楼区", station: "鼓楼市场监管所", sysLevel: "A", level: "A", mode: "自动评定", pending: true, score: 92, updated: "2026-09-01" },
  { id: "R02", type: "platform", name: "海丝数字", company: "福州海丝数字科技有限公司", credit: "91350100MA31W8XJ2R", format: "工业用品", biz: "批发", carrier: "网站", domain: "www.haishitech.cn", org: "福州市市场监督管理局", address: "鼓楼区五四路88号", tag: "交易型", source: "自动采集", area: "鼓楼区", station: "鼓楼市场监管所", sysLevel: "B", level: "B", mode: "自动评定", pending: false, score: 78, updated: "2026-09-03" },
  { id: "R07", type: "platform", name: "拼多多", company: "上海寻梦信息技术有限公司", credit: "91310000MA1FL2YW8X", format: "食品", biz: "网络零售", carrier: "APP", domain: "www.pinduoduo.com", org: "福州市市场监督管理局", address: "鼓楼区华林路123号", tag: "交易型", source: "自动采集", area: "鼓楼区", station: "鼓楼市场监管所", sysLevel: "A", level: "A", mode: "自动评定", pending: true, score: 90, updated: "2026-09-01" },
  { id: "R08", type: "platform", name: "京东", company: "北京京东世纪贸易有限公司", credit: "91110000710934653X", format: "工业用品", biz: "网络零售", carrier: "网站", domain: "www.jd.com", org: "福州市市场监督管理局", address: "台江区工业路198号", tag: "交易型", source: "自动采集", area: "台江区", station: "台江市场监管所", sysLevel: "B", level: "B", mode: "自动评定", pending: true, score: 81, updated: "2026-09-02" },
  { id: "R09", type: "platform", name: "天猫", company: "浙江天猫网络有限公司", credit: "91330000679342777Q", format: "电子产品", biz: "网络零售", carrier: "网站", domain: "www.tmall.com", org: "福州市市场监督管理局", address: "鼓楼区华林路123号", tag: "交易型", source: "人工录入", area: "鼓楼区", station: "鼓楼市场监管所", sysLevel: "A", level: "B", mode: "人工调级", pending: true, score: 86, updated: "2026-08-28" },
  { id: "R03", type: "seller", name: "闽江美妆工厂店", company: "福州闽江美妆商贸有限公司", credit: "91350103MA32K91X7Q", format: "化妆品", biz: "网络零售", carrier: "平台内店铺", domain: "tb.cn/mj-beauty", org: "台江区市场监督管理局", address: "台江区工业路56号", tag: "交易型", source: "自动采集", area: "台江区", station: "台江市场监管所", sysLevel: "C", level: "C", mode: "自动评定", pending: false, score: 61, updated: "2026-09-02" },
  { id: "R04", type: "seller", name: "鼓楼特产馆", company: "福州鼓楼特产商行", credit: "91350102MA2Y81H23P", format: "食品", biz: "网络零售", carrier: "平台内店铺", domain: "tb.cn/gl-local", org: "鼓楼区市场监督管理局", address: "鼓楼区东街口12号", tag: "交易型", source: "自动采集", area: "鼓楼区", station: "鼓楼市场监管所", sysLevel: "B", level: "A", mode: "人工调级", pending: false, score: 74, updated: "2026-08-22" },
  { id: "R05", type: "live", name: "榕城好物夜播间", liveId: "ZB10086", shop: "榕城好物旗舰店", mcn: "海丝MCN", fans: "128万", livePlat: "抖音", credit: "91350100MA31W8XJ2R", tag: "头部主播", org: "鼓楼区市场监督管理局", area: "鼓楼区", station: "鼓楼市场监管所", sysLevel: "A", level: "A", mode: "自动评定", pending: false, score: 22, updated: "2026-09-05" },
  { id: "R06", type: "live", name: "仓山母婴直播间", liveId: "ZB20881", shop: "仓山母婴馆", mcn: "未签约", fans: "6.2万", livePlat: "快手", credit: "91350104MA8T22N11C", tag: "腰部主播", org: "仓山区市场监督管理局", area: "仓山区", station: "仓山市场监管所", sysLevel: "D", level: "D", mode: "自动评定", pending: false, score: 82, updated: "2026-09-04" },
];

const APPROVALS = [
  { id: "A01", resultId: "R07", subject: "拼多多", typeLabel: "电商平台主体", credit: "91235DQWE123AAA1", company: "拼多多有限公司", org: "福州市市场监督管理局", applicant: "吴小小", created: "2025.11.07", from: "A", to: "B", reason: "这是一条原因", status: "待办理", step: "区局网监科", canHandle: true },
  { id: "A03", resultId: "R01", subject: "淘宝", typeLabel: "电商平台内经营者", credit: "91235DQWE123AAA1", company: "淘宝有限公司", org: "福州市市场监督管理局", applicant: "吴小小", created: "2025.11.07", from: "A", to: "B", reason: "这是一条原因", status: "待办理", step: "区局网监科", canHandle: true },
  { id: "A04", resultId: "R08", subject: "京东", typeLabel: "电商平台主体", credit: "91235DQWE123AAA1", company: "京东有限公司", org: "厦门市市场监督管理局", applicant: "吴小小", created: "2025.11.07", from: "B", to: "A", reason: "跨局流转办理中", status: "待办理", step: "厦门市局网监科", canHandle: false },
  { id: "A05", resultId: "R09", subject: "天猫", typeLabel: "电商平台内经营者", credit: "91235DQWE123AAA1", company: "天猫有限公司", org: "厦门市市场监督管理局", applicant: "吴小小", created: "2025.11.07", from: "B", to: "A", reason: "跨局流转办理中", status: "待办理", step: "厦门市局网监科", canHandle: false },
  { id: "A11", resultId: "R07", subject: "拼多多", typeLabel: "电商平台主体", credit: "91235DQWE123AAA1", company: "拼多多有限公司", org: "福州市市场监督管理局", applicant: "吴小小", created: "2025.11.07", from: "B", to: "A", reason: "上期调级已办结", status: "已办理", decision: "通过", step: "市局网监科", canHandle: false, done: "2025.11.08" },
  { id: "A12", resultId: "R01", subject: "淘宝", typeLabel: "电商平台内经营者", credit: "91235DQWE123AAA1", company: "淘宝有限公司", org: "福州市市场监督管理局", applicant: "吴小小", created: "2025.11.07", from: "B", to: "A", reason: "上期调级已办结", status: "已办理", decision: "通过", step: "市局网监科", canHandle: false, done: "2025.11.08" },
  { id: "A13", resultId: "R08", subject: "京东", typeLabel: "电商平台主体", credit: "91235DQWE123AAA1", company: "京东有限公司", org: "厦门市市场监督管理局", applicant: "吴小小", created: "2025.11.07", from: "A", to: "B", reason: "上期调级已办结", status: "已办理", decision: "通过", step: "市局网监科", canHandle: false, done: "2025.11.08" },
  { id: "A14", resultId: "R09", subject: "天猫", typeLabel: "电商平台内经营者", credit: "91235DQWE123AAA1", company: "天猫有限公司", org: "厦门市市场监督管理局", applicant: "吴小小", created: "2025.11.07", from: "A", to: "B", reason: "上期调级已办结", status: "已办理", decision: "通过", step: "市局网监科", canHandle: false, done: "2025.11.08" },
];

const SUBJECT_TYPES = [
  { id: "platform", name: "电商平台" },
  { id: "seller", name: "平台内经营者" },
  { id: "site", name: "网站" },
  { id: "mp", name: "公众号" },
  { id: "mini", name: "小程序" },
  { id: "app", name: "APP" },
  { id: "liveplat", name: "直播平台" },
  { id: "live", name: "直播间运营者" },
  { id: "ent", name: "企业主体" },
];

const SUBJECTS = [
  { id: "S11", type: "platform", dataType: "网站", platName: "7788商城；九九商城", path: "7788.com", name: "福州九九七八八网络技术有限公司", credit: "91350102791792840E", address: "福州市鼓楼区西洪路528-50号", station: "洪山市场监管所", product: "珠宝礼品；化妆品；食品", tag: "交易型；批发", inStdLib: "是", updated: "2026.1.1", source: "人工录入", operator: "李监管", area: "鼓楼区",
    origins: {
      platName: { "7788商城": ["省局"], "九九商城": ["第三方机构"] },
      product: { "珠宝礼品": ["省局", "第三方机构"], "化妆品": ["第三方机构"], "食品": ["省局"] },
      tag: { "交易型": ["省局"], "批发": ["第三方机构"] },
    } },
  { id: "S12", type: "platform", dataType: "APP", platName: "海丝优选", path: "app.haishi.cn", name: "福州海丝数字科技有限公司", credit: "91350100MA31W8XJ2R", address: "福州市鼓楼区五四路88号", station: "鼓楼市场监管所", product: "日用百货", tag: "交易型", inStdLib: "是", updated: "2026.8.12", source: "自动采集", operator: "李监管", area: "鼓楼区" },
  { id: "S13", type: "platform", dataType: "小程序", platName: "榕城生活+", path: "wx.rongcheng.life", name: "福州鼓楼特产商行", credit: "91350102MA2Y81H23P", address: "福州市鼓楼区东街口12号", station: "鼓楼市场监管所", product: "食品", tag: "本地生活", inStdLib: "否", updated: "2026.7.20", source: "人工录入", operator: "吴小小", area: "鼓楼区" },
  { id: "S14", type: "platform", dataType: "网站", platName: "闽都工业品", path: "www.mindugy.com", name: "福州闽江美妆商贸有限公司", credit: "91350103MA32K91X7Q", address: "福州市台江区工业路56号", station: "台江市场监管所", product: "工业用品", tag: "批发", inStdLib: "是", updated: "2026.6.18", source: "自动采集", operator: "李监管", area: "台江区" },

  { id: "S02", type: "seller", dataType: "平台内店铺", platName: "拼多多", shopName: "沙县小吃（闽江建行店）", path: "http://i.waimai.meituan.com/external/", name: "福州市马尾区群记小吃店", credit: "92350105MACHT54797", address: "福建省福州市晋安区鼓山镇后浦路26-3号", region: "福建省福州市晋安区", station: "快安市场监督管理所", product: "网络餐饮；食品", localProduct: "否", sales: "15410.62", penalty: "0", abnormal: "否", localPlat: "否", tag: "餐饮；食品经营", inStdLib: "是", updated: "2026.1.1", source: "人工录入", operator: "李监管", area: "晋安区",
    origins: {
      product: { "网络餐饮": ["省局"], "食品": ["第三方机构"] },
      tag: { "餐饮": ["省局"], "食品经营": ["省局", "第三方机构"] },
    } },
  { id: "S15", type: "seller", dataType: "平台内店铺", platName: "淘宝", shopName: "鼓楼特产馆", path: "https://tb.cn/gl-local", name: "福州鼓楼特产商行", credit: "91350102MA2Y81H23P", address: "福州市鼓楼区东街口12号", region: "福建省福州市鼓楼区", station: "鼓楼市场监管所", product: "食品", localProduct: "是", sales: "86220.00", penalty: "1", abnormal: "否", localPlat: "否", tag: "食品经营", inStdLib: "是", updated: "2026.8.22", source: "自动采集", operator: "李监管", area: "鼓楼区" },
  { id: "S41", type: "seller", dataType: "平台内店铺", platName: "京东", shopName: "闽江美妆工厂店", path: "https://mall.jd.com/mj-beauty", name: "福州闽江美妆商贸有限公司", credit: "91350103MA32K91X7Q", address: "福州市台江区工业路56号", region: "福建省福州市台江区", station: "台江市场监管所", product: "化妆品", localProduct: "否", sales: "231800.50", penalty: "0", abnormal: "否", localPlat: "否", tag: "交易型", inStdLib: "是", updated: "2026.9.2", source: "自动采集", operator: "吴小小", area: "台江区" },
  { id: "S42", type: "seller", dataType: "平台内店铺", platName: "天猫", shopName: "仓山母婴优选", path: "https://cangs.tmall.com/baby", name: "仓山母婴生活馆", credit: "91350104MA8T22N11C", address: "福州市仓山区金山大道88号", region: "福建省福州市仓山区", station: "仓山市场监管所", product: "母婴用品", localProduct: "是", sales: "41800.00", penalty: "2", abnormal: "是", localPlat: "是", tag: "母婴", inStdLib: "否", updated: "2026.8.05", source: "人工录入", operator: "李监管", area: "仓山区" },

  { id: "S03", type: "live", dataType: "直播间运营者", platName: "抖音", liveName: "榕城好物夜播间", path: "https://live.douyin.com/847291056", shopUrl: "https://tb.cn/rc-goods", name: "福州海丝数字科技有限公司", credit: "91350100MA31W8XJ2R", address: "鼓楼区五四路88号", region: "福建省福州市鼓楼区", station: "鼓楼市场监管所", product: "食品", localProduct: "是", fans: "128万", sellGoods: "是", penalty: "0", abnormal: "无", localPlat: "否", tag: "茶叶；食品", inStdLib: "是", updated: "2026.9.5", source: "自动采集", operator: "李监管", area: "鼓楼区" },
  { id: "S31", type: "live", dataType: "直播间运营者", platName: "快手", liveName: "仓山母婴直播间", path: "https://live.kuaishou.com/2201", shopUrl: "https://shop.example.com/cs-baby", name: "阿仓（个人）", credit: "", address: "仓山区", region: "福建省福州市仓山区", station: "仓山市场监管所", product: "母婴", localProduct: "否", fans: "6.2万", sellGoods: "是", penalty: "0", abnormal: "无", localPlat: "是", tag: "母婴", inStdLib: "否", updated: "2026.9.4", source: "人工录入", operator: "吴小小", area: "仓山区" },
  { id: "S61", type: "live", dataType: "直播间运营者", platName: "淘宝直播", liveName: "台江美妆工厂直播", path: "https://live.taobao.com/mj-beauty", shopUrl: "https://mall.jd.com/mj-beauty", name: "福州闽江美妆商贸有限公司", credit: "91350103MA32K91X7Q", address: "台江区工业路56号", region: "福建省福州市台江区", station: "台江市场监管所", product: "化妆品", localProduct: "否", fans: "21万", sellGoods: "是", penalty: "1", abnormal: "无", localPlat: "否", tag: "美妆", inStdLib: "是", updated: "2026.8.30", source: "自动采集", operator: "李监管", area: "台江区" },
  { id: "S62", type: "live", dataType: "直播间运营者", platName: "视频号", liveName: "晋安茶叶讲堂", path: "https://channels.weixin.qq.com/live/ja-tea", shopUrl: "https://tb.cn/ja-tea", name: "福州鼓楼特产商行", credit: "91350102MA2Y81H23P", address: "晋安区福新路66号", region: "福建省福州市晋安区", station: "晋安市场监管所", product: "茶叶", localProduct: "是", fans: "3.8万", sellGoods: "否", penalty: "0", abnormal: "无", localPlat: "否", tag: "茶叶", inStdLib: "是", updated: "2026.8.16", source: "人工录入", operator: "吴小小", area: "晋安区" },

  { id: "S04", type: "mp", dataType: "公众号", platName: "龙海联合", wechat: "lhjianhe", intro: "建筑工程、材料供应信息服务", name: "龙海建工有限公司", credit: "91350681MA32LH001X", org: "漳州市市场监督管理局", address: "漳州市龙海区县西屿镇凤田村龙丰50号", ip: "157.255.196.114", industry: "建筑业", entType: "有限责任公司(自然人投资或控股)", tag: "建筑", inStdLib: "是", updated: "2024.6.28", source: "人工录入", operator: "李监管", area: "龙海区" },
  { id: "S52", type: "mp", dataType: "公众号", platName: "海丝优选", wechat: "haishi-youxuan", intro: "福州本地好物、生活资讯", name: "福州海丝数字科技有限公司", credit: "91350100MA31W8XJ2R", org: "福州市市场监督管理局", address: "福州市鼓楼区五四路88号", ip: "112.5.18.22", industry: "软件和信息技术服务业", entType: "有限责任公司(自然人投资或控股)", tag: "资讯", inStdLib: "是", updated: "2026.7.11", source: "人工录入", operator: "吴小小", area: "鼓楼区" },
  { id: "S53", type: "mp", dataType: "公众号", platName: "闽江美妆课堂", wechat: "mj-beauty-class", intro: "化妆品选购与售后服务", name: "福州闽江美妆商贸有限公司", credit: "91350103MA32K91X7Q", org: "福州市市场监督管理局", address: "福州市台江区工业路56号", ip: "120.42.16.88", industry: "批发业", entType: "内资企业", tag: "美妆", inStdLib: "否", updated: "2026.8.02", source: "自动采集", operator: "李监管", area: "台江区" },
  { id: "S54", type: "mp", dataType: "公众号", platName: "仓山母婴汇", wechat: "cangs-baby", intro: "母婴用品、育儿知识分享", name: "仓山母婴生活馆", credit: "91350104MA8T22N11C", org: "福州市市场监督管理局", address: "福州市仓山区金山大道88号", ip: "36.248.10.15", industry: "批发业", entType: "个体工商户", tag: "母婴", inStdLib: "是", updated: "2026.5.19", source: "人工录入", operator: "李监管", area: "仓山区" },

  { id: "S05", type: "ent", dataType: "企业", name: "福建省大鼓有限公司", credit: "91350104MA32DG001A", org: "福州市市场监督管理局", address: "福建省福州市仓山区盖山路21号", entType: "内资企业", bizStatus: "存续", legal: "吴大大", platGrade: "B级", sellerGrade: "C级", inStdLib: "是", updated: "2026.6.2", source: "人工录入", operator: "李监管", area: "仓山区" },
  { id: "S21", type: "ent", dataType: "企业", name: "福州海丝数字科技有限公司", credit: "91350100MA31W8XJ2R", org: "福州市市场监督管理局", address: "福州市鼓楼区五四路88号", entType: "有限责任公司(自然人投资或控股)", bizStatus: "存续", legal: "陈海丝", platGrade: "A级", sellerGrade: "B级", inStdLib: "是", updated: "2026.9.1", source: "人工录入", operator: "李监管", area: "鼓楼区" },
  { id: "S22", type: "ent", dataType: "企业", name: "福州闽江美妆商贸有限公司", credit: "91350103MA32K91X7Q", org: "福州市市场监督管理局", address: "福州市台江区工业路56号", entType: "内资企业", bizStatus: "存续", legal: "林美妆", platGrade: "—", sellerGrade: "C级", inStdLib: "是", updated: "2026.8.28", source: "人工录入", operator: "吴小小", area: "台江区" },
  { id: "S24", type: "ent", dataType: "企业", name: "厦门海丝商贸有限公司", credit: "91350200MA8HS001XR", org: "厦门市市场监督管理局", address: "福建省厦门市思明区湖滨南路99号", entType: "外资企业", bizStatus: "注销", legal: "吴小小", platGrade: "—", sellerGrade: "—", inStdLib: "否", updated: "2026.4.12", source: "人工录入", operator: "李监管", area: "思明区" },

  { id: "S06", type: "site", dataType: "网站", platName: "龙海联合", path: "lijianhe.com", name: "龙海建工有限公司", credit: "91350681MA32LH001X", icp: "闽ICP备14008353号-10", licensed: "未亮证", org: "漳州市市场监督管理局", address: "漳州市龙海区县西屿镇凤田村龙丰50号", ip: "203.107.45.167", industry: "建筑业", entType: "有限责任公司(自然人投资或控股)", tag: "建筑", inStdLib: "是", updated: "2024.6.28", source: "人工录入", operator: "李监管", area: "龙海区" },
  { id: "S43", type: "site", dataType: "网站", platName: "海丝商城", path: "www.haishishop.cn", name: "福州海丝数字科技有限公司", credit: "91350100MA31W8XJ2R", icp: "闽ICP备202100128号-1", licensed: "已亮证", org: "福州市市场监督管理局", address: "福州市鼓楼区五四路88号", ip: "112.5.18.22", industry: "软件和信息技术服务业", entType: "有限责任公司(自然人投资或控股)", tag: "交易型", inStdLib: "是", updated: "2026.5.20", source: "自动采集", operator: "吴小小", area: "鼓楼区" },
  { id: "S44", type: "site", dataType: "网站", platName: "闽都工业网", path: "www.mindugy.com", name: "福州闽江美妆商贸有限公司", credit: "91350103MA32K91X7Q", icp: "闽ICP备18002211号-2", licensed: "已亮证", org: "福州市市场监督管理局", address: "福州市台江区工业路56号", ip: "120.42.16.88", industry: "批发业", entType: "内资企业", tag: "批发", inStdLib: "否", updated: "2026.4.16", source: "人工录入", operator: "李监管", area: "台江区" },
  { id: "S45", type: "site", dataType: "网站", platName: "鼓楼特产在线", path: "www.gltechan.com", name: "福州鼓楼特产商行", credit: "91350102MA2Y81H23P", icp: "闽ICP备19008821号-3", licensed: "未亮证", org: "福州市市场监督管理局", address: "福州市鼓楼区东街口12号", ip: "27.148.140.66", industry: "食品生产", entType: "个体工商户", tag: "食品经营", inStdLib: "是", updated: "2026.3.08", source: "自动采集", operator: "李监管", area: "鼓楼区" },

  { id: "S07", type: "mini", dataType: "小程序", platName: "中东米贵", intro: "共享洗衣机，智能洗衣机", name: "福州三坊建材有限公司", credit: "91350105MA8SF001K7", appId: "wx3505498354", category: "生活服务", org: "福州市市场监督管理局", address: "福州市马尾区君竹路18号", tag: "生活服务", inStdLib: "是", updated: "2024.6.28", source: "人工录入", operator: "吴小小", area: "马尾区" },
  { id: "S46", type: "mini", dataType: "小程序", platName: "榕城特产", intro: "福州本地茶叶、橄榄、鱼丸预订", name: "福州鼓楼特产商行", credit: "91350102MA2Y81H23P", appId: "wx1288001122", category: "食品经营", org: "福州市市场监督管理局", address: "福州市鼓楼区东街口12号", tag: "食品经营", inStdLib: "是", updated: "2026.8.02", source: "人工录入", operator: "李监管", area: "鼓楼区" },
  { id: "S47", type: "mini", dataType: "小程序", platName: "仓山洗衣帮", intro: "社区上门取送洗衣", name: "仓山母婴生活馆", credit: "91350104MA8T22N11C", appId: "wx6677889900", category: "生活服务", org: "福州市市场监督管理局", address: "福州市仓山区金山大道88号", tag: "生活服务", inStdLib: "否", updated: "2026.7.15", source: "自动采集", operator: "李监管", area: "仓山区" },
  { id: "S48", type: "mini", dataType: "小程序", platName: "三坊建材订货", intro: "建材询价、工地配送", name: "福州三坊建材有限公司", credit: "91350105MA8SF001K7", appId: "wx3344556677", category: "建筑业", org: "福州市市场监督管理局", address: "福州市马尾区君竹路18号", tag: "建筑", inStdLib: "是", updated: "2026.6.09", source: "人工录入", operator: "吴小小", area: "马尾区" },

  { id: "S08", type: "app", dataType: "APP", platName: "盛个会", path: "https://www.wandoujia.com/apps/7943260", name: "福州三坊建材有限公司", credit: "91350105MA8SF001K7", version: "1.2.1", category: "购物比价", org: "福州市市场监督管理局", address: "福州市马尾区君竹路18号", paid: "是", downloads: "420", store: "华为", ip: "203.107.45.167", industry: "软件和信息技术服务业", companyType: "有限责任公司(自然人投资或控股)", tag: "本地应用", inStdLib: "是", updated: "2024.6.28", source: "人工录入", operator: "李监管", area: "马尾区" },
  { id: "S49", type: "app", dataType: "APP", platName: "榕城生活+", path: "https://app.rongcheng.life/download", name: "福州海丝数字科技有限公司", credit: "91350100MA31W8XJ2R", version: "3.4.0", category: "生活服务", org: "福州市市场监督管理局", address: "福州市鼓楼区五四路88号", paid: "否", downloads: "12800", store: "应用宝", ip: "112.5.18.22", industry: "软件和信息技术服务业", companyType: "有限责任公司(自然人投资或控股)", tag: "本地应用", inStdLib: "是", updated: "2026.8.11", source: "自动采集", operator: "吴小小", area: "鼓楼区" },
  { id: "S50", type: "app", dataType: "APP", platName: "美妆工厂", path: "https://itunes.apple.com/cn/app/mj-beauty", name: "福州闽江美妆商贸有限公司", credit: "91350103MA32K91X7Q", version: "2.0.8", category: "购物比价", org: "福州市市场监督管理局", address: "福州市台江区工业路56号", paid: "否", downloads: "5600", store: "苹果", ip: "120.42.16.88", industry: "批发业", companyType: "内资企业", tag: "美妆", inStdLib: "否", updated: "2026.7.03", source: "人工录入", operator: "李监管", area: "台江区" },
  { id: "S51", type: "app", dataType: "APP", platName: "仓山到家", path: "https://app.mi.com/details?id=cangs.home", name: "仓山母婴生活馆", credit: "91350104MA8T22N11C", version: "1.0.5", category: "生活服务", org: "福州市市场监督管理局", address: "福州市仓山区金山大道88号", paid: "是", downloads: "980", store: "小米", ip: "36.248.10.15", industry: "食品生产", companyType: "个体工商户", tag: "母婴", inStdLib: "是", updated: "2026.5.22", source: "人工录入", operator: "李监管", area: "仓山区" },

  { id: "S09", type: "liveplat", dataType: "直播平台", platName: "淘宝直播", name: "浙江淘宝网络有限公司", credit: "91330100MA27U1X81Q", platType: "电商直播平台", bizScope: "电商娱乐", accessStatus: "已接入", grade: "A", tag: "头部平台", inStdLib: "是", updated: "2026.1.1", source: "人工录入", operator: "李监管", area: "鼓楼区" },
  { id: "S35", type: "liveplat", dataType: "直播平台", platName: "抖音", name: "北京微播视界科技有限公司", credit: "91110108MA01ABC12X", platType: "短视频平台", bizScope: "短视频直播", accessStatus: "已接入", grade: "A", tag: "头部平台", inStdLib: "是", updated: "2026.9.1", source: "人工录入", operator: "李监管", area: "鼓楼区" },
  { id: "S33", type: "liveplat", dataType: "直播平台", platName: "快手", name: "北京快手科技有限公司", credit: "91110108MA01KS88Y3", platType: "短视频平台", bizScope: "短视频社交", accessStatus: "已接入", grade: "B", tag: "腰部平台", inStdLib: "是", updated: "2026.8.20", source: "自动采集", operator: "吴小小", area: "台江区" },
  { id: "S34", type: "liveplat", dataType: "直播平台", platName: "视频号", name: "深圳市腾讯计算机系统有限公司", credit: "91440300708461136T", platType: "社交平台", bizScope: "社交直播", accessStatus: "未接入", grade: "C", tag: "待接入", inStdLib: "否", updated: "2026.7.06", source: "人工录入", operator: "李监管", area: "鼓楼区" },
];

const DEFAULT_SUBJECT_LOGS = [
  { id: "L01", type: "platform", op: "新增", dataType: "网站", platName: "7788商城", path: "7788.com", name: "福建省艺智科技有限公司", credit: "91350102791792840E", address: "福州市鼓楼区西环路528-50号", station: "洪山市场监管所", product: "珠宝礼品", tag: "交易型", operator: "吴大大", time: "2026.1.1" },
  { id: "L02", type: "platform", op: "删除", dataType: "小程序", platName: "文艺通", path: "7788.com", name: "福建省艺智科技有限公司", credit: "91350102791792840E", address: "福州市鼓楼区西环路528-50号", station: "洪山市场监管所", product: "珠宝礼品", tag: "交易型", operator: "吴大大", time: "2026.1.1" },
  { id: "L03", type: "platform", op: "新增", dataType: "小程序", platName: "文艺盛", path: "7788.com", name: "福建省艺智科技有限公司", credit: "91350102791792840E", address: "福州市鼓楼区西环路528-50号", station: "洪山市场监管所", product: "珠宝礼品", tag: "交易型", operator: "吴大大", time: "2026.1.1" },
  { id: "L04", type: "platform", op: "删除", dataType: "小程序", platName: "文艺通", path: "7788.com", name: "福建省艺智科技有限公司", credit: "91350102791792840E", address: "福州市鼓楼区西环路528-50号", station: "洪山市场监管所", product: "珠宝礼品", tag: "交易型", operator: "吴大大", time: "2026.1.1" },
  { id: "L05", type: "live", op: "新增", dataType: "直播间运营者", platName: "抖音", liveName: "榕城好物夜播间", path: "https://live.douyin.com/847291056", shopUrl: "https://tb.cn/rc-goods", name: "福州海丝数字科技有限公司", credit: "91350100MA31W8XJ2R", station: "鼓楼市场监管所", inStdLib: "是", fans: "128万", sellGoods: "是", operator: "李监管", time: "2026.9.5" },
  { id: "L06", type: "live", op: "新增", dataType: "直播间运营者", platName: "快手", liveName: "仓山母婴直播间", path: "https://live.kuaishou.com/2201", shopUrl: "https://shop.example.com/cs-baby", name: "阿仓（个人）", credit: "", station: "仓山市场监管所", inStdLib: "否", fans: "6.2万", sellGoods: "是", operator: "吴小小", time: "2026.9.4" },
  { id: "L07", type: "liveplat", op: "新增", platName: "淘宝直播", name: "浙江淘宝网络有限公司", credit: "91350102791792840E", platType: "短视频平台", bizScope: "电商娱乐", accessStatus: "已接入", grade: "A", tag: "这是一个标签", operator: "李监管", time: "2026.1.1" },
];

function subjectLogFrom(s, op, operator) {
  return {
    id: "L" + Date.now().toString().slice(-6),
    type: s.type, op,
    dataType: s.dataType, platName: s.platName, path: s.path, name: s.name,
    liveName: s.liveName, shopUrl: s.shopUrl, inStdLib: s.inStdLib, fans: s.fans, sellGoods: s.sellGoods,
    credit: s.credit, address: s.address, station: s.station,
    product: s.product, tag: s.tag,
    platType: s.platType, bizScope: s.bizScope, accessStatus: s.accessStatus, grade: s.grade,
    category: s.category,
    wechat: s.wechat, intro: s.intro, appId: s.appId, version: s.version, paid: s.paid,
    downloads: s.downloads, store: s.store, companyType: s.companyType, org: s.org, entType: s.entType,
    region: s.region, localProduct: s.localProduct, sales: s.sales, penalty: s.penalty,
    abnormal: s.abnormal, localPlat: s.localPlat,
    operator: operator || "李监管", time: "2026.9.10",
    subjectId: s.id,
  };
}

const SPECIALS = [
  { id: "T01", name: "中秋食品直播专项", type: "主体", range: "2026-09-01 ~ 2026-09-20", status: "进行中", rooms: 18, clues: 6, owner: "网监科" },
  { id: "T02", name: "医美广告排查", type: "网址", range: "2026-08-01 ~ 2026-08-31", status: "已完成", rooms: 42, clues: 11, owner: "网监科" },
  { id: "T03", name: "开学季教培促销", type: "主体", range: "2026-09-05 ~ 2026-09-30", status: "待开始", rooms: 9, clues: 0, owner: "网监科" },
];

const APPLY_TYPES = ["主体监测", "违法违规行为", "违法行为"];
const APPLY_ORGS = ["福建省市场监督管理局", "福州市市场监督管理局", "仓山区市场监督管理局"];

const SPECIAL_APPLIES = [
  { id: "SA01", name: "茶叶主体监测", type: "主体监测", deadline: "2026-05-05", applied: "2026-05-01", done: "是", desc: "收集贩卖茶叶主体信息", tag: "茶叶", org: "福建省市场监督管理局", applicant: "吴大", dept: "食品处", canImport: true },
  { id: "SA02", name: "违法监测", type: "违法违规行为", deadline: "2026-05-05", applied: "2026-05-01", done: "否", desc: "排查直播带货违法违规线索", tag: "违法违规", org: "仓山区市场监督管理局", applicant: "吴大", dept: "食品处", canImport: true },
  { id: "SA03", name: "违法监测", type: "违法违规行为", deadline: "2026-05-05", applied: "2026-05-01", done: "否", desc: "排查网店虚假宣传线索", tag: "广告", org: "福州市市场监督管理局", applicant: "吴大", dept: "食品处", canImport: true },
  { id: "SA04", name: "违法监测", type: "违法违规行为", deadline: "2026-05-05", applied: "2026-05-01", done: "否", desc: "监测涉嫌违法行为线索", tag: "违法行为", org: "福州市市场监督管理局", applicant: "吴大", dept: "食品处", canImport: true },
];

const CLUES = [
  { id: "C01", source: "专项监测", task: "中秋食品直播专项", platName: "抖音", shopName: "榕城好物夜播间", shopUrl: "https://live.douyin.com/847291056", subjectType: "个体工商户", subject: "榕城好物夜播间", credit: "92350102MA8LIVE01X", goodsName: "中秋月饼礼盒", goodsCat: "食品", goodsUrl: "https://live.douyin.com/847291056", monitorDate: "2026-09-06", item: "食品无证经营", status: "待处置", deadline: "正常", copied: false, created: "2026-09-06 14:22", handleUnit: "福建省市场监督管理局", area: "鼓楼区" },
  { id: "C02", source: "消费者", task: "—", platName: "淘宝", shopName: "闽江美妆工厂店", shopUrl: "https://shop.example.com/mz", subjectType: "企业", subject: "福州闽江美妆商贸有限公司", credit: "91350103MA32K91X7Q", goodsName: "美白精华套装", goodsCat: "化妆品", goodsUrl: "https://shop.example.com/mz/item/88", monitorDate: "2026-09-04", item: "虚假宣传", status: "处置中", deadline: "超期", copied: false, created: "2026-09-04 09:18", disposeType: "立案", caseResult: "罚款", handleUnit: "福建省市场监督管理局", area: "台江区" },
  { id: "C03", source: "专项监测", task: "医美广告排查", platName: "抖音", shopName: "仓山医美直播间", shopUrl: "https://live.douyin.com/2201", subjectType: "企业", subject: "福州仓山医美咨询有限公司", credit: "91350104MA8YM001K", goodsName: "光子嫩肤体验卡", goodsCat: "生活服务", goodsUrl: "https://live.douyin.com/2201", monitorDate: "2026-08-19", item: "医疗广告", status: "已办结", deadline: "正常", copied: false, created: "2026-08-19 11:05", disposeType: "责令改正", caseResult: "警告、通报批评", handleUnit: "福州市市场监督管理局", area: "仓山区" },
  { id: "C04", source: "抄送", task: "—", platName: "淘宝", shopName: "鼓楼特产馆", shopUrl: "https://tb.cn/gl-local", subjectType: "个体工商户", subject: "福州鼓楼特产商行", credit: "91350102MA2Y81H23P", goodsName: "茉莉花茶礼盒", goodsCat: "食品", goodsUrl: "https://tb.cn/gl-local/item/12", monitorDate: "2026-09-07", item: "价格欺诈", status: "待处置", deadline: "超期", copied: true, created: "2026-09-07 08:40", handleUnit: "福建省市场监督管理局", area: "鼓楼区" },
  { id: "C05", source: "专项监测", task: "XXX监测任务", platName: "京东", shopName: "四世同堂保健品旗舰店", shopUrl: "https://item.jd.com/10026019100032.html", subjectType: "企业", subject: "山东天牧健生物工程有限公司", credit: "91370100611204254L", goodsName: "四世同堂菊粉糖苷补铁大豆磷脂下属菊苣根菊粉养生保健营养大餐", goodsCat: "保健品", goodsUrl: "https://item.jd.com/10026019100032.html", monitorDate: "2021-02-10", item: "涉嫌禁止销售物品", violateType: "涉嫌野生动物违规", violateShow: "涉嫌禁止销售物品", status: "待处置", deadline: "正常", copied: false, created: "2021-02-10 10:12", handleUnit: "福建省市场监督管理局", dispatchUnit: "福建省市场监督管理局", area: "仓山区", regAddr: "市中（山东）自由贸易试验区济南片区舜华南路2000号研发产业6号楼20层2007", contact: "0531-88872388", law: "法律违反《野生动物保护法》，含二级保护动物、犀牛", lawName: "《野生动物保护法》", lawItem: "第二十七条 禁止出售、购买、利用国家重点保护野生动物及其制品。", evidenceUrl: "http://gxzfwgl.tang.oss-cn-hangzhou.aliyuncs.com/file/99cccdaf1a251269cd0553675cd7491-stamper.pdf", monitorSource: "XXX监测单位", platCredit: "91110307567134916R", platAddr: "北京市北京经济技术开发区科创十一街18号院1号楼21F-22", platProv: "北京市", platCity: "北京市", platDist: "北京经济技术开发区", jurProv: "北京市", jurCity: "北京市", jurDist: "北京经济技术开发区", handleAdvice: "建议移交" },
  { id: "C06", source: "专项监测", task: "XXX监测任务", platName: "京东", shopName: "四世同堂保健品旗舰店", shopUrl: "https://item.jd.com/10026019100032.html", subjectType: "企业", subject: "山东天牧健生物工程有限公司", credit: "91370100611204254L", goodsName: "四世同堂菊粉糖苷补铁大豆磷脂下属菊苣根菊粉养生保健营养大餐", goodsCat: "保健品", goodsUrl: "https://item.jd.com/10026019100032.html", monitorDate: "2021-02-10", item: "涉嫌禁止销售物品", violateType: "涉嫌野生动物违规", violateShow: "涉嫌禁止销售物品", status: "待处置", deadline: "临期", copied: false, created: "2021-02-10 10:12", handleUnit: "福州市市场监督管理局", dispatchUnit: "福州市市场监督管理局", area: "仓山区", regAddr: "市中（山东）自由贸易试验区济南片区舜华南路2000号研发产业6号楼20层2007", contact: "0531-88872388", law: "法律违反《野生动物保护法》，含二级保护动物、犀牛", lawName: "《野生动物保护法》", lawItem: "第二十七条 禁止出售、购买、利用国家重点保护野生动物及其制品。", evidenceUrl: "http://gxzfwgl.tang.oss-cn-hangzhou.aliyuncs.com/file/99cccdaf1a251269cd0553675cd7491-stamper.pdf", monitorSource: "XXX监测单位", platCredit: "91110307567134916R", platAddr: "北京市北京经济技术开发区科创十一街18号院1号楼21F-22", platProv: "北京市", platCity: "北京市", platDist: "北京经济技术开发区", jurProv: "北京市", jurCity: "北京市", jurDist: "北京经济技术开发区", handleAdvice: "建议移交" },
  { id: "C07", source: "专项监测", task: "保健品专项监测", platName: "淘宝", shopName: "琼淳健康食品自营店", shopUrl: "https://item.taobao.com/item.htm?id=606782889698", subjectType: "企业", subject: "田家庵区琼淳食品经营部", credit: "92340403MA2RNNEE9A", goodsName: "碧然堂黄芪王浆丸三九海鲜超级升级版", goodsCat: "保健品", goodsUrl: "https://item.taobao.com/item.htm?id=606782889698", monitorDate: "2021-02-10", item: "涉嫌野生动物违规", violateType: "涉嫌野生动物违规", status: "待处置", deadline: "超期", copied: false, created: "2021-02-10 11:08", handleUnit: "福建省市场监督管理局", dispatchUnit: "福建省市场监督管理局", area: "晋安区" },
  { id: "C08", source: "专项监测", task: "保健品专项监测", platName: "淘宝", shopName: "琼淳健康食品自营店", shopUrl: "https://item.taobao.com/item.htm?id=606782889698", subjectType: "企业", subject: "田家庵区琼淳食品经营部", credit: "92340403MA2RNNEE9A", goodsName: "碧然堂黄芪王浆丸三九海鲜超级升级版", goodsCat: "保健品", goodsUrl: "https://item.taobao.com/item.htm?id=606782889698", monitorDate: "2021-02-10", item: "涉嫌野生动物违规", violateType: "涉嫌野生动物违规", status: "已办结", deadline: "超期", copied: true, created: "2021-02-10 11:08", disposeType: "立案", caseResult: "罚款", handleUnit: "福建省市场监督管理局", dispatchUnit: "福建省市场监督管理局", area: "晋安区" },
  { id: "C09", source: "专项监测", task: "保健品专项监测", platName: "淘宝", shopName: "琼淳健康食品自营店", shopUrl: "https://item.taobao.com/item.htm?id=606782889698", subjectType: "企业", subject: "田家庵区琼淳食品经营部", credit: "92340403MA2RNNEE9A", goodsName: "碧然堂黄芪王浆丸三九海鲜超级升级版", goodsCat: "保健品", goodsUrl: "https://item.taobao.com/item.htm?id=606782889698", monitorDate: "2021-02-10", item: "涉嫌野生动物违规", violateType: "涉嫌野生动物违规", status: "处置中", deadline: "超期", copied: false, created: "2021-02-10 11:08", disposeType: "立案", handleUnit: "福建省市场监督管理局", dispatchUnit: "福建省市场监督管理局", area: "晋安区" },
  { id: "C21", source: "专项监测", task: "XXX监测任务", platName: "京东", shopName: "四世同堂保健品旗舰店", shopUrl: "https://item.jd.com/10026019100032.html", subjectType: "企业", subject: "山东天牧健生物工程有限公司", credit: "91370100611204254L", goodsName: "四世同堂菊粉糖苷补铁大豆磷脂下属菊苣根菊粉养生保健营养大餐", goodsCat: "保健品", goodsUrl: "https://item.jd.com/10026019100032.html", monitorDate: "2021-02-10", item: "涉嫌野生动物违规", violateType: "涉嫌野生动物违规", status: "已办结", deadline: "正常", copied: false, created: "2021-02-10 10:12", handleUnit: "福建省市场监督管理局", dispatchUnit: "福建省市场监督管理局", area: "仓山区" },
  { id: "C22", source: "专项监测", task: "XXX监测任务", platName: "京东", shopName: "四世同堂保健品旗舰店", shopUrl: "https://item.jd.com/10026019100032.html", subjectType: "企业", subject: "山东天牧健生物工程有限公司", credit: "91370100613204254L", goodsName: "四世同堂菊粉糖苷补铁大豆磷脂下属菊苣根菊粉养生保健营养男人霜", goodsCat: "保健品", goodsUrl: "https://item.jd.com/10026019100032.html", monitorDate: "2021-02-10", item: "涉嫌野生动物违规", violateType: "涉嫌野生动物违规", status: "已办结", deadline: "临期", copied: false, created: "2021-02-10 10:12", handleUnit: "福州市市场监督管理局", dispatchUnit: "福州市市场监督管理局", area: "仓山区" },
];

const PACKS = [
  { id: "P01", name: "2026年主体检查", type: "分级分类定向检查", desc: "检查监管主体是否合法经营", time: "2026.01.01-2026.01.31", owner: "张大", creator: "李监管", dispatchTo: "福建省市场监督管理局", dispatched: "2025.12.30", total: 3211, done: 3211, status: "已完成", mine: true, note: "" },
  { id: "P02", name: "2026年主体检查", type: "分级分类定向检查", desc: "检查监管主体是否合法经营", time: "2026.01.01-2026.01.31", owner: "张大", creator: "李监管", dispatchTo: "福建省市场监督管理局", dispatched: "2025.12.30", total: 3211, done: 123, status: "未完成", mine: true, note: "" },
  { id: "P03", name: "2026年主体检查", type: "专项定向检查", desc: "检查监管主体是否合法经营", time: "2026.01.01-2026.01.31", owner: "张大", creator: "李监管", dispatchTo: "福建省市场监督管理局", dispatched: "2025.12.30", total: 3211, done: 123, status: "未完成", mine: true, note: "" },
  { id: "P04", name: "2026年主体检查", type: "专项定向检查", desc: "检查监管主体是否合法经营", time: "2026.01.01-2026.01.31", owner: "张大", creator: "李监管", dispatchTo: "福建省市场监督管理局", dispatched: "2025.12.30", total: 3211, done: 0, status: "未完成", mine: true, note: "" },
  { id: "P05", name: "仓山所网监抽查", type: "分级分类定向检查", desc: "下级所创建的定向检查", time: "2026.02.01-2026.02.28", owner: "王所", creator: "王所", dispatchTo: "仓山市场监管所", dispatched: "2026.1.20", total: 86, done: 12, status: "未完成", mine: false, note: "下级任务仅可查看" },
];

const CHECK_DEMO = {
  platName: "美团",
  shopName: "沙县小吃（德江路行店）",
  url: "http://i.waimai.meituan.com/external/poi/975508606384580",
  name: "福州市马尾区群亿小吃店",
  credit: "92350105MACHT54797",
  address: "福建省福州市晋安区鼓山镇后浦路26号",
  region: "福建省福州市马尾区",
  grade: "A",
  area: "马尾区",
  product: "网络餐饮",
  localProduct: "否",
  sales: "15410.62",
  penalty: "0",
  abnormal: "否",
  localPlat: "否",
  tag: "食品生产主体",
  valid: "是",
};
const INSPECT_DONE = {
  inspector: "吴中中",
  inspectTime: "2026.01.01",
  inspectOrg: "仓山前靖市场监管所",
  inScope: "是",
  licenseOk: "否",
  licenseReason: "不在有效期内",
  permitOk: "否",
  permitReason: "不在有效期内",
  food: "是",
  drug: "是",
  device: "是",
  cosmetic: "是",
  violate: "是",
  flow: [
    { op: "派发", org: "福建省市场监督管理局省处", who: "吴大大", date: "2025.11.11" },
    { op: "退回", org: "福建省市场监督管理局省处", who: "吴大大", date: "2025.11.12" },
    { op: "派发", org: "福建省市场监督管理局省处", who: "吴大大", date: "2025.11.13" },
    { op: "检查", org: "仓山南路市场监管所", who: "吴中中", date: "2025.11.14" },
  ],
};
function checkRow(id, packId, extra) {
  const row = { ...CHECK_DEMO, ...(extra && extra.status === "已检查" ? INSPECT_DONE : {}), ...extra, id, packId };
  row.target = row.shopName;
  return row;
}
const CHECKS = [
  checkRow("K01", "P01", { station: "快安市场监管所", status: "已检查" }),
  checkRow("K11", "P01", { shopName: "沙县小吃（闽江建行店）", station: "快安市场监管所", status: "已检查" }),
  checkRow("K12", "P01", { shopName: "仓山母婴优选", platName: "天猫", url: "https://cangs.tmall.com/baby", name: "仓山母婴生活馆", credit: "91350104MA8T22N11C", address: "福州市仓山区金山大道88号", station: "仓山市场监管所", grade: "C", status: "已检查", area: "仓山区" }),
  checkRow("K02", "P02", { station: "快安市场监管所", status: "已检查" }),
  checkRow("K05", "P02", { station: "快安市场监管所", status: "未检查" }),
  checkRow("K21", "P02", { station: "快安市场监管所", status: "未指派" }),
  checkRow("K22", "P02", { station: "快安市场监管所", status: "无法检查" }),
  checkRow("K13", "P03", { shopName: "闽江美妆工厂店", platName: "京东", url: "https://mall.jd.com/mj-beauty", name: "福州闽江美妆商贸有限公司", credit: "91350103MA32K91X7Q", address: "福州市台江区工业路56号", station: "台江市场监管所", grade: "C", status: "已检查", area: "台江区" }),
  checkRow("K14", "P03", { shopName: "鼓楼特产馆", platName: "淘宝", url: "https://tb.cn/gl-local", name: "福州鼓楼特产商行", credit: "91350102MA2Y81H23P", address: "福州市鼓楼区东街口12号", station: "鼓楼市场监管所", grade: "B", status: "已检查", area: "鼓楼区" }),
  checkRow("K03", "P04", { shopName: "沙县小吃（亭江店）", station: "快安市场监管所", status: "未指派" }),
  checkRow("K04", "P04", { shopName: "沙县小吃（马尾店）", station: "快安市场监管所", status: "未指派" }),
  checkRow("K31", "P05", { shopName: "仓山母婴优选", platName: "天猫", url: "https://cangs.tmall.com/baby", name: "仓山母婴生活馆", credit: "91350104MA8T22N11C", address: "福州市仓山区金山大道88号", station: "仓山市场监管所", grade: "C", status: "未检查", area: "仓山区" }),
];

function protoToday() { return "2026.10.10"; }
function addMonthsDot(s, n) {
  const p = String(s || "").replace(/\./g, "-").split("-").map(Number);
  if (p.length < 3 || !p[0]) return "";
  const d = new Date(p[0], p[1] - 1, p[2]);
  d.setMonth(d.getMonth() + n);
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join(".");
}
function shopWhiteKey(row) {
  return [(row.platName || ""), (row.shopName || row.target || ""), (row.path || row.url || "")].join("|");
}
function whiteFromShop(id, shop, extra) {
  extra = extra || {};
  const enter = extra.enter || protoToday();
  return {
    id,
    key: shopWhiteKey(shop),
    platName: shop.platName || "",
    shopName: shop.shopName || shop.target || "",
    path: shop.path || shop.url || "",
    name: shop.name || "",
    credit: shop.credit || "",
    address: shop.address || "",
    station: shop.station || "",
    packId: extra.packId || "",
    packName: extra.packName || "",
    enter,
    expire: extra.expire || addMonthsDot(enter, 6),
    subjectId: shop.id || shop.subjectId || "",
  };
}
const WHITE_LIST = [
  whiteFromShop("W01", SUBJECTS.find((s) => s.id === "S02") || {}, { packId: "P01", packName: "2026年主体检查", enter: "2026.05.10" }),
  whiteFromShop("W02", SUBJECTS.find((s) => s.id === "S15") || {}, { packId: "P02", packName: "2026年主体检查", enter: "2026.07.12" }),
  whiteFromShop("W03", SUBJECTS.find((s) => s.id === "S41") || {}, { packId: "P03", packName: "2026年主体检查", enter: "2026.04.15" }),
  whiteFromShop("W04", SUBJECTS.find((s) => s.id === "S42") || {}, { packId: "P01", packName: "2026年主体检查", enter: "2026.03.01" }),
];
const DISPATCH_ORGS = ["福建省市场监督管理局", "福州市市场监督管理局", "鼓楼区市场监督管理局", "台江区市场监督管理局", "仓山区市场监督管理局", "晋安区市场监督管理局", "仓山市场监管所"];

function mergeById(base, patchMap) {
  patchMap = patchMap || {};
  const seen = new Set();
  const rows = base.map((row) => {
    seen.add(row.id);
    return { ...row, ...(patchMap[row.id] || {}) };
  });
  Object.keys(patchMap).forEach((id) => {
    const extra = patchMap[id];
    if (!seen.has(id) && extra && extra.id) rows.push(extra);
  });
  return rows;
}
function models() { return mergeById(MODELS, loadState().models); }
function results() { return mergeById(RESULTS, loadState().results); }
function approvals() { return mergeById(APPROVALS, loadState().approvals); }
function normLiveSubject(row) {
  if (!row) return row;
  if (row.type === "mcn") return null;
  if (row.type === "anchor") {
    return { ...row, type: "live", dataType: row.dataType === "主播" ? "直播间运营者" : (row.dataType || "直播间运营者") };
  }
  return row;
}
function subjects() {
  return mergeById(SUBJECTS, loadState().subjects)
    .map(normLiveSubject)
    .filter((s) => s && s.status !== "已删除")
    .map((s) => ({ ...s, inStdLib: s.inStdLib || "是" }));
}
function subjectLogs() {
  const saved = loadState().subjectLogs;
  const rows = !Array.isArray(saved) || !saved.length || saved[0].dataType == null
    ? DEFAULT_SUBJECT_LOGS.slice()
    : saved;
  return rows.map(normLiveSubject).filter(Boolean);
}
function pushSubjectLog(row) {
  const logs = subjectLogs();
  logs.unshift(row);
  saveState({ subjectLogs: logs });
}

const REGION_OPTS = [
  "福建省福州市鼓楼区",
  "福建省福州市台江区",
  "福建省福州市仓山区",
  "福建省福州市晋安区",
  "福建省福州市马尾区",
  "福建省福州市闽侯县",
];

const STATION_REGION = {
  "鼓楼市场监管所": "福建省福州市鼓楼区",
  "台江市场监管所": "福建省福州市台江区",
  "仓山市场监管所": "福建省福州市仓山区",
  "晋安市场监管所": "福建省福州市晋安区",
  "马尾市场监管所": "福建省福州市马尾区",
  "快安市场监管所": "福建省福州市马尾区",
  "7780监察所": "福建省福州市马尾区",
  "鼓山市场监督管理所": "福建省福州市晋安区",
  "洪山市场监管所": "福建省福州市鼓楼区",
  "快安市场监管所": "福建省福州市马尾区",
  "快安市场监督管理所": "福建省福州市马尾区",
  "7780监察所": "福建省福州市马尾区",
};

const LIVE_PLATS = ["抖音", "快手", "淘宝直播", "视频号", "京东直播"];
const LIVEPLAT_TYPES = ["短视频平台", "社交平台", "电商直播平台"];
const LIVEPLAT_ACCESS = ["已接入", "未接入"];
const LIVEPLAT_GRADES = ["A", "B", "C", "D"];
const SM_ORGS = ["福州市市场监督管理局", "漳州市市场监督管理局", "厦门市市场监督管理局"];
const INDUSTRIES = ["软件和信息技术服务业", "批发业", "建筑业", "食品生产", "网络餐饮"];
const COMPANY_TYPES = ["有限责任公司(自然人投资或控股)", "内资企业", "外资企业", "个体工商户"];
const LIGHT_OPTS = ["已亮证", "未亮证"];
const SELLER_PLATS = ["拼多多", "淘宝", "京东", "天猫"];
const MINI_CATS = ["建筑业", "生活服务", "食品经营"];
const APP_CATS = ["购物比价", "生活服务", "工具"];
const APP_STORES = ["华为", "应用宝", "苹果", "小米"];
const YN_OPTS = ["是", "否"];

const SUB_PROFILES = {
  seller: {
    dataType: "平台内店铺",
    addTitle: "新增电商平台内经营者主体",
    filters: [
      { id: "q-plat", label: "所属平台", key: "platName", kind: "input" },
      { id: "q-shop", label: "网店名称", key: "shopName", kind: "input" },
      { id: "q-path", label: "网店地址", key: "path", kind: "input" },
      { id: "q-name", label: "主体名称", key: "name", kind: "input" },
      { id: "q-credit", label: "统一社会信用代码", key: "credit", kind: "input" },
      { id: "q-addr", label: "登记地址", key: "address", kind: "input" },
      { id: "q-region", label: "所在区域", key: "region", kind: "select", optsKey: "regions" },
      { id: "q-station", label: "管辖所", key: "station", kind: "select", optsKey: "stations" },
      { id: "q-product", label: "经营产品类别", key: "product", kind: "select", optsKey: "products" },
      { id: "q-localp", label: "是否为本地产品", key: "localProduct", kind: "select", opts: YN_OPTS },
      { id: "q-sales", label: "网店总销售额", key: "sales", kind: "input" },
      { id: "q-penalty", label: "行政处罚数量", key: "penalty", kind: "input" },
      { id: "q-abn", label: "经营异常情况", key: "abnormal", kind: "select", opts: YN_OPTS },
      { id: "q-tag", label: "业务子库", key: "tag", kind: "select", optsKey: "tags" },
    ],
    cols: [
      { key: "platName", label: "所属平台" },
      { key: "shopName", label: "网店名称" },
      { key: "path", label: "网店地址" },
      { key: "name", label: "主体名称" },
      { key: "credit", label: "统一社会信用代码" },
      { key: "address", label: "登记地址" },
      { key: "station", label: "管辖所" },
      { key: "product", label: "经营产品类别" },
      { key: "localProduct", label: "是否为本地产品" },
      { key: "sales", label: "网店总销售额" },
      { key: "penalty", label: "行政处罚数量" },
      { key: "abnormal", label: "经营异常情况" },
    ],
    addFields: [
      { key: "platName", label: "所属平台", req: true },
      { key: "shopName", label: "网店名称", req: true },
      { key: "path", label: "网店地址", req: true },
      { key: "name", label: "主体名称", req: true, lookup: "name" },
      { key: "credit", label: "统一社会信用代码", req: true, lookup: "credit" },
      { key: "address", label: "登记地址" },
      { key: "region", label: "所在区域", disabled: true, placeholder: "根据管辖所自动回填" },
      { key: "station", label: "管辖所", kind: "select", optsKey: "stations", onchange: "fillSellerRegion()" },
      { key: "product", label: "经营产品类别" },
      { key: "localProduct", label: "是否为本地产品", kind: "select", opts: YN_OPTS },
      { key: "sales", label: "网店总销售额" },
      { key: "penalty", label: "行政处罚数量" },
      { key: "abnormal", label: "经营异常情况", kind: "select", opts: YN_OPTS },
      { key: "localPlat", label: "是否为本地电商平台", req: true, kind: "select", opts: YN_OPTS },
      { key: "tag", label: "业务子库" },
    ],
  },
  site: {
    dataType: "网站",
    addTitle: "新增网站主体",
    filters: [
      { id: "q-plat", label: "网站名称", key: "platName", kind: "input" },
      { id: "q-name", label: "主体名称", key: "name", kind: "input" },
      { id: "q-path", label: "网站地址", key: "path", kind: "input" },
      { id: "q-icp", label: "备案号", key: "icp", kind: "input" },
      { id: "q-light", label: "是否亮照", key: "licensed", kind: "select", opts: LIGHT_OPTS },
      { id: "q-credit", label: "统一社会信用代码", key: "credit", kind: "input" },
      { id: "q-org", label: "登记机关", key: "org", kind: "select", opts: SM_ORGS },
      { id: "q-addr", label: "注册地址", key: "address", kind: "input" },
      { id: "q-ip", label: "IP地址", key: "ip", kind: "input" },
      { id: "q-ind", label: "行业类型", key: "industry", kind: "select", opts: INDUSTRIES },
      { id: "q-enttype", label: "企业类型", key: "entType", kind: "select", opts: COMPANY_TYPES },
      { id: "q-tag", label: "业务子库", key: "tag", kind: "select", optsKey: "tags" },
    ],
    cols: [
      { key: "platName", label: "网站名称" },
      { key: "name", label: "主体名称" },
      { key: "credit", label: "统一社会信用代码" },
      { key: "path", label: "网站地址" },
      { key: "icp", label: "备案号" },
      { key: "licensed", label: "是否亮照" },
      { key: "org", label: "登记机关" },
      { key: "address", label: "注册地址" },
      { key: "ip", label: "Ip地址" },
      { key: "industry", label: "行业类型" },
      { key: "entType", label: "企业类型" },
    ],
    addFields: [
      { key: "platName", label: "网站名称", req: true },
      { key: "path", label: "网站地址", req: true },
      { key: "name", label: "主体名称", req: true, lookup: "name" },
      { key: "icp", label: "备案号" },
      { key: "licensed", label: "是否亮照", kind: "select", opts: LIGHT_OPTS },
      { key: "credit", label: "统一社会信用代码", lookup: "credit" },
      { key: "org", label: "登记机关", kind: "select", opts: SM_ORGS },
      { key: "address", label: "注册地址", disabled: true, placeholder: "自动回填" },
      { key: "district", label: "市/区县/乡镇", disabled: true, placeholder: "自动回填" },
      { key: "ip", label: "Ip地址" },
      { key: "industry", label: "行业类型", kind: "select", opts: INDUSTRIES },
      { key: "entType", label: "企业类型", kind: "select", opts: COMPANY_TYPES, disabled: true },
      { key: "tag", label: "业务子库" },
    ],
  },
  mp: {
    dataType: "公众号",
    addTitle: "新增公众号主体",
    filters: [
      { id: "q-plat", label: "公众号名称", key: "platName", kind: "input" },
      { id: "q-name", label: "主体名称", key: "name", kind: "input" },
      { id: "q-addr", label: "公司注册地址", key: "address", kind: "input" },
      { id: "q-wechat", label: "微信号", key: "wechat", kind: "input" },
      { id: "q-intro", label: "公众号简介", key: "intro", kind: "input" },
      { id: "q-credit", label: "统一社会信用代码", key: "credit", kind: "input" },
      { id: "q-org", label: "登记机关", key: "org", kind: "select", opts: SM_ORGS },
      { id: "q-ip", label: "ip地址", key: "ip", kind: "input" },
      { id: "q-ind", label: "行业类型", key: "industry", kind: "select", opts: INDUSTRIES },
      { id: "q-enttype", label: "企业类型", key: "entType", kind: "select", opts: COMPANY_TYPES },
      { id: "q-tag", label: "业务子库", key: "tag", kind: "select", optsKey: "tags" },
    ],
    cols: [
      { key: "platName", label: "公众号名称" },
      { key: "name", label: "主体名称" },
      { key: "credit", label: "公司统一社会信用代码" },
      { key: "org", label: "登记机关" },
      { key: "address", label: "公司注册地址" },
      { key: "wechat", label: "微信号" },
      { key: "intro", label: "公众号简介" },
      { key: "ip", label: "Ip地址" },
      { key: "industry", label: "行业类型" },
      { key: "entType", label: "企业类型" },
      { key: "tag", label: "业务子库" },
    ],
    addFields: [
      { key: "platName", label: "公众号名称", req: true },
      { key: "wechat", label: "微信号", req: true },
      { key: "name", label: "主体名称", req: true, lookup: "name" },
      { key: "intro", label: "公众号简介" },
      { key: "entType", label: "企业类型", kind: "select", opts: COMPANY_TYPES, disabled: true, placeholder: "自动回填" },
      { key: "credit", label: "统一社会信用代码", lookup: "credit" },
      { key: "org", label: "登记机关", kind: "select", opts: SM_ORGS },
      { key: "address", label: "公司注册地址", disabled: true, placeholder: "自动回填" },
      { key: "ip", label: "ip地址" },
      { key: "industry", label: "行业类型" },
      { key: "tag", label: "业务子库" },
    ],
  },
  mini: {
    dataType: "小程序",
    addTitle: "新增小程序主体",
    filters: [
      { id: "q-plat", label: "微信小程序名称", key: "platName", kind: "input" },
      { id: "q-name", label: "主体名称", key: "name", kind: "input" },
      { id: "q-intro", label: "小程序简介", key: "intro", kind: "input" },
      { id: "q-appid", label: "小程序ID", key: "appId", kind: "input" },
      { id: "q-cat", label: "小程序分类", key: "category", kind: "select", opts: MINI_CATS },
      { id: "q-credit", label: "统一社会信用代码", key: "credit", kind: "input" },
      { id: "q-org", label: "登记机关", key: "org", kind: "select", opts: SM_ORGS },
      { id: "q-addr", label: "注册地址", key: "address", kind: "input" },
      { id: "q-tag", label: "业务子库", key: "tag", kind: "select", optsKey: "tags" },
    ],
    cols: [
      { key: "platName", label: "微信小程序名称" },
      { key: "intro", label: "小程序简介" },
      { key: "credit", label: "统一社会信用代码" },
      { key: "name", label: "主体名称" },
      { key: "appId", label: "小程序ID" },
      { key: "category", label: "小程序分类" },
      { key: "org", label: "登记机关" },
      { key: "address", label: "注册地址" },
      { key: "tag", label: "业务子库" },
    ],
    addFields: [
      { key: "platName", label: "微信小程序名称", req: true },
      { key: "category", label: "小程序分类", kind: "select", opts: MINI_CATS },
      { key: "name", label: "主体名称", req: true, lookup: "name" },
      { key: "intro", label: "小程序简介" },
      { key: "appId", label: "小程序ID", req: true },
      { key: "credit", label: "统一社会信用代码", lookup: "credit" },
      { key: "org", label: "登记机关", kind: "select", opts: SM_ORGS },
      { key: "address", label: "注册地址", disabled: true, placeholder: "自动回填" },
      { key: "tag", label: "业务子库" },
    ],
  },
  app: {
    dataType: "APP",
    addTitle: "新增APP主体",
    filters: [
      { id: "q-plat", label: "app名称", key: "platName", kind: "input" },
      { id: "q-name", label: "主体名称", key: "name", kind: "input" },
      { id: "q-cat", label: "APP分类", key: "category", kind: "select", opts: APP_CATS },
      { id: "q-paid", label: "是否收费", key: "paid", kind: "select", opts: YN_OPTS },
      { id: "q-store", label: "所属应用商店", key: "store", kind: "select", opts: APP_STORES },
      { id: "q-credit", label: "统一社会信用代码", key: "credit", kind: "input" },
      { id: "q-org", label: "登记机关", key: "org", kind: "select", opts: SM_ORGS },
      { id: "q-addr", label: "注册地址", key: "address", kind: "input" },
      { id: "q-ind", label: "行业类型", key: "industry", kind: "select", opts: INDUSTRIES },
      { id: "q-tag", label: "业务子库", key: "tag", kind: "select", optsKey: "tags" },
    ],
    cols: [
      { key: "platName", label: "app名称" },
      { key: "path", label: "app下载地址" },
      { key: "credit", label: "统一社会信用代码" },
      { key: "name", label: "主体名称" },
      { key: "version", label: "版本信息" },
      { key: "category", label: "APP分类" },
      { key: "org", label: "登记机关" },
      { key: "address", label: "注册地址" },
      { key: "paid", label: "是否收费" },
      { key: "downloads", label: "下载次数" },
      { key: "store", label: "所属应用商店" },
    ],
    addFields: [
      { key: "platName", label: "app名称", req: true },
      { key: "path", label: "app下载地址", req: true },
      { key: "name", label: "主体名称", req: true, lookup: "name" },
      { key: "version", label: "版本信息" },
      { key: "category", label: "APP分类", kind: "select", opts: APP_CATS },
      { key: "credit", label: "统一社会信用代码", lookup: "credit" },
      { key: "org", label: "登记机关", kind: "select", opts: SM_ORGS },
      { key: "address", label: "注册地址", disabled: true, placeholder: "自动回填" },
      { key: "tag", label: "业务子库" },
      { key: "paid", label: "是否收费", kind: "select", opts: YN_OPTS },
      { key: "downloads", label: "下载次数" },
      { key: "store", label: "所属应用商店", kind: "select", opts: APP_STORES },
      { key: "ip", label: "IP地址" },
      { key: "industry", label: "行业类型", kind: "select", opts: INDUSTRIES },
      { key: "companyType", label: "公司类型", kind: "select", opts: COMPANY_TYPES, disabled: true },
    ],
  },
};

const DEFAULT_SUBJECT_EDITS = {
  S11: [
    { field: "主体名称", before: "拼多多", after: "拼夕夕", editor: "吴小小", time: "2025.11.12" },
    { field: "主营业务", before: "网络交易", after: "网络交易、线下交易", editor: "吴小小", time: "2025.11.12" },
    { field: "域名链接", before: "www.pdd.com", after: "www.pxx.com", editor: "吴小小", time: "2025.11.12" },
    { field: "公司地址", before: "福建省仓山区盖山路21号", after: "福建省仓山区盖山路25号", editor: "吴小小", time: "2025.11.11" },
  ],
  S05: [
    { field: "企业名称", before: "福建多多有限公司", after: "福建省大鼓有限公司", editor: "吴小小", time: "2025.11.12" },
    { field: "法人", before: "吴小小", after: "吴大大", editor: "吴小小", time: "2025.11.12" },
  ],
};

const ENT_ORGS = ["福州市市场监督管理局", "漳州市市场监督管理局", "厦门市市场监督管理局"];
const ENT_TYPES = ["内资企业", "外资企业", "个体工商户", "有限责任公司(自然人投资或控股)"];
const ENT_STATUS = ["存续", "注销", "吊销"];

function subjectRegion(s) {
  if (s.region) return s.region;
  if (s.area) return "福建省福州市" + s.area;
  return "福建省福州市鼓楼区";
}

function subjectEditsOf(id) {
  const saved = loadState().subjectEdits;
  if (saved && Array.isArray(saved[id])) return saved[id];
  return (DEFAULT_SUBJECT_EDITS[id] || []).slice();
}

function pushSubjectEdits(id, rows) {
  if (!rows.length) return;
  const map = { ...(loadState().subjectEdits || {}) };
  map[id] = rows.concat(subjectEditsOf(id));
  saveState({ subjectEdits: map });
}

function subjectViewTitle(type) {
  const map = {
    platform: "电商平台主体",
    seller: "电商平台内经营者",
    live: "直播间运营者主体",
    site: "网站主体",
    mp: "公众号主体",
    mini: "小程序主体",
    app: "APP主体",
    liveplat: "直播平台主体",
    ent: "企业主体",
  };
  return map[type] || typeName(type);
}

function subjectViewFields(s, editing) {
  if (s.type === "ent") {
    return [
      { key: "name", label: "企业名称", val: s.name || "" },
      { key: "credit", label: "统一社会信用代码", val: s.credit || "" },
      { key: "org", label: "登记机关", kind: "select", opts: ENT_ORGS, val: s.org || "" },
      { key: "address", label: "注册地址", val: s.address || "" },
      { key: "entType", label: "企业类型", kind: "select", opts: ENT_TYPES, val: s.entType || "" },
      { key: "bizStatus", label: "经营状态", kind: "select", opts: ENT_STATUS, val: s.bizStatus || "" },
      { key: "legal", label: "法人", val: s.legal || "" },
      { key: "platGrade", label: "电商平台分级分类", val: s.platGrade || "—", readonly: true },
      { key: "sellerGrade", label: "电商平台内经营者分级分类", val: s.sellerGrade || "—", readonly: true },
    ];
  }
  if (s.type === "live") {
    return [
      { key: "platName", label: "所属平台", kind: "select", opts: LIVE_PLATS, val: s.platName || "" },
      { key: "liveName", label: "直播间名称", val: s.liveName || "" },
      { key: "path", label: "直播间地址", val: s.path || "" },
      { key: "shopUrl", label: "关联网店地址", val: s.shopUrl || "" },
      { key: "name", label: "主体名称", val: s.name || "" },
      { key: "credit", label: "统一社会信用代码", val: s.credit || "" },
      { key: "address", label: "登记地址", val: s.address || "" },
      { key: "station", label: "管辖所", val: s.station || "" },
      { key: "region", label: "所在区域", val: subjectRegion(s) || STATION_REGION[s.station] || "", readonly: true },
      { key: "product", label: "经营产品类别", val: s.product || "" },
      { key: "localProduct", label: "是否为本地产品", kind: "select", opts: ["是", "否"], val: s.localProduct || "" },
      { key: "fans", label: "粉丝数量", val: s.fans || "" },
      { key: "sellGoods", label: "是否带货", kind: "select", opts: ["是", "否"], val: s.sellGoods || "" },
      { key: "penalty", label: "行政处罚数量", val: s.penalty || "" },
      { key: "abnormal", label: "经营异常情况", val: s.abnormal || "" },
      { key: "localPlat", label: "是否为本地直播平台", kind: "select", opts: ["是", "否"], val: s.localPlat || "" },
      { key: "tag", label: "业务子库", val: s.tag || "" },
      { key: "inStdLib", label: "是否在市监标准库", kind: "select", opts: ["是", "否"], val: s.inStdLib || "是" },
    ];
  }
  if (s.type === "liveplat") {
    return [
      { key: "platName", label: "平台名称", val: s.platName || "" },
      { key: "name", label: "运营主体名称", val: s.name || "" },
      { key: "credit", label: "统一社会信用代码", val: s.credit || "" },
      { key: "platType", label: "平台类型", kind: "select", opts: LIVEPLAT_TYPES, val: s.platType || "" },
      { key: "bizScope", label: "主要业务范围", val: s.bizScope || "" },
      { key: "accessStatus", label: "接入状态", kind: "select", opts: LIVEPLAT_ACCESS, val: s.accessStatus || "" },
      { key: "grade", label: "分类等级", kind: "select", opts: LIVEPLAT_GRADES, val: s.grade || "" },
      { key: "tag", label: "主体标签", val: s.tag || "" },
      { key: "updated", label: "更新时间", val: s.updated || "", readonly: true },
    ];
  }
  const prof = SUB_PROFILES[s.type];
  if (prof) {
    return prof.addFields.map((f) => ({
      key: f.key,
      label: f.label,
      kind: f.kind,
      opts: f.opts || (f.optsKey === "stations" ? Object.keys(STATION_REGION) : undefined),
      val: s[f.key] || "",
      readonly: !!f.disabled,
    }));
  }
  const dtype = s.type === "platform"
    ? ["网站", "APP", "小程序", "公众号"]
    : [...new Set(["网站", "APP", "小程序", "公众号", "平台内店铺", "直播间运营者", "企业", "直播平台", s.dataType].filter(Boolean))];
  const platLabel = s.type === "seller" ? "店铺名称" : "平台名称";
  return [
    { key: "dataType", label: "数据类型", kind: "select", opts: dtype, val: s.dataType || "" },
    { key: "platName", label: platLabel, val: s.platName || "" },
    { key: "path", label: "主要登录路径", val: s.path || "" },
    { key: "name", label: "主体名称", val: s.name || "" },
    { key: "credit", label: "统一社会信用代码", val: s.credit || "" },
    { key: "address", label: "登记地址", val: s.address || "" },
    { key: "region", label: "所在区域（省/市/区县）", kind: "select", opts: REGION_OPTS, val: subjectRegion(s) },
    { key: "station", label: "管辖所", val: s.station || "" },
    { key: "product", label: "平台内产品属性", val: s.product || "" },
    { key: "tag", label: "标签", val: s.tag || "" },
  ];
}

const MERGE_FIELD_KEYS = {
  platform: ["platName", "product", "tag"],
  seller: ["product", "tag"],
  site: ["tag"],
  mp: ["tag"],
  mini: ["tag"],
  app: ["tag"],
  live: ["product", "tag"],
};
function isMergeField(type, key) {
  return (MERGE_FIELD_KEYS[type] || []).includes(key);
}
function splitMergeVals(raw) {
  return String(raw || "").split(/[;；、,，]/).map((x) => x.trim()).filter(Boolean);
}
function mergeOriginItems(s, key) {
  const origins = (s.origins && s.origins[key]) || {};
  const fromVal = splitMergeVals(s[key]);
  const keys = [];
  fromVal.concat(Object.keys(origins)).forEach((v) => {
    if (v && keys.indexOf(v) < 0) keys.push(v);
  });
  return keys.map((val) => ({ val, src: origins[val] && origins[val].length ? origins[val] : [] }));
}
function fusedFieldText(s, key) {
  const items = mergeOriginItems(s, key);
  return items.length ? items.map((x) => x.val).join("；") : (s[key] || "—");
}
function mergeSrcLabel(src) {
  if (!src || !src.length) return "";
  const hasProv = src.indexOf("省局") >= 0;
  const hasThird = src.indexOf("第三方机构") >= 0;
  if (hasProv && hasThird) return "省局 · 第三方";
  return src.join(" · ");
}
function mergeSrcClass(src) {
  if (!src || !src.length) return "";
  const hasProv = src.indexOf("省局") >= 0;
  const hasThird = src.indexOf("第三方机构") >= 0;
  if (hasProv && hasThird) return "both";
  if (hasThird) return "third";
  if (hasProv) return "prov";
  return "";
}
function renderMergeChips(s, key) {
  const items = mergeOriginItems(s, key);
  if (!items.length) return "—";
  return `<div class="src-tags">` + items.map((it) => {
    const lab = mergeSrcLabel(it.src);
    return `<span class="src-tag ${mergeSrcClass(it.src)}"><em>${escHtml(it.val)}</em>${lab ? `<i>${escHtml(lab)}</i>` : ""}</span>`;
  }).join("") + `</div>`;
}

function subjectViewCtrl(f, editing) {
  if (f.merge && f.subject && !editing) return renderMergeChips(f.subject, f.key);
  if (f.merge && f.subject && editing) {
    return renderMergeChips(f.subject, f.key);
  }
  const dis = editing && !f.readonly ? "" : "disabled";
  const val = f.val;
  if (f.kind === "select") {
    const opts = f.opts.slice();
    if (val && !opts.includes(val)) opts.unshift(val);
    return `<select id="sv-${f.key}" ${dis}>${opts.map((o) =>
      `<option${o === val ? " selected" : ""}>${o}</option>`).join("")}</select>`;
  }
  return `<input id="sv-${f.key}" ${dis} value="${escAttr(val)}">`;
}

function decorateMergeFields(s, fields) {
  return fields.map((f) => Object.assign({}, f, {
    subject: s,
    merge: isMergeField(s.type, f.key),
    readonly: f.readonly || isMergeField(s.type, f.key),
  }));
}
function renderKvForm(fields, editing, perRow) {
  perRow = perRow || 2;
  let html = "";
  for (let i = 0; i < fields.length; i += perRow) {
    const slice = fields.slice(i, i + perRow);
    const cls = perRow === 3 && slice.length === 3 ? "kv cols3" : slice.length === 1 ? "kv span" : "kv";
    html += `<div class="${cls}">` + slice.map((f) =>
      `<div class="k">${f.label}</div><div class="v">${subjectViewCtrl(f, editing)}</div>`
    ).join("") + `</div>`;
  }
  return `<div class="kv-form">${html}</div>`;
}

function escHtml(s) {
  if (s == null || s === "") return "";
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderKvText(fields, perRow) {
  perRow = perRow || 3;
  let html = "";
  for (let i = 0; i < fields.length; i += perRow) {
    const slice = fields.slice(i, i + perRow);
    const cls = perRow === 3 && slice.length === 3 ? "kv cols3" : slice.length === 1 ? "kv span" : "kv";
    html += `<div class="${cls}">` + slice.map((f) =>
      `<div class="k">${f.label}</div><div class="v">${f.html || escHtml(f.val)}</div>`
    ).join("") + `</div>`;
  }
  return `<div class="kv-form">${html}</div>`;
}

function clueHandleFlow(c) {
  return [
    { op: "派发", org: "福建省市场监督管理局网监处", person: "吴大人", date: "2025.11.11" },
    { op: "收回", org: "福建省市场监督管理局网监处", person: "吴大人", date: "2025.11.12" },
    { op: "派发", org: "福建省市场监督管理局网监处", person: "吴中中", date: "2025.11.13" },
    { op: "派发", org: "福州市市场监管局网监科", person: "吴中中", date: "2025.11.14" },
    { op: c.status === "已办结" ? "处置（已办结）" : c.status === "处置中" ? "处置（处置中）" : "待处置", org: "鼓楼区市场监督管理局", person: "吴小小", date: "2025.11.15" },
  ];
}

function clueDetailPack(c) {
  const jd = c.platName === "京东";
  return {
    ...c,
    regAddr: c.regAddr || ((c.area || "福州市") + "登记住所（演示）"),
    contact: c.contact || (jd ? "0531-88872388" : "0591-83336000"),
    violateType: c.violateType || c.item || "",
    violateShow: c.violateShow || c.item || "",
    law: c.law || "涉嫌违反相关监管规定",
    lawName: c.lawName || "《中华人民共和国电子商务法》",
    lawItem: c.lawItem || "相关条款",
    evidenceUrl: c.evidenceUrl || "",
    monitorSource: c.monitorSource || "XXX监测单位",
    violateCat: c.violateCat || "",
    platCredit: c.platCredit || (c.platName === "淘宝" ? "91330100799655058G" : jd ? "91110307567134916R" : "91110108MA01ABC12X"),
    platAddr: c.platAddr || (jd ? "北京市北京经济技术开发区科创十一街18号院1号楼21F-22" : c.platName === "淘宝" ? "浙江省杭州市余杭区" : "北京市海淀区"),
    platProv: c.platProv || (jd ? "北京市" : c.platName === "淘宝" ? "浙江省" : "北京市"),
    platCity: c.platCity || (jd ? "北京市" : c.platName === "淘宝" ? "杭州市" : "北京市"),
    platDist: c.platDist || (jd ? "北京经济技术开发区" : c.platName === "淘宝" ? "余杭区" : "海淀区"),
    jurProv: c.jurProv || (jd ? "北京市" : "福建省"),
    jurCity: c.jurCity || (jd ? "北京市" : "福州市"),
    jurDist: c.jurDist || (jd ? "北京经济技术开发区" : (c.area || "")),
    handleAdvice: c.handleAdvice || "建议移交",
    flow: clueHandleFlow(c),
  };
}

function renderClueQueryDetail(c) {
  const d = clueDetailPack(c);
  const ev = d.evidenceUrl
    ? `<a href="${escAttr(d.evidenceUrl)}" target="_blank" rel="noopener">${escHtml(d.evidenceUrl)}</a>`
    : "";
  const block = (title, fields) => `<div class="rel-block">
      <h4 class="sec-h">${title}</h4>
      ${renderKvText(fields, 3)}
    </div>`;
  const flow = d.flow.map((f) => `<div class="clue-flow-item">
      <div class="dot"></div>
      <div class="op">${f.op}</div>
      <div class="st">处置状态</div>
      <div class="org">${f.org}</div>
      <div class="who">${f.person}</div>
      <div class="date">${f.date}</div>
    </div>`).join("");
  return `
    ${block("主体信息", [
      { label: "网店名称", val: d.shopName },
      { label: "网店链接", val: d.shopUrl },
      { label: "主体类型", val: d.subjectType },
      { label: "主体名称", val: d.subject },
      { label: "统一社会信用代码", val: d.credit },
      { label: "网站经营者主体注册地", val: d.regAddr },
      { label: "网站经营者主体联系方式", val: d.contact },
    ])}
    ${block("商品信息", [
      { label: "商品名称", val: d.goodsName },
      { label: "商品分类", val: d.goodsCat },
      { label: "商品链接", val: d.goodsUrl },
    ])}
    ${block("疑似违规信息详情", [
      { label: "监测日期", val: d.monitorDate },
      { label: "涉嫌违规类型", val: d.violateType },
      { label: "涉嫌违规表现", val: d.violateShow },
      { label: "涉嫌违反的法律法规", val: d.law },
      { label: "涉嫌违反的法律法规名称", val: d.lawName },
      { label: "涉嫌违反的法律法规条目", val: d.lawItem },
      { label: "佐证文件URL", html: ev },
      { label: "监测范围来源", val: d.monitorSource },
      { label: "监测任务名称", val: d.task === "—" ? "" : d.task },
      { label: "涉嫌违规类别", val: d.violateCat },
    ])}
    ${block("平台信息", [
      { label: "电商平台统一社会信用代码", val: d.platCredit },
      { label: "电商平台名称", val: d.platName },
      { label: "平台所在地详细地址", val: d.platAddr },
      { label: "平台所在地省份", val: d.platProv },
      { label: "平台所在地地市", val: d.platCity },
      { label: "平台所在地区县", val: d.platDist },
    ])}
    ${block("监测信息管辖地（平台所在地或实际经营地）", [
      { label: "省份", val: d.jurProv },
      { label: "地市", val: d.jurCity },
      { label: "区县", val: d.jurDist },
      { label: "办理意见", val: d.handleAdvice },
    ])}
    <h4 class="flow-h">办理信息</h4>
    <div class="clue-flow">${flow}</div>`;
}

function openClueQueryView(id) {
  const c = clueOf(id);
  if (!c) return toast("线索不存在");
  openModal(`
    <div class="modal adj view clue-detail">
      <div class="adj-h">
        <h3>查看</h3>
        <button type="button" class="icon-btn" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="adj-body">${renderClueQueryDetail(c)}</div>
      <div class="adj-foot">
        <button type="button" class="btn-ghost" onclick="closeModal()">关闭</button>
      </div>
    </div>`);
}

function entRelatedBlocks(s) {
  if (s.id === "S24") return [
    { title: "关联电商平台信息", cols: ["序号", "平台名称", "主要登录路径", "管辖所"], rows: [] },
    { title: "关联电商平台内经营者信息", cols: ["序号", "所属平台", "网店名称", "网店地址", "管辖所"], rows: [] },
    { title: "关联网站主体信息", cols: ["序号", "网站名称", "网站地址", "备案号", "登记机关"], rows: [] },
    { title: "关联公众号主体信息", cols: ["序号", "公众号名称", "微信号", "公众号简介", "IP地址"], rows: [] },
    { title: "关联小程序主体信息", cols: ["序号", "微信小程序名称", "小程序简介", "小程序ID", "小程序分类"], rows: [] },
    { title: "关联APP主体信息", cols: ["序号", "APP名称", "APP下载地址", "APP分类", "IP地址"], rows: [] },
  ];
  const shop = (name) => ({ cells: ["美团", name, "www.meituan.12314.com", "盖山市场监督管理所"], linkId: "S02", linkIdx: 1 });
  return [
    {
      title: "关联电商平台信息",
      cols: ["序号", "平台名称", "主要登录路径", "管辖所"],
      rows: [
        { cells: ["7788平台", "www.7788.com", "盖山市场监督管理所"], linkId: "S11", linkIdx: 0 },
        { cells: ["7788平台", "www.7788.com", "盖山市场监督管理所"], linkId: "S11", linkIdx: 0 },
      ],
    },
    {
      title: "关联电商平台内经营者信息",
      cols: ["序号", "所属平台", "网店名称", "网店地址", "管辖所"],
      rows: [shop("沙县小吃（闽江建行店）"), shop("沙县小吃（闽江建行店）")],
    },
    {
      title: "关联网站主体信息",
      cols: ["序号", "网站名称", "网站地址", "备案号", "登记机关"],
      rows: [
        { cells: ["77网站", "www.7788.com", "闽ICP备14008353号-10", "福州市市场监督管理局"], linkId: "S06", linkIdx: 0 },
        { cells: ["77网站", "www.7788.com", "闽ICP备14008353号-10", "福州市市场监督管理局"], linkId: "S06", linkIdx: 0 },
      ],
    },
    {
      title: "关联公众号主体信息",
      cols: ["序号", "公众号名称", "微信号", "公众号简介", "IP地址"],
      rows: [
        { cells: ["77网站", "福建兰兰便利所", "法律咨询导向", "157.12.341.12"], linkId: "S04", linkIdx: 0 },
        { cells: ["77网站", "福建兰兰便利所", "法律信息导向", "157.12.341.12"], linkId: "S04", linkIdx: 0 },
      ],
    },
    {
      title: "关联小程序主体信息",
      cols: ["序号", "微信小程序名称", "小程序简介", "小程序ID", "小程序分类"],
      rows: [
        { cells: ["77网站", "共享洗衣机", "35612151", "建筑业"], linkId: "S07", linkIdx: 0 },
        { cells: ["77网站", "共享洗衣机", "35612151", "建筑业"], linkId: "S07", linkIdx: 0 },
      ],
    },
    {
      title: "关联APP主体信息",
      cols: ["序号", "APP名称", "APP下载地址", "APP分类", "IP地址"],
      rows: [
        { cells: ["77网站", "www.7788.com", "购物比价", "157.12.341.12"], linkId: "S08", linkIdx: 0 },
        { cells: ["77网站", "www.7788.com", "购物比价", "157.12.341.12"], linkId: "S08", linkIdx: 0 },
      ],
    },
  ];
}

function renderRelBlocks(s) {
  return entRelatedBlocks(s).map((block) => {
    const head = block.cols.map((c) => `<th>${c}</th>`).join("");
    const body = block.rows.length
      ? block.rows.map((r, i) => `<tr>
          <td>${i + 1}</td>
          ${r.cells.map((c, j) => r.linkId && j === r.linkIdx
            ? `<td><a href="javascript:void(0)" onclick="openLinkedSubject('${r.linkId}')">${c}</a></td>`
            : `<td>${c}</td>`).join("")}
        </tr>`).join("")
      : `<tr><td colspan="${block.cols.length}" class="empty">暂无关联信息</td></tr>`;
    return `<div class="rel-block">
      <h4 class="sec-h">${block.title}</h4>
      <table class="judge-tbl"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>
    </div>`;
  }).join("");
}

function openLinkedSubject(id) {
  if (!subjectOf(id)) return toast("关联主体不存在");
  window.__subjectViewStack = window.__subjectViewStack || [];
  if (window.__subjectViewId) window.__subjectViewStack.push(window.__subjectViewId);
  openSubjectView(id, { keepStack: true });
}

function backSubjectView() {
  const prev = (window.__subjectViewStack || []).pop();
  if (prev) openSubjectView(prev, { keepStack: true });
  else closeModal();
}
function specials() { return mergeById(SPECIALS, loadState().specials); }
function specialApplies() {
  return mergeById(SPECIAL_APPLIES, loadState().specialApplies || {}).filter((t) => !t.hidden);
}
function clues() {
  return mergeById(CLUES, loadState().clues).filter((c) => !c.hidden && c.status !== "已删除");
}
function packs() { return mergeById(PACKS, loadState().packs); }
function checks() { return mergeById(CHECKS, loadState().checks); }
function dayKey(s) {
  return String(s || "").replace(/\./g, "-").slice(0, 10);
}
function whitelistAll() {
  return mergeById(WHITE_LIST, loadState().whitelist).filter((w) => w.status !== "已删除");
}
function whitelistActive() {
  const today = dayKey(protoToday());
  return whitelistAll().filter((w) => dayKey(w.expire) >= today);
}
function shopWhitelisted(row) {
  const key = shopWhiteKey(row || {});
  if (!key || key === "||") return false;
  return whitelistActive().some((w) => w.key === key);
}
function addShopsToWhitelist(shops, pack) {
  shops = shops || [];
  if (!shops.length) return 0;
  const s = loadState();
  s.whitelist = s.whitelist || {};
  const taken = new Set(whitelistActive().map((w) => w.key));
  let n = 0;
  shops.forEach((shop) => {
    const key = shopWhiteKey(shop);
    if (!key || key === "||" || taken.has(key)) return;
    taken.add(key);
    const id = "W" + Date.now().toString().slice(-6) + n;
    s.whitelist[id] = whiteFromShop(id, shop, {
      packId: pack && pack.id, packName: pack && pack.name, enter: protoToday(),
    });
    n += 1;
  });
  if (n) saveState({ whitelist: s.whitelist });
  return n;
}

function patchRow(bucket, id, patch) {
  const s = loadState();
  s[bucket] = s[bucket] || {};
  s[bucket][id] = { ...(s[bucket][id] || {}), ...patch };
  saveState({ [bucket]: s[bucket] });
}

function subjectTypeLabel(type) {
  return subjectViewTitle(type);
}

function typeName(id) {
  return (MODEL_TYPES.find((t) => t.id === id) || SUBJECT_TYPES.find((t) => t.id === id) || { name: id }).name;
}

function levelChip(lv) {
  const map = { A: "chip-a", B: "chip-b", C: "chip-c", D: "chip-d" };
  return `<span class="chip ${map[lv] || ""}">${lv}级</span>`;
}
function deadlineChip(v) {
  if (v === "超期") return `<span class="chip chip-d">超期</span>`;
  if (v === "临期") return `<span class="chip chip-c">临期</span>`;
  return `<span class="chip chip-time">正常</span>`;
}
function statusChip(st) {
  if (["使用中", "进行中", "当前月", "待处置", "待办理"].includes(st)) return `<span class="chip chip-ok">${st}</span>`;
  if (["已完成", "已办结", "已办理", "已检查", "通过"].includes(st)) return `<span class="chip chip-a">${st}</span>`;
  if (["待检查", "未完成", "处置中", "未检查", "未启用", "未派发", "未指派"].includes(st)) return `<span class="chip chip-d">${st}</span>`;
  if (["无法检查", "不通过", "D"].includes(st)) return `<span class="chip chip-d">${st}</span>`;
  return `<span class="chip chip-wait">${st}</span>`;
}

function statsBar(type) {
  const rows = results().filter((r) => !type || r.type === type);
  const n = (lv) => rows.filter((r) => r.level === lv).length;
  const pending = rows.filter((r) => r.pending).length;
  return `
    <section class="storage levels">
      <div><div class="k">A 级主体</div><div class="v">${n("A")} <em>户</em></div></div>
      <div><div class="k">B 级主体</div><div class="v">${n("B")} <em>户</em></div></div>
      <div><div class="k">C 级主体</div><div class="v">${n("C")} <em>户</em></div></div>
      <div><div class="k">D 级主体</div><div class="v">${n("D")} <em>户</em></div></div>
      <div><div class="k">调级中</div><div class="v">${pending} <em>户</em></div></div>
    </section>`;
}

function assetPrefix() {
  return location.pathname.includes("/pages/") ? "../" : "";
}
function page(file) {
  const p = assetPrefix();
  if (file === "index.html") return p ? "../index.html" : "index.html";
  return p ? file : "pages/" + file;
}
function isEmbed() {
  return qs("embed") === "1";
}
function toast(msg) {
  let el = document.getElementById("proto-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "proto-toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
}

function headerBar() {
  return `
    <header class="top">
      <div class="crumb" id="crumb"></div>
    </header>`;
}

const NAV_TREE = [
  {
    id: "stats-grade", label: "统计分析", icon: "fa-chart-column", href: "stats.html",
  },
  {
    id: "g-models", label: "分级分类模型管理", icon: "fa-sliders",
    children: [
      { id: "model-platform", label: "电商平台", href: "model.html?type=platform" },
      { id: "model-seller", label: "平台内经营者", href: "model.html?type=seller" },
      { id: "model-live", label: "直播间运营者", href: "model.html?type=live" },
    ],
  },
  {
    id: "g-results", label: "分级分类结果", icon: "fa-layer-group",
    children: [
      { id: "result-platform", label: "电商平台", href: "index.html?type=platform" },
      { id: "result-seller", label: "平台内经营者", href: "index.html?type=seller" },
      { id: "result-live", label: "直播间运营者", href: "index.html?type=live" },
      {
        id: "g-approve", label: "调级审批",
        children: [
          { id: "approve-todo", label: "待办理", href: "approve.html?tab=todo" },
          { id: "approve-done", label: "已办理", href: "approve.html?tab=done" },
        ],
      },
    ],
  },
  {
    id: "g-live", label: "直播监测", icon: "fa-video",
    children: [
      { id: "live-regular", label: "常规监测", href: "live-monitor.html?view=regular" },
      { id: "live-special", label: "专项监测", href: "live-monitor.html?view=special" },
      { id: "live-products", label: "商品监测结果", href: "live-monitor.html?view=products" },
    ],
  },
  {
    id: "g-clue", label: "违法违规线索", icon: "fa-flag",
    children: [
      {
        id: "g-clue-handle", label: "线索处理",
        children: [
          { id: "clue-todo", label: "待处理", href: "clues.html?view=todo" },
          { id: "clue-done", label: "已处理", href: "clues.html?view=done" },
        ],
      },
      { id: "clue-query", label: "线索查询", href: "clues.html?view=query" },
      { id: "clue-copy", label: "线索抄送查询", href: "clues.html?view=copy" },
    ],
  },
  {
    id: "g-special", label: "专项监测", icon: "fa-bullseye",
    children: [
      { id: "special-query", label: "查询", href: "special.html" },
      { id: "special-apply", label: "申请", href: "special-apply.html" },
    ],
  },
  {
    id: "g-inspect", label: "检查任务管理", icon: "fa-clipboard-check",
    children: [
      { id: "inspect-pack", label: "任务派发", href: "inspect.html" },
      { id: "inspect-white", label: "抽查白名单", href: "inspect-whitelist.html" },
      {
        id: "g-inspect-task", label: "检查任务",
        children: [
          { id: "inspect-todo", label: "待检查", href: "inspect-list.html?view=todo" },
          { id: "inspect-done", label: "已检查", href: "inspect-list.html?view=done" },
        ],
      },
    ],
  },
  {
    id: "g-subject", label: "主体库", icon: "fa-building",
    children: [
      { id: "sub-platform", label: "电商平台", href: "subjects.html?type=platform" },
      { id: "sub-seller", label: "平台内经营者", href: "subjects.html?type=seller" },
      {
        id: "g-other", label: "其他网络经营主体",
        children: [
          { id: "sub-site", label: "网站", href: "subjects.html?type=site" },
          { id: "sub-mp", label: "公众号", href: "subjects.html?type=mp" },
          { id: "sub-mini", label: "小程序", href: "subjects.html?type=mini" },
          { id: "sub-app", label: "APP", href: "subjects.html?type=app" },
        ],
      },
      { id: "sub-liveplat", label: "直播平台", href: "subjects.html?type=liveplat" },
      { id: "sub-live", label: "直播间运营者", href: "subjects.html?type=live" },
      { id: "sub-ent", label: "企业", href: "subjects.html?type=ent" },
    ],
  },
];

function navHref(href) {
  const [file, query] = href.split("?");
  const base = page(file);
  return query ? `${base}?${query}` : base;
}

function renderNav(nodes, depth) {
  return nodes.map((n) => {
    if (n.children) {
      const ico = n.icon ? `<i class="fa-solid ${n.icon} nav-ico"></i>` : "";
      return `<div class="nav-group${navGroupOpen(n.id) ? " open" : ""}" data-fold="${n.id}">
        <button type="button" class="nav-h" data-depth="${depth}">
          <span class="nav-h-main">${ico}<span>${n.label}</span></span>
          <i class="fa-solid fa-chevron-right chev"></i>
        </button>
        <div class="nav-sub">${renderNav(n.children, depth + 1)}</div>
      </div>`;
    }
    return `<a class="leaf" data-nav="${n.id}" data-depth="${depth}" href="${navHref(n.href)}" target="_top" onclick="return goNav(this, event)">${n.icon ? `<i class="fa-solid ${n.icon} nav-ico"></i>` : ""}<span>${n.label}</span></a>`;
  }).join("");
}

function leafFromUrl(href) {
  const url = new URL(href, location.href);
  const path = url.pathname.replace(/\\/g, "/");
  const t = url.searchParams.get("type");
  const tab = url.searchParams.get("tab");
  const view = url.searchParams.get("view");
  const id = url.searchParams.get("id");
  if (path.includes("live-monitor")) {
    if (view === "special") return "live-special";
    if (view === "products") return "live-products";
    return "live-regular";
  }
  if (path.includes("stats.html")) return "stats-grade";
  if (path.includes("special-apply")) return "special-apply";
  if (path.includes("special-import") || path.includes("special-detail") || path.includes("special.html")) return "special-query";
  if (path.includes("inspect-list")) return view === "done" ? "inspect-done" : "inspect-todo";
  if (path.includes("inspect-task")) {
    const from = url.searchParams.get("from");
    if (from === "done") return "inspect-done";
    if (from === "todo") return "inspect-todo";
    const ck = id ? checkOf(id) : null;
    if (ck && (ck.status === "已检查" || ck.status === "无法检查")) return "inspect-done";
    return "inspect-todo";
  }
  if (path.includes("inspect-whitelist")) return "inspect-white";
  if (path.includes("inspect-pack") || path.includes("inspect.html")) return "inspect-pack";
  if (path.includes("clue-detail")) {
    const from = url.searchParams.get("from");
    if (from === "query") return "clue-query";
    if (from === "copy") return "clue-copy";
    if (from === "done") return "clue-done";
    return "clue-todo";
  }
  if (path.includes("clues.html")) {
    if (view === "query") return "clue-query";
    if (view === "copy") return "clue-copy";
    if (view === "done") return "clue-done";
    return "clue-todo";
  }
  if (path.includes("approve")) return tab === "done" ? "approve-done" : "approve-todo";
  if (path.includes("subject")) return "sub-" + (t || (id && subjectOf(id) && subjectOf(id).type) || "platform");
  if (path.includes("model")) {
    const m = id ? modelOf(id) : null;
    return "model-" + (t || (m && m.type) || "platform");
  }
  if (path.includes("result-detail")) {
    const r = id ? resultOf(id) : null;
    return "result-" + ((r && r.type) || "platform");
  }
  return "result-" + (t || "platform");
}

function shellStart(opts) {
  opts = opts || {};
  window.__navLeaf = leafFromUrl(location.href);
  if (isEmbed()) {
    document.body.classList.add("embed");
    return `${headerBar()}<div class="page">`;
  }
  const mainInner = opts.framed
    ? `<div class="main framed"><div class="page frame-page">`
    : `<div class="main">${headerBar()}<div class="page">`;
  return `
  <aside class="side">
    <div class="brand">
      <div class="seal">分</div>
      <div>
        <div class="org">福州市市场监督管理局</div>
        <div class="sys">网监分级分类工作台</div>
      </div>
    </div>
    <nav>${renderNav(NAV_TREE, 0)}</nav>
    <div class="side-foot">
      <button type="button" class="side-reset" onclick="resetDemo()">重置演示数据</button>
      <div class="who">
        <span class="avatar">李</span>
        <div><b>李监管</b><small>网监科 · 鼓楼分局</small></div>
      </div>
    </div>
  </aside>
  ${mainInner}`;
}
const NAV_SCROLL_KEY = "fz-wj-grade-nav-scroll";
const NAV_FOLD_KEY = "fz-wj-grade-nav-fold";

function loadNavFold() {
  try {
    const raw = sessionStorage.getItem(NAV_FOLD_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function navGroupOpen(id) {
  const map = loadNavFold();
  if (!map) return true;
  if (!(id in map)) return true;
  return map[id] === true;
}
function saveNavFold() {
  const map = {};
  document.querySelectorAll(".side .nav-group[data-fold]").forEach((g) => {
    map[g.getAttribute("data-fold")] = g.classList.contains("open");
  });
  try { sessionStorage.setItem(NAV_FOLD_KEY, JSON.stringify(map)); } catch {}
}

function saveNavScroll() {
  const nav = document.querySelector(".side nav");
  if (!nav) return;
  try { sessionStorage.setItem(NAV_SCROLL_KEY, String(nav.scrollTop)); } catch {}
}

function restoreNavScroll(nav) {
  let y = 0;
  try { y = Number(sessionStorage.getItem(NAV_SCROLL_KEY) || 0); } catch {}
  if (!y) return;
  const apply = () => { nav.scrollTop = y; };
  apply();
  requestAnimationFrame(apply);
}

function goNav(a, ev) {
  saveNavFold();
  saveNavScroll();
  return true;
}

function expandNavToLeaf(nav, leaf) {
  const on = nav.querySelector(`a.leaf[data-nav="${leaf}"]`);
  if (!on) return;
  let p = on.parentElement;
  while (p && p !== nav) {
    if (p.classList.contains("nav-group")) p.classList.add("open");
    p = p.parentElement;
  }
}

function initSideNav(leaf) {
  const nav = document.querySelector(".side nav");
  if (!nav) return;
  nav.querySelectorAll("a.leaf").forEach((a) => {
    a.classList.toggle("on", a.getAttribute("data-nav") === leaf);
  });
  expandNavToLeaf(nav, leaf);
  nav.querySelectorAll(".nav-h").forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "1";
    btn.addEventListener("click", () => {
      btn.parentElement.classList.toggle("open");
      saveNavFold();
    });
  });
  if (!nav.dataset.scrollBound) {
    nav.dataset.scrollBound = "1";
    nav.addEventListener("scroll", saveNavScroll, { passive: true });
  }
  restoreNavScroll(nav);
}
function shellEnd() {
  const leaf = window.__navLeaf;
  queueMicrotask(() => initSideNav(leaf));
  if (isEmbed()) return `</div><div id="modal-root"></div>`;
  return `</div></div><div id="modal-root"></div>`;
}
function markNav(href) {
  initSideNav(leafFromUrl(href || location.href));
}
window.addEventListener("pagehide", () => { saveNavFold(); saveNavScroll(); });

function openModal(html) {
  document.getElementById("modal-root").innerHTML =
    `<div class="overlay" onclick="if(event.target===this)closeModal()">${html}</div>`;
}
function closeModal() {
  window.__subjectViewStack = [];
  const root = document.getElementById("modal-root");
  if (root) root.innerHTML = "";
}

function resultOf(id) { return results().find((r) => r.id === id); }
function approvalOf(id) { return approvals().find((a) => a.id === id); }
function clueOf(id) { return clues().find((c) => c.id === id); }
function packOf(id) { return packs().find((p) => p.id === id); }
function checkOf(id) { return checks().find((k) => k.id === id); }
function modelOf(id) { return models().find((m) => m.id === id); }
function subjectOf(id) { return subjects().find((s) => s.id === id); }

function manualFlag(r) {
  return r.mode === "人工调级" ? "是" : "否";
}

function fmtDotDate(d) {
  return (d || "").replace(/-/g, ".");
}

function sellerJudgeRows() {
  return [
    { l1: "企业基本状况", l1span: 2, l2: "资质类", l2span: 2, result: "营业执照状态：正常", score: 0 },
    { result: "许可证状态：正常", score: 0 },
    { l1: "企业监管信息", l1span: 4, l2: "行政处罚", result: "3年内行政处罚次数：5次", score: 10 },
    { l2: "经营异常", result: "3年内列异次数：3次", score: 10 },
    { l2: "投诉举报", result: "一年内12315平台投诉次数：3次", score: 10 },
    { l2: "网络监测", result: "一年内网络交易监测发现涉嫌违法违规线索：5条", score: 10 },
    { l1: "企业运营状况", l1span: 3, l2: "网络交易平台", result: "平台性质：本地电商平台", score: 0 },
    { l2: "网店经营规模", result: "当年度电商销售额：1500万元", score: 10 },
    { l2: "经营产品类型", result: "经营包含：重点风险产品", score: 20 },
  ];
}

function judgeBlocks(r) {
  if (r.type === "live") {
    const mcn = r.mcn && r.mcn !== "未签约" ? "是（" + r.mcn + "）" : "否";
    return [
      { lv: "一级指标", rows: [["直播间基本状况", "资质类：营业执照 / 许可证", "已匹配主体库"]] },
      { lv: "二级指标", rows: [
        ["直播间监管信息", "行政处罚 / 经营异常 / 投诉举报 / 网络监测", "按主体库与监测数据判定"],
        ["直播间运营状况", "开播频率 / MCN / 粉丝 / 销售额 / 产品类型", (r.fans || "—") + " · 签约MCN：" + mcn],
      ]},
    ];
  }
  return [
    { lv: "一级指标", rows: [["平台性质", "是否商品交易平台", "是"]] },
    { lv: "二级指标", rows: [["平台内产品属性", "是否经营重点产品：食品、药品", "是"]] },
    { lv: "三级指标", rows: [
      ["经营风险1", "年投诉举报量", "100 < 202条 < 300"],
      ["经营风险2", "无需判定", "无"],
    ]},
  ];
}

function escAttr(s) {
  return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function judgeFoot(r, extra) {
  extra = extra || {};
  const lv = extra.level || r.sysLevel;
  const mode = extra.modeText || "自动评定";
  const date = extra.date || "2025.11.11";
  const lvText = extra.withJi === false ? lv : lv + "级";
  return `<div class="judge-foot">
      <span>评定时间：${date}</span>
      <span>分级结果：${lvText}（${mode}）</span>
    </div>`;
}

function renderScoreJudgeTable(r, rows, totalText, opts) {
  opts = opts || {};
  const col3 = opts.col3 || "判定结果";
  const editable = !!opts.editable;
  let i = 0;
  const body = rows.map((row) => {
    const idx = i++;
    const l1 = row.l1 ? `<td class="name" rowspan="${row.l1span || 1}">${row.l1}</td>` : "";
    const l2 = row.l2 ? `<td rowspan="${row.l2span || 1}">${row.l2}</td>` : "";
    const val = row.result;
    const cell = editable
      ? `<td class="judge-val" data-idx="${idx}" data-val="${escAttr(val)}">${val}</td>`
      : `<td>${val}</td>`;
    return `<tr>${l1}${l2}${cell}<td class="score">${row.score}</td></tr>`;
  }).join("");
  return `
    <table class="judge-tbl score-tbl">
      <thead><tr><th>一级指标</th><th>二级指标</th><th>${col3}</th><th>得分</th></tr></thead>
      <tbody>
        ${body}
        <tr class="sum"><td colspan="3">合计</td><td class="score">${totalText}</td></tr>
      </tbody>
    </table>
    ${judgeFoot(r, opts)}`;
}

function renderJudgeTable(r) {
  if (r.type === "seller") return `<h2 class="sec-h">等级评定结果</h2>` + renderScoreJudgeTable(r, sellerJudgeRows(), "70分", { editable: true, withJi: false });
  const blocks = judgeBlocks(r);
  let i = 0;
  const body = blocks.map((b) => {
    const head = `<tr class="cat"><th>${b.lv}</th><th>判定内容</th><th>判定结果</th></tr>`;
    const rows = b.rows.map((row) => {
      const idx = i++;
      const val = row[2];
      return `<tr><td class="name">${row[0]}</td><td>${row[1]}</td><td class="judge-val" data-idx="${idx}" data-val="${escAttr(val)}">${val}</td></tr>`;
    }).join("");
    return head + rows;
  }).join("");
  return `
    <h2 class="sec-h">等级评定结果</h2>
    <table class="judge-tbl">
      <tbody>${body}</tbody>
    </table>
    ${judgeFoot(r, { withJi: false })}`;
}

function sellerViewRows() {
  return [
    { l1: "企业基本状况", l1span: 2, l2: "资质类", l2span: 2, result: "营业执照正常", score: 0 },
    { result: "许可证正常", score: 0 },
    { l1: "企业监管信息", l1span: 4, l2: "行政处罚", result: "3年内行政处罚5次", score: 10 },
    { l2: "经营异常", result: "3年内列异次数3次", score: 10 },
    { l2: "投诉举报", result: "一年内12315平台投诉3次", score: 10 },
    { l2: "网络监测", result: "一年内网络交易监测发现涉嫌违法违规线索5条", score: 10 },
    { l1: "企业运营状况", l1span: 3, l2: "网络交易平台", result: "本地电商平台", score: 0 },
    { l2: "网店经营规模", result: "当年度电商销售额 1500万元", score: 10 },
    { l2: "经营产品类型", result: "经营包含：食品、药品、医疗器械、化妆品等风险产品", score: 20 },
  ];
}

function liveViewRows(r) {
  const signed = r.mcn && r.mcn !== "未签约";
  const unmatched = !r.credit;
  const high = (r.level || r.sysLevel) === "D" || (Number(r.score) >= 80);
  if (unmatched) {
    return [
      { l1: "直播间基本状况", l1span: 2, l2: "资质类", l2span: 2, result: "营业执照：未匹配到主体库", score: 100 },
      { result: "许可证：未匹配到主体库", score: 100 },
      { l1: "直播间监管信息", l1span: 4, l2: "行政处罚", result: "未匹配到主体库", score: 60 },
      { l2: "经营异常", result: "未匹配到主体库", score: 60 },
      { l2: "投诉举报", result: "未匹配到主体库", score: 60 },
      { l2: "网络监测", result: "一年内涉嫌违法违规线索=0", score: 0 },
      { l1: "直播间运营状况", l1span: 6, l2: "主体属性", l2span: 2, result: "近30天开播 1–10 次", score: 50 },
      { result: "是否签约MCN机构：否", score: 80 },
      { l2: "直播间规模", l2span: 2, result: r.fans ? "直播间粉丝数 " + r.fans : "1万至10万", score: 50 },
      { result: "关联网店销售额：无销售数据", score: 30 },
      { l2: "经营产品类型", l2span: 2, result: "是否经营风险产品：否", score: 20 },
      { result: "是否本地企业生产产品：否", score: 20 },
    ];
  }
  if (high) {
    return [
      { l1: "直播间基本状况", l1span: 2, l2: "资质类", l2span: 2, result: "营业执照过期", score: 60 },
      { result: "许可证过期", score: 50 },
      { l1: "直播间监管信息", l1span: 4, l2: "行政处罚", result: "1≤3年内行政处罚次数≤2", score: 80 },
      { l2: "经营异常", result: "当前已被列异且3年内列异次数＜2次", score: 70 },
      { l2: "投诉举报", result: "1次≤一年内12315平台投诉≤10次", score: 60 },
      { l2: "网络监测", result: "1≤一年内涉嫌违法违规线索≤5", score: 50 },
      { l1: "直播间运营状况", l1span: 6, l2: "主体属性", l2span: 2, result: "10＜近30天开播", score: 80 },
      { result: signed ? "是否签约MCN机构：是" : "是否签约MCN机构：否", score: signed ? 30 : 80 },
      { l2: "直播间规模", l2span: 2, result: r.fans ? "直播间粉丝数 " + r.fans : "1万至10万", score: 50 },
      { result: "无销售数据", score: 30 },
      { l2: "经营产品类型", l2span: 2, result: "是否经营风险产品：是", score: 100 },
      { result: "是否本地企业生产产品：否", score: 20 },
    ];
  }
  return [
    { l1: "直播间基本状况", l1span: 2, l2: "资质类", l2span: 2, result: "营业执照正常", score: 0 },
    { result: "许可证正常", score: 10 },
    { l1: "直播间监管信息", l1span: 4, l2: "行政处罚", result: "3年内行政处罚次数=0", score: 0 },
    { l2: "经营异常", result: "当前未被列异且3年内未被列异", score: 0 },
    { l2: "投诉举报", result: "一年内12315平台投诉=0", score: 0 },
    { l2: "网络监测", result: "一年内涉嫌违法违规线索=0", score: 0 },
    { l1: "直播间运营状况", l1span: 6, l2: "主体属性", l2span: 2, result: "近30天开播 1–10 次", score: 50 },
    { result: signed ? "是否签约MCN机构：是" : "是否签约MCN机构：否", score: signed ? 30 : 80 },
    { l2: "直播间规模", l2span: 2, result: r.fans ? "直播间粉丝数 " + r.fans : "100万至1000万", score: 50 },
    { result: "0≤当年度电商销售额≤10万", score: 10 },
    { l2: "经营产品类型", l2span: 2, result: "是否经营风险产品：是", score: 100 },
    { result: "是否本地企业生产产品：是", score: 100 },
  ];
}

function judgeHistory(r) {
  return [
    { id: "h1", date: "2025.11.11", mode: r.mode === "人工调级" ? "人工调整" : "自动评定", level: r.level },
    { id: "h2", date: "2025.11.07", mode: "人工调整", level: "B" },
    { id: "h3", date: "2025.01.31", mode: "自动评定", level: "A" },
  ];
}

function renderJudgeSnapshot(r, hist) {
  hist = hist || { date: "2025.11.11", mode: "自动评定", level: r.sysLevel };
  const opts = { col3: "三级指标", date: hist.date, modeText: hist.mode, level: hist.level };
  if (r.type === "seller") return renderScoreJudgeTable(r, sellerViewRows(), "70分", opts);
  if (r.type === "live") return renderScoreJudgeTable(r, liveViewRows(r), (r.score != null ? r.score : 22) + "分", opts);
  const html = renderJudgeTable(r);
  return html.replace(/评定时间：2025\.11\.11/, "评定时间：" + hist.date)
    .replace(/分级结果：[^<]+/, "分级结果：" + hist.level + "（" + hist.mode + "）")
    .replace('<h2 class="sec-h">等级评定结果</h2>', "");
}

function renderJudgeViewInner(r, tab, histId) {
  const tabs = `
    <div class="view-tabs">
      <button type="button" class="${tab === "current" ? "on" : ""}" onclick="paintJudgeView('current')">当前评定结果</button>
      <button type="button" class="${tab === "hist" ? "on" : ""}" onclick="paintJudgeView('hist')">历史评定结果</button>
    </div>`;
  let panel = "";
  if (tab === "hist") {
    const list = judgeHistory(r);
    const one = histId ? list.find((h) => h.id === histId) : null;
    if (one) {
      panel = `<p class="spec">回看 ${one.date} 该期评定，不改变当前等级。</p>
        ${renderJudgeSnapshot(r, one)}
        <div class="flt-actions" style="justify-content:flex-start">
          <button type="button" class="btn-ghost" onclick="paintJudgeView('hist')">返回历史列表</button>
        </div>`;
    } else {
      const rows = list.map((h, i) => `<tr>
        <td>${i + 1}</td>
        <td>${h.date}</td>
        <td>${h.mode}</td>
        <td>${h.level}</td>
        <td class="tbl-ops"><a href="javascript:void(0)" onclick="paintJudgeView('hist','${h.id}')">详情</a></td>
      </tr>`).join("");
      panel = `<table class="judge-tbl">
        <thead><tr><th>序号</th><th>评定时间</th><th>评定方式</th><th>评定结果</th><th>操作</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <p class="spec">历史评定可回看往期。点「详情」只查看该期指标，不改变当前等级。</p>`;
    }
  } else {
    const cur = judgeHistory(r)[0];
    panel = renderJudgeSnapshot(r, cur);
  }
  return tabs + `<div class="judge-view-panel">${panel}</div>`;
}

function paintJudgeView(tab, histId) {
  const r = resultOf(window.__judgeViewId);
  const el = document.getElementById("judge-view-root");
  if (!r || !el) return;
  el.innerHTML = renderJudgeViewInner(r, tab || "current", histId);
}

function renderSubjectViewInner(s, tab, editing) {
  tab = tab || "info";
  const readOnly = s.type === "ent";
  editing = !!editing && tab === "info" && !readOnly;
  if (readOnly) {
    return `
    <div class="rel-block" style="margin-top:0">
      <h4 class="sec-h">企业主体信息</h4>
      ${renderKvForm(decorateMergeFields(s, subjectViewFields(s)), false, 3)}
    </div>
    ${renderRelBlocks(s)}`;
  }
  const tabs = `
    <div class="view-tabs">
      <button type="button" class="${tab === "info" ? "on" : ""}" onclick="paintSubjectView('info')">主体信息</button>
      <button type="button" class="${tab === "log" ? "on" : ""}" onclick="paintSubjectView('log')">修改记录</button>
    </div>`;
  if (tab === "log") {
    const list = subjectEditsOf(s.id);
    const rows = list.map((e, i) => `<tr>
      <td>${i + 1}</td>
      <td>${e.field}</td>
      <td>${e.before || "—"}</td>
      <td>${e.after || "—"}</td>
      <td>${e.editor || "—"}</td>
      <td>${e.time || "—"}</td>
    </tr>`).join("") || `<tr><td colspan="6" class="empty">暂无修改记录</td></tr>`;
    return tabs + `<table class="judge-tbl">
      <thead><tr><th>序号</th><th>修改字段</th><th>修改前内容</th><th>修改后内容</th><th>修改人</th><th>修改时间</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  }
  const form = renderKvForm(decorateMergeFields(s, subjectViewFields(s, editing)), editing, s.type === "live" ? 3 : 2);
  const ops = editing
    ? `<div class="sub-view-ops">
        <button type="button" class="btn-ghost" onclick="paintSubjectView('info', false)">取消修改</button>
        <button type="button" class="btn-primary" onclick="saveSubjectEdit()">保存</button>
      </div>`
    : `<button type="button" class="btn-primary" onclick="paintSubjectView('info', true)">开启修改</button>`;
  return tabs + `
    <div class="sub-view-h">
      <h4>${subjectViewTitle(s.type)}</h4>
      ${ops}
    </div>
    ${form}`;
}

function paintSubjectView(tab, editing) {
  const id = window.__subjectViewId;
  const s = subjectOf(id);
  const el = document.getElementById("subject-view-root");
  if (!s || !el) return;
  if (s.type === "ent" || tab === "log") editing = false;
  else if (editing == null) editing = !!window.__subjectViewEditing;
  window.__subjectViewEditing = !!editing && tab !== "log";
  el.innerHTML = renderSubjectViewInner(s, tab, window.__subjectViewEditing);
}

function openSubjectView(id, opts) {
  const s = subjectOf(id);
  if (!s) return toast("主体不存在");
  opts = opts || {};
  if (!opts.keepStack) window.__subjectViewStack = [];
  window.__subjectViewId = id;
  window.__subjectViewEditing = false;
  const back = (window.__subjectViewStack || []).length
    ? `<button type="button" class="btn-ghost" onclick="backSubjectView()">返回</button>`
    : "";
  openModal(`
    <div class="modal adj view${s.type === "ent" ? " ent-view" : s.type === "live" ? " live-view" : ""}">
      <div class="adj-h">
        <h3>查看</h3>
        <div class="adj-h-ops">
          ${back}
          <button type="button" class="icon-btn" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>
      <div class="adj-body">
        <div id="subject-view-root">${renderSubjectViewInner(s, "info", false)}</div>
      </div>
    </div>`);
}

function saveSubjectEdit() {
  const id = window.__subjectViewId;
  const s = subjectOf(id);
  if (!s) return;
  const fields = subjectViewFields(s, true);
  const patch = {};
  const diffs = [];
  fields.forEach((f) => {
    if (f.readonly || isMergeField(s.type, f.key)) return;
    const el = document.getElementById("sv-" + f.key);
    if (!el) return;
    const next = (el.value || "").trim();
    const prev = String(f.val || "");
    if (next !== prev) {
      patch[f.key] = next;
      diffs.push({ field: f.label, before: prev, after: next, editor: "李监管", time: "2026.9.10" });
    }
  });
  if (!diffs.length) return toast("未修改字段");
  patch.updated = "2026.9.10";
  patch.operator = "李监管";
  patchRow("subjects", id, patch);
  pushSubjectEdits(id, diffs);
  window.__subjectViewEditing = false;
  paintSubjectView("info", false);
  toast("已保存修改");
  if (typeof paint === "function") paint();
}

function openJudgeView(id) {
  const r = resultOf(id);
  if (!r) return toast("主体不存在");
  window.__judgeViewId = id;
  openModal(`
    <div class="modal adj view">
      <div class="adj-h">
        <h3>查看</h3>
        <button type="button" class="icon-btn" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="adj-body">
        <div id="judge-view-root">${renderJudgeViewInner(r, "current")}</div>
      </div>
      <div class="adj-foot">
        <button type="button" class="btn-ghost" onclick="closeModal()">关闭</button>
      </div>
    </div>`);
}

function defaultHandleLogs() {
  return [
    { op: "报审批", person: "吴小小", dept: "网络监管处", time: "2025.11.05", nextPerson: "吴中中", nextDept: "网络监管处", remark: "调整为A级，妥否，请领导审批" },
    { op: "退回", person: "吴中中", dept: "网络监管处", time: "2025.11.06", nextPerson: "吴小小", nextDept: "网络监管处", remark: "请说明原因" },
    { op: "报审批", person: "吴小小", dept: "网络监管处", time: "2025.11.07", nextPerson: "吴中中", nextDept: "网络监管处", remark: "接到较多投诉，建议加强监管" },
  ];
}

function adjustToText(a) {
  if (!a) return "—";
  if (a.to === "自动评定" || a.auto) return "调整为自动评定";
  if (a.to === "调整参数" || a.param) return "调整参数";
  return "调整为" + a.to + "级";
}

function renderApproveJudge(r) {
  if (!r) return "";
  if (r.type === "seller") {
    return `<h2 class="sec-h">等级评定结果</h2>` + renderScoreJudgeTable(r, sellerJudgeRows(), "70分", { withJi: false });
  }
  if (r.type === "live") {
    return `<h2 class="sec-h">等级评定结果</h2>` + renderScoreJudgeTable(r, liveViewRows(r), (r.score != null ? r.score : 22) + "分", { col3: "三级指标", withJi: false });
  }
  const blocks = judgeBlocks(r);
  const body = blocks.map((b) => {
    const head = `<tr class="cat"><th>${b.lv}</th><th>判定内容</th><th>判定结果</th></tr>`;
    const rows = b.rows.map((row) => `<tr><td class="name">${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td></tr>`).join("");
    return head + rows;
  }).join("");
  return `
    <h2 class="sec-h">等级评定结果</h2>
    <table class="judge-tbl">
      <tbody>${body}</tbody>
    </table>
    ${judgeFoot(r, { withJi: false, level: r.sysLevel, modeText: "自动评定" })}`;
}

function renderHandleLogTable(a) {
  const logs = (a && a.logs && a.logs.length) ? a.logs : defaultHandleLogs();
  const rows = logs.map((l) => `<tr>
    <td>${l.op}</td>
    <td>${l.person}</td>
    <td>${l.dept}</td>
    <td>${l.time}</td>
    <td>${l.nextPerson}</td>
    <td>${l.nextDept}</td>
    <td>${l.remark || "—"}</td>
  </tr>`).join("");
  return `<table class="judge-tbl log-tbl">
    <thead><tr>
      <th>操作</th><th>办理人</th><th>办理部门</th><th>办理时间</th>
      <th>下一步办理人</th><th>下一步办理部门</th><th>备注</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function renderApproveViewInner(a, opts) {
  opts = opts || {};
  const r = a ? resultOf(a.resultId) : null;
  const handleForm = opts.handle ? `
    <div class="adj-sec">
      <h2 class="sec-h">办理内容</h2>
      <div class="kv-form">
        <div class="kv">
          <div class="k">下一步办理部门</div>
          <div class="v"><select id="h-dept" onchange="fillDeptPeople('h-dept','h-handler')"><option value="">请选择</option>${ADJ_DEPTS.map((d) => `<option>${d.name}</option>`).join("")}</select></div>
          <div class="k">下一步办理人</div>
          <div class="v"><select id="h-handler"><option value="">请选择</option></select></div>
        </div>
        <div class="kv span">
          <div class="k"><span class="req">*</span>操作</div>
          <div class="v">
            <div class="radio-row">
              <label><input type="radio" name="h-op" value="通过" checked> 通过</label>
              <label><input type="radio" name="h-op" value="不通过"> 不通过</label>
              <label><input type="radio" name="h-op" value="退回"> 退回</label>
              <label><input type="radio" name="h-op" value="重新调级"> 重新调级</label>
            </div>
          </div>
        </div>
        <div class="kv span">
          <div class="k">备注</div>
          <div class="v"><input id="h-remark" placeholder="请输入"></div>
        </div>
      </div>
    </div>` : "";
  return `
    ${renderApproveJudge(r)}
    <div class="adj-sec">
      <h2 class="sec-h">调级内容</h2>
      <div class="kv-form">
        <div class="kv span">
          <div class="k"><span class="req">*</span>调级</div>
          <div class="v">${adjustToText(a)}</div>
        </div>
        <div class="kv span">
          <div class="k"><span class="req">*</span>调级原因</div>
          <div class="v">${(a && a.reason) || "—"}</div>
        </div>
      </div>
    </div>
    <div class="adj-sec">
      <h2 class="sec-h">办理记录</h2>
      ${renderHandleLogTable(a)}
    </div>
    ${handleForm}`;
}

function openApproveView(id) {
  const a = approvalOf(id);
  if (!a) return toast("审批不存在");
  openModal(`
    <div class="modal adj view">
      <div class="adj-h">
        <h3>查看</h3>
        <button type="button" class="icon-btn" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="adj-body">${renderApproveViewInner(a)}</div>
      <div class="adj-foot">
        <button type="button" class="btn-ghost" onclick="closeModal()">关闭</button>
      </div>
    </div>`);
}

function openApproveHandle(id) {
  const a = approvalOf(id);
  if (!a) return toast("审批不存在");
  if (!(a.canHandle && a.status === "待办理")) return openApproveView(id);
  window.__handleId = id;
  openModal(`
    <div class="modal adj view">
      <div class="adj-h">
        <h3>办理</h3>
        <button type="button" class="icon-btn" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="adj-body">${renderApproveViewInner(a, { handle: true })}</div>
      <div class="adj-foot">
        <button type="button" class="btn-ghost" onclick="closeModal()">取消</button>
        <button type="button" class="btn-primary" onclick="submitApproveHandle()">提交</button>
      </div>
    </div>`);
}

function submitApproveHandle() {
  const id = window.__handleId;
  const a = approvalOf(id);
  if (!a) return;
  const picked = document.querySelector("input[name=h-op]:checked");
  const op = picked ? picked.value : "";
  const dept = (document.getElementById("h-dept") && document.getElementById("h-dept").value) || "";
  const handler = (document.getElementById("h-handler") && document.getElementById("h-handler").value) || "";
  const remark = ((document.getElementById("h-remark") && document.getElementById("h-remark").value) || "").trim();
  if (!op) return toast("请选择操作");
  if (!confirm("确认提交？")) return;
  const logs = (a.logs && a.logs.length) ? a.logs.slice() : defaultHandleLogs();
  logs.push({
    op, person: "李监管", dept: dept || "网络监管处", time: "2026.09.10",
    nextPerson: handler || "—", nextDept: dept || "—", remark: remark || "—",
  });
  if (op === "通过") {
    if (dept && handler) {
      patchRow("approvals", id, { logs, step: dept, handler, canHandle: false, decision: "通过", status: "待办理" });
      toast("已提交，交下一步办理");
    } else {
      decideApproval(id, "通过", { silent: true, logs });
      return;
    }
  } else if (op === "不通过") {
    decideApproval(id, "不通过", { silent: true, logs });
    return;
  } else if (op === "退回") {
    decideApproval(id, "退回", { silent: true, logs, step: dept || "上一办理人", handler });
    return;
  } else {
    patchRow("approvals", id, { logs, status: "待办理", decision: "重新调级", step: dept || "下一办理人", handler, canHandle: true });
    toast("已重新开放调级");
  }
  location.href = page("approve.html") + "?tab=todo";
}

const ADJ_DEPTS = [
  { name: "网络监管处", people: ["吴小小", "吴中中", "李监管"] },
  { name: "鼓楼区市场监督管理局网监科", people: ["李监管", "陈科员"] },
  { name: "台江区市场监督管理局网监科", people: ["王监管"] },
  { name: "仓山区市场监督管理局网监科", people: ["刘监管"] },
  { name: "福州市市场监督管理局网监科", people: ["宋江良", "王科长"] },
];

function fillDeptPeople(deptId, handlerId) {
  const deptEl = document.getElementById(deptId);
  const sel = document.getElementById(handlerId);
  if (!deptEl || !sel) return;
  const found = ADJ_DEPTS.find((d) => d.name === deptEl.value);
  const people = found ? found.people : [];
  sel.innerHTML = `<option value="">请选择</option>` + people.map((p) => `<option>${p}</option>`).join("");
}

function fillAdjHandlers() {
  fillDeptPeople("a-dept", "a-handler");
}

function onAdjModeChange() {
  const mode = document.getElementById("a-to").value;
  const radios = document.getElementById("a-grade-radios");
  if (radios) radios.hidden = mode !== "grade";
  document.querySelectorAll(".judge-val").forEach((td) => {
    const orig = td.dataset.val || "";
    if (mode === "param") {
      if (!td.querySelector("input")) {
        td.innerHTML = `<input class="judge-edit" value="${escAttr(orig)}">`;
      }
    } else {
      const inp = td.querySelector("input");
      if (inp) td.dataset.val = inp.value;
      td.textContent = td.dataset.val || orig;
    }
  });
}

function collectJudgeEdits() {
  return Array.from(document.querySelectorAll(".judge-val")).map((td) => {
    const inp = td.querySelector("input");
    return inp ? inp.value.trim() : (td.dataset.val || td.textContent || "").trim();
  });
}

function openAdjustById(id) {
  const r = resultOf(id);
  if (!r) return toast("主体不存在");
  if (r.pending) return toast("已有调级申请，请勿重复操作");
  window.__adjustId = id;
  const radios = ["A", "B", "C", "D"].map((x) =>
    `<label><input type="radio" name="a-grade" value="${x}"> 调整为${x}级</label>`
  ).join("");
  const deptOpts = ADJ_DEPTS.map((d) => `<option>${d.name}</option>`).join("");
  openModal(`
    <div class="modal adj">
      <div class="adj-h">
        <h3>调级</h3>
        <button type="button" class="icon-btn" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="adj-body">
        ${renderJudgeTable(r)}
        <div class="adj-sec">
          <h2 class="sec-h">调级内容</h2>
          <div class="kv-form">
            <div class="kv span">
              <div class="k"><span class="req">*</span>调级</div>
              <div class="v adj-mode-row">
                <select id="a-to" class="adj-grade" onchange="onAdjModeChange()">
                  <option value="grade" selected>调整等级</option>
                  <option value="param">调整参数</option>
                </select>
                <div id="a-grade-radios" class="radio-row adj-radios">
                  ${radios}
                  <label><input type="radio" name="a-grade" value="auto"> 调整为自动评定</label>
                </div>
              </div>
            </div>
            <div class="kv span">
              <div class="k"><span class="req">*</span>调级原因</div>
              <div class="v"><input id="a-reason" placeholder="请输入"></div>
            </div>
          </div>
        </div>
        <div class="adj-sec">
          <h2 class="sec-h">办理内容</h2>
          <div class="kv-form">
            <div class="kv span">
              <div class="k"><span class="req">*</span>操作</div>
              <div class="v">
                <div class="radio-row">
                  <label><input type="radio" name="a-op" value="报审批" checked> 报审批</label>
                </div>
              </div>
            </div>
            <div class="kv">
              <div class="k"><span class="req">*</span>下一步办理部门</div>
              <div class="v"><select id="a-dept" onchange="fillAdjHandlers()"><option value="">请选择</option>${deptOpts}</select></div>
              <div class="k"><span class="req">*</span>下一步办理人</div>
              <div class="v"><select id="a-handler"><option value="">请选择</option></select></div>
            </div>
            <div class="kv span">
              <div class="k">备注</div>
              <div class="v"><input id="a-remark" placeholder="请输入"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="adj-foot">
        <button type="button" class="btn-ghost" onclick="closeModal()">取消</button>
        <button type="button" class="btn-primary" onclick="submitAdjust()">提交</button>
      </div>
    </div>`);
  onAdjModeChange();
}
function submitAdjust() {
  const r = resultOf(window.__adjustId);
  if (!r) return;
  const mode = document.getElementById("a-to").value;
  const reason = (document.getElementById("a-reason").value || "").trim();
  const dept = document.getElementById("a-dept").value;
  const handler = document.getElementById("a-handler").value;
  const remark = (document.getElementById("a-remark").value || "").trim();
  if (!mode) return toast("请选择调级");
  if (!reason) return toast("请填写调级原因");
  if (!dept) return toast("请选择下一步办理部门");
  if (!handler) return toast("请选择下一步办理人");
  let to = "";
  let auto = false;
  let judge = [];
  if (mode === "grade") {
    const picked = document.querySelector("input[name=a-grade]:checked");
    if (!picked) return toast("请选择调整等级");
    if (picked.value === r.level) return toast("调级选项不能包含当前等级");
    auto = picked.value === "auto";
    to = auto ? "自动评定" : picked.value;
  } else {
    judge = collectJudgeEdits();
    if (!judge.some((v) => v)) return toast("请填写判定结果");
    to = "调整参数";
  }
  if (!confirm("确认提交调级审批？")) return;
  requestAdjust(r.id, to, reason, auto, { dept, handler, remark, param: mode === "param", judge });
}

function requestAdjust(resultId, to, reason, auto, extra) {
  extra = extra || {};
  const row = resultOf(resultId);
  if (!row) return toast("主体不存在");
  if (row.pending) return toast("已有调级申请，请勿重复操作");
  if (!extra.param && to === row.level && !auto) return toast("调级选项不能包含当前等级");
  const id = "A" + Date.now().toString().slice(-6);
  const s = loadState();
  s.results[resultId] = { ...(s.results[resultId] || {}), pending: true };
  s.approvals[id] = {
    id, resultId, subject: row.name, from: row.level, to: auto ? "自动评定" : to,
    reason, status: "待办理", step: extra.dept || "区局网监科", handler: extra.handler || "",
    remark: extra.remark || "", canHandle: true, created: "2026.09.09", auto: !!auto,
    param: !!extra.param, judge: extra.judge || [],
    applicant: "李监管", typeLabel: subjectTypeLabel(row.type),
    credit: row.credit || "", company: row.company || row.name, org: row.org || "",
  };
  saveState({ results: s.results, approvals: s.approvals });
  toast("已提交调级审批");
  location.href = page("approve.html") + "?tab=todo";
}

function decideApproval(id, decision, extra) {
  extra = extra || {};
  const a = approvalOf(id);
  if (!a || a.status !== "待办理") return toast("该件已办结");
  if (!extra.silent && !confirm(`确认「${decision}」？`)) return;
  const patch = { status: "已办理", decision, done: "2026.09.10", canHandle: false };
  if (extra.logs) patch.logs = extra.logs;
  if (decision === "退回") {
    patch.status = "待办理";
    patch.step = extra.step || "上一办理人";
    if (extra.handler) patch.handler = extra.handler;
    patch.decision = "退回";
    delete patch.done;
    patch.canHandle = true;
    patchRow("approvals", id, patch);
    toast("已退回上一办理人，等级维持不变");
    location.href = page("approve.html") + "?tab=todo";
    return;
  }
  patchRow("approvals", id, patch);
  if (decision === "通过") {
    if (a.param || a.to === "调整参数") {
      patchRow("results", a.resultId, { pending: false });
    } else {
      const auto = a.to === "自动评定" || a.auto;
      patchRow("results", a.resultId, {
        pending: false,
        level: auto ? resultOf(a.resultId).sysLevel : a.to,
        mode: auto ? "自动评定" : "人工调级",
      });
    }
  } else {
    patchRow("results", a.resultId, { pending: false });
  }
  toast(decision === "通过" ? "已调整等级" : "维持原等级");
  location.href = page("approve.html") + "?tab=done";
}

function reopenAdjust(id) {
  if (!confirm("重新开放调级选项并交下一办理人？")) return;
  patchRow("approvals", id, { status: "待办理", decision: "", step: "下一办理人", canHandle: true });
  toast("已重新提交调级");
  location.reload();
}

function clueOpsHtml(c) {
  if (c.status === "已查阅") return `<span class="muted">已查阅，不再处置</span>`;
  if (c.status === "已办结") return `<a class="btn-ghost" href="${page("clue-detail.html")}?id=${c.id}">查看</a>`;
  const parts = [`<a class="btn-ghost" href="${page("clue-detail.html")}?id=${c.id}">查看</a>`];
  if (c.status === "待处置") {
    parts.push(`<button class="btn-go" onclick="openDispatch('${c.id}')">派发</button>`);
    parts.push(`<button class="btn-primary" onclick="openDispose('${c.id}')">处置</button>`);
    parts.push(`<button class="btn-ghost" onclick="reviewClue('${c.id}')">已查阅</button>`);
    if (!c.copied) parts.push(`<button class="btn-ghost" onclick="returnClue('${c.id}')">退回</button>`);
  }
  if (c.status === "处置中" && c.disposeType === "立案") {
    parts.push(`<button class="btn-ok" onclick="openCase('${c.id}')">立案录入</button>`);
  }
  if (c.status === "处置中") {
    parts.push(`<button class="btn-ghost" onclick="openDispatch('${c.id}', true)">转派</button>`);
  }
  return `<div class="clip-ops">${parts.join("")}</div>`;
}
function reviewClue(id) {
  patchRow("clues", id, { status: "已查阅" });
  toast("已查阅，后续不再处置");
  location.reload();
}
function returnClue(id) {
  window.__clueActId = id;
  openModal(`
    <div class="modal adj handle-form">
      <div class="adj-h">
        <h3>退回</h3>
        <button type="button" class="icon-btn" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="adj-body">
        <div class="handle-sec-h"><h4>办理内容</h4></div>
        <div class="kv-form">
          <div class="kv">
            <div class="k"><span class="req">*</span>退回理由</div>
            <div class="v"><input id="r-reason" autocomplete="off" placeholder="请输入"></div>
            <div class="k">备注</div>
            <div class="v"><input id="r-note" autocomplete="off" placeholder="请输入"></div>
          </div>
        </div>
      </div>
      <div class="adj-foot">
        <button type="button" class="btn-ghost" onclick="closeModal()">取消</button>
        <button type="button" class="btn-primary" onclick="confirmReturn()">提交</button>
      </div>
    </div>`);
}
function confirmReturn() {
  const id = window.__clueActId;
  const reason = ((document.getElementById("r-reason") && document.getElementById("r-reason").value) || "").trim();
  if (!reason) return toast("请填写退回理由");
  if (!confirm("确认退回该线索？")) return;
  patchRow("clues", id, { status: "已退回", returnReason: reason, remark: (document.getElementById("r-note") || {}).value || "" });
  closeModal();
  toast("已退回");
  location.reload();
}
function openDispatch(id, again) {
  window.__clueActId = id;
  const lock = !!again;
  openModal(`
    <div class="modal adj handle-form">
      <div class="adj-h">
        <h3>${lock ? "转派" : "派发"}</h3>
        <button type="button" class="icon-btn" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="adj-body">
        <div class="handle-sec-h">
          <h4>办理内容</h4>
          <span class="form-tip">只有初次派发才能选择处置意见</span>
        </div>
        <div class="kv-form">
          <div class="kv">
            <div class="k"><span class="req">*</span>处置意见</div>
            <div class="v">
              <div class="radio-row"${lock ? ' style="opacity:.45;pointer-events:none"' : ""}>
                <label><input type="radio" name="d-op" value="核查处置" ${lock ? "disabled" : "checked"}> 核查处置</label>
                <label><input type="radio" name="d-op" value="行政指导"${lock ? " disabled" : ""}> 行政指导</label>
                <label><input type="radio" name="d-op" value="执法"${lock ? " disabled" : ""}> 执法</label>
              </div>
            </div>
            <div class="k"><span class="req">*</span>是否抄送</div>
            <div class="v copy-inline">
              <div class="radio-row">
                <label><input type="radio" name="d-copy" value="是" onchange="syncCopyTo()"> 是</label>
                <label><input type="radio" name="d-copy" value="否" checked onchange="syncCopyTo()"> 否</label>
              </div>
              <select id="d-copy-to" style="display:none">
                <option>食品处</option><option>网监处</option><option>消保处</option>
              </select>
            </div>
          </div>
          <div class="kv">
            <div class="k"><span class="req">*</span>派发至</div>
            <div class="v">
              <select id="d-unit">
                <option>福州市市场监督管理局网络监管科</option>
                <option>台江区市场监督管理局网监科</option>
                <option>仓山市场监管所</option>
              </select>
            </div>
            <div class="k">备注</div>
            <div class="v"><input id="d-note" autocomplete="off" placeholder="请输入"></div>
          </div>
        </div>
      </div>
      <div class="adj-foot">
        <button type="button" class="btn-ghost" onclick="closeModal()">取消</button>
        <button type="button" class="btn-primary" onclick="confirmDispatch('${id}')">提交</button>
      </div>
    </div>`);
}
function syncCopyTo() {
  const yes = document.querySelector("input[name=d-copy]:checked");
  const sel = document.getElementById("d-copy-to");
  if (sel) sel.style.display = yes && yes.value === "是" ? "" : "none";
}
function confirmDispatch(id) {
  const unit = (document.getElementById("d-unit") && document.getElementById("d-unit").value) || "";
  if (!unit) return toast("请选择派发单位");
  if (!confirm("确认派发？")) return;
  const copy = document.querySelector("input[name=d-copy]:checked");
  const op = document.querySelector("input[name=d-op]:checked");
  patchRow("clues", id, {
    status: "处置中",
    dispatchUnit: unit,
    handleUnit: unit,
    copied: !!(copy && copy.value === "是"),
    disposeAdvice: op ? op.value : "",
    remark: (document.getElementById("d-note") || {}).value || "",
  });
  closeModal();
  toast("已派发");
  location.reload();
}
function openDispose(id) {
  window.__clueActId = id;
  const noReasons = ["未违反市场监管相关法律法规规章","违法行为轻微并及时改正，没有造成危害后果","初次违法且危害后果轻微并及时改正","当事人有证据足以证明没有主观过错，依法可以不予立案","依法可以不予立案的其他情形"];
  openModal(`
    <div class="modal adj handle-form">
      <div class="adj-h">
        <h3>办理</h3>
        <button type="button" class="icon-btn" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="adj-body">
        <div class="handle-sec-h"><h4>办理内容</h4></div>
        <div class="kv-form">
          <div class="kv span">
            <div class="k"><span class="req">*</span>处置类型</div>
            <div class="v">
              <div class="radio-row">
                <label><input type="radio" name="z-type" value="立案" checked onchange="syncDisposeType()"> 立案</label>
                <label><input type="radio" name="z-type" value="不予立案" onchange="syncDisposeType()"> 不予立案</label>
                <label><input type="radio" name="z-type" value="移送其他部门" onchange="syncDisposeType()"> 移送其他部门</label>
                <label><input type="radio" name="z-type" value="行政指导" onchange="syncDisposeType()"> 行政指导</label>
              </div>
            </div>
          </div>
          <div class="kv" id="z-row-li">
            <div class="k"><span class="req">*</span>核查情况</div>
            <div class="v"><input id="z-check" autocomplete="off" placeholder="请输入"></div>
            <div class="k"><span class="req">*</span>立案理由</div>
            <div class="v"><input id="z-reason" autocomplete="off" placeholder="请输入"></div>
          </div>
          <div class="kv" id="z-row-no" style="display:none">
            <div class="k"><span class="req">*</span>不予立案理由</div>
            <div class="v">
              <select id="z-no-reason" onchange="syncNoCaseExtra()">${noReasons.map((x) => `<option>${x}</option>`).join("")}</select>
            </div>
            <div class="k">备注</div>
            <div class="v"><input id="z-note-no" autocomplete="off" placeholder="请输入"></div>
          </div>
          <div class="kv span" id="z-row-no-extra" style="display:none">
            <div class="k"><span class="req">*</span>不予立案其他情形</div>
            <div class="v"><input id="z-no-extra" autocomplete="off" placeholder="请输入"></div>
          </div>
          <div class="kv" id="z-row-move" style="display:none">
            <div class="k"><span class="req">*</span>移送其他部门情况</div>
            <div class="v"><input id="z-move" autocomplete="off" placeholder="请输入"></div>
            <div class="k">备注</div>
            <div class="v"><input id="z-note-move" autocomplete="off" placeholder="请输入"></div>
          </div>
          <div class="kv" id="z-row-guide" style="display:none">
            <div class="k"><span class="req">*</span>指导内容</div>
            <div class="v"><input id="z-guide" autocomplete="off" placeholder="请输入"></div>
            <div class="k">备注</div>
            <div class="v"><input id="z-note-guide" autocomplete="off" placeholder="请输入"></div>
          </div>
        </div>
      </div>
      <div class="adj-foot">
        <button type="button" class="btn-ghost" onclick="closeModal()">取消</button>
        <button type="button" class="btn-primary" onclick="confirmDispose('${id}')">提交</button>
      </div>
    </div>`);
}
function syncDisposeType() {
  const t = (document.querySelector("input[name=z-type]:checked") || {}).value;
  const show = (id, on) => { const el = document.getElementById(id); if (el) el.style.display = on ? "" : "none"; };
  show("z-row-li", t === "立案");
  show("z-row-no", t === "不予立案");
  show("z-row-move", t === "移送其他部门");
  show("z-row-guide", t === "行政指导");
  if (t === "不予立案") syncNoCaseExtra();
  else show("z-row-no-extra", false);
}
function syncNoCaseExtra() {
  const sel = document.getElementById("z-no-reason");
  const extra = document.getElementById("z-row-no-extra");
  if (!extra) return;
  extra.style.display = sel && sel.value === "依法可以不予立案的其他情形" ? "" : "none";
}
function confirmDispose(id) {
  const type = (document.querySelector("input[name=z-type]:checked") || {}).value;
  if (!type) return toast("请选择处置类型");
  if (type === "立案") {
    if (!((document.getElementById("z-check") || {}).value || "").trim()) return toast("请填写核查情况");
    if (!((document.getElementById("z-reason") || {}).value || "").trim()) return toast("请填写立案理由");
  }
  if (type === "不予立案") {
    const extraOn = (document.getElementById("z-no-reason") || {}).value === "依法可以不予立案的其他情形";
    if (extraOn && !((document.getElementById("z-no-extra") || {}).value || "").trim()) return toast("请填写不予立案其他情形");
  }
  if (type === "移送其他部门" && !((document.getElementById("z-move") || {}).value || "").trim()) return toast("请填写移送其他部门情况");
  if (type === "行政指导" && !((document.getElementById("z-guide") || {}).value || "").trim()) return toast("请填写指导内容");
  if (!confirm("确认提交处置？")) return;
  patchRow("clues", id, {
    disposeType: type,
    status: type === "立案" ? "处置中" : "已办结",
    checkFact: (document.getElementById("z-check") || {}).value || "",
    caseReason: (document.getElementById("z-reason") || {}).value || "",
    noCaseReason: (document.getElementById("z-no-reason") || {}).value || "",
    remark: ((document.getElementById("z-note-no") || {}).value || (document.getElementById("z-note-move") || {}).value || (document.getElementById("z-note-guide") || {}).value || ""),
  });
  closeModal();
  toast(type === "立案" ? "已立案，请完成立案录入" : "已办结");
  location.reload();
}
function openCase(id) {
  const c = clueOf(id) || {};
  window.__clueActId = id;
  openModal(`
    <div class="modal adj handle-form">
      <div class="adj-h">
        <h3>立案录入</h3>
        <button type="button" class="icon-btn" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="adj-body">
        <div class="handle-sec-h"><h4>办理内容</h4></div>
        <div class="kv-form">
          <div class="kv span">
            <div class="k"><span class="req">*</span>处置类型</div>
            <div class="v">
              <div class="radio-row" style="opacity:.45;pointer-events:none">
                <label><input type="radio" checked disabled> 立案</label>
                <label><input type="radio" disabled> 不予立案</label>
                <label><input type="radio" disabled> 移送其他部门</label>
                <label><input type="radio" disabled> 行政指导</label>
              </div>
            </div>
          </div>
          <div class="kv">
            <div class="k"><span class="req">*</span>核查情况</div>
            <div class="v"><input id="c-check" value="${escAttr(c.checkFact || "核查属实")}" autocomplete="off"></div>
            <div class="k"><span class="req">*</span>立案理由</div>
            <div class="v"><input id="c-reason" value="${escAttr(c.caseReason || "违反网络广告宣传法")}" autocomplete="off"></div>
          </div>
          <div class="kv">
            <div class="k">备注</div>
            <div class="v"><input id="c-note" value="${escAttr(c.remark || "")}" autocomplete="off" placeholder="请输入"></div>
            <div class="k"><span class="req">*</span>案件处理结果</div>
            <div class="v">
              <div class="chk-row">
                <label><input type="checkbox" name="c-res" value="警告、通报批评" onchange="syncCaseAmt()"> 警告、通报批评</label>
                <label><input type="checkbox" name="c-res" value="罚款" onchange="syncCaseAmt()"> 罚款</label>
                <label><input type="checkbox" name="c-res" value="没收违法所得" onchange="syncCaseAmt()"> 没收违法所得</label>
                <label><input type="checkbox" name="c-res" value="没收非法财物" onchange="syncCaseAmt()"> 没收非法财物</label>
                <label><input type="checkbox" name="c-res" value="其他行政处罚" onchange="syncCaseAmt()"> 其他行政处罚</label>
              </div>
            </div>
          </div>
          <div class="kv" id="c-row-fine" style="display:none">
            <div class="k"><span class="req">*</span>罚款金额</div>
            <div class="v"><div class="amt-unit"><input id="c-fine" type="number" placeholder="请输入"><em>元</em></div></div>
            <div class="k" id="c-lab-gain" style="display:none"><span class="req">*</span>没收违法所得</div>
            <div class="v" id="c-val-gain" style="display:none"><input id="c-gain" autocomplete="off" placeholder="请输入"></div>
          </div>
          <div class="kv" id="c-row-more" style="display:none">
            <div class="k" id="c-lab-goods"><span class="req">*</span>没收非法财物</div>
            <div class="v" id="c-val-goods"><input id="c-goods" autocomplete="off" placeholder="请输入"></div>
            <div class="k" id="c-lab-other"><span class="req">*</span>其他行政处罚</div>
            <div class="v" id="c-val-other"><input id="c-other" autocomplete="off" placeholder="请输入"></div>
          </div>
        </div>
      </div>
      <div class="adj-foot">
        <button type="button" class="btn-ghost" onclick="closeModal()">取消</button>
        <button type="button" class="btn-primary" onclick="confirmCase('${id}')">提交</button>
      </div>
    </div>`);
  syncCaseAmt();
}
function hasCaseRes(v) {
  return [...document.querySelectorAll("input[name=c-res]:checked")].some((el) => el.value === v);
}
function syncCaseAmt() {
  const fine = hasCaseRes("罚款");
  const gain = hasCaseRes("没收违法所得");
  const goods = hasCaseRes("没收非法财物");
  const other = hasCaseRes("其他行政处罚");
  const rowFine = document.getElementById("c-row-fine");
  const rowMore = document.getElementById("c-row-more");
  if (rowFine) rowFine.style.display = fine || gain ? "" : "none";
  ["c-lab-gain", "c-val-gain"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = gain ? "" : "none";
  });
  if (rowMore) rowMore.style.display = goods || other ? "" : "none";
  ["c-lab-goods", "c-val-goods"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = goods ? "" : "none";
  });
  ["c-lab-other", "c-val-other"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = other ? "" : "none";
  });
}
function confirmCase(id) {
  const picked = [...document.querySelectorAll("input[name=c-res]:checked")].map((el) => el.value);
  if (!picked.length) return toast("请选择案件处理结果");
  if (picked.includes("罚款") && !((document.getElementById("c-fine") || {}).value || "").trim()) return toast("请填写罚款金额");
  if (picked.includes("没收违法所得") && !((document.getElementById("c-gain") || {}).value || "").trim()) return toast("请填写没收违法所得");
  if (picked.includes("没收非法财物") && !((document.getElementById("c-goods") || {}).value || "").trim()) return toast("请填写没收非法财物");
  if (picked.includes("其他行政处罚") && !((document.getElementById("c-other") || {}).value || "").trim()) return toast("请填写其他行政处罚");
  if (!confirm("确认提交立案录入？")) return;
  patchRow("clues", id, {
    status: "已办结",
    caseResult: picked.join("、"),
    checkFact: (document.getElementById("c-check") || {}).value || "",
    caseReason: (document.getElementById("c-reason") || {}).value || "",
    remark: (document.getElementById("c-note") || {}).value || "",
  });
  closeModal();
  toast("立案已录入，线索办结");
  location.reload();
}

function htmlHead(title) {
  const p = assetPrefix();
  return null;
}

window.onerror = function () {};
