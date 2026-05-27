// ── fish-shapes.js — 所有鱼种的形状定义 ──
// 每个形状使用 G.PRIMS 原语库组合绘制
var G = window.G;
var SH = G.FISH_SHAPES;
var P_ = G.PRIMS;

// ═══════════════════════════════════════
// Tier 1 — 微型生物
// ═══════════════════════════════════════

SH['plankton']=function(P){
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  ctx.globalAlpha=0.75;
  ctx.fillStyle=P.c;ctx.beginPath();
  ctx.moveTo(-hw,0);ctx.bezierCurveTo(-hw*0.5,-hh,hw*0.5,-hh*0.8,hw,0);
  ctx.bezierCurveTo(hw*0.5,hh,-hw*0.5,hh*0.8,-hw,0);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.4)';ctx.beginPath();ctx.arc(-hw*0.1,-hh*0.2,hw*0.3,0,Math.PI*2);ctx.fill();
  ctx.globalAlpha=1;
  // Tentacles
  ctx.strokeStyle=P.c;ctx.lineWidth=1.2;
  for(var i=0;i<4;i++){var sx=-hw*0.5+i*hw*0.4;
    ctx.beginPath();ctx.moveTo(sx,hh*0.6);ctx.quadraticCurveTo(sx+2,hh*0.9,sx-2,hh*1.1);ctx.stroke();}
};

SH['shrimp']=function(P){
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  P_.shadow(P);
  // Curved body
  ctx.strokeStyle=P.c;ctx.lineWidth=hh*1.3;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(-hw,hh*0.2);ctx.quadraticCurveTo(0,-hh*0.7,hw,0);ctx.stroke();
  ctx.strokeStyle=P.cs;ctx.lineWidth=hh*0.5;
  ctx.beginPath();ctx.moveTo(-hw*0.6,hh*0.1);ctx.quadraticCurveTo(0,-hh*0.3,hw*0.6,0);ctx.stroke();
  // Segments
  ctx.strokeStyle=P.cd;ctx.lineWidth=0.8;
  for(var i=0;i<5;i++){var sx=-hw*0.5+i*hw*0.25;
    ctx.beginPath();ctx.moveTo(sx,-hh*0.5);ctx.lineTo(sx,hh*0.3);ctx.stroke();}
  // Antennae
  ctx.strokeStyle=P.c;ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(hw,0);ctx.quadraticCurveTo(hw+6,-hh*0.8,hw+12,-hh*1.1);ctx.stroke();
  ctx.beginPath();ctx.moveTo(hw,-hh*0.1);ctx.quadraticCurveTo(hw+8,-hh*0.5,hw+14,-hh*0.7);ctx.stroke();
  // Tail fan
  ctx.fillStyle=P.cd;
  ctx.beginPath();ctx.moveTo(-hw,hh*0.2);ctx.lineTo(-hw-6+P.tail,-hh*0.5);ctx.lineTo(-hw-6+P.tail,hh*0.7);ctx.closePath();ctx.fill();
  // Eye
  P_.eyeSimple(P,hw*0.7,-hh*0.3,0.7);
};

SH['cucumber']=function(P){
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  P_.shadow(P);
  var bg=ctx.createLinearGradient(0,-hh,0,hh);
  bg.addColorStop(0,P.cs);bg.addColorStop(1,P.cd);
  ctx.fillStyle=bg;
  ctx.beginPath();ctx.ellipse(0,0,hw,hh*0.7,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=P.cd;
  for(var i=0;i<7;i++){var bx=-hw*0.8+i*hw*0.27;
    ctx.beginPath();ctx.arc(bx,-hh*0.4,hh*0.22,0,Math.PI*2);ctx.fill();}
  ctx.strokeStyle=P.c;ctx.lineWidth=1.5;
  for(var i=0;i<5;i++){var a=-0.3+i*0.15;
    ctx.beginPath();ctx.moveTo(hw*0.8,0);ctx.lineTo(hw*0.8+Math.cos(a)*10,Math.sin(a)*8);ctx.stroke();}
};

SH['starfish']=function(P){
  var ctx=P.ctx,r1=P.hw,r2=P.hw*0.4;
  P_.shadow(P);
  ctx.fillStyle=P.c;ctx.beginPath();
  for(var i=0;i<10;i++){
    var a=i*Math.PI/5-Math.PI/2, r=i%2===0?r1:r2;
    if(i===0) ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);
    else ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);
  }
  ctx.closePath();ctx.fill();
  // Gradient highlight
  var rg=ctx.createRadialGradient(0,0,r2,0,0,r1);
  rg.addColorStop(0,P.cs);rg.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=rg;ctx.beginPath();
  for(var i=0;i<10;i++){
    var a=i*Math.PI/5-Math.PI/2, r=i%2===0?r1:r2;
    if(i===0) ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);
    else ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);
  }
  ctx.closePath();ctx.fill();
  // Dots
  ctx.fillStyle=P.cd;
  for(var i=0;i<5;i++){var a=i*Math.PI/2.5-Math.PI/2;
    ctx.beginPath();ctx.arc(Math.cos(a)*r1*0.55,Math.sin(a)*r1*0.55,2,0,Math.PI*2);ctx.fill();}
};

SH['urchin']=function(P){
  var ctx=P.ctx,hw=P.hw;
  P_.shadow(P);
  ctx.fillStyle=P.c;ctx.beginPath();ctx.arc(0,0,hw*0.55,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=P.cd;ctx.lineWidth=2;ctx.lineCap='round';
  for(var i=0;i<24;i++){var a=i*Math.PI/12;
    ctx.beginPath();ctx.moveTo(Math.cos(a)*hw*0.5,Math.sin(a)*hw*0.5);
    ctx.lineTo(Math.cos(a)*hw,Math.sin(a)*hw);ctx.stroke();}
  ctx.fillStyle=P.cs;ctx.beginPath();ctx.arc(-hw*0.15,-hw*0.15,hw*0.15,0,Math.PI*2);ctx.fill();
};

SH['jellyfish']=function(P){
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  var pulse=0.9+Math.sin(P.time*2)*0.1;
  // Tentacles first (behind bell)
  ctx.strokeStyle=P.c;ctx.lineCap='round';
  for(var i=0;i<7;i++){
    var tx=-hw*0.65+i*hw*0.22;
    var tw=Math.sin(P.time*1.5+i)*5;
    var tg=ctx.createLinearGradient(tx,hh*0.2,tx,hh*1.5);
    tg.addColorStop(0,P.cs);
    tg.addColorStop(0.5,'rgba('+(P.c.indexOf('rgb')===0?P.c.slice(4,-1):'150,150,200')+',0.4)');
    tg.addColorStop(1,'rgba(255,255,255,0.05)');
    ctx.strokeStyle=P.c;ctx.globalAlpha=0.5-i*0.03;
    ctx.lineWidth=1.8;
    ctx.beginPath();ctx.moveTo(tx,hh*0.15);
    ctx.bezierCurveTo(tx+tw,hh*0.55,tx-tw*0.5,hh*1.0,tx+tw*1.2,hh*1.4);
    ctx.stroke();
  }
  ctx.globalAlpha=1;
  // Bell body with translucent gradient
  var bg=ctx.createRadialGradient(-hw*0.2,-hh*0.5,hw*0.15,0,-hh*0.2,hw*pulse);
  bg.addColorStop(0,'rgba(255,255,255,0.85)');
  bg.addColorStop(0.5,P.cs);
  bg.addColorStop(0.85,P.c);
  bg.addColorStop(1,'rgba('+(P.c.indexOf('#')===0?'180,100,180':'180,100,180')+',0.3)');
  ctx.fillStyle=bg;ctx.globalAlpha=0.85;
  ctx.beginPath();
  ctx.arc(0,-hh*0.2,hw*pulse,Math.PI,Math.PI*2);
  ctx.quadraticCurveTo(hw*pulse,hh*0.2,0,hh*0.25);
  ctx.quadraticCurveTo(-hw*pulse,hh*0.2,-hw*pulse,-hh*0.2);
  ctx.fill();
  ctx.globalAlpha=1;
  // Inner dome lines (gut radials)
  ctx.strokeStyle='rgba(255,255,255,0.35)';ctx.lineWidth=1;
  for(var i=0;i<4;i++){
    var a=Math.PI+Math.PI*(i+1)/5;
    ctx.beginPath();
    ctx.moveTo(0,-hh*0.15);
    ctx.lineTo(Math.cos(a)*hw*pulse*0.75,Math.sin(a)*hh*0.5-hh*0.05);
    ctx.stroke();
  }
  // Dome highlight
  ctx.fillStyle='rgba(255,255,255,0.45)';
  ctx.beginPath();ctx.ellipse(-hw*0.25,-hh*0.5,hw*0.3,hh*0.12,0.2,0,Math.PI*2);ctx.fill();
  // Bell rim
  ctx.strokeStyle='rgba(255,255,255,0.5)';ctx.lineWidth=1.2;
  ctx.beginPath();
  ctx.moveTo(-hw*pulse,-hh*0.2);
  ctx.quadraticCurveTo(-hw*pulse,hh*0.2,0,hh*0.25);
  ctx.quadraticCurveTo(hw*pulse,hh*0.2,hw*pulse,-hh*0.2);
  ctx.stroke();
};

SH['seaSnail']=function(P){
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  P_.shadow(P);
  // Foot
  ctx.fillStyle=P.cs;
  ctx.beginPath();ctx.ellipse(-hw*0.1,hh*0.4,hw*0.9,hh*0.3,0,0,Math.PI*2);ctx.fill();
  // Spiral shell
  ctx.fillStyle=P.c;
  ctx.beginPath();ctx.arc(0,-hh*0.1,hw*0.7,0,Math.PI*2);ctx.fill();
  // Spiral lines
  ctx.strokeStyle=P.cd;ctx.lineWidth=2;
  for(var i=0;i<3;i++){var r=hw*0.7-i*hw*0.2;
    ctx.beginPath();ctx.arc(i*hw*0.05,-hh*0.1,r,0,Math.PI*1.8);ctx.stroke();}
  // Eyes on stalks
  ctx.strokeStyle=P.cd;ctx.lineWidth=1.2;
  ctx.beginPath();ctx.moveTo(hw*0.7,hh*0.3);ctx.lineTo(hw*0.9,hh*0.1);ctx.stroke();
  ctx.beginPath();ctx.moveTo(hw*0.8,hh*0.4);ctx.lineTo(hw*1.05,hh*0.25);ctx.stroke();
  ctx.fillStyle='#111';
  ctx.beginPath();ctx.arc(hw*0.9,hh*0.1,1.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(hw*1.05,hh*0.25,1.5,0,Math.PI*2);ctx.fill();
};

SH['anemone']=function(P){
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  // Base
  ctx.fillStyle=P.cd;
  ctx.beginPath();ctx.ellipse(0,hh*0.6,hw*0.6,hh*0.3,0,0,Math.PI*2);ctx.fill();
  // Tentacles
  ctx.strokeStyle=P.c;ctx.lineWidth=3;ctx.lineCap='round';
  for(var i=0;i<12;i++){var a=-Math.PI*0.9+i*Math.PI*0.08;
    var len=hh*(0.8+Math.sin(P.time*1.5+i*0.7)*0.2);
    ctx.beginPath();ctx.moveTo(Math.cos(a)*hw*0.3,hh*0.4);
    ctx.lineTo(Math.cos(a)*hw*0.9,hh*0.4-len);ctx.stroke();
    ctx.fillStyle=P.cs;ctx.beginPath();ctx.arc(Math.cos(a)*hw*0.9,hh*0.4-len,2.5,0,Math.PI*2);ctx.fill();}
};

// ═══════════════════════════════════════
// Tier 2-3 — 珊瑚礁小鱼
// ═══════════════════════════════════════

SH['clown']=function(P){
  P_.shadow(P);
  P_.tailTriangle(P,1,0.7);
  P_.bodyOval(P);
  var ctx=P.ctx;
  ctx.strokeStyle='#222';ctx.lineWidth=1;
  ctx.beginPath();ctx.ellipse(0,0,P.hw,P.hh,0,0,Math.PI*2);ctx.stroke();
  P_.stripesVertical(P,[-0.6,-0.08,0.4],0.1);
  // Dorsal + pectoral
  ctx.fillStyle=P.c;ctx.globalAlpha=0.9;
  ctx.beginPath();ctx.moveTo(-P.hw*0.3,-P.hh);ctx.quadraticCurveTo(0,-P.hh*1.3,P.hw*0.15,-P.hh);ctx.fill();
  ctx.globalAlpha=1;
  P_.eye(P,P.hw*0.45,-P.hh*0.18);
};

SH['neon']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  // Slim body
  var bg=ctx.createLinearGradient(0,-hh,0,hh);
  bg.addColorStop(0,P.cd);bg.addColorStop(0.35,P.c);bg.addColorStop(0.65,P.cs);bg.addColorStop(1,'#FFF');
  ctx.fillStyle=bg;ctx.beginPath();ctx.ellipse(0,0,hw,hh*0.7,0,0,Math.PI*2);ctx.fill();
  // Glowing stripe
  ctx.shadowColor=P.cs;ctx.shadowBlur=6;
  ctx.strokeStyle=P.cs;ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(-hw*0.7,-hh*0.05);ctx.lineTo(hw*0.6,-hh*0.05);ctx.stroke();
  ctx.shadowBlur=0;
  P_.tailTriangle(P,1,0.5);
  P_.eye(P,hw*0.5,-hh*0.15,0.9);
};

SH['guppy']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  var fanTail=Math.sin(P.f.tailPhase)*10;
  // Rainbow fan tail
  var tg=ctx.createLinearGradient(-hw-10,-hh,-hw-10,hh);
  tg.addColorStop(0,'#FF6B6B');tg.addColorStop(0.3,P.cs);tg.addColorStop(0.7,P.c);tg.addColorStop(1,'#6B6BFF');
  ctx.fillStyle=tg;ctx.globalAlpha=0.8;
  ctx.beginPath();ctx.moveTo(-hw*0.3,0);
  ctx.quadraticCurveTo(-hw-5+fanTail,-hh*1.3,-hw-14+fanTail,-hh*1.1);
  ctx.quadraticCurveTo(-hw-5+fanTail,0,-hw-14+fanTail,hh*1.1);
  ctx.quadraticCurveTo(-hw-5+fanTail,hh*1.3,-hw*0.3,0);ctx.fill();
  ctx.globalAlpha=1;
  // Body
  P_.bodyOval({ctx:ctx,hw:hw*0.6,hh:hh*0.9,c:P.c,cs:P.cs,cd:P.cd},1,1);
  P_.eye(P,hw*0.45,-hh*0.2);
};

