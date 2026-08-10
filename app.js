const STORAGE_KEY = 'financial-lab-v3-data';
const DEFAULTS = {
  researcherName:'Rob', paycheck:0, currentBalance:0, payDate:'', nextPayday:'', savingsRate:10,
  billName:'', billDate:'', billAmount:0, saveAmount:0, debtAmount:0, debtGoal:0, expenses:0,
  customSavings:null, customDebt:null, bills:[], debts:[], expenseRecords:[], savingsGoals:[], savingsStrategy:'priority', debtStrategy:'balanced', paycheckHistory:[], approvedPlan:null, reserveMemory:{},
  missions:{spending:false,saving:false,bills:false,friday:false}, profile:{payFrequency:'weekly',paydayDay:5,incomePattern:'variable',recurringBillCount:9,financialStrategy:'balanced',reserveDays:14}, lastUpdated:''
};
const $=id=>document.getElementById(id);
const money=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(Number(v)||0);
const dateAtNoon=v=>v?new Date(`${v}T12:00:00`):null;
const iso=d=>d.toISOString().slice(0,10);
const clamp=(v,min,max)=>Math.min(max,Math.max(min,Number(v)||0));
function load(){try{const old=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');const migratedBills=Array.isArray(old.bills)?old.bills.map((b,i)=>({id:b.id||`bill-${i}-${Date.now()}`,name:b.name||'Bill',amount:Number(b.amount)||0,dueDate:b.dueDate||b.date||'',date:b.dueDate||b.date||'',priority:b.priority||'important',frequency:b.frequency||'monthly',autopay:!!b.autopay,paidOccurrences:Array.isArray(b.paidOccurrences)?b.paidOccurrences:(b.paid&&b.date?[b.date]:[])})):[];const migratedDebts=Array.isArray(old.debts)?old.debts.map((d,i)=>({id:d.id||`debt-${i}-${Date.now()}`,name:d.name||'Debt',balance:Math.max(0,Number(d.balance)||0),minimumPayment:Math.max(0,Number(d.minimumPayment??d.minimum??0)||0),dueDate:d.dueDate||d.date||'',apr:Math.max(0,Number(d.apr)||0),accountType:d.accountType||d.type||'credit-card'})):[];const migratedGoals=Array.isArray(old.savingsGoals)?old.savingsGoals.map((g,i)=>({id:g.id||`goal-${i}-${Date.now()}`,name:g.name||'Savings goal',target:Math.max(0,Number(g.target)||0),saved:Math.max(0,Number(g.saved)||0),priority:g.priority||'medium',targetDate:g.targetDate||'',category:g.category||'general'})):[];const migratedExpenses=Array.isArray(old.expenseRecords)?old.expenseRecords.map((x,i)=>({id:x.id||`expense-${i}-${Date.now()}`,name:x.name||x.merchant||'Expense',amount:Math.max(0,Number(x.amount)||0),category:x.category||'other',date:x.date||old.payDate||iso(new Date()),note:x.note||''})):((Number(old.expenses)||0)>0?[{id:`legacy-expense-${Date.now()}`,name:'Previous spending',amount:Math.max(0,Number(old.expenses)||0),category:'other',date:old.payDate||iso(new Date()),note:'Migrated from an earlier Financial Lab version'}]:[]);return {...DEFAULTS,...old,bills:migratedBills,debts:migratedDebts,expenseRecords:migratedExpenses,expenses:0,savingsGoals:migratedGoals,savingsStrategy:old.savingsStrategy||'priority',debtStrategy:old.debtStrategy||'balanced',paycheckHistory:Array.isArray(old.paycheckHistory)?old.paycheckHistory:[],reserveMemory:(old.reserveMemory&&typeof old.reserveMemory==='object'?old.reserveMemory:{}),missions:{...DEFAULTS.missions,...(old.missions||{})},profile:{...DEFAULTS.profile,...(old.profile||{})}}}catch{return structuredClone(DEFAULTS)}}
let data=load();
const priorityRank={essential:0,important:1,flexible:2};
function billDefinitions(){return (Array.isArray(data.bills)?data.bills:[]).filter(b=>b.name||b.dueDate||b.date||Number(b.amount)).map((b,i)=>({id:b.id||`bill-${i}-${b.name||'bill'}`,name:b.name||'Bill',amount:Number(b.amount)||0,dueDate:b.dueDate||b.date||'',date:b.dueDate||b.date||'',priority:b.priority||'important',frequency:b.frequency||'monthly',autopay:!!b.autopay,paidOccurrences:Array.isArray(b.paidOccurrences)?b.paidOccurrences:[]}))}



function expenseDefinitions(){return (Array.isArray(data.expenseRecords)?data.expenseRecords:[]).filter(x=>Number(x.amount)>0).map((x,i)=>({id:x.id||`expense-${i}`,name:x.name||'Expense',amount:Math.max(0,Number(x.amount)||0),category:x.category||'other',date:x.date||data.payDate||iso(new Date()),note:x.note||''}))}
function expensesForCycle(start,end){
  const s=dateAtNoon(start),e=dateAtNoon(end);
  if(!s||!e)return expenseDefinitions();
  return expenseDefinitions().filter(x=>{const d=dateAtNoon(x.date);return d&&d>=s&&d<=e}).sort((a,b)=>b.date.localeCompare(a.date))
}
function currentCycleExpenses(){const start=data.payDate||iso(new Date()),end=data.nextPayday||iso(new Date(Date.now()+7*86400000));return expensesForCycle(start,end)}
function currentCycleExpenseTotal(){return currentCycleExpenses().reduce((s,x)=>s+Number(x.amount||0),0)}
function expenseCategoryLabel(c){return ({gas:'Gas',groceries:'Groceries',food:'Food & dining',entertainment:'Entertainment',personal:'Personal',haircut:'Haircut',shopping:'Shopping',transportation:'Transportation',medical:'Medical',other:'Other'})[c]||'Other'}
function spendingStatus(p){
  if(!p.paycheck)return 'Build a payday plan first so Dexx can calculate your spending allowance.';
  if(p.overspent>0)return `You are ${money(p.overspent)} over this cycle’s TRUE Safe-to-Spend. Pause flexible spending until the next payday or rebuild the plan if your situation changed.`;
  const used=p.safeBeforeExpenses>0?p.expenseTotal/p.safeBeforeExpenses:0;
  if(used>=.8)return `You have used ${Math.round(used*100)}% of your flexible spending allowance. ${money(p.safeToSpend)} remains until payday.`;
  if(p.expenseTotal>0)return `You have spent ${money(p.expenseTotal)} from this cycle’s flexible money. ${money(p.safeToSpend)} remains until payday.`;
  return `No flexible expenses recorded yet. Your current TRUE Safe-to-Spend is ${money(p.safeToSpend)}.`;
}
function resetExpenseForm(){if(!$('expenseForm'))return;$('expenseId').value='';$('expenseName').value='';$('expenseAmount').value='';$('expenseCategory').value='other';$('expenseDate').value=iso(new Date());$('expenseNote').value='';$('saveExpense').textContent='SAVE EXPENSE';$('cancelExpenseEdit').hidden=true}
function renderExpenseManager(c){
  const host=$('expenseList');if(!host)return;
  const list=c.currentExpenses||currentCycleExpenses(),spent=list.reduce((s,x)=>s+x.amount,0),start=c.safeBeforeExpenses||0,remaining=c.safeToSpend||0;
  if($('expenseCycleLabel'))$('expenseCycleLabel').textContent=`${(c.expenseCycleStart||dateAtNoon(data.payDate)||new Date()).toLocaleDateString('en-US',{month:'short',day:'numeric'})} – ${(c.expenseCycleEnd||c.nextPay).toLocaleDateString('en-US',{month:'short',day:'numeric'})}`;
  if($('expenseStarting'))$('expenseStarting').textContent=money(start);
  if($('expenseSpent'))$('expenseSpent').textContent=money(spent);
  if($('expenseRemaining'))$('expenseRemaining').textContent=money(remaining);
  if($('expenseDexxStatus'))$('expenseDexxStatus').textContent=spendingStatus(c);
  const pct=start>0?Math.min(100,Math.round(spent/start*100)):0;
  if($('expenseMeter'))$('expenseMeter').style.width=`${pct}%`;
  if($('expenseMeterText'))$('expenseMeterText').textContent=start?`${pct}% used · ${money(remaining)} remaining`:'Build a payday plan to start tracking';
  host.replaceChildren();
  if(!list.length){host.innerHTML='<div class="empty-copy">No expenses recorded for this paycheck cycle yet.</div>';return}
  list.forEach(x=>{
    const row=document.createElement('article');row.className='expense-row';
    row.innerHTML=`<div class="expense-row-main"><div><strong>${x.name}</strong><span>${expenseCategoryLabel(x.category)} · ${dateAtNoon(x.date)?.toLocaleDateString('en-US',{month:'short',day:'numeric'})||x.date}${x.note?` · ${x.note}`:''}</span></div><b>${money(x.amount)}</b></div><div class="expense-row-actions"><button type="button" data-edit-expense="${x.id}">Edit</button><button type="button" class="danger-link" data-delete-expense="${x.id}">Delete</button></div>`;
    host.append(row)
  })
}

function savingsGoalDefinitions(){return (Array.isArray(data.savingsGoals)?data.savingsGoals:[]).filter(g=>g.name||Number(g.target)||Number(g.saved)).map((g,i)=>({id:g.id||`goal-${i}`,name:g.name||'Savings goal',target:Math.max(0,Number(g.target)||0),saved:Math.max(0,Number(g.saved)||0),priority:g.priority||'medium',targetDate:g.targetDate||'',category:g.category||'general'}))}
function totalGoalSavings(){return savingsGoalDefinitions().reduce((s,g)=>s+g.saved,0)}
function goalRemaining(g){return Math.max(0,Number(g.target||0)-Number(g.saved||0))}
function savingsPriorityScore(p){return({high:0,medium:1,low:2})[p]??1}
function orderedSavingsGoals(){
  const active=savingsGoalDefinitions().filter(g=>goalRemaining(g)>0.004);
  const strategy=data.savingsStrategy||'priority';
  if(strategy==='deadline')return [...active].sort((a,b)=>{
    const ad=a.targetDate?dateAtNoon(a.targetDate).getTime():Infinity,bd=b.targetDate?dateAtNoon(b.targetDate).getTime():Infinity;
    return ad-bd||savingsPriorityScore(a.priority)-savingsPriorityScore(b.priority)||goalRemaining(a)-goalRemaining(b)
  });
  if(strategy==='quick-win')return [...active].sort((a,b)=>goalRemaining(a)-goalRemaining(b)||savingsPriorityScore(a.priority)-savingsPriorityScore(b.priority));
  return [...active].sort((a,b)=>savingsPriorityScore(a.priority)-savingsPriorityScore(b.priority)||((a.targetDate?dateAtNoon(a.targetDate).getTime():Infinity)-(b.targetDate?dateAtNoon(b.targetDate).getTime():Infinity))||goalRemaining(a)-goalRemaining(b))
}
function savingsTarget(){return orderedSavingsGoals()[0]||null}
function plannedSavingsAllocations(amount){
  let remaining=Math.max(0,Number(amount)||0);const out=[];
  for(const g of orderedSavingsGoals()){
    if(remaining<=0.004)break;
    const contribution=Math.min(goalRemaining(g),remaining);
    if(contribution>0.004){out.push({goalId:g.id,name:g.name,amount:Math.round(contribution*100)/100,before:g.saved,after:Math.round((g.saved+contribution)*100)/100});remaining-=contribution}
  }
  return out
}
function applySavingsContributions(amount){
  const allocations=plannedSavingsAllocations(amount);
  allocations.forEach(a=>{const g=data.savingsGoals.find(x=>x.id===a.goalId);if(g)g.saved=Math.min(Number(g.target)||Infinity,Math.round((Number(g.saved||0)+a.amount)*100)/100)});
  return allocations
}
function rollbackSavingsContributions(snapshot){
  if(!snapshot?.savingsContributions?.length)return;
  snapshot.savingsContributions.forEach(c=>{const g=data.savingsGoals.find(x=>x.id===c.goalId);if(g)g.saved=Math.max(0,Math.round((Number(g.saved||0)-Number(c.amount||0))*100)/100)})
}
function savingsStrategyLabel(){return({priority:'Priority first',deadline:'Nearest deadline first','quick-win':'Quick win · closest goal first'})[data.savingsStrategy||'priority']}

function debtDefinitions(){return (Array.isArray(data.debts)?data.debts:[]).filter(d=>d.name||Number(d.balance)).map((d,i)=>({id:d.id||`debt-${i}`,name:d.name||'Debt',balance:Math.max(0,Number(d.balance)||0),minimumPayment:Math.max(0,Number(d.minimumPayment)||0),dueDate:d.dueDate||'',apr:Math.max(0,Number(d.apr)||0),accountType:d.accountType||'credit-card'}))}
function totalDebtBalance(){const managed=debtDefinitions().reduce((s,d)=>s+d.balance,0);return managed>0?managed:clamp(data.debtAmount,0,1e9)}
function debtTarget(){
  const debts=debtDefinitions().filter(d=>d.balance>0);
  if(!debts.length)return null;
  const strategy=data.debtStrategy||'balanced';
  if(strategy==='snowball')return [...debts].sort((a,b)=>a.balance-b.balance||b.apr-a.apr)[0];
  if(strategy==='avalanche')return [...debts].sort((a,b)=>b.apr-a.apr||a.balance-b.balance)[0];
  // Balanced: attack very high APR first; otherwise take the quick-win smallest balance.
  const high=[...debts].sort((a,b)=>b.apr-a.apr)[0];
  if(high&&high.apr>=20)return high;
  return [...debts].sort((a,b)=>a.balance-b.balance||b.apr-a.apr)[0];
}
function debtStrategyLabel(){return({snowball:'Snowball · smallest balance first',avalanche:'Avalanche · highest APR first',balanced:'Balanced · high APR + quick wins'})[data.debtStrategy||'balanced']}

function monthDate(year,month,day){const last=new Date(year,month+1,0,12).getDate();return new Date(year,month,Math.min(day,last),12)}
function billOccurrences(startDate,endDate){const start=new Date(startDate);start.setHours(12,0,0,0);const end=new Date(endDate);end.setHours(12,0,0,0);const out=[];for(const b of billDefinitions()){const base=dateAtNoon(b.dueDate);if(!base)continue;const paid=new Set(b.paidOccurrences||[]);const add=d=>{if(d>end)return;const key=iso(d);out.push({...b,parentId:b.id,occurrenceDate:key,date:key,paid:paid.has(key)})};if(b.frequency==='once'){if(base<=end)add(base);continue}if(b.frequency==='monthly'){const scanStart=new Date(start.getFullYear(),start.getMonth(),1,12);for(let cursor=new Date(scanStart);cursor<=end;cursor=new Date(cursor.getFullYear(),cursor.getMonth()+1,1,12)){const d=monthDate(cursor.getFullYear(),cursor.getMonth(),base.getDate());if(d>=base&&d<=end)add(d)}continue}const step=b.frequency==='biweekly'?14:7;let d=new Date(base);while(d<start)d=new Date(d.getTime()+step*86400000);const prior=new Date(d.getTime()-step*86400000);if(prior>=base&&prior<start&&prior>=new Date(start.getTime()-step*86400000))add(prior);for(;d<=end;d=new Date(d.getTime()+step*86400000))add(new Date(d))}return out.sort((a,b)=>(priorityRank[a.priority]-priorityRank[b.priority])||a.date.localeCompare(b.date))}
function normalizedBills(){const today=dateAtNoon(data.payDate)||new Date();today.setHours(12,0,0,0);const horizon=new Date(today.getTime()+45*86400000);return billOccurrences(today,horizon)}

function reserveKey(b){return `${b.parentId||b.id}|${b.occurrenceDate||b.date}`}
function protectedFor(b){const key=reserveKey(b);return Math.min(Number(b.amount||0),Math.max(0,Number(data.reserveMemory?.[key]||0)))}
function clearReserveForBill(billId){if(!data.reserveMemory||!billId)return;Object.keys(data.reserveMemory).forEach(k=>{if(k.startsWith(`${billId}|`))delete data.reserveMemory[k]})}
function rollbackReserveContributions(snapshot){
  if(snapshot?.reserveContributions?.length){
    data.reserveMemory=data.reserveMemory&&typeof data.reserveMemory==='object'?data.reserveMemory:{};
    snapshot.reserveContributions.forEach(c=>{
      const next=Math.max(0,Number(data.reserveMemory[c.key]||0)-Number(c.amount||0));
      if(next>0.004)data.reserveMemory[c.key]=Math.round(next*100)/100;else delete data.reserveMemory[c.key];
    });
  }
  rollbackSavingsContributions(snapshot);
}
function applyReserveContributions(plan){
  data.reserveMemory=data.reserveMemory&&typeof data.reserveMemory==='object'?data.reserveMemory:{};
  let remaining=Number(plan.reserve||0);
  const out=[];
  for(const b of plan.upcomingBills){
    if(remaining<=0.004)break;
    const amount=Math.min(Number(b.currentCheckReserve||0),remaining,Math.max(0,Number(b.amount||0)-protectedFor(b)));
    if(amount<=0.004)continue;
    const key=reserveKey(b),before=protectedFor(b),after=Math.min(Number(b.amount||0),before+amount);
    data.reserveMemory[key]=Math.round(after*100)/100;
    out.push({key,parentId:b.parentId||b.id,name:b.name,date:b.date,amount:Math.round(amount*100)/100,protectedBefore:before,protectedAfter:after});
    remaining-=amount;
  }
  return out;
}

function paydaysThrough(dueDate,today,nextPay,freqDays){
  const due=dateAtNoon(dueDate);if(!due||due<=today)return 1;
  let count=1; // this paycheck
  let cursor=new Date(nextPay);
  let guard=0;
  while(cursor<=due&&guard<60){count+=1;cursor=new Date(cursor.getTime()+freqDays*86400000);guard+=1}
  return Math.max(1,count)
}
function reserveTargets(upcomingBills,today,nextPay,freqDays){
  return upcomingBills.map(b=>{
    const checks=paydaysThrough(b.date,today,nextPay,freqDays);
    const alreadyProtected=protectedFor(b);
    const remainingToFund=Math.max(0,Number(b.amount||0)-alreadyProtected);
    const target=Math.round((remainingToFund/checks)*100)/100;
    return {...b,paychecksRemaining:checks,alreadyProtected,remainingToFund,currentCheckReserve:target,reserveKey:reserveKey(b)};
  }).filter(b=>b.remainingToFund>0.004)
}
function paycheckPlan(){
  const paycheck=clamp(data.paycheck,0,1e9), balance=clamp(data.currentBalance,0,1e9), available=paycheck+balance;
  const today=dateAtNoon(data.payDate)||new Date();today.setHours(12,0,0,0);
  const freqDays=data.profile?.payFrequency==='biweekly'?14:data.profile?.payFrequency==='monthly'?30:7;
  const nextPay=dateAtNoon(data.nextPayday)||new Date(today.getTime()+freqDays*86400000);
  const reserveDays=clamp(data.profile?.reserveDays||14,7,31);
  const reserveEnd=new Date(nextPay.getTime()+reserveDays*86400000);
  // 4.0.6: Dexx plans across several future paychecks, not only the short reserve window.
  // Weekly users see at least four paychecks ahead; biweekly/monthly horizons scale with cadence.
  const intelligenceDays=Math.min(90,Math.max(reserveDays,freqDays*4));
  const planningEnd=new Date(nextPay.getTime()+intelligenceDays*86400000);
  const windowStart=new Date(today);windowStart.setDate(windowStart.getDate()-14);
  const unpaid=billOccurrences(windowStart,planningEnd).filter(b=>!b.paid).sort((a,b)=>(priorityRank[a.priority]-priorityRank[b.priority])||a.date.localeCompare(b.date));
  const dueNowBills=unpaid.filter(b=>dateAtNoon(b.date)<=nextPay).map(b=>({...b,alreadyProtected:protectedFor(b),currentCheckDue:Math.max(0,Number(b.amount||0)-protectedFor(b))}));
  const upcomingRaw=unpaid.filter(b=>dateAtNoon(b.date)>nextPay&&dateAtNoon(b.date)<=planningEnd);
  const upcomingBills=reserveTargets(upcomingRaw,today,nextPay,freqDays);
  const laterBills=upcomingBills.filter(b=>dateAtNoon(b.date)>reserveEnd);

  const dueNow=dueNowBills.reduce((s,b)=>s+Number((b.currentCheckDue ?? b.amount) || 0),0);
  const upcomingTotal=upcomingBills.reduce((s,b)=>s+Number(b.amount||0),0);
  const reserveTarget=upcomingBills.reduce((s,b)=>s+Number(b.currentCheckReserve||0),0);
  const desiredSavings=Math.max(clamp(data.saveAmount,0,1e9),paycheck*clamp(data.savingsRate,0,100)/100);
  const savingsGoalTarget=savingsTarget(),managedDebtTotal=totalDebtBalance(),targetDebt=debtTarget();const desiredDebt=Math.min(clamp(data.debtGoal,0,1e9),managedDebtTotal);

  // Priority order: immediate bills -> future-bill reserve -> savings -> extra debt -> safe spending.
  let remaining=available;
  const payNow=Math.min(remaining,dueNow);remaining-=payNow;
  const reserve=Math.min(remaining,reserveTarget);remaining-=reserve;
  const recommendedSavings=Math.min(remaining,desiredSavings);
  const chosenSavings=data.customSavings===null?recommendedSavings:Math.min(clamp(data.customSavings,0,1e9),remaining);
  remaining-=chosenSavings;
  const recommendedDebt=Math.min(remaining,desiredDebt);
  const chosenDebt=data.customDebt===null?recommendedDebt:Math.min(clamp(data.customDebt,0,1e9),remaining);
  remaining-=chosenDebt;
  const expenseCycleStart=dateAtNoon(data.payDate)||today,expenseCycleEnd=dateAtNoon(data.nextPayday)||nextPay;
  const safeBeforeExpenses=Math.max(0,remaining),currentExpenses=expensesForCycle(expenseCycleStart,expenseCycleEnd),expenseTotal=currentExpenses.reduce((s,x)=>s+Number(x.amount||0),0),safeToSpend=Math.max(0,safeBeforeExpenses-expenseTotal),overspent=Math.max(0,expenseTotal-safeBeforeExpenses);
  const rememberedReserve=[...dueNowBills,...upcomingBills].reduce((s,b)=>s+Number(b.alreadyProtected||0),0);return {paycheck,balance,available,today,nextPay,reserveEnd,planningEnd,dueNowBills,upcomingBills,laterBills,dueNow,upcomingTotal,reserveTarget,rememberedReserve,desiredSavings,savingsGoalTarget,desiredDebt,targetDebt,managedDebtTotal,payNow,reserve,savings:chosenSavings,debtPayment:chosenDebt,expenseCycleStart,expenseCycleEnd,safeBeforeExpenses,currentExpenses,expenseTotal,overspent,safeToSpend,shortfall:Math.max(0,dueNow-payNow),reserveShortfall:Math.max(0,reserveTarget-reserve)};
}
function calc(){const p=paycheckPlan(),bills=[...p.dueNowBills,...p.upcomingBills],billTotal=bills.filter(b=>!b.paid).reduce((s,b)=>s+Number(b.amount||0),0);let score=35;if(p.paycheck>0)score+=15;if(bills.length)score+=10;if(p.savings>0)score+=15;if(p.shortfall===0&&p.paycheck>0)score+=15;if(p.reserveShortfall===0&&p.upcomingBills.length)score+=5;if(data.approvedPlan)score+=5;const missionDone=Object.values(data.missions).filter(Boolean).length;return {...p,bills,billTotal,cash:p.safeToSpend,score:Math.min(score,100),progress:Math.round(missionDone/4*100),missionDone}}
function save(){data.lastUpdated=new Date().toISOString();localStorage.setItem(STORAGE_KEY,JSON.stringify(data));render()}
function billRows(host,bills){if(!host)return;host.replaceChildren();if(!bills.length){host.innerHTML='<div class="empty-copy">No bills in this payday window. Manage recurring bills in Financial Profile.</div>';return}bills.forEach(b=>{const row=document.createElement('div');row.className=`bill-row${b.paid?' paid':''}`;const btn=document.createElement('button');btn.className='check';btn.textContent=b.paid?'✓':'';btn.setAttribute('aria-label',b.paid?'Mark unpaid':'Mark paid');btn.onclick=()=>{const real=data.bills.find(x=>x.id===(b.parentId||b.id));if(real){real.paidOccurrences=Array.isArray(real.paidOccurrences)?real.paidOccurrences:[];const key=b.occurrenceDate||b.date,isPaid=real.paidOccurrences.includes(key);real.paidOccurrences=isPaid?real.paidOccurrences.filter(x=>x!==key):[...real.paidOccurrences,key];if(!isPaid&&data.reserveMemory)delete data.reserveMemory[reserveKey(b)];data.approvedPlan=null;save()}};const name=document.createElement('span');const held=Number(b.alreadyProtected||protectedFor(b));name.innerHTML=`${b.name||'Bill'} <em class="priority ${b.priority}">${b.priority}</em>${b.autopay?' <em class="autopay">auto</em>':''}${held>0?` <em class="reserve-held">${money(held)} reserved</em>`:''}`;const amt=document.createElement('strong');amt.textContent=money(b.amount);const date=document.createElement('small');date.textContent=b.paid?'Paid':b.date?dateAtNoon(b.date).toLocaleDateString('en-US',{month:'short',day:'numeric'}):'TBD';row.append(btn,name,amt,date);host.append(row)})}
function prepareRows(host,bills){
  if(!host)return;host.replaceChildren();
  if(!bills.length){host.innerHTML='<div class="empty-copy">No farther-out bills need a reserve yet.</div>';return}
  bills.forEach(b=>{
    const row=document.createElement('div');row.className='prepare-row';
    const due=dateAtNoon(b.date),held=Number(b.alreadyProtected||0),left=Math.max(0,Number(b.amount||0)-held);
    row.innerHTML=`<div><strong>${b.name}</strong><small>${money(b.amount)} due ${due?due.toLocaleDateString('en-US',{month:'short',day:'numeric'}):'soon'} · ${money(held)} already protected · ${money(left)} left · ${b.paychecksRemaining} paycheck${b.paychecksRemaining===1?'':'s'} including this one</small></div><div class="prepare-amount"><span>Protect this check</span><b>${money(b.currentCheckReserve)}</b></div>`;
    host.append(row);
  });
}
function allocationRows(p){const host=$('allocationList');if(!host)return;host.replaceChildren();[['Bills due before next payday',p.payNow,p.shortfall?`${money(p.shortfall)} still unfunded`:`${p.dueNowBills.length} covered`],['Bills reserve — this check',p.reserve,p.reserveShortfall?`${money(p.reserveShortfall)} still needed`:`${p.upcomingBills.length} future bill${p.upcomingBills.length===1?'':'s'} protected`],['Move to savings',p.savings,`Target: ${money(p.desiredSavings)}${p.savingsGoalTarget?` · ${p.savingsGoalTarget.name}`:''}`],['Extra debt payment',p.debtPayment,p.desiredDebt?`Goal: ${money(p.desiredDebt)}${p.targetDebt?` · Target ${p.targetDebt.name}`:''}`:'Optional after priorities'],['Spent this cycle',p.expenseTotal,`${p.currentExpenses.length} expense${p.currentExpenses.length===1?'':'s'} recorded`],['TRUE safe to spend',p.safeToSpend,`Through ${p.nextPay.toLocaleDateString('en-US',{month:'short',day:'numeric'})}`]].forEach(([label,amount,note])=>{const row=document.createElement('div');row.className='allocation-row';row.innerHTML=`<div><strong>${label}</strong><small>${note}</small></div><b>${money(amount)}</b>`;host.append(row)})}
function reserveExplanation(p){
  if(!p.upcomingBills.length)return'';
  return p.upcomingBills.slice(0,4).map(b=>{
    const due=dateAtNoon(b.date)?.toLocaleDateString('en-US',{month:'short',day:'numeric'})||'soon';
    const memory=b.alreadyProtected>0?`${money(b.alreadyProtected)} is already protected. `:'';
    return `${b.name}: ${memory}protect ${money(b.currentCheckReserve)} from this check toward ${money(b.amount)} due ${due} (${b.paychecksRemaining} paycheck${b.paychecksRemaining===1?'':'s'} including this one).`;
  }).join(' ')
}
function recommendation(p){
  if(!p.paycheck)return'Enter your check, next payday, and bills. I’ll prioritize the money automatically.';
  if(p.shortfall>0){const essentials=p.dueNowBills.filter(b=>b.priority==='essential').map(b=>b.name).slice(0,3).join(', ');return`This payday is ${money(p.shortfall)} short before future reserves. Protect ${essentials||'housing, utilities, transportation, and insurance'} first. Pause savings and extra debt payments if needed, reduce flexible spending to $0.00, and contact lower-priority billers before the due date.`}
  const why=reserveExplanation(p);
  if(p.reserveShortfall>0)return`Your immediate bills are covered, but this check cannot fully fund the ${money(p.reserveTarget)} future-bill reserve I recommend. Protect ${money(p.reserve)} now and keep flexible spending at ${money(p.safeToSpend)}. ${why} Savings and extra debt should stay behind this reserve until the gap is covered.`;
  if(p.upcomingBills.length)return`Your immediate bills are covered. I recommend protecting ${money(p.reserve)} from this check for future bills before treating the rest as available. ${why} Then move ${money(p.savings)} to ${p.savingsGoalTarget?.name||'savings'}${p.debtPayment?`, send ${money(p.debtPayment)} to ${p.targetDebt?.name||'debt'}`:''}. You have already recorded ${money(p.expenseTotal)} in flexible expenses this cycle. Your TRUE safe-to-spend amount is ${money(p.safeToSpend)}.`;
  return`Pay ${money(p.payNow)} now. No future-bill reserve is needed inside your current look-ahead window, so move ${money(p.savings)} to ${p.savingsGoalTarget?.name||'savings'}${p.debtPayment?`, send ${money(p.debtPayment)} to ${p.targetDebt?.name||'debt'}`:''}, and keep flexible spending at or below ${money(p.safeToSpend)} until payday.`
}
function experiment(p){if(!p.paycheck)return{title:'Build your first payday plan',text:'Add a paycheck and approve Dexx’s recommendation.',progress:0};if(!data.approvedPlan)return{title:'Approve the experiment',text:`Review the plan and protect ${money(p.savings)} for savings.`,progress:35};const target=Math.max(20,Math.min(p.safeToSpend*.2,75));return{title:`No-spend boost: save an extra ${money(target)}`,text:`Stay under ${money(p.safeToSpend)} in flexible spending and review your bills by Wednesday.`,progress:data.missions.spending&&data.missions.bills?100:data.missions.spending||data.missions.bills?70:50}}

function confidence(p){let level='LOW',pct=25,text='Complete your profile and enter a paycheck.';if(p.paycheck&&p.shortfall===0){level='MEDIUM';pct=65;text='Immediate bills are covered, but review reserves and savings.'}if(p.paycheck&&p.shortfall===0&&p.reserveShortfall===0&&p.savings>0){level='HIGH';pct=100;text='Bills, upcoming reserves and savings are protected.'}return{level,pct,text}}
function renderTimeline(c){const host=$('financialTimeline');if(!host)return;host.replaceChildren();const events=[];if(c.paycheck)events.push({date:c.today,label:'Paycheck received',amount:c.paycheck,type:'income'});if(c.savings)events.push({date:c.today,label:'Move to savings',amount:-c.savings,type:'saving'});c.currentExpenses.forEach(x=>events.push({date:dateAtNoon(x.date)||c.today,label:x.name,amount:-x.amount,type:'expense'}));c.dueNowBills.forEach(b=>events.push({date:dateAtNoon(b.date)||c.today,label:b.name,amount:-Number(b.amount||0),type:'bill'}));c.upcomingBills.forEach(b=>events.push({date:dateAtNoon(b.date),label:`Protect for ${b.name}`,amount:-Number(b.currentCheckReserve||0),type:'reserve'}));events.push({date:c.nextPay,label:'Next payday',amount:0,type:'payday'});events.sort((a,b)=>a.date-b.date).slice(0,8).forEach(e=>{const row=document.createElement('div');row.className='timeline-row';row.innerHTML=`<div><strong>${e.date.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})}</strong><span>${e.label}</span></div><b>${e.amount?money(e.amount):'Coming up'}</b>`;host.append(row)});if(!events.length)host.innerHTML='<div class="empty-copy">Add your paycheck and bills to build the week ahead.</div>'}
function renderProfile(){const p=data.profile||DEFAULTS.profile;const map={profileName:data.researcherName||'Rob',payFrequency:p.payFrequency,paydayDay:String(p.paydayDay??5),incomePattern:p.incomePattern,recurringBillCount:p.recurringBillCount,financialStrategy:p.financialStrategy,profileSavingsRate:data.savingsRate||10,reserveDays:String(p.reserveDays||14)};Object.entries(map).forEach(([id,v])=>{if($(id))$(id).value=v});const fields=[data.researcherName,p.payFrequency,p.incomePattern,p.recurringBillCount,p.financialStrategy,data.savingsRate,p.reserveDays],pct=Math.round(fields.filter(v=>v!==''&&v!==null&&v!==undefined).length/fields.length*100);if($('profileCompletion'))$('profileCompletion').textContent=`${pct}% complete`;if($('profileReady'))$('profileReady').textContent=pct===100?'Ready for Payday Mode':'Needs setup';if($('profileSummary'))$('profileSummary').innerHTML=`<div><span>PAY SCHEDULE</span><strong>${p.payFrequency||'weekly'}</strong></div><div><span>CHECK AMOUNT</span><strong>${p.incomePattern==='variable'?'Variable':'Steady'}</strong></div><div><span>BILLS SAVED</span><strong>${billDefinitions().length} saved</strong></div><div><span>STRATEGY</span><strong>${p.financialStrategy||'balanced'}</strong></div>`;renderBillManager()}
function resetBillManagerForm(){if(!$('billManagerForm'))return;$('managerBillId').value='';$('managerBillName').value='';$('managerBillAmount').value='';$('managerBillDate').value='';$('managerBillFrequency').value='monthly';$('managerBillPriority').value='essential';$('managerBillAutopay').checked=false;$('saveManagedBill').textContent='SAVE RECURRING BILL';$('cancelBillEdit').hidden=true}
function renderBillManager(){const host=$('managedBills');if(!host)return;const defs=billDefinitions(),estimate=Number(data.profile?.recurringBillCount)||0;if($('billManagerProgress'))$('billManagerProgress').textContent=`${defs.length} bill${defs.length===1?'':'s'} saved`;if($('billManagerEstimate'))$('billManagerEstimate').textContent=estimate?`Profile estimate: ${estimate} recurring bill${estimate===1?'':'s'}. This is a planning estimate, not a limit.`:'Add as many recurring bills as you need. There is no bill limit.';host.replaceChildren();if(!defs.length){host.innerHTML='<div class="empty-copy">No recurring bills saved yet. Add your first bill above.</div>';return}defs.sort((a,b)=>(a.dueDate||'9999').localeCompare(b.dueDate||'9999')).forEach(b=>{const card=document.createElement('article');card.className='managed-bill';const freq={monthly:'Monthly',weekly:'Weekly',biweekly:'Every 2 weeks',once:'One time'}[b.frequency]||b.frequency;card.innerHTML=`<div class="managed-bill-main"><div><strong>${b.name}</strong><span>${freq} · ${b.priority}${b.autopay?' · Autopay':''}</span></div><b>${money(b.amount)}</b></div><div class="managed-bill-meta"><span>Next due ${b.dueDate?dateAtNoon(b.dueDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}):'TBD'}</span><div><button type="button" data-edit-bill="${b.id}">Edit</button><button type="button" class="danger-link" data-delete-bill="${b.id}">Delete</button></div></div>`;host.append(card)})}

function resetDebtManagerForm(){if(!$('debtManagerForm'))return;$('managerDebtId').value='';$('managerDebtName').value='';$('managerDebtBalance').value='';$('managerDebtMinimum').value='';$('managerDebtDate').value='';$('managerDebtApr').value='';$('managerDebtType').value='credit-card';$('saveManagedDebt').textContent='SAVE DEBT ACCOUNT';$('cancelDebtEdit').hidden=true}

function resetSavingsGoalForm(){if(!$('savingsGoalForm'))return;$('savingsGoalId').value='';$('savingsGoalName').value='';$('savingsGoalTarget').value='';$('savingsGoalSaved').value='';$('savingsGoalDate').value='';$('savingsGoalPriority').value='medium';$('savingsGoalCategory').value='general';$('saveSavingsGoal').textContent='SAVE SAVINGS GOAL';$('cancelSavingsEdit').hidden=true}
function renderSavingsManager(){
  const host=$('savingsGoalsList');if(!host)return;
  const goals=savingsGoalDefinitions(),target=savingsTarget(),totalSaved=totalGoalSavings(),totalTargets=goals.reduce((s,g)=>s+g.target,0);
  if($('savingsGoalCount'))$('savingsGoalCount').textContent=`${goals.length} goal${goals.length===1?'':'s'} saved`;
  if($('savingsSavedTotal'))$('savingsSavedTotal').textContent=money(totalSaved);
  if($('savingsTargetTotal'))$('savingsTargetTotal').textContent=money(totalTargets);
  if($('savingsDexxTarget'))$('savingsDexxTarget').textContent=target?target.name:'Add a goal';
  if($('savingsStrategy'))$('savingsStrategy').value=data.savingsStrategy||'priority';
  if($('savingsStrategyCopy'))$('savingsStrategyCopy').textContent=savingsStrategyLabel();
  host.replaceChildren();
  if(!goals.length){host.innerHTML='<div class="empty-copy">No savings goals saved yet. Add your first goal above.</div>';return}
  goals.sort((a,b)=>savingsPriorityScore(a.priority)-savingsPriorityScore(b.priority)||goalRemaining(a)-goalRemaining(b)).forEach(g=>{
    const card=document.createElement('article');card.className='savings-goal-card';
    const pct=g.target?Math.min(100,Math.round(g.saved/g.target*100)):0;
    const due=g.targetDate?dateAtNoon(g.targetDate).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}):'No deadline';
    card.innerHTML=`${target&&target.id===g.id?'<div class="dexx-savings-target">DEXX SAVINGS TARGET</div>':''}<div class="goal-card-head"><div><strong>${g.name}</strong><span>${g.category.replace('-',' ')} · ${g.priority} priority</span></div><b>${money(g.saved)} <small>/ ${money(g.target)}</small></b></div><div class="goal-progress"><i style="width:${pct}%"></i></div><div class="goal-meta"><span>${pct}% funded · ${money(goalRemaining(g))} left · ${due}</span><div><button type="button" data-add-saving="${g.id}">Add money</button><button type="button" data-withdraw-saving="${g.id}">Withdraw</button><button type="button" data-edit-saving="${g.id}">Edit</button><button type="button" class="danger-link" data-delete-saving="${g.id}">Delete</button></div></div>`;
    host.append(card)
  });
}

