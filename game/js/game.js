// ── game.js — 游戏主逻辑 ──
var G = window.G;

// ── State ──
G.canvas = document.getElementById('c');
G.ctx = G.canvas.getContext('2d');
G.W = 0; G.H = 0; G.WATER_Y = 0; G.SHORE_X = 0;
G.time = 0; G.score = 0; G.fishCaught = 0;
G.mode = 'shore'; // 'shore' | 'ocean' | 'adventure'
G.paused = false;

G.owned = new Set(['rod_0','bait_0','hook_0','char_0']);
G.equipped = {rod:'rod_0',bait:'bait_0',hook:'hook_0',char:'char_0'};
G.avatarImg = null; G.avatarDataURL = null;
G.nickname = '渔夫';
G.oceanBestTier = 1; G.maxDepthReached = 0;
G.discovered = new Set();          // 已发现的鱼名集合

G.player = {
  x:0, y:0, targetX:0, targetY:0, facing:1, swimPhase:0,
  shoreX:0, shoreY:0, rodAngle:-0.6, castPower:0.5,
  tier:1, size:10, exp:0, eatenCount:0, dead:false, speed:5
};

G.hook = {active:false,x:0,y:0,vy:0,vx:0,caughtFish:null,reeling:false,reelSpeed:3,sinkTarget:0};
G.struggle = {active:false,fish:null,taps:0,target:8,timeLeft:0,perfect:false};
G.fishes = []; G.bubbles = []; G.seaweeds = [];
G.eggs = []; G.portals = []; G.particles = [];
G.cam = {x:0, y:0};
G.combo = {count:0, timer:0, lastScore:0};
G.screenShake = 0;
G.invincible = 0; // seconds remaining

// ── Helpers ──
G.getEquipped = function(cat){
  var item = G.SHOP[cat].find(function(i){return i.id===G.equipped[cat]});
  return item || G.SHOP[cat][0];
};
G.getDepth = function(){ return Math.max(0, (G.player.y - G.WATER_Y) * 0.5); };
G.getDepthZone = function(){
  var d=G.getDepth();
  for(var i=G.DEPTH_ZONES.length-1;i>=0;i--){ if(d>=G.DEPTH_ZONES[i].minDepth) return G.DEPTH_ZONES[i]; }
  return G.DEPTH_ZONES[0];
};

G.resize = function(){
  G.W=G.canvas.width=window.innerWidth; G.H=G.canvas.height=window.innerHeight;
  G.WATER_Y=G.H*0.38; G.SHORE_X=G.W*0.28;
  G.FISH_SCALE=Math.min(1.5, Math.max(0.8, Math.min(G.W,G.H)/450));
  // Keep shore player anchored to new shore/water edge
  if(G.mode==='shore'&&G.player){
    G.player.shoreX=G.SHORE_X-10;
    G.player.shoreY=G.WATER_Y-35;
    if(!G.hook.active){G.player.x=G.player.shoreX; G.player.y=G.player.shoreY;}
  }
};
G.initShorePos = function(){
  G.player.shoreX=G.SHORE_X-10; G.player.shoreY=G.WATER_Y-35;
  G.player.x=G.player.shoreX; G.player.y=G.player.shoreY;
};
G.save = function(){
  try{ localStorage.setItem('fishGame',JSON.stringify({
    score:G.score, fishCaught:G.fishCaught, owned:[...G.owned], equipped:G.equipped,
    avatarDataURL:G.avatarDataURL, nickname:G.nickname, oceanBestTier:G.oceanBestTier, maxDepthReached:G.maxDepthReached,
    discovered:[...G.discovered]
  })); }catch(e){}
};
G.load = function(){
  try{
    localStorage.removeItem('fishGame_score');
    var d=JSON.parse(localStorage.getItem('fishGame')); if(!d)return;
    G.score=d.score||0; G.fishCaught=d.fishCaught||0;
    if(d.owned) G.owned=new Set(d.owned);
    if(d.equipped){ for(var cat of ['rod','bait','hook','char']){
      if(d.equipped[cat] && G.SHOP[cat].find(function(i){return i.id===d.equipped[cat]})) G.equipped[cat]=d.equipped[cat];
    }}
    if(d.nickname) G.nickname=d.nickname;
    if(d.oceanBestTier) G.oceanBestTier=d.oceanBestTier;
    if(d.maxDepthReached) G.maxDepthReached=d.maxDepthReached;
    if(d.discovered) G.discovered=new Set(d.discovered);
    if(d.avatarDataURL){G.avatarDataURL=d.avatarDataURL;G.avatarImg=new Image();G.avatarImg.src=d.avatarDataURL;}
  }catch(e){console.warn('load error',e);}
};
G.spawnBubble = function(x,y){
  G.bubbles.push({x:x+(Math.random()-0.5)*10,y:y,r:1+Math.random()*3,vy:-0.5-Math.random()*1.5,life:1});
};
G.spawnEatParticles = function(x,y,color){
  for(var i=0;i<8;i++){
    var a=Math.random()*Math.PI*2, spd=1.5+Math.random()*3;
    G.particles.push({x:x,y:y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd,r:2+Math.random()*3,color:color,life:1});
  }
};

