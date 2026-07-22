import sharp from 'sharp';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';

async function compressImage(jobId: string, inputPath: string): Promise<string> {
    const outputDir = path.join(process.cwd(), '../../uploads/processed');
    const outputPath = path.join(outputDir, `${jobId}.webp`);

    await mkdir(outputDir, { recursive: true });

    await sharp(inputPath)
        .resize({
            width: 1280,
            height: 1280,
            fit: 'inside',
            withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toFile(outputPath);

    return outputPath;
}

export default compressImage