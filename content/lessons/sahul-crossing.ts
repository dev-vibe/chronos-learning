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
    question: 'Sand around stone tools at Madjedbebe was dated to about 65,000 years ago. What must researchers check before using that date as evidence that people lived there then?',
    explanation: 'The method dates the burial of the sand. To use it to date human activity, researchers must check that the tools were buried at about the same time. Tools that moved down from a younger layer could be much younger than the sand around them.',
    required: true,
    options: [
      { id: 'option.humans.sahul.sand-and-tools', label: 'Whether the tools were buried with that sand or moved down from a younger layer.' },
      { id: 'option.humans.sahul.age-of-stone', label: 'Whether the rock used to make the tools formed about 65,000 years ago.' },
      { id: 'option.humans.sahul.tool-shape', label: 'Whether the tools have the same shape as tools from a site dated to 65,000 years ago.' },
      { id: 'option.humans.sahul.shelter-age', label: 'Whether the rock shelter itself formed about 65,000 years ago.' },
    ],
  },
  {
    id: 'prompt.humans.sahul.planning-and-limit',
    lessonId: 'lesson.humans.sahul-crossing',
    kind: 'concise-explanation',
    question: 'Why do researchers think people planned their sea journeys to Sahul? Use an example from the lesson, then name one detail of the journeys that remains unknown.',
    explanation: 'Voyage models suggest that choosing when and where to travel made successful crossings more likely than drifting at random. Enough people also had to arrive to establish a community. Together, these findings support planning. The exact routes, departure dates, and designs of the watercraft remain unknown.',
    required: true,
    minimumResponseLength: 80,
  },
];

