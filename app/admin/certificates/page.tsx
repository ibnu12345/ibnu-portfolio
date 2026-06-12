'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { uploadFile } from '../../lib/upload'

const empty = { name: '', category: '', credential_url: '', issued_date: '', image_url: '', is_featured: false }

export default function AdminCertificates() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<any>(empty)
  const [saving, setSaving] = useState(false)

  useEffect(() => { checkAuth(); load() }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) router.push('/admin/login')
    else setLoading(false)
  }

  async function load() {
    const { data } = await supabase.from('certificate').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }

  async function handleSave() {
    setSaving(true)
    if (form.id) await supabase.from('certificate').update(form).eq('id', form.id)
    else await supabase.from('certificate').insert(form)
    setSaving(false); setShowForm(false); setForm(empty); load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus sertifikat ini?')) return
    await supabase.from('certificate').delete().eq('id', id); load()
  }

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadFile(file, 'thumbnails')
    if (url) setForm((f: any) => ({ ...f, image_url: url }))
  }

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: 'white' }}>Loading...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'white', margin: 0 }}>Certificates</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>{items.length} sertifikat</p>
        </div>
        <button onClick={() => { setForm(empty); setShowForm(true) }} style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer' }}>+ Upload Sertifikat</button>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>{form.id ? 'Edit' : 'Upload'} Sertifikat</h2>
            <div style={{ display: 'grid', gap: '14px' }}>
              {[{ key: 'name', label: 'Nama Sertifikat *' }, { key: 'category', label: 'Kategori' }, { key: 'credential_url', label: 'Credential URL' }, { key: 'issued_date', label: 'Tanggal', type: 'date' }].map(f => (
                <div key={f.key}>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                  <input type={f.type || 'text'} value={form[f.key] || ''} onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 12px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              ))}
              <div>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Gambar Sertifikat</label>
                <input type="file" accept="image/*" onChange={handleImage} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }} />
                {form.image_url && <img src={form.image_url} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px' }} />}
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.is_featured} onChange={e => setForm((p: any) => ({ ...p, is_featured: e.target.checked }))} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Featured</span>
              </label>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer' }}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', cursor: 'pointer' }}>Batal</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {items.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>Belum ada sertifikat.</div>}
        {items.map(item => (
          <div key={item.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ height: '120px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.image_url ? <img src={item.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '32px' }}>🏆</span>}
            </div>
            <div style={{ padding: '12px' }}>
              <p style={{ color: 'white', fontSize: '12px', fontWeight: 500, margin: '0 0 4px' }}>{item.name}</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', margin: '0 0 10px' }}>{item.category}</p>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => { setForm(item); setShowForm(true) }} style={{ flex: 1, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', padding: '5px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(item.id)} style={{ flex: 1, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '5px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>Hapus</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}