SH['angelfish']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  // Diamond body
  ctx.fillStyle=P.c;
  ctx.beginPath();ctx.moveTo(hw*0.7,0);ctx.lineTo(hw*0.2,-hh*0.9);ctx.lineTo(-hw*0.3,-hh*0.3);
  ctx.lineTo(-hw-5+P.tail,0);ctx.lineTo(-hw*0.3,hh*0.3);ctx.lineTo(hw*0.2,hh*0.9);ctx.closePath();ctx.fill();
  // Vertical stripes
  ctx.strokeStyle=P.cs;ctx.lineWidth=3;
  for(var i=0;i<3;i++){var sx=-hw*0.2+i*hw*0.3;
    ctx.beginPath();ctx.moveTo(sx,-hh*0.6);ctx.lineTo(sx,hh*0.6);ctx.stroke();}
  // Trailing fins
  ctx.strokeStyle=P.c;ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(hw*0.15,-hh*0.85);ctx.quadraticCurveTo(-hw*0.2,-hh*1.4,-hw*0.6,-hh);ctx.stroke();
  ctx.beginPath();ctx.moveTo(hw*0.15,hh*0.85);ctx.quadraticCurveTo(-hw*0.2,hh*1.4,-hw*0.6,hh);ctx.stroke();
  P_.eye(P,hw*0.4,-hh*0.15);
};

SH['betta']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  var fw=Math.sin(P.f.tailPhase)*6;
  // Flowing tail
  ctx.fillStyle=P.cs;ctx.globalAlpha=0.75;
  ctx.beginPath();ctx.moveTo(-hw*0.3,0);
  ctx.quadraticCurveTo(-hw-5+fw,-hh*1.3,-hw-12+fw,-hh*1.1);
  ctx.quadraticCurveTo(-hw-3+fw,0,-hw-12+fw,hh*1.1);
  ctx.quadraticCurveTo(-hw-5+fw,hh*1.3,-hw*0.3,0);ctx.fill();
  ctx.globalAlpha=1;
  P_.bodyOval({ctx:ctx,hw:hw*0.7,hh:hh*0.65,c:P.c,cs:P.cs,cd:P.cd},1,1);
  // Flowing dorsal/anal fins
  ctx.fillStyle=P.cs;ctx.globalAlpha=0.6;
  ctx.beginPath();ctx.moveTo(-hw*0.3,-hh*0.5);ctx.quadraticCurveTo(0,-hh*1.3+fw*0.5,hw*0.2,-hh*0.5);ctx.fill();
  ctx.beginPath();ctx.moveTo(-hw*0.3,hh*0.5);ctx.quadraticCurveTo(0,hh*1.3-fw*0.5,hw*0.2,hh*0.5);ctx.fill();
  ctx.globalAlpha=1;
  P_.eye(P,hw*0.45,-hh*0.15);
};

SH['lionfish']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  var wave=Math.sin(P.f.tailPhase)*0.1;
  // Radiating spiny fins (draw behind body)
  ctx.strokeStyle=P.cd;ctx.lineWidth=1.6;
  for(var i=0;i<14;i++){
    var a=-Math.PI+i*(Math.PI*2/14)+wave;
    var rx=Math.cos(a)*hw*1.05, ry=Math.sin(a)*hh*1.15;
    // Spine line with translucent membrane
    ctx.globalAlpha=0.85;
    ctx.beginPath();ctx.moveTo(Math.cos(a)*hw*0.55,Math.sin(a)*hh*0.45);ctx.lineTo(rx,ry);ctx.stroke();
    // Translucent membrane fan between spines
    if(i<13){
      var a2=-Math.PI+(i+1)*(Math.PI*2/14)+wave;
      var mg=ctx.createRadialGradient(0,0,hw*0.3,0,0,hw*1.1);
      mg.addColorStop(0,'rgba(255,160,80,0.35)');
      mg.addColorStop(1,'rgba(200,60,20,0.15)');
      ctx.fillStyle=mg;ctx.globalAlpha=0.7;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a)*hw*0.55,Math.sin(a)*hh*0.45);
      ctx.lineTo(rx,ry);
      ctx.lineTo(Math.cos(a2)*hw*1.05,Math.sin(a2)*hh*1.15);
      ctx.lineTo(Math.cos(a2)*hw*0.55,Math.sin(a2)*hh*0.45);
      ctx.closePath();ctx.fill();
    }
    ctx.fillStyle='rgba(255,230,180,0.9)';ctx.globalAlpha=1;
    ctx.beginPath();ctx.arc(rx,ry,1.8,0,Math.PI*2);ctx.fill();
  }
  ctx.globalAlpha=1;
  // Body with gradient
  var bg=ctx.createRadialGradient(hw*0.1,-hh*0.2,2,0,0,hw*0.8);
  bg.addColorStop(0,P.cs);bg.addColorStop(0.4,P.c);bg.addColorStop(1,P.cd);
  ctx.fillStyle=bg;ctx.beginPath();ctx.ellipse(0,0,hw*0.6,hh*0.5,0,0,Math.PI*2);ctx.fill();
  // Zebra stripes — dark vertical bands, clipped to body
  ctx.save();
  ctx.beginPath();ctx.ellipse(0,0,hw*0.6,hh*0.5,0,0,Math.PI*2);ctx.clip();
  ctx.fillStyle='rgba(80,30,10,0.55)';
  for(var i=-2;i<=2;i++){
    ctx.fillRect(i*hw*0.16-hw*0.03,-hh*0.5,hw*0.06,hh);
  }
  ctx.restore();
  // Body outline
  ctx.strokeStyle='rgba(40,20,10,0.4)';ctx.lineWidth=0.8;
  ctx.beginPath();ctx.ellipse(0,0,hw*0.6,hh*0.5,0,0,Math.PI*2);ctx.stroke();
  // Tail
  P_.tailTriangle(P,0.5,0.5);
  P_.eye(P,hw*0.35,-hh*0.2);
};

SH['tang']=function(P){
  P_.shadow(P);
  P_.tailTriangle(P,0.7,0.5);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  var bg=ctx.createLinearGradient(0,-hh,0,hh);
  bg.addColorStop(0,P.cs);bg.addColorStop(0.5,P.c);bg.addColorStop(1,P.cd);
  ctx.fillStyle=bg;ctx.beginPath();ctx.ellipse(0,0,hw*0.85,hh,0,0,Math.PI*2);ctx.fill();
  // Black palette mark
  ctx.fillStyle='rgba(0,0,0,0.55)';
  ctx.beginPath();ctx.moveTo(-hw*0.4,-hh*0.3);ctx.quadraticCurveTo(0,-hh*0.1,hw*0.3,-hh*0.2);
  ctx.lineTo(hw*0.3,hh*0.3);ctx.quadraticCurveTo(0,hh*0.5,-hw*0.4,hh*0.3);ctx.closePath();ctx.fill();
  // Yellow tail accent
  ctx.fillStyle='#FFD700';
  ctx.beginPath();ctx.moveTo(-hw*0.6,-hh*0.3);ctx.lineTo(-hw-2,-hh*0.4);ctx.lineTo(-hw-2,hh*0.4);ctx.lineTo(-hw*0.6,hh*0.3);ctx.fill();
  P_.eye(P,hw*0.5,-hh*0.1);
};

SH['yellowTang']=function(P){
  P_.shadow(P);
  P_.tailTriangle(P,0.6,0.4);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  // Oval yellow body
  var bg=ctx.createRadialGradient(0,-hh*0.2,3,0,0,Math.max(hw,hh));
  bg.addColorStop(0,'#FFF8DC');bg.addColorStop(0.5,P.c);bg.addColorStop(1,P.cd);
  ctx.fillStyle=bg;ctx.beginPath();ctx.ellipse(0,0,hw*0.85,hh,0,0,Math.PI*2);ctx.fill();
  // Pointed snout
  ctx.fillStyle=P.c;ctx.beginPath();ctx.moveTo(hw*0.7,-hh*0.1);ctx.lineTo(hw+3,0);ctx.lineTo(hw*0.7,hh*0.1);ctx.fill();
  // Dorsal + ventral fins
  ctx.fillStyle=P.c;ctx.globalAlpha=0.7;
  ctx.beginPath();ctx.moveTo(-hw*0.1,-hh);ctx.quadraticCurveTo(hw*0.05,-hh*1.3,hw*0.2,-hh);ctx.fill();
  ctx.beginPath();ctx.moveTo(-hw*0.1,hh);ctx.quadraticCurveTo(hw*0.05,hh*1.3,hw*0.2,hh);ctx.fill();
  ctx.globalAlpha=1;
  P_.eye(P,hw*0.4,-hh*0.1);
};

