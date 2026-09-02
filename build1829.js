const fs=require('fs'),crypto=require('crypto');
require('./build1827.js');
let html=fs.readFileSync('dist/index.html','utf8');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
function once(a,b,label){if(!html.includes(a))throw Error('Trecho ausente 1.8.29: '+label);html=html.replace(a,b)}

once('content="1.8.27-valor-antes-cotacao"','content="1.8.29-fuso-sp-valor-antes-cotacao"','release');
once('<title>Bankrol Lab - Valor antes da Cotação 1.8.27</title>','<title>Bankrol Lab - Fuso SP e Valor antes da Cotação 1.8.29</title>','titulo');
once('Versão 1.8.27 — Valor Simulado exibido antes da Cotação na Nova Análise.','Versão 1.8.29 — Hoje usa America/Sao_Paulo e Valor Simulado permanece antes da Cotação na Nova Análise.','nota versao');

const utcToday="new Date().toISOString().slice(0,10)";
const saoPauloToday="new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())";
if((html.match(/new Date\(\)\.toISOString\(\)\.slice\(0,10\)/g)||[]).length<2)throw Error('Referências UTC de Hoje não encontradas');
html=html.replaceAll(utcToday,saoPauloToday);

if(html.indexOf('<label>VALOR SIMULADO</label>')<0||html.indexOf('<label>COTAÇÃO</label>')<0||html.indexOf('<label>VALOR SIMULADO</label>')>html.indexOf('<label>COTAÇÃO</label>'))throw Error('Ordem Valor Simulado | Cotação inválida');
if(html.includes('new Date().toISOString().slice(0,10)'))throw Error('Ainda existe cálculo de Hoje em UTC');

fs.writeFileSync('dist/index.html',html);
console.log('BANKROL 1.8.29 gerado com sucesso');
console.log('SHA-256:',sha(html));
console.log('Bytes:',Buffer.byteLength(html));