function renderDebtManager(){
  const host=$('managedDebts');if(!host)return;
  const debts=debtDefinitions(),total=debts.reduce((s,d)=>s+d.balance,0),mins=debts.reduce((s,d)=>s+d.minimumPayment,0),target=debtTarget();
  if($('debtManagerCount'))$('debtManagerCount').textContent=`${debts.length} account${debts.length===1?'':'s'} saved`;
  if($('debtTotalManaged'))$('debtTotalManaged').textContent=money(total);
  if($('debtMinimumTotal'))$('debtMinimumTotal').textContent=money(mins);
  if($('debtTargetName'))$('debtTargetName').textContent=target?target.name:'Add an account';
  if($('debtStrategy'))$('debtStrategy').value=data.debtStrategy||'balanced';
  if($('debtStrategyCopy'))$('debtStrategyCopy').textContent=debtStrategyLabel();
  host.replaceChildren();
  if(!debts.length){host.innerHTML='<div class="empty-copy">No debt accounts saved yet. Add your first account above.</div>';return}
  debts.sort((a,b)=>a.balance-b.balance).forEach(d=>{
    const card=document.createElement('article');card.className='managed-debt';
    const due=d.dueDate?dateAtNoon(d.dueDate).toLocaleDateString('en-US',{month:'short',day:'numeric'}):'TBD';
    card.innerHTML=`<div class="debt-card-head"><div><strong>${d.name}</strong><span>${({'credit-card':'Credit card',loan:'Loan',medical:'Medical',other:'Other'})[d.accountType]||'Debt'} · ${d.apr.toFixed(2)}% APR</span></div><b>${money(d.balance)}</b></div><div class="debt-card-meta"><span>Minimum ${money(d.minimumPayment)} · Due ${due}</span><div><button type="button" data-pay-debt="${d.id}">Record payment</button><button type="button" data-edit-debt="${d.id}">Edit</button><button type="button" class="danger-link" data-delete-debt="${d.id}">Delete</button></div></div>`;
    if(target&&target.id===d.id){const badge=document.createElement('div');badge.className='dexx-target';badge.textContent='DEXX EXTRA-PAYMENT TARGET';card.prepend(badge)}
    host.append(card)
  });
}

