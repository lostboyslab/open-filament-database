import type { RequestHandler } from '@sveltejs/kit';
import { prepareFilamentDownload } from '$lib/server/helpers';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import { PassThrough } from 'stream';

export const GET: RequestHandler = async ({ params }) => {
  console.log('Params ', params)
  const relPath = typeof params.path === 'string' ? params.path.split('/') : params.path;
  const colorFolder = path.join('src/data', ...relPath);
  
  console.log('Color Folder : ', colorFolder);
  // Create a temp dir for zipping
  const tempDir = fs.mkdtempSync(path.join(tmpdir(), 'filament-download-'));
  await prepareFilamentDownload(colorFolder, tempDir);

  console.log('Temp Dir : ', tempDir);

  // Zip the tempDir and stream it
   // Stream the zip directly to the response
   const archive = archiver('zip');
   const passthrough = new PassThrough();
 
   archive.directory(tempDir, false);
   archive.finalize();
 
   // Pipe archive to passthrough
   archive.pipe(passthrough);
 
   // Wait for archive to finish before sending response
   const chunks: Buffer[] = [];
   for await (const chunk of passthrough) {
     chunks.push(chunk as Buffer);
   }
   const zipData = Buffer.concat(chunks);
 
   return new Response(zipData, {
     headers: {
       'Content-Type': 'application/zip',
       'Content-Disposition': `attachment; filename="filament-download.zip"`
     }
   });
 };