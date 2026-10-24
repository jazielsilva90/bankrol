const fs=require('fs'),crypto=require('crypto');
require('./build1834.js');
let html=fs.readFileSync('dist/index.html','utf8');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
function once(a,b,label){if(!html.includes(a))throw Error('Trecho ausente 1.8.35: '+label);html=html.replace(a,()=>b)}

once('content="1.8.34-novo-logo"','content="1.8.35-logo-celular"','release');
once('<title>Bankrol - Gestão de Banca 1.8.34</title>','<title>Bankrol - Gestão de Banca</title>','titulo');
once('Versão 1.8.34 — Novo logo e novos nomes: Nova Aposta, Tipster, Green e RED.','Versão 1.8.35 — Logo também no celular e ícone novo na tela inicial.','nota versao');

// No celular (até 720px) o menu lateral some, e com ele o logo: mostra a marca no topo da página.
const mark=fs.readFileSync('dist/index.html','utf8').match(/<svg class="brand-mark"[^]*?<\/svg>/)[0].replace(/bkAuth|bkSide/g,'bkMob').replace(/width="\d+" height="\d+"/,'width="30" height="30"');
once('<main><header class="top">',`<main><div class="mobile-brand">${mark}<span class="logo-name">BANKROL</span><small>Gestão de Banca</small></div><header class="top">`,'logo celular');

// iOS não usa SVG como ícone da tela inicial: publica PNGs e aponta os links para eles.
for(const s of [32,180,512])fs.copyFileSync(`icons/icon-${s}.png`,`dist/icon-${s}.png`);
html=html.replace(/<link rel="apple-touch-icon" href="[^"]*">/,'<link rel="apple-touch-icon" sizes="180x180" href="/icon-180.png?v=1835"><link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png?v=1835"><link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png?v=1835"><meta name="apple-mobile-web-app-title" content="Bankrol">');
if(!html.includes('/icon-180.png?v=1835'))throw Error('apple-touch-icon não substituído');

once('</style>',`
/* Logo no celular 1.8.35 */
.mobile-brand{display:none}
@media(max-width:720px){.mobile-brand{display:flex;align-items:center;gap:9px;padding:2px 0 12px;margin-bottom:10px;border-bottom:1px solid var(--line)}.mobile-brand .logo-name{font-size:16px}.mobile-brand small{color:var(--g);font-size:9px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;margin-left:auto}}
</style>`,'css logo celular');

fs.writeFileSync('dist/index.html',html);
console.log('BANKROL 1.8.35 gerado com sucesso');
console.log('SHA-256:',sha(html));
console.log('Bytes:',Buffer.byteLength(html));
