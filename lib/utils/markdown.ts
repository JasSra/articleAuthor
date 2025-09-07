'use client';

// @ts-ignore
import TurndownService from 'turndown';

export function createTurndown() {
  const td = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
    bulletListMarker: '-',
  });

  // Hard line breaks
  td.addRule('lineBreak', { filter: 'br', replacement: () => '  \n' });

  // Code blocks with language class
  td.addRule('fencedCodeWithLanguage', {
    filter: (node: any) => node?.nodeName === 'CODE' && node?.parentNode?.nodeName === 'PRE',
    replacement: (content: string, node: any) => {
      const className = node.getAttribute?.('class') || '';
      const langMatch = className.match(/language-([a-z0-9#+-]+)/i) || className.match(/\b(json|javascript|ts|tsx|js|jsx|csv|xml|html|css|yaml|yml|sql)\b/i);
      const lang = langMatch ? (langMatch[1] || langMatch[0]) : '';
      const language = (lang || '').toLowerCase();
      const code = content.replace(/\n+$/, '');
      return `\n\n\u0060\u0060\u0060${language}\n${code}\n\u0060\u0060\u0060\n\n`;
    },
  });

  // Strikethrough <del> → ~~text~~
  td.addRule('strikethrough', {
    filter: 'del',
    replacement: (content: string) => `~~${content}~~`,
  });

  // Special-case: Convert link-list tables (like Hacker News front page) into a simple Title | Link table
  td.addRule('structuredLinkTable', {
    filter: (node: any) => {
      if (!node || node.nodeName !== 'TABLE') return false;
      try {
        const el = node as HTMLTableElement;
        // Detect HN pattern
        const athingRows = el.querySelectorAll('tr.athing');
        if (athingRows && athingRows.length >= 3) return true;
        // Generic detection: many rows containing an anchor with text
        const rows = Array.from(el.querySelectorAll('tr')) as HTMLTableRowElement[];
        const linkRows = rows.filter(r => r.querySelector('a[href]'));
        return rows.length >= 5 && linkRows.length / Math.max(rows.length, 1) >= 0.6;
      } catch {
        return false;
      }
    },
    replacement: (_content: string, node: any) => {
      const el = node as HTMLTableElement;
      const items: Array<{ title: string; href: string }> = [];
      const athingRows = Array.from(el.querySelectorAll('tr.athing')) as HTMLTableRowElement[];
      const rows = athingRows.length > 0 ? athingRows : (Array.from(el.querySelectorAll('tr')) as HTMLTableRowElement[]);
      rows.forEach((tr) => {
        // HN: main link is inside span.titleline > a
        let a = tr.querySelector('.titleline a[href]') as HTMLAnchorElement | null;
        if (!a) {
          // Fallback: first anchor with href in row
          a = tr.querySelector('a[href]') as HTMLAnchorElement | null;
        }
        const href = a?.getAttribute('href') || '';
        const title = (a?.textContent || '').trim();
        if (href && title) {
          items.push({ title, href });
        }
      });
      // If nothing matched, fall back to empty
      if (items.length === 0) return '\n\n';
      // Build Markdown table: Title | Link
      const header = '| Title | Link |\n| --- | --- |';
      const body = items.map(({ title, href }) => {
        const safeTitle = escapePipes(title);
        const safeHref = href.replace(/\|/g, '%7C');
        return `| [${safeTitle}](${safeHref}) | ${safeHref} |`;
      }).join('\n');
      return `\n\n${header}\n${body}\n\n`;
    },
  });

  // Basic HTML table → GFM table
  td.addRule('table', {
    filter: 'table',
    replacement: (_content: string, node: any) => {
      const table = node as HTMLTableElement;
      const rows: string[][] = [];
      const getRowCells = (tr: HTMLTableRowElement) => Array.from(tr.children).filter((c) => c.nodeName === 'TD' || c.nodeName === 'TH') as (HTMLTableCellElement)[];
      const thead = table.querySelector('thead');
      const tbody = table.querySelector('tbody');
      const headTrs = thead ? Array.from(thead.querySelectorAll('tr')) : [];
      const bodyTrs = tbody ? Array.from(tbody.querySelectorAll('tr')) : Array.from(table.querySelectorAll('tr'));
      const headerCells = headTrs[0] ? getRowCells(headTrs[0]) : (bodyTrs[0] ? getRowCells(bodyTrs[0]) : []);
      if (headerCells.length === 0) return '\n\n';
      const header = headerCells.map((c) => cleanText(c.textContent || '')); 
      rows.push(header);
      const sep = header.map(() => '---');
      rows.push(sep);
      const dataTrs = headTrs.length > 0 ? bodyTrs : bodyTrs.slice(1);
      dataTrs.forEach((tr) => {
        const cells = getRowCells(tr).map((c) => cleanText(c.textContent || ''));
        rows.push(cells);
      });
      const md = rows.map((cols) => `| ${cols.join(' | ')} |`).join('\n');
      return `\n\n${md}\n\n`;
    },
  });

  function cleanText(s: string) {
    return s.replace(/\s+/g, ' ').trim().replace(/\|/g, '\\|');
  }

  function escapePipes(s: string) {
    return s.replace(/\|/g, '\\|');
  }

  return td;
}
