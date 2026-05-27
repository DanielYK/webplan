// ── config.js — 游戏数据配置 ──
var G = window.G || (window.G = {});

// 12 级进化系统（体型差距拉大，最大鱼约是最小鱼的 25 倍）
G.TIER_EXP    = [5, 10, 18, 28, 42, 60, 85, 120, 165, 220, 290];
G.TIER_SIZES  = [20, 34, 52, 75, 105, 140, 180, 225, 275, 335, 405, 490];
G.TIER_SPEEDS = [3.6, 3.3, 3.0, 2.7, 2.5, 2.3, 2.2, 2.1, 2.0, 1.9, 1.85, 1.8];
G.MAX_OCEAN_FISH = 35;
G.MAX_SHORE_FISH = 18;
G.FISH_SCALE = 1;

// 鱼种数据 —— 100+ 种海洋生物，按 12 级分布
G.OCEAN_FISH = [
  // ═══ Tier 1 — 微型生物（真实尺寸 0.5-3cm） ═══
  {name:'浮游生物',tier:1,w:12,h:9, speed:1.6,color:'#A8E6CF',stripe:'#D4F5E6',points:1,freq:0.16,shape:'plankton',desc:'海洋食物链的基础'},
  {name:'小虾',    tier:1,w:18,h:8, speed:1.8,color:'#FFB3BA',stripe:'#FFD6DA',points:2,freq:0.14,shape:'shrimp',desc:'甲壳类动物'},
  {name:'磷虾',    tier:1,w:15,h:7, speed:1.7,color:'#BAFFC9',stripe:'#E0FFE8',points:2,freq:0.12,shape:'shrimp',desc:'南极磷虾是地球上数量最多的动物'},
  {name:'水母',    tier:1,w:20,h:20,speed:0.5,color:'#E0AAFF',stripe:'#F5D4FF',points:2,freq:0.08,shape:'jellyfish',desc:'半透明胶质生物，95%是水'},
  {name:'海螺',    tier:1,w:18,h:16,speed:0.4,color:'#C9A227',stripe:'#E8C960',points:3,freq:0.06,shape:'seaSnail',desc:'螺旋形贝壳'},
  // ═══ Tier 2 — 底栖生物（3-10cm） ═══
  {name:'海参',    tier:2,w:24,h:10,speed:0.4,color:'#8B7355',stripe:'#A08060',points:4,freq:0.10,shape:'cucumber',desc:'海底的清道夫'},
  {name:'海星',    tier:2,w:26,h:26,speed:0.3,color:'#FF6347',stripe:'#FF8C6B',points:5,freq:0.09,shape:'starfish',desc:'断臂可以再生'},
  {name:'海胆',    tier:2,w:22,h:22,speed:0.3,color:'#2F1B14',stripe:'#4A3020',points:5,freq:0.08,shape:'urchin',desc:'浑身长满尖刺'},
  {name:'海葵',    tier:2,w:28,h:28,speed:0.2,color:'#FF85A1',stripe:'#FFB8D1',points:4,freq:0.07,shape:'anemone',desc:'会随海流摆动的活体花朵'},
  {name:'比目鱼',  tier:2,w:32,h:24,speed:0.6,color:'#8B7D6B',stripe:'#A09080',points:6,freq:0.06,shape:'flatfish',desc:'两只眼睛长在同一侧'},
  // ═══ Tier 3 — 珊瑚礁小鱼（10-15cm） ═══
  {name:'小丑鱼',  tier:3,w:40,h:26,speed:1.4,color:'#FF6B35',stripe:'#FFF',   points:8,freq:0.11,shape:'clown',desc:'与海葵共生的橙白条纹鱼'},
  {name:'霓虹灯鱼',tier:3,w:36,h:16,speed:1.5,color:'#00D4FF',stripe:'#80EAFF',points:8,freq:0.09,shape:'neon',desc:'体侧有发光带'},
  {name:'孔雀鱼',  tier:3,w:38,h:22,speed:1.4,color:'#FF69B4',stripe:'#FFB6D9',points:9,freq:0.08,shape:'guppy',desc:'尾鳍如孔雀开屏'},
  {name:'斗鱼',    tier:3,w:36,h:32,speed:1.3,color:'#4169E1',stripe:'#FF4500',points:10,freq:0.07,shape:'betta',desc:'好斗的华丽长鳍'},
  {name:'蓝藻鱼',  tier:3,w:38,h:24,speed:1.3,color:'#1E90FF',stripe:'#87CEEB',points:8,freq:0.08,shape:'tang',desc:'珊瑚礁的素食主义者'},
  {name:'黄高鳍刺尾鱼',tier:3,w:34,h:34,speed:1.2,color:'#FFD700',stripe:'#FFF8DC',points:10,freq:0.06,shape:'yellowTang',desc:'鲜黄色圆盘形身体'},
  // ═══ Tier 4 — 中小型观赏鱼（15-25cm） ═══
  {name:'神仙鱼',  tier:4,w:58,h:68,speed:1.1,color:'#FFD700',stripe:'#000',   points:12,freq:0.08,shape:'angelfish',desc:'体态优雅如天使展翅'},
  {name:'狮子鱼',  tier:4,w:62,h:58,speed:0.9,color:'#DC143C',stripe:'#FFF5EE',points:14,freq:0.06,shape:'lionfish',desc:'鳍条如狮鬃，带剧毒'},
  {name:'蝴蝶鱼',  tier:4,w:64,h:56,speed:1.0,color:'#FFD700',stripe:'#FFF8DC',points:13,freq:0.07,shape:'butterfly',desc:'身体扁平如蝶翅'},
  {name:'长鬃蝶鱼',tier:4,w:58,h:60,speed:1.0,color:'#FFFFFF',stripe:'#000',   points:14,freq:0.05,shape:'mooridolfish',desc:'背鳍延伸成长丝带'},
  {name:'蝙蝠鱼',  tier:4,w:68,h:62,speed:0.9,color:'#C0A060',stripe:'#E8D080',points:13,freq:0.05,shape:'butterfly',desc:'形似蝙蝠翅膀'},
  {name:'鹦嘴鱼',  tier:4,w:66,h:46,speed:1.1,color:'#4AE68A',stripe:'#FFB6D9',points:14,freq:0.06,shape:'parrotfish',desc:'嘴如鹦鹉喙'},
  {name:'炮弹鱼',  tier:4,w:60,h:55,speed:1.0,color:'#DAA520',stripe:'#FFE4B5',points:13,freq:0.06,shape:'triggerfish',desc:'背鳍有扳机状棘刺'},
  // ═══ Tier 5 — 中型鱼（30-50cm） ═══
  {name:'河豚',    tier:5,w:90,h:80,speed:0.7,color:'#90C978',stripe:'#C8E6B8',points:18,freq:0.07,shape:'puffer',desc:'遇危险会膨胀成球'},
  {name:'刺豚',    tier:5,w:94,h:88,speed:0.7,color:'#D4A050',stripe:'#F5D490',points:20,freq:0.05,shape:'puffer',desc:'浑身尖刺的圆球鱼'},
  {name:'箱鲀',    tier:5,w:82,h:76,speed:0.7,color:'#FFD700',stripe:'#000',   points:18,freq:0.04,shape:'puffer',desc:'身体像一个黄色方盒子'},
  {name:'海马',    tier:5,w:45,h:88,speed:0.6,color:'#FF8C42',stripe:'#FFB380',points:20,freq:0.04,shape:'seahorse',desc:'由雄性怀孕的神奇动物'},
  {name:'叶海龙',  tier:5,w:56,h:82,speed:0.6,color:'#DAA520',stripe:'#F5D480',points:22,freq:0.03,shape:'seahorse',desc:'形似海草的完美伪装'},
  {name:'螃蟹',    tier:5,w:82,h:62,speed:0.7,color:'#CD5C5C',stripe:'#FF6B6B',points:16,freq:0.05,shape:'crab',desc:'横着走路的甲壳类'},
  {name:'龙虾',    tier:5,w:100,h:52,speed:0.7,color:'#8B0000',stripe:'#CD3333',points:22,freq:0.04,shape:'lobster',desc:'可以活到100岁'},
  // ═══ Tier 6 — 常见海鱼（50cm-1m） ═══
  {name:'黄花鱼',  tier:6,w:120,h:60,speed:1.2,color:'#DAA520',stripe:'#FFD700',points:28,freq:0.06,shape:'fish',desc:'中国四大海鱼之一'},
  {name:'带鱼',    tier:6,w:160,h:36,speed:1.3,color:'#C0C0C0',stripe:'#E8E8E8',points:26,freq:0.05,shape:'oarfish',desc:'像银带一样细长发亮'},
  {name:'鲈鱼',    tier:6,w:135,h:68,speed:1.2,color:'#708090',stripe:'#C0C0C0',points:28,freq:0.06,shape:'bass',desc:'适应性强的老滑头'},
  {name:'鲤鱼',    tier:6,w:130,h:70,speed:1.0,color:'#B87333',stripe:'#E8A060',points:26,freq:0.05,shape:'koi',desc:'古老的淡水鱼'},
  {name:'锦鲤',    tier:6,w:130,h:62,speed:1.0,color:'#FF4500',stripe:'#FFF',   points:30,freq:0.04,shape:'koi',desc:'红白相间象征好运'},
  {name:'金鱼',    tier:6,w:112,h:80,speed:0.9,color:'#FF8C00',stripe:'#FFD700',points:28,freq:0.05,shape:'goldfish',desc:'中国培育的观赏鱼之王'},
  // ═══ Tier 7 — 食肉鱼类（1-1.5m） ═══
  {name:'石斑鱼',  tier:7,w:160,h:100,speed:0.8,color:'#8B6914',stripe:'#CD9B1D',points:42,freq:0.05,shape:'grouper',desc:'礁石间的伏击猎手'},
  {name:'红鲷',    tier:7,w:148,h:88,speed:1.1,color:'#DC143C',stripe:'#FF6B6B',points:40,freq:0.05,shape:'snapper',desc:'高贵的深红色鱼'},
  {name:'真鲷',    tier:7,w:150,h:84,speed:1.1,color:'#FFB6C1',stripe:'#FFC0CB',points:40,freq:0.04,shape:'snapper',desc:'顶级食材'},
  {name:'食人鲳',  tier:7,w:132,h:92,speed:1.4,color:'#708090',stripe:'#C0C0C0',points:45,freq:0.03,shape:'snapper',desc:'成群攻击的亚马逊杀手'},
  {name:'鳗鱼',    tier:7,w:185,h:40,speed:1.2,color:'#4A3F2E',stripe:'#6B5A3E',points:42,freq:0.04,shape:'oarfish',desc:'细长滑溜溜的鱼'},
  {name:'龙鱼',    tier:7,w:185,h:72,speed:1.1,color:'#B8860B',stripe:'#FFD700',points:50,freq:0.03,shape:'arowana',desc:'风水鱼之王'},
  // ═══ Tier 8 — 大型海鱼（1.5-2.5m） ═══
  {name:'金枪鱼',  tier:8,w:220,h:100,speed:1.3,color:'#4169E1',stripe:'#6A8FEF',points:65,freq:0.03,shape:'tuna',desc:'短跑冠军，时速80公里'},
  {name:'蓝鳍金枪鱼',tier:8,w:235,h:106,speed:1.4,color:'#1E3A5F',stripe:'#3A6A9F',points:70,freq:0.025,shape:'tuna',desc:'顶级寿司食材'},
  {name:'鲣鱼',    tier:8,w:195,h:90,speed:1.4,color:'#2E4A6A',stripe:'#5A7A9A',points:60,freq:0.03,shape:'tuna',desc:'高速巡游'},
  {name:'剑鱼',    tier:8,w:245,h:74,speed:1.5,color:'#708090',stripe:'#A0B0C0',points:68,freq:0.025,shape:'sword',desc:'上颌延伸成剑状'},
  {name:'旗鱼',    tier:8,w:275,h:100,speed:1.7,color:'#1E3A5F',stripe:'#3A6A9F',points:72,freq:0.02,shape:'marlin',desc:'最快的鱼类，背鳍如旗'},
  {name:'马林鱼',  tier:8,w:265,h:94,speed:1.6,color:'#2A5A8A',stripe:'#4A7AAA',points:70,freq:0.02,shape:'marlin',desc:'老人与海的主角'},
  // ═══ Tier 9 — 深海巨兽（2-3m） ═══
  {name:'海龟',    tier:9,w:200,h:160,speed:0.5,color:'#2E8B57',stripe:'#5CB885',points:85,freq:0.025,shape:'turtle',desc:'能活100年的古老生灵'},
  {name:'鳐鱼',    tier:9,w:210,h:152,speed:0.9,color:'#6A5ACD',stripe:'#9A8FE0',points:80,freq:0.025,shape:'ray',desc:'像一张飞毯滑翔'},
  {name:'蝠鲼',    tier:9,w:250,h:180,speed:1.0,color:'#2A3A4A',stripe:'#F0F0F0',points:95,freq:0.015,shape:'mantaRay',desc:'海中的蝙蝠，翼展7米'},
  {name:'电鳗',    tier:9,w:230,h:56,speed:1.0,color:'#4A3F2E',stripe:'#FFFF00',points:85,freq:0.02,shape:'oarfish',desc:'能放出800伏高压电'},
  {name:'皇带鱼',  tier:9,w:360,h:68,speed:0.9,color:'#C0C0C0',stripe:'#FF4500',points:100,freq:0.012,shape:'oarfish',desc:'深海龙王，最长11米'},
  // ═══ Tier 10 — 顶级掠食者（3-5m） ═══
  {name:'鲨鱼',    tier:10,w:320,h:130,speed:1.3,color:'#5F6B7A',stripe:'#8A96A5',points:140,freq:0.015,shape:'shark',desc:'海洋顶级掠食者'},
  {name:'虎鲨',    tier:10,w:335,h:138,speed:1.3,color:'#5A6B7A',stripe:'#A0A8B0',points:150,freq:0.012,shape:'tigerShark',desc:'身上有虎纹的猛鲨'},
  {name:'锤头鲨',  tier:10,w:315,h:130,speed:1.2,color:'#696969',stripe:'#A9A9A9',points:145,freq:0.01,shape:'hammerhead',desc:'T形头部有360度视野'},
  {name:'哥布林鲨',tier:10,w:300,h:112,speed:1.1,color:'#FFC0CB',stripe:'#FFE0E8',points:150,freq:0.008,shape:'shark',desc:'活化石'},
  {name:'姥鲨',    tier:10,w:345,h:125,speed:1.0,color:'#4A5A6A',stripe:'#8A9AAA',points:155,freq:0.008,shape:'shark',desc:'温顺的滤食性巨鲨'},
  {name:'海豚',    tier:10,w:300,h:120,speed:1.5,color:'#6CB4D9',stripe:'#A0D4EF',points:135,freq:0.012,shape:'dolphin',desc:'智商极高的哺乳动物'},
  {name:'白鲸',    tier:10,w:335,h:134,speed:1.0,color:'#F0F0F0',stripe:'#FFF',   points:150,freq:0.008,shape:'dolphin',desc:'会唱歌的北极精灵'},
  // ═══ Tier 11 — 深海霸主（5-12m） ═══
  {name:'虎鲸',    tier:11,w:430,h:185,speed:1.2,color:'#1A1A2E',stripe:'#F0F0F0',points:240,freq:0.008,shape:'orca',desc:'海洋中最聪明的猎手'},
  {name:'座头鲸',  tier:11,w:470,h:180,speed:1.0,color:'#3A4A5A',stripe:'#6A7A8A',points:250,freq:0.006,shape:'whale',desc:'会跃出水面的歌唱家'},
  {name:'长须鲸',  tier:11,w:490,h:155,speed:1.1,color:'#4A5A6A',stripe:'#8A9AAA',points:260,freq:0.005,shape:'whale',desc:'世界第二大的鲸类'},
  {name:'抹香鲸',  tier:11,w:500,h:175,speed:1.0,color:'#4A4A5A',stripe:'#6A6A7A',points:280,freq:0.005,shape:'whale',desc:'能潜入3000米深海'},
  {name:'巨型章鱼',tier:11,w:400,h:350,speed:0.6,color:'#8B0000',stripe:'#CD5C5C',points:250,freq:0.005,shape:'octopus',desc:'3颗心脏蓝色血液'},
  {name:'鲸鲨',    tier:11,w:515,h:180,speed:0.9,color:'#2A3A5A',stripe:'#FFF',   points:270,freq:0.004,shape:'whaleshark',desc:'世界上最大的鱼'},
  {name:'大白鲨',  tier:11,w:470,h:185,speed:1.4,color:'#4F5B66',stripe:'#E8E8E8',points:260,freq:0.006,shape:'greatwhite',desc:'令人畏惧的掠食者'},
  // ═══ Tier 12 — 传说生物（15-25m） ═══
  {name:'巨齿鲨',  tier:12,w:720,h:265,speed:1.3,color:'#2A3A4A',stripe:'#E0E0E0',points:500,freq:0.003,shape:'megalodon',desc:'史前最强海洋掠食者'},
  {name:'海怪克拉肯',tier:12,w:640,h:580,speed:0.7,color:'#4A0000',stripe:'#8B0000',points:550,freq:0.002,shape:'krakenTentacle',desc:'北欧传说的巨型海怪'},
  {name:'海神利维坦',tier:12,w:800,h:260,speed:1.0,color:'#0A1A4A',stripe:'#6A7AEA',points:700,freq:0.0015,shape:'leviathan',desc:'传说中深海的古老神祇'}
];

