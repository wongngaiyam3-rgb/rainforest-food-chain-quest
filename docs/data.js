export const species = [
 {id:'broadleaf',name:'雨林闊葉植物',tag:'林下的綠色工廠',diet:'我利用陽光、水和二氧化碳製造養分。我的葉片可以成為食葉動物的食物。',food:'陽光 · 水 · 二氧化碳',hint:'沿營地前方的小徑，留意寬大的葉片。',kind:'producer',color:'#77a94f'},
 {id:'fig',name:'榕屬植物',tag:'林中的食物來源',diet:'我會行光合作用。我的葉片和果實，能為部分雨林動物提供食物。',food:'陽光 · 水 · 二氧化碳',hint:'往西北面的榕樹林走，看看氣生根旁的植物。',kind:'producer',color:'#729957'},
 {id:'grasshopper',name:'食葉蚱蜢',tag:'葉叢裡的小跳躍家',diet:'我主要吃植物的葉片，會在葉叢之間跳躍，尋找適合的嫩葉。',food:'植物葉片',hint:'闊葉林小徑旁，有小動物正在葉片間跳動。',kind:'consumer',color:'#a7b94b'},
 {id:'iguana',name:'綠鬣蜥',tag:'喜歡植物的大蜥蜴',diet:'我主要吃植物的葉片、花和果實。我會慢慢走到植物旁邊取食。',food:'葉片 · 花 · 果實',hint:'走向西面闊葉林，留意帶著長尾巴的身影。',kind:'consumer',color:'#66a477'},
 {id:'sloth',name:'樹懶',tag:'枝條上的慢步者',diet:'我主要吃葉片、嫩芽和部分果實。我常留在樹上，慢慢沿枝條移動。',food:'葉片 · 嫩芽 · 果實',hint:'榕樹林的低枝觀察台，可以近距離觀察樹懶。',kind:'consumer',color:'#a38e75'},
 {id:'frog',name:'食蟲樹蛙',tag:'葉片上的捕蟲高手',diet:'我主要吃昆蟲，例如蚱蜢。我會在葉片附近尋找食物，再跳近捕食。',food:'蚱蜢等昆蟲',hint:'溪流旁的寬葉上，可能藏著一對紅色眼睛。',kind:'consumer',color:'#71b34e'},
 {id:'owl',name:'眼鏡鴞',tag:'枝頭的安靜觀察者',diet:'我的食物包括蛙類、昆蟲和一些小型動物。我常停在枝頭觀察，再飛向食物。',food:'蛙類 · 昆蟲 · 小型動物',hint:'溪流北面的木製觀察台，能接近眼鏡鴞的棲枝。',kind:'consumer',top:true,color:'#a28a6c'},
 {id:'harpy',name:'角雕',tag:'雨林樹冠的獵手',diet:'我的食物包括樹懶、鬣蜥和部分蛇類。我會在枝頭觀察，也能在樹木之間飛行。',food:'樹懶 · 鬣蜥 · 蛇類',hint:'往北面的林冠觀察地走，尋找黑白色的大鳥。',kind:'consumer',top:true,color:'#78928d'},
 {id:'agouti',name:'刺豚鼠',tag:'林下的果實收藏家',diet:'我主要吃掉落的果實和種子，也會把部分食物埋起來，留待之後再吃。',food:'果實 · 種子',hint:'營地西面的小路旁，留意棕色長腿的小型哺乳動物。',kind:'consumer',color:'#a87947'},
 {id:'paca',name:'無尾刺豚鼠',tag:'披著白斑的林下住客',diet:'我主要吃掉落的果實，也吃種子及其他植物部分。我常在林地上尋找食物。',food:'掉落果實 · 種子 · 植物',hint:'榕樹林西南面，看看帶著幾排白斑的動物。',kind:'consumer',color:'#8d6248'},
 {id:'tapir',name:'中美貘',tag:'用短鼻採葉的大住客',diet:'我吃植物的葉片和果實，會用靈活的短鼻把食物送到嘴邊。',food:'葉片 · 果實',hint:'溪流南面的林地，可以找到體型較大的中美貘。',kind:'consumer',color:'#776d60'},
 {id:'peccary',name:'領西貒',tag:'帶著淺色頸圈的覓食者',diet:'我主要吃果實、種子和根莖，有時也吃小動物。本次模型呈現我的植物食物。',food:'果實 · 種子 · 根莖',hint:'闊葉林西側，留意頸部有淺色圈紋的小獸。',kind:'consumer',color:'#796f62'},
 {id:'coati',name:'白鼻長鼻浣熊',tag:'尾巴豎起的雜食探索家',diet:'我吃果實、昆蟲，也會吃蛙類和一些小型動物。我常低頭嗅聞，尋找食物。',food:'果實 · 昆蟲 · 蛙類',hint:'沿溪流南面的支路走，找找豎起條紋尾巴的動物。',kind:'consumer',color:'#987449'},
 {id:'toucan',name:'彩虹巨嘴鳥',tag:'枝頭上的彩色大嘴',diet:'我主要吃果實，也會吃昆蟲和蛙類。我會用大嘴夾起食物，再吞進嘴裡。',food:'果實 · 昆蟲 · 蛙類',hint:'榕樹林中段的低枝，有一隻嘴巴色彩鮮艷的鳥。',kind:'consumer',color:'#d9b957'},
 {id:'boa',name:'蚺蛇',tag:'林下的緩行獵手',diet:'我會吃小型哺乳動物、鳥類和蜥蜴等動物，常在地面或樹枝附近尋找食物。',food:'小型哺乳動物 · 鳥類 · 蜥蜴',hint:'溪流北面的小徑旁，留意蜿蜒移動的棕色蛇身。',kind:'consumer',color:'#a28a60'},
 {id:'ocelot',name:'虎貓',tag:'有斑紋的小型美洲野貓',diet:'我主要吃小型齧齒動物，也會吃蜥蜴和蛇類。我會慢慢巡行，留意附近的動靜。',food:'小型齧齒動物 · 蜥蜴 · 蛇類',hint:'西北面的林下空地，找找身形修長、帶斑紋的小型野貓。',kind:'consumer',color:'#b79862'},
 {id:'jaguar',name:'美洲豹',tag:'帶玫瑰斑的大型獵手',diet:'我的食物包括西貒、無尾刺豚鼠、長鼻浣熊和鬣蜥等動物，也可能捕食貘和其他野貓。',food:'西貒 · 無尾刺豚鼠 · 長鼻浣熊 · 鬣蜥',hint:'北面林冠觀察地旁，有一隻體型健壯、帶玫瑰斑的大貓。',kind:'consumer',top:true,color:'#c29b50'}
];
export const byId=Object.fromEntries(species.map(s=>[s.id,s]));
export const animalSpecies=species.filter(s=>s.kind==='consumer');
// Direction: food → consumer. This is a simplified, explicitly group-level teaching model.
export const edges=[['broadleaf','grasshopper'],['fig','grasshopper'],['broadleaf','iguana'],['fig','iguana'],['broadleaf','sloth'],['fig','sloth'],['grasshopper','frog'],['grasshopper','owl'],['frog','owl'],['iguana','harpy'],['sloth','harpy'],['fig','agouti'],['fig','paca'],['broadleaf','tapir'],['fig','tapir'],['fig','peccary'],['fig','coati'],['fig','toucan'],['grasshopper','coati'],['frog','coati'],['grasshopper','toucan'],['frog','toucan'],['agouti','boa'],['iguana','boa'],['agouti','ocelot'],['paca','ocelot'],['iguana','ocelot'],['boa','ocelot'],['boa','harpy'],['toucan','boa'],['tapir','jaguar'],['peccary','jaguar'],['paca','jaguar'],['agouti','jaguar'],['coati','jaguar'],['iguana','jaguar'],['ocelot','jaguar']];
export const sources=[
 ['樹蛙食性','https://www.rainforest-alliance.org/species/tree-frog/'],
 ['眼鏡鴞食性','https://www.sfzoo.org/spectacled-owl/'],
 ['角雕食性','https://peregrinefund.org/explore-raptors-species/eagles/harpy-eagle'],
 ['綠鬣蜥食性','https://animaldiversity.org/accounts/Iguana_iguana/'],
 ['刺豚鼠食性','https://animals.sandiegozoo.org/animals/agouti'],
 ['無尾刺豚鼠食性','https://lazoo.org/explore-your-zoo/our-animals/mammals/lowland-paca/'],
 ['中美貘食性','https://www.belizezoo.org/central-american-tapir/'],
 ['領西貒食性','https://www.rainforest-alliance.org/species/peccary/'],
 ['長鼻浣熊食性','https://animals.sandiegozoo.org/animals/coati'],
 ['巨嘴鳥食性','https://www.rainforest-alliance.org/species/keel-billed-toucan/'],
 ['蚺蛇食性','https://animals.sandiegozoo.org/animals/boa'],
 ['虎貓食性','https://animals.sandiegozoo.org/animals/ocelot'],
 ['美洲豹食性','https://www.belizezoo.org/jaguar/'],
 ['樹懶食性','https://www.lpzoo.org/animals/hoffmanns-two-toed-sloth/']
];
export function checkChain(ids,discovered){
 if(ids.length<3)return {status:'error',message:'先放入至少三張卡片，再試試連起食物鏈。'};
 if(ids.some(id=>!byId[id]||!discovered.includes(id)))return {status:'error',message:'請先走近生物，收集牠的觀察卡。'};
 if(new Set(ids).size!==ids.length)return {status:'error',message:'同一條食物鏈中，每種生物只使用一次。'};
 if(byId[ids[0]].kind!=='producer')return {status:'error',index:0,message:'想想食物鏈從哪裡開始。先找能自行製造養分的生物。'};
 for(let i=0;i<ids.length-1;i++)if(!edges.some(e=>e[0]===ids[i]&&e[1]===ids[i+1]))return {status:'error',index:i+1,message:`再看看「${byId[ids[i+1]].name}」的食性卡：牠會吃前面的生物嗎？`};
 if(!byId[ids.at(-1)].top)return {status:'partial',message:'這段食物關係正確！再探索一下，還有誰會吃最後的生物？'};
 return {status:'success',message:'食物鏈成立！箭頭由被吃的生物，指向吃牠的生物。',levels:ids.map((id,i)=>i===0?'生產者':`${['','一','二','三','四'][i]}級消費者${byId[id].top?' · 模型頂端':''}`)};
}
export const STORAGE='rainforest-quest-v1';
export function cleanSave(value){
 const v=value&&typeof value==='object'?value:{};
 const discovered=[...new Set((Array.isArray(v.discovered)?v.discovered:[]).filter(x=>byId[x]))];
 const chains=(Array.isArray(v.chains)?v.chains:[]).filter(c=>Array.isArray(c)&&checkChain(c,discovered).status==='success');
 return {version:1,discovered,chains:[...new Map(chains.map(c=>[c.join('>'),c])).values()],arrow:!!v.arrow,muted:v.muted!==false,quality:v.quality==='low'?'low':'high'};
}
