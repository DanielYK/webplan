// ── fish-render.js — 鱼绘制系统（原语库 + 注册表）──
var G = window.G;

// ── 颜色工具 ──
var _colorCache={}, _tmpCanvas=null;
G.darkenColor = function(color,factor){
  var key=color+'_'+factor;
  if(_colorCache[key])return _colorCache[key];
  if(color.startsWith('rgba'))return _colorCache[key]=color;
  if(!_tmpCanvas){_tmpCanvas=document.createElement('canvas').getContext('2d');_tmpCanvas.canvas.width=1;_tmpCanvas.canvas.height=1;}
  _tmpCanvas.fillStyle=color;_tmpCanvas.fillRect(0,0,1,1);
  var d=_tmpCanvas.getImageData(0,0,1,1).data;
  var r='rgb('+Math.round(d[0]*factor)+','+Math.round(d[1]*factor)+','+Math.round(d[2]*factor)+')';
  _colorCache[key]=r;return r;
};
// 自适应 darken：亮色按原 factor，暗色保留更多明度（避免头部一团黑）
G.darkenAdaptive = function(color,factor){
  var key=color+'_ada_'+factor;
  if(_colorCache[key])return _colorCache[key];
  if(color.startsWith('rgba'))return _colorCache[key]=color;
  if(!_tmpCanvas){_tmpCanvas=document.createElement('canvas').getContext('2d');_tmpCanvas.canvas.width=1;_tmpCanvas.canvas.height=1;}
  _tmpCanvas.fillStyle=color;_tmpCanvas.fillRect(0,0,1,1);
  var d=_tmpCanvas.getImageData(0,0,1,1).data;
  var lum=(0.299*d[0]+0.587*d[1]+0.114*d[2])/255; // 0..1
  // 亮度 0.6 时 factor 不变，亮度 0.2 时 factor 抬到 0.8
  var k=Math.min(1, factor + (1-factor)*Math.max(0,0.6-lum)*1.3);
  var r='rgb('+Math.round(d[0]*k)+','+Math.round(d[1]*k)+','+Math.round(d[2]*k)+')';
  _colorCache[key]=r;return r;
};

