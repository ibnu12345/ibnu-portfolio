'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function AdminSkills() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<any[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [showCatForm, setShowCatForm] = useState(false)
  const [showSkillForm, setShowSkillForm] = useState(false)
  const [catForm, setCatForm] = useState<any>({ name: '', icon: '' })
  const [skillForm, setSkillForm] = useState<any>({ name: '', category_id: '', percentage: 80, description: '', icon: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { checkAuth(); load() }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) router.push('/admin/login')
    else setLoading(false)
  }

  async function load() {
    const [c, s] = await Promise.all([
      supabase.from('skill_category').select('*').order('sort_order'),
      supabase.from('skill').select('*').order('sort_order'),
    ])
    setCategories(c.data || [])
    setSkills(s.data || [])
  }

  async function saveCat() {
    setSaving(true)
    if (catForm.id) await supabase.from('skill_category').update(catForm).eq('id', catForm.id)
    else await supabase.from('skill_category').insert(catForm)
    setSaving(false); setShowCatForm(false); setCatForm({ name: '', icon: '' }); load()
  }

  async function saveSkill() {
    setSaving(true)
    if (skillForm.id) await supabase.from('skill').update(skillForm).eq('id', skillForm.id)
    else await supabase.from('skill').insert(skillForm)
    setSaving(false); setShowSkillForm(false); setSkillForm({ name: '', category_id: '', percentage: 80, description: '', icon: '' }); load()
  }

  async function deleteCat(id: string) {
    if (!confirm('Hapus kategori dan semua skill di dalamnya?')) return
    await supabase.from('skill_category').delete().eq('id', id); load()
  }

  async function deleteSkill(id: string) {
    if (!confirm('Hapus skill ini?')) return
    await supabase.from('skill').delete().eq('id', id); load()
  }

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: 'white' }}>Loading...</div>

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'white', marginBottom: '8px' }}>Skills</h1>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '32px' }}>Kelola kategori dan skill</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '24px' }}>
        {/* Categories */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ color: 'white', fontSize: '16px', fontWeight: 600, margin: 0 }}>Kategori</h2>
            <button onClick={() => { setCatForm({ name: '', icon: '' }); setShowCatForm(true) }} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>+ Tambah</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {categories.map(cat => (
              <div key={cat.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'white', fontSize: '13px' }}>{cat.icon} {cat.name}</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => { setCatForm(cat); setShowCatForm(true) }} style={{ background: 'transparent', border: 'none', color: '#818cf8', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => deleteCat(cat.id)} style={{ background: 'transparent', border: 'none', color: '#f87171', fontSize: '12px', cursor: 'pointer' }}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ color: 'white', fontSize: '16px', fontWeight: 600, margin: 0 }}>Skills</h2>
            <button onClick={() => { setSkillForm({ name: '', category_id: '', percentage: 80, description: '', icon: '' }); setShowSkillForm(true) }} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>+ Tambah Skill</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {skills.map(skill => {
              const cat = categories.find(c => c.id === skill.category_id)
              return (
                <div key={skill.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <span style={{ color: 'white', fontSize: '13px', fontWeight: 500 }}>{skill.name}</span>
                      {cat && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginLeft: '8px' }}>{cat.name}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ color: '#818cf8', fontSize: '12px' }}>{skill.percentage}%</span>
                      <button onClick={() => { setSkillForm(skill); setShowSkillForm(true) }} style={{ background: 'transparent', border: 'none', color: '#818cf8', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                      <button onClick={() => deleteSkill(skill.id)} style={{ background: 'transparent', border: 'none', color: '#f87171', fontSize: '12px', cursor: 'pointer' }}>Hapus</button>
                    </div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '4px', height: '4px' }}>
                    <div style={{ background: '#818cf8', height: '4px', borderRadius: '4px', width: `${skill.percentage}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Category Form Modal */}
      {showCatForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '20px' }}>{catForm.id ? 'Edit' : 'Tambah'} Kategori</h2>
            {[{ key: 'name', label: 'Nama Kategori' }, { key: 'icon', label: 'Icon (emoji)' }].map(f => (
              <div key={f.key} style={{ marginBottom: '14px' }}>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>{f.label}</label>
                <input value={catForm[f.key] || ''} onChange={e => setCatForm((p: any) => ({ ...p, [f.key]: e.target.value }))}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 12px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button onClick={saveCat} disabled={saving} style={{ flex: 1, background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer' }}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
              <button onClick={() => setShowCatForm(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', cursor: 'pointer' }}>Batal</button>
            </div>
          </div>
        </div>
      )}

      {/* Skill Form Modal */}
      {showSkillForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '20px' }}>{skillForm.id ? 'Edit' : 'Tambah'} Skill</h2>
            <div style={{ display: 'grid', gap: '14px' }}>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Nama Skill</label>
                <input value={skillForm.name} onChange={e => setSkillForm((p: any) => ({ ...p, name: e.target.value }))}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 12px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Kategori</label>
                <select value={skillForm.category_id} onChange={e => setSkillForm((p: any) => ({ ...p, category_id: e.target.value }))}
                  style={{ width: '100%', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 12px', color: 'white', fontSize: '14px', outline: 'none' }}>
                  <option value="">Pilih Kategori</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Persentase: {skillForm.percentage}%</label>
                <input type="range" min={0} max={100} value={skillForm.percentage} onChange={e => setSkillForm((p: any) => ({ ...p, percentage: Number(e.target.value) }))} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Deskripsi</label>
                <input value={skillForm.description || ''} onChange={e => setSkillForm((p: any) => ({ ...p, description: e.target.value }))}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 12px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button onClick={saveSkill} disabled={saving} style={{ flex: 1, background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '12px', cursor: 'pointer' }}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
              <button onClick={() => setShowSkillForm(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px', cursor: 'pointer' }}>Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}