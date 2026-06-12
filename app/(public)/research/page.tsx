'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'

export default function ResearchPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('research').select('*').order('published_date', { ascending: false })
      .then(({ data }) => { setItems(data || []); setLoading(false) })
  }, [])

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white', paddingTop: '100px' }}>
      <div className="page-container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginBottom: '48px' }}>
          <p style={{ color: '#818cf8', fontSize: '13px', fontWeight: 500, marginBottom: '12px' }}>Penelitian</p>
          <h1 className="h-page" style={{ margin: '0 0 16px' }}>Research & Publikasi</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px', maxWidth: '560px', lineHeight: 1.7 }}>
            Kumpulan penelitian dan publikasi jurnal di bidang pendidikan bahasa Arab dan teknologi pembelajaran Islam.
          </p>
        </motion.div>

        {loading && <p style={{ color: 'rgba(255,255,255,0.3)' }}>Memuat...</p>}

        {!loading && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(255,255,255,0.3)' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>📄</p>
            <p>Belum ada penelitian. Tambahkan melalui Admin Panel.</p>
          </div>
        )}

        <div style={{ display: 'grid', gap: '16px' }}>
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ borderColor: 'rgba(99,102,241,0.35)', scale: 1.005 }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-start',
                transition: 'border-color 0.2s',
                cursor: 'default',
              }}
            >
              {item.thumbnail_url && (
                <img
                  src={item.thumbnail_url}
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }}
                  alt={item.title}
                />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <h2 style={{ color: 'white', fontWeight: 600, fontSize: '17px', margin: 0, lineHeight: 1.4 }}>{item.title}</h2>
                  {item.is_featured && (
                    <span style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8', fontSize: '11px', padding: '3px 10px', borderRadius: '999px', flexShrink: 0 }}>Featured</span>
                  )}
                </div>
                {item.journal_name && (
                  <p style={{ color: '#818cf8', fontSize: '13px', marginBottom: '8px' }}>{item.journal_name}</p>
                )}
                {item.description && (
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.7, marginBottom: '16px' }}>{item.description}</p>
                )}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {item.published_date && (
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
                      {new Date(item.published_date).getFullYear()}
                    </span>
                  )}
                  {item.pdf_url && (
                    <a href={item.pdf_url} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#818cf8', fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      📄 Download PDF
                    </a>
                  )}
                  {item.video_url && (
                    <a href={item.video_url} target="_blank" rel="noopener noreferrer"
                      style={{ color: '#a78bfa', fontSize: '13px', textDecoration: 'none' }}>
                      ▶ Tonton Video
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}