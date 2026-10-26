# 雨林食物鏈探險隊

小四科學：15 種動物、2 類植物、Anatomy V3 立體模型、Wildlife V4 物種專用材質、自由探索、靠近食性卡、圖鑑及食物鏈工作台。

網站原始碼及全部素材在 docs/。GitHub Pages 使用 main 分支 /docs 目錄。核心資產均隨站載入，學生毋須登入。

Higgsfield 製作寫實教學插圖與材質，非野外攝影。Three.js MIT 授權見 docs/vendor/THREE-LICENSE.txt。

Wildlife V4 使用 15 張不同動物的彩色毛皮、鱗片、皮膚與羽毛貼圖，另有腹毛及胸羽材質；彩色與微細凹凸分開載入。貓科斑紋與無尾刺豚鼠白斑改為表面色素，按部位尺寸對應 UV；身體表面細分改善輪廓。Canvas 相容模式也支援立體身體的 UV 貼圖。Higgsfield 生成記錄見 docs/assets/skins-v4/provenance.json。

[動物材質觀察室](https://wongngaiyam3-rgb.github.io/rainforest-food-chain-quest/materials.html) 可逐一切換並旋轉 15 種 3D 動物。

驗證：`node --test tests/*.test.mjs`。完整 WebGL 光影及 iPad 實機效能尚待驗證；瀏覽器無 WebGL 時採相容模式。
