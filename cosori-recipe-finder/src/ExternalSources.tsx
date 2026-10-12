import { useState } from 'react'
import { ExternalLink, Search, Youtube, BookmarkPlus, Trash2 } from 'lucide-react'

import type { Recipe } from './recipes'

type SavedSource = { id: string; title: string; url: string; type: 'YouTube' | 'note' | 'その他'; savedAt: string }

const CURATED_REFERENCES = [
  { title: '暮らしDays：参考記事', url: 'https://ameblo.jp/kurashi-days/entry-12972607047.html', type: 'ブログ' },
  { title: 'YouTube参考動画 1', url: 'https://www.youtube.com/watch?v=7cv5mAaIUcw', type: 'YouTube' },
  { title: 'YouTube参考動画 2', url: 'https://www.youtube.com/watch?v=ToZyZYPkUCA', type: 'YouTube' },
]

const STORAGE_KEY = 'cosori-external-sources'

function readSources(): SavedSource[] {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(value) ? value : []
  } catch { return [] }
}

function classifyUrl(url: string): SavedSource['type'] {
  if (/youtube\.com|youtu\.be/i.test(url)) return 'YouTube'
  if (/note\.com/i.test(url)) return 'note'
  return 'その他'
}

export default function ExternalSources({ recipes }: { recipes: Recipe[] }) {
  const [term, setTerm] = useState('COSORI エアフライヤー レシピ')
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [sources, setSources] = useState<SavedSource[]>(readSources)
  const [error, setError] = useState('')

  const persist = (next: SavedSource[]) => {
    setSources(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }
  const exportText = () => {
    const recipeText = recipes.map((recipe, index) => [
      `【レシピ ${index + 1}】${recipe.title}`,
      `分類：${recipe.category}`,
      `種類：${recipe.sourceType === 'official' ? '公式' : 'オリジナル'}`,
      `出典：${recipe.sourceName}`,
      `出典URL：${recipe.sourceUrl || 'なし'}`,
      `調理時間：${recipe.minutes}分`,
      `温度：${recipe.temperature == null ? '未確認／出典参照' : recipe.temperature + '℃'}`,
      `人数：${recipe.servings}人分`,
      `説明：${recipe.description}`,
      `材料：\n${recipe.ingredients.length ? recipe.ingredients.map(x => '- ' + x).join('\n') : '未登録'}`,
      `手順：\n${recipe.steps.length ? recipe.steps.map((x, i) => (i + 1) + '. ' + x).join('\n') : '未登録'}`,
      `検索タグ：${recipe.tags.join('、')}`,
    ].join('\n')).join('\n\n' + '='.repeat(36) + '\n\n')
    const sourceText = sources.length ? sources.map((s, i) => `【外部リンク ${i + 1}】${s.title}\n種別：${s.type}\nURL：${s.url}\n保存日：${s.savedAt}`).join('\n\n') : '保存された外部リンクはありません。'
    const content = `COSORI TABLE レシピ情報テキスト出力\n出力日：${new Date().toLocaleString('ja-JP')}\n登録レシピ数：${recipes.length}\n\n${recipeText}\n\n【保存した外部リンク】\n${sourceText}\n\n注意：外部リンク先の動画・記事本文を自動取得したものではありません。未登録の材料・手順は「未登録」と表示しています。\n`
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const objectUrl = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = objectUrl
    anchor.download = `cosori-recipes-${new Date().toISOString().slice(0, 10)}.txt`
    anchor.click()
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
  }
  const searchUrl = (site: 'youtube' | 'note') => {
    const query = term.trim() || 'COSORI エアフライヤー レシピ'
    const q = site === 'youtube' ? query : `site:note.com ${query}`
    const target = site === 'youtube'
      ? `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
      : `https://www.google.com/search?q=${encodeURIComponent(q)}`
    window.open(target, '_blank', 'noopener,noreferrer')
  }
  const save = () => {
    const cleanUrl = url.trim()
    if (!/^https?:\/\//i.test(cleanUrl)) { setError('https:// から始まるURLを入力してください。'); return }
    try {
      const parsed = new URL(cleanUrl)
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('invalid')
      if (sources.some(item => item.url === parsed.href)) { setError('このURLはすでに保存されています。'); return }
      persist([{ id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, title: title.trim() || parsed.hostname, url: parsed.href, type: classifyUrl(parsed.href), savedAt: new Date().toISOString() }, ...sources])
      setUrl('')
      setTitle('')
      setError('')
    } catch { setError('有効なURLを入力してください。') }
  }

  return <section className="external-sources">
    <div className="external-heading"><div><span className="eyebrow orange">DISCOVER MORE RECIPES</span><h2>外部サイトからレシピを探す</h2></div><span className="external-count">{sources.length}件保存</span></div>
    <p className="external-intro">YouTube動画やnoteの記事を検索し、気になったレシピのURLをこの端末に保存できます。保存したリンクはあとから見返せます。</p>
    <button className="export-text-button" onClick={exportText}>登録レシピと保存リンクをテキスト出力（.txt）</button>
    <div className="saved-sources"><h3>今回追加した参考リンク</h3>{CURATED_REFERENCES.map(item => <article className="saved-source" key={item.url}><div><span className="source-tag source-tag-other">{item.type}</span><b>{item.title}</b><a href={item.url} target="_blank" rel="noreferrer">{item.url} <ExternalLink size={12}/></a></div></article>)}</div>
    <div className="external-search">
      <label htmlFor="external-term">検索キーワード</label>
      <input id="external-term" value={term} onChange={e => setTerm(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') searchUrl('youtube') }} placeholder="例：COSORI 鶏むね肉、ノンフライヤー お菓子" />
      <div className="external-search-actions">
        <button onClick={() => searchUrl('youtube')}><Youtube size={17}/> YouTubeで検索 <ExternalLink size={13}/></button>
        <button onClick={() => searchUrl('note')}><Search size={16}/> note記事を検索 <ExternalLink size={13}/></button>
      </div>
    </div>
    <div className="source-save-form">
      <div className="source-save-title"><BookmarkPlus size={17}/> 見つけたレシピを保存</div>
      <div className="source-save-fields"><input aria-label="レシピ名" value={title} onChange={e => setTitle(e.target.value)} placeholder="レシピ名（任意）"/><input aria-label="レシピURL" value={url} onChange={e => setUrl(e.target.value)} placeholder="YouTube / note のURLを貼り付け"/><button onClick={save}>保存する</button></div>
      {error && <p className="source-error" role="alert">{error}</p>}
      <small>この機能はリンクとタイトルを保存します。動画や記事の材料・手順を自動転載するものではありません。</small>
    </div>
    {sources.length > 0 && <div className="saved-sources"><h3>保存した外部レシピ</h3>{sources.map(item => <article className="saved-source" key={item.id}><div><span className={`source-tag source-tag-${item.type === 'YouTube' ? 'youtube' : item.type === 'note' ? 'note' : 'other'}`}>{item.type}</span><b>{item.title}</b><a href={item.url} target="_blank" rel="noreferrer">{item.url} <ExternalLink size={12}/></a></div><button onClick={() => persist(sources.filter(source => source.id !== item.id))} aria-label={`${item.title}を削除`}><Trash2 size={15}/></button></article>)}</div>}
  </section>
}
