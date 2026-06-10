import { supabase } from './supabase'

export async function uploadFile(
  file: File,
  bucket: string,
  folder: string = ''
): Promise<string | null> {
  const ext = file.name.split('.').pop()
  const fileName = `${folder}${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { upsert: true })

  if (error) {
    console.error('Upload error:', error)
    return null
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName)
  return data.publicUrl
}