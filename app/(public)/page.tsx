'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

const roles = [
  'Educational Researcher',
  'Arabic Language Researcher',
  'Graphic Designer',
  'Content Creator',
  'Public Speaker',
]

export default function HomePage() {
  const [currentRole, setCurrentRole] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    supabase.from('profile').select('*').single()
      .then(({ data }) => { if (data) setProfile(data) })
  }, [])

  useEffect(() => {
    const role = roles[currentRole]
    let timeout: NodeJS.Timeout
    if (typing) {
      if (displayed.length < role.length) {
        timeout = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 60)
      } else {
        timeout = setTimeout(() => setTyping(false), 2000)
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30)
      } else {
        setCurrentRole((prev) => (prev + 1) % roles.length)
        setTyping(true)
      }
    }
    return () => clearTimeout(timeout)
  }, [displayed, typing, currentRole])

  const nameParts = profile?.name?.split(' ') || []
  const firstName = nameParts.slice(0, 2).join(' ') || 'Muhamad Ibnu'
  const lastName = nameParts.slice(2).join(' ') || 'Setiawan Pratama'

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white' }}>

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        background: 'radial-gradient(ellipse at 70% 50%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 30% 80%, rgba(168,85,247,0.06) 0%, transparent 60%)'
      }}>
        <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '120px 64px 80px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>

            {/* Left */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '999px', padding: '6px 16px', width: 'fit-content'
                }}>
                <span style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%' }} />
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Researcher · Designer · Creator
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}>
                <h1 style={{ fontSize: '60px', fontWeight: 800, lineHeight: 1.1, margin: 0 }}>
                  {firstName}
                  <br />
                  <span style={{
                    background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    {lastName}
                  </span>
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ height: '32px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px' }}>
                  {displayed}
                  <span style={{ color: '#818cf8' }}>|</span>
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: '420px', fontSize: '15px' }}>
                {profile?.bio || 'Menjembatani teori akademik dan praktik nyata dalam pendidikan Islam. Mengeksplorasi inovasi media pembelajaran berbasis teknologi.'}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                style={{ display: 'flex', gap: '12px' }}>
                <Link href="/portfolio" style={{
                  background: '#4f46e5', color: 'white', padding: '12px 24px',
                  borderRadius: '999px', fontSize: '14px', fontWeight: 500, textDecoration: 'none'
                }}>
                  Lihat Portfolio →
                </Link>
                <Link href="/about" style={{
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white', padding: '12px 24px', borderRadius: '999px',
                  fontSize: '14px', fontWeight: 500, textDecoration: 'none'
                }}>
                  Resume
                </Link>
              </motion.div>
            </div>

            {/* Right - Photo */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute', inset: '-20px',
                  background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent 70%)',
                  borderRadius: '24px'
                }} />
                <div style={{
                  position: 'relative', width: '320px', height: '400px',
                  borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)',
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))'
                }}>
                  {profile?.photo_url ? (
                    <img
                      src={profile.photo_url}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      alt="Profile"
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%', display: 'flex',
                      flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px'
                    }}>
                      <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px'
                      }}>
                        👤
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
                        Upload foto di Admin Panel
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '64px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '24px' }}>
          {[
            { number: '3+', label: 'Jurnal Publikasi' },
            { number: '5+', label: 'Tahun Pengalaman' },
            { number: '10+', label: 'Portfolio Karya' },
            { number: '100+', label: 'Jam Mengajar' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '16px', padding: '32px', textAlign: 'center'
              }}>
              <p style={{ fontSize: '40px', fontWeight: 700, color: 'white', margin: 0 }}>{stat.number}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '6px' }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BENTO */}
      <section style={{ padding: '0 64px 64px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ marginBottom: '40px' }}>
            <p style={{ color: '#818cf8', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>Academic & Professional</p>
            <h2 style={{ fontSize: '32px', fontWeight: 700, color: 'white', margin: 0 }}>Ekosistem Karya</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '8px', fontSize: '14px' }}>Sorotan penelitian, desain, dan kompetensi utama.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '32px', height: '32px', background: 'rgba(99,102,241,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>📄</div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Research Highlights</span>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginBottom: '12px' }}>
                Penelitian Bahasa Arab & Pendidikan Islam
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.7, marginBottom: '24px' }}>
                Berfokus pada optimasi media pembelajaran bahasa Arab dan inovasi teknologi dalam pendidikan Islam modern.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {[{ n: '3+', l: 'Papers Published' }, { n: 'Scopus', l: 'Indexed Journal' }].map(s => (
                  <div key={s.l} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px' }}>
                    <p style={{ fontSize: '24px', fontWeight: 700, color: 'white', margin: 0 }}>{s.n}</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card">
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="card">
              <p style={{ color: '#818cf8', fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                Latest Publication
              </p>
              <h4 style={{ color: 'white', fontWeight: 600, fontSize: '13px', lineHeight: 1.6, marginBottom: '8px' }}>
                Media Pembelajaran Bahasa Arab Berbasis AI
              </h4>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>Ijaz Arabi · UIN Malang · Scopus</p>
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>2024</span>
                <Link href="/research" style={{ color: '#818cf8', fontSize: '12px', textDecoration: 'none' }}>Lihat semua →</Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <div style={{ width: '32px', height: '32px', background: 'rgba(168,85,247,0.2)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🚀</div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Featured Portfolio</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {[
                  { title: 'PratamaAI — Platform Pendidikan Islam', desc: 'AI-based Islamic education learning platform' },
                  { title: 'Desain Grafis & Visual Identity', desc: 'Branding dan konten kreatif berbasis penelitian' },
                ].map(item => (
                  <div key={item.title} style={{
                    display: 'flex', gap: '12px', padding: '14px',
                    background: 'rgba(255,255,255,0.03)', borderRadius: '12px', alignItems: 'flex-start'
                  }}>
                    <div style={{ width: '3px', minHeight: '32px', background: 'rgba(168,85,247,0.5)', borderRadius: '2px', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <p style={{ color: 'white', fontSize: '13px', fontWeight: 500, margin: 0 }}>{item.title}</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '2px' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/portfolio" style={{ color: '#a78bfa', fontSize: '13px', textDecoration: 'none' }}>
                Explore All Projects →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 64px 80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              background: 'linear-gradient(135deg, rgba(49,46,129,0.6), rgba(88,28,135,0.4))',
              border: '1px solid rgba(99,102,241,0.2)',
              borderRadius: '24px', padding: '80px', textAlign: 'center'
            }}>
            <h2 style={{ fontSize: '40px', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
              Tertarik Berkolaborasi?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '480px', margin: '0 auto 32px' }}>
              Baik penelitian, desain, atau proyek kreatif — saya selalu terbuka untuk kolaborasi yang bermakna.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link href="/contact" style={{
                background: '#4f46e5', color: 'white', padding: '14px 32px',
                borderRadius: '999px', fontWeight: 500, textDecoration: 'none', fontSize: '14px'
              }}>
                Mulai Diskusi
              </Link>
              <Link href="/contact" style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'white', padding: '14px 32px', borderRadius: '999px',
                fontWeight: 500, textDecoration: 'none', fontSize: '14px'
              }}>
                Jadwalkan Pertemuan
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  )
}