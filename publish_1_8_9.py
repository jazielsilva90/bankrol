from pathlib import Path
import re

p = Path('index.html')
html = p.read_text(encoding='utf-8')

def rep(old, new, count=0):
    global html
    if old not in html:
        raise RuntimeError(f'Trecho não encontrado: {old[:120]}')
    html = html.replace(old, new, count)

# País no cadastro e normalização
rep("competition:r.competition||'',homeTeam:r.homeTeam||''", "country:r.country||'',competition:r.competition||'',homeTeam:r.homeTeam||''", 1)
rep("const fields=['sport','competition','homeTeam'", "const fields=['sport','country','competition','homeTeam'", 1)
rep("if(['competition','homeTeam','awayTeam','mainTeam'].includes(name)", "if(['country','competition','homeTeam','awayTeam','mainTeam'].includes(name)", 1)
rep("['competition','homeTeam','awayTeam','mainTeam'].forEach", "['country','competition','homeTeam','awayTeam','mainTeam'].forEach", 1)
rep("<div class=\"field\"><label>ESPORTE</label><input name=\"sport\" value=\"${esc(r?.sport||'Futebol')}\" required></div><div class=\"field\"><label>COMPETIÇÃO</label><input name=\"competition\" value=\"${esc(r?.competition||'')}\"></div>", "<div class=\"field\"><label>ESPORTE</label><input name=\"sport\" value=\"${esc(r?.sport||'Futebol')}\" required></div><div class=\"field\"><label>PAÍS</label><input name=\"country\" value=\"${esc(r?.country||'')}\"></div><div class=\"field\"><label>COMPETIÇÃO</label><input name=\"competition\" value=\"${esc(r?.competition||'')}\"></div>", 1)
rep("<div class=\"selection-grid\"><div class=\"field\"><label>CASA</label><input data-i=\"${i}\" data-k=\"homeTeam\" value=\"${esc(x.homeTeam||'')}\"></div>", "<div class=\"selection-grid\"><div class=\"field\"><label>PAÍS</label><input data-i=\"${i}\" data-k=\"country\" value=\"${esc(x.country||'')}\"></div><div class=\"field\"><label>COMPETIÇÃO</label><input data-i=\"${i}\" data-k=\"competition\" value=\"${esc(x.competition||'')}\"></div><div class=\"field\"><label>CASA</label><input data-i=\"${i}\" data-k=\"homeTeam\" value=\"${esc(x.homeTeam||'')}\"></div>", 1)
html = html.replace("{homeTeam:'',awayTeam:'',mainTeam:'',market:'',strategy:'',odd:'',result:'pending'}", "{country:'',competition:'',homeTeam:'',awayTeam:'',mainTeam:'',market:'',strategy:'',odd:'',result:'pending'}")
rep("o.homeTeam=`Múltipla (${valid.length} seleções)`;", "o.country=[...new Set(valid.map(x=>x.country).filter(Boolean))].join(' / ');o.competition=[...new Set(valid.map(x=>x.competition).filter(Boolean))].join(' / ');o.homeTeam=`Múltipla (${valid.length} seleções)`;", 1)

# Histórico e pesquisa
rep("[r.homeTeam,r.awayTeam,r.mainTeam,r.market,r.strategy,r.competition", "[r.homeTeam,r.awayTeam,r.mainTeam,r.market,r.strategy,r.country,r.competition", 1)
rep("${th('Esporte','sport')}${th('Evento','event')}", "${th('Esporte','sport')}${th('País','country')}${th('Evento','event')}", 1)
rep("sport:text(r.sport),event:text", "sport:text(r.sport),country:text(r.country),event:text", 1)
rep("<td><b>${esc(r.sport||'—')}</b></td><td>${r.type==='multiple'", "<td><b>${esc(r.sport||'—')}</b></td><td><b>${esc(r.country||'Não informado')}</b></td><td>${r.type==='multiple'", 1)
rep("<small>${esc(r.competition||'Sem competição')}</small>", "<small>${esc(s.country||r.country||'Sem país')} · ${esc(s.competition||r.competition||'Sem competição')}</small>", 1)
# Corrige linha de registro simples no histórico
rep("<small>${esc(s.country||r.country||'Sem país')} · ${esc(s.competition||r.competition||'Sem competição')}</small>`}</td>", "<small>${esc(r.country||'Sem país')} · ${esc(r.competition||'Sem competição')}</small>`}</td>", 1)

# Dashboard por país
rep("markets=rank(analysisList,r=>r.market),months=", "markets=rank(analysisList,r=>r.market),countries=rank(analysisList,r=>r.country),months=", 1)
rep("${insightCard('Análise por mercado',markets,'category')}", "${insightCard('Análise por país',countries,'country')}${insightCard('Análise por mercado',markets,'category')}", 1)
rep("category:['Categorias','Melhor categoria'],generic:", "category:['Categorias','Melhor categoria'],country:['Países','Melhor país'],generic:", 1)
rep("type==='category'?'Categoria':type==='platform'", "type==='country'?'País':type==='category'?'Categoria':type==='platform'", 1)
rep("const dimensions={homeTeam:'Time da casa'", "const dimensions={country:'País',homeTeam:'Time da casa'", 1)

