/**
 * STUDIO DONA BEGÔ — módulo separado do ANNOUNCER PRO.
 * Etapa 1: página com a identidade da marca, ponte de entrada vinda do
 * ANNOUNCER PRO (localStorage "db_studio_entrada") e o contrato de medidas.
 * Etapa 2: ficha do produto (fotos reais + dados do SKU) e o kit das 6 fotos
 * de anúncio, uma por vez, com parada de aprovação em cada uma.
 * Etapa 3: modo kit (contagem e proporção escritas dentro dos prompts),
 * proibição de marca de terceiro nas seis fotos, e o quadro de medidas
 * desenhado em canvas na escala real — sem IA, sem custo, sem número
 * inventado. As etapas 4 a 6 entram nas próximas publicações.
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
.lbl-chk{display:flex;align-items:center;gap:9px;text-transform:none;letter-spacing:0;font-size:.92rem;font-weight:600;color:var(--db-tinta);cursor:pointer;margin:0}
.lbl-chk input{width:auto;padding:0;margin:0}
.gratis{display:inline-block;background:#F1F7F1;border:1px solid #D6E8D6;color:#2F6B32;font-size:.68rem;font-weight:800;letter-spacing:.08em;padding:3px 8px;border-radius:99px;margin-left:8px;vertical-align:2px}
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

  <div class="field" style="margin-top:16px"><label class="lbl-chk"><input type="checkbox" id="fKit">Este produto é um kit — vem mais de uma peça na caixa</label></div>
  <div id="kitBox" style="display:none">
   <div class="aviso" style="margin-bottom:12px">Em kit a IA erra sempre a mesma coisa: <strong>a quantidade de peças</strong> e <strong>a diferença de tamanho entre elas</strong>. Escreva as peças aqui e eu escrevo a conta dentro dos prompts — "4 + 6 + 4 + 1 = 15, nem 14 nem 16" — e monto o quadro de medidas na escala real.</div>
   <div class="field"><label>As peças do kit — uma por linha</label><textarea id="fPecas" style="min-height:104px;font-size:.88rem" placeholder="quantidade | nome ou capacidade | altura x largura x profundidade&#10;&#10;4 | 0,8 L | 9 x 10 x 9&#10;6 | 1,4 L | 13 x 10 x 14&#10;4 | 2,0 L | 20 x 10 x 14&#10;1 | 2,8 L | 30 x 10 x 14"></textarea></div>
   <button class="btn btn-g" id="kitLer">Conferir o que eu entendi</button>
   <div id="kitOut"></div>
  </div>

  <div class="field" style="margin-top:16px"><label>Fotos reais do produto (até 4)</label><input type="file" id="fFotos" accept="image/*" multiple></div>
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
  <div class="aviso" style="margin-top:6px"><strong>Lembrete das regras.</strong> A foto 1 é a capa: sem logo, sem selo, sem faixa — Mercado Livre e Amazon derrubam o anúncio. A foto 4 não tem rosto, só mãos, porque a API de vídeo recusa referência com rosto. Nenhuma foto leva marca de fabricante ou de fornecedor. E nenhuma foto escreve medida: número escrito por IA sai errado — a medida escrita vem do quadro aqui embaixo, que é desenho, não IA.</div>
 </div>

 <div class="card">
  <h2>Quadro de medidas<span class="gratis">NÃO CUSTA NADA</span></h2>
  <p>Esta imagem não passa pela IA. Eu <strong>desenho</strong> ela, na escala real, com os números que você escreveu — a peça de 30 cm sai três vezes e pouco mais alta que a de 9 cm porque a conta é feita em pixel, não no chute. Número errado aqui é impossível: ou é o que você digitou, ou não aparece.</p>
  <p>Sai em 1200 × 1200, na fonte e nas cores da Dona Begô, sem marca de fornecedor. Serve como foto do anúncio. E como é desenho e não IA, pode refazer quantas vezes quiser sem gastar um centavo.</p>
  <p style="font-size:.86rem">De onde vêm os números: se você marcou <strong>kit</strong>, das peças que conferiu ali em cima. Se não, das medidas do <strong>contrato de medidas</strong>.</p>
  <button class="btn btn-p" id="qmGerar">Desenhar o quadro de medidas</button>
  <div id="qmMsg"></div>
  <div id="qmOut"></div>
 </div>

 <div class="card">
  <h2>O caminho até o vídeo</h2>
  <p>Dez passos e quatro paradas obrigatórias. Nas paradas eu não sigo sozinho: eu pergunto e espero você responder.</p>
  <ol class="passos">
   <li class="feito"><strong>Receber o anúncio</strong> do ANNOUNCER PRO<span class="tag t-agora">no ar</span></li>
   <li class="feito"><strong>Contrato de medidas</strong> — a proporção escrita por extenso<span class="tag t-agora">no ar</span></li>
   <li class="feito"><strong>Ficha do produto</strong> — fotos reais e dados do SKU<span class="tag t-agora">no ar</span></li>
   <li class="feito"><strong>Conferir as fotos</strong> — capa, detalhe, diferencial, uso, escala, o que vem na caixa<span class="tag t-gate">parada 1</span></li>
   <li class="feito"><strong>Quadro de medidas</strong> — desenhado na escala real, sem IA e sem custo<span class="tag t-agora">no ar</span></li>
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
  <p><strong>Marca de fornecedor não entra em nenhuma das seis.</strong> A arte do fabricante serve de referência para o formato e a cor do produto, nunca para o nome dele aparecer no seu anúncio.</p>
  <p><strong>Número escrito é desenhado, nunca gerado.</strong> A IA erra letra e erra medida — já escreveu "marlhmallow" e já desenhou régua com número inventado. Toda medida que aparece escrita numa imagem sai do quadro de medidas, que é canvas, não IA.</p>
  <p><strong>Etiqueta adesiva sai em branco.</strong> É o que vem de verdade na caixa, e é o que impede a IA de escrever palavra torta em cima do seu produto.</p>
 </div>

 <div class="foot">STUDIO DONA BEGÔ · etapa 3 · o conteúdo pago só roda depois da sua aprovação</div>
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
 s+='MARCA DE TERCEIRO, proibida nesta e em todas as fotos: nenhum logotipo, nome, assinatura ou selo de fabricante, fornecedor, distribuidor ou marca de terceiro aplicado sobre a imagem, em nenhum canto, em nenhum tamanho. Nenhum selo de qualidade, nenhum certificado, nenhum QR code, nenhum codigo de barras, nenhuma faixa de promocao. O rotulo que ja existe impresso no proprio produto continua como esta na foto de referencia; o que nao pode e acrescentar marca por cima.\n\n';
 s+='ETIQUETAS E ADESIVOS: se o produto ou o kit tiver etiqueta adesiva, cartela de etiquetas ou espaco de anotacao, eles aparecem EM BRANCO, sem nenhuma palavra escrita. Etiqueta em branco e o que vem de verdade na caixa.\n\n';
 s+='PROIBIDO: marca dagua, logotipo de banco de imagens, moldura, borda, colagem, montagem, texto inventado, numeros ou medidas escritas na imagem, reguas, letras tortas, borradas ou ilegiveis no rotulo, maos ou dedos deformados, produto duplicado, objetos cortados na borda, cenario bagunçado, aparencia de render 3D artificial, de ilustracao ou de desenho.';
 return s;
}

/* ---- modo kit: a conta das pecas e a proporcao entre os tamanhos ---- */
function totalPecas(P){var t=0;P.forEach(function(p){t+=p.qtd});return t}
function contaTxt(P){
 var t=totalPecas(P),soma=P.map(function(p){return p.qtd}).join(' + ');
 return 'CONTAGEM OBRIGATORIA: '+soma+' = '+t+' pecas no total. Nem '+(t-1)+', nem '+(t+1)+', exatamente '+t+'. Conte as pecas uma por uma antes de fechar a imagem.';
}
function razoesTxt(P){
 var mn=P[0].h;P.forEach(function(p){if(p.h<mn)mn=p.h});
 return 'PROPORCAO OBRIGATORIA entre os tamanhos, medida pela altura: '+P.map(function(p){
  var r=p.h/mn;
  return p.rot+(Math.abs(r-1)<0.02?' e a menor, e a altura de base':' tem '+fmt(r)+' vezes a altura da menor');
 }).join('; ')+'. A diferenca de tamanho entre os grupos precisa ser visivel na imagem: se todas as pecas sairem do mesmo tamanho, a imagem esta errada.';
}
function gruposTxt(P){return P.map(function(p){return p.qtd+' de '+p.rot}).join(', ')}
function tamanhosTxt(P){return P.map(function(p){return p.rot+' com '+fmt(p.h)+' cm de altura'}).join(', ')}

