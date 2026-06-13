'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'
import { motion } from 'framer-motion'

function getYouTubeId(url: string) {
  const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
  return match ? match[1] : null
}

function getTikTokId(url: string) {
  const match = url?.match(/tiktok\.com\/.+\/video\/(\d+)/)
  return match ? match[1] : null
}

function getInstagramId(url: string) {
  const match = url?.match(/instagram\.com\/(?:p|reel)\/([^/?]+)/)
  return match ? match[1] : null
}

function getLinkType(url: string) {
  if (!url) return 'link'
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('tiktok.com')) return 'tiktok'
  if (url.includes('instagram.com')) return 'instagram'
  if (url.includes('drive.google.com')) return 'gdrive'
  if (url.endsWith('.pdf') || url.includes('pdf')) return 'pdf'
  return 'link'
}

function getLinkLabel(url: string) {
  const type = getLinkType(url)
  const labels: Record<string, string> = {
    youtube: '▶ YouTube',
    tiktok: '🎵 TikTok',
    instagram: '📸 Instagram',
    gdrive: '📁 Google Drive',
    pdf: '📄 PDF',
    link: '🔗 Buka Link',
  }
  return labels[type]
}

export default function PortfolioDetailPage() {
  const { slug } = useParams()
  const [item, setItem] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [playYT, setPlayYT] = useState(false)

  useEffect(() => {
    if (!slug) return
    // Try by slug first, fallback to id
    supabase.from('portfolio').select('*').eq('slug', slug).single()
      .then(({ data }) => {
        if (data) { setItem(data); setLoading(false) }
        else {
          supabase.from('portfolio').select('*').eq('id', slug).single()
            .then(({ data: d2 }) => { setItem(d2); setLoading(false) })
        }
      })
  }, [slug])

  if (loading) return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ color: 'rgba(255,255,255,0.4)' }}>Memuat...</motion.p>
    </div>
  )

  if (!item) return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <p style={{ fontSize: '48px' }}>🎨</p>
      <p style={{ color: 'white', fontSize: '20px' }}>Portfolio tidak ditemukan</p>
      <Link href="/portfolio" style={{ color: '#818cf8', textDecoration: 'none' }}>← Kembali ke Portfolio</Link>
    </div>
  )

  // Build image list: thumbnail + gallery
  const allImages = [
    ...(item.thumbnail_url ? [item.thumbnail_url] : []),
    ...(item.gallery_urls || []),
  ]

  const ytId = item.youtube_url ? getYouTubeId(item.youtube_url) : null

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white', paddingTop: '100px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px 80px' }}>

        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link href="/portfolio" style={{ color: '#818cf8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', marginBottom: '32px' }}>
            ← Kembali ke Portfolio
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
            {item.category && <span style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontSize: '12px', padding: '4px 12px', borderRadius: '999px' }}>{item.category}</span>}
            {item.tags?.map((tag: string) => <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', fontSize: '12px', padding: '4px 12px', borderRadius: '999px' }}>{tag}</span>)}
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 4vw, 36px)', fontWeight: 800, color: 'white', lineHeight: 1.3, margin: 0 }}>{item.title}</h1>
        </motion.div>

        {/* YouTube Player */}
        {ytId && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
            style={{ marginBottom: '32px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', aspectRatio: '16/9', position: 'relative', background: '#000', cursor: 'pointer' }}
            onClick={() => setPlayYT(true)}>
            {playYT ? (
              <iframe src={`https://www.youtube.com/embed/${ytId}?autoplay=1`} style={{ width: '100%', height: '100%', border: 'none' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            ) : (
              <>
                <img src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="YouTube thumbnail" />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.3)' }}>
                  <div style={{ width: '72px', height: '72px', background: 'rgba(255,0,0,0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Image Gallery */}
        {allImages.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} style={{ marginBottom: '32px' }}>
            {/* Main image */}
            <div style={{ borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '12px', aspectRatio: '16/9', background: '#111' }}>
              <img src={allImages[activeImg]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                {allImages.map((img, i) => (
                  <div key={i} onClick={() => setActiveImg(i)}
                    style={{ width: '80px', height: '60px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: `2px solid ${activeImg === i ? '#818cf8' : 'rgba(255,255,255,0.1)'}`, transition: 'border-color 0.2s' }}>
                    <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={`foto ${i+1}`} />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Description */}
        {item.description && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.9, fontSize: '15px', margin: 0, whiteSpace: 'pre-wrap' }}>{item.description}</p>
          </motion.div>
        )}

        {/* External Links */}
        {(item.external_urls?.length > 0 || item.pdf_url) && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }} style={{ marginBottom: '32px' }}>
            <h3 style={{ color: 'white', fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>🔗 Link & Media</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {item.pdf_url && (
                <a href={item.pdf_url} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 18px', textDecoration: 'none', color: 'white', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.4)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'}>
                  <span style={{ fontSize: '20px' }}>📄</span>
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>Download PDF</p>
                    <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{item.pdf_url.slice(0, 50)}...</p>
                  </div>
                  <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)' }}>↗</span>
                </a>
              )}
              {(item.external_urls || []).map((url: string, i: number) => {
                const type = getLinkType(url)
                const label = getLinkLabel(url)
                const colors: Record<string, string> = { youtube: '#FF0000', tiktok: '#00f2ea', instagram: '#E1306C', gdrive: '#34A853', pdf: '#818cf8', link: '#818cf8' }
                const color = colors[type] || '#818cf8'

                // TikTok embed
                if (type === 'tiktok') {
                  const tkId = getTikTokId(url)
                  return (
                    <div key={i}>
                      {tkId ? (
                        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', maxWidth: '325px' }}>
                          <iframe src={`https://www.tiktok.com/embed/v2/${tkId}`} style={{ width: '325px', height: '580px', border: 'none' }} allowFullScreen allow="encrypted-media" />
                        </div>
                      ) : (
                        <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 18px', textDecoration: 'none', color: 'white' }}>
                          <span style={{ fontSize: '20px', color }}>🎵</span>
                          <span style={{ fontSize: '14px' }}>Buka TikTok</span>
                          <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)' }}>↗</span>
                        </a>
                      )}
                    </div>
                  )
                }

                // Instagram embed
                if (type === 'instagram') {
                  const igId = getInstagramId(url)
                  return (
                    <div key={i}>
                      {igId ? (
                        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', maxWidth: '400px' }}>
                          <iframe src={`https://www.instagram.com/p/${igId}/embed/`} style={{ width: '400px', height: '480px', border: 'none' }} allowFullScreen />
                        </div>
                      ) : (
                        <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 18px', textDecoration: 'none', color: 'white' }}>
                          <span style={{ fontSize: '20px', color }}>📸</span>
                          <span style={{ fontSize: '14px' }}>Buka Instagram</span>
                          <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)' }}>↗</span>
                        </a>
                      )}
                    </div>
                  )
                }

                // Default link
                return (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px 18px', textDecoration: 'none', color: 'white', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = `${color}50`}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)'}>
                    <span style={{ fontSize: '20px', color }}>{label.split(' ')[0]}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>{label.slice(label.indexOf(' ') + 1)}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</p>
                    </div>
                    <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>↗</span>
                  </a>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Footer nav */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/portfolio" style={{ color: '#818cf8', textDecoration: 'none', fontSize: '14px' }}>← Semua Portfolio</Link>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>ibnusp_</span>
        </motion.div>
      </div>
    </div>
  )
}