# Semana atual e múltipla conta como um registro
rep("${weekdayAnalysis(analysisList)}</article>", "${weekdayAnalysis(list)}</article>", 1)
rep("function weekdayAnalysis(list){const names=['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],rows=names.map((name,i)=>{const xs=list.filter(r=>new Date(r.date+'T12:00:00').getDay()===i),s=stats(xs);", "function weekdayAnalysis(list){const names=['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'],today=new Date(),todayDay=today.getDay(),weekStart=new Date(today);weekStart.setHours(0,0,0,0);weekStart.setDate(today.getDate()-todayDay);const weekEnd=new Date(weekStart);weekEnd.setDate(weekStart.getDate()+7);const weekList=list.filter(r=>{const d=new Date(r.date+'T12:00:00');return d>=weekStart&&d<weekEnd}),rows=names.map((name,i)=>{const xs=weekList.filter(r=>new Date(r.date+'T12:00:00').getDay()===i),s=stats(xs);", 1)

# Top 10
html = html.replace('TOP 5','TOP 10').replace('BOTTOM 5','BOTTOM 10').replace('os 5 melhores e os 5 piores','os 10 melhores e os 10 piores').replace('ordered.slice(0,5)','ordered.slice(0,10)').replace('reverse().slice(0,5)','reverse().slice(0,10)')

# Lógica analítica das múltiplas: cada seleção como análise simples com valor dividido
start = html.index('function expanded(list){')
end = html.index('function multiEventsHtml', start)
expanded = "function expanded(list){return(list||[]).flatMap(r=>{if(!(r?.type==='multiple'&&Array.isArray(r.selections)&&r.selections.length))return[r];const activeCount=Math.max(1,r.selections.filter(s=>(s.result||'pending')!=='void').length),share=num(r.analysisWeight)/activeCount;return r.selections.map((s,i)=>{const result=s.result||'pending',odd=num(s.odd),impact=result==='success'?share*Math.max(odd-1,0):result==='failure'?-share:0;return{...r,parentId:r.id,id:`${r.id}::${i}`,isMultipleSelection:true,country:s.country||r.country||'',competition:s.competition||r.competition||'',homeTeam:s.homeTeam||'',awayTeam:s.awayTeam||'',mainTeam:s.mainTeam||'',mainTeamSide:(s.mainTeam&&(s.mainTeam===s.homeTeam?'home':s.mainTeam===s.awayTeam?'away':''))||'',market:s.market||r.market||'Geral',strategy:s.strategy||'',confidenceIndex:odd,result,analysisWeight:share,impactScore:impact}})})}"
html = html[:start] + expanded + html[end:]

# Cotação combinada automática e bloqueada
pattern = r",combinedOverride=\(isMulti&&r\?\.combinedOddOverride!=null\?num\(r\.combinedOddOverride\):null\);function calcMulti\(\)\{.*?\}function drawSelections\(\)"
replacement = ";function calcMulti(){const active=selections.filter(x=>x.result!=='void'),autoCombined=active.reduce((p,x)=>p*Math.max(num(x.odd),1),1),stake=num(form.elements.analysisWeight.value),potential=stake*autoCombined,profit=potential-stake;summary.innerHTML=`<div><small>Seleções</small><b>${selections.length}</b></div><div><small>Cotação combinada</small><input id=\"combinedOddInput\" type=\"text\" value=\"${quote(autoCombined)}\" readonly title=\"Calculada automaticamente pelas cotações das seleções\"></div><div><small>Retorno potencial</small><b>${money(potential)}</b></div><div><small>Lucro potencial</small><b class=\"pos\">${money(profit)}</b></div>`}function drawSelections()"
html, n = re.subn(pattern, replacement, html, count=1, flags=re.S)
if n != 1:
    raise RuntimeError('Não foi possível corrigir a cotação combinada')
rep("combined=(combinedOverride!=null&&combinedOverride!==''?num(combinedOverride):autoCombined);", "combined=autoCombined;", 1)
rep("o.combinedOddOverride=combinedOverride;", "o.combinedOddOverride=null;", 1)

# Rankings: dimensões por seleção usam expanded; gerais usam registro original
rep("const filtered=records.filter(r=>status==='all'||(status==='done'&&['success','failure'].includes(r.result))||r.result===status);", "const selectionDims=['country','competition','homeTeam','awayTeam','mainTeam','market','strategy'],base=selectionDims.includes(dim)?expanded(records):records,filtered=base.filter(r=>status==='all'||(status==='done'&&['success','failure'].includes(r.result))||r.result===status);", 1)
rep("${insightCard('Análises por esporte',rank(analysisList,r=>r.sport),'sport')}", "${insightCard('Análises por esporte',rank(list,r=>r.sport),'sport')}", 1)
rep("${insightCard('Plataforma de referência',rank(analysisList,r=>r.platform),'platform')}", "${insightCard('Plataforma de referência',rank(list,r=>r.platform),'platform')}", 1)
rep("${insightCard('Analista',rank(analysisList,r=>r.analyst),'analyst')}", "${insightCard('Analista',rank(list,r=>r.analyst),'analyst')}", 1)

# Versão
html = html.replace('content="1.8.0-rankings-validation"','content="1.8.9-multiple-logic-validation"')
html = html.replace('<title>Bankrol Lab — Rankings 1.8 Validação</title>','<title>Bankrol Lab — Múltiplas 1.8.9</title>')
html = html.replace('Versão 1.8.7 para validação. A versão oficial permanece separada.','Versão 1.8.9 — País e lógica de múltiplas.')

p.write_text(html, encoding='utf-8')
print('index.html atualizado para 1.8.9')
