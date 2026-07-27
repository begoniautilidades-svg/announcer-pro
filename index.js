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
- Mercado Livre: o padrao da loja e anuncio de CATALOGO - titulo de ATE 120 CARACTERES comecando pela palavra-chave mais buscada + marca + atributos + beneficio principal (use o espaco todo). Anuncio comum (so quando pedido): titulo max 60. Descricao em texto puro, sem preco/contato/link externo. Ficha tecnica completa.
- Shopee: título ~100 caracteres com sinônimos; descrição escaneável + FAQ.
- Amazon: título Marca+Modelo+Tipo+atributos, sem preço/promo/emoji; 5 bullets de benefício.
- Magalu: objetivo, marca+atributos. TikTok Shop: curto e apelativo, vídeo é o rei. Google Shopping: Marca+Produto+Atributo, GTIN importa.

IMAGENS: entregue o roteiro de 9 artes com PROMPTS prontos pra IA. A capa é fundo branco puro, sem texto. Todo prompt manda usar a FOTO REAL do produto (em anexo, quando houver) como referência e manter o produto IDÊNTICO; formato 1:1, 1200x1200.

IDENTIDADE VISUAL SAYONARA (obrigatoria em TODA imagem e video): paleta oficial ciano #2FD4E0, azul #2F64E0 e azul medio #2E9CE0, sempre sobre fundos brancos ou claros; clima visual clean e premium remetendo a agua, pureza e lar (cozinhas claras, luz natural suave, tons azuis); tipografia Montserrat quando houver texto em artes secundarias (capa sempre sem texto); logo da marca = gota d'agua com telhado de casa, slogan "onde a pureza encontra seu lar". Todo prompt de imagem e de video gerado DEVE citar essa paleta e esse clima visual.

