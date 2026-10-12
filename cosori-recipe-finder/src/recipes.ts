export type Recipe = {
  id: string
  title: string
  category: string
  sourceType: 'original' | 'official'
  sourceName: string
  sourceUrl?: string
  minutes: number
  temperature: number
  servings: number
  difficulty: 'かんたん' | 'ふつう'
  description: string
  ingredients: string[]
  steps: string[]
  tags: string[]
  emoji: string
  color: string
}

// 温度・時間は試作上の目安です。食材の厚みや機種に応じて調整してください。
// official のレシピは、掲載元の確認が完了してから出典URLと内容を登録してください。
export const recipes: Recipe[] = [
  { id:'karaage', title:'ジューシー鶏のから揚げ', category:'肉料理', sourceType:'original', sourceName:'オリジナルレシピ', minutes:22, temperature:190, servings:2, difficulty:'かんたん', description:'外はカリッと、中はジューシー。油を控えめに楽しむ定番おかず。', ingredients:['鶏もも肉 300g','しょうゆ 大さじ1','酒 大さじ1','おろししょうが 小さじ1','片栗粉 大さじ3','サラダ油 少量'], steps:['鶏肉をひと口大に切り、しょうゆ・酒・しょうがを揉み込み15分置く。','汁気を軽く切って片栗粉をまぶし、表面に油を薄く吹きかける。','バスケットに重ならないように並べ、190℃で約10〜12分加熱する。','裏返してさらに8〜10分加熱し、中心まで十分に火が通ったことを確認する。'], tags:['鶏肉','から揚げ','夕食','人気'], emoji:'🍗', color:'#fff0df' },
  { id:'potato', title:'ほくほくフライドポテト', category:'野菜', sourceType:'original', sourceName:'オリジナルレシピ', minutes:25, temperature:195, servings:2, difficulty:'かんたん', description:'じゃがいもから作る、外カリ中ほくのポテト。', ingredients:['じゃがいも 2個','オリーブオイル 小さじ2','塩 少々','黒こしょう お好みで'], steps:['じゃがいもをスティック状に切り、水に10分さらす。','水気をよく拭き、オイルと和える。','195℃で約15分加熱し、途中でバスケットを振る。','焼き色を見ながら追加加熱し、塩を振る。'], tags:['じゃがいも','ベジタリアン','おやつ','子ども'], emoji:'🍟', color:'#fff4c9' },
  { id:'salmon', title:'鮭のハーブ焼き', category:'魚料理', sourceType:'original', sourceName:'オリジナルレシピ', minutes:14, temperature:180, servings:2, difficulty:'かんたん', description:'ハーブとレモンで香りよく。忙しい日のメインにも。', ingredients:['生鮭 2切れ','オリーブオイル 小さじ1','塩・こしょう 少々','乾燥ハーブ 少々','レモン 2切れ'], steps:['鮭の水気を拭き、塩・こしょう・ハーブを振る。','オイルを薄く塗り、クッキングシート対応可否を取扱説明書で確認してセットする。','180℃で約8〜12分を目安に加熱する。','中心まで十分に加熱されたことを確認し、レモンを添える。'], tags:['鮭','魚','高たんぱく','時短'], emoji:'🐟', color:'#e5f4ef' },
  { id:'gyoza', title:'パリパリ焼き餃子', category:'おつまみ', sourceType:'original', sourceName:'オリジナルレシピ', minutes:13, temperature:190, servings:2, difficulty:'かんたん', description:'冷凍餃子を手軽に。皮の焼き目を見ながら調整。', ingredients:['冷凍餃子 8〜10個','油スプレー 少量','水 小さじ2（必要に応じて）'], steps:['餃子の表面に薄く油を吹きかける。','バスケットに間隔を空けて並べる。','190℃で約8分加熱し、裏返して3〜5分追加する。','商品表示に従い、中まで十分に加熱されていることを確認する。'], tags:['冷凍食品','餃子','おつまみ','時短'], emoji:'🥟', color:'#fce8e5' },
  { id:'chicken-wings', title:'手羽中の甘辛焼き', category:'肉料理', sourceType:'original', sourceName:'オリジナルレシピ', minutes:23, temperature:190, servings:2, difficulty:'ふつう', description:'甘辛だれを絡めた、ごはんにも合う一品。', ingredients:['鶏手羽中 300g','しょうゆ 大さじ1','みりん 大さじ1','はちみつ 小さじ1','おろしにんにく 少々'], steps:['手羽中の水分を拭き、調味料の半量を揉み込む。','190℃で約10分加熱し、裏返す。','さらに8〜10分加熱し、中心まで十分に火を通す。','残りのたれを少量ずつ絡め、焦げないよう短時間追加加熱する。'], tags:['鶏肉','甘辛','お弁当','夕食'], emoji:'🍖', color:'#f8e7d8' },
  { id:'vegetables', title:'彩り野菜のロースト', category:'野菜', sourceType:'original', sourceName:'オリジナルレシピ', minutes:16, temperature:185, servings:2, difficulty:'かんたん', description:'野菜の甘みを引き出す、彩り豊かな副菜。', ingredients:['パプリカ 1個','ズッキーニ 1/2本','かぼちゃ 100g','オリーブオイル 大さじ1','塩・こしょう 少々'], steps:['野菜を食べやすい大きさに切る。','オイル・塩・こしょうを和える。','185℃で12〜16分を目安に加熱し、途中で混ぜる。','かぼちゃなど硬い野菜に火が通ったか確認する。'], tags:['野菜','ヘルシー','副菜','ベジタリアン'], emoji:'🥦', color:'#e8f2d7' },
  { id:'toast', title:'とろ〜りチーズトースト', category:'朝食', sourceType:'original', sourceName:'オリジナルレシピ', minutes:7, temperature:180, servings:1, difficulty:'かんたん', description:'朝食や軽食に。チーズの溶け具合を見ながら調整。', ingredients:['食パン 1枚','ピザ用チーズ 20g','ミニトマト 2個','黒こしょう 少々'], steps:['パンにチーズと半分に切ったトマトをのせる。','180℃で4〜7分を目安に加熱する。','チーズが溶けてパンに焼き色がついたら取り出す。'], tags:['パン','チーズ','朝食','時短'], emoji:'🍞', color:'#fff0c2' },
  { id:'shrimp', title:'ガーリックシュリンプ', category:'魚料理', sourceType:'original', sourceName:'オリジナルレシピ', minutes:10, temperature:180, servings:2, difficulty:'かんたん', description:'にんにくの香りが食欲をそそる、簡単シーフード。', ingredients:['むきえび 200g','オリーブオイル 小さじ2','にんにく 1片','塩・こしょう 少々','パセリ 少々'], steps:['えびの水気を拭き、刻んだにんにく・オイル・調味料と和える。','耐熱対応の器具を使用する場合は機種の説明書を確認する。','180℃で6〜10分を目安に加熱し、途中で混ぜる。','えびの中心まで火が通ったことを確認し、パセリを散らす。'], tags:['えび','シーフード','時短','おつまみ'], emoji:'🍤', color:'#ffe7dc' },
  { id:'mushroom', title:'きのこのガーリックソテー風', category:'野菜', sourceType:'original', sourceName:'オリジナルレシピ', minutes:12, temperature:180, servings:2, difficulty:'かんたん', description:'きのこの旨みとガーリックの香りを楽しむ副菜。', ingredients:['しめじ 1パック','エリンギ 1本','オリーブオイル 小さじ2','にんにく 少々','塩・こしょう 少々'], steps:['きのこを食べやすくほぐし、エリンギを薄切りにする。','オイルと調味料を和える。','180℃で8〜12分を目安に加熱し、途中で振る。','火の通りを確認して仕上げる。'], tags:['きのこ','野菜','副菜','低糖質'], emoji:'🍄', color:'#eee7dc' },
  { id:'pork', title:'豚こまのカリカリ焼き', category:'肉料理', sourceType:'original', sourceName:'オリジナルレシピ', minutes:15, temperature:190, servings:2, difficulty:'ふつう', description:'薄切り肉を広げて、香ばしく仕上げるおかず。', ingredients:['豚こま切れ肉 250g','しょうゆ 小さじ2','酒 小さじ2','片栗粉 大さじ1','ごま油 小さじ1'], steps:['豚肉に調味料を揉み込み、片栗粉をまぶす。','肉をなるべく広げてバスケットに並べる。','190℃で約7分加熱し、ほぐして裏返す。','さらに5〜8分加熱し、中心まで十分に火が通ったことを確認する。'], tags:['豚肉','お弁当','夕食','ごはん'], emoji:'🥩', color:'#f7e2df' },
  { id:'banana', title:'焼きバナナシナモン', category:'スイーツ', sourceType:'original', sourceName:'オリジナルレシピ', minutes:8, temperature:170, servings:2, difficulty:'かんたん', description:'材料少なめで楽しむ、温かい簡単デザート。', ingredients:['バナナ 2本','シナモン 少々','はちみつ お好みで'], steps:['バナナの皮をむき、縦半分に切る。','耐熱対応を確認した器具に並べる。','170℃で5〜8分を目安に焼き、柔らかくなったら取り出す。','シナモンとはちみつをかける。'], tags:['バナナ','デザート','おやつ','簡単'], emoji:'🍌', color:'#fff4bd' },
  { id:'tofu', title:'厚揚げの香ばし焼き', category:'おつまみ', sourceType:'original', sourceName:'オリジナルレシピ', minutes:12, temperature:190, servings:2, difficulty:'かんたん', description:'外側を香ばしく。薬味やポン酢でさっぱりと。', ingredients:['厚揚げ 1パック','ごま油 少々','小ねぎ 適量','ポン酢 適量'], steps:['厚揚げの表面の水分を拭き、食べやすく切る。','ごま油を薄く塗る。','190℃で8〜12分を目安に加熱し、途中で裏返す。','小ねぎとポン酢を添える。'], tags:['豆腐','大豆','おつまみ','時短'], emoji:'🍢', color:'#f4e9d7' },
]
