'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '../../../lib/supabase'
import { useIsMobile } from '../../../hooks/useIsMobile'

export default function BlogDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [related, setRelated] = useState<any[]>([])
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!slug) return
    supabase.from('blog_post').select('*').eq('slug', slug).eq('is_published', true).single()
      .then(({ data }) => {
        if (!data) { router.push('/blog'); return }
        setPost(data)
        setLoading(false)
        // Load related posts
        supabase.from('blog_post').select('id, title, slug, thumbnail_url, category, published_date')
          .eq('is_published', true).neq('slug', slug).limit(3)
          .then(({ data: rel }) => setRelated(rel || []))
      })
  }, [slug])

  const px = isMobile ? '20px' : '64px'

  if (loading) return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', paddingTop: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>Memuat...</div>
    </div>
  )

  if (!post) return null

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: 'white', paddingTop: '80px' }}>

      {/* Thumbnail Hero */}
      {post.thumbnail_url && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}
          style={{ width: '100%', maxHeight: '480px', overflow: 'hidden', position: 'relative' }}>
          <img src={post.thumbnail_url} alt={post.title}
            style={{ width: '100%', height: isMobile ? '240px' : '480px', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, #0a0a0f)' }} />
        </motion.div>
      )}

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: `0 ${px} 80px` }}>

        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
          style={{ marginTop: post.thumbnail_url ? '0' : '40px', marginBottom: '32px' }}>
          <Link href="/blog" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            ← Kembali ke Blog
          </Link>
        </motion.div>

        {/* Meta */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
          style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {post.category && (
              <span style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', fontSize: '12px', padding: '4px 12px', borderRadius: '999px', fontWeight: 500 }}>
                {post.category}
              </span>
            )}
            {post.tags?.map((tag: string) => (
              <span key={tag} style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', fontSize: '12px', padding: '4px 12px', borderRadius: '999px' }}>
                {tag}
              </span>
            ))}
          </div>
          <h1 style={{ fontSize: isMobile ? '26px' : '40px', fontWeight: 800, lineHeight: 1.2, margin: '0 0 16px', color: 'white' }}>
            {post.title}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>
            {post.published_date ? new Date(post.published_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ''}
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
          style={{ height: '1px', background: 'rgba(255,255,255,0.07)', marginBottom: '40px', transformOrigin: 'left' }} />

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <div style={{
            color: 'rgba(255,255,255,0.75)', fontSize: '16px', lineHeight: 1.9,
            whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>
            {post.content}
          </div>
        </motion.div>

        {/* Related posts */}
        {related.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            style={{ marginTop: '64px', paddingTop: '48px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Artikel Lainnya</h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: '16px' }}>
              {related.map(rel => (
                <Link key={rel.id} href={`/blog/${rel.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.4)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'}>
                    {rel.thumbnail_url ? (
                      <img src={rel.thumbnail_url} alt={rel.title} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '80px', background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>✍️</div>
                    )}
                    <div style={{ padding: '12px' }}>
                      {rel.category && <span style={{ color: '#818cf8', fontSize: '11px' }}>{rel.category}</span>}
                      <p style={{ color: 'white', fontSize: '13px', fontWeight: 500, margin: '4px 0 0', lineHeight: 1.4 }}>{rel.title}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}