/* as 6 fotos */
function receita(i,F){
 var nome=F.nome, cat=F.cat?(' ('+F.cat+')'):'';
 var K=F.kit&&F.pecas.length>=1, P=F.pecas, T=K?totalPecas(P):0;

 if(K&&i===1)return {modo:'estudio',txt:'Todas as '+T+' pecas do '+nome+' juntas em uma unica composicao sobre fundo branco puro #FFFFFF sem degrade, empilhadas e encaixadas umas nas outras formando um bloco organizado e estavel. As pecas maiores atras e embaixo, as menores na frente e em cima, todas visiveis, nenhuma escondida por completo. Angulo frontal, camera na altura do meio do conjunto. Sombra de contato suave embaixo. Nenhum outro objeto na cena alem do que vem na caixa.\nO kit tem '+P.length+' tamanhos: '+gruposTxt(P)+'.\n'+contaTxt(P)+'\n'+razoesTxt(P)+'\nREGRA DESTA FOTO, obrigatoria: nenhum logotipo aplicado por cima, nenhum selo, nenhuma faixa, nenhuma etiqueta de promocao, nenhum texto adicional, nenhuma borda e nenhuma moldura. Esta e a foto de capa do anuncio.'};

 if(K&&i===5)return {modo:'estudio',txt:'Um exemplar de cada tamanho do '+nome+', lado a lado sobre a mesma bancada, do menor para o maior, da esquerda para a direita, todos INTEIROS e em pe, com a mesma luz e a MESMA distancia de camera, fundo cinza claro neutro e liso. Sao '+P.length+' tamanhos: '+tamanhosTxt(P)+'.\n'+razoesTxt(P)+'\nA quinta parte de baixo da imagem fica vazia, so o fundo liso, sem nenhum objeto e sem sombra: esse espaco e reservado para a legenda das medidas, que entra depois por fora.\nNenhum numero, nenhuma medida escrita, nenhuma regua, nenhuma seta e nenhuma cota desenhada na imagem.'};

 if(K&&i===6)return {modo:'estudio',txt:'Flat lay visto diretamente de cima, fundo branco liso, sombra suave, mostrando exatamente e somente o que acompanha o '+nome+cat+': '+F.caixa+'\nAs pecas ficam agrupadas por tamanho, cada grupo na sua propria fileira, alinhadas e com espacamento igual: '+gruposTxt(P)+'.\n'+contaTxt(P)+'\n'+razoesTxt(P)+'\nNenhum item alem destes. Nenhum acessorio extra, nenhum manual, nenhuma peca que nao esteja escrita acima. Nenhum texto na imagem.'};

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
  escala:(q('escTxt').textContent||'').trim(),
  kit:q('fKit').checked,
  pecas:q('fKit').checked?lerPecas().itens:[]
 };
}

