const STORAGE_KEY = 'financial-lab-v3-data';
const DEFAULTS = {
  researcherName: 'Rob', paycheck: 0, payDate: '', nextPayday: '', savingsRate: 10,
  billName: '', billDate: '', billAmount: 0, saveAmount: 0, debtAmount: 0, expenses: 0,
  bills: [], missions: { spending: false, saving: false, bills: false, friday: false }, lastUpdated: ''
};
const $ = id => document.getElementById(id);
const money = value => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value) || 0);
const dateAtNoon = value => value ? new Date(`${value}T12:00:00`) : null;
const iso = date => date.toISOString().slice(0, 10);

function load() {
  try {
    const old = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return { ...DEFAULTS, ...old, bills: Array.isArray(old.bills) ? old.bills : [], missions: { ...DEFAULTS.missions, ...(old.missions || {}) } };
  } catch { return structuredClone(DEFAULTS); }
}
let data = load();

function normalizedBills() {
  const bills = [...data.bills];
  if (data.billName || data.billDate || Number(data.billAmount)) {
    const legacy = { name: data.billName || 'Upcoming bill', date: data.billDate || '', amount: Number(data.billAmount) || 0, paid: false };
    if (!bills.some(b => b.name === legacy.name && b.date === legacy.date && Number(b.amount) === legacy.amount)) bills.push(legacy);
  }
  return bills.filter(b => b.name || b.date || Number(b.amount)).sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));
}

function paycheckPlan() {
  const paycheck = Math.max(0, Number(data.paycheck) || 0);
  const today = dateAtNoon(data.payDate) || new Date(); today.setHours(12,0,0,0);
  const nextPay = dateAtNoon(data.nextPayday) || new Date(today.getTime() + 7 * 86400000);
  const reserveEnd = new Date(nextPay.getTime() + 14 * 86400000);
  const unpaid = normalizedBills().filter(b => !b.paid);
  const dueNowBills = unpaid.filter(b => !b.date || dateAtNoon(b.date) <= nextPay);
  const upcomingBills = unpaid.filter(b => b.date && dateAtNoon(b.date) > nextPay && dateAtNoon(b.date) <= reserveEnd);
  const laterBills = unpaid.filter(b => b.date && dateAtNoon(b.date) > reserveEnd);
  const dueNow = dueNowBills.reduce((s,b) => s + Number(b.amount || 0), 0);
  const upcomingTotal = upcomingBills.reduce((s,b) => s + Number(b.amount || 0), 0);
  const desiredSavings = Math.max(Number(data.saveAmount) || 0, paycheck * Math.max(0, Number(data.savingsRate) || 0) / 100);

  let remaining = paycheck;
  const payNow = Math.min(remaining, dueNow); remaining -= payNow;
  // Preserve at least 5% when possible, then reserve upcoming bills, then finish the full savings goal.
  const savingsFloor = Math.min(remaining, Math.min(desiredSavings, paycheck * 0.05)); remaining -= savingsFloor;
  const reserve = Math.min(remaining, upcomingTotal); remaining -= reserve;
  const extraSavings = Math.min(remaining, Math.max(0, desiredSavings - savingsFloor)); remaining -= extraSavings;
  const savings = savingsFloor + extraSavings;
  const safeToSpend = Math.max(0, remaining - Number(data.expenses || 0));
  const shortfall = Math.max(0, dueNow - payNow);
  const reserveShortfall = Math.max(0, upcomingTotal - reserve);
  return { paycheck, today, nextPay, reserveEnd, dueNowBills, upcomingBills, laterBills, dueNow, upcomingTotal, desiredSavings, payNow, reserve, savings, safeToSpend, shortfall, reserveShortfall };
}

function calc() {
  const plan = paycheckPlan();
  const bills = normalizedBills();
  const billTotal = bills.filter(b => !b.paid).reduce((s,b) => s + Number(b.amount || 0), 0);
  const cash = plan.safeToSpend;
  let score = 35;
  if (plan.paycheck > 0) score += 15;
  if (bills.length) score += 10;
  if (plan.savings > 0) score += 15;
  if (plan.shortfall === 0 && plan.paycheck > 0) score += 15;
  if (plan.reserveShortfall === 0 && plan.upcomingBills.length) score += 5;
  if (cash >= 0 && plan.paycheck > 0) score += 5;
  const missionDone = Object.values(data.missions).filter(Boolean).length;
  return { ...plan, bills, billTotal, cash, score: Math.min(score, 100), progress: Math.round(missionDone / 4 * 100), missionDone };
}

