const fs=require('fs'),crypto=require('crypto');
require('./build1822.js');
let html=fs.readFileSync('dist/index.html','utf8');
function once(a,b,label){if(!html.includes(a))throw Error('Trecho ausente 1.8.23: '+label);html=html.replace(a,b)}
once("dashSort={};const $=","dashSort={},historyState={q:'',st:'all',sd:'all',tm:'all',sortKey:null,sortDir:0};const $=",'estado dos filtros');
once("$('#add').onclick=()=>go('new');\n  const searchKey=","$('#add').onclick=()=>go('new');\n  $('#q').value=historyState.q||'';\n  $('#st').value=historyState.st||'all';\n  $('#sd').value=historyState.sd||'all';\n  $('#tm').value=historyState.tm||'all';\n  const searchKey=",'restauracao dos filtros');
once("let sortKey=null,sortDir=0;","let sortKey=historyState.sortKey||null,sortDir=historyState.sortDir||0;",'ordenacao persistente');
once("const q=searchKey($('#q').value),st=$('#st').value,sd=$('#sd').value,tm=$('#tm').value;","const rawQ=$('#q').value, q=searchKey(rawQ),st=$('#st').value,sd=$('#sd').value,tm=$('#tm').value;\n    historyState={q:rawQ,st,sd,tm,sortKey,sortDir};",'gravacao dos filtros');
html=html.replace(/<meta name="bankrol-release" content="[^"]+">/,'<meta name="bankrol-release" content="1.8.23-historico-filtros-persistentes">');
html=html.replace(/<title>[^<]*<\/title>/,'<title>Bankrol Lab - Histórico mantém filtros 1.8.23</title>');
html=html.replace(/<div class="note">Versão [^<]*<\/div><\/aside>/,'<div class="note">Versão 1.8.23 — histórico mantém pesquisa, filtros e ordenação após editar uma análise.</div></aside>');
const sha=crypto.createHash('sha256').update(html).digest('hex');
if(sha!=='ff962ab4afed8aae9f590b86602cfb1865362c848d8fc5b9a7fce9bdbb6c24bb')throw Error('SHA final 1.8.23 divergente: '+sha);
fs.mkdirSync('dist',{recursive:true});fs.writeFileSync('dist/index.html',html);
console.log('BANKROL 1.8.23 gerado com sucesso');console.log('SHA-256:',sha);console.log('Bytes:',Buffer.byteLength(html));
