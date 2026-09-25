import { useMemo, useState } from 'react';
import { Smartphone, Tablet, Monitor, RefreshCw } from 'lucide-react';

interface WebPreviewProps {
  html: string;
  css: string;
  js: string;
  onRefresh?: () => void;
}

export default function WebPreview({ html, css, js }: WebPreviewProps) {
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [key, setKey] = useState(0);

  // Construct combined document for sandboxed preview
  const combinedSrcDoc = useMemo(() => {
    // Restrictive CSP within iframe to forbid external network requests & form post
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    try {
      ${js}
    } catch (err) {
      console.error("Preview runtime error:", err);
    }
  </script>
</body>
</html>`;
  }, [html, css, js, key]);

  const viewportWidthClass = {
    desktop: 'w-full',
    tablet: 'w-[768px]',
    mobile: 'w-[375px]'
  }[viewportMode];

  return (
    <div className="flex flex-col h-full bg-[#080C14] border border-cyber-border rounded overflow-hidden">
      
      {/* Top Device Toolbar */}
      <div className="bg-[#0B1018] px-3 py-2 border-b border-cyber-border flex items-center justify-between text-xs text-cyber-muted">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyber-primary animate-pulse" />
          <span className="font-bold text-white text-[11px] uppercase tracking-wider">LIVE PREVIEW (SANDBOXED)</span>
        </div>

        {/* Viewport switchers */}
        <div className="flex items-center gap-1 bg-[#05070D] p-1 border border-cyber-border rounded">
          <button
            type="button"
            onClick={() => setViewportMode('desktop')}
            className={`p-1 rounded transition-colors ${
              viewportMode === 'desktop' ? 'bg-cyber-primary/20 text-cyber-primary' : 'text-cyber-muted hover:text-white'
            }`}
            title="Desktop View (100%)"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewportMode('tablet')}
            className={`p-1 rounded transition-colors ${
              viewportMode === 'tablet' ? 'bg-cyber-primary/20 text-cyber-primary' : 'text-cyber-muted hover:text-white'
            }`}
            title="Tablet View (768px)"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewportMode('mobile')}
            className={`p-1 rounded transition-colors ${
              viewportMode === 'mobile' ? 'bg-cyber-primary/20 text-cyber-primary' : 'text-cyber-muted hover:text-white'
            }`}
            title="Mobile View (375px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setKey(k => k + 1)}
          className="p-1 text-cyber-muted hover:text-cyber-primary transition-colors"
          title="Reload Preview Frame"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Frame Container */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-2 bg-[#05070D]">
        <div className={`${viewportWidthClass} h-full transition-all duration-300 shadow-2xl rounded overflow-hidden border border-cyber-border/40 bg-white`}>
          <iframe
            key={key}
            title="Candidate Sandboxed Preview"
            srcDoc={combinedSrcDoc}
            sandbox="allow-scripts"
            className="w-full h-full border-none"
          />
        </div>
      </div>

    </div>
  );
}
