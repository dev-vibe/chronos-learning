import type { Claim, Lesson, Source, UnderstandingPrompt } from '../../src/domains/contracts';
import type { AuthoredContentModule } from '../assemble';

export const sahulCrossingSources: Source[] = [
  {
    id: 'source.humans.clarkson-2017-madjedbebe',
    title: 'Human occupation of northern Australia by 65,000 years ago',
    url: 'https://www.nature.com/articles/nature22968',
    publisher: 'Nature',
    accessedOn: '2026-09-03',
    licenseOrUse: 'Peer-reviewed excavation and OSL chronology cited as a fact source; article figures are not redistributed',
    reviewStatus: 'review-required',
  },
  {
    id: 'source.humans.allen-oconnell-2014-short-chronology',
    title: 'Both half right: Updating the evidence for dating first human arrivals in Sahul',
    url: 'https://doi.org/10.1080/03122417.2014.11682025',
    publisher: 'Australian Archaeology',
    accessedOn: '2026-09-03',
    licenseOrUse: 'Peer-reviewed dating synthesis cited as a fact source; article media are not redistributed',
    reviewStatus: 'review-required',
  },
  {
    id: 'source.humans.veth-2025-madjedbebe-comment',
    title: 'Do Recent DNA Studies Refute a 65 kya Arrival of Humans in Sahul?',
    url: 'https://doi.org/10.1002/arco.70005',
    publisher: 'Archaeology in Oceania',
    accessedOn: '2026-09-03',
    licenseOrUse: 'Peer-reviewed comment cited for the live association debate; media are not redistributed',
    reviewStatus: 'review-required',
  },
  {
    id: 'source.humans.bird-2019-not-accident',
    title: 'Early human settlement of Sahul was not an accident',
    url: 'https://www.nature.com/articles/s41598-019-42946-9',
    publisher: 'Scientific Reports',
    accessedOn: '2026-09-03',
    licenseOrUse: 'CC BY 4.0 modelling study cited as a fact source; figures are not redistributed in this prototype',
    reviewStatus: 'review-required',
  },
  {
    id: 'source.humans.bird-2018-timor-roti',
    title: 'Palaeogeography and voyage modeling indicates early human colonization of Australia was likely from Timor-Roti',
    url: 'https://doi.org/10.1016/j.quascirev.2018.04.027',
    publisher: 'Quaternary Science Reviews',
    accessedOn: '2026-09-03',
    licenseOrUse: 'Peer-reviewed voyage modelling cited as a fact source; figures are not redistributed',
    reviewStatus: 'review-required',
  },
  {
    id: 'source.humans.kealy-2017-visibility',
    title: 'Reconstructing Palaeogeography and Inter-island Visibility in the Wallacean Archipelago During the Likely Period of Sahul Colonization, 65–45 000 Years Ago',
    url: 'https://doi.org/10.1002/arp.1570',
    publisher: 'Archaeological Prospection',
    accessedOn: '2026-09-03',
    licenseOrUse: 'Peer-reviewed palaeogeography cited as a fact source; maps are not redistributed in this prototype',
    reviewStatus: 'review-required',
  },
  {
    id: 'source.humans.gandini-2025-long-chronology',
    title: 'Genomic evidence supports the “long chronology” for the peopling of Sahul',
    url: 'https://doi.org/10.1126/sciadv.ady9493',
    publisher: 'Science Advances',
    accessedOn: '2026-09-03',
    licenseOrUse: 'Peer-reviewed genetic synthesis cited as a fact source; figures are not redistributed',
    reviewStatus: 'review-required',
  },
  {
    id: 'source.humans.pedro-2020-papuan-mtdna',
    title: 'Papuan mitochondrial genomes and the settlement of Sahul',
    url: 'https://www.nature.com/articles/s10038-020-0781-3',
    publisher: 'Journal of Human Genetics',
    accessedOn: '2026-09-03',
    licenseOrUse: 'Peer-reviewed mitochondrial study cited as a fact source; figures are not redistributed',
    reviewStatus: 'review-required',
  },
  {
    id: 'source.humans.nunn-reid-2016-inundation',
    title: 'Aboriginal Memories of Inundation of the Australian Coast Dating from More than 7000 Years Ago',
    url: 'https://doi.org/10.1080/00049182.2015.1077539',
    publisher: 'Australian Geographer',
    accessedOn: '2026-09-03',
    licenseOrUse: 'Peer-reviewed interpretation of later tradition cited as a fact source; stories are not reproduced at length',
    reviewStatus: 'review-required',
  },
];

