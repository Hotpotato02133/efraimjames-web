import { motion } from 'framer-motion';
import type { CustomSection } from '../lib/types';

// Minimal markdown: paragraphs split on blank lines, **bold** and *italic*
// inline. Deliberately not a full markdown parser — this block type is
// heading + body text + optional image/button, not a page builder.
function renderParagraph(text: string, key: number) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return (
    <p key={key}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('*') && part.endsWith('*')) {
          return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return part;
      })}
    </p>
  );
}

const CustomSectionBlock = ({ section }: { section: CustomSection }) => {
  const paragraphs = section.bodyMarkdown.split(/\n\s*\n/).filter((p) => p.trim());

  return (
    <section id={section.slug} className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-emerald-700 to-green-700 bg-clip-text text-transparent px-2"
          >
            {section.title}
          </motion.h2>

          {section.imageUrl && (
            <motion.img
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              src={section.imageUrl}
              alt={section.title}
              className="w-full max-w-2xl mx-auto rounded-2xl mb-8 shadow-sm"
            />
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6 text-slate-600 text-lg leading-relaxed"
          >
            {paragraphs.map((p, i) => renderParagraph(p, i))}
          </motion.div>

          {section.ctaLabel && section.ctaUrl && (
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              href={section.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex mt-10 px-8 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/25"
            >
              {section.ctaLabel}
            </motion.a>
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomSectionBlock;