function renderHistory(){const host=$('planHistory');if(!host)return;host.replaceChildren();const list=[...data.paycheckHistory].reverse().slice(0,6);if(!list.length){host.innerHTML='<div class="empty-copy">Approved plans will appear here.</div>';return}list.forEach(h=>{const row=document.createElement('article');row.className='history-row';row.innerHTML=`<div><strong>${money(h.paycheck)} payday</strong><small>${new Date(h.approvedAt).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})}</small></div><span>Saved ${money(h.savings)}${h.savingsContributions?.[0]?.name?` to ${h.savingsContributions[0].name}`:''} · Spend ${money(h.safeToSpend)}</span>`;host.append(row)})}
function render(){const c=calc(),hour=new Date().getHours();$('greeting').textContent=`GOOD ${hour<12?'MORNING':hour<17?'AFTERNOON':'EVENING'}, ${(data.researcherName||'ROB').toUpperCase()} 👋`;$('healthScore').textContent=c.score;$('scoreRing').style.setProperty('--score',c.score);$('healthMessage').textContent=c.score>=80?'Your payday plan is fully protected.':c.score>=60?'Your plan is gaining strength.':'Complete Payday Mode to improve your score.';$('cashAvailable').textContent=money(c.safeToSpend);$('billsWeek').textContent=money(c.payNow);$('savingsTotal').textContent=money(savingsGoalDefinitions().length?totalGoalSavings():c.savings);$('debtRemaining').textContent=money(totalDebtBalance());$('missionCount').textContent=`${c.missionDone} / 4`;$('progressText').textContent=`${c.progress}%`;$('progressBar').style.width=`${c.progress}%`;$('dexxObservation').textContent=recommendation(c);const conf=confidence(c);if($('confidenceLabel'))$('confidenceLabel').textContent=conf.level;if($('confidenceText'))$('confidenceText').textContent=conf.text;if($('confidenceBar'))$('confidenceBar').style.width=`${conf.pct}%`;renderTimeline(c);renderProfile();renderDebtManager();renderSavingsManager();renderExpenseManager(c);if(debtDefinitions().length&&$('debtAmount')){$('debtAmount').value=totalDebtBalance();$('debtAmount').readOnly=true;$('debtAmount').title='Managed automatically from Credit Lab';}else if($('debtAmount')){$('debtAmount').readOnly=false;}document.querySelectorAll('[data-mission]').forEach(x=>x.checked=!!data.missions[x.dataset.mission]);billRows($('billList'),c.bills.filter(b=>!b.paid).slice(0,4));billRows($('allBills'),c.dueNowBills);prepareRows($('prepareBills'),c.upcomingBills);if($('reserveMemorySummary'))$('reserveMemorySummary').innerHTML=`<strong>${money(c.rememberedReserve)}</strong><span>already protected from approved payday plans</span>`;
  ['paycheck','currentBalance','saveAmount','debtAmount','debtGoal','savingsRate'].forEach(id=>{if($(id))$(id).value=data[id]||(id==='savingsRate'?10:'')});if($('payDate'))$('payDate').value=data.payDate||iso(new Date());if($('nextPayday'))$('nextPayday').value=data.nextPayday||'';
  if($('planPayNow')){$('planPayNow').textContent=money(c.payNow);$('planReserve').textContent=money(c.reserve);$('planSavings').textContent=money(c.savings);$('planDebt').textContent=money(c.debtPayment);$('planSpend').textContent=money(c.safeToSpend);$('planStatus').textContent=c.shortfall?'Needs attention':data.approvedPlan?'Approved':c.paycheck?'Plan ready':'Ready';$('dexxPlanText').textContent=recommendation(c);const total=c.available||1;[['allocBills',c.payNow],['allocReserve',c.reserve],['allocSavings',c.savings],['allocDebt',c.debtPayment],['allocSpend',c.safeToSpend]].forEach(([id,val])=>$(id).style.width=`${Math.max(0,val/total*100)}%`);allocationRows(c);$('customSavings').value=data.customSavings??'';$('customDebt').value=data.customDebt??'';const step=!c.paycheck?1:!c.bills.length?2:!data.approvedPlan?4:5;$('workflowStatus').textContent=`Step ${step} of 5`;$('workflowCopy').textContent=step===1?'Enter your check and payday dates.':step===2?'Add and confirm every bill coming before and after payday.':step===4?'Review Dexx’s recommendation and adjust only if needed.':'Plan approved. Track the experiment until next payday.';document.querySelectorAll('.step-track i').forEach((x,i)=>x.classList.toggle('active',i<step));const ex=experiment(c);$('experimentTitle').textContent=ex.title;$('experimentText').textContent=ex.text;$('experimentBar').style.width=`${ex.progress}%`;$('experimentProgress').textContent=`${ex.progress}% complete`;renderHistory()}}