// ── Shore fish spawn ──
G.spawnShoreFish = function(){
  if(G.fishes.length>=G.MAX_SHORE_FISH)return;
  var pool=G.SHORE_FISH, rareBoost=G.getEquipped('bait').rare;
  var total=0; for(var t of pool){var f=t.freq;if(t.points>=25&&rareBoost>1)f*=rareBoost;total+=f;}
  var roll=Math.random()*total, cum=0, type=pool[0];
  for(var t of pool){var f=t.freq;if(t.points>=25&&rareBoost>1)f*=rareBoost;cum+=f;if(roll<cum){type=t;break;}}
  var minY=G.WATER_Y+30,maxY=G.H-50,minX=G.SHORE_X+40,maxX=G.W+300;
  G.fishes.push({type:type,x:minX+Math.random()*(maxX-minX),y:minY+Math.random()*(maxY-minY),
    vx:(Math.random()>0.5?1:-1)*(type.speed*(0.7+Math.random()*0.6)),
    vy:0,phase:Math.random()*Math.PI*2,tailPhase:Math.random()*Math.PI*2,alive:true,attracted:false,
    golden:Math.random()<0.05});
};

// ── Ocean fish spawn (depth-based) ──
G.spawnOceanFish = function(){
  if(G.fishes.length>=G.MAX_OCEAN_FISH)return;
  var zone=G.getDepthZone();
  var pool=G.OCEAN_FISH.filter(function(f){return zone.tiers.indexOf(f.tier)>=0});
  if(!pool.length) pool=G.OCEAN_FISH;
  var total=0; for(var t of pool)total+=t.freq;
  var roll=Math.random()*total, cum=0, type=pool[0];
  for(var t of pool){cum+=t.freq;if(roll<cum){type=t;break;}}
  var py=G.player.y, px=G.player.x;
  var side=Math.random()>0.5?1:-1;
  var spawnX=px+side*(G.W*0.5+Math.random()*G.W*0.5);
  var spawnY=py+(Math.random()-0.5)*G.H*0.8;
  spawnY=Math.max(G.WATER_Y+15,spawnY);
  G.fishes.push({type:type,x:spawnX,y:spawnY,
    vx:(Math.random()>0.5?1:-1)*(type.speed*(0.7+Math.random()*0.6)),
    vy:0,phase:Math.random()*Math.PI*2,tailPhase:Math.random()*Math.PI*2,alive:true,attracted:false,
    golden:Math.random()<0.03});
};

// ── Egg spawn ──
G.spawnEgg = function(){
  if(G.eggs.length>=3)return;
  var depth=G.getDepth();
  if(depth<100)return;
  var typeIdx=0;
  if(depth>1500) typeIdx=Math.floor(Math.random()*5);
  else if(depth>800) typeIdx=Math.floor(Math.random()*4);
  else if(depth>400) typeIdx=Math.floor(Math.random()*3);
  else typeIdx=Math.floor(Math.random()*2);
  var py=G.player.y+(Math.random()-0.3)*G.H;
  var px=G.player.x+(Math.random()-0.5)*G.W*1.2;
  G.eggs.push({x:px,y:Math.max(G.WATER_Y+50,py),type:G.EGG_TYPES[typeIdx],alive:true,phase:Math.random()*Math.PI*2});
};

// ── Portal spawn ──
G.spawnPortal = function(){
  if(G.portals.length>=1)return;
  if(G.getDepth()<300)return;
  var py=G.player.y+G.H*0.4+Math.random()*G.H*0.3;
  var px=G.player.x+(Math.random()-0.5)*G.W*0.8;
  G.portals.push({x:px,y:py,alive:true,phase:Math.random()*Math.PI*2,r:30+Math.random()*15});
};

// ── Mode Switching ──
G.enterShore = function(){
  // Save ocean progress before switching
  if(G.mode==='ocean'&&!G.player.dead){
    G.oceanSave={tier:G.player.tier,size:G.player.size,exp:G.player.exp,speed:G.player.speed,
      eatenCount:G.player.eatenCount,x:G.player.x,y:G.player.y};
  }
  G.mode='shore'; G.fishes.length=0; G.eggs.length=0; G.portals.length=0;
  G.initShorePos();
  for(var i=0;i<12;i++) G.spawnShoreFish();
  G.hook.active=false;
  document.getElementById('fishBtn').style.display='flex';
  document.getElementById('fishBtn').textContent='抛竿';
  document.getElementById('fishBtn').classList.remove('disabled');
  document.getElementById('modeBtn').textContent='下海';
  document.getElementById('oceanHud').style.display='none';
};

