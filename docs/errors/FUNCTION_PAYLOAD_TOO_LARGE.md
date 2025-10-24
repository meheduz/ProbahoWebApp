# FUNCTION_PAYLOAD_TOO_LARGE

**Category:** Function  
**HTTP Status:** 413  
**Severity:** High

## Description

This error occurs when the request payload (body) exceeds the maximum allowed size for serverless functions. Vercel has specific payload size limits that vary by plan and function type.

## Payload Size Limits

### Vercel Plans
- **Hobby Plan**: 4.5 MB
- **Pro Plan**: 4.5 MB
- **Enterprise Plan**: 4.5 MB

### Function Types
- **Serverless Functions**: 4.5 MB
- **Edge Functions**: 4.5 MB
- **Middleware**: 4.5 MB

## Common Causes

1. **Large file uploads** exceeding 4.5 MB limit
2. **Large JSON payloads** in API requests
3. **Base64 encoded images** or files
4. **Bulk data operations** without chunking
5. **Uncompressed data** that should be compressed
6. **Multiple files** uploaded simultaneously
7. **Large form data** submissions
8. **Webhook payloads** with large data

## Example Scenarios

### 1. Large File Upload
```javascript
// ❌ Direct file upload (may exceed 4.5MB)
const formData = new FormData();
formData.append('file', largeFile); // 10MB file
fetch('/api/upload', { method: 'POST', body: formData });
```

### 2. Large JSON Payload
```javascript
// ❌ Large JSON data
const largeData = {
  items: Array(10000).fill({ data: 'large object' })
};
fetch('/api/process', { 
  method: 'POST', 
  body: JSON.stringify(largeData) // May exceed 4.5MB
});
```

### 3. Base64 Encoded Data
```javascript
// ❌ Base64 encoded image
const base64Image = canvas.toDataURL('image/png'); // Could be 10MB+
fetch('/api/save-image', { 
  method: 'POST', 
  body: JSON.stringify({ image: base64Image })
});
```

## Solutions

### 1. Implement File Chunking
```javascript
// ✅ Correct - chunk large files
async function uploadLargeFile(file, chunkSize = 1024 * 1024) { // 1MB chunks
  const chunks = [];
  let offset = 0;
  
  while (offset < file.size) {
    const chunk = file.slice(offset, offset + chunkSize);
    chunks.push(chunk);
    offset += chunkSize;
  }
  
  // Upload chunks sequentially
  for (let i = 0; i < chunks.length; i++) {
    await uploadChunk(chunks[i], i, chunks.length);
  }
}

async function uploadChunk(chunk, index, total) {
  const formData = new FormData();
  formData.append('chunk', chunk);
  formData.append('index', index);
  formData.append('total', total);
  
  return fetch('/api/upload-chunk', {
    method: 'POST',
    body: formData
  });
}
```

### 2. Use External Storage
```javascript
// ✅ Correct - upload to external storage first
async function uploadToS3(file) {
  // Get signed URL from your API
  const { uploadUrl } = await fetch('/api/get-upload-url', {
    method: 'POST',
    body: JSON.stringify({ fileName: file.name, fileType: file.type })
  }).then(res => res.json());
  
  // Upload directly to S3
  await fetch(uploadUrl, {
    method: 'PUT',
    body: file
  });
  
  return uploadUrl;
}
```

### 3. Compress Data Before Sending
```javascript
// ✅ Correct - compress data
import pako from 'pako';

async function sendCompressedData(data) {
  const jsonString = JSON.stringify(data);
  const compressed = pako.gzip(jsonString);
  
  return fetch('/api/process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/gzip',
      'Content-Encoding': 'gzip'
    },
    body: compressed
  });
}
```

### 4. Implement Streaming Upload
```javascript
// ✅ Correct - streaming upload
async function streamUpload(file) {
  const reader = file.stream().getReader();
  let offset = 0;
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    // Send chunk
    await fetch('/api/upload-stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'X-Offset': offset.toString(),
        'X-File-Name': file.name
      },
      body: value
    });
    
    offset += value.length;
  }
}
```