function show(id){document.body.classList.remove('front-door-active');document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.go===id));history.replaceState(null,'','#'+id);scrollTo({top:0,behavior:'smooth'})}
document.addEventListener('click',e=>{const go=e.target.closest('[data-go]');if(document.body.classList.contains('front-door-active'))return;if(go){e.preventDefault();show(go.dataset.go)}const q=e.target.closest('[data-question]');if(q){const c=calc(),answers={score:`Your score is ${c.score}. Cover immediate bills, protect ${money(c.savings)} in savings, and stay within ${money(c.safeToSpend)}.`,spending:`Your safe-to-spend amount is ${money(c.safeToSpend)} through ${c.nextPay.toLocaleDateString('en-US',{month:'short',day:'numeric'})}.`,challenge:experiment(c).text,saving:`I recommend ${money(c.savings)} this payday${c.savingsGoalTarget?` toward ${c.savingsGoalTarget.name}`:''}. Increase it only after immediate and upcoming bills are protected.`};$('dexxReply').textContent=answers[q.dataset.question]}});
document.querySelectorAll('[data-mission]').forEach(x=>x.addEventListener('change',()=>{data.missions[x.dataset.mission]=x.checked;save()}));

$('expenseForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  const id=$('expenseId').value,name=$('expenseName').value.trim(),amount=clamp($('expenseAmount').value,0,1e9),category=$('expenseCategory').value,date=$('expenseDate').value,note=$('expenseNote').value.trim();
  if(!name||amount<=0||!date){$('expenseStatus').textContent='Add the expense name, amount, and date.';return}
  const existing=id?data.expenseRecords.find(x=>x.id===id):null;
  const record={id:id||(crypto.randomUUID?crypto.randomUUID():`expense-${Date.now()}`),name,amount,category,date,note};
  if(existing)Object.assign(existing,record);else data.expenseRecords.push(record);
  save();
  const hasActivePlan=Number(data.paycheck)>0&&!!data.payDate&&!!data.nextPayday;
  $('expenseStatus').textContent=existing
    ?(hasActivePlan?'Expense updated. Dexx recalculated TRUE Safe-to-Spend.':'Expense updated. Build your payday plan so Dexx can calculate its effect on TRUE Safe-to-Spend.')
    :(hasActivePlan?'Expense recorded. Dexx updated your remaining TRUE Safe-to-Spend.':'Expense saved. Build your payday plan so Dexx can calculate how it affects TRUE Safe-to-Spend.');
  resetExpenseForm();
});
$('cancelExpenseEdit')?.addEventListener('click',()=>{resetExpenseForm();$('expenseStatus').textContent='Edit canceled.'});
document.addEventListener('click',e=>{
  const edit=e.target.closest('[data-edit-expense]');
  if(edit){const x=data.expenseRecords.find(v=>v.id===edit.dataset.editExpense);if(!x)return;$('expenseId').value=x.id;$('expenseName').value=x.name;$('expenseAmount').value=x.amount;$('expenseCategory').value=x.category||'other';$('expenseDate').value=x.date;$('expenseNote').value=x.note||'';$('saveExpense').textContent='UPDATE EXPENSE';$('cancelExpenseEdit').hidden=false;$('expenseStatus').textContent=`Editing ${x.name}.`;show('expense')}
  const del=e.target.closest('[data-delete-expense]');
  if(del){const x=data.expenseRecords.find(v=>v.id===del.dataset.deleteExpense);if(x&&confirm(`Delete ${x.name} expense?`)){data.expenseRecords=data.expenseRecords.filter(v=>v.id!==x.id);save();$('expenseStatus').textContent=`${x.name} deleted. TRUE Safe-to-Spend was recalculated.`}}
});

