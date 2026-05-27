// ── render.js — 所有Canvas绘制 ──
var G = window.G;
// darkenColor is provided by fish-render.js
function darkenColor(c,f){ return G.darkenColor(c,f); }

G.draw = function(){
  var ctx=G.ctx, W=G.W, H=G.H;
  if(G.mode==='adventure'){G.drawAdventure(ctx);return;}
  if(G.mode==='pk'&&G.pk.introShown){G.drawPKIntro(ctx);return;}
  if(G.mode==='pk'&&G.pk.showingSwitch){G.drawPKSwitch(ctx);return;}
  if(G.mode==='pk'&&G.pk.showingResult){G.drawPKResult(ctx);return;}
  ctx.clearRect(0,0,W,H); ctx.save();
  var cx=Math.round(G.cam.x), cy=Math.round(G.cam.y);
  // Screen shake
  if(G.screenShake>0.01){
    cx+=Math.round((Math.random()-0.5)*G.screenShake*12);
    cy+=Math.round((Math.random()-0.5)*G.screenShake*12);
  }
  ctx.translate(-cx,-cy);

  var isOcean=G.mode==='ocean';
  var depth=isOcean?G.getDepth():0;
  var zone=isOcean?G.getDepthZone():G.DEPTH_ZONES[0];

  // Sky — always visible when camera is above water
  if(cy<G.WATER_Y+50){
    var sky=ctx.createLinearGradient(0,cy,0,G.WATER_Y);
    sky.addColorStop(0,'#3A7BD5');sky.addColorStop(0.5,'#6DB3F2');sky.addColorStop(1,'#A8D8F0');
    ctx.fillStyle=sky;ctx.fillRect(cx,cy,W,G.WATER_Y-cy+10);
    var sunX=cx+W-80,sunY=cy+50;
    var sg=ctx.createRadialGradient(sunX,sunY,10,sunX,sunY,60);
    sg.addColorStop(0,'rgba(255,250,200,0.9)');sg.addColorStop(1,'rgba(255,240,150,0)');
    ctx.fillStyle=sg;ctx.fillRect(sunX-60,sunY-60,120,120);
    ctx.beginPath();ctx.arc(sunX,sunY,22,0,Math.PI*2);ctx.fillStyle='#FFF8DC';ctx.fill();
    for(var i=0;i<4;i++){
      var clx=cx+80+i*180+Math.sin(G.time*0.12+i*2.5)*25,cly=cy+25+i*12;
      ctx.fillStyle='rgba(255,255,255,0.6)';
      ctx.beginPath();ctx.ellipse(clx,cly,44,15,0,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.ellipse(clx+28,cly-6,28,13,0,0,Math.PI*2);ctx.fill();
    }
  }

  // Water — full width in ocean mode (no shore gap)
  var screenTop=cy, screenBot=cy+H;
  var wg=ctx.createLinearGradient(0,Math.max(G.WATER_Y,screenTop),0,screenBot);
  wg.addColorStop(0,zone.bgTop);wg.addColorStop(1,zone.bgBot);
  var waterLeft=isOcean?cx:cx;
  ctx.fillStyle=wg;ctx.fillRect(waterLeft,Math.max(G.WATER_Y,screenTop),W,H);

  // Caustics (only shallow)
  if(depth<500){
    ctx.save();ctx.globalAlpha=0.04*(1-depth/500);
    for(var i=0;i<8;i++){
      var rx=cx+i*(W/7)+Math.sin(G.time*0.25+i*1.3)*35;
      ctx.beginPath();ctx.moveTo(rx-20,screenTop);ctx.lineTo(rx-50,screenBot);
      ctx.lineTo(rx+50,screenBot);ctx.lineTo(rx+20,screenTop);ctx.closePath();
      ctx.fillStyle='#60C0FF';ctx.fill();
    }
    ctx.restore();
  }

  // Sand floor (only shallow, depth < 200)
  if(!isOcean || depth<200){
    var sandY=isOcean?G.WATER_Y+400:H-28;
    if(sandY>screenTop&&sandY<screenBot+30){
      var sandG2=ctx.createLinearGradient(0,sandY,0,sandY+30);
      sandG2.addColorStop(0,'#C8AD6F');sandG2.addColorStop(1,'#A08848');
      ctx.fillStyle=sandG2;ctx.fillRect(cx,sandY,W,35);
    }
  }

  // Deep terrain (rocks at depth > 200)
  if(isOcean&&depth>150){
    ctx.fillStyle='rgba(30,20,15,'+(Math.min(0.3,depth/2000))+')';
    for(var i=0;i<5;i++){
      var ry=cy+H*0.7+i*60+Math.sin(i*3)*30;
      var rx2=cx+((i*311)%W);
      ctx.beginPath();ctx.ellipse(rx2,ry,25+i*8,12+i*4,i*0.2,0,Math.PI*2);ctx.fill();
    }
  }

  // Shore (only in shore mode)
  if(!isOcean) G.drawShore(ctx,cx,cy);

  // Seaweed (only shallow)
  if(!isOcean||depth<250){
    for(var sw of G.seaweeds){
      if(sw.x<cx-60||sw.x>cx+W+60)continue;
      var baseY=isOcean?G.WATER_Y+398:H-26;
      var sway=Math.sin(G.time*1.2+sw.phase)*14;
      ctx.strokeStyle=sw.color;ctx.lineWidth=5;ctx.lineCap='round';
      ctx.beginPath();ctx.moveTo(sw.x,baseY);
      ctx.bezierCurveTo(sw.x+sway*0.3,baseY-sw.h*0.3,sw.x+sway*0.8,baseY-sw.h*0.6,sw.x+sway*0.6,baseY-sw.h);
      ctx.stroke();
    }
  }

  // Corals (only shallow)
  if(!isOcean||depth<200) G.drawCorals(ctx,cx);

  // Background fish (parallax)
  if(depth<600){
    ctx.save();ctx.globalAlpha=0.25;
    for(var i=0;i<6;i++){
      var bx=cx*0.5+((i*211+37)%W)*1.3;
      var by=(isOcean?G.player.y:G.WATER_Y+50)+((i*157)%(H*0.6))-H*0.3;
      ctx.fillStyle=['#5A8AAA','#4A7A9A','#6A9ABA'][i%3];
      ctx.beginPath();ctx.ellipse(bx,by,6+i%3*3,3+i%2*2,0,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }

  // Fishes
  for(var f of G.fishes){if(!f.alive||f.x<cx-80||f.x>cx+W+80||f.y<cy-80||f.y>cy+H+80)continue;G.drawFish(ctx,f);}

  // Eggs
  for(var e of G.eggs){if(!e.alive)continue;G.drawEgg(ctx,e);}

  // Portals
  for(var pt of G.portals){if(!pt.alive)continue;G.drawPortal(ctx,pt);}

  // Bubbles
  for(var b of G.bubbles){
    ctx.beginPath();ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
    ctx.fillStyle='rgba(180,220,255,'+b.life*0.4+')';ctx.fill();
  }

  // Eat particles
  for(var pp of G.particles){
    ctx.globalAlpha=pp.life;
    ctx.beginPath();ctx.arc(pp.x,pp.y,pp.r,0,Math.PI*2);
    ctx.fillStyle=pp.color;ctx.fill();
  }
  ctx.globalAlpha=1;

  // Floating particles
  ctx.globalAlpha=0.12;
  for(var i=0;i<12;i++){
    var ppx=cx+((i*137+G.time*8)%W);
    var ppy=(isOcean?G.player.y:G.WATER_Y+30)+((i*97+G.time*3)%(H*0.7))-H*0.35;
    ctx.beginPath();ctx.arc(ppx,ppy,1+Math.sin(G.time+i)*0.5,0,Math.PI*2);
    ctx.fillStyle='#B0D8F0';ctx.fill();
  }
  ctx.globalAlpha=1;

  // Mode-specific
  if(G.mode==='shore'){
    G.drawHook(ctx);G.drawShorePlayer(ctx);G.drawPowerBar(ctx,cx,cy);
  }else{
    G.drawPlayerFish(ctx);
  }

  // PK HUD overlay
  if(G.mode==='pk'&&!G.pk.showingSwitch&&!G.pk.showingResult){
    ctx.restore();
    ctx.textAlign='center';ctx.fillStyle='#FFF';ctx.font='bold 15px sans-serif';
    ctx.fillText('P'+(G.pk.turn+1)+' 回合 '+(G.pk.round+1)+'/'+G.pk.maxRounds,G.W/2,28);
    ctx.fillStyle=G.pk.timer>5?'#4AE68A':'#FF4757';ctx.font='bold 20px sans-serif';
    ctx.fillText(Math.ceil(G.pk.timer)+'s',G.W/2,52);
    ctx.textAlign='left';ctx.fillStyle='#FFD700';ctx.font='bold 14px sans-serif';
    ctx.fillText('P1: '+G.pk.scores[0]+(G.pk.turn===0?'+'+G.pk.roundScores[0]:''),16,28);
    ctx.textAlign='right';
    ctx.fillText('P2: '+G.pk.scores[1]+(G.pk.turn===1?'+'+G.pk.roundScores[1]:''),G.W-16,28);
    ctx.textAlign='left';
    ctx.save();ctx.translate(cx,cy);
  }

  // Waves (only when near surface)
  if(cy<G.WATER_Y+100) G.drawWaves(ctx,cx);

  // Depth fog
  var fogA=isOcean?Math.min(0.5,depth/3000):0.3;
  var fog=ctx.createLinearGradient(0,cy+H-70,0,cy+H);
  fog.addColorStop(0,'rgba(4,25,45,0)');fog.addColorStop(1,'rgba(4,25,45,'+fogA+')');
  ctx.fillStyle=fog;ctx.fillRect(cx,cy+H-70,W,70);

  ctx.restore();

  // Virtual joystick (screen-space)
  if(isOcean||G.mode==='pk') G.drawJoystick(ctx);

  // Vignette
  var vg=ctx.createRadialGradient(W/2,H/2,Math.min(W,H)*0.35,W/2,H/2,Math.max(W,H)*0.75);
  var vigA=isOcean?Math.min(0.5,0.3+depth/3000):0.3;
  vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,10,20,'+vigA+')');
  ctx.fillStyle=vg;ctx.fillRect(0,0,W,H);



  // Combo display (screen-space)
  if(G.combo.count>=2&&G.combo.timer>0){
    var comboSize=20+G.combo.count*2;
    ctx.textAlign='center';ctx.font='bold '+comboSize+'px sans-serif';
    ctx.fillStyle=G.combo.count>=5?'#FF4757':G.combo.count>=3?'#FFD700':'#4AE68A';
    ctx.globalAlpha=Math.min(1,G.combo.timer);
    ctx.fillText('COMBO x'+G.combo.count,W/2,H*0.15);
    if(G.combo.lastScore>0){
      ctx.font='bold 16px sans-serif';ctx.fillStyle='#FFF';
      ctx.fillText('+'+G.combo.lastScore,W/2,H*0.15+28);
    }
    ctx.globalAlpha=1;
  }
};

// ── Shore with land occlusion ──
G.drawShore = function(ctx,cx,cy){
  var sx=G.SHORE_X, H=G.H;
  // Hill
  var hillG=ctx.createLinearGradient(cx,G.WATER_Y-80,cx,G.WATER_Y+20);
  hillG.addColorStop(0,'#6AAF4C');hillG.addColorStop(1,'#4A8A30');
  ctx.fillStyle=hillG;
  ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx,G.WATER_Y+20);
  ctx.quadraticCurveTo(sx*0.3,G.WATER_Y-60,sx*0.6,G.WATER_Y-30);
  ctx.lineTo(sx,G.WATER_Y);ctx.lineTo(sx,cy);ctx.closePath();ctx.fill();
  ctx.fillStyle='#3E7228';
  ctx.beginPath();ctx.moveTo(cx,G.WATER_Y-20);
  ctx.quadraticCurveTo(sx*0.4,G.WATER_Y-80,sx*0.7,G.WATER_Y-20);
  ctx.lineTo(sx,G.WATER_Y);ctx.lineTo(cx,G.WATER_Y+20);ctx.closePath();ctx.fill();
  // Rock cliff with gradient
  var rockG=ctx.createLinearGradient(sx-30,G.WATER_Y-40,sx+20,H);
  rockG.addColorStop(0,'#7A6A5E');rockG.addColorStop(0.3,'#6B5B4F');rockG.addColorStop(1,'#4A3A30');
  ctx.fillStyle=rockG;
  ctx.beginPath();ctx.moveTo(sx-30,G.WATER_Y-40);ctx.lineTo(sx+15,G.WATER_Y-10);
  ctx.lineTo(sx+20,G.WATER_Y+30);ctx.lineTo(sx+10,H);
  ctx.lineTo(cx,H);ctx.lineTo(cx,G.WATER_Y+20);ctx.closePath();ctx.fill();
  // Rock highlight
  ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(sx-28,G.WATER_Y-38);ctx.lineTo(sx+13,G.WATER_Y-10);ctx.stroke();
  // Pier
  var pierG=ctx.createLinearGradient(sx-15,G.WATER_Y-18,sx-15,G.WATER_Y-10);
  pierG.addColorStop(0,'#9A7F57');pierG.addColorStop(1,'#7A5F3A');
  ctx.fillStyle=pierG;ctx.fillRect(sx-15,G.WATER_Y-18,50,8);
  ctx.fillStyle='#7A5F3A';ctx.fillRect(sx-10,G.WATER_Y-18,6,35);ctx.fillRect(sx+25,G.WATER_Y-18,6,35);
  // Sand transition
  ctx.fillStyle='#D4B87A';
  ctx.beginPath();ctx.moveTo(sx+10,G.WATER_Y-5);
  ctx.quadraticCurveTo(sx+25,G.WATER_Y+8,sx+10,G.WATER_Y+20);
  ctx.lineTo(sx-5,G.WATER_Y+20);ctx.lineTo(sx-5,G.WATER_Y-5);ctx.closePath();ctx.fill();
  // Land occlusion — cover water under land
  ctx.fillStyle=darkenColor('#4A3A30',0.9);
  ctx.fillRect(cx,G.WATER_Y,sx-5-cx,H-G.WATER_Y+50);
  // Grass
  for(var i=0;i<6;i++){
    var gx=cx+8+i*((sx-15)/6),gy=G.WATER_Y-28-Math.sin(i*1.5)*22;
    ctx.fillStyle=i%2===0?'#5AA030':'#6AB840';
    ctx.beginPath();ctx.moveTo(gx,gy);
    ctx.lineTo(gx-4,gy-10-Math.sin(G.time+i)*2);ctx.lineTo(gx+1,gy-6);
    ctx.lineTo(gx+5,gy-12-Math.sin(G.time+i+1)*2);ctx.lineTo(gx+7,gy);ctx.fill();
  }
};

// ── 3D Shore Player ──
G.drawShorePlayer = function(ctx){
  var p=G.player, skin=G.getEquipped('char').skin;
  var rodId=G.equipped.rod, baitId=G.equipped.bait, hookId=G.equipped.hook;
  ctx.save();ctx.translate(p.shoreX,p.shoreY);

  // Body colors by skin
  var bodyC=skin==='pirate'?'#333':skin==='captain'?'#E8E8E8':skin==='mermaid'?'#A78BFA':'#D94040';
  var bodyD=darkenColor(bodyC,0.65);

  // Legs with 3D shading
  var legG=ctx.createLinearGradient(2,-2,2,6);
  legG.addColorStop(0,skin==='pirate'?'#3A3A3A':'#4A6AB0');legG.addColorStop(1,skin==='pirate'?'#1A1A1A':'#2A4A80');
  ctx.fillStyle=legG;ctx.fillRect(2,-2,18,8);
  ctx.fillStyle='#4A3728';ctx.fillRect(18,0,8,6);
  ctx.fillStyle='rgba(255,255,255,0.1)';ctx.fillRect(18,0,8,2);

  // Body with 3D gradient
  var bG=ctx.createRadialGradient(-2,-16,2,2,-8,14);
  bG.addColorStop(0,'rgba(255,255,255,0.15)');bG.addColorStop(0.3,bodyC);bG.addColorStop(1,bodyD);
  ctx.fillStyle=bG;ctx.beginPath();ctx.ellipse(0,-12,10,12,0,0,Math.PI*2);ctx.fill();

  // Head with 3D
  if(skin==='custom'&&G.avatarImg&&G.avatarImg.complete){
    ctx.save();ctx.beginPath();ctx.arc(0,-28,9,0,Math.PI*2);ctx.clip();
    ctx.drawImage(G.avatarImg,-9,-37,18,18);ctx.restore();
  }else{
    var headG=ctx.createRadialGradient(-2,-30,2,1,-26,10);
    headG.addColorStop(0,'#FFE4C0');headG.addColorStop(1,'#D4A870');
    ctx.fillStyle=headG;ctx.beginPath();ctx.arc(0,-28,9,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#333';ctx.beginPath();ctx.arc(4,-29,1.5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.7)';ctx.beginPath();ctx.arc(3.5,-29.5,0.5,0,Math.PI*2);ctx.fill();
  }

  // Hat with 3D
  if(skin==='fisher'){
    var hatG=ctx.createLinearGradient(-6,-38,6,-31);
    hatG.addColorStop(0,'#F0D860');hatG.addColorStop(1,'#C0A030');
    ctx.fillStyle=hatG;ctx.beginPath();ctx.ellipse(0,-35,11,4,0,0,Math.PI*2);ctx.fill();ctx.fillRect(-6,-38,12,7);
    ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fillRect(-5,-38,10,2);
  }else if(skin==='pirate'){
    ctx.fillStyle='#1A1A1A';ctx.beginPath();ctx.ellipse(0,-35,10,4,0,0,Math.PI*2);ctx.fill();ctx.fillRect(-7,-40,14,8);
    ctx.fillStyle='#FFF';ctx.beginPath();ctx.moveTo(-2,-40);ctx.lineTo(0,-44);ctx.lineTo(2,-40);ctx.fill();
  }else if(skin==='captain'){
    var capG=ctx.createLinearGradient(-7,-41,7,-32);
    capG.addColorStop(0,'#2A5A9A');capG.addColorStop(1,'#1A3A6A');
    ctx.fillStyle=capG;ctx.beginPath();ctx.ellipse(0,-35,11,4,0,0,Math.PI*2);ctx.fill();ctx.fillRect(-7,-41,14,9);
    ctx.fillStyle='#FFD700';ctx.beginPath();ctx.arc(0,-41,3,0,Math.PI*2);ctx.fill();
  }else if(skin==='mermaid'){
    ctx.fillStyle='#C084FC';ctx.beginPath();ctx.moveTo(-6,-35);ctx.quadraticCurveTo(0,-45,6,-35);ctx.fill();
  }

  // Arm
  ctx.fillStyle=bodyC;ctx.save();ctx.translate(6,-16);ctx.rotate(p.rodAngle+0.3);
  ctx.fillRect(0,-2,12,5);ctx.fillStyle='#FFD5A0';ctx.fillRect(10,-1.5,5,4);ctx.restore();

  // Fishing rod with equipment visual
  ctx.save();ctx.translate(10,-18);
  var rc=rodId==='rod_3'?'#DAA520':rodId==='rod_2'?'#4682B4':rodId==='rod_1'?'#555':'#5A3A1A';
  var rodW=rodId==='rod_3'?4:rodId==='rod_2'?3.5:3;
  ctx.strokeStyle=rc;ctx.lineWidth=rodW;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(p.rodAngle)*60,Math.sin(p.rodAngle)*60);ctx.stroke();
  if(rodId==='rod_3'){
    ctx.strokeStyle='rgba(255,215,0,0.3)';ctx.lineWidth=8;
    ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(Math.cos(p.rodAngle)*60,Math.sin(p.rodAngle)*60);ctx.stroke();
  }
  ctx.restore();
  ctx.restore();
};

// ── Hook with distinct equipment visuals ──
G.drawHook = function(ctx){
  var h=G.hook; if(!h.active)return;
  var p=G.player, hookId=G.equipped.hook, baitId=G.equipped.bait;
  var ax=p.shoreX+Math.cos(p.rodAngle)*60+10, ay=p.shoreY+Math.sin(p.rodAngle)*60-15-18;
  // Fishing line
  ctx.strokeStyle='rgba(220,220,220,0.6)';ctx.lineWidth=1.2;ctx.setLineDash([4,3]);
  ctx.beginPath();ctx.moveTo(ax,ay);
  var midX=(ax+h.x)/2,midY=Math.max(ay,h.y)+15;
  ctx.quadraticCurveTo(midX,midY,h.x,h.y);ctx.stroke();ctx.setLineDash([]);

  ctx.save();ctx.translate(h.x,h.y);

  if(hookId==='hook_0'){
    // 铁钩 🪝 — simple small hook, grey
    ctx.strokeStyle='#A0A0A0';ctx.lineWidth=2;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(0,-7);ctx.lineTo(0,2);ctx.arc(3,2,3,Math.PI,0,true);ctx.lineTo(6,-1);ctx.stroke();
    // Bait
    G.drawBait(ctx,baitId,0,-7);
  }else if(hookId==='hook_1'){
    // 钢钩 ⚓ — anchor shape, darker steel
    ctx.strokeStyle='#707888';ctx.lineWidth=2.5;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(0,3);ctx.stroke();
    // Anchor arms
    ctx.beginPath();ctx.arc(0,3,5,0,Math.PI);ctx.stroke();
    // Anchor cross
    ctx.beginPath();ctx.moveTo(-5,-4);ctx.lineTo(5,-4);ctx.stroke();
    // Anchor top ring
    ctx.beginPath();ctx.arc(0,-10,2.5,0,Math.PI*2);ctx.strokeStyle='#606870';ctx.lineWidth=1.5;ctx.stroke();
    G.drawBait(ctx,baitId,0,-13);
  }else if(hookId==='hook_2'){
    // 合金钩 🔩 — double hook, metallic blue
    ctx.strokeStyle='#8090B0';ctx.lineWidth=2.8;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(0,-10);ctx.lineTo(0,2);ctx.stroke();
    // Two curved prongs
    ctx.beginPath();ctx.moveTo(0,2);ctx.arc(4,2,4,Math.PI,0,true);ctx.lineTo(8,-2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,2);ctx.arc(-4,2,4,0,Math.PI,false);ctx.lineTo(-8,-2);ctx.stroke();
    // Metallic shine
    ctx.strokeStyle='rgba(255,255,255,0.2)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(-1,-9);ctx.lineTo(-1,1);ctx.stroke();
    G.drawBait(ctx,baitId,0,-11);
  }else if(hookId==='hook_3'){
    // 钛金钩 💫 — ornate glowing hook
    ctx.shadowColor='rgba(180,200,255,0.7)';ctx.shadowBlur=12;
    ctx.strokeStyle='#D0D8FF';ctx.lineWidth=3;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(0,-12);ctx.lineTo(0,3);ctx.arc(5,3,5,Math.PI,0,true);ctx.lineTo(10,-2);ctx.stroke();
    // Barb
    ctx.beginPath();ctx.moveTo(10,-2);ctx.lineTo(8,-5);ctx.stroke();
    ctx.shadowBlur=0;
    // Star sparkle at top
    ctx.fillStyle='#FFD700';
    var sa=G.time*3;
    for(var i=0;i<4;i++){
      var a=sa+i*Math.PI/2;
      ctx.beginPath();ctx.arc(Math.cos(a)*6,Math.sin(a)*6-12,1.5,0,Math.PI*2);ctx.fill();
    }
    // Glow ring
    ctx.beginPath();ctx.arc(0,-12,4,0,Math.PI*2);
    ctx.strokeStyle='rgba(255,215,0,0.4)';ctx.lineWidth=2;ctx.stroke();
    G.drawBait(ctx,baitId,0,-14);
  }

  ctx.restore();
};

// ── Bait drawing ──
G.drawBait = function(ctx,baitId,x,y){
  if(baitId==='bait_0'){
    // 蚯蚓 🪱 — small pink worm
    ctx.strokeStyle='#E08080';ctx.lineWidth=2;ctx.lineCap='round';
    ctx.beginPath();ctx.moveTo(x-3,y);ctx.quadraticCurveTo(x,y+5,x+3,y+2);ctx.stroke();
  }else if(baitId==='bait_1'){
    // 虾仁 🦐 — orange shrimp shape
    ctx.fillStyle='#FF8C60';
    ctx.beginPath();ctx.ellipse(x,y,4,3,0.3,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#FFA880';
    ctx.beginPath();ctx.ellipse(x-1,y-1,2,1.5,0.3,0,Math.PI*2);ctx.fill();
    // Tail
    ctx.strokeStyle='#FF8C60';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(x+3,y+1);ctx.lineTo(x+6,y+3);ctx.stroke();
  }else if(baitId==='bait_2'){
    // 鱼饵丸 🟠 — orange ball with texture
    ctx.beginPath();ctx.arc(x,y,4.5,0,Math.PI*2);ctx.fillStyle='#FF8C00';ctx.fill();
    ctx.beginPath();ctx.arc(x-1,y-1.5,2,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.25)';ctx.fill();
    ctx.beginPath();ctx.arc(x,y,4.5,0,Math.PI*2);ctx.strokeStyle='#E07800';ctx.lineWidth=0.8;ctx.stroke();
  }else if(baitId==='bait_3'){
    // 秘制鱼饵 💎 — glowing diamond
    ctx.save();
    ctx.shadowColor='rgba(224,64,251,0.6)';ctx.shadowBlur=10;
    ctx.fillStyle='#E040FB';
    ctx.beginPath();ctx.moveTo(x,y-5);ctx.lineTo(x+4,y);ctx.lineTo(x,y+5);ctx.lineTo(x-4,y);ctx.closePath();ctx.fill();
    ctx.shadowBlur=0;
    ctx.fillStyle='rgba(255,255,255,0.4)';
    ctx.beginPath();ctx.moveTo(x,y-3);ctx.lineTo(x+2,y);ctx.lineTo(x,y+1);ctx.lineTo(x-2,y);ctx.closePath();ctx.fill();
    ctx.restore();
  }
};

// ── Player Fish with equipment skins ──
G.drawPlayerFish = function(ctx){
  var p=G.player, skin=G.getEquipped('char').skin;
  ctx.save();ctx.translate(p.x,p.y);ctx.scale(p.facing,1);
  if(G.invincible>0){
    ctx.globalAlpha = 0.45 + Math.abs(Math.sin(G.time*10))*0.55;
  }
  var s=p.size, hw=s*0.5, hh=s*0.35;
  var tail=Math.sin(p.swimPhase)*s*0.12;
  var tierC=['#4AE68A','#36C5F0','#FFD93D','#FF8C42','#FF4757','#A855F7'];
  var tierD=['#2A9A5A','#1A85A0','#C0A020','#C06020','#C02030','#7030B0'];
  var c=tierC[p.tier-1]||'#4AE68A', cd=tierD[p.tier-1]||'#2A9A5A';

  // Glow
  if(p.tier>=4){
    var glow=ctx.createRadialGradient(0,0,hw*0.3,0,0,hw+12);
    glow.addColorStop(0,c+'40');glow.addColorStop(1,c+'00');
    ctx.fillStyle=glow;ctx.fillRect(-hw-12,-hh-12,hw*2+24,hh*2+24);
  }
  // Shadow
  ctx.globalAlpha=0.1;ctx.fillStyle='#000';
  ctx.beginPath();ctx.ellipse(3,hh+5,hw*0.5,4,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;

  // Tail — mermaid gets rainbow
  if(skin==='mermaid'){
    var tg=ctx.createLinearGradient(-hw-s*0.2,-hh*0.8,-hw-s*0.2,hh*0.8);
    tg.addColorStop(0,'#FF6B6B');tg.addColorStop(0.33,'#FFD93D');tg.addColorStop(0.66,'#4AE68A');tg.addColorStop(1,'#36C5F0');
    ctx.fillStyle=tg;
  }else{ctx.fillStyle=c;}
  ctx.beginPath();ctx.moveTo(-hw,0);ctx.lineTo(-hw-s*0.2+tail,-hh*0.8);ctx.lineTo(-hw-s*0.2+tail,hh*0.8);
  ctx.closePath();ctx.fill();

  // Body 3D
  var bg=ctx.createRadialGradient(hw*0.1,-hh*0.3,s*0.05,0,hh*0.15,Math.max(hw,hh)*1.1);
  bg.addColorStop(0,'rgba(255,255,255,0.25)');bg.addColorStop(0.3,c);bg.addColorStop(1,cd);
  ctx.beginPath();ctx.ellipse(0,0,hw,hh,0,0,Math.PI*2);ctx.fillStyle=bg;ctx.fill();

  // Skin decorations
  if(skin==='pirate'){
    // Skull mark
    ctx.fillStyle='rgba(255,255,255,0.5)';
    ctx.beginPath();ctx.arc(-hw*0.1,-hh*0.1,s*0.08,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(0,0,0,0.6)';
    ctx.beginPath();ctx.arc(-hw*0.13,-hh*0.15,s*0.02,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(-hw*0.07,-hh*0.15,s*0.02,0,Math.PI*2);ctx.fill();
    // Eye patch
    ctx.fillStyle='#222';ctx.fillRect(hw*0.35,-hh*0.4,s*0.08,s*0.06);
  }else if(skin==='captain'){
    // Gold stripes
    ctx.strokeStyle='rgba(255,215,0,0.4)';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(-hw*0.3,-hh*0.5);ctx.lineTo(hw*0.3,-hh*0.5);ctx.stroke();
    ctx.beginPath();ctx.moveTo(-hw*0.3,hh*0.5);ctx.lineTo(hw*0.3,hh*0.5);ctx.stroke();
    // Mini hat
    ctx.fillStyle='#1A3A6A';ctx.fillRect(hw*0.2,-hh-s*0.1,s*0.15,s*0.08);
    ctx.fillStyle='#FFD700';ctx.beginPath();ctx.arc(hw*0.275,-hh-s*0.1,s*0.02,0,Math.PI*2);ctx.fill();
  }else if(skin==='mermaid'){
    // Sparkles
    ctx.fillStyle='rgba(255,255,255,0.6)';
    for(var i=0;i<4;i++){
      var sx=Math.sin(G.time*2+i*1.5)*hw*0.6;
      var sy=Math.cos(G.time*2+i*1.5)*hh*0.5;
      ctx.beginPath();ctx.arc(sx,sy,1.5,0,Math.PI*2);ctx.fill();
    }
  }

  // Highlight
  ctx.beginPath();ctx.ellipse(hw*0.12,-hh*0.35,hw*0.45,hh*0.2,0.15,0,Math.PI*2);
  ctx.fillStyle='rgba(255,255,255,0.18)';ctx.fill();

  // Dorsal fin
  ctx.beginPath();ctx.moveTo(-hw*0.1,-hh);ctx.lineTo(hw*0.15,-hh-s*0.14);ctx.lineTo(hw*0.35,-hh);
  ctx.fillStyle=c;ctx.globalAlpha=0.6;ctx.fill();ctx.globalAlpha=1;

  // Eye
  var er=Math.max(2.5,s*0.07);
  if(skin==='custom'&&G.avatarImg&&G.avatarImg.complete){
    ctx.save();ctx.beginPath();ctx.arc(hw*0.5,-hh*0.2,er+3,0,Math.PI*2);ctx.clip();
    ctx.drawImage(G.avatarImg,hw*0.5-er-3,-hh*0.2-er-3,(er+3)*2,(er+3)*2);ctx.restore();
  }else{
    ctx.beginPath();ctx.arc(hw*0.5,-hh*0.2,er+1.5,0,Math.PI*2);ctx.fillStyle='#F8F8FF';ctx.fill();
    ctx.beginPath();ctx.arc(hw*0.5+0.5,-hh*0.2,er*0.6,0,Math.PI*2);ctx.fillStyle='#1A1A2E';ctx.fill();
    ctx.beginPath();ctx.arc(hw*0.5-0.3,-hh*0.2-er*0.3,er*0.22,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.85)';ctx.fill();
    if(skin==='pirate'){
      ctx.fillStyle='#222';ctx.fillRect(hw*0.3,-hh*0.35,er*2,er*0.8);
    }
  }

  // Mouth
  ctx.strokeStyle=cd;ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(hw,1.5);ctx.quadraticCurveTo(hw+3,0,hw,-1.5);ctx.stroke();

  // Invincibility shield
  if(G.invincible>0){
    var pulse=0.7+Math.sin(G.time*8)*0.3;
    ctx.beginPath();ctx.ellipse(0,0,hw+8,hh+8,0,0,Math.PI*2);
    ctx.strokeStyle='rgba(255,215,0,'+pulse*0.6+')';ctx.lineWidth=3;ctx.stroke();
    ctx.beginPath();ctx.ellipse(0,0,hw+12,hh+12,0,0,Math.PI*2);
    ctx.strokeStyle='rgba(255,215,0,'+pulse*0.2+')';ctx.lineWidth=2;ctx.stroke();
  }

  ctx.restore();
};

// ── Egg ──
G.drawEgg = function(ctx,e){
  ctx.save();ctx.translate(e.x,e.y);
  var t=e.type, pulse=0.8+Math.sin(e.phase*2)*0.2;
  // Glow
  var glow=ctx.createRadialGradient(0,0,5,0,0,30*pulse);
  glow.addColorStop(0,t.glow);glow.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=glow;ctx.fillRect(-30,-30,60,60);
  // Core
  ctx.beginPath();ctx.arc(0,0,10*pulse,0,Math.PI*2);
  ctx.fillStyle=t.color;ctx.fill();
  // Inner shine
  ctx.beginPath();ctx.arc(-2,-3,4*pulse,0,Math.PI*2);
  ctx.fillStyle='rgba(255,255,255,0.4)';ctx.fill();
  // Sparkle particles
  for(var i=0;i<4;i++){
    var a=e.phase*3+i*Math.PI/2;
    var sr=15+Math.sin(e.phase*4+i)*5;
    ctx.beginPath();ctx.arc(Math.cos(a)*sr,Math.sin(a)*sr,1.5,0,Math.PI*2);
    ctx.fillStyle='rgba(255,255,255,0.6)';ctx.fill();
  }
  ctx.restore();
};

// ── Portal (Black Hole) ──
G.drawPortal = function(ctx,pt){
  ctx.save();ctx.translate(pt.x,pt.y);
  // Outer swirl
  for(var i=0;i<3;i++){
    var a=pt.phase*2+i*Math.PI*2/3;
    ctx.beginPath();ctx.arc(0,0,pt.r+10-i*3,a,a+1.5);
    ctx.strokeStyle='rgba(120,60,180,'+(0.3-i*0.08)+')';ctx.lineWidth=4-i;ctx.stroke();
  }
  // Core gradient
  var cg=ctx.createRadialGradient(0,0,0,0,0,pt.r);
  cg.addColorStop(0,'#0A0015');cg.addColorStop(0.5,'#1A0030');cg.addColorStop(0.8,'rgba(80,30,120,0.5)');cg.addColorStop(1,'rgba(80,30,120,0)');
  ctx.fillStyle=cg;ctx.beginPath();ctx.arc(0,0,pt.r,0,Math.PI*2);ctx.fill();
  // Inner stars
  ctx.fillStyle='rgba(200,150,255,0.5)';
  for(var i=0;i<5;i++){
    var sa=pt.phase*3+i*1.2;
    var sr2=Math.random()*pt.r*0.6;
    ctx.beginPath();ctx.arc(Math.cos(sa)*sr2,Math.sin(sa)*sr2,1,0,Math.PI*2);ctx.fill();
  }
  // Label
  ctx.fillStyle='rgba(200,150,255,0.7)';ctx.font='bold 11px sans-serif';ctx.textAlign='center';
  ctx.fillText('???',0,pt.r+16);
  ctx.restore();
};

// ── Waves ──
G.drawWaves = function(ctx,cx){
  var startX=G.mode==='shore'?cx+G.SHORE_X-5:cx-10;
  ctx.beginPath();ctx.moveTo(startX,G.WATER_Y);
  for(var x=startX;x<cx+G.W+10;x+=3){
    var wy=G.WATER_Y+Math.sin(x*0.02+G.time*2)*3.5+Math.sin(x*0.013+G.time*1.3)*2.5+Math.sin(x*0.04+G.time*3)*1;
    ctx.lineTo(x,wy);
  }
  ctx.lineTo(cx+G.W+10,G.WATER_Y-15);ctx.lineTo(startX,G.WATER_Y-15);ctx.closePath();
  ctx.fillStyle='rgba(100,180,255,0.2)';ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.35)';ctx.lineWidth=2;
  ctx.beginPath();
  for(var x=startX;x<cx+G.W+10;x+=3){
    var wy=G.WATER_Y+Math.sin(x*0.02+G.time*2)*3.5+Math.sin(x*0.013+G.time*1.3)*2.5+Math.sin(x*0.04+G.time*3)*1;
    x===startX?ctx.moveTo(x,wy):ctx.lineTo(x,wy);
  }
  ctx.stroke();
};

// ── Corals ──
G.drawCorals = function(ctx,cx){
  var baseY=G.mode==='ocean'?G.WATER_Y+398:G.H-26;
  for(var i=0;i<6;i++){
    var rx=cx+((i*197*7+50)%G.W);
    if(rx<cx-40||rx>cx+G.W+40)continue;
    if(i%3===0){
      ctx.fillStyle='#E05070';
      ctx.beginPath();ctx.moveTo(rx,baseY);ctx.lineTo(rx-3,baseY-18);ctx.lineTo(rx-10,baseY-28);
      ctx.lineTo(rx-6,baseY-28);ctx.lineTo(rx,baseY-16);ctx.lineTo(rx+6,baseY-30);
      ctx.lineTo(rx+10,baseY-28);ctx.lineTo(rx+3,baseY-18);ctx.lineTo(rx+1,baseY);ctx.fill();
    }else if(i%3===1){
      ctx.fillStyle='#5A5050';
      ctx.beginPath();ctx.ellipse(rx,baseY-6,14,10,0,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#3A6A3A';
      ctx.beginPath();ctx.ellipse(rx-4,baseY-14,6,3,-0.3,0,Math.PI);ctx.fill();
    }else{
      ctx.fillStyle='#D4A040';
      ctx.beginPath();ctx.moveTo(rx,baseY);ctx.lineTo(rx,baseY-12);
      ctx.quadraticCurveTo(rx-14,baseY-28,rx-8,baseY-35);
      ctx.quadraticCurveTo(rx,baseY-38,rx+8,baseY-35);
      ctx.quadraticCurveTo(rx+14,baseY-28,rx,baseY-12);ctx.fill();
    }
  }
};

G.drawPowerBar = function(ctx,cx,cy){
  if(G.mode!=='shore'||G.hook.active)return;
  var bx=cx+G.W/2-60,by=cy+G.H-50;
  ctx.fillStyle='rgba(0,0,0,0.3)';ctx.fillRect(bx,by,120,10);
  ctx.fillStyle='hsl('+(120-G.player.castPower*100)+',80%,50%)';ctx.fillRect(bx,by,120*G.player.castPower,10);
  ctx.strokeStyle='rgba(255,255,255,0.5)';ctx.lineWidth=1;ctx.strokeRect(bx,by,120,10);
  ctx.fillStyle='#fff';ctx.font='11px sans-serif';ctx.textAlign='center';
  ctx.fillText('← 拖拽调整力度 →',bx+60,by-6);
};

// ── Virtual Joystick ──
G.drawJoystick = function(ctx){
  var j=G.joystick;
  if(!j.active) return;
  var cx2=j.cx, cy2=j.cy, r=j.r;
  // Outer ring
  ctx.beginPath();ctx.arc(cx2,cy2,r,0,Math.PI*2);
  ctx.fillStyle='rgba(255,255,255,0.06)';ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.2)';ctx.lineWidth=2;ctx.stroke();
  // Direction lines
  ctx.strokeStyle='rgba(255,255,255,0.08)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(cx2-r,cy2);ctx.lineTo(cx2+r,cy2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx2,cy2-r);ctx.lineTo(cx2,cy2+r);ctx.stroke();
  // Thumb
  var tx=cx2+j.dx, ty=cy2+j.dy;
  ctx.beginPath();ctx.arc(tx,ty,16,0,Math.PI*2);
  ctx.fillStyle='rgba(255,255,255,0.25)';ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,0.4)';ctx.lineWidth=2;ctx.stroke();
  // Center dot
  ctx.beginPath();ctx.arc(cx2,cy2,4,0,Math.PI*2);
  ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fill();
};

// ── PK Screens ──
G.drawPKIntro = function(ctx){
  var W=G.W,H=G.H;
  ctx.fillStyle='#0A1628';ctx.fillRect(0,0,W,H);
  ctx.textAlign='center';
  ctx.fillStyle='#FF4757';ctx.font='bold 32px sans-serif';ctx.fillText('双人 PK',W/2,H*0.15);
  ctx.fillStyle='rgba(255,255,255,0.85)';ctx.font='15px sans-serif';
  var rules=['两位玩家轮流操作，每人每回合 30 秒','在海洋中吃鱼得分，吃的越多分越高','共 3 轮，每人各操作 3 次','最终总分高者获胜!'];
  for(var i=0;i<rules.length;i++) ctx.fillText(rules[i],W/2,H*0.28+i*28);
  // Start button
  var bw=180,bh=48,bx=W/2-bw/2,by=H*0.55;
  ctx.fillStyle='rgba(255,71,87,0.2)';ctx.fillRect(bx,by,bw,bh);
  ctx.strokeStyle='#FF4757';ctx.lineWidth=2;ctx.strokeRect(bx,by,bw,bh);
  ctx.fillStyle='#FF4757';ctx.font='bold 18px sans-serif';ctx.fillText('开始 PK',W/2,by+31);
  // Exit button
  var ebw=180,ebh=48,ebx=W/2-ebw/2,eby=H*0.55+70;
  ctx.fillStyle='rgba(255,255,255,0.06)';ctx.fillRect(ebx,eby,ebw,ebh);
  ctx.strokeStyle='rgba(255,255,255,0.4)';ctx.lineWidth=2;ctx.strokeRect(ebx,eby,ebw,ebh);
  ctx.fillStyle='rgba(255,255,255,0.7)';ctx.font='bold 16px sans-serif';ctx.fillText('退出',W/2,eby+31);
  G.onAdventureDown=function(e){
    var p=G.getPos(e);
    if(p.x>=bx&&p.x<=bx+bw&&p.y>=by&&p.y<=by+bh){G.pk.introShown=false;G.pkStartTurn();G.onAdventureDown=null;}
    if(p.x>=ebx&&p.x<=ebx+ebw&&p.y>=eby&&p.y<=eby+ebh){G.exitPK();G.onAdventureDown=null;}
  };
};
G.drawPKSwitch = function(ctx){
  var W=G.W,H=G.H,pk=G.pk;
  ctx.fillStyle='#0A1628';ctx.fillRect(0,0,W,H);
  ctx.textAlign='center';
  ctx.fillStyle='#FFD700';ctx.font='bold 22px sans-serif';
  ctx.fillText('P'+(pk.turn===0?1:2)+' 本轮得分: '+pk.roundScores[pk.turn===0?0:1],W/2,H*0.22);
  ctx.fillStyle='#FFF';ctx.font='bold 26px sans-serif';
  ctx.fillText('请将设备交给 P'+(pk.turn+1),W/2,H*0.38);
  ctx.fillStyle='rgba(255,255,255,0.5)';ctx.font='15px sans-serif';
  ctx.fillText('P1 总分: '+pk.scores[0]+'  |  P2 总分: '+pk.scores[1],W/2,H*0.48);
  // Ready button
  var bw=180,bh=48,bx=W/2-bw/2,by=H*0.58;
  ctx.fillStyle='rgba(74,230,138,0.2)';ctx.fillRect(bx,by,bw,bh);
  ctx.strokeStyle='#4AE68A';ctx.lineWidth=2;ctx.strokeRect(bx,by,bw,bh);
  ctx.fillStyle='#4AE68A';ctx.font='bold 16px sans-serif';ctx.fillText('准备好了',W/2,by+31);
  // Exit button
  var ebw=180,ebh=48,ebx=W/2-ebw/2,eby=H*0.58+70;
  ctx.fillStyle='rgba(255,255,255,0.06)';ctx.fillRect(ebx,eby,ebw,ebh);
  ctx.strokeStyle='rgba(255,255,255,0.4)';ctx.lineWidth=2;ctx.strokeRect(ebx,eby,ebw,ebh);
  ctx.fillStyle='rgba(255,255,255,0.7)';ctx.font='bold 16px sans-serif';ctx.fillText('退出 PK',W/2,eby+31);
  G.onAdventureDown=function(e){
    var p=G.getPos(e);
    if(p.x>=bx&&p.x<=bx+bw&&p.y>=by&&p.y<=by+bh){G.pkStartTurn();G.onAdventureDown=null;}
    if(p.x>=ebx&&p.x<=ebx+ebw&&p.y>=eby&&p.y<=eby+ebh){G.exitPK();G.onAdventureDown=null;}
  };
};
G.drawPKResult = function(ctx){
  var W=G.W,H=G.H,pk=G.pk;
  ctx.fillStyle='#0A1628';ctx.fillRect(0,0,W,H);
  ctx.textAlign='center';
  var winner=pk.scores[0]>pk.scores[1]?'P1 获胜!':pk.scores[1]>pk.scores[0]?'P2 获胜!':'平局!';
  ctx.fillStyle='#FFD700';ctx.font='bold 32px sans-serif';ctx.fillText(winner,W/2,H*0.25);
  ctx.fillStyle='#FF4757';ctx.font='bold 22px sans-serif';ctx.fillText('P1: '+pk.scores[0]+' 分',W/2,H*0.4);
  ctx.fillStyle='#36C5F0';ctx.font='bold 22px sans-serif';ctx.fillText('P2: '+pk.scores[1]+' 分',W/2,H*0.5);
  var bw=160,bh=44,bx=W/2-bw/2,by=H*0.68;
  ctx.fillStyle='rgba(255,255,255,0.1)';ctx.fillRect(bx,by,bw,bh);
  ctx.strokeStyle='rgba(255,255,255,0.4)';ctx.lineWidth=2;ctx.strokeRect(bx,by,bw,bh);
  ctx.fillStyle='#FFF';ctx.font='bold 16px sans-serif';ctx.fillText('返回',W/2,by+28);
  G.onAdventureDown=function(e){
    var p=G.getPos(e);
    if(p.x>=bx&&p.x<=bx+bw&&p.y>=by&&p.y<=by+bh){G.exitPK();G.onAdventureDown=null;}
  };
};

