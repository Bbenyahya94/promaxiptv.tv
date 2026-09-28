import {quote,money,orderLink} from './pricing.js';
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const menu=$('.menu-toggle');
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));$('#navigation').classList.toggle('open',open);});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){menu.click();menu.focus();}});
const calculators=$$('[data-calculator]');
function updateCalculator(root){
 const months=Number($('[name=duration]',root)?.value||12),connections=1,currency=$('[name=currency]',root).value;
 const q=quote(months,connections,currency);
 const output=$('[data-total]',root); if(output)output.textContent=q.total===null?'Request a quote':money(q.total,currency);
 const detail=$('[data-detail]',root);if(detail)detail.textContent=`${months} month${months===1?'':'s'} · 1 connection`;
 const order=$('[data-order]',root);if(order)order.href=orderLink(q);
 $$('[data-plan]',root).forEach(card=>{const plan=quote(Number(card.dataset.plan),connections,currency);$('[data-price]',card).textContent=plan.total===null?'Let’s talk':money(plan.total,currency);$('[data-monthly]',card).textContent=plan.total===null?'Personal quote for 24 months':`${money(plan.total/plan.months,currency)} / month equivalent`;$('[data-order]',card).href=orderLink(plan);});
 $$('[data-conversion]',root).forEach(el=>el.hidden=currency==='EUR');
}
calculators.forEach(root=>{root.addEventListener('change',()=>updateCalculator(root));updateCalculator(root);});
const wizard=$('[data-wizard]');
if(wizard){
 const state={months:12,device:'Smart TV',app:'IPTV Smarters Pro',connections:1,currency:'EUR'};
 let step=0;
 const panels=$$('[data-step]',wizard),indicators=$$('.stepper span',wizard);
 const back=$('[data-back]',wizard),next=$('[data-next]',wizard);
 function render(){panels.forEach((el,i)=>el.hidden=i!==step);indicators.forEach((el,i)=>{el.classList.toggle('active',i<=step);if(i===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});back.hidden=step===0;next.hidden=step===3;next.textContent=step===2?'Review package →':'Continue →';const q=quote(state.months,state.connections,state.currency);for(const [key,value] of Object.entries(state)){const el=$(`[data-summary="${key}"]`,wizard);if(el)el.textContent=key==='months'?`${value} months`:value;}$('[data-wizard-total]',wizard).textContent=q.total===null?'Request a quote':money(q.total,q.currency);$('[data-wizard-order]',wizard).href=orderLink(q,{'Device':state.device,'Player app':state.app});$('[data-wizard-conversion]',wizard).hidden=state.currency==='EUR';}
 $$('[data-choice]',wizard).forEach(button=>button.addEventListener('click',()=>{const key=button.dataset.choice;state[key]=key==='months'?Number(button.dataset.value):button.dataset.value;$$(`[data-choice="${key}"]`,wizard).forEach(b=>b.setAttribute('aria-pressed',String(b===button)));render();}));
 $$('select',wizard).forEach(select=>select.addEventListener('change',()=>{state[select.name]=select.value;render();}));
 function advance(delta){step=Math.min(3,Math.max(0,step+delta));render();$('h2',panels[step]).focus();}
 back.addEventListener('click',()=>advance(-1));next.addEventListener('click',()=>advance(1));render();
}
$$('[role=tablist]').forEach(tablist=>{const tabs=$$('[role=tab]',tablist);function select(tab){tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!active;});}tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>select(tab));tab.addEventListener('keydown',event=>{let target;if(event.key==='ArrowRight')target=tabs[(index+1)%tabs.length];if(event.key==='ArrowLeft')target=tabs[(index+tabs.length-1)%tabs.length];if(event.key==='Home')target=tabs[0];if(event.key==='End')target=tabs.at(-1);if(target){event.preventDefault();select(target);target.focus();}});});});
if(document.modelContext?.registerTool&&calculators.length){
 const controller=new AbortController();
 try{Promise.resolve(document.modelContext.registerTool({name:'configure_subscription_quote',title:'Configure a ProMax subscription quote',description:'Update the visible subscription calculator. Returns pricing and a WhatsApp link without sending an order.',inputSchema:{type:'object',properties:{months:{type:'integer',enum:[1,3,6,12,24]},currency:{type:'string',enum:['EUR','USD','GBP']}},required:['months','currency'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){if(!input||typeof input!=='object'||Object.keys(input).some(k=>!['months','currency'].includes(k)))throw new Error('Invalid quote input');const q=quote(input.months,1,input.currency);const root=calculators[0];const duration=$('[name=duration]',root);if(duration)duration.value=String(q.months);$('[name=currency]',root).value=q.currency;updateCalculator(root);return {...q,orderUrl:orderLink(q)};}},{signal:controller.signal})).catch(()=>{});}catch{}
 window.addEventListener('pagehide',()=>controller.abort(),{once:true});
}
