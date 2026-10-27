// Run in Docker with --env-file .env.local. Never print real keys or provider responses.
import { createClient } from '@supabase/supabase-js';
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
try {
  if (!url || !key || /REPLACE|YOUR_PROJECT/i.test(url+key)) throw Error('Fill the local Supabase configuration first.');
  const client = createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data:existing,error:lookup}=await client.storage.getBucket('event-covers');
  if (existing) {
    if (!existing.public || Number(existing.file_size_limit)!==2097152 ||
        existing.allowed_mime_types?.length!==1 || existing.allowed_mime_types[0]!=='image/jpeg') {
      throw Error('Existing event-covers bucket has different settings. Review it; nothing was changed.');
    }
  } else {
    if (lookup && String(lookup.statusCode)!=='404' && lookup.message!=='Bucket not found') {
      throw Error('Could not inspect Storage. Confirm project keys and Storage availability.');
    }
    const {error}=await client.storage.createBucket('event-covers',{
      public:true,fileSizeLimit:2097152,allowedMimeTypes:['image/jpeg'],
    });
    if (error) throw Error('Could not create event-covers. Check Storage availability and server key.');
  }
  const {data:verified,error}=await client.storage.getBucket('event-covers');
  if (error || !verified?.public || Number(verified.file_size_limit)!==2097152) {
    throw Error('Storage verification failed.');
  }
  console.log('EVENT_COVER_BUCKET=READY');
  console.log('PUBLIC_JPEG_COVERS_ONLY / 2_MB_LIMIT / UPLOAD_REQUIRES_ADMIN_RLS');
} catch(error) {
  console.error(error instanceof Error ? error.message : 'Storage setup failed.');
  process.exitCode=1;
}
