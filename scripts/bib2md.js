#!/usr/bin/env node

/**
 * BibTeX to Markdown Converter
 * 
 * Usage:
 *   pnpm run bib2md path/to/references.bib
 * 
 * This will create markdown files in src/content/publications/
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLICATIONS_DIR = join(__dirname, '../src/content/publications');

// Simple BibTeX parser
function parseBibTeX(content) {
  const entries = [];
  // Match @type{key, ... }
  const entryRegex = /@(\w+)\s*{\s*([^,]+)\s*,([^@]*?)(?=\n\s*@|\n*$)/gs;
  
  let match;
  while ((match = entryRegex.exec(content)) !== null) {
    const [, type, key, fieldsStr] = match;
    const entry = { type: type.toLowerCase(), key: key.trim(), fields: {} };
    
    // Parse fields - handles multi-line values in braces
    const fieldRegex = /(\w+)\s*=\s*(?:{([^{}]*(?:{[^{}]*}[^{}]*)*)}|"([^"]*)"|(\d+))/g;
    let fieldMatch;
    while ((fieldMatch = fieldRegex.exec(fieldsStr)) !== null) {
      const [, fieldName, braceValue, quoteValue, numValue] = fieldMatch;
      const value = (braceValue || quoteValue || numValue || '').trim();
      entry.fields[fieldName.toLowerCase()] = value;
    }
    
    entries.push(entry);
  }
  
  return entries;
}

// Convert author string to array
function parseAuthors(authorStr) {
  if (!authorStr) return [];
  return authorStr
    .split(/\s+and\s+/i)
    .map(author => {
      // Convert "Last, First" to "First Last"
      if (author.includes(',')) {
        const [last, first] = author.split(',').map(s => s.trim());
        return `${first} ${last}`;
      }
      return author.trim();
    });
}

// Generate a URL-friendly slug from the key
function toSlug(key) {
  return key
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Convert entry to markdown
function toMarkdown(entry) {
  const { type, key, fields } = entry;
  
  const title = fields.title?.replace(/[{}]/g, '') || 'Untitled';
  const authors = parseAuthors(fields.author);
  const year = fields.year || new Date().getFullYear();
  const venue = fields.booktitle || fields.journal || fields.publisher || '';
  const doi = fields.doi || '';
  const url = fields.url || '';
  const abstract = fields.abstract?.replace(/[{}]/g, '') || '';
  const arxiv = fields.eprint || fields.arxiv || '';
  
  // Build frontmatter
  const frontmatter = {
    title,
    authors,
    venue: venue.replace(/[{}]/g, ''),
    year: parseInt(year),
    date: `${year}-01-01`,
    type: type === 'article' ? 'journal' : type === 'inproceedings' ? 'conference' : type,
  };
  
  if (doi) frontmatter.doi = doi;
  if (arxiv) frontmatter.arxiv = arxiv;
  if (url) frontmatter.url = url;
  
  // Generate YAML frontmatter
  let yaml = '---\n';
  yaml += `title: "${frontmatter.title.replace(/"/g, '\\"')}"\n`;
  yaml += `authors:\n${frontmatter.authors.map(a => `  - "${a}"`).join('\n')}\n`;
  yaml += `venue: "${frontmatter.venue}"\n`;
  yaml += `year: ${frontmatter.year}\n`;
  yaml += `date: ${frontmatter.date}\n`;
  yaml += `type: "${frontmatter.type}"\n`;
  if (frontmatter.doi) yaml += `doi: "${frontmatter.doi}"\n`;
  if (frontmatter.arxiv) yaml += `arxiv: "${frontmatter.arxiv}"\n`;
  if (frontmatter.url) yaml += `url: "${frontmatter.url}"\n`;
  yaml += '---\n';
  
  // Add abstract as content if available
  let content = '';
  if (abstract) {
    content = `\n${abstract}\n`;
  }
  
  // Add original BibTeX as a comment for reference
  content += `\n<!-- Original BibTeX key: ${key} -->\n`;
  
  return { slug: toSlug(key), markdown: yaml + content };
}

// Main
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: pnpm run bib2md <path-to-bibtex-file>');
    console.log('Example: pnpm run bib2md references.bib');
    process.exit(1);
  }
  
  const bibFile = args[0];
  
  if (!existsSync(bibFile)) {
    console.error(`Error: File not found: ${bibFile}`);
    process.exit(1);
  }
  
  console.log(`Reading ${bibFile}...`);
  const content = readFileSync(bibFile, 'utf-8');
  const entries = parseBibTeX(content);
  
  if (entries.length === 0) {
    console.log('No BibTeX entries found.');
    process.exit(0);
  }
  
  console.log(`Found ${entries.length} entries.\n`);
  
  let created = 0;
  let skipped = 0;
  
  for (const entry of entries) {
    const { slug, markdown } = toMarkdown(entry);
    const filePath = join(PUBLICATIONS_DIR, `${slug}.md`);
    
    if (existsSync(filePath)) {
      console.log(`⏭️  Skipped (exists): ${slug}.md`);
      skipped++;
    } else {
      writeFileSync(filePath, markdown);
      console.log(`✅ Created: ${slug}.md`);
      created++;
    }
  }
  
  console.log(`\nDone! Created ${created} files, skipped ${skipped} existing files.`);
  console.log(`Publications are in: src/content/publications/`);
}

main();