function save() { data.lastUpdated = new Date().toISOString(); localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); render(); }

function billRows(host, bills) {
  host.replaceChildren();
  if (!bills.length) { host.innerHTML = '<div class="empty-copy">No bills yet. Add one in Budget Lab.</div>'; return; }
  bills.forEach(b => {
    const row = document.createElement('div'); row.className = `bill-row${b.paid ? ' paid' : ''}`;
    const btn = document.createElement('button'); btn.className = 'check'; btn.textContent = b.paid ? '✓' : '';
    btn.onclick = () => { const real = data.bills.find(x => x.name === b.name && x.date === b.date && Number(x.amount) === Number(b.amount)); if (real) real.paid = !real.paid; else data.bills.push({ ...b, paid: true }); save(); };
    const name = document.createElement('span'); name.textContent = b.name || 'Bill';
    const amt = document.createElement('strong'); amt.textContent = money(b.amount);
    const date = document.createElement('small'); date.textContent = b.paid ? 'Paid' : (b.date ? dateAtNoon(b.date).toLocaleDateString('en-US',{month:'short',day:'numeric'}) : 'TBD');
    row.append(btn,name,amt,date); host.append(row);
  });
}

function allocationRows(plan) {
  const host = $('allocationList'); if (!host) return; host.replaceChildren();
  const rows = [
    ['Bills due before next payday', plan.payNow, plan.shortfall ? `${money(plan.shortfall)} still unfunded` : `${plan.dueNowBills.length} bill${plan.dueNowBills.length === 1 ? '' : 's'} covered`],
    ['Reserve for bills coming up', plan.reserve, plan.reserveShortfall ? `${money(plan.reserveShortfall)} still to reserve` : `${plan.upcomingBills.length} upcoming bill${plan.upcomingBills.length === 1 ? '' : 's'}`],
    ['Move to savings', plan.savings, `Goal: ${money(plan.desiredSavings)}`],
    ['Safe spending amount', plan.safeToSpend, 'Available until next payday']
  ];
  rows.forEach(([label, amount, note]) => { const row=document.createElement('div'); row.className='allocation-row'; row.innerHTML=`<div><strong>${label}</strong><small>${note}</small></div><b>${money(amount)}</b>`; host.append(row); });
}

function recommendation(plan) {
  if (!plan.paycheck) return 'Enter your check amount, next payday, and bill due dates. I’ll build the plan instantly.';
  if (plan.shortfall > 0) return `Your check is ${money(plan.shortfall)} short of bills due before ${plan.nextPay.toLocaleDateString('en-US',{month:'short',day:'numeric'})}. Pay housing, utilities, transportation, and insurance first, then contact lower-priority billers before their due dates.`;
  if (plan.reserveShortfall > 0) return `Your immediate bills are covered. Reserve ${money(plan.reserve)} now, save ${money(plan.savings)}, and keep spending under ${money(plan.safeToSpend)}. You still need ${money(plan.reserveShortfall)} from the next check for later bills.`;
  return `Cover ${money(plan.payNow)} in bills, move ${money(plan.reserve)} into a bills reserve, save ${money(plan.savings)}, and keep flexible spending at or below ${money(plan.safeToSpend)} until your next payday.`;
}

function render() {
  const c = calc(), hour = new Date().getHours();
  $('greeting').textContent = `GOOD ${hour < 12 ? 'MORNING' : hour < 17 ? 'AFTERNOON' : 'EVENING'}, ${(data.researcherName || 'ROB').toUpperCase()} 👋`;
  $('healthScore').textContent = c.score; $('scoreRing').style.setProperty('--score', c.score);
  $('healthMessage').textContent = c.score >= 80 ? 'Your paycheck plan is fully protected.' : c.score >= 60 ? 'Your plan is gaining strength.' : 'Complete Friday Lab to improve your score.';
  $('cashAvailable').textContent = money(c.safeToSpend); $('billsWeek').textContent = money(c.payNow); $('savingsTotal').textContent = money(c.savings);
  $('savingsPageTotal').textContent = money(c.savings); $('debtRemaining').textContent = money(data.debtAmount);
  $('missionCount').textContent = `${c.missionDone} / 4`; $('progressText').textContent = `${c.progress}%`; $('progressBar').style.width = `${c.progress}%`;
  $('dexxObservation').textContent = recommendation(c);
  document.querySelectorAll('[data-mission]').forEach(x => x.checked = !!data.missions[x.dataset.mission]);
  billRows($('billList'), c.bills.filter(b=>!b.paid).slice(0,4)); billRows($('allBills'), c.bills);
  ['paycheck','saveAmount','debtAmount','savingsRate'].forEach(id => { if ($(id)) $(id).value = data[id] || (id==='savingsRate' ? 10 : ''); });
  if ($('payDate')) $('payDate').value = data.payDate || iso(new Date()); if ($('nextPayday')) $('nextPayday').value = data.nextPayday || '';
  $('billName').value=''; $('billDate').value=''; $('billAmount').value='';
  if ($('planPayNow')) {
    $('planPayNow').textContent=money(c.payNow); $('planReserve').textContent=money(c.reserve); $('planSavings').textContent=money(c.savings); $('planSpend').textContent=money(c.safeToSpend);
    $('planStatus').textContent = c.shortfall ? 'Needs attention' : c.paycheck ? 'Plan ready' : 'Ready'; $('dexxPlanText').textContent = recommendation(c);
    const total = c.paycheck || 1; [['allocBills',c.payNow],['allocReserve',c.reserve],['allocSavings',c.savings],['allocSpend',c.safeToSpend]].forEach(([id,val])=>$(id).style.width=`${Math.max(0,val/total*100)}%`);
    allocationRows(c);
  }
}

