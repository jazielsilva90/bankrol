const fs=require('fs'),crypto=require('crypto');
require('./build1825.js');
let html=fs.readFileSync('dist/index.html','utf8');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
if(sha(html)!=='049cb0652fe3b89f7a14cd4493a6f6b0c6773fe242f4e4a74add513662c99eb4')throw Error('Base 1.8.25 divergente: '+sha(html));
function once(a,b,label){if(!html.includes(a))throw Error('Trecho ausente 1.8.27: '+label);html=html.replace(a,b)}
once('content="1.8.25-analista-no-topo"','content="1.8.27-valor-antes-cotacao"','release');
once('<title>Bankrol Lab - Analista no topo da Nova Análise 1.8.25</title>','<title>Bankrol Lab - Valor antes da Cotação 1.8.27</title>','titulo');
once('Versão 1.8.25 — Analista fixo na parte superior da Nova Análise.','Versão 1.8.27 — Valor Simulado exibido antes da Cotação na Nova Análise.','nota versao');
if(html.indexOf('<label>VALOR SIMULADO</label>')<0||html.indexOf('<label>COTAÇÃO</label>')<0||html.indexOf('<label>VALOR SIMULADO</label>')>html.indexOf('<label>COTAÇÃO</label>'))throw Error('Ordem Valor Simulado | Cotação inválida');
const target='b600ea541aa7c2d822543ca91a00aa2f3983e53c788f0bab11bdbe591d201b0f';
if(sha(html)!==target)throw Error('SHA final 1.8.27 divergente: '+sha(html));
fs.writeFileSync('dist/index.html',html);
console.log('BANKROL 1.8.27 gerado com sucesso');console.log('SHA-256:',sha(html));console.log('Bytes:',Buffer.byteLength(html));
