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
header a{margin-left:auto;color:var(--db-cinza);text-decoration:none;font-size:.85rem;font-weight:600;display:inline-flex;align-items:center;min-height:44px;padding:0 10px;border-radius:8px}
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
.lbl-chk{display:flex;align-items:center;gap:12px;text-transform:none;letter-spacing:0;font-size:.92rem;font-weight:600;color:var(--db-tinta);cursor:pointer;margin:0;min-height:44px;padding:4px 0}
.lbl-chk input{width:auto;padding:0;margin:0;min-width:24px;min-height:24px;flex:0 0 auto;accent-color:var(--db-rosa)}
.pago{display:inline-block;background:#FFF6E8;border:1px solid #F0DCC0;color:#8A5A16;font-size:.68rem;font-weight:800;letter-spacing:.08em;padding:3px 8px;border-radius:99px;margin-left:8px;vertical-align:2px}
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
  <p>A IA não entende centímetro — ela entende comparação escrita. Preencha a altura real e copie a frase pronta para dentro de qualquer prompt de imagem ou de vídeo.</p>
  <p><strong>Produto sozinho:</strong> preencha só o seu produto, ali na direita. Eu comparo com um objeto que todo mundo conhece. <strong>Dois produtos juntos na mesma foto</strong> (um refil e o purificador, por exemplo): preencha os dois e eu escrevo a proporção entre eles. A ordem não importa, descubro sozinho qual é o maior.</p>
  <div class="g2">
   <div>
    <div class="field"><label>Outro produto na mesma foto <span style="font-weight:400;opacity:.7">(opcional)</span></label><input id="mA" placeholder="só se dois aparecem juntos"></div>
    <div class="g3">
     <div class="field"><label>Altura cm</label><input id="hA" inputmode="decimal" placeholder="43"></div>
     <div class="field"><label>Largura cm</label><input id="wA" inputmode="decimal" placeholder="33"></div>
     <div class="field"><label>Prof. cm</label><input id="dA" inputmode="decimal" placeholder="35"></div>
    </div>
   </div>
   <div>
    <div class="field"><label>O seu produto</label><input id="mB" placeholder="Taça Vidro Orbe Rosa 400 ml"></div>
    <div class="g3">
     <div class="field"><label>Altura cm</label><input id="hB" inputmode="decimal" placeholder="17"></div>
     <div class="field"><label>Diâm./Larg. cm</label><input id="wB" inputmode="decimal" placeholder="6"></div>
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

 <div class="card" id="cfor">
  <h2>Colar a ficha do fornecedor<span class="gratis">NÃO CUSTA NADA</span></h2>
  <p>Aquele bloco de especificações que o fornecedor manda no WhatsApp ou no site — medidas, capacidades, material, o que vem na caixa. <strong>Cole aqui inteiro, do jeito que veio.</strong> Eu leio, separo, e mostro o que entendi. Só depois que você conferir e mandar é que isso desce para a ficha ali embaixo.</p>
  <p style="font-size:.86rem">Isto é leitura de texto dentro do seu próprio navegador: <strong>não é IA e não custa nada</strong>. Pode colar e apagar quantas vezes quiser.</p>
  <div class="field"><label>Ficha do fornecedor — cole o texto inteiro</label><textarea id="fdTxt" style="min-height:150px;font-size:.88rem" placeholder="Ex.:&#10;Produto: Kit 15 Potes Herméticos Quadrados&#10;Marca: RISHON&#10;Material: Plástico ABS Premium, livre de BPA&#10;Vedação de silicone, tampa com trava, empilháveis&#10;4 potes 0,8 L - 9 x 10 x 9 cm&#10;6 potes 1,4 L - 13 x 14 x 10 cm&#10;4 potes 2,0 L - 20 x 14 x 10 cm&#10;1 pote 2,8 L - 30 x 14 x 10 cm&#10;Conteúdo da embalagem: 15 potes + 1 cartela de etiquetas"></textarea></div>
  <button class="btn btn-p" id="fdLer">Ler e me mostrar o que você entendeu</button>
  <div id="fdMsg"></div>
  <div id="fdOut"></div>
 </div>

 <div class="card">
  <h2>3 · Ficha do produto</h2>
  <p>É daqui que saem as fotos do anúncio. O que estiver escrito aqui é o que a imagem vai mostrar — e só isso. Campo vazio é foto que não sai: prefiro te perguntar a inventar um detalhe que o produto não tem.</p>
  <p style="font-size:.86rem"><strong>Tudo que você digita aqui fica guardado no seu próprio navegador.</strong> Pode recarregar a página, pode o celular dormir, pode fechar e voltar depois: a ficha volta do jeito que estava. Nada disso sai do seu aparelho.</p>
  <div id="memMsg"></div>
  <button class="btn btn-g" id="memLimpar" style="margin-bottom:14px">Limpar a ficha e começar outro produto<span class="gratis">NÃO CUSTA NADA</span></button>
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
  <div class="field"><label>Comparação — como é SEM o seu produto (foto 7)</label><textarea id="fComp" style="min-height:66px" placeholder="Ex.: pacotes de mantimento abertos e amassados, presos com prendedor, jogados soltos na mesma prateleira, farinha derramada. Só a cena — sem escrever &quot;antes&quot; nem &quot;depois&quot; na imagem."></textarea></div>
  <div class="field"><label>Passo a passo — uma etapa por linha, no máximo 4 (foto 8)</label><textarea id="fPasso" style="min-height:80px;font-size:.88rem" placeholder="Ex.:&#10;mãos despejando o arroz dentro do pote aberto&#10;mãos encaixando a tampa e fechando as duas travas laterais&#10;mãos colando a etiqueta na frente do pote&#10;mãos empilhando o pote fechado em cima de outro igual"></textarea></div>

  <div class="field" style="margin-top:16px"><label class="lbl-chk"><input type="checkbox" id="fKit">Este produto é um kit — vem mais de uma peça na caixa</label></div>
  <div id="kitBox" style="display:none">
   <div class="aviso" style="margin-bottom:12px">Em kit a IA erra sempre a mesma coisa: <strong>a quantidade de peças</strong> e <strong>a diferença de tamanho entre elas</strong>. Escreva as peças aqui e eu escrevo a conta dentro dos prompts — "4 + 6 + 4 + 1 = 15, nem 14 nem 16" — e monto o quadro de medidas na escala real.</div>
   <div class="field"><label>As peças do kit — uma por linha</label><textarea id="fPecas" style="min-height:104px;font-size:.88rem" placeholder="quantidade | nome ou capacidade | altura x largura x profundidade&#10;&#10;4 | 0,8 L | 9 x 10 x 9&#10;6 | 1,4 L | 13 x 10 x 14&#10;4 | 2,0 L | 20 x 10 x 14&#10;1 | 2,8 L | 30 x 10 x 14"></textarea></div>
   <button class="btn btn-g" id="kitLer">Conferir o que eu entendi</button>
   <div id="kitOut"></div>
  </div>

  <div class="field" style="margin-top:16px"><label>Fotos reais do produto (até 4)</label><input type="file" id="fFotos" accept="image/*" multiple></div>
  <div class="tira" id="fThumbs"></div>
  <div class="aviso">A foto real é o que segura a fidelidade: cor, formato, textura e rótulo saem dela. Sem foto real eu até gero, mas aí é desenho do que a IA acha que o seu produto é — e isso não vai para anúncio. Não tem foto limpa, só aquela arte do fornecedor cheia de texto e marca? Use o <strong>recorte</strong> logo aqui embaixo.</div>
  <button class="btn btn-p" id="fMontar">Montar os prompts das fotos</button>
  <div id="fMsg"></div>
 </div>

 <div class="card" id="crec">
  <h2>Só tenho a arte do fornecedor<span class="gratis">NÃO CUSTA NADA</span></h2>
  <p>Quando não existe foto limpa do produto — só aquela arte do fornecedor cheia de texto, seta, selo e a marca deles — dá para aproveitar assim mesmo: <strong>recorte só o produto</strong>. O pedaço recortado entra como foto real, e aí a IA copia a cor, o formato e o rótulo certos em vez de inventar.</p>
  <p style="font-size:.86rem">Isto aqui é recorte de imagem dentro do seu próprio navegador: <strong>não é IA e não custa nada</strong>. A arte só sai do seu computador quando você mandar gerar uma foto.</p>
  <div class="field"><label>Arte do fornecedor</label><input type="file" id="rcFile" accept="image/*"></div>
  <div id="rcArea" style="display:none">
   <div class="aviso" style="margin-bottom:10px">Arraste o mouse em cima do produto para marcar o recorte. Corte fora <strong>a marca do fornecedor, textos, números, preços, selos, setas e qualquer outra marca</strong> — o que sobrar dentro do quadro é exatamente o que a IA vai copiar.</div>
   <div id="rcWrap" style="position:relative;display:inline-block;max-width:100%;cursor:crosshair;touch-action:none;line-height:0;border:1px solid var(--db-linha);border-radius:8px;overflow:hidden">
    <canvas id="rcCv" style="max-width:100%;display:block"></canvas>
    <div id="rcSel" style="position:absolute;display:none;border:2px dashed var(--db-rosa);background:rgba(233,44,86,.14);pointer-events:none"></div>
   </div>
   <div id="rcInfo" style="margin-top:8px;font-size:.86rem;color:var(--db-cinza-forte)"></div>
   <div class="field" style="margin-top:12px"><label class="lbl-chk"><input type="checkbox" id="rcBranco" checked>Deixar quadrado, centralizado e com fundo branco</label></div>
   <button class="btn btn-p" id="rcUsar">Recortar e usar como foto real</button>
   <button class="btn btn-g" id="rcBaixar" style="margin-top:8px;width:100%">Recortar e baixar o arquivo</button>
   <div id="rcMsg"></div>
   <div class="tira" id="rcOut" style="margin-top:10px"></div>
   <div class="aviso" style="margin-top:4px">Se depois você trocar as fotos reais lá em cima, a lista começa do zero e o recorte sai junto — nesse caso é só clicar de novo em <strong>usar como foto real</strong>.</div>
  </div>
 </div>

 <div class="card" id="cfotos" style="display:none">
  <h2>4 · As fotos do anúncio — parada 1</h2>
  <p>Uma foto por vez. Eu não sigo sozinho para a próxima: você olha, aprova ou manda refazer. Se a imagem sair errada, clique em <strong>Não concordo</strong> embaixo dela: eu olho a imagem e reescrevo o prompt. Cada prompt abaixo pode ser editado antes de gerar — o texto que estiver na caixa é exatamente o que vai para a IA.</p>
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

 <div class="card" id="cajuste">
  <h2>Não concordo com a imagem — o que ajustar</h2>
  <p>Quando a imagem sair errada, é aqui que a gente conserta. Você me diz o que não gostou, sobe a imagem que saiu, e eu <strong>olho a imagem de verdade</strong>: conto as peças, confiro a proporção entre os tamanhos, procuro logo de fornecedor, texto inventado, item a mais ou a menos, mão com dedo errado. Devolvo o que está errado em português claro e o <strong>prompt perfeito já reescrito</strong>, pronto para gerar de novo.</p>
  <p style="font-size:.86rem">Analisar <strong>não gera imagem nenhuma</strong> — é só texto, custa alguns centavos. A cobrança da imagem só volta quando você clicar em gerar, e eu paro e pergunto o preço antes.</p>
  <div class="g2">
   <div class="field">
    <label>Qual imagem é essa</label>
    <select id="aQual">
     <option value="1">Foto 1 — CAPA</option>
     <option value="2">Foto 2 — DETALHE REAL</option>
     <option value="3">Foto 3 — DIFERENCIAL</option>
     <option value="4">Foto 4 — USO REAL</option>
     <option value="5">Foto 5 — TAMANHO REAL</option>
     <option value="6">Foto 6 — O QUE VEM NA CAIXA</option>
     <option value="0">Outra imagem — não é uma das 6</option>
    </select>
   </div>
   <div class="field">
    <label>Subir a imagem que foi criada</label>
    <input type="file" id="aFile" accept="image/*">
   </div>
  </div>
  <div class="tira" id="aThumb"></div>
  <div class="aviso" id="aFonte">Ainda não tenho imagem para olhar. Suba o arquivo acima — ou gere uma das fotos aqui em cima e clique em <strong>Não concordo</strong>, que eu pego a imagem sozinho.</div>
  <div class="field" style="margin-top:12px">
   <label>O que eu não gostei / o que quero que mude</label>
   <textarea id="aQueixa" style="min-height:90px" placeholder="Escreva do seu jeito. Ex.: vieram só 12 potes e tinham que ser 15 · todos saíram do mesmo tamanho · apareceu o nome do fabricante na tampa · o fundo saiu cinza em vez de branco · a etiqueta veio escrita e tinha que vir em branco"></textarea>
  </div>
  <div class="field">
   <label>Prompt que gerou essa imagem</label>
   <textarea id="aPrompt" style="min-height:110px" placeholder="Escolha a foto ali em cima que eu preencho sozinho — ou cole aqui o prompt que você usou."></textarea>
  </div>
  <button class="btn btn-p" id="aGo">Analisar a imagem e montar o prompt perfeito</button>
  <div id="aMsg"></div>
  <div id="aOut"></div>
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


 <div class="card" id="cRot">
  <h2>6 · Roteiro do vídeo<span class="gratis">CUSTA CENTAVOS</span></h2>
  <p>Aqui eu escrevo o roteiro no seu tom, usando a ficha real que está lá em cima. Este passo é <strong>só texto</strong>: nenhuma imagem e nenhum vídeo saem daqui, então pode mandar reescrever quantas vezes quiser.</p>
  <p style="font-size:.86rem">O vídeo sai <strong>sem voz</strong>. Quem conta a história é a imagem mais a legenda curta na tela — por isso cada cena tem no máximo 7 palavras de legenda.</p>
  <div class="g2">
   <div class="field"><label>Formato</label>
    <select id="vFmt"><option value="720x1280">Em pé, 9:16 — feito para celular</option><option value="1280x720">Deitado, 16:9</option></select></div>
   <div class="field"><label>Duração</label>
    <select id="vSeg"><option value="4">4 segundos — 2 cenas — R$ 2,10</option><option value="8">8 segundos — 3 cenas — R$ 4,10</option><option value="12">12 segundos — 5 cenas — R$ 6,20</option><option value="24" selected>24 segundos — 8 cenas — R$ 12,40 (dois clipes emendados)</option></select></div>
  </div>
  <div class="field"><label>Quer pedir alguma coisa neste vídeo? (opcional)</label>
   <textarea id="rtPedido" placeholder="Ex: começar mostrando o armário bagunçado e terminar com os potes empilhados e alinhados"></textarea></div>
  <button class="btn btn-p" id="rtGerar">Escrever o roteiro</button>
  <div id="rtMsg"></div>
  <div id="rtOut"></div>
 </div>

 <div class="card" id="cAp">
  <h2>7 · Aprovar o roteiro<span class="tag t-gate">PARADA 2</span></h2>
  <p>Daqui para baixo tudo custa dinheiro de verdade. Enquanto você não aprovar o roteiro, eu não monto cena nenhuma e não gero nada.</p>
  <p style="font-size:.86rem">Pode editar as legendas ali em cima antes de aprovar: <strong>o que estiver escrito nos campos é o que eu vou usar</strong>, não o que a IA escreveu primeiro.</p>
  <div id="apMsg"></div>
  <button class="btn btn-p" id="apOk" disabled>Aprovar este roteiro</button>
 </div>

 <div class="card" id="cCen">
  <h2>8 · Cenas e prompts<span class="gratis">CUSTA CENTAVOS</span></h2>
  <p>Com o roteiro aprovado eu escrevo dois prompts: o do <strong>quadro-chave</strong>, que é a primeira imagem e vira a referência do vídeo inteiro, e o do <strong>vídeo</strong>, que descreve o movimento.</p>
  <p style="font-size:.86rem">Nos dois eu escrevo a <strong>proporção por extenso</strong>, com as suas medidas reais. O gerador erra tamanho quando não lê a proporção escrita — é o mesmo motivo do contrato de medidas lá em cima.</p>
  <div id="cnMsg"></div>
  <button class="btn btn-p" id="cnGerar" disabled>Montar as cenas e os prompts</button>
  <div id="cnOut"></div>
 </div>

 <div class="card" id="cQk">
  <h2>9 · Quadro-chave<span class="tag t-gate">PARADA 3</span><span class="pago">CUSTA UMA IMAGEM</span></h2>
  <p>Uma imagem barata antes do vídeo caro. É de propósito: se o quadro-chave sair com pote a mais, cor errada ou tamanho fora de proporção, o vídeo sairia errado junto — e o vídeo custa mais de vinte vezes o preço desta imagem.</p>
  <p style="font-size:.86rem">Olhe com calma antes de aprovar. Conte as peças. Confira a proporção. Refazer aqui é barato.</p>
  <div id="qkMsg"></div>
  <button class="btn btn-p" id="qkGerar" disabled>Gerar o quadro-chave</button>
  <div class="custo" id="qkCusto"></div>
  <div id="qkOut"></div>
 </div>

 <div class="card" id="cVd">
  <h2>10 · Gerar o vídeo<span class="tag t-gate">PARADA 4</span><span class="pago">O PASSO MAIS CARO</span></h2>
  <p>Só roda com o quadro-chave aprovado como referência — nunca do zero. Leva de <strong>1 a 4 minutos</strong> e custa cerca de <strong>R$ 2,10</strong> a cada 4 segundos. Os valores desta página são <strong>estimativa</strong>: quem cobra é a OpenAI, em dólar (US$ 0,10 por segundo de vídeo), então se o dólar subir o valor em real sobe junto.</p>
  <p style="font-size:.86rem">Depois que você manda gerar, <strong>o pedido fica guardado no seu navegador</strong>. Se a página cair, se o celular dormir ou se você fechar sem querer, dá para voltar aqui e buscar o vídeo que já foi pago, em vez de pagar de novo. Mesmo assim: <strong>baixe o arquivo assim que ele aparecer</strong>, porque no servidor ele não fica guardado para sempre.</p>
  <div id="vdResgate"></div>
  <div id="vdMsg"></div>
  <button class="btn btn-p" id="vdGerar" disabled>Gerar o vídeo</button>
  <div class="custo" id="vdCusto"></div>
  <div id="vdOut"></div>
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
   <li class="feito"><strong>Roteiro</strong> do vídeo, no tom da Dona Begô<span class="tag t-agora">no ar</span></li>
   <li class="feito"><strong>Aprovar o roteiro</strong> antes de virar cena<span class="tag t-gate">parada 2</span></li>
   <li class="feito"><strong>Cenas e prompts</strong> com a proporção escrita dentro<span class="tag t-agora">no ar</span></li>
   <li class="feito"><strong>Quadro-chave</strong> — uma imagem de ~R$ 0,25 antes do vídeo de ~R$ 2,10<span class="tag t-gate">parada 3</span></li>
   <li class="feito"><strong>Gerar o vídeo</strong> só com o quadro aprovado como referência<span class="tag t-gate">parada 4</span></li>
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

/* ---- le a resposta do servidor sem jogar erro tecnico na tela ----
   Quando o servidor cai, ele devolve uma pagina de erro em HTML em vez de dados.
   Sem isto a tela mostrava "Unexpected token <", que nao explica nada. */
function lerJson(r){
 return r.text().then(function(t){
  try{return JSON.parse(t)}catch(e){
   var m='O servidor não respondeu direito agora.',fim=' Espere alguns segundos e tente de novo.';
   if(r.status===504||r.status===524)m='O servidor demorou demais e a conexão caiu no meio do caminho.';
   else if(r.status===502||r.status===503)m='O servidor está fora do ar neste momento.';
   else if(r.status===429){m='Muitos pedidos seguidos. Espere um minuto antes de tentar de novo.';fim=''}
   else if(r.status===413){m='O arquivo que você mandou é grande demais para o servidor aceitar.';fim=''}
   else if(r.status>=500)m='Deu erro dentro do servidor (código '+r.status+').';
   else if(r.status>=400)m='O servidor recusou o pedido (código '+r.status+').';
   throw new Error(m+fim);
  }
 });
}

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
 if(d.kits&&d.kits.length)h+='<br>Vendido em <strong>'+d.kits.length+'</strong> quantidade(s): '+esc(d.kits.join(', '))+' unidade(s) — uma capa por quantidade.';
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
 if(!A.h&&!B.h){alert('Preencha a altura em cm do seu produto.');return}
 if(!A.h||!B.h){
  /* um produto so: nao existe segundo item para comparar, entao a referencia
     e um objeto que todo mundo conhece. Sem isso o botao travava e obrigava a
     inventar um segundo produto so para satisfazer o formulario. */
  var U=A.h?A:B, nU=U.n||'o produto';
  var s1='REGRA DE ESCALA (obrigatória nesta cena, escreva do jeito que está aqui):\n\n';
  s1+='O '+nU+' mede '+fmt(U.h)+' cm de altura';
  if(U.w)s1+=' por '+fmt(U.w)+' cm de '+(U.d?'largura':'diâmetro');
  if(U.d)s1+=' por '+fmt(U.d)+' cm de profundidade';
  s1+=' — é '+comparar(U.h)+'.\n\n';
  s1+='O '+nU+' aparece INTEIRO no enquadramento, apoiado sobre a superfície, em uma única fotografia real com lente 50 mm. ';
  s1+='Se aparecer pessoa, mão ou qualquer objeto do dia a dia na cena, o tamanho relativo precisa bater com essa medida: '+comparar(U.h)+'. ';
  s1+='Se na imagem ele parecer muito maior ou muito menor que isso, a imagem está errada e precisa ser refeita.\n\n';
  s1+='Sem colagem, sem montagem, sem foto dentro de foto.';
  q('escTxt').textContent=s1;
  q('escOut').style.display='block';
  q('escOut').scrollIntoView({behavior:'smooth',block:'nearest'});
  return;
 }
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

/* ---- memoria da ficha: nada do que ela digita se perde ao recarregar ----
   Grava tudo em localStorage 'db_studio_ficha' a cada tecla e devolve ao abrir.
   Fica so no navegador dela; nada disso vai para servidor nenhum. */
var FICHA_CAMPOS=['fNome','fSku','fMarca','fCat','fDif','fCaixa','fComp','fPasso','fPecas','fdTxt','mA','hA','wA','dA','mB','hB','wB','dB','rtPedido'];
function fichaSalvar(){
 try{
  var o={};
  FICHA_CAMPOS.forEach(function(id){var e=q(id);if(e)o[id]=e.value});
  o.fKit=q('fKit').checked;
  var et=q('escTxt');o.escTxt=et?et.textContent:'';
  localStorage.setItem('db_studio_ficha',JSON.stringify(o));
 }catch(e){}
}
function fichaLimpar(){
 try{localStorage.removeItem('db_studio_ficha')}catch(e){}
 FICHA_CAMPOS.forEach(function(id){var e=q(id);if(e)e.value=''});
 q('fKit').checked=false;q('kitBox').style.display='none';
 q('escOut').style.display='none';q('escTxt').textContent='';
 q('fMsg').innerHTML='';q('seis').innerHTML='';q('kitOut').innerHTML='';q('fdOut').innerHTML='';q('fdMsg').innerHTML='';
 q('memMsg').innerHTML='<div class="aviso ok">Ficha limpa. Pode começar um produto novo.</div>';
}
(function(){
 var d=null;try{var r=localStorage.getItem('db_studio_ficha');if(r)d=JSON.parse(r)}catch(e){}
 if(d){
  FICHA_CAMPOS.forEach(function(id){var e=q(id);if(e&&typeof d[id]==='string'&&d[id])e.value=d[id]});
  if(d.fKit){q('fKit').checked=true;q('kitBox').style.display='block'}
  if(d.escTxt){q('escTxt').textContent=d.escTxt;q('escOut').style.display='block'}
  var cheio=FICHA_CAMPOS.some(function(id){var e=q(id);return e&&e.value});
  if(cheio)q('memMsg').innerHTML='<div class="aviso ok">Recuperei o que você já tinha digitado da última vez. Se for outro produto agora, clique em <strong>Limpar a ficha</strong> aqui embaixo.</div>';
 }
 FICHA_CAMPOS.forEach(function(id){var e=q(id);if(e){e.addEventListener('input',fichaSalvar);e.addEventListener('change',fichaSalvar)}});
 q('fKit').addEventListener('change',fichaSalvar);
 var origCalc=q('calc').onclick;
 q('calc').onclick=function(){if(origCalc)origCalc.call(this);fichaSalvar()};
 q('memLimpar').onclick=function(){
  if(confirm('Apagar tudo que está escrito na ficha, nas medidas e na ficha do fornecedor?\n\nIsso não apaga nenhuma foto já baixada.'))fichaLimpar();
 };
})();

/* preenche a ficha com o que veio do ANNOUNCER PRO */
(function(){
 var d=null;try{var r=localStorage.getItem('db_studio_entrada');if(r)d=JSON.parse(r)}catch(e){}
 if(!d)return;
 if(d.nome&&!q('fNome').value)q('fNome').value=d.nome;
 if(d.sku&&!q('fSku').value)q('fSku').value=d.sku;
 if(d.marca&&!q('fMarca').value)q('fMarca').value=d.marca;
 if(d.categoria&&!q('fCat').value)q('fCat').value=d.categoria;
 if(d.nome&&!q('mB').value)q('mB').value=d.nome;
 /* as medidas vinham no pacote mas so eram exibidas como texto; agora entram
    nos campos. Aceita "17 x 6 cm", "43 x 33 x 35 cm", "22cm x 6,3cm". */
 if(d.medidas){
  var txt=String(d.medidas);
  /* so interpreta se parecer medida mesmo: precisa ter "cm" ou um separador x.
     Sem isso, um "400ml" solto viraria 400 cm de altura. */
  var mm=(/cm/i.test(txt)||/[x\u00d7]/i.test(txt))?(txt.replace(/,/g,'.').match(/\d+(?:\.\d+)?/g)||[]):[];
  mm=mm.map(Number).filter(function(n){return n>0&&n<=400}).slice(0,3);
  if(mm[0]&&!q('hB').value)q('hB').value=mm[0];
  if(mm[1]&&!q('wB').value)q('wB').value=mm[1];
  if(mm[2]&&!q('dB').value)q('dB').value=mm[2];
 }
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
 if(i===6)return {modo:'estudio',txt:'Flat lay visto de cima, fundo branco liso, itens alinhados com espacamento igual e sombra suave, mostrando exatamente e somente os seguintes itens que acompanham o '+nome+cat+': '+F.caixa+'\nNenhum item alem destes. Nenhum acessorio extra, nenhum manual, nenhuma peca que nao esteja escrita acima. Nenhum texto na imagem.'};
 if(i===7)return {modo:'estudio',txt:'Uma unica imagem dividida ao meio por uma linha vertical fina, fundo cinza claro neutro e liso nos dois lados, MESMA luz, MESMA altura de camera e MESMA distancia nos dois lados.\nDo lado DIREITO: '+nome+', arrumado, limpo e organizado.\nDo lado ESQUERDO: '+F.comp+'\nOs dois lados ocupam exatamente metade da imagem cada um. Os objetos aparecem inteiros, sem corte.\nREGRA DESTA FOTO, obrigatoria: nenhum texto, nenhuma palavra, nenhum numero, nenhuma seta, nenhum icone, nenhum X e nenhum sinal de certo ou errado desenhado na imagem. A comparacao se le pela propria cena. A legenda entra depois por fora.'};
 return {modo:'ambiente',txt:'Uma unica imagem dividida em '+F.passos.length+' quadros iguais, lado a lado na horizontal, todos com o MESMO fundo cinza claro neutro, a MESMA luz e a MESMA distancia de camera, mostrando na ordem como se usa o '+nome+':\n'+F.passos.map(function(p,n){return 'Quadro '+(n+1)+': '+p}).join('\n')+'\nSao maos adultas em todos os quadros. SEM ROSTO, sem cabeca, sem pessoa de corpo inteiro. Maos com anatomia correta, cinco dedos em cada, sem anel e sem unha postica. O produto aparece inteiro e reconhecivel em todos os quadros.\nREGRA DESTA FOTO, obrigatoria: nenhum texto, nenhum numero, nenhuma seta e nenhum icone desenhado na imagem. A numeracao dos passos entra depois por fora.'};
}

var TITULOS=[
 ['CAPA','Primeira impressão de confiança. É a foto que aparece na busca.'],
 ['DETALHE REAL','Educar rápido: como é por dentro e como encaixa.'],
 ['DIFERENCIAL','Justificar por que o seu vale mais.'],
 ['USO REAL','A pessoa se imaginar usando.'],
 ['TAMANHO REAL','Acabar com a dúvida de tamanho — é o que mais gera pergunta e devolução.'],
 ['O QUE VEM NA CAIXA','Valor percebido e transparência.'],
 ['COMPARAÇÃO','Mostrar lado a lado por que o seu resolve e o outro jeito não resolve.'],
 ['PASSO A PASSO','Tirar o medo de não saber usar — é a objeção silenciosa que mais trava a compra.']
];
var NFOTOS=TITULOS.length;
/* fotos que aceitam frase escrita por cima. A CAPA nunca entra:
   o Mercado Livre bloqueia capa com texto, logotipo, selo ou marca d agua. */
var COM_LEGENDA={2:1,3:1,6:1,7:1,8:1};

function fichaAtual(){
 return {
  nome:q('fNome').value.trim()||'produto',
  sku:q('fSku').value.trim(),
  marca:q('fMarca').value.trim(),
  cat:q('fCat').value.trim(),
  dif:q('fDif').value.trim(),
  caixa:q('fCaixa').value.trim(),
  comp:q('fComp').value.trim(),
  passos:(q('fPasso').value||'').split('\n').map(function(s){return s.trim()}).filter(function(s){return s}).slice(0,4),
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
 if(!q('fNome').value.trim()){msg.innerHTML='<div class="erro">Escreva ao menos o nome do produto — é ele que entra em todos os prompts.</div>';return}
 var faltas=[];
 if(!FOTOS_REAIS.length)faltas.push('nenhuma <strong>foto real</strong> anexada — sem ela a IA desenha o que ela acha que o seu produto é');
 if(!F.dif)faltas.push('o campo <strong>diferencial</strong> está vazio — a foto 3 fica travada até você escrever');
 if(!F.caixa)faltas.push('o campo <strong>o que vem na caixa</strong> está vazio — a foto 6 fica travada, porque mostrar item que não vai junto vira reclamação');
 if(F.kit&&!F.pecas.length)faltas.push('você marcou <strong>kit</strong> mas as peças ainda não foram lidas — escreva uma peça por linha e clique em "Conferir o que eu entendi"; sem isso as fotos 1, 5 e 6 saem sem a contagem e a IA erra a quantidade');
 if(!F.escala&&!(F.kit&&F.pecas.length))faltas.push('a <strong>frase de escala</strong> ainda não foi gerada — role para o contrato de medidas e clique no botão; a foto 5 depende dela');
 if(!F.comp)faltas.push('o campo <strong>comparação</strong> está vazio — a foto 7 fica travada. Ela é opcional: sem ela o anúncio funciona, com ela costuma converter melhor');
 if(F.passos.length<2)faltas.push('o campo <strong>passo a passo</strong> tem menos de 2 etapas — a foto 8 fica travada. Também é opcional');
 montarSeis(F);
 msg.innerHTML=faltas.length?('<div class="aviso" style="margin-top:10px"><strong>'+LIBERADAS.length+' de '+NFOTOS+' fotos liberadas.</strong> Ainda falta: '+faltas.join(' · ')+'.</div>'):'<div class="aviso ok" style="margin-top:10px">Ficha completa. As '+NFOTOS+' fotos estão liberadas.</div>';
 q('cfotos').style.display='block';
 q('cfotos').scrollIntoView({behavior:'smooth',block:'start'});
};

var LIBERADAS=[];
function montarSeis(F){
 var alvo=q('seis');alvo.innerHTML='';LIBERADAS=[];
 var lote=document.createElement('div');
 lote.className='card';lote.style.background='var(--db-rosa-nevoa)';lote.style.border='1px solid var(--db-rosa-claro)';
 lote.innerHTML='<div id="loteBox"></div>';
 alvo.appendChild(lote);
 for(var i=1;i<=NFOTOS;i++){
  var t=TITULOS[i-1],r=receita(i,F),trava='';
  if(i===3&&!F.dif)trava='Escreva o <strong>diferencial</strong> na ficha e clique de novo em "Montar os prompts das fotos".';
  if(i===5&&!F.escala&&!(F.kit&&F.pecas.length))trava='Gere a <strong>frase de escala</strong> no contrato de medidas e clique de novo em "Montar os prompts das fotos". Se for kit, dá para usar as peças: marque <strong>kit</strong> na ficha e clique em "Conferir o que eu entendi".';
  if(i===6&&!F.caixa)trava='Escreva <strong>o que vem na caixa</strong> na ficha e clique de novo em "Montar os prompts das fotos".';
  if(i===7&&!F.comp)trava='Escreva no campo <strong>Comparação</strong> da ficha como é a vida SEM o seu produto, e clique de novo em "Montar os prompts das fotos". Esta foto é opcional: sem ela o anúncio funciona, com ela costuma converter melhor.';
  if(i===8&&F.passos.length<2)trava='Escreva pelo menos <strong>2 etapas</strong> no campo Passo a passo da ficha, uma por linha, e clique de novo em "Montar os prompts das fotos". Esta foto também é opcional.';
  var d=document.createElement('div');
  d.className='foto';d.id='fb'+i;
  var h='<h3>FOTO '+i+' — '+t[0]+'</h3><p class="obj">'+t[1]+'</p>';
  if(trava){h+='<div class="aviso">'+trava+'</div>';}
  else{
   h+='<textarea id="pp'+i+'"></textarea>';
   if(COM_LEGENDA[i]){
    h+='<div class="field" style="margin-top:10px"><label>Frase para escrever por cima — no máximo 8 palavras<span class="gratis">NÃO CUSTA NADA</span></label><input id="lg'+i+'" maxlength="46" placeholder="'+esc(SUG_LEGENDA[i]||'')+'"></div>';
    h+='<div class="custo" id="lc'+i+'">Escrita por mim, no padrão da marca — não pela IA. Deixe em branco se não quiser frase nenhuma.</div>';
   }
   h+='<button class="btn btn-p" id="gg'+i+'">Gerar a foto '+i+'</button>';
   h+='<div class="custo" id="cc'+i+'"></div>';
   h+='<div id="ss'+i+'"></div>';
  }
  d.innerHTML=h;alvo.appendChild(d);
  if(!trava){
   LIBERADAS.push(i);
   q('pp'+i).value=moldura(r.txt,r.modo);
   (function(n){q('gg'+n).onclick=function(){gerar(n,this)}})(i);
   if(COM_LEGENDA[i])(function(n){q('lg'+n).oninput=function(){avisaLegenda(n)}})(i);
   q('cc'+i).textContent=custoTxt();
  }
 }
 montarLote();
}
var SUG_LEGENDA={2:'Fecha e trava dos dois lados',3:'Vedação de silicone de verdade',6:'Tudo isso vem na caixa',7:'Do bagunçado ao organizado',8:'Enche, fecha, etiqueta e empilha'};

function contaPalavras(t){return (String(t||'').trim().split(/\s+/).filter(function(s){return s}).length)}
function avisaLegenda(n){
 var t=q('lg'+n).value,p=contaPalavras(t),box=q('lc'+n);
 if(!t.trim()){box.innerHTML='Escrita por mim, no padrão da marca — não pela IA. Deixe em branco se não quiser frase nenhuma.';box.style.color='';return}
 if(p>8){box.innerHTML='<strong>'+p+' palavras.</strong> O mercado recomenda no máximo 8 — mais que isso não se lê no celular. Eu escrevo assim mesmo se você quiser.';box.style.color='var(--db-rosa-texto)';}
 else{box.innerHTML=p+' palavra'+(p>1?'s':'')+'. Bom tamanho para ler no celular.';box.style.color='';}
}

/* ---- gerar todas de uma vez, com UMA confirmacao que mostra o preco total ---- */
function custoUnit(){var v=q('fQual').value;return v==='low'?0.06:v==='high'?1.00:0.25}
function reais(n){return 'R$ '+n.toFixed(2).replace('.',',')}
function montarLote(){
 var box=q('loteBox');if(!box)return;
 var n=LIBERADAS.length;
 if(!n){box.innerHTML='<div class="aviso">Nenhuma foto liberada ainda. Preencha a ficha ali em cima.</div>';return}
 box.innerHTML='<h3 style="margin:0 0 6px">Gerar tudo de uma vez</h3>'
  +'<p style="margin:0 0 12px">São <strong>'+n+' fotos</strong> liberadas. Eu gero uma atrás da outra e mostro cada uma aqui embaixo. <strong>Você confirma o preço uma vez só</strong> — depois cada foto continua podendo ser aprovada, refeita ou ajustada separadamente.</p>'
  +'<button class="btn btn-p" id="loteGo">Gerar as '+n+' fotos<span class="pago">'+reais(n*custoUnit())+' no total</span></button>'
  +'<button class="btn btn-g" id="loteDl" style="margin-top:8px;width:100%">Baixar todas as fotos prontas em 1200 × 1200</button>'
  +'<div id="loteMsg"></div>';
 q('loteGo').onclick=function(){loteGerar(this)};
 q('loteDl').onclick=function(){loteBaixar()};
 q('loteDl').disabled=!LIBERADAS.some(function(i){return document.getElementById('ii'+i)});
}
var LOTE_RODANDO=false;
function loteGerar(btn){
 if(LOTE_RODANDO)return;
 var faltam=LIBERADAS.filter(function(i){return !document.getElementById('ii'+i)});
 if(!faltam.length){alert('Todas as fotos liberadas já foram geradas. Para refazer uma, use o botão "Gerar de novo" dentro dela.');return}
 var total=faltam.length*custoUnit();
 var lista=faltam.map(function(i){return 'foto '+i+' — '+TITULOS[i-1][0]}).join('\n');
 if(!confirm('Gerar '+faltam.length+' fotos agora?\n\n'+lista+'\n\nCusto total estimado: '+reais(total)+'\n('+faltam.length+' × '+reais(custoUnit())+' na qualidade '+q('fQual').value+')\n\nEssa é a única cobrança deste passo. Cancelar aqui não gasta nada.'))return;
 LOTE_RODANDO=true;btn.disabled=true;
 var feitas=0;
 function passo(k){
  if(k>=faltam.length){
   LOTE_RODANDO=false;btn.disabled=false;btn.innerHTML='Gerar as que faltarem<span class="pago">'+reais(custoUnit())+' cada</span>';
   q('loteMsg').innerHTML='<div class="aviso ok" style="margin-top:10px">Pronto: '+feitas+' de '+faltam.length+' fotos saíram. Role a página para conferir uma por uma, aprovar ou mandar refazer. <strong>Baixe os arquivos antes de fechar a página.</strong></div>';
   q('loteDl').disabled=false;
   return;
  }
  var i=faltam[k];
  btn.textContent='Gerando a foto '+i+'... ('+(k+1)+' de '+faltam.length+')';
  q('loteMsg').innerHTML='<div class="aviso" style="margin-top:10px">Gerando a foto '+i+' — '+TITULOS[i-1][0]+'. Cada foto leva de 20 a 60 segundos. Não feche a página.</div>';
  gerar(i,q('gg'+i),{semConfirmar:true,aoTerminar:function(deuCerto){if(deuCerto)feitas++;passo(k+1)}});
 }
 passo(0);
}
function loteBaixar(){
 var prontas=LIBERADAS.filter(function(i){return document.getElementById('ii'+i)});
 if(!prontas.length){alert('Nenhuma foto pronta para baixar ainda.');return}
 prontas.forEach(function(i,k){setTimeout(function(){baixar(i,q('ii'+i).src)},k*450)});
 q('loteMsg').innerHTML='<div class="aviso ok" style="margin-top:10px">Baixando '+prontas.length+' arquivos, um a cada meio segundo. Se o navegador perguntar se pode baixar vários, diga que sim.</div>';
}
q('fQual').onchange=function(){
 for(var i=1;i<=NFOTOS;i++){var e=document.getElementById('cc'+i);if(e)e.textContent=custoTxt()}
 montarLote();
};
function custoTxt(){var v=q('fQual').value;return 'Custo estimado desta imagem: '+(v==='low'?'R$ 0,06':v==='high'?'R$ 1,00':'R$ 0,25');}

function gerar(i,btn,opc){
 opc=opc||{};
 var fim=opc.aoTerminar||function(){};
 var p=(q('pp'+i).value||'').trim();
 if(!p){if(opc.semConfirmar){fim(false);return}alert('O prompt da foto '+i+' está vazio.');return}
 if(!opc.semConfirmar&&!confirm('Gerar a foto '+i+' agora?\n\n'+custoTxt()+'\n\nEssa é a única cobrança deste passo. Se não gostar, você manda refazer.')){return}
 var box=q('ss'+i);box.innerHTML='<div class="spin">Gerando a foto '+i+'... isso leva de 20 a 60 segundos.</div>';
 btn.disabled=true;btn.textContent='Gerando...';
 fetch('/api/image',{method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({prompt:p,quality:q('fQual').value,size:'1024x1024',imagens:FOTOS_REAIS})})
 .then(lerJson)
 .then(function(j){
  btn.disabled=false;btn.textContent='Gerar de novo a foto '+i;
  if(j.error){box.innerHTML='<div class="erro">'+esc(j.error)+'</div>';fim(false);return}
  if(!j.image){box.innerHTML='<div class="erro">A resposta veio sem imagem. Tente de novo.</div>';fim(false);return}
  var u='data:image/png;base64,'+j.image;
  var Fa=fichaAtual(),temMed=(i===5&&Fa.kit&&Fa.pecas.length>=2);
  var lg=COM_LEGENDA[i]&&q('lg'+i)?(q('lg'+i).value||'').trim():'';
  box.innerHTML='<img class="imgout" id="ii'+i+'" src="'+u+'">'
   +(temMed?'<button class="btn btn-g" id="md5" style="margin-top:10px">Escrever as medidas reais por cima e baixar<span class="gratis">NÃO CUSTA NADA</span></button><div class="custo">O texto é escrito por mim, não pela IA — os números são exatamente os que você digitou.</div>':'')
   +(COM_LEGENDA[i]?'<button class="btn btn-g" id="lb'+i+'" style="margin-top:10px;width:100%">Escrever a frase por cima<span class="gratis">NÃO CUSTA NADA</span></button><div class="custo" id="lm'+i+'">'+(lg?'Vai escrever: <strong>'+esc(lg)+'</strong>':'Escreva a frase no campo ali em cima e clique aqui. A CAPA nunca leva texto — o Mercado Livre bloqueia capa com texto ou selo.')+'</div>':'')
   +'<div class="g2" style="margin-top:10px">'
   +'<button class="btn btn-g" id="dl'+i+'">Baixar em 1200 x 1200</button>'
   +'<button class="btn btn-p" id="ok'+i+'">Está boa, aprovar</button></div>'
   +'<button class="btn btn-g" id="nc'+i+'" style="margin-top:8px;width:100%">Não concordo — quero ajustar esta foto</button>'
   +'<div id="ap'+i+'"></div>';
  q('nc'+i).onclick=function(){levarParaAjuste(i)};
  if(temMed)q('md5').onclick=function(){
   var b=this;b.disabled=true;b.textContent='Escrevendo...';
   medidasSobre(u,Fa.pecas,function(url){
    b.disabled=false;b.innerHTML='Escrever as medidas reais por cima e baixar<span class="gratis">NÃO CUSTA NADA</span>';
    q('ii5').src=url;
    salvar(url,(Fa.sku||'produto')+'-foto5-medidas.png');
   });
  };
  if(COM_LEGENDA[i])q('lb'+i).onclick=function(){
   var frase=(q('lg'+i).value||'').trim();
   if(!frase){alert('Escreva a frase no campo "Frase para escrever por cima" ali em cima da foto '+i+'.');return}
   var b=this;b.disabled=true;b.textContent='Escrevendo...';
   legendaSobre(q('ii'+i).src,frase,function(url){
    b.disabled=false;b.innerHTML='Escrever de novo (troque a frase antes)<span class="gratis">NÃO CUSTA NADA</span>';
    q('ii'+i).src=url;
    q('lm'+i).innerHTML='Frase escrita na imagem. Clique em <strong>Baixar em 1200 × 1200</strong> para guardar o arquivo com a frase.';
   });
  };
  q('dl'+i).onclick=function(){baixar(i,q('ii'+i).src)};
  q('ok'+i).onclick=function(){
   q('fb'+i).classList.add('aprovada');
   q('ap'+i).innerHTML='<div class="aviso ok" style="margin-top:10px">Foto '+i+' aprovada. Baixe o arquivo antes de fechar a página — ele não fica guardado no servidor.</div>';
   this.disabled=true;this.textContent='Aprovada';
  };
  var bd=document.getElementById('loteDl');if(bd)bd.disabled=false;
  fim(true);
 })
 .catch(function(e){
  btn.disabled=false;btn.textContent='Gerar de novo a foto '+i;
  box.innerHTML='<div class="erro">Não consegui falar com o gerador de imagem. '+esc(String(e&&e.message||e))+'</div>';
  fim(false);
 });
}

/* ---- escreve a frase por cima da foto: faixa rosa no alto, letra branca ----
   Quem escreve sou eu, no canvas, com o texto que ELA digitou. A IA nunca
   escreve palavra dentro da imagem: e onde a IA mais erra. */
function legendaSobre(u,frase,cb){
 var im=new Image();
 im.onload=function(){fontesProntas(function(){
  var S=1200,c=document.createElement('canvas');c.width=S;c.height=S;
  var x=c.getContext('2d');x.imageSmoothingQuality='high';
  x.fillStyle='#FFFFFF';x.fillRect(0,0,S,S);
  x.drawImage(im,0,0,S,S);
  var palavras=String(frase).trim().split(/\s+/),linhas=[];
  if(palavras.length<=4){linhas=[palavras.join(' ')]}
  else{var meio=Math.ceil(palavras.length/2);linhas=[palavras.slice(0,meio).join(' '),palavras.slice(meio).join(' ')]}
  var H=linhas.length>1?Math.round(S*0.20):Math.round(S*0.14);
  x.fillStyle=DBC.rosa;x.fillRect(0,0,S,H);
  x.textAlign='center';x.textBaseline='middle';x.fillStyle='#FFFFFF';
  var larg=S-120,tam=linhas.length>1?62:76,menor=tam;
  linhas.forEach(function(l){var s=caber(x,l,larg,'800',tam,26);if(s<menor)menor=s});
  x.font='800 '+menor+'px '+FT;
  if(linhas.length>1){
   x.fillText(linhas[0],S/2,H/2-menor*0.6);
   x.fillText(linhas[1],S/2,H/2+menor*0.6);
  }else{x.fillText(linhas[0],S/2,H/2)}
  x.textBaseline='alphabetic';
  cb(c.toDataURL('image/png'));
 })};
 im.onerror=function(){alert('Não consegui abrir a imagem para escrever a frase por cima.')};
 im.src=u;
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

/* ====== "não concordo com a imagem": eu olho a imagem e reescrevo o prompt ======
   A análise nunca gera imagem. Ela devolve o diagnóstico e o prompt novo;
   quem manda gerar de novo é ela, no botão da foto, com o custo na tela. */
var AJIMG=null;

function reduzir(file,cb){
 var fr=new FileReader();
 fr.onload=function(){
  var im=new Image();
  im.onload=function(){
   var m=1024,w=im.width,h=im.height;
   if(w>m||h>m){if(w>h){h=Math.round(h*m/w);w=m}else{w=Math.round(w*m/h);h=m}}
   var c=document.createElement('canvas');c.width=w;c.height=h;
   c.getContext('2d').drawImage(im,0,0,w,h);
   cb(c.toDataURL('image/png'));
  };
  im.src=fr.result;
 };
 fr.readAsDataURL(file);
}

q('aFile').onchange=function(){
 var f=(this.files||[])[0];
 if(!f){AJIMG=null;q('aThumb').innerHTML='';fonteAjuste();return}
 reduzir(f,function(u){
  AJIMG={data:u.split(',')[1],media:'image/png'};
  q('aThumb').innerHTML='';
  var t=document.createElement('img');t.className='thumb';t.src=u;q('aThumb').appendChild(t);
  fonteAjuste();
 });
};

function imgDaPagina(){
 var n=q('aQual').value;
 if(n==='0')return null;
 var e=document.getElementById('ii'+n);
 if(!e||!e.src||e.src.indexOf('data:image')!==0)return null;
 return {data:e.src.split(',')[1],media:'image/png'};
}

function fonteAjuste(){
 var n=q('aQual').value,t;
 if(AJIMG)t='Vou analisar <strong>a imagem que você subiu</strong>.';
 else if(imgDaPagina())t='Vou analisar <strong>a foto '+n+' que acabou de sair aqui na página</strong>. Se quiser que eu olhe outra, suba o arquivo acima.';
 else t='Ainda não tenho imagem para olhar. Suba o arquivo acima — sem imagem eu só consigo trabalhar pelo que você escrever.';
 q('aFonte').innerHTML=t;
}

function promptDaFoto(n){
 var p=document.getElementById('pp'+n);
 if(!p)return;
 var cur=(q('aPrompt').value||'').trim(),deOutra=false;
 for(var k=1;k<=6;k++){var o=document.getElementById('pp'+k);if(o&&o.value.trim()===cur)deOutra=true}
 if(!cur||deOutra)q('aPrompt').value=p.value;
}

q('aQual').onchange=function(){promptDaFoto(this.value);fonteAjuste()};

function levarParaAjuste(i){
 q('aQual').value=String(i);
 var p=document.getElementById('pp'+i);
 if(p)q('aPrompt').value=p.value;
 AJIMG=null;q('aFile').value='';q('aThumb').innerHTML='';
 q('aMsg').innerHTML='';q('aOut').innerHTML='';
 fonteAjuste();
 q('cajuste').scrollIntoView({behavior:'smooth',block:'start'});
 try{q('aQueixa').focus()}catch(e){}
}

function fichaTxt(){
 var F=fichaAtual(),t='Produto: '+F.nome+'\n';
 if(F.sku)t+='SKU: '+F.sku+'\n';
 if(F.marca)t+='Marca que vai no anuncio: '+F.marca+'\n';
 if(F.cat)t+='Categoria: '+F.cat+'\n';
 if(F.dif)t+='Diferencial: '+F.dif+'\n';
 if(F.caixa)t+='O que vem na caixa: '+F.caixa+'\n';
 if(F.kit&&F.pecas.length){
  t+='E um kit com '+totalPecas(F.pecas)+' pecas no total, em '+F.pecas.length+' tamanhos: '+gruposTxt(F.pecas)+'.\n';
  t+='Alturas reais: '+tamanhosTxt(F.pecas)+'.\n';
 }
 return t;
}

q('aGo').onclick=function(){
 var btn=this,msg=q('aMsg');
 var pr=(q('aPrompt').value||'').trim();
 var qx=(q('aQueixa').value||'').trim();
 var im=AJIMG||imgDaPagina();
 if(!pr){msg.innerHTML='<div class="erro">Falta o prompt que gerou essa imagem. Escolha a foto ali em cima que eu preencho, ou cole o prompt na caixa.</div>';return}
 if(!qx&&!im){msg.innerHTML='<div class="erro">Escreva o que você quer mudar, ou suba a imagem para eu analisar. Com uma das duas coisas eu já trabalho.</div>';return}
 btn.disabled=true;btn.textContent='Analisando...';
 q('aOut').innerHTML='';
 msg.innerHTML='<div class="spin">Olhando a imagem e reescrevendo o prompt... leva de 10 a 40 segundos.</div>';
 fetch('/api/analisar',{method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({prompt:pr,queixa:qx,ficha:fichaTxt(),imagem:im})})
 .then(lerJson)
 .then(function(j){
  btn.disabled=false;btn.textContent='Analisar de novo';
  if(j.error){msg.innerHTML='<div class="erro">'+esc(j.error)+'</div>';return}
  if(!j.prompt){msg.innerHTML='<div class="erro">Veio uma resposta sem o prompt novo. Tente de novo.</div>';return}
  msg.innerHTML='';
  var n=q('aQual').value,h='';
  if(j.diagnostico)h+='<div class="aviso" style="margin-top:12px"><strong>O que eu vi nessa imagem:</strong><br>'+esc(j.diagnostico).replace(/\n/g,'<br>')+'</div>';
  h+='<div class="field" style="margin-top:12px"><label>Prompt perfeito do ajuste — já corrigido</label><textarea id="aNovo" style="min-height:190px"></textarea></div>';
  h+='<div class="g2">';
  if(n!=='0')h+='<button class="btn btn-p" id="aUsar">Trocar o prompt da foto '+n+' por este</button>';
  h+='<button class="btn btn-g" id="aCopy">Copiar o prompt</button></div>';
  h+='<div class="custo">Nada foi gerado ainda e nada foi cobrado. Leia o prompt, mude o que quiser, e só depois clique em gerar lá em cima — eu pergunto o preço antes.</div>';
  q('aOut').innerHTML=h;
  q('aNovo').value=j.prompt;
  if(n!=='0')q('aUsar').onclick=function(){
   var p=document.getElementById('pp'+n);
   if(!p){msg.innerHTML='<div class="erro">A foto '+n+' ainda não está montada. Clique em \u201cMontar os prompts das fotos\u201d na ficha e tente de novo.</div>';return}
   p.value=q('aNovo').value;
   this.disabled=true;this.textContent='Prompt trocado na foto '+n;
   var cx=document.getElementById('fb'+n);
   if(cx){cx.classList.remove('aprovada');cx.scrollIntoView({behavior:'smooth',block:'start'})}
  };
  q('aCopy').onclick=function(){
   var b=this,t=q('aNovo');
   t.focus();t.select();
   try{t.setSelectionRange(0,999999)}catch(e){}
   try{document.execCommand('copy');b.textContent='Copiado!'}catch(e){b.textContent='Selecione e copie'}
   setTimeout(function(){b.textContent='Copiar o prompt'},1800);
  };
  q('aOut').scrollIntoView({behavior:'smooth',block:'nearest'});
 })
 .catch(function(e){
  btn.disabled=false;btn.textContent='Analisar a imagem e montar o prompt perfeito';
  msg.innerHTML='<div class="erro">Não consegui falar com a análise. '+esc(String(e&&e.message||e))+'</div>';
 });
};

/* ====== leitor da ficha do fornecedor ======
   Texto puro, dentro do navegador: nenhuma chamada de API, nenhum custo.
   Nada é escrito na ficha sem ela confirmar — o botão de usar só aparece
   depois que ela lê o que foi entendido. */
var FDR = null;

var FDVIS = [
 [/veda(?:\u00e7|c)(?:\u00e3|a)o|silicone|anel de borracha|gaxeta/i, 'veda\u00e7\u00e3o de silicone na tampa'],
 [/trava|clique|clip|presilha|fecho lateral/i, 'tampa com trava que fecha no clique'],
 [/empilh/i, 'pe\u00e7as empilh\u00e1veis, uma encaixando na outra'],
 [/transparente|cristal/i, 'corpo transparente, d\u00e1 para ver o que est\u00e1 dentro'],
 [/herm(?:\u00e9|e)tic/i, 'fechamento herm\u00e9tico'],
 [/etiqueta|adesiv/i, 'cartela de etiquetas adesivas'],
 [/bico dosador|dosador/i, 'bico dosador'],
 [/al(?:\u00e7|c)a/i, 'al\u00e7a'],
 [/medidor|gradua(?:\u00e7|c)(?:\u00e3|a)o|escala em ml/i, 'marca\u00e7\u00e3o de medida no corpo'],
 [/antiderrapante|base de borracha/i, 'base antiderrapante'],
 [/tampa colorida|tampa rosa|tampa azul|tampa verde|tampa preta|tampa branca/i, 'tampa colorida contrastando com o corpo'],
 [/dobr(?:\u00e1|a)vel|retr(?:\u00e1|a)til/i, 'pe\u00e7a dobr\u00e1vel'],
 [/inox|a(?:\u00e7|c)o inox/i, 'acabamento em a\u00e7o inox']
];

var FDINVIS = [
 [/bpa/i, 'livre de BPA'],
 [/at(?:\u00f3|o)xic/i, 'at\u00f3xico'],
 [/lava.?lou(?:\u00e7|c)as/i, 'pode ir na lava-lou\u00e7as'],
 [/micro.?ondas/i, 'pode ir no micro-ondas'],
 [/freezer|congelador/i, 'pode ir no freezer'],
 [/garantia/i, 'garantia'],
 [/certifica|anvisa|inmetro|iso 9001/i, 'certifica\u00e7\u00e3o'],
 [/vaz(?:\u00e3|a)o|litros?\/hora|l\/h/i, 'vaz\u00e3o'],
 [/durabilidade|vida (?:\u00fa|u)til|meses de uso/i, 'durabilidade']
];

function fdLimpa(t){
 return String(t == null ? '' : t)
  .replace(/\u00a0/g, ' ')
  .replace(/[\u00d7\u2715\u2716\u2a2f]/g, 'x')
  .replace(/\r/g, '')
  .replace(/[\t ]+/g, ' ');
}
function fdConv(n, u){
 var v = parseFloat(String(n).replace(',', '.'));
 if(!isFinite(v) || v <= 0) return 0;
 if(u === 'mm') v = v / 10;
 if(u === 'm') v = v * 100;
 return Math.round(v * 100) / 100;
}
function fdDims(l){
 var s = l.toLowerCase(), d = {h:0, w:0, p:0}, achou = false;
 var lab = [
  ['h', /(?:altura|alt\.?|height)\s*[:=]?\s*([0-9]+(?:[.,][0-9]+)?)\s*(cm|mm)?/],
  ['w', /(?:largura|larg\.?|di(?:\u00e2|a)metro|di(?:\u00e2|a)m\.?|width)\s*[:=]?\s*([0-9]+(?:[.,][0-9]+)?)\s*(cm|mm)?/],
  ['p', /(?:profundidade|prof\.?|comprimento|comp\.?|depth)\s*[:=]?\s*([0-9]+(?:[.,][0-9]+)?)\s*(cm|mm)?/]
 ];
 for(var i = 0; i < lab.length; i++){
  var m = s.match(lab[i][1]);
  if(m){ d[lab[i][0]] = fdConv(m[1], m[2] || 'cm'); achou = true }
 }
 if(achou) return d;
 var m2 = s.match(/([0-9]+(?:[.,][0-9]+)?)\s*(cm|mm)?\s*x\s*([0-9]+(?:[.,][0-9]+)?)\s*(cm|mm)?(?:\s*x\s*([0-9]+(?:[.,][0-9]+)?)\s*(cm|mm)?)?/);
 if(m2){
  var u = m2[2] || m2[4] || m2[6] || 'cm';
  d.h = fdConv(m2[1], m2[2] || u);
  d.w = fdConv(m2[3], m2[4] || u);
  if(m2[5]) d.p = fdConv(m2[5], m2[6] || u);
  return d;
 }
 var m3 = s.match(/([0-9]+(?:[.,][0-9]+)?)\s*(cm|mm)\b/);
 if(m3) d.h = fdConv(m3[1], m3[2]);
 return d;
}
function fdQtd(l){
 var s = l.toLowerCase();
 var m = s.match(/(?:^|[^0-9a-z\u00e0-\u00ff.,])([0-9]{1,3})\s*(?:un\b|und\b|unid[a-z]*|pe(?:\u00e7|c)as?\b|pcs\b|potes?\b|itens?\b|pares?\b|copos?\b|tampas?\b)/);
 if(m) return parseInt(m[1], 10);
 m = s.match(/^\s*([0-9]{1,3})\s*x\s*[^0-9]/);
 if(m) return parseInt(m[1], 10);
 m = s.match(/^\s*([0-9]{1,3})\s*[-\u2013\u2014|]/);
 if(m) return parseInt(m[1], 10);
 return 0;
}
function fdNome(l){
 var s = l.toLowerCase();
 var t = [['potes?','pote'],['copos?','copo'],['tampas?','tampa'],['bandejas?','bandeja'],
          ['jarras?','jarra'],['garrafas?','garrafa'],['panelas?','panela'],['formas?','forma'],
          ['pratos?','prato'],['tigelas?','tigela'],['cestos?','cesto'],['caixas?','caixa'],
          ['refis|refil','refil'],['filtros?','filtro'],['velas?','vela']];
 for(var i = 0; i < t.length; i++){ if(new RegExp('\\b(?:' + t[i][0] + ')\\b').test(s)) return t[i][1] }
 return '';
}
function fdCap(l){
 var m = l.toLowerCase().match(/([0-9]+(?:[.,][0-9]+)?)\s*(ml|lt|l|litros?)\b/);
 if(!m) return '';
 var v = m[1].replace('.', ',');
 return m[2] === 'ml' ? (v + ' ml') : (v + ' L');
}
function fdIgnora(l){
 return /caixa m(?:\u00e1|a)ster|embalagem|pacote|frete|peso|cubagem|volume da caixa|master|c(?:\u00f3|o)digo de barras|ean|ncm|sku do fornecedor|pre(?:\u00e7|c)o|valor|cnpj|minimo|m(?:\u00ed|i)nimo/i.test(l);
}
function fdPedacos(txt){
 var saida = [];
 fdLimpa(txt).split('\n').forEach(function(linha){
  linha.split(/[;\u2022\u00b7]/).forEach(function(l){
   l = l.trim();
   if(!l) return;
   var re = /(?:^|[^0-9a-z])([0-9]{1,3})\s*(?:un\b|und\b|unid[a-z]*|pe(?:\u00e7|c)as?\b|pcs\b|potes?\b|itens?\b|copos?\b)/gi;
   var pos = [], m;
   while((m = re.exec(l)) !== null){
    var i = m.index;
    while(i < l.length && !/[0-9]/.test(l.charAt(i))) i++;
    pos.push(i);
   }
   if(pos.length > 1){
    if(pos[0] > 0) saida.push(l.slice(0, pos[0]).trim());
    for(var k = 0; k < pos.length; k++) saida.push(l.slice(pos[k], k + 1 < pos.length ? pos[k+1] : l.length).trim());
   } else {
    saida.push(l);
   }
  });
 });
 return saida.filter(function(x){ return !!x });
}
function fdCampo(txt, chaves){
 var linhas = fdLimpa(txt).split('\n');
 var re = new RegExp('^ ?(?:' + chaves + ')\\s*[:\\-\u2013]\\s*(.+)$', 'i');
 for(var i = 0; i < linhas.length; i++){
  var m = linhas[i].trim().match(re);
  if(m && m[1].trim()) return m[1].trim().replace(/[.;]+$/, '');
 }
 return '';
}
function fdLista(txt, tabela){
 var achados = [];
 tabela.forEach(function(par){
  if(par[0].test(txt) && achados.indexOf(par[1]) < 0) achados.push(par[1]);
 });
 return achados;
}

function fdLeitura(txt){
 var r = {nome:'', cat:'', marcaForn:'', material:'', cor:'', caixa:'', pecas:[], vis:[], invis:[], sobra:[]};
 if(!fdLimpa(txt).trim()) return r;

 r.nome = fdCampo(txt, 'nome do produto|nome|produto|t(?:\u00ed|i)tulo|titulo|item|modelo');
 r.cat = fdCampo(txt, 'categoria|tipo|segmento');
 r.marcaForn = fdCampo(txt, 'marca|fabricante|fornecedor|brand');
 r.material = fdCampo(txt, 'material|composi(?:\u00e7|c)(?:\u00e3|a)o|mat(?:\u00e9|e)ria prima');
 r.cor = fdCampo(txt, 'cor|cores|colora(?:\u00e7|c)(?:\u00e3|a)o');
 r.caixa = fdCampo(txt, 'conte(?:\u00fa|u)do da embalagem|conte(?:\u00fa|u)do|o que vem na caixa|itens inclusos|itens|inclui|acompanha|acompanham|embalagem cont(?:\u00e9|e)m|composi(?:\u00e7|c)(?:\u00e3|a)o do kit|kit cont(?:\u00e9|e)m');

 fdPedacos(txt).forEach(function(l){
  if(fdIgnora(l)) return;
  var d = fdDims(l);
  if(!(d.h > 0)) return;
  var qtd = fdQtd(l), cap = fdCap(l);
  if(!qtd && !cap) return;
  var nom = fdNome(l);
  var rot = cap ? ((nom ? nom + ' ' : '') + cap) : (nom ? nom : (qtd + (qtd > 1 ? ' pe\u00e7as' : ' pe\u00e7a')));
  r.pecas.push({qtd: qtd || 1, rot: rot, h: d.h, w: d.w, p: d.p, linha: l});
 });

 r.vis = fdLista(txt, FDVIS);
 r.invis = fdLista(txt, FDINVIS);
 return r;
}

function fdCaixaSugerida(r){
 if(r.caixa) return r.caixa;
 if(!r.pecas.length) return '';
 var t = r.pecas.map(function(p){ return p.qtd + ' de ' + p.rot }).join(', ');
 return totalPecas(r.pecas) + ' pe\u00e7as no total (' + t + '). Nada al\u00e9m disso.';
}
function fdDifSugerido(r){
 if(!r.vis.length) return '';
 return r.vis.join('; ') + '.';
}

function fdBloco(id, titulo, valor, alvo, nota){
 var jaTem = alvo ? (q(alvo).value || '').trim() : '';
 var h = '<div class="field" style="margin-top:14px">';
 h += '<label class="lbl-chk"><input type="checkbox" id="' + id + '" checked>' + titulo + '</label>';
 h += '<div class="saida" style="margin-top:6px;white-space:pre-wrap">' + esc(valor) + '</div>';
 if(nota) h += '<div style="font-size:.8rem;color:var(--db-cinza);margin-top:4px">' + nota + '</div>';
 if(jaTem && jaTem !== valor) h += '<div style="font-size:.8rem;color:var(--db-rosa-texto);margin-top:4px">Esse campo j\u00e1 tem texto escrito. Se deixar marcado, o texto de agora <strong>substitui</strong> o que estava l\u00e1.</div>';
 h += '</div>';
 return h;
}

q('fdLer').onclick = function(){
 var r = fdLeitura(q('fdTxt').value);
 FDR = r;
 var msg = q('fdMsg'), out = q('fdOut');
 out.innerHTML = '';
 if(!fdLimpa(q('fdTxt').value).trim()){
  msg.innerHTML = '<div class="erro">Cole primeiro a ficha do fornecedor aqui em cima. Pode ser o texto do WhatsApp, do site ou do PDF \u2014 do jeito que veio.</div>';
  return;
 }
 var dif = fdDifSugerido(r), caixa = fdCaixaSugerida(r);
 var achouAlgo = r.nome || r.cat || dif || caixa || r.pecas.length;
 if(!achouAlgo){
  msg.innerHTML = '<div class="erro">Li o texto inteiro e n\u00e3o consegui separar nada com seguran\u00e7a. Em vez de chutar, prefiro te avisar: preencha a ficha na m\u00e3o ali embaixo, ou cole um texto que tenha pelo menos as medidas em cm (por exemplo <strong>4 potes 0,8 L - 9 x 10 x 9 cm</strong>).</div>';
  return;
 }
 msg.innerHTML = '';
 var h = '<div class="aviso ok" style="margin-top:14px"><strong>Entendi assim \u2014 confira antes de eu usar.</strong><br>Nada foi escrito na ficha ainda. Desmarque o que n\u00e3o quiser e clique no bot\u00e3o l\u00e1 embaixo.</div>';

 if(r.nome) h += fdBloco('fdcNome', 'Nome do produto', r.nome, 'fNome', '');
 if(r.cat) h += fdBloco('fdcCat', 'Categoria', r.cat, 'fCat', '');
 if(dif) h += fdBloco('fdcDif', 'Diferencial que d\u00e1 para VER numa foto', dif, 'fDif', 'S\u00f3 entrou aqui o que aparece na imagem. O resto est\u00e1 listado mais abaixo.');
 if(caixa) h += fdBloco('fdcCaixa', 'O que vem na caixa', caixa, 'fCaixa', '');

 if(r.pecas.length){
  var linhas = r.pecas.map(function(p){
   return p.qtd + ' | ' + p.rot + ' | ' + fmt(p.h) + (p.w ? ' x ' + fmt(p.w) : '') + (p.p ? ' x ' + fmt(p.p) : '');
  }).join('\n');
  var det = r.pecas.map(function(p){
   return p.qtd + ' \u00d7 ' + esc(p.rot) + ' \u2014 ' + fmt(p.h) + ' cm de altura' + (p.w ? ' \u00d7 ' + fmt(p.w) + ' cm' : '') + (p.p ? ' \u00d7 ' + fmt(p.p) + ' cm' : '');
  }).join('\n');
  h += fdBloco('fdcPecas', 'As pe\u00e7as do kit \u2014 ' + totalPecas(r.pecas) + ' pe\u00e7as em ' + r.pecas.length + ' tamanhos', det, 'fPecas',
   'Se eu marcar isso, o modo <strong>kit</strong> liga sozinho na ficha e esse total vai escrito por extenso dentro dos prompts das fotos 1, 5 e 6. <strong>Confira o total agora</strong> \u2014 total errado aqui \u00e9 pote a mais ou a menos na foto.');
  FDR.linhasKit = linhas;
 }

 if(r.invis.length){
  h += '<div class="aviso" style="margin-top:14px"><strong>Isto eu li, mas deixei de fora do diferencial de prop\u00f3sito:</strong><br>' + r.invis.map(esc).join(' \u00b7 ') + '<br><br>N\u00e3o \u00e9 esquecimento: nada disso aparece numa foto. Escrever na imagem vira texto inventado, e texto inventado em foto de an\u00fancio d\u00e1 reclama\u00e7\u00e3o. Esses pontos valem ouro no <strong>texto</strong> do an\u00fancio \u2014 use l\u00e1, n\u00e3o aqui.</div>';
 }
 if(r.marcaForn){
  h += '<div class="aviso" style="margin-top:14px"><strong>Marca do fornecedor: ' + esc(r.marcaForn) + '.</strong> N\u00e3o coloquei isso na ficha e n\u00e3o vou colocar. A marca que vai no an\u00fancio \u00e9 escolha sua \u2014 Sayonara, Dona Beg\u00f4 ou Purif\u00e1cil \u2014 e o nome do fabricante \u00e9 justamente uma das coisas que os prompts mandam a IA n\u00e3o desenhar.</div>';
 }
 if(r.material || r.cor){
  var ex = [];
  if(r.material) ex.push('Material: ' + r.material);
  if(r.cor) ex.push('Cor: ' + r.cor);
  h += '<div class="aviso" style="margin-top:14px">' + ex.map(esc).join('<br>') + '<br><br>Material e cor eu n\u00e3o escrevo na ficha sozinho: a cor de verdade sai da <strong>foto real</strong>, que \u00e9 mais confi\u00e1vel que a palavra do fornecedor. Se quiser, copie \u00e0 m\u00e3o para o diferencial.</div>';
 }

 h += '<button class="btn btn-p" id="fdUsar" style="margin-top:16px">Usar isso na ficha</button>';
 h += '<div class="custo">Nada sai do seu computador nesta etapa e nada foi cobrado.</div>';
 out.innerHTML = h;

 q('fdUsar').onclick = function(){
  var feitos = [];
  function marcado(id){ var e = document.getElementById(id); return e && e.checked }
  if(marcado('fdcNome')){ q('fNome').value = FDR.nome; feitos.push('nome do produto') }
  if(marcado('fdcCat')){ q('fCat').value = FDR.cat; feitos.push('categoria') }
  if(marcado('fdcDif')){ q('fDif').value = fdDifSugerido(FDR); feitos.push('diferencial') }
  if(marcado('fdcCaixa')){ q('fCaixa').value = fdCaixaSugerida(FDR); feitos.push('o que vem na caixa') }
  if(marcado('fdcPecas') && FDR.linhasKit){
   if(!q('fKit').checked){ q('fKit').checked = true; q('kitBox').style.display = 'block' }
   q('fPecas').value = FDR.linhasKit;
   q('kitLer').onclick();
   feitos.push('as pe\u00e7as do kit, com o modo kit ligado');
  }
  if(!feitos.length){
   q('fdMsg').innerHTML = '<div class="erro">Voc\u00ea desmarcou tudo, ent\u00e3o eu n\u00e3o mexi em nada da ficha.</div>';
   return;
  }
  this.disabled = true;
  this.textContent = 'Pronto, j\u00e1 est\u00e1 na ficha';
  q('fdMsg').innerHTML = '<div class="aviso ok">Preenchi na ficha: ' + feitos.join(', ') + '. Agora d\u00ea uma olhada l\u00e1 embaixo, corrija o que quiser com as suas palavras, anexe as fotos reais e s\u00f3 depois clique em <strong>Montar os prompts das fotos</strong>.</div>';
  q('fNome').scrollIntoView({behavior:'smooth', block:'center'});
 };
};

/* ====== recorte da arte do fornecedor ======
   Canvas puro: nenhuma chamada de API, nenhum custo. Serve para quando o
   fornecedor so mandou a arte pronta e nao existe foto limpa do produto.
   O recorte entra em FOTOS_REAIS, que e o que segura a fidelidade da IA. */
var RCX=0,RCY=0,RCW=0,RCH=0,RCDRAG=false,RCSX=0,RCSY=0,RCPRONTO=false;

q('rcFile').onchange=function(){
 var f=(this.files||[])[0];
 if(!f){RCPRONTO=false;q('rcArea').style.display='none';return}
 var fr=new FileReader();
 fr.onload=function(){
  var im=new Image();
  im.onload=function(){
   var m=1600,w=im.width,h=im.height;
   if(w>m||h>m){if(w>h){h=Math.round(h*m/w);w=m}else{w=Math.round(w*m/h);h=m}}
   var c=q('rcCv');c.width=w;c.height=h;
   c.getContext('2d').drawImage(im,0,0,w,h);
   RCPRONTO=true;RCW=0;RCH=0;
   q('rcArea').style.display='';
   q('rcSel').style.display='none';
   q('rcMsg').innerHTML='';
   q('rcInfo').innerHTML='Arte carregada, '+w+' por '+h+' pontos. Agora arraste o mouse em cima do produto.';
  };
  im.src=fr.result;
 };
 fr.readAsDataURL(f);
};

function rcPos(ev){
 var c=q('rcCv'),r=c.getBoundingClientRect();
 var t=(ev.touches&&ev.touches[0])?ev.touches[0]:ev;
 var x=(t.clientX-r.left)*c.width/r.width;
 var y=(t.clientY-r.top)*c.height/r.height;
 return {x:Math.max(0,Math.min(c.width,x)),y:Math.max(0,Math.min(c.height,y))};
}
function rcDesenha(){
 var c=q('rcCv'),r=c.getBoundingClientRect(),s=q('rcSel');
 if(RCW<2||RCH<2){s.style.display='none';return}
 var k=r.width/c.width;
 s.style.display='';
 s.style.left=Math.round(RCX*k)+'px';
 s.style.top=Math.round(RCY*k)+'px';
 s.style.width=Math.round(RCW*k)+'px';
 s.style.height=Math.round(RCH*k)+'px';
}
function rcTexto(){
 var w=Math.round(RCW),h=Math.round(RCH);
 if(w<2||h<2){q('rcInfo').innerHTML='Arraste o mouse em cima do produto para marcar o recorte.';return}
 var t='Recorte de '+w+' por '+h+' pontos. ';
 if(w<300||h<300)t+='<strong>Está pequeno.</strong> Abaixo de 300 pontos a referência fica borrada e a IA copia errado. Se der, pegue um pedaço maior, ou peça ao fornecedor a arte em qualidade melhor.';
 else t+='Bom tamanho para servir de referência.';
 q('rcInfo').innerHTML=t;
}
function rcStart(ev){
 if(!RCPRONTO)return;
 ev.preventDefault();
 var p=rcPos(ev);RCDRAG=true;RCSX=p.x;RCSY=p.y;RCX=p.x;RCY=p.y;RCW=0;RCH=0;
 rcDesenha();rcTexto();
}
function rcMove(ev){
 if(!RCDRAG)return;
 ev.preventDefault();
 var p=rcPos(ev);
 RCX=Math.min(RCSX,p.x);RCY=Math.min(RCSY,p.y);
 RCW=Math.abs(p.x-RCSX);RCH=Math.abs(p.y-RCSY);
 rcDesenha();rcTexto();
}
function rcEnd(){if(RCDRAG){RCDRAG=false;rcTexto()}}
q('rcWrap').addEventListener('mousedown',rcStart);
window.addEventListener('mousemove',rcMove);
window.addEventListener('mouseup',rcEnd);
q('rcWrap').addEventListener('touchstart',rcStart,{passive:false});
q('rcWrap').addEventListener('touchmove',rcMove,{passive:false});
window.addEventListener('touchend',rcEnd);
window.addEventListener('resize',rcDesenha);

function rcCorta(){
 if(!RCPRONTO||RCW<2||RCH<2)return null;
 var o=q('rcCv');
 var sx=Math.round(RCX),sy=Math.round(RCY),sw=Math.round(RCW),sh=Math.round(RCH);
 if(sx+sw>o.width)sw=o.width-sx;
 if(sy+sh>o.height)sh=o.height-sy;
 if(sw<2||sh<2)return null;
 var c=document.createElement('canvas'),g;
 if(q('rcBranco').checked){
  var lado=Math.max(sw,sh),pad=Math.round(lado*0.08),tot=lado+pad*2;
  c.width=tot;c.height=tot;g=c.getContext('2d');
  g.fillStyle='#FFFFFF';g.fillRect(0,0,tot,tot);
  g.drawImage(o,sx,sy,sw,sh,Math.round((tot-sw)/2),Math.round((tot-sh)/2),sw,sh);
 }else{
  c.width=sw;c.height=sh;g=c.getContext('2d');
  g.drawImage(o,sx,sy,sw,sh,0,0,sw,sh);
 }
 return c.toDataURL('image/png');
}
function rcErroMarque(){
 q('rcMsg').innerHTML='<div class="erro">Marque o recorte primeiro: arraste o mouse em cima do produto, dentro da arte.</div>';
}
q('rcUsar').onclick=function(){
 var u=rcCorta();
 if(!u){rcErroMarque();return}
 if(FOTOS_REAIS.length>=4){q('rcMsg').innerHTML='<div class="erro">Já são 4 fotos reais, que é o limite. Troque as fotos lá em cima antes de colocar outra.</div>';return}
 FOTOS_REAIS.push({data:u.split(',')[1],media:'image/png'});
 var a=document.createElement('img');a.className='thumb';a.src=u;q('fThumbs').appendChild(a);
 var b=document.createElement('img');b.className='thumb';b.src=u;q('rcOut').appendChild(b);
 q('rcMsg').innerHTML='<div class="aviso ok" style="margin-top:10px">Pronto. O recorte entrou nas fotos reais do produto, agora são '+FOTOS_REAIS.length+'. Antes de montar os prompts, olhe a miniatura lá em cima e confira se não sobrou nenhum texto ou marca dentro dele.</div>';
};
q('rcBaixar').onclick=function(){
 var u=rcCorta();
 if(!u){rcErroMarque();return}
 var nome=(q('fSku').value||q('fNome').value||'produto').replace(/[^A-Za-z0-9_-]+/g,'-').slice(0,40);
 var a=document.createElement('a');a.href=u;a.download='recorte-'+nome+'.png';
 document.body.appendChild(a);a.click();document.body.removeChild(a);
 q('rcMsg').innerHTML='<div class="aviso ok" style="margin-top:10px">Arquivo baixado como recorte-'+nome+'.png</div>';
};

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
/* ====== passos 6 a 10: roteiro, aprovação, cenas, quadro-chave e vídeo ======
   Quatro travas em série. Nada aqui roda sozinho e nada pago roda sem um
   confirm com o preço escrito na tela. O roteiro e as cenas são texto, custam
   centavos. O quadro-chave é uma imagem. O vídeo só sai com o quadro aprovado
   como referência — nunca do zero. */
var ROTEIRO=null,ROT_OK=false,CENAS=null,QK_B64=null,QK_OK=false;

function travar(){
 var ap=q('apOk');
 ap.disabled=(!ROTEIRO)||ROT_OK;
 ap.textContent=ROT_OK?'Roteiro aprovado':'Aprovar este roteiro';
 q('cnGerar').disabled=!ROT_OK;
 q('qkGerar').disabled=!CENAS;
 q('vdGerar').disabled=!(QK_OK&&QK_B64);
 q('apMsg').innerHTML=ROT_OK
  ?'<div class="aviso ok">Roteiro aprovado. Pode montar as cenas no passo 8.</div>'
  :(ROTEIRO
   ?'<div class="aviso">O roteiro está escrito aí em cima. Leia, ajuste as legendas se quiser, e só então aprove.</div>'
   :'<div class="aviso">Trancado. Primeiro escreva o roteiro no passo 6.</div>');
 q('cnMsg').innerHTML=ROT_OK?'':'<div class="aviso">Trancado. Aprove o roteiro no passo 7 primeiro.</div>';
 q('qkMsg').innerHTML=CENAS?'':'<div class="aviso">Trancado. Monte as cenas e os prompts no passo 8 primeiro.</div>';
 q('vdMsg').innerHTML=(QK_OK&&QK_B64)
  ?'<div class="aviso ok">Quadro-chave aprovado. O vídeo vai usar exatamente essa imagem como referência.</div>'
  :'<div class="aviso">Trancado. O vídeo só roda depois que você aprovar o quadro-chave no passo 9.</div>';
}

function limparDaqui(nivel){
 if(nivel<=1){ROT_OK=false}
 if(nivel<=2){CENAS=null;q('cnOut').innerHTML=''}
 if(nivel<=3){QK_B64=null;QK_OK=false;q('qkOut').innerHTML=''}
 q('vdOut').innerHTML='';
 travar();
}

function desenharRoteiro(){
 var R=ROTEIRO;
 if(!R||!R.cenas){q('rtOut').innerHTML='';return}
 var h='<div class="aviso ok" style="margin-top:14px"><strong>'+esc(R.titulo||'Roteiro')+'</strong>';
 if(R.gancho)h+='<br>'+esc(R.gancho);
 h+='</div>';
 for(var i=0;i<R.cenas.length;i++){
  var c=R.cenas[i]||{};
  h+='<div class="foto" style="margin-top:12px"><h3>Cena '+(i+1)+' · '+esc(c.tempo||'')+'</h3>'
   +'<p class="obj">'+esc(c.camera||'')+'</p>'
   +'<div class="field" style="margin:0"><label>Legenda que aparece na tela</label>'
   +'<input type="text" id="rl'+i+'" value="'+esc(c.legenda||'').replace(/"/g,'&quot;')+'"></div></div>';
 }
 if(R.cta)h+='<div class="saida" style="margin-top:12px"><strong>Chamada final:</strong> '+esc(R.cta)+'</div>';
 if(R.aviso)h+='<div class="aviso" style="margin-top:10px"><strong>Olha só:</strong> '+esc(R.aviso)+'</div>';
 q('rtOut').innerHTML=h;
}

q('rtGerar').onclick=function(){
 var F=fichaAtual();
 if(!F.nome||F.nome==='produto'){alert('Preencha o nome do produto na ficha antes de pedir o roteiro.');return}
 if(ROT_OK&&!confirm('Você já aprovou um roteiro.\n\nEscrever outro derruba essa aprovação e limpa as cenas, o quadro-chave e o vídeo desta tela. Se ainda não baixou o que já saiu, cancele e baixe primeiro.\n\nContinuar?'))return;
 var b=this;b.disabled=true;b.textContent='Escrevendo...';
 ROTEIRO=null;limparDaqui(1);
 q('rtOut').innerHTML='<div class="spin">Escrevendo o roteiro... alguns segundos.</div>';
 fetch('/api/roteiro',{method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({modo:'roteiro',ficha:fichaTxt(),escala:F.escala,seg:q('vSeg').value,size:q('vFmt').value,pedido:(q('rtPedido').value||'').trim()})})
 .then(lerJson)
 .then(function(j){
  b.disabled=false;b.textContent='Escrever o roteiro de novo';
  if(j.error){q('rtOut').innerHTML='<div class="erro">'+esc(j.error)+'</div>';travar();return}
  if(!j.roteiro||!j.roteiro.cenas){q('rtOut').innerHTML='<div class="erro">A resposta veio sem roteiro. Tente de novo.</div>';travar();return}
  ROTEIRO=j.roteiro;desenharRoteiro();travar();
  q('cAp').scrollIntoView({behavior:'smooth',block:'start'});
 })
 .catch(function(e){
  b.disabled=false;b.textContent='Escrever o roteiro';
  q('rtOut').innerHTML='<div class="erro">Não consegui falar com o escritor de roteiro. '+esc(String(e&&e.message||e))+'</div>';
  travar();
 });
};

q('apOk').onclick=function(){
 if(!ROTEIRO||!ROTEIRO.cenas)return;
 for(var i=0;i<ROTEIRO.cenas.length;i++){
  var e=document.getElementById('rl'+i);
  if(e)ROTEIRO.cenas[i].legenda=(e.value||'').trim();
 }
 ROT_OK=true;travar();
 q('cCen').scrollIntoView({behavior:'smooth',block:'start'});
};

q('cnGerar').onclick=function(){
 if(!ROT_OK){alert('Aprove o roteiro no passo 7 antes.');return}
 var F=fichaAtual(),b=this;
 b.disabled=true;b.textContent='Montando...';
 limparDaqui(2);
 q('cnOut').innerHTML='<div class="spin">Montando as cenas e escrevendo os dois prompts...</div>';
 fetch('/api/roteiro',{method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({modo:'cenas',ficha:fichaTxt(),escala:F.escala,seg:q('vSeg').value,size:q('vFmt').value,roteiro:ROTEIRO,pedido:(q('rtPedido').value||'').trim()})})
 .then(lerJson)
 .then(function(j){
  b.disabled=false;b.textContent='Montar de novo as cenas e os prompts';
  if(j.error){q('cnOut').innerHTML='<div class="erro">'+esc(j.error)+'</div>';travar();return}
  if(!j.cenas||!j.cenas.quadro||!j.cenas.video){q('cnOut').innerHTML='<div class="erro">A resposta veio incompleta. Tente de novo.</div>';travar();return}
  if(vdDois()&&!j.cenas.video2){q('cnOut').innerHTML='<div class="erro">O vídeo de 24 segundos precisa de dois prompts e só voltou um. Clique em montar de novo.</div>';travar();return}
  CENAS=j.cenas;
  var h='<div class="field" style="margin-top:14px"><label>Prompt do quadro-chave — a imagem do passo 9</label>'
   +'<textarea id="cnQ" style="min-height:150px">'+esc(CENAS.quadro)+'</textarea></div>'
   +'<div class="field"><label>'+(vdDois()?'Prompt do clipe 1 — os primeiros 12 segundos':'Prompt do vídeo — o movimento do passo 10')+'</label>'
   +'<textarea id="cnV" style="min-height:150px">'+esc(CENAS.video)+'</textarea></div>';
  if(vdDois()&&CENAS.video2){
   h+='<div class="field"><label>Prompt do clipe 2 — os 12 segundos seguintes</label>'
    +'<textarea id="cnV2" style="min-height:150px">'+esc(CENAS.video2)+'</textarea>'
    +'<div class="custo">O clipe 2 começa exatamente no último quadro do clipe 1 — eu tiro esse quadro sozinha e mando junto, para a emenda não aparecer.</div></div>';
  }
  if(CENAS.conferir&&CENAS.conferir.length){
   h+='<div class="aviso"><strong>Antes de gastar, confira isto na imagem:</strong><br>';
   for(var i=0;i<CENAS.conferir.length;i++)h+='· '+esc(CENAS.conferir[i])+'<br>';
   h+='</div>';
  }
  h+='<div class="custo">Pode editar os dois prompts aqui. O que estiver escrito no campo é o que eu mando gerar.</div>';
  q('cnOut').innerHTML=h;travar();
  q('cQk').scrollIntoView({behavior:'smooth',block:'start'});
 })
 .catch(function(e){
  b.disabled=false;b.textContent='Montar as cenas e os prompts';
  q('cnOut').innerHTML='<div class="erro">Não consegui montar as cenas. '+esc(String(e&&e.message||e))+'</div>';
  travar();
 });
};

function custoQk(){var v=q('fQual').value;return v==='low'?'R$ 0,06':v==='high'?'R$ 1,00':'R$ 0,25'}
function custoVd(){var s=q('vSeg').value;return s==='8'?'R$ 4,10':s==='12'?'R$ 6,20':s==='24'?'R$ 12,40':'R$ 2,10'}
function vdDois(){return q('vSeg').value==='24'}
function precos(){
 q('qkCusto').textContent='Custo estimado desta imagem: '+custoQk()+' — pela qualidade escolhida lá em cima.';
 q('vdCusto').textContent=vdDois()
  ? 'Custo estimado deste vídeo: cerca de R$ 12,40 no total — são dois clipes de 12 segundos, R$ 6,20 cada, que eu emendo depois de graça. Você confirma o preço uma vez só.'
  : 'Custo estimado deste vídeo: cerca de '+custoVd()+'.';
}
/* trocar a duracao muda o numero de cenas E se o video sai em um ou dois
   clipes. Um roteiro aprovado para 12 s nao serve para 24 s. Entao a troca
   destrava tudo para tras: ela refaz o roteiro (barato) antes de gastar. */
q('vSeg').onchange=function(){
 precos();
 if(ROTEIRO||ROT_OK||CENAS){
  limparDaqui(1);
  q('rtOut').innerHTML='<div class="aviso">Você mudou a duração do vídeo, então o roteiro antigo não serve mais: ele tinha outra quantidade de cenas. Clique em <strong>Escrever o roteiro</strong> de novo — esse passo é barato.</div>';
  ROTEIRO=null;
 }
};

q('qkGerar').onclick=function(){
 if(!CENAS){alert('Monte as cenas no passo 8 antes.');return}
 var cq=document.getElementById('cnQ');
 var p=((cq&&cq.value)||CENAS.quadro||'').trim();
 if(!p){alert('O prompt do quadro-chave está vazio.');return}
 if(!confirm('Gerar o quadro-chave agora?\n\nCusto estimado desta imagem: '+custoQk()+'\n\nÉ a imagem barata que vem antes do vídeo caro. Se não gostar, você manda refazer.'))return;
 var b=this;b.disabled=true;b.textContent='Gerando...';
 limparDaqui(3);
 q('qkOut').innerHTML='<div class="spin">Gerando o quadro-chave... isso leva de 20 a 60 segundos.</div>';
 fetch('/api/image',{method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({prompt:p,quality:q('fQual').value,size:(q('vFmt').value==='1280x720'?'1536x1024':'1024x1536'),imagens:FOTOS_REAIS})})
 .then(lerJson)
 .then(function(j){
  b.disabled=false;b.textContent='Gerar de novo o quadro-chave';
  if(j.error){q('qkOut').innerHTML='<div class="erro">'+esc(j.error)+'</div>';travar();return}
  if(!j.image){q('qkOut').innerHTML='<div class="erro">A resposta veio sem imagem. Tente de novo.</div>';travar();return}
  QK_B64=j.image;
  var u='data:image/png;base64,'+j.image;
  q('qkOut').innerHTML='<img class="imgout" id="qkImg" src="'+u+'">'
   +'<div class="g2" style="margin-top:10px">'
   +'<button class="btn btn-g" id="qkDl">Baixar o quadro-chave</button>'
   +'<button class="btn btn-p" id="qkOkB">Está bom, aprovar para o vídeo</button></div>'
   +'<div class="custo">Conte as peças e confira a proporção antes de aprovar. Depois daqui o próximo clique custa '+custoVd()+'.</div>';
  q('qkDl').onclick=function(){salvar(u,(fichaAtual().sku||'produto')+'-quadro-chave.png')};
  q('qkOkB').onclick=function(){
   QK_OK=true;travar();
   this.disabled=true;this.textContent='Quadro aprovado';
   q('cQk').classList.add('aprovada');
   q('cVd').scrollIntoView({behavior:'smooth',block:'start'});
  };
  travar();
 })
 .catch(function(e){
  b.disabled=false;b.textContent='Gerar o quadro-chave';
  q('qkOut').innerHTML='<div class="erro">Não consegui falar com o gerador de imagem. '+esc(String(e&&e.message||e))+'</div>';
  travar();
 });
};

/* ---- o video agora e pedido, acompanhado e baixado em passos separados ----
   Quem espera e o navegador, nao o servidor. Assim o servidor nunca bate no
   limite de saidas do plano no meio da geracao, que era o jeito de pagar por
   um video e nao receber o arquivo. O numero do pedido fica guardado aqui no
   navegador: se a pagina cair, ela busca o mesmo video de volta sem cobrar
   outra vez. */
var VD_ESPERANDO=false;
var VD_BLOBS={c1:null,c2:null,junto:null};
var VD_MODO2=false;
var VD_URLS={};
var VD_BAIXOU={};

function vdSalvo(){
 try{var t=localStorage.getItem('db_studio_video');return t?JSON.parse(t):null}catch(e){return null}
}
function vdGuardar(o){
 var d=vdSalvo()||{};
 for(var k in o)if(Object.prototype.hasOwnProperty.call(o,k))d[k]=o[k];
 if(!d.quando)d.quando=new Date().toISOString();
 try{localStorage.setItem('db_studio_video',JSON.stringify(d))}catch(e){}
}
function vdEsquecer(){
 try{localStorage.removeItem('db_studio_video')}catch(e){}
 var r=document.getElementById('vdResgate');if(r)r.innerHTML='';
}
function vdEtapa(txt){q('vdOut').innerHTML='<div class="spin">'+esc(txt)+'</div>'}
function vdSoltarUrls(){
 for(var k in VD_URLS)if(VD_URLS[k]){try{URL.revokeObjectURL(VD_URLS[k])}catch(e){}}
 VD_URLS={};
}

function vdMostrarResgate(){
 var d=vdSalvo(),box=q('vdResgate');
 if(!d||!d.id1){box.innerHTML='';return}
 var quando='';
 try{quando=new Date(d.quando).toLocaleString('pt-BR')}catch(e){}
 var dois=d.total===2;
 var txt='<strong>Tem vídeo pendente aqui.</strong> Você mandou gerar'+(quando?' em '+esc(quando):'')+' e a página não chegou a entregar o arquivo baixado. ';
 if(dois&&!d.id2)txt+='O <strong>clipe 1 já foi pago</strong> e volta de graça. O clipe 2 ainda não foi encomendado — se você mandar continuar, só ele custa cerca de R$ 6,20.';
 else if(dois)txt+='Os <strong>dois clipes já foram pagos</strong> e voltam de graça.';
 else txt+='Ele <strong>já foi pago</strong> e volta de graça.';
 box.innerHTML='<div class="aviso">'+txt+'</div>'
  +'<div class="g2" style="margin-bottom:12px"><button class="btn btn-g" id="vdBuscar">Buscar o que já está pago<span class="gratis">NÃO CUSTA NADA</span></button>'
  +'<button class="btn btn-g" id="vdDescartar">Descartar esse pedido</button></div>';
 q('vdBuscar').onclick=function(){
  var p1='',p2='';
  var c1=document.getElementById('cnV'),c2=document.getElementById('cnV2');
  if(c1)p1=(c1.value||'').trim();
  if(c2)p2=(c2.value||'').trim();
  if(!p2&&CENAS&&CENAS.video2)p2=CENAS.video2;
  if(dois&&!d.id2&&!p2){
   alert('Para terminar o clipe 2 eu preciso do prompt dele, que está no passo 8. Monte as cenas de novo (isso é barato) e depois volte aqui.');
   return;
  }
  vdRodar({dois:dois,seg:dois?'12':(d.seg||q('vSeg').value),p1:p1,p2:p2,id1:d.id1,id2:d.id2||null,btn:null});
 };
 q('vdDescartar').onclick=function(){
  if(confirm('Esquecer esse pedido de vídeo?\n\nIsso não apaga nada no gerador — só tira o aviso daqui. Se o vídeo já ficou pronto e você não baixou, ele se perde e teria que pagar de novo.'))vdEsquecer();
 };
}

/* ---- os tres tijolos do caminho: encomendar, esperar, pegar ---- */
function vdEncomendar(prompt,segundos,b64,mt){
 return fetch('/api/video',{method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({prompt:prompt,seconds:segundos,size:q('vFmt').value,imageBase64:b64,mediaType:mt||'image/png'})})
 .then(lerJson)
 .then(function(j){
  if(j.error)throw new Error(j.error);
  if(!j.id)throw new Error('O gerador não devolveu o número do pedido. Tente de novo — nada foi cobrado.');
  return j.id;
 });
}

function vdEsperar(id,rotulo){
 return new Promise(function(ok,ruim){
  var n=0,MAX=90,t0=Date.now();
  function passou(){var s=Math.round((Date.now()-t0)/1000);return s<60?(s+' segundos'):(Math.floor(s/60)+' min '+(s%60)+' s')}
  function ver(){
   n++;
   if(n>MAX){ruim(new Error('O gerador está demorando mais do que o normal com '+rotulo+'. O pedido continua vivo lá: espere um minuto e clique em "Buscar o que já está pago" aqui em cima. Isso não cobra de novo.'));return}
   fetch('/api/video-status?id='+encodeURIComponent(id))
   .then(lerJson)
   .then(function(j){
    if(j.status==='failed'){var e1=new Error(j.error||('A geração d'+rotulo+' falhou no gerador.'));e1.perdido=true;ruim(e1);return}
    if(j.error){ruim(new Error(j.error));return}
    if(j.status==='completed'){ok(true);return}
    var pc=(typeof j.progress==='number'&&j.progress>0)?(' — '+Math.round(j.progress)+'% pronto'):'';
    vdEtapa('Gerando '+rotulo+' há '+passou()+pc+'. Cada clipe leva de 1 a 4 minutos. Pode deixar a página aberta.');
    setTimeout(ver,5000);
   })
   .catch(function(e){
    if(n>=MAX){ruim(new Error('Perdi o contato com o gerador. '+String(e&&e.message||e)));return}
    vdEtapa('A conexão oscilou, tentando de novo... (há '+passou()+')');
    setTimeout(ver,5000);
   });
  }
  ver();
 });
}

function maiuscula(s){return String(s||'').charAt(0).toUpperCase()+String(s||'').slice(1)}
function vdPegar(id,rotulo){
 vdEtapa(maiuscula(rotulo)+' ficou pronto. Trazendo o arquivo...');
 return fetch('/api/video-arquivo?id='+encodeURIComponent(id))
 .then(function(r){
  if(!r.ok)return r.text().then(function(){throw new Error('O servidor não entregou o arquivo d'+rotulo+' (código '+r.status+'). Clique em "Buscar o que já está pago" para tentar de novo — isso não cobra nada.')});
  var tipo=r.headers.get('content-type')||'';
  if(tipo.indexOf('json')>=0)return r.json().then(function(j){throw new Error(j.error||'O servidor devolveu um aviso em vez do vídeo.')});
  return r.blob();
 });
}

/* ---- o ultimo quadro do clipe 1 vira a referencia do clipe 2 ----
   E isso que faz a emenda nao aparecer: o gerador comeca o segundo clipe
   exatamente na imagem em que o primeiro parou. */
function vdUltimoQuadro(bl){
 return new Promise(function(ok,ruim){
  var v=document.createElement('video');
  v.muted=true;v.playsInline=true;v.preload='auto';
  var u=URL.createObjectURL(bl),feito=false;
  function acaba(fn,arg){if(feito)return;feito=true;clearTimeout(rel);try{URL.revokeObjectURL(u)}catch(e){}fn(arg)}
  var rel=setTimeout(function(){acaba(ruim,new Error('O navegador demorou demais para abrir o clipe 1 e tirar o último quadro dele.'))},40000);
  v.onerror=function(){acaba(ruim,new Error('O navegador não conseguiu abrir o clipe 1 para tirar o último quadro.'))};
  v.onloadedmetadata=function(){
   var d=v.duration;
   if(!isFinite(d)||d<=0)d=12;
   try{v.currentTime=Math.max(0,d-0.08)}catch(e){acaba(ruim,new Error('Não consegui avançar até o fim do clipe 1.'))}
  };
  v.onseeked=function(){
   try{
    var c=document.createElement('canvas');
    c.width=v.videoWidth||720;c.height=v.videoHeight||1280;
    c.getContext('2d').drawImage(v,0,0,c.width,c.height);
    var du=c.toDataURL('image/png');
    acaba(ok,{b64:du.split(',')[1],l:c.width,a:c.height});
   }catch(e){acaba(ruim,new Error('Não consegui copiar o último quadro do clipe 1. '+String(e&&e.message||e)))}
  };
  v.src=u;
 });
}

/* ---- juntar os dois clipes aqui no aparelho, sem gastar nada ----
   Nao ha servidor nenhum nisso: o navegador toca o clipe 1 e depois o 2
   dentro de uma tela escondida e grava o resultado. Por isso a pagina
   precisa ficar na frente enquanto roda. Se o navegador nao souber gravar,
   os dois clipes continuam ali para baixar separados. */
function vdJuntar(bl1,bl2,andar){
 return new Promise(function(ok,ruim){
  var MR=window.MediaRecorder;
  if(!MR){ruim(new Error('Este navegador não sabe juntar vídeo sozinho. Baixe os dois clipes e junte no CapCut ou no InShot — leva um minuto.'));return}
  var tipos=['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'];
  var tipo='';
  for(var i=0;i<tipos.length;i++){try{if(MR.isTypeSupported(tipos[i])){tipo=tipos[i];break}}catch(e){}}
  if(!tipo){ruim(new Error('Este navegador não aceita nenhum formato de gravação. Baixe os dois clipes e junte no CapCut ou no InShot.'));return}

  var u1=URL.createObjectURL(bl1),u2=URL.createObjectURL(bl2);
  var v1=document.createElement('video'),v2=document.createElement('video');
  var ctx=null,acabou=false;
  function limpar(){
   try{URL.revokeObjectURL(u1)}catch(e){}
   try{URL.revokeObjectURL(u2)}catch(e){}
   try{if(ctx)ctx.close()}catch(e){}
  }
  function morrer(msg){if(acabou)return;acabou=true;limpar();ruim(new Error(msg))}
  v1.preload='auto';v2.preload='auto';v1.playsInline=true;v2.playsInline=true;
  v1.onerror=function(){morrer('Não consegui abrir o clipe 1 para juntar.')};
  v2.onerror=function(){morrer('Não consegui abrir o clipe 2 para juntar.')};

  var prontos=0;
  function chegou(){prontos++;if(prontos===2)comecar()}
  v1.onloadedmetadata=chegou;
  v2.onloadedmetadata=chegou;

  function comecar(){
   if(acabou)return;
   var L=Math.max(v1.videoWidth||0,v2.videoWidth||0)||720;
   var A=Math.max(v1.videoHeight||0,v2.videoHeight||0)||1280;
   var c=document.createElement('canvas');c.width=L;c.height=A;
   var g=c.getContext('2d');
   g.fillStyle='#000';g.fillRect(0,0,L,A);

   var fluxo;
   try{fluxo=c.captureStream(30)}catch(e){morrer('Este navegador não deixa gravar a tela de montagem.');return}

   try{
    var AC=window.AudioContext||window.webkitAudioContext;
    if(AC){
     ctx=new AC();
     if(ctx.resume)ctx.resume();
     var dest=ctx.createMediaStreamDestination();
     ctx.createMediaElementSource(v1).connect(dest);
     ctx.createMediaElementSource(v2).connect(dest);
     var ta=dest.stream.getAudioTracks();
     for(var k=0;k<ta.length;k++)fluxo.addTrack(ta[k]);
    }
   }catch(e){/* sem audio o video ainda sai; nao vale derrubar por isso */}

   var pedacos=[],gr;
   try{gr=new MR(fluxo,{mimeType:tipo,videoBitsPerSecond:8000000,audioBitsPerSecond:128000})}
   catch(e){
    try{gr=new MR(fluxo,{mimeType:tipo})}
    catch(e2){morrer('O gravador do navegador recusou o formato.');return}
   }
   gr.ondataavailable=function(ev){if(ev.data&&ev.data.size)pedacos.push(ev.data)};
   gr.onerror=function(){morrer('O gravador do navegador parou no meio da junção.')};
   gr.onstop=function(){
    if(acabou)return;acabou=true;
    var saida=new Blob(pedacos,{type:tipo.split(';')[0]});
    limpar();
    if(!saida.size){ruim(new Error('A junção saiu vazia. Baixe os dois clipes separados e junte no CapCut.'));return}
    ok({blob:saida,mp4:tipo.indexOf('mp4')>=0});
   };
   try{gr.start(500)}catch(e){morrer('Não consegui ligar o gravador do navegador.');return}

   var atual=null,parar=false;
   function desenha(){
    if(parar)return;
    if(atual&&atual.videoWidth){
     var vw=atual.videoWidth,vh=atual.videoHeight;
     var e=Math.min(L/vw,A/vh),dl=vw*e,da=vh*e;
     g.fillStyle='#000';g.fillRect(0,0,L,A);
     g.drawImage(atual,(L-dl)/2,(A-da)/2,dl,da);
    }
    requestAnimationFrame(desenha);
   }
   requestAnimationFrame(desenha);

   function toca(v,aoFim){
    atual=v;
    v.onended=function(){aoFim()};
    var p;
    try{p=v.play()}catch(e){morrer('O navegador bloqueou a reprodução. Clique uma vez na página e tente de novo.');return}
    if(p&&p['catch'])p['catch'](function(){morrer('O navegador bloqueou a reprodução. Clique uma vez na página e tente de novo.')});
   }

   if(andar)andar('Juntando — gravando os primeiros 12 segundos. Deixe esta página na frente.');
   toca(v1,function(){
    if(acabou)return;
    if(andar)andar('Juntando — gravando os 12 segundos seguintes. Falta pouco.');
    toca(v2,function(){
     parar=true;
     setTimeout(function(){try{gr.stop()}catch(e){}},400);
    });
   });
  }

  v1.src=u1;v2.src=u2;
 });
}

/* ---- resultado: os arquivos na tela, para conferir e baixar ---- */
function vdCartao(bl,titulo,ch){
 if(!bl)return '';
 var u=URL.createObjectURL(bl);
 VD_URLS[ch]=u;
 var mb=(bl.size/1048576).toFixed(1).replace('.',',');
 return '<div class="field" style="margin-top:12px"><label>'+esc(titulo)+'</label>'
  +'<video class="imgout" id="vdP_'+ch+'" controls playsinline src="'+u+'"></video>'
  +'<button class="btn btn-g" id="vdD_'+ch+'" style="margin-top:8px;width:100%">Baixar este arquivo ('+mb+' MB)</button></div>';
}

function vdTalvezEsquecer(){
 if(VD_BAIXOU.junto){vdEsquecer();return}
 if(VD_BLOBS.c2){if(VD_BAIXOU.c1&&VD_BAIXOU.c2)vdEsquecer();return}
 /* modo de dois clipes com o segundo ainda faltando: guardo o pedido, senao
    ela perde o direito de terminar o clipe 2 sem pagar o clipe 1 outra vez */
 if(VD_MODO2)return;
 if(VD_BAIXOU.c1)vdEsquecer();
}

function vdLigarBaixar(ch,nome){
 var b=document.getElementById('vdD_'+ch);
 if(!b)return;
 b.onclick=function(){
  salvar(VD_URLS[ch],nome);
  VD_BAIXOU[ch]=true;
  b.textContent='Baixado — confira na pasta de downloads';
  vdTalvezEsquecer();
 };
}

function vdResultado(){
 var sku=(fichaAtual().sku||'produto');
 var dois=!!VD_BLOBS.c2;
 var h='';
 if(VD_BLOBS.junto){
  h+='<div class="aviso ok"><strong>Pronto: um arquivo só, com os 24 segundos.</strong> Confira e baixe. Os dois clipes soltos continuam aqui embaixo, caso você prefira montar do seu jeito.</div>'
   +vdCartao(VD_BLOBS.junto,'Vídeo completo — cerca de 24 segundos','junto');
 }else if(dois){
  h+='<div class="aviso ok"><strong>Os dois clipes ficaram prontos.</strong> Confira cada um. Se estiverem bons, clique em juntar para virar um arquivo só de mais ou menos 24 segundos.</div>';
 }
 h+=vdCartao(VD_BLOBS.c1,VD_MODO2?'Clipe 1 — os primeiros 12 segundos':'Vídeo','c1');
 if(dois)h+=vdCartao(VD_BLOBS.c2,'Clipe 2 — os 12 segundos seguintes','c2');
 if(dois&&!VD_BLOBS.junto){
  h+='<button class="btn btn-p" id="vdJnt" style="margin-top:12px;width:100%">Juntar os dois num arquivo só<span class="gratis">NÃO CUSTA NADA</span></button>'
   +'<div class="custo">A junção acontece aqui no seu aparelho e não gasta nada. Leva mais ou menos 30 segundos e a página precisa ficar na frente enquanto roda.</div>'
   +'<div id="vdJOut"></div>';
 }
 h+='<div class="aviso" style="margin-top:10px"><strong>Baixe antes de fechar a página.</strong> O arquivo só existe aqui no navegador: se fechar sem baixar, ele se perde e teria que pagar de novo.</div>';
 q('vdOut').innerHTML=h;

 vdLigarBaixar('junto',sku+'-video-24s.'+(VD_BLOBS.juntoMp4===false?'webm':'mp4'));
 vdLigarBaixar('c1',VD_MODO2?(sku+'-clipe1.mp4'):(sku+'-video.mp4'));
 vdLigarBaixar('c2',sku+'-clipe2.mp4');

 var bj=document.getElementById('vdJnt');
 if(bj)bj.onclick=function(){
  var eu=this;eu.disabled=true;eu.textContent='Juntando...';
  var saida=q('vdJOut');
  saida.innerHTML='<div class="spin">Preparando a junção...</div>';
  vdJuntar(VD_BLOBS.c1,VD_BLOBS.c2,function(txt){saida.innerHTML='<div class="spin">'+esc(txt)+'</div>'})
  .then(function(r){
   VD_BLOBS.junto=r.blob;VD_BLOBS.juntoMp4=r.mp4;
   vdSoltarUrls();vdResultado();
   if(!r.mp4){
    var av=document.getElementById('vdJOut');
    if(av)av.innerHTML='<div class="aviso">O arquivo junto saiu em formato <strong>webm</strong>, porque este navegador não grava em mp4. Alguns marketplaces só aceitam mp4 — se der problema no envio, use os dois clipes separados ou converta o webm.</div>';
   }
  })
  ['catch'](function(e){
   eu.disabled=false;eu.textContent='Tentar juntar de novo';
   saida.innerHTML='<div class="erro">Não consegui juntar os dois aqui. '+esc(String(e&&e.message||e))+'<br><br>Isso <strong>não perde nada</strong>: os dois clipes estão prontos aqui em cima, é só baixar os dois.</div>';
  });
 };

 vdMostrarResgate();
}

/* ---- o caminho inteiro, de uma confirmacao so ate o arquivo na mao ---- */
function vdRodar(cfg){
 if(VD_ESPERANDO)return;
 VD_ESPERANDO=true;
 VD_MODO2=!!cfg.dois;
 var b=cfg.btn;
 if(b){b.disabled=true;b.textContent='Gerando o vídeo...'}
 function fim(){VD_ESPERANDO=false;if(b){b.disabled=false;b.textContent='Gerar o vídeo de novo'}}
 function falhou(e){
  fim();
  var msg=String(e&&e.message||e);
  /* Se o clipe 1 ja chegou, o dinheiro dele NAO pode sumir junto com a falha
     do clipe 2. Entao: apago so o pedido que morreu, mostro o clipe 1 na tela
     para ela baixar, e deixo o aviso de erro por cima. */
  if(e&&e.perdido){
   if(VD_BLOBS.c1){
    var d=vdSalvo()||{};
    delete d.id2;
    try{localStorage.setItem('db_studio_video',JSON.stringify(d))}catch(e2){}
   }else{
    vdEsquecer();
   }
  }
  if(VD_BLOBS.c1){
   vdSoltarUrls();
   vdResultado();
   var cx=q('vdOut');
   cx.innerHTML='<div class="erro">'+esc(msg)+'<br><br>O <strong>clipe 1 ficou pronto e está aqui embaixo</strong> — baixe ele antes de fechar a página. Só o clipe 2 falhou.</div>'+cx.innerHTML;
  }else{
   q('vdOut').innerHTML='<div class="erro">'+esc(msg)+'</div>';
  }
  vdMostrarResgate();
 }

 var r1;
 if(cfg.id1){
  vdEtapa(cfg.dois?'Buscando de volta o clipe 1, que já está pago...':'Buscando de volta o vídeo, que já está pago...');
  r1=Promise.resolve(cfg.id1);
 }else{
  vdEtapa(cfg.dois?'Encomendando o clipe 1 de 2...':'Encomendando o vídeo...');
  r1=vdEncomendar(cfg.p1,cfg.seg,QK_B64,'image/png').then(function(id){
   vdGuardar({id1:id,total:cfg.dois?2:1,seg:cfg.seg});
   return id;
  });
 }

 r1.then(function(id1){
  return vdEsperar(id1,cfg.dois?'o clipe 1':'o vídeo').then(function(){
   return vdPegar(id1,cfg.dois?'o clipe 1':'o vídeo');
  });
 })
 .then(function(bl1){
  VD_BLOBS.c1=bl1;
  if(!cfg.dois){fim();vdSoltarUrls();vdResultado();return null}
  vdEtapa('Clipe 1 na mão. Tirando o último quadro dele, que vai ser o primeiro quadro do clipe 2...');
  return vdUltimoQuadro(bl1)
  .then(function(qd){
   if(cfg.id2){vdEtapa('Buscando de volta o clipe 2, que já está pago...');return cfg.id2}
   vdEtapa('Encomendando o clipe 2 de 2, começando exatamente onde o clipe 1 parou...');
   return vdEncomendar(cfg.p2,'12',qd.b64,'image/png').then(function(id){vdGuardar({id2:id});return id});
  })
  .then(function(id2){
   return vdEsperar(id2,'o clipe 2').then(function(){return vdPegar(id2,'o clipe 2')});
  })
  .then(function(bl2){
   VD_BLOBS.c2=bl2;fim();vdSoltarUrls();vdResultado();
  });
 })
 ['catch'](falhou);
}

q('vdGerar').onclick=function(){
 if(!QK_OK||!QK_B64){alert('Aprove o quadro-chave no passo 9 antes.');return}
 var dois=vdDois();
 var cv=document.getElementById('cnV');
 var p1=((cv&&cv.value)||(CENAS&&CENAS.video)||'').trim();
 if(!p1){alert('O prompt do vídeo está vazio.');return}
 var p2='';
 if(dois){
  var cv2=document.getElementById('cnV2');
  p2=((cv2&&cv2.value)||(CENAS&&CENAS.video2)||'').trim();
  if(!p2){alert('Falta o prompt do clipe 2. Volte no passo 8 e monte as cenas de novo com 24 segundos escolhido lá em cima.');return}
 }
 var pend=vdSalvo();
 if(pend&&pend.id1&&!confirm('Atenção: já existe um vídeo pendente aqui, que você mandou gerar antes e ainda não baixou.\n\nSe continuar, esse pedido antigo é descartado e o novo custa cheio.\n\nQuer mesmo gerar um vídeo novo?'))return;

 var aviso=dois
  ? ('Gerar o vídeo de 24 segundos agora?\n\nCusto estimado do total: cerca de R$ 12,40.\nSão dois clipes de 12 segundos, R$ 6,20 cada, e eu emendo os dois de graça no fim.\n\nEsta é a única confirmação: daqui até os arquivos na tela eu não pergunto mais nada, e leva de 3 a 8 minutos.\n\nO clipe 1 começa no quadro-chave que você aprovou. O clipe 2 começa no último quadro do clipe 1, para a emenda não aparecer.\n\nSe a página cair no meio, dá para buscar o que já foi pago sem pagar outra vez.')
  : ('Gerar o vídeo de '+q('vSeg').value+' segundos agora?\n\nCusto estimado: cerca de '+custoVd()+'.\n\nEste é o passo mais caro do caminho. O vídeo vai usar o quadro-chave que você aprovou como referência.\n\nSe a página cair no meio, dá para buscar o vídeo de volta sem pagar outra vez.');
 if(!confirm(aviso))return;

 vdEsquecer();
 VD_BLOBS={c1:null,c2:null,junto:null};
 VD_BAIXOU={};
 vdSoltarUrls();
 vdRodar({dois:dois,seg:dois?'12':q('vSeg').value,p1:p1,p2:p2,id1:null,id2:null,btn:this});
};
vdMostrarResgate();

(function(){if(window.__fixQC)return;window.__fixQC=1;function carr(b,m){return new Promise(function(ok,er){var i=new Image();i.onload=function(){ok(i)};i.onerror=function(){er(new Error("erro ao ler o quadro-chave"))};i.src="data:"+(m||"image/png")+";base64,"+b})}async function aj(b,m,s){var p=String(s||"720x1280").split("x"),L=parseInt(p[0],10)||720,A=parseInt(p[1],10)||1280,img=await carr(b,m);if(img.naturalWidth===L&&img.naturalHeight===A)return null;var cv=document.createElement("canvas");cv.width=L;cv.height=A;var c=cv.getContext("2d");c.fillStyle="#ffffff";c.fillRect(0,0,L,A);c.imageSmoothingEnabled=true;c.imageSmoothingQuality="high";var e=Math.max(L/img.naturalWidth,A/img.naturalHeight),nl=Math.round(img.naturalWidth*e),na=Math.round(img.naturalHeight*e);c.drawImage(img,Math.round((L-nl)/2),Math.round((A-na)/2),nl,na);var d=cv.toDataURL("image/png");return d.slice(d.indexOf(",")+1)}var fo=window.fetch.bind(window);window.fetch=async function(en,op){try{var u=typeof en==="string"?en:(en&&en.url)||"";var me=((op&&op.method)||(en&&en.method)||"GET").toUpperCase();if(me==="POST"&&/[/]api[/]video([?]|$)/.test(u)&&op&&typeof op.body==="string"){var co=JSON.parse(op.body);if(co&&co.imageBase64){var tm=co.size==="1280x720"?"1280x720":"720x1280";var nv=await aj(co.imageBase64,co.mediaType,tm);if(nv){co.imageBase64=nv;co.mediaType="image/png";co.size=tm;op=Object.assign({},op,{body:JSON.stringify(co)});console.log("[quadro-chave] ajustado para "+tm)}}}}catch(e){console.warn("[quadro-chave] falhou:",e)}return fo(en,op)}})();
precos();
travar();
</script></body></html>`;
