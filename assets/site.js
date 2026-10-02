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

  // mobile nav
  var bg=document.querySelector('.burger'),mn=document.querySelector('.mnav');
  if(bg&&mn){bg.addEventListener('click',function(){mn.classList.add('open')});mn.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){mn.classList.remove('open')})});}

  // transformation frames: show typographic card until photos exist
  document.querySelectorAll('.tframe img').forEach(function(img){
    function fail(){img.closest('.tframe').classList.add('noimg')}
    if(img.complete&&img.naturalWidth===0){fail()} else {img.addEventListener('error',fail)}
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
})();
