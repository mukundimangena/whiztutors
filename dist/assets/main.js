/* ============ WHIZ TUTORING — CLIENT JS ============ */
(function(){
'use strict';
const API = { enquiry:'/api/enquiry', reviews:'/api/reviews' };
const $ = (s,c)=> (c||document).querySelector(s);
const $$ = (s,c)=> Array.from((c||document).querySelectorAll(s));

/* ---- Nav ---- */
const nav = $('#nav');
addEventListener('scroll',()=>nav && nav.classList.toggle('scrolled',scrollY>10),{passive:true});
const burger = $('#hamburger');
burger && burger.addEventListener('click',function(){
  const m=$('#mobileMenu'); const open=m.classList.toggle('open');
  this.setAttribute('aria-expanded',open);
});

/* ---- Reveal on scroll ---- */
const ro = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target);} }),{threshold:.12});
$$('.reveal').forEach(el=>ro.observe(el));

/* ---- Highlighter + grade ring ---- */
setTimeout(()=>{ $$('.hl').forEach(h=>h.classList.add('draw')); const g=$('#gradeRing'); g&&g.classList.add('go'); },200);

/* ---- Animated counters ---- */
const band = $('#statsBand');
if(band){
  new IntersectionObserver((es,obs)=>es.forEach(e=>{ if(e.isIntersecting){obs.disconnect();
    $$('.count',band).forEach(el=>{
      const to=+el.dataset.to, t0=performance.now();
      (function tick(t){ const p=Math.min((t-t0)/1600,1), ease=1-Math.pow(1-p,3);
        el.textContent=Math.round(to*ease).toLocaleString(); if(p<1)requestAnimationFrame(tick); })(t0);
    });
  }}),{threshold:.4}).observe(band);
}

/* ---- Success-story carousel ---- */
const track = $('#slideTrack');
if(track){
  const n = track.children.length; let i=0;
  window.goSlide = j=>{ i=(j+n)%n; track.style.transform=`translateX(-${i*100}%)`;
    $$('.car-dot').forEach((d,k)=>d.classList.toggle('on',k===i)); };
  window.moveSlide = d=>goSlide(i+d);
  setInterval(()=>moveSlide(1),7000);
}