### 5. Use Background Processing
```javascript
// ✅ Correct - trigger background job
export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Start background job for large data
    const jobId = await startBackgroundJob(req.body);
    
    res.status(202).json({
      message: 'Processing started',
      jobId: jobId,
      statusUrl: `/api/jobs/${jobId}`
    });
  }
}

async function startBackgroundJob(data) {
  // Store data in external storage
  const storageUrl = await storeData(data);
  
  // Trigger background processing
  const jobId = generateJobId();
  await queueJob(jobId, storageUrl);
  
  return jobId;
}
```

## Server-Side Handling

### 1. Check Payload Size
```javascript
// ✅ Correct - check payload size
export default function handler(req, res) {
  const contentLength = req.headers['content-length'];
  const maxSize = 4.5 * 1024 * 1024; // 4.5MB
  
  if (contentLength && parseInt(contentLength) > maxSize) {
    return res.status(413).json({
      error: 'Payload too large',
      maxSize: maxSize,
      receivedSize: contentLength
    });
  }
  
  // Process request
  processRequest(req, res);
}
```

### 2. Handle Large File Processing
```javascript
// ✅ Correct - handle large files
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const chunks = [];
    
    req.on('data', chunk => {
      chunks.push(chunk);
    });
    
    req.on('end', async () => {
      try {
        const buffer = Buffer.concat(chunks);
        
        // Process in chunks to avoid memory issues
        await processLargeBuffer(buffer);
        
        res.status(200).json({ message: 'File processed successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Processing failed' });
      }
    });
  }
}
```

## Client-Side Optimization

### 1. Pre-upload Validation
```javascript
// ✅ Correct - validate before upload
function validateFileSize(file, maxSize = 4.5 * 1024 * 1024) {
  if (file.size > maxSize) {
    throw new Error(`File size ${file.size} exceeds maximum ${maxSize} bytes`);
  }
  return true;
}

// Use before upload
const file = document.getElementById('fileInput').files[0];
if (validateFileSize(file)) {
  uploadFile(file);
}
```

### 2. Progress Tracking
```javascript
// ✅ Correct - track upload progress
function uploadWithProgress(file, onProgress) {
  const xhr = new XMLHttpRequest();
  
  xhr.upload.addEventListener('progress', (e) => {
    if (e.lengthComputable) {
      const percentComplete = (e.loaded / e.total) * 100;
      onProgress(percentComplete);
    }
  });
  
  xhr.addEventListener('load', () => {
    if (xhr.status === 200) {
      onProgress(100);
    }
  });
  
  const formData = new FormData();
  formData.append('file', file);
  
  xhr.open('POST', '/api/upload');
  xhr.send(formData);
}
```

## Debugging Steps

1. **Check request size** before sending
2. **Log payload size** in server logs
3. **Test with smaller payloads** to isolate issues
4. **Use browser dev tools** to inspect request size
5. **Check for unnecessary data** in payload
6. **Verify compression** is working
7. **Test chunking implementation**

## Prevention Strategies

1. **Implement client-side validation** for file sizes
2. **Use external storage** for large files
3. **Compress data** before sending
4. **Implement chunking** for large uploads
5. **Use background processing** for heavy operations
6. **Set appropriate limits** in your application
7. **Provide clear error messages** for size limits

## Related Errors

- `FUNCTION_RESPONSE_PAYLOAD_TOO_LARGE` - Response too large
- `REQUEST_HEADER_TOO_LARGE` - Headers too large
- `URL_TOO_LONG` - URL too long
- `FALLBACK_BODY_TOO_LARGE` - Fallback response too large

## Additional Resources

- [Vercel Functions Limits](https://vercel.com/docs/functions/serverless-functions#limits)
- [File Upload Best Practices](https://vercel.com/docs/functions/serverless-functions#file-uploads)
- [External Storage Integration](https://vercel.com/docs/storage)
- [Background Jobs](https://vercel.com/docs/functions/serverless-functions#background-jobs)