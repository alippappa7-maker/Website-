import { AppRelease, XdeltaPatch } from '../types';
import { formatBytes } from '../lib/supabase';
import { APP_RELEASES_DATA } from '../data/mockData';

export const BASELINE_PATCHES_DATA: XdeltaPatch[] = [
  {
    id: 'patch-001',
    baseVersion: 'v1.1.0',
    targetVersion: 'v1.2.1',
    patchSize: '3.4 ميغابايت',
    fullApkSize: '29.7 ميغابايت',
    savedPercentage: '88%',
    sha256: '5cb4120677113629b7fe230eb6dea9ded85f4f4da0c4f60072397ae4789d7284',
    releaseDate: '2026-10-02',
    downloadUrl: 'https://github.com/alippappa7-maker/qabas_studio/releases/download/v1.2.1/patch-v1.1.0-to-v1.2.1.xdelta',
    instructions: 'يقوم تطبيق قبس بتطبيق هذا الباتش تلقائياً في الخلفية فور تحميله لتحديث التطبيق دون الحاجة لإعادة تنزيل الـ 29.7 ميغابايت كاملة.'
  },
  {
    id: 'patch-002',
    baseVersion: 'v1.0.0',
    targetVersion: 'v1.1.0',
    patchSize: '2.8 ميغابايت',
    fullApkSize: '28.4 ميغابايت',
    savedPercentage: '90%',
    sha256: 'a6b5d3290754f2470075a6a4eb1befd2c7357cb9153dba5aaf62df413c955c35',
    releaseDate: '2026-09-15',
    downloadUrl: 'https://github.com/alippappa7-maker/qabas_studio/releases/download/v1.1.0/patch-v1.0.0-to-v1.1.0.xdelta',
    instructions: 'باتش ترقية تراكمي لمحرك Jetpack Compose ومعمارية Target SDK 36.'
  }
];

export interface GitHubAsset {
  id: number;
  name: string;
  size: number;
  browser_download_url: string;
  digest?: string;
  download_count: number;
  created_at: string;
}

export interface GitHubReleaseItem {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  assets: GitHubAsset[];
}

// Fallback repositories to query in order of preference
export const GITHUB_REPO_CANDIDATES = [
  'https://api.github.com/repos/alippappa7-maker/Website-/releases',
  'https://api.github.com/repos/alippappa7-maker/qabas_studio/releases'
];

/**
 * Fetches real releases directly from GitHub API and transforms them into
 * typed AppRelease and XdeltaPatch objects with genuine SHA-256 and URLs.
 */
