const fs=require('fs'),crypto=require('crypto');
require('./build1824.js');
let html=fs.readFileSync('dist/index.html','utf8');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
if(sha(html)!=='0bae5b014660c121fad3b562560782f33dd98a70b660f52a071cb33025fee283')throw Error('Base 1.8.24 divergente: '+sha(html));
function once(a,b,label){if(!html.includes(a))throw Error('Trecho ausente 1.8.25: '+label);html=html.replace(a,b)}
once('content="1.8.24-limpar-filtros-historico"','content="1.8.25-analista-no-topo"','release');
once('<title>Bankrol Lab - Limpar filtros do Histórico 1.8.24</title>','<title>Bankrol Lab - Analista no topo da Nova Análise 1.8.25</title>','titulo');
once('Versão 1.8.24 — histórico mantém filtros após editar e recupera o botão Limpar filtros.','Versão 1.8.25 — Analista fixo na parte superior da Nova Análise.','nota versao');
once('.form-row-top{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;max-width:720px}', '.form-row-top{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;max-width:1000px}','layout superior');
const oldTop=`<div class="form-block type-block">
  <div class="form-row-top">
    <div class="field">
      <label>MÚLTIPLA / SIMPLES</label>
      <select name="type" id="analysisType">
        <option value="simple" \${!isMulti?'selected':''}>Simples</option>
        <option value="multiple" \${isMulti?'selected':''}>Múltipla</option>
      </select>
    </div>
    <div class="field"><label>DATA</label><input name="date" type="date" value="\${r?.date||new Date().toISOString().slice(0,10)}" required></div>
  </div>
</div>`;
const newTop=`<div class="form-block type-block">
  <div class="form-row-top">
    <div class="field" id="analystField"><label>ANALISTA</label><input name="analyst" value="\${esc(r?.analyst||'')}"></div>
    <div class="field">
      <label>MÚLTIPLA / SIMPLES</label>
      <select name="type" id="analysisType">
        <option value="simple" \${!isMulti?'selected':''}>Simples</option>
        <option value="multiple" \${isMulti?'selected':''}>Múltipla</option>
      </select>
    </div>
    <div class="field"><label>DATA</label><input name="date" type="date" value="\${r?.date||new Date().toISOString().slice(0,10)}" required></div>
  </div>
</div>`;
once(oldTop,newTop,'topo da Nova Análise');
const oldAnalyst=`<div class="form-block" id="simpleAnalystBlock">
  <div class="form-row-3" id="simpleAnalystRow">
    <div class="field" id="analystField"><label>ANALISTA</label><input name="analyst" value="\${esc(r?.analyst||'')}"></div>
    <div class="field" id="valueField"><label>VALOR SIMULADO</label><input name="analysisWeight" type="text" inputmode="decimal" value="\${r?decimalText(r.analysisWeight,2):''}" placeholder="0,00"></div>
    <div class="field simple-only"><label>COTAÇÃO</label><input name="confidenceIndex" type="text" inputmode="decimal" value="\${r?decimalText(r.confidenceIndex,3):''}" placeholder="0,000"></div>
  </div>
</div>`;
const newAnalyst=`<div class="form-block" id="simpleAnalystBlock">
  <div class="form-row-3" id="simpleAnalystRow">
    <div class="field" id="valueField"><label>VALOR SIMULADO</label><input name="analysisWeight" type="text" inputmode="decimal" value="\${r?decimalText(r.analysisWeight,2):''}" placeholder="0,00"></div>
    <div class="field simple-only"><label>COTAÇÃO</label><input name="confidenceIndex" type="text" inputmode="decimal" value="\${r?decimalText(r.confidenceIndex,3):''}" placeholder="0,000"></div>
  </div>
</div>`;
once(oldAnalyst,newAnalyst,'linha Valor/Cotação');
once('[platformField,analystField,valueField,timingField].forEach(el=>multipleCommonRow.appendChild(el));','[platformField,valueField,timingField].forEach(el=>multipleCommonRow.appendChild(el));','movimentacao multipla');
once('simpleAnalystRow.append(analystField,valueField);','simpleAnalystRow.append(valueField);','retorno simples');
if((html.match(/id="analystField"/g)||[]).length!==1||(html.match(/name="analyst"/g)||[]).length!==1)throw Error('Analista duplicado ou ausente');
const target='049cb0652fe3b89f7a14cd4493a6f6b0c6773fe242f4e4a74add513662c99eb4';
if(sha(html)!==target)throw Error('SHA final 1.8.25 divergente: '+sha(html));
fs.writeFileSync('dist/index.html',html);
console.log('BANKROL 1.8.25 gerado com sucesso');console.log('SHA-256:',sha(html));console.log('Bytes:',Buffer.byteLength(html));
