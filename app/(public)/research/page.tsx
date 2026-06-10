'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function ResearchPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('research').select('*').order('published_date', { ascending: false })
      .then(({ data }) => { setItems(data || []); setLoading(false) })
  }, [])

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 64px 80px' }}>
        <div style={{ marginBottom: '48px' }}>
          <p style={{ color: '#818cf8', fontSize: '13px', fontWeight: 500, marginBottom: '12px' }}>Penelitian</p>
          <h1 style={{ fontSize: '48px', fontWeight: 800, margin: '0 0 16px' }}>Research & Publikasi</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px', maxWidth: '560px', lineHeight: 1.7 }}>
            Kumpulan penelitian dan publikasi jurnal di bidang pendidikan bahasa Arab dan teknologi pembelajaran Islam.
          </p>
        </div>

        {loading && <p style={{ color: 'rgba(255,255,255,0.3)' }}>Memuat...</p>}

        {!loading && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(255,255,255,0.3)' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>📄</p>
            <p>Belum ada penelitian. Tambahkan melalui Admin Panel.</p>
          </div>
        )}

        <div style={{ display: 'grid', gap: '16px' }}>
          {items.map(item => (
            <div key={item.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px', display: 'grid', gridTemplateColumns: item.thumbnail_url ? '120px 1fr' : '1fr', gap: '24px', alignItems: 'start' }}>
              {item.thumbnail_url && (
                <img src={item.thumbnail_url} style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '10px' }} />
              )}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <h2 style={{ color: 'white', fontWeight: 600, fontSize: '18px', margin: 0 }}>{item.title}</h2>
                  {item.is_featured && <span style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8', fontSize: '11px', padding: '3px 10px', borderRadius: '999px' }}>Featured</span>}
                </div>
                {item.journal_name && <p style={{ color: '#818cf8', fontSize: '13px', marginBottom: '8px' }}>{item.journal_name}</p>}
                {item.description && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>{item.description}</p>}
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {item.published_date && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>{new Date(item.published_date).getFullYear()}</span>}
                  {item.pdf_url && <a href={item.pdf_url} target="_blank" style={{ color: '#818cf8', fontSize: '13px', textDecoration: 'none' }}>📄 Download PDF</a>}
                  {item.video_url && <a href={item.video_url} target="_blank" style={{ color: '#a78bfa', fontSize: '13px', textDecoration: 'none' }}>▶ Tonton Video</a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}