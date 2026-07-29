/**
 * STUDIO DONA BEGÔ — módulo separado do ANNOUNCER PRO.
 * Etapa 1: página com a identidade da marca, ponte de entrada vinda do
 * ANNOUNCER PRO (localStorage "db_studio_entrada") e o contrato de medidas.
 * Etapa 2: ficha do produto (fotos reais + dados do SKU) e o kit das 6 fotos
 * de anúncio, uma por vez, com parada de aprovação em cada uma.
 * As etapas 3 a 6 entram nas próximas publicações.
 */
import { LOGO_HORIZ, LOGO_SIMBOLO, MARCA_CSS } from "./marca.js";

export const STUDIO_HTML = String.raw`<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>STUDIO DONA BEGÔ</title>
<link rel="icon" href="` + LOGO_SIMBOLO + String.raw`">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;800&display=swap" rel="stylesheet">
<style>` + MARCA_CSS + String.raw`
*{box-sizing:border-box}
body{margin:0;background:var(--db-fundo);color:var(--db-tinta);font-family:var(--db-fonte);padding-bottom:60px}
header{background:var(--db-branco);border-bottom:1px solid var(--db-linha);padding:14px 20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;position:sticky;top:0;z-index:9}
header img{height:38px}
.pill{background:var(--db-rosa);color:#fff;font-weight:800;font-size:.72rem;letter-spacing:.16em;padding:6px 12px;border-radius:99px}
header a{margin-left:auto;color:var(--db-cinza);text-decoration:none;font-size:.85rem;font-weight:600}
header a:hover{color:var(--db-rosa-texto)}
.wrap{max-width:1080px;margin:0 auto;padding:22px 18px}
.card{background:var(--db-branco);border:1px solid var(--db-linha);border-radius:var(--db-raio);padding:20px;margin-bottom:16px}
h1{font-size:1.5rem;font-weight:800;margin:0 0 6px}
h2{font-size:1.02rem;font-weight:800;margin:0 0 10px;color:var(--db-tinta)}
p{line-height:1.6;color:var(--db-cinza);margin:0 0 10px;font-size:.92rem}
.lead{font-size:1rem;color:var(--db-cinza)}
label{display:block;font-size:.74rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--db-cinza);margin:0 0 5px}
input,textarea,select{width:100%;padding:10px 12px;border:1px solid var(--db-linha);border-radius:10px;font-family:inherit;font-size:.95rem;color:var(--db-tinta);background:#fff}
input:focus,textarea:focus{outline:2px solid var(--db-rosa);outline-offset:-1px;border-color:var(--db-rosa)}
textarea{min-height:110px;resize:vertical;line-height:1.5}
.field{margin-bottom:12px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}
@media(max-width:640px){.g2,.g3{grid-template-columns:1fr}}
.btn{display:block;width:100%;padding:12px;border:0;border-radius:10px;font-family:inherit;font-size:.95rem;font-weight:600;cursor:pointer;margin-top:8px}
.btn-p{background:var(--db-rosa);color:#fff}
.btn-p:hover{background:var(--db-rosa-texto)}
.btn-p:active{background:var(--db-rosa-escuro)}
.btn-g{background:#fff;color:var(--db-cinza-forte);border:1px solid var(--db-linha)}
.btn-g:hover{border-color:var(--db-rosa);color:var(--db-rosa-texto)}
.aviso{background:var(--db-rosa-nevoa);border:1px solid var(--db-rosa-claro);border-left:4px solid var(--db-rosa);border-radius:10px;padding:12px 14px;font-size:.88rem;color:var(--db-cinza-forte);line-height:1.55}
.ok{background:#F1F7F1;border:1px solid #D6E8D6;border-left:4px solid #3E8E41}
.saida{background:var(--db-fundo);border:1px solid var(--db-linha);border-radius:10px;padding:14px;font-size:.92rem;line-height:1.65;color:var(--db-tinta);white-space:pre-wrap}
.passos{list-style:none;margin:0;padding:0;counter-reset:p}
.passos li{position:relative;padding:11px 0 11px 44px;border-bottom:1px solid var(--db-linha);font-size:.92rem;color:var(--db-cinza)}
.passos li:last-child{border-bottom:0}
.passos li:before{counter-increment:p;content:counter(p);position:absolute;left:0;top:9px;width:28px;height:28px;border-radius:50%;background:var(--db-fundo);color:var(--db-cinza);font-size:.78rem;font-weight:800;display:flex;align-items:center;justify-content:center;border:1px solid var(--db-linha)}
.passos li.feito:before{background:var(--db-rosa);color:#fff;border-color:var(--db-rosa)}
.passos li strong{color:var(--db-tinta);font-weight:600}
.tag{display:inline-block;font-size:.68rem;font-weight:800;letter-spacing:.08em;padding:3px 8px;border-radius:99px;margin-left:6px;vertical-align:1px}
.t-gate{background:var(--db-rosa-claro);color:var(--db-rosa-escuro)}
.t-agora{background:var(--db-rosa);color:#fff}
.t-prox{background:var(--db-fundo);color:var(--db-cinza);border:1px solid var(--db-linha)}
.chips{display:flex;flex-wrap:wrap;gap:7px}
.chip{border:1px solid var(--db-linha);border-radius:99px;padding:6px 12px;font-size:.82rem;cursor:pointer;background:#fff;color:var(--db-cinza)}
.chip.on{background:var(--db-rosa);border-color:var(--db-rosa);color:#fff;font-weight:600}
.foot{text-align:center;font-size:.78rem;color:var(--db-cinza);padding:8px 18px}
.foto{border:1px solid var(--db-linha);border-radius:12px;padding:15px;margin-bottom:14px;background:#fff}
.foto h3{font-size:.95rem;font-weight:800;margin:0 0 3px;color:var(--db-tinta)}
.foto .obj{font-size:.8rem;color:var(--db-cinza);margin:0 0 10px;font-style:italic}
.foto textarea{min-height:120px;font-size:.86rem}
.foto.aprovada{border-color:#3E8E41;background:#F7FBF7}
.tira{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 10px}
.thumb{width:62px;height:62px;object-fit:cover;border-radius:9px;border:1px solid var(--db-linha);background:#fff}
.imgout{width:100%;max-width:520px;display:block;margin:12px auto 0;border-radius:12px;border:1px solid var(--db-linha)}
.spin{font-size:.86rem;color:var(--db-rosa-texto);font-weight:600;padding:10px 0;text-align:center}
.erro{background:#FDF1F1;border:1px solid #F3C9C9;border-left:4px solid #C0392B;border-radius:10px;padding:11px 13px;font-size:.86rem;color:#7B2222;line-height:1.5;margin-top:10px}
.custo{font-size:.78rem;color:var(--db-cinza);text-align:center;margin-top:6px}
</style></head><body>
<header>
 <img src="` + LOGO_HORIZ + String.raw`" alt="Dona Begô Utilidades">
 <span class="pill">STUDIO</span>
 <a href="/">← voltar ao ANNOUNCER PRO</a>
</header>
<div class="wrap">

 <div class="card">
  <h1>Studio de conteúdo</h1>
  <p class="lead">Aqui o anúncio vira roteiro, o roteiro vira cena e a cena vira imagem ou vídeo — com as suas fotos reais e as medidas reais do produto. Cada passo caro só acontece depois que você aprova.</p>
 </div>

 <div class="card">
  <h2>Entrada — o que chegou do ANNOUNCER PRO</h2>
  <div id="entrada"></div>
 </div>

 <div class="card">
  <h2>Contrato de medidas</h2>
  <p>É aqui que se resolve o erro que mais aparece: o refil sair do tamanho do purificador. A IA não entende centímetro — ela entende comparação escrita. Preencha as alturas reais e copie a frase pronta para dentro de qualquer prompt de imagem ou de vídeo. A ordem não importa: eu descubro sozinho qual é o maior.</p>
  <div class="g2">
   <div>
    <div class="field"><label>Produto A</label><input id="mA" placeholder="Purificador IBBL FR600"></div>
    <div class="g3">
     <div class="field"><label>Altura cm</label><input id="hA" inputmode="decimal" placeholder="43"></div>
     <div class="field"><label>Largura cm</label><input id="wA" inputmode="decimal" placeholder="33"></div>
     <div class="field"><label>Prof. cm</label><input id="dA" inputmode="decimal" placeholder="35"></div>
    </div>
   </div>
   <div>
    <div class="field"><label>Produto B</label><input id="mB" placeholder="Refil SAYO S+3"></div>
    <div class="g3">
     <div class="field"><label>Altura cm</label><input id="hB" inputmode="decimal" placeholder="22"></div>
     <div class="field"><label>Diâm./Larg. cm</label><input id="wB" inputmode="decimal" placeholder="6.3"></div>
     <div class="field"><label>Prof. cm</label><input id="dB" inputmode="decimal" placeholder=""></div>
    </div>
   </div>
  </div>
  <button class="btn btn-p" id="calc">Gerar a frase de escala</button>
  <div id="escOut" style="display:none;margin-top:12px">
   <div class="saida" id="escTxt"></div>
   <button class="btn btn-g" id="escCopy">Copiar a frase</button>
  </div>
 </div>

 <div class="card">
  <h2>3 · Ficha do produto</h2>
  <p>É daqui que saem as 6 fotos do anúncio. O que estiver escrito aqui é o que a imagem vai mostrar — e só isso. Campo vazio é foto que não sai: prefiro te perguntar a inventar um detalhe que o produto não tem.</p>
  <div class="g2">
   <div class="field"><label>Nome do produto</label><input id="fNome" placeholder="Refil SAYO S+3"></div>
   <div class="field"><label>SKU</label><input id="fSku" placeholder="FER-0072"></div>
  </div>
  <div class="g2">
   <div class="field"><label>Marca</label><input id="fMarca" placeholder="Sayonara"></div>
   <div class="field"><label>Categoria</label><input id="fCat" placeholder="Refil para purificador de água"></div>
  </div>
  <div class="field"><label>Diferencial que dá para VER numa foto</label><textarea id="fDif" style="min-height:66px" placeholder="Ex.: o elemento filtrante novo, claro, ao lado de um saturado pelo uso. Só o que aparece na imagem — vazão e certificado não entram aqui."></textarea></div>
  <div class="field"><label>O que vem na caixa — item por item</label><textarea id="fCaixa" style="min-height:66px" placeholder="Ex.: 1 refil SAYO S+3 e a caixa. Nada além disso."></textarea></div>
  <div class="field"><label>Fotos reais do produto (até 4)</label><input type="file" id="fFotos" accept="image/*" multiple></div>
  <div class="tira" id="fThumbs"></div>
  <div class="aviso">A foto real é o que segura a fidelidade: cor, formato, textura e rótulo saem dela. Sem foto real eu até gero, mas aí é desenho do que a IA acha que o seu produto é — e isso não vai para anúncio.</div>
  <button class="btn btn-p" id="fMontar">Montar os 6 prompts</button>
  <div id="fMsg"></div>
 </div>

 <div class="card" id="cfotos" style="display:none">
  <h2>4 · As 6 fotos — parada 1</h2>
  <p>Uma foto por vez. Eu não sigo sozinho para a próxima: você olha, aprova ou manda refazer. Cada prompt abaixo pode ser editado antes de gerar — o texto que estiver na caixa é exatamente o que vai para a IA.</p>
  <div class="field" style="max-width:280px">
   <label>Qualidade da imagem</label>
   <select id="fQual">
    <option value="low">rascunho — cerca de R$ 0,06</option>
    <option value="medium" selected>boa, para anúncio — cerca de R$ 0,25</option>
    <option value="high">máxima — cerca de R$ 1,00</option>
   </select>
  </div>
  <div id="seis"></div>
  <div class="aviso" style="margin-top:6px"><strong>Lembrete das regras.</strong> A foto 1 é a capa: sem logo, sem selo, sem faixa — Mercado Livre e Amazon derrubam o anúncio. A foto 4 não tem rosto, só mãos, porque a API de vídeo recusa referência com rosto. E nenhuma foto escreve medida: número escrito por IA sai errado, então a escala vai por comparação.</div>
 </div>

 <div class="card">
  <h2>O caminho até o vídeo</h2>
  <p>Dez passos e quatro paradas obrigatórias. Nas paradas eu não sigo sozinho: eu pergunto e espero você responder.</p>
  <ol class="passos">
   <li class="feito"><strong>Receber o anúncio</strong> do ANNOUNCER PRO<span class="tag t-agora">no ar</span></li>
   <li class="feito"><strong>Contrato de medidas</strong> — a proporção escrita por extenso<span class="tag t-agora">no ar</span></li>
   <li class="feito"><strong>Ficha do produto</strong> — fotos reais e dados do SKU<span class="tag t-agora">no ar</span></li>
   <li class="feito"><strong>Conferir as fotos</strong> — capa, detalhe, diferencial, uso, escala, o que vem na caixa<span class="tag t-gate">parada 1</span></li>
   <li><strong>Roteiro</strong> do vídeo, no tom da Dona Begô<span class="tag t-prox">etapa 3</span></li>
   <li><strong>Aprovar o roteiro</strong> antes de virar cena<span class="tag t-gate">parada 2</span></li>
   <li><strong>Cenas e prompts</strong> com a proporção escrita dentro<span class="tag t-prox">etapa 3</span></li>
   <li><strong>Quadro-chave</strong> — uma imagem de ~R$ 0,20 antes do vídeo de ~R$ 6,60<span class="tag t-gate">parada 3</span></li>
   <li><strong>Gerar o vídeo</strong> só com o quadro aprovado como referência<span class="tag t-gate">parada 4</span></li>
   <li><strong>Arquivar</strong> na pasta do SKU<span class="tag t-prox">etapa 6</span></li>
  </ol>
 </div>

 <div class="card">
  <h2>Regras que valem em todo passo</h2>
  <p><strong>Nunca inventar um produto.</strong> Se a foto real não mostra, não entra na imagem. Sem rótulo inventado, sem botão que não existe, sem cor que o produto não tem.</p>
  <p><strong>Sem rosto humano na referência.</strong> A API do vídeo recusa foto de referência com rosto. Mãos podem.</p>
  <p><strong>O logo não vai na foto de capa.</strong> Mercado Livre e Amazon proíbem marca e selo na primeira foto — isso derruba o anúncio. O logo entra nas fotos secundárias e no vídeo.</p>
 </div>

 <div class="foot">STUDIO DONA BEGÔ · etapa 2 · o conteúdo pago só roda depois da sua aprovação</div>
</div>
<script>
function q(i){return document.getElementById(i)}
function num(i){var t=(q(i).value||'').replace(',','.').replace(/[^0-9.]/g,'');var n=parseFloat(t);return isFinite(n)&&n>0?n:0}

/* ---- entrada vinda do ANNOUNCER PRO ---- */
(function(){
 var box=q('entrada'),d=null;
 try{var raw=localStorage.getItem('db_studio_entrada');if(raw)d=JSON.parse(raw)}catch(e){}
 if(!d||!d.nome&&!d.cenas){
  box.innerHTML='<div class="aviso">Nada chegou ainda. Abra o <strong>ANNOUNCER PRO</strong>, gere o anúncio e clique em <strong>Enviar para o STUDIO</strong>. O produto, as medidas e as cenas vêm junto e caem aqui.</div>';
  return}
 var h='<div class="aviso ok"><strong>'+esc(d.nome||'Produto sem nome')+'</strong>';
 if(d.marca)h+=' · '+esc(d.marca);
 if(d.medidas)h+='<br>Medidas informadas: '+esc(d.medidas);
 if(d.compat&&d.compatCom)h+='<br>Compatível com: '+esc(d.compatCom);
 if(d.quando)h+='<br><span style="color:var(--db-cinza)">Enviado em '+esc(d.quando)+'</span>';
 h+='</div>';
 var cen=d.cenas||[],img=d.imagens||[];
 if(cen.length||img.length){
  h+='<p style="margin-top:12px">Chegaram <strong>'+cen.length+'</strong> cena(s) de vídeo e <strong>'+img.length+'</strong> prompt(s) de imagem. Clique para ler.</p><div class="chips" id="ec"></div><textarea id="etxt" style="margin-top:10px" readonly></textarea>';
 }
 box.innerHTML=h;
 if(cen.length||img.length){
  var ec=q('ec'),lista=[];
  cen.forEach(function(c,i){lista.push({r:'Cena '+(i+1)+(c.seg?' ('+c.seg+'s)':''),p:c.prompt||''})});
  img.forEach(function(p,i){lista.push({r:'Imagem '+(i+1),p:p})});
  lista.forEach(function(o,i){var el=document.createElement('div');el.className='chip';el.textContent=o.r;
   el.onclick=function(){q('etxt').value=o.p;[].forEach.call(ec.children,function(x){x.classList.remove('on')});el.classList.add('on')};
   ec.appendChild(el)});
  ec.children[0].click();
 }
 if(d.medidas){var m=(''+d.medidas).replace(',','.').match(/[0-9]+(\.[0-9]+)?/g);
  if(m&&m.length>=1&&!q('hA').value){q('hA').value=m[0];if(m[1])q('wA').value=m[1];if(m[2])q('dA').value=m[2];q('mA').value=d.nome||''}}
})();
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

/* ---- contrato de medidas ---- */
function porExtenso(n){
 var t=[['igual à altura',1],['uma vez e meia a altura',1.5],['o dobro da altura',2],['duas vezes e meia a altura',2.5],['o triplo da altura',3],['o quádruplo da altura',4]];
 for(var i=0;i<t.length;i++){if(Math.abs(n-t[i][1])<0.05)return t[i][0]}
 return n.toFixed(2).replace('.',',')+' vezes a altura'}
function comparar(cm){
 if(cm<=8)return 'cabe fechado dentro de uma mão';
 if(cm<=15)return 'do tamanho de um copo americano';
 if(cm<=25)return 'do tamanho de uma garrafa de água de 500 ml';
 if(cm<=40)return 'do tamanho de uma caixa de leite em pé, mais alto que uma garrafa';
 if(cm<=60)return 'do tamanho de um micro-ondas pequeno';
 return 'do tamanho de uma criança pequena em pé'}
q('calc').onclick=function(){
 var A={n:q('mA').value.trim(),h:num('hA'),w:num('wA'),d:num('dA')}, B={n:q('mB').value.trim(),h:num('hB'),w:num('wB'),d:num('dB')};
 if(!A.h||!B.h){alert('Preencha a altura em cm dos dois produtos.');return}
 if(B.h>A.h){var t=A;A=B;B=t}
 var nA=A.n||'produto maior', nB=B.n||'produto menor';
 var r=A.h/B.h;
 var s='REGRA DE ESCALA (obrigatória nesta cena, escreva do jeito que está aqui):\n\n';
 s+='O '+nA+' mede '+fmt(A.h)+' cm de altura';
 if(A.w)s+=' por '+fmt(A.w)+' cm de largura';
 if(A.d)s+=' por '+fmt(A.d)+' cm de profundidade';
 s+=' — é '+comparar(A.h)+'. ';
 s+='O '+nB+' mede '+fmt(B.h)+' cm de altura';
 if(B.w)s+=' por '+fmt(B.w)+' cm de '+(B.d?'largura':'diâmetro');
 if(B.d)s+=' por '+fmt(B.d)+' cm de profundidade';
 s+=' — é '+comparar(B.h)+'.\n\n';
 s+='PROPORÇÃO FIXA: a altura do '+nA+' é '+porExtenso(r)+' do '+nB+'. ';
 s+='Dito de outro jeito: o '+nB+' ocupa cerca de '+Math.round(100/r)+'% da altura do '+nA+'. ';
 s+='Se na imagem o '+nB+' parecer maior que isso, a imagem está errada e precisa ser refeita.\n\n';
 s+='Os dois produtos aparecem INTEIROS no enquadramento, apoiados na mesma superfície, à MESMA distância da câmera, em uma única fotografia real com lente 50 mm, mesma luz e mesma profundidade de campo. Sem colagem, sem montagem, sem foto dentro de foto.';
 q('escTxt').textContent=s;
 q('escOut').style.display='block';
 q('escOut').scrollIntoView({behavior:'smooth',block:'nearest'});
};
function fmt(n){return (Math.round(n*10)/10).toString().replace('.',',')}
/* ================= ETAPA 2 — ficha do produto e as 6 fotos ================= */
var FOTOS_REAIS=[];

/* preenche a ficha com o que veio do ANNOUNCER PRO */
(function(){
 var d=null;try{var r=localStorage.getItem('db_studio_entrada');if(r)d=JSON.parse(r)}catch(e){}
 if(!d)return;
 if(d.nome&&!q('fNome').value)q('fNome').value=d.nome;
 if(d.sku&&!q('fSku').value)q('fSku').value=d.sku;
 if(d.marca&&!q('fMarca').value)q('fMarca').value=d.marca;
 if(d.categoria&&!q('fCat').value)q('fCat').value=d.categoria;
 if(d.nome&&!q('mB').value)q('mB').value=d.nome;
})();

/* fotos reais: reduz para 1024 px e guarda em base64 */
q('fFotos').onchange=function(){
 var fs=[].slice.call(this.files||[]).slice(0,4);
 FOTOS_REAIS=[];q('fThumbs').innerHTML='';
 fs.forEach(function(f){
  var fr=new FileReader();
  fr.onload=function(){
   var im=new Image();
   im.onload=function(){
    var m=1024,w=im.width,h=im.height;
    if(w>m||h>m){if(w>h){h=Math.round(h*m/w);w=m}else{w=Math.round(w*m/h);h=m}}
    var c=document.createElement('canvas');c.width=w;c.height=h;
    c.getContext('2d').drawImage(im,0,0,w,h);
    var u=c.toDataURL('image/png');
    FOTOS_REAIS.push({data:u.split(',')[1],media:'image/png'});
    var t=document.createElement('img');t.className='thumb';t.src=u;q('fThumbs').appendChild(t);
   };
   im.src=fr.result;
  };
  fr.readAsDataURL(f);
 });
};

/* moldura tecnica comum a todas as fotos */
function moldura(oQue,modo){
 var s='[STUDIO DONA BEGO] Fotografia publicitaria de produto para e-commerce, padrao profissional, imagem quadrada 1:1 em altissima resolucao, produto perfeitamente nitido. O produto deve ser identico ao das fotos de referencia anexadas: mesma cor, mesmo formato, mesma textura, mesmo rotulo, mesmas proporcoes.\n\n';
 s+='O QUE MOSTRAR: '+oQue+'\n\n';
 if(modo==='ambiente'){
  s+='LUZ E CAMERA: uma unica fotografia real, camera full-frame com lente 50 mm em f/2.8, luz natural de janela vinda da lateral, sem flash. Profundidade de campo suave desfocando o fundo, produto em foco nitido. Aparencia de foto tirada de verdade, nao de estudio.\n\n';
  s+='COMPOSICAO: enquadramento honesto e autentico, produto claramente reconhecivel e inteiro, ambiente real e organizado ao fundo, nada cortado de forma estranha.\n\n';
 }else{
  s+='LUZ E CAMERA: uma unica fotografia real, camera full-frame com lente 50 mm em f/8, ISO 100. Luz principal de softbox grande a 45 graus acima e a esquerda, rebatedor branco do lado oposto abrindo as sombras, leve luz de contorno separando o produto do fundo. Sombra de contato suave e realista embaixo do produto. Sem flash estourado, sem sombra dura, sem halo, sem borda recortada, sem aparencia de montagem.\n\n';
  s+='COMPOSICAO: produto centralizado e alinhado na vertical, ocupando cerca de 85% da altura do quadro, com a mesma margem de respiro dos quatro lados, camera na altura do meio do produto e nao de cima, silhueta limpa, nada cortado nas bordas.\n\n';
 }
 s+='ACABAMENTO: cores fieis e calibradas, branco realmente branco (#FFFFFF) sem cinza nem amarelado, textura real do material visivel, reflexos suaves e coerentes com a luz, foco nitido, sem ruido e sem serrilhado.\n\n';
 s+='FIDELIDADE OBRIGATORIA: nao invente nenhum detalhe do produto. Se algo nao aparece nas fotos de referencia, nao aparece nesta imagem. Nenhum botao, encaixe, selo, certificado ou palavra que nao exista de verdade. Se um texto do rotulo nao estiver legivel na referencia, ele sai levemente desfocado nesta imagem, nunca escrito por adivinhacao.\n\n';
 s+='PROIBIDO: marca dagua, logotipo de banco de imagens, moldura, borda, colagem, montagem, texto inventado, numeros ou medidas escritas na imagem, reguas, letras tortas, borradas ou ilegiveis no rotulo, maos ou dedos deformados, produto duplicado, objetos cortados na borda, cenario bagunçado, aparencia de render 3D artificial, de ilustracao ou de desenho.';
 return s;
}

/* as 6 fotos */
function receita(i,F){
 var nome=F.nome, cat=F.cat?(' ('+F.cat+')'):'';
 if(i===1)return {modo:'estudio',txt:'O '+nome+' inteiro, em pe, sozinho, centralizado, fundo branco puro #FFFFFF sem degrade e sem sombra de fundo. Angulo frontal, camera na altura do meio do produto. Rotulo virado para a camera, totalmente legivel e identico ao da referencia: mesmas cores, mesmas letras, mesmo desenho. Sombra de contato suave embaixo. Nenhum outro objeto na cena.\nREGRA DESTA FOTO, obrigatoria: nenhum logotipo aplicado por cima, nenhum selo, nenhuma faixa, nenhuma etiqueta de promocao, nenhum texto adicional, nenhuma borda e nenhuma moldura. Esta e a foto de capa do anuncio.'};
 if(i===2)return {modo:'estudio',txt:'O '+nome+' em close, ocupando quase todo o quadro, sobre fundo cinza claro neutro e liso. Angulo de tres quartos, levemente de cima, mostrando ao mesmo tempo o corpo do produto, o ponto de encaixe e a textura real da superficie. Foco nitido no encaixe. Rotulo parcialmente visivel. Sem nenhuma seta, numero, legenda ou texto na imagem: a foto sai limpa e as legendas entram depois por fora.'};
 if(i===3)return {modo:'estudio',txt:'Composicao sobre fundo cinza claro neutro, mesma luz e mesma distancia de camera para todos os elementos, mostrando o seguinte diferencial do '+nome+': '+F.dif+'\nOs produtos aparecem inteiros, sem corte. Nenhum texto, seta ou icone na imagem.'};
 if(i===4){
  var comp=F.compat?(' encaixando o '+nome+' no '+F.compat):(' usando o '+nome);
  return {modo:'ambiente',txt:'Duas maos adultas'+comp+', em um ambiente domestico real e organizado, luz natural de janela. Enquadramento das maos ate a altura do peito.\nREGRA DESTA FOTO, obrigatoria: SEM ROSTO, sem cabeca, sem pessoa de corpo inteiro, sem reflexo de rosto em nenhuma superficie. Maos com anatomia correta, cinco dedos em cada, sem anel e sem unha postica. O produto aparece inteiro e reconhecivel.'};
 }
 if(i===5)return {modo:'estudio',txt:'Os produtos juntos, os dois INTEIROS, em pe, sobre a mesma bancada, com a mesma luz e a mesma distancia de camera, fundo cinza claro neutro.\n\n'+F.escala+'\n\nNenhum numero, nenhuma medida e nenhuma regua desenhada na imagem: a escala se le pela comparacao entre os dois produtos.'};
 return {modo:'estudio',txt:'Flat lay visto de cima, fundo branco liso, itens alinhados com espacamento igual e sombra suave, mostrando exatamente e somente os seguintes itens que acompanham o '+nome+cat+': '+F.caixa+'\nNenhum item alem destes. Nenhum acessorio extra, nenhum manual, nenhuma peca que nao esteja escrita acima. Nenhum texto na imagem.'};
}

var TITULOS=[
 ['CAPA','Primeira impressão de confiança. É a foto que aparece na busca.'],
 ['DETALHE REAL','Educar rápido: como é por dentro e como encaixa.'],
 ['DIFERENCIAL','Justificar por que o seu vale mais.'],
 ['USO REAL','A pessoa se imaginar usando.'],
 ['TAMANHO REAL','Acabar com a dúvida de tamanho — é o que mais gera pergunta e devolução.'],
 ['O QUE VEM NA CAIXA','Valor percebido e transparência.']
];

function fichaAtual(){
 return {
  nome:q('fNome').value.trim()||'produto',
  sku:q('fSku').value.trim(),
  marca:q('fMarca').value.trim(),
  cat:q('fCat').value.trim(),
  dif:q('fDif').value.trim(),
  caixa:q('fCaixa').value.trim(),
  compat:(q('mA').value.trim()||''),
  escala:(q('escTxt').textContent||'').trim()
 };
}

q('fMontar').onclick=function(){
 var F=fichaAtual(),msg=q('fMsg');
 if(document.querySelector('#seis .foto.aprovada')&&!confirm('Você já tem foto aprovada aqui embaixo. Montar os prompts de novo limpa as imagens da tela.\n\nSe ainda não baixou, cancele e baixe primeiro. Continuar?'))return;
 if(!q('fNome').value.trim()){msg.innerHTML='<div class="erro">Escreva ao menos o nome do produto — é ele que entra em todos os 6 prompts.</div>';return}
 var faltas=[];
 if(!FOTOS_REAIS.length)faltas.push('nenhuma <strong>foto real</strong> anexada — sem ela a IA desenha o que ela acha que o seu produto é');
 if(!F.dif)faltas.push('o campo <strong>diferencial</strong> está vazio — a foto 3 fica travada até você escrever');
 if(!F.caixa)faltas.push('o campo <strong>o que vem na caixa</strong> está vazio — a foto 6 fica travada, porque mostrar item que não vai junto vira reclamação');
 if(!F.escala)faltas.push('a <strong>frase de escala</strong> ainda não foi gerada — role para o contrato de medidas e clique no botão; a foto 5 depende dela');
 msg.innerHTML=faltas.length?('<div class="aviso" style="margin-top:10px">Montei o que dava. Ainda falta: '+faltas.join(' · ')+'.</div>'):'<div class="aviso ok" style="margin-top:10px">Ficha completa. As 6 fotos estão liberadas.</div>';
 montarSeis(F);
 q('cfotos').style.display='block';
 q('cfotos').scrollIntoView({behavior:'smooth',block:'start'});
};

function montarSeis(F){
 var alvo=q('seis');alvo.innerHTML='';
 for(var i=1;i<=6;i++){
  var t=TITULOS[i-1],r=receita(i,F),trava='';
  if(i===3&&!F.dif)trava='Escreva o <strong>diferencial</strong> na ficha e clique de novo em "Montar os 6 prompts".';
  if(i===5&&!F.escala)trava='Gere a <strong>frase de escala</strong> no contrato de medidas e clique de novo em "Montar os 6 prompts".';
  if(i===6&&!F.caixa)trava='Escreva <strong>o que vem na caixa</strong> na ficha e clique de novo em "Montar os 6 prompts".';
  var d=document.createElement('div');
  d.className='foto';d.id='fb'+i;
  var h='<h3>FOTO '+i+' — '+t[0]+'</h3><p class="obj">'+t[1]+'</p>';
  if(trava){h+='<div class="aviso">'+trava+'</div>';}
  else{
   h+='<textarea id="pp'+i+'"></textarea>';
   h+='<button class="btn btn-p" id="gg'+i+'">Gerar a foto '+i+'</button>';
   h+='<div class="custo" id="cc'+i+'"></div>';
   h+='<div id="ss'+i+'"></div>';
  }
  d.innerHTML=h;alvo.appendChild(d);
  if(!trava){
   q('pp'+i).value=moldura(r.txt,r.modo);
   (function(n){q('gg'+n).onclick=function(){gerar(n,this)}})(i);
   q('cc'+i).textContent=custoTxt();
  }
 }
}
q('fQual').onchange=function(){for(var i=1;i<=6;i++){var e=document.getElementById('cc'+i);if(e)e.textContent=custoTxt()}};
function custoTxt(){var v=q('fQual').value;return 'Custo estimado desta imagem: '+(v==='low'?'R$ 0,06':v==='high'?'R$ 1,00':'R$ 0,25');}

function gerar(i,btn){
 var p=(q('pp'+i).value||'').trim();
 if(!p){alert('O prompt da foto '+i+' está vazio.');return}
 if(!confirm('Gerar a foto '+i+' agora?\n\n'+custoTxt()+'\n\nEssa é a única cobrança deste passo. Se não gostar, você manda refazer.'))return;
 var box=q('ss'+i);box.innerHTML='<div class="spin">Gerando a foto '+i+'... isso leva de 20 a 60 segundos.</div>';
 btn.disabled=true;btn.textContent='Gerando...';
 fetch('/api/image',{method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({prompt:p,quality:q('fQual').value,size:'1024x1024',imagens:FOTOS_REAIS})})
 .then(function(r){return r.json()})
 .then(function(j){
  btn.disabled=false;btn.textContent='Gerar de novo a foto '+i;
  if(j.error){box.innerHTML='<div class="erro">'+esc(j.error)+'</div>';return}
  if(!j.image){box.innerHTML='<div class="erro">A resposta veio sem imagem. Tente de novo.</div>';return}
  var u='data:image/png;base64,'+j.image;
  box.innerHTML='<img class="imgout" id="ii'+i+'" src="'+u+'">'
   +'<div class="g2" style="margin-top:10px">'
   +'<button class="btn btn-g" id="dl'+i+'">Baixar em 1200 x 1200</button>'
   +'<button class="btn btn-p" id="ok'+i+'">Está boa, aprovar</button></div>'
   +'<div id="ap'+i+'"></div>';
  q('dl'+i).onclick=function(){baixar(i,u)};
  q('ok'+i).onclick=function(){
   q('fb'+i).classList.add('aprovada');
   q('ap'+i).innerHTML='<div class="aviso ok" style="margin-top:10px">Foto '+i+' aprovada. Baixe o arquivo antes de fechar a página — ele não fica guardado no servidor.</div>';
   this.disabled=true;this.textContent='Aprovada';
  };
 })
 .catch(function(e){
  btn.disabled=false;btn.textContent='Gerar de novo a foto '+i;
  box.innerHTML='<div class="erro">Não consegui falar com o gerador de imagem. '+esc(String(e&&e.message||e))+'</div>';
 });
}

function baixar(i,u){
 var F=fichaAtual(),im=new Image();
 im.onload=function(){
  var c=document.createElement('canvas');c.width=1200;c.height=1200;
  var x=c.getContext('2d');x.imageSmoothingQuality='high';
  x.fillStyle='#FFFFFF';x.fillRect(0,0,1200,1200);
  x.drawImage(im,0,0,1200,1200);
  var a=document.createElement('a');
  a.href=c.toDataURL('image/png');
  a.download=((F.sku||'produto')+'-foto'+i+'.png').replace(/\s+/g,'-');
  document.body.appendChild(a);a.click();document.body.removeChild(a);
 };
 im.src=u;
}

q('escCopy').onclick=function(){
 var t=q('escTxt').textContent,b=this;
 function done(){b.textContent='Copiado';setTimeout(function(){b.textContent='Copiar a frase'},1600)}
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,fallback)}else{fallback()}
 function fallback(){var a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(e){}document.body.removeChild(a);done()}
};
</script></body></html>`;
