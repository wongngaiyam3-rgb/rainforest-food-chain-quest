# 雨林動物分類研究站

學生： https://wongngaiyam3-rgb.github.io/rainforest-food-chain-quest/classification/
教師： https://wongngaiyam3-rgb.github.io/rainforest-food-chain-quest/classification/teacher.html

使用原有雨林圖片、3D 場景及 fcq 學年身份與教師工作階段。分類功能為獨立 foodchain-classification Edge Function，沒有改動原有食物鏈 API。

流程：觀察卡 → 自訂 2–6 組及規則 → 首次分類保存 → 研究卡 → 科學分類與證據 → 反思與正式提交。首次分類不可改寫；後續分類修訂保留歷史。分類及證據均一致得 1 分，共 11 分，僅供形成性評估。

資料表 fcq_classification_state 存目前狀態，fcq_classification_events 存逐次修訂。僅 service role 經驗證工作階段可讀寫；RLS 開啟，anon/authenticated 無資料權限，RPC 無 public execute。RPC 以 enrollment 鎖定、revision 樂觀並行控制及 event UUID 保證原子寫入及去重。

前端以 app + enrollment 分隔本機資料和待傳佇列。斷線保留，15 秒及恢復連線重試；收到伺服器成功才移除事件。多裝置衝突停止寫入，先下載本機備份再載入雲端。班號是自報，並非身份驗證。學年需每年檢視更新。

部署：先套用 migration.sql，再部署 index.ts/rules.mjs/catalog.json，verify_jwt=false（函式自行驗證原有不透明工作階段）。Supabase service key 只由環境取得；前端無密碼及管理金鑰。前後端 catalog 及 rules 同步更新。

驗證：node backend/classification/test.mjs。測試包含首次分類保留、完整提交、分類與證據雙重計分及不合法資料拒收。DB 交易測試驗證原子儲存、重送去重與衝突；測試資料回滾。

教學限制：3D 模型為示意，非每項特徵均清楚可見；可用插圖並記錄暫時看不清。部分動物名稱代表類群。沒有魚類卡。資料來源列於研究室。研究卡與科學分類於首次分類保存後開放，前端靜態教材不作考試答案保密用途。