$('budgetForm').addEventListener('submit',e=>{e.preventDefault();data.paycheck=clamp($('paycheck').value,0,1e9);data.currentBalance=clamp($('currentBalance').value,0,1e9);data.payDate=$('payDate').value;data.nextPayday=$('nextPayday').value;data.savingsRate=clamp($('savingsRate').value,0,100);data.saveAmount=clamp($('saveAmount').value,0,1e9);if(!debtDefinitions().length)data.debtAmount=clamp($('debtAmount').value,0,1e9);data.debtGoal=clamp($('debtGoal').value,0,1e9);const name=$('billName').value.trim(),date=$('billDate').value,amount=clamp($('billAmount').value,0,1e9);if(name||date||amount)data.bills.push({id:crypto.randomUUID?crypto.randomUUID():`bill-${Date.now()}`,name:name||'Upcoming bill',dueDate:date,date,amount,priority:$('billPriority').value,frequency:$('billFrequency').value,autopay:$('billAutopay').checked,paidOccurrences:[]});data.customSavings=null;data.customDebt=null;data.approvedPlan=null;data.missions.bills=data.bills.length>0;save();$('billName').value='';$('billDate').value='';$('billAmount').value='';$('billAutopay').checked=false;$('formStatus').textContent='Dexx rebuilt your payday plan. Review it above, then approve the experiment.'});
$('billManagerForm')?.addEventListener('submit',e=>{e.preventDefault();const id=$('managerBillId').value,name=$('managerBillName').value.trim(),amount=clamp($('managerBillAmount').value,0,1e9),dueDate=$('managerBillDate').value;if(!name||!amount||!dueDate){$('billManagerStatus').textContent='Add the bill name, amount, and next due date.';return}const existing=id?data.bills.find(b=>b.id===id):null;const priorDue=existing?.dueDate||existing?.date||'';const record={id:id||(crypto.randomUUID?crypto.randomUUID():`bill-${Date.now()}`),name,amount,dueDate,date:dueDate,priority:$('managerBillPriority').value,frequency:$('managerBillFrequency').value,autopay:$('managerBillAutopay').checked,paidOccurrences:existing?.paidOccurrences||[]};if(existing){if(priorDue&&priorDue!==dueDate)clearReserveForBill(existing.id);Object.assign(existing,record)}else data.bills.push(record);if(!existing&&data.bills.length>Number(data.profile?.recurringBillCount||0)){data.profile=data.profile||structuredClone(DEFAULTS.profile);data.profile.recurringBillCount=data.bills.length}data.missions.bills=data.bills.length>0;data.approvedPlan=null;save();$('billManagerStatus').textContent=existing?'Bill updated. Dexx recalculated your payday plan.':'Bill saved. Dexx will use it automatically every payday.';resetBillManagerForm()});
$('cancelBillEdit')?.addEventListener('click',()=>{resetBillManagerForm();$('billManagerStatus').textContent='Edit canceled.'});
document.addEventListener('click',e=>{const edit=e.target.closest('[data-edit-bill]');if(edit){const b=data.bills.find(x=>x.id===edit.dataset.editBill);if(!b)return;$('managerBillId').value=b.id;$('managerBillName').value=b.name;$('managerBillAmount').value=b.amount;$('managerBillDate').value=b.dueDate||b.date||'';$('managerBillFrequency').value=b.frequency||'monthly';$('managerBillPriority').value=b.priority||'important';$('managerBillAutopay').checked=!!b.autopay;$('saveManagedBill').textContent='UPDATE BILL';$('cancelBillEdit').hidden=false;$('billManagerStatus').textContent=`Editing ${b.name}.`;if(location.hash!=='#profile')show('profile');setTimeout(()=>$('managerBillName').scrollIntoView({behavior:'smooth',block:'center'}),80)}const del=e.target.closest('[data-delete-bill]');if(del){const b=data.bills.find(x=>x.id===del.dataset.deleteBill);if(b&&confirm(`Delete ${b.name}?`)){clearReserveForBill(b.id);data.bills=data.bills.filter(x=>x.id!==b.id);data.approvedPlan=null;data.missions.bills=data.bills.length>0;save();$('billManagerStatus').textContent=`${b.name} deleted.`}}});