SH['mooridolfish']=function(P){ // 长鬚蝴蝶鱼
  P_.shadow(P);
  P_.tailTriangle(P,0.7,0.5);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  // White body
  ctx.fillStyle=P.cs;ctx.beginPath();ctx.ellipse(0,0,hw*0.85,hh,0,0,Math.PI*2);ctx.fill();
  // Three wide black bands
  ctx.fillStyle=P.c;
  ctx.fillRect(-hw*0.7,-hh,hw*0.2,hh*2);
  ctx.fillRect(-hw*0.1,-hh,hw*0.2,hh*2);
  ctx.fillRect(hw*0.5,-hh,hw*0.25,hh*2);
  // Long filament
  ctx.strokeStyle='#FFD700';ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(0,-hh);ctx.quadraticCurveTo(hw*0.3,-hh*1.8,hw*0.5,-hh*1.6);ctx.stroke();
  // Snout
  ctx.fillStyle=P.c;ctx.beginPath();ctx.moveTo(hw*0.7,-hh*0.05);ctx.lineTo(hw+3,0);ctx.lineTo(hw*0.7,hh*0.1);ctx.fill();
  P_.eyeSimple(P,hw*0.4,-hh*0.1,1);
};

// ═══════════════════════════════════════
// Tier 3-4 — 常见鱼
// ═══════════════════════════════════════

SH['butterfly']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  ctx.fillStyle=P.c;ctx.beginPath();ctx.moveTo(-hw*0.6,0);ctx.lineTo(-hw-4+P.tail,-hh*0.4);ctx.lineTo(-hw-4+P.tail,hh*0.4);ctx.closePath();ctx.fill();
  P_.bodyDisc(P,0.85,1);
  // Black eye band
  ctx.fillStyle='rgba(0,0,0,0.6)';
  ctx.save();ctx.rotate(-0.3);ctx.fillRect(hw*0.2,-hh*1.1,hw*0.15,hh*2.2);ctx.restore();
  // Snout
  ctx.fillStyle=P.c;ctx.beginPath();ctx.moveTo(hw*0.8,0);ctx.lineTo(hw+4,-hh*0.1);ctx.lineTo(hw+4,hh*0.1);ctx.closePath();ctx.fill();
  // Fins
  ctx.fillStyle=P.c;ctx.globalAlpha=0.65;
  ctx.beginPath();ctx.moveTo(-hw*0.1,-hh);ctx.quadraticCurveTo(hw*0.1,-hh*1.3,hw*0.3,-hh);ctx.fill();
  ctx.beginPath();ctx.moveTo(-hw*0.1,hh);ctx.quadraticCurveTo(hw*0.1,hh*1.3,hw*0.3,hh);ctx.fill();
  ctx.globalAlpha=1;
  P_.eye(P,hw*0.4,-hh*0.1);
};

SH['puffer']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  var pr=hw*0.8;
  // Spherical body with gradient (bright top-left → main → dark belly)
  var bg=ctx.createRadialGradient(-pr*0.25,-pr*0.35,pr*0.15,0,0,pr);
  bg.addColorStop(0,P.cs);bg.addColorStop(0.4,P.c);bg.addColorStop(1,P.cd);
  ctx.fillStyle=bg;ctx.beginPath();ctx.arc(0,0,pr,0,Math.PI*2);ctx.fill();
  // Countershading belly light
  var cs=ctx.createLinearGradient(0,-pr,0,pr);
  cs.addColorStop(0,'rgba(0,0,0,0.15)');
  cs.addColorStop(0.5,'rgba(0,0,0,0)');
  cs.addColorStop(1,'rgba(255,245,220,0.35)');
  ctx.fillStyle=cs;ctx.beginPath();ctx.arc(0,0,pr,0,Math.PI*2);ctx.fill();
  // Subtle brown spots (no dark line artifact)
  ctx.fillStyle='rgba(60,40,15,0.35)';
  for(var i=0;i<10;i++){
    var sa=i*0.97+0.3, sr=pr*(0.25+(i%3)*0.2);
    var sx=Math.cos(sa)*sr, sy=Math.sin(sa)*sr*0.85;
    ctx.beginPath();ctx.arc(sx,sy,1.8+(i%3)*0.4,0,Math.PI*2);ctx.fill();
  }
  // Spines — thin triangles pointing outward
  ctx.fillStyle=P.cd;
  for(var i=0;i<16;i++){
    var a=i*Math.PI/8+0.1;
    var sx=Math.cos(a)*pr, sy=Math.sin(a)*pr;
    var nx=Math.cos(a), ny=Math.sin(a);
    var tx=-ny, ty=nx; // perp
    ctx.beginPath();
    ctx.moveTo(sx*0.95+tx*1.2, sy*0.95+ty*1.2);
    ctx.lineTo(sx+nx*4, sy+ny*4);
    ctx.lineTo(sx*0.95-tx*1.2, sy*0.95-ty*1.2);
    ctx.closePath();ctx.fill();
  }
  // Tiny tail
  ctx.fillStyle=P.c;ctx.beginPath();ctx.moveTo(-pr*0.82,0);ctx.lineTo(-pr-5+P.tail,-hh*0.22);ctx.lineTo(-pr-5+P.tail,hh*0.22);ctx.closePath();ctx.fill();
  // Tiny side fin
  ctx.fillStyle=P.cd;ctx.globalAlpha=0.6;
  ctx.beginPath();ctx.moveTo(pr*0.1,pr*0.3);ctx.quadraticCurveTo(pr*0.25,pr*0.55,pr*0.35,pr*0.3);ctx.closePath();ctx.fill();
  ctx.globalAlpha=1;
  // Big eyes
  P_.eye(P,pr*0.3,-pr*0.2,1.5);
  // Small puckered mouth
  ctx.fillStyle='rgba(120,70,40,0.55)';
  ctx.beginPath();ctx.ellipse(pr*0.68,pr*0.05,2.8,1.8,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='rgba(50,25,10,0.6)';ctx.lineWidth=0.8;
  ctx.beginPath();ctx.moveTo(pr*0.62,pr*0.05);ctx.lineTo(pr*0.74,pr*0.05);ctx.stroke();
};

SH['seahorse']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  ctx.save();ctx.rotate(Math.PI/2);
  var bw=hh*0.3,bh=hw*0.9;
  ctx.fillStyle=P.c;
  ctx.beginPath();
  ctx.moveTo(-bh,0);ctx.bezierCurveTo(-bh*0.7,-bw*2,-bh*0.2,-bw*2,0,-bw);
  ctx.bezierCurveTo(bh*0.2,0,bh*0.4,bw,bh*0.6,bw*1.5);
  ctx.lineTo(bh*0.5,bw*1.8);
  ctx.bezierCurveTo(bh*0.3,bw*1.2,bh*0.1,bw*0.5,-bh*0.1,0);
  ctx.bezierCurveTo(-bh*0.4,-bw*1.5,-bh*0.8,-bw*1.5,-bh,0);ctx.fill();
  // Snout
  ctx.fillStyle=P.cd;ctx.beginPath();ctx.ellipse(-bh*0.9,-bw*0.5,bh*0.15,bw*0.3,0.5,0,Math.PI*2);ctx.fill();
  // Ridges
  ctx.strokeStyle=P.cd;ctx.lineWidth=1;
  for(var i=0;i<5;i++){var ry=-bh*0.6+i*bh*0.25;
    ctx.beginPath();ctx.moveTo(ry,-bw*1.2);ctx.lineTo(ry,bw*0.5);ctx.stroke();}
  ctx.restore();
  ctx.fillStyle='#111';ctx.beginPath();ctx.arc(0,-hh*0.35,P.er,0,Math.PI*2);ctx.fill();
};

SH['koi']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  ctx.fillStyle=P.cs;
  ctx.beginPath();ctx.moveTo(hw,0);ctx.quadraticCurveTo(hw*0.5,-hh*0.9,-hw*0.5,-hh*0.6);
  ctx.lineTo(-hw,0);ctx.lineTo(-hw*0.5,hh*0.6);ctx.quadraticCurveTo(hw*0.5,hh*0.9,hw,0);ctx.fill();
  // Red patches
  ctx.fillStyle=P.c;
  ctx.beginPath();ctx.ellipse(hw*0.4,-hh*0.3,hw*0.25,hh*0.3,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(-hw*0.1,hh*0.3,hw*0.3,hh*0.3,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(-hw*0.5,-hh*0.2,hw*0.2,hh*0.2,0,0,Math.PI*2);ctx.fill();
  // Flowing tail
  ctx.fillStyle=P.cs;ctx.globalAlpha=0.85;
  ctx.beginPath();ctx.moveTo(-hw,0);ctx.lineTo(-hw-8+P.tail,-hh*0.9);ctx.lineTo(-hw+3,0);ctx.lineTo(-hw-8+P.tail,hh*0.9);ctx.closePath();ctx.fill();
  ctx.globalAlpha=1;
  // Barbels
  ctx.strokeStyle=P.cd;ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(hw*0.9,hh*0.1);ctx.lineTo(hw+4,hh*0.3);ctx.stroke();
  ctx.beginPath();ctx.moveTo(hw*0.9,hh*0.15);ctx.lineTo(hw+3,hh*0.4);ctx.stroke();
  P_.eye(P,hw*0.5,-hh*0.2);
};

SH['goldfish']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  // Rounded body
  P_.bodyOval({ctx:ctx,hw:hw*0.75,hh:hh*0.95,c:P.c,cs:P.cs,cd:P.cd},1,1);
  // Double flowing tail
  var fw=Math.sin(P.f.tailPhase)*5;
  ctx.fillStyle=P.cs;ctx.globalAlpha=0.85;
  ctx.beginPath();ctx.moveTo(-hw*0.6,0);
  ctx.quadraticCurveTo(-hw-5+fw,-hh*1.2,-hw-10+fw,-hh*0.8);
  ctx.quadraticCurveTo(-hw-3+fw,0,-hw-10+fw,hh*0.8);
  ctx.quadraticCurveTo(-hw-5+fw,hh*1.2,-hw*0.6,0);ctx.fill();
  ctx.globalAlpha=1;
  // Flowy dorsal fin
  ctx.fillStyle=P.c;ctx.globalAlpha=0.7;
  ctx.beginPath();ctx.moveTo(-hw*0.3,-hh*0.8);ctx.quadraticCurveTo(0,-hh*1.2,hw*0.3,-hh*0.8);ctx.fill();
  ctx.globalAlpha=1;
  P_.eye(P,hw*0.45,-hh*0.2,1.1);
};

SH['grouper']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  ctx.fillStyle=P.c;
  ctx.beginPath();ctx.moveTo(hw+4,0);ctx.quadraticCurveTo(hw*0.6,-hh,-hw*0.5,-hh*0.7);
  ctx.lineTo(-hw,0);ctx.lineTo(-hw*0.5,hh*0.7);ctx.quadraticCurveTo(hw*0.6,hh,hw+4,0);ctx.fill();
  P_.dots(P,10,P.cd);
  // Big mouth
  ctx.fillStyle='rgba(0,0,0,0.5)';
  ctx.beginPath();ctx.ellipse(hw*0.85,hh*0.1,hw*0.15,hh*0.15,0,0,Math.PI*2);ctx.fill();
  // Dorsal spines
  ctx.strokeStyle=P.c;ctx.lineWidth=1.5;
  for(var i=0;i<7;i++){var sx=-hw*0.3+i*hw*0.12;
    ctx.beginPath();ctx.moveTo(sx,-hh*0.8);ctx.lineTo(sx,-hh*1.1);ctx.stroke();}
  P_.tailTriangle(P,0.8,0.7);
  P_.eye(P,hw*0.6,-hh*0.25,1.1);
};