export const sahulCrossingClaims: Claim[] = [
  {
    id: 'claim.humans.sahul.connected-landmass',
    statement: 'At lower Ice Age sea levels, Australia, New Guinea, and Tasmania formed one landmass now called Sahul.',
    kind: 'observation',
    certainty: 'high',
    sourceIds: ['source.humans.clarkson-2017-madjedbebe', 'source.humans.bird-2019-not-accident'],
    reviewStatus: 'editorial-review-required',
  },
  {
    id: 'claim.humans.sahul.no-land-bridge',
    statement: 'The islands of Wallacea were never joined by land to Sahul, so any route required water crossings.',
    kind: 'observation',
    certainty: 'high',
    sourceIds: ['source.humans.kealy-2017-visibility', 'source.humans.bird-2019-not-accident'],
    reviewStatus: 'editorial-review-required',
  },
  {
    id: 'claim.humans.sahul.present-by-50ka',
    statement: 'People were living in Sahul by about 50,000 years ago.',
    kind: 'interpretation',
    certainty: 'high',
    sourceIds: ['source.humans.allen-oconnell-2014-short-chronology', 'source.humans.clarkson-2017-madjedbebe', 'source.humans.bird-2019-not-accident'],
    reviewStatus: 'editorial-review-required',
  },
  {
    id: 'claim.humans.sahul.madjedbebe-window',
    statement: 'At Madjedbebe, tools sit in sand dated by some teams to about 65,000 years ago; other researchers argue mixing could make the occupation younger.',
    kind: 'interpretation',
    certainty: 'contested',
    sourceIds: ['source.humans.clarkson-2017-madjedbebe', 'source.humans.veth-2025-madjedbebe-comment', 'source.humans.allen-oconnell-2014-short-chronology'],
    reviewStatus: 'editorial-review-required',
  },
  {
    id: 'claim.humans.sahul.osl-dates-sand',
    statement: 'The dates at Madjedbebe come from when sand grains last saw sunlight, not from a stamp on the tools.',
    kind: 'observation',
    certainty: 'high',
    sourceIds: ['source.humans.clarkson-2017-madjedbebe'],
    reviewStatus: 'editorial-review-required',
  },
  {
    id: 'claim.humans.sahul.planning-inferred',
    statement: 'Accidental drifting is a weak explanation for founding a lasting population; people almost certainly planned water travel.',
    kind: 'interpretation',
    certainty: 'moderate',
    sourceIds: ['source.humans.bird-2019-not-accident', 'source.humans.bird-2018-timor-roti'],
    reviewStatus: 'editorial-review-required',
  },
  {
    id: 'claim.humans.sahul.no-surviving-craft',
    statement: 'No watercraft from this crossing survives in the archaeological record.',
    kind: 'observation',
    certainty: 'high',
    sourceIds: ['source.humans.bird-2018-timor-roti', 'source.humans.bird-2019-not-accident'],
    reviewStatus: 'editorial-review-required',
  },
  {
    id: 'claim.humans.sahul.dna-window-not-route',
    statement: 'DNA from living and sampled people can support a broad settlement window; it cannot draw the exact crossing path.',
    kind: 'interpretation',
    certainty: 'high',
    sourceIds: ['source.humans.gandini-2025-long-chronology', 'source.humans.pedro-2020-papuan-mtdna'],
    reviewStatus: 'editorial-review-required',
  },
  {
    id: 'claim.humans.sahul.later-sea-stories',
    statement: 'Some Indigenous Australian stories remember later drowned coasts after ice sheets melted; those stories are later tradition, not a record of the first crossing.',
    kind: 'later-tradition',
    certainty: 'moderate',
    sourceIds: ['source.humans.nunn-reid-2016-inundation'],
    reviewStatus: 'editorial-review-required',
  },
];