// ── PRIMS: 可复用绘制原语 ──
// 所有原语接受统一的上下文对象 P = {ctx, hw, hh, c, cs, cd, tail, er, time, f}
G.PRIMS = {
  // 阴影
  shadow:function(P){
    var ctx=P.ctx;ctx.globalAlpha=0.06;ctx.fillStyle='#000';
    ctx.beginPath();ctx.ellipse(2,P.hh+5,P.hw*0.5,2.5,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
  },
  // ─── 身体 ───
  // 椭圆体 + 渐变（写实：左上高光 中部主色 右下/腹部暗色）
  // P.noShade=true 可关闭 countershading（深色鱼用）
  bodyOval:function(P,wRatio,hRatio){
    var ctx=P.ctx,hw=P.hw*(wRatio||1),hh=P.hh*(hRatio||1);
    // 主体椭圆
    var bg=ctx.createRadialGradient(hw*0.15,-hh*0.4,2,0,0,Math.max(hw,hh)*1.1);
    bg.addColorStop(0,P.cs);
    bg.addColorStop(0.35,P.c);
    bg.addColorStop(1,P.cd);
    ctx.fillStyle=bg;ctx.beginPath();ctx.ellipse(0,0,hw,hh,0,0,Math.PI*2);ctx.fill();
    // Countershading: 背深腹浅的垂直渐变叠加（强度降低并可关闭）
    if(P.noShade) return;
    var cs=ctx.createLinearGradient(0,-hh,0,hh);
    cs.addColorStop(0,'rgba(0,0,0,0.12)');
    cs.addColorStop(0.55,'rgba(0,0,0,0)');
    cs.addColorStop(0.85,'rgba(255,255,255,0.05)');
    cs.addColorStop(1,'rgba(255,255,255,0.18)');
    ctx.fillStyle=cs;ctx.beginPath();ctx.ellipse(0,0,hw,hh,0,0,Math.PI*2);ctx.fill();
  },
  // 纺锤流线体
  bodyTorpedo:function(P,wRatio,hRatio){
    var ctx=P.ctx,hw=P.hw*(wRatio||1),hh=P.hh*(hRatio||1);
    ctx.fillStyle=P.c;
    ctx.beginPath();ctx.moveTo(hw+2,0);
    ctx.quadraticCurveTo(hw*0.5,-hh*0.9,0,-hh*0.75);
    ctx.quadraticCurveTo(-hw*0.5,-hh*0.4,-hw,0);
    ctx.quadraticCurveTo(-hw*0.5,hh*0.4,0,hh*0.75);
    ctx.quadraticCurveTo(hw*0.5,hh*0.9,hw+2,0);ctx.fill();
  },
  // 圆盘形（扁平高身体）
  bodyDisc:function(P,wRatio,hRatio){
    var ctx=P.ctx,hw=P.hw*(wRatio||0.85),hh=P.hh*(hRatio||1);
    var bg=ctx.createRadialGradient(0,-hh*0.2,3,0,0,Math.max(hw,hh));
    bg.addColorStop(0,P.cs);bg.addColorStop(0.5,P.c);bg.addColorStop(1,P.cd);
    ctx.fillStyle=bg;ctx.beginPath();ctx.ellipse(0,0,hw,hh,0,0,Math.PI*2);ctx.fill();
  },
  // 球形
  bodySphere:function(P,rRatio){
    var ctx=P.ctx,r=P.hw*(rRatio||0.85);
    var g=ctx.createRadialGradient(-r*0.2,-r*0.3,r*0.15,0,0,r);
    g.addColorStop(0,P.cs);g.addColorStop(0.4,P.c);g.addColorStop(1,P.cd);
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.fill();
  },
  // ─── 尾巴 ───
  // 三角尾
  tailTriangle:function(P,len,spread){
    var ctx=P.ctx,hw=P.hw,hh=P.hh;
    len=len||1;spread=spread||0.7;
    ctx.fillStyle=P.c;ctx.beginPath();
    ctx.moveTo(-hw,0);
    ctx.lineTo(-hw-6*len+P.tail,-hh*spread);
    ctx.lineTo(-hw-6*len+P.tail,hh*spread);
    ctx.closePath();ctx.fill();
  },
  // 月牙尾（2叉）
  tailCrescent:function(P,len){
    var ctx=P.ctx,hw=P.hw,hh=P.hh;len=len||1.1;
    ctx.fillStyle=P.c;
    ctx.beginPath();ctx.moveTo(-hw,0);ctx.lineTo(-hw-10*len+P.tail,-hh*1.1);ctx.lineTo(-hw+4,0);ctx.fill();
    ctx.beginPath();ctx.moveTo(-hw,0);ctx.lineTo(-hw-8*len+P.tail,hh*0.9);ctx.lineTo(-hw+3,0);ctx.fill();
  },
  // 扇形尾
  tailFan:function(P){
    var ctx=P.ctx,hw=P.hw,hh=P.hh;
    ctx.fillStyle=P.cs;ctx.globalAlpha=0.85;
    ctx.beginPath();
    ctx.moveTo(-hw,0);
    for(var i=-3;i<=3;i++){var a=Math.PI+Math.PI*i*0.08;ctx.lineTo(-hw+Math.cos(a)*hw*0.4,Math.sin(a)*hh*1.0+P.tail*0.3);}
    ctx.closePath();ctx.fill();ctx.globalAlpha=1;
  },
  // ─── 鳍 ───
  // 背鳍（三角形）
  finDorsal:function(P,hRatio,xOff){
    var ctx=P.ctx,hw=P.hw,hh=P.hh;
    hRatio=hRatio||1.2;xOff=xOff||0.05;
    ctx.fillStyle=P.c;ctx.globalAlpha=0.8;
    ctx.beginPath();ctx.moveTo(-hw*0.1,-hh);ctx.lineTo(hw*xOff,-hh*hRatio);ctx.lineTo(hw*0.3,-hh);ctx.fill();
    ctx.globalAlpha=1;
  },
  // 高背鳍（鲨鱼风格）
  finDorsalTall:function(P,hRatio){
    var ctx=P.ctx,hw=P.hw,hh=P.hh;hRatio=hRatio||1.5;
    ctx.fillStyle=P.c;
    ctx.beginPath();ctx.moveTo(-hw*0.05,-hh*0.6);ctx.lineTo(hw*0.08,-hh*hRatio);ctx.lineTo(hw*0.28,-hh*0.6);ctx.fill();
  },
  // 胸鳍
  finPectoral:function(P){
    var ctx=P.ctx,hw=P.hw,hh=P.hh;
    ctx.fillStyle=P.cd;ctx.globalAlpha=0.6;
    ctx.beginPath();ctx.moveTo(hw*0.1,hh*0.3);ctx.lineTo(0,hh*0.85);ctx.lineTo(hw*0.3,hh*0.4);ctx.fill();
    ctx.globalAlpha=1;
  },
  // ─── 眼睛 ───
  eye:function(P,x,y,rScale){
    var ctx=P.ctx,r=P.er*(rScale||1);
    ctx.beginPath();ctx.arc(x,y,r+1,0,Math.PI*2);ctx.fillStyle='#F8F8FF';ctx.fill();
    ctx.beginPath();ctx.arc(x+r*0.15,y,r*0.55,0,Math.PI*2);ctx.fillStyle='#1A1A2E';ctx.fill();
    ctx.beginPath();ctx.arc(x-r*0.15,y-r*0.35,r*0.22,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,0.85)';ctx.fill();
  },
  eyeSimple:function(P,x,y,rScale){
    var ctx=P.ctx;
    ctx.beginPath();ctx.arc(x,y,P.er*(rScale||0.8),0,Math.PI*2);ctx.fillStyle='#111';ctx.fill();
  },
  // ─── 装饰 ───
  // 条纹（垂直白色条纹 + 黑边）— 根据椭圆方程计算 Y 范围，精确贴合椭圆 body
  stripesVertical:function(P,positions,widthRatio){
    var ctx=P.ctx,hw=P.hw,hh=P.hh;
    widthRatio=widthRatio||0.08;
    for(var i=0;i<positions.length;i++){
      var px=hw*positions[i],w=hw*widthRatio,cx=px+w/2;
      var nx=Math.abs(cx/hw);
      if(nx>=1) continue;
      var yExt=hh*Math.sqrt(1-nx*nx)*0.94;
      // 条纹本体，带软化边缘（中央实，两端羽化）
      var g=ctx.createLinearGradient(px,0,px+w,0);
      g.addColorStop(0,'rgba(255,255,255,0.85)');
      g.addColorStop(0.2,'#FFF');
      g.addColorStop(0.8,'#FFF');
      g.addColorStop(1,'rgba(255,255,255,0.85)');
      ctx.fillStyle=g;
      ctx.fillRect(px,-yExt,w,yExt*2);
      // 细深色边缘（不叠加完整 strokeRect，改为细线）
      ctx.strokeStyle='rgba(40,30,20,0.45)';ctx.lineWidth=0.6;
      ctx.beginPath();
      ctx.moveTo(px,-yExt);ctx.lineTo(px,yExt);
      ctx.moveTo(px+w,-yExt);ctx.lineTo(px+w,yExt);
      ctx.stroke();
    }
  },
  // 斑点
  dots:function(P,count,color){
    var ctx=P.ctx,hw=P.hw,hh=P.hh;
    ctx.fillStyle=color||P.cd;
    ctx.globalAlpha=0.5;
    for(var i=0;i<count;i++){
      var a=i*(Math.PI*2/count)+0.3,r=Math.sqrt(Math.random()*0.5)*hw*0.5;
      var x=Math.cos(a+i*2.1)*hw*0.55;
      var y=Math.sin(a+i*1.3)*hh*0.45;
      ctx.beginPath();ctx.arc(x,y,hw*0.04+i%3*0.5,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1;
  },
  // 白色腹部
  bellyLight:function(P,alpha){
    var ctx=P.ctx,hw=P.hw,hh=P.hh;
    ctx.fillStyle=P.cs;ctx.globalAlpha=alpha||0.35;
    ctx.beginPath();ctx.ellipse(0,hh*0.15,hw*0.6,hh*0.35,0,0,Math.PI*2);ctx.fill();
    ctx.globalAlpha=1;
  },
  // 高光
  highlight:function(P){
    var ctx=P.ctx,hw=P.hw,hh=P.hh;
    ctx.fillStyle='rgba(255,255,255,0.18)';
    ctx.beginPath();ctx.ellipse(hw*0.12,-hh*0.35,hw*0.4,hh*0.2,0.15,0,Math.PI*2);ctx.fill();
  },
  // 嘴
  mouth:function(P,x,y){
    var ctx=P.ctx;
    ctx.strokeStyle=P.cd;ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(x-2,y);ctx.quadraticCurveTo(x+2,y+1,x-2,y+2);ctx.stroke();
  },
  // ─── 写实细节增强 ───
  // Countershading 背深腹浅（垂直渐变覆盖）
  countershade:function(P,strength){
    var ctx=P.ctx,hw=P.hw,hh=P.hh;
    strength=strength||0.5;
    var g=ctx.createLinearGradient(0,-hh,0,hh);
    g.addColorStop(0,'rgba(0,0,0,'+(strength*0.5)+')');
    g.addColorStop(0.45,'rgba(0,0,0,0)');
    g.addColorStop(0.7,'rgba(255,255,255,0)');
    g.addColorStop(1,'rgba(255,255,255,'+(strength*0.4)+')');
    ctx.fillStyle=g;ctx.beginPath();
    ctx.ellipse(0,0,hw,hh,0,0,Math.PI*2);ctx.fill();
  },
  // 鳃盖弧线（头部后方）
  gillCover:function(P,xRatio){
    var ctx=P.ctx,hw=P.hw,hh=P.hh;
    var gx=hw*(xRatio||0.25);
    ctx.strokeStyle='rgba(0,0,0,0.25)';ctx.lineWidth=1;
    ctx.beginPath();
    ctx.moveTo(gx,-hh*0.55);
    ctx.quadraticCurveTo(gx-hw*0.05,0,gx,hh*0.55);
    ctx.stroke();
  },
  // 侧线（身体中央细横线）
  lateralLine:function(P){
    var ctx=P.ctx,hw=P.hw,hh=P.hh;
    ctx.strokeStyle='rgba(0,0,0,0.2)';ctx.lineWidth=0.8;
    ctx.beginPath();
    ctx.moveTo(-hw*0.7,hh*0.05);
    ctx.quadraticCurveTo(0,-hh*0.05,hw*0.5,hh*0.08);
    ctx.stroke();
  },
  // 鳞片纹理（半透明小椭圆）
  scales:function(P,rows,cols){
    var ctx=P.ctx,hw=P.hw,hh=P.hh;
    rows=rows||3; cols=cols||7;
    ctx.strokeStyle='rgba(0,0,0,0.12)';ctx.lineWidth=0.6;
    var sw=hw*1.4/cols, sh=hh*1.2/rows;
    for(var r=0;r<rows;r++){
      for(var c=0;c<cols;c++){
        var sx=-hw*0.7+c*sw+(r%2)*sw*0.5;
        var sy=-hh*0.5+r*sh;
        // 仅当在椭圆内才画
        if((sx*sx)/(hw*hw)+(sy*sy)/(hh*hh)>0.85)continue;
        ctx.beginPath();
        ctx.arc(sx,sy,sw*0.45,Math.PI*0.2,Math.PI*0.8);
        ctx.stroke();
      }
    }
  },
  // 鳍条（在现有鳍上加平行线模拟鳍骨）
  finRays:function(P,x1,y1,x2,y2,count){
    var ctx=P.ctx;
    count=count||4;
    ctx.strokeStyle='rgba(0,0,0,0.25)';ctx.lineWidth=0.5;
    for(var i=1;i<count;i++){
      var t=i/count;
      var mx=x1+(x2-x1)*t, my=y1+(y2-y1)*t;
      // 垂直于线段的短细线模拟鳍条
      ctx.beginPath();ctx.moveTo(mx,my*0.5);ctx.lineTo(mx,my);ctx.stroke();
    }
  }
};

// ── FISH_SHAPES: 形状注册表 ──
// 每个形状定义如何组合原语来绘制特定鱼种
G.FISH_SHAPES = {};

// 基础鱼形（用于没有特殊形状的鱼）
G.FISH_SHAPES['fish'] = function(P){
  G.PRIMS.shadow(P);
  G.PRIMS.tailTriangle(P);
  G.PRIMS.bodyOval(P);
  G.PRIMS.scales(P,3,6);
  G.PRIMS.lateralLine(P);
  G.PRIMS.gillCover(P,0.35);
  G.PRIMS.highlight(P);
  G.PRIMS.finDorsal(P);
  G.PRIMS.eye(P,P.hw*0.45,-P.hh*0.15);
};

// ── 主分发器 ──
// config 的 w/h 代表鱼的完整包围盒
// 用 clip 强制所有绘制都在包围盒内，鳍尾如果超出会被裁掉
G.drawFish = function(ctx,f){
  ctx.save();ctx.translate(f.x,f.y);
  var dir=f.vx>=0?1:-1;
  // 钓鱼模式的鱼按池塘视角，缩小一半
  var modeScale = (G.mode==='shore') ? 0.55 : 1;
  ctx.scale(dir*G.FISH_SCALE*modeScale, G.FISH_SCALE*modeScale);
  var t=f.type;
  // Golden aura
  if(f.golden){
    ctx.shadowColor='rgba(255,215,0,0.85)';
    ctx.shadowBlur=14+Math.sin(G.time*5)*6;
  }
  // Clip 到包围盒矩形
  var bhw=t.w*0.5, bhh=t.h*0.5;
  ctx.beginPath();ctx.rect(-bhw,-bhh,t.w,t.h);ctx.clip();
  var P={
    ctx:ctx, hw:t.w*0.5*0.85, hh:t.h*0.5*0.82,
    c:t.color, cs:t.stripe, cd:G.darkenAdaptive(t.color,0.55),
    tail:Math.sin(f.tailPhase)*3, er:Math.max(2,t.w*0.05),
    time:G.time, f:f, bhw:bhw, bhh:bhh
  };
  var fn=G.FISH_SHAPES[t.shape] || G.FISH_SHAPES['fish'];
  fn(P);
  if(f.golden){
    ctx.shadowBlur=0;
    // Sparkle overlay
    ctx.fillStyle='rgba(255,230,100,0.25)';
    ctx.beginPath();ctx.ellipse(0,0,P.hw*1.1,P.hh*1.1,0,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
};
