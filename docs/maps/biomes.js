export const biomes={
 "ocean": {
  "biome": {
   "name": "海洋",
   "accent": "#116c79",
   "en": "OCEAN FIELD CLUB",
   "title": "潛入海洋，",
   "subtitle": "發現生命的連結。",
   "tagline": "沿著海草床，尋找誰吃誰的線索。",
   "stamp": "02",
   "location": "熱帶淺海",
   "ground": "#95c8c0",
   "path": "#e2dcc0",
   "arrow": [
    "turtlegrass",
    "rabbitfish"
   ],
   "challengeText": "兔子魚吃泰來草。",
   "note": "這是熱帶淺海海草床及鄰近礁區的簡化教學模型，不代表某一地點的完整物種名單。卵葉喜鹽草（Halophila ovalis）及泰來草（Thalassia hemprichii）都是真正的開花植物。藻類、浮游生物和分解者未製作成觀察卡；珊瑚與海葵屬於動物。兔子魚及部分食物關係按類群概括。"
  },
  "species": [
   {
    "id": "seagrass",
    "name": "卵葉喜鹽草",
    "tag": "海底的小葉片",
    "diet": "我是一種開花植物，用陽光、水和二氧化碳製造養分。儒艮和綠海龜會吃海草。",
    "food": "陽光 · 水 · 二氧化碳",
    "hint": "在小地圖尋找 01 號觀察點，走近卵葉喜鹽草。",
    "kind": "producer",
    "top": false,
    "color": "#35998c",
    "x": 3,
    "z": 19,
    "size": 1.8
   },
   {
    "id": "turtlegrass",
    "name": "泰來草",
    "tag": "長葉片的海草",
    "diet": "我也是海中的開花植物。我的葉片可供部分兔子魚和綠海龜取食。",
    "food": "陽光 · 水 · 二氧化碳",
    "hint": "在小地圖尋找 02 號觀察點，走近泰來草。",
    "kind": "producer",
    "top": false,
    "color": "#35998c",
    "x": -5,
    "z": 13,
    "size": 2.2
   },
   {
    "id": "turtle",
    "name": "綠海龜",
    "tag": "海草床的訪客",
    "diet": "成年綠海龜主要吃海草和藻類；不同年齡和地區的食性也會有差異。",
    "food": "海草 · 藻類",
    "hint": "在小地圖尋找 03 號觀察點，走近綠海龜。",
    "kind": "consumer",
    "top": false,
    "color": "#35998c",
    "x": 8,
    "z": 16,
    "size": 3.3
   },
   {
    "id": "dugong",
    "name": "儒艮",
    "tag": "溫和的海草食客",
    "diet": "我主要吃海草，會在淺海的海草床覓食。",
    "food": "海草",
    "hint": "在小地圖尋找 04 號觀察點，走近儒艮。",
    "kind": "consumer",
    "top": false,
    "color": "#35998c",
    "x": -10,
    "z": 17,
    "size": 4
   },
   {
    "id": "rabbitfish",
    "name": "兔子魚",
    "tag": "海草床的啃食者",
    "diet": "部分兔子魚會吃海草和藻類。本圖呈現牠們吃泰來草的食物關係。",
    "food": "海草 · 藻類",
    "hint": "在小地圖尋找 05 號觀察點，走近兔子魚。",
    "kind": "consumer",
    "top": false,
    "color": "#35998c",
    "x": -10,
    "z": 8,
    "size": 1.8
   },
   {
    "id": "parrotfish",
    "name": "鸚嘴魚",
    "tag": "礁石上的刮食者",
    "diet": "我會刮食礁石表面的藻類和微小生物。不是所有綠色食物都是海草！",
    "food": "藻類 · 微小生物",
    "hint": "在小地圖尋找 06 號觀察點，走近鸚嘴魚。",
    "kind": "consumer",
    "top": false,
    "color": "#35998c",
    "x": 7,
    "z": 8,
    "size": 2
   },
   {
    "id": "surgeonfish",
    "name": "藍刺尾魚",
    "tag": "藍色的小住客",
    "diet": "我的食物包括浮游生物，也會吃藻類；本圖沒有呈現所有食物。",
    "food": "浮游生物 · 藻類",
    "hint": "在小地圖尋找 07 號觀察點，走近藍刺尾魚。",
    "kind": "consumer",
    "top": false,
    "color": "#35998c",
    "x": 15,
    "z": 9,
    "size": 1.8
   },
   {
    "id": "urchin",
    "name": "海膽",
    "tag": "帶刺的海底住客",
    "diet": "許多海膽會刮食藻類，部分也吃海草及其他有機物。",
    "food": "藻類 · 海草 · 有機物",
    "hint": "在小地圖尋找 08 號觀察點，走近海膽。",
    "kind": "consumer",
    "top": false,
    "color": "#35998c",
    "x": -17,
    "z": 1,
    "size": 1.2
   },
   {
    "id": "shrimp",
    "name": "海草蝦",
    "tag": "葉叢裡的小清道夫",
    "diet": "我會吃藻類、碎屑和微小生物，也可能成為魚類和頭足類的食物。",
    "food": "藻類 · 碎屑 · 微小生物",
    "hint": "在小地圖尋找 09 號觀察點，走近海草蝦。",
    "kind": "consumer",
    "top": false,
    "color": "#35998c",
    "x": 4,
    "z": 1,
    "size": 1.2
   },
   {
    "id": "crab",
    "name": "梭子蟹",
    "tag": "海底的雜食者",
    "diet": "我會吃貝類、小蝦、小魚和其他動物性食物。",
    "food": "貝類 · 蝦 · 小魚",
    "hint": "在小地圖尋找 10 號觀察點，走近梭子蟹。",
    "kind": "consumer",
    "top": false,
    "color": "#35998c",
    "x": 15,
    "z": -1,
    "size": 1.5
   },
   {
    "id": "clownfish",
    "name": "小丑魚",
    "tag": "橙白相間的小魚",
    "diet": "我吃浮游動物、藻類和小型甲殼動物。海葵是動物，並不是植物。",
    "food": "浮游動物 · 藻類 · 小型甲殼動物",
    "hint": "在小地圖尋找 11 號觀察點，走近小丑魚。",
    "kind": "consumer",
    "top": false,
    "color": "#35998c",
    "x": -8,
    "z": -3,
    "size": 1.4
   },
   {
    "id": "butterflyfish",
    "name": "蝴蝶魚",
    "tag": "礁區的彩色身影",
    "diet": "不同蝴蝶魚的食性不同，會吃珊瑚蟲、小型無脊椎動物或藻類。",
    "food": "珊瑚蟲 · 小型無脊椎動物 · 藻類",
    "hint": "在小地圖尋找 12 號觀察點，走近蝴蝶魚。",
    "kind": "consumer",
    "top": false,
    "color": "#35998c",
    "x": 10,
    "z": -8,
    "size": 1.6
   },
   {
    "id": "squid",
    "name": "魷魚",
    "tag": "水中的敏捷獵手",
    "diet": "我捕食小魚和蝦等甲殼動物，也會被較大的捕食者吃掉。",
    "food": "小魚 · 蝦",
    "hint": "在小地圖尋找 13 號觀察點，走近魷魚。",
    "kind": "consumer",
    "top": false,
    "color": "#35998c",
    "x": -16,
    "z": -10,
    "size": 2.2
   },
   {
    "id": "octopus",
    "name": "章魚",
    "tag": "八腕的覓食者",
    "diet": "我會捕食蟹、蝦和貝類等動物，常在海底附近活動。",
    "food": "蟹 · 蝦 · 貝類",
    "hint": "在小地圖尋找 14 號觀察點，走近章魚。",
    "kind": "consumer",
    "top": false,
    "color": "#35998c",
    "x": 1,
    "z": -12,
    "size": 2
   },
   {
    "id": "grouper",
    "name": "石斑魚",
    "tag": "礁旁的伏擊獵手",
    "diet": "我會吞食大小合適的魚類和甲殼動物。本圖以小型兔子魚和蝦作例子。",
    "food": "小魚 · 蝦 · 蟹",
    "hint": "在小地圖尋找 15 號觀察點，走近石斑魚。",
    "kind": "consumer",
    "top": false,
    "color": "#35998c",
    "x": -11,
    "z": -20,
    "size": 3
   },
   {
    "id": "barracuda",
    "name": "梭魚",
    "tag": "銀色的魚類獵手",
    "diet": "我主要捕食魚類，利用速度接近大小合適的獵物。",
    "food": "魚類",
    "hint": "在小地圖尋找 16 號觀察點，走近梭魚。",
    "kind": "consumer",
    "top": true,
    "color": "#35998c",
    "x": 9,
    "z": -20,
    "size": 3.4
   },
   {
    "id": "reefshark",
    "name": "黑鰭礁鯊",
    "tag": "礁區巡游者",
    "diet": "我主要吃大小合適的礁魚，也會吃魷魚、章魚和甲殼動物。",
    "food": "礁魚 · 魷魚 · 章魚 · 甲殼動物",
    "hint": "在小地圖尋找 17 號觀察點，走近黑鰭礁鯊。",
    "kind": "consumer",
    "top": true,
    "color": "#35998c",
    "x": 0,
    "z": -28,
    "size": 4.4
   }
  ],
  "edges": [
   [
    "seagrass",
    "turtle"
   ],
   [
    "seagrass",
    "dugong"
   ],
   [
    "turtlegrass",
    "turtle"
   ],
   [
    "turtlegrass",
    "dugong"
   ],
   [
    "turtlegrass",
    "rabbitfish"
   ],
   [
    "seagrass",
    "rabbitfish"
   ],
   [
    "rabbitfish",
    "grouper"
   ],
   [
    "rabbitfish",
    "barracuda"
   ],
   [
    "rabbitfish",
    "reefshark"
   ],
   [
    "grouper",
    "reefshark"
   ],
   [
    "shrimp",
    "grouper"
   ],
   [
    "shrimp",
    "squid"
   ],
   [
    "shrimp",
    "octopus"
   ],
   [
    "shrimp",
    "crab"
   ],
   [
    "crab",
    "octopus"
   ],
   [
    "crab",
    "grouper"
   ],
   [
    "octopus",
    "reefshark"
   ],
   [
    "squid",
    "reefshark"
   ],
   [
    "clownfish",
    "grouper"
   ],
   [
    "butterflyfish",
    "grouper"
   ],
   [
    "parrotfish",
    "barracuda"
   ],
   [
    "surgeonfish",
    "barracuda"
   ]
  ],
  "sources": [
   [
    "綠海龜 · NOAA",
    "https://www.fisheries.noaa.gov/species/green-turtle"
   ],
   [
    "海草與兔子魚 · CSIRO",
    "https://www.csiro.au/en/research/plants/water-marine/Marine-plants-in-the-Kimberley"
   ],
   [
    "黑鰭礁鯊 · Seattle Aquarium",
    "https://www.seattleaquarium.org/animal/blacktip-reef-shark/"
   ]
  ]
 },
 "desert": {
  "biome": {
   "name": "沙漠",
   "accent": "#91602f",
   "en": "DESERT FIELD CLUB",
   "title": "走進沙漠，",
   "subtitle": "發現生命的連結。",
   "tagline": "沿著觀察路線，尋找誰吃誰的線索。",
   "stamp": "03",
   "location": "乾旱沙漠及綠洲",
   "ground": "#d6b57c",
   "path": "#edd5a6",
   "arrow": [
    "desertgrass",
    "locust"
   ],
   "challengeText": "沙漠蝗蟲吃植物。",
   "note": "以北非至西亞乾旱地帶的沙漠、綠洲及邊緣山地作簡化展示，並非所有物種都出現於同一地點。椰棗樹（Phoenix dactylifera）及沙漠禾草（Panicum類群）為本圖兩類生產者。白天與夜間動物同場，是方便課堂觀察的安排。"
  },
  "species": [
   {
    "id": "datepalm",
    "name": "椰棗樹",
    "tag": "綠洲的生產者",
    "food": "陽光 · 水 · 二氧化碳",
    "diet": "我行光合作用，葉片、果實和種子可成為動物的食物。綠洲通常有較易取得的水。",
    "size": 4.8,
    "x": 3,
    "z": 19,
    "kind": "producer",
    "hint": "在小地圖尋找 01 號觀察點，走近椰棗樹。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "desertgrass",
    "name": "沙漠禾草",
    "tag": "沙地上的綠色工廠",
    "food": "陽光 · 水 · 二氧化碳",
    "diet": "我是耐旱禾草，以Panicum類群為例。我的葉片及種子能供部分動物取食。",
    "size": 2.1,
    "x": -5,
    "z": 13,
    "kind": "producer",
    "hint": "在小地圖尋找 02 號觀察點，走近沙漠禾草。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "camel",
    "name": "單峰駱駝",
    "tag": "耐旱的大住客",
    "food": "草 · 葉片 · 灌木",
    "diet": "我主要吃草、葉片和灌木。駝峰主要儲存脂肪，並不是一袋水。",
    "size": 3.8,
    "x": 8,
    "z": 16,
    "kind": "consumer",
    "hint": "在小地圖尋找 03 號觀察點，走近單峰駱駝。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "gazelle",
    "name": "小鹿瞪羚",
    "tag": "沙漠邊緣的草食者",
    "food": "草 · 葉片",
    "diet": "我吃草和其他植物的葉片，在乾旱地帶尋找食物。",
    "size": 2.7,
    "x": -10,
    "z": 17,
    "kind": "consumer",
    "hint": "在小地圖尋找 04 號觀察點，走近小鹿瞪羚。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "addax",
    "name": "旋角羚",
    "tag": "淺色的沙地羚羊",
    "food": "草 · 葉片",
    "diet": "我主要吃禾草和其他植物，可從食物中取得部分水分。",
    "size": 3.2,
    "x": -10,
    "z": 8,
    "kind": "consumer",
    "hint": "在小地圖尋找 05 號觀察點，走近旋角羚。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "jerboa",
    "name": "跳鼠",
    "tag": "長後腿的覓食者",
    "food": "種子 · 植物 · 昆蟲",
    "diet": "我主要吃種子和植物，也可能吃昆蟲。夜間活動有助避開白天高溫。",
    "size": 1.4,
    "x": 7,
    "z": 8,
    "kind": "consumer",
    "hint": "在小地圖尋找 06 號觀察點，走近跳鼠。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "gerbil",
    "name": "沙鼠",
    "tag": "沙地的小種子食客",
    "food": "種子 · 植物 · 昆蟲",
    "diet": "我吃草的種子和植物，部分沙鼠也會吃昆蟲。",
    "size": 1.3,
    "x": 15,
    "z": 9,
    "kind": "consumer",
    "hint": "在小地圖尋找 07 號觀察點，走近沙鼠。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "locust",
    "name": "沙漠蝗蟲",
    "tag": "啃食植物的昆蟲",
    "food": "植物葉片",
    "diet": "我用口器啃食草及其他植物的葉片。",
    "size": 1.3,
    "x": -17,
    "z": 1,
    "kind": "consumer",
    "hint": "在小地圖尋找 08 號觀察點，走近沙漠蝗蟲。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "beetle",
    "name": "擬步行蟲",
    "tag": "沙地上的小甲蟲",
    "food": "枯植物 · 種子 · 有機碎屑",
    "diet": "許多沙漠擬步行蟲吃枯植物和有機碎屑，部分也吃種子；本圖沒有製作碎屑卡。",
    "size": 1.15,
    "x": 4,
    "z": 1,
    "kind": "consumer",
    "hint": "在小地圖尋找 09 號觀察點，走近擬步行蟲。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "uromastyx",
    "name": "刺尾蜥",
    "tag": "以植物為主的蜥蜴",
    "food": "葉片 · 花 · 種子",
    "diet": "成年刺尾蜥主要吃植物的葉片、花和種子。",
    "size": 2,
    "x": 15,
    "z": -1,
    "kind": "consumer",
    "hint": "在小地圖尋找 10 號觀察點，走近刺尾蜥。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "monitor",
    "name": "沙漠巨蜥",
    "tag": "沙地的巡行獵手",
    "food": "昆蟲 · 齧齒動物 · 蛇類",
    "diet": "我會捕食大小合適的昆蟲、齧齒動物及爬行動物，也能捕食角蝰。",
    "size": 3,
    "x": -8,
    "z": -3,
    "kind": "consumer",
    "hint": "在小地圖尋找 11 號觀察點，走近沙漠巨蜥。",
    "color": "#9b8348",
    "top": true
   },
   {
    "id": "scorpion",
    "name": "沙漠蠍子",
    "tag": "夜間的小型獵手",
    "food": "昆蟲 · 其他節肢動物",
    "diet": "我會捕食蝗蟲等大小合適的昆蟲及其他節肢動物。",
    "size": 1.5,
    "x": 10,
    "z": -8,
    "kind": "consumer",
    "hint": "在小地圖尋找 12 號觀察點，走近沙漠蠍子。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "viper",
    "name": "角蝰",
    "tag": "埋伏在沙中的獵手",
    "food": "小型齧齒動物 · 蜥蜴",
    "diet": "我會捕食跳鼠、沙鼠等小型動物及蜥蜴，自己也可能被巨蜥或貓科動物捕食。",
    "size": 2.1,
    "x": -16,
    "z": -10,
    "kind": "consumer",
    "hint": "在小地圖尋找 13 號觀察點，走近角蝰。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "fennec",
    "name": "耳廓狐",
    "tag": "大耳朵的夜行者",
    "food": "昆蟲 · 齧齒動物 · 果實",
    "diet": "我吃昆蟲、小型齧齒動物、蜥蜴及部分植物食物，屬於雜食動物。",
    "size": 2.1,
    "x": 1,
    "z": -12,
    "kind": "consumer",
    "hint": "在小地圖尋找 14 號觀察點，走近耳廓狐。",
    "color": "#9b8348",
    "top": true
   },
   {
    "id": "sandcat",
    "name": "沙貓",
    "tag": "低伏的沙地獵手",
    "food": "沙鼠 · 跳鼠 · 小型爬行動物",
    "diet": "我主要捕食沙鼠、跳鼠等小動物，也會吃鳥類及爬行動物。",
    "size": 2.4,
    "x": -11,
    "z": -20,
    "kind": "consumer",
    "hint": "在小地圖尋找 15 號觀察點，走近沙貓。",
    "color": "#9b8348",
    "top": true
   },
   {
    "id": "caracal",
    "name": "獰貓",
    "tag": "黑耳簇的敏捷獵手",
    "food": "小型哺乳動物 · 鳥類",
    "diet": "我捕食大小合適的小型哺乳動物和鳥類，也可能捕食較小的羚羊。",
    "size": 3,
    "x": 9,
    "z": -20,
    "kind": "consumer",
    "hint": "在小地圖尋找 16 號觀察點，走近獰貓。",
    "color": "#9b8348",
    "top": true
   },
   {
    "id": "eagle",
    "name": "金鵰",
    "tag": "乾旱山地的猛禽",
    "food": "小型哺乳動物 · 鳥類 · 爬行動物",
    "diet": "我會捕食小型哺乳動物和鳥類，也吃部分爬行動物。本圖把乾旱山地與沙漠邊緣合併展示。",
    "size": 3.4,
    "x": 0,
    "z": -28,
    "kind": "consumer",
    "hint": "在小地圖尋找 17 號觀察點，走近金鵰。",
    "color": "#9b8348",
    "top": true
   }
  ],
  "edges": [
   [
    "desertgrass",
    "camel"
   ],
   [
    "desertgrass",
    "gazelle"
   ],
   [
    "desertgrass",
    "addax"
   ],
   [
    "desertgrass",
    "jerboa"
   ],
   [
    "desertgrass",
    "gerbil"
   ],
   [
    "desertgrass",
    "locust"
   ],
   [
    "desertgrass",
    "uromastyx"
   ],
   [
    "datepalm",
    "camel"
   ],
   [
    "datepalm",
    "gerbil"
   ],
   [
    "datepalm",
    "fennec"
   ],
   [
    "locust",
    "scorpion"
   ],
   [
    "locust",
    "monitor"
   ],
   [
    "locust",
    "fennec"
   ],
   [
    "gerbil",
    "viper"
   ],
   [
    "gerbil",
    "monitor"
   ],
   [
    "gerbil",
    "fennec"
   ],
   [
    "gerbil",
    "sandcat"
   ],
   [
    "gerbil",
    "caracal"
   ],
   [
    "gerbil",
    "eagle"
   ],
   [
    "jerboa",
    "viper"
   ],
   [
    "jerboa",
    "monitor"
   ],
   [
    "jerboa",
    "sandcat"
   ],
   [
    "jerboa",
    "caracal"
   ],
   [
    "jerboa",
    "eagle"
   ],
   [
    "beetle",
    "scorpion"
   ],
   [
    "beetle",
    "fennec"
   ],
   [
    "viper",
    "monitor"
   ],
   [
    "viper",
    "sandcat"
   ],
   [
    "uromastyx",
    "eagle"
   ],
   [
    "uromastyx",
    "monitor"
   ]
  ],
  "sources": [
   [
    "耳廓狐食性 · San Diego Zoo",
    "https://animals.sandiegozoo.org/animals/fennec-fox"
   ],
   [
    "沙貓食性 · Smithsonian",
    "https://nationalzoo.si.edu/animals/sand-cat"
   ],
   [
    "角蝰食性 · Animal Diversity Web",
    "https://animaldiversity.org/accounts/Cerastes_cerastes/"
   ]
  ]
 },
 "savanna": {
  "biome": {
   "name": "草原",
   "accent": "#647642",
   "en": "SAVANNA FIELD CLUB",
   "title": "走進草原，",
   "subtitle": "發現生命的連結。",
   "tagline": "沿著觀察路線，尋找誰吃誰的線索。",
   "stamp": "04",
   "location": "非洲熱帶草原",
   "ground": "#b5ad69",
   "path": "#d4c58b",
   "arrow": [
    "redgrass",
    "grasshopper"
   ],
   "challengeText": "蚱蜢吃植物。",
   "note": "以非洲熱帶草原作簡化展示，紅草（Themeda triandra）及金合歡類群是本圖兩類生產者。金合歡與獴等名稱概括相關類群；物種分布與活動時間經教學調整，並非某一地點的完整名單。"
  },
  "species": [
   {
    "id": "redgrass",
    "name": "紅草",
    "tag": "草原的生產者",
    "food": "陽光 · 水 · 二氧化碳",
    "diet": "我是一種禾草，行光合作用。我的葉片及種子供草原動物取食。",
    "size": 2.2,
    "x": 3,
    "z": 19,
    "kind": "producer",
    "hint": "在小地圖尋找 01 號觀察點，走近紅草。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "acacia",
    "name": "金合歡",
    "tag": "枝葉間的食物來源",
    "food": "陽光 · 水 · 二氧化碳",
    "diet": "我行光合作用，葉片可供長頸鹿等動物取食。這裡以金合歡類群概括。",
    "size": 5,
    "x": -5,
    "z": 13,
    "kind": "producer",
    "hint": "在小地圖尋找 02 號觀察點，走近金合歡。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "zebra",
    "name": "斑馬",
    "tag": "黑白條紋的草食者",
    "food": "草",
    "diet": "我主要吃禾草，用牙齒咬下草葉。",
    "size": 3.2,
    "x": 8,
    "z": 16,
    "kind": "consumer",
    "hint": "在小地圖尋找 03 號觀察點，走近斑馬。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "gazelle",
    "name": "湯氏瞪羚",
    "tag": "草原上的輕快身影",
    "food": "草 · 嫩葉",
    "diet": "我主要吃草，也會吃嫩葉等植物部分。",
    "size": 2.6,
    "x": -10,
    "z": 17,
    "kind": "consumer",
    "hint": "在小地圖尋找 04 號觀察點，走近湯氏瞪羚。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "wildebeest",
    "name": "角馬",
    "tag": "逐草而行的羚羊",
    "food": "草",
    "diet": "我主要吃草，會隨水和食物的供應移動。",
    "size": 3.4,
    "x": -10,
    "z": 8,
    "kind": "consumer",
    "hint": "在小地圖尋找 05 號觀察點，走近角馬。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "giraffe",
    "name": "長頸鹿",
    "tag": "高枝上的採葉者",
    "food": "金合歡等樹木的葉片",
    "diet": "我主要吃樹木和灌木的葉片，金合歡的葉片是食物之一。",
    "size": 5,
    "x": 7,
    "z": 8,
    "kind": "consumer",
    "hint": "在小地圖尋找 06 號觀察點，走近長頸鹿。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "elephant",
    "name": "非洲象",
    "tag": "靈活長鼻的草食者",
    "food": "草 · 葉片 · 樹皮 · 果實",
    "diet": "我吃草、葉片、樹皮及果實。不同季節會選擇不同植物。",
    "size": 4.6,
    "x": 15,
    "z": 9,
    "kind": "consumer",
    "hint": "在小地圖尋找 07 號觀察點，走近非洲象。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "buffalo",
    "name": "非洲水牛",
    "tag": "草原的大型食草者",
    "food": "草",
    "diet": "我主要吃禾草，需要尋找足夠食物和水。",
    "size": 3.5,
    "x": -17,
    "z": 1,
    "kind": "consumer",
    "hint": "在小地圖尋找 08 號觀察點，走近非洲水牛。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "rhino",
    "name": "白犀牛",
    "tag": "低頭吃草的大住客",
    "food": "草",
    "diet": "我主要吃草，寬闊的嘴適合貼近地面取食。",
    "size": 4,
    "x": 4,
    "z": 1,
    "kind": "consumer",
    "hint": "在小地圖尋找 09 號觀察點，走近白犀牛。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "grasshopper",
    "name": "蚱蜢",
    "tag": "葉叢間的小跳躍家",
    "food": "草的葉片",
    "diet": "我主要吃草等植物的葉片，也會成為蜥蜴和鳥類的食物。",
    "size": 1.2,
    "x": 15,
    "z": -1,
    "kind": "consumer",
    "hint": "在小地圖尋找 10 號觀察點，走近蚱蜢。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "hare",
    "name": "草原野兔",
    "tag": "長耳朵的草食者",
    "food": "草 · 葉片",
    "diet": "我吃草和其他植物，常警覺周圍是否有獵手。",
    "size": 1.7,
    "x": -8,
    "z": -3,
    "kind": "consumer",
    "hint": "在小地圖尋找 11 號觀察點，走近草原野兔。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "ostrich",
    "name": "鴕鳥",
    "tag": "長腿的雜食大鳥",
    "food": "植物 · 種子 · 昆蟲",
    "diet": "我主要吃植物和種子，也會吃昆蟲等小動物。",
    "size": 3.7,
    "x": 10,
    "z": -8,
    "kind": "consumer",
    "hint": "在小地圖尋找 12 號觀察點，走近鴕鳥。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "agama",
    "name": "彩虹飛蜥",
    "tag": "岩石旁的捕蟲者",
    "food": "昆蟲",
    "diet": "我主要吃蝗蟲、蚱蜢等大小合適的昆蟲。",
    "size": 1.8,
    "x": -16,
    "z": -10,
    "kind": "consumer",
    "hint": "在小地圖尋找 13 號觀察點，走近彩虹飛蜥。",
    "color": "#9b8348",
    "top": false
   },
   {
    "id": "mongoose",
    "name": "獴",
    "tag": "地面上的覓食者",
    "food": "昆蟲 · 小型爬行動物 · 小型哺乳動物",
    "diet": "不同獴的食性有差異，多會吃昆蟲，也吃大小合適的小型動物。",
    "size": 2,
    "x": 1,
    "z": -12,
    "kind": "consumer",
    "hint": "在小地圖尋找 14 號觀察點，走近獴。",
    "color": "#9b8348",
    "top": true
   },
   {
    "id": "secretarybird",
    "name": "蛇鷲",
    "tag": "長腿的地面獵手",
    "food": "昆蟲 · 蜥蜴 · 小型齧齒動物 · 蛇",
    "diet": "我在地面尋找獵物，會吃蚱蜢、蜥蜴及小型齧齒動物等，不是只吃蛇。",
    "size": 3.3,
    "x": -11,
    "z": -20,
    "kind": "consumer",
    "hint": "在小地圖尋找 15 號觀察點，走近蛇鷲。",
    "color": "#9b8348",
    "top": true
   },
   {
    "id": "cheetah",
    "name": "獵豹",
    "tag": "草原上的追逐獵手",
    "food": "瞪羚 · 野兔等動物",
    "diet": "我主要捕食湯氏瞪羚等大小合適的動物，也吃野兔和部分鳥類。",
    "size": 3.4,
    "x": 9,
    "z": -20,
    "kind": "consumer",
    "hint": "在小地圖尋找 16 號觀察點，走近獵豹。",
    "color": "#9b8348",
    "top": true
   },
   {
    "id": "lion",
    "name": "獅子",
    "tag": "草原的大型獵手",
    "food": "斑馬 · 角馬 · 水牛 · 羚羊",
    "diet": "我會捕食斑馬、角馬、水牛及羚羊等，也會吃腐肉。幼小或體弱動物較容易被捕食。",
    "size": 3.8,
    "x": 0,
    "z": -28,
    "kind": "consumer",
    "hint": "在小地圖尋找 17 號觀察點，走近獅子。",
    "color": "#9b8348",
    "top": true
   }
  ],
  "edges": [
   [
    "redgrass",
    "zebra"
   ],
   [
    "redgrass",
    "gazelle"
   ],
   [
    "redgrass",
    "wildebeest"
   ],
   [
    "redgrass",
    "elephant"
   ],
   [
    "redgrass",
    "buffalo"
   ],
   [
    "redgrass",
    "rhino"
   ],
   [
    "redgrass",
    "grasshopper"
   ],
   [
    "redgrass",
    "hare"
   ],
   [
    "redgrass",
    "ostrich"
   ],
   [
    "acacia",
    "giraffe"
   ],
   [
    "acacia",
    "elephant"
   ],
   [
    "acacia",
    "gazelle"
   ],
   [
    "grasshopper",
    "agama"
   ],
   [
    "grasshopper",
    "mongoose"
   ],
   [
    "grasshopper",
    "secretarybird"
   ],
   [
    "grasshopper",
    "ostrich"
   ],
   [
    "agama",
    "secretarybird"
   ],
   [
    "agama",
    "mongoose"
   ],
   [
    "gazelle",
    "cheetah"
   ],
   [
    "gazelle",
    "lion"
   ],
   [
    "hare",
    "cheetah"
   ],
   [
    "hare",
    "lion"
   ],
   [
    "zebra",
    "lion"
   ],
   [
    "wildebeest",
    "lion"
   ],
   [
    "buffalo",
    "lion"
   ],
   [
    "giraffe",
    "lion"
   ]
  ],
  "sources": [
   [
    "草原生境 · San Diego Zoo",
    "https://animals.sandiegozoo.org/habitats/savanna"
   ],
   [
    "獵豹食性 · San Diego Zoo",
    "https://animals.sandiegozoo.org/animals/cheetah"
   ],
   [
    "長頸鹿食性 · San Diego Zoo",
    "https://animals.sandiegozoo.org/animals/giraffe"
   ],
   [
    "蛇鷲食性 · San Diego Zoo",
    "https://animals.sandiegozoo.org/animals/secretary-bird"
   ]
  ]
 }
};
