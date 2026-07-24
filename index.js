/**
 * ANNOUNCER PRO — Cloudflare Worker
 * Serve o painel de criação de anúncios e chama a API do Claude.
 * Segredos (Settings > Variables and Secrets no painel do Cloudflare):
 *   - ANTHROPIC_API_KEY  (obrigatório)  sk-ant-...
 *   - MODEL              (opcional)     ex.: claude-3-5-sonnet-latest
 */

const SYSTEM_PROMPT = `Você é o ANNOUNCER PRO, um redator/analista sênior de e-commerce das lojas Sayonara / Dona Begô / Purifácil (Mercado Livre, Shopee, Amazon, Magalu, TikTok Shop, Google Shopping). Crie o melhor anúncio possível para o produto informado, com dados verdadeiros. Entregue em português do Brasil.

REGRAS DA CASA (obrigatórias):
- MARCA OFICIAL = SAYONARA (única com registro). Nunca cadastre Dona Begô/Purifácil como marca.
- TOM = técnico + persuasivo: dado concreto que gera confiança + gatilho de venda. Traduza característica em benefício. Sem exagero proibido ("melhor do mercado", "cura", "100% garantido").
- PREVENÇÃO DE DEVOLUÇÃO: destaque voltagem, medidas, compatibilidade, conteúdo da embalagem e limitações. Se faltar dado crítico, marque [CONFIRMAR].
- REGRA DE OURO DOS COMPATÍVEIS (refil/peça): se o produto for compatível, a marca do anúncio é a marca REAL do produto (nunca a do original); NUNCA use "original" para descrever o produto; título no formato "Refil [Tipo] [Marca real] Compatível com [Marca/Modelo original]"; inclua na descrição o aviso: "Este produto é da marca [MARCA REAL] e é um item COMPATÍVEL/similar. NÃO é o original da [MARCA ORIGINAL]. A marca [MARCA ORIGINAL] é citada apenas para indicar compatibilidade. Todas as marcas pertencem aos seus donos, sem vínculo com a [MARCA REAL]."

REGRAS POR CANAL:
- Mercado Livre comum: TÍTULO máx 60 caracteres, começando pela palavra-chave mais buscada + atributos; catálogo (/p/) pode ter título longo. Descrição em texto puro, sem preço/contato/link externo. Ficha técnica completa.
- Shopee: título ~100 caracteres com sinônimos; descrição escaneável + FAQ.
- Amazon: título Marca+Modelo+Tipo+atributos, sem preço/promo/emoji; 5 bullets de benefício.
- Magalu: objetivo, marca+atributos. TikTok Shop: curto e apelativo, vídeo é o rei. Google Shopping: Marca+Produto+Atributo, GTIN importa.

IMAGENS: entregue o roteiro de 9 artes com PROMPTS prontos pra IA. A capa é fundo branco puro, sem texto. Todo prompt manda usar a FOTO REAL do produto (em anexo, quando houver) como referência e manter o produto IDÊNTICO; formato 1:1, 1200x1200.

FORMATO DA ENTREGA (markdown), adaptando profundidade ao pedido:
1. Resumo executivo + pendências [CONFIRMAR]
2. Palavras-chave (essenciais, secundárias, cauda longa, negativas)
3. Títulos por canal solicitado (com contagem de caracteres no ML comum) + alternativas
4. Descrição pronta pra colar (por canal)
5. Bullets, FAQ, objeções tratadas, ficha técnica, conteúdo da embalagem, avisos
6. Roteiro + prompts das 9 imagens
7. (se pedido completo) roteiros de vídeo 15/30/60s e estratégia comercial
8. Nota final 0–100 + plano de melhoria.`;

async function handleGenerate(request, env) {
  if (!env.ANTHROPIC_API_KEY) {
    return json({ error: "Falta configurar ANTHROPIC_API_KEY no Cloudflare (Settings > Variables and Secrets)." }, 500);
  }
  let body;
  try { body = await request.json(); } catch { return json({ error: "JSON inválido." }, 400); }

  const brief = String(body.brief || "").slice(0, 20000);
  const content = [{ type: "text", text: "Crie o anúncio a partir deste briefing:\n\n" + brief }];

  // imagem opcional (base64 data URL)
  if (body.imageBase64 && body.mediaType) {
    content.push({
      type: "image",
      source: { type: "base64", media_type: body.mediaType, data: body.imageBase64 }
    });
  }

  const payload = {
    model: env.MODEL || "claude-3-5-sonnet-latest",
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content }]
  };

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(payload)
  });

  if (!r.ok) {
    const t = await r.text();
    return json({ error: "Erro da API do Claude (" + r.status + "): " + t.slice(0, 500) }, 502);
  }
  const data = await r.json();
  const text = (data.content || []).map(b => b.text || "").join("\n").trim();
  return json({ result: text });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/generate" && request.method === "POST") {
      return handleGenerate(request, env);
    }
    return new Response(HTML, { headers: { "content-type": "text/html; charset=utf-8" } });
  }
};

