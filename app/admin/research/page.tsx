'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/admin/Sidebar'
import { supabase } from '../../lib/supabase'
import { uploadFile } from '../../lib/upload'
import type { Research } from '../../lib/types'

const empty = { title: '', description: '', journal_name: '', published_date: '', thumbnail_url: '', pdf_url: '', video_url: '', is_featured: false }

export default function AdminResearch() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<Research[]>([])
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
    const { data } = await supabase.from('research').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }

  async function handleSave() {
    setSaving(true)
    if (form.id) {
      await supabase.from('research').update({ ...form, updated_at: new Date().toISOString() }).eq('id', form.id)
    } else {
      await supabase.from('research').insert(form)
    }
    setSaving(false)
    setShowForm(false)
    setForm(empty)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus penelitian ini?')) return
    await supabase.from('research').delete().eq('id', id)
    load()
  }

  async function handleThumb(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadFile(file, 'thumbnails')
    if (url) setForm((f: any) => ({ ...f, thumbnail_url: url }))
  }

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: 'white' }}>Loading...</div>

  return (
    <div className='admin-layout'>
      <Sidebar />
      <main className='admin-main'>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'white', margin: 0 }}>Research</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>{items.length} penelitian</p>
          </div>
          <button onClick={() => { setForm(empty); setShowForm(true) }} style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer' }}>
            + Tambah Research
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
            <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
              <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>{form.id ? 'Edit' : 'Tambah'} Research</h2>
              <div style={{ display: 'grid', gap: '14px' }}>
                {[
                  { key: 'title', label: 'Judul *', type: 'text' },
                  { key: 'journal_name', label: 'Nama Jurnal', type: 'text' },
                  { key: 'published_date', label: 'Tanggal Publikasi', type: 'date' },
                  { key: 'video_url', label: 'Video URL', type: 'text' },
                  { key: 'pdf_url', label: 'PDF URL', type: 'text' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                    <input type={f.type} value={form[f.key] || ''} onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 12px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Deskripsi</label>
                  <textarea value={form.description || ''} onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))} rows={3}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 12px', color: 'white', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Thumbnail</label>
                  <input type="file" accept="image/*" onChange={handleThumb} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }} />
                  {form.thumbnail_url && <img src={form.thumbnail_url} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px' }} />}
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm((p: any) => ({ ...p, is_featured: e.target.checked }))} />
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Featured</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', cursor: 'pointer' }}>
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button onClick={() => setShowForm(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', fontSize: '14px', cursor: 'pointer' }}>
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* List */}
        <div style={{ display: 'grid', gap: '12px' }}>
          {items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>
              Belum ada research. Klik "+ Tambah Research" untuk mulai.
            </div>
          )}
          {items.map(item => (
            <div key={item.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <p style={{ color: 'white', fontWeight: 500, fontSize: '14px', margin: 0 }}>{item.title}</p>
                  {item.is_featured && <span style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8', fontSize: '10px', padding: '2px 8px', borderRadius: '999px' }}>Featured</span>}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', margin: 0 }}>{item.journal_name} {item.published_date && `· ${item.published_date}`}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => { setForm(item); setShowForm(true) }} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}