const fs=require('fs'),crypto=require('crypto');
require('./build1821.js');
let html=fs.readFileSync('dist/index.html','utf8');

const start=html.indexOf('function weekdayAnalysis(');
const end=html.indexOf('function oddRangeAnalysis(',start);
if(start<0||end<0)throw Error('Dashboard por dia da semana nao encontrado');

const weekdayPatch=String.raw`function weekdayScopeSet(value){window.bankrolWeekdayScope=value==='all'?'all':'month';render()}
function weekdayRangeControl(){const scope=window.bankrolWeekdayScope||'month',y=calDate.getFullYear(),m=calDate.getMonth();return \`<div class="dash-period"><select id="weekdayRange" onchange="weekdayScopeSet(this.value)"><option value="month" \${scope==='month'?'selected':''}>\${MONTHS[m]} de \${y}</option><option value="all" \${scope==='all'?'selected':''}>Geral</option></select></div>\`}
function weekdayAnalysis(list){const names=['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],scope=window.bankrolWeekdayScope||'month',y=calDate.getFullYear(),m=calDate.getMonth(),source=scope==='all'?records:records.filter(r=>{const d=new Date(r.date+'T12:00:00');return d.getFullYear()===y&&d.getMonth()===m}),rows=names.map((name,i)=>{const xs=source.filter(r=>new Date(r.date+'T12:00:00').getDay()===i),s=stats(xs);return{name,count:s.count,wins:s.success,losses:s.failure,pending:s.pending,rate:s.rate,avgOdds:avg(xs,r=>r.confidenceIndex),impact:s.impact,roi:s.roi}}),eligible=rows.filter(x=>x.count>0),leader=[...eligible].sort((a,b)=>b.impact-a.impact||b.rate-a.rate||b.count-a.count)[0]||{name:'—',count:0,wins:0,losses:0,pending:0,rate:0,avgOdds:0,impact:0,roi:0},hit=(leader.wins+leader.losses)?\`\${leader.wins}/\${leader.wins+leader.losses}\`:'0/0';return\`<div class="dimension-summary"><div><small>Dias</small><strong>\${rows.length}</strong></div><div><small>Melhor dia</small><strong>\${esc(leader.name||'—')}</strong></div><div><small>Retorno destaque</small><strong class="\${leader.impact>=0?'pos':'neg'}">\${money(leader.impact||0)}</strong></div><div><small>Odds média destaque</small><strong>\${quote(leader.avgOdds||0)}</strong></div></div><div class="dimension-pills"><div class="result-pill win">✓ \${leader.wins||0} certas</div><div class="result-pill loss">× \${leader.losses||0} erradas</div><div class="result-pill wait">⌛ \${leader.pending||0} pendentes</div></div><div class="dimension-meta"><div><b>\${hit}</b><small>Acerto destaque</small></div><div><b>\${leader.count||0}</b><small>Análises destaque</small></div><div><b class="\${(leader.roi||0)>=0?'pos':'neg'}">\${pct(leader.roi||0)}</b><small>ROI destaque</small></div></div><div class="weekday-grid"><div class="weekday-row head"><span>Dia</span><span>Qtd</span><span>Acerto</span><span>Odd média</span><span>Retorno</span></div>\${rows.map(x=>\`<div class="weekday-row"><span>\${x.name}</span><span>\${x.count}</span><span>\${x.wins}/\${x.wins+x.losses}</span><span>\${quote(x.avgOdds)}</span><b class="\${x.impact>=0?'pos':'neg'}">\${money(x.impact)}</b></div>\`).join('')}</div>\`}
`;
html=html.slice(0,start)+weekdayPatch+html.slice(end);

const oldCard=String.raw`<article class="card category-card"><div class="card-head"><div><div class="ey">SEMANA</div><h3>Análise por dia da semana</h3></div></div>${weekdayAnalysis(list)}</article>`;
const newCard=String.raw`<article class="card category-card"><div class="card-head"><div><div class="ey">SEMANA</div><h3>Análise por dia da semana</h3></div>${weekdayRangeControl()}</div>${weekdayAnalysis(list)}</article>`;
if(!html.includes(oldCard))throw Error('Card semanal original nao encontrado');
html=html.replace(oldCard,newCard);

html=html.replace(/<meta name="bankrol-release" content="[^"]+">/,'<meta name="bankrol-release" content="1.8.22-semana-mes-geral">');
html=html.replace(/<title>[^<]*<\/title>/,'<title>Bankrol Lab - Semana por mês ou geral 1.8.22</title>');
fs.writeFileSync('dist/index.html',html);
const sha=crypto.createHash('sha256').update(html).digest('hex');
console.log('BANKROL 1.8.22 gerado com sucesso');
console.log('SHA-256:',sha);
console.log('Bytes:',Buffer.byteLength(html));