export const sahulCrossingLesson: Lesson = {
  id: 'lesson.humans.sahul-crossing',
  legacyAliases: [],
  status: 'draft',
  title: 'Crossing to Sahul',
  masthead: 'About 65,000–50,000 years ago',
  place: 'Sahul',
  chronology: {
    startYear: -65000,
    endYear: -50000,
    display: 'About 65,000–50,000 years ago',
    approximate: true,
  },
  significance: 'Tens of thousands of years before farming, people crossed the sea to reach Australia and New Guinea. Their journeys reveal skills and cooperation that left few traces behind.',
  sectionIdsRequired: [
    'section.humans.sahul.landmass',
    'section.humans.sahul.open-water',
    'section.humans.sahul.planned-crossing',
    'section.humans.sahul.dated-sand',
    'section.humans.sahul.what-we-can-know',
    'section.humans.sahul.world-check',
  ],
  sections: [
    {
      id: 'section.humans.sahul.landmass',
      heading: 'Sahul in the Ice Age',
      purpose: 'Orient learners to the Ice Age landmass and the lesson question',
      modules: [
        {
          id: 'module.humans.sahul.opening',
          type: 'prose',
          body: `On a map today, Australia, New Guinea, and Tasmania are separated by water. During the Ice Age, sea levels were lower. Land that is now underwater connected them into one huge landmass. Researchers call it Sahul.

In the previous lesson, we followed groups of Homo sapiens moving beyond Africa. Some eventually reached the islands of Southeast Asia. To reach Sahul from there, they faced a different challenge: stretches of open sea.

How did people make those journeys, and what traces of them can we still find?`,
          claimIds: ['claim.humans.sahul.connected-landmass', 'claim.humans.sahul.no-land-bridge'],
          sourceIds: ['source.humans.clarkson-2017-madjedbebe', 'source.humans.bird-2019-not-accident'],
        },
        {
          id: 'module.humans.sahul.three-names',
          type: 'knowledge',
          eyebrow: 'The geography',
          title: 'Sunda, Wallacea, and Sahul',
          body: 'Three names help describe the region from west to east:',
          items: [
            { label: 'Sunda', detail: 'The landmass formed when lower seas connected parts of Southeast Asia to the Asian mainland.' },
            { label: 'Wallacea', detail: 'The islands between Sunda and Sahul, separated by deep channels of water.' },
            { label: 'Sahul', detail: 'Australia, New Guinea, and Tasmania, joined by land that is now beneath the sea.' },
          ],
          claimIds: ['claim.humans.sahul.connected-landmass', 'claim.humans.sahul.no-land-bridge'],
          sourceIds: ['source.humans.kealy-2017-visibility', 'source.humans.bird-2019-not-accident'],
        },
      ],
    },
    {
      id: 'section.humans.sahul.open-water',
      heading: 'Reaching Sahul by sea',
      purpose: 'Establish that water crossings were required',
      modules: [
        {
          id: 'module.humans.sahul.water-gap',
          type: 'prose',
          body: `Lower seas exposed more land, but the deep channels through Wallacea and across to Sahul never dried out. People could travel through the islands, yet no route let them walk all the way.

At least one crossing involved tens of kilometres of open water. Reaching Sahul required some kind of watercraft: a boat, raft, or another way to carry people over the sea.

The people who arrived went on to establish communities there. Explaining that takes more than showing that a single traveller could survive a lucky crossing. Enough people had to reach Sahul for a community to continue.`,
          claimIds: ['claim.humans.sahul.no-land-bridge', 'claim.humans.sahul.planning-inferred'],
          sourceIds: ['source.humans.kealy-2017-visibility', 'source.humans.bird-2019-not-accident', 'source.humans.bird-2018-timor-roti'],
        },
      ],
    },
    {
      id: 'section.humans.sahul.planned-crossing',
      heading: 'Planning a sea crossing',
      purpose: 'Infer watercraft and choice without reconstructing a boat',
      modules: [
        {
          id: 'module.humans.sahul.planning',
          type: 'prose',
          body: `No watercraft from these early journeys has been found. Materials such as wood and plant fibre decay, so we cannot examine a surviving boat to see how it worked.

Instead, researchers use computer models to test possible journeys. They include winds, currents, and how long travellers could survive without fresh water. They compare craft drifting at random with journeys in which people choose when to leave and travel toward land.

In these models, deliberate journeys make successful settlement much more likely. Accidental drift might bring some people ashore, but it is a weaker explanation for enough arrivals to establish a lasting community.

The results depend on assumptions about the craft and the conditions at sea. They support the idea of planned travel, without showing exactly how any one journey happened.`,
          claimIds: ['claim.humans.sahul.planning-inferred', 'claim.humans.sahul.no-surviving-craft'],
          sourceIds: ['source.humans.bird-2019-not-accident', 'source.humans.bird-2018-timor-roti'],
        },
        {
          id: 'module.humans.sahul.what-planning-means',
          type: 'knowledge',
          eyebrow: 'The journey',
          title: 'Decisions that could help a crossing succeed',
          body: 'The models consider several conditions for successful settlement:',
          items: [
            { label: 'When to leave', detail: 'Seasonal winds and currents could make a crossing easier or harder.' },
            { label: 'Where to head', detail: 'Travelling toward land could improve the chance of reaching it before fresh water ran out.' },
            { label: 'Enough people arriving', detail: 'Enough people needed to arrive to establish a community, whether in one journey or several.' },
          ],
          claimIds: ['claim.humans.sahul.planning-inferred', 'claim.humans.sahul.no-surviving-craft'],
          sourceIds: ['source.humans.bird-2019-not-accident', 'source.humans.bird-2018-timor-roti'],
        },
      ],
    },
    {
      id: 'section.humans.sahul.dated-sand',
      heading: 'Dating the earliest settlements',
      purpose: 'Use Madjedbebe to teach dating association and the 50–65 ka window',
      modules: [
        {
          id: 'module.humans.sahul.madjedbebe',
          type: 'prose',
          body: `When did people reach Sahul? One important clue comes from Madjedbebe, a rock shelter on the land of the Mirarr people in northern Australia. Archaeologists have found stone tools, grinding stones, and ochre, a mineral used as a pigment, buried there.

The tools show that people used the shelter. To work out when, researchers tested the sand around them. A laboratory method estimates how long it has been since sand grains were last exposed to sunlight, before they were buried.

Some of that sand was dated to about 65,000 years ago. If the tools were buried with it, people were using the shelter around that time. But if tools moved down from a younger layer, they could be younger than the sand now surrounding them.

That is the central disagreement at Madjedbebe. The excavation team argues that the earliest tools belong to the old layers. Other researchers question whether movement within the sand makes the human occupation seem older than it was.`,
          claimIds: ['claim.humans.sahul.osl-dates-sand', 'claim.humans.sahul.madjedbebe-window'],
          sourceIds: ['source.humans.clarkson-2017-madjedbebe', 'source.humans.veth-2025-madjedbebe-comment'],
        },
        {
          id: 'module.humans.sahul.two-numbers',
          type: 'knowledge',
          eyebrow: 'The dates',
          title: 'When people were living in Sahul',
          body: 'The evidence supports two different levels of confidence:',
          items: [
            { label: 'By about 50,000 years ago', detail: 'There is strong evidence that people were already living in Sahul.' },
            { label: 'Possibly about 65,000 years ago', detail: 'The oldest finds at Madjedbebe support an earlier presence, but their age remains debated.' },
          ],
          claimIds: ['claim.humans.sahul.present-by-50ka', 'claim.humans.sahul.madjedbebe-window'],
          sourceIds: ['source.humans.allen-oconnell-2014-short-chronology', 'source.humans.clarkson-2017-madjedbebe', 'source.humans.veth-2025-madjedbebe-comment'],
        },
      ],
    },
    {
      id: 'section.humans.sahul.what-we-can-know',
      heading: 'What other evidence can tell us',
      purpose: 'Separate observation, inference, and later tradition',
      modules: [
        {
          id: 'module.humans.sahul.limits',
          type: 'prose',
          body: `Tools and sand are part of a much larger history. As we saw in the previous lesson, DNA can also help researchers investigate the past. Comparisons of genetic patterns can support a broad estimate of when people settled Sahul. They cannot tell us the exact route taken by a particular group.

Some Aboriginal Australian communities also pass down stories about coastal land being covered by the sea. Researchers have linked some of these accounts to rising seas thousands of years after the first crossings. These are later traditions about changes to familiar country, rather than accounts of the original arrival.

Much remains unknown about the early journeys: the craft people built, the routes they took, and the choices they made along the way. But the achievement is clear. People crossed open water and established communities in Sahul tens of thousands of years before farming. The evidence points to travellers capable of planning and working together.`,
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
