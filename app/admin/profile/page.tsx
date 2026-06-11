'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/admin/Sidebar'
import { supabase } from '../../lib/supabase'
import { uploadFile } from '../../lib/upload'

export default function AdminProfile() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState<any>({
    name: '', tagline: '', bio: '', photo_url: '', cv_url: '',
    email: '', whatsapp: '', instagram: '', linkedin: '', youtube: '',
    roles: ['Educational Researcher', 'Arabic Language Researcher', 'Graphic Designer', 'Content Creator', 'Public Speaker'],
    stats: [
      { number: '3+', label: 'Jurnal Publikasi' },
      { number: '5+', label: 'Tahun Pengalaman' },
      { number: '10+', label: 'Portfolio Karya' },
      { number: '100+', label: 'Jam Mengajar' },
    ],
    home_bento_research_title: 'Penelitian Bahasa Arab & Pendidikan Islam',
    home_bento_research_desc: 'Berfokus pada optimasi media pembelajaran bahasa Arab dan inovasi teknologi dalam pendidikan Islam modern.',
    home_cta_title: 'Tertarik Berkolaborasi?',
    home_cta_desc: 'Baik penelitian, desain, atau proyek kreatif — saya selalu terbuka untuk kolaborasi yang bermakna.',
  })

  useEffect(() => {
    checkAuth()
    loadProfile()
  }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) router.push('/admin/login')
    else setLoading(false)
  }

  async function loadProfile() {
    const { data } = await supabase.from('profile').select('*').single()
    if (data) {
      setForm({
        ...data,
        roles: data.roles || ['Educational Researcher', 'Arabic Language Researcher', 'Graphic Designer', 'Content Creator', 'Public Speaker'],
        stats: data.stats || [
          { number: '3+', label: 'Jurnal Publikasi' },
          { number: '5+', label: 'Tahun Pengalaman' },
          { number: '10+', label: 'Portfolio Karya' },
          { number: '100+', label: 'Jam Mengajar' },
        ],
        home_bento_research_title: data.home_bento_research_title || 'Penelitian Bahasa Arab & Pendidikan Islam',
        home_bento_research_desc: data.home_bento_research_desc || 'Berfokus pada optimasi media pembelajaran bahasa Arab dan inovasi teknologi dalam pendidikan Islam modern.',
        home_cta_title: data.home_cta_title || 'Tertarik Berkolaborasi?',
        home_cta_desc: data.home_cta_desc || 'Baik penelitian, desain, atau proyek kreatif — saya selalu terbuka untuk kolaborasi yang bermakna.',
      })
    }
  }

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase.from('profile').update({
      ...form,
      updated_at: new Date().toISOString()
    }).eq('id', form.id)
    setMsg(error ? 'Gagal menyimpan: ' + error.message : 'Tersimpan!')
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadFile(file, 'avatars')
    if (url) setForm((f: any) => ({ ...f, photo_url: url }))
  }

  // Roles handlers
  function updateRole(i: number, val: string) {
    const updated = [...form.roles]
    updated[i] = val
    setForm((f: any) => ({ ...f, roles: updated }))
  }
  function addRole() {
    setForm((f: any) => ({ ...f, roles: [...f.roles, ''] }))
  }
  function removeRole(i: number) {
    setForm((f: any) => ({ ...f, roles: f.roles.filter((_: any, idx: number) => idx !== i) }))
  }

  // Stats handlers
  function updateStat(i: number, key: 'number' | 'label', val: string) {
    const updated = [...form.stats]
    updated[i] = { ...updated[i], [key]: val }
    setForm((f: any) => ({ ...f, stats: updated }))
  }
  function addStat() {
    setForm((f: any) => ({ ...f, stats: [...f.stats, { number: '', label: '' }] }))
  }
  function removeStat(i: number) {
    setForm((f: any) => ({ ...f, stats: f.stats.filter((_: any, idx: number) => idx !== i) }))
  }

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px', padding: '10px 12px', color: 'white', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box' as const,
  }
  const sectionStyle = {
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px', padding: '24px', marginBottom: '20px',
  }
  const labelStyle = { color: 'rgba(255,255,255,0.5)', fontSize: '12px', display: 'block', marginBottom: '6px' }
  const sectionTitleStyle = {
    color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '16px',
    textTransform: 'uppercase' as const, letterSpacing: '0.05em'
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: 'white' }}>
      Loading...
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div style={{ maxWidth: '720px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Profile Settings</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px' }}>Edit informasi profil yang tampil di website</p>

          {/* Photo */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>Foto Profil</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {form.photo_url ? <img src={form.photo_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '28px' }}>👤</span>}
              </div>
              <label style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
                Upload Foto
                <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          {/* Basic Info */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>Informasi Dasar</p>
            <div style={{ display: 'grid', gap: '16px' }}>
              {[
                { key: 'name', label: 'Nama Lengkap', type: 'text' },
                { key: 'tagline', label: 'Tagline', type: 'text' },
                { key: 'bio', label: 'Bio', type: 'textarea' },
              ].map(f => (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea value={form[f.key] || ''} onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))}
                      rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
                  ) : (
                    <input type="text" value={form[f.key] || ''} onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))}
                      style={inputStyle} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>Kontak & Sosial Media</p>
            <div style={{ display: 'grid', gap: '16px' }}>
              {[
                { key: 'email', label: 'Email', placeholder: 'ibnu@email.com' },
                { key: 'whatsapp', label: 'WhatsApp (format: 628xxxxxxxxxx)', placeholder: '628123456789' },
                { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/ibnusp_' },
                { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/ibnusp' },
                { key: 'youtube', label: 'YouTube URL', placeholder: 'https://youtube.com/@ibnusp_' },
              ].map(f => (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  <input type="text" value={form[f.key] || ''} placeholder={f.placeholder}
                    onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))}
                    style={{ ...inputStyle, '::placeholder': { color: 'rgba(255,255,255,0.2)' } } as any} />
                </div>
              ))}
              <div>
                <label style={labelStyle}>CV / Resume URL</label>
                <input type="text" value={form.cv_url || ''} placeholder="https://..."
                  onChange={e => setForm((p: any) => ({ ...p, cv_url: e.target.value }))}
                  style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Roles (Typing Animation) */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>Roles — Typing Animation di Hero</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(form.roles || []).map((role: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="text" value={role} onChange={e => updateRole(i, e.target.value)}
                    style={{ ...inputStyle, flex: 1 }} placeholder="Contoh: Educational Researcher" />
                  <button onClick={() => removeRole(i)}
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', fontSize: '14px', flexShrink: 0 }}>
                    ✕
                  </button>
                </div>
              ))}
              <button onClick={addRole}
                style={{ background: 'rgba(99,102,241,0.1)', border: '1px dashed rgba(99,102,241,0.3)', color: '#818cf8', borderRadius: '8px', padding: '10px', cursor: 'pointer', fontSize: '13px', textAlign: 'center' }}>
                + Tambah Role
              </button>
            </div>
          </div>

          {/* Stats */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>Stats — Angka di Halaman Home</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(form.stats || []).map((stat: any, i: number) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '8px', alignItems: 'center' }}>
                  <input type="text" value={stat.number} onChange={e => updateStat(i, 'number', e.target.value)}
                    style={inputStyle} placeholder="3+" />
                  <input type="text" value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)}
                    style={inputStyle} placeholder="Jurnal Publikasi" />
                  <button onClick={() => removeStat(i)}
                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', fontSize: '14px' }}>
                    ✕
                  </button>
                </div>
              ))}
              <button onClick={addStat}
                style={{ background: 'rgba(99,102,241,0.1)', border: '1px dashed rgba(99,102,241,0.3)', color: '#818cf8', borderRadius: '8px', padding: '10px', cursor: 'pointer', fontSize: '13px', textAlign: 'center' }}>
                + Tambah Stat
              </button>
            </div>
          </div>

          {/* Bento Research Text */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>Teks Bento — Research Highlights</p>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Judul</label>
                <input type="text" value={form.home_bento_research_title || ''}
                  onChange={e => setForm((p: any) => ({ ...p, home_bento_research_title: e.target.value }))}
                  style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Deskripsi</label>
                <textarea value={form.home_bento_research_desc || ''}
                  onChange={e => setForm((p: any) => ({ ...p, home_bento_research_desc: e.target.value }))}
                  rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            </div>
          </div>

          {/* CTA Section Text */}
          <div style={sectionStyle}>
            <p style={sectionTitleStyle}>Teks CTA — Bagian Bawah Home</p>
            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Judul CTA</label>
                <input type="text" value={form.home_cta_title || ''}
                  onChange={e => setForm((p: any) => ({ ...p, home_cta_title: e.target.value }))}
                  style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Deskripsi CTA</label>
                <textarea value={form.home_cta_desc || ''}
                  onChange={e => setForm((p: any) => ({ ...p, home_cta_desc: e.target.value }))}
                  rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={handleSave} disabled={saving}
              style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
            </button>
            {msg && <p style={{ color: msg.includes('Gagal') ? '#f87171' : '#34d399', fontSize: '13px' }}>{msg}</p>}
          </div>
        </div>
      </main>
    </div>
  )
}