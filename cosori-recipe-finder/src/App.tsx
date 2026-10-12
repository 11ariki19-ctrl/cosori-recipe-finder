import { useMemo, useState } from 'react'
import { Search, Heart, Clock3, Thermometer, Users, SlidersHorizontal, X, ChefHat, ArrowUpRight, Sparkles, Utensils, BookmarkCheck } from 'lucide-react'
import { recipes, type Recipe } from './recipes'
import ExternalSources from './ExternalSources'

const categories = ['すべて', '肉料理', '魚料理', '野菜', 'おつまみ', '朝食', 'スイーツ']
const formatSource = (recipe: Recipe) => recipe.sourceType === 'official' ? 'COSORI公式' : 'オリジナル'

function App() {
  const [customRecipes, setCustomRecipes] = useState<Recipe[]>(() => { try { const v = JSON.parse(localStorage.getItem('cosori-custom-recipes-v1') || '[]'); return Array.isArray(v) ? v : [] } catch { return [] } })
  const [editorOpen, setEditorOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('肉料理')
  const [newDescription, setNewDescription] = useState('')
  const [newIngredients, setNewIngredients] = useState('')
  const [newSteps, setNewSteps] = useState('')
  const [newMinutes, setNewMinutes] = useState('15')
  const [newTemperature, setNewTemperature] = useState('180')
  const [newServings, setNewServings] = useState('2')
  const [libraryMessage, setLibraryMessage] = useState('')
  const allRecipes = useMemo(() => [...recipes, ...customRecipes], [customRecipes])
  const [query, setQuery] = useState('')
  const [pantry, setPantry] = useState('')
  const [shoppingOpen, setShoppingOpen] = useState(false)
  const [shoppingItems, setShoppingItems] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('cosori-shopping') || '[]') as string[] } catch { return [] } })
  const [checkedShopping, setCheckedShopping] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('cosori-shopping-checked') || '[]') as string[] } catch { return [] } })
  const [servingCount, setServingCount] = useState(2)
  const [category, setCategory] = useState('すべて')
  const [maxMinutes, setMaxMinutes] = useState('すべて')
  const [source, setSource] = useState('すべて')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('cosori-favorites') || '[]') as string[] } catch { return [] }
  })
  const [selected, setSelected] = useState<Recipe | null>(null)

  function saveCustomRecipe() {
    if (!newTitle.trim()) { setLibraryMessage('料理名を入力してください。'); return }
    const ingredients = newIngredients.split(/\\n/).map(x=>x.trim()).filter(Boolean)
    const steps = newSteps.split(/\\n/).map(x=>x.trim()).filter(Boolean)
    const item: Recipe = { id: `custom-${Date.now()}`, title:newTitle.trim(), category:newCategory, sourceType:'original', sourceName:'ユーザー創作レシピ', minutes:Math.max(1,Number(newMinutes)||15), temperature: newTemperature.trim()==='' ? null : Math.max(0,Number(newTemperature)||0), servings:Math.max(1,Number(newServings)||2), difficulty:'かんたん', description:newDescription.trim()||'ユーザーが登録した創作レシピ。', ingredients, steps, tags:['創作','ユーザー登録',...ingredients.map(x=>x.split(/[ 　]/)[0]).filter(Boolean)], emoji:'🍳', color:'#f8eadc' }
    const next=[item,...customRecipes]
    setCustomRecipes(next)
    try { localStorage.setItem('cosori-custom-recipes-v1',JSON.stringify(next)); setLibraryMessage('レシピを登録しました。上の検索欄から探せます。'); setNewTitle('');setNewDescription('');setNewIngredients('');setNewSteps('');setEditorOpen(false) } catch { setLibraryMessage('保存できませんでした。ブラウザの保存容量を確認してください。') }
  }
  function exportRecipeJson() {
    const payload={format:'cosori-recipe-library',version:1,exportedAt:new Date().toISOString(),customRecipes}
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json;charset=utf-8'})
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='cosori-recipe-library.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
  }
  async function importRecipeJson(event: React.ChangeEvent<HTMLInputElement>) {
    const file=event.target.files?.[0];if(!file)return
    try {
      const parsed=JSON.parse(await file.text())
      const incoming=Array.isArray(parsed)?parsed:parsed.customRecipes
      if(!Array.isArray(incoming)||!incoming.every((r:any)=>r&&typeof r.title==='string'&&typeof r.category==='string'&&Array.isArray(r.ingredients)&&Array.isArray(r.steps))) throw new Error('format')
      const normalized:Recipe[]=incoming.map((r:any,i:number)=>({...r,id:typeof r.id==='string'?r.id:`import-${Date.now()}-${i}`,sourceType:'original',sourceName:r.sourceName||'インポートしたレシピ',temperature:typeof r.temperature==='number'?r.temperature:null,tags:Array.isArray(r.tags)?r.tags:[],minutes:Math.max(1,Number(r.minutes)||15),servings:Math.max(1,Number(r.servings)||2),difficulty:r.difficulty==='ふつう'?'ふつう':'かんたん',description:typeof r.description==='string'?r.description:'インポートしたレシピ',emoji:typeof r.emoji==='string'?r.emoji:'🍳',color:typeof r.color==='string'?r.color:'#f8eadc'}))
      const existing=new Set(customRecipes.map(r=>r.title+'|'+r.ingredients.join('|')))
      const additions=normalized.filter(r=>!existing.has(r.title+'|'+r.ingredients.join('|')))
      const next=[...additions,...customRecipes];setCustomRecipes(next);localStorage.setItem('cosori-custom-recipes-v1',JSON.stringify(next));setLibraryMessage(`${additions.length}件を取り込みました（重複は除外）。`)
    } catch { setLibraryMessage('読み込みに失敗しました。COSORIのJSONバックアップを選択してください。') }
    event.target.value=''
  }

  const saveShopping = (next: string[]) => { setShoppingItems(next); localStorage.setItem('cosori-shopping', JSON.stringify(next)) }
  const addRecipeToShopping = (recipe: Recipe) => { const next = [...new Set([...shoppingItems, ...recipe.ingredients])]; saveShopping(next); setShoppingOpen(true) }
  const toggleShoppingCheck = (item: string) => { const next = checkedShopping.includes(item) ? checkedShopping.filter(x => x !== item) : [...checkedShopping, item]; setCheckedShopping(next); localStorage.setItem('cosori-shopping-checked', JSON.stringify(next)) }
  const toggleFavorite = (id: string) => {
    setFavorites(current => {
      const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id]
      localStorage.setItem('cosori-favorites', JSON.stringify(next))
      return next
    })
  }

  const filtered = useMemo(() => allRecipes.filter(recipe => {
    const haystack = [recipe.title, recipe.category, recipe.description, ...recipe.ingredients, ...recipe.tags].join(' ').toLowerCase()
    const matchesQuery = query.trim() === '' || haystack.includes(query.trim().toLowerCase())
    const pantryTerms = pantry.split(/[、,，\s]+/).map(x => x.trim().toLowerCase()).filter(Boolean)
    const ingredientHaystack = [...recipe.ingredients, ...recipe.tags, recipe.title].join(' ').toLowerCase()
    const matchesPantry = pantryTerms.length === 0 || pantryTerms.some(term => ingredientHaystack.includes(term))
    const matchesCategory = category === 'すべて' || recipe.category === category
    const matchesTime = maxMinutes === 'すべて' || recipe.minutes <= Number(maxMinutes)
    const matchesSource = source === 'すべて' || recipe.sourceType === source
    return matchesQuery && matchesPantry && matchesCategory && matchesTime && matchesSource && (!favoritesOnly || favorites.includes(recipe.id))
  }), [allRecipes, query, pantry, category, maxMinutes, source, favoritesOnly, favorites])

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#" aria-label="COSORI TABLE ホーム"><span className="brand-mark"><Utensils size={21}/></span><span>COSORI <b>TABLE</b><small> AIR FRYER RECIPE FINDER</small></span></a>
      <div className="nav-actions"><button className="favorite-nav" onClick={() => setShoppingOpen(v => !v)}>🛒 買い物リスト <span>{shoppingItems.length}</span></button><button className={`favorite-nav ${favoritesOnly ? 'active' : ''}`} onClick={() => setFavoritesOnly(v => !v)}><Heart size={17} fill={favoritesOnly ? 'currentColor' : 'none'}/> お気に入り <span>{favorites.length}</span></button></div>
    </header>

    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={14}/> EVERYDAY, DELICIOUSLY EASY</div>
          <h1>今日の「おいしい」を、<br/><em>エアフライヤー</em>から。</h1>
          <p>COSORIで作る、いつものごはんをもっと楽しく。<br className="desktop-break"/>食材や時間から、ぴったりのレシピを見つけよう。</p>
          <div className="hero-stats"><span><ChefHat size={16}/> レシピを探す</span><span><Clock3 size={16}/> 時間で絞り込む</span><span><Heart size={16}/> お気に入り保存</span></div>
        </div>
        <div className="hero-visual" aria-label="エアフライヤー料理のイメージ">
          <div className="hero-orbit orbit-one"></div><div className="hero-orbit orbit-two"></div>
          <div className="food-plate"><span>🍗</span><span>🥦</span><span>🥔</span><span>🍅</span></div>
          <div className="hero-sticker"><span>GOOD FOOD</span><b>MADE EASY.</b><small>LESS OIL, MORE JOY</small></div>
        </div>
      </section>

      <section className="search-section">
        <div className="section-heading"><div><span className="eyebrow orange">FIND YOUR FAVORITE</span><h2>どんなレシピにする？</h2></div><div className="result-count"><b>{filtered.length}</b> recipes</div></div>
        <div className="search-box"><Search size={21}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="料理名・食材で検索（例：鶏肉、じゃがいも）"/>{query && <button className="clear-search" onClick={() => setQuery('')} aria-label="検索をクリア"><X size={17}/></button>}<kbd>⌕</kbd></div>
        <div className="pantry-search"><label htmlFor="pantry-input">🥕 使いたい食材から探す</label><input id="pantry-input" value={pantry} onChange={e => setPantry(e.target.value)} placeholder="例：鶏肉、玉ねぎ、チーズ（複数入力OK）"/><small>入力した食材のいずれかを含むレシピを表示します。</small></div>\n        <div className="filter-row">
          <div className="filter-label"><SlidersHorizontal size={16}/> 絞り込み</div>
          <select value={maxMinutes} onChange={e => setMaxMinutes(e.target.value)} aria-label="調理時間"><option value="すべて">調理時間：すべて</option><option value="10">10分以内</option><option value="15">15分以内</option><option value="20">20分以内</option><option value="30">30分以内</option></select>
          <select value={source} onChange={e => setSource(e.target.value)} aria-label="レシピの種類"><option value="すべて">レシピの種類：すべて</option><option value="official">COSORI公式</option><option value="original">オリジナル</option></select>
          {(query || category !== 'すべて' || maxMinutes !== 'すべて' || source !== 'すべて' || favoritesOnly) && <button className="reset-button" onClick={() => {setQuery('');setPantry('');setCategory('すべて');setMaxMinutes('すべて');setSource('すべて');setFavoritesOnly(false)}}>条件をリセット</button>}
        </div>
        <div className="category-pills">{categories.map(c => <button key={c} className={category === c ? 'pill selected' : 'pill'} onClick={() => setCategory(c)}>{c}</button>)}</div>
      </section>

      <section className="recipe-section">
        <div className="recipe-section-title"><h2>{favoritesOnly ? 'お気に入りレシピ' : 'おすすめレシピ'}</h2><span>{filtered.length}件</span></div>
        {filtered.length ? <div className="recipe-grid">{filtered.map((recipe, i) => <article className="recipe-card" key={recipe.id} style={{animationDelay: `${i * 35}ms`}}>
          <button className="recipe-art" style={{background: recipe.color}} onClick={() => { setSelected(recipe); setServingCount(recipe.servings) }} aria-label={`${recipe.title}の詳細を開く`}><span className="food-emoji">{recipe.emoji}</span><span className="art-label">{recipe.category}</span><span className="open-arrow"><ArrowUpRight size={18}/></span></button>
          <button className={`heart-button ${favorites.includes(recipe.id) ? 'saved' : ''}`} onClick={() => toggleFavorite(recipe.id)} aria-label={favorites.includes(recipe.id) ? 'お気に入りを解除' : 'お気に入りに追加'}><Heart size={17} fill={favorites.includes(recipe.id) ? 'currentColor' : 'none'}/></button>
          <div className="recipe-info"><div className="recipe-meta"><span className={recipe.sourceType === 'official' ? 'source official' : 'source'}>{formatSource(recipe)}</span><span className="difficulty">{recipe.difficulty}</span></div><button className="recipe-title" onClick={() => { setSelected(recipe); setServingCount(recipe.servings) }}>{recipe.title}</button><p className="recipe-description">{recipe.description}</p><div className="recipe-bottom"><span><Clock3 size={15}/>{recipe.minutes}分</span><span><Thermometer size={15}/>{recipe.temperature == null ? '公式ページ参照' : `${recipe.temperature}℃`}</span><button onClick={() => setSelected(recipe)}>作り方を見る <ArrowUpRight size={14}/></button></div></div>
        </article>)}</div> : <div className="empty-state"><span>🥣</span><h3>レシピが見つかりませんでした</h3><p>検索ワードや絞り込み条件を変えてみてください。</p><button className="primary-button" onClick={() => {setQuery('');setCategory('すべて');setMaxMinutes('すべて');setSource('すべて');setFavoritesOnly(false)}}>すべてのレシピを見る</button></div>}
      </section>

      <section className="recipe-tools">
        <div className="section-heading"><div><span className="eyebrow orange">YOUR RECIPE LIBRARY</span><h2>創作レシピ・データ管理</h2></div><span className="result-count"><b>{allRecipes.length}</b> 件登録</span></div>
        <p>自分で考えた料理を登録すると、上のレシピ検索・食材検索・お気に入りに追加されます。データはこのブラウザに保存されます。</p>
        <div className="recipe-tool-actions"><button className="primary-button" onClick={() => {setEditorOpen(v => !v);setLibraryMessage('')}}>{editorOpen ? '入力フォームを閉じる' : '＋ 創作レシピを登録'}</button><button className="reset-button" onClick={exportRecipeJson}>JSONバックアップを出力</button><label className="import-json-button">JSONを読み込む<input type="file" accept=".json,application/json" onChange={importRecipeJson} hidden /></label></div>
        {libraryMessage && <p className="library-message" role="status">{libraryMessage}</p>}
        {editorOpen && <div className="recipe-editor">
          <label>料理名<input value={newTitle} onChange={e=>setNewTitle(e.target.value)} placeholder="例：味噌チーズ焼きおにぎり" /></label>
          <label>分類<select value={newCategory} onChange={e=>setNewCategory(e.target.value)}>{categories.filter(x=>x!=='すべて').map(x=><option key={x}>{x}</option>)}</select></label>
          <label>料理の説明<textarea value={newDescription} onChange={e=>setNewDescription(e.target.value)} placeholder="味や工夫、創作した理由など" rows={2}/></label>
          <label>材料（1行に1つ）<textarea value={newIngredients} onChange={e=>setNewIngredients(e.target.value)} placeholder={'ごはん 200g\n味噌 小さじ1\nチーズ 20g'} rows={4}/></label>
          <label>作り方（1行に1手順）<textarea value={newSteps} onChange={e=>setNewSteps(e.target.value)} placeholder={'材料を混ぜる\n形を整える\n加熱して焼き色をつける'} rows={4}/></label>
          <div className="recipe-editor-numbers"><label>調理時間（分）<input type="number" min="1" max="600" value={newMinutes} onChange={e=>setNewMinutes(e.target.value)}/></label><label>温度（℃）<input type="number" min="0" max="250" value={newTemperature} onChange={e=>setNewTemperature(e.target.value)}/></label><label>人数<input type="number" min="1" max="50" value={newServings} onChange={e=>setNewServings(e.target.value)}/></label></div>
          <button className="primary-button" onClick={saveCustomRecipe}>レシピを登録する</button>
        </div>}
      </section>
      <ExternalSources recipes={allRecipes} />

      <section className="source-note"><div className="note-icon"><BookmarkCheck size={20}/></div><div><b>レシピの出典について</b><p>「COSORI公式」と表示されたレシピは、VeSync Japan公式レシピ一覧に掲載されたタイトル・所要時間を登録しています。材料・温度・手順は公式ページでご確認ください。</p><a href="https://vesync.jp/pages/recipe" target="_blank" rel="noreferrer">COSORI公式レシピ一覧を開く ↗</a></div></section>
    </main>
    <footer><a className="footer-brand" href="#">COSORI <b>TABLE</b></a><span>Cook simply. Eat happily.</span><small>※ 温度・時間は目安です。お使いの機種の取扱説明書を確認してください。</small></footer>

    {shoppingOpen && <div className="modal-backdrop" role="presentation" onMouseDown={e => {if(e.target === e.currentTarget) setShoppingOpen(false)}}><section className="recipe-modal shopping-modal" role="dialog" aria-modal="true" aria-labelledby="shopping-title"><button className="modal-close" onClick={() => setShoppingOpen(false)} aria-label="閉じる"><X size={20}/></button><div className="modal-body"><h2 id="shopping-title">🛒 買い物リスト</h2><p className="modal-description">レシピ詳細の「買い物リストに追加」から材料を集められます。この端末のブラウザに保存されます。</p>{shoppingItems.length ? <><ul className="shopping-list">{shoppingItems.map(item => <li key={item}><label><input type="checkbox" checked={checkedShopping.includes(item)} onChange={() => toggleShoppingCheck(item)}/><span className={checkedShopping.includes(item) ? 'shopping-done' : ''}>{item}</span></label><button onClick={() => {saveShopping(shoppingItems.filter(x => x !== item));setCheckedShopping(checkedShopping.filter(x => x !== item));localStorage.setItem('cosori-shopping-checked',JSON.stringify(checkedShopping.filter(x => x !== item)))}}>削除</button></li>)}</ul><div className="shopping-actions"><button className="primary-button" onClick={() => {saveShopping([]);setCheckedShopping([]);localStorage.setItem('cosori-shopping-checked','[]')}}>リストを空にする</button><button className="reset-button" onClick={() => GenUICopyShopping(shoppingItems)}>リストをコピー</button></div></> : <p>まだ材料がありません。レシピ詳細から追加してください。</p>}</div></section></div>}
    {selected && <div className="modal-backdrop" role="presentation" onMouseDown={e => {if(e.target === e.currentTarget) setSelected(null)}}><section className="recipe-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button className="modal-close" onClick={() => setSelected(null)} aria-label="閉じる"><X size={20}/></button>
      <div className="modal-art" style={{background: selected.color}}><span>{selected.emoji}</span><div><span>{selected.category}</span><h2 id="modal-title">{selected.title}</h2></div></div>
      <div className="modal-body"><p className="modal-description">{selected.description}</p><div className="detail-stats"><span><Clock3 size={17}/><small>調理時間</small><b>{selected.minutes}分</b></span><span><Thermometer size={17}/><small>設定温度の目安</small><b>{selected.temperature == null ? '公式ページ参照' : `${selected.temperature}℃`}</b></span><span><Users size={17}/><small>分量</small><b>{selected.servings}人分</b></span></div>
      <div className="serving-control"><span>人数を変更</span><button onClick={() => setServingCount(n => Math.max(1,n-1))} disabled={servingCount <= 1}>−</button><b>{servingCount}人分</b><button onClick={() => setServingCount(n => Math.min(20,n+1))}>＋</button><button className="reset-button" onClick={() => setServingCount(selected.servings)}>元の人数</button></div><div className="modal-columns"><div><h3>材料 <small>{servingCount}人分</small></h3>{selected.sourceType === 'official' && selected.ingredients.length === 0 ? <p className="official-hint">公式ページで材料を確認してください。</p> : <ul className="ingredient-list">{selected.ingredients.map((item, i) => <li key={i}>{scaleIngredient(item, selected.servings, servingCount)}</li>)}</ul>}</div><div><h3>作り方</h3>{selected.sourceType === 'official' && selected.steps.length === 0 ? <p className="official-hint">公式レシピの内容を推測で転載しないため、公式ページで手順を確認してください。</p> : <ol className="step-list">{selected.steps.map((step, i) => <li key={i}><span>{String(i+1).padStart(2,'0')}</span><p>{step}</p></li>)}</ol>}</div></div>
      <div className="safety-note">温度と時間は目安です。食材の大きさや機種によって調整し、中心まで十分に加熱してください。</div>
      {selected.sourceUrl && <a className="official-source-link" href={selected.sourceUrl} target="_blank" rel="noreferrer">出典：{selected.sourceName} — 公式レシピを開く ↗</a>}<button className="add-shopping" onClick={() => addRecipeToShopping(selected)} disabled={!selected.ingredients.length}>🛒 材料を買い物リストに追加</button><button className={`save-recipe ${favorites.includes(selected.id) ? 'is-saved' : ''}` } onClick={() => toggleFavorite(selected.id)}><Heart size={17} fill={favorites.includes(selected.id) ? 'currentColor' : 'none'}/>{favorites.includes(selected.id) ? 'お気に入りに保存済み' : 'お気に入りに保存'}</button>
      </div>
    </section></div>}
  </div>
}

function scaleIngredient(item: string, originalServings: number, targetServings: number) {
  const ratio = targetServings / Math.max(1, originalServings)
  return item.replace(/\d+(?:\.\d+)?/g, match => {
    const n = Number(match) * ratio
    return Number.isInteger(n) ? String(n) : String(Math.round(n * 10) / 10)
  })
}

function GenUICopyShopping(items: string[]) {
  const text = items.join('\n')
  if (navigator.clipboard?.writeText) void navigator.clipboard.writeText(text)
}

export default App
