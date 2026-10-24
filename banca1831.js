// BANKROL 1.8.31 — Banca: depósitos e saques por casa de apostas + visão global.
// Este trecho é injetado no index.html pelo build1831.js, antes de function settings().
const TX_TYPES={deposit:'Depósito',withdraw:'Saque'};
function todaySP(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
function parseMoney(v){const s=String(v??'').trim().replace(/[R$\s]/g,'');return round2(s.includes(',')||/^\d{1,3}(\.\d{3})+$/.test(s)?s.replace(/\./g,'').replace(',','.'):s)}
function houseKey(v){return String(v||'').trim().toLocaleLowerCase('pt-BR')}
function normTx(t){const now=new Date().toISOString();return{id:t.id||uid(),date:t.date||todaySP(),platform:String(t.platform||'').trim(),type:t.type==='withdraw'?'withdraw':'deposit',amount:Math.abs(round2(t.amount)),notes:String(t.notes||''),createdAt:t.createdAt||now,updatedAt:t.updatedAt||t.createdAt||now,...(t.deletedAt?{deletedAt:t.deletedAt}:{})}}
function mergeTx(a,b){const m=new Map;[...(a||[]),...(b||[])].forEach(t=>{if(!t?.id)return;const x=normTx(t),o=m.get(x.id);if(!o||String(x.updatedAt)>String(o.updatedAt))m.set(x.id,x)});return[...m.values()]}
function liveTx(){return transactions.filter(t=>!t.deletedAt)}
function houseNames(){const m=new Map;[...records.map(r=>r.platform),...liveTx().map(t=>t.platform)].forEach(n=>{const k=houseKey(n);if(k&&!m.has(k))m.set(k,String(n).trim())});return[...m.values()].sort((a,b)=>a.localeCompare(b,'pt-BR'))}
function bankSummary(){
  const m=new Map,get=(name)=>{const k=houseKey(name);if(!m.has(k))m.set(k,{key:k,name:String(name||'').trim()||'Não informado',deposits:0,withdrawals:0,result:0,pending:0,bets:0,txCount:0,last:''});return m.get(k)};
  liveTx().forEach(t=>{const h=get(t.platform);h[t.type==='withdraw'?'withdrawals':'deposits']+=t.amount;h.txCount++;if(t.date>h.last)h.last=t.date});
  records.forEach(r=>{const h=get(r.platform);h.bets++;if(r.result==='pending')h.pending+=num(r.analysisWeight);else h.result+=num(r.impactScore);if(r.date>h.last)h.last=r.date});
  return[...m.values()].map(h=>({...h,balance:h.deposits-h.withdrawals+h.result,available:h.deposits-h.withdrawals+h.result-h.pending,roi:h.deposits?h.result/h.deposits*100:0})).sort((a,b)=>b.balance-a.balance)
}
function bankTotals(list){const t={deposits:0,withdrawals:0,result:0,pending:0,balance:0,available:0};list.forEach(h=>Object.keys(t).forEach(k=>t[k]+=h[k]));t.net=t.deposits-t.withdrawals;t.roi=t.deposits?t.result/t.deposits*100:0;return t}
function bankFlows(key){
  // Movimentos diários de caixa: depósitos (+), saques (−) e resultado das análises encerradas (±).
  const by={},add=(d,f,v)=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(d||''))return;by[d]??={deposits:0,withdrawals:0,result:0};by[d][f]+=v},inHouse=p=>key==='all'||houseKey(p)===key;
  liveTx().filter(t=>inHouse(t.platform)).forEach(t=>add(t.date,t.type==='withdraw'?'withdrawals':'deposits',t.amount));
  records.filter(r=>r.result!=='pending'&&inHouse(r.platform)).forEach(r=>add(r.date,'result',num(r.impactScore)));
  let acc=0;return Object.keys(by).sort().map(d=>{const o=by[d];acc+=o.deposits-o.withdrawals+o.result;return{d,...o,balance:acc}})
}
function bankChart(flows){
  if(!flows.length)return'<div class="empty-state">Registre um depósito para acompanhar a evolução da banca.</div>';
  const W=820,H=230,PL=70,PR=16,PT=16,PB=30,vals=flows.map(f=>f.balance),mn=Math.min(0,...vals),mx=Math.max(0,...vals),span=Math.max(1,mx-mn),
    x=i=>PL+(flows.length===1?(W-PL-PR)/2:i*(W-PL-PR)/(flows.length-1)),y=v=>PT+(mx-v)*(H-PT-PB)/span,
    pts=flows.map((f,i)=>[x(i),y(f.balance)]),path=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' '),
    ticks=[mx,(mx+mn)/2,mn].filter((v,i,a)=>a.indexOf(v)===i),step=Math.max(1,Math.ceil(flows.length/8)),
    lbl=d=>d.slice(8,10)+'/'+d.slice(5,7);
  return`<div class="chart-wrap"><svg class="line-chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${ticks.map(v=>`<line class="chart-grid-line" x1="${PL}" y1="${y(v)}" x2="${W-PR}" y2="${y(v)}"/><text class="chart-axis-label" x="4" y="${y(v)+3}">${money(v)}</text>`).join('')}${mn<0?`<line class="chart-zero" x1="${PL}" y1="${y(0)}" x2="${W-PR}" y2="${y(0)}"/>`:''}<path class="chart-line" d="${path}"/>${pts.map((p,i)=>`<circle class="chart-dot bank-dot" cx="${p[0]}" cy="${p[1]}" r="3.5"><title>${lbl(flows[i].d)} · Saldo ${money(flows[i].balance)}</title></circle>${i%step===0||i===pts.length-1?`<text class="chart-x-label" x="${p[0]}" y="${H-8}">${lbl(flows[i].d)}</text>`:''}`).join('')}</svg></div>`
}
function bankMonthly(flows){
  const by={};flows.forEach(f=>{const k=f.d.slice(0,7);by[k]??={deposits:0,withdrawals:0,result:0,balance:0};by[k].deposits+=f.deposits;by[k].withdrawals+=f.withdrawals;by[k].result+=f.result;by[k].balance=f.balance});
  const rows=Object.keys(by).sort().reverse();
  if(!rows.length)return'<div class="empty-state">Sem movimentações.</div>';
  return`<div class="bank-table-wrap"><table class="bank-table compact"><thead><tr><th>Mês</th><th>Depósitos</th><th>Saques</th><th>Resultado</th><th>Saldo no fim</th></tr></thead><tbody>${rows.map(k=>{const o=by[k],[yy,mm]=k.split('-');return`<tr><td><b>${MONTHS[Number(mm)-1]} de ${yy}</b></td><td class="pos">${money(o.deposits)}</td><td class="neg">${money(o.withdrawals)}</td><td class="${o.result>=0?'pos':'neg'}">${money(o.result)}</td><td><b>${money(o.balance)}</b></td></tr>`}).join('')}</tbody></table></div>`
}
function bank(){
  const houses=bankSummary(),known=houses.some(h=>h.key===bankFilter);
  if(bankFilter!=='all'&&!known)bankFilter='all';
  const scoped=bankFilter==='all'?houses:houses.filter(h=>h.key===bankFilter),t=bankTotals(scoped),flows=bankFlows(bankFilter),
    scopeName=bankFilter==='all'?'Todas as casas':scoped[0]?.name||'Casa',
    editingTx=txEditing?transactions.find(x=>x.id===txEditing&&!x.deletedAt):null,names=houseNames();
  $('#ticker').innerHTML='';
  const items=[['R$','Saldo estimado',money(t.balance),t.balance>=0?'pos':'neg'],['↓','Depositado',money(t.deposits),''],['↑','Sacado',money(t.withdrawals),''],['Σ','Aporte líquido',money(t.net),''],['±','Resultado das apostas',money(t.result),t.result>=0?'pos':'neg'],['%','ROI s/ depósitos',pct(t.roi),t.roi>=0?'pos':'neg'],['⌛','Em aberto',money(t.pending),'amber'],['✓','Disponível',money(t.available),t.available>=0?'pos':'neg']];
  $('#metrics').innerHTML=items.map(x=>`<article class="metric"><span class="metric-icon">${x[0]}</span><small>${x[1]}</small><b class="${x[3]}">${x[2]}</b></article>`).join('');
  const houseRows=houses.length?houses.map(h=>`<tr class="bank-house ${h.key===bankFilter?'on':''}" data-house="${esc(h.key)}"><td><b>${esc(h.name)}</b><small>${h.bets} ${h.bets===1?'análise':'análises'} · ${h.txCount} ${h.txCount===1?'movimentação':'movimentações'}</small></td><td class="pos">${money(h.deposits)}</td><td class="neg">${money(h.withdrawals)}</td><td class="${h.result>=0?'pos':'neg'}">${money(h.result)}</td><td class="amber">${money(h.pending)}</td><td><b class="${h.balance>=0?'pos':'neg'}">${money(h.balance)}</b></td><td class="${h.roi>=0?'pos':'neg'}">${pct(h.roi)}</td></tr>`).join(''):'';
  $('#content').innerHTML=`<div class="dash-topline bank-topline"><div class="dash-period"><select id="bankHouse"><option value="all">Todas as casas (visão global)</option>${houses.map(h=>`<option value="${esc(h.key)}">${esc(h.name)}</option>`).join('')}</select></div><p class="muted">Saldo estimado = depósitos − saques + resultado das análises encerradas. "Disponível" desconta o valor das análises pendentes.</p></div>
<section class="bank-grid"><article class="card"><div class="card-head"><div><div class="ey">${editingTx?'EDITAR':'NOVA'} MOVIMENTAÇÃO</div><h3>${editingTx?'Editar lançamento':'Depósito ou saque'}</h3></div></div><form id="txForm" class="bank-form">
<div class="bank-type"><label><input type="radio" name="type" value="deposit" ${editingTx?.type!=='withdraw'?'checked':''}><span>Depósito</span></label><label><input type="radio" name="type" value="withdraw" ${editingTx?.type==='withdraw'?'checked':''}><span>Saque</span></label></div>
<div class="field"><label>CASA DE APOSTAS</label><input name="platform" list="bankHouses" required placeholder="Ex.: Bet365" value="${esc(editingTx?.platform??(bankFilter!=='all'?scopeName:''))}"><datalist id="bankHouses">${names.map(n=>`<option value="${esc(n)}"></option>`).join('')}</datalist></div>
<div class="bank-form-row"><div class="field"><label>DATA</label><input name="date" type="date" required value="${esc(editingTx?.date||todaySP())}"></div><div class="field"><label>VALOR (R$)</label><input name="amount" inputmode="decimal" required placeholder="0,00" value="${editingTx?decimalText(editingTx.amount,2):''}"></div></div>
<div class="field"><label>OBSERVAÇÃO</label><input name="notes" placeholder="Opcional (Pix, bônus, taxa...)" value="${esc(editingTx?.notes||'')}"></div>
<div class="actions"><button type="button" id="txCancel" class="btn secondary">${editingTx?'Cancelar edição':'Limpar'}</button><button class="btn primary">${editingTx?'Salvar alterações':'Registrar'}</button></div></form></article>
<article class="card"><div class="card-head"><div><div class="ey">EVOLUÇÃO</div><h3>Saldo da banca · ${esc(scopeName)}</h3></div></div>${bankChart(flows)}</article></section>
<article class="card bank-card"><div class="card-head"><div><div class="ey">POR CASA</div><h3>Banca por casa de apostas</h3></div><span class="muted">Clique em uma casa para filtrar</span></div>${houses.length?`<div class="bank-table-wrap"><table class="bank-table"><thead><tr><th>Casa</th><th>Depósitos</th><th>Saques</th><th>Resultado</th><th>Em aberto</th><th>Saldo estimado</th><th>ROI s/ dep.</th></tr></thead><tbody>${houseRows}</tbody><tfoot><tr><td><b>Total</b></td><td class="pos">${money(bankTotals(houses).deposits)}</td><td class="neg">${money(bankTotals(houses).withdrawals)}</td><td class="${bankTotals(houses).result>=0?'pos':'neg'}">${money(bankTotals(houses).result)}</td><td class="amber">${money(bankTotals(houses).pending)}</td><td><b>${money(bankTotals(houses).balance)}</b></td><td>${pct(bankTotals(houses).roi)}</td></tr></tfoot></table></div>`:'<div class="empty-state">Nenhuma casa ainda. Registre o primeiro depósito ao lado.</div>'}</article>
<section class="bank-grid"><article class="card"><div class="card-head"><div><div class="ey">MENSAL</div><h3>Fluxo por mês · ${esc(scopeName)}</h3></div></div>${bankMonthly(flows)}</article>
<article class="card"><div class="card-head"><div><div class="ey">EXTRATO</div><h3>Movimentações · ${esc(scopeName)}</h3></div><span id="txCount" class="muted"></span></div><div id="txList" class="bank-tx-list"></div></article></section>`;
  const txs=liveTx().filter(x=>bankFilter==='all'||houseKey(x.platform)===bankFilter).sort((a,b)=>b.date.localeCompare(a.date)||String(b.createdAt).localeCompare(String(a.createdAt)));
  $('#txCount').textContent=`${txs.length} ${txs.length===1?'lançamento':'lançamentos'}`;
  $('#txList').innerHTML=txs.length?txs.map(x=>`<div class="bank-tx"><span class="bank-tx-badge ${x.type}">${x.type==='withdraw'?'↑':'↓'}</span><div><b>${esc(x.platform||'Não informado')}</b><small>${x.date.split('-').reverse().join('/')} · ${TX_TYPES[x.type]}${x.notes?' · '+esc(x.notes):''}</small></div><strong class="${x.type==='withdraw'?'neg':'pos'}">${x.type==='withdraw'?'−':'+'}${money(x.amount)}</strong><div class="note-actions"><button type="button" class="btn secondary edit-tx" data-id="${x.id}">Editar</button><button type="button" class="btn danger delete-tx" data-id="${x.id}">Excluir</button></div></div>`).join(''):'<div class="empty-state">Nenhuma movimentação registrada.</div>';
  $('#bankHouse').value=bankFilter;
  $('#bankHouse').onchange=e=>{bankFilter=e.target.value;bank()};
  $$('.bank-house').forEach(tr=>tr.onclick=()=>{bankFilter=bankFilter===tr.dataset.house?'all':tr.dataset.house;bank()});
  $$('.edit-tx').forEach(b=>b.onclick=()=>{txEditing=b.dataset.id;bank();scrollTo({top:0,behavior:'smooth'})});
  $$('.delete-tx').forEach(b=>b.onclick=()=>{if(!confirm('Excluir esta movimentação?'))return;const x=transactions.find(t=>t.id===b.dataset.id);if(!x)return;const now=new Date().toISOString();x.deletedAt=now;x.updatedAt=now;if(txEditing===x.id)txEditing=null;queue();toast('Movimentação excluída');bank()});
  $('#txCancel').onclick=()=>{txEditing=null;bank()};
  $('#txForm').onsubmit=e=>{e.preventDefault();const o=Object.fromEntries(new FormData(e.target)),amount=parseMoney(o.amount),platform=String(o.platform||'').trim();
    if(!platform)return toast('Informe a casa de apostas');if(!(amount>0))return toast('Informe um valor maior que zero');
    const now=new Date().toISOString(),data={type:o.type==='withdraw'?'withdraw':'deposit',platform,date:o.date||todaySP(),amount,notes:String(o.notes||'').trim()};
    if(editingTx)Object.assign(editingTx,data,{updatedAt:now});else transactions.push(normTx({...data,createdAt:now,updatedAt:now}));
    txEditing=null;queue();toast(data.type==='withdraw'?'Saque registrado':'Depósito registrado');bank()};
}
