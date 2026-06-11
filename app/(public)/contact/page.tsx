'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const IconWhatsApp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const IconEmail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

const IconInstagram = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const IconLinkedIn = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const IconYouTube = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    supabase.from('profile').select('name, email, whatsapp, instagram, linkedin, youtube').single()
      .then(({ data }) => { if (data) setProfile(data) })
  }, [])

  async function handleSend() {
    if (!form.name || !form.email || !form.message) { setError('Nama, email, dan pesan wajib diisi.'); return }
    setSending(true); setError('')
    const { error } = await supabase.from('contact_message').insert(form)
    setSending(false)
    if (error) setError('Gagal mengirim pesan. Coba lagi.')
    else { setSent(true); setForm({ name: '', email: '', subject: '', message: '' }) }
  }

  const contacts = [
    {
      icon: <IconWhatsApp />,
      label: 'WhatsApp',
      value: profile?.whatsapp || '+62 xxx-xxxx-xxxx',
      href: profile?.whatsapp ? `https://wa.me/${profile.whatsapp.replace(/\D/g, '')}` : '#',
      color: '#25D366',
    },
    {
      icon: <IconEmail />,
      label: 'Email',
      value: profile?.email || 'ibnu@email.com',
      href: profile?.email ? `mailto:${profile.email}` : '#',
      color: '#818cf8',
    },
    {
      icon: <IconInstagram />,
      label: 'Instagram',
      value: profile?.instagram ? profile.instagram.replace('https://instagram.com/', '').replace('https://www.instagram.com/', '').replace(/\/$/, '') : '@ibnusp_',
      href: profile?.instagram || '#',
      color: '#E1306C',
    },
    {
      icon: <IconLinkedIn />,
      label: 'LinkedIn',
      value: profile?.linkedin ? profile.linkedin.replace('https://linkedin.com/in/', '').replace('https://www.linkedin.com/in/', '').replace(/\/$/, '') : 'Muhamad Ibnu SP',
      href: profile?.linkedin || '#',
      color: '#0A66C2',
    },
    {
      icon: <IconYouTube />,
      label: 'YouTube',
      value: profile?.youtube ? profile.youtube.replace('https://youtube.com/', '').replace('https://www.youtube.com/', '').replace('@', '').replace(/\/$/, '') : 'ibnusp_',
      href: profile?.youtube || '#',
      color: '#FF0000',
    },
  ]

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white', paddingTop: '100px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 64px 80px' }}>
        <div style={{ marginBottom: '64px' }}>
          <p style={{ color: '#818cf8', fontSize: '13px', fontWeight: 500, marginBottom: '12px' }}>Kontak</p>
          <h1 style={{ fontSize: '48px', fontWeight: 800, margin: '0 0 16px' }}>Hubungi Saya</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px', maxWidth: '560px', lineHeight: 1.7 }}>
            Terbuka untuk kolaborasi penelitian, proyek desain, undangan public speaking, dan diskusi akademik.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '48px' }}>

          {/* Contact info */}
          <div>
            <h2 style={{ color: 'white', fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Informasi Kontak</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {contacts.map(c => (
                <a
                  key={c.label}
                  href={c.href}
                  target={c.href !== '#' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px', padding: '16px', textDecoration: 'none',
                    transition: 'border-color 0.2s, background 0.2s',
                    cursor: c.href !== '#' ? 'pointer' : 'default',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = `${c.color}40`
                    ;(e.currentTarget as HTMLElement).style.background = `${c.color}08`
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'
                    ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'
                  }}
                >
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                    background: `${c.color}18`, color: c.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {c.icon}
                  </div>
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.label}</p>
                    <p style={{ color: 'white', fontSize: '14px', margin: 0 }}>{c.value}</p>
                  </div>
                  {c.href !== '#' && (
                    <div style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>↗</div>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 style={{ color: 'white', fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>Kirim Pesan</h2>

            {sent ? (
              <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
                <p style={{ fontSize: '32px', marginBottom: '12px' }}>✅</p>
                <p style={{ color: '#34d399', fontWeight: 600 }}>Pesan terkirim!</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '8px' }}>Saya akan membalas secepatnya.</p>
                <button onClick={() => setSent(false)} style={{ marginTop: '16px', background: 'transparent', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>Kirim pesan lain</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '12px', color: '#f87171', fontSize: '13px' }}>{error}</div>}
                {[
                  { key: 'name', label: 'Nama *', type: 'text' },
                  { key: 'email', label: 'Email *', type: 'email' },
                  { key: 'subject', label: 'Subject', type: 'text' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                    <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '11px 14px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Pesan *</label>
                  <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={5}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '11px 14px', color: 'white', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
                <button onClick={handleSend} disabled={sending} style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '14px', fontSize: '14px', fontWeight: 500, cursor: sending ? 'not-allowed' : 'pointer', opacity: sending ? 0.7 : 1 }}>
                  {sending ? 'Mengirim...' : 'Kirim Pesan'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}