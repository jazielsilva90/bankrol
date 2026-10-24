const fs=require('fs'),crypto=require('crypto');
require('./build1832.js');
let html=fs.readFileSync('dist/index.html','utf8');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
function once(a,b,label){if(!html.includes(a))throw Error('Trecho ausente 1.8.33: '+label);html=html.replace(a,()=>b)}
// Troca todas as ocorrências; exige ao menos uma para o build falhar se o texto base mudar.
function all(a,b){const n=typeof a==='string'?html.split(a).length-1:(html.match(a)||[]).length;if(!n)throw Error('Texto ausente 1.8.33: '+a);html=typeof a==='string'?html.split(a).join(b):html.replace(a,b)}

once('content="1.8.32-recuperar-senha"','content="1.8.33-vocabulario-apostas"','release');
once('<title>Bankrol Lab - Recuperar Senha 1.8.32</title>','<title>Bankrol Lab - Nova Aposta, Tipster, Green e RED 1.8.33</title>','titulo');
once('Versão 1.8.32 — Recuperação de senha por e-mail e troca de senha em Ajustes, além da aba Banca.','Versão 1.8.33 — Novos nomes: Nova Aposta, Tipster, Green e RED.','nota versao');

// Nova Análise → Nova Aposta (menu, título e formulário de cadastro)
all('>Nova Análise</button>','>Nova Aposta</button>');
all("new:'Nova Análise'","new:'Nova Aposta'");
all("${r?'Editar':'Nova'} análise</h3>","${r?'Editar':'Nova'} aposta</h3>");
all('>Salvar análise</button>','>Salvar aposta</button>');
all("toast('Análise salva')","toast('Aposta salva')");
all("confirm('Excluir esta análise?')","confirm('Excluir esta aposta?')");

// Analista → Tipster
all('<label>ANALISTA</label>','<label>TIPSTER</label>');
all("th('Analista','analyst')","th('Tipster','analyst')");
all("type==='analyst'?'Analista'","type==='analyst'?'Tipster'");
all("analyst:['Analistas','Analista destaque']","analyst:['Tipsters','Tipster destaque']");
all("insightCard('Analista',","insightCard('Tipster',");
all("analyst:'Analista'","analyst:'Tipster'");
all("'Sem analista'","'Sem tipster'");

// Acerto → Green
all("'Acerto'","'Green'");
all('>Acerto<','>Green<');
all('>Acertos<','>Greens<');
all('Taxa de acerto','Taxa de green');
all('taxa de acerto','taxa de green');
all('Acerto destaque','Green destaque');
all('Somente acertos','Somente greens');
all(/\bcertas\b/g,'greens');
all(/\bCertas\b/g,'Greens');

// Erro → RED
all("'Erro'","'RED'");
all('>Erros<','>REDs<');
all('Somente erros','Somente REDs');
all(/\berradas\b/g,'REDs');
all(/\bErradas\b/g,'REDs');

fs.writeFileSync('dist/index.html',html);
console.log('BANKROL 1.8.33 gerado com sucesso');
console.log('SHA-256:',sha(html));
console.log('Bytes:',Buffer.byteLength(html));