/* ---- Toast ---- */
let toastTimer;
window.toast = msg=>{ const t=$('#toast'); if(!t)return; $('#toastMsg').textContent=msg;
  t.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'),4200); };

/* ---- Booking modal ---- */
window.openBooking = (subject)=>{
  const m=$('#bookModal'); if(!m)return;
  m.classList.add('open'); document.body.style.overflow='hidden';
  if(subject){ const sel=$('#f_subject'); if(sel){ [...sel.options].forEach(o=>{ if(o.text===subject) sel.value=o.value; }); } }
  setTimeout(()=>$('#f_student') && $('#f_student').focus(),100);
};
window.closeBooking = ()=>{ const m=$('#bookModal'); if(!m)return; m.classList.remove('open'); document.body.style.overflow=''; };
const bm=$('#bookModal');
bm && bm.addEventListener('click',e=>{ if(e.target===bm) closeBooking(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'){ closeBooking(); closeExit(); } });

/* ---- Validation ---- */
function setErr(input,msg){
  const f=input.closest('.field'); if(!f)return;
  input.classList.toggle('err',!!msg);
  f.classList.toggle('invalid',!!msg);
  const em=f.querySelector('.err-msg'); if(em) em.textContent=msg||'';
}
function validEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); }
function validPhone(v){ return v.replace(/[^\d]/g,'').length>=9; }
function validateForm(form){
  let ok=true;
  $$('[required]',form).forEach(inp=>{
    const v=inp.value.trim(); let msg='';
    if(!v) msg='This field is required.';
    else if(inp.type==='email' && !validEmail(v)) msg='Please enter a valid email address.';
    else if(inp.type==='tel' && !validPhone(v)) msg='Please enter a valid phone number.';
    setErr(inp,msg); if(msg) ok=false;
  });
  return ok;
}
$$('form [required]').forEach(inp=>inp.addEventListener('input',()=>setErr(inp,'')));

/* ---- Enquiry submit (email to Whiz + auto-confirmation, stored server-side) ---- */
async function submitLead(form,btn,type){
  if(!validateForm(form)){ toast('Please fix the highlighted fields.'); return; }
  // Honeypot + time-trap spam protection
  const hp = form.querySelector('.hp input');
  if(hp && hp.value) return; // bot filled the hidden field
  const data = { type, page: location.pathname, ts_loaded: form.dataset.ts, ts_sent: Date.now() };
  new FormData(form).forEach((v,k)=>{ if(k!=='website') data[k]= (data[k]? data[k]+', ':'') + v; });

  const orig = btn.innerHTML;
  btn.disabled = true; btn.innerHTML = '<span class="spin"></span> Sending…';
  try{
    const res = await fetch(API.enquiry,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    if(!res.ok) throw new Error('bad status');
    form.reset(); closeBooking();
    showSuccess(form);
  }catch(err){
    // Graceful fallback (e.g. previewing without backend): open a prefilled email instead
    const body = Object.entries(data).filter(([k])=>!k.startsWith('ts_')).map(([k,v])=>k+': '+v).join('\n');
    location.href = 'mailto:whiztutors@gmail.com?subject=' + encodeURIComponent('New tutoring enquiry — '+(data.subject||'')) + '&body=' + encodeURIComponent(body);
    toast('Backend not connected — opening your email app instead.');
  }finally{
    btn.disabled=false; btn.innerHTML=orig;
  }
}
function showSuccess(form){
  const ok = form.querySelector('.form-success');
  if(ok){ ok.style.display='block'; form.querySelectorAll('.form-grid,.btn,.form-note').forEach(el=>el.style.display='none'); }
  toast("Thank you! We'll contact you within 24 hours to match you with the perfect tutor.");
}
window.submitLead = submitLead;
$$('form[data-lead]').forEach(f=>{
  f.dataset.ts = Date.now();
  f.addEventListener('submit',e=>{ e.preventDefault(); submitLead(f, f.querySelector('[type="submit"]'), f.dataset.lead); });
});

/* ---- Simple one-field leads (callback / newsletter / study guide) ---- */
window.miniLead = async (btn,type,msg)=>{
  const wrap=btn.closest('form,.callback,.magnet,.newsletter'); const inp=wrap && wrap.querySelector('input');
  if(!inp || !inp.value.trim()){ toast('Please enter your details first.'); inp&&inp.focus(); return; }
  if(inp.type==='email' && !validEmail(inp.value.trim())){ toast('Please enter a valid email address.'); return; }
  const payload={type,value:inp.value.trim(),page:location.pathname,ts_sent:Date.now()};
  try{ await fetch(API.enquiry,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}); }catch(e){}
  inp.value=''; toast(msg);
};

/* ---- Google reviews widget ---- */
(async function reviews(){
  const wrap=$('#grTrack'); if(!wrap) return;
  try{
    const res=await fetch(API.reviews); if(!res.ok) throw 0;
    const d=await res.json();
    if(d && d.reviews && d.reviews.length){
      $('#grNum') && ($('#grNum').textContent = d.rating.toFixed(1));
      $('#grCount') && ($('#grCount').textContent = d.total + ' Google reviews');
      wrap.innerHTML = d.reviews.slice(0,8).map(r=>reviewCard(r)).join('');
      const note=$('#grNote'); if(note) note.textContent='Live reviews from our Google Business Profile.';
    }
  }catch(e){ /* seed reviews already rendered server-side */ }
})();
function reviewCard(r){
  const stars='★'.repeat(Math.round(r.rating))+'☆'.repeat(5-Math.round(r.rating));
  const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  return '<div class="card review-card gr-card"><svg class="g-ic" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6c-.3 1.4-1 2.6-2.2 3.4v2.8h3.6c2.1-1.9 3.2-4.8 3.2-8.4z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.3 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.6H2.1v2.9C4 20.4 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.8 14c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1V6.9H2.1C1.4 8.4 1 10.1 1 11.9s.4 3.5 1.1 5l3.7-2.9z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2C17.5 2.1 15 1 12 1 7.7 1 4 3.6 2.1 7.3L5.8 10c.9-2.7 3.3-4.6 6.2-4.6z"/></svg>'
    + '<span class="stars" aria-label="'+r.rating+' star review">'+stars+'</span>'
    + '<p>\u201C'+esc(r.text)+'\u201D</p>'
    + '<div class="who"><div><b>'+esc(r.author)+'</b><span class="when">'+esc(r.when||'')+'</span></div></div></div>';
}

/* ---- Exit-intent popup (desktop, once per session) ---- */
const exitPop=$('#exitPop');
function closeExit(){ exitPop && exitPop.classList.remove('open'); document.body.style.overflow=''; }
window.closeExit=closeExit;
if(exitPop && matchMedia('(pointer:fine)').matches && !sessionStorage.getItem('exitShown')){
  let armed=false; setTimeout(()=>armed=true,12000);
  document.addEventListener('mouseout',e=>{
    if(armed && !e.relatedTarget && e.clientY<=0 && !sessionStorage.getItem('exitShown')){
      sessionStorage.setItem('exitShown','1');
      exitPop.classList.add('open'); document.body.style.overflow='hidden';
    }
  });
  exitPop.addEventListener('click',e=>{ if(e.target===exitPop) closeExit(); });
}
})();