SH['flatfish']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  P_.bodyOval({ctx:ctx,hw:hw,hh:hh*0.9,c:P.c,cs:P.cs,cd:P.cd},1,1);
  P_.dots(P,14,P.cd);
  // Fringe fins
  ctx.strokeStyle=P.c;ctx.lineWidth=1.2;
  for(var i=0;i<16;i++){var a=Math.PI*(i/16);
    var fx1=Math.cos(a)*hw,fy1=Math.sin(a)*hh*0.9;
    var fx2=Math.cos(a)*hw*1.18,fy2=Math.sin(a)*hh*1.08;
    ctx.beginPath();ctx.moveTo(fx1,-fy1);ctx.lineTo(fx2,-fy2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(fx1,fy1);ctx.lineTo(fx2,fy2);ctx.stroke();}
  // Both eyes on top side
  P_.eyeSimple(P,hw*0.3,-hh*0.3,1.2);
  P_.eyeSimple(P,hw*0.5,-hh*0.15,1.2);
};

SH['crab']=function(P){
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  P_.shadow(P);
  var leg=Math.sin(P.f.tailPhase)*3;
  // Legs
  ctx.strokeStyle=P.cd;ctx.lineWidth=3;ctx.lineCap='round';
  for(var i=0;i<4;i++){var la=Math.PI*0.2+i*0.25;
    var l1=Math.cos(la)*hw*0.8,l2=Math.sin(la)*hh*0.5;
    ctx.beginPath();ctx.moveTo(-l1*0.7,l2*0.5);ctx.lineTo(-l1*1.1,l2*1.2+leg);ctx.stroke();
    ctx.beginPath();ctx.moveTo(l1*0.7,l2*0.5);ctx.lineTo(l1*1.1,l2*1.2+leg);ctx.stroke();}
  // Shell
  P_.bodyOval({ctx:ctx,hw:hw*0.75,hh:hh*0.5,c:P.c,cs:P.cs,cd:P.cd},1,1);
  // Shell texture
  ctx.strokeStyle=P.cd;ctx.lineWidth=1;
  ctx.beginPath();ctx.ellipse(0,0,hw*0.55,hh*0.35,0,0,Math.PI*2);ctx.stroke();
  // Claws
  ctx.fillStyle=P.c;
  ctx.beginPath();ctx.ellipse(hw*0.9,-hh*0.3,hw*0.22,hh*0.15,-0.4,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(-hw*0.9,-hh*0.3,hw*0.22,hh*0.15,0.4,0,Math.PI*2);ctx.fill();
  // Eye stalks
  ctx.strokeStyle=P.cd;ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(hw*0.15,-hh*0.3);ctx.lineTo(hw*0.2,-hh*0.55);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-hw*0.15,-hh*0.3);ctx.lineTo(-hw*0.2,-hh*0.55);ctx.stroke();
  P_.eyeSimple(P,hw*0.2,-hh*0.55,0.6);
  P_.eyeSimple(P,-hw*0.2,-hh*0.55,0.6);
};

SH['snapper']=function(P){ // 红鲷
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  P_.bodyTorpedo(P,1,0.85);
  P_.bellyLight(P,0.3);
  // Scales
  ctx.strokeStyle=P.cd;ctx.lineWidth=0.6;ctx.globalAlpha=0.4;
  for(var r=0;r<3;r++){for(var i=0;i<6;i++){
    ctx.beginPath();ctx.arc(-hw*0.5+i*hw*0.2,-hh*0.3+r*hh*0.3,hh*0.12,-0.5,Math.PI-0.5);ctx.stroke();}}
  ctx.globalAlpha=1;
  // Spiny dorsal
  ctx.strokeStyle=P.cd;ctx.lineWidth=1.5;
  for(var i=0;i<6;i++){var sx=-hw*0.2+i*hw*0.1;
    ctx.beginPath();ctx.moveTo(sx,-hh*0.75);ctx.lineTo(sx,-hh*1.05);ctx.stroke();}
  P_.tailCrescent(P,0.7);
  P_.eye(P,hw*0.55,-hh*0.25);
};

SH['parrotfish']=function(P){ // 鹦嘴鱼
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  // Body with rainbow gradient
  var bg=ctx.createLinearGradient(0,-hh,0,hh);
  bg.addColorStop(0,'#FF69B4');bg.addColorStop(0.3,P.c);bg.addColorStop(0.7,P.cs);bg.addColorStop(1,'#20B2AA');
  ctx.fillStyle=bg;
  ctx.beginPath();ctx.moveTo(hw,0);ctx.quadraticCurveTo(hw*0.5,-hh*0.9,-hw*0.5,-hh*0.6);
  ctx.lineTo(-hw,0);ctx.lineTo(-hw*0.5,hh*0.6);ctx.quadraticCurveTo(hw*0.5,hh*0.9,hw,0);ctx.fill();
  // Beak (parrot-like)
  ctx.fillStyle=P.cd;
  ctx.beginPath();ctx.ellipse(hw*0.95,0,hw*0.1,hh*0.15,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#FFF';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(hw*0.92,-hh*0.05);ctx.lineTo(hw+2,-hh*0.05);ctx.moveTo(hw*0.92,hh*0.05);ctx.lineTo(hw+2,hh*0.05);ctx.stroke();
  // Scales
  ctx.strokeStyle='rgba(0,0,0,0.15)';ctx.lineWidth=0.8;
  for(var r=0;r<4;r++){for(var i=0;i<7;i++){
    var sx=-hw*0.6+i*hw*0.17,sy=-hh*0.4+r*hh*0.25;
    ctx.beginPath();ctx.arc(sx,sy,hh*0.1,-0.5,Math.PI-0.5);ctx.stroke();}}
  P_.tailCrescent(P,0.7);
  P_.eye(P,hw*0.6,-hh*0.3);
};

SH['triggerfish']=function(P){ // 炮弹鱼
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  // Teardrop body
  var bg=ctx.createLinearGradient(0,-hh,0,hh);
  bg.addColorStop(0,P.cs);bg.addColorStop(0.5,P.c);bg.addColorStop(1,P.cd);
  ctx.fillStyle=bg;
  ctx.beginPath();ctx.ellipse(0,0,hw*0.8,hh*0.9,0,0,Math.PI*2);ctx.fill();
  // Contrasting markings
  ctx.fillStyle=P.cd;
  ctx.beginPath();ctx.ellipse(hw*0.3,hh*0.2,hw*0.3,hh*0.3,0,0,Math.PI*2);ctx.fill();
  // Dorsal trigger fin
  ctx.strokeStyle=P.cd;ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(hw*0.2,-hh*0.8);ctx.lineTo(hw*0.2,-hh*1.1);ctx.stroke();
  // Upper/lower fins
  ctx.fillStyle=P.c;ctx.globalAlpha=0.7;
  ctx.beginPath();ctx.moveTo(-hw*0.3,-hh*0.7);ctx.quadraticCurveTo(-hw*0.1,-hh*1.1,hw*0.1,-hh*0.7);ctx.fill();
  ctx.beginPath();ctx.moveTo(-hw*0.3,hh*0.7);ctx.quadraticCurveTo(-hw*0.1,hh*1.1,hw*0.1,hh*0.7);ctx.fill();
  ctx.globalAlpha=1;
  P_.tailTriangle(P,0.6,0.5);
  P_.eye(P,hw*0.5,-hh*0.2);
};

SH['fish']=function(P){
  P_.shadow(P);
  P_.tailTriangle(P);
  P_.bodyOval(P);
  P_.highlight(P);
  P_.finDorsal(P);
  P_.eye(P,P.hw*0.45,-P.hh*0.15);
};

// ═══════════════════════════════════════
// Tier 5-6 — 大型鱼
// ═══════════════════════════════════════

SH['tuna']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  P_.bodyTorpedo(P);
  P_.bellyLight(P,0.3);
  // Dark back
  ctx.fillStyle=P.cd;ctx.globalAlpha=0.3;
  ctx.beginPath();ctx.ellipse(0,-hh*0.3,hw*0.7,hh*0.3,0,Math.PI,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
  P_.tailCrescent(P);
  P_.finDorsalTall(P,1.2);
  // Finlets
  ctx.fillStyle=P.cd;
  for(var i=0;i<3;i++){
    ctx.beginPath();ctx.moveTo(-hw*0.5-i*hw*0.12,-hh*0.4);ctx.lineTo(-hw*0.5-i*hw*0.12,-hh*0.6);ctx.lineTo(-hw*0.45-i*hw*0.12,-hh*0.4);ctx.fill();}
  P_.eye(P,hw*0.5,-hh*0.2);
};

SH['sword']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  ctx.fillStyle=P.c;
  ctx.beginPath();ctx.moveTo(hw*0.4,0);ctx.quadraticCurveTo(hw*0.2,-hh*0.8,-hw*0.5,-hh*0.3);
  ctx.lineTo(-hw,0);ctx.lineTo(-hw*0.5,hh*0.3);ctx.quadraticCurveTo(hw*0.2,hh*0.8,hw*0.4,0);ctx.fill();
  // Sword bill
  ctx.fillStyle=P.cd;ctx.beginPath();ctx.moveTo(hw*0.4,-1);ctx.lineTo(hw+hw*0.5,0);ctx.lineTo(hw*0.4,1);ctx.fill();
  P_.bellyLight(P,0.25);
  P_.tailCrescent(P,0.7);
  P_.finDorsalTall(P,0.9);
  P_.eye(P,hw*0.25,-hh*0.2);
};

SH['turtle']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  var sw=hw*0.7,sh=hh*0.65;
  var fa=Math.sin(P.f.tailPhase)*0.25;
  // Flippers
  ctx.fillStyle='#3CB371';
  ctx.save();ctx.translate(hw*0.2,-sh*0.8);ctx.rotate(-0.5+fa);ctx.beginPath();ctx.ellipse(0,0,hw*0.3,hh*0.12,0,0,Math.PI*2);ctx.fill();ctx.restore();
  ctx.save();ctx.translate(hw*0.2,sh*0.8);ctx.rotate(0.5-fa);ctx.beginPath();ctx.ellipse(0,0,hw*0.3,hh*0.12,0,0,Math.PI*2);ctx.fill();ctx.restore();
  ctx.save();ctx.translate(-hw*0.3,-sh*0.6);ctx.rotate(-0.3-fa*0.5);ctx.beginPath();ctx.ellipse(0,0,hw*0.2,hh*0.1,0,0,Math.PI*2);ctx.fill();ctx.restore();
  ctx.save();ctx.translate(-hw*0.3,sh*0.6);ctx.rotate(0.3+fa*0.5);ctx.beginPath();ctx.ellipse(0,0,hw*0.2,hh*0.1,0,0,Math.PI*2);ctx.fill();ctx.restore();
  // Shell
  var sg=ctx.createRadialGradient(0,-sh*0.2,sw*0.2,0,0,sw);
  sg.addColorStop(0,'#6BC88A');sg.addColorStop(0.6,P.c);sg.addColorStop(1,P.cd);
  ctx.fillStyle=sg;ctx.beginPath();ctx.ellipse(0,0,sw,sh,0,0,Math.PI*2);ctx.fill();
  // Hex pattern
  ctx.strokeStyle='rgba(30,80,50,0.4)';ctx.lineWidth=1.2;
  ctx.beginPath();ctx.ellipse(0,0,sw*0.45,sh*0.45,0,0,Math.PI*2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(-sw*0.5,0);ctx.lineTo(sw*0.5,0);ctx.stroke();
  ctx.beginPath();ctx.moveTo(0,-sh*0.6);ctx.lineTo(0,sh*0.6);ctx.stroke();
  // Head
  ctx.fillStyle='#3CB371';
  ctx.beginPath();ctx.ellipse(hw*0.65,0,hw*0.2,hh*0.16,0,0,Math.PI*2);ctx.fill();
  P_.eyeSimple(P,hw*0.8,-hh*0.05,0.7);
};