function show(id) { document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id)); document.querySelectorAll('.bottom-nav button').forEach(b=>b.classList.toggle('active',b.dataset.go===id)); history.replaceState(null,'','#'+id); scrollTo({top:0,behavior:'smooth'}); }

document.addEventListener('click', e => {
  const go=e.target.closest('[data-go]'); if(go){e.preventDefault();show(go.dataset.go);}
  const q=e.target.closest('[data-question]'); if(q){const c=calc();const answers={score:`Your score is ${c.score}. Fund bills before the next payday, protect ${money(c.savings)} for savings, and stay within ${money(c.safeToSpend)}.`,spending:`Your current safe-to-spend amount is ${money(c.safeToSpend)} through ${c.nextPay.toLocaleDateString('en-US',{month:'short',day:'numeric'})}.`,challenge:`Money challenge: move ${money(Math.min(20,c.safeToSpend))} to savings and complete one no-spend day.`,saving:`Your current recommendation is ${money(c.savings)}. Start there, then increase the percentage after your bills reserve is fully funded.`};$('dexxReply').textContent=answers[q.dataset.question];}
});
document.querySelectorAll('[data-mission]').forEach(x=>x.addEventListener('change',()=>{data.missions[x.dataset.mission]=x.checked;save();}));
$('budgetForm').addEventListener('submit', e => {
  e.preventDefault();
  data.paycheck=Math.max(0,Number($('paycheck').value)||0); data.payDate=$('payDate').value; data.nextPayday=$('nextPayday').value;
  data.savingsRate=Math.min(100,Math.max(0,Number($('savingsRate').value)||0)); data.saveAmount=Math.max(0,Number($('saveAmount').value)||0); data.debtAmount=Math.max(0,Number($('debtAmount').value)||0);
  const name=$('billName').value.trim(), date=$('billDate').value, amount=Math.max(0,Number($('billAmount').value)||0); if(name||date||amount)data.bills.push({name:name||'Upcoming bill',date,amount,paid:false});
  data.billName='';data.billDate='';data.billAmount=0;data.missions.friday=true;data.missions.saving=paycheckPlan().savings>0;data.missions.bills=data.bills.length>0;save();
  $('formStatus').textContent='Dexx built your paycheck plan. Your original saved data remains preserved.';
});
$('clearBills').onclick=()=>{if(confirm('Clear all saved bills?')){data.bills=[];data.billName='';data.billDate='';data.billAmount=0;save();}};
$('chatForm').addEventListener('submit',e=>{e.preventDefault();const text=$('chatInput').value.trim();if(!text)return;const c=calc();$('dexxReply').textContent=`Based on this paycheck, cover ${money(c.payNow)} in immediate bills, reserve ${money(c.reserve)}, save ${money(c.savings)}, and limit flexible spending to ${money(c.safeToSpend)}.`;$('chatInput').value='';});
document.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{const type=b.dataset.action;if(type==='income'){show('budget');setTimeout(()=>$('paycheck').focus(),200);return;}const raw=prompt('Expense amount');const val=Math.max(0,Number(raw)||0);if(!val)return;data.expenses+=val;save();show('laboratory');});
const initial=location.hash.slice(1); show(['laboratory','budget','credit','savings','more','dexx'].includes(initial)?initial:'laboratory'); render();
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(console.warn));
