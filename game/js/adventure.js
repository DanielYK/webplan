// ── adventure.js — 探险模式（横版闯关/迷宫/对话剧情）──
var G = window.G;
G.adventure = {};

// ── Shared: intro screen before each adventure ──
G.updateAdventure = function(dt){
  var a=G.adventure;
  if(a.showingIntro) return; // paused on intro screen
  a.time+=dt/60;
  if(a.type==='platformer') G.updatePlatformer(dt);
  else if(a.type==='maze') G.updateMaze(dt);
  else G.updateStory(dt);
};
G.drawAdventure = function(ctx){
  var a=G.adventure;
  ctx.clearRect(0,0,G.W,G.H);
  if(a.showingIntro){ G.drawIntro(ctx); return; }
  if(a.type==='platformer') G.drawPlatformer(ctx);
  else if(a.type==='maze') G.drawMaze(ctx);
  else G.drawStory(ctx);
};
G.onAdventureDown = null;

// ── Intro screen ──
G.drawIntro = function(ctx){
  var a=G.adventure, W=G.W, H=G.H;
  var bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#0A1628');bg.addColorStop(1,'#050A14');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  // Particles
  for(var i=0;i<15;i++){
    var px=((i*73+G.time*5)%W),py=((i*97+G.time*2)%H);
    ctx.beginPath();ctx.arc(px,py,1.5,0,Math.PI*2);ctx.fillStyle='rgba(100,150,200,0.25)';ctx.fill();
  }
  // Title
  ctx.textAlign='center';
  ctx.fillStyle='#FFD700';ctx.font='bold 28px sans-serif';
  ctx.fillText(a.introTitle,W/2,H*0.22);
  // Rules
  ctx.fillStyle='rgba(255,255,255,0.85)';ctx.font='15px sans-serif';
  var y0=H*0.35;
  for(var i=0;i<a.introRules.length;i++){
    ctx.fillText(a.introRules[i],W/2,y0+i*28);
  }
  // Start button
  var bw=180,bh=48,bx=W/2-bw/2,by=H*0.72;
  ctx.fillStyle='rgba(74,230,138,0.2)';ctx.fillRect(bx,by,bw,bh);
  ctx.strokeStyle='#4AE68A';ctx.lineWidth=2;ctx.strokeRect(bx,by,bw,bh);
  ctx.fillStyle='#4AE68A';ctx.font='bold 18px sans-serif';
  ctx.fillText('开始探险',W/2,by+31);
  a._introBtn={x:bx,y:by,w:bw,h:bh};
};

G.showIntro = function(title,rules,onStart){
  var a=G.adventure;
  a.showingIntro=true;
  a.introTitle=title;
  a.introRules=rules;
  G.onAdventureDown=function(e){
    var p=G.getPos(e);
    var b=a._introBtn;
    if(b&&p.x>=b.x&&p.x<=b.x+b.w&&p.y>=b.y&&p.y<=b.y+b.h){
      a.showingIntro=false;
      onStart();
    }
  };
};

