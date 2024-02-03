function timeout(cb, tm, log) {
	return new Promise(function(resolve, reject) {
		var _cb=async ()=>{
			if(typeof cb=='function') await cb();
			resolve(1)
		};
		setTimeout(_cb, tm||1,log);//if(in_bgext()) setTimeout(_cb, tm||1);else 
	}).catch((err)=>{
		console.log(err);
	})
}
function sleep(tm, log) {
	return timeout(null, tm, log);
}
function instr(s, arr) {
    for(let i=0; i<arr.length;i++) {
        if(s.indexOf(arr[i])!==-1) return true;
    }
    return false;
}
function ctrl_t() {
	document.dispatchEvent(new KeyboardEvent('keydown', {
		'key': '11',//1
		keyCode : 11,code: "Digit11",which: 11,//1-49
		altKey:true//ctrlKey: true,
	}))
}
let users={},n=0,run_state=1;

var mutationObserver = new MutationObserver(async function(mutations) {
	if(!run_state) return;
  for(let i=0;i<mutations.length;i++) {
  	let mutation = mutations[i],e;
  	if(!mutation.target || typeof mutation.target.closest!='function')return;
    e=mutation.target.closest(`.media.conversation-list-item`);
    if(!e)return;
    let displayname=e.querySelector(`.body-conver-item .name-module-text`).textContent;
    if(!users[displayname] && !instr(e.textContent.toLowerCase(),['đã chốt','đã gửi ok','khiếu kiện']) && e.querySelectorAll(`div[class^="list_tags"] .ant-tag`).length==0) {
    	console.log(`found new user chat`,displayname);
    	if(n++%1) {
	    	users[displayname]=1;
	    	e.click();
	    	await sleep(10);
	    	ctrl_t();e.style.border="2px solid green";
	    }
    }
  }
});

(async ()=>{

	let e;
	while(1){
		e=document.querySelector(`.conversation-list`);
		if(e)break;
		await sleep(10);
	}
	if(1||run_state) {
		// Starts listening for changes in the root HTML element of the page.
		mutationObserver.observe(e, {
		  attributes: true,
		  characterData: true,
		  childList: true,
		  subtree: true,
		  attributeOldValue: true,
		  characterDataOldValue: true
		});
	}
	//ui
	var running=1||location.href.indexOf('run=1')!=-1,doc = new DOMParser().parseFromString(`<div class="mytoolbox"><a class="pcstbtn1 button1 ${running?'run':''}" href="?run=1">Start</a><a class="pcstbtn0 button1 ${running?'':'run'}" href="?run=0">Stop</a></div>`, "text/html");
	document.body.appendChild(doc.firstChild.querySelector('.mytoolbox'));

	let btn1=document.querySelector('.pcstbtn1'),btn0=document.querySelector('.pcstbtn0');
	btn1.addEventListener('click',function(e){
		e.preventDefault();
		run_state=1;
		btn1.classList.add('run');btn0.classList.remove('run');
	});
	btn0.addEventListener('click',function(e){
		e.preventDefault();
		run_state=0;
		btn0.classList.add('run');btn1.classList.remove('run');
	});
})();