G.enterOcean = function(){
  G.mode='ocean'; G.fishes.length=0; G.eggs.length=0; G.portals.length=0; G.hook.active=false;
  G.struggle.active=false; G.updateStruggleUI&&G.updateStruggleUI();
  G.player.tier=1; G.player.size=G.TIER_SIZES[0]; G.player.exp=0;
  G.player.eatenCount=0; G.player.dead=false;
  G.player.speed=G.TIER_SPEEDS[0];
  G.player.x=G.W/2; G.player.y=G.WATER_Y+80;
  for(var i=0;i<20;i++) G.spawnOceanFish();
  document.getElementById('fishBtn').style.display='none';
  document.getElementById('modeBtn').textContent='上岸';
  G.updateOceanHud();
  document.getElementById('oceanHud').style.display='block';
};

G.resumeOcean = function(){
  var s=G.oceanSave;
  G.mode='ocean'; G.fishes.length=0; G.eggs.length=0; G.portals.length=0; G.hook.active=false;
  G.player.tier=s.tier; G.player.size=s.size; G.player.exp=s.exp;
  G.player.speed=s.speed; G.player.eatenCount=s.eatenCount;
  G.player.dead=false;
  G.player.x=s.x; G.player.y=s.y;
  G.oceanSave=null;
  for(var i=0;i<20;i++) G.spawnOceanFish();
  document.getElementById('fishBtn').style.display='none';
  document.getElementById('modeBtn').textContent='上岸';
  G.updateOceanHud();
  document.getElementById('oceanHud').style.display='block';
};

G.enterAdventure = function(){
  G.mode='adventure'; G.paused=false;
  G.adventure = G.adventure || {};
  var types=['platformer','maze','story'];
  G.adventure.type=types[Math.floor(Math.random()*3)];
  G.adventure.done=false; G.adventure.reward=0; G.adventure.time=0;
  if(G.adventure.type==='platformer') G.initPlatformer();
  else if(G.adventure.type==='maze') G.initMaze();
  else G.initStory();
  document.getElementById('modeBtn').style.display='none';
  document.getElementById('fishBtn').style.display='none';
  document.getElementById('oceanHud').style.display='none';
};

G.exitAdventure = function(reward){
  G.score+=reward; G.updateScoreUI(); G.save();
  G.showPopup('探险奖励 +'+reward);
  G.mode='ocean'; G.paused=false;
  document.getElementById('modeBtn').style.display='flex';
  document.getElementById('modeBtn').textContent='上岸';
  document.getElementById('oceanHud').style.display='block';
  G.updateOceanHud();
};

G.oceanSavedState = null;

G.updateOceanHud = function(){
  var p=G.player, needed=G.TIER_EXP[p.tier-1]||999;
  var depth=Math.round(G.getDepth());
  var zone=G.getDepthZone();
  if(depth>G.maxDepthReached){G.maxDepthReached=depth;}
  document.getElementById('oceanHud').innerHTML=
    '<div>Lv.'+p.tier+' | '+zone.name+'</div>'+
    '<div>深度: '+depth+'m</div>'+
    '<div>经验: '+p.exp+'/'+needed+' | 已吃: '+p.eatenCount+'</div>';
};

// 图鉴：首次捕获/吃到某种鱼时触发
// opts.bonus: true 则给 G.score 奖励双倍积分（PK 模式应传 false，不进总积分）
// 返回该次是否为首次发现
G.discoverFish = function(fishType, opts){
  if(G.discovered.has(fishType.name)) return false;
  G.discovered.add(fishType.name);
  if(!opts || opts.bonus!==false) G.score += fishType.points * 2;
  if(G.showDiscoveryFlash) G.showDiscoveryFlash(fishType);
  return true;
};

G.playerEat = function(fish){
  G.player.exp++; G.player.eatenCount++;
  G.discoverFish(fish.type);
  // Combo
  if(G.combo.timer>0){G.combo.count++;}else{G.combo.count=1;}
  G.combo.timer=2;
  var multiplier=Math.min(G.combo.count,5);
  var pts=Math.round(fish.type.points * G.getEquipped('hook').bonus * multiplier);
  G.score += pts; G.fishCaught++;
  G.combo.lastScore=pts;
  // Micro growth (size grows slightly each eat, not just on level up)
  G.player.size=Math.min(G.player.size+0.3, G.TIER_SIZES[Math.min(G.player.tier,11)]);
  // Particles + screen shake
  G.spawnEatParticles(fish.x,fish.y,fish.type.color);
  G.screenShake=0.15;
  // Level up check
  var needed = G.TIER_EXP[G.player.tier-1];
  if(needed && G.player.exp >= needed && G.player.tier < 12){
    G.player.tier++; G.player.exp=0;
    G.player.size=G.TIER_SIZES[G.player.tier-1];
    G.player.speed=G.TIER_SPEEDS[G.player.tier-1];
    if(G.player.tier > G.oceanBestTier) G.oceanBestTier=G.player.tier;
    G.invincible=3; // 3 seconds invincibility on level up
    G.showPopup('进化! Lv.'+G.player.tier);
  }else if(G.combo.count>=3){
    G.showPopup('Combo x'+G.combo.count+'! +'+pts);
  }
  G.updateOceanHud(); G.updateScoreUI(); G.save();
};