export const sahulCrossingPrompts: UnderstandingPrompt[] = [
  {
    id: 'prompt.humans.sahul.sand-date-supports',
    lessonId: 'lesson.humans.sahul-crossing',
    kind: 'supported-selection',
    question: 'At Madjedbebe, researchers dated sand around stone tools to about 65,000 years ago. Which conclusion is best supported?',
    explanation: 'The date is for when the sand last saw sunlight. If the tools belong to that layer, people were there around then. Mixing could make the visit younger. The sand cannot recover the boat, the landing beach, or an exact first day.',
    required: true,
    options: [
      { id: 'option.humans.sahul.sand-and-tools', label: 'If the tools belong to that sand layer, people may have been there around then — but mixing could make the visit younger.' },
      { id: 'option.humans.sahul.exact-first-day', label: 'The date proves the exact day the first boat landed, so the crossing is a solved calendar event.' },
      { id: 'option.humans.sahul.dna-drew-route', label: 'The sand date is a DNA map that draws the island-by-island crossing path.' },
      { id: 'option.humans.sahul.known-boat', label: 'The date tells us which kind of boat they used and where they landed first.' },
    ],
  },
  {
    id: 'prompt.humans.sahul.planning-and-limit',
    lessonId: 'lesson.humans.sahul-crossing',
    kind: 'concise-explanation',
    question: 'Explain why the crossing looks planned, and name one thing this evidence still cannot prove.',
    explanation: 'A strong answer says the water never went away, so people needed craft and choices, and that accidental wash-up is a poor way to start a lasting community. Limits include the boat itself, the exact route, the first-landing day, and later sea stories that remember later drowned coasts.',
    required: true,
    minimumResponseLength: 80,
  },
];