SH['ray']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  var wave=Math.sin(P.f.tailPhase)*0.15;
  ctx.save();ctx.rotate(wave);
  ctx.fillStyle=P.c;
  ctx.beginPath();ctx.moveTo(hw*0.5,0);ctx.quadraticCurveTo(hw*0.2,-hh,0,-hh*0.9);
  ctx.quadraticCurveTo(-hw*0.3,-hh*0.5,-hw*0.5,0);
  ctx.quadraticCurveTo(-hw*0.3,hh*0.5,0,hh*0.9);
  ctx.quadraticCurveTo(hw*0.2,hh,hw*0.5,0);ctx.fill();
  ctx.fillStyle='rgba(255,255,255,0.15)';
  ctx.beginPath();ctx.ellipse(hw*0.1,0,hw*0.25,hh*0.4,0,0,Math.PI*2);ctx.fill();
  ctx.restore();
  // Long tail
  ctx.strokeStyle=P.cd;ctx.lineWidth=2.5;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(-hw*0.5,0);ctx.quadraticCurveTo(-hw*0.8,P.tail*0.5,-hw-8,P.tail);ctx.stroke();
  P_.eyeSimple(P,hw*0.2,-hh*0.2,0.8);
  P_.eyeSimple(P,hw*0.2,hh*0.2,0.8);
};

SH['mantaRay']=function(P){ // 蝠鲼
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  ctx.fillStyle=P.c;
  // Wing-like body
  ctx.beginPath();ctx.moveTo(hw*0.4,0);
  ctx.quadraticCurveTo(hw*0.2,-hh*1.1,-hw*0.3,-hh*0.8);
  ctx.lineTo(-hw,0);
  ctx.lineTo(-hw*0.3,hh*0.8);
  ctx.quadraticCurveTo(hw*0.2,hh*1.1,hw*0.4,0);ctx.fill();
  // Cephalic lobes
  ctx.fillStyle=P.cd;
  ctx.beginPath();ctx.ellipse(hw*0.55,-hh*0.15,hw*0.12,hh*0.08,-0.3,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(hw*0.55,hh*0.15,hw*0.12,hh*0.08,0.3,0,Math.PI*2);ctx.fill();
  // White spots (characteristic)
  ctx.fillStyle=P.cs;ctx.globalAlpha=0.6;
  for(var i=0;i<8;i++){var sx=-hw*0.6+Math.sin(i)*hw*0.5,sy=Math.cos(i*2)*hh*0.6;
    ctx.beginPath();ctx.arc(sx,sy,hw*0.05,0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=1;
  // Tail
  ctx.strokeStyle=P.cd;ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(-hw,0);ctx.lineTo(-hw-12,P.tail*0.3);ctx.stroke();
  P_.eyeSimple(P,hw*0.3,-hh*0.25,1);
  P_.eyeSimple(P,hw*0.3,hh*0.25,1);
};

SH['arowana']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  var bg=ctx.createLinearGradient(0,-hh,0,hh);
  bg.addColorStop(0,P.cs);bg.addColorStop(0.5,P.c);bg.addColorStop(1,P.cd);
  ctx.fillStyle=bg;
  ctx.beginPath();ctx.moveTo(hw,-hh*0.1);ctx.quadraticCurveTo(hw*0.3,-hh*0.9,-hw*0.5,-hh*0.5);
  ctx.lineTo(-hw,0);ctx.lineTo(-hw*0.5,hh*0.5);ctx.quadraticCurveTo(hw*0.3,hh*0.9,hw,hh*0.1);ctx.closePath();ctx.fill();
  // Large scales
  ctx.strokeStyle=P.cd;ctx.lineWidth=1;
  for(var r=0;r<3;r++){for(var i=0;i<6;i++){
    var sx=-hw*0.6+i*hw*0.2,sy=-hh*0.4+r*hh*0.4;
    ctx.beginPath();ctx.arc(sx,sy,hh*0.12,-0.5,Math.PI-0.5);ctx.stroke();}}
  // Barbels
  ctx.strokeStyle=P.cd;ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(hw*0.95,hh*0.05);ctx.lineTo(hw+8,hh*0.25);ctx.stroke();
  ctx.beginPath();ctx.moveTo(hw*0.95,hh*0.1);ctx.lineTo(hw+10,hh*0.35);ctx.stroke();
  // Long fins
  ctx.fillStyle=P.c;ctx.globalAlpha=0.5;
  ctx.beginPath();ctx.moveTo(-hw*0.3,-hh*0.5);ctx.lineTo(0,-hh*0.8);ctx.lineTo(hw*0.3,-hh*0.5);ctx.fill();
  ctx.globalAlpha=1;
  P_.tailTriangle(P,0.7,0.6);
  P_.eye(P,hw*0.6,-hh*0.2);
};

SH['bass']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  P_.bodyTorpedo(P);
  // Vertical stripes
  ctx.fillStyle='rgba(0,0,0,0.3)';
  for(var i=0;i<5;i++){var sx=-hw*0.5+i*hw*0.22;
    ctx.fillRect(sx,-hh*0.6,2,hh*1.2);}
  // Spiny dorsal
  ctx.strokeStyle=P.cd;ctx.lineWidth=1.5;
  for(var i=0;i<7;i++){var sx=-hw*0.2+i*hw*0.1;
    ctx.beginPath();ctx.moveTo(sx,-hh*0.7);ctx.lineTo(sx,-hh*1.05);ctx.stroke();}
  P_.tailTriangle(P);
  P_.eye(P,hw*0.5,-hh*0.2);
};

SH['lobster']=function(P){
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  P_.shadow(P);
  var leg=Math.sin(P.f.tailPhase)*2;
  // Tail segments
  ctx.fillStyle=P.c;
  for(var i=0;i<5;i++){var sx=-hw*0.3-i*hw*0.15;
    ctx.beginPath();ctx.ellipse(sx,0,hw*0.15,hh*0.4,0,0,Math.PI*2);ctx.fill();}
  // Tail fan
  ctx.beginPath();ctx.moveTo(-hw,0);
  for(var i=0;i<5;i++){var a=Math.PI+Math.PI*(i-2)*0.15;
    ctx.lineTo(-hw+Math.cos(a)*hh*0.6,Math.sin(a)*hh*0.6);}
  ctx.closePath();ctx.fill();
  // Body
  P_.bodyOval({ctx:ctx,hw:hw*0.35,hh:hh*0.5,c:P.c,cs:P.cs,cd:P.cd},1,1);
  ctx.save();ctx.translate(hw*0.1,0);ctx.restore();
  // Legs
  ctx.strokeStyle=P.cd;ctx.lineWidth=2;ctx.lineCap='round';
  for(var i=0;i<4;i++){var lx=-hw*0.1+i*hw*0.1;
    ctx.beginPath();ctx.moveTo(lx,hh*0.3);ctx.lineTo(lx,hh*0.7+leg);ctx.stroke();
    ctx.beginPath();ctx.moveTo(lx,-hh*0.3);ctx.lineTo(lx,-hh*0.7-leg);ctx.stroke();}
  // Claws
  ctx.fillStyle=P.c;
  ctx.beginPath();ctx.ellipse(hw*0.8,-hh*0.4,hw*0.2,hh*0.15,-0.3,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(hw*0.8,hh*0.4,hw*0.2,hh*0.15,0.3,0,Math.PI*2);ctx.fill();
  // Antennae
  ctx.strokeStyle=P.cd;ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(hw*0.5,-hh*0.2);ctx.quadraticCurveTo(hw*0.9,-hh*0.7,hw+12,-hh*0.4);ctx.stroke();
  ctx.beginPath();ctx.moveTo(hw*0.5,hh*0.2);ctx.quadraticCurveTo(hw*0.9,hh*0.7,hw+12,hh*0.4);ctx.stroke();
  P_.eyeSimple(P,hw*0.42,-hh*0.15,0.6);
  P_.eyeSimple(P,hw*0.42,hh*0.15,0.6);
};

SH['shark']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  // Body 轮廓
  ctx.beginPath();ctx.moveTo(hw+4,0);ctx.quadraticCurveTo(hw*0.6,-hh*0.85,0,-hh*0.6);
  ctx.lineTo(-hw*0.6,-hh*0.25);ctx.lineTo(-hw,0);ctx.lineTo(-hw*0.6,hh*0.25);
  ctx.lineTo(0,hh*0.7);ctx.quadraticCurveTo(hw*0.6,hh*0.85,hw+4,0);
  ctx.closePath();
  // 身体渐变：上深下浅 countershading
  var bg=ctx.createLinearGradient(0,-hh*0.7,0,hh*0.7);
  bg.addColorStop(0,P.cd);
  bg.addColorStop(0.4,P.c);
  bg.addColorStop(0.75,P.c);
  bg.addColorStop(1,P.cs);
  ctx.fillStyle=bg;ctx.fill();
  // 背部暗色条（模拟鲨鱼真实的上背色）
  ctx.globalAlpha=0.3;ctx.fillStyle=P.cd;
  ctx.beginPath();
  ctx.moveTo(hw*0.9,-hh*0.05);ctx.quadraticCurveTo(hw*0.5,-hh*0.75,0,-hh*0.55);
  ctx.lineTo(-hw*0.6,-hh*0.22);ctx.lineTo(-hw*0.5,-hh*0.1);
  ctx.quadraticCurveTo(0,-hh*0.3,hw*0.9,-hh*0.05);ctx.fill();
  ctx.globalAlpha=1;
  P_.finDorsalTall(P,1.5);
  // Pectoral fins
  ctx.fillStyle=P.cd;ctx.globalAlpha=0.75;
  ctx.beginPath();ctx.moveTo(hw*0.1,hh*0.3);ctx.lineTo(hw*0.0,hh*0.85);ctx.lineTo(hw*0.3,hh*0.4);ctx.fill();
  ctx.globalAlpha=1;
  P_.tailCrescent(P);
  // Gills 鳃线（5 条）
  ctx.strokeStyle='rgba(0,0,0,0.35)';ctx.lineWidth=1;
  for(var i=0;i<5;i++){
    var gx=hw*0.25+i*3.5;
    ctx.beginPath();ctx.moveTo(gx,-hh*0.25);ctx.quadraticCurveTo(gx-1,0,gx,hh*0.18);ctx.stroke();
  }
  // 嘴线
  ctx.strokeStyle='rgba(0,0,0,0.4)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(hw*0.7,hh*0.12);ctx.quadraticCurveTo(hw*0.88,hh*0.18,hw+2,hh*0.05);ctx.stroke();
  P_.eye(P,hw*0.55,-hh*0.2,0.9);
};

SH['dolphin']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  ctx.beginPath();ctx.moveTo(hw+6,-1);ctx.quadraticCurveTo(hw,-hh*0.8,-hw*0.3,-hh*0.5);
  ctx.lineTo(-hw,0);ctx.lineTo(-hw*0.3,hh*0.5);ctx.quadraticCurveTo(hw,hh*0.8,hw+6,1);ctx.closePath();
  var bg=ctx.createLinearGradient(0,-hh*0.6,0,hh*0.5);
  bg.addColorStop(0,P.cd);bg.addColorStop(0.4,P.c);bg.addColorStop(0.75,P.c);bg.addColorStop(1,P.cs);
  ctx.fillStyle=bg;ctx.fill();
  // Curved dorsal
  ctx.fillStyle=P.cd;
  ctx.beginPath();ctx.moveTo(-hw*0.05,-hh*0.5);ctx.quadraticCurveTo(hw*0.05,-hh*1.1,hw*0.2,-hh*0.5);ctx.fill();
  // Tail flukes
  ctx.fillStyle=P.c;
  ctx.beginPath();ctx.moveTo(-hw,0);ctx.lineTo(-hw-7+P.tail,-hh*0.9);ctx.lineTo(-hw+3,0);ctx.fill();
  ctx.beginPath();ctx.moveTo(-hw,0);ctx.lineTo(-hw-7+P.tail,hh*0.9);ctx.lineTo(-hw+3,0);ctx.fill();
  // Pectoral
  ctx.fillStyle=P.cd;
  ctx.beginPath();ctx.moveTo(hw*0.1,hh*0.3);ctx.lineTo(0,hh*0.7);ctx.lineTo(hw*0.25,hh*0.35);ctx.fill();
  // 喷气孔
  ctx.fillStyle='rgba(0,0,0,0.3)';
  ctx.beginPath();ctx.ellipse(hw*0.15,-hh*0.42,1.5,0.8,0,0,Math.PI*2);ctx.fill();
  // Smile
  ctx.strokeStyle=P.cd;ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(hw+2,1);ctx.quadraticCurveTo(hw*0.8,hh*0.2,hw*0.6,hh*0.1);ctx.stroke();
  P_.eye(P,hw*0.55,-hh*0.2);
};

