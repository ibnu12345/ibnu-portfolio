export type Profile = {
  id: string
  name: string
  tagline: string | null
  bio: string | null
  photo_url: string | null
  cv_url: string | null
  email: string | null
  whatsapp: string | null
  instagram: string | null
  linkedin: string | null
  youtube: string | null
}

export type Research = {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  pdf_url: string | null
  video_url: string | null
  journal_name: string | null
  published_date: string | null
  is_featured: boolean
  created_at: string
}

export type Portfolio = {
  id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  gallery_urls: string[] | null
  pdf_url: string | null
  youtube_url: string | null
  category: string | null
  tags: string[] | null
  published_date: string | null
  is_featured: boolean
  created_at: string
}

export type SkillCategory = {
  id: string
  name: string
  icon: string | null
  sort_order: number
}

export type Skill = {
  id: string
  category_id: string
  name: string
  percentage: number | null
  description: string | null
  icon: string | null
  sort_order: number
}

export type BlogPost = {
  id: string
  title: string
  slug: string
  content: string | null
  thumbnail_url: string | null
  tags: string[] | null
  category: string | null
  is_published: boolean
  published_date: string | null
  created_at: string
}

export type Certificate = {
  id: string
  name: string
  image_url: string | null
  credential_url: string | null
  category: string | null
  issued_date: string | null
  is_featured: boolean
}

export type Gallery = {
  id: string
  title: string | null
  image_url: string
  category: string | null
  sort_order: number
}

export type Video = {
  id: string
  title: string
  youtube_url: string
  thumbnail_url: string | null
  description: string | null
  is_featured: boolean
  published_date: string | null
}

export type ContactMessage = {
  id: string
  name: string
  email: string
  subject: string | null
  message: string
  is_read: boolean
  created_at: string
}