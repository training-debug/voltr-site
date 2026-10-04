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
})();
