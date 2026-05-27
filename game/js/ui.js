// ── ui.js — 商店、背包、个人中心、死亡面板 ──
var G = window.G;
G.shopTab = 'rod';

G.openPanel = function(id){
  document.querySelectorAll('.overlay').forEach(o=>o.style.display='none');
  const el=document.getElementById(id);
  if(el){el.style.display='flex'; if(id==='shopOverlay')G.renderShop(); if(id==='bagOverlay')G.renderBag(); if(id==='profileOverlay')G.renderProfile(); if(id==='dexOverlay')G.renderDex();}
};
G.closePanel = function(id){document.getElementById(id).style.display='none';};

// ── Shop ──
G.renderShop = function(){
  const items=G.SHOP[G.shopTab], grid=document.getElementById('shopGrid');
  grid.innerHTML=items.map(item=>{
    const isOwned=G.owned.has(item.id), isEq=G.equipped[G.shopTab]===item.id, canBuy=G.score>=item.price;
    let btn='';
    if(isEq) btn='<button class="equipped-btn">已装备</button>';
    else if(isOwned) btn='<button class="equip-btn" data-id="'+item.id+'" data-act="equip">装备</button>';
    else btn='<button class="buy-btn" data-id="'+item.id+'" data-act="buy"'+(canBuy?'':' disabled')+'>购买 '+item.price+'</button>';
    if(item.id==='char_4'&&isOwned){
      const av=G.avatarDataURL?'<img class="avatar-preview" src="'+G.avatarDataURL+'">':'';
      btn+=av+'<button class="upload-btn" data-act="upload">上传头像</button>';
    }
    return '<div class="shop-card'+(isEq?' equipped':'')+'"><div class="icon">'+item.icon+'</div><div class="name">'+item.name+'</div><div class="desc">'+item.desc+'</div>'+(item.price?'<div class="price">'+item.price+' 积分</div>':'<div class="price">免费</div>')+btn+'</div>';
  }).join('');
  grid.querySelectorAll('button[data-act]').forEach(b=>{
    b.addEventListener('click',()=>{
      const act=b.dataset.act,id=b.dataset.id;
      if(act==='buy')G.buyItem(id); else if(act==='equip')G.equipItem(id);
      else if(act==='upload')document.getElementById('avatarInput').click();
    });
  });
  document.getElementById('shopFooter').textContent='积分: '+G.score;
};

G.buyItem = function(id){
  const cat=id.startsWith('char')?'char':id.split('_')[0];
  const item=G.SHOP[cat].find(i=>i.id===id);
  if(!item||G.score<item.price||G.owned.has(id))return;
  G.score-=item.price; G.owned.add(id); G.equipped[cat]=id;
  G.updateScoreUI(); G.save(); G.renderShop();
};
G.equipItem = function(id){
  const cat=id.startsWith('char')?'char':id.split('_')[0];
  G.equipped[cat]=id; G.save(); G.renderShop();
};

// ── Backpack ──
G.renderBag = function(){
  const grid=document.getElementById('bagGrid');
  const cats=[['rod','鱼竿'],['bait','鱼食'],['hook','鱼钩'],['char','角色']];
  let html='';
  for(const [cat,label] of cats){
    const items=G.SHOP[cat].filter(i=>G.owned.has(i.id));
    if(!items.length) continue;
    html+='<div class="bag-cat">'+label+'</div>';
    html+=items.map(item=>{
      const isEq=G.equipped[cat]===item.id;
      return '<div class="bag-item'+(isEq?' equipped':'')+'" data-id="'+item.id+'"><span class="icon">'+item.icon+'</span><span class="name">'+item.name+'</span>'+(isEq?'<span class="eq-tag">装备中</span>':'<span class="eq-btn">装备</span>')+'</div>';
    }).join('');
  }
  grid.innerHTML=html||'<div style="text-align:center;color:#888;padding:30px">背包空空如也</div>';
  grid.querySelectorAll('.bag-item:not(.equipped)').forEach(el=>{
    el.addEventListener('click',()=>{
      const id=el.dataset.id, cat=id.startsWith('char')?'char':id.split('_')[0];
      G.equipped[cat]=id; G.save(); G.renderBag();
    });
  });
};

