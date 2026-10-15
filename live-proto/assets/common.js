/* 福州网监 · 直播采集原型 共享数据与交互 */
const STORAGE_KEY = "fz-wj-live-proto-v1";

const DEFAULT_STATE = {
  ratios: { A: 10, B: 25, C: 50, D: 80 },
  clips: {},
  clues: {},
  tasks: null,
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

const ROOMS = [
  {
    id: "R001",
    platform: "抖音",
    name: "榕城好物夜播间",
    url: "https://live.douyin.com/847291056",
    subject: "福州海丝商贸有限公司",
    credit: "91350100MA31W8XJ2R",
    regAddr: "福建省福州市鼓楼区温泉街道中山路88号",
    area: "鼓楼区",
    station: "鼓楼市场监管所",
    category: "食品 / 地方特产",
    tag: "食品",
    permit: "食品经营",
    level: "A",
    inPool: true,
    clipKept: 0,
    clipAutoCleared: 14,
    clueCount: 0,
    lastLive: "2026-09-07 15:20",
    source: "常规",
  },
  {
    id: "R002",
    platform: "快手",
    name: "闽江美妆工厂店",
    url: "https://live.kuaishou.com/u/39288101",
    subject: "福建颜集化妆品有限公司",
    credit: "91350103MA32K91C7Q",
    regAddr: "福建省福州市台江区宁化街道工业路198号",
    area: "台江区",
    station: "台江市场监管所",
    category: "化妆品",
    tag: "化妆品",
    permit: "化妆品经营",
    level: "C",
    inPool: true,
    clipKept: 3,
    clipAutoCleared: 8,
    clueCount: 2,
    lastLive: "2026-09-07 16:05",
    source: "常规",
  },
  {
    id: "R003",
    platform: "淘宝直播",
    name: "特食养护官方直播",
    url: "https://tbzb.taobao.com/live/6629103",
    subject: "福州康源生物科技有限公司",
    credit: "91350111MA34821H5P",
    regAddr: "福建省福州市晋安区新店镇金城路12号",
    area: "晋安区",
    station: "新店市场监管所",
    category: "保健食品",
    tag: "保健食品",
    permit: "食品生产",
    level: "D",
    inPool: true,
    clipKept: 4,
    clipAutoCleared: 3,
    clueCount: 3,
    lastLive: "2026-09-07 14:48",
    source: "常规",
  },
  {
    id: "R004",
    platform: "视频号",
    name: "仓山家电清仓仓",
    url: "https://channels.weixin.qq.com/live/cshd9901",
    subject: "福建海峡电器销售有限公司",
    credit: "91350104MA2Y71EE3M",
    regAddr: "福建省福州市仓山区金山街道金榕南路36号",
    area: "仓山区",
    station: "金山市场监管所",
    category: "家用电器",
    tag: "家电",
    permit: "其他",
    level: "B",
    inPool: true,
    clipKept: 0,
    clipAutoCleared: 11,
    clueCount: 0,
    lastLive: "2026-09-07 11:12",
    source: "常规",
  },
  {
    id: "R005",
    platform: "抖音",
    name: "马尾跨境优品",
    url: "https://live.douyin.com/22019844",
    subject: "福州保税优品供应链有限公司",
    credit: "91350105MA8T22KL9D",
    regAddr: "福建省福州市马尾区罗星街道江滨大道66号",
    area: "马尾区",
    station: "马尾市场监管所",
    category: "日用百货",
    tag: "日用百货",
    permit: "食品经营",
    level: "B",
    inPool: true,
    clipKept: 1,
    clipAutoCleared: 9,
    clueCount: 1,
    lastLive: "2026-09-07 13:40",
    source: "常规",
  },
  {
    id: "R006",
    platform: "京东直播",
    name: "长乐纺织厂直供",
    url: "https://lives.jd.com/8821001",
    subject: "长乐鑫源纺织有限公司",
    credit: "91350128MA32B11F8K",
    regAddr: "福建省福州市长乐区航城街道和平街18号",
    area: "长乐区",
    station: "航城市场监管所",
    category: "服装鞋帽",
    tag: "服装",
    permit: "其他",
    level: "A",
    inPool: true,
    clipKept: 0,
    clipAutoCleared: 16,
    clueCount: 0,
    lastLive: "2026-09-06 21:08",
    source: "常规",
  },
  {
    id: "R007",
    platform: "快手",
    name: "福清海鲜现切现发",
    url: "https://live.kuaishou.com/u/7712093",
    subject: "福清海润水产有限公司",
    credit: "91350181MA8U09CC2N",
    regAddr: "福建省福州市福清市龙山街道清昌大道9号",
    area: "福清市",
    station: "龙山市场监管所",
    category: "食用农产品",
    tag: "食用农产品",
    permit: "食品经营",
    level: "C",
    inPool: true,
    clipKept: 1,
    clipAutoCleared: 7,
    clueCount: 1,
    lastLive: "2026-09-07 10:22",
    source: "常规",
  },
  {
    id: "R008",
    platform: "抖音",
    name: "永泰李干原产地",
    url: "https://live.douyin.com/5108821",
    subject: "永泰青山食品有限公司",
    credit: "91350125MA31P44G6X",
    regAddr: "福建省福州市永泰县樟城镇南湖路3号",
    area: "永泰县",
    station: "樟城市场监管所",
    category: "食品",
    tag: "食品",
    permit: "食品生产",
    level: "A",
    inPool: false,
    clipKept: 0,
    clipAutoCleared: 0,
    clueCount: 0,
    lastLive: "—",
    source: "库内未抽中",
  },
  {
    id: "R009",
    platform: "淘宝直播",
    name: "连江海带扣专场",
    url: "https://tbzb.taobao.com/live/441902",
    subject: "连江县海味人家食品厂",
    credit: "91350122MA2YR88H1B",
    regAddr: "福建省福州市连江县凤城镇八一中路21号",
    area: "连江县",
    station: "凤城市场监管所",
    category: "食品",
    tag: "食品",
    permit: "食品生产",
    level: "B",
    inPool: false,
    clipKept: 1,
    clipAutoCleared: 4,
    clueCount: 1,
    lastLive: "2026-09-07 09:15",
    source: "专项",
  },
  {
    id: "R010",
    platform: "视频号",
    name: "闽侯石材辅料直播",
    url: "https://channels.weixin.qq.com/live/mhsc220",
    subject: "闽侯嘉石建材有限公司",
    credit: "91350121MA34890J4C",
    regAddr: "福建省福州市闽侯县甘蔗街道铁岭路56号",
    area: "闽侯县",
    station: "甘蔗市场监管所",
    category: "建材",
    tag: "建材",
    permit: "其他",
    level: "C",
    inPool: false,
    clipKept: 0,
    clipAutoCleared: 2,
    clueCount: 0,
    lastLive: "2026-09-05 16:30",
    source: "专项",
  },
];

const CURRENT_MONTH = "2026-09";

const MONTH_CAMPAIGNS = {
  "2026-07": {
    label: "2026年7月",
    ratios: { A: 10, B: 20, C: 40, D: 70 },
    stats: { pool: 6, clips: 15, cleared: 92, clues: 3 },
    rooms: {
      R001: { clipKept: 0, clipAutoCleared: 18, clueCount: 0, handledCount: 0, lastLive: "2026-07-29 21:04" },
      R003: { clipKept: 2, clipAutoCleared: 9, clueCount: 2, handledCount: 1, lastLive: "2026-07-30 16:22" },
      R004: { clipKept: 0, clipAutoCleared: 14, clueCount: 0, handledCount: 0, lastLive: "2026-07-28 11:40" },
      R006: { clipKept: 1, clipAutoCleared: 11, clueCount: 0, handledCount: 0, lastLive: "2026-07-31 19:18" },
      R008: { clipKept: 1, clipAutoCleared: 8, clueCount: 1, handledCount: 1, lastLive: "2026-07-26 15:33" },
      R010: { clipKept: 0, clipAutoCleared: 12, clueCount: 0, handledCount: 0, lastLive: "2026-07-25 10:08" },
    },
  },
  "2026-08": {
    label: "2026年8月",
    ratios: { A: 10, B: 25, C: 45, D: 75 },
    stats: { pool: 7, clips: 11, cleared: 86, clues: 5 },
    rooms: {
      R002: { clipKept: 2, clipAutoCleared: 10, clueCount: 2, handledCount: 1, lastLive: "2026-08-31 20:16" },
      R005: { clipKept: 1, clipAutoCleared: 13, clueCount: 1, handledCount: 1, lastLive: "2026-08-30 14:02" },
      R006: { clipKept: 0, clipAutoCleared: 15, clueCount: 0, handledCount: 0, lastLive: "2026-08-29 18:41" },
      R007: { clipKept: 1, clipAutoCleared: 9, clueCount: 1, handledCount: 0, lastLive: "2026-08-28 09:55" },
      R008: { clipKept: 0, clipAutoCleared: 16, clueCount: 0, handledCount: 0, lastLive: "2026-08-27 16:20" },
      R001: { clipKept: 0, clipAutoCleared: 12, clueCount: 0, handledCount: 0, lastLive: "2026-08-26 21:11" },
      R009: { clipKept: 1, clipAutoCleared: 7, clueCount: 1, handledCount: 1, lastLive: "2026-08-25 11:08" },
    },
  },
  "2026-09": {
    label: "2026年9月",
    ratios: { A: 10, B: 25, C: 50, D: 80 },
    stats: { pool: 7, clips: 16, cleared: 68, clues: 7 },
    rooms: {
      R001: { clipKept: 0, clipAutoCleared: 14, clueCount: 0, lastLive: "2026-09-07 15:20" },
      R002: { clipKept: 3, clipAutoCleared: 8, clueCount: 2, lastLive: "2026-09-07 16:05" },
      R003: { clipKept: 4, clipAutoCleared: 3, clueCount: 3, lastLive: "2026-09-07 14:48" },
      R004: { clipKept: 0, clipAutoCleared: 11, clueCount: 0, lastLive: "2026-09-07 11:12" },
      R005: { clipKept: 1, clipAutoCleared: 9, clueCount: 1, lastLive: "2026-09-07 13:40" },
      R006: { clipKept: 0, clipAutoCleared: 16, clueCount: 0, lastLive: "2026-09-06 21:08" },
      R007: { clipKept: 1, clipAutoCleared: 7, clueCount: 1, lastLive: "2026-09-07 10:22" },
    },
  },
};

function monthKeys() {
  return Object.keys(MONTH_CAMPAIGNS).sort();
}

function roomsForMonth(ym) {
  const camp = MONTH_CAMPAIGNS[ym] || MONTH_CAMPAIGNS[CURRENT_MONTH];
  return Object.keys(camp.rooms).map((id) => ({
    ...getRoom(id),
    ...camp.rooms[id],
    inPool: true,
  }));
}

const CLIPS = [
  {
    id: "C-09207-01",
    roomId: "R002",
    start: "2026-09-07 16:05:12",
    dur: "05:00",
    status: "留存",
    ai: "发现线索",
    cover: "../assets/covers/c1.svg",
    task: "常规监测 · 2026年9月",
  },
  {
    id: "C-09207-02",
    roomId: "R002",
    start: "2026-09-07 12:11:03",
    dur: "05:00",
    status: "留存",
    ai: "发现线索",
    cover: "../assets/covers/c2.svg",
    task: "常规监测 · 2026年9月",
  },
  {
    id: "C-09207-03",
    roomId: "R002",
    start: "2026-09-06 20:44:18",
    dur: "05:00",
    status: "留存",
    ai: "待复核画面",
    cover: "../assets/covers/c3.svg",
    task: "常规监测 · 2026年9月",
  },
  {
    id: "C-09207-04",
    roomId: "R003",
    start: "2026-09-07 14:48:40",
    dur: "05:00",
    status: "留存",
    ai: "发现线索",
    cover: "../assets/covers/c4.svg",
    task: "常规监测 · 2026年9月",
  },
  {
    id: "C-09207-05",
    roomId: "R003",
    start: "2026-09-07 09:02:11",
    dur: "05:00",
    status: "留存",
    ai: "发现线索",
    cover: "../assets/covers/c5.svg",
    task: "常规监测 · 2026年9月",
  },
  {
    id: "C-09206-11",
    roomId: "R003",
    start: "2026-09-06 19:30:00",
    dur: "05:00",
    status: "留存",
    ai: "发现线索",
    cover: "../assets/covers/c6.svg",
    task: "常规监测 · 2026年9月",
  },
  {
    id: "C-09205-08",
    roomId: "R003",
    start: "2026-09-05 16:18:22",
    dur: "05:00",
    status: "留存",
    ai: "画面存疑",
    cover: "../assets/covers/c7.svg",
    task: "常规监测 · 2026年9月",
  },
  {
    id: "C-09207-07",
    roomId: "R005",
    start: "2026-09-07 13:40:55",
    dur: "05:00",
    status: "留存",
    ai: "发现线索",
    cover: "../assets/covers/c8.svg",
    task: "常规监测 · 2026年9月",
  },
  {
    id: "C-09207-09",
    roomId: "R007",
    start: "2026-09-07 10:22:41",
    dur: "05:00",
    status: "留存",
    ai: "发现线索",
    cover: "../assets/covers/c9.svg",
    task: "常规监测 · 2026年9月",
  },
  {
    id: "C-09207-10",
    roomId: "R009",
    start: "2026-09-07 09:15:30",
    dur: "05:00",
    status: "留存",
    ai: "发现线索",
    cover: "../assets/covers/c10.svg",
    task: "专项 · 食用农产品专项",
  },
];

const CLUES = [
  {
    id: "CL-20260907-014",
    roomId: "R002",
    clipId: "C-09207-01",
    time: "2026-09-07 16:07:28",
    type: "虚假宣传",
    risk: "中",
    conf: 0.91,
    vision: "画面出现「国家级认证」「绝对安全」角标，未见对应批文特写。",
    asr: "姐妹们这支精华是国家认证的，用了绝对安全，七天美白无效退款。",
    words: ["国家认证", "绝对安全", "无效退款"],
    scenes: ["商品特写", "主播口头承诺"],
    fusion: "图像角标与口头绝对化用语互相印证，判定虚假宣传嫌疑。",
    confirm: "待确认",
    transfer: false,
  },
  {
    id: "CL-20260907-011",
    roomId: "R002",
    clipId: "C-09207-02",
    time: "2026-09-07 12:13:09",
    type: "未明示广告",
    risk: "低",
    conf: 0.76,
    vision: "持续展示商品挂车，未检出「广告」标识。",
    asr: "今天厂里清仓，拍一发三，链接已挂小黄车。",
    words: ["拍一发三"],
    scenes: ["购物车挂载"],
    fusion: "商业推销特征明显，建议人工确认是否需标注广告。",
    confirm: "待确认",
    transfer: false,
  },
  {
    id: "CL-20260907-018",
    roomId: "R003",
    clipId: "C-09207-04",
    time: "2026-09-07 14:51:02",
    type: "保健食品违规话术",
    risk: "高",
    conf: 0.94,
    vision: "产品包装可见蓝帽子标识；主播比划血压测量动作。",
    asr: "高血压的老同志吃两盒血压就稳了，医院的药可以停。",
    words: ["高血压", "血压就稳", "药可以停"],
    scenes: ["保健食品", "疾病承诺"],
    fusion: "保健食品宣称治疗疾病，多模态高置信，建议确认后转处置。",
    confirm: "待确认",
    transfer: false,
  },
  {
    id: "CL-20260907-009",
    roomId: "R003",
    clipId: "C-09207-05",
    time: "2026-09-07 09:04:44",
    type: "绝对化用语",
    risk: "中",
    conf: 0.88,
    vision: "屏幕大字「全国第一」「极致有效」。",
    asr: "我们是全国第一的养护品牌，极致有效。",
    words: ["全国第一", "极致有效"],
    scenes: ["字幕违规"],
    fusion: "字幕与口语同时出现绝对化用语。",
    confirm: "已确认",
    transfer: false,
  },
  {
    id: "CL-20260906-031",
    roomId: "R003",
    clipId: "C-09206-11",
    time: "2026-09-06 19:33:18",
    type: "未经审查的功效宣传",
    risk: "高",
    conf: 0.9,
    vision: "对比图展示「服用前 / 服用后」体检单，疑似伪造。",
    asr: "这是我们客户的真实体检报告，糖化血红蛋白直接降下来。",
    words: ["体检报告", "糖化血红蛋白"],
    scenes: ["伪造材料嫌疑"],
    fusion: "涉及疾病指标承诺，已建议转处置。",
    confirm: "已确认",
    transfer: true,
  },
  {
    id: "CL-20260907-021",
    roomId: "R005",
    clipId: "C-09207-07",
    time: "2026-09-07 13:43:12",
    type: "疑似违禁物品",
    risk: "高",
    conf: 0.82,
    vision: "画面短暂出现疑似管制刀具外形商品，随后切镜。",
    asr: "户外防身用的，到货看包装别外传。",
    words: ["防身", "别外传"],
    scenes: ["疑似违禁器具"],
    fusion: "图像置信中高，需人工对照禁售目录。",
    confirm: "待确认",
    transfer: false,
  },
  {
    id: "CL-20260907-006",
    roomId: "R007",
    clipId: "C-09207-09",
    time: "2026-09-07 10:24:50",
    type: "食用农产品虚假产地",
    risk: "中",
    conf: 0.79,
    vision: "背景海报写「舟山现捕」，主体登记地为福清。",
    asr: "今天都是舟山码头凌晨上岸的带鱼。",
    words: ["舟山", "凌晨上岸"],
    scenes: ["产地宣传"],
    fusion: "口头产地与主体登记地、进货凭证需核对。",
    confirm: "待确认",
    transfer: false,
  },
  {
    id: "CL-20260907-003",
    roomId: "R009",
    clipId: "C-09207-10",
    time: "2026-09-07 09:17:40",
    type: "食品三无嫌疑",
    risk: "高",
    conf: 0.86,
    vision: "海带扣散装称重，包装未见生产日期与厂名。",
    asr: "真空袋我们自己套的，新鲜不用看日期。",
    words: ["不用看日期"],
    scenes: ["散装食品", "标识缺失"],
    fusion: "标识缺失与口语相互印证。",
    confirm: "待确认",
    transfer: false,
  },
];

const PRODUCTS = [
  {
    id: "P001",
    name: "烟酰胺原液精华 30ml",
    price: "¥89.00",
    img: "../assets/covers/c1.svg",
    roomId: "R002",
    time: "2026-09-07 16:06",
    from: "常规监测",
    task: "2026年9月",
    clipId: "C-09207-01",
    hasClue: true,
  },
  {
    id: "P002",
    name: "玻尿酸保湿套装",
    price: "¥129.00",
    img: "../assets/covers/c2.svg",
    roomId: "R002",
    time: "2026-09-07 12:12",
    from: "常规监测",
    task: "2026年9月",
    clipId: "C-09207-02",
    hasClue: true,
  },
  {
    id: "P003",
    name: "辅酶Q10养护片 60粒",
    price: "¥268.00",
    img: "../assets/covers/c3.svg",
    roomId: "R003",
    time: "2026-09-07 14:49",
    from: "常规监测",
    task: "2026年9月",
    clipId: "C-09207-04",
    hasClue: true,
  },
  {
    id: "P004",
    name: "氨糖软骨素钙片",
    price: "¥198.00",
    img: "../assets/covers/c4.svg",
    roomId: "R003",
    time: "2026-09-07 09:03",
    from: "常规监测",
    task: "2026年9月",
    clipId: "C-09207-05",
    hasClue: true,
  },
  {
    id: "P005",
    name: "福州鱼丸礼盒",
    price: "¥59.90",
    img: "../assets/covers/c5.svg",
    roomId: "R001",
    time: "2026-09-07 15:22",
    from: "常规监测",
    task: "2026年9月",
    clipId: "C-09207-06",
    hasClue: false,
  },
  {
    id: "P006",
    name: "跨境蓝牙耳机仓",
    price: "¥79.00",
    img: "../assets/covers/c6.svg",
    roomId: "R005",
    time: "2026-09-07 13:41",
    from: "常规监测",
    task: "2026年9月",
    clipId: "C-09207-07",
    hasClue: true,
  },
  {
    id: "P007",
    name: "福清带鱼段 3斤装",
    price: "¥99.00",
    img: "../assets/covers/c7.svg",
    roomId: "R007",
    time: "2026-09-07 10:23",
    from: "常规监测",
    task: "2026年9月",
    clipId: "C-09207-09",
    hasClue: true,
  },
  {
    id: "P008",
    name: "连江海带扣 500g",
    price: "¥26.80",
    img: "../assets/covers/c8.svg",
    roomId: "R009",
    time: "2026-09-07 09:16",
    from: "专项监测",
    task: "食用农产品专项",
    clipId: "C-09207-10",
    hasClue: true,
  },
  {
    id: "P009",
    name: "干制海带结",
    price: "¥18.00",
    img: "../assets/covers/c9.svg",
    roomId: "R009",
    time: "2026-09-06 15:02",
    from: "专项监测",
    task: "食用农产品专项",
    clipId: "C-09206-20",
    hasClue: false,
  },
];

const DEFAULT_TASKS = [
  {
    id: "T001",
    name: "食用农产品专项",
    start: "2026-09-01",
    end: "2026-09-30",
    freq: 2,
    roomIds: ["R007", "R009"],
    status: "监测中",
    note: "针对海鲜、干制水产品直播间定向巡检",
  },
  {
    id: "T002",
    name: "保健食品话术专项",
    start: "2026-09-05",
    end: "2026-09-20",
    freq: 1,
    roomIds: ["R003"],
    status: "监测中",
    note: "聚焦疾病治疗承诺、停药建议",
  },
  {
    id: "T003",
    name: "8月化妆品清仓专项",
    start: "2026-08-10",
    end: "2026-08-31",
    freq: 4,
    roomIds: ["R002"],
    status: "已结束",
    note: "已归档，切片按规则清理",
  },
];

function getTasks() {
  const s = loadState();
  return s.tasks || DEFAULT_TASKS;
}

function setTasks(tasks) {
  saveState({ tasks });
}

function getRoom(id) {
  return ROOMS.find((r) => r.id === id);
}

function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

function getClip(id) {
  return getVisibleClips().find((c) => c.id === id);
}

function getClue(id) {
  return getCluesMerged().find((c) => c.id === id);
}

function getVisibleClips() {
  const deleted = loadState().clips;
  return CLIPS.filter((c) => c.ai !== "商品识别留存")
    .filter((c) => deleted[c.id] !== "deleted")
    .map((c) => ({
      ...c,
      status: deleted[c.id] === "deleted" ? "已删除" : c.status,
    }));
}

function getCluesMerged() {
  const patch = loadState().clues;
  return CLUES.map((c) => ({ ...c, ...(patch[c.id] || {}) }));
}

function isHandledClue(c) {
  return !!(c.transfer || c.confirm === "已查阅");
}

function handledClueCountForSubject(subject) {
  return getCluesMerged().filter((c) => {
    const room = getRoom(c.roomId);
    return room && room.subject === subject && isHandledClue(c);
  }).length;
}

function handledClueCountForRow(r) {
  if (r.handledCount != null) return r.handledCount;
  return handledClueCountForSubject(r.subject);
}

function qs(name) {
  return new URLSearchParams(location.search).get(name);
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
  return window.self !== window.top || qs("embed") === "1";
}

function isIdePreview() {
  return /Electron/i.test(navigator.userAgent);
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

function levelChip(lv) {
  const map = { A: "chip-a", B: "chip-b", C: "chip-c", D: "chip-d" };
  return `<span class="chip ${map[lv] || ""}">${lv}级</span>`;
}

function confirmChip(st) {
  if (st === "已转处置") return `<span class="chip chip-go">已转处置</span>`;
  if (st === "已查阅") return `<span class="chip chip-a">已查阅</span>`;
  return `<span class="chip chip-wait">待处置</span>`;
}

function clueStatusChip(c) {
  if (c.transfer) return confirmChip("已转处置");
  if (c.confirm === "已查阅") return confirmChip("已查阅");
  return confirmChip("待处置");
}

function cluePending(c) {
  return !c.transfer && c.confirm !== "已查阅";
}

function clueOpsHtml(c, extra) {
  const parts = extra ? [extra] : [];
  if (cluePending(c)) {
    parts.push(`<button class="btn-go" onclick="doTransferClue('${c.id}')">转处置</button>`);
    parts.push(`<button class="btn-ghost" onclick="doReviewClue('${c.id}')">已查阅</button>`);
  }
  return `<div class="clip-ops">${parts.join("")}</div>`;
}

function liveClueToGrade(c) {
  const room = getRoom(c.roomId) || {};
  return {
    id: c.id,
    source: "常规监测",
    task: "常规监测",
    platName: room.platform || "",
    shopName: room.name || "",
    shopUrl: room.url || "",
    subjectType: "企业",
    subject: room.subject || "",
    credit: room.credit || "",
    goodsName: c.type || "",
    goodsCat: room.category || "",
    goodsUrl: room.url || "",
    monitorDate: (c.time || "").slice(0, 10),
    item: c.type || "",
    violateType: c.type || "",
    status: "待处置",
    deadline: "正常",
    copied: false,
    created: c.time || "",
    handleUnit: "福州市市场监督管理局",
    area: room.area || "",
  };
}

function pushLiveClueToTodo(id) {
  const c = getCluesMerged().find((x) => x.id === id);
  if (!c) return;
  const GRADE_KEY = "fz-wj-grade-proto-v2";
  let state = {};
  try { state = JSON.parse(localStorage.getItem(GRADE_KEY) || "{}") || {}; } catch (e) { state = {}; }
  state.clues = state.clues || {};
  const row = liveClueToGrade(c);
  state.clues[row.id] = Object.assign({}, state.clues[row.id] || {}, row);
  localStorage.setItem(GRADE_KEY, JSON.stringify(state));
}

function doReviewClue(id) {
  patchClue(id, { confirm: "已查阅", transfer: false });
  toast("已查阅，不做处置");
  if (typeof window.onClueChanged === "function") window.onClueChanged();
  else location.reload();
}

function doTransferClue(id) {
  if (!confirm("确认转到待处理线索？")) return;
  patchClue(id, { confirm: "已转处置", transfer: true });
  pushLiveClueToTodo(id);
  toast("已转到待处理线索");
  if (typeof window.onClueChanged === "function") window.onClueChanged();
  else location.reload();
}

function riskChip(r) {
  if (r === "高") return `<span class="chip chip-d">高风险</span>`;
  if (r === "中") return `<span class="chip chip-c">中风险</span>`;
  return `<span class="chip chip-b">低风险</span>`;
}

function storageBar() {
  return `
    <section class="storage">
      <div>
        <div class="k">切片数据总量</div>
        <div class="v">12.48 <em>TB</em></div>
      </div>
      <div>
        <div class="k">剩余存储空间</div>
        <div class="v">7.52 <em>TB</em></div>
      </div>
      <div class="grow">
        <div class="row-between">
          <div class="k">剩余存储占比</div>
          <div class="pct">37.6%</div>
        </div>
        <div class="track"><i style="width:37.6%"></i></div>
        <div class="hint">容量按 20.00 TB 计。AI 判定无异常的切片已默认自动删除。</div>
      </div>
    </section>`;
}

function headerBar() {
  return `
    <header class="top">
      <div class="crumb" id="crumb"></div>
      <div class="top-meta">
        <span>2026年9月7日 星期一</span>
        <span class="dot"></span>
        <span>切片固定 5 分钟</span>
      </div>
    </header>`;
}

function shellStart(active) {
  if (isEmbed()) {
    document.body.classList.add("embed");
    return `${headerBar()}<div class="page">`;
  }
  return `
  <aside class="side">
    <div class="brand">
      <div class="seal">监</div>
      <div>
        <div class="org">福州市市场监督管理局</div>
        <div class="sys">网监直播采集工作台</div>
      </div>
    </div>
    <nav>
      <a class="${active === "regular" ? "on" : ""}" data-nav="regular" href="${page("index.html")}"><i class="fa-solid fa-rotate"></i> 常规监测</a>
      <a class="${active === "special" ? "on" : ""}" data-nav="special" href="${page("special.html")}"><i class="fa-solid fa-bullseye"></i> 专项监测</a>
      <a class="${active === "products" ? "on" : ""}" data-nav="products" href="${page("products.html")}"><i class="fa-solid fa-bag-shopping"></i> 商品监测结果</a>
    </nav>
    <div class="side-foot">
      <div class="who">
        <span class="avatar">李</span>
        <div>
          <b>李监管</b>
          <small>网监科 · 鼓楼分局</small>
        </div>
      </div>
    </div>
  </aside>
  <div class="main">
    ${headerBar()}
    <div class="page">`;
}

function markNav(href) {
  const path = (href || location.href).replace(/\\/g, "/");
  let key = "regular";
  if (path.includes("special-detail") || /special\.html/.test(path)) key = "special";
  else if (path.includes("products.html") || path.includes("product-detail")) key = "products";
  document.querySelectorAll("nav a[data-nav]").forEach((a) => {
    a.classList.toggle("on", a.getAttribute("data-nav") === key);
  });
}

function openInWorkspace(href) {
  const url = new URL(href, location.href);
  url.searchParams.set("embed", "1");
  const main = document.querySelector(".main");
  if (!main) {
    location.href = url.href;
    return;
  }
  let frame = document.getElementById("proto-frame");
  if (!frame) {
    frame = document.createElement("iframe");
    frame.id = "proto-frame";
    frame.className = "proto-frame";
    frame.title = "工作区";
    main.innerHTML = "";
    main.classList.add("framed");
    main.appendChild(frame);
  }
  frame.src = url.href;
  markNav(url.href);
}

function isInternalHtmlLink(anchor) {
  const raw = anchor.getAttribute("href");
  if (!raw) return false;
  if (raw.startsWith("javascript:") || raw.startsWith("#")) return false;
  if (anchor.target === "_blank") return false;
  try {
    const url = new URL(raw, location.href);
    if (url.protocol === "http:" || url.protocol === "https:") {
      if (location.protocol === "file:") return false;
      if (url.origin !== location.origin) return false;
    }
    return /\.html($|\?|#)/i.test(url.pathname + url.search + url.hash) || /\/$/.test(url.pathname);
  } catch {
    return false;
  }
}

document.addEventListener(
  "click",
  (e) => {
    const a = e.target.closest && e.target.closest("a");
    if (!a || !isInternalHtmlLink(a)) return;
    if (isEmbed()) return;
    if (!isIdePreview()) return;
    e.preventDefault();
    e.stopPropagation();
    openInWorkspace(a.href);
  },
  true
);

function shellEnd() {
  if (isEmbed()) return `</div><div id="modal-root"></div>`;
  return `</div></div>
  <div id="modal-root"></div>`;
}

function openModal(html) {
  const root = document.getElementById("modal-root");
  root.innerHTML = `<div class="overlay" onclick="if(event.target===this)closeModal()">${html}</div>`;
}

function closeModal() {
  const root = document.getElementById("modal-root");
  if (root) root.innerHTML = "";
}

function openPlayer(clipId) {
  const clip = getClip(clipId);
  if (!clip) return toast("切片不存在或已删除");
  const room = getRoom(clip.roomId);
  openModal(`
    <div class="modal player-modal">
      <div class="modal-h">
        <div>
          <h3>切片回放</h3>
          <p>${clip.id} · ${room ? room.name : ""} · ${clip.start}</p>
        </div>
        <button class="icon-btn" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="stage" style="background-image:url('${clip.cover}')">
        <button class="play" onclick="this.classList.toggle('off')"><i class="fa-solid fa-play"></i></button>
        <div class="timeline"><b style="width:18%"></b></div>
        <div class="stage-meta">00:54 / 05:00 · ${clip.task}</div>
      </div>
      <div class="modal-f">
        <span class="muted">AI 结论：${clip.ai}</span>
        <button class="btn-ghost" onclick="deleteClip('${clip.id}', true)">手动删除切片</button>
      </div>
    </div>`);
}

function deleteClip(id, fromModal) {
  if (!confirm("删除后不可恢复播放文件。确认删除该切片？")) return;
  const s = loadState();
  s.clips[id] = "deleted";
  saveState({ clips: s.clips });
  toast("切片已删除");
  if (fromModal) closeModal();
  setTimeout(() => location.reload(), 400);
}

function patchClue(id, patch) {
  const s = loadState();
  s.clues[id] = { ...(s.clues[id] || {}), ...patch };
  saveState({ clues: s.clues });
}
