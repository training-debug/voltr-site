(function(){
  var nav=document.querySelector('nav.top');
  var hero=document.querySelector('.hero');
  function onScroll(){
    var y=window.scrollY||0;
    if(nav){
      var lim=hero?Math.max(hero.offsetHeight-90,200):10;
      if(y>40){nav.classList.add('fixed')}else{nav.classList.remove('fixed')}
      if(hero){ if(y<lim){nav.classList.add('onvideo')}else{nav.classList.remove('onvideo')} }
    }
    var m=document.querySelector('.mcta');
    if(m){ var b=document.getElementById('book'); var past=y>(window.innerHeight*0.8); var atBook=b&&b.getBoundingClientRect().top<window.innerHeight; m.classList.toggle('on',past&&!atBook); }
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  // reveal
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.rv').forEach(function(el){io.observe(el)});
  } else {document.querySelectorAll('.rv').forEach(function(el){el.classList.add('in')})}


  // v5: hero intro (line rise), stagger, count-up
  var hh=document.querySelector('.hero .display');
  if(hh&&!hh.querySelector('.ln')){hh.innerHTML=hh.innerHTML.split(/<br\s*\/?>/i).map(function(x,i){return '<span class="ln"><span style="transition-delay:'+(0.15+i*0.12)+'s">'+x+'</span></span>'}).join('')}
  var hr=document.querySelector('.hero');if(hr){requestAnimationFrame(function(){setTimeout(function(){hr.classList.add('go')},60)})}
  var groups=new Map();document.querySelectorAll('.rv').forEach(function(el){var p=el.parentNode;var n=groups.get(p)||0;if(n)el.style.transitionDelay=Math.min(n,4)*0.09+'s';groups.set(p,n+1)});
  if('IntersectionObserver' in window){
    var co=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;co.unobserve(e.target);var el=e.target,n=el.firstChild;if(!n||n.nodeType!==3)return;var m=n.nodeValue.match(/^(\D*)(\d+)(.*)$/);if(!m)return;var end=+m[2],t0=null;function f(ts){if(!t0)t0=ts;var k=Math.min((ts-t0)/1400,1);k=1-Math.pow(1-k,3);n.nodeValue=m[1]+Math.round(end*k)+m[3];if(k<1)requestAnimationFrame(f)}n.nodeValue=m[1]+'0'+m[3];requestAnimationFrame(f)})},{threshold:.6});
    document.querySelectorAll('.tframe .empty .big').forEach(function(el){co.observe(el)});
  }

  // mobile nav
  var bg=document.querySelector('.burger'),mn=document.querySelector('.mnav');
  if(bg&&mn){bg.addEventListener('click',function(){mn.classList.add('open')});mn.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mn.classList.remove('open')})});}

  // transformation frames: show typographic card until photos exist
  document.querySelectorAll('.tframe').forEach(function(fr){
    fr.classList.add('noimg');var imgs=fr.querySelectorAll('img'),ok=0;
    imgs.forEach(function(img){img.loading='eager';function good(){if(img.naturalWidth>0&&++ok===imgs.length)fr.classList.remove('noimg')}
      if(img.complete)good();else img.addEventListener('load',good)});
  });

  // hero video: swap to portrait source on small screens
  document.querySelectorAll('video[data-m]').forEach(function(v){
    if(window.matchMedia('(max-width:700px)').matches){ v.poster=v.getAttribute('data-mp')||v.poster; v.src=v.getAttribute('data-m'); }
    else { v.src=v.getAttribute('data-d'); }
    v.muted=true; var p=v.play(); if(p&&p.catch)p.catch(function(){});
  });

  // pass UTM params into Calendly embeds
  var qs=window.location.search.replace(/^\?/,'');
  if(qs){document.querySelectorAll('.calendly-inline-widget').forEach(function(w){var u=w.getAttribute('data-url');w.setAttribute('data-url',u+(u.indexOf('?')>-1?'&':'?')+qs)});}

  // booking events -> analytics hooks (Meta Pixel fires only if loaded)
  window.addEventListener('message',function(e){
    if(e.origin!=='https://calendly.com'||!e.data||!e.data.event)return;
    if(e.data.event==='calendly.date_and_time_selected'&&window.fbq)fbq('track','Lead');
    if(e.data.event==='calendly.event_scheduled'){ if(window.fbq)fbq('track','Schedule'); }
  });

  // v7.1: session film, places reveal + clocks + play only in view
  document.querySelectorAll('.film').forEach(function(f){var v=f.querySelector('video'),b=f.querySelector('.play');if(!v||!b)return;
    b.addEventListener('click',function(){f.classList.add('on');v.controls=true;v.muted=false;var p=v.play();if(p&&p.catch)p.catch(function(){})});});
  var pl=document.querySelector('.places');
  if(pl){
    var vids=pl.querySelectorAll('video');
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){es.forEach(function(e){
        if(e.isIntersecting){pl.classList.add('in');vids.forEach(function(v){var p=v.play();if(p&&p.catch)p.catch(function(){})})}
        else{vids.forEach(function(v){v.pause()})}
      })},{threshold:.15}).observe(pl);
    } else {pl.classList.add('in')}
    var clks=pl.querySelectorAll('.clk');
    function tick(){clks.forEach(function(c){var tz=c.getAttribute('data-tz');try{var o={hour:'2-digit',minute:'2-digit',hour12:false};if(tz&&tz!=='local')o.timeZone=tz;c.textContent=new Intl.DateTimeFormat('en-GB',o).format(new Date())}catch(e){c.textContent=''}})}
    tick();setInterval(tick,30000);
  }

  // v8.2: proof sliders (videos + written), each with its own nav
  document.querySelectorAll('.proofs').forEach(function(pr){
    var sec=pr.closest('section')||document,cards=[].slice.call(pr.children),cnt=sec.querySelector('.pcount'),auto=!pr.classList.contains('vids'),idx=0;
    function pad(n){return (n<10?'0':'')+n}
    function cur(){var x=pr.scrollLeft,best=0,d=1e9;cards.forEach(function(c,i){var dd=Math.abs(c.offsetLeft-cards[0].offsetLeft-x);if(dd<d){d=dd;best=i}});return best}
    function go(i){idx=(i+cards.length)%cards.length;pr.scrollTo({left:cards[idx].offsetLeft-cards[0].offsetLeft,behavior:'smooth'})}
    function upd(){idx=cur();if(cnt)cnt.textContent=pad(idx+1)+' / '+pad(cards.length)}
    upd();
    pr.addEventListener('scroll',function(){clearTimeout(pr._t);pr._t=setTimeout(upd,80)},{passive:true});
    var pv=sec.querySelector('.pnav .pv'),nx=sec.querySelector('.pnav .nx');
    if(pv)pv.addEventListener('click',function(){auto=false;go(cur()-1)});
    if(nx)nx.addEventListener('click',function(){auto=false;go(cur()+1)});
    ['pointerdown','wheel','touchstart','keydown'].forEach(function(ev){pr.addEventListener(ev,function(){auto=false},{passive:true})});
    var inView=false;
    if('IntersectionObserver' in window){new IntersectionObserver(function(es){es.forEach(function(e){inView=e.isIntersecting})},{threshold:.4}).observe(pr)}
    setInterval(function(){if(auto&&inView&&!document.hidden){go(cur()+1)}},6000);
    pr.querySelectorAll('.pf-video').forEach(function(pvid){var v=pvid.querySelector('video'),b=pvid.querySelector('.snd');
      if('IntersectionObserver' in window){new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){if(!pvid.classList.contains('on')||!v.paused){var p=v.play();if(p&&p.catch)p.catch(function(){})}}else{v.pause()}})},{threshold:.6}).observe(pvid)}
      if(b)b.addEventListener('click',function(){auto=false;document.querySelectorAll('.pf-video video').forEach(function(o){if(o!==v){o.muted=true}});pvid.classList.add('on');v.currentTime=0;v.muted=false;v.loop=false;v.controls=true;var p=v.play();if(p&&p.catch)p.catch(function(){})});
    });
  });

  // v7.2: places reel
  var reel=document.querySelector('.reel');
  if(reel){
    var rv=[].slice.call(reel.querySelectorAll('.reel-stage video')),rl=[].slice.call(reel.querySelectorAll('.reel-list li')),bar=reel.querySelector('.reel-bar i'),ri=0,rt=null,rIn=false;
    function show(i){ri=i;rv.forEach(function(v,k){if(k===i){v.classList.add('on');var p=v.play();if(p&&p.catch)p.catch(function(){})}else{v.classList.remove('on');setTimeout(function(){if(!v.classList.contains('on'))v.pause()},1200)}});
      rl.forEach(function(l,k){l.classList.toggle('on',k===i)});
      if(bar){bar.classList.remove('run');void bar.offsetWidth;bar.classList.add('run')}}
    function loop(){clearInterval(rt);rt=setInterval(function(){if(rIn&&!document.hidden)show((ri+1)%rv.length)},6000)}
    rl.forEach(function(l,k){l.querySelector('button').addEventListener('click',function(){show(k);loop()})});
    if('IntersectionObserver' in window){new IntersectionObserver(function(es){es.forEach(function(e){rIn=e.isIntersecting;if(rIn){show(ri);loop()}else{rv.forEach(function(v){v.pause()})}})},{threshold:.3}).observe(reel)}else{show(0);loop()}
    var rc=reel.querySelectorAll('.clk');
    function rtick(){rc.forEach(function(c){var tz=c.getAttribute('data-tz');try{var o={hour:'2-digit',minute:'2-digit',hour12:false};if(tz&&tz!=='local')o.timeZone=tz;c.textContent=new Intl.DateTimeFormat('en-GB',o).format(new Date())}catch(e){c.textContent=''}})}
    rtick();setInterval(rtick,30000);
  }

  // v7.3: case study carousel
  document.querySelectorAll('.case-car').forEach(function(cc){
    var tr=cc.querySelector('.cc-track'),im=tr.querySelectorAll('img'),ct=cc.querySelector('.cc-count');
    function i(){return Math.round(tr.scrollLeft/tr.clientWidth)}
    function pad(n){return (n<10?'0':'')+n}
    function up(){if(ct)ct.textContent=pad(i()+1)+' / '+pad(im.length)}
    tr.addEventListener('scroll',function(){clearTimeout(tr._t);tr._t=setTimeout(up,60)},{passive:true});
    cc.querySelector('.pv').addEventListener('click',function(){tr.scrollTo({left:Math.max(0,i()-1)*tr.clientWidth,behavior:'smooth'})});
    cc.querySelector('.nx').addEventListener('click',function(){var n=i()+1;if(n>=im.length)n=0;tr.scrollTo({left:n*tr.clientWidth,behavior:'smooth'})});
  });
})();
