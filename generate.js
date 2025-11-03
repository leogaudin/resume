import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { resume } from './data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//
// Simple templating: {{ field }}
//
const render = (template, vars) =>
  template.replace(/{{\s*([^}]+)\s*}}/g, (_, key) =>
    key.split('.').reduce((o, k) => o?.[k], vars) ?? ''
  );

//
// Generic key/value → HTML <li>
//
const htmlKeyValueList = obj =>
  Object.entries(obj)
    .map(([key, value]) => {
      const title =
        key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
      return `<li><b>${title}:</b> ${value}</li>`;
    })
    .join('');

//
// Generic key/value → LaTeX item
//
const texKeyValueList = obj => {
  const items = Object.entries(obj)
    .map(([key, value]) => {
      const title = key
        .split('_')
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ');
      return `\\textbf{${title}}{: ${value}} \\\\`;
    })
    .join('\n      ');

  return `\\small{\\item{\n      ${items}\n}}`;
};

//
// Block generators
//
const texEdu = e => `
\\resumeSubheading
  {${e.school}}{${e.location}}
  {${e.title}}{${e.dates}}
  ${e.bullets.length ? `\\resumeItemListStart
    ${e.bullets.map(b => `\\resumeItem{${b}}`).join('\n    ')}
  \\resumeItemListEnd` : ``}
`;

const texExp = e => `
\\resumeSubheading
  {${e.company}}{${e.location}}
  {${e.role}}{${e.dates}}
  ${e.bullets.length ? `\\resumeItemListStart
    ${e.bullets.map(b => `\\resumeItem{${b}}`).join('\n    ')}
  \\resumeItemListEnd` : ``}
`;

const texProj = e => `
\\resumeProjectHeading
  {\\textbf{${e.name}}}{\\emph{${e.dates}}}
  ${e.bullets.length ? `\\resumeItemListStart
    ${e.bullets.map(b => `\\resumeItem{${b}}`).join('\n    ')}
  \\resumeItemListEnd` : ``}
`;

const htmlEdu = e => `
<p>
  <strong>${e.school}</strong><br />
  <em>${e.title}</em><br />
  <small>${e.location} (${e.dates})</small>
  <ul>${e.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
</p>
`;

const htmlExp = e => `
<p>
  <strong>${e.company}</strong><br />
  <em>${e.role}</em><br />
  <small>${e.location} (${e.dates})</small>
  <ul>${e.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
</p>
`;

const htmlProj = e => `
<p>
  <strong>${e.name}</strong><br />
  <small>(${e.dates})</small>
  <ul>${e.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
</p>
`;

//
// Load templates
//
const texTemplate = fs.readFileSync(path.join(__dirname, 'templates/template_resume.tex'), 'utf8');
const htmlTemplate = fs.readFileSync(path.join(__dirname, 'templates/template_resume.html'), 'utf8');

//
// Build variables
//
const vars = {
  ...resume,
  education: resume.education.map(texEdu).join('\n'),
  experience: resume.experience.map(texExp).join('\n'),
  projects: resume.projects.map(texProj).join('\n'),
  skills_block: texKeyValueList(resume.skills),
  other_block: texKeyValueList(resume.other),
};

const varsHTML = {
  ...resume,
  education: resume.education.map(htmlEdu).join('\n'),
  experience: resume.experience.map(htmlExp).join('\n'),
  projects: resume.projects.map(htmlProj).join('\n'),
  skills_block: htmlKeyValueList(resume.skills),
  other_block: htmlKeyValueList(resume.other),
};

//
// Render outputs
//
if (!fs.existsSync(path.join(__dirname, 'dist'))) {
  fs.mkdirSync(path.join(__dirname, 'dist'));
}

fs.writeFileSync(path.join(__dirname, 'dist/resume.tex'), render(texTemplate, vars));
fs.writeFileSync(path.join(__dirname, 'dist/resume.html'), render(htmlTemplate, varsHTML).replace('\\', ''));

console.log('✅ Generated resume.tex and resume.html');