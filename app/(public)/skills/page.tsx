'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

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
      <div className="page-container">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginBottom: '48px' }}>
          <p style={{ color: '#818cf8', fontSize: '13px', fontWeight: 500, marginBottom: '12px' }}>Kemampuan</p>
          <h1 className="h-page" style={{ margin: '0 0 16px' }}>Skills & Kompetensi</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px', maxWidth: '560px', lineHeight: 1.7 }}>
            Kompetensi yang dikembangkan melalui penelitian, pengalaman, dan praktik nyata.
          </p>
        </motion.div>

        {loading && <p style={{ color: 'rgba(255,255,255,0.3)' }}>Memuat...</p>}

        {!loading && categories.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'rgba(255,255,255,0.3)' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>⚡</p>
            <p>Belum ada skill. Tambahkan melalui Admin Panel.</p>
          </div>
        )}

        {!loading && categories.length > 0 && (
          <>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <motion.button
                  key={cat.id}
                  onClick={() => setActive(cat.id)}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    position: 'relative',
                    background: active === cat.id ? '#4f46e5' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${active === cat.id ? '#4f46e5' : 'rgba(255,255,255,0.1)'}`,
                    color: active === cat.id ? 'white' : 'rgba(255,255,255,0.5)',
                    padding: '8px 18px', borderRadius: '999px', fontSize: '13px', cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {cat.icon} {cat.name}
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
                  gap: '16px'
                }}
              >
                {activeSkills.map((skill, i) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '14px', padding: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ color: 'white', fontWeight: 500, fontSize: '14px' }}>{skill.name}</span>
                      <span style={{ color: '#818cf8', fontSize: '13px' }}>{skill.percentage}%</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '4px', height: '6px' }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.percentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.06 }}
                        style={{ background: 'linear-gradient(90deg, #818cf8, #a78bfa)', height: '6px', borderRadius: '4px' }}
                      />
                    </div>
                    {skill.description && (
                      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', marginTop: '8px', lineHeight: 1.5 }}>{skill.description}</p>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  )
}