/* ---- modo kit: liga o bloco e le as pecas ---- */
q('fKit').onchange=function(){
 q('kitBox').style.display=this.checked?'block':'none';
 if(this.checked)q('kitBox').scrollIntoView({behavior:'smooth',block:'nearest'});
};
function lerPecas(){
 var linhas=(q('fPecas').value||'').split('\n'),itens=[],erros=[];
 linhas.forEach(function(l,idx){
  var t=l.trim();if(!t)return;
  var p=t.split('|');
  if(p.length<3){erros.push('Linha '+(idx+1)+' — "'+t+'": faltou separar com a barra |. O formato e  quantidade | nome | altura x largura x profundidade');return}
  var nq=parseInt((p[0]||'').replace(/[^0-9]/g,''),10);
  var nd=(p.slice(2).join('|')||'').replace(/,/g,'.').match(/[0-9]+(?:\.[0-9]+)?/g)||[];
  if(!nq||nq<1){erros.push('Linha '+(idx+1)+' — "'+t+'": nao entendi a quantidade de pecas.');return}
  if(!nd.length){erros.push('Linha '+(idx+1)+' — "'+t+'": nao entendi as medidas em cm.');return}
  var h=parseFloat(nd[0]);
  if(!(h>0)){erros.push('Linha '+(idx+1)+' — "'+t+'": a altura precisa ser maior que zero.');return}
  itens.push({qtd:nq,rot:(p[1]||'').trim()||('peça '+(itens.length+1)),h:h,
   w:nd.length>1?parseFloat(nd[1]):0,d:nd.length>2?parseFloat(nd[2]):0});
 });
 return {itens:itens,erros:erros};
}
q('kitLer').onclick=function(){
 var r=lerPecas(),h='';
 if(r.erros.length)h+='<div class="erro">'+r.erros.map(esc).join('<br>')+'</div>';
 if(r.itens.length){
  h+='<div class="aviso ok" style="margin-top:10px"><strong>Entendi assim — confira antes de eu usar:</strong><br>';
  h+=r.itens.map(function(p){
   return p.qtd+' × '+esc(p.rot)+' — '+fmt(p.h)+' cm de altura'+(p.w?' × '+fmt(p.w)+' cm':'')+(p.d?' × '+fmt(p.d)+' cm':'');
  }).join('<br>');
  h+='<br><br><strong>Total: '+totalPecas(r.itens)+' peças em '+r.itens.length+' tamanhos.</strong><br>Se esse total estiver errado, corrija agora — ele vai escrito por extenso dentro dos prompts das fotos 1, 5 e 6, e é ele que impede a IA de gerar peça a mais ou a menos.</div>';
 }
 if(!r.itens.length&&!r.erros.length)h='<div class="aviso" style="margin-top:10px">Nenhuma peça escrita ainda. Cada linha é uma <strong>medida diferente</strong>: se o kit tem 4 potes iguais de 0,8 L, isso é uma linha só, com quantidade 4.</div>';
 q('kitOut').innerHTML=h;
};

