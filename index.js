/**
 * ANNOUNCER PRO — Cloudflare Worker
 * Serve o painel de criação de anúncios e chama a API do Claude.
 * Segredos (Settings > Variables and Secrets no painel do Cloudflare):
 *   - ANTHROPIC_API_KEY  (obrigatório)  sk-ant-...
 *   - MODEL              (opcional)     ex.: claude-3-5-sonnet-latest
 */

import { STUDIO_HTML } from "./studio.js";

const SYSTEM_PROMPT = `Você é o ANNOUNCER PRO, um redator/analista sênior de e-commerce das lojas Sayonara / Dona Begô / Purifácil (Mercado Livre, Shopee, Amazon, Magalu, TikTok Shop, Google Shopping). Crie o melhor anúncio possível para o produto informado, com dados verdadeiros. Entregue em português do Brasil.

REGRAS DA CASA (obrigatórias):
- MARCA OFICIAL = SAYONARA (única com registro). Nunca cadastre Dona Begô/Purifácil como marca.
- TOM = técnico + persuasivo: dado concreto que gera confiança + gatilho de venda. Traduza característica em benefício. Sem exagero proibido ("melhor do mercado", "cura", "100% garantido").
- PREVENÇÃO DE DEVOLUÇÃO: destaque voltagem, medidas, compatibilidade, conteúdo da embalagem e limitações. Se faltar dado crítico, marque [CONFIRMAR].
- REGRA DE OURO DOS COMPATÍVEIS (refil/peça): se o produto for compatível, a marca do anúncio é a marca REAL do produto (nunca a do original); NUNCA use "original" para descrever o produto; título no formato "Refil [Tipo] [Marca real] Compatível com [Marca/Modelo original]"; inclua na descrição o aviso: "Este produto é da marca [MARCA REAL] e é um item COMPATÍVEL/similar. NÃO é o original da [MARCA ORIGINAL]. A marca [MARCA ORIGINAL] é citada apenas para indicar compatibilidade. Todas as marcas pertencem aos seus donos, sem vínculo com a [MARCA REAL]."

REGRAS POR CANAL:
- Mercado Livre: o padrao da loja e anuncio de CATALOGO - titulo de ATE 120 CARACTERES comecando pela palavra-chave mais buscada + marca + atributos + beneficio principal (use o espaco todo). Anuncio comum (so quando pedido): titulo max 60. Descricao em texto puro, sem preco/contato/link externo. Ficha tecnica completa.
- Shopee: título ~100 caracteres com sinônimos; descrição escaneável + FAQ.
- Amazon: título Marca+Modelo+Tipo+atributos, sem preço/promo/emoji; 5 bullets de benefício.
- Magalu: objetivo, marca+atributos. TikTok Shop: curto e apelativo, vídeo é o rei. Google Shopping: Marca+Produto+Atributo, GTIN importa.

IMAGENS: entregue o roteiro de 9 artes com PROMPTS prontos pra IA. A capa é fundo branco puro, sem texto. Todo prompt manda usar a FOTO REAL do produto (em anexo, quando houver) como referência e manter o produto IDÊNTICO; formato 1:1, 1200x1200.

REGRA DE ESCALA (obrigatoria em TODO prompt de imagem e de video que envolva refil, elemento filtrante, cartucho ou purificador de agua): o refil/elemento filtrante mede cerca de 22 cm de altura por 6,3 cm de diametro - do tamanho de uma garrafa de agua de 500 ml; cabe inteiro em uma mao, os dedos se fecham em volta dele e o polegar quase encosta na ponta dos dedos; ocupa cerca de um quinto da altura do tronco de um adulto. O purificador de bancada mede cerca de 43 cm de altura por 33 cm de largura por 35 cm de profundidade - do tamanho de um micro-ondas pequeno; quando aparecer, aparece INTEIRO no enquadramento, apoiado sobre a bancada, ao lado da pessoa e na MESMA distancia da camera. PROPORCAO FIXA: a altura do purificador e o DOBRO da altura do refil. Se o refil parecer maior que metade do purificador, o prompt esta errado. Escreva sempre esses numeros dentro do prompt, uma unica fotografia real (lente 50 mm, mesma luz e mesma profundidade para pessoa e produtos), sem colagem e sem montagem.

IDENTIDADE VISUAL SAYONARA (obrigatoria em TODA imagem e video): paleta oficial ciano #2FD4E0, azul #2F64E0 e azul medio #2E9CE0, sempre sobre fundos brancos ou claros; clima visual clean e premium remetendo a agua, pureza e lar (cozinhas claras, luz natural suave, tons azuis); tipografia Montserrat quando houver texto em artes secundarias (capa sempre sem texto); logo da marca = gota d'agua com telhado de casa, slogan "onde a pureza encontra seu lar". Todo prompt de imagem e de video gerado DEVE citar essa paleta e esse clima visual.

FORMATO DA ENTREGA (markdown). Entregue SOMENTE as secoes abaixo, nesta ordem, e NADA ALEM DELAS. NAO escreva resumo executivo. NAO escreva secao separada de palavras-chave. NAO repita fora dos blocos [[CANAL]] nada que ja esteja dentro deles - bullets, FAQ, objecoes, ficha tecnica, conteudo da embalagem e avisos moram DENTRO do bloco do canal e em nenhum outro lugar. Sem introducao, sem despedida, sem comentario sobre o proprio trabalho. Texto denso, zero enrolacao.
1. ANUNCIO PRONTO POR CANAL - para CADA canal solicitado, entregue UM bloco delimitado EXATAMENTE com estes marcadores, sem alterar nem traduzir os rotulos, e sem nada entre os blocos:
[[CANAL: Mercado Livre]]
TITULO: titulo final em uma unica linha, respeitando o limite do canal, terminando com a contagem de caracteres entre parenteses
TITULO ALTERNATIVO: uma segunda opcao em uma linha
FICHA TECNICA:
Campo: valor (uma informacao por linha; inclua obrigatoriamente voltagem, medidas, compatibilidade e CONTEUDO DA EMBALAGEM)
BULLETS:
- um por linha (obrigatorio na Amazon, 5 bullets; nos outros canais so quando fizer sentido)
DESCRICAO:
texto completo pronto pra colar, ja no formato e no tamanho do canal, incluindo as 3 duvidas mais comuns do comprador respondidas em uma linha cada e os avisos legais obrigatorios
PALAVRAS-CHAVE: separadas por virgula, misturando essenciais, secundarias e cauda longa
ROTEIRO DO VIDEO: obrigatorio no TikTok Shop (0-3s gancho, 3-8s produto, 8-20s uso, 20-30s fecho); nos outros canais escreva "-"
OBSERVACOES DO CANAL: limites, regras e riscos especificos daquele canal, e o que ficou [CONFIRMAR]
[[/CANAL]]
Repita o bloco inteiro para cada canal pedido, trocando o nome depois de CANAL:. Esses blocos sao o produto final da ferramenta - eles precisam estar completos e prontos pra colar na plataforma sem edicao. Se faltar dado critico, marque [CONFIRMAR] ali mesmo, dentro do bloco.
2. CONTEUDO A+ DA AMAZON E RICH CONTENT DO ML - escreva esta secao SOMENTE se Amazon ou Mercado Livre estiverem entre os canais pedidos; caso contrario pule a secao inteira. Amazon: modulo hero com headline forte, 3 modulos de beneficio (titulo curto + uma frase + sugestao de imagem em meia linha) e uma tabela comparativa curta com os modelos da linha. Mercado Livre: 3 blocos curtos de texto persuasivo + sugestao de banner. LIMITE TOTAL DESTA SECAO: 2.500 caracteres. Nao repita o que ja esta no bloco do canal.
3. IMAGENS - INDICE APENAS. Nove linhas, uma por arte, no formato "Imagem N - funcao da arte em ate 8 palavras". NAO escreva os prompts aqui: os prompts completos vao SO no bloco ===DADOS=== do final, e o painel ja mostra cada um deles em um botao proprio.
4. VIDEO - INDICE APENAS. De 2 a 3 linhas, uma por cena, no formato "Cena N (Xs) - o que acontece, em ate 12 palavras", com duracao 4, 8 ou 12 segundos e formato vertical 720x1280. Depois, uma linha com a ordem de montagem para formar o video de 15-30s e uma linha com a sugestao de trilha/ritmo. NAO escreva os prompts aqui: eles vao SO no bloco ===DADOS===. ESTILOS DAS CENAS (padrao obrigatorio, vale para os prompts do JSON): CENA 1 = APRESENTADOR FALANDO - homem brasileiro simpatico ~35 anos, uniforme polo azul (#2F64E0) com logo Sayonara (gota d'agua com telhado de casa) bordado no peito, em cozinha clara e moderna com o produto EXATAMENTE como na foto de referencia sobre a bancada; ele olha para a camera e fala em portugues brasileiro uma fala curta de venda que caiba na duracao (incluir a fala entre aspas dentro do prompt, terminando com o slogan "Sayonara - onde a pureza encontra seu lar" quando couber); sem legendas na tela. CENA 2 = PRODUTO em destaque com demonstracao de uso e close dos diferenciais. CENA 3 = LIFESTYLE - familia/casa brasileira clara usando o produto, luz natural, clima de pureza da marca.
5. NOTA FINAL 0-100 + plano de melhoria em ate 5 itens de uma linha cada. LIMITE: 1.200 caracteres.
6. ESTRATEGIA COMERCIAL (so no modo completo) - preco, kit, sazonalidade e concorrencia, em ate 6 itens de uma linha cada. LIMITE: 1.200 caracteres.

PRIORIDADE DE ESPACO: se a resposta ficar longa, RESUMA as secoes 2, 5 e 6 para GARANTIR que os blocos [[CANAL]] e o bloco ===DADOS=== saiam completos. Esses dois nunca podem faltar.

OBRIGATORIO EM TODOS OS MODOS (inclusive Rapido): termine a resposta com uma linha contendo exatamente ===DADOS=== e, na linha seguinte, um JSON valido em UMA unica linha no formato {"imagens":["prompt completo da imagem 1","prompt da imagem 2"],"cenas":[{"seg":"8","prompt":"prompt completo da cena 1"}]} - "imagens" com ate 9 itens (minimo 3), "cenas" com 2 a 3 itens, "seg" apenas "4", "8" ou "12". Este JSON e o UNICO lugar onde os prompts aparecem por extenso: cada prompt precisa ser completo e autonomo (em portugues, descrevendo produto, cena, movimento de camera, luz, estilo, a paleta Sayonara e os numeros da regra de escala quando houver refil ou purificador), pronto pra colar sem edicao. LIMITE: ate 700 caracteres por prompt de imagem e ate 900 por prompt de cena - corte adjetivo e repeticao, nunca os numeros das medidas. Nada depois do JSON.`;

