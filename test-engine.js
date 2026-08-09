const STORAGE_KEY = 'financial-lab-v3-data';
const DEFAULTS = {
  researcherName:'Rob', paycheck:0, currentBalance:0, payDate:'', nextPayday:'', savingsRate:10,
  billName:'', billDate:'', billAmount:0, saveAmount:0, debtAmount:0, debtGoal:0, expenses:0,
  customSavings:null, customDebt:null, bills:[], paycheckHistory:[], approvedPlan:null,
  missions:{spending:false,saving:false,bills:false,friday:false}, profile:{payFrequency:'weekly',paydayDay:5,incomePattern:'variable',recurringBillCount:9,financialStrategy:'balanced',reserveDays:14}, lastUpdated:''
};
const $=id=>document.getElementById(id);
const money=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(Number(v)||0);
const dateAtNoon=v=>v?new Date(`${v}T12:00:00`):null;
const iso=d=>d.toISOString().slice(0,10);
const clamp=(v,min,max)=>Math.min(max,Math.max(min,Number(v)||0));
function load(){try{const old=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');const migratedBills=Array.isArray(old.bills)?old.bills.map((b,i)=>({id:b.id||`bill-${i}-${Date.now()}`,name:b.name||'Bill',amount:Number(b.amount)||0,dueDate:b.dueDate||b.date||'',date:b.dueDate||b.date||'',priority:b.priority||'important',frequency:b.frequency||'monthly',autopay:!!b.autopay,paidOccurrences:Array.isArray(b.paidOccurrences)?b.paidOccurrences:(b.paid&&b.date?[b.date]:[])})):[];return {...DEFAULTS,...old,bills:migratedBills,paycheckHistory:Array.isArray(old.paycheckHistory)?old.paycheckHistory:[],missions:{...DEFAULTS.missions,...(old.missions||{})},profile:{...DEFAULTS.profile,...(old.profile||{})}}}catch{return structuredClone(DEFAULTS)}}
let data=structuredClone(DEFAULTS);
const priorityRank={essential:0,important:1,flexible:2};
function billDefinitions(){return (Array.isArray(data.bills)?data.bills:[]).filter(b=>b.name||b.dueDate||b.date||Number(b.amount)).map((b,i)=>({id:b.id||`bill-${i}-${b.name||'bill'}`,name:b.name||'Bill',amount:Number(b.amount)||0,dueDate:b.dueDate||b.date||'',date:b.dueDate||b.date||'',priority:b.priority||'important',frequency:b.frequency||'monthly',autopay:!!b.autopay,paidOccurrences:Array.isArray(b.paidOccurrences)?b.paidOccurrences:[]}))}
function monthDate(year,month,day){const last=new Date(year,month+1,0,12).getDate();return new Date(year,month,Math.min(day,last),12)}
function billOccurrences(startDate,endDate){const start=new Date(startDate);start.setHours(12,0,0,0);const end=new Date(endDate);end.setHours(12,0,0,0);const out=[];for(const b of billDefinitions()){const base=dateAtNoon(b.dueDate);if(!base)continue;const paid=new Set(b.paidOccurrences||[]);const add=d=>{if(d>end)return;const key=iso(d);out.push({...b,parentId:b.id,occurrenceDate:key,date:key,paid:paid.has(key)})};if(b.frequency==='once'){if(base<=end)add(base);continue}if(b.frequency==='monthly'){const scanStart=new Date(start.getFullYear(),start.getMonth(),1,12);for(let cursor=new Date(scanStart);cursor<=end;cursor=new Date(cursor.getFullYear(),cursor.getMonth()+1,1,12)){const d=monthDate(cursor.getFullYear(),cursor.getMonth(),base.getDate());if(d>=base&&d<=end)add(d)}continue}const step=b.frequency==='biweekly'?14:7;let d=new Date(base);while(d<start)d=new Date(d.getTime()+step*86400000);const prior=new Date(d.getTime()-step*86400000);if(prior>=base&&prior<start&&prior>=new Date(start.getTime()-step*86400000))add(prior);for(;d<=end;d=new Date(d.getTime()+step*86400000))add(new Date(d))}return out.sort((a,b)=>(priorityRank[a.priority]-priorityRank[b.priority])||a.date.localeCompare(b.date))}
function normalizedBills(){const today=dateAtNoon(data.payDate)||new Date();today.setHours(12,0,0,0);const horizon=new Date(today.getTime()+45*86400000);return billOccurrences(today,horizon)}
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
    const target=Math.round((Number(b.amount||0)/checks)*100)/100;
    return {...b,paychecksRemaining:checks,currentCheckReserve:target};
  })
}
function paycheckPlan(){
  const paycheck=clamp(data.paycheck,0,1e9), balance=clamp(data.currentBalance,0,1e9), available=paycheck+balance;
  const today=dateAtNoon(data.payDate)||new Date();today.setHours(12,0,0,0);
  const freqDays=data.profile?.payFrequency==='biweekly'?14:data.profile?.payFrequency==='monthly'?30:7;
  const nextPay=dateAtNoon(data.nextPayday)||new Date(today.getTime()+freqDays*86400000);
  const reserveEnd=new Date(nextPay.getTime()+clamp(data.profile?.reserveDays||14,7,31)*86400000);
  const windowStart=new Date(today);windowStart.setDate(windowStart.getDate()-14);
  const unpaid=billOccurrences(windowStart,reserveEnd).filter(b=>!b.paid).sort((a,b)=>(priorityRank[a.priority]-priorityRank[b.priority])||a.date.localeCompare(b.date));
  const dueNowBills=unpaid.filter(b=>dateAtNoon(b.date)<=nextPay);
  const upcomingRaw=unpaid.filter(b=>dateAtNoon(b.date)>nextPay&&dateAtNoon(b.date)<=reserveEnd);
  const upcomingBills=reserveTargets(upcomingRaw,today,nextPay,freqDays);
  const laterBills=[];
  const dueNow=dueNowBills.reduce((s,b)=>s+Number(b.amount||0),0);
  const upcomingTotal=upcomingBills.reduce((s,b)=>s+Number(b.amount||0),0);
  const reserveTarget=upcomingBills.reduce((s,b)=>s+Number(b.currentCheckReserve||0),0);
  const desiredSavings=Math.max(clamp(data.saveAmount,0,1e9),paycheck*clamp(data.savingsRate,0,100)/100);
  const desiredDebt=Math.min(clamp(data.debtGoal,0,1e9),clamp(data.debtAmount,0,1e9));

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
  const safeToSpend=Math.max(0,remaining-clamp(data.expenses,0,1e9));
  return {paycheck,balance,available,today,nextPay,reserveEnd,dueNowBills,upcomingBills,laterBills,dueNow,upcomingTotal,reserveTarget,desiredSavings,desiredDebt,payNow,reserve,savings:chosenSavings,debtPayment:chosenDebt,safeToSpend,shortfall:Math.max(0,dueNow-payNow),reserveShortfall:Math.max(0,reserveTarget-reserve)};
}
function run(name, cfg){data=structuredClone(DEFAULTS);Object.assign(data,cfg);data.profile={...DEFAULTS.profile,...(cfg.profile||{})};const p=paycheckPlan();console.log(name, JSON.stringify({payNow:p.payNow,reserveTarget:p.reserveTarget,reserve:p.reserve,savings:p.savings,debt:p.debtPayment,safe:p.safeToSpend,shortfall:p.shortfall,reserveShortfall:p.reserveShortfall,upcoming:p.upcomingBills.map(b=>({name:b.name,amount:b.amount,reserve:b.currentCheckReserve,checks:b.paychecksRemaining,date:b.date}))}));}
run('rent-3-weeks',{paycheck:700,payDate:'2026-08-07',nextPayday:'2026-08-14',savingsRate:10,bills:[{id:'phone',name:'Phone',amount:50,dueDate:'2026-08-10',date:'2026-08-10',frequency:'monthly',priority:'essential',paidOccurrences:[]},{id:'rent',name:'Rent',amount:1200,dueDate:'2026-08-28',date:'2026-08-28',frequency:'monthly',priority:'essential',paidOccurrences:[]}],profile:{payFrequency:'weekly',reserveDays:21}});
run('rent-12-days',{paycheck:700,payDate:'2026-08-07',nextPayday:'2026-08-14',savingsRate:10,bills:[{id:'phone',name:'Phone',amount:50,dueDate:'2026-08-10',date:'2026-08-10',frequency:'monthly',priority:'essential',paidOccurrences:[]},{id:'rent',name:'Rent',amount:1200,dueDate:'2026-08-19',date:'2026-08-19',frequency:'monthly',priority:'essential',paidOccurrences:[]}],profile:{payFrequency:'weekly',reserveDays:14}});
run('no-future',{paycheck:700,payDate:'2026-08-07',nextPayday:'2026-08-14',savingsRate:10,bills:[{id:'phone',name:'Phone',amount:50,dueDate:'2026-08-10',date:'2026-08-10',frequency:'monthly',priority:'essential',paidOccurrences:[]}],profile:{payFrequency:'weekly',reserveDays:14}});
