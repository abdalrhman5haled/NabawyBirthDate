/* ===== عدّل هنا ===== */
const BIRTH = {y:2004, m:10, d:21};
const YEAR = 2026;   // سنة عيد الميلاد اللي بتهنّيه فيها
/* ==================== */
const $ = id => document.getElementById(id);
const M = BIRTH.m-1, start = new Date(YEAR, M, BIRTH.d);
$('y').textContent = YEAR - BIRTH.y;

/* العمر — قبل يوم الميلاد بيفضل ثابت على لحظة الميلاد */
function tick(){
  const now = new Date(), r = now < start ? start : now;
  let m = r.getMonth()-M, d = r.getDate()-BIRTH.d;
  if (d<0){ m--; d += new Date(r.getFullYear(), r.getMonth(), 0).getDate(); }
  if (m<0) m += 12;
  const born = new Date(BIRTH.y, M, BIRTH.d), days = Math.floor((r-born)/864e5);
  $('rest').textContent = `و${m} شهر و${d} يوم، يعني ${days.toLocaleString('en-US')} يوم.`;
  $('secs').textContent = Math.floor((r-born)/1000).toLocaleString('en-US');
}
tick(); setInterval(tick,1000);

/* التقويم */
(function(){
  const names = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
  $('calTitle').textContent = `${names[M]} ${YEAR}`;
  let h = ["س","ح","ن","ث","ر","خ","ج"].map(x=>`<div class="h">${x}</div>`).join('');
  h += '<div></div>'.repeat((new Date(YEAR,M,1).getDay()+1)%7);
  const total = new Date(YEAR,M+1,0).getDate();
  const ring = '<svg viewBox="0 0 80 60"><path class="draw" pathLength="1" d="M14 30 C10 10 48 4 64 18 C76 30 52 54 24 50 C8 47 6 30 22 16 C30 10 40 8 50 9"/></svg>';
  for (let i=1;i<=total;i++) h += i===BIRTH.d ? `<div class="d bd"><b>${i}</b>${ring}</div>` : `<div class="d${i<BIRTH.d?' past':''}">${i}</div>`;
  $('grid').innerHTML = h;
})();
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold:.6});
io.observe($('calendar'));

/* تكبير الصور */
const lb = $('lb');
document.querySelectorAll('.ph').forEach(p => p.onclick = () => { lb.querySelector('img').src = p.querySelector('img').src; lb.classList.add('on'); });
lb.onclick = () => lb.classList.remove('on');
addEventListener('keydown', e => { if (e.key==='Escape') lb.classList.remove('on'); });

/* ===== شاشة الافتتاح + الاحتفال ===== */
(function(){
  const splash = $('splash'), btn = $('giftBtn'), env = $('env'), cv = $('cf'), ctx = cv.getContext('2d');
  let parts = [], running = false, opened = false;
  const cols = ['#d9402b','#ffe066','#2f6f7a','#ffffff','#f28c38','#1d3f9a'];

  function size(){ const d = devicePixelRatio || 1; cv.width = innerWidth*d; cv.height = innerHeight*d; ctx.setTransform(d,0,0,d,0,0); }
  size(); addEventListener('resize', size);

  // مدفع من جنب الشاشة: الشمال بيضرب لليمين فوق، واليمين بيضرب لليسار فوق
  function shoot(left){
    const x = left ? -10 : innerWidth+10, y = innerHeight*.8;
    for (let i=0;i<75;i++){
      const a = ((left ? -60 : -120) + (Math.random()-.5)*36) * Math.PI/180, sp = 10 + Math.random()*13;
      parts.push({x, y, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp, w:6+Math.random()*7, h:3+Math.random()*5,
        r:Math.random()*6, vr:(Math.random()-.5)*.45, c:cols[i%cols.length], t:0, life:130+Math.random()*90, round:Math.random()<.25});
    }
  }
  function frame(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    parts = parts.filter(p => p.t < p.life && p.y < innerHeight+40);
    parts.forEach(p => {
      p.vy += .27; p.vx *= .985; p.vy *= .985; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.t++;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.globalAlpha = Math.min(1,(p.life-p.t)/40);
      if (p.round){ ctx.beginPath(); ctx.arc(0,0,p.h,0,7); ctx.fill(); } else ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      ctx.restore();
    });
    if (parts.length) requestAnimationFrame(frame); else running = false;
  }
  function celebrate(){
    [0,250,600,1000,1500,2100].forEach(t => setTimeout(() => {
      shoot(true); shoot(false);
      if (!running){ running = true; requestAnimationFrame(frame); }
    }, t));
  }

  btn.addEventListener('click', () => {
    if (opened) return; opened = true;
    env.classList.add('open');
    celebrate();
    setTimeout(() => {
      splash.classList.add('hide');
      document.body.classList.remove('locked');
      document.body.classList.add('open');
      scrollTo(0,0);
    }, 1100);
    setTimeout(() => splash.remove(), 2000);
  });
})();
