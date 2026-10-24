const fs=require('fs'),crypto=require('crypto');
require('./build1831.js');
let html=fs.readFileSync('dist/index.html','utf8');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
function once(a,b,label){if(!html.includes(a))throw Error('Trecho ausente 1.8.32: '+label);html=html.replace(a,()=>b)}

once('content="1.8.31-banca-depositos-saques"','content="1.8.32-recuperar-senha"','release');
once('<title>Bankrol Lab - Banca, Depósitos e Saques 1.8.31</title>','<title>Bankrol Lab - Recuperar Senha 1.8.32</title>','titulo');
once('Versão 1.8.31 — Nova aba Banca: depósitos e saques por casa de apostas, saldo estimado e visão global consolidada.','Versão 1.8.32 — Recuperação de senha por e-mail e troca de senha em Ajustes, além da aba Banca.','nota versao');

// Login: link "Esqueci minha senha" e formulário de nova senha (aberto pelo link do e-mail de recuperação).
once('<button id="authBtn" class="btn primary">Entrar</button></form>','<button id="authBtn" class="btn primary">Entrar</button><button type="button" id="forgotBtn" class="link-btn">Esqueci minha senha</button></form><form id="recoverForm" class="grid hide"><div class="field"><label>NOVA SENHA</label><input id="newPass" type="password" minlength="6" autocomplete="new-password" required></div><div class="field"><label>CONFIRMAR NOVA SENHA</label><input id="newPass2" type="password" minlength="6" autocomplete="new-password" required></div><div id="recoverMsg"></div><button id="recoverBtn" class="btn primary">Salvar nova senha</button></form>','form recuperacao');

// Ajustes: trocar a senha estando logado.
once('<article class="card danger-zone">','<article class="card password-card"><div class="card-head"><div><div class="ey">CONTA</div><h3>Alterar senha</h3></div></div><form id="passForm" class="pass-form"><div class="field"><label>NOVA SENHA</label><input name="p1" type="password" minlength="6" autocomplete="new-password" required></div><div class="field"><label>CONFIRMAR NOVA SENHA</label><input name="p2" type="password" minlength="6" autocomplete="new-password" required></div><div class="actions"><button class="btn primary">Salvar nova senha</button></div></form></article><article class="card danger-zone">','card senha');
once("$('#export').onclick=backupAll;","$('#export').onclick=backupAll;$('#passForm').onsubmit=async e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));if(f.p1!==f.p2)return toast('As senhas não conferem');try{await setPassword(f.p1,session?.access_token);e.target.reset();toast('Senha alterada')}catch(x){toast(/jwt|expired|session/i.test(x.message)?'Sessão expirada: saia e entre de novo para trocar a senha':x.message)}};",'acao senha');

const js=`
function setPassword(password,token){return api('/auth/v1/user',{method:'PUT',headers:{Authorization:'Bearer '+token},body:JSON.stringify({password})})}
$('#forgotBtn').onclick=async()=>{const em=$('#email').value.trim(),b=$('#forgotBtn');if(!em){$('#authMsg').textContent='Digite seu e-mail acima e toque de novo em "Esqueci minha senha".';$('#email').focus();return}b.disabled=true;try{await api('/auth/v1/recover?redirect_to='+encodeURIComponent(location.origin+location.pathname),{method:'POST',body:JSON.stringify({email:em})});$('#authMsg').textContent='Pronto! Se o e-mail estiver cadastrado, chega um link para criar uma nova senha. Veja também o spam.'}catch(x){$('#authMsg').textContent=x.message}finally{b.disabled=false}};
function recoveryMode(){
  const p=new URLSearchParams(location.hash.slice(1));
  if(p.get('error_description')){location.hash='';$('#authMsg').textContent=/expired|invalid/i.test(p.get('error_code')+p.get('error_description'))?'O link de recuperação expirou ou já foi usado. Peça um novo em "Esqueci minha senha".':p.get('error_description');return false}
  if(p.get('type')!=='recovery'||!p.get('access_token'))return false;
  const token=p.get('access_token'),refresh=p.get('refresh_token');location.hash='';
  $('#authTitle').textContent='Criar nova senha';$('#authForm').classList.add('hide');$('.authbox .tabs').classList.add('hide');$('#recoverForm').classList.remove('hide');
  $('#recoverForm').onsubmit=async e=>{e.preventDefault();const a=$('#newPass').value,b=$('#newPass2').value,btn=$('#recoverBtn');if(a!==b){$('#recoverMsg').textContent='As senhas não conferem.';return}btn.disabled=true;btn.textContent='Aguarde...';
    try{const u=await setPassword(a,token);session={access_token:token,refresh_token:refresh,user:u};user=u;write(K.s,session);toast('Senha alterada');await open()}
    catch(x){$('#recoverMsg').textContent=/jwt|expired/i.test(x.message)?'O link expirou. Peça um novo em "Esqueci minha senha".':x.message}
    finally{btn.disabled=false;btn.textContent='Salvar nova senha'}};
  return true
}
`;
once('(async()=>{if(session?.access_token){',js+'(async()=>{if(recoveryMode())return;if(session?.access_token){','init recuperacao');

once('</style>',`
/* Senha 1.8.32 */
.link-btn{background:none;border:0;color:var(--mu);font-weight:700;cursor:pointer;padding:4px 0;text-decoration:underline;justify-self:center}.link-btn:hover{color:var(--g)}
#recoverMsg,#authMsg{color:var(--a);font-size:13px}.password-card{margin-top:14px}.pass-form{display:grid;grid-template-columns:1fr 1fr auto;gap:12px;align-items:end}
@media(max-width:720px){.pass-form{grid-template-columns:1fr}}
</style>`,'css senha');

fs.writeFileSync('dist/index.html',html);
console.log('BANKROL 1.8.32 gerado com sucesso');
console.log('SHA-256:',sha(html));
console.log('Bytes:',Buffer.byteLength(html));