$('savingsGoalForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  const id=$('savingsGoalId').value,name=$('savingsGoalName').value.trim(),target=clamp($('savingsGoalTarget').value,0,1e9),saved=clamp($('savingsGoalSaved').value,0,1e9),targetDate=$('savingsGoalDate').value,priority=$('savingsGoalPriority').value,category=$('savingsGoalCategory').value;
  if(!name||target<=0){$('savingsGoalStatus').textContent='Add a goal name and target amount.';return}
  const existing=id?data.savingsGoals.find(g=>g.id===id):null;
  const record={id:id||(crypto.randomUUID?crypto.randomUUID():`goal-${Date.now()}`),name,target,saved:Math.min(saved,target),targetDate,priority,category};
  if(existing)Object.assign(existing,record);else data.savingsGoals.push(record);
  data.approvedPlan=null;save();
  $('savingsGoalStatus').textContent=existing?'Savings goal updated. Dexx recalculated the target.':'Savings goal saved. Dexx can now direct payday savings toward it.';
  resetSavingsGoalForm();
});
$('cancelSavingsEdit')?.addEventListener('click',()=>{resetSavingsGoalForm();$('savingsGoalStatus').textContent='Edit canceled.'});
$('savingsStrategy')?.addEventListener('change',()=>{data.savingsStrategy=$('savingsStrategy').value;data.approvedPlan=null;save();$('savingsGoalStatus').textContent=`Savings strategy updated: ${savingsStrategyLabel()}.`});
document.addEventListener('click',e=>{
  const edit=e.target.closest('[data-edit-saving]');
  if(edit){const g=data.savingsGoals.find(x=>x.id===edit.dataset.editSaving);if(!g)return;$('savingsGoalId').value=g.id;$('savingsGoalName').value=g.name;$('savingsGoalTarget').value=g.target;$('savingsGoalSaved').value=g.saved;$('savingsGoalDate').value=g.targetDate||'';$('savingsGoalPriority').value=g.priority||'medium';$('savingsGoalCategory').value=g.category||'general';$('saveSavingsGoal').textContent='UPDATE SAVINGS GOAL';$('cancelSavingsEdit').hidden=false;$('savingsGoalStatus').textContent=`Editing ${g.name}.`;show('savings');setTimeout(()=>$('savingsGoalName').scrollIntoView({behavior:'smooth',block:'center'}),80)}
  const del=e.target.closest('[data-delete-saving]');
  if(del){const g=data.savingsGoals.find(x=>x.id===del.dataset.deleteSaving);if(g&&confirm(`Delete ${g.name}?`)){data.savingsGoals=data.savingsGoals.filter(x=>x.id!==g.id);data.approvedPlan=null;save();$('savingsGoalStatus').textContent=`${g.name} deleted.`}}
  const add=e.target.closest('[data-add-saving]');
  if(add){const g=data.savingsGoals.find(x=>x.id===add.dataset.addSaving);if(!g)return;const raw=prompt(`Add money to ${g.name}`);const amount=clamp(raw,0,goalRemaining(g));if(!amount)return;g.saved=Math.min(g.target,Math.round((Number(g.saved||0)+amount)*100)/100);save();$('savingsGoalStatus').textContent=`Added ${money(amount)} to ${g.name}.`}
  const withdraw=e.target.closest('[data-withdraw-saving]');
  if(withdraw){const g=data.savingsGoals.find(x=>x.id===withdraw.dataset.withdrawSaving);if(!g)return;const raw=prompt(`Withdraw from ${g.name}`);const amount=clamp(raw,0,g.saved);if(!amount)return;g.saved=Math.max(0,Math.round((Number(g.saved||0)-amount)*100)/100);save();$('savingsGoalStatus').textContent=`Withdrew ${money(amount)} from ${g.name}.`}
});

