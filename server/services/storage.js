import { supabase } from './database.js';
import { v4 as uuidv4 } from 'uuid';

const BUCKET_NAME = 'thumbnails';

export async function initStorage() {
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error('Error listing buckets:', error.message);
    return;
  }

  if (!buckets.find(b => b.name === BUCKET_NAME)) {
    console.log(`Creating storage bucket: ${BUCKET_NAME}`);
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 5242880, // 5MB
    });
    if (createError) {
      console.error('Error creating bucket:', createError.message);
    } else {
      console.log(`✅ Bucket ${BUCKET_NAME} created`);
    }
  }
}

/**
 * Cache an external image to Supabase Storage.
 * @param {string} imageUrl 
 * @returns {Promise<string|null>} Public URL of the cached image
 */
export async function cacheThumbnail(imageUrl) {
  if (!imageUrl) return null;

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const extension = contentType.split('/')[1] || 'jpg';
    const fileName = `${uuidv4()}.${extension}`;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType,
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (err) {
    console.error('Error caching thumbnail:', err.message);
    return imageUrl; // Fallback to original URL
  }
}

/**
 * Upload a local file to storage.
 * @param {string} filePath 
 * @param {Buffer} buffer 
 * @param {string} contentType 
 * @returns {Promise<string>}
 */
export async function uploadImage(buffer, contentType) {
  const extension = contentType.split('/')[1] || 'jpg';
  const fileName = `${uuidv4()}.${extension}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, buffer, {
      contentType,
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return data.publicUrl;
}