// ── Profile ──
G.renderProfile = function(){
  const c=document.getElementById('profileContent');
  const skin=G.getEquipped('char');
  c.innerHTML=
    '<div class="prof-avatar">'+(G.avatarDataURL?'<img src="'+G.avatarDataURL+'" class="prof-img">':'<div class="prof-img-placeholder">'+skin.icon+'</div>')+'<button id="profUpload" class="upload-btn">更换头像</button></div>'+
    '<div class="prof-field"><label>昵称</label><input id="profNick" type="text" value="'+G.nickname+'" maxlength="12"></div>'+
    '<div class="prof-stats">'+
      '<div class="stat"><span class="stat-val">'+G.score+'</span><span class="stat-label">总积分</span></div>'+
      '<div class="stat"><span class="stat-val">'+G.fishCaught+'</span><span class="stat-label">钓鱼数</span></div>'+
      '<div class="stat"><span class="stat-val">Lv.'+G.oceanBestTier+'</span><span class="stat-label">最高等级</span></div>'+
    '</div>'+
    '<div class="prof-equip"><div class="prof-equip-title">当前装备</div>'+
      '<div class="prof-equip-list">'+
        ['rod','bait','hook','char'].map(cat=>{const e=G.getEquipped(cat);return '<span class="prof-eq-item">'+e.icon+' '+e.name+'</span>';}).join('')+
      '</div>'+
    '</div>';
  document.getElementById('profUpload').addEventListener('click',()=>document.getElementById('avatarInput').click());
  document.getElementById('profNick').addEventListener('change',e=>{G.nickname=e.target.value.trim()||'渔夫';G.save();});
};

// ── Death Panel ──
G.showDeathPanel = function(killer){
  const el=document.getElementById('deathPanel');
  el.style.display='flex';
  document.getElementById('deathMsg').textContent='你被 '+killer+' 吃掉了!';
  document.getElementById('deathStats').textContent='本次吃了 '+G.player.eatenCount+' 条鱼，最高 Lv.'+G.player.tier;
  const revBtn=document.getElementById('reviveBtn');
  if(G.score>=10){revBtn.disabled=false;revBtn.textContent='复活 (-10积分)';}
  else{revBtn.disabled=true;revBtn.textContent='积分不足';}
};

// ── Avatar Upload ──
G.initAvatarUpload = function(){
  document.getElementById('avatarInput').addEventListener('change',e=>{
    const file=e.target.files[0]; if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{
      G.avatarDataURL=ev.target.result;
      G.avatarImg=new Image();G.avatarImg.onload=()=>{G.save();};
      G.avatarImg.src=G.avatarDataURL;
    };
    reader.readAsDataURL(file); e.target.value='';
  });
};

// ── Init UI Events ──
G.initUI = function(){
  G.initAvatarUpload();
  document.getElementById('shopBtn').addEventListener('click',()=>G.openPanel('shopOverlay'));
  document.getElementById('bagBtn').addEventListener('click',()=>G.openPanel('bagOverlay'));
  document.getElementById('dexBtn').addEventListener('click',()=>G.openPanel('dexOverlay'));
  document.getElementById('profileBtn').addEventListener('click',()=>G.openPanel('profileOverlay'));
  document.querySelectorAll('.panel-close').forEach(b=>b.addEventListener('click',()=>{
    b.closest('.overlay').style.display='none';
  }));
  document.querySelectorAll('.overlay').forEach(o=>o.addEventListener('click',e=>{
    if(e.target===o) o.style.display='none';
  }));
  document.querySelectorAll('.shop-tab').forEach(t=>{
    t.addEventListener('click',()=>{
      document.querySelectorAll('.shop-tab').forEach(x=>x.classList.remove('active'));
      t.classList.add('active'); G.shopTab=t.dataset.tab; G.renderShop();
    });
  });
  document.getElementById('restartBtn').addEventListener('click',G.restart);
  document.getElementById('reviveBtn').addEventListener('click',G.revive);
  // Ocean choice panel
  document.getElementById('oceanResumeBtn').addEventListener('click',function(){
    document.getElementById('oceanChoicePanel').style.display='none';
    G.resumeOcean();
  });
  document.getElementById('oceanRestartBtn').addEventListener('click',function(){
    document.getElementById('oceanChoicePanel').style.display='none';
    G.oceanSave=null;
    G.enterOcean();
  });
  // PK button
  document.getElementById('pkBtn').addEventListener('click',function(){
    G.enterPK();
  });
  // Dex detail close
  document.getElementById('dexDetailClose').addEventListener('click',function(){
    document.getElementById('dexDetail').classList.remove('show');
  });
  document.getElementById('dexDetail').addEventListener('click',function(e){
    if(e.target.id==='dexDetail') document.getElementById('dexDetail').classList.remove('show');
  });
};
// ── 海洋图鉴 ──
G.TIER_NAMES = ['微型生物','底栖生物','珊瑚礁小鱼','观赏鱼','中型鱼','常见海鱼','食肉鱼','大型海鱼','深海巨兽','顶级掠食者','深海霸主','传说生物'];