async function handleGenerate(request, env) {
  if (!env.ANTHROPIC_API_KEY) {
    return json({ error: "Falta configurar ANTHROPIC_API_KEY no Cloudflare (Settings > Variables and Secrets)." }, 500);
  }
  let body;
  try { body = await request.json(); } catch { return json({ error: "JSON inválido." }, 400); }

  const brief = String(body.brief || "").slice(0, 20000);
  const content = [{ type: "text", text: "Crie o anúncio a partir deste briefing:\n\n" + brief }];

  // fotos de referencia (ate 4)
  let fotos = [];
  if (Array.isArray(body.imagens)) fotos = body.imagens.slice(0, 4);
  else if (body.imageBase64 && body.mediaType) fotos = [{ data: body.imageBase64, media: body.mediaType }];
  for (const f of fotos) {
    if (f && f.data && f.media) {
      content.push({ type: "image", source: { type: "base64", media_type: String(f.media), data: String(f.data) } });
    }
  }

  const payload = {
    model: env.MODEL || "claude-3-5-sonnet-latest",
    max_tokens: 14000,
    stream: true,
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
  let text = "";
  const reader = r.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  for (;;) {
    const chunk = await reader.read();
    if (chunk.done) break;
    buf += dec.decode(chunk.value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop();
    for (const ln of lines) {
      if (ln.startsWith("data: ")) {
        try {
          const ev = JSON.parse(ln.slice(6));
          if (ev.type === "content_block_delta" && ev.delta && ev.delta.text) text += ev.delta.text;
        } catch (e) {}
      }
    }
  }
  text = text.trim();
  let imagens = [], cenas = [];
  const mi = text.indexOf("===DADOS===");
  if (mi > -1) {
    const tail = text.slice(mi + 11);
    try {
      const dj = JSON.parse(tail.slice(tail.indexOf("{"), tail.lastIndexOf("}") + 1));
      if (Array.isArray(dj.imagens)) imagens = dj.imagens.map(String).slice(0, 9);
      if (Array.isArray(dj.cenas)) cenas = dj.cenas.slice(0, 4).map(function (c) { return { seg: String(c.seg || "8"), prompt: String(c.prompt || "") }; });
    } catch (e) {}
    text = text.slice(0, mi).trim();
  }
  return json({ result: text, imagens: imagens, cenas: cenas });
}

function erroOpenAI(status, t) {
  var c = "";
  try { c = String(((JSON.parse(t) || {}).error || {}).code || ""); } catch (e) { c = ""; }
  var low = String(t || "").toLowerCase();
  if (c === "billing_hard_limit_reached" || low.indexOf("billing hard limit") > -1) {
    return "LIMITE DE GASTOS DA OPENAI ATINGIDO. Isso nao e erro do app. A sua conta da OpenAI tem um teto de gasto configurado e ele foi alcancado. Abra platform.openai.com/settings/organization/limits e aumente o valor de Budget / Hard limit. Se o saldo tambem acabou, adicione creditos em platform.openai.com/settings/organization/billing/overview. Depois volte aqui e clique em gerar de novo.";
  }
  if (c === "insufficient_quota" || low.indexOf("insufficient_quota") > -1 || low.indexOf("exceeded your current quota") > -1) {
    return "A SUA CONTA DA OPENAI ESTA SEM CREDITOS. Adicione saldo em platform.openai.com/settings/organization/billing/overview e tente de novo.";
  }
  if (status === 401 || c === "invalid_api_key" || low.indexOf("incorrect api key") > -1) {
    return "A CHAVE DA OPENAI ESTA INVALIDA. Gere outra em platform.openai.com/api-keys e atualize no Cloudflare em Settings > Variables and Secrets (nome OPENAI_API_KEY).";
  }
  if (status === 429) {
    return "A OPENAI RECUSOU POR EXCESSO DE PEDIDOS agora. Espere 1 minuto e clique em gerar de novo.";
  }
  if (c === "moderation_blocked" || low.indexOf("safety system") > -1 || low.indexOf("content_policy") > -1) {
    return "A OPENAI BLOQUEOU ESTE PROMPT pelas regras de conteudo. Reescreva o prompt (evite marcas de terceiros, pessoas reais e texto dentro da imagem) e tente de novo.";
  }
  return "Erro da API da OpenAI (" + status + "): " + String(t || "").slice(0, 400);
}

async function handleImage(request, env) {
  if (!env.OPENAI_API_KEY) {
    return json({ error: "Falta configurar OPENAI_API_KEY no Cloudflare (Settings > Variables and Secrets). Crie a chave em platform.openai.com/api-keys." }, 500);
  }
  let body;
  try { body = await request.json(); } catch { return json({ error: "JSON invalido." }, 400); }
  const prompt = String(body.prompt || "").slice(0, 4000);
  if (!prompt) return json({ error: "Cole o prompt da imagem." }, 400);
  let fotos = [];
  if (Array.isArray(body.imagens)) fotos = body.imagens.slice(0, 4).filter(function (f) { return f && f.data && f.media; });
  else if (body.imageBase64 && body.mediaType) fotos = [{ data: body.imageBase64, media: body.mediaType }];
  const tam = ["1024x1024", "1024x1536", "1536x1024"].indexOf(String(body.size)) >= 0 ? String(body.size) : "1024x1024";
  const qual = ["low", "medium", "high"].indexOf(String(body.quality)) >= 0 ? String(body.quality) : (env.IMAGE_QUALITY || "medium");
  async function pedir(modelo, fid) {
    if (fotos.length) {
      const fd = new FormData();
      fd.append("model", modelo);
      fd.append("prompt", prompt);
      fd.append("size", tam);
      fd.append("quality", qual);
      fd.append("output_format", "png");
      if (fid) fd.append("input_fidelity", "high");
      for (let i = 0; i < fotos.length; i++) {
        const bin = Uint8Array.from(atob(fotos[i].data), c => c.charCodeAt(0));
        fd.append(fotos.length > 1 ? "image[]" : "image", new Blob([bin], { type: fotos[i].media }), "referencia" + i + ".png");
      }
      return fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: { "authorization": "Bearer " + env.OPENAI_API_KEY },
        body: fd
      });
    }
    return fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { "authorization": "Bearer " + env.OPENAI_API_KEY, "content-type": "application/json" },
      body: JSON.stringify({ model: modelo, prompt, size: tam, quality: qual, output_format: "png" })
    });
  }
  const preferido = env.IMAGE_MODEL || "gpt-image-1.5";
  let r = await pedir(preferido, true);
  if (!r.ok && (r.status === 400 || r.status === 404)) {
    const t0 = await r.text();
    const l0 = String(t0 || "").toLowerCase();
    const ehModelo = l0.indexOf("model") > -1 || l0.indexOf("input_fidelity") > -1 || l0.indexOf("unknown parameter") > -1 || l0.indexOf("unsupported") > -1 || l0.indexOf("output_format") > -1;
    if (ehModelo) r = await pedir("gpt-image-1", false);
    else return json({ error: erroOpenAI(r.status, t0) }, 502);
  }
  if (!r.ok) {
    const t = await r.text();
    return json({ error: erroOpenAI(r.status, t) }, 502);
  }
  const data = await r.json();
  const b64 = data.data && data.data[0] && data.data[0].b64_json;
  if (!b64) return json({ error: "Resposta sem imagem." }, 502);
  return json({ image: b64 });
}

async function handleFix(request, env) {
  if (!env.ANTHROPIC_API_KEY) return json({ error: "Falta configurar ANTHROPIC_API_KEY." }, 500);
  let body;
  try { body = await request.json(); } catch { return json({ error: "JSON invalido." }, 400); }
  const promptOrig = String(body.prompt || "").slice(0, 5000);
  const ajuste = String(body.ajuste || "").slice(0, 1500);
  if (!promptOrig || !ajuste) return json({ error: "Faltou o prompt original ou o ajuste." }, 400);
  const tipo = body.tipo === "video" ? "video" : "imagem";
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: env.MODEL || "claude-3-5-sonnet-latest",
      max_tokens: 1200,
      system: "Voce reescreve prompts de geracao de " + tipo + " por IA. Receba o prompt original e o ajuste pedido e devolva SOMENTE o novo prompt completo reescrito, em portugues, sem comentarios nem markdown, mantendo tudo que nao foi pedido para mudar.",
      messages: [{ role: "user", content: "PROMPT ORIGINAL:\n" + promptOrig + "\n\nAJUSTE PEDIDO:\n" + ajuste }]
    })
  });
  if (!r.ok) { const t = await r.text(); return json({ error: "Erro da API do Claude (" + r.status + "): " + t.slice(0, 300) }, 502); }
  const data = await r.json();
  const novo = (((data.content || [])[0] || {}).text || "").trim();
  if (!novo) return json({ error: "Resposta vazia." }, 502);
  return json({ prompt: novo });
}

