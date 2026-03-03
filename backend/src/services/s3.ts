import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.S3_REGION || 'auto',
  ...(process.env.S3_ENDPOINT && { endpoint: process.env.S3_ENDPOINT }),
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(
  buffer: Buffer,
  mimetype: string,
  folder = 'uploads'
): Promise<string> {
  const ext = mimetype.split('/')[1] || 'bin';
  const key = `${folder}/${crypto.randomUUID()}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    })
  );

  const publicUrl = process.env.S3_PUBLIC_URL?.replace(/\/$/, '');
  return `${publicUrl}/${key}`;
}

export async function deleteFromS3(url: string): Promise<void> {
  const publicUrl = process.env.S3_PUBLIC_URL?.replace(/\/$/, '') || '';
  const key = url.replace(`${publicUrl}/`, '');

  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
    })
  );
}
