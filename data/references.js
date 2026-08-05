/* =========================================================
   出典マスタ  data/references.js
   ---------------------------------------------------------
   各症候ページの [出典] バッジはここの id を参照します。
   status:
     "confirmed" … 2026-08 時点で版・発行元をウェブで確認済み
     "check"     … 版が新しくなっている可能性あり。使う前に要確認
   access:
     "free" … 全文または要約が無料で読める
     "book" … 書籍／有料。リンクは目次・案内ページ
   ========================================================= */

const REFERENCES = [
  {
    id: "amr4",
    title: "抗微生物薬適正使用の手引き 第四版",
    org: "厚生労働省 健康・生活衛生局 感染症対策課",
    year: "2026年4月（ダイジェスト版）",
    access: "free",
    status: "confirmed",
    url: "https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/0000120172.html",
    extra: [
      { label: "第四版 ダイジェスト版 PDF", url: "https://www.mhlw.go.jp/content/10900000/001329342.pdf" },
      { label: "第三版 本編 PDF", url: "https://www.mhlw.go.jp/content/10900000/001168459.pdf" }
    ],
    note: "感冒・急性鼻副鼻腔炎・急性咽頭炎・急性下痢症で「抗菌薬を出さない」判断の根拠。乳幼児編が外来小児科に直結する。"
  },
  {
    id: "resp2022",
    title: "小児呼吸器感染症診療ガイドライン2022",
    org: "日本小児呼吸器学会／日本小児感染症学会",
    year: "2022年10月（前版2017から6年ぶり改訂）",
    access: "book",
    status: "confirmed",
    url: "https://www.jspid.jp/guideline/",
    extra: [
      { label: "Minds 掲載ページ", url: "https://minds.jcqhc.or.jp/summary/c00758/" }
    ],
    note: "咽頭炎・クループ・細気管支炎・市中肺炎の抗菌薬。百日咳の追補版が学会サイトで無料公開されている。"
  },
  {
    id: "febrile2023",
    title: "熱性けいれん（熱性発作）診療ガイドライン2023",
    org: "日本小児神経学会",
    year: "2023年1月",
    access: "free",
    status: "confirmed",
    url: "https://www.childneuro.jp/about/6442/",
    extra: [
      { label: "Minds 掲載ページ", url: "https://minds.jcqhc.or.jp/summary/c00763/" }
    ],
    note: "学会サイトで全ページPDFが閲覧可能（印刷・コピー不可）。髄液/血液/画像検査の要否、入院搬送の目安、ジアゼパム坐剤、解熱薬、注意すべき薬剤、予防接種まで CQ 形式。"
  },
  {
    id: "jpgl2023",
    title: "小児気管支喘息治療・管理ガイドライン2023（JPGL2023）",
    org: "日本小児アレルギー学会",
    year: "2023年11月18日",
    access: "book",
    status: "confirmed",
    url: "https://www.jspaci.jp/journal/asthma2023/",
    extra: [
      { label: "Minds 掲載ページ", url: "https://minds.jcqhc.or.jp/summary/c00825/" }
    ],
    note: "書籍だが、実臨床で使う図表の一部は学会サイトの Web版で無料ダウンロードできる。5歳以下の追加治療に ICS/LABA が入るなど長期管理が大きく変わった。第11章は2024年9月に一部改訂あり。"
  },
  {
    id: "otitis2024",
    title: "小児急性中耳炎診療ガイドライン 2024年版",
    org: "日本耳科学会／日本小児耳鼻咽喉科学会／日本耳鼻咽喉科免疫アレルギー感染症学会",
    year: "2024年5月（前版2018から6年ぶり改訂）",
    access: "free",
    status: "confirmed",
    url: "https://www.otology.gr.jp/common/pdf/guideline_otitis2024.pdf",
    note: "重症度スコア（年齢・症状・鼓膜所見）→ 抗菌薬の要否 → 効果判定 → 再選択、という構造。軽症/中等症/重症を合体した「アルゴリズムのまとめ」が2024年版で追加された。"
  },
  {
    id: "foodallergy2021",
    title: "食物アレルギー診療ガイドライン2021",
    org: "日本小児アレルギー学会",
    year: "2021年11月13日",
    access: "free",
    status: "confirmed",
    url: "https://www.jspaci.jp/guide2021/",
    extra: [
      { label: "Minds 掲載ページ", url: "https://minds.jcqhc.or.jp/summary/c00691/" }
    ],
    note: "ダイジェスト版が学会サイトで Web 公開されている。外来では「必要最小限の除去」「誤食時の対応」「負荷試験への紹介タイミング」を確認する。"
  },
  {
    id: "atopy2024",
    title: "小児のためのアトピー性皮膚炎の予防と治療の手引き（小児アトピー性皮膚炎治療・管理ガイドライン2024）",
    org: "日本小児皮膚科学会／日本小児アレルギー学会",
    year: "2024年11月2日",
    access: "book",
    status: "confirmed",
    url: "https://www.jspaci.jp/journal/book/",
    note: "外用ステロイドのランクと塗布量（FTU）、プロアクティブ療法、保湿の指導内容の根拠。"
  },
  {
    id: "gi2024",
    title: "小児消化管感染症診療ガイドライン2024",
    org: "日本小児感染症学会（診断と治療社）",
    year: "2024年",
    access: "book",
    status: "confirmed",
    url: "https://www.shindan.co.jp/np/isbn/9784787823991/",
    note: "経口補水療法、是正輸液の組成、整腸薬・制吐薬の是非、カンピロバクター／サルモネラへの抗菌薬の是非が CQ になっている。"
  },
  {
    id: "gastro2017",
    title: "小児急性胃腸炎診療ガイドライン（エビデンスに基づいた子どもの腹部救急診療ガイドライン2017 所収）",
    org: "日本小児救急医学会",
    year: "2017年",
    access: "book",
    status: "check",
    url: "https://www.jsep.jp/",
    note: "経口補水液を5mLずつ5分ごと、脱水改善後は年齢相応の通常食をすぐ再開、といった具体的指示の出どころ。改訂の有無を確認すること。"
  },
  {
    id: "anaphylaxis2022",
    title: "アナフィラキシーガイドライン2022",
    org: "日本アレルギー学会",
    year: "2022年",
    access: "free",
    status: "check",
    url: "https://www.jsaweb.jp/",
    note: "アドレナリン筋注の適応・用量・エピペン処方の判断。最新版の有無を学会サイトで確認すること。"
  },
  {
    id: "jsatebiki2025",
    title: "アレルギーの手引き2025 ～患者さんに接する医療従事者のために～",
    org: "日本アレルギー学会",
    year: "2025年",
    access: "free",
    status: "confirmed",
    url: "https://www.jsaweb.jp/huge/JSA_tebiki2025.pdf",
    note: "喘息・アトピー・食物アレルギーを横断的にまとめた無料PDF。保護者説明の言い回しを作るときに使いやすい。"
  },
  {
    id: "jpeds",
    title: "日本小児科学会 予防接種スケジュール・提言・ガイドライン",
    org: "日本小児科学会",
    year: "随時更新",
    access: "free",
    status: "confirmed",
    url: "https://www.jpeds.or.jp/",
    note: "予防接種スケジュールは頻繁に更新される。外来で示す前に必ず最新版を開くこと。"
  },
  {
    id: "minds",
    title: "Mindsガイドラインライブラリ",
    org: "日本医療機能評価機構（厚生労働省委託事業）",
    year: "随時更新",
    access: "free",
    status: "confirmed",
    url: "https://minds.jcqhc.or.jp/",
    note: "版が変わっていないかを最初に確認する場所。全文掲載のものも多い。"
  },
  {
    id: "kawasaki",
    title: "川崎病診断の手引き（改訂第6版）／川崎病急性期治療のガイドライン",
    org: "日本川崎病学会・特定非営利活動法人日本川崎病研究センターほか",
    year: "手引き 2019年／急性期治療 2020年",
    access: "check",
    status: "check",
    url: "https://minds.jcqhc.or.jp/",
    note: "版が更新されている可能性あり。外来では「主要症状の数」と「不全型の考え方」を手引きの原文で確認すること。"
  },
  {
    id: "constipation",
    title: "小児慢性機能性便秘症診療ガイドライン",
    org: "日本小児栄養消化器肝臓学会／日本小児消化管機能研究会",
    year: "2013年",
    access: "check",
    status: "check",
    url: "https://minds.jcqhc.or.jp/",
    note: "刊行から年数が経っている。モビコール（ポリエチレングリコール）など後発の薬剤はガイドラインに載っていないので添付文書で確認する。"
  },
  {
    id: "enuresis",
    title: "夜尿症診療ガイドライン",
    org: "日本夜尿症学会",
    year: "2021年（要確認）",
    access: "check",
    status: "check",
    url: "https://minds.jcqhc.or.jp/",
    note: "生活指導→アラーム療法／デスモプレシンの順序と、専門医紹介の目安。版を確認すること。"
  },
  {
    id: "schoolurine",
    title: "学校検尿のすべて",
    org: "日本学校保健会／日本小児腎臓病学会",
    year: "令和2年度改訂（要確認）",
    access: "check",
    status: "check",
    url: "https://www.jspn.jp/",
    note: "血尿・蛋白尿の再検の組み方と腎臓専門医紹介基準。版を確認すること。"
  },
  {
    id: "encephalopathy",
    title: "小児急性脳症診療ガイドライン",
    org: "日本小児神経学会",
    year: "2023年（要確認）",
    access: "check",
    status: "check",
    url: "https://www.childneuro.jp/",
    note: "熱性けいれんとの鑑別、意識障害が遷延するときの動き方。"
  }
];
