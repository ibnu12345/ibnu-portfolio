'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import { motion } from 'framer-motion'

export default function BlogDetailPage() {
  const { slug } = useParams()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      supabase.from('blog_post').select('*').eq('slug', slug).single()
        .then(({ data }) => { setPost(data); setLoading(false) })
    }
  }, [slug])

  if (loading) {
    return (
      <div style={{ background: '#0a0a0f', minHeight: '100vh', paddingTop: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Memuat artikel...</p>
        </motion.div>
      </div>
    )
  }

  if (!post) {
    return (
      <div style={{ background: '#0a0a0f', minHeight: '100vh', paddingTop: '100px', textAlign: 'center', padding: '100px 20px' }}>
        <p style={{ fontSize: '48px', marginBottom: '16px' }}>📭</p>
        <h1 style={{ color: 'white', marginBottom: '12px', fontSize: '24px' }}>Artikel tidak ditemukan</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '24px' }}>Artikel mungkin sudah dihapus atau URL salah.</p>
        <Link href="/blog" style={{ color: '#818cf8', textDecoration: 'none', fontSize: '14px' }}>← Kembali ke Blog</Link>
      </div>
    )
  }

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white', paddingTop: '100px' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 20px 80px' }}>

        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Link href="/blog" style={{ color: '#818cf8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '14px', marginBottom: '40px' }}>
            ← Kembali ke Blog
          </Link>
        </motion.div>

        {/* Category + date */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
          {post.category && (
            <span style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontSize: '12px', padding: '4px 12px', borderRadius: '999px' }}>
              {post.category}
            </span>
          )}
          {post.tags?.slice(0, 2).map((tag: string) => (
            <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', fontSize: '12px', padding: '4px 12px', borderRadius: '999px' }}>
              {tag}
            </span>
          ))}
          {post.published_date && (
            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
              {new Date(post.published_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          )}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ fontSize: 'clamp(24px, 5vw, 40px)', fontWeight: 800, color: 'white', lineHeight: 1.25, marginBottom: '32px' }}
        >
          {post.title}
        </motion.h1>

        {/* Thumbnail */}
        {post.thumbnail_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ marginBottom: '40px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <img
              src={post.thumbnail_url}
              alt={post.title}
              style={{ width: '100%', display: 'block', maxHeight: '420px', objectFit: 'cover' }}
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.9, fontSize: '16px' }}
        >
          {post.content ? (
            <div
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
              style={{ wordBreak: 'break-word' }}
            />
          ) : (
            <p style={{ color: 'rgba(255,255,255,0.3)' }}>Konten belum tersedia.</p>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ marginTop: '60px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}
        >
          <Link href="/blog" style={{ color: '#818cf8', textDecoration: 'none', fontSize: '14px' }}>← Artikel lainnya</Link>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>ibnusp_</span>
        </motion.div>
      </div>
    </div>
  )
}