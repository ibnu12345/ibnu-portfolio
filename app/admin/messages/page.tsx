'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '../../components/admin/Sidebar'
import { supabase } from '../../lib/supabase'
import type { ContactMessage } from '../../lib/types'

export default function AdminMessages() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<ContactMessage[]>([])
  const [selected, setSelected] = useState<ContactMessage | null>(null)

  useEffect(() => { checkAuth(); load() }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) router.push('/admin/login')
    else setLoading(false)
  }

  async function load() {
    const { data } = await supabase.from('contact_message').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }

  async function markRead(id: string) {
    await supabase.from('contact_message').update({ is_read: true }).eq('id', id)
    load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus pesan ini?')) return
    await supabase.from('contact_message').delete().eq('id', id)
    setSelected(null)
    load()
  }

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: 'white' }}>Loading...</div>

  return (
    <div className='admin-layout'>
      <Sidebar />
      <main className='admin-main'>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Messages</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px' }}>{items.filter(i => !i.is_read).length} pesan belum dibaca</p>

        <div style={{ display: 'grid', gap: '10px' }}>
          {items.length === 0 && <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>Belum ada pesan masuk.</div>}
          {items.map(item => (
            <div key={item.id} onClick={() => { setSelected(item); markRead(item.id) }}
              style={{ background: item.is_read ? 'rgba(255,255,255,0.02)' : 'rgba(99,102,241,0.05)', border: `1px solid ${item.is_read ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.2)'}`, borderRadius: '12px', padding: '16px 20px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <p style={{ color: 'white', fontWeight: item.is_read ? 400 : 600, fontSize: '14px', margin: 0 }}>{item.name}</p>
                  {!item.is_read && <span style={{ width: '6px', height: '6px', background: '#818cf8', borderRadius: '50%', display: 'inline-block' }} />}
                </div>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: '2px 0 0' }}>{item.subject || 'No subject'} · {item.email}</p>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>{new Date(item.created_at).toLocaleDateString('id-ID')}</p>
            </div>
          ))}
        </div>

        {/* Detail Modal */}
        {selected && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
            <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '520px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ color: 'white', fontSize: '18px', margin: 0 }}>{selected.name}</h2>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '4px' }}>{selected.email}</p>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
              </div>
              {selected.subject && <p style={{ color: '#818cf8', fontSize: '13px', marginBottom: '12px' }}>Subject: {selected.subject}</p>}
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', lineHeight: 1.7, marginBottom: '24px' }}>{selected.message}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <a href={`mailto:${selected.email}`} style={{ flex: 1, background: '#4f46e5', color: 'white', padding: '10px', borderRadius: '8px', fontSize: '13px', textDecoration: 'none', textAlign: 'center' }}>Balas via Email</a>
                <button onClick={() => handleDelete(selected.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>Hapus</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}