const STORAGE_KEY = 'financial-lab-v3-data';
const DEFAULTS = {researcherName:'Robert',paycheck:0,billName:'',billDate:'',billAmount:0,saveAmount:0,theme:'light',bills:[],lastUpdated:''};

function loadData(){
  try{
    const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
    const merged={...DEFAULTS,...saved};
    if(!Array.isArray(merged.bills)) merged.bills=[];
    return merged;
  }catch(error){console.warn('Saved data could not be parsed; defaults loaded.',error);return {...DEFAULTS};}
}
let data=loadData();
const $=id=>document.getElementById(id);
const money=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(Number(v)||0);
const safeDate=value=>value?new Date(`${value}T12:00:00`):null;
const formatDate=(value,options={month:'short',day:'numeric',year:'numeric'})=>{const d=safeDate(value);return d&&!Number.isNaN(d.valueOf())?d.toLocaleDateString('en-US',options):''};

function normalizedBills(){
  const bills=[...data.bills];
  if(data.billName||data.billDate||Number(data.billAmount)>0){
    const legacy={name:data.billName||'Upcoming bill',date:data.billDate||'',amount:Number(data.billAmount)||0};
    const exists=bills.some(b=>b.name===legacy.name&&b.date===legacy.date&&Number(b.amount||0)===legacy.amount);
    if(!exists)bills.push(legacy);
  }
  return bills.filter(b=>b&&(b.name||b.date||Number(b.amount)>0)).sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999'));
}
function calculations(){
  const bills=normalizedBills();
  const billTotal=bills.reduce((sum,b)=>sum+(Number(b.amount)||0),0);
  const available=(Number(data.paycheck)||0)-billTotal-(Number(data.saveAmount)||0);
  const completed=[Number(data.paycheck)>0,bills.length>0,Number(data.saveAmount)>0];
  const progress=Math.round(completed.filter(Boolean).length/completed.length*100);
  let score=42;
  if(Number(data.paycheck)>0)score+=18;
  if(bills.length>0)score+=15;
  if(Number(data.saveAmount)>0)score+=15;
  if(Number(data.paycheck)>0&&available>=0)score+=10;
  return {bills,billTotal,available,progress,score:Math.min(100,score)};
}
function save(){data.lastUpdated=new Date().toISOString();localStorage.setItem(STORAGE_KEY,JSON.stringify(data));render();}
function setText(id,value){const node=$(id);if(node)node.textContent=value;}