G.SHORE_FISH = G.OCEAN_FISH.filter(function(f){return f.tier>=2&&f.tier<=4;});

// ── Depth zones —— 深度分带（12级） ──
G.DEPTH_ZONES = [
  {minDepth:0,    maxDepth:100,  name:'浅滩',    tiers:[1,2,3],       bgTop:'#1E8BC3',bgBot:'#166AA0'},
  {minDepth:100,  maxDepth:300,  name:'浅海',    tiers:[2,3,4,5],     bgTop:'#166AA0',bgBot:'#0D5280'},
  {minDepth:300,  maxDepth:600,  name:'中层海',  tiers:[3,4,5,6,7],   bgTop:'#0D5280',bgBot:'#083A5E'},
  {minDepth:600,  maxDepth:1000, name:'深海',    tiers:[4,5,6,7,8],   bgTop:'#083A5E',bgBot:'#062840'},
  {minDepth:1000, maxDepth:1500, name:'深渊',    tiers:[5,6,7,8,9],   bgTop:'#062840',bgBot:'#041828'},
  {minDepth:1500, maxDepth:2500, name:'深渊层',  tiers:[6,7,8,9,10],  bgTop:'#041828',bgBot:'#030F1A'},
  {minDepth:2500, maxDepth:4000, name:'超深渊',  tiers:[7,8,9,10,11], bgTop:'#030F1A',bgBot:'#010508'},
  {minDepth:4000, maxDepth:99999,name:'海沟',    tiers:[9,10,11,12],  bgTop:'#010508',bgBot:'#000000'}
];