SH['marlin']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  ctx.fillStyle=P.c;
  ctx.beginPath();ctx.moveTo(hw*0.4,0);ctx.quadraticCurveTo(hw*0.2,-hh*0.7,-hw*0.5,-hh*0.3);
  ctx.lineTo(-hw,0);ctx.lineTo(-hw*0.5,hh*0.3);ctx.quadraticCurveTo(hw*0.2,hh*0.7,hw*0.4,0);ctx.fill();
  // Bill
  ctx.fillStyle=P.cd;
  ctx.beginPath();ctx.moveTo(hw*0.4,-0.5);ctx.lineTo(hw+hw*0.6,0);ctx.lineTo(hw*0.4,0.5);ctx.fill();
  // Sail
  ctx.fillStyle=P.c;ctx.globalAlpha=0.5;
  ctx.beginPath();ctx.moveTo(-hw*0.4,-hh*0.3);
  ctx.quadraticCurveTo(-hw*0.1,-hh*1.6,hw*0.3,-hh*0.3);ctx.fill();ctx.globalAlpha=1;
  ctx.fillStyle=P.cd;ctx.globalAlpha=0.2;
  ctx.beginPath();ctx.ellipse(0,-hh*0.2,hw*0.5,hh*0.25,0,Math.PI,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
  ctx.fillStyle=P.c;
  ctx.beginPath();ctx.moveTo(-hw,0);ctx.lineTo(-hw-8+P.tail,-hh*1.0);ctx.lineTo(-hw+4,0);ctx.lineTo(-hw-8+P.tail,hh*0.7);ctx.closePath();ctx.fill();
  P_.eye(P,hw*0.3,-hh*0.15);
};

SH['hammerhead']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  // Body 渐变
  ctx.beginPath();ctx.moveTo(hw*0.6,0);ctx.quadraticCurveTo(hw*0.2,-hh*0.7,-hw*0.6,-hh*0.25);
  ctx.lineTo(-hw,0);ctx.lineTo(-hw*0.6,hh*0.25);ctx.quadraticCurveTo(hw*0.2,hh*0.7,hw*0.6,0);ctx.closePath();
  var bg=ctx.createLinearGradient(0,-hh*0.7,0,hh*0.7);
  bg.addColorStop(0,P.cd);bg.addColorStop(0.4,P.c);bg.addColorStop(0.78,P.c);bg.addColorStop(1,P.cs);
  ctx.fillStyle=bg;ctx.fill();
  // T-shaped head 也加渐变
  var hg=ctx.createLinearGradient(0,-hh*0.8,0,hh*0.8);
  hg.addColorStop(0,P.cd);hg.addColorStop(0.5,P.c);hg.addColorStop(1,P.cs);
  ctx.fillStyle=hg;
  ctx.beginPath();ctx.ellipse(hw*0.75,0,hw*0.1,hh*0.8,0,0,Math.PI*2);ctx.fill();
  // Eyes at ends of T
  P_.eyeSimple(P,hw*0.75,-hh*0.65,0.9);
  P_.eyeSimple(P,hw*0.75,hh*0.65,0.9);
  P_.finDorsalTall(P,1.3);
  P_.tailCrescent(P);
};

SH['anglerfish']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  // Round body with gradient (deep-sea look: dark back, slightly lighter belly)
  var bg=ctx.createRadialGradient(hw*0.1,-hh*0.3,3,0,0,hw*0.9);
  bg.addColorStop(0,P.cs);bg.addColorStop(0.35,P.c);bg.addColorStop(1,P.cd);
  ctx.fillStyle=bg;ctx.beginPath();ctx.ellipse(0,0,hw*0.8,hh*0.7,0,0,Math.PI*2);ctx.fill();
  // Skin bumps/warts
  ctx.fillStyle='rgba(0,0,0,0.25)';
  for(var i=0;i<6;i++){
    var ba=i*1.1+0.6, br=hw*0.4+(i%2)*hw*0.12;
    ctx.beginPath();ctx.arc(Math.cos(ba)*br*0.7,Math.sin(ba)*br*0.5,1.8,0,Math.PI*2);ctx.fill();
  }
  // Big mouth
  ctx.fillStyle='#000';
  ctx.beginPath();ctx.ellipse(hw*0.5,hh*0.1,hw*0.35,hh*0.25,0,0,Math.PI*2);ctx.fill();
  // Teeth
  ctx.fillStyle='#FFF';
  for(var i=0;i<7;i++){var tx=hw*0.25+i*hw*0.07;
    ctx.beginPath();ctx.moveTo(tx,hh*0.0);ctx.lineTo(tx+2,hh*0.15);ctx.lineTo(tx+4,hh*0.0);ctx.fill();
    ctx.beginPath();ctx.moveTo(tx,hh*0.2);ctx.lineTo(tx+2,hh*0.05);ctx.lineTo(tx+4,hh*0.2);ctx.fill();}
  // Glowing lure with soft halo
  var glow=0.7+Math.sin(P.f.tailPhase*2)*0.3;
  ctx.strokeStyle=P.cd;ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(hw*0.2,-hh*0.5);ctx.quadraticCurveTo(hw*0.1,-hh*1.2,hw*0.4,-hh*1.3);ctx.stroke();
  // Outer halo
  var hg=ctx.createRadialGradient(hw*0.4,-hh*1.3,0,hw*0.4,-hh*1.3,hh*0.5);
  hg.addColorStop(0,'rgba(220,255,180,0.5)');
  hg.addColorStop(1,'rgba(200,255,150,0)');
  ctx.fillStyle=hg;
  ctx.beginPath();ctx.arc(hw*0.4,-hh*1.3,hh*0.5,0,Math.PI*2);ctx.fill();
  ctx.shadowColor='rgba(200,255,150,0.8)';ctx.shadowBlur=15;
  ctx.fillStyle='#CFFF80';
  ctx.beginPath();ctx.arc(hw*0.4,-hh*1.3,hh*0.15*glow,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;
  P_.eye(P,-hw*0.1,-hh*0.2,1.2);
  // Small tail
  ctx.fillStyle=P.c;
  ctx.beginPath();ctx.moveTo(-hw*0.7,0);ctx.lineTo(-hw-3+P.tail,-hh*0.4);ctx.lineTo(-hw-3+P.tail,hh*0.4);ctx.closePath();ctx.fill();
};

SH['sunfish']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  P_.bodyDisc(P,0.9,0.95);
  // Texture spots
  ctx.fillStyle='rgba(0,0,0,0.1)';
  for(var i=0;i<18;i++){var a=i*0.4,r=hw*(0.3+Math.sin(i)*0.3);
    ctx.beginPath();ctx.arc(Math.cos(a)*r,Math.sin(a)*r,3,0,Math.PI*2);ctx.fill();}
  // Tall fins
  ctx.fillStyle=P.c;
  ctx.beginPath();ctx.moveTo(-hw*0.2,-hh*0.9);ctx.quadraticCurveTo(0,-hh*1.5,hw*0.3,-hh*0.9);ctx.fill();
  ctx.beginPath();ctx.moveTo(-hw*0.2,hh*0.9);ctx.quadraticCurveTo(0,hh*1.5,hw*0.3,hh*0.9);ctx.fill();
  // Rudder tail
  ctx.fillStyle=P.cd;
  ctx.beginPath();ctx.moveTo(-hw*0.8,-hh*0.2);ctx.quadraticCurveTo(-hw-5,0,-hw*0.8,hh*0.2);ctx.fill();
  // Mouth
  ctx.fillStyle='rgba(0,0,0,0.5)';
  ctx.beginPath();ctx.ellipse(hw*0.82,hh*0.05,hw*0.08,hh*0.05,0,0,Math.PI*2);ctx.fill();
  P_.eye(P,hw*0.6,-hh*0.25,1.3);
};

// ═══════════════════════════════════════
// Tier 7-12 — 深海霸主 & 传说生物
// ═══════════════════════════════════════

SH['orca']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  // Black body with subtle gradient
  ctx.beginPath();ctx.moveTo(hw+3,0);ctx.quadraticCurveTo(hw*0.5,-hh*0.9,-hw*0.2,-hh*0.5);
  ctx.lineTo(-hw,0);ctx.lineTo(-hw*0.2,hh*0.5);ctx.quadraticCurveTo(hw*0.5,hh*0.9,hw+3,0);ctx.closePath();
  var bg=ctx.createLinearGradient(0,-hh*0.8,0,hh*0.5);
  bg.addColorStop(0,'#0A0A1E');
  bg.addColorStop(0.5,'#1A1A2E');
  bg.addColorStop(1,'#2A2A3E');
  ctx.fillStyle=bg;ctx.fill();
  // White belly
  ctx.fillStyle='#F5F5F5';
  ctx.beginPath();ctx.moveTo(hw*0.6,hh*0.1);
  ctx.quadraticCurveTo(hw*0.2,hh*0.65,-hw*0.4,hh*0.3);ctx.lineTo(-hw*0.4,0);ctx.lineTo(hw*0.6,0);ctx.closePath();ctx.fill();
  // 黑白过渡边缘软化
  ctx.strokeStyle='rgba(26,26,46,0.25)';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(hw*0.6,hh*0.05);ctx.quadraticCurveTo(hw*0.2,hh*0.6,-hw*0.4,hh*0.25);ctx.stroke();
  // Eye patch
  ctx.fillStyle='#F5F5F5';
  ctx.beginPath();ctx.ellipse(hw*0.35,-hh*0.25,hw*0.16,hh*0.18,0.4,0,Math.PI*2);ctx.fill();
  // Saddle
  ctx.fillStyle='#4A4A5A';
  ctx.beginPath();ctx.ellipse(-hw*0.15,-hh*0.3,hw*0.18,hh*0.12,-0.2,0,Math.PI*2);ctx.fill();
  // Tall dorsal
  ctx.fillStyle='#1A1A2E';
  ctx.beginPath();ctx.moveTo(-hw*0.05,-hh*0.5);ctx.lineTo(hw*0.02,-hh*1.6);ctx.lineTo(hw*0.18,-hh*0.5);ctx.fill();
  // Pectoral
  ctx.beginPath();ctx.moveTo(hw*0.15,hh*0.3);ctx.lineTo(hw*0.0,hh*0.75);ctx.lineTo(hw*0.28,hh*0.4);ctx.fill();
  // Tail
  ctx.beginPath();ctx.moveTo(-hw,0);ctx.lineTo(-hw-10+P.tail,-hh*1.1);ctx.lineTo(-hw+5,0);ctx.fill();
  ctx.beginPath();ctx.moveTo(-hw,0);ctx.lineTo(-hw-8+P.tail,hh*0.8);ctx.lineTo(-hw+4,0);ctx.fill();
  // 背部高光
  ctx.fillStyle='rgba(255,255,255,0.08)';
  ctx.beginPath();ctx.ellipse(hw*0.2,-hh*0.55,hw*0.35,hh*0.1,0,0,Math.PI*2);ctx.fill();
  P_.eyeSimple(P,hw*0.38,-hh*0.22,0.6);
};