// ══════════════════════════════════
// A. Platformer — auto-scroll, tap to jump
// ══════════════════════════════════
G.initPlatformer = function(){
  var a=G.adventure;
  a.px=80; a.py=0; a.vy=0; a.grounded=false;
  a.scrollX=0; a.coins=0; a.dist=0; a.done=false;
  a.groundY=G.H*0.7;
  a.obstacles=[]; a.coinItems=[];
  for(var i=0;i<15;i++){
    a.obstacles.push({x:300+i*220+Math.random()*100, w:20+Math.random()*20, h:30+Math.random()*40});
  }
  for(var i=0;i<20;i++){
    a.coinItems.push({x:250+i*180+Math.random()*80, y:a.groundY-50-Math.random()*80, alive:true});
  }
  a.py=a.groundY;
  G.showIntro('深海洞穴闯关',[
    '你掉进了一个神秘的海底洞穴!',
    '',
    '规则:',
    '· 点击屏幕跳跃，躲避障碍物',
    '· 收集金币获得积分',
    '· 撞到障碍物游戏结束',
    '· 跑完全程通关，获得额外奖励'
  ],function(){
    G.onAdventureDown=function(){if(a.grounded){a.vy=-8;a.grounded=false;}};
  });
};
G.updatePlatformer = function(dt){
  var a=G.adventure; if(a.done)return;
  a.scrollX+=3; a.dist+=3;
  a.vy+=0.35; a.py+=a.vy;
  if(a.py>=a.groundY){a.py=a.groundY;a.vy=0;a.grounded=true;}
  for(var o of a.obstacles){
    var ox=o.x-a.scrollX;
    if(ox>a.px-15&&ox<a.px+15&&a.py>a.groundY-o.h){
      a.done=true;
      G.showPopup('探险结束! +'+a.coins*10);
      setTimeout(function(){G.exitAdventure(a.coins*10);},1500);
      return;
    }
  }
  for(var c of a.coinItems){
    if(!c.alive)continue;
    var cx2=c.x-a.scrollX;
    if(Math.abs(cx2-a.px)<20&&Math.abs(c.y-a.py)<20){c.alive=false;a.coins++;}
  }
  if(a.dist>3500){
    a.done=true;
    var reward=a.coins*10+100;
    G.showPopup('通关! +'+reward);
    setTimeout(function(){G.exitAdventure(reward);},1500);
  }
};
G.drawPlatformer = function(ctx){
  var a=G.adventure, W=G.W, H=G.H;
  var bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#1A0A2E');bg.addColorStop(1,'#0A0518');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#3A2A1A';ctx.fillRect(0,a.groundY,W,H-a.groundY);
  ctx.fillStyle='#4A3A2A';ctx.fillRect(0,a.groundY,W,4);
  for(var i=0;i<8;i++){
    var sx=(i*130-a.scrollX%130+130)%W;
    ctx.fillStyle='#2A1A3A';
    ctx.beginPath();ctx.moveTo(sx-8,0);ctx.lineTo(sx,30+i%3*15);ctx.lineTo(sx+8,0);ctx.fill();
  }
  for(var o of a.obstacles){
    var ox=o.x-a.scrollX;
    if(ox<-50||ox>W+50)continue;
    ctx.fillStyle='#5A3A2A';ctx.fillRect(ox-o.w/2,a.groundY-o.h,o.w,o.h);
    ctx.fillStyle='rgba(255,255,255,0.05)';ctx.fillRect(ox-o.w/2,a.groundY-o.h,o.w/3,o.h);
  }
  for(var c of a.coinItems){
    if(!c.alive)continue;
    var cx2=c.x-a.scrollX;
    if(cx2<-30||cx2>W+30)continue;
    ctx.beginPath();ctx.arc(cx2,c.y,8,0,Math.PI*2);ctx.fillStyle='#FFD700';ctx.fill();
    ctx.beginPath();ctx.arc(cx2-2,c.y-2,3,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.4)';ctx.fill();
  }
  var skin=G.getEquipped('char').skin;
  var bodyC=skin==='pirate'?'#333':skin==='captain'?'#E8E8E8':skin==='mermaid'?'#A78BFA':'#D94040';
  ctx.fillStyle=bodyC;
  ctx.beginPath();ctx.ellipse(a.px,a.py-15,10,15,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#FFD5A0';ctx.beginPath();ctx.arc(a.px,a.py-32,8,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#333';ctx.beginPath();ctx.arc(a.px+3,a.py-33,1.5,0,Math.PI*2);ctx.fill();
  var legA=Math.sin(a.time*8)*0.3;
  ctx.fillStyle='#3A5BA0';
  ctx.save();ctx.translate(a.px-3,a.py);ctx.rotate(legA);ctx.fillRect(-2,0,4,10);ctx.restore();
  ctx.save();ctx.translate(a.px+3,a.py);ctx.rotate(-legA);ctx.fillRect(-2,0,4,10);ctx.restore();
  // HUD — right side to avoid overlap with top-bar
  ctx.textAlign='right';
  ctx.fillStyle='#FFD700';ctx.font='bold 15px sans-serif';
  ctx.fillText('金币: '+a.coins,W-16,28);
  ctx.fillText('距离: '+Math.round(a.dist/35)+'m',W-16,48);
  ctx.textAlign='left';
  if(!a.done){ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='14px sans-serif';ctx.fillText('点击屏幕跳跃',W/2-40,H-20);}
};

// ══════════════════════════════════
// B. Maze
// ══════════════════════════════════
G.initMaze = function(){
  var a=G.adventure;
  a.cols=9; a.rows=7; a.cellW=0; a.cellH=0; a.timer=60;
  a.mx=0; a.my=0; a.exitX=a.cols-1; a.exitY=a.rows-1;
  a.coins=0; a.done=false;

  // Generate maze with recursive backtracking
  a.grid=[];
  for(var y=0;y<a.rows;y++){a.grid[y]=[];for(var x=0;x<a.cols;x++){a.grid[y][x]={n:true,s:true,e:true,w:true,visited:false};}}
  var stack=[];
  var sx=0,sy=0;
  a.grid[sy][sx].visited=true;
  stack.push({x:sx,y:sy});
  while(stack.length>0){
    var cur=stack[stack.length-1];
    var neighbors=[];
    if(cur.y>0&&!a.grid[cur.y-1][cur.x].visited) neighbors.push({x:cur.x,y:cur.y-1,dir:'n',opp:'s'});
    if(cur.y<a.rows-1&&!a.grid[cur.y+1][cur.x].visited) neighbors.push({x:cur.x,y:cur.y+1,dir:'s',opp:'n'});
    if(cur.x>0&&!a.grid[cur.y][cur.x-1].visited) neighbors.push({x:cur.x-1,y:cur.y,dir:'w',opp:'e'});
    if(cur.x<a.cols-1&&!a.grid[cur.y][cur.x+1].visited) neighbors.push({x:cur.x+1,y:cur.y,dir:'e',opp:'w'});
    if(neighbors.length>0){
      var next=neighbors[Math.floor(Math.random()*neighbors.length)];
      a.grid[cur.y][cur.x][next.dir]=false;
      a.grid[next.y][next.x][next.opp]=false;
      a.grid[next.y][next.x].visited=true;
      stack.push({x:next.x,y:next.y});
    }else{ stack.pop(); }
  }

  a.treasures=[];
  for(var i=0;i<6;i++){
    var tx=Math.floor(Math.random()*a.cols),ty=Math.floor(Math.random()*a.rows);
    if(!(tx===0&&ty===0)&&!(tx===a.exitX&&ty===a.exitY))
      a.treasures.push({x:tx,y:ty,alive:true});
  }

  G.showIntro('深海迷宫',[
    '你被困在了一座海底迷宫中!',
    '',
    '规则:',
    '· 滑动或点击相邻格子移动',
    '· 收集金色宝箱获得积分',
    '· 在60秒内找到右下角的出口',
    '· 超时只能获得部分奖励'
  ],function(){
    a.swipeStart=null;
    G.onAdventureDown=function(e){
      if(a.done)return;
      var p=G.getPos(e);
      a.swipeStart={x:p.x,y:p.y};
    };
    G.canvas.addEventListener('mouseup',mazeTryMove);
    G.canvas.addEventListener('touchend',mazeTryMove);
  });

  function mazeTryMove(e){
    if(!a.swipeStart||a.done)return;
    var p;
    if(e.changedTouches&&e.changedTouches.length) p={x:e.changedTouches[0].clientX,y:e.changedTouches[0].clientY};
    else p={x:e.clientX,y:e.clientY};
    var sdx=p.x-a.swipeStart.x, sdy=p.y-a.swipeStart.y;
    var sd=Math.sqrt(sdx*sdx+sdy*sdy);
    a.swipeStart=null;
    if(sd<8){
      var cw=a.cellW,ch=a.cellH,oxx=(G.W-a.cols*cw)/2,oyy=(G.H-a.rows*ch)/2;
      var ttx=Math.floor((p.x-oxx)/cw),tty=Math.floor((p.y-oyy)/ch);
      if(ttx>=0&&ttx<a.cols&&tty>=0&&tty<a.rows&&Math.abs(ttx-a.mx)+Math.abs(tty-a.my)===1){
        tryMoveDir(ttx-a.mx,tty-a.my);
      }
      return;
    }
    if(Math.abs(sdx)>Math.abs(sdy)) tryMoveDir(sdx>0?1:-1,0);
    else tryMoveDir(0,sdy>0?1:-1);
  }
  function tryMoveDir(ddx,ddy){
    var cell=a.grid[a.my][a.mx];
    var blocked=false;
    if(ddx===1) blocked=cell.e;
    else if(ddx===-1) blocked=cell.w;
    else if(ddy===1) blocked=cell.s;
    else if(ddy===-1) blocked=cell.n;
    var nx=a.mx+ddx,ny=a.my+ddy;
    if(!blocked&&nx>=0&&nx<a.cols&&ny>=0&&ny<a.rows){ a.mx=nx; a.my=ny; }
  }
  a._cleanup=function(){
    G.canvas.removeEventListener('mouseup',mazeTryMove);
    G.canvas.removeEventListener('touchend',mazeTryMove);
  };
};
G.updateMaze = function(dt){
  var a=G.adventure; if(a.done)return;
  a.cellW=Math.min(50,(G.W-40)/a.cols); a.cellH=a.cellW;
  a.timer-=dt/60;
  for(var t of a.treasures){if(t.alive&&t.x===a.mx&&t.y===a.my){t.alive=false;a.coins++;G.showPopup('宝箱 +30!');}}
  if(a.mx===a.exitX&&a.my===a.exitY){
    a.done=true;var reward=a.coins*30+80;
    G.showPopup('逃出迷宫! +'+reward);
    if(a._cleanup)a._cleanup();
    setTimeout(function(){G.exitAdventure(reward);},1500);
  }
  if(a.timer<=0&&!a.done){
    a.done=true;var reward2=a.coins*20;
    G.showPopup('时间到! +'+reward2);
    if(a._cleanup)a._cleanup();
    setTimeout(function(){G.exitAdventure(reward2);},1500);
  }
};
G.drawMaze = function(ctx){
  var a=G.adventure, W=G.W, H=G.H;
  ctx.fillStyle='#06060F';ctx.fillRect(0,0,W,H);
  var cw=a.cellW,ch=a.cellH;
  var ox=(W-a.cols*cw)/2,oy=(H-a.rows*ch)/2;
  var wallW=4;
  for(var y=0;y<a.rows;y++){for(var x=0;x<a.cols;x++){
    var wx=ox+x*cw+wallW/2,wy=oy+y*ch+wallW/2;
    var fw=cw-wallW,fh=ch-wallW;
    ctx.fillStyle='#1C1C34';ctx.fillRect(wx,wy,fw,fh);
    var cell=a.grid[y][x];
    ctx.fillStyle='#1C1C34';
    if(!cell.e&&x<a.cols-1) ctx.fillRect(wx+fw,wy,wallW,fh);
    if(!cell.s&&y<a.rows-1) ctx.fillRect(wx,wy+fh,fw,wallW);
  }}
  ctx.strokeStyle='#7A60AA';ctx.lineWidth=wallW;ctx.lineCap='round';
  for(var y=0;y<a.rows;y++){for(var x=0;x<a.cols;x++){
    var wx=ox+x*cw,wy2=oy+y*ch;
    var cell=a.grid[y][x];
    if(cell.n){ctx.beginPath();ctx.moveTo(wx,wy2);ctx.lineTo(wx+cw,wy2);ctx.stroke();}
    if(cell.s){ctx.beginPath();ctx.moveTo(wx,wy2+ch);ctx.lineTo(wx+cw,wy2+ch);ctx.stroke();}
    if(cell.w){ctx.beginPath();ctx.moveTo(wx,wy2);ctx.lineTo(wx,wy2+ch);ctx.stroke();}
    if(cell.e){ctx.beginPath();ctx.moveTo(wx+cw,wy2);ctx.lineTo(wx+cw,wy2+ch);ctx.stroke();}
  }}
  var ex=ox+a.exitX*cw,ey=oy+a.exitY*ch;
  var eg=ctx.createRadialGradient(ex+cw/2,ey+ch/2,5,ex+cw/2,ey+ch/2,cw*0.8);
  eg.addColorStop(0,'rgba(74,230,138,0.5)');eg.addColorStop(1,'rgba(74,230,138,0)');
  ctx.fillStyle=eg;ctx.fillRect(ex,ey,cw,ch);
  ctx.fillStyle='#4AE68A';ctx.font='bold '+Math.round(cw*0.25)+'px sans-serif';ctx.textAlign='center';
  ctx.fillText('EXIT',ex+cw/2,ey+ch*0.6);
  ctx.fillStyle='rgba(100,180,255,0.15)';ctx.fillRect(ox+wallW/2,oy+wallW/2,cw-wallW,ch-wallW);
  for(var t of a.treasures){if(!t.alive)continue;
    var tcx=ox+t.x*cw+cw/2,tcy=oy+t.y*ch+ch/2;
    ctx.fillStyle='#FFD700';ctx.beginPath();ctx.arc(tcx,tcy,cw*0.15,0,Math.PI*2);ctx.fill();
  }
  var pcx=ox+a.mx*cw+cw/2,pcy=oy+a.my*ch+ch/2;
  var skin=G.getEquipped('char').skin;
  var pc=skin==='pirate'?'#FF6B6B':skin==='captain'?'#60D0FF':skin==='mermaid'?'#C084FC':'#FF8C42';
  var pg=ctx.createRadialGradient(pcx,pcy,2,pcx,pcy,cw*0.45);
  pg.addColorStop(0,pc);pg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.globalAlpha=0.3;ctx.fillStyle=pg;ctx.fillRect(pcx-cw*0.5,pcy-ch*0.5,cw,ch);ctx.globalAlpha=1;
  ctx.fillStyle=pc;ctx.beginPath();ctx.arc(pcx,pcy,cw*0.22,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#FFF';ctx.beginPath();ctx.arc(pcx+cw*0.06,pcy-cw*0.04,cw*0.06,0,Math.PI*2);ctx.fill();
  // HUD — right side
  ctx.textAlign='right';
  ctx.fillStyle='#FFD700';ctx.font='bold 15px sans-serif';
  ctx.fillText('宝箱: '+a.coins,W-16,28);
  ctx.fillText('时间: '+Math.ceil(a.timer)+'s',W-16,48);
  ctx.textAlign='left';
  ctx.fillStyle='rgba(255,255,255,0.4)';ctx.font='13px sans-serif';
  ctx.fillText('滑动或点击相邻格子移动',16,H-15);
};

// ══════════════════════════════════
// C. Story — dialogue with choices
// ══════════════════════════════════
G.initStory = function(){
  var a=G.adventure;
  a.story=G.STORIES[Math.floor(Math.random()*G.STORIES.length)];
  a.round=0;a.totalReward=0;a.done=false;a.tierUps=0;
  G.showIntro('深海奇遇',[
    '你发现了一个神秘的存在...',
    '',
    '规则:',
    '· 与深海生物对话',
    '· 每轮选择一个回答',
    '· 不同选择获得不同奖励',
    '· 可能获得积分或直接升级!'
  ],function(){
    G.onAdventureDown=null;
  });
};
G.updateStory = function(dt){};
G.drawStory = function(ctx){
  var a=G.adventure, W=G.W, H=G.H, s=a.story;
  var bg=ctx.createLinearGradient(0,0,0,H);
  bg.addColorStop(0,'#0A1628');bg.addColorStop(1,'#050A14');
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  for(var i=0;i<20;i++){
    var px2=((i*73+G.time*5)%W),py2=((i*97+G.time*2)%H);
    ctx.beginPath();ctx.arc(px2,py2,1,0,Math.PI*2);ctx.fillStyle='rgba(100,150,200,0.3)';ctx.fill();
  }
  if(a.done){
    ctx.fillStyle='#FFD700';ctx.font='bold 24px sans-serif';ctx.textAlign='center';
    ctx.fillText('探险结束',W/2,H/2-20);
    ctx.fillStyle='#FFF';ctx.font='16px sans-serif';
    ctx.fillText('获得 '+a.totalReward+' 积分'+(a.tierUps>0?' + 升'+a.tierUps+'级':''),W/2,H/2+15);
    return;
  }
  var round=s.rounds[a.round];
  ctx.fillStyle=s.npcColor;ctx.beginPath();ctx.arc(W/2,H*0.25,35,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#FFF';ctx.font='bold 14px sans-serif';ctx.textAlign='center';
  ctx.fillText(s.npc,W/2,H*0.25+50);
  ctx.fillStyle='rgba(255,255,255,0.9)';ctx.font='15px sans-serif';
  var lines=wrapText(round.text,W*0.8,ctx);
  for(var i=0;i<lines.length;i++){ctx.fillText(lines[i],W/2,H*0.42+i*22);}
  var choiceY=H*0.6;
  for(var i=0;i<round.choices.length;i++){
    var ch=round.choices[i];
    var bx=W*0.15,by=choiceY+i*50,bw=W*0.7,bh=40;
    ctx.fillStyle='rgba(60,80,120,0.6)';
    ctx.fillRect(bx,by,bw,bh);ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=1;ctx.strokeRect(bx,by,bw,bh);
    ctx.fillStyle='#FFF';ctx.font='14px sans-serif';ctx.fillText(ch.text,W/2,by+25);
    ch._rect={x:bx,y:by,w:bw,h:bh};
  }
  G.onAdventureDown=function(e){
    if(a.done)return;
    var p=G.getPos(e);
    var round2=s.rounds[a.round];
    for(var i=0;i<round2.choices.length;i++){
      var r=round2.choices[i]._rect;
      if(p.x>=r.x&&p.x<=r.x+r.w&&p.y>=r.y&&p.y<=r.y+r.h){
        var rew=round2.choices[i].reward;
        a.totalReward+=(rew.points||0);
        a.tierUps+=(rew.tierUp||0);
        a.round++;
        if(a.round>=s.rounds.length){
          a.done=true;
          for(var j=0;j<a.tierUps;j++){
            if(G.player.tier<6){G.player.tier++;G.player.size=G.TIER_SIZES[G.player.tier-1];G.player.speed=G.TIER_SPEEDS[G.player.tier-1];}
          }
          setTimeout(function(){G.exitAdventure(a.totalReward);},2000);
        }
        break;
      }
    }
  };
};

function wrapText(text,maxW,ctx){
  var words=text.split('');var lines=[];var line='';
  for(var i=0;i<words.length;i++){
    var test=line+words[i];
    if(ctx.measureText(test).width>maxW&&line.length>0){lines.push(line);line=words[i];}
    else{line=test;}
  }
  if(line)lines.push(line);
  return lines;
}
