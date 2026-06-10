'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSend() {
    if (!form.name || !form.email || !form.message) { setError('Nama, email, dan pesan wajib diisi.'); return }
    setSending(true); setError('')
    const { error } = await supabase.from('contact_message').insert(form)
    setSending(false)
    if (error) setError('Gagal mengirim pesan. Coba lagi.')
    else { setSent(true); setForm({ name: '', email: '', subject: '', message: '' }) }
  }

  const contacts = [
    { icon: '📱', label: 'WhatsApp', value: '+62 xxx-xxxx-xxxx', href: 'https://wa.me/62' },
    { icon: '📧', label: 'Email', value: 'ibnu@email.com', href: 'mailto:ibnu@email.com' },
    { icon: '📸', label: 'Instagram', value: '@ibnusp_', href: 'https://instagram.com' },
    { icon: '💼', label: 'LinkedIn', value: 'Muhamad Ibnu SP', href: 'https://linkedin.com' },
    { icon: '▶️', label: 'YouTube', value: 'ibnusp_', href: 'https://youtube.com' },
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
                <a key={c.label} href={c.href} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', textDecoration: 'none', transition: 'border-color 0.2s' }}>
                  <span style={{ fontSize: '20px' }}>{c.icon}</span>
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.label}</p>
                    <p style={{ color: 'white', fontSize: '14px', margin: 0 }}>{c.value}</p>
                  </div>
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