// Fish name → atlas image filename
G.FISH_IMG_MAP = {
  '小虾':'094_对虾.png','磷虾':'097_皮皮虾.png','海螺':'093_鹦鹉螺.png',
  '海参':'090_海参.png','海星':'092_海星.png','海胆':'091_海胆.png','比目鱼':'048_比目鱼.png',
  '小丑鱼':'000_小丑鱼.png','孔雀鱼':'008_孔雀鱼.png','斗鱼':'009_斗鱼.png',
  '蓝藻鱼':'001_蓝藻鱼.png','黄高鳍刺尾鱼':'002_黄高鳍刺尾鱼.png',
  '神仙鱼':'003_神仙鱼.png','狮子鱼':'006_狮子鱼.png','蝴蝶鱼':'004_蝴蝶鱼.png',
  '长鬃蝶鱼':'005_长鬃蝶鱼.png','蝙蝠鱼':'019_蝙蝠鱼.png','鹦嘴鱼':'012_鹦嘴鱼.png',
  '河豚':'014_河豚.png','刺豚':'015_刺豚.png','箱鲀':'013_箱鲀.png',
  '海马':'017_海马.png','叶海龙':'018_叶海龙.png','螃蟹':'095_螃蟹.png','龙虾':'096_龙虾.png',
  '黄花鱼':'052_黄花鱼.png','带鱼':'053_带鱼.png','鲈鱼':'063_鲫鱼.png',
  '鲤鱼':'062_鲤鱼.png','锦鲤':'061_锦鲤.png',
  '石斑鱼':'045_石斑鱼.png','红鲷':'043_红鲷.png','真鲷':'044_真鲷.png',
  '食人鲳':'065_食人鲳.png','鳗鱼':'016_长吻鳝.png','龙鱼':'060_龙鱼.png',
  '金枪鱼':'057_黄鳍金枪鱼.png','蓝鳍金枪鱼':'056_蓝鳍金枪鱼.png',
  '鲣鱼':'055_鲭鱼.png','剑鱼':'054_鲅鱼.png','旗鱼':'058_旗鱼.png','马林鱼':'059_马林鱼.png',
  '皇带鱼':'084_皇带鱼.png',
  '鲨鱼':'025_公牛鲨.png','虎鲨':'021_虎鲨.png','锤头鲨':'022_锤头鲨.png',
  '哥布林鲨':'027_哥布林鲨.png','姥鲨':'028_姥鲨.png',
  '海豚':'032_宽吻海豚.png','白鲸':'031_白鲸.png',
  '虎鲸':'030_虎鲸.png','座头鲸':'034_座头鲸.png','长须鲸':'036_长须鲸.png',
  '抹香鲸':'029_抹香鲸.png','巨型章鱼':'080_章鱼.png',
  '鲸鲨':'023_鲸鲨.png','大白鲨':'020_大白鲨.png',
  '巨齿鲨':'020_大白鲨.png','海怪克拉肯':'081_大王乌贼.png'
};

G.getFishImg = function(name){
  var f=G.FISH_IMG_MAP[name];
  return f ? 'assets/fish/'+f : null;
};

G.renderDex = function(){
  var total=G.OCEAN_FISH.length, found=G.discovered.size;
  var pct=Math.round(found/total*100);
  document.getElementById('dexHeaderInfo').innerHTML=
    '已发现 <strong style="color:#FFD700">'+found+'/'+total+'</strong> 种 · '+pct+'%';
  var byTier={};
  for(var i=0;i<G.OCEAN_FISH.length;i++){
    var f=G.OCEAN_FISH[i];
    if(!byTier[f.tier]) byTier[f.tier]=[];
    byTier[f.tier].push(f);
  }
  var html='';
  for(var t=1;t<=12;t++){
    if(!byTier[t]) continue;
    html+='<div class="dex-tier-section">Lv.'+t+' · '+G.TIER_NAMES[t-1]+'</div>';
    for(var f of byTier[t]){
      var discovered=G.discovered.has(f.name);
      var imgSrc=G.getFishImg(f.name);
      var visual;
      if(imgSrc){
        visual='<img class="dex-thumb-img" src="'+imgSrc+'" alt="'+f.name+'">';
      } else {
        visual='<canvas class="dex-thumb" width="144" height="108" data-fish="'+f.name+'"></canvas>';
      }
      html+='<div class="dex-card '+(discovered?'discovered':'unknown')+'" data-fish="'+f.name+'">'+
        visual+
        '<div class="dex-tier">Lv.'+t+'</div>'+
        '<div class="dex-fish-name">'+(discovered?f.name:'???')+'</div>'+
      '</div>';
    }
  }
  document.getElementById('dexGrid').innerHTML=html;
  // Draw canvas fallbacks
  document.querySelectorAll('#dexGrid .dex-thumb').forEach(function(canvas){
    var fishName=canvas.dataset.fish;
    var fish=G.OCEAN_FISH.find(function(x){return x.name===fishName;});
    if(fish) G.drawDexThumbnail(canvas,fish);
  });
  // Click any card (discovered: show detail; unknown: hint)
  document.querySelectorAll('#dexGrid .dex-card').forEach(function(card){
    card.addEventListener('click',function(){
      var fish=G.OCEAN_FISH.find(function(x){return x.name===card.dataset.fish;});
      if(!fish) return;
      if(G.discovered.has(fish.name)) G.showDexDetail(fish);
      else G.showDexDetail(fish, {hidden:true});
    });
  });
};