$('debtManagerForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  const id=$('managerDebtId').value,name=$('managerDebtName').value.trim(),balance=clamp($('managerDebtBalance').value,0,1e9),minimumPayment=clamp($('managerDebtMinimum').value,0,1e9),dueDate=$('managerDebtDate').value,apr=clamp($('managerDebtApr').value,0,100),accountType=$('managerDebtType').value;
  if(!name||balance<=0){$('debtManagerStatus').textContent='Add the account name and current balance.';return}
  const existing=id?data.debts.find(d=>d.id===id):null;
  const record={id:id||(crypto.randomUUID?crypto.randomUUID():`debt-${Date.now()}`),name,balance,minimumPayment,dueDate,apr,accountType};
  if(existing)Object.assign(existing,record);else data.debts.push(record);
  data.debtAmount=debtDefinitions().reduce((s,d)=>s+d.balance,0);data.approvedPlan=null;save();
  $('debtManagerStatus').textContent=existing?'Debt account updated. Dexx recalculated the target.':'Debt account saved. Dexx can now target extra payments intelligently.';
  resetDebtManagerForm();
});
$('cancelDebtEdit')?.addEventListener('click',()=>{resetDebtManagerForm();$('debtManagerStatus').textContent='Edit canceled.'});
$('debtStrategy')?.addEventListener('change',()=>{data.debtStrategy=$('debtStrategy').value;data.approvedPlan=null;save();$('debtManagerStatus').textContent=`Strategy updated: ${debtStrategyLabel()}.`});
document.addEventListener('click',e=>{
  const edit=e.target.closest('[data-edit-debt]');
  if(edit){const d=data.debts.find(x=>x.id===edit.dataset.editDebt);if(!d)return;$('managerDebtId').value=d.id;$('managerDebtName').value=d.name;$('managerDebtBalance').value=d.balance;$('managerDebtMinimum').value=d.minimumPayment;$('managerDebtDate').value=d.dueDate||'';$('managerDebtApr').value=d.apr;$('managerDebtType').value=d.accountType||'credit-card';$('saveManagedDebt').textContent='UPDATE DEBT ACCOUNT';$('cancelDebtEdit').hidden=false;$('debtManagerStatus').textContent=`Editing ${d.name}.`;show('credit');setTimeout(()=>$('managerDebtName').scrollIntoView({behavior:'smooth',block:'center'}),80)}
  const del=e.target.closest('[data-delete-debt]');
  if(del){const d=data.debts.find(x=>x.id===del.dataset.deleteDebt);if(d&&confirm(`Delete ${d.name}?`)){data.debts=data.debts.filter(x=>x.id!==d.id);data.debtAmount=debtDefinitions().reduce((s,x)=>s+x.balance,0);data.approvedPlan=null;save();$('debtManagerStatus').textContent=`${d.name} deleted.`}}
  const pay=e.target.closest('[data-pay-debt]');
  if(pay){const d=data.debts.find(x=>x.id===pay.dataset.payDebt);if(!d)return;const raw=prompt(`Record a payment to ${d.name}`);const amount=clamp(raw,0,d.balance);if(!amount)return;d.balance=Math.max(0,d.balance-amount);data.debtAmount=debtDefinitions().reduce((s,x)=>s+x.balance,0);data.approvedPlan=null;save();$('debtManagerStatus').textContent=`Recorded ${money(amount)} payment to ${d.name}.`}
});

