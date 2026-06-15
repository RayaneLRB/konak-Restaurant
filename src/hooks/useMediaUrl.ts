import { useEffect, useState } from 'react';
import { getMediaBlob, isMediaRef } from '../utils/mediaStore';

export function useMediaUrl(src?: string): string | undefined {
  const [url, setUrl] = useState<string | undefined>(() => isMediaRef(src) ? undefined : src);

  useEffect(() => {
    if (!src) { setUrl(undefined); return; }
    if (!isMediaRef(src)) { setUrl(src); return; }
    let objUrl: string | undefined;
    let cancelled = false;
    getMediaBlob(src).then(blob => {
      if (cancelled) return;
      if (blob) { objUrl = URL.createObjectURL(blob); setUrl(objUrl); }
      else setUrl(undefined);
    }).catch(() => { if (!cancelled) setUrl(undefined); });
    return () => { cancelled = true; if (objUrl) URL.revokeObjectURL(objUrl); };
  }, [src]);

  return url;
}