async function handleAnalisar(request, env) {
  if (!env.ANTHROPIC_API_KEY) return json({ error: "Falta configurar ANTHROPIC_API_KEY." }, 500);
  let body;
  try { body = await request.json(); } catch { return json({ error: "JSON invalido." }, 400); }
  const promptOrig = String(body.prompt || "").slice(0, 7000);
  const queixa = String(body.queixa || "").slice(0, 2000);
  const ficha = String(body.ficha || "").slice(0, 3000);
  const img = (body.imagem && body.imagem.data) ? body.imagem : null;
  if (!promptOrig) return json({ error: "Faltou o prompt que gerou a imagem." }, 400);
  if (!queixa && !img) return json({ error: "Escreva o que voce quer mudar, ou suba a imagem para eu analisar." }, 400);

  const sys = "Voce e diretor de arte de e-commerce brasileiro e revisor de prompts de geracao de imagem por IA. "
    + "Voce recebe a ficha real do produto, o prompt que gerou a imagem, o que a lojista nao gostou e, quando houver, a propria imagem gerada. "
    + "PARTE 1, diagnostico: olhe a imagem e escreva em portugues simples, em ate 6 itens curtos, o que esta errado de verdade nela em relacao a ficha e ao prompt. "
    + "Confira sempre, quando fizer sentido: contagem de pecas, proporcao de tamanho entre as pecas, cor, formato, rotulo, texto ou numero inventado, logotipo ou selo de terceiro, item a mais ou a menos, corte na borda, sombra, fundo, maos e dedos. "
    + "Se a lojista reclamou de alguma coisa, esse ponto entra sempre em primeiro lugar. Nao invente defeito que voce nao consegue ver na imagem. Se a imagem estiver correta, diga isso com todas as letras. "
    + "PARTE 2, prompt: reescreva o prompt INTEIRO corrigindo esses pontos e mantendo tudo que nao precisa mudar, em portugues, sem markdown e sem comentario. "
    + "Transforme cada defeito em instrucao positiva e explicita do que deve aparecer, com numero exato quando houver numero, e repita no fim as proibicoes que foram desrespeitadas. "
    + "Responda EXATAMENTE neste formato, sem nenhuma outra palavra antes ou depois:\n===DIAGNOSTICO===\n- primeiro item\n- segundo item\n===PROMPT===\ntexto completo do prompt reescrito";

  const partes = [];
  if (img) {
    const mt = ["image/png", "image/jpeg", "image/webp", "image/gif"].indexOf(String(img.media)) >= 0 ? String(img.media) : "image/png";
    partes.push({ type: "image", source: { type: "base64", media_type: mt, data: String(img.data) } });
  }
  let txtIn = "";
  if (ficha) txtIn += "FICHA REAL DO PRODUTO:\n" + ficha + "\n\n";
  txtIn += "PROMPT QUE GEROU A IMAGEM:\n" + promptOrig + "\n\n";
  txtIn += "O QUE A LOJISTA NAO GOSTOU:\n" + (queixa || "(ela nao escreveu nada; olhe a imagem e aponte o que estiver errado em relacao a ficha e ao prompt)") + "\n\n";
  txtIn += img ? "A imagem gerada esta anexada acima. Analise ela de verdade." : "Nao ha imagem anexada: baseie o diagnostico so no que a lojista escreveu.";
  partes.push({ type: "text", text: txtIn });

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: env.MODEL || "claude-3-5-sonnet-latest",
      max_tokens: 2500,
      system: sys,
      messages: [{ role: "user", content: partes }]
    })
  });
  if (!r.ok) { const t = await r.text(); return json({ error: "Erro da API do Claude (" + r.status + "): " + t.slice(0, 300) }, 502); }
  const data = await r.json();
  const txt = (((data.content || [])[0] || {}).text || "").trim();
  if (!txt) return json({ error: "Resposta vazia." }, 502);
  let diag = "", novo = "";
  const partido = txt.split("===PROMPT===");
  if (partido.length >= 2) {
    diag = partido[0].replace("===DIAGNOSTICO===", "").trim();
    novo = partido.slice(1).join("===PROMPT===").trim();
  } else {
    novo = txt.replace("===DIAGNOSTICO===", "").trim();
  }
  if (!novo) return json({ error: "Nao consegui montar o prompt novo. Tente de novo." }, 502);
  return json({ diagnostico: diag, prompt: novo });
}

const TOM_DONA_BEGO = "Voce escreve roteiro de video curto de e-commerce no tom da Dona Bego. O tom da Dona Bego e: conversa de lojista brasileira de verdade, direta, calorosa e honesta. Frase curta. Palavra simples. Nada de publicidade exagerada, nada de superlativo vazio, nada de gria de marketing. Nunca prometa o que a ficha nao garante. Nunca invente medida, material, quantidade, garantia, preco ou selo. Fale do problema real de quem compra e de como o produto resolve. Escreva em portugues do Brasil. ";
const REGRA_SO_JSON = "Responda SOMENTE com um objeto JSON valido, sem markdown, sem crase, sem comentario e sem nenhuma palavra antes ou depois. ";
function soJson(txt) {
  let t = String(txt || "").trim();
  if (t.indexOf("```") >= 0) { t = t.replace(/```[a-zA-Z]*/g, "").replace(/```/g, "").trim(); }
  const a = t.indexOf("{"), b = t.lastIndexOf("}");
  if (a >= 0 && b > a) t = t.slice(a, b + 1);
  try { return JSON.parse(t); } catch (e) { return null; }
}

async function claudeTexto(env, sys, user, maxTok) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({
      model: env.MODEL || "claude-3-5-sonnet-latest",
      max_tokens: maxTok || 2500,
      system: sys,
      messages: [{ role: "user", content: [{ type: "text", text: user }] }]
    })
  });
  if (!r.ok) { const t = await r.text(); return { erro: "Erro da API do Claude (" + r.status + "): " + t.slice(0, 300) }; }
  const data = await r.json();
  const txt = (((data.content || [])[0] || {}).text || "").trim();
  if (!txt) return { erro: "Resposta vazia." };
  return { texto: txt };
}

async function handleRoteiro(request, env) {
  if (!env.ANTHROPIC_API_KEY) return json({ error: "Falta configurar ANTHROPIC_API_KEY." }, 500);
  let body;
  try { body = await request.json(); } catch { return json({ error: "JSON invalido." }, 400); }

  const modo = String(body.modo || "roteiro");
  const ficha = String(body.ficha || "").slice(0, 4000);
  const escala = String(body.escala || "").slice(0, 1500);
  const seg = ["4", "8", "12"].indexOf(String(body.seg)) >= 0 ? String(body.seg) : "4";
  const vertical = body.size !== "1280x720";
  const pedido = String(body.pedido || "").slice(0, 1200);
  if (!ficha) return json({ error: "Preencha a ficha do produto antes de pedir o roteiro." }, 400);

  const nCenas = seg === "4" ? 2 : (seg === "8" ? 3 : 5);
  const formatoTxt = vertical ? "video em pe, 9 por 16, feito para celular" : "video deitado, 16 por 9";

  if (modo === "roteiro") {
    const sys = TOM_DONA_BEGO
      + "Voce recebe a ficha real de um produto e devolve o roteiro de um video de " + seg + " segundos, " + formatoTxt + ", com exatamente " + nCenas + " cenas. "
      + "Cada cena tem: o que a camera mostra, e a legenda que aparece na tela. A legenda de cada cena tem no maximo 7 palavras, porque ela precisa caber e ser lida em poucos segundos. "
      + "Nao escreva narracao falada: o video sai sem voz, quem conta a historia e a imagem mais a legenda. "
      + "A soma dos tempos das cenas tem que dar exatamente " + seg + " segundos. "
      + REGRA_SO_JSON
      + 'Formato exato: {"titulo":"","gancho":"","cenas":[{"n":1,"tempo":"0-2 s","camera":"","legenda":""}],"cta":"","aviso":""}. '
      + 'Em aviso escreva, em uma frase, qualquer coisa da ficha que voce PRECISOU deixar de fora ou que ficou em duvida. Se nao houver nada, deixe a string vazia.';
    let u = "FICHA REAL DO PRODUTO:\n" + ficha + "\n\n";
    if (escala) u += "CONTRATO DE MEDIDAS (proporcao real, tem que ser respeitada na imagem):\n" + escala + "\n\n";
    if (pedido) u += "O QUE A LOJISTA PEDIU PARA ESTE VIDEO:\n" + pedido + "\n\n";
    u += "Monte o roteiro.";
    const rr = await claudeTexto(env, sys, u, 2000);
    if (rr.erro) return json({ error: rr.erro }, 502);
    const obj = soJson(rr.texto);
    if (!obj || !obj.cenas || !obj.cenas.length) return json({ error: "Nao consegui ler o roteiro que voltou. Tente de novo." }, 502);
    return json({ roteiro: obj });
  }

  if (modo === "cenas") {
    let rot = body.roteiro;
    if (typeof rot === "string") rot = soJson(rot);
    if (!rot || !rot.cenas) return json({ error: "Aprove o roteiro antes de montar as cenas." }, 400);
    const sys = TOM_DONA_BEGO
      + "Agora voce e diretor de arte. Voce recebe a ficha real, o contrato de medidas e o roteiro JA APROVADO pela lojista. "
      + "Voce devolve dois prompts de geracao por IA, escritos em portugues, longos, concretos e sem markdown. "
      + "PROMPT 1, quadro-chave: uma unica imagem fotografica que serve de primeiro quadro e de referencia visual do video inteiro, no formato " + (vertical ? "vertical 9 por 16" : "horizontal 16 por 9") + ". "
      + "Descreva produto, quantidade exata de pecas, cor, material, fundo, luz, angulo e enquadramento. "
      + "Escreva a proporcao entre as pecas por extenso dentro do prompt, usando as medidas reais do contrato de medidas, porque o gerador de imagem erra tamanho quando nao le a proporcao escrita. "
      + "Proiba explicitamente: texto, numero, letra, rotulo escrito, marca de terceiro, selo, marca dagua, mao ou dedo deformado, peca a mais ou a menos. "
      + "PROMPT 2, video: descreva o movimento continuo de " + seg + " segundos que percorre as " + rot.cenas.length + " cenas do roteiro aprovado, comecando exatamente na imagem do quadro-chave. "
      + "Descreva movimento de camera lento e realista, o que entra e sai de quadro e em que segundo. Sem corte brusco. Sem voz. Sem musica descrita. "
      + "Repita no prompt 2 a mesma quantidade de pecas e a mesma proporcao escrita por extenso. Proiba texto e numero na imagem tambem aqui, porque a legenda entra depois por fora. "
      + REGRA_SO_JSON
      + 'Formato exato: {"quadro":"","video":"","conferir":["",""]}. '
      + 'Em conferir liste de 3 a 6 pontos curtos que a lojista deve olhar na imagem antes de gastar com o video.';
    let u = "FICHA REAL DO PRODUTO:\n" + ficha + "\n\n";
    if (escala) u += "CONTRATO DE MEDIDAS:\n" + escala + "\n\n";
    u += "ROTEIRO APROVADO (JSON):\n" + JSON.stringify(rot) + "\n\n";
    if (pedido) u += "PEDIDO EXTRA DA LOJISTA:\n" + pedido + "\n\n";
    u += "Monte os dois prompts.";
    const rr = await claudeTexto(env, sys, u, 3000);
    if (rr.erro) return json({ error: rr.erro }, 502);
    const obj = soJson(rr.texto);
    if (!obj || !obj.quadro || !obj.video) return json({ error: "Nao consegui ler os prompts que voltaram. Tente de novo." }, 502);
    if (!obj.conferir || !obj.conferir.length) obj.conferir = [];
    return json({ cenas: obj });
  }

  return json({ error: "Modo desconhecido." }, 400);
}

