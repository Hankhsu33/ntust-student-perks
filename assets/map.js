(()=>{
let map,layer,userLayer,baseLayer,tileFailures=0,markers=new Map(),visible=[],lastIds='',firstFit=false,selectedId='';
const $=s=>document.querySelector(s);
function status(selector,message=''){const node=$(selector);if(node){node.textContent=message;node.hidden=!message;}}
function showMap(){ $('.explore-layout').dataset.view='map';document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view==='map')));map.invalidateSize(); }
function init(){
 if(map)return true;
 if(!window.L){status('#map-status','地圖套件未載入，仍可使用商店清單。');return false;}
 map=L.map($('#store-map'),{scrollWheelZoom:false}).setView([25.0148,121.534],16);
 baseLayer=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',maxZoom:19});
 baseLayer.on('loading',()=>{tileFailures=0;});
 baseLayer.on('tileerror',()=>{tileFailures++;status('#map-status','底圖載入失敗。請使用上方 Google Maps 入口；清單仍可查詢。');});
 baseLayer.on('load',()=>{if(!tileFailures)status('#map-status');});
 baseLayer.addTo(map);
 if(window.ResizeObserver)new ResizeObserver(()=>map.invalidateSize()).observe($('#store-map'));
 layer=L.layerGroup().addTo(map);userLayer=L.layerGroup().addTo(map);
 $('#fit-map').addEventListener('click',fit);$('#locate-me').addEventListener('click',locateMe);
 return true;
}
function fit(){const points=visible.filter(s=>Number.isFinite(s.lat)&&Number.isFinite(s.lng)).map(s=>[s.lat,s.lng]);if(points.length)map.fitBounds(points,{padding:[45,45],maxZoom:16});}
function locateMe(){
 if(!navigator.geolocation){status('#location-status','此瀏覽器不支援定位。');return;}
 if(window.isSecureContext===false){status('#location-status','請在 HTTPS 正式網站使用定位。');return;}
 const button=$('#locate-me');button.disabled=true;button.setAttribute('aria-busy','true');status('#location-status','正在取得你的位置…');
 const finish=()=>{button.disabled=false;button.removeAttribute('aria-busy');};
 try{navigator.geolocation.getCurrentPosition(position=>{
  finish();const {latitude,longitude,accuracy}=position.coords;
  if(!Number.isFinite(latitude)||!Number.isFinite(longitude)||Math.abs(latitude)>90||Math.abs(longitude)>180){status('#location-status','無法取得有效位置，請稍後重試。');return;}
  const point=[latitude,longitude];userLayer.clearLayers();
  if(Number.isFinite(accuracy)&&accuracy>0)L.circle(point,{radius:accuracy,className:'user-location-accuracy',weight:1,fillOpacity:.12,interactive:false}).addTo(userLayer);
  L.marker(point,{title:'你的位置',zIndexOffset:1000,icon:L.divIcon({className:'user-location-pin',html:'<span aria-hidden="true"></span>',iconSize:[24,24],iconAnchor:[12,12]})}).bindTooltip('你的位置').addTo(userLayer);
  showMap();map.setView(point,accuracy>2000?13:16,{animate:!matchMedia('(prefers-reduced-motion: reduce)').matches});
  button.textContent='更新我的位置';status('#location-status','已顯示你的位置'+(Number.isFinite(accuracy)&&accuracy>0?'，定位精度約 '+Math.round(accuracy)+' 公尺':'')+'。');
 },error=>{finish();status('#location-status',error.code===1?'定位未獲允許，請在瀏覽器的網站權限中開啟定位。':error.code===3?'定位逾時，請稍後再試。':'目前無法取得位置，請確認裝置定位已開啟。');},{enableHighAccuracy:true,timeout:12000,maximumAge:60000});}
 catch{finish();status('#location-status','定位無法啟動，請檢查瀏覽器的網站權限。');}
}
function highlight(id){
 selectedId=id;for(const [key,marker] of markers){marker.getElement()?.classList.toggle('selected-pin',key===id);marker.setZIndexOffset(key===id?1200:0);}const picker=$('#map-store-select');if(picker)picker.value=id;const store=visible.find(s=>s.id===id),google=$('#google-map-link');
 if(store)status('#map-selection','已定位：'+store.name+'（橘色標記）');if(store&&google){google.href=store.googleMapsUrl||'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(store.name+' '+store.address);google.textContent='在 Google Maps 查看'+store.name;}
 document.querySelectorAll('.directory-row').forEach(row=>row.classList.toggle('selected',row.id==='store-'+id));
 
}
window.PerksMap={update(rows){
 visible=rows;const missing=rows.filter(s=>!Number.isFinite(s.lat)||!Number.isFinite(s.lng));status('#map-coverage',missing.length?`地圖顯示 ${rows.length-missing.length} / ${rows.length} 家；${missing.map(s=>s.name).join('、')}位置待確認，仍可查看店家詳情。`:`地圖顯示全部 ${rows.length} 家店家。`);if(!init())return;const reopen=markers.get(selectedId)?.isPopupOpen();layer.clearLayers();markers.clear();
 for(const s of rows){
  if(!Number.isFinite(s.lat)||!Number.isFinite(s.lng))continue;
  const marker=L.marker([s.lat,s.lng],{icon:L.divIcon({className:'perk-pin',html:`<span><b>${s.index+1}</b></span>`,iconSize:[34,38],iconAnchor:[17,38]}),title:s.name,keyboard:true});
  const popup=document.createElement('div'),title=document.createElement('strong'),offer=document.createElement('p'),button=document.createElement('button');
  title.textContent=s.name;offer.textContent=s.offer;button.textContent='查看優惠 ↗';
  button.addEventListener('click',()=>document.querySelector(`[data-store="${s.index}"]`)?.click());
  popup.append(title,offer,button);marker.bindPopup(popup).on('click',()=>highlight(s.id)).addTo(layer);markers.set(s.id,marker);
 }
 if(markers.has(selectedId)){highlight(selectedId);if(reopen)markers.get(selectedId).openPopup();}else{selectedId='';if($('#map-store-select'))$('#map-store-select').value='';status('#map-selection');}
 const ids=rows.map(s=>s.id).join(',');if(lastIds&&ids!==lastIds&&markers.size)fit();lastIds=ids;
 if(!firstFit&&markers.size){firstFit=true;fit();}
},select(id){const m=markers.get(id);if(!m)return false;showMap();map.setView(m.getLatLng(),17,{animate:!matchMedia('(prefers-reduced-motion: reduce)').matches});m.openPopup();highlight(id);return true;},resize(){requestAnimationFrame(()=>map?.invalidateSize());}};
})();