// ── Easter eggs ──
G.EGG_TYPES = [
  {name:'金色海星',icon:'⭐',color:'#FFD700',glow:'rgba(255,215,0,0.4)',points:50,sizeBoost:1},
  {name:'彩虹珍珠',icon:'🔮',color:'#E040FB',glow:'rgba(224,64,251,0.4)',points:80,sizeBoost:1},
  {name:'古代宝箱',icon:'📦',color:'#DAA520',glow:'rgba(218,165,32,0.4)',points:150,sizeBoost:2},
  {name:'龙之鳞片',icon:'🐉',color:'#00E5FF',glow:'rgba(0,229,255,0.4)',points:200,sizeBoost:2},
  {name:'深海之心',icon:'💎',color:'#FF1744',glow:'rgba(255,23,68,0.4)',points:500,sizeBoost:3}
];

// ── Adventure stories ──
G.STORIES = [
  {npc:'海底精灵',npcColor:'#80DEEA',rounds:[
    {text:'欢迎来到深海秘境！我是守护这片海域的精灵。你想要什么？',
     choices:[{text:'给我力量！',reward:{points:100,tierUp:1}},{text:'给我财富！',reward:{points:300}},{text:'告诉我秘密',reward:{points:50,tierUp:2}}]},
    {text:'你的勇气令我印象深刻。再选一个礼物吧。',
     choices:[{text:'速度之力',reward:{points:80}},{text:'生命护盾',reward:{points:120}}]},
    {text:'愿深海庇佑你。带上这份祝福回去吧！',
     choices:[{text:'谢谢！',reward:{points:200}}]}
  ]},
  {npc:'古代鱼人',npcColor:'#A5D6A7',rounds:[
    {text:'嗯？一条小鱼竟然游到了这里。你知道这里曾经是一座城市吗？',
     choices:[{text:'真的吗？',reward:{points:50}},{text:'有宝藏吗？',reward:{points:150}}]},
    {text:'这座城市沉没了千年。我是最后的守卫。',
     choices:[{text:'我能帮你吗？',reward:{points:200,tierUp:1}},{text:'我只是路过',reward:{points:80}}]},
    {text:'无论如何，拿着这个吧。也许对你有用。',
     choices:[{text:'收下',reward:{points:250}}]}
  ]},
  {npc:'深渊巨眼',npcColor:'#EF5350',rounds:[
    {text:'...你看到了不该看到的东西。',
     choices:[{text:'我不怕你！',reward:{points:100,tierUp:1}},{text:'请放过我...',reward:{points:200}}]},
    {text:'有趣。很久没有生物敢直视我了。',
     choices:[{text:'你是什么？',reward:{points:150}},{text:'我要离开',reward:{points:100}}]},
    {text:'去吧。下次再来，我可能不会这么友善。',
     choices:[{text:'告辞',reward:{points:300}}]}
  ]}
];