G.collectEgg = function(egg){
  egg.alive=false;
  var t=egg.type;
  G.score+=t.points;
  for(var i=0;i<t.sizeBoost;i++){
    if(G.player.tier<12){
      G.player.tier++; G.player.exp=0;
      G.player.size=G.TIER_SIZES[G.player.tier-1];
      G.player.speed=G.TIER_SPEEDS[G.player.tier-1];
    }
  }
  if(G.player.tier>G.oceanBestTier) G.oceanBestTier=G.player.tier;
  G.showPopup(t.name+' +'+t.points+'!');
  G.updateOceanHud(); G.updateScoreUI(); G.save();
};

G.playerDie = function(killer){
  if(G.invincible>0) return; // invincible, ignore
  G.player.dead=true; G.paused=true;
  G.showDeathPanel(killer);
};
G.revive = function(){
  if(G.score<10)return;
  G.score-=10; G.player.dead=false; G.paused=false;
  G.player.targetX=G.player.x; G.player.targetY=G.player.y;
  G.fishes.forEach(function(f){
    var dx=f.x-G.player.x,dy=f.y-G.player.y;
    if(Math.sqrt(dx*dx+dy*dy)<150) f.alive=false;
  });
  G.invincible=5;
  G.updateScoreUI(); G.save();
  document.getElementById('deathPanel').style.display='none';
};
G.restart = function(){
  G.player.dead=false; G.paused=false;
  G.oceanSave=null;
  document.getElementById('deathPanel').style.display='none';
  G.enterOcean();
};
G.updateScoreUI = function(){
  document.getElementById('score').textContent='积分: '+G.score;
  document.getElementById('count').textContent='钓鱼: '+G.fishCaught+'条';
};
G.showPopup = function(text){
  var el=document.getElementById('catchPopup');
  el.textContent=text; el.className='show';
  setTimeout(function(){el.className='show hide'},800);
  setTimeout(function(){el.className=''},1400);
};

// ── Update ──
G.update = function(dt){
  if(G.paused) return;
  G.time += dt/60;
  if(G.mode==='ocean') G.updateOcean(dt);
  else if(G.mode==='adventure') G.updateAdventure(dt);
  else if(G.mode==='pk') G.updatePK(dt);
  else G.updateShore(dt);
  // Bubbles
  for(var i=G.bubbles.length-1;i>=0;i--){
    var b=G.bubbles[i]; b.y+=b.vy; b.x+=Math.sin(G.time*3+i)*0.2; b.life-=0.008;
    if(b.life<=0||b.y<G.WATER_Y) G.bubbles.splice(i,1);
  }
  // Combo timer
  if(G.combo.timer>0){G.combo.timer-=dt/60;if(G.combo.timer<=0)G.combo.count=0;}
  // Invincibility timer
  if(G.invincible>0) G.invincible-=dt/60;
  // Screen shake decay
  if(G.screenShake>0) G.screenShake*=0.85;
  // Particles
  for(var i=G.particles.length-1;i>=0;i--){
    var pp=G.particles[i]; pp.x+=pp.vx; pp.y+=pp.vy; pp.life-=0.03; pp.r*=0.96;
    if(pp.life<=0) G.particles.splice(i,1);
  }
};

