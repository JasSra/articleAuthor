import React from 'react';
import Image from 'next/image';

type ContentItem = {
  Id?: string;
  Type: string;
  Title?: string;
  Description?: string;
  Placeholder?: string;
  Value?: any;
  Properties?: Record<string, any>;
  Classes?: string;
};

export function ContentRenderer({ items }: { items: ContentItem[] }) {
  return (
    <div className="space-y-16">
      {items.map((it, idx) => {
        const key = it.Id || `${it.Type}-${idx}`;
        switch (it.Type) {
          case 'hero':
            return (
              <section key={key} className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{it.Value?.title || it.Title}</h1>
                  {it.Value?.subtitle && (
                    <p className="text-xl text-gray-600 mb-8">{it.Value.subtitle}</p>
                  )}
                  {it.Value?.imageUrl && (
                    <div className="mx-auto max-w-4xl">
                      <Image className="rounded-lg shadow" src={it.Value.imageUrl} alt={it.Title || 'Hero'} width={1200} height={600} />
                    </div>
                  )}
                </div>
              </section>
            );
          case 'showcase':
            return (
              <section key={key} className="bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(it.Value || []).map((f: any, i: number) => (
                      <div key={i} className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold text-gray-900">{f.title}</h3>
                        {f.description && <p className="text-gray-600 mt-2">{f.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          case 'text':
            return (
              <section key={key} className="bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                  {it.Title && <h2 className="text-2xl font-bold text-gray-900 mb-4">{it.Title}</h2>}
                  <p className="text-gray-700 leading-relaxed">{it.Value?.content || it.Description}</p>
                </div>
              </section>
            );
          case 'cta':
            return (
              <section key={key} className="bg-primary-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-white">
                  <h2 className="text-3xl font-bold mb-2">{it.Value?.title || it.Title}</h2>
                  {it.Value?.subtitle && <p className="text-lg opacity-90 mb-6">{it.Value.subtitle}</p>}
                  <div className="space-x-4">
                    {it.Value?.primary && (
                      <a href={it.Value.primary.href} className="inline-block px-6 py-3 rounded-md bg-white text-primary-700 font-medium">
                        {it.Value.primary.label}
                      </a>
                    )}
                    {it.Value?.secondary && (
                      <a href={it.Value.secondary.href} className="inline-block px-6 py-3 rounded-md border border-white font-medium">
                        {it.Value.secondary.label}
                      </a>
                    )}
                  </div>
                </div>
              </section>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

export default ContentRenderer;