/* ---- video: tres passos curtos em vez de um pedido longo -------------------
   O motor antigo pedia o video e ficava perguntando ao Sora, de 5 em 5
   segundos, ate 100 vezes, tudo dentro do MESMO pedido. Cada pergunta dessas
   conta como uma saida para fora, e o plano permite 50 por pedido. Um video
   real leva de 1 a 4 minutos: batia no teto e era cortado no meio, com o
   video ja pago e perdido.
   Agora sao tres pedidos separados e curtos:
     POST /api/video         -> so encomenda e devolve o numero do pedido
     GET  /api/video-status  -> uma pergunta so, quem espera e o navegador
     GET  /api/video-arquivo -> entrega o arquivo direto, sem converter nada
   Nenhum deles passa de 2 saidas, e o arquivo nao e mais convertido para
   texto dentro do servidor: ele passa direto, o que tambem tira o risco de
   estourar o processamento com um video de 5 a 10 MB. */
function idLimpo(v) {
  const t = String(v || "");
  return /^[A-Za-z0-9_.-]{1,120}$/.test(t) ? t : "";
}

async function handleVideo(request, env) {
  if (!env.OPENAI_API_KEY) {
    return json({ error: "Falta configurar OPENAI_API_KEY no Cloudflare (Settings > Variables and Secrets)." }, 500);
  }
  let body;
  try { body = await request.json(); } catch { return json({ error: "JSON invalido." }, 400); }
  const prompt = String(body.prompt || "").slice(0, 8000);
  if (!prompt) return json({ error: "Cole o prompt do video." }, 400);
  const fd = new FormData();
  fd.append("model", "sora-2");
  fd.append("prompt", prompt);
  fd.append("seconds", ["4", "8", "12"].indexOf(String(body.seconds)) >= 0 ? String(body.seconds) : "4");
  fd.append("size", body.size === "1280x720" ? "1280x720" : "720x1280");
  if (body.imageBase64 && body.mediaType) {
    const bin = Uint8Array.from(atob(body.imageBase64), c => c.charCodeAt(0));
    fd.append("input_reference", new Blob([bin], { type: body.mediaType }), "referencia.png");
  }
  const auth = { "authorization": "Bearer " + env.OPENAI_API_KEY };
  const r = await fetch("https://api.openai.com/v1/videos", { method: "POST", headers: auth, body: fd });
  if (!r.ok) {
    const t = await r.text();
    return json({ error: erroOpenAI(r.status, t) }, 502);
  }
  const job = await r.json();
  if (!job || !job.id) return json({ error: "O gerador aceitou o pedido mas nao devolveu o numero dele. Tente de novo." }, 502);
  return json({ id: job.id, status: job.status || "queued" });
}

async function handleVideoStatus(request, env) {
  if (!env.OPENAI_API_KEY) return json({ error: "Falta configurar OPENAI_API_KEY no Cloudflare." }, 500);
  const id = idLimpo(new URL(request.url).searchParams.get("id"));
  if (!id) return json({ error: "Numero do pedido do video invalido." }, 400);
  const r = await fetch("https://api.openai.com/v1/videos/" + id, {
    headers: { "authorization": "Bearer " + env.OPENAI_API_KEY }
  });
  if (!r.ok) {
    const t = await r.text();
    return json({ error: "Erro ao consultar o video (" + r.status + "): " + t.slice(0, 300) }, 502);
  }
  const job = await r.json();
  if (job.status === "failed") {
    return json({ status: "failed", error: "Geracao do video falhou: " + ((job.error && job.error.message) || "erro desconhecido") });
  }
  return json({ status: job.status || "in_progress", progress: typeof job.progress === "number" ? job.progress : null });
}

async function handleVideoArquivo(request, env) {
  if (!env.OPENAI_API_KEY) return json({ error: "Falta configurar OPENAI_API_KEY no Cloudflare." }, 500);
  const id = idLimpo(new URL(request.url).searchParams.get("id"));
  if (!id) return json({ error: "Numero do pedido do video invalido." }, 400);
  const vr = await fetch("https://api.openai.com/v1/videos/" + id + "/content", {
    headers: { "authorization": "Bearer " + env.OPENAI_API_KEY }
  });
  if (!vr.ok) {
    const t = await vr.text();
    return json({ error: "Erro ao baixar o video (" + vr.status + "): " + t.slice(0, 300) }, 502);
  }
  return new Response(vr.body, {
    headers: {
      "content-type": vr.headers.get("content-type") || "video/mp4",
      "cache-control": "no-store"
    }
  });
}

function parseCSV(t) {
  const rows = [];
  let row = [], cur = "", q = false;
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (q) {
      if (ch === '"') { if (t[i + 1] === '"') { cur += '"'; i++; } else q = false; }
      else cur += ch;
    } else {
      if (ch === '"') q = true;
      else if (ch === ",") { row.push(cur); cur = ""; }
      else if (ch === "\n") { row.push(cur); cur = ""; rows.push(row); row = []; }
      else if (ch !== "\r") cur += ch;
    }
  }
  row.push(cur); rows.push(row);
  return rows;
}