export const sahulCrossingLesson: Lesson = {
  id: 'lesson.humans.sahul-crossing',
  legacyAliases: [],
  status: 'draft',
  title: 'Crossing to Sahul',
  masthead: 'at least c. 65,000–50,000 years ago',
  place: 'Sahul',
  chronology: {
    startYear: -65000,
    endYear: -50000,
    display: 'at least c. 65,000–50,000 years ago',
    approximate: true,
  },
  significance: 'People reached Australia–New Guinea by crossing open water tens of thousands of years before farming. The dates are a window, and the boats do not survive.',
  sectionIdsRequired: [
    'section.humans.sahul.landmass',
    'section.humans.sahul.open-water',
    'section.humans.sahul.dated-sand',
    'section.humans.sahul.planned-crossing',
    'section.humans.sahul.what-we-can-know',
    'section.humans.sahul.world-check',
  ],
  sections: [
    {
      id: 'section.humans.sahul.landmass',
      heading: 'Sahul was one land',
      purpose: 'Orient learners to the Ice Age landmass and the lesson question',
      modules: [
        {
          id: 'module.humans.sahul.opening',
          type: 'prose',
          body: `The last lesson followed some Homo sapiens groups as they moved beyond Africa and met other humans. Some of those groups kept moving east.

When the sea was lower, Australia, New Guinea, and Tasmania were one continent. Researchers call that land Sahul. Today's Australia, New Guinea, and Tasmania are leftover pieces of that land — not a dry path from Asia.

How they got there, and how early, depends on what the surviving evidence can support.`,
          claimIds: ['claim.humans.sahul.connected-landmass'],
          sourceIds: ['source.humans.clarkson-2017-madjedbebe', 'source.humans.bird-2019-not-accident'],
        },
        {
          id: 'module.humans.sahul.three-names',
          type: 'knowledge',
          eyebrow: 'Three places to keep straight',
          title: 'Sunda, Wallacea, and Sahul',
          body: 'Lower seas joined some lands and left others as islands. The names are modern. They help us keep three lands straight.',
          items: [
            { label: 'Sunda', detail: 'The Asian mainland plus nearby islands when seas were low — the starting side, not Sahul.' },
            { label: 'Wallacea', detail: 'A belt of islands between Sunda and Sahul. They stayed islands. They never became a dry walk.' },
            { label: 'Sahul', detail: 'Australia, New Guinea, and Tasmania joined as one land until later seas rose again.' },
          ],
          claimIds: ['claim.humans.sahul.connected-landmass', 'claim.humans.sahul.no-land-bridge'],
          sourceIds: ['source.humans.kealy-2017-visibility', 'source.humans.bird-2019-not-accident'],
        },
      ],
    },
    {
      id: 'section.humans.sahul.open-water',
      heading: 'No dry walk to Sahul',
      purpose: 'Establish that water crossings were required',
      modules: [
        {
          id: 'module.humans.sahul.water-gap',
          type: 'prose',
          body: `Even at the lowest Ice Age seas, deep water still sat between Wallacea and Sahul. People could hop from island to island, but the last steps were crossings, not a land bridge.

At least one of those crossings was tens of kilometres of open water. A community, including children, cannot swim that far.

So the arrival of people in Sahul is also evidence of water travel — long before farms, cities, or states.`,
          claimIds: ['claim.humans.sahul.no-land-bridge'],
          sourceIds: ['source.humans.kealy-2017-visibility', 'source.humans.bird-2019-not-accident', 'source.humans.bird-2018-timor-roti'],
        },
      ],
    },
    {
      id: 'section.humans.sahul.dated-sand',
      heading: 'Tools in dated sand',
      purpose: 'Use Madjedbebe to teach dating association and the 50–65 ka window',
      modules: [
        {
          id: 'module.humans.sahul.madjedbebe',
          type: 'prose',
          body: `A rock shelter called Madjedbebe, on Mirarr Country in northern Australia, holds stone tools, ground ochre, and grinding stones in deep sand.

Researchers cannot read a year off the tools. They date the sand around them. A lab method asks when those sand grains last saw sunlight. Once the sand is buried, that clock starts.

If the tools were dropped onto that sand and later layers did not mix them, the sand date can estimate when people were there. If later feet pushed older tools down, the visit could be younger than the sand.`,
          claimIds: ['claim.humans.sahul.osl-dates-sand', 'claim.humans.sahul.madjedbebe-window'],
          sourceIds: ['source.humans.clarkson-2017-madjedbebe', 'source.humans.veth-2025-madjedbebe-comment'],
        },
        {
          id: 'module.humans.sahul.two-numbers',
          type: 'knowledge',
          eyebrow: 'The dating argument',
          title: 'Two numbers to hold together',
          body: 'Historians do not all pick the same earliest year. The honest lesson is a range.',
          items: [
            { label: 'About 50,000 years ago', detail: 'Many sites across Sahul support people living there by this time. This is the safer end of the window.' },
            { label: 'About 65,000 years ago', detail: 'Some teams read Madjedbebe this early. Others say mixing could make the occupation younger.' },
            { label: 'No first-day stamp', detail: 'Neither number is a landing-day on a calendar. Both are arguments from dated layers and how those layers formed.' },
          ],
          claimIds: ['claim.humans.sahul.present-by-50ka', 'claim.humans.sahul.madjedbebe-window'],
          sourceIds: ['source.humans.allen-oconnell-2014-short-chronology', 'source.humans.clarkson-2017-madjedbebe', 'source.humans.veth-2025-madjedbebe-comment'],
        },
      ],
    },
    {
      id: 'section.humans.sahul.planned-crossing',
      heading: 'Why the crossing looks planned',
      purpose: 'Infer watercraft and choice without reconstructing a boat',
      modules: [
        {
          id: 'module.humans.sahul.planning',
          type: 'prose',
          body: `No canoe, raft, or paddle from this crossing has been found. Wood and fibre rot.

That does not make the crossing an accident. Researchers model winds, currents, and how long a person can survive without fresh water. Random wash-up can move someone to a nearby island now and then. It is a poor way to start a lasting community on a new continent.

Choosing a season, heading toward land, and travelling with enough people makes arrival much more likely. The models do not photograph the craft. They make planning the better explanation.`,
          claimIds: ['claim.humans.sahul.planning-inferred', 'claim.humans.sahul.no-surviving-craft'],
          sourceIds: ['source.humans.bird-2019-not-accident', 'source.humans.bird-2018-timor-roti'],
        },
        {
          id: 'module.humans.sahul.what-planning-means',
          type: 'knowledge',
          eyebrow: 'What planning can mean here',
          title: 'Watercraft, timing, and a group',
          body: 'Planning does not mean kings, maps, or a known boat design. It means people used watercraft and decided when to go.',
          items: [
            { label: 'Watercraft', detail: 'Something that could carry people across kilometres of sea. The materials have not survived.' },
            { label: 'A chosen time', detail: 'Winds and currents change with the season. Models work much better when departure is not random.' },
            { label: 'Enough people', detail: 'A lasting community needs more than one washed-up traveller, not a lone accident.' },
          ],
          claimIds: ['claim.humans.sahul.planning-inferred', 'claim.humans.sahul.no-surviving-craft'],
          sourceIds: ['source.humans.bird-2019-not-accident', 'source.humans.bird-2018-timor-roti'],
        },
      ],
    },
    {
      id: 'section.humans.sahul.what-we-can-know',
      heading: 'What dates and DNA can show',
      purpose: 'Separate observation, inference, and later tradition',
      modules: [
        {
          id: 'module.humans.sahul.limits',
          type: 'knowledge',
          eyebrow: 'What we can know',
          title: 'Dates, DNA, and later stories',
          body: 'Different kinds of evidence answer different questions. Mixing them up creates a fake first-day story.',
          items: [
            { label: 'It can show', detail: 'People reached Sahul across water tens of thousands of years before farming. Tools and dated sand place occupation in a window around 65,000–50,000 years ago.' },
            { label: 'It can support', detail: 'Planning and watercraft. DNA from much later people can back a broad time window, as in the last lesson. It is not a map of the crossing.' },
            { label: 'It cannot prove alone', detail: 'The exact first landing day, the island path, or the boat.' },
            { label: 'Later tradition', detail: 'Some Indigenous stories remember drowned coasts after the ice melted. Those stories are later, not a record of the first crossing.' },
          ],
          claimIds: [
            'claim.humans.sahul.present-by-50ka',
            'claim.humans.sahul.planning-inferred',
            'claim.humans.sahul.dna-window-not-route',
            'claim.humans.sahul.later-sea-stories',
          ],
          sourceIds: [
            'source.humans.clarkson-2017-madjedbebe',
            'source.humans.bird-2019-not-accident',
            'source.humans.gandini-2025-long-chronology',
            'source.humans.pedro-2020-papuan-mtdna',
            'source.humans.nunn-reid-2016-inundation',
          ],
        },
      ],
    },
    {
      id: 'section.humans.sahul.world-check',
      heading: 'World Check',
      purpose: 'Require a sincere attempt on dating association and the planning inference',
      modules: [
        {
          id: 'module.humans.sahul.prompt-sand',
          type: 'prompt',
          promptId: 'prompt.humans.sahul.sand-date-supports',
          claimIds: [],
          sourceIds: [],
        },
        {
          id: 'module.humans.sahul.prompt-planning',
          type: 'prompt',
          promptId: 'prompt.humans.sahul.planning-and-limit',
          claimIds: [],
          sourceIds: [],
        },
      ],
    },
  ],
  claimIds: sahulCrossingClaims.map((claim) => claim.id),
  sourceIds: sahulCrossingSources.map((source) => source.id),
  mediaIds: [],
  promptIds: sahulCrossingPrompts.map((prompt) => prompt.id),
};

export const sahulCrossingContent: AuthoredContentModule = {
  sources: sahulCrossingSources,
  claims: sahulCrossingClaims,
  prompts: sahulCrossingPrompts,
  lessons: [sahulCrossingLesson],
};
