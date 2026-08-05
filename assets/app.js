/* =========================================================
   app.js  —  画面の組み立て
   ハッシュ（#/fever など）で表示を切り替える単純なSPA。
   ビルド不要・外部ライブラリなしで GitHub Pages にそのまま置けます。
   ========================================================= */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

const refById  = id => REFERENCES.find(r => r.id === id);
const drugById = id => DRUGS.find(d => d.id === id);

/* ---------- 体重（用量計算のもと） ---------- */
const WT_KEY = "pedi.weight";
let weight = parseFloat(localStorage.getItem(WT_KEY)) || null;

function setWeight(v){
  weight = (v && v > 0 && v < 120) ? v : null;
  if (weight) localStorage.setItem(WT_KEY, String(weight));
  else localStorage.removeItem(WT_KEY);
  render();
}

const r1 = n => Math.round(n * 10) / 10;
const fmt = n => (n >= 100 ? Math.round(n) : r1(n));

/* 薬剤1件を用量つきで描画 */
function drugBlock(entry){
  if (entry.free){
    return `<div class="drug">
      <div class="hd"><span class="nm">${esc(entry.free)}</span></div>
      <p style="margin:6px 0 0;font-size:13.5px;color:var(--ink-2)">${esc(entry.note || "")}</p>
      ${refChips(entry.refs)}
    </div>`;
  }
  const d = drugById(entry.drug);
  if (!d) return "";

  let dose = "";
  if (d.kind === "perDose"){
    const [a,b] = d.perKg;
    const range = a === b ? `${a}` : `${a}〜${b}`;
    dose = `<div>1回 ${range} ${d.unit}/kg　${esc(d.interval || "")}</div>`;
    if (weight){
      const lo = fmt(a*weight), hi = fmt(b*weight);
      let calc = a === b ? `${lo} ${d.unit}` : `${lo}〜${hi} ${d.unit}`;
      let over = (d.maxPerDose && b*weight > d.maxPerDose)
        ? `<span class="hint">（1回上限 ${d.maxPerDose}${d.unit} を超えるため上限で頭打ち）</span>` : "";
      dose += `<div>→ ${weight}kg なら <span class="calc">1回 ${calc}</span> ${over}</div>`;
      if (d.maxPerDayPerKg){
        dose += `<div class="hint">1日総量の上限 ${fmt(d.maxPerDayPerKg*weight)} ${d.unit}/日（${d.maxPerDayPerKg}${d.unit}/kg/日）</div>`;
      }
    }
  } else if (d.kind === "perDay"){
    const [a,b] = d.perKg;
    const range = a === b ? `${a}` : `${a}〜${b}`;
    dose = `<div>1日 ${range} ${d.unit}/kg　${esc(d.divide || "")}</div>`;
    if (d.perKgHigh){
      const [ha,hb] = d.perKgHigh;
      dose += `<div>高用量 1日 ${ha === hb ? ha : ha+"〜"+hb} ${d.unit}/kg</div>`;
    }
    if (weight){
      const lo = fmt(a*weight), hi = fmt(b*weight);
      let calc = a === b ? `${lo} ${d.unit}/日` : `${lo}〜${hi} ${d.unit}/日`;
      dose += `<div>→ ${weight}kg なら <span class="calc">${calc}</span></div>`;
      if (d.perKgHigh){
        const [ha,hb] = d.perKgHigh;
        const hlo = fmt(ha*weight), hhi = fmt(hb*weight);
        dose += `<div>→ 高用量なら <span class="calc">${ha===hb ? hlo : hlo+"〜"+hhi} ${d.unit}/日</span></div>`;
      }
      if (d.maxPerDay && b*weight > d.maxPerDay){
        dose += `<div class="hint">1日上限 ${d.maxPerDay}${d.unit} を超える計算になります。上限で頭打ちにしてください。</div>`;
      }
    }
  } else { /* fixed */
    dose = d.bands.map(b => `<div>${esc(b.label)}：${esc(b.dose)}</div>`).join("");
  }

  if (!weight && d.kind !== "fixed"){
    dose += `<div class="hint">上の「体重」を入れると実際の mg を計算します</div>`;
  }

  return `<div class="drug">
    <div class="hd">
      <span class="nm">${esc(d.name)}</span>
      ${d.brand && d.brand !== "—" ? `<span class="br">${esc(d.brand)}</span>` : ""}
    </div>
    <div class="dose">${dose}</div>
    ${entry.note ? `<p style="margin:0 0 6px;font-size:13.5px;color:var(--ink-2)">${esc(entry.note)}</p>` : ""}
    ${d.points?.length ? `<ul>${d.points.map(p=>`<li>${esc(p)}</li>`).join("")}</ul>` : ""}
    ${d.forms?.length ? `<div style="font-size:12px;color:var(--ink-3);margin-top:6px">剤形：${d.forms.map(esc).join(" / ")}</div>` : ""}
    ${d.caution ? `<div class="warn">${esc(d.caution)}</div>` : ""}
    ${refChips([...(d.refs||[]), ...(entry.refs||[])])}
  </div>`;
}

