'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function BlogPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase.from('blog_post').select('*').eq('is_published', true).order('published_date', { ascending: false })
      .then(({ data }) => { setItems(data || []); setLoading(false) })
  }, [])

  const filtered = items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 64px 80px' }}>
        <div style={{ marginBottom: '48px' }}>
          <p style={{ color: '#818cf8', fontSize: '13px', fontWeight: 500, marginBottom: '12px' }}>Blog</p>
          <h1 style={{ fontSize: '48px', fontWeight: 800, margin: '0 0 16px' }}>Artikel & Tulisan</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px', maxWidth: '560px', lineHeight: 1.7 }}>
            Pemikiran, riset, dan pengalaman dalam dunia pendidikan dan penelitian.
          </p>
        </div>

        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari artikel..." style={{ width: '100%', maxWidth: '400px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '12px 16px', color: 'white', fontSize: '14px', outline: 'none', marginBottom: '40px', boxSizing: 'border-box' }} />

        {loading && <p style={{ color: 'rgba(255,255,255,0.3)' }}>Memuat...</p>}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(255,255,255,0.3)' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>✍️</p>
            <p>Belum ada artikel yang dipublikasikan.</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filtered.map(item => (
            <div key={item.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
              {item.thumbnail_url && <img src={item.thumbnail_url} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />}
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  {item.category && <span style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontSize: '11px', padding: '3px 10px', borderRadius: '999px' }}>{item.category}</span>}
                  {item.tags?.slice(0, 2).map((tag: string) => <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', fontSize: '11px', padding: '3px 10px', borderRadius: '999px' }}>{tag}</span>)}
                </div>
                <h3 style={{ color: 'white', fontWeight: 600, fontSize: '16px', margin: '0 0 8px', lineHeight: 1.4 }}>{item.title}</h3>
                {item.content && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.6, margin: '0 0 16px' }}>{item.content.slice(0, 120)}...</p>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px' }}>{item.published_date ? new Date(item.published_date).toLocaleDateString('id-ID') : ''}</span>
                  <Link href={`/blog/${item.slug}`} style={{ color: '#818cf8', fontSize: '13px', textDecoration: 'none' }}>
  Baca →
</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}