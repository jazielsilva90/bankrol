const fs=require('fs'),crypto=require('crypto');
require('./build1823full.js');
let html=fs.readFileSync('dist/index.html','utf8');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
if(sha(html)!=='ff962ab4afed8aae9f590b86602cfb1865362c848d8fc5b9a7fce9bdbb6c24bb')throw Error('Base 1.8.23 divergente: '+sha(html));
function once(a,b,label){if(!html.includes(a))throw Error('Trecho ausente 1.8.24: '+label);html=html.replace(a,b)}
once('content="1.8.23-historico-filtros-persistentes"','content="1.8.24-limpar-filtros-historico"','release');
once('<title>Bankrol Lab - Histórico mantém filtros 1.8.23</title>','<title>Bankrol Lab - Limpar filtros do Histórico 1.8.24</title>','titulo');
once('grid-template-columns:2fr 1fr 1fr;gap:10px;margin:14px 0 12px','grid-template-columns:2fr 1fr 1fr 1fr auto;gap:10px;margin:14px 0 12px','layout toolbar');
once('Versão 1.8.23 — histórico mantém pesquisa, filtros e ordenação após editar uma análise.','Versão 1.8.24 — histórico mantém filtros após editar e recupera o botão Limpar filtros.','nota versao');
once('<select id="tm"><option value="all">PRÉ e LIVE</option><option value="pre">PRÉ</option><option value="live">LIVE</option></select></div><div id="records"></div></article>`;','<select id="tm"><option value="all">PRÉ e LIVE</option><option value="pre">PRÉ</option><option value="live">LIVE</option></select><button type="button" id="clearHistoryFilters" class="btn secondary">Limpar filtros</button></div><div id="records"></div></article>`;','botao limpar filtros');
once("  ['q','st','sd','tm'].forEach(id=>$('#'+id).oninput=draw);draw()\n}","  $('#clearHistoryFilters').onclick=()=>{historyState={q:'',st:'all',sd:'all',tm:'all',sortKey:null,sortDir:0};sortKey=null;sortDir=0;$('#q').value='';$('#st').value='all';$('#sd').value='all';$('#tm').value='all';draw()};\n  ['q','st','sd','tm'].forEach(id=>$('#'+id).oninput=draw);draw()\n}",'acao limpar filtros');
const target='0bae5b014660c121fad3b562560782f33dd98a70b660f52a071cb33025fee283';
if(sha(html)!==target)throw Error('SHA final 1.8.24 divergente: '+sha(html));
fs.writeFileSync('dist/index.html',html);
console.log('BANKROL 1.8.24 gerado com sucesso');console.log('SHA-256:',sha(html));console.log('Bytes:',Buffer.byteLength(html));