SH['octopus']=function(P){
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  var headR=hw*0.4;
  ctx.lineCap='round';
  // 8 tentacles with gradient thickness and suckers
  for(var i=0;i<8;i++){
    var ta=Math.PI*0.12+i*Math.PI*0.095;
    var tw=Math.sin(P.f.tailPhase+i*0.7)*7;
    var tx1=Math.cos(ta)*headR*0.7,ty1=headR*0.4;
    var tx2=Math.cos(ta)*hw*0.65+tw,ty2=hh*0.6;
    var tx3=Math.cos(ta)*hw*0.85+tw*1.3,ty3=hh*0.95;
    // Gradient tentacle: dark outer edge, bright center
    var tg=ctx.createLinearGradient(tx1,ty1,tx3,ty3);
    tg.addColorStop(0,P.c);
    tg.addColorStop(0.6,P.cd);
    tg.addColorStop(1,P.cd);
    ctx.strokeStyle=tg;ctx.lineWidth=5-i*0.35;
    ctx.beginPath();ctx.moveTo(tx1,ty1);ctx.bezierCurveTo(tx2,ty2,tx2+tw*0.5,ty3,tx3,ty3);ctx.stroke();
    // Suckers along inner curve
    ctx.fillStyle='rgba(255,210,200,0.55)';
    for(var s=1;s<=3;s++){
      var st=s/4;
      var mt=1-st;
      // bezier midpoint approx
      var mx=mt*mt*mt*tx1 + 3*mt*mt*st*tx2 + 3*mt*st*st*(tx2+tw*0.5) + st*st*st*tx3;
      var my=mt*mt*mt*ty1 + 3*mt*mt*st*ty2 + 3*mt*st*st*ty3 + st*st*st*ty3;
      ctx.beginPath();ctx.arc(mx,my,1.6,0,Math.PI*2);ctx.fill();
    }
  }
  // Head/mantle with radial gradient
  var hg=ctx.createRadialGradient(-headR*0.25,-headR*0.4,headR*0.15,0,0,headR*1.15);
  hg.addColorStop(0,P.cs);
  hg.addColorStop(0.35,P.c);
  hg.addColorStop(1,P.cd);
  ctx.fillStyle=hg;
  ctx.beginPath();ctx.ellipse(0,-headR*0.15,headR,headR*1.1,0,0,Math.PI*2);ctx.fill();
  // Mottled skin patches
  ctx.fillStyle='rgba(60,20,40,0.25)';
  for(var i=0;i<5;i++){
    var pa=i*1.3+0.5;
    var px=Math.cos(pa)*headR*0.5;
    var py=Math.sin(pa)*headR*0.5-headR*0.15;
    ctx.beginPath();ctx.arc(px,py,headR*0.12,0,Math.PI*2);ctx.fill();
  }
  // Brow ridges (classic octopus look)
  ctx.fillStyle=P.cd;
  ctx.beginPath();ctx.ellipse(-headR*0.35,-headR*0.3,headR*0.25,headR*0.15,0.3,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(headR*0.35,-headR*0.3,headR*0.25,headR*0.15,-0.3,0,Math.PI*2);ctx.fill();
  // Head highlight
  ctx.fillStyle='rgba(255,255,255,0.2)';
  ctx.beginPath();ctx.ellipse(-headR*0.2,-headR*0.55,headR*0.35,headR*0.15,0.2,0,Math.PI*2);ctx.fill();
  // Eyes with horizontal pupil (octopus characteristic)
  P_.eye(P,headR*0.35,-headR*0.3,1.2);
  P_.eye(P,-headR*0.35,-headR*0.3,1.2);
  ctx.fillStyle='#1A1A2E';
  ctx.beginPath();ctx.ellipse(headR*0.4,-headR*0.28,P.er*0.7,P.er*0.2,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(-headR*0.3,-headR*0.28,P.er*0.7,P.er*0.2,0,0,Math.PI*2);ctx.fill();
};

SH['whale']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  ctx.beginPath();ctx.moveTo(hw,0);ctx.quadraticCurveTo(hw*0.8,-hh*0.9,hw*0.3,-hh*0.7);
  ctx.quadraticCurveTo(-hw*0.3,-hh*0.5,-hw,0);
  ctx.quadraticCurveTo(-hw*0.3,hh*0.5,hw*0.3,hh*0.7);
  ctx.quadraticCurveTo(hw*0.8,hh*0.9,hw,0);ctx.closePath();
  var bg=ctx.createLinearGradient(0,-hh*0.8,0,hh*0.7);
  bg.addColorStop(0,P.cd);bg.addColorStop(0.45,P.c);bg.addColorStop(0.8,P.c);bg.addColorStop(1,P.cs);
  ctx.fillStyle=bg;ctx.fill();
  // Throat pleats (座头鲸/长须鲸特征)
  ctx.strokeStyle='rgba(0,0,0,0.25)';ctx.lineWidth=0.8;
  for(var i=0;i<6;i++){var sx=hw*0.35+i*hw*0.09;
    ctx.beginPath();ctx.moveTo(sx,hh*0.15);ctx.quadraticCurveTo(sx-1,hh*0.45,sx,hh*0.65);ctx.stroke();}
  // Small dorsal hump
  ctx.fillStyle=P.cd;
  ctx.beginPath();ctx.ellipse(-hw*0.4,-hh*0.5,hw*0.15,hh*0.1,0,0,Math.PI*2);ctx.fill();
  // Big tail flukes
  ctx.fillStyle=P.c;
  ctx.beginPath();ctx.moveTo(-hw,0);ctx.lineTo(-hw-12+P.tail,-hh*1.2);ctx.lineTo(-hw+4,0);ctx.fill();
  ctx.beginPath();ctx.moveTo(-hw,0);ctx.lineTo(-hw-10+P.tail,hh*1.0);ctx.lineTo(-hw+3,0);ctx.fill();
  // 喷气孔
  ctx.fillStyle='rgba(0,0,0,0.35)';
  ctx.beginPath();ctx.ellipse(hw*0.5,-hh*0.58,2,1,0,0,Math.PI*2);ctx.fill();
  // 背部高光
  ctx.fillStyle='rgba(255,255,255,0.05)';
  ctx.beginPath();ctx.ellipse(hw*0.1,-hh*0.62,hw*0.4,hh*0.1,0,0,Math.PI*2);ctx.fill();
  P_.eyeSimple(P,hw*0.75,-hh*0.15,0.6);
};

SH['greatwhite']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  // Body
  ctx.fillStyle=P.c;
  ctx.beginPath();ctx.moveTo(hw+6,0);ctx.quadraticCurveTo(hw*0.6,-hh*0.85,0,-hh*0.6);
  ctx.lineTo(-hw*0.5,-hh*0.3);ctx.lineTo(-hw,0);ctx.lineTo(-hw*0.5,hh*0.3);
  ctx.lineTo(0,hh*0.7);ctx.quadraticCurveTo(hw*0.6,hh*0.85,hw+6,0);ctx.fill();
  // White belly (stark contrast)
  ctx.fillStyle=P.cs;
  ctx.beginPath();ctx.moveTo(hw,hh*0.1);ctx.quadraticCurveTo(hw*0.4,hh*0.7,-hw*0.4,hh*0.2);
  ctx.lineTo(-hw*0.4,0);ctx.lineTo(hw,0);ctx.closePath();ctx.fill();
  // Divide line
  ctx.strokeStyle=P.cd;ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(hw,hh*0.05);ctx.quadraticCurveTo(hw*0.4,hh*0.6,-hw*0.4,hh*0.15);ctx.stroke();
  // Mouth
  ctx.fillStyle='rgba(0,0,0,0.4)';
  ctx.beginPath();ctx.ellipse(hw*0.75,hh*0.1,hw*0.18,hh*0.12,-0.2,0,Math.PI*2);ctx.fill();
  // Teeth
  ctx.fillStyle='#FFF';
  for(var i=0;i<6;i++){var tx=hw*0.6+i*hw*0.05;
    ctx.beginPath();ctx.moveTo(tx,hh*0.05);ctx.lineTo(tx+2,hh*0.15);ctx.lineTo(tx+4,hh*0.05);ctx.fill();}
  P_.finDorsalTall(P,1.6);
  ctx.fillStyle=P.cd;
  ctx.beginPath();ctx.moveTo(hw*0.15,hh*0.3);ctx.lineTo(hw*0.05,hh*0.95);ctx.lineTo(hw*0.35,hh*0.4);ctx.fill();
  ctx.strokeStyle='rgba(0,0,0,0.35)';ctx.lineWidth=1.5;
  for(var i=0;i<5;i++){ctx.beginPath();ctx.moveTo(hw*0.3+i*5,-hh*0.25);ctx.lineTo(hw*0.3+i*5,hh*0.15);ctx.stroke();}
  P_.tailCrescent(P,1.3);
  ctx.beginPath();ctx.arc(hw*0.55,-hh*0.25,P.er*0.8,0,Math.PI*2);ctx.fillStyle='#000';ctx.fill();
};

SH['tigerShark']=function(P){
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  ctx.beginPath();ctx.moveTo(hw+4,0);ctx.quadraticCurveTo(hw*0.6,-hh*0.85,0,-hh*0.6);
  ctx.lineTo(-hw*0.6,-hh*0.25);ctx.lineTo(-hw,0);ctx.lineTo(-hw*0.6,hh*0.25);
  ctx.lineTo(0,hh*0.7);ctx.quadraticCurveTo(hw*0.6,hh*0.85,hw+4,0);ctx.closePath();
  var bg=ctx.createLinearGradient(0,-hh*0.7,0,hh*0.7);
  bg.addColorStop(0,P.cd);bg.addColorStop(0.4,P.c);bg.addColorStop(0.78,P.c);bg.addColorStop(1,P.cs);
  ctx.fillStyle=bg;ctx.fill();
  // Tiger stripes (带软边的弯曲条纹)
  ctx.strokeStyle='rgba(30,20,10,0.6)';ctx.lineWidth=1.8;
  for(var i=0;i<7;i++){var sx=-hw*0.45+i*hw*0.18;
    ctx.beginPath();ctx.moveTo(sx,-hh*0.55);ctx.quadraticCurveTo(sx+5,0,sx,hh*0.4);ctx.stroke();}
  P_.finDorsalTall(P,1.4);
  // Gills
  ctx.strokeStyle='rgba(0,0,0,0.3)';ctx.lineWidth=0.9;
  for(var j=0;j<5;j++){var gx=hw*0.25+j*3.2;
    ctx.beginPath();ctx.moveTo(gx,-hh*0.2);ctx.quadraticCurveTo(gx-1,0,gx,hh*0.15);ctx.stroke();}
  P_.tailCrescent(P);
  P_.eye(P,hw*0.55,-hh*0.2,0.9);
};

