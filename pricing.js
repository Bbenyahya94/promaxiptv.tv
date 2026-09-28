export const prices = Object.freeze({1:13,3:25,6:33,12:53,24:null});
export const currencies = Object.freeze({EUR:1,USD:1.1367,GBP:0.85986});
export const rateDate = '24 September 2026';
export function quote(months, connections, currency='EUR') {
  if (!Object.hasOwn(prices,months)||!Number.isInteger(connections)||connections!==1||!Object.hasOwn(currencies,currency)) throw new RangeError('Invalid package selection');
  
  const total=prices[months]===null?null:Math.round(prices[months]*currencies[currency]*100)/100;
  return {months:Number(months),connections,currency,total};
}
export const money=(value,currency)=>new Intl.NumberFormat('en-IE',{style:'currency',currency,maximumFractionDigits:2}).format(value);
export function orderLink(q,extra={}){
  const lines=['Hello ProMax IPTV, I would like to order:',`Duration: ${q.months} month${q.months>1?'s':''}`,`Connections: ${q.connections}`,`Currency: ${q.currency}`,q.total===null?'Price: please send a quote':`Package total: ${money(q.total,q.currency)}${q.currency==='EUR'?'':' (indicative conversion)'}`,...Object.entries(extra).map(([k,v])=>`${k}: ${v}`),'Please confirm availability, the final payable total and activation details.'];
  return `https://wa.me/212670779271?text=${encodeURIComponent(lines.join('\n'))}`;
}