/* 出典バッジ */
function refChips(ids){
  if (!ids || !ids.length) return "";
  const uniq = [...new Set(ids)];
  return `<div class="refbar">` + uniq.map(id => {
    const r = refById(id);
    if (!r) return "";
    return `<a class="refchip ${r.status === "check" ? "check" : ""}" href="#/refs/${r.id}">${esc(r.title)}${r.status==="check" ? " ⚠︎版要確認" : ""}</a>`;
  }).join("") + `</div>`;
}

function sec(cls, no, title, inner){
  return `<section class="sec ${cls}">
    <h2><span class="no">${no}</span>${esc(title)}</h2>
    <div class="body">${inner}</div>
  </section>`;
}
const ul = arr => `<ul>${arr.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>`;

/* ---------- 症候ページ ---------- */
function viewSymptom(s){
  const ddx = `<div class="ddx">${s.ddx.map(d => `
    <div class="row">
      <span class="pill ${d.level}">${d.level === "mustnot" ? "見逃し厳禁" : d.level === "common" ? "よくある" : "まれ"}</span>
      <span class="nm">${esc(d.name)}</span>
      <span class="cl">${esc(d.clue || "")}</span>
    </div>`).join("")}</div>`;

  const tests = s.tests.map(t => `
    <div class="test-item">
      <b>${esc(t.name)}</b>
      <div class="when">出すのは：${esc(t.when)}</div>
      ${t.caveat ? `<div class="cav">${esc(t.caveat)}</div>` : ""}
    </div>`).join("");

  return `
  <p class="eyebrow">${esc(s.group)}</p>
  <h1 class="title">${esc(s.name)}${s.status === "draft" ? `<span class="status-draft">骨組み・要加筆</span>` : ""}</h1>
  <p class="lede">${esc(s.lede)}</p>

  ${sec("red","01","まず見逃さない（レッドフラグ）", ul(s.red))}

  <section class="sec">
    <h2><span class="no">02</span>問診と身体所見</h2>
    <div class="two">
      <div><h3>問診で聞く</h3>${ul(s.history)}</div>
      <div><h3>所見を取る</h3>${ul(s.exam)}</div>
    </div>
  </section>

  ${sec("test","03","検査 — 何のために出すか、何が分からないか", tests)}
  ${sec("","04","鑑別診断", ddx)}
  ${sec("","05","処方", s.rx.map(drugBlock).join(""))}

  ${sec("talk","06","保護者への説明",
      `<p class="quote">${esc(s.talk.summary)}</p>
       ${s.talk.points.length ? `<h3 style="font-size:11px;letter-spacing:.14em;color:var(--ink-3);margin:0 0 6px">伝える内容</h3>${ul(s.talk.points)}` : ""}
       <h3 style="font-size:11px;letter-spacing:.14em;color:var(--ink-3);margin:16px 0 6px">こうなったらすぐ受診（そのまま読み上げ可）</h3>
       ${ul(s.talk.return)}`)}

  ${sec("refer","07","外来で抱えない — 紹介・搬送の基準",
      `${s.refer.now.length ? `<h3 style="font-size:11px;letter-spacing:.14em;color:var(--shu);margin:0 0 6px">即日・救急で送る</h3>${ul(s.refer.now)}` : ""}
       ${s.refer.consider.length ? `<h3 style="font-size:11px;letter-spacing:.14em;color:var(--yamabuki);margin:16px 0 6px">紹介を検討する</h3>${ul(s.refer.consider)}` : ""}`)}

  ${sec("","08","この項目の出典", refChips(s.refs) || "<p>（未設定）</p>")}

  <div class="disclaimer">
    <b>使う前に</b>
    ここに書かれた用量・方針は外来でよく使う目安をまとめた学習用の要約です。処方の前に必ず添付文書と各ガイドラインの原文を確認してください。ガイドラインは改訂されます。「出典」の版が最新かどうかを Minds や学会サイトで確かめる習慣をつけてください。
  </div>`;
}