G.drawDexThumbnail = function(canvas,fish){
  var ctx=canvas.getContext('2d');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  var fakeFish={x:canvas.width/2,y:canvas.height/2,vx:1,tailPhase:0,phase:0,alive:true,type:fish};
  var maxDim=Math.max(fish.w,fish.h);
  var scale=Math.min(canvas.width,canvas.height)*0.85/maxDim;
  var oldScale=G.FISH_SCALE, oldMode=G.mode;
  G.FISH_SCALE=scale;
  G.mode='dex';  // 避免shore模式的0.55缩放
  G.drawFish(ctx,fakeFish);
  G.FISH_SCALE=oldScale;
  G.mode=oldMode;
};

G.showDexDetail = function(fish, opts){
  var hidden = opts && opts.hidden;
  document.getElementById('dexDetailName').textContent = hidden ? '未发现' : fish.name;
  document.getElementById('dexDetailTier').textContent='Lv.'+fish.tier+' · '+G.TIER_NAMES[fish.tier-1];
  document.getElementById('dexDetailDesc').textContent = hidden ? '下海探索并吃掉这种鱼来解锁它的资料。' : fish.desc;
  if(hidden){
    document.getElementById('dexDetailStats').innerHTML='<div class="dex-detail-stat">??? 积分</div><div class="dex-detail-stat">??? 速度</div><div class="dex-detail-stat">??? 尺寸</div>';
  } else {
    document.getElementById('dexDetailStats').innerHTML=
      '<div class="dex-detail-stat"><strong>'+fish.points+'</strong>积分</div>'+
      '<div class="dex-detail-stat"><strong>'+fish.speed.toFixed(1)+'</strong>速度</div>'+
      '<div class="dex-detail-stat"><strong>'+fish.w+'x'+fish.h+'</strong>尺寸</div>';
  }
  // Swap canvas vs img in detail
  var imgSrc=G.getFishImg(fish.name);
  var holder=document.getElementById('dexDetailVisual');
  var silhouetteClass = hidden ? ' dex-detail-silhouette' : '';
  if(imgSrc){
    holder.innerHTML='<img src="'+imgSrc+'" class="dex-detail-img'+silhouetteClass+'" alt="'+fish.name+'">';
  } else {
    holder.innerHTML='<canvas id="dexDetailCanvas" width="360" height="280" class="'+(hidden?'dex-detail-silhouette':'')+'"></canvas>';
    var canvas=document.getElementById('dexDetailCanvas');
    var ctx=canvas.getContext('2d');
    var fakeFish={x:canvas.width/2,y:canvas.height/2,vx:1,tailPhase:0,phase:0,alive:true,type:fish};
    var maxDim=Math.max(fish.w,fish.h);
    var scale=Math.min(canvas.width,canvas.height)*0.85/maxDim;
    var oldScale=G.FISH_SCALE, oldMode=G.mode;
    G.FISH_SCALE=scale;
    G.mode='dex';
    G.drawFish(ctx,fakeFish);
    G.FISH_SCALE=oldScale;
    G.mode=oldMode;
  }
  document.getElementById('dexDetail').classList.add('show');
};

// ── 发现新物种 Flash 横幅 ──
G.showDiscoveryFlash = function(fish){
  var el=document.getElementById('dexFlash');
  var imgSrc=G.getFishImg(fish.name);
  var imgHtml=imgSrc?'<img class="dex-flash-img" src="'+imgSrc+'">':'';
  el.innerHTML=imgHtml+
    '<div class="dex-label">★ 发现新物种 ★</div>'+
    '<div class="dex-name">'+fish.name+'</div>'+
    '<div class="dex-desc">'+fish.desc+'</div>';
  el.classList.add('show');
  clearTimeout(G._flashTimeout);
  G._flashTimeout=setTimeout(function(){el.classList.remove('show');},3000);
};
