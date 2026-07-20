import canonicalRosterCsv from '../../docs/content/data/world-spine-canonical-roster.csv?raw';

export type WorldSpineNode = Readonly<{
  order: number;
  id: string;
  title: string;
  dateDisplay: string;
  chapterId: string;
  prerequisiteIds: readonly string[];
  scope: string;
}>;

export type WorldSpineChapter = Readonly<{
  id: string;
  title: string;
  period: string;
  purpose: string;
  nodes: readonly WorldSpineNode[];
}>;

const chapterDefinitions = [
  { id: '01', title: 'Human Beginnings and Food Systems', period: 'c. 300,000\u20133500 BCE', purpose: 'Evidence, movement, climate, and food production changed human possibilities.' },
  { id: '02', title: 'Cities, States, and Bronze Age Networks', period: 'c. 3500\u20131100 BCE', purpose: 'Cities, records, states, trade, and political power grew together.' },
  { id: '03', title: 'Iron Age Societies and Classical Foundations', period: 'c. 1100\u2013300 BCE', purpose: 'New states, ethical traditions, and connected political worlds took shape.' },
  { id: '04', title: 'Continental Empires and Belief Networks', period: 'c. 300 BCE\u2013500 CE', purpose: 'Empires, trade routes, religions, and knowledge systems crossed regions.' },
  { id: '05', title: 'Religious Empires and Regional Reconfiguration', period: 'c. 500\u20131000 CE', purpose: 'Post-Roman, Islamic, African, Asian, and Pacific worlds reorganized power and exchange.' },
  { id: '06', title: 'Post-Classical Networks and Crises', period: 'c. 1000\u20131450 CE', purpose: 'Commerce, migration, conquest, argument, and plague linked distant societies.' },
  { id: '07', title: 'Oceanic Contact and Early Modern Empires', period: 'c. 1450\u20131650 CE', purpose: 'Ocean crossings, conquest, forced movement, and new states remade world connections.' },
  { id: '08', title: 'States, Science, and Atlantic Economies', period: 'c. 1600\u20131789 CE', purpose: 'States, inquiry, coerced labor, and political argument reshaped power.' },
  { id: '09', title: 'Revolutions, Industry, and Emancipation', period: '1789\u20131870 CE', purpose: 'Revolutions and fossil-fueled production transformed rights, work, and empire.' },
  { id: '10', title: 'Mass Society and High Imperialism', period: '1870\u20131914 CE', purpose: 'Industry, migration, nationalism, imperial rule, and reform tightened global connections.' },
  { id: '11', title: 'World Wars and Competing Orders', period: '1914\u20131945 CE', purpose: 'War, revolution, economic crisis, genocide, and institution building remade global order.' },
  { id: '12', title: 'Decolonization and an Interdependent World', period: '1945\u2013present', purpose: 'Decolonization, Cold War rivalry, rights, technology, and planetary challenges shaped the present.' },
] as const;

function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (quoted) {
      if (character === '"' && input[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ',') {
      row.push(field);
      field = '';
    } else if (character === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else if (character !== '\r') {
      field += character;
    }
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((candidate) => candidate.some((value) => value.length));
}

const [headers, ...records] = parseCsv(canonicalRosterCsv);
const positions = new Map(headers.map((header, index) => [header, index]));
const value = (row: string[], column: string) => row[positions.get(column) ?? -1] ?? '';
const splitIds = (raw: string) => raw && raw !== 'None' ? raw.split('|') : [];

const nodes = records.map((row): WorldSpineNode => ({
  order: Number(value(row, 'order')),
  id: value(row, 'canonical_id'),
  title: value(row, 'learner_title'),
  dateDisplay: value(row, 'date_display'),
  chapterId: value(row, 'chapter'),
  prerequisiteIds: splitIds(value(row, 'prerequisites')),
  scope: value(row, 'scope'),
})).sort((left, right) => left.order - right.order);

export const worldSpineRoadmap: readonly WorldSpineChapter[] = chapterDefinitions.map((chapter) => ({
  ...chapter,
  nodes: nodes.filter((node) => node.chapterId === chapter.id),
}));

export const worldSpineNodeCount = nodes.length;
