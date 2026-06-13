'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import { uploadFile } from '../../lib/upload'

const empty = {
  title: '', slug: '', description: '', category: '',
  thumbnail_url: '', gallery_urls: [] as string[],
  youtube_url: '', pdf_url: '',
  external_urls: [] as string[],
  tags: '', is_featured: false
}

function generateSlug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function AdminPortfolio() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<any>(empty)
  const [saving, setSaving] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [newLink, setNewLink] = useState('')
  const [newCatInput, setNewCatInput] = useState('')
  const [showNewCat, setShowNewCat] = useState(false)
  const [addingCat, setAddingCat] = useState(false)

  useEffect(() => { checkAuth(); load(); loadCategories() }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) router.push('/admin/login')
    else setLoading(false)
  }

  async function load() {
    const { data } = await supabase.from('portfolio').select('*').order('created_at', { ascending: false })
    setItems(data || [])
  }

  async function loadCategories() {
    // Ambil dari tabel kategori
    const { data: catData } = await supabase.from('portfolio_categories').select('name')
    const fromTable = (catData || []).map((r: any) => r.name as string)

    // Ambil kategori yang sudah dipakai di portfolio (yang belum ada di tabel)
    const { data: portData } = await supabase.from('portfolio').select('category').not('category', 'is', null).neq('category', '')
    const fromPortfolio = [...new Set((portData || []).map((r: any) => r.category as string).filter(Boolean))]
    const missing = fromPortfolio.filter(c => !fromTable.includes(c))

    // Auto-insert kategori yang belum ada di tabel
    if (missing.length > 0) {
      await supabase.from('portfolio_categories').insert(missing.map(name => ({ name })))
    }

    // Gabungkan & sort
    const all = [...new Set([...fromTable, ...missing])].sort()
    setCategories(all)
  }

  async function handleAddCategory() {
    const name = newCatInput.trim()
    if (!name) return
    setAddingCat(true)
    const { error } = await supabase.from('portfolio_categories').insert({ name })
    if (!error) {
      await loadCategories()
      setForm((p: any) => ({ ...p, category: name }))
      setNewCatInput('')
      setShowNewCat(false)
    }
    setAddingCat(false)
  }

  async function handleDeleteCategory(name: string) {
    if (!confirm(`Hapus kategori "${name}"? Portfolio yang sudah pakai kategori ini tidak terpengaruh.`)) return
    await supabase.from('portfolio_categories').delete().eq('name', name)
    await loadCategories()
    if (form.category === name) setForm((p: any) => ({ ...p, category: '' }))
  }

  async function handleSave() {
    if (!form.title) return
    setSaving(true)
    const payload = {
      ...form,
      tags: typeof form.tags === 'string' ? form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : form.tags,
      slug: form.slug || generateSlug(form.title),
      updated_at: new Date().toISOString()
    }
    if (form.id) await supabase.from('portfolio').update(payload).eq('id', form.id)
    else await supabase.from('portfolio').insert(payload)
    setSaving(false); setShowForm(false); setForm(empty); load()
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus portfolio ini?')) return
    await supabase.from('portfolio').delete().eq('id', id); load()
  }

  async function handleThumb(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await uploadFile(file, 'thumbnails')
    if (url) setForm((f: any) => ({ ...f, thumbnail_url: url }))
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files) return
    setUploadingGallery(true)
    const urls: string[] = []
    for (const file of Array.from(files)) {
      const url = await uploadFile(file, 'thumbnails')
      if (url) urls.push(url)
    }
    setForm((f: any) => ({ ...f, gallery_urls: [...(f.gallery_urls || []), ...urls] }))
    setUploadingGallery(false)
  }

  function removeGalleryImg(idx: number) {
    setForm((f: any) => ({ ...f, gallery_urls: f.gallery_urls.filter((_: string, i: number) => i !== idx) }))
  }

  function addLink() {
    if (!newLink.trim()) return
    setForm((f: any) => ({ ...f, external_urls: [...(f.external_urls || []), newLink.trim()] }))
    setNewLink('')
  }

  function removeLink(idx: number) {
    setForm((f: any) => ({ ...f, external_urls: f.external_urls.filter((_: string, i: number) => i !== idx) }))
  }

  function openEdit(item: any) {
    setForm({
      ...item,
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
      gallery_urls: item.gallery_urls || [],
      external_urls: item.external_urls || [],
    })
    setShowForm(true)
  }

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 12px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { color: 'rgba(255,255,255,0.5)', fontSize: '12px', display: 'block', marginBottom: '6px' }

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: 'white' }}>Loading...</div>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'white', margin: 0 }}>Portfolio</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>{items.length} karya</p>
        </div>
        <button onClick={() => { setForm(empty); setShowForm(true) }} style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer' }}>+ Tambah Portfolio</button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '680px', maxHeight: '92vh', overflowY: 'auto' }}>
            <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 600, marginBottom: '24px' }}>{form.id ? 'Edit' : 'Tambah'} Portfolio</h2>

            <div style={{ display: 'grid', gap: '16px' }}>
              {/* Judul */}
              <div>
                <label style={labelStyle}>Judul *</label>
                <input value={form.title} onChange={e => setForm((p: any) => ({ ...p, title: e.target.value, slug: generateSlug(e.target.value) }))} style={inputStyle} placeholder="Nama proyek..." />
              </div>

              {/* Slug */}
              <div>
                <label style={labelStyle}>Slug (auto dari judul)</label>
                <input value={form.slug} onChange={e => setForm((p: any) => ({ ...p, slug: e.target.value }))} style={{ ...inputStyle, color: 'rgba(255,255,255,0.5)' }} />
              </div>

              {/* Kategori + Tags */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Kategori</label>

                  {/* Dropdown + tombol tambah kategori */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select
                      value={form.category || ''}
                      onChange={e => setForm((p: any) => ({ ...p, category: e.target.value }))}
                      style={{ ...inputStyle, background: '#1a1a2e', flex: 1 }}
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button
                      onClick={() => setShowNewCat(v => !v)}
                      title="Tambah kategori baru"
                      style={{
                        background: showNewCat ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(99,102,241,0.3)',
                        color: '#818cf8', borderRadius: '8px',
                        padding: '0 12px', cursor: 'pointer',
                        fontSize: '18px', flexShrink: 0,
                        transition: 'all 0.15s',
                      }}
                    >
                      {showNewCat ? '×' : '+'}
                    </button>
                  </div>

                  {/* Input kategori baru */}
                  {showNewCat && (
                    <div style={{ marginTop: '8px', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', padding: '12px' }}>
                      <p style={{ color: '#818cf8', fontSize: '11px', marginBottom: '8px', fontWeight: 500 }}>TAMBAH KATEGORI BARU</p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          value={newCatInput}
                          onChange={e => setNewCatInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                          placeholder="Nama kategori..."
                          style={{ ...inputStyle, flex: 1, padding: '8px 10px', fontSize: '13px' }}
                        />
                        <button
                          onClick={handleAddCategory}
                          disabled={addingCat || !newCatInput.trim()}
                          style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', cursor: 'pointer', flexShrink: 0, opacity: (!newCatInput.trim() || addingCat) ? 0.5 : 1 }}
                        >
                          {addingCat ? '...' : 'Simpan'}
                        </button>
                      </div>

                      {/* Daftar kategori yang bisa dihapus */}
                      {categories.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginBottom: '6px' }}>Kategori tersedia:</p>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {categories.map(cat => (
                              <span key={cat} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '3px 10px 3px 10px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                                {cat}
                                <button
                                  onClick={() => handleDeleteCategory(cat)}
                                  title={`Hapus "${cat}"`}
                                  style={{ background: 'transparent', border: 'none', color: 'rgba(239,68,68,0.6)', cursor: 'pointer', fontSize: '12px', padding: '0 0 0 2px', lineHeight: 1 }}
                                >
                                  ×
                                </button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label style={labelStyle}>Tags (pisah koma)</label>
                  <input value={form.tags || ''} onChange={e => setForm((p: any) => ({ ...p, tags: e.target.value }))} style={inputStyle} placeholder="tag1, tag2" />
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label style={labelStyle}>Deskripsi</label>
                <textarea value={form.description || ''} onChange={e => setForm((p: any) => ({ ...p, description: e.target.value }))} rows={4}
                  style={{ ...inputStyle, resize: 'vertical' }} placeholder="Ceritakan tentang proyek ini..." />
              </div>

              {/* Thumbnail */}
              <div>
                <label style={labelStyle}>Thumbnail Utama</label>
                <input type="file" accept="image/*" onChange={handleThumb} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }} />
                {form.thumbnail_url && (
                  <div style={{ position: 'relative', display: 'inline-block', marginTop: '8px' }}>
                    <img src={form.thumbnail_url} style={{ width: '120px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                    <button onClick={() => setForm((f: any) => ({ ...f, thumbnail_url: '' }))}
                      style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', border: 'none', color: 'white', borderRadius: '50%', width: '20px', height: '20px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                  </div>
                )}
              </div>

              {/* Gallery */}
              <div>
                <label style={labelStyle}>Foto Gallery (bisa banyak)</label>
                <label style={{ display: 'inline-block', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', marginBottom: '12px' }}>
                  {uploadingGallery ? 'Mengupload...' : '+ Upload Foto'}
                  <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} style={{ display: 'none' }} />
                </label>
                {form.gallery_urls?.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {form.gallery_urls.map((url: string, i: number) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img src={url} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }} />
                        <button onClick={() => removeGalleryImg(i)}
                          style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#ef4444', border: 'none', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* YouTube */}
              <div>
                <label style={labelStyle}>YouTube URL</label>
                <input value={form.youtube_url || ''} onChange={e => setForm((p: any) => ({ ...p, youtube_url: e.target.value }))} style={inputStyle} placeholder="https://youtube.com/watch?v=..." />
              </div>

              {/* PDF */}
              <div>
                <label style={labelStyle}>PDF URL</label>
                <input value={form.pdf_url || ''} onChange={e => setForm((p: any) => ({ ...p, pdf_url: e.target.value }))} style={inputStyle} placeholder="https://..." />
              </div>

              {/* External Links */}
              <div>
                <label style={labelStyle}>Link Lainnya (TikTok, Instagram, Drive, dll)</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <input value={newLink} onChange={e => setNewLink(e.target.value)} onKeyDown={e => e.key === 'Enter' && addLink()}
                    style={{ ...inputStyle, flex: 1 }} placeholder="https://tiktok.com/... atau link apapun" />
                  <button onClick={addLink} style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', fontSize: '13px', flexShrink: 0 }}>+ Tambah</button>
                </div>
                {(form.external_urls || []).map((url: string, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 12px', marginBottom: '6px' }}>
                    <span style={{ flex: 1, color: 'rgba(255,255,255,0.6)', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</span>
                    <button onClick={() => removeLink(i)} style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '14px', flexShrink: 0 }}>✕</button>
                  </div>
                ))}
              </div>

              {/* Featured */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.is_featured} onChange={e => setForm((p: any) => ({ ...p, is_featured: e.target.checked }))} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px' }}>Featured di halaman Home</span>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button onClick={handleSave} disabled={saving} style={{ flex: 1, background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', fontSize: '14px', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', fontSize: '14px', cursor: 'pointer' }}>Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ display: 'grid', gap: '12px' }}>
        {items.length === 0 && <div style={{ textAlign: 'center', padding: '60px', color: 'rgba(255,255,255,0.3)' }}>Belum ada portfolio.</div>}
        {items.map(item => (
          <div key={item.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            {item.thumbnail_url && <img src={item.thumbnail_url} style={{ width: '64px', height: '48px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <p style={{ color: 'white', fontWeight: 500, fontSize: '14px', margin: 0 }}>{item.title}</p>
                {item.is_featured && <span style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8', fontSize: '10px', padding: '2px 8px', borderRadius: '999px' }}>Featured</span>}
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>{item.category}</span>
                {item.gallery_urls?.length > 0 && <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>🖼 {item.gallery_urls.length} foto</span>}
                {item.youtube_url && <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>▶ YouTube</span>}
                {item.external_urls?.length > 0 && <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>🔗 {item.external_urls.length} link</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button onClick={() => openEdit(item)} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
              <button onClick={() => handleDelete(item.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}