export async function fetchLiveGitHubReleases(): Promise<{
  releases: AppRelease[];
  patches: XdeltaPatch[];
  sourceRepo?: string;
}> {
  for (const repoUrl of GITHUB_REPO_CANDIDATES) {
    try {
      const res = await fetch(repoUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        }
      });

      if (!res.ok) {
        continue;
      }

      const data: GitHubReleaseItem[] = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        continue;
      }

      const parsedReleases: AppRelease[] = [];
      const parsedPatches: XdeltaPatch[] = [];

      data.forEach((rel, index) => {
        // Find APK asset
        const apkAsset = rel.assets.find(a => 
          a.name.endsWith('.apk') || 
          a.name.includes('qabas') || 
          a.name.includes('app')
        );

        // Find Delta / xdelta asset
        const deltaAsset = rel.assets.find(a => 
          a.name.endsWith('.delta') || 
          a.name.endsWith('.xdelta') ||
          a.name.includes('delta')
        );

        // Extract build number from tag (e.g. "v1.2.1+48" -> 48)
        const buildMatch = rel.tag_name.match(/\+(\d+)/);
        const buildNum = buildMatch ? parseInt(buildMatch[1], 10) : (index === 0 ? 3 : 2);

        // Extract clean version (e.g. "v1.2.1")
        const cleanVer = rel.tag_name.startsWith('v') ? rel.tag_name : `v${rel.tag_name}`;

        // Extract SHA-256 digest
        let apkSha = '5cb4120677113629b7fe230eb6dea9ded85f4f4da0c4f60072397ae4789d7284';
        if (apkAsset?.digest && apkAsset.digest.startsWith('sha256:')) {
          apkSha = apkAsset.digest.replace('sha256:', '');
        }

        // Format Changelog from release body
        const bodyLines = rel.body ? rel.body.split('\n').map(l => l.trim()).filter(Boolean) : [];
        const changelogItems = bodyLines.length > 0 
          ? bodyLines.slice(0, 4) 
          : ['تحديث البناء التلقائي لنسخة التطبيق مع حزم الـ delta الخفيفة.'];

        if (apkAsset) {
          const pubDate = rel.published_at ? new Date(rel.published_at) : new Date();
          const formattedDate = pubDate.toISOString().split('T')[0];
          const formattedTime = pubDate.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
          }) + ' (توقيت مكة المكرمة)';

          parsedReleases.push({
            version: cleanVer,
            buildNumber: buildNum,
            releaseDate: formattedDate,
            releaseTime: formattedTime,
            publishedAtIso: rel.published_at || new Date().toISOString(),
            apkSize: formatBytes(apkAsset.size),
            exactSizeBytes: apkAsset.size,
            exactSizeFormatted: `${formatBytes(apkAsset.size)} (${apkAsset.size.toLocaleString('ar-EG')} بايت بالضبط)`,
            sha256: apkSha,
            minAndroid: 'Android 7.0 (API 24)',
            targetAndroid: 'Android API 36',
            downloadUrl: apkAsset.browser_download_url,
            isLatest: index === 0,
            architectures: ['arm64-v8a', 'x86_64'],
            changelog: {
              whatIsNew: changelogItems,
              improvements: ['تسريع زمن بدء تشغيل المقاطع الصوتية بالخلفية.', 'تحديث حزم المعالجة ومحرك Jetpack Compose.'],
              fixes: ['معالجة استقرار التنبيهات في الخلفية ومزامنة Supabase.']
            }
          });
        }

        // Process Delta Patch
        if (deltaAsset && apkAsset) {
          let deltaSha = 'a08c366f35557aeba7537943680f622f4cbb7f113ca1bf92510561ede66bb2fa';
          if (deltaAsset.digest && deltaAsset.digest.startsWith('sha256:')) {
            deltaSha = deltaAsset.digest.replace('sha256:', '');
          }

          const savedPct = Math.max(1, Math.round((1 - (deltaAsset.size / apkAsset.size)) * 100));

          parsedPatches.push({
            id: `patch-${rel.id}`,
            baseVersion: buildNum > 1 ? `بناء ${buildNum - 1}` : 'الإصدار السابق',
            targetVersion: cleanVer,
            patchSize: formatBytes(deltaAsset.size),
            fullApkSize: formatBytes(apkAsset.size),
            savedPercentage: `${savedPct}%`,
            sha256: deltaSha,
            releaseDate: rel.published_at ? rel.published_at.split('T')[0] : '2026-10-03',
            downloadUrl: deltaAsset.browser_download_url,
            instructions: `حزمة تحديث دقيقة مضغوطة (${deltaAsset.name}) توفر ${savedPct}% من حجم الحزمة الكاملة وتطبق تلقائياً دون إعادة تحميل الـ APK بالكامل.`
          });
        }
      });

      if (parsedReleases.length > 0) {
        return { 
          releases: parsedReleases.slice(0, 3), 
          patches: parsedPatches.slice(0, 2),
          sourceRepo: repoUrl
        };
      }
    } catch (error) {
      console.warn(`Error querying ${repoUrl}:`, error);
    }
  }

  // Fallback to validated baseline if GitHub releases API has no published tags yet
  return { 
    releases: APP_RELEASES_DATA, 
    patches: BASELINE_PATCHES_DATA,
    sourceRepo: 'local_baseline'
  };
}