G.SHOP = {
  rod:[
    {id:'rod_0',name:'竹竿',icon:'🎋',price:0,desc:'基础鱼竿',dist:1,reel:1},
    {id:'rod_1',name:'碳素竿',icon:'🥢',price:200,desc:'距离+30% 收线+15%',dist:1.3,reel:1.15},
    {id:'rod_2',name:'海钓竿',icon:'🎣',price:500,desc:'距离+60% 收线+30%',dist:1.6,reel:1.3},
    {id:'rod_3',name:'黄金竿',icon:'✨',price:1500,desc:'距离+100% 收线+50%',dist:2,reel:1.5}
  ],
  bait:[
    {id:'bait_0',name:'蚯蚓',icon:'🪱',price:0,desc:'基础鱼饵',attract:1,rare:1},
    {id:'bait_1',name:'虾仁',icon:'🦐',price:100,desc:'吸引+40%',attract:1.4,rare:1},
    {id:'bait_2',name:'鱼饵丸',icon:'🟠',price:300,desc:'吸引+80%',attract:1.8,rare:1},
    {id:'bait_3',name:'秘制鱼饵',icon:'💎',price:800,desc:'吸引+120% 稀有鱼×2',attract:2.2,rare:2}
  ],
  hook:[
    {id:'hook_0',name:'铁钩',icon:'🪝',price:0,desc:'基础鱼钩',range:1,bonus:1},
    {id:'hook_1',name:'钢钩',icon:'⚓',price:150,desc:'范围+25%',range:1.25,bonus:1},
    {id:'hook_2',name:'合金钩',icon:'🔩',price:400,desc:'范围+50%',range:1.5,bonus:1},
    {id:'hook_3',name:'钛金钩',icon:'💫',price:1000,desc:'范围+80% 得分+20%',range:1.8,bonus:1.2}
  ],
  char:[
    {id:'char_0',name:'渔夫',icon:'🧑‍🌾',price:0,desc:'默认角色',skin:'fisher'},
    {id:'char_1',name:'海盗',icon:'🏴‍☠️',price:300,desc:'黑衣海盗帽',skin:'pirate'},
    {id:'char_2',name:'美人鱼',icon:'🧜',price:600,desc:'紫色鱼尾',skin:'mermaid'},
    {id:'char_3',name:'船长',icon:'🎖️',price:1000,desc:'白色制服船长帽',skin:'captain'},
    {id:'char_4',name:'自定义',icon:'📷',price:500,desc:'上传你的头像',skin:'custom'}
  ]
};
