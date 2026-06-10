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
  const [form, setForm] = useState({
    name: '', tagline: '', bio: '', photo_url: '', cv_url: '',
    email: '', whatsapp: '', instagram: '', linkedin: '', youtube: ''
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
    if (data) setForm(data)
  }

  async function handleSave() {
    setSaving(true)
    const { error } = await supabase.from('profile').update({ ...form, updated_at: new Date().toISOString() }).eq('id', form.id)
    setMsg(error ? 'Gagal menyimpan' : 'Tersimpan!')
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadFile(file, 'avatars')
    if (url) setForm(f => ({ ...f, photo_url: url }))
  }

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: 'white' }}>Loading...</div>

  const fields = [
    { key: 'name', label: 'Nama Lengkap', type: 'text' },
    { key: 'tagline', label: 'Tagline', type: 'text' },
    { key: 'bio', label: 'Bio', type: 'textarea' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'whatsapp', label: 'WhatsApp', type: 'text' },
    { key: 'instagram', label: 'Instagram URL', type: 'text' },
    { key: 'linkedin', label: 'LinkedIn URL', type: 'text' },
    { key: 'youtube', label: 'YouTube URL', type: 'text' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px' }}>
        <div style={{ maxWidth: '720px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Profile Settings</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px' }}>Edit informasi profil yang tampil di website</p>

          {/* Photo */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Foto Profil</p>
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

          {/* Fields */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
            <div style={{ display: 'grid', gap: '16px' }}>
              {fields.map(f => (
                <div key={f.key}>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                  {f.type === 'textarea' ? (
                    <textarea value={(form as any)[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      rows={4} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 12px', color: 'white', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                  ) : (
                    <input type={f.type} value={(form as any)[f.key] || ''} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 12px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={handleSave} disabled={saving} style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 24px', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
            {msg && <p style={{ color: msg.includes('Gagal') ? '#f87171' : '#34d399', fontSize: '13px' }}>{msg}</p>}
          </div>
        </div>
      </main>
    </div>
  )
}