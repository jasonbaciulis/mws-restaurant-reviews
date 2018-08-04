let restaurants,neighborhoods,cuisines;var map,markers=[];document.addEventListener("DOMContentLoaded",e=>{fetchNeighborhoods(),fetchCuisines()}),fetchNeighborhoods=(()=>{DBHelper.fetchNeighborhoods((e,t)=>{e?console.error(e):(self.neighborhoods=t,fillNeighborhoodsHTML())})}),fillNeighborhoodsHTML=((e=self.neighborhoods)=>{const t=document.getElementById("neighborhoods-select");e.forEach(e=>{const n=document.createElement("option");n.innerHTML=e,n.value=e,t.append(n)})}),fetchCuisines=(()=>{DBHelper.fetchCuisines((e,t)=>{e?console.error(e):(self.cuisines=t,fillCuisinesHTML())})}),fillCuisinesHTML=((e=self.cuisines)=>{const t=document.getElementById("cuisines-select");e.forEach(e=>{const n=document.createElement("option");n.innerHTML=e,n.value=e,t.append(n)})}),window.initMap=(()=>{self.map=new google.maps.Map(document.getElementById("map"),{zoom:12,center:{lat:40.722216,lng:-73.987501},scrollwheel:!1}),updateRestaurants()}),updateRestaurants=(()=>{const e=document.getElementById("cuisines-select"),t=document.getElementById("neighborhoods-select"),n=e.selectedIndex,s=t.selectedIndex,a=e[n].value,r=t[s].value;DBHelper.fetchRestaurantByCuisineAndNeighborhood(a,r,(e,t)=>{e?console.error(e):(resetRestaurants(t),fillRestaurantsHTML())})}),resetRestaurants=(e=>{self.restaurants=[],document.getElementById("restaurants-list").innerHTML="",self.markers.forEach(e=>e.setMap(null)),self.markers=[],self.restaurants=e}),fillRestaurantsHTML=((e=self.restaurants)=>{const t=document.getElementById("restaurants-list");e.forEach(e=>{t.append(createRestaurantHTML(e))}),addMarkersToMap()}),setImgSrcset=((e,t)=>`${e}-800px.${t} 800w,\n\t${e}-650px.${t} 650w,\n\t${e}-500px.${t} 500w,\n\t${e}-350px.${t} 350w,\n\t${e}-220px.${t} 220w`),createRestaurantHTML=(e=>{const t=document.createElement("li"),n=document.createElement("a"),s=document.createElement("figure"),a=document.createElement("picture"),r=document.createElement("source"),o=document.createElement("img"),c=DBHelper.imageUrlForRestaurant(e);r.type="image/webp",r.setAttribute("data-srcset",setImgSrcset(c,"webp")),r.setAttribute("data-sizes","auto"),o.className="restaurant-img lazyload",o.alt=`Picture of ${e.name} restaurant`,o.src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",o.setAttribute("data-srcset",setImgSrcset(c,"jpg")),o.setAttribute("data-sizes","auto"),o.setAttribute("data-src",`${c}.jpg`),a.append(r),a.append(o),s.className="restaurant-img-cont",s.append(a),n.className="card-link",n.href=DBHelper.urlForRestaurant(e),n.append(s);const l=document.createElement("div");l.className="restaurant-info-cont";const d=document.createElement("h3");d.innerHTML=e.name,l.append(d);const i=document.createElement("p");i.innerHTML=e.neighborhood,l.append(i);const u=document.createElement("p");u.innerHTML=e.address,l.append(u);const m=document.createElement("button");return m.innerHTML="View Details",m.className="btn-more",l.append(m),n.append(l),t.className="rounded-card",t.append(n),t}),addMarkersToMap=((e=self.restaurants)=>{e.forEach(e=>{const t=DBHelper.mapMarkerForRestaurant(e,self.map);google.maps.event.addListener(t,"click",()=>{window.location.href=t.url}),self.markers.push(t)})});