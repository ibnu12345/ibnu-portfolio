'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

export default function HomePage() {
  const [currentRole, setCurrentRole] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [latestResearch, setLatestResearch] = useState<any>(null)
  const [featuredPortfolios, setFeaturedPortfolios] = useState<any[]>([])

  useEffect(() => {
    supabase.from('profile').select('*').single().then(({ data }) => { if (data) setProfile(data) })
    supabase.from('research').select('*').order('published_date', { ascending: false }).limit(1)
      .then(({ data }) => { if (data && data.length > 0) setLatestResearch(data[0]) })
    supabase.from('portfolio').select('*').eq('is_featured', true).order('created_at', { ascending: false }).limit(2)
      .then(({ data }) => {
        if (data && data.length > 0) setFeaturedPortfolios(data)
        else supabase.from('portfolio').select('*').order('created_at', { ascending: false }).limit(2)
          .then(({ data: d2 }) => { if (d2) setFeaturedPortfolios(d2) })
      })
  }, [])

  const roles: string[] = profile?.roles?.length > 0 ? profile.roles : ['Educational Researcher', 'Arabic Language Researcher', 'Graphic Designer', 'Content Creator', 'Public Speaker']
  const stats = profile?.stats?.length > 0 ? profile.stats : [
    { number: '3+', label: 'Jurnal Publikasi' }, { number: '5+', label: 'Tahun Pengalaman' },
    { number: '10+', label: 'Portfolio Karya' }, { number: '100+', label: 'Jam Mengajar' },
  ]

  useEffect(() => {
    if (!roles.length) return
    const role = roles[currentRole]
    let t: NodeJS.Timeout
    if (typing) {
      if (displayed.length < role.length) t = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 60)
      else t = setTimeout(() => setTyping(false), 2000)
    } else {
      if (displayed.length > 0) t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30)
      else { setCurrentRole(p => (p + 1) % roles.length); setTyping(true) }
    }
    return () => clearTimeout(t)
  }, [displayed, typing, currentRole, roles])

  const nameParts = profile?.name?.split(' ') || []
  const firstName = nameParts.slice(0, 2).join(' ') || 'Muhamad Ibnu'
  const lastName = nameParts.slice(2).join(' ') || 'Setiawan Pratama'
  const ctaTitle = profile?.home_cta_title || 'Tertarik Berkolaborasi?'
  const ctaDesc = profile?.home_cta_desc || 'Baik penelitian, desain, atau proyek kreatif — saya selalu terbuka untuk kolaborasi yang bermakna.'
  const bentoTitle = profile?.home_bento_research_title || 'Penelitian Bahasa Arab & Pendidikan Islam'
  const bentoDesc = profile?.home_bento_research_desc || 'Berfokus pada optimasi media pembelajaran bahasa Arab dan inovasi teknologi dalam pendidikan Islam modern.'

  const PhotoBlock = () => (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ position: 'relative', width: '240px', maxWidth: '100%' }}>
        <div style={{ position: 'absolute', inset: '-20px', background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)', borderRadius: '24px' }} />
        <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))' }}>
          {profile?.photo_url ? (
            <img src={profile.photo_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Profile" />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>👤</div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white' }}>

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        background: 'radial-gradient(ellipse at 70% 50%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 30% 80%, rgba(168,85,247,0.06) 0%, transparent 60%)'
      }}>
        <div className="page-container" style={{ paddingTop: '120px', paddingBottom: '80px', width: '100%' }}>
          <div className="hero-grid">

            {/* TEXT SIDE */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '6px 16px', width: 'fit-content' }}>
                <span style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%' }} />
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Researcher · Designer · Creator</span>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                <h1 className="h-hero" style={{ margin: 0 }}>
                  {firstName}<br />
                  <span style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {lastName}
                  </span>
                </h1>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ height: '32px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px' }}>{displayed}<span style={{ color: '#818cf8' }}>|</span></span>
              </motion.div>

              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
                style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: '420px', fontSize: '15px' }}>
                {profile?.bio || 'Menjembatani teori akademik dan praktik nyata dalam pendidikan Islam.'}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
                style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link href="/portfolio" style={{ background: '#4f46e5', color: 'white', padding: '12px 24px', borderRadius: '999px', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>
                  Lihat Portfolio →
                </Link>
                <a href={profile?.cv_url || '/about'} target={profile?.cv_url ? '_blank' : undefined}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '12px 24px', borderRadius: '999px', fontSize: '14px', fontWeight: 500, textDecoration: 'none' }}>
                  Resume
                </a>
              </motion.div>

              {/* Foto tampil di sini KHUSUS MOBILE (di bawah tombol) */}
              <div className="hero-photo-mobile">
                <PhotoBlock />
              </div>
            </div>

            {/* Foto tampil di sini KHUSUS DESKTOP (sebelah kanan) */}
            <div className="hero-photo-desktop">
              <PhotoBlock />
            </div>

          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '48px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="stats-grid">
            {stats.map((stat: any, i: number) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '28px', textAlign: 'center' }}>
                <p style={{ fontSize: '36px', fontWeight: 700, color: 'white', margin: 0 }}>{stat.number}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '6px' }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BENTO */}
      <section style={{ padding: '0 24px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '32px' }}>
            <p style={{ color: '#818cf8', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>Academic & Professional</p>
            <h2 className="h-section" style={{ color: 'white', margin: 0 }}>Ekosistem Karya</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '8px', fontSize: '14px' }}>Sorotan penelitian, desain, dan kompetensi utama.</p>
          </motion.div>

          <div className="bento-top">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '32px', height: '32px', background: 'rgba(99,102,241,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>📄</div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Research Highlights</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginBottom: '12px' }}>{bentoTitle}</h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.7, marginBottom: '24px' }}>{bentoDesc}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[{ n: '3+', l: 'Papers Published' }, { n: 'Scopus', l: 'Indexed Journal' }].map(s => (
                  <div key={s.l} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                    <p style={{ fontSize: '24px', fontWeight: 700, color: 'white', margin: 0 }}>{s.n}</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '32px', height: '32px', background: 'rgba(168,85,247,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>⚡</div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Kompetensi</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Research', 'Arabic', 'Design', 'Teaching', 'Public Speaking', 'Content', 'Media', 'Technology'].map(s => (
                  <span key={s} className="tag">{s}</span>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="bento-bottom">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="card">
              <p style={{ color: '#818cf8', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Latest Publication</p>
              {latestResearch ? (
                <>
                  <h4 style={{ color: 'white', fontWeight: 600, fontSize: '13px', lineHeight: 1.6, marginBottom: '8px' }}>{latestResearch.title}</h4>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>{latestResearch.journal_name || 'Jurnal Publikasi'}</p>
                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>{latestResearch.published_date ? new Date(latestResearch.published_date).getFullYear() : ''}</span>
                    <Link href="/research" style={{ color: '#818cf8', fontSize: '12px', textDecoration: 'none' }}>Lihat semua →</Link>
                  </div>
                </>
              ) : (
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>Belum ada publikasi.</p>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '32px', height: '32px', background: 'rgba(168,85,247,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🚀</div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Featured Portfolio</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {featuredPortfolios.length > 0 ? featuredPortfolios.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '12px', padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', alignItems: 'flex-start' }}>
                    <div style={{ width: '3px', minHeight: '32px', background: 'rgba(168,85,247,0.5)', borderRadius: '2px', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <p style={{ color: 'white', fontSize: '13px', fontWeight: 500, margin: 0 }}>{item.title}</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '2px' }}>
                        {item.description ? item.description.slice(0, 80) + (item.description.length > 80 ? '...' : '') : item.category || ''}
                      </p>
                    </div>
                  </div>
                )) : <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>Belum ada portfolio.</p>}
              </div>
              <Link href="/portfolio" style={{ color: '#a78bfa', fontSize: '13px', textDecoration: 'none' }}>Explore All Projects →</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            style={{ background: 'linear-gradient(135deg, rgba(49,46,129,0.6), rgba(88,28,135,0.4))', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '24px', padding: '60px 24px', textAlign: 'center' }}>
            <h2 className="h-section" style={{ color: 'white', marginBottom: '16px' }}>{ctaTitle}</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 32px', fontSize: '15px' }}>{ctaDesc}</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" style={{ background: '#4f46e5', color: 'white', padding: '14px 32px', borderRadius: '999px', fontWeight: 500, textDecoration: 'none', fontSize: '14px' }}>Mulai Diskusi</Link>
              <Link href="/contact" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '14px 32px', borderRadius: '999px', fontWeight: 500, textDecoration: 'none', fontSize: '14px' }}>Jadwalkan Pertemuan</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}