(()=>{
 const clock=document.getElementById('taiwan-clock');if(!clock)return;
 const formatter=new Intl.DateTimeFormat('zh-TW',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit',weekday:'short',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
 function update(){const now=new Date();clock.textContent=formatter.format(now);clock.dateTime=now.toISOString();}
 update();setInterval(update,1000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)update();});
})();