const HTML = String.raw`<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>ANNOUNCER PRO — Criação de Anúncios</title>
<style>
:root{--bg:#f4f6f8;--card:#fff;--ink:#0f172a;--muted:#64748b;--line:#e2e8f0;--accent:#0d9488;--accent-d:#0f766e;--soft:#ccfbf1;--warn:#dc2626}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;padding-bottom:50px}
header{background:linear-gradient(135deg,#0f766e,#0d9488);color:#fff;padding:20px}
header .w{max-width:1150px;margin:0 auto}header h1{margin:0;font-size:1.3rem}header p{margin:4px 0 0;opacity:.9;font-size:.85rem}
.container{max-width:1150px;margin:20px auto;padding:0 14px;display:grid;grid-template-columns:1fr 440px;gap:16px}
@media(max-width:920px){.container{grid-template-columns:1fr}}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:16px;margin-bottom:14px;box-shadow:0 1px 3px rgba(15,23,42,.05)}
.card h2{margin:0 0 4px;font-size:.9rem}.hint{color:var(--muted);font-size:.76rem;margin:0 0 12px}
label{display:block;font-size:.75rem;font-weight:600;color:#334155;margin:0 0 4px}
input,select,textarea{width:100%;padding:9px 10px;border:1px solid var(--line);border-radius:9px;font-size:.85rem;font-family:inherit}
input:focus,select:focus,textarea:focus{outline:none;border-color:var(--accent)}
textarea{resize:vertical;min-height:70px}.field{margin-bottom:10px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:10px}.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px}
@media(max-width:600px){.g2,.g3{grid-template-columns:1fr}}
.chips{display:flex;flex-wrap:wrap;gap:7px}.chip{border:1px solid var(--line);background:#fff;border-radius:999px;padding:6px 12px;font-size:.8rem;cursor:pointer}
.chip.on{background:var(--accent);color:#fff;border-color:var(--accent)}
.imgbtn{border:2px dashed var(--line);border-radius:11px;padding:18px;text-align:center;cursor:pointer;background:#fbfdfe}
.imgbtn:hover{border-color:var(--accent);background:var(--soft)}.imgbtn strong{color:var(--accent-d)}
.thumbs{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}.thumb{width:70px;height:70px;border-radius:8px;overflow:hidden;border:1px solid var(--line);position:relative}
.thumb img{width:100%;height:100%;object-fit:cover}.thumb span{position:absolute;top:1px;right:1px;background:rgba(0,0,0,.6);color:#fff;border-radius:50%;width:16px;height:16px;font-size:11px;line-height:16px;text-align:center;cursor:pointer}
.sw{display:flex;align-items:center;gap:9px;padding:8px 0}.switch{position:relative;width:44px;height:24px}.switch input{opacity:0;width:0;height:0}
.sl{position:absolute;inset:0;background:#cbd5e1;border-radius:999px;cursor:pointer;transition:.2s}.sl:before{content:"";position:absolute;width:18px;height:18px;left:3px;top:3px;background:#fff;border-radius:50%;transition:.2s}
.switch input:checked+.sl{background:var(--accent)}.switch input:checked+.sl:before{transform:translateX(20px)}
.compat{display:none;margin-top:8px;padding:12px;background:var(--soft);border-radius:10px}.compat.show{display:block}
.side{position:sticky;top:14px;align-self:start}@media(max-width:920px){.side{position:static}}
.btn{display:block;width:100%;padding:12px;border:none;border-radius:10px;font-size:.9rem;font-weight:700;cursor:pointer}
.btn-p{background:var(--accent);color:#fff}.btn-p:hover{background:var(--accent-d)}.btn-p:disabled{opacity:.6;cursor:wait}
.btn-g{background:#fff;border:1px solid var(--line);margin-top:8px}
#out{white-space:pre-wrap;font-size:.8rem;background:#fff;border:1px solid var(--line);border-radius:10px;padding:14px;max-height:460px;overflow:auto;margin-top:12px;line-height:1.55}
.spin{display:none;text-align:center;color:var(--muted);font-size:.82rem;padding:20px}
.req{color:var(--warn)}
</style></head><body>
<header><div class="w"><h1>🚀 ANNOUNCER PRO — Criação de Anúncios</h1>
<p>Preencha, clique em Gerar e o anúncio sai pronto na tela. Marca oficial: Sayonara.</p></div></header>
<div class="container">
<div>
 <div class="card"><h2>1 · Modo</h2>
  <div class="chips" id="modo"><div class="chip on" data-v="Criar anúncio novo">Criar novo</div><div class="chip" data-v="Otimizar existente">Otimizar</div><div class="chip" data-v="Replicar em outra cor/variação">Replicar cor</div><div class="chip" data-v="Adaptar para outro canal">Adaptar canal</div></div></div>
 <div class="card"><h2>2 · Imagem de referência <span class="req">*</span></h2><p class="hint">Foto real do produto (fundo branco de preferência).</p>
  <label class="imgbtn" for="img">📷 <strong>Importar imagem</strong></label><input id="img" type="file" accept="image/*" hidden><div class="thumbs" id="thumbs"></div></div>
 <div class="card"><h2>3 · Informações do produto</h2>
  <div class="g2"><div class="field"><label>Nome <span class="req">*</span></label><input id="nome" placeholder="Panela de Pressão 4,2L"></div><div class="field"><label>Marca</label><input id="marca" value="Sayonara"></div></div>
  <div class="g3"><div class="field"><label>Categoria</label><input id="cat"></div><div class="field"><label>Cor/Variação</label><input id="cor"></div><div class="field"><label>Preço R$</label><input id="preco"></div></div>
  <div class="g3"><div class="field"><label>Voltagem</label><select id="volt"><option value="">—</option><option>Bivolt</option><option>110/127V</option><option>220V</option><option>Não elétrico</option></select></div><div class="field"><label>Capac./Potência</label><input id="cap"></div><div class="field"><label>EAN/GTIN</label><input id="ean"></div></div>
  <div class="g3"><div class="field"><label>Medidas</label><input id="med"></div><div class="field"><label>Peso</label><input id="peso"></div><div class="field"><label>Garantia</label><input id="gar"></div></div>
  <div class="field"><label>Diferenciais</label><input id="dif" placeholder="sem PFOA, fundo duplo, 3 sistemas de segurança"></div>
  <div class="field"><label>INMETRO/Certificação</label><input id="inmetro"></div></div>
 <div class="card"><h2>4 · É refil/compatível?</h2><p class="hint">Liga a Regra de Ouro (protege de bloqueio).</p>
  <div class="sw"><label class="switch"><input type="checkbox" id="ct"><span class="sl"></span></label><span style="font-size:.85rem">Sim, é compatível</span></div>
  <div class="compat" id="cb"><div class="g2"><div class="field"><label>Marca REAL do produto</label><input id="marcaReal" placeholder="Hidro Filtros"></div><div class="field"><label>Compatível com (original)</label><input id="marcaOrig" placeholder="IBBL FR600"></div></div></div></div>
 <div class="card"><h2>5 · Descrição / observações</h2><textarea id="desc" placeholder="Tudo que souber do produto, uso, público..."></textarea></div>
 <div class="card"><h2>6 · Links de referência</h2>
  <div class="field"><label>Meu anúncio atual (otimização)</label><input id="linkMeu" placeholder="https://..."></div>
  <div class="field"><label>Produto similar (base quando não achar)</label><input id="linkSim" placeholder="https://..."></div></div>
 <div class="card"><h2>7 · Canais e profundidade</h2>
  <label>Canais</label><div class="chips" id="canais" style="margin-bottom:12px"><div class="chip on" data-v="Mercado Livre">Mercado Livre</div><div class="chip" data-v="Shopee">Shopee</div><div class="chip" data-v="Amazon">Amazon</div><div class="chip" data-v="Magalu">Magalu</div><div class="chip" data-v="TikTok Shop">TikTok Shop</div><div class="chip" data-v="Google Shopping">Google Shopping</div></div>
  <label>Profundidade</label><div class="chips" id="prof"><div class="chip on" data-v="Pacote completo">Completo</div><div class="chip" data-v="Rápido">Rápido</div></div></div>
</div>
<div class="side"><div class="card"><h2>✨ Resultado</h2><p class="hint">Clique e o anúncio aparece aqui.</p>
 <button class="btn btn-p" id="go">Gerar anúncio</button>
 <div class="spin" id="spin">⏳ Pesquisando e criando o anúncio… pode levar até ~30s.</div>
 <div id="out" style="display:none"></div>
 <button class="btn btn-g" id="copy" style="display:none">📎 Copiar</button></div></div>
</div>
<script>
var img=null;
function cg(id,m){var g=document.getElementById(id);g.onclick=function(e){var c=e.target.closest('.chip');if(!c)return;if(m)c.classList.toggle('on');else{[].forEach.call(g.children,function(x){x.classList.remove('on')});c.classList.add('on')}}}
cg('modo',0);cg('canais',1);cg('prof',0);
function one(id){var e=document.querySelector('#'+id+' .chip.on');return e?e.dataset.v:''}
function many(id){return[].map.call(document.querySelectorAll('#'+id+' .chip.on'),function(x){return x.dataset.v})}
function v(id){var e=document.getElementById(id);return e?e.value.trim():''}
var inp=document.getElementById('img'),th=document.getElementById('thumbs');
inp.onchange=function(){var f=inp.files[0];if(!f)return;var r=new FileReader();r.onload=function(){img={data:r.result.split(',')[1],media:f.type,url:r.result};th.innerHTML='<div class="thumb"><img src="'+r.result+'"><span data-x="1">×</span></div>'};r.readAsDataURL(f);inp.value='';};
th.onclick=function(e){if(e.target.dataset&&e.target.dataset.x){img=null;th.innerHTML=''}};
document.getElementById('ct').onchange=function(){document.getElementById('cb').classList.toggle('show',this.checked)};
function brief(){var c=document.getElementById('ct').checked;var t='';t+='Ação: '+one('modo')+'\n';t+='Profundidade: '+one('prof')+'\n';t+='Canais: '+(many('canais').join(', ')||'[CONFIRMAR]')+'\n\nPRODUTO:\n';
 t+='Nome: '+(v('nome')||'[CONFIRMAR]')+'\n';t+='Marca oficial: '+(c?(v('marcaReal')||'[CONFIRMAR]'):(v('marca')||'Sayonara'))+'\n';
 [['Categoria','cat'],['Cor/Variação','cor'],['Preço','preco'],['Voltagem','volt'],['Capacidade/Potência','cap'],['EAN/GTIN','ean'],['Medidas','med'],['Peso','peso'],['Garantia','gar'],['Diferenciais','dif'],['INMETRO','inmetro']].forEach(function(p){var val=v(p[1]);if(val)t+=p[0]+': '+val+'\n'});
 if(c){t+='\nPRODUTO COMPATÍVEL: aplicar Regra de Ouro. Marca real: '+(v('marcaReal')||'[CONFIRMAR]')+'. Compatível com: '+(v('marcaOrig')||'[CONFIRMAR]')+'. Nunca usar "original" para o produto.\n'}
 var d=v('desc');if(d)t+='\nObservações: '+d+'\n';
 var lm=v('linkMeu'),ls=v('linkSim');if(lm)t+='\nMeu anúncio: '+lm;if(ls)t+='\nSimilar base: '+ls;
 if(!img)t+='\n(Sem imagem anexada — descreva a aparência ou marque [CONFIRMAR].)';
 return t}
document.getElementById('go').onclick=function(){
 if(!v('nome')){alert('Preencha ao menos o Nome do produto.');return}
 var btn=this;btn.disabled=true;document.getElementById('spin').style.display='block';
 var out=document.getElementById('out');out.style.display='none';document.getElementById('copy').style.display='none';
 fetch('/api/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({brief:brief(),imageBase64:img?img.data:null,mediaType:img?img.media:null})})
 .then(function(r){return r.json()}).then(function(j){
   btn.disabled=false;document.getElementById('spin').style.display='none';
   out.style.display='block';out.textContent=j.result||('⚠️ '+(j.error||'Erro desconhecido.'));
   if(j.result){document.getElementById('copy').style.display='block'}
 }).catch(function(e){btn.disabled=false;document.getElementById('spin').style.display='none';out.style.display='block';out.textContent='⚠️ Falha de rede: '+e})};
document.getElementById('copy').onclick=function(){navigator.clipboard.writeText(document.getElementById('out').textContent);this.textContent='✓ Copiado';var s=this;setTimeout(function(){s.textContent='📎 Copiar'},2000)};
</script></body></html>`;