FORMATO DA ENTREGA (markdown), adaptando profundidade ao pedido:
1. Resumo executivo + pendências [CONFIRMAR]
2. Palavras-chave (essenciais, secundárias, cauda longa, negativas)
3. ANUNCIO PRONTO POR CANAL - para CADA canal solicitado, entregue UM bloco delimitado EXATAMENTE com estes marcadores, sem alterar nem traduzir os rotulos, e sem nada entre os blocos:
[[CANAL: Mercado Livre]]
TITULO: titulo final em uma unica linha, respeitando o limite do canal, terminando com a contagem de caracteres entre parenteses
TITULO ALTERNATIVO: uma segunda opcao em uma linha
FICHA TECNICA:
Campo: valor (uma informacao por linha)
BULLETS:
- um por linha (obrigatorio na Amazon, 5 bullets; nos outros canais so quando fizer sentido)
DESCRICAO:
texto completo pronto pra colar, ja no formato e no tamanho do canal
PALAVRAS-CHAVE: separadas por virgula
ROTEIRO DO VIDEO: obrigatorio no TikTok Shop (0-3s gancho, 3-8s produto, 8-20s uso, 20-30s fecho); nos outros canais escreva "-"
OBSERVACOES DO CANAL: limites, regras e riscos especificos daquele canal
[[/CANAL]]
Repita o bloco inteiro para cada canal pedido, trocando o nome depois de CANAL:. Esses blocos sao o produto final da ferramenta - eles precisam estar completos e prontos pra colar na plataforma sem edicao.
4. (o item 3 ja cobre titulos e descricoes por canal - nao repita essas informacoes fora dos blocos)
5. Bullets, FAQ, objeções tratadas, ficha técnica, conteúdo da embalagem, avisos
6. CONTEUDO A+ DA AMAZON pronto pra colar (padrao dos melhores vendedores: modulo hero com headline forte, 3 modulos de beneficio com titulo curto + texto + sugestao de imagem, tabela comparativa com modelos da linha, FAQ visual) E CONTEUDO ADICIONAL DO CATALOGO ML (rich content: blocos de texto persuasivo + sugestoes de banner), ambos seguindo as praticas dos anuncios campeoes da categoria
7. Roteiro + prompts das 9 imagens
8. PROMPTS DE VIDEO - OBRIGATORIO EM TODOS OS MODOS, NUNCA CORTAR: prontos para a IA (Sora do proprio painel): dividir o comercial em 2 a 3 CENAS INDEPENDENTES de ate 12 segundos cada, uma por bloco separado e numerado (CENA 1, CENA 2...), cada bloco com prompt completo e autonomo pronto pra colar (produto, acao, movimento de camera, luz, estilo, sem texto na tela), indicando a duracao exata (4, 8 ou 12s) e o formato (vertical 720x1280 para Stories/Reels); ao final, a ordem de montagem das cenas para formar o video de 15-30s e 1 sugestao de trilha/ritmo. ESTILOS DAS CENAS (padrao obrigatorio): CENA 1 = APRESENTADOR FALANDO - homem brasileiro simpatico ~35 anos, uniforme polo azul (#2F64E0) com logo Sayonara (gota d'agua com telhado de casa) bordado no peito, em cozinha clara e moderna com o produto EXATAMENTE como na foto de referencia sobre a bancada; ele olha para a camera e fala em portugues brasileiro uma fala curta de venda que caiba na duracao (incluir a fala entre aspas dentro do prompt, terminando com o slogan "Sayonara - onde a pureza encontra seu lar" quando couber); sem legendas na tela. CENA 2 = PRODUTO em destaque com demonstracao de uso e close dos diferenciais. CENA 3 = LIFESTYLE - familia/casa brasileira clara usando o produto, luz natural, clima de pureza da marca
9. Nota final 0–100 + plano de melhoria
10. (se pedido completo) estrategia comercial resumida.

PRIORIDADE DE ESPACO: se a resposta ficar longa, RESUMA as secoes 5 e 6 (FAQ com menos perguntas, A+ mais enxuto) para GARANTIR que as secoes 8 (video), 9 (nota) e o bloco ===DADOS=== saiam completos. Eles nunca podem faltar.

OBRIGATORIO EM TODOS OS MODOS (inclusive Rapido): termine a resposta com uma linha contendo exatamente ===DADOS=== e, na linha seguinte, um JSON valido em UMA unica linha no formato {"imagens":["prompt completo da imagem 1","prompt da imagem 2"],"cenas":[{"seg":"8","prompt":"prompt completo da cena 1"}]} - "imagens" com ate 9 itens (minimo 3), "cenas" com 2 a 3 itens, "seg" apenas "4", "8" ou "12". Os prompts do JSON devem ser os MESMOS das secoes de imagens e video, completos e autonomos (em portugues, descrevendo produto, cena, luz, estilo). Nada depois do JSON.`;

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
    max_tokens: 24000,
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
  let r;
  if (fotos.length) {
    const fd = new FormData();
    fd.append("model", "gpt-image-1");
    fd.append("prompt", prompt);
    fd.append("size", ["1024x1024", "1024x1536", "1536x1024"].indexOf(String(body.size)) >= 0 ? String(body.size) : "1024x1024");
    fd.append("quality", env.IMAGE_QUALITY || "medium");
    for (let i = 0; i < fotos.length; i++) {
      const bin = Uint8Array.from(atob(fotos[i].data), c => c.charCodeAt(0));
      fd.append(fotos.length > 1 ? "image[]" : "image", new Blob([bin], { type: fotos[i].media }), "referencia" + i + ".png");
    }
    r = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { "authorization": "Bearer " + env.OPENAI_API_KEY },
      body: fd
    });
  } else {
    r = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: { "authorization": "Bearer " + env.OPENAI_API_KEY, "content-type": "application/json" },
      body: JSON.stringify({ model: "gpt-image-1", prompt, size: ["1024x1024", "1024x1536", "1536x1024"].indexOf(String(body.size)) >= 0 ? String(body.size) : "1024x1024", quality: env.IMAGE_QUALITY || "medium" })
    });
  }
  if (!r.ok) {
    const t = await r.text();
    return json({ error: "Erro da API da OpenAI (" + r.status + "): " + t.slice(0, 500) }, 502);
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
  let r = await fetch("https://api.openai.com/v1/videos", { method: "POST", headers: auth, body: fd });
  if (!r.ok) {
    const t = await r.text();
    return json({ error: "Erro da API da OpenAI (" + r.status + "): " + t.slice(0, 500) }, 502);
  }
  let job = await r.json();
  for (let i = 0; i < 100; i++) {
    if (job.status === "completed") break;
    if (job.status === "failed") {
      return json({ error: "Geracao do video falhou: " + ((job.error && job.error.message) || "erro desconhecido") }, 502);
    }
    await new Promise(function (res) { setTimeout(res, 5000); });
    r = await fetch("https://api.openai.com/v1/videos/" + job.id, { headers: auth });
    if (!r.ok) {
      const t = await r.text();
      return json({ error: "Erro ao consultar o video (" + r.status + "): " + t.slice(0, 300) }, 502);
    }
    job = await r.json();
  }
  if (job.status !== "completed") return json({ error: "Tempo esgotado. Tente de novo em alguns minutos." }, 504);
  const vr = await fetch("https://api.openai.com/v1/videos/" + job.id + "/content", { headers: auth });
  if (!vr.ok) {
    const t = await vr.text();
    return json({ error: "Erro ao baixar o video (" + vr.status + "): " + t.slice(0, 300) }, 502);
  }
  const bufv = await vr.arrayBuffer();
  const bytes = new Uint8Array(bufv);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 8192) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
  return json({ video: btoa(bin) });
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
    if (url.pathname === "/api/image" && request.method === "POST") {
      return handleImage(request, env);
    }
    if (url.pathname === "/api/video" && request.method === "POST") {
      return handleVideo(request, env);
    }
    if (url.pathname === "/api/fix" && request.method === "POST") {
      return handleFix(request, env);
    }
    if (url.pathname === "/api/sku" && request.method === "GET") {
      return handleSku(request);
    }
    if (url.pathname === "/api/arquivar" && request.method === "POST") {
      return handleArquivar(request);
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
<p>Passo a passo: preencha à esquerda → 1 Gerar anúncio → 2 Imagens → 3 Vídeo. Marca oficial: Sayonara.</p></div></header>
<div class="container">
<div>
 <div class="card"><h2>1 · O que vamos fazer?</h2>
  <div class="chips" id="modo"><div class="chip on" data-v="Criar anúncio novo">Criar novo</div><div class="chip" data-v="Otimizar existente">Otimizar</div><div class="chip" data-v="Replicar em outra cor/variação">Replicar cor</div><div class="chip" data-v="Adaptar para outro canal">Adaptar canal</div></div></div>
 <div class="card"><h2>1.5 · Buscar da minha planilha</h2>
  <p class="hint">Digite o SKU e eu puxo nome, marca, custo, preço e margem direto do seu PAINEL no Drive.</p>
  <div class="g2"><div class="field"><label>SKU</label><input id="sku" placeholder="FER-0053"></div><div class="field"><label>&nbsp;</label><button id="bsku" class="btn btn-p" style="width:100%">🔎 Buscar na planilha</button></div></div>
  <div id="skuout" style="display:none;font-size:.85rem;background:#f0fdfa;border:1px solid #99f6e4;border-radius:8px;padding:8px;margin-top:8px"></div>
  <details style="margin-top:10px"><summary style="cursor:pointer;font-size:.85rem;color:var(--muted)">⚙️ Configurar o link da planilha (só uma vez)</summary>
   <p class="hint" style="margin-top:8px">Na sua planilha PAINEL: <strong>Arquivo → Compartilhar → Publicar na web → escolha CSV → Publicar</strong>. Copie o link que aparecer e cole aqui.</p>
   <div class="field"><input id="csvurl" placeholder="https://docs.google.com/spreadsheets/d/e/..../pub?output=csv"></div>
   <button id="bcsv" class="btn btn-g" style="margin-top:6px">Salvar link</button></details></div>
 <div class="card"><h2>2 · Fotos reais do produto <span class="req">*</span></h2><p class="hint">Até 4 fotos (ângulos diferentes ajudam). Elas garantem que as imagens geradas fiquem idênticas ao seu produto.</p>
  <label class="imgbtn" for="img">📷 <strong>Importar fotos (até 4)</strong></label><input id="img" type="file" accept="image/*" multiple hidden><div class="thumbs" id="thumbs"></div></div>
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
 <div class="card"><h2>5 · Detalhes extras (opcional)</h2><p class="hint">Tudo ajuda a vender melhor: uso, público, links de referência.</p><textarea id="desc" placeholder="Tudo que souber do produto, uso, público..."></textarea>
  <div class="g2" style="margin-top:10px"><div class="field"><label>Meu anúncio atual (p/ otimizar)</label><input id="linkMeu" placeholder="https://..."></div><div class="field"><label>Produto similar (base)</label><input id="linkSim" placeholder="https://..."></div></div></div>
 <div class="card"><h2>6 · Canais e profundidade</h2>
  <label>Canais</label><div class="chips" id="canais" style="margin-bottom:12px"><div class="chip on" data-v="Mercado Livre">Mercado Livre</div><div class="chip" data-v="Shopee">Shopee</div><div class="chip" data-v="Amazon">Amazon</div><div class="chip" data-v="Magalu">Magalu</div><div class="chip" data-v="TikTok Shop">TikTok Shop</div><div class="chip" data-v="Google Shopping">Google Shopping</div></div>
  <label>Profundidade</label><div class="chips" id="prof"><div class="chip on" data-v="Pacote completo">Completo</div><div class="chip" data-v="Rápido">Rápido</div></div></div>
</div>
<div class="side">
 <div class="card"><h2>✨ 1 · Gerar anúncio</h2><p class="hint">Preencha à esquerda e clique. O texto sai aqui e os prompts entram sozinhos nos passos 2 e 3. O último anúncio fica salvo neste navegador — ao reabrir o site, os prompts voltam sozinhos.</p>
  <button class="btn btn-p" id="go">🚀 Gerar anúncio</button>
  <div class="spin" id="spin">⏳ Criando o anúncio completo… pode levar 2 a 5 min. Não feche a página.</div>
  <div id="out" style="display:none"></div>
  <button class="btn btn-g" id="copy" style="display:none">📎 Copiar tudo</button></div>
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
 <div class="card"><h2>🎨 2 · Gerar imagem</h2><p class="hint">Clique numa imagem abaixo (o prompt entra sozinho) e gere. Usa a foto do passo 2 como referência. (~R$0,25/imagem)</p>
  <div class="chips" id="ichips" style="margin-bottom:8px"></div>
  <textarea id="iprompt" placeholder="Gere o anúncio no passo 1 — os prompts aparecem aqui. Ou cole um prompt seu."></textarea>
  <button class="btn btn-p" id="goimg" style="margin-top:8px">🎨 Gerar imagem</button>
  <div class="spin" id="ispin">⏳ Gerando imagem… pode levar ~1 min.</div>
  <div id="iout" style="display:none;margin-top:10px"><img id="iimg" style="max-width:100%;border-radius:10px;border:1px solid var(--line)"><a id="idl" class="btn btn-g" style="text-decoration:none;display:block;text-align:center" download="imagem-anuncio.png">⬇️ Baixar imagem</a>
   <label style="margin-top:10px">🔧 Não ficou boa? Diga o que mudar:</label><textarea id="ifix" style="min-height:48px" placeholder="Ex.: fundo mais claro, tira o texto, produto maior..."></textarea>
   <button class="btn btn-g" id="goifix">🔧 Corrigir e gerar de novo</button></div></div>
 <div class="card"><h2>🎬 3 · Gerar vídeo (Sora)</h2><p class="hint">Clique numa cena (o prompt entra sozinho), escolha o estilo, suba as fotos reais (uma de cada produto), veja a prévia barata, corrija o que estiver errado e só então gere o vídeo. (4s ~R$2 · 12s ~R$6)</p>
  <div class="chips" id="vchips" style="margin-bottom:8px"></div>
  <label>Estilo do vídeo</label><div class="chips" id="vstyle" style="margin-bottom:8px"><div class="chip on" data-v="produto">📦 Produto</div><div class="chip" data-v="apresentador">🧑‍💼 Apresentador falando</div><div class="chip" data-v="lifestyle">🏠 Lifestyle</div></div>
  <label class="imgbtn" for="vimgIn" style="padding:10px;margin-bottom:8px;display:block">📷 <strong>Fotos reais</strong> (até 4 — ex.: 1 do purificador + 1 do refil)</label><input id="vimgIn" type="file" accept="image/*" multiple hidden><div class="thumbs" id="vthumbs" style="margin:0 0 8px"></div>
  <textarea id="vprompt" placeholder="Gere o anúncio no passo 1 — as cenas aparecem aqui."></textarea>
  <div class="g2" style="margin-top:8px"><div class="field"><label>Duração</label><select id="vsec"><option value="4">4 segundos</option><option value="8">8 segundos</option><option value="12">12 segundos (max. da IA)</option></select></div><div class="field"><label>Formato</label><select id="vsize"><option value="720x1280">Vertical (Stories/Reels)</option><option value="1280x720">Horizontal</option></select></div></div>
  <button class="btn btn-g" id="goprev" style="margin-top:0">👁️ Prévia da cena (imagem ~R$0,25)</button>
  <div class="spin" id="pspin">⏳ Gerando prévia…</div>
  <div id="pout" style="display:none;margin-top:8px;text-align:center"><img id="pimg" style="max-width:70%;border-radius:10px;border:1px solid var(--line)">
   <label style="margin-top:10px;text-align:left">🔧 Não ficou boa? Diga o que mudar (eu viro prompt):</label><textarea id="pfix" style="min-height:56px" placeholder="Ex.: o refil ficou maior que o purificador. O refil é um cartucho pequeno, cabe na mão; o purificador é bem maior. Tira o texto errado do produto."></textarea>
   <button class="btn btn-g" id="gopfix">🔧 Corrigir e gerar prévia de novo</button>
   <label class="imgbtn" for="vimgIn" style="padding:8px;margin-top:8px;display:block">➕ Mandar mais uma foto real (ajuda a acertar tamanho e detalhes)</label></div>
  <button class="btn btn-p" id="govid" style="margin-top:8px">🎬 Gerar vídeo</button>
  <div class="spin" id="vspin">⏳ Gerando vídeo… pode levar até 5 min. Não feche a página.</div>
  <div id="vout" style="display:none;margin-top:10px"><video id="vvid" controls style="max-width:100%;border-radius:10px;border:1px solid var(--line)"></video><a id="vdl" class="btn btn-g" style="text-decoration:none;display:block;text-align:center" download="video-anuncio.mp4">⬇️ Baixar vídeo</a>
   <label style="margin-top:10px">🔧 Não ficou bom? Diga o que mudar:</label><textarea id="vfix" style="min-height:48px" placeholder="Ex.: câmera mais lenta, cozinha mais clara..."></textarea>
   <button class="btn btn-g" id="govfix">🔧 Corrigir prompt da cena</button></div></div>
</div>
<script>
var imgs=[];
function cg(id,m){var g=document.getElementById(id);g.onclick=function(e){var c=e.target.closest('.chip');if(!c)return;if(m)c.classList.toggle('on');else{[].forEach.call(g.children,function(x){x.classList.remove('on')});c.classList.add('on')}}}
cg('modo',0);cg('canais',1);cg('prof',0);cg('vstyle',0);
function estiloVid(p){var s=one('vstyle');
 if(s==='apresentador')return p+' ESTILO APRESENTADOR: homem brasileiro simpatico, ~35 anos, vestindo uniforme polo azul (#2F64E0) com logo da Sayonara (gota d\'agua com telhado de casa) bordado no peito, em cozinha clara e moderna, com o produto EXATAMENTE como na foto de referencia sobre a bancada (nao alterar o produto). Ele olha para a camera e fala em portugues brasileiro, tom confiante e amigavel, apresentando o produto, e termina com: "Sayonara - onde a pureza encontra seu lar." Iluminacao natural suave, camera frontal estavel. Sem legendas ou textos na tela.';
 if(s==='lifestyle')return p+' ESTILO LIFESTYLE: cena real de casa brasileira clara e aconchegante, familia usando o produto no dia a dia, luz natural suave, tons brancos com detalhes em ciano (#2FD4E0), clima de pureza e bem-estar, sem textos na tela.';
 return p}
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
 [['Categoria','cat'],['Cor/Variação','cor'],['Preço','preco'],['Voltagem','volt'],['Capacidade/Potência','cap'],['EAN/GTIN','ean'],['Medidas','med'],['Peso','peso'],['Garantia','gar'],['Diferenciais','dif'],['INMETRO','inmetro']].forEach(function(p){var val=v(p[1]);if(val)t+=p[0]+': '+val+'\n'});
 if(c){t+='\nPRODUTO COMPATÍVEL: aplicar Regra de Ouro. Marca real: '+(v('marcaReal')||'[CONFIRMAR]')+'. Compatível com: '+(v('marcaOrig')||'[CONFIRMAR]')+'. Nunca usar "original" para o produto.\n'}
 var d=v('desc');if(d)t+='\nObservações: '+d+'\n';
 var lm=v('linkMeu'),ls=v('linkSim');if(lm)t+='\nMeu anúncio: '+lm;if(ls)t+='\nSimilar base: '+ls;
 if(!imgs.length)t+='\n(Sem imagem anexada — descreva a aparência ou marque [CONFIRMAR].)';
 return t}
function montarChips(imgs,cenas){
 var ic=document.getElementById('ichips');ic.innerHTML='';
 imgs.forEach(function(p,i){var d=document.createElement('div');d.className='chip';d.textContent='Imagem '+(i+1);d.onclick=function(){document.getElementById('iprompt').value=p;[].forEach.call(ic.children,function(x){x.classList.remove('on')});d.classList.add('on')};ic.appendChild(d)});
 var vc=document.getElementById('vchips');vc.innerHTML='';
 cenas.forEach(function(c,i){var d=document.createElement('div');d.className='chip';d.textContent='Cena '+(i+1)+' ('+c.seg+'s)';d.onclick=function(){document.getElementById('vprompt').value=c.prompt;var sl=document.getElementById('vsec');if(['4','8','12'].indexOf(c.seg)>-1)sl.value=c.seg;[].forEach.call(vc.children,function(x){x.classList.remove('on')});d.classList.add('on')};vc.appendChild(d)});
 if(ic.children.length){ic.children[0].click()}
 if(vc.children.length){vc.children[0].click()}
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
 b.innerHTML='Enviando para o Drive…';btn.disabled=true;
 fetch('/api/arquivar',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({destino:u,sku:v('sku')||'SEM-SKU',produto:v('nome')||'Produto',canais:canais,completo:document.getElementById('out').textContent||''})})
 .then(function(r){return r.json()}).then(function(j){btn.disabled=false;
  if(j.error){b.innerHTML='⚠️ '+esc(j.error);return}
  var h='✅ Arquivado em <strong>'+esc(j.pasta||'Drive')+'</strong>';
  if(j.link)h+=' — <a href="'+esc(j.link)+'" target="_blank">abrir pasta</a>';
  if(j.arquivos&&j.arquivos.length)h+='<br>'+j.arquivos.map(esc).join('<br>');
  b.innerHTML=h}).catch(function(e){btn.disabled=false;b.innerHTML='⚠️ Falha: '+esc(e)})};
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
  if(j.preco)document.getElementById('preco').value=j.preco;
  var h='✅ <strong>'+esc(j.sku)+'</strong> — '+esc(j.nome)+'<br>Custo <strong>R$ '+esc(j.custo||'?')+'</strong> · Venda <strong>R$ '+esc(j.preco||'?')+'</strong> · Margem <strong>R$ '+esc(j.margem||'?')+'</strong>'+(j.pct?' ('+esc(j.pct)+')':'');
  if(j.obs)h+='<br>Obs.: '+esc(j.obs);
  h+='<br><span style="color:#64748b">Nome, marca e preço já foram preenchidos abaixo. O custo fica só aqui na tela — não vai para o texto do anúncio.</span>';
  box.innerHTML=h;
 }).catch(function(e){box.innerHTML='⚠️ Falha de rede: '+esc(e)})};
document.getElementById('go').onclick=function(){
 if(!v('nome')){alert('Preencha ao menos o Nome do produto.');return}
 var btn=this;btn.disabled=true;document.getElementById('spin').style.display='block';
 var out=document.getElementById('out');out.style.display='none';document.getElementById('copy').style.display='none';
 fetch('/api/generate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({brief:brief(),imagens:imgs.map(function(o){return{data:o.data,media:o.media}})})})
 .then(function(r){return r.json()}).then(function(j){
   btn.disabled=false;document.getElementById('spin').style.display='none';
   out.style.display='block';out.textContent=j.result||('⚠️ '+(j.error||'Erro desconhecido.'));
   if(j.result){document.getElementById('copy').style.display='block';montarChips(j.imagens||[],j.cenas||[]);montarCanais(j.result);try{localStorage.setItem('ap_last',JSON.stringify({result:j.result,imagens:j.imagens||[],cenas:j.cenas||[]}))}catch(x){}}
 }).catch(function(e){btn.disabled=false;document.getElementById('spin').style.display='none';out.style.display='block';out.textContent='⚠️ Falha de rede: '+e})};
document.getElementById('goimg').onclick=function(){
 var p=v('iprompt');if(!p){alert('Cole o prompt da imagem primeiro.');return}
 var btn=this;btn.disabled=true;document.getElementById('ispin').style.display='block';document.getElementById('iout').style.display='none';
 fetch('/api/image',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({prompt:p,imagens:imgs.map(function(o){return{data:o.data,media:o.media}})})})
 .then(function(r){return r.json()}).then(function(j){
  btn.disabled=false;document.getElementById('ispin').style.display='none';
  if(j.image){var u='data:image/png;base64,'+j.image;document.getElementById('iimg').src=u;document.getElementById('idl').href=u;document.getElementById('iout').style.display='block'}
  else{alert(j.error||'Erro desconhecido.')}
 }).catch(function(e){btn.disabled=false;document.getElementById('ispin').style.display='none';alert('Falha de rede: '+e)});
};
var vimgs=[];
var vin=document.getElementById('vimgIn'),vth=document.getElementById('vthumbs');
function vRender(){vth.innerHTML=vimgs.map(function(o,i){return '<div class="thumb"><img src="'+o.url+'"><span data-x="'+i+'">×</span></div>'}).join('')}
vin.onchange=function(){[].forEach.call(vin.files,function(f){if(vimgs.length>=4)return;var r=new FileReader();r.onload=function(){vimgs.push({data:r.result.split(',')[1],media:f.type,url:r.result});vRender()};r.readAsDataURL(f)});vin.value='';};
vth.onclick=function(e){if(e.target.dataset&&e.target.dataset.x!==undefined&&e.target.dataset.x!==''){vimgs.splice(Number(e.target.dataset.x),1);vRender()}};
function refLista(){var a=vimgs.length?vimgs:imgs;return a.slice(0,4).map(function(o){return{data:o.data,media:o.media}})}
function escala(p){var n=refLista().length;if(!n)return p;
 var t=p+' FIDELIDADE AO PRODUTO: reproduza o(s) produto(s) EXATAMENTE como nas fotos de referencia - mesmo formato, mesmas cores, mesma marca e mesmos textos do rotulo (nao invente nem distorca letras).';
 if(n>1)t+=' Sao '+n+' produtos diferentes nas referencias: respeite o TAMANHO REAL e a PROPORCAO entre eles (o refil/cartucho e bem menor que o purificador, cabe na mao). Nunca aumente o item menor nem encolha o maior.';
 else t+=' Mantenha a escala real do produto em relacao a pessoa e ao ambiente.';
 return t}
function refVideo(cb){var ref=vimgs[0]||imgs[0];if(!ref){cb(null);return}var dims=v('vsize')==='1280x720'?[1280,720]:[720,1280];var im=new Image();im.onload=function(){var c=document.createElement('canvas');c.width=dims[0];c.height=dims[1];var x=c.getContext('2d');x.fillStyle='#ffffff';x.fillRect(0,0,c.width,c.height);var e=Math.min(c.width/im.width,c.height/im.height);var nw=im.width*e,nh=im.height*e;x.drawImage(im,(c.width-nw)/2,(c.height-nh)/2,nw,nh);cb(c.toDataURL('image/png').split(',')[1])};im.onerror=function(){cb(null)};im.src=ref.url}
document.getElementById('govid').onclick=function(){
 var p=v('vprompt');if(!p){alert('Escolha uma cena ou cole o prompt primeiro.');return}
 var btn=this;btn.disabled=true;document.getElementById('vspin').style.display='block';document.getElementById('vout').style.display='none';
 refVideo(function(b64){
 fetch('/api/video',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({prompt:escala(estiloVid(p)),seconds:v('vsec'),size:v('vsize'),imageBase64:b64,mediaType:b64?'image/png':null})})
 .then(function(r){return r.json()}).then(function(j){
  btn.disabled=false;document.getElementById('vspin').style.display='none';
  if(j.video){var u='data:video/mp4;base64,'+j.video;document.getElementById('vvid').src=u;document.getElementById('vdl').href=u;document.getElementById('vout').style.display='block'}
  else{alert(j.error||'Erro desconhecido.')}
 }).catch(function(e){btn.disabled=false;document.getElementById('vspin').style.display='none';alert('Falha de rede: '+e)});
 });
};
document.getElementById('goprev').onclick=function(){
 var p=v('vprompt');if(!p){alert('Escolha uma cena ou cole o prompt primeiro.');return}
 var btn=this;btn.disabled=true;document.getElementById('pspin').style.display='block';document.getElementById('pout').style.display='none';
 var rd=refLista();var sz=v('vsize')==='1280x720'?'1536x1024':'1024x1536';
 fetch('/api/image',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({prompt:escala(estiloVid(p))+' (quadro estatico do video, sem texto na imagem)',size:sz,imagens:rd})})
 .then(function(r){return r.json()}).then(function(j){
  btn.disabled=false;document.getElementById('pspin').style.display='none';
  if(j.image){document.getElementById('pimg').src='data:image/png;base64,'+j.image;document.getElementById('pout').style.display='block'}
  else{alert(j.error||'Erro desconhecido.')}
 }).catch(function(e){btn.disabled=false;document.getElementById('pspin').style.display='none';alert('Falha de rede: '+e)});
};
function corrigir(tipo,campoPrompt,campoFix,btn,rotulo,depois){
 var p=v(campoPrompt),a=v(campoFix);if(!a){alert('Escreva o que quer mudar.');return}
 btn.disabled=true;btn.textContent='⏳ Reescrevendo...';
 fetch('/api/fix',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({tipo:tipo,prompt:p,ajuste:a})})
 .then(function(r){return r.json()}).then(function(j){
  btn.disabled=false;btn.textContent=rotulo;
  if(j.prompt){document.getElementById(campoPrompt).value=j.prompt;document.getElementById(campoFix).value='';if(depois)depois()}
  else{alert(j.error||'Erro desconhecido.')}
 }).catch(function(e){btn.disabled=false;btn.textContent=rotulo;alert('Falha de rede: '+e)});
}
document.getElementById('goifix').onclick=function(){corrigir('imagem','iprompt','ifix',this,'\ud83d\udd27 Corrigir e gerar de novo',function(){document.getElementById('goimg').click()})};
document.getElementById('govfix').onclick=function(){corrigir('video','vprompt','vfix',this,'\ud83d\udd27 Corrigir prompt da cena',null)};
document.getElementById('gopfix').onclick=function(){corrigir('video','vprompt','pfix',this,'\ud83d\udd27 Corrigir e gerar prévia de novo',function(){document.getElementById('goprev').click()})};
document.getElementById('copy').onclick=function(){navigator.clipboard.writeText(document.getElementById('out').textContent);this.textContent='✓ Copiado';var s=this;setTimeout(function(){s.textContent='📎 Copiar'},2000)};
try{var _l=localStorage.getItem('ap_last');if(_l){var _d=JSON.parse(_l);if(_d&&_d.result){var _o=document.getElementById('out');_o.textContent=_d.result;_o.style.display='block';document.getElementById('copy').style.display='block';montarChips(_d.imagens||[],_d.cenas||[]);montarCanais(_d.result)}}}catch(x){}
</script></body></html>`;
