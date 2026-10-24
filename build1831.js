const fs=require('fs'),crypto=require('crypto');
require('./build1830.js');
let html=fs.readFileSync('dist/index.html','utf8');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
function once(a,b,label){if(!html.includes(a))throw Error('Trecho ausente 1.8.31: '+label);html=html.replace(a,()=>b)}

once('content="1.8.30-ordem-visual-valor-cotacao"','content="1.8.31-banca-depositos-saques"','release');
once('<title>Bankrol Lab - Valor Simulado antes da Cotação 1.8.30</title>','<title>Bankrol Lab - Banca, Depósitos e Saques 1.8.31</title>','titulo');
once('Versão 1.8.30 — Corrige a ordem visual da Nova Análise para Valor Simulado antes da Cotação e mantém o fuso America/Sao_Paulo.','Versão 1.8.31 — Nova aba Banca: depósitos e saques por casa de apostas, saldo estimado e visão global consolidada.','nota versao');

// Estado: movimentações ficam no localStorage e no mesmo registro da nuvem (settings.transactions),
// sem alterar a tabela do Supabase. Exclusões usam deletedAt para não "ressuscitarem" no merge entre aparelhos.
once("n:'bankrol.teamnotes.stable.v1'}","n:'bankrol.teamnotes.stable.v1',t:'bankrol.transactions.stable.v1'}",'chave local');
once('teamNotes=[],notesEditing=null,','teamNotes=[],notesEditing=null,transactions=[],txEditing=null,bankFilter=\'all\',','estado');
once('teamNotes=read(K.n,[]);','teamNotes=read(K.n,[]);transactions=mergeTx(read(K.t,[]),[]);','hydrate local');
once('teamNotes=[...m.values()]}await save(true)}','teamNotes=[...m.values()];transactions=mergeTx(Array.isArray(d[0].settings?.transactions)?d[0].settings.transactions:[],transactions)}await save(true)}','hydrate nuvem');
once('write(K.n,teamNotes);if(!user)return;','write(K.n,teamNotes);write(K.t,transactions);if(!user)return;','save local');
once("settings:{mode:'analysis',teamNotes}","settings:{mode:'analysis',teamNotes,transactions}",'save nuvem');

// O Auth do Supabase devolve o erro em "msg"; sem lê-lo, senha errada aparecia como "Falha na conexão".
once("throw Error(d?.message||d?.error_description||d?.error||'Falha na conexão')","throw Error(d?.message||d?.msg||d?.error_description||d?.error||'Falha na conexão')",'mensagem de erro do login');

// Navegação
const navOld='<button data-page="notes">Anotações</button><button data-page="settings">Ajustes</button>';
const navNew='<button data-page="bank">Banca</button><button data-page="notes">Anotações</button><button data-page="settings">Ajustes</button>';
if(html.split(navOld).length!==3)throw Error('Menus lateral e mobile não encontrados');
html=html.split(navOld).join(navNew);
once("else if(page==='notes')notes();","else if(page==='bank')bank();else if(page==='notes')notes();",'render');
once("notes:'Anotações',settings:'Ajustes'}[p]","bank:'Banca',notes:'Anotações',settings:'Ajustes'}[p]",'titulo da pagina');

// Página Banca
const banca=fs.readFileSync('banca1831.js','utf8').split('\n').filter(l=>!l.startsWith('//')).join('\n');
once('function settings(){',banca+'\nfunction settings(){','pagina banca');

const css=`
/* Banca 1.8.31 */
.bank-topline{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-bottom:12px}.bank-topline p{flex:1;min-width:240px;font-size:12px}
.bank-grid{display:grid;grid-template-columns:minmax(280px,380px) minmax(0,1fr);gap:14px;margin-bottom:14px}.bank-grid+.bank-card,.bank-card{margin-bottom:14px}
.bank-form{display:grid;gap:12px}.bank-form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.bank-type{display:grid;grid-template-columns:1fr 1fr;gap:8px}.bank-type label{position:relative}.bank-type input{position:absolute;inset:0;opacity:0;pointer-events:none}.bank-type span{display:block;text-align:center;padding:10px;border:1px solid var(--line);border-radius:10px;font-weight:850;cursor:pointer;color:var(--mu)}
.bank-type input[value=deposit]:checked+span{border-color:var(--g);color:var(--g);background:rgba(0,208,132,.08)}.bank-type input[value=withdraw]:checked+span{border-color:var(--r);color:var(--r);background:rgba(255,102,94,.08)}
.bank-table-wrap{overflow-x:auto;border-radius:10px}.bank-table{width:100%;min-width:640px;border-collapse:collapse}.bank-table th{background:#202523;color:#95a5a1;font-size:9px;text-align:left;padding:11px 12px;white-space:nowrap;text-transform:uppercase}.bank-table td{padding:12px;border-bottom:1px solid var(--line);white-space:nowrap}.bank-table td small{display:block;color:var(--mu);font-size:10px;margin-top:2px}.bank-grid>.card{min-width:0}.bank-table.compact{min-width:0}.bank-table.compact td,.bank-table.compact th{padding-left:8px;padding-right:8px}.bank-table tfoot td{border-bottom:0;border-top:1px solid #3a3a3a}
.bank-house{cursor:pointer;transition:background .15s}.bank-house:hover{background:rgba(0,208,132,.05)}.bank-house.on{background:rgba(0,208,132,.1);box-shadow:inset 3px 0 0 var(--g)}
.bank-tx-list{display:grid;gap:8px;max-height:460px;overflow-y:auto}.bank-tx{display:grid;grid-template-columns:34px 1fr auto auto;gap:10px;align-items:center;padding:10px;border:1px solid var(--line);border-radius:12px;background:var(--p2)}.bank-tx small{display:block;color:var(--mu);font-size:11px;margin-top:2px}
.bank-tx-badge{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;font-weight:900}.bank-tx-badge.deposit{background:rgba(0,208,132,.12);color:var(--g)}.bank-tx-badge.withdraw{background:rgba(255,102,94,.12);color:var(--r)}
.bank-dot{fill:#07100f;stroke:var(--g)}
@media(max-width:900px){.bank-grid{grid-template-columns:minmax(0,1fr)}.bank-tx{grid-template-columns:34px 1fr auto}.bank-tx .note-actions{grid-column:1/-1;justify-content:flex-end}}
</style>`;
once('</style>',css,'css banca');

if(!html.includes('function bank(){')||!html.includes('data-page="bank"'))throw Error('Banca não injetada');
fs.writeFileSync('dist/index.html',html);
console.log('BANKROL 1.8.31 gerado com sucesso');
console.log('SHA-256:',sha(html));
console.log('Bytes:',Buffer.byteLength(html));