G.updateShore = function(dt){
  var p=G.player, h=G.hook;
  G.cam.x+=(0-G.cam.x)*0.05; G.cam.y+=(0-G.cam.y)*0.05;
  p.rodAngle=-0.6+Math.sin(G.time*0.8)*0.05;
  // Struggle QTE countdown
  if(G.struggle.active){
    G.struggle.timeLeft -= dt/60;
    if(G.struggle.timeLeft<=0){
      if(G.struggle.taps>=G.struggle.target){
        G.struggle.perfect=G.struggle.taps>=G.struggle.target*1.5;
        h.reeling=true; h.reelSpeed=2.5*G.getEquipped('rod').reel;
      }else{
        // Fish escapes
        if(h.caughtFish){h.caughtFish.attracted=false;h.caughtFish=null;}
        h.active=false;
        document.getElementById('fishBtn').classList.remove('disabled');
        G.showPopup('鱼跑了!');
      }
      G.struggle.active=false;
      G.updateStruggleUI();
    }
  }
  if(h.active){
    if(h.reeling){
      var ax=p.shoreX+Math.cos(p.rodAngle)*60, ay=p.shoreY+Math.sin(p.rodAngle)*60-15;
      var rdx=ax-h.x,rdy=ay-h.y,rd=Math.sqrt(rdx*rdx+rdy*rdy);
      if(rd<25){
        if(h.caughtFish){
          var mult=G.struggle.perfect?1.5:1;
          var basePts=h.caughtFish.type.points*G.getEquipped('hook').bonus*mult;
          if(h.caughtFish.golden) basePts*=5;
          var pts=Math.round(basePts);
          G.score+=pts; G.fishCaught++; h.caughtFish.alive=false;
          G.discoverFish(h.caughtFish.type);
          var label=h.caughtFish.type.name+' +'+pts;
          if(h.caughtFish.golden) label='金★'+label;
          else if(G.struggle.perfect) label='完美! '+label;
          G.showPopup(label);
          G.struggle.perfect=false;
          G.updateScoreUI(); G.save();
        }
        h.active=false; document.getElementById('fishBtn').classList.remove('disabled');
      }else{
        h.x+=(rdx/rd)*h.reelSpeed; h.y+=(rdy/rd)*h.reelSpeed;
        if(h.caughtFish){h.caughtFish.x=h.x;h.caughtFish.y=h.y;}
      }
    }else if(G.struggle.active){
      // During struggle, hook follows fish a bit with wiggle
      if(h.caughtFish){
        h.x += (h.caughtFish.x-h.x)*0.15 + (Math.random()-0.5)*3;
        h.y += (h.caughtFish.y-h.y)*0.15 + (Math.random()-0.5)*3;
      }
    }else{
      if(h.y<G.WATER_Y){h.x+=h.vx;h.vy+=0.15;h.y+=h.vy;}
      else if(h.y<h.sinkTarget){h.vx*=0.95;h.x+=h.vx;h.vy=Math.min(h.vy+0.03,1.5);h.y+=h.vy;
        h.x+=Math.sin(G.time*2)*0.2;}
      else{
        // Sunk — player can steer the hook with joystick
        h.vy=0; h.vx=0;
        var j=G.joystick;
        if(j.active){
          var jd=Math.sqrt(j.dx*j.dx+j.dy*j.dy);
          if(jd>2){
            var ratio=Math.min(1,jd/j.r);
            h.x += (j.dx/jd)*1.8*ratio;
            h.y += (j.dy/jd)*1.8*ratio;
          }
        }
        h.x=Math.max(G.SHORE_X+30,Math.min(G.W+200,h.x));
        h.y=Math.max(G.WATER_Y+20,Math.min(G.H-30,h.y));
      }
    }
  }
  var baitS=G.getEquipped('bait'), hookS=G.getEquipped('hook');
  for(var i=G.fishes.length-1;i>=0;i--){
    var f=G.fishes[i]; if(!f.alive){G.fishes.splice(i,1);continue;}
    f.phase+=0.02; f.tailPhase+=0.15; f.vy=Math.sin(f.phase)*0.3;
    f.x+=f.vx; f.y+=f.vy;
    if(Math.random()<0.005) f.vx*=-1;
    if(f.y<G.WATER_Y+25) f.vy+=0.5; if(f.y>G.H-35) f.vy-=0.5;
    if(f.x<G.SHORE_X+10) f.vx=Math.abs(f.vx);
    if(f.x>G.W+350) f.vx=-Math.abs(f.vx);
    if(h.active&&!h.reeling&&!h.caughtFish&&!G.struggle.active&&h.y>G.WATER_Y){
      var aR=90*baitS.attract, cR=15*hookS.range;
      var dx=h.x-f.x,dy=h.y-f.y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<aR&&Math.random()<0.02*baitS.attract) f.attracted=true;
      if(f.attracted&&d>5){f.x+=(dx/d)*0.8;f.y+=(dy/d)*0.5;}
      if(d<cR){
        h.caughtFish=f; f.attracted=false;
        G.struggle.active=true; G.struggle.fish=f; G.struggle.taps=0;
        G.struggle.target=6+Math.floor(f.type.tier*2);
        if(f.golden) G.struggle.target=Math.floor(G.struggle.target*1.4);
        G.struggle.timeLeft=2.0;
        G.updateStruggleUI();
      }
    }
    if(Math.random()<0.02) G.spawnBubble(f.x,f.y);
  }
  if(Math.random()<0.03) G.spawnShoreFish();
};

