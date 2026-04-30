'use client';

import { useEffect } from 'react';
import SitemapSVG from '@/components/SitemapSVG';

export default function SitemapPage() {
  useEffect(() => {
    const tooltip = document.getElementById('tooltip')!;
    const nodes = document.querySelectorAll<SVGAElement>('a.node');
    const svgNS = 'http://www.w3.org/2000/svg';

    // Route clicks to the review page
    nodes.forEach(node => {
      node.addEventListener('click', e => {
        e.preventDefault();
        const href = node.getAttribute('href');
        if (href) window.open(`/review?page=${encodeURIComponent(href)}`, '_blank');
      });
    });

    // Tooltip
    const moveTooltip = (e: MouseEvent) => {
      const x = e.clientX + 15;
      const y = e.clientY + 15;
      const w = tooltip.offsetWidth;
      tooltip.style.left = `${x + w > window.innerWidth - 20 ? e.clientX - w - 15 : x}px`;
      tooltip.style.top = `${y}px`;
    };
    nodes.forEach(node => {
      const url = node.getAttribute('href') ?? '';
      node.addEventListener('mouseenter', e => {
        tooltip.textContent = url;
        tooltip.classList.add('visible');
        moveTooltip(e as MouseEvent);
      });
      node.addEventListener('mousemove', e => moveTooltip(e as MouseEvent));
      node.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));
    });

    // Inject ext-link icon into each node
    nodes.forEach(node => {
      const rect = node.querySelector('rect');
      if (!rect) return;
      const rx = parseFloat(rect.getAttribute('x')!);
      const ry = parseFloat(rect.getAttribute('y')!);
      const rw = parseFloat(rect.getAttribute('width')!);
      const rh = parseFloat(rect.getAttribute('height')!);
      const size = 18;
      const g = document.createElementNS(svgNS, 'g');
      g.classList.add('ext-link-icon');
      g.setAttribute('transform', `translate(${rx + rw - size - 7},${ry + (rh - size) / 2}) scale(${size / 24})`);
      g.setAttribute('fill', 'none');
      g.setAttribute('stroke', 'currentColor');
      g.setAttribute('stroke-width', '2');
      g.setAttribute('stroke-linecap', 'round');
      g.setAttribute('stroke-linejoin', 'round');
      const p = document.createElementNS(svgNS, 'path');
      p.setAttribute('d', 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6');
      const pl = document.createElementNS(svgNS, 'polyline');
      pl.setAttribute('points', '15 3 21 3 21 9');
      const ln = document.createElementNS(svgNS, 'line');
      ln.setAttribute('x1', '10'); ln.setAttribute('y1', '14');
      ln.setAttribute('x2', '21'); ln.setAttribute('y2', '3');
      g.append(p, pl, ln);
      node.appendChild(g);
    });

    // Fetch noted pages and paint blue dots
    fetch('/api/notes')
      .then(r => r.json())
      .then((notedUrls: string[]) => {
        const noted = new Set(notedUrls);
        nodes.forEach(node => {
          if (!noted.has(node.getAttribute('href') ?? '')) return;
          const rect = node.querySelector('rect');
          if (!rect) return;
          const rx = parseFloat(rect.getAttribute('x')!);
          const ry = parseFloat(rect.getAttribute('y')!);
          const rh = parseFloat(rect.getAttribute('height')!);
          const dot = document.createElementNS(svgNS, 'circle');
          dot.setAttribute('cx', String(rx + 10));
          dot.setAttribute('cy', String(ry + rh / 2));
          dot.setAttribute('r', '5');
          dot.setAttribute('fill', '#3b82f6');
          dot.setAttribute('stroke', '#ffffff');
          dot.setAttribute('stroke-width', '1.5');
          node.appendChild(dot);
        });
      });
  }, []);

  return (
    <>
      <div id="tooltip" className="tooltip" />
      <div style={{
        margin: 0,
        padding: '40px',
        backgroundColor: 'var(--bg-main)',
        backgroundImage:
          'radial-gradient(at 0% 0%, hsla(250,30%,90%,0.15) 0,transparent 50%),' +
          'radial-gradient(at 50% 0%, hsla(250,20%,90%,0.1) 0,transparent 50%)',
        color: 'var(--text-primary)',
        lineHeight: '1.5',
      }}>
        <header style={{ maxWidth: '1400px', margin: '0 auto 32px auto' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-0.02em', color: 'var(--color-root)' }}>
            A-One.no Sitemap
          </h1>
          <div style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
            En visuell oversikt over nettstedets struktur og hierarki.
          </div>
          <div className="controls-wrapper">
            <div className="legend">
              {[
                ['var(--color-root)',      'Rot / Startside'],
                ['var(--color-main)',      'Hovedseksjon'],
                ['var(--color-sub)',       'Underside'],
                ['var(--color-prop)',      'Eiendom / Annonse'],
                ['var(--color-util)',      'Frittstående'],
                ['var(--color-redirect)',  '301 Omdirigering'],
                ['var(--color-error)',     '404 Finnes ikke'],
              ].map(([bg, label]) => (
                <div key={label} className="legend-item">
                  <div className="legend-color" style={{ background: bg }} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </header>
        <div className="svg-container">
          <SitemapSVG />
        </div>
      </div>
    </>
  );
}