function normTxt(s) {
  return (s || "").toString().trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function handleSku(request) {
  const url = new URL(request.url);
  const src = url.searchParams.get("u") || "";
  const want = normTxt(url.searchParams.get("sku") || "").toUpperCase();
  const listOnly = url.searchParams.get("list") === "1";
  let h;
  try { h = new URL(src); } catch (e) { return json({ error: "Link inválido." }, 400); }
  if (!/(^|\.)google\.com$/.test(h.hostname) && !/(^|\.)googleusercontent\.com$/.test(h.hostname)) {
    return json({ error: "Por segurança só aceito link de planilha do Google." }, 400);
  }
  let r;
  try { r = await fetch(h.toString(), { headers: { accept: "text/csv" } }); }
  catch (e) { return json({ error: "Não consegui acessar a planilha: " + e }, 400); }
  if (!r.ok) return json({ error: "A planilha respondeu com erro " + r.status + ". Confira se ela está publicada na web em formato CSV." }, 400);
  const txt = await r.text();
  if (/^\s*</.test(txt)) return json({ error: "Esse link não devolveu uma planilha. Use Arquivo → Compartilhar → Publicar na web → CSV." }, 400);
  const rows = parseCSV(txt);
  let hi = -1;
  for (let i = 0; i < rows.length && i < 40; i++) {
    if (normTxt(rows[i][0]) === "sku") { hi = i; break; }
  }
  if (hi < 0) return json({ error: "Não achei a coluna SKU na planilha." }, 400);
  const head = rows[hi].map(normTxt);
  const col = (...names) => {
    for (const n of names) { const k = head.indexOf(n); if (k > -1) return k; }
    for (const n of names) { const k = head.findIndex(c => c.indexOf(n) === 0); if (k > -1) return k; }
    return -1;
  };
  const C = {
    nome: col("produto"),
    marca: col("loja / marca", "loja/marca", "marca"),
    custo: col("custo (r$)", "custo"),
    preco: col("preco de venda (r$)", "preco de venda", "preco"),
    margem: col("margem (r$)"),
    pct: col("margem %"),
    obs: col("observacoes"),
    link: col("link do anuncio principal", "link")
  };
  const get = (row, k) => (C[k] > -1 ? (row[C[k]] || "").trim() : "");
  const data = rows.slice(hi + 1).filter(rw => (rw[0] || "").trim());
  if (listOnly) return json({ skus: data.map(rw => rw[0].trim() + " — " + get(rw, "nome")).slice(0, 300) });
  const hit = data.find(rw => normTxt(rw[0]).toUpperCase() === want);
  if (!hit) return json({ error: "Não achei o SKU " + want + " na planilha." }, 404);
  return json({
    sku: hit[0].trim(),
    nome: get(hit, "nome"),
    marca: get(hit, "marca"),
    custo: get(hit, "custo"),
    preco: get(hit, "preco"),
    margem: get(hit, "margem"),
    pct: get(hit, "pct"),
    obs: get(hit, "obs"),
    link: get(hit, "link")
  });
}

async function handleArquivar(request) {
  let b;
  try { b = await request.json(); } catch (e) { return json({ error: "JSON inválido." }, 400); }
  let h;
  try { h = new URL(String(b.destino || "")); } catch (e) { return json({ error: "Configure o link do script de arquivamento." }, 400); }
  if (!/(^|\.)google\.com$/.test(h.hostname)) {
    return json({ error: "O link de arquivamento precisa ser do Google Apps Script (script.google.com)." }, 400);
  }
  const canais = Array.isArray(b.canais) ? b.canais.slice(0, 10).map(c => ({
    nome: String(c.nome || "Canal").slice(0, 60),
    texto: String(c.texto || "").slice(0, 45000)
  })) : [];
  if (!canais.length) return json({ error: "Nenhum canal para arquivar." }, 400);
  const payload = {
    sku: String(b.sku || "SEM-SKU").slice(0, 60),
    produto: String(b.produto || "Produto").slice(0, 160),
    canais,
    completo: String(b.completo || "").slice(0, 90000)
  };
  let r;
  try {
    r = await fetch(h.toString(), {
      method: "POST",
      headers: { "content-type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow"
    });
  } catch (e) { return json({ error: "Não consegui falar com o Drive: " + e }, 502); }
  const t = await r.text();
  try { return json(JSON.parse(t)); }
  catch (e) { return json({ error: "O script do Drive respondeu algo inesperado. Confira se ele foi publicado com acesso para Qualquer pessoa. Resposta: " + t.slice(0, 200) }, 502); }
}

async function handleCadastrar(request) {
  let b;
  try { b = await request.json(); } catch (e) { return json({ error: "JSON inválido." }, 400); }
  let h;
  try { h = new URL(String(b.destino || "")); } catch (e) { return json({ error: "Configure primeiro o link do script do Google (o mesmo do arquivamento no Drive)." }, 400); }
  if (!/(^|\.)google\.com$/.test(h.hostname)) {
    return json({ error: "O link precisa ser do Google Apps Script (script.google.com)." }, 400);
  }
  let chave = "";
  try { chave = new URL(String(b.csv || "")).searchParams.get("k") || ""; } catch (e) {}
  const num = (x) => {
    const s = String(x == null ? "" : x).replace(/[^0-9,.-]/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".");
    const n = parseFloat(s);
    return isFinite(n) ? n : "";
  };
  const payload = {
    acao: "cadastrar",
    chave,
    sku: String(b.sku || "").trim().slice(0, 60),
    produto: String(b.produto || "").trim().slice(0, 160),
    marca: String(b.marca || "").trim().slice(0, 80),
    custo: num(b.custo),
    preco: num(b.preco),
    obs: String(b.obs || "").trim().slice(0, 500)
  };
  if (!payload.sku) return json({ error: "Digite o SKU." }, 400);
  if (!payload.produto) return json({ error: "Digite o Nome do produto (bloco 3)." }, 400);
  let r;
  try {
    r = await fetch(h.toString(), {
      method: "POST",
      headers: { "content-type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
      redirect: "follow"
    });
  } catch (e) { return json({ error: "Não consegui falar com a planilha: " + e }, 502); }
  const t = await r.text();
  try { return json(JSON.parse(t)); }
  catch (e) { return json({ error: "O script do Google respondeu algo inesperado. Se você acabou de atualizar o script, publique uma NOVA VERSÃO da implantação. Resposta: " + t.slice(0, 200) }, 502); }
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
    if (url.pathname === "/studio" || url.pathname === "/studio/") {
      return new Response(STUDIO_HTML, { headers: { "content-type": "text/html; charset=utf-8" } });
    }
    if (url.pathname === "/api/generate" && request.method === "POST") {
      return handleGenerate(request, env);
    }
    if (url.pathname === "/api/image" && request.method === "POST") {
      return handleImage(request, env);
    }
    if (url.pathname === "/api/video" && request.method === "POST") {
      return handleVideo(request, env);
    }
    if (url.pathname === "/api/video-status" && request.method === "GET") {
      return handleVideoStatus(request, env);
    }
    if (url.pathname === "/api/video-arquivo" && request.method === "GET") {
      return handleVideoArquivo(request, env);
    }
    if (url.pathname === "/api/roteiro" && request.method === "POST") {
      return handleRoteiro(request, env);
    }
    if (url.pathname === "/api/fix" && request.method === "POST") {
      return handleFix(request, env);
    }
    if (url.pathname === "/api/analisar" && request.method === "POST") {
      return handleAnalisar(request, env);
    }
    if (url.pathname === "/api/sku" && request.method === "GET") {
      return handleSku(request);
    }
    if (url.pathname === "/api/arquivar" && request.method === "POST") {
      return handleArquivar(request);
    }
    if (url.pathname === "/api/cadastrar" && request.method === "POST") {
      return handleCadastrar(request);
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
<p>Preencha à esquerda → <strong>Gerar anúncio</strong> → <strong>Enviar para o STUDIO</strong> (é lá que saem as imagens e os vídeos). Marca oficial: Sayonara.</p></div></header>
<div class="container">
<div>
 <div class="card"><h2>1 · Produto <span class="req">*</span></h2>
  <p class="hint">Comece pelo <strong>SKU</strong>: eu puxo nome, marca, custo, preço e margem direto do seu PAINEL no Drive. O SKU também vira o nome da pasta no Drive e do arquivo baixado.</p>
  <div class="g2"><div class="field"><label>SKU</label><input id="sku" placeholder="FER-0053"></div><div class="field"><label>&nbsp;</label><button id="bsku" class="btn btn-p" style="width:100%">🔎 Buscar na planilha</button></div></div>
  <div id="skuout" style="display:none;font-size:.85rem;background:#f0fdfa;border:1px solid #99f6e4;border-radius:8px;padding:8px;margin-top:8px"></div>
  <div class="g2" style="margin-top:12px"><div class="field"><label>Nome <span class="req">*</span></label><input id="nome" placeholder="Panela de Pressão 4,2L"></div><div class="field"><label>Marca</label><input id="marca" value="Sayonara"></div></div>
  <div class="field"><label>Medidas</label><input id="med" placeholder="43 x 33 x 35 cm"><p class="hint" style="margin:6px 0 0">Vai junto para o STUDIO e enche o Contrato de medidas sozinho.</p></div>
  <div id="medask" style="display:none;margin-top:10px;background:#FFF7ED;border:1px solid #FDBA74;border-radius:10px;padding:10px;font-size:.85rem;line-height:1.5"></div>
  <div class="sw" style="margin-top:14px;padding-top:12px;border-top:1px solid var(--line)"><label class="switch"><input type="checkbox" id="ct"><span class="sl"></span></label><span style="font-size:.85rem"><strong>É refil / compatível</strong> com outra marca</span></div>
  <p class="hint" style="margin:6px 0 0">Liga a Regra de Ouro (protege de bloqueio).</p>
  <div class="compat" id="cb"><div class="g2"><div class="field"><label>Marca REAL do produto</label><input id="marcaReal" placeholder="Hidro Filtros"></div><div class="field"><label>Compatível com (original)</label><input id="marcaOrig" placeholder="IBBL FR600"></div></div></div>
  <details style="margin-top:12px"><summary style="cursor:pointer;font-size:.85rem;color:var(--accent-d);font-weight:700">➕ Cadastrar este produto na planilha</summary>
   <p class="hint" style="margin-top:8px">Uso o <strong>SKU</strong>, o <strong>Nome</strong> e a <strong>Marca</strong> daqui de cima. Preencha custo e preço. Eu mostro a linha inteira antes e só gravo depois que você clicar em confirmar.</p>
   <div class="g2"><div class="field"><label>Custo (R$)</label><input id="custoin" placeholder="18,00"></div><div class="field"><label>Preço de venda (R$)</label><input id="precoin" placeholder="38,97"></div></div>
   <div class="field"><label>Observações (opcional)</label><input id="obsin" placeholder="ex.: caixa com 3 unidades"></div>
   <button id="bcad" class="btn btn-g" style="margin-top:8px">💾 Salvar na planilha</button>
   <div id="cadout" style="display:none;font-size:.85rem;background:#fffbeb;border:1px solid #fcd34d;border-radius:8px;padding:8px;margin-top:8px"></div></details>
  <details style="margin-top:8px"><summary style="cursor:pointer;font-size:.85rem;color:var(--muted)">⚙️ Configurar o link da planilha (só uma vez)</summary>
   <p class="hint" style="margin-top:8px">Na sua planilha PAINEL: <strong>Arquivo → Compartilhar → Publicar na web → escolha CSV → Publicar</strong>. Copie o link que aparecer e cole aqui.</p>
   <div class="field"><input id="csvurl" placeholder="https://docs.google.com/spreadsheets/d/e/..../pub?output=csv"></div>
   <button id="bcsv" class="btn btn-g" style="margin-top:6px">Salvar link</button></details></div>
 <div class="card"><h2>2 · Fotos reais do produto <span class="req">*</span></h2><p class="hint">Até 4 fotos (ângulos diferentes ajudam). Elas vão junto para o STUDIO e garantem que as imagens geradas fiquem idênticas ao seu produto.</p>
  <label class="imgbtn" for="img">📷 <strong>Importar fotos (até 4)</strong></label><input id="img" type="file" accept="image/*" multiple hidden><div class="thumbs" id="thumbs"></div></div>
 <div class="card"><h2>3 · Tudo sobre o produto</h2><p class="hint"><strong>É aqui que vai o resto.</strong> Escreva do jeito que você falaria — voltagem, capacidade, cor, material, garantia, EAN, INMETRO, diferenciais, para quem serve. Eu leio e organizo sozinha.</p><textarea id="desc" rows="7" placeholder="Exemplo:&#10;Bivolt. Capacidade 4,2 litros.&#10;Sem PFOA, fundo triplo, 3 sistemas de segurança.&#10;Cor preta. Garantia de 1 ano. Certificado INMETRO.&#10;EAN 7898000000000.&#10;Serve para quem cozinha para uma família de 4 pessoas."></textarea>
  <p class="hint" style="margin:8px 0 0">Quanto mais você escrever aqui, melhor sai o anúncio. Pode escrever tudo junto ou uma coisa por linha — tanto faz.</p>
  <div class="g2" style="margin-top:10px"><div class="field"><label>Meu anúncio atual (p/ otimizar)</label><input id="linkMeu" placeholder="https://..."></div><div class="field"><label>Produto similar (base)</label><input id="linkSim" placeholder="https://..."></div></div></div>
 <div class="card"><h2>4 · Canais e tipo de trabalho</h2>
  <label>Canais</label><div class="chips" id="canais" style="margin-bottom:12px"><div class="chip on" data-v="Mercado Livre">Mercado Livre</div><div class="chip" data-v="Shopee">Shopee</div><div class="chip on" data-v="Amazon">Amazon</div><div class="chip" data-v="Magalu">Magalu</div><div class="chip" data-v="TikTok Shop">TikTok Shop</div><div class="chip" data-v="Google Shopping">Google Shopping</div></div>
  <label>Profundidade</label><div class="chips" id="prof" style="margin-bottom:12px"><div class="chip on" data-v="Pacote completo">Completo</div><div class="chip" data-v="Rápido">Rápido</div></div>
  <label>O que vamos fazer</label><div class="chips" id="modo"><div class="chip on" data-v="Criar anúncio novo">Criar novo</div><div class="chip" data-v="Otimizar existente">Otimizar</div><div class="chip" data-v="Replicar em outra cor/variação">Replicar cor</div><div class="chip" data-v="Adaptar para outro canal">Adaptar canal</div></div></div>
</div>
<div class="side">
 <div class="card"><h2>✨ Gerar anúncio</h2><p class="hint">Preencha à esquerda e clique. O texto sai aqui e os prompts de imagem e as cenas de vídeo ficam guardados para o STUDIO. O último anúncio fica salvo neste navegador — ao reabrir o site, ele volta sozinho.</p>
  <button class="btn btn-p" id="go">🚀 Gerar anúncio</button>
  <div class="spin" id="spin">⏳ Criando o anúncio completo… pode levar 2 a 5 min. Não feche a página.</div><p class="hint" id="spinfim" style="display:none;margin:6px 0 0"></p>
  <div id="out" style="display:none"></div>
  <button class="btn btn-g" id="copy" style="display:none">📎 Copiar tudo</button></div>
 <div class="card" id="studiocard" style="border-color:#F6ABBB;background:#FDEEF1">
  <h2 style="color:#9E1E3A">🌸 Levar para o STUDIO DONA BEGÔ</h2>
  <p class="hint"><strong>As imagens e os vídeos são feitos no STUDIO</strong> — com as suas fotos reais, as medidas reais e uma parada para você aprovar antes de cada passo que custa dinheiro. Aqui no ANNOUNCER PRO fica só o texto do anúncio.</p>
  <div id="stresumo" style="display:none;font-size:.82rem;background:#fff;border:1px solid #F6ABBB;border-radius:8px;padding:8px;margin-bottom:8px;line-height:1.5"></div>
  <button class="btn" id="gostudio" style="background:#E92C56;color:#fff">Enviar para o STUDIO →</button>
  <a class="btn btn-g" href="/studio" target="_blank" style="text-decoration:none;text-align:center;display:block">Abrir o STUDIO sem enviar nada</a>
  <div id="stmsg" style="display:none;font-size:.85rem;margin-top:8px;color:#9E1E3A"></div></div>
 <div class="card" id="canalcard" style="display:none"><h2>📋 Pronto para publicar (por canal)</h2>
  <p class="hint">Clique no canal, copie campo por campo e cole direto na plataforma.</p>
  <div class="chips" id="cchips" style="margin-bottom:10px"></div>
  <div id="cfields"></div>
  <button class="btn btn-g" id="baixar" style="margin-top:10px">⬇️ Baixar tudo (1 arquivo por canal)</button>
  <button class="btn btn-p" id="arquivar" style="margin-top:8px">☁️ Arquivar no Drive</button>
  <div id="arqout" style="display:none;font-size:.85rem;margin-top:8px;background:#f0fdfa;border:1px solid #99f6e4;border-radius:8px;padding:8px"></div>
  <details style="margin-top:10px"><summary style="cursor:pointer;font-size:.85rem;color:var(--muted)">⚙️ Configurar o arquivamento no Drive (só uma vez)</summary>
   <p class="hint" style="margin-top:8px">Cole aqui o link do script de arquivamento. O passo a passo está no documento <strong>COMO LIGAR O APP AO DRIVE</strong>, na sua pasta ANÚNCIOS SAYONARA.</p>
   <div class="field"><input id="gsurl" placeholder="https://script.google.com/macros/s/..../exec"></div>
   <button class="btn btn-g" id="bgs" style="margin-top:6px">Salvar link</button></details></div>
</div>
<script>
var imgs=[];
function cg(id,m){var g=document.getElementById(id);g.onclick=function(e){var c=e.target.closest('.chip');if(!c)return;if(m)c.classList.toggle('on');else{[].forEach.call(g.children,function(x){x.classList.remove('on')});c.classList.add('on')}}}
cg('modo',0);cg('canais',1);cg('prof',0);
function one(id){var e=document.querySelector('#'+id+' .chip.on');return e?e.dataset.v:''}
function many(id){return[].map.call(document.querySelectorAll('#'+id+' .chip.on'),function(x){return x.dataset.v})}
function v(id){var e=document.getElementById(id);return e?e.value.trim():''}
var inp=document.getElementById('img'),th=document.getElementById('thumbs');
function renderThumbs(){th.innerHTML=imgs.map(function(o,i){return '<div class="thumb"><img src="'+o.url+'"><span data-x="'+i+'">×</span></div>'}).join('')}
inp.onchange=function(){[].forEach.call(inp.files,function(f){if(imgs.length>=4)return;var r=new FileReader();r.onload=function(){imgs.push({data:r.result.split(',')[1],media:f.type,url:r.result});renderThumbs()};r.readAsDataURL(f)});inp.value='';};
th.onclick=function(e){if(e.target.dataset&&e.target.dataset.x!==undefined&&e.target.dataset.x!==''){imgs.splice(Number(e.target.dataset.x),1);renderThumbs()}};
document.getElementById('ct').onchange=function(){document.getElementById('cb').classList.toggle('show',this.checked)};
function brief(){var c=document.getElementById('ct').checked;var t='';t+='Ação: '+one('modo')+'\n';t+='Profundidade: '+one('prof')+'\n';t+='Canais: '+(many('canais').join(', ')||'[CONFIRMAR]')+'\n\nPRODUTO:\n';
 var _sk=v('sku');if(_sk)t+='SKU: '+_sk+'\n';
 t+='Nome: '+(v('nome')||'[CONFIRMAR]')+'\n';t+='Marca oficial: '+(c?(v('marcaReal')||'[CONFIRMAR]'):(v('marca')||'Sayonara'))+'\n';
 var _md=v('med');if(_md)t+='Medidas: '+_md+'\n';
 if(c){t+='\nPRODUTO COMPATÍVEL: aplicar Regra de Ouro. Marca real: '+(v('marcaReal')||'[CONFIRMAR]')+'. Compatível com: '+(v('marcaOrig')||'[CONFIRMAR]')+'. Nunca usar "original" para o produto.\n'}
 var d=v('desc');if(d)t+='\nObservações: '+d+'\n';
 var lm=v('linkMeu'),ls=v('linkSim');if(lm)t+='\nMeu anúncio: '+lm;if(ls)t+='\nSimilar base: '+ls;
 if(!imgs.length)t+='\n(Sem imagem anexada — descreva a aparência ou marque [CONFIRMAR].)';
 return t}
var ULT={imagens:[],cenas:[]};
function montarChips(imgs,cenas){
 ULT.imagens=imgs||[];ULT.cenas=cenas||[];
 var r=document.getElementById('stresumo');if(!r)return;
 var ni=ULT.imagens.length,nc=ULT.cenas.length;
 if(!ni&&!nc){r.style.display='none';r.innerHTML='';return}
 r.style.display='block';
 r.innerHTML='Guardado para o STUDIO: <strong>'+ni+'</strong> prompt(s) de imagem e <strong>'+nc+'</strong> cena(s) de v\u00eddeo. Clique no bot\u00e3o abaixo para levar tudo junto com as fotos e as medidas.';
}
var canais=[];
var ROT=['TITULO ALTERNATIVO','TITULO','FICHA TECNICA','BULLETS','DESCRICAO','PALAVRAS-CHAVE','ROTEIRO DO VIDEO','OBSERVACOES DO CANAL'];
function parseCanais(t){var out=[],re=/\[\[CANAL:\s*([^\]]+)\]\]([\s\S]*?)\[\[\/CANAL\]\]/g,m;while((m=re.exec(t||''))){out.push({nome:m[1].trim(),texto:m[2].trim()})}return out}
function campos(txt){var cur=null,res=[];
 (txt||'').split('\n').forEach(function(l){var hit=null,U=l.toUpperCase();
  for(var i=0;i<ROT.length;i++){if(U.indexOf(ROT[i]+':')===0){hit=ROT[i];break}}
  if(hit){cur={rot:hit,val:l.slice(hit.length+1).trim()};res.push(cur)}
  else if(cur){cur.val+=(cur.val?'\n':'')+l}});
 return res.map(function(c){c.val=c.val.trim();return c}).filter(function(c){return c.val&&c.val!=='-'})}
function verCanal(i){var c=canais[i],box=document.getElementById('cfields');box.innerHTML='';
 campos(c.texto).forEach(function(f){
  var d=document.createElement('div');d.style.marginBottom='12px';
  var h=document.createElement('div');h.style.cssText='font-size:.72rem;font-weight:700;color:#64748b;letter-spacing:.4px;margin-bottom:4px';h.textContent=f.rot;
  var ta=document.createElement('textarea');ta.value=f.val;ta.style.minHeight=(f.val.length>200?'120px':'44px');
  var b=document.createElement('button');b.className='btn btn-g';b.style.marginTop='4px';b.textContent='📎 Copiar';
  b.onclick=function(){ta.select();try{document.execCommand('copy')}catch(e){}try{navigator.clipboard.writeText(ta.value)}catch(e){}b.textContent='✅ Copiado!';setTimeout(function(){b.textContent='📎 Copiar'},1500)};
  d.appendChild(h);d.appendChild(ta);d.appendChild(b);box.appendChild(d)})}
function montarCanais(t){canais=parseCanais(t);
 var card=document.getElementById('canalcard'),cc=document.getElementById('cchips');cc.innerHTML='';
 if(!canais.length){card.style.display='none';return}
 card.style.display='block';
 canais.forEach(function(c,i){var d=document.createElement('div');d.className='chip';d.textContent=c.nome;
  d.onclick=function(){[].forEach.call(cc.children,function(x){x.classList.remove('on')});d.classList.add('on');verCanal(i)};cc.appendChild(d)});
 cc.children[0].click()}
function gsUrl(){try{return localStorage.getItem('ap_gs')||''}catch(e){return ''}}
try{document.getElementById('gsurl').value=gsUrl()}catch(e){}
document.getElementById('bgs').onclick=function(){var u=document.getElementById('gsurl').value.trim();
 try{localStorage.setItem('ap_gs',u)}catch(e){}
 var b=document.getElementById('arqout');b.style.display='block';b.innerHTML=u?'✅ Link salvo. Agora o botão Arquivar no Drive já funciona.':'Link apagado.'};
document.getElementById('baixar').onclick=function(){var sku=v('sku')||v('nome')||'produto';
 canais.forEach(function(c,i){setTimeout(function(){
  var blob=new Blob([sku+' — '+c.nome+'\n\n'+c.texto],{type:'text/plain;charset=utf-8'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(sku+' - '+c.nome+'.txt').replace(/[\\/:*?"<>|]/g,'-');
  document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(function(){URL.revokeObjectURL(a.href)},4000)},i*400)})};
document.getElementById('arquivar').onclick=function(){
 var u=gsUrl(),b=document.getElementById('arqout'),btn=this;b.style.display='block';
 if(!u){b.innerHTML='⚙️ Antes cole o link do script em "Configurar o arquivamento no Drive", logo abaixo.';return}
 if(!canais.length){b.innerHTML='Gere um anúncio primeiro.';return}
 var _sk=v('sku').trim();
 if(!_sk&&!window.__semsku){b.innerHTML='📌 O campo <strong>SKU</strong> (lá em cima, no item 1) está vazio — a pasta no Drive vai se chamar <strong>SEM-SKU</strong>. Preencha o SKU e clique de novo, ou <a href="#" id="asemsku">arquivar assim mesmo</a>.';var _l=document.getElementById('asemsku');if(_l)_l.onclick=function(ev){ev.preventDefault();window.__semsku=1;document.getElementById('arquivar').click()};return}
 window.__semsku=0;
 b.innerHTML='Enviando para o Drive…';btn.disabled=true;
 fetch('/api/arquivar',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({destino:u,sku:v('sku')||'SEM-SKU',produto:v('nome')||'Produto',canais:canais,completo:document.getElementById('out').textContent||''})})
 .then(function(r){return r.json()}).then(function(j){btn.disabled=false;
  if(j.error){b.innerHTML='⚠️ '+esc(j.error);return}
  var h='✅ Arquivado em <strong>'+esc(j.pasta||'Drive')+'</strong>';
  if(j.link)h+=' — <a href="'+esc(j.link)+'" target="_blank">abrir pasta</a>';
  if(j.arquivos&&j.arquivos.length)h+='<br>'+j.arquivos.map(esc).join('<br>');
  b.innerHTML=h}).catch(function(e){btn.disabled=false;b.innerHTML='⚠️ Falha: '+esc(e)})};
(function(){var a=document.getElementById('sku'),b=document.getElementById('sku2');if(!a||!b)return;
 a.addEventListener('input',function(){b.value=a.value});
 b.addEventListener('input',function(){a.value=b.value});})();
var skuData=null;
function esc(x){return String(x==null?'':x).replace(/[&<>]/g,function(c){return c==='&'?'&amp;':(c==='<'?'&lt;':'&gt;')})}
function csvUrl(){try{return localStorage.getItem('ap_csv')||''}catch(e){return ''}}
try{document.getElementById('csvurl').value=csvUrl()}catch(e){}
document.getElementById('bcsv').onclick=function(){
 var u=document.getElementById('csvurl').value.trim();
 try{localStorage.setItem('ap_csv',u)}catch(e){}
 var b=document.getElementById('skuout');b.style.display='block';
 b.innerHTML=u?'✅ Link salvo. Agora digite o SKU e clique em Buscar.':'Link apagado.'};
document.getElementById('bsku').onclick=function(){
 var u=csvUrl(),s=v('sku'),box=document.getElementById('skuout');
 box.style.display='block';
 if(!u){box.innerHTML='⚙️ Antes cole o link da planilha em "Configurar o link da planilha (só uma vez)" logo abaixo.';return}
 if(!s){box.innerHTML='Digite o SKU (ex.: FER-0053).';return}
 box.innerHTML='Procurando na planilha...';
 fetch('/api/sku?u='+encodeURIComponent(u)+'&sku='+encodeURIComponent(s))
 .then(function(r){return r.json()}).then(function(j){
  if(j.error){skuData=null;box.innerHTML='⚠️ '+esc(j.error);return}
  skuData=j;
  if(j.nome)document.getElementById('nome').value=j.nome;
  if(j.marca)document.getElementById('marca').value=j.marca;
  var _pc=document.getElementById('preco');if(j.preco&&_pc)_pc.value=j.preco;
  var h='✅ <strong>'+esc(j.sku)+'</strong> — '+esc(j.nome)+'<br>Custo <strong>R$ '+esc(j.custo||'?')+'</strong> · Venda <strong>R$ '+esc(j.preco||'?')+'</strong> · Margem <strong>R$ '+esc(j.margem||'?')+'</strong>'+(j.pct?' ('+esc(j.pct)+')':'');
  if(j.obs)h+='<br>Obs.: '+esc(j.obs);
  h+='<br><span style="color:#64748b">Nome e marca já foram preenchidos abaixo. Custo e preço ficam só aqui na tela — não vão para o texto do anúncio.</span>';
  box.innerHTML=h;
 }).catch(function(e){box.innerHTML='⚠️ Falha de rede: '+esc(e)})};
/* ---- cadastrar na planilha: SEMPRE mostra a linha e espera confirmar ---- */
var CAD=null;
document.getElementById('bcad').onclick=function(){
 var box=document.getElementById('cadout');box.style.display='block';
 var s=v('sku'),n=v('nome'),m=v('marca'),c=v('custoin'),p=v('precoin'),o=v('obsin');
 if(!gsUrl()){box.innerHTML='⚙️ Antes cole o link do script do Google lá embaixo, em <strong>Configurar o arquivamento no Drive</strong>. É o mesmo link.';return}
 if(!csvUrl()){box.innerHTML='⚙️ Antes cole o link CSV da planilha logo abaixo, em <strong>Configurar o link da planilha</strong>.';return}
 if(!s){box.innerHTML='Digite o SKU aqui em cima.';return}
 if(!n){box.innerHTML='Digite o <strong>Nome do produto</strong> no bloco 3.';return}
 CAD={sku:s,produto:n,marca:m,custo:c,preco:p,obs:o};
 var h='📋 <strong>Confira antes de gravar:</strong><br>';
 h+='SKU <strong>'+esc(s)+'</strong> · Produto <strong>'+esc(n)+'</strong><br>';
 h+='Loja/Marca '+esc(m||'(em branco)')+' · Custo R$ '+esc(c||'(em branco)')+' · Venda R$ '+esc(p||'(em branco)')+'<br>';
 if(o)h+='Obs.: '+esc(o)+'<br>';
 h+='<span style="color:#92400e">Margem e Margem % a planilha calcula sozinha. Se o SKU já existir, eu atualizo a linha dele em vez de criar outra.</span><br>';
 h+='<button class="btn btn-p" id="bcadok" style="margin-top:8px">✅ Confirmar e gravar</button> <button class="btn btn-g" id="bcadno" style="margin-top:8px">Cancelar</button>';
 box.innerHTML=h;
 document.getElementById('bcadno').onclick=function(){box.style.display='none';CAD=null};
 document.getElementById('bcadok').onclick=function(){
  var bb=this;bb.disabled=true;bb.textContent='Gravando…';
  fetch('/api/cadastrar',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({destino:gsUrl(),csv:csvUrl(),sku:CAD.sku,produto:CAD.produto,marca:CAD.marca,custo:CAD.custo,preco:CAD.preco,obs:CAD.obs})})
  .then(function(r){return r.json()}).then(function(j){
   if(j.error){box.innerHTML='⚠️ '+esc(j.error);return}
   box.innerHTML='✅ <strong>'+esc(j.sku||CAD.sku)+'</strong> '+(j.novo?'cadastrado':'atualizado')+' na linha '+esc(j.linha||'?')+' da planilha.<br>Custo R$ '+esc(j.custo||'?')+' · Venda R$ '+esc(j.preco||'?')+' · Margem R$ '+esc(j.margem||'?')+(j.pct?' ('+esc(j.pct)+')':'')+'<br><span style="color:#64748b">A busca por SKU pode levar uns minutos pra enxergar (o Google guarda o CSV em cache).</span>';
  }).catch(function(e){box.innerHTML='⚠️ Falha: '+esc(e)});
 };
};
/* ---- medidas achadas no anuncio: NUNCA preenche sozinho, sempre pergunta ---- */
var MED_SUG='';
function normMed(x){return String(x==null?'':x).toLowerCase().replace(/×/g,'x').replace(/,/g,'.').replace(/\s+/g,'')}
function acharMedidas(t){
 if(!t)return '';
 var s=String(t).replace(/ /g,' ');
 var best='',bn=0,m;
 var re=/(\d{1,4}(?:[.,]\d{1,3})?)\s*(cm|mm)?\s*[x×X]\s*(\d{1,4}(?:[.,]\d{1,3})?)\s*(cm|mm)?(?:\s*[x×X]\s*(\d{1,4}(?:[.,]\d{1,3})?)\s*(cm|mm)?)?/g;
 while((m=re.exec(s))!==null){
  var u=m[2]||m[4]||m[6]||'';
  if(!u){var mu=s.substr(m.index+m[0].length,10).match(/^[\s.,)]*(cm|mm)/i);if(mu)u=mu[1]}
  if(!u)continue;
  var ns=[m[1],m[3]];if(m[5])ns.push(m[5]);
  if(ns.length>bn){bn=ns.length;best=ns.join(' x ')+' '+u.toLowerCase()}
 }
 if(best)return best;
 var rot=[['altura',0],['comprimento',0],['largura',1],['di[âa]metro',1],['profundidade',2],['espessura',2]];
 var got=[null,null,null],un='';
 for(var i=0;i<rot.length;i++){
  var g=s.match(new RegExp(rot[i][0]+'\\s*(?:aproximad[ao]|total|externa?)?\\s*[:=]?\\s*(\\d{1,4}(?:[.,]\\d{1,3})?)\\s*(cm|mm)','i'));
  if(g&&got[rot[i][1]]==null){got[rot[i][1]]=g[1];if(!un)un=g[2]}
 }
 var lim=[];for(var k=0;k<3;k++){if(got[k]!=null)lim.push(got[k])}
 if(lim.length>=2)return lim.join(' x ')+' '+un.toLowerCase();
 return '';
}
function pedirMedidas(t){
 var box=document.getElementById('medask');if(!box)return;
 var sug=acharMedidas(t),atual=v('med');
 if(!sug||normMed(sug)===normMed(atual)){box.style.display='none';return}
 MED_SUG=sug;
 var h='📏 <strong>Achei estas medidas no anúncio: '+esc(sug)+'</strong><br>';
 h+='<span style="color:#9a3412">Confira na embalagem ou com a fita métrica antes de usar. A IA às vezes chuta medida, e medida errada estraga o vídeo inteiro.</span>';
 if(atual)h+='<br><span style="color:#9a3412">O campo hoje está com <strong>'+esc(atual)+'</strong> — usar vai substituir.</span>';
 h+='<div style="margin-top:8px"><button id="medok" class="btn btn-p" style="padding:6px 12px;font-size:.82rem;margin-top:0">✅ Conferi, está certo</button> ';
 h+='<button id="medno" class="btn btn-g" style="padding:6px 12px;font-size:.82rem;margin-top:0">Deixa como está</button></div>';
 box.innerHTML=h;box.style.display='block';
 document.getElementById('medok').onclick=function(){
  var e=document.getElementById('med');
  if(e){e.value=MED_SUG;e.dispatchEvent(new Event('input',{bubbles:true}))}
  box.innerHTML='✅ Você confirmou <strong>'+esc(MED_SUG)+'</strong>. Já está no campo Medidas e vai junto para o STUDIO.';
 };
 document.getElementById('medno').onclick=function(){
  box.innerHTML='Beleza — não mexi em nada. O campo Medidas continua do seu jeito.';
 };
}
/* ---- contador de tempo: mostra que esta andando, nao travado ---- */
var _TMR=null,_T0=0;
function spinFase(d){
 if(d<45)return 'Lendo o briefing e pesquisando o produto';
 if(d<120)return 'Escrevendo o anuncio de cada canal';
 if(d<200)return 'Montando o A+ da Amazon e o rich content';
 if(d<300)return 'Criando os prompts das imagens e as cenas do video';
 return 'Fechando a nota e a estrategia';
}
function mmss(d){var m=Math.floor(d/60),x=d%60;return m+':'+(x<10?'0':'')+x}
function spinOn(){
 var s=document.getElementById('spin'),f=document.getElementById('spinfim');
 if(f){f.style.display='none';f.textContent=''}
 if(!s)return;_T0=Date.now();s.style.display='block';
 function tick(){
  var d=Math.round((Date.now()-_T0)/1000);
  s.innerHTML='⏳ '+spinFase(d)+'…<br><strong style="font-size:1.15rem">'+mmss(d)+'</strong> <span style="opacity:.75">de uns 2 a 5 minutos. Pode deixar a aba aberta e ir fazer outra coisa.</span>';
 }
 tick();if(_TMR)clearInterval(_TMR);_TMR=setInterval(tick,1000);
}
function spinOff(ok){
 if(_TMR){clearInterval(_TMR);_TMR=null}
 var s=document.getElementById('spin');if(s)s.style.display='none';
 var f=document.getElementById('spinfim');
 if(f&&ok&&_T0){f.textContent='✅ Pronto em '+mmss(Math.round((Date.now()-_T0)/1000))+'.';f.style.display='block'}
}
document.getElementById('go').onclick=function(){
 if(!v('nome')){alert('Preencha ao menos o Nome do produto.');return}
 var btn=this;btn.disabled=true;spinOn();
 var out=document.getElementById('out');out.style.display='none';document.getElementById('copy').style.display='none';
 fetch('/api/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({brief:brief(),imagens:imgs.map(function(o){return{data:o.data,media:o.media}})})})
 .then(function(r){return r.json()}).then(function(j){
   btn.disabled=false;spinOff(!!j.result);
   out.style.display='block';out.textContent=j.result||('⚠️ '+(j.error||'Erro desconhecido.'));
   if(j.result){document.getElementById('copy').style.display='block';montarChips(j.imagens||[],j.cenas||[]);montarCanais(j.result);pedirMedidas(j.result);try{localStorage.setItem('ap_last',JSON.stringify({result:j.result,imagens:j.imagens||[],cenas:j.cenas||[]}))}catch(x){}}
 }).catch(function(e){btn.disabled=false;spinOff(false);out.style.display='block';out.textContent='⚠️ Falha de rede: '+e})};
document.getElementById('copy').onclick=function(){navigator.clipboard.writeText(document.getElementById('out').textContent);this.textContent='✓ Copiado';var s=this;setTimeout(function(){s.textContent='📎 Copiar'},2000)};
try{var _l=localStorage.getItem('ap_last');if(_l){var _d=JSON.parse(_l);if(_d&&_d.result){var _o=document.getElementById('out');_o.textContent=_d.result;_o.style.display='block';document.getElementById('copy').style.display='block';montarChips(_d.imagens||[],_d.cenas||[]);montarCanais(_d.result)}}}catch(x){}
document.getElementById('gostudio').onclick=function(){
 var c=document.getElementById('ct').checked;
 var d={nome:v('nome'),marca:(c?(v('marcaReal')||''):(v('marca')||'Sayonara')),sku:v('sku'),categoria:v('cat'),medidas:v('med'),peso:v('peso'),compat:c,compatCom:v('marcaOrig'),imagens:ULT.imagens||[],cenas:ULT.cenas||[],quando:new Date().toLocaleString('pt-BR')};
 var m=document.getElementById('stmsg');m.style.display='block';
 if(!d.nome&&!d.cenas.length){m.textContent='Preencha ao menos o nome do produto (ou gere o an\u00fancio) antes de enviar.';return}
 try{localStorage.setItem('db_studio_entrada',JSON.stringify(d))}catch(e){m.textContent='N\u00e3o consegui guardar os dados neste navegador.';return}
 m.textContent='Enviado. Abrindo o STUDIO...';
 window.open('/studio','_blank');
};
</script></body></html>`;
