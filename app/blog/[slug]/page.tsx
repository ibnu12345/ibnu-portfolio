'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function BlogDetailPage() {
  const { slug } = useParams()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      supabase
        .from('blog_post')
        .select('*')
        .eq('slug', slug)
        .single()
        .then(({ data }) => {
          setPost(data)
          setLoading(false)
        })
    }
  }, [slug])

  if (loading) {
    return (
      <div style={{ background: '#0a0a0f', minHeight: '100vh', paddingTop: '100px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Memuat...</p>
      </div>
    )
  }

  if (!post) {
    return (
      <div style={{ background: '#0a0a0f', minHeight: '100vh', paddingTop: '100px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', marginBottom: '20px' }}>404</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Artikel tidak ditemukan</p>
        <Link href="/blog" style={{ color: '#818cf8' }}>← Kembali ke Blog</Link>
      </div>
    )
  }

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', paddingTop: '100px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px 80px' }}>
        <Link href="/blog" style={{ color: '#818cf8', textDecoration: 'none', display: 'inline-block', marginBottom: '30px' }}>
          ← Kembali ke Blog
        </Link>
        
        <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'white', marginBottom: '16px' }}>
          {post.title}
        </h1>
        
        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
          <span>{post.category || 'Uncategorized'}</span>
          <span>•</span>
          <span>{post.published_date ? new Date(post.published_date).toLocaleDateString('id-ID') : ''}</span>
        </div>

        {post.thumbnail_url && (
          <img src={post.thumbnail_url} style={{ width: '100%', borderRadius: '16px', marginBottom: '32px' }} />
        )}

        <div style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, fontSize: '16px' }}>
          {post.content ? (
            <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
          ) : (
            <p>Konten belum tersedia.</p>
          )}
        </div>
      </div>
    </div>
  )
}