SH['whaleshark']=function(P){ // 鲸鲨
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  ctx.beginPath();ctx.moveTo(hw+4,0);ctx.quadraticCurveTo(hw*0.5,-hh*0.85,0,-hh*0.6);
  ctx.lineTo(-hw*0.5,-hh*0.3);ctx.lineTo(-hw,0);ctx.lineTo(-hw*0.5,hh*0.3);
  ctx.lineTo(0,hh*0.6);ctx.quadraticCurveTo(hw*0.5,hh*0.85,hw+4,0);ctx.closePath();
  var bg=ctx.createLinearGradient(0,-hh*0.7,0,hh*0.7);
  bg.addColorStop(0,P.cd);bg.addColorStop(0.45,P.c);bg.addColorStop(0.8,P.c);bg.addColorStop(1,P.cs);
  ctx.fillStyle=bg;ctx.fill();
  // White spots (characteristic)
  ctx.fillStyle=P.cs;
  for(var r=0;r<4;r++){for(var i=0;i<9;i++){
    var sx=-hw*0.6+i*hw*0.15+r*3,sy=-hh*0.4+r*hh*0.22;
    ctx.beginPath();ctx.arc(sx,sy,3,0,Math.PI*2);ctx.fill();}}
  // Vertical stripes
  ctx.strokeStyle=P.cs;ctx.lineWidth=1;ctx.globalAlpha=0.5;
  for(var i=0;i<5;i++){var sx=-hw*0.4+i*hw*0.2;
    ctx.beginPath();ctx.moveTo(sx,-hh*0.55);ctx.lineTo(sx,hh*0.55);ctx.stroke();}
  ctx.globalAlpha=1;
  P_.finDorsalTall(P,1.2);
  P_.tailCrescent(P);
  // Big wide mouth
  ctx.strokeStyle=P.cd;ctx.lineWidth=2;
  ctx.beginPath();ctx.moveTo(hw*0.75,-hh*0.15);ctx.lineTo(hw+2,-hh*0.15);ctx.stroke();
  ctx.beginPath();ctx.moveTo(hw*0.75,hh*0.15);ctx.lineTo(hw+2,hh*0.15);ctx.stroke();
  P_.eyeSimple(P,hw*0.7,-hh*0.35,0.8);
};

SH['oarfish']=function(P){
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  var wave=P.f.tailPhase;
  ctx.fillStyle=P.c;
  ctx.beginPath();
  for(var i=0;i<=20;i++){var x=hw-i*hw/10,y=Math.sin(wave+i*0.5)*hh*(0.3+i*0.04);
    if(i===0) ctx.moveTo(x,y-hh*0.5);else ctx.lineTo(x,y-hh*0.5);}
  for(var i=20;i>=0;i--){var x=hw-i*hw/10,y=Math.sin(wave+i*0.5)*hh*(0.3+i*0.04);
    ctx.lineTo(x,y+hh*0.5);}
  ctx.closePath();ctx.fill();
  // Red dorsal crest
  ctx.fillStyle=P.cs;
  for(var i=0;i<12;i++){var x=hw-i*hw/6,y=Math.sin(wave+i*0.5)*hh*(0.3+i*0.04);
    ctx.beginPath();ctx.moveTo(x,y-hh*0.5);ctx.lineTo(x+2,y-hh-4);ctx.lineTo(x+4,y-hh*0.5);ctx.fill();}
  // Head
  ctx.fillStyle=P.c;
  ctx.beginPath();ctx.ellipse(hw,0,hw*0.15,hh*0.9,0,0,Math.PI*2);ctx.fill();
  P_.eye(P,hw*0.95,-hh*0.3,1.2);
};

SH['megalodon']=function(P){ // 巨齿鲨
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  ctx.beginPath();ctx.moveTo(hw+6,0);ctx.quadraticCurveTo(hw*0.6,-hh*0.9,0,-hh*0.65);
  ctx.lineTo(-hw*0.5,-hh*0.35);ctx.lineTo(-hw,0);ctx.lineTo(-hw*0.5,hh*0.35);
  ctx.lineTo(0,hh*0.75);ctx.quadraticCurveTo(hw*0.6,hh*0.9,hw+6,0);ctx.closePath();
  var bg=ctx.createLinearGradient(0,-hh*0.7,0,hh*0.7);
  bg.addColorStop(0,P.cd);bg.addColorStop(0.35,P.c);bg.addColorStop(0.75,P.c);bg.addColorStop(1,P.cs);
  ctx.fillStyle=bg;ctx.fill();
  // Huge mouth with many teeth
  ctx.fillStyle='rgba(0,0,0,0.6)';
  ctx.beginPath();ctx.ellipse(hw*0.7,hh*0.15,hw*0.22,hh*0.18,-0.2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#FFF';
  for(var i=0;i<10;i++){var tx=hw*0.5+i*hw*0.04;
    ctx.beginPath();ctx.moveTo(tx,hh*0.05);ctx.lineTo(tx+2,hh*0.25);ctx.lineTo(tx+4,hh*0.05);ctx.fill();
    ctx.beginPath();ctx.moveTo(tx,hh*0.3);ctx.lineTo(tx+2,hh*0.1);ctx.lineTo(tx+4,hh*0.3);ctx.fill();}
  P_.finDorsalTall(P,1.8);
  ctx.fillStyle=P.cd;
  ctx.beginPath();ctx.moveTo(hw*0.15,hh*0.3);ctx.lineTo(hw*0.05,hh*1.05);ctx.lineTo(hw*0.35,hh*0.4);ctx.fill();
  // Gills
  ctx.strokeStyle='rgba(0,0,0,0.35)';ctx.lineWidth=1.2;
  for(var j=0;j<5;j++){var gx=hw*0.28+j*4;
    ctx.beginPath();ctx.moveTo(gx,-hh*0.25);ctx.quadraticCurveTo(gx-1.5,0,gx,hh*0.2);ctx.stroke();}
  P_.tailCrescent(P,1.4);
  ctx.beginPath();ctx.arc(hw*0.55,-hh*0.28,P.er*0.9,0,Math.PI*2);ctx.fillStyle='#000';ctx.fill();
};

SH['krakenTentacle']=function(P){ // 巨型海怪（章鱼升级版）
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  var headR=hw*0.38;
  ctx.lineCap='round';
  // 10 tentacles (more than octopus) with gradient and suckers
  for(var i=0;i<10;i++){
    var ta=Math.PI*0.1+i*Math.PI*0.085;
    var tw=Math.sin(P.f.tailPhase+i*0.6)*10;
    var tx1=Math.cos(ta)*headR*0.7,ty1=headR*0.4;
    var tx2=Math.cos(ta)*hw*0.7+tw,ty2=hh*0.65;
    var tx3=Math.cos(ta)*hw*0.9+tw*1.4,ty3=hh*1.0;
    var tg=ctx.createLinearGradient(tx1,ty1,tx3,ty3);
    tg.addColorStop(0,P.c);tg.addColorStop(0.6,P.cd);tg.addColorStop(1,P.cd);
    ctx.strokeStyle=tg;ctx.lineWidth=6-i*0.35;
    ctx.beginPath();ctx.moveTo(tx1,ty1);ctx.bezierCurveTo(tx2,ty2,tx2+tw*0.5,ty3,tx3,ty3);ctx.stroke();
    // Suckers along the curve (parametric bezier sampling)
    ctx.fillStyle='rgba(255,220,220,0.6)';
    for(var s=1;s<=4;s++){
      var st=s/5, mt=1-st;
      var mx=mt*mt*mt*tx1 + 3*mt*mt*st*tx2 + 3*mt*st*st*(tx2+tw*0.5) + st*st*st*tx3;
      var my=mt*mt*mt*ty1 + 3*mt*mt*st*ty2 + 3*mt*st*st*ty3 + st*st*st*ty3;
      ctx.beginPath();ctx.arc(mx,my,2.2-s*0.3,0,Math.PI*2);ctx.fill();
    }
  }
  // Large head with gradient
  var hg=ctx.createRadialGradient(-headR*0.25,-headR*0.4,headR*0.1,0,0,headR*1.2);
  hg.addColorStop(0,P.cs);hg.addColorStop(0.4,P.c);hg.addColorStop(1,P.cd);
  ctx.fillStyle=hg;
  ctx.beginPath();ctx.ellipse(0,-headR*0.15,headR,headR*1.1,0,0,Math.PI*2);ctx.fill();
  // Menacing skin patches
  ctx.fillStyle='rgba(80,10,20,0.3)';
  for(var i=0;i<6;i++){
    var pa=i*1.1+0.3, px=Math.cos(pa)*headR*0.55, py=Math.sin(pa)*headR*0.55-headR*0.15;
    ctx.beginPath();ctx.arc(px,py,headR*0.1,0,Math.PI*2);ctx.fill();
  }
  // Head highlight
  ctx.fillStyle='rgba(255,255,255,0.15)';
  ctx.beginPath();ctx.ellipse(-headR*0.25,-headR*0.6,headR*0.4,headR*0.15,0.2,0,Math.PI*2);ctx.fill();
  // Menacing red eyes with glow
  ctx.shadowColor='rgba(255,30,30,0.9)';ctx.shadowBlur=8;
  ctx.fillStyle='#FFF';
  ctx.beginPath();ctx.arc(headR*0.35,-headR*0.3,P.er*1.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(-headR*0.35,-headR*0.3,P.er*1.5,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#FF1744';
  ctx.beginPath();ctx.arc(headR*0.35,-headR*0.3,P.er,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(-headR*0.35,-headR*0.3,P.er,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;
  // Slit pupils
  ctx.fillStyle='#000';
  ctx.beginPath();ctx.ellipse(headR*0.35,-headR*0.3,P.er*0.25,P.er*0.7,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(-headR*0.35,-headR*0.3,P.er*0.25,P.er*0.7,0,0,Math.PI*2);ctx.fill();
};

SH['leviathan']=function(P){ // 海神 — 最高阶传说生物
  P_.shadow(P);
  var ctx=P.ctx,hw=P.hw,hh=P.hh;
  // Serpentine body with scales
  ctx.fillStyle=P.c;
  ctx.beginPath();
  var wave=P.f.tailPhase;
  for(var i=0;i<=15;i++){var x=hw-i*hw/8,y=Math.sin(wave+i*0.4)*hh*0.3;
    if(i===0) ctx.moveTo(x,y-hh*0.5);else ctx.lineTo(x,y-hh*0.5);}
  for(var i=15;i>=0;i--){var x=hw-i*hw/8,y=Math.sin(wave+i*0.4)*hh*0.3;
    ctx.lineTo(x,y+hh*0.5);}
  ctx.closePath();ctx.fill();
  // Shimmering scales
  ctx.strokeStyle=P.cs;ctx.lineWidth=1;ctx.globalAlpha=0.6;
  for(var r=0;r<4;r++){for(var i=0;i<10;i++){
    var sx=-hw*0.8+i*hw*0.18,sy=-hh*0.4+r*hh*0.25+Math.sin(wave+i*0.4)*hh*0.2;
    ctx.beginPath();ctx.arc(sx,sy,hh*0.12,-0.5,Math.PI-0.5);ctx.stroke();}}
  ctx.globalAlpha=1;
  // Crown/horns on head
  ctx.fillStyle='#FFD700';
  for(var i=0;i<3;i++){var hx=hw*0.7+i*hw*0.1,hy=-hh*0.8;
    ctx.beginPath();ctx.moveTo(hx-3,-hh*0.4);ctx.lineTo(hx,hy);ctx.lineTo(hx+3,-hh*0.4);ctx.fill();}
  // Glowing eye
  ctx.shadowColor='rgba(0,200,255,0.8)';ctx.shadowBlur=10;
  ctx.fillStyle='#00E5FF';
  ctx.beginPath();ctx.arc(hw*0.85,-hh*0.15,P.er*1.5,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;
  // Dragon-like fins
  ctx.fillStyle=P.cs;ctx.globalAlpha=0.7;
  ctx.beginPath();ctx.moveTo(-hw*0.3,-hh*0.5);ctx.lineTo(0,-hh*1.3);ctx.lineTo(hw*0.2,-hh*0.5);ctx.fill();
  ctx.beginPath();ctx.moveTo(0,hh*0.3);ctx.lineTo(hw*0.2,hh*0.9);ctx.lineTo(hw*0.4,hh*0.3);ctx.fill();
  ctx.globalAlpha=1;
  // Forked tail
  ctx.fillStyle=P.c;
  ctx.beginPath();ctx.moveTo(-hw,0);ctx.lineTo(-hw-15+P.tail,-hh*1.3);ctx.lineTo(-hw+5,0);ctx.fill();
  ctx.beginPath();ctx.moveTo(-hw,0);ctx.lineTo(-hw-15+P.tail,hh*1.3);ctx.lineTo(-hw+5,0);ctx.fill();
};