function renderBills(bills){
  const host=$('upcomingBills');host.replaceChildren();
  if(!bills.length){const empty=document.createElement('div');empty.className='empty-row';empty.textContent='No upcoming bills yet. Add one in Friday Lab.';host.appendChild(empty);return;}
  bills.slice(0,3).forEach(bill=>{
    const date=safeDate(bill.date);const item=document.createElement('article');item.className='bill-item';
    const dateBox=document.createElement('div');dateBox.className='bill-date';
    const month=document.createElement('small');month.textContent=date?date.toLocaleDateString('en-US',{month:'short'}).toUpperCase():'TBD';
    const day=document.createElement('b');day.textContent=date?date.getDate():'—';dateBox.append(month,day);
    const copy=document.createElement('div');const title=document.createElement('h3');title.textContent=bill.name||'Upcoming bill';const note=document.createElement('p');note.textContent=bill.date?`Due ${formatDate(bill.date)}`:'Due date not set';copy.append(title,note);
    const amount=document.createElement('strong');amount.textContent=money(bill.amount);item.append(dateBox,copy,amount);host.appendChild(item);
  });
}
function renderSteps(){
  const steps=[['Paycheck entered',Number(data.paycheck)>0],['Upcoming bill mapped',normalizedBills().length>0],['Savings target selected',Number(data.saveAmount)>0]];
  const host=$('experimentSteps');host.replaceChildren();steps.forEach(([label,done])=>{const row=document.createElement('div');row.className=`experiment-step${done?' done':''}`;const icon=document.createElement('i');icon.textContent=done?'✓':'·';const text=document.createElement('span');text.textContent=label;row.append(icon,text);host.appendChild(row);});
}
function render(){
  const c=calculations();
  setText('researcherName',data.researcherName||'Researcher');
  setText('dashboardDate',new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}));
  const hour=new Date().getHours();setText('dayPart',hour<12?'morning':hour<17?'afternoon':'evening');
  setText('summaryPaycheck',money(data.paycheck));setText('summarySavings',money(data.saveAmount));setText('summaryBills',String(c.bills.length));setText('summaryAvailable',money(c.available));
  setText('latestPaycheck',money(data.paycheck));setText('latestSavings',money(data.saveAmount));setText('latestBillAmount',money(c.billTotal));setText('latestAvailable',money(c.available));
  setText('paycheckNote',Number(data.paycheck)>0?'Latest saved paycheck':'Awaiting first entry');setText('savingsNote',Number(data.saveAmount)>0?'Planned for this week':'Set a savings target');setText('billsNote',c.bills.length?`${money(c.billTotal)} currently mapped`:'Nothing scheduled');setText('availableNote',c.available<0?'Plan needs adjustment':'After bills and savings');
  setText('healthScore',String(c.score));$('scoreRing').style.setProperty('--score',c.score);
  let label='BUILDING',headline='Your baseline is ready to form.',message='Complete Friday Lab to create a stronger financial reading.';
  if(c.score>=85){label='STRONG';headline='Your plan is working together.';message='Your paycheck, bills, and savings target are aligned.';}else if(c.score>=65){label='STABLE';headline='Your foundation is taking shape.';message='One focused action can improve your score this week.';}else if(c.score>=50){label='IN PROGRESS';headline='The Lab found your next step.';message='Add the missing weekly inputs to improve clarity.';}
  setText('healthLabel',label);setText('healthHeadline',headline);setText('healthMessage',message);
  if(Number(data.paycheck)>0){setText('missionTitle','Protect the plan you started.');setText('missionText',c.bills.length?'Review the upcoming bill and confirm your savings target.':'Add your next bill so the paycheck has a clear job.');}else{setText('missionTitle','Build this week’s money plan.');setText('missionText','Enter your next paycheck and bill so Dexx can sharpen your analysis.');}
  if(c.available<0){setText('observationTitle','Your plan is over capacity.');setText('observationText',`The current plan is ${money(Math.abs(c.available))} over the paycheck. Adjust a bill, savings target, or timing before spending.`);setText('dexxFullMessage','The numbers are not judging you. They are showing us exactly where the plan needs adjustment.');}
  else if(c.progress===100){setText('observationTitle','Your weekly experiment is fully mapped.');setText('observationText',`${money(c.available)} remains after mapped bills and savings. Protect that amount for spending and surprises.`);setText('dexxFullMessage','Your weekly inputs are complete. The next move is to follow the plan and record what you discover.');}
  else{setText('observationTitle','Clarity comes before control.');setText('observationText','Your next best move is to complete Friday Lab. Once the numbers are visible, the pressure gets smaller.');}
  setText('experimentPercent',`${c.progress}%`);$('experimentBar').style.width=`${c.progress}%`;renderBills(c.bills);renderSteps();
  $('paycheck').value=data.paycheck||'';$('billName').value=data.billName||'';$('billDate').value=data.billDate||'';$('billAmount').value=data.billAmount||'';$('saveAmount').value=data.saveAmount||'';
  document.documentElement.classList.toggle('dark',data.theme==='dark');
}
function showView(viewId){
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===viewId));
  document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.view===viewId));
  history.replaceState(null,'',`#${viewId}`);window.scrollTo({top:0,behavior:'smooth'});
}
async function runSplash(){
  const items=['Reviewing saved lab data…','Checking weekly inputs…','Calculating financial health…'];
  for(const item of items){const p=document.createElement('div');p.className='check';p.textContent=`✓ ${item}`;$('checks').appendChild(p);await new Promise(r=>setTimeout(r,180));}
  $('complete').classList.remove('hidden');await new Promise(r=>setTimeout(r,420));$('splash').classList.add('hidden');$('app').classList.remove('hidden');
}
document.addEventListener('click',event=>{const target=event.target.closest('[data-go]');if(target){event.preventDefault();showView(target.dataset.go);}});
document.querySelectorAll('.bottom-nav button').forEach(btn=>btn.addEventListener('click',()=>showView(btn.dataset.view)));
$('themeToggle').addEventListener('click',()=>{data.theme=data.theme==='dark'?'light':'dark';save();});
$('fridayForm').addEventListener('submit',event=>{
  event.preventDefault();data.paycheck=Math.max(0,Number($('paycheck').value)||0);data.billName=$('billName').value.trim();data.billDate=$('billDate').value;data.billAmount=Math.max(0,Number($('billAmount').value)||0);data.saveAmount=Math.max(0,Number($('saveAmount').value)||0);
  if(data.billName||data.billDate||data.billAmount){const bill={name:data.billName||'Upcoming bill',date:data.billDate,amount:data.billAmount};const index=data.bills.findIndex(b=>b.name===bill.name&&b.date===bill.date);if(index>=0)data.bills[index]=bill;else data.bills.push(bill);}
  save();$('formStatus').textContent='Weekly analysis complete. Your existing lab data is safely saved.';
});
render();const initial=location.hash.slice(1);if(['dashboard','friday','research','experiments','hall','dexx'].includes(initial))showView(initial);runSplash();
if('serviceWorker'in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(error=>console.warn('Service worker unavailable',error)));}
