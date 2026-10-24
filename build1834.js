const fs=require('fs'),crypto=require('crypto');
require('./build1833.js');
let html=fs.readFileSync('dist/index.html','utf8');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
function once(a,b,label){if(!html.includes(a))throw Error('Trecho ausente 1.8.34: '+label);html=html.replace(a,()=>b)}

once('content="1.8.33-vocabulario-apostas"','content="1.8.34-novo-logo"','release');
once('<title>Bankrol Lab - Nova Aposta, Tipster, Green e RED 1.8.33</title>','<title>Bankrol - Gestão de Banca 1.8.34</title>','titulo');
once('Versão 1.8.33 — Novos nomes: Nova Aposta, Tipster, Green e RED.','Versão 1.8.34 — Novo logo e novos nomes: Nova Aposta, Tipster, Green e RED.','nota versao');

// Marca: barras crescentes com linha de tendência em seta, sobre quadrado escuro com borda verde.
const mark=(size,id='bkG')=>`<svg class="brand-mark" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#00a86b"/><stop offset="1" stop-color="#3dffa8"/></linearGradient></defs><rect x="1" y="1" width="38" height="38" rx="10" fill="#0b1712" stroke="url(#${id})" stroke-width="2"/><rect x="9" y="23" width="5" height="8" rx="1.5" fill="#00d084" opacity=".45"/><rect x="17.5" y="18" width="5" height="13" rx="1.5" fill="#00d084" opacity=".7"/><rect x="26" y="13" width="5" height="18" rx="1.5" fill="url(#${id})"/><path d="M8 20 L16 14 L22 17 L31 9" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M26 9 H31 V14" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const icon='data:image/svg+xml,'+encodeURIComponent(mark(64).replace('class="brand-mark" ','').replace('aria-hidden="true"','xmlns="http://www.w3.org/2000/svg"'));

once('<meta name="theme-color" content="#07100f">',`<meta name="theme-color" content="#07100f"><link rel="icon" type="image/svg+xml" href="${icon}"><link rel="apple-touch-icon" href="${icon}">`,'favicon');
once('<div class="logo">Bankrol Lab<small>Sports Analysis</small></div>',`<div class="logo">${mark(38,'bkSide')}<div><span class="logo-name">BANKROL</span><small>Gestão de Banca</small></div></div>`,'logo lateral');
once('<div class="brand">BANKROL LAB</div>',`<div class="brand">${mark(44,'bkAuth')}<div><span class="logo-name">BANKROL</span><small>Gestão de Banca</small></div></div>`,'logo login');
once('<p class="muted">Painel de análises esportivas sincronizado em nuvem.</p>','<p class="muted">Suas apostas e sua banca, sincronizadas em nuvem.</p>','subtitulo login');

once('</style>',`
/* Logo 1.8.34 */
.logo,.brand{display:flex;align-items:center;gap:11px}.brand{margin-bottom:18px;letter-spacing:0}
.logo-name{display:block;font-weight:900;letter-spacing:.14em;color:var(--tx);font-size:18px;line-height:1.1}.brand .logo-name{font-size:21px}
.logo small,.brand small{display:block;color:var(--g);font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;margin-top:3px}
.brand-mark{flex:none;filter:drop-shadow(0 0 10px rgba(0,208,132,.18))}
</style>`,'css logo');

fs.writeFileSync('dist/index.html',html);
console.log('BANKROL 1.8.34 gerado com sucesso');
console.log('SHA-256:',sha(html));
console.log('Bytes:',Buffer.byteLength(html));