$('customSavings').addEventListener('change',()=>{data.customSavings=$('customSavings').value===''?null:clamp($('customSavings').value,0,1e9);data.approvedPlan=null;save()});$('customDebt').addEventListener('change',()=>{data.customDebt=$('customDebt').value===''?null:clamp($('customDebt').value,0,1e9);data.approvedPlan=null;save()});
$('approvePlan').onclick=()=>{
  if(!clamp(data.paycheck,0,1e9)){$('approvalStatus').textContent='Enter your paycheck first.';return}
  const sameIndex=data.paycheckHistory.findIndex(h=>h.payDate===data.payDate&&h.nextPayday===data.nextPayday);
  if(sameIndex>=0){rollbackReserveContributions(data.paycheckHistory[sameIndex]);data.paycheckHistory.splice(sameIndex,1)}
  data.approvedPlan=null;
  const c=calc();
  const reserveContributions=applyReserveContributions(c);
  const savingsContributions=applySavingsContributions(c.savings);
  const snapshot={id:`plan-${Date.now()}`,approvedAt:new Date().toISOString(),paycheck:c.paycheck,balance:c.balance,payDate:data.payDate,nextPayday:data.nextPayday,payNow:c.payNow,reserve:c.reserve,reserveTarget:c.reserveTarget,reserveContributions,savingsContributions,reserveDetails:c.upcomingBills.map(b=>({parentId:b.parentId||b.id,name:b.name,amount:b.amount,date:b.date,alreadyProtected:b.alreadyProtected,currentCheckReserve:b.currentCheckReserve,paychecksRemaining:b.paychecksRemaining})),savings:c.savings,debtPayment:c.debtPayment,debtTarget:c.targetDebt?{id:c.targetDebt.id,name:c.targetDebt.name}:null,safeToSpend:c.safeToSpend,shortfall:c.shortfall,bills:c.dueNowBills.map(b=>({name:b.name,amount:b.amount,date:b.date,priority:b.priority,alreadyProtected:b.alreadyProtected,currentCheckDue:b.currentCheckDue}))};
  data.approvedPlan=snapshot;data.paycheckHistory.push(snapshot);data.missions.friday=true;data.missions.saving=c.savings>0;data.missions.bills=c.bills.length>0;
  save();$('approvalStatus').textContent=`Payday plan approved. Dexx remembered ${money(reserveContributions.reduce((s,x)=>s+x.amount,0))} in bill reserves${savingsContributions.length?` and moved ${money(savingsContributions.reduce((s,x)=>s+x.amount,0))} into your savings goals`:''}.`;
};
$('clearBills').onclick=()=>{if(confirm('Clear all saved bills?')){data.bills=[];data.reserveMemory={};data.billName='';data.billDate='';data.billAmount=0;data.approvedPlan=null;save()}};$('clearHistory').onclick=()=>{if(confirm('Clear paycheck plan history?')){data.paycheckHistory=[];data.approvedPlan=null;save()}};
$('chatForm').addEventListener('submit',e=>{e.preventDefault();const text=$('chatInput').value.trim();if(!text)return;const c=calc();$('dexxReply').textContent=`Based on this payday, cover ${money(c.payNow)} now, protect ${money(c.reserve)} for upcoming bills, save ${money(c.savings)}${c.savingsGoalTarget?` toward ${c.savingsGoalTarget.name}`:''}, pay ${money(c.debtPayment)} toward ${c.targetDebt?.name||'debt'}, and limit flexible spending to ${money(c.safeToSpend)}. You have recorded ${money(c.expenseTotal)} of flexible expenses this cycle.`;$('chatInput').value=''});
document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{const type=b.dataset.action;if(type==='income'){show('budget');setTimeout(()=>$('paycheck').focus(),200);return}if(type==='expense'){show('expense');setTimeout(()=>{resetExpenseForm();$('expenseName')?.focus()},150);return}});

function openFinancialLab(destination='laboratory'){
  document.body.classList.remove('front-door-active');
  document.body.style.overflow='';
  show(destination);
  requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'auto'}));
}
function openFrontDoor(){
  document.body.classList.add('front-door-active');
  document.body.style.overflow='hidden';
  history.replaceState(null,'',location.pathname+location.search);
  const door=$('frontDoor');
  if(door)door.scrollTo({top:0,left:0,behavior:'auto'});
}
$('enterLabBtn')?.addEventListener('click',e=>{e.preventDefault();openFinancialLab('laboratory')});
$('joinLabBtn')?.addEventListener('click',e=>{e.preventDefault();openFinancialLab('start')});
$('frontDoorBtn')?.addEventListener('click',e=>{e.preventDefault();openFrontDoor()});

const initial=location.hash.slice(1);show(['laboratory','budget','profile','credit','savings','expense','more','start','dexx'].includes(initial)?initial:'laboratory');render();if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(console.warn));

$('profileForm')?.addEventListener('submit',e=>{e.preventDefault();data.researcherName=$('profileName').value.trim()||'Rob';data.profile={payFrequency:$('payFrequency').value,paydayDay:Number($('paydayDay').value),incomePattern:$('incomePattern').value,recurringBillCount:clamp($('recurringBillCount').value,0,99),financialStrategy:$('financialStrategy').value,reserveDays:clamp($('reserveDays').value,7,31)};data.savingsRate=clamp($('profileSavingsRate').value,0,100);save();$('profileStatus').textContent='Financial Profile saved. Dexx will use it for every payday plan.'});