G.updateOcean = function(dt){
  var p=G.player;
  // Joystick-driven movement
  var j=G.joystick;
  if(j.active && (j.dx!==0||j.dy!==0)){
    var jd=Math.sqrt(j.dx*j.dx+j.dy*j.dy);
    var ratio=jd/j.r; // 0~1
    var spd=p.speed*ratio;
    p.x+=(j.dx/jd)*spd;
    p.y+=(j.dy/jd)*spd;
    if(j.dx!==0) p.facing=j.dx>0?1:-1;
    if(Math.random()<0.1*ratio) G.spawnBubble(p.x-p.facing*(p.size/2),p.y);
  }
  p.swimPhase+=0.08;
  p.y=Math.max(G.WATER_Y+10,p.y);

  G.cam.x+=(p.x-G.W/2-G.cam.x)*0.06;
  G.cam.y+=(p.y-G.H*0.45-G.cam.y)*0.04;

  // Fish AI
  var pR=p.size*0.4;
  for(var i=G.fishes.length-1;i>=0;i--){
    var f=G.fishes[i]; if(!f.alive){G.fishes.splice(i,1);continue;}
    f.phase+=0.02; f.tailPhase+=0.12+f.type.tier*0.02;
    f.vy=Math.sin(f.phase)*0.3;
    f.x+=f.vx; f.y+=f.vy;
    if(Math.random()<0.008) f.vx*=-1;
    if(f.y<G.WATER_Y+15) f.vy+=0.5;
    if(f.type.tier>p.tier+1){
      var cdx=p.x-f.x,cdy=p.y-f.y,cd=Math.sqrt(cdx*cdx+cdy*cdy);
      if(cd<200){f.x+=(cdx/cd)*0.3;f.y+=(cdy/cd)*0.2;}
    }
    if(f.type.tier<p.tier){
      var cdx2=p.x-f.x,cdy2=p.y-f.y,cd2=Math.sqrt(cdx2*cdx2+cdy2*cdy2);
      if(cd2<60){f.x-=(cdx2/cd2)*0.25;f.y-=(cdy2/cd2)*0.15;}
    }
    var fR=f.type.w*0.35;
    var cx=p.x-f.x,cy2=p.y-f.y,cd3=Math.sqrt(cx*cx+cy2*cy2);
    if(cd3<pR+fR){
      if(f.type.tier<=p.tier){ f.alive=false; G.playerEat(f); }
      else if(f.type.tier>p.tier+1){ G.playerDie(f.type.name); }
    }
    if(Math.abs(f.x-p.x)>G.W*1.5||Math.abs(f.y-p.y)>G.H*1.5) f.alive=false;
    if(Math.random()<0.015) G.spawnBubble(f.x,f.y);
  }
  if(Math.random()<0.12) G.spawnOceanFish();

  // Eggs
  if(Math.random()<0.008) G.spawnEgg();
  for(var i=G.eggs.length-1;i>=0;i--){
    var e=G.eggs[i]; if(!e.alive){G.eggs.splice(i,1);continue;}
    e.phase+=0.03;
    var edx=p.x-e.x,edy=p.y-e.y,ed=Math.sqrt(edx*edx+edy*edy);
    if(ed<p.size*0.5+15){ G.collectEgg(e); }
    if(Math.abs(e.x-p.x)>G.W*2||Math.abs(e.y-p.y)>G.H*2) e.alive=false;
  }

  // Portals
  if(Math.random()<0.003) G.spawnPortal();
  for(var i=G.portals.length-1;i>=0;i--){
    var pt=G.portals[i]; if(!pt.alive){G.portals.splice(i,1);continue;}
    pt.phase+=0.02;
    var pdx=p.x-pt.x,pdy=p.y-pt.y,pd=Math.sqrt(pdx*pdx+pdy*pdy);
    if(pd<pt.r+p.size*0.3){
      pt.alive=false;
      G.enterAdventure();
      return;
    }
    if(Math.abs(pt.x-p.x)>G.W*2||Math.abs(pt.y-p.y)>G.H*2) pt.alive=false;
  }

  G.updateOceanHud();
};

// ── Input (virtual joystick for ocean) ──
G.dragging=false; G.dragStartX=0; G.dragStartY=0; G.playerStartX=0; G.playerStartY=0;
G.joystick={active:false, cx:0, cy:0, dx:0, dy:0, r:60};

G.getPos=function(e){
  if(e.touches&&e.touches.length)return{x:e.touches[0].clientX,y:e.touches[0].clientY};
  return{x:e.clientX,y:e.clientY};
};
G.onDown=function(e){
  if(e.target!==G.canvas)return;
  if(G.mode==='adventure'&&G.onAdventureDown){G.onAdventureDown(e);return;}
  if(G.mode==='pk'&&G.onAdventureDown){G.onAdventureDown(e);return;}
  if(G.mode==='pk'&&(G.pk.introShown||G.pk.showingSwitch||G.pk.showingResult))return;
  var p=G.getPos(e);
  var shoreSteer = G.mode==='shore'&&G.hook.active&&!G.hook.reeling&&!G.struggle.active&&G.hook.y>=G.hook.sinkTarget;
  if(G.mode==='ocean'||G.mode==='pk'||shoreSteer){
    G.joystick.active=true;
    G.joystick.cx=p.x; G.joystick.cy=p.y;
    G.joystick.dx=0; G.joystick.dy=0;
  }else{
    G.dragging=true; G.dragStartX=p.x; G.dragStartY=p.y;
    G.playerStartX=G.player.castPower;
  }
};
G.onMove=function(e){
  e.preventDefault();
  var p=G.getPos(e);
  if(G.joystick.active){
    var jdx=p.x-G.joystick.cx, jdy=p.y-G.joystick.cy;
    var jd=Math.sqrt(jdx*jdx+jdy*jdy);
    var maxR=G.joystick.r;
    if(jd>maxR){jdx=(jdx/jd)*maxR;jdy=(jdy/jd)*maxR;}
    G.joystick.dx=jdx; G.joystick.dy=jdy;
  }else if(G.mode==='shore'&&G.dragging){
    G.player.castPower=Math.max(0.15,Math.min(1,G.playerStartX+(p.x-G.dragStartX)/300));
  }
};
G.onUp=function(e){
  // Check for fish tap (short tap = no significant drag)
  if(G.joystick.active&&(G.mode==='ocean'||G.mode==='pk')){
    var jd=Math.sqrt(G.joystick.dx*G.joystick.dx+G.joystick.dy*G.joystick.dy);
    if(jd<8){
      // It was a tap, check if tapped on a fish
      var tapX=G.joystick.cx+G.cam.x, tapY=G.joystick.cy+G.cam.y;
      var bestDist=9999, bestFish=null;
      for(var i=0;i<G.fishes.length;i++){
        var f=G.fishes[i]; if(!f.alive)continue;
        var dx=tapX-f.x, dy=tapY-f.y;
        var d=Math.sqrt(dx*dx+dy*dy);
        var hitR=Math.max(f.type.w,f.type.h)+20;
        if(d<hitR&&d<bestDist){bestDist=d;bestFish=f;}
      }
      if(bestFish){
        // 直接打开图鉴详情弹窗（DOM 弹窗，使用真实素材）
        if(G.showDexDetail) G.showDexDetail(bestFish.type);
      }
    }
  }
  G.dragging=false;
  G.joystick.active=false;
  G.joystick.dx=0; G.joystick.dy=0;
};

