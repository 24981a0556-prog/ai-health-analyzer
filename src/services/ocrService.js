import * as pdfjsLib from 'pdfjs-dist';
import { createWorker } from 'tesseract.js';

// Configure PDF.js worker
if (typeof window !== 'undefined' && 'Worker' in window) {
  try {
    // Use unpkg/cdnjs worker as reliable CDN fallback to avoid Vite worker bundler mismatches
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  } catch (err) {
    console.warn('PDF.js worker initialization notice:', err);
  }
}

/**
 * Extracts plain text from an uploaded PDF file
 */
export async function extractTextFromPdf(file, onProgress) {
  try {
    if (onProgress) onProgress({ step: 'Reading PDF structure...', percent: 20 });
    const arrayBuffer = await file.arrayBuffer();
    
    // Load document
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;
    let fullText = '';

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      if (onProgress) {
        onProgress({
          step: `Extracting page ${pageNum} of ${numPages}...`,
          percent: 20 + Math.round((pageNum / numPages) * 50)
        });
      }
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine text items preserving lines
      let lastY = null;
      let pageText = '';
      for (const item of textContent.items) {
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          pageText += '\n';
        } else if (pageText.length > 0 && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
          pageText += ' ';
        }
        pageText += item.str;
        lastY = item.transform[5];
      }
      fullText += pageText + '\n\n';
    }

    if (fullText.trim().length > 30) {
      return fullText;
    }

    // If PDF text is very sparse, it might be a scanned image PDF
    if (onProgress) onProgress({ step: 'Scanned PDF detected. Attempting OCR on page images...', percent: 70 });
    
    // Attempt OCR on the first page canvas
    const firstPage = await pdfDoc.getPage(1);
    const viewport = firstPage.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await firstPage.render({ canvasContext: context, viewport: viewport }).promise;
    const blob = await new Promise(res => canvas.toBlob(res, 'image/png'));
    
    if (blob) {
      const ocrResult = await extractTextFromImage(blob, onProgress);
      return ocrResult;
    }

    return fullText;
  } catch (error) {
    console.error('PDF extraction failed:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message || 'Unknown error'}`);
  }
}

/**
 * Extracts plain text from an image (JPG, PNG, JPEG) using Tesseract.js OCR
 */
export async function extractTextFromImage(fileOrBlob, onProgress) {
  let worker = null;
  try {
    if (onProgress) onProgress({ step: 'Initializing OCR engine...', percent: 25 });
    
    worker = await createWorker('eng');
    
    if (onProgress) onProgress({ step: 'Analyzing document text with OCR...', percent: 55 });
    
    const ret = await worker.recognize(fileOrBlob);
    
    if (onProgress) onProgress({ step: 'OCR analysis complete.', percent: 85 });
    
    await worker.terminate();
    worker = null;
    return ret.data.text || '';
  } catch (error) {
    if (worker) {
      try { await worker.terminate(); } catch (_) {}
    }
    console.error('OCR processing error:', error);
    throw new Error(`OCR processing failed: ${error.message || 'Could not parse image'}`);
  }
}

/**
 * Universal extractor handling PDF, JPG, PNG with validation
 */
export async function extractReportText(file, onProgress) {
  if (!file) {
    throw new Error('No file provided for extraction');
  }

  // Validate file size (10 MB max)
  const MAX_SIZE_BYTES = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 10 MB.`);
  }

  const fileName = file.name.toLowerCase();
  const fileType = file.type;

  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return await extractTextFromPdf(file, onProgress);
  } else if (
    fileType.startsWith('image/') ||
    fileName.endsWith('.jpg') ||
    fileName.endsWith('.jpeg') ||
    fileName.endsWith('.png')
  ) {
    return await extractTextFromImage(file, onProgress);
  } else {
    throw new Error('Unsupported file format. Please upload a PDF, JPG, JPEG, or PNG medical report.');
  }
}
