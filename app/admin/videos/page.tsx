'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/admin/Sidebar'
import { supabase } from '../../lib/supabase'

const empty = { title: '', youtube_url: '', description: '', is_featured: false }

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

export default function AdminVideos() {
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
    const { data } = await supabase.from('video').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }

  async function handleSave() {
    setSaving(true)
    const ytId = getYouTubeId(form.youtube_url)
    const payload = { ...form, thumbnail_url: ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null }
    if (form.id) await supabase.from('video').update(payload).eq('id', form.id)
    else await supabase.from('video').insert(payload)
    setSaving(false); setShowForm(false); setForm(empty); load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus video ini?')) return
    await supabase.from('video').delete().eq('id', id); load()
  }

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: 'white' }}>Loading...</div>

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0f' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'white', margin: 0 }}>Videos</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>{items.length} video</p>
          </div>
          <button onClick={() => { setForm(empty); setShowForm(true) }} style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer' }}>+ Tambah Video</button>
        </div>

        {showForm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
            <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '480px' }}>
              <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>{form.id ? 'Edit' : 'Tambah'} Video</h2>
              <div style={{ display: 'grid', gap: '14px' }}>
                {[
                  { key: 'title', label: 'Judul *' },
                  { key: 'youtube_url', label: 'YouTube URL *' },
                  { key: 'description', label: 'Deskripsi' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                    <input value={form[f.key] || ''} onChange={e => setForm((p: any) => ({ ...p, [f.key]: e.target.value }))}
                      style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 12px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
                {form.youtube_url && getYouTubeId(form.youtube_url) && (
                  <img src={`https://img.youtube.com/vi/${getYouTubeId(form.youtube_url)}/hqdefault.jpg`} style={{ width: '100%', borderRadius: '8px' }} />
                )}
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {items.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>Belum ada video.</div>}
          {items.map(item => (
            <div key={item.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ height: '140px', background: 'rgba(255,255,255,0.05)', position: 'relative' }}>
                {item.thumbnail_url && <img src={item.thumbnail_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '40px', height: '40px', background: 'rgba(0,0,0,0.6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>▶</div>
                </div>
              </div>
              <div style={{ padding: '12px' }}>
                <p style={{ color: 'white', fontSize: '13px', fontWeight: 500, margin: '0 0 8px' }}>{item.title}</p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => { setForm(item); setShowForm(true) }} style={{ flex: 1, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', padding: '5px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(item.id)} style={{ flex: 1, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '5px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}>Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}