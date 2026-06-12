'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

type EduItem = { id?: string; year: string; degree: string; institution: string; description: string; sort_order: number }
type OrgItem = { id?: string; year: string; position: string; org_name: string; description: string; sort_order: number }

const emptyEdu: EduItem = { year: '', degree: '', institution: '', description: '', sort_order: 0 }
const emptyOrg: OrgItem = { year: '', position: '', org_name: '', description: '', sort_order: 0 }

export default function AdminAbout() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [education, setEducation] = useState<EduItem[]>([])
  const [organizations, setOrganizations] = useState<OrgItem[]>([])
  const [editEdu, setEditEdu] = useState<EduItem | null>(null)
  const [editOrg, setEditOrg] = useState<OrgItem | null>(null)
  const [msg, setMsg] = useState('')

  useEffect(() => { checkAuth(); loadData() }, [])

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) router.push('/admin/login')
    else setLoading(false)
  }

  async function loadData() {
    const [e, o] = await Promise.all([
      supabase.from('education').select('*').order('sort_order'),
      supabase.from('organization').select('*').order('sort_order'),
    ])
    setEducation(e.data || [])
    setOrganizations(o.data || [])
  }

  async function saveEdu() {
    if (!editEdu) return
    const { id, ...data } = editEdu
    if (id) await supabase.from('education').update(data).eq('id', id)
    else await supabase.from('education').insert(data)
    setEditEdu(null); loadData(); showMsg('Tersimpan!')
  }

  async function deleteEdu(id: string) {
    if (!confirm('Hapus data ini?')) return
    await supabase.from('education').delete().eq('id', id); loadData()
  }

  async function saveOrg() {
    if (!editOrg) return
    const { id, ...data } = editOrg
    if (id) await supabase.from('organization').update(data).eq('id', id)
    else await supabase.from('organization').insert(data)
    setEditOrg(null); loadData(); showMsg('Tersimpan!')
  }

  async function deleteOrg(id: string) {
    if (!confirm('Hapus data ini?')) return
    await supabase.from('organization').delete().eq('id', id); loadData()
  }

  function showMsg(m: string) { setMsg(m); setTimeout(() => setMsg(''), 3000) }

  const inputStyle = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 12px', color: 'white', fontSize: '14px', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { color: 'rgba(255,255,255,0.5)', fontSize: '12px', display: 'block', marginBottom: '6px' }

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', color: 'white' }}>Loading...</div>

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'white', margin: 0 }}>About — Education & Organisasi</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '4px' }}>Kelola riwayat pendidikan dan pengalaman organisasi</p>
        </div>
        {msg && <p style={{ color: '#34d399', fontSize: '13px' }}>{msg}</p>}
      </div>

      {/* EDUCATION */}
      <div style={{ marginBottom: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 600, margin: 0 }}>Riwayat Pendidikan</h2>
          <button onClick={() => setEditEdu({ ...emptyEdu })} style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}>+ Tambah</button>
        </div>
        {editEdu && (
          <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div><label style={labelStyle}>Tahun</label><input value={editEdu.year} onChange={e => setEditEdu(p => p ? { ...p, year: e.target.value } : p)} style={inputStyle} placeholder="2020–2024" /></div>
                <div><label style={labelStyle}>Gelar / Program Studi</label><input value={editEdu.degree} onChange={e => setEditEdu(p => p ? { ...p, degree: e.target.value } : p)} style={inputStyle} /></div>
              </div>
              <div><label style={labelStyle}>Institusi</label><input value={editEdu.institution} onChange={e => setEditEdu(p => p ? { ...p, institution: e.target.value } : p)} style={inputStyle} /></div>
              <div><label style={labelStyle}>Deskripsi</label><textarea value={editEdu.description} onChange={e => setEditEdu(p => p ? { ...p, description: e.target.value } : p)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} /></div>
              <div><label style={labelStyle}>Urutan</label><input type="number" value={editEdu.sort_order} onChange={e => setEditEdu(p => p ? { ...p, sort_order: parseInt(e.target.value) } : p)} style={{ ...inputStyle, width: '100px' }} /></div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={saveEdu} style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer' }}>Simpan</button>
                <button onClick={() => setEditEdu(null)} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer' }}>Batal</button>
              </div>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {education.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>Belum ada data.</p>}
          {education.map(item => (
            <div key={item.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px' }}>
              <div>
                <p style={{ color: '#818cf8', fontSize: '12px', margin: '0 0 4px' }}>{item.year}</p>
                <p style={{ color: 'white', fontWeight: 500, fontSize: '14px', margin: '0 0 2px' }}>{item.degree}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0 }}>{item.institution}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => setEditEdu(item)} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => deleteEdu(item.id!)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ORGANIZATION */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 600, margin: 0 }}>Pengalaman Organisasi</h2>
          <button onClick={() => setEditOrg({ ...emptyOrg })} style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' }}>+ Tambah</button>
        </div>
        {editOrg && (
          <div style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '16px', padding: '24px', marginBottom: '16px' }}>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                <div><label style={labelStyle}>Tahun</label><input value={editOrg.year} onChange={e => setEditOrg(p => p ? { ...p, year: e.target.value } : p)} style={inputStyle} /></div>
                <div><label style={labelStyle}>Posisi / Jabatan</label><input value={editOrg.position} onChange={e => setEditOrg(p => p ? { ...p, position: e.target.value } : p)} style={inputStyle} /></div>
              </div>
              <div><label style={labelStyle}>Nama Organisasi</label><input value={editOrg.org_name} onChange={e => setEditOrg(p => p ? { ...p, org_name: e.target.value } : p)} style={inputStyle} /></div>
              <div><label style={labelStyle}>Deskripsi</label><textarea value={editOrg.description} onChange={e => setEditOrg(p => p ? { ...p, description: e.target.value } : p)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} /></div>
              <div><label style={labelStyle}>Urutan</label><input type="number" value={editOrg.sort_order} onChange={e => setEditOrg(p => p ? { ...p, sort_order: parseInt(e.target.value) } : p)} style={{ ...inputStyle, width: '100px' }} /></div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={saveOrg} style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer' }}>Simpan</button>
                <button onClick={() => setEditOrg(null)} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', cursor: 'pointer' }}>Batal</button>
              </div>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {organizations.length === 0 && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>Belum ada data.</p>}
          {organizations.map(item => (
            <div key={item.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px' }}>
              <div>
                <p style={{ color: '#a78bfa', fontSize: '12px', margin: '0 0 4px' }}>{item.year}</p>
                <p style={{ color: 'white', fontWeight: 500, fontSize: '14px', margin: '0 0 2px' }}>{item.position}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0 }}>{item.org_name}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => setEditOrg(item)} style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
                <button onClick={() => deleteOrg(item.id!)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' }}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}