/* ---------- 出典ページ ---------- */
function viewRefs(focusId){
  const cards = REFERENCES.map(r => `
    <div class="refcard" id="ref-${r.id}" ${focusId===r.id ? 'style="border-color:var(--ink);box-shadow:var(--shadow)"' : ""}>
      <h3>${esc(r.title)}</h3>
      <div class="meta">${esc(r.org)}　/　${esc(r.year)}</div>
      <div style="margin-bottom:9px">
        <span class="tag ${r.access==="free"?"free":"book"}">${r.access==="free"?"無料で読める":"書籍・有料"}</span>
        ${r.status==="check" ? `<span class="tag chk">版を要確認</span>` : ""}
      </div>
      <p>${esc(r.note)}</p>
      <a href="${esc(r.url)}" target="_blank" rel="noopener">公式ページを開く ↗</a>
      ${(r.extra||[]).map(e => `<a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.label)} ↗</a>`).join("")}
    </div>`).join("");

  return `
  <p class="eyebrow">REFERENCES</p>
  <h1 class="title">参照したガイドライン</h1>
  <p class="lede">各症候ページの下部にあるバッジからここに飛べます。「版を要確認」が付いているものは、私が発行年を確定できなかった資料です。使う前に Minds か学会サイトで最新版かどうかを確認してください。</p>
  ${cards}
  <div class="disclaimer">
    <b>版の確認を習慣に</b>
    ガイドラインは数年おきに改訂されます。このアプリの内容は作成時点のものです。臨床判断は必ず最新版の原文に基づいて行ってください。
  </div>`;
}

/* ---------- 検索 ---------- */
function searchAll(q){
  const t = q.trim();
  if (!t) return "";
  const hits = [];
  SYMPTOMS.forEach(s => {
    const blob = JSON.stringify(s);
    if (blob.includes(t) || s.kana.includes(t)){
      // 最初にヒットした短い断片を文脈として拾う
      const fields = [...s.red, ...s.history, ...s.exam,
                      ...s.ddx.map(d=>d.name+" "+(d.clue||"")),
                      ...s.talk.points, ...s.talk.return,
                      ...s.refer.now, ...s.refer.consider];
      const ctx = fields.find(f => f.includes(t)) || s.lede;
      hits.push({ id:s.id, name:s.name, ctx });
    }
  });
  if (!hits.length) return `<p class="empty">「${esc(t)}」に一致する項目は見つかりませんでした。</p>`;
  return `<ul class="hits">${hits.map(h => `
    <li>
      <a href="#/${h.id}">${esc(h.name)}</a>
      <span class="ctx">${esc(h.ctx).replace(new RegExp(esc(t),"g"), m=>`<mark>${m}</mark>`)}</span>
    </li>`).join("")}</ul>`;
}

/* ---------- サイド ---------- */
function rail(activeId){
  const groups = {};
  SYMPTOMS.forEach(s => (groups[s.group] ||= []).push(s));
  let html = "";
  Object.entries(groups).forEach(([g, list]) => {
    html += `<h4>${esc(g)}</h4>`;
    html += list.map(s => `
      <a href="#/${s.id}" class="${s.id===activeId?"on":""}">
        <span>${esc(s.name)}</span>
        ${s.status==="draft" ? `<span class="tick">骨組み</span>` : ""}
      </a>`).join("");
  });
  html += `<h4>資料</h4><a href="#/refs" class="${activeId==="refs"?"on":""}"><span>参照ガイドライン一覧</span></a>`;
  return html;
}

/* ---------- ルーティング ---------- */
function render(){
  const hash = location.hash.replace(/^#\/?/, "");
  const q = $("#q").value;

  let activeId = hash.split("/")[0] || SYMPTOMS[0].id;
  let html;

  if (q.trim()){
    html = `<p class="eyebrow">SEARCH</p><h1 class="title">「${esc(q.trim())}」の検索結果</h1>` + searchAll(q);
    activeId = "";
  } else if (hash.startsWith("refs")){
    activeId = "refs";
    html = viewRefs(hash.split("/")[1]);
  } else {
    const s = SYMPTOMS.find(x => x.id === activeId) || SYMPTOMS[0];
    activeId = s.id;
    html = viewSymptom(s);
  }

  $("main").innerHTML = html;
  $("#rail").innerHTML = rail(activeId);

  // 体重入力の見た目を同期
  const wi = $("#weight");
  if (document.activeElement !== wi) wi.value = weight ?? "";

  if (hash.startsWith("refs/")){
    const el = document.getElementById("ref-" + hash.split("/")[1]);
    if (el) el.scrollIntoView({ behavior:"smooth", block:"center" });
  } else {
    window.scrollTo({ top:0 });
  }
}

/* ---------- 起動 ---------- */
window.addEventListener("hashchange", () => { $("#q").value = ""; render(); });
document.addEventListener("DOMContentLoaded", () => {
  $("#weight").addEventListener("input", e => {
    const v = parseFloat(e.target.value);
    weight = (v > 0 && v < 120) ? v : null;
    if (weight) localStorage.setItem(WT_KEY, String(weight)); else localStorage.removeItem(WT_KEY);
    render();
  });
  $("#wclear").addEventListener("click", () => { $("#weight").value=""; setWeight(null); });
  $("#q").addEventListener("input", render);
  if (!location.hash) location.hash = "#/" + SYMPTOMS[0].id;
  render();
});