q('fMontar').onclick=function(){
 var F=fichaAtual(),msg=q('fMsg');
 if(document.querySelector('#seis .foto.aprovada')&&!confirm('Você já tem foto aprovada aqui embaixo. Montar os prompts de novo limpa as imagens da tela.\n\nSe ainda não baixou, cancele e baixe primeiro. Continuar?'))return;
 if(!q('fNome').value.trim()){msg.innerHTML='<div class="erro">Escreva ao menos o nome do produto — é ele que entra em todos os 6 prompts.</div>';return}
 var faltas=[];
 if(!FOTOS_REAIS.length)faltas.push('nenhuma <strong>foto real</strong> anexada — sem ela a IA desenha o que ela acha que o seu produto é');
 if(!F.dif)faltas.push('o campo <strong>diferencial</strong> está vazio — a foto 3 fica travada até você escrever');
 if(!F.caixa)faltas.push('o campo <strong>o que vem na caixa</strong> está vazio — a foto 6 fica travada, porque mostrar item que não vai junto vira reclamação');
 if(F.kit&&!F.pecas.length)faltas.push('você marcou <strong>kit</strong> mas as peças ainda não foram lidas — escreva uma peça por linha e clique em "Conferir o que eu entendi"; sem isso as fotos 1, 5 e 6 saem sem a contagem e a IA erra a quantidade');
 if(!F.escala&&!(F.kit&&F.pecas.length))faltas.push('a <strong>frase de escala</strong> ainda não foi gerada — role para o contrato de medidas e clique no botão; a foto 5 depende dela');
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
  if(i===5&&!F.escala&&!(F.kit&&F.pecas.length))trava='Gere a <strong>frase de escala</strong> no contrato de medidas e clique de novo em "Montar os 6 prompts". Se for kit, dá para usar as peças: marque <strong>kit</strong> na ficha e clique em "Conferir o que eu entendi".';
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
  var Fa=fichaAtual(),temMed=(i===5&&Fa.kit&&Fa.pecas.length>=2);
  box.innerHTML='<img class="imgout" id="ii'+i+'" src="'+u+'">'
   +(temMed?'<button class="btn btn-g" id="md5" style="margin-top:10px">Escrever as medidas reais por cima e baixar<span class="gratis">NÃO CUSTA NADA</span></button><div class="custo">O texto é escrito por mim, não pela IA — os números são exatamente os que você digitou.</div>':'')
   +'<div class="g2" style="margin-top:10px">'
   +'<button class="btn btn-g" id="dl'+i+'">Baixar em 1200 x 1200</button>'
   +'<button class="btn btn-p" id="ok'+i+'">Está boa, aprovar</button></div>'
   +'<div id="ap'+i+'"></div>';
  if(temMed)q('md5').onclick=function(){
   var b=this;b.disabled=true;b.textContent='Escrevendo...';
   medidasSobre(u,Fa.pecas,function(url){
    b.disabled=false;b.innerHTML='Escrever as medidas reais por cima e baixar<span class="gratis">NÃO CUSTA NADA</span>';
    q('ii5').src=url;
    salvar(url,(Fa.sku||'produto')+'-foto5-medidas.png');
   });
  };
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

/* ============ ETAPA 3 — o que eu DESENHO, e não a IA ============
   Medida escrita nunca passa pelo gerador de imagem. Aqui embaixo o
   número é desenhado em canvas, na escala real, com o que está na
   ficha. Não custa nada e não tem como sair errado. */
var DBC={rosa:'#E92C56',rosaT:'#C62549',cinza:'#616264',tinta:'#181819',linha:'#DFE0E0',fraco:'#8C8E90'};
var FT='Montserrat,Helvetica,Arial,sans-serif';

function salvar(url,nome){
 var a=document.createElement('a');a.href=url;a.download=String(nome).replace(/\s+/g,'-');
 document.body.appendChild(a);a.click();document.body.removeChild(a);
}
function rrect(x,a,b,w,h,r){
 if(x.roundRect){x.beginPath();x.roundRect(a,b,w,h,r);return}
 r=Math.min(r,w/2,h/2);
 x.beginPath();x.moveTo(a+r,b);x.lineTo(a+w-r,b);x.quadraticCurveTo(a+w,b,a+w,b+r);
 x.lineTo(a+w,b+h-r);x.quadraticCurveTo(a+w,b+h,a+w-r,b+h);
 x.lineTo(a+r,b+h);x.quadraticCurveTo(a,b+h,a,b+h-r);
 x.lineTo(a,b+r);x.quadraticCurveTo(a,b,a+r,b);x.closePath();
}
function caber(x,t,max,peso,ini,min){
 var s=ini;
 while(s>min){x.font=peso+' '+s+'px '+FT;if(x.measureText(t).width<=max)break;s-=2}
 x.font=peso+' '+s+'px '+FT;return s;
}
function fontesProntas(cb){
 if(document.fonts&&document.fonts.ready){document.fonts.ready.then(cb)['catch'](cb)}else{cb()}
}
function itensQuadro(F){
 if(F.kit&&F.pecas.length)return F.pecas.slice().sort(function(a,b){return a.h-b.h});
 var r=[];
 var A={qtd:1,rot:q('mA').value.trim()||'Produto A',h:num('hA'),w:num('wA'),d:num('dA')};
 var B={qtd:1,rot:q('mB').value.trim()||'Produto B',h:num('hB'),w:num('wB'),d:num('dB')};
 if(A.h)r.push(A);
 if(B.h)r.push(B);
 return r.sort(function(a,b){return a.h-b.h});
}
function desenharQuadro(F,itens){
 var S=1200,c=document.createElement('canvas');c.width=S;c.height=S;
 var x=c.getContext('2d');
 x.fillStyle='#FFFFFF';x.fillRect(0,0,S,S);
 x.textAlign='center';

 var titulo=F.kit?'MEDIDAS REAIS DO KIT':'MEDIDAS REAIS';
 caber(x,titulo,S-160,'800',54,30);x.fillStyle=DBC.rosaT;x.fillText(titulo,S/2,110);
 var sub=(F.nome||'').trim();
 if(F.kit&&itens.length>1)sub=sub+(sub?' · ':'')+itens.length+' tamanhos';
 if(sub){caber(x,sub,S-160,'400',30,16);x.fillStyle=DBC.cinza;x.fillText(sub,S/2,158)}
 x.fillStyle=DBC.rosa;x.fillRect(S/2-60,186,120,4);

 var BASE=880,TOPO=252,MARG=80,GAP=44,n=itens.length,maxH=0,somaW=0;
 itens.forEach(function(p){if(p.h>maxH)maxH=p.h;somaW+=(p.w>0?p.w:p.h*0.62)});
 var PX=Math.min((BASE-TOPO)/maxH,(S-2*MARG-GAP*(n-1))/somaW);
 var x0=(S-(somaW*PX+GAP*(n-1)))/2;
 x.fillStyle=DBC.linha;x.fillRect(MARG-20,BASE,S-2*MARG+40,3);

 var pos=[],cur=x0;
 itens.forEach(function(p){
  var w=(p.w>0?p.w:p.h*0.62)*PX,h=p.h*PX;
  pos.push({p:p,x:cur,w:w,top:BASE-h,h:h});
  cur+=w+GAP;
 });

 pos.forEach(function(o){
  var w=o.w,h=o.h,a=o.x,t=o.top,tampa=Math.max(14,Math.round(h*0.085));
  x.lineWidth=3;
  x.fillStyle='#F5F7F8';x.strokeStyle='#BFC4C7';
  rrect(x,a,t,w,h,Math.min(12,w/6));x.fill();x.stroke();
  x.save();rrect(x,a,t,w,h,Math.min(12,w/6));x.clip();
  x.fillStyle='#E8EDEF';x.fillRect(a,t,w,tampa);x.restore();
  x.strokeStyle='#BFC4C7';x.lineWidth=2;
  x.beginPath();x.moveTo(a,t+tampa);x.lineTo(a+w,t+tampa);x.stroke();
  var cx=a+Math.min(28,w*0.28),y1=t+tampa+13,y2=BASE-13;
  if(y2>y1+8){
   x.strokeStyle=DBC.rosa;x.lineWidth=3;
   x.beginPath();x.moveTo(cx,y1);x.lineTo(cx,y2);x.stroke();
   x.fillStyle=DBC.rosa;
   x.beginPath();x.moveTo(cx,y1);x.lineTo(cx-7,y1+11);x.lineTo(cx+7,y1+11);x.closePath();x.fill();
   x.beginPath();x.moveTo(cx,y2);x.lineTo(cx-7,y2-11);x.lineTo(cx+7,y2-11);x.closePath();x.fill();
  }
  var txt=fmt(o.p.h)+' cm',fs=caber(x,txt,Math.max(70,w-8),'800',44,20);
  var mw=x.measureText(txt).width,mx=a+w/2,my=t+tampa+(h-tampa)/2;
  x.fillStyle='#FFFFFF';x.fillRect(mx-mw/2-10,my-fs*0.72,mw+20,fs*1.3);
  x.fillStyle=DBC.rosaT;x.fillText(txt,mx,my+fs*0.36);
 });

 pos.forEach(function(o){
  var slot=Math.max(120,o.w+GAP-8),cx=o.x+o.w/2;
  caber(x,o.p.rot,slot,'800',42,17);x.fillStyle=DBC.rosaT;x.fillText(o.p.rot,cx,932);
  var l2=F.kit?(o.p.qtd>1?(o.p.qtd+' peças'):'1 peça'):'';
  if(l2){caber(x,l2,slot,'600',28,14);x.fillStyle=DBC.tinta;x.fillText(l2,cx,978)}
  var l3=fmt(o.p.h)+(o.p.w?' × '+fmt(o.p.w):'')+(o.p.d?' × '+fmt(o.p.d):'')+' cm';
  caber(x,l3,slot,'400',24,12);x.fillStyle=DBC.cinza;x.fillText(l3,cx,l2?1018:986);
 });

 x.fillStyle=DBC.linha;x.fillRect(MARG,1072,S-2*MARG,2);
 var rod='altura × largura × profundidade';
 if(F.kit)rod+='  ·  '+totalPecas(itens)+' peças no total';
 caber(x,rod,S-160,'400',25,13);x.fillStyle=DBC.cinza;x.fillText(rod,S/2,1112);
 caber(x,'medidas informadas pelo fabricante',S-160,'400',21,12);
 x.fillStyle=DBC.fraco;x.fillText('medidas informadas pelo fabricante',S/2,1150);
 return c.toDataURL('image/png');
}
q('qmGerar').onclick=function(){
 var F=fichaAtual(),itens=itensQuadro(F);
 if(!itens.length){
  q('qmMsg').innerHTML='<div class="erro">Não tenho medida nenhuma para desenhar. Se for kit, marque <strong>kit</strong> na ficha, escreva as peças e clique em "Conferir o que eu entendi". Se não for kit, preencha as alturas no <strong>contrato de medidas</strong> lá em cima.</div>';
  q('qmOut').innerHTML='';return}
 q('qmMsg').innerHTML='';
 q('qmOut').innerHTML='<div class="spin">Desenhando...</div>';
 fontesProntas(function(){
  var url;
  try{url=desenharQuadro(F,itens)}
  catch(e){q('qmOut').innerHTML='<div class="erro">Não consegui desenhar: '+esc(String(e&&e.message||e))+'</div>';return}
  q('qmOut').innerHTML='<img class="imgout" src="'+url+'">'
   +'<div class="aviso ok" style="margin-top:10px">Confira os números na imagem: eles são exatamente os que estão na ficha, nada foi arredondado nem inventado. Se algum estiver errado, é porque está errado na ficha — corrija e desenhe de novo, não custa nada.</div>'
   +'<button class="btn btn-p" id="qmBaixar">Baixar em 1200 × 1200</button>';
  q('qmBaixar').onclick=function(){salvar(url,(F.sku||'produto')+'-medidas.png')};
  q('qmOut').scrollIntoView({behavior:'smooth',block:'nearest'});
 });
};
function medidasSobre(u,pecas,cb){
 var im=new Image();
 im.onload=function(){fontesProntas(function(){
  var S=1200,c=document.createElement('canvas');c.width=S;c.height=S;
  var x=c.getContext('2d');x.imageSmoothingQuality='high';
  x.fillStyle='#FFFFFF';x.fillRect(0,0,S,S);
  x.drawImage(im,0,0,S,S);
  var y0=Math.round(S*0.80);
  x.fillStyle='#FFFFFF';x.fillRect(0,y0,S,S-y0);
  x.fillStyle=DBC.linha;x.fillRect(70,y0,S-140,2);
  var itens=pecas.slice().sort(function(a,b){return a.h-b.h}),n=itens.length,slot=S/n-16;
  x.textAlign='center';
  itens.forEach(function(p,i){
   var cx=S*(2*i+1)/(2*n);
   x.fillStyle=DBC.rosa;x.fillRect(cx-22,y0+28,44,4);
   caber(x,p.rot,slot,'800',44,17);x.fillStyle=DBC.rosaT;x.fillText(p.rot,cx,y0+96);
   var t2=fmt(p.h)+' cm de altura';
   caber(x,t2,slot,'600',28,13);x.fillStyle=DBC.cinza;x.fillText(t2,cx,y0+140);
  });
  cb(c.toDataURL('image/png'));
 })};
 im.onerror=function(){alert('Não consegui abrir a imagem gerada para escrever por cima.')};
 im.src=u;
}

q('escCopy').onclick=function(){
 var t=q('escTxt').textContent,b=this;
 function done(){b.textContent='Copiado';setTimeout(function(){b.textContent='Copiar a frase'},1600)}
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,fallback)}else{fallback()}
 function fallback(){var a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(e){}document.body.removeChild(a);done()}
};
</script></body></html>`;
