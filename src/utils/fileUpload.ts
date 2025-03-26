import { supabase } from '@/services/api'
// Make sure to install the required packages:
// npm install uuid
// npm install @types/uuid --save-dev
import { v4 as uuidv4 } from 'uuid'

export async function uploadItemImage(file: File, userId: string) {
  try {
    // Create a unique file name
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${uuidv4()}.${fileExt}`
    const filePath = `item-images/${fileName}`
    
    // Upload the file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('items')
      .upload(filePath, file)
    
    if (uploadError) {
      throw uploadError
    }
    
    // Get the public URL for the file
    const { data } = supabase.storage.from('items').getPublicUrl(filePath)
    
    return {
      success: true,
      url: data.publicUrl
    }
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return {
      success: false,
      error: error.message
    }
  }
}
