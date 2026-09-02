const fs=require('fs'),crypto=require('crypto');
require('./build1829.js');
let html=fs.readFileSync('dist/index.html','utf8');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
function once(a,b,label){if(!html.includes(a))throw Error('Trecho ausente 1.8.30: '+label);html=html.replace(a,b)}

once('content="1.8.29-fuso-sp-valor-antes-cotacao"','content="1.8.30-ordem-visual-valor-cotacao"','release');
once('<title>Bankrol Lab - Fuso SP e Valor antes da Cotação 1.8.29</title>','<title>Bankrol Lab - Valor Simulado antes da Cotação 1.8.30</title>','titulo');
once('Versão 1.8.29 — Hoje usa America/Sao_Paulo e Valor Simulado permanece antes da Cotação na Nova Análise.','Versão 1.8.30 — Corrige a ordem visual da Nova Análise para Valor Simulado antes da Cotação e mantém o fuso America/Sao_Paulo.','nota versao');

// O HTML já nasce como Valor Simulado | Cotação, porém a rotina de troca Simples/Múltipla
// movia valueField para o fim da linha com append(), invertendo visualmente os campos.
once('simpleAnalystRow.append(valueField);','simpleAnalystRow.prepend(valueField);','ordem dinâmica Valor Simulado | Cotação');

if(html.indexOf('<label>VALOR SIMULADO</label>')<0||html.indexOf('<label>COTAÇÃO</label>')<0||html.indexOf('<label>VALOR SIMULADO</label>')>html.indexOf('<label>COTAÇÃO</label>'))throw Error('Ordem HTML Valor Simulado | Cotação inválida');
if(!html.includes('simpleAnalystRow.prepend(valueField);'))throw Error('Ordem dinâmica não corrigida');
if(html.includes('simpleAnalystRow.append(valueField);'))throw Error('Rotina antiga ainda presente');
if(html.includes('new Date().toISOString().slice(0,10)'))throw Error('Ainda existe cálculo de Hoje em UTC');

fs.writeFileSync('dist/index.html',html);
console.log('BANKROL 1.8.30 gerado com sucesso');
console.log('SHA-256:',sha(html));
console.log('Bytes:',Buffer.byteLength(html));
