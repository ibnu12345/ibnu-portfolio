'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function SkillsPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [active, setActive] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('skill_category').select('*').order('sort_order'),
      supabase.from('skill').select('*').order('sort_order'),
    ]).then(([c, s]) => {
      setCategories(c.data || [])
      setSkills(s.data || [])
      if (c.data && c.data.length > 0) setActive(c.data[0].id)
      setLoading(false)
    })
  }, [])

  const activeSkills = skills.filter(s => s.category_id === active)

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 64px 80px' }}>
        <div style={{ marginBottom: '48px' }}>
          <p style={{ color: '#818cf8', fontSize: '13px', fontWeight: 500, marginBottom: '12px' }}>Kemampuan</p>
          <h1 style={{ fontSize: '48px', fontWeight: 800, margin: '0 0 16px' }}>Skills & Kompetensi</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px', maxWidth: '560px', lineHeight: 1.7 }}>
            Kompetensi yang dikembangkan melalui penelitian, pengalaman, dan praktik nyata.
          </p>
        </div>

        {loading && <p style={{ color: 'rgba(255,255,255,0.3)' }}>Memuat...</p>}

        {!loading && categories.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px', color: 'rgba(255,255,255,0.3)' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</p>
            <p>Belum ada skill. Tambahkan melalui Admin Panel.</p>
          </div>
        )}

        {!loading && categories.length > 0 && (
          <>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => setActive(cat.id)} style={{ background: active === cat.id ? '#4f46e5' : 'rgba(255,255,255,0.05)', border: `1px solid ${active === cat.id ? '#4f46e5' : 'rgba(255,255,255,0.1)'}`, color: active === cat.id ? 'white' : 'rgba(255,255,255,0.5)', padding: '8px 18px', borderRadius: '999px', fontSize: '13px', cursor: 'pointer' }}>
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {activeSkills.map(skill => (
                <div key={skill.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ color: 'white', fontWeight: 500, fontSize: '14px' }}>{skill.name}</span>
                    <span style={{ color: '#818cf8', fontSize: '13px' }}>{skill.percentage}%</span>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '4px', height: '6px' }}>
                    <div style={{ background: 'linear-gradient(90deg, #818cf8, #a78bfa)', height: '6px', borderRadius: '4px', width: `${skill.percentage}%`, transition: 'width 0.8s ease' }} />
                  </div>
                  {skill.description && <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '8px', lineHeight: 1.5 }}>{skill.description}</p>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}