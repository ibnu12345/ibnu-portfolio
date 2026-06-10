'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'

const education = [
  {
    year: '2020–2024',
    degree: 'S1 Pendidikan Bahasa Arab',
    institution: 'UIN Siber Syekh Nurjati Cirebon',
    desc: 'Lulus dengan predikat Cumlaude. Fokus penelitian pada media pembelajaran bahasa Arab berbasis teknologi.',
  },
]

const organizations = [
  {
    year: '2021–2022',
    position: 'Ketua Divisi Penelitian',
    org: 'HMJ Pendidikan Bahasa Arab',
    desc: 'Memimpin program penelitian dan pengembangan akademik mahasiswa.',
  },
  {
    year: '2022–2023',
    position: 'Public Speaker & MC',
    org: 'Berbagai Event Kampus',
    desc: 'MC Bahasa Arab di berbagai acara resmi dan seminar nasional.',
  },
]

export default function AboutPage() {
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    supabase.from('profile').select('*').single()
      .then(({ data }) => { if (data) setProfile(data) })
  }, [])

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 64px 80px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '64px' }}>
          <p style={{ color: '#818cf8', fontSize: '13px', fontWeight: 500, letterSpacing: '0.05em', marginBottom: '12px' }}>
            Tentang Saya
          </p>
          <h1 style={{ fontSize: '52px', fontWeight: 800, lineHeight: 1.1, margin: '0 0 24px' }}>
            Peneliti, Desainer,
            <br />
            <span style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              dan Pendidik
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px', lineHeight: 1.8, maxWidth: '600px' }}>
            {profile?.bio || 'Saya adalah seorang Educational Researcher dan Arabic Language Researcher yang bersemangat dalam mengembangkan inovasi media pembelajaran berbasis teknologi untuk pendidikan Islam.'}
          </p>
        </motion.div>

        {/* Bio + Photo */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', marginBottom: '80px', alignItems: 'start' }}>

          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: '-16px', background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent 70%)', borderRadius: '24px' }} />
            <div style={{
              position: 'relative', width: '100%', aspectRatio: '3/4',
              borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px'
            }}>
              {profile?.photo_url ? (
                <img src={profile.photo_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Profile" />
              ) : (
                <>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>👤</div>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>Upload foto di Admin Panel</p>
                </>
              )}
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Biodata</p>
              {[
                { label: 'Nama Lengkap', value: profile?.name || 'Muhamad Ibnu Setiawan Pratama' },
                { label: 'Profesi', value: profile?.tagline || 'Educational & Arabic Language Researcher' },
                { label: 'Institusi', value: 'UIN Siber Syekh Nurjati Cirebon' },
                { label: 'TOAFL', value: '547 / B1' },
                { label: 'TOEFL ITP', value: '410' },
                { label: 'Email', value: profile?.email || '-' },
                { label: 'Lokasi', value: 'Cilegon, Banten, Indonesia' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>{item.label}</span>
                  <span style={{ color: 'white', fontSize: '13px', textAlign: 'right', maxWidth: '220px' }}>{item.value}</span>
                </div>
              ))}
            </div>

            {profile?.cv_url ? (
              <a href={profile.cv_url} target="_blank" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#4f46e5', color: 'white', padding: '14px 24px', borderRadius: '12px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                ⬇ Download CV
              </a>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'rgba(79,70,229,0.3)', color: 'rgba(255,255,255,0.4)', padding: '14px 24px', borderRadius: '12px', fontSize: '14px' }}>
                CV belum diupload
              </div>
            )}

            {/* Social Links */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {profile?.instagram && (
                <a href={profile.instagram} target="_blank" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px' }}>Instagram</a>
              )}
              {profile?.linkedin && (
                <a href={profile.linkedin} target="_blank" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px' }}>LinkedIn</a>
              )}
              {profile?.youtube && (
                <a href={profile.youtube} target="_blank" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px' }}>YouTube</a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px', color: 'white' }}>Riwayat Pendidikan</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {education.map((item, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '32px', alignItems: 'start' }}>
                <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '8px', padding: '8px 12px', textAlign: 'center' }}>
                  <span style={{ color: '#818cf8', fontSize: '12px', fontWeight: 600 }}>{item.year}</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
                  <h3 style={{ color: 'white', fontWeight: 600, fontSize: '16px', margin: '0 0 4px' }}>{item.degree}</h3>
                  <p style={{ color: '#818cf8', fontSize: '13px', margin: '0 0 8px' }}>{item.institution}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Organization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '64px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px', color: 'white' }}>Pengalaman Organisasi</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {organizations.map((item, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '32px', alignItems: 'start' }}>
                <div style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '8px', padding: '8px 12px', textAlign: 'center' }}>
                  <span style={{ color: '#a78bfa', fontSize: '12px', fontWeight: 600 }}>{item.year}</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px' }}>
                  <h3 style={{ color: 'white', fontWeight: 600, fontSize: '16px', margin: '0 0 4px' }}>{item.position}</h3>
                  <p style={{ color: '#a78bfa', fontSize: '13px', margin: '0 0 8px' }}>{item.org}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Publications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '32px', color: 'white' }}>Publikasi Jurnal</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { title: 'Media Pembelajaran Bahasa Arab Berbasis AI', journal: 'Ijaz Arabi · UIN Malang', index: 'Scopus', year: '2024' },
              { title: 'Inovasi Pembelajaran Bahasa Arab Digital', journal: 'Arabiyat · UIN Jakarta', index: 'Sinta', year: '2023' },
              { title: 'Pengembangan Media Interaktif PAI', journal: 'Jurnal EMPATI · Undip', index: 'Sinta', year: '2023' },
            ].map((pub, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px 24px', gap: '16px' }}>
                <div>
                  <p style={{ color: 'white', fontWeight: 500, fontSize: '14px', margin: '0 0 4px' }}>{pub.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', margin: 0 }}>{pub.journal}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                  <span style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', fontSize: '11px', padding: '4px 10px', borderRadius: '999px' }}>{pub.index}</span>
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>{pub.year}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  )
}