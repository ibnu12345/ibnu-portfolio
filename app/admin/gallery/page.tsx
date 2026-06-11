'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/admin/Sidebar'
import { supabase } from '../../lib/supabase'
import { uploadFile } from '../../lib/upload'

export default function AdminGallery() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => { checkAuth(); load() }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) router.push('/admin/login')
    else setLoading(false)
  }

  async function load() {
    const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const url = await uploadFile(file, 'gallery')
      if (url) await supabase.from('gallery').insert({ image_url: url, title: file.name.split('.')[0] })
    }
    setUploading(false); load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus foto ini?')) return
    await supabase.from('gallery').delete().eq('id', id); load()
  }

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: 'white' }}>Loading...</div>

  return (
    <div className='admin-layout'>
      <Sidebar />
      <main className='admin-main'>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'white', margin: 0 }}>Gallery</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>{items.length} foto</p>
          </div>
          <label style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer' }}>
            {uploading ? 'Uploading...' : '+ Upload Foto'}
            <input type="file" accept="image/*" multiple onChange={handleUpload} style={{ display: 'none' }} />
          </label>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
          {items.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>Belum ada foto.</div>}
          {items.map(item => (
            <div key={item.id} style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', aspectRatio: '1', background: 'rgba(255,255,255,0.05)' }}>
              <img src={item.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.6)'; (e.currentTarget as HTMLElement).style.opacity = '1' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0)'; (e.currentTarget as HTMLElement).style.opacity = '0' }}>
                <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.8)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}