G.updateStruggleUI=function(){
  var btn=document.getElementById('struggleBtn');
  var bar=document.getElementById('struggleBar');
  if(!btn||!bar)return;
  if(G.struggle.active){
    btn.style.display='flex';
    bar.style.display='block';
    var pct=Math.min(100,(G.struggle.taps/G.struggle.target)*100);
    var fill=bar.querySelector('.struggle-fill');
    if(fill) fill.style.width=pct+'%';
    var label=bar.querySelector('.struggle-label');
    if(label) label.textContent=G.struggle.taps+' / '+G.struggle.target;
  }else{
    btn.style.display='none';
    bar.style.display='none';
  }
};
G.struggleTap=function(){
  if(!G.struggle.active)return;
  G.struggle.taps++;
  G.updateStruggleUI();
};

G.castHook=function(){
  if(G.hook.active||G.mode!=='shore')return;
  var h=G.hook,p=G.player; h.active=true;h.caughtFish=null;h.reeling=false;
  var tipX=p.shoreX+Math.cos(p.rodAngle)*60, tipY=p.shoreY+Math.sin(p.rodAngle)*60-15;
  h.x=tipX;h.y=tipY;
  var rod=G.getEquipped('rod');
  h.vx=(3+p.castPower*4)*rod.dist; h.vy=-3;
  h.sinkTarget=G.WATER_Y+40+p.castPower*(G.H-G.WATER_Y-80);
  document.getElementById('fishBtn').classList.add('disabled');
};
G.switchMode=function(){
  if(G.hook.active)return;
  if(G.mode==='shore'){
    if(G.oceanSave){
      document.getElementById('oceanChoicePanel').style.display='flex';
    }else{
      G.enterOcean();
    }
  }else if(G.mode==='ocean') G.enterShore();
};

// ── PK Mode (turn-based) ──
G.pk = {active:false, turn:0, round:0, maxRounds:3, turnTime:30, timer:0,
  scores:[0,0], roundScores:[0,0], showingSwitch:false, showingResult:false, introShown:false};

G.enterPK = function(){
  G.pk.active=true; G.pk.turn=0; G.pk.round=0; G.pk.timer=G.pk.turnTime;
  G.pk.scores=[0,0]; G.pk.roundScores=[0,0];
  G.pk.showingSwitch=false; G.pk.showingResult=false; G.pk.introShown=false;
  G.mode='pk'; G.paused=false;
  G.fishes.length=0; G.eggs.length=0; G.portals.length=0;
  G.player.tier=1; G.player.size=G.TIER_SIZES[0]; G.player.exp=0;
  G.player.eatenCount=0; G.player.dead=false; G.player.speed=G.TIER_SPEEDS[0];
  G.player.x=G.W/2; G.player.y=G.WATER_Y+80;
  document.getElementById('fishBtn').style.display='none';
  document.getElementById('modeBtn').style.display='none';
  document.getElementById('oceanHud').style.display='none';
  // Show intro
  G.pk.introShown=true;
};

G.pkStartTurn = function(){
  G.pk.showingSwitch=false;
  G.pk.timer=G.pk.turnTime;
  G.pk.roundScores[G.pk.turn]=0;
  G.fishes.length=0;
  G.player.tier=1; G.player.size=G.TIER_SIZES[0]; G.player.exp=0;
  G.player.eatenCount=0; G.player.dead=false; G.player.speed=G.TIER_SPEEDS[0];
  G.player.x=G.W/2; G.player.y=G.WATER_Y+80;
  for(var i=0;i<20;i++) G.spawnOceanFish();
};

