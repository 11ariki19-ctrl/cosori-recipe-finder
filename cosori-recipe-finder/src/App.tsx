import { useMemo, useState } from 'react'
import { Search, Heart, Clock3, Thermometer, Users, SlidersHorizontal, X, ChefHat, ArrowUpRight, Sparkles, Utensils, BookmarkCheck } from 'lucide-react'
import { recipes, type Recipe } from './recipes'

const categories = ['すべて', '肉料理', '魚料理', '野菜', 'おつまみ', '朝食', 'スイーツ']
const formatSource = (recipe: Recipe) => recipe.sourceType === 'official' ? 'COSORI公式' : 'オリジナル'

function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('すべて')
  const [maxMinutes, setMaxMinutes] = useState('すべて')
  const [source, setSource] = useState('すべて')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('cosori-favorites') || '[]') as string[] } catch { return [] }
  })
  const [selected, setSelected] = useState<Recipe | null>(null)

  const toggleFavorite = (id: string) => {
    setFavorites(current => {
      const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id]
      localStorage.setItem('cosori-favorites', JSON.stringify(next))
      return next
    })
  }

  const filtered = useMemo(() => recipes.filter(recipe => {
    const haystack = [recipe.title, recipe.category, recipe.description, ...recipe.ingredients, ...recipe.tags].join(' ').toLowerCase()
    const matchesQuery = query.trim() === '' || haystack.includes(query.trim().toLowerCase())
    const matchesCategory = category === 'すべて' || recipe.category === category
    const matchesTime = maxMinutes === 'すべて' || recipe.minutes <= Number(maxMinutes)
    const matchesSource = source === 'すべて' || recipe.sourceType === source
    return matchesQuery && matchesCategory && matchesTime && matchesSource && (!favoritesOnly || favorites.includes(recipe.id))
  }), [query, category, maxMinutes, source, favoritesOnly, favorites])

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#" aria-label="COSORI TABLE ホーム"><span className="brand-mark"><Utensils size={21}/></span><span>COSORI <b>TABLE</b><small> AIR FRYER RECIPE FINDER</small></span></a>
      <button className={`favorite-nav ${favoritesOnly ? 'active' : ''}`} onClick={() => setFavoritesOnly(v => !v)}><Heart size={17} fill={favoritesOnly ? 'currentColor' : 'none'}/> お気に入り <span>{favorites.length}</span></button>
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
        <div className="filter-row">
          <div className="filter-label"><SlidersHorizontal size={16}/> 絞り込み</div>
          <select value={maxMinutes} onChange={e => setMaxMinutes(e.target.value)} aria-label="調理時間"><option value="すべて">調理時間：すべて</option><option value="10">10分以内</option><option value="15">15分以内</option><option value="20">20分以内</option><option value="30">30分以内</option></select>
          <select value={source} onChange={e => setSource(e.target.value)} aria-label="レシピの種類"><option value="すべて">レシピの種類：すべて</option><option value="official">COSORI公式</option><option value="original">オリジナル</option></select>
          {(query || category !== 'すべて' || maxMinutes !== 'すべて' || source !== 'すべて' || favoritesOnly) && <button className="reset-button" onClick={() => {setQuery('');setCategory('すべて');setMaxMinutes('すべて');setSource('すべて');setFavoritesOnly(false)}}>条件をリセット</button>}
        </div>
        <div className="category-pills">{categories.map(c => <button key={c} className={category === c ? 'pill selected' : 'pill'} onClick={() => setCategory(c)}>{c}</button>)}</div>
      </section>

      <section className="recipe-section">
        <div className="recipe-section-title"><h2>{favoritesOnly ? 'お気に入りレシピ' : 'おすすめレシピ'}</h2><span>{filtered.length}件</span></div>
        {filtered.length ? <div className="recipe-grid">{filtered.map((recipe, i) => <article className="recipe-card" key={recipe.id} style={{animationDelay: `${i * 35}ms`}}>
          <button className="recipe-art" style={{background: recipe.color}} onClick={() => setSelected(recipe)} aria-label={`${recipe.title}の詳細を開く`}><span className="food-emoji">{recipe.emoji}</span><span className="art-label">{recipe.category}</span><span className="open-arrow"><ArrowUpRight size={18}/></span></button>
          <button className={`heart-button ${favorites.includes(recipe.id) ? 'saved' : ''}`} onClick={() => toggleFavorite(recipe.id)} aria-label={favorites.includes(recipe.id) ? 'お気に入りを解除' : 'お気に入りに追加'}><Heart size={17} fill={favorites.includes(recipe.id) ? 'currentColor' : 'none'}/></button>
          <div className="recipe-info"><div className="recipe-meta"><span className={recipe.sourceType === 'official' ? 'source official' : 'source'}>{formatSource(recipe)}</span><span className="difficulty">{recipe.difficulty}</span></div><button className="recipe-title" onClick={() => setSelected(recipe)}>{recipe.title}</button><p className="recipe-description">{recipe.description}</p><div className="recipe-bottom"><span><Clock3 size={15}/>{recipe.minutes}分</span><span><Thermometer size={15}/>{recipe.temperature}℃</span><button onClick={() => setSelected(recipe)}>作り方を見る <ArrowUpRight size={14}/></button></div></div>
        </article>)}</div> : <div className="empty-state"><span>🥣</span><h3>レシピが見つかりませんでした</h3><p>検索ワードや絞り込み条件を変えてみてください。</p><button className="primary-button" onClick={() => {setQuery('');setCategory('すべて');setMaxMinutes('すべて');setSource('すべて');setFavoritesOnly(false)}}>すべてのレシピを見る</button></div>}
      </section>

      <section className="source-note"><div className="note-icon"><BookmarkCheck size={20}/></div><div><b>レシピの出典について</b><p>現在の初期データはオリジナルレシピです。公式レシピは掲載元と利用条件を確認後、出典リンクとともに追加できます。</p></div></section>
    </main>
    <footer><a className="footer-brand" href="#">COSORI <b>TABLE</b></a><span>Cook simply. Eat happily.</span><small>※ 温度・時間は目安です。お使いの機種の取扱説明書を確認してください。</small></footer>

    {selected && <div className="modal-backdrop" role="presentation" onMouseDown={e => {if(e.target === e.currentTarget) setSelected(null)}}><section className="recipe-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button className="modal-close" onClick={() => setSelected(null)} aria-label="閉じる"><X size={20}/></button>
      <div className="modal-art" style={{background: selected.color}}><span>{selected.emoji}</span><div><span>{selected.category}</span><h2 id="modal-title">{selected.title}</h2></div></div>
      <div className="modal-body"><p className="modal-description">{selected.description}</p><div className="detail-stats"><span><Clock3 size={17}/><small>調理時間</small><b>{selected.minutes}分</b></span><span><Thermometer size={17}/><small>設定温度の目安</small><b>{selected.temperature}℃</b></span><span><Users size={17}/><small>分量</small><b>{selected.servings}人分</b></span></div>
      <div className="modal-columns"><div><h3>材料 <small>{selected.servings}人分</small></h3><ul className="ingredient-list">{selected.ingredients.map((item, i) => <li key={i}>{item}</li>)}</ul></div><div><h3>作り方</h3><ol className="step-list">{selected.steps.map((step, i) => <li key={i}><span>{String(i+1).padStart(2,'0')}</span><p>{step}</p></li>)}</ol></div></div>
      <div className="safety-note">温度と時間は目安です。食材の大きさや機種によって調整し、中心まで十分に加熱してください。</div>
      <button className={`save-recipe ${favorites.includes(selected.id) ? 'is-saved' : ''}`} onClick={() => toggleFavorite(selected.id)}><Heart size={17} fill={favorites.includes(selected.id) ? 'currentColor' : 'none'}/>{favorites.includes(selected.id) ? 'お気に入りに保存済み' : 'お気に入りに保存'}</button>
      </div>
    </section></div>}
  </div>
}

export default App
