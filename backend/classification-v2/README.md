# 分類教學第二版

學生入口 classification/index.html 使用五個循序關卡：觀察11、比較3、類群教學5、引導練習5、獨立分類11。所有資料由 curriculum-v2.json 提供。昆蟲列為無脊椎動物對照；未加入魚類卡。

使用獨立 fcq_classification_v2_state/events 表及 foodchain-classification-v2 函式。原版表、函式、規則與班號身份保留。原入口備份為 v1.html / app-v1.js，原教師入口 teacher-v1.html。新舊活動不可合併計分。

學生自選班號不代表驗證身份。沿用原有工作階段、教師驗證、原子 revision 寫入、重送去重、本機待傳佇列及多裝置衝突提示。提交後首次獨立答案固定保存。教師依類群查看首次分類、證據及提示；不把草稿推斷為掌握程度。

判定允許多項合理證據（例如哺乳類可選毛髮或乳汁），拒絕以會飛、四隻腳、產卵或直接生幼兒作充分分類證據。來源教材沿用經核對的分類資料；圖片為原專案教學插圖，不視為顯微照片。觸控放大窗與圖片分開，以避免手指遮擋。

部署 migration.sql 後部署本目錄 index.ts/catalog.json/rules.mjs。verify_jwt=false，函式自行驗證 fcq_sessions 不透明工作階段。前端沒有管理金鑰。

測試：node backend/classification-v2/test.mjs。前端與後端 rules-v2.mjs/rules.mjs 保持同步。