G.updatePK = function(dt){
  var pk=G.pk;
  if(pk.introShown||pk.showingSwitch||pk.showingResult) return;
  pk.timer-=dt/60;
  // Same as ocean update
  var p=G.player, j=G.joystick;
  if(j.active&&(j.dx!==0||j.dy!==0)){
    var jd=Math.sqrt(j.dx*j.dx+j.dy*j.dy);
    var ratio=jd/j.r;
    p.x+=(j.dx/jd)*p.speed*ratio; p.y+=(j.dy/jd)*p.speed*ratio;
    if(j.dx!==0) p.facing=j.dx>0?1:-1;
  }
  p.swimPhase+=0.08; p.y=Math.max(G.WATER_Y+10,p.y);
  G.cam.x+=(p.x-G.W/2-G.cam.x)*0.06;
  G.cam.y+=(p.y-G.H*0.45-G.cam.y)*0.04;
  var pR=p.size*0.4;
  for(var i=G.fishes.length-1;i>=0;i--){
    var f=G.fishes[i]; if(!f.alive){G.fishes.splice(i,1);continue;}
    f.phase+=0.02; f.tailPhase+=0.12+f.type.tier*0.02;
    f.vy=Math.sin(f.phase)*0.3; f.x+=f.vx; f.y+=f.vy;
    if(Math.random()<0.008) f.vx*=-1;
    if(f.y<G.WATER_Y+15) f.vy+=0.5;
    if(f.type.tier<p.tier){var cdx=p.x-f.x,cdy=p.y-f.y,cd=Math.sqrt(cdx*cdx+cdy*cdy);if(cd<60){f.x-=(cdx/cd)*0.25;f.y-=(cdy/cd)*0.15;}}
    var fR=f.type.w*0.35;
    var cx2=p.x-f.x,cy2=p.y-f.y,cd3=Math.sqrt(cx2*cx2+cy2*cy2);
    if(cd3<pR+fR&&f.type.tier<=p.tier){
      f.alive=false; p.exp++; p.eatenCount++;
      var pts=f.type.points;
      pk.roundScores[pk.turn]+=pts;
      G.discoverFish(f.type, {bonus:false});  // PK 不给总积分奖励
      var needed=G.TIER_EXP[p.tier-1];
      if(needed&&p.exp>=needed&&p.tier<12){p.tier++;p.exp=0;p.size=G.TIER_SIZES[p.tier-1];p.speed=G.TIER_SPEEDS[p.tier-1];G.showPopup('升级! Lv.'+p.tier);}
    }
    if(Math.abs(f.x-p.x)>G.W*1.5||Math.abs(f.y-p.y)>G.H*1.5) f.alive=false;
  }
  if(Math.random()<0.06) G.spawnOceanFish();
  // Timer up
  if(pk.timer<=0){
    pk.scores[pk.turn]+=pk.roundScores[pk.turn];
    if(pk.turn===0){
      pk.turn=1; pk.showingSwitch=true;
    }else{
      pk.turn=0; pk.round++;
      if(pk.round>=pk.maxRounds){ pk.showingResult=true; }
      else{ pk.showingSwitch=true; }
    }
  }
};

G.exitPK = function(){
  G.pk.active=false; G.mode='shore';
  document.getElementById('modeBtn').style.display='flex';
  G.enterShore();
};

// ── Init & Loop ──
G.init=function(){
  G.resize(); G.load(); G.initShorePos();
  for(var i=0;i<18;i++) G.seaweeds.push({
    x:G.SHORE_X+30+Math.random()*(G.W+400),h:20+Math.random()*55,
    phase:Math.random()*Math.PI*2,color:['#2D8B4E','#1A6B3A','#3A9B5E','#1B7B44'][i%4]
  });
  for(var i=0;i<12;i++) G.spawnShoreFish();
  G.updateScoreUI();
  window.addEventListener('resize',G.resize);
  G.canvas.addEventListener('mousedown',G.onDown);
  G.canvas.addEventListener('mousemove',G.onMove);
  G.canvas.addEventListener('mouseup',G.onUp);
  G.canvas.addEventListener('touchstart',G.onDown,{passive:false});
  G.canvas.addEventListener('touchmove',G.onMove,{passive:false});
  G.canvas.addEventListener('touchend',G.onUp);
  document.getElementById('fishBtn').addEventListener('click',G.castHook);
  document.getElementById('modeBtn').addEventListener('click',G.switchMode);
  var sb=document.getElementById('struggleBtn');
  if(sb){
    sb.addEventListener('click',function(e){e.stopPropagation();G.struggleTap();});
    sb.addEventListener('touchstart',function(e){e.stopPropagation();e.preventDefault();G.struggleTap();},{passive:false});
  }
  var lastTime=0;
  function loop(ts){
    var dt=Math.min((ts-lastTime)/16.67,3); lastTime=ts;
    G.update(dt); G.draw(); requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
};
