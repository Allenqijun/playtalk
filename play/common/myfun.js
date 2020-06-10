export default{
	dateTime(e){
		let old = new Date(e);
		let now = new Date();
		
		let d = old.getTime();
		let h = old.getHours();
		let m = old.getMinutes();
		let Y = old.getFullYear();
		let M = old.getMonth();
		let D = old.getDate();
		
		let nd = old.getTime();
		let nh = old.getHours();
		let n = old.getMinutes();
		let nY = old.getFullYear();
		let nM = old.getMonth();
		let nD = old.getDate();
		
		if(D === nD && M === nM && Y === nY){
			if(h<10){
				h = '0'+h;
			}
			if(m<10){
				m = '0'+m;
			}
			return h+':'+m;
		}
		
		if(D+1 === nD && M === nM && Y === nY){
			if(h<10){
				h = '0'+h;
			}
			if(m<10){
				m = '0'+m;
			}
			return '昨天'+h+':'+m;
		}else{
			
			return Y+'/'+M+'/'+D;
	}
},
//搜索延时作用函数
debounce (fn ,t){
	let delay = t || 500;
	let timer;
	return function(){
		let args = arguments;
		if(timer){
			clearTimeout(timer);
		}
		timer = setTimeout(()=>{
			timer = null;
			fn.apply(this, args);
		}, delay);
	}
}
}