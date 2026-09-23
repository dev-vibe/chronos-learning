import type { Claim, Lesson, Source, UnderstandingPrompt } from '../../src/domains/contracts';
import type { AuthoredContentModule } from '../assemble';
import { akkadLocatorVisual, akkadMedia, akkadMediaSources, akkadSealExampleVisual, akkadSteleVisual } from './akkad-media';

const lessonId = 'lesson.mesopotamia.akkadian-empire';

export const akkadSources: Source[] = [
  ...akkadMediaSources,
  { id: 'source.akkad.met-period', title: 'The Akkadian Period (ca. 2350–2150 B.C.)', url: 'https://www.metmuseum.org/toah/hd/akka/hd_akka.htm', publisher: 'The Metropolitan Museum of Art', accessedOn: '2026-09-22', licenseOrUse: 'Research citation for rounded period and southern Mesopotamian setting; the essay’s absolute first-empire language is not adopted. No image redistribution.', reviewStatus: 'reviewed' },
  { id: 'source.akkad.sargon-inscription', title: 'RIME 2.01.01.01 composite, P461926', url: 'https://cdli.earth/artifacts/461926', publisher: 'Cuneiform Digital Library Initiative / RIME', accessedOn: '2026-09-22', licenseOrUse: 'Research citation and short attributed paraphrase; Akkadian version lines 12–31 and 79–85 close-reviewed. Scholarly composite without an original findspot or image on the record.', reviewStatus: 'reviewed' },
  { id: 'source.akkad.leilan', title: 'Acropolis Northwest — Akkadian Palace', url: 'https://leilan.yale.edu/about-project/excavations/acropolis-northwest-akkadian-palace', publisher: 'Yale Tell Leilan Project', accessedOn: '2026-09-22', licenseOrUse: 'Research citation; Akkadian conquest, schoolroom, palace and post-Akkadian sections close-reviewed. Page states no reprint without permission; no image copied.', reviewStatus: 'reviewed' },
  { id: 'source.akkad.urkesh', title: 'Tar’am-Agade, Daughter of Naram-Sin, at Urkesh', url: 'https://urkesh.org/attach/Buccellati%202002%20Taram%20Agade%20Daughter%20of%20Naram%20Sin.pdf', publisher: 'Giorgio Buccellati and Marilyn Kelly-Buccellati, excavators of Urkesh (2002)', accessedOn: '2026-09-22', licenseOrUse: 'Research citation; pp. 1–4 excavation, sealings, Tar’am-Agade and alternative roles close-reviewed. No image redistribution established.', reviewStatus: 'reviewed' },
  { id: 'source.akkad.louvre-stele', title: 'Victory Stele of Naram-Sin, SB 4', url: 'https://collections.louvre.fr/en/ark:/53355/cl010123450', publisher: 'Musée du Louvre, Département des Antiquités orientales', accessedOn: '2026-09-22', licenseOrUse: 'Research citation; object description, inscriptions and provenance close-reviewed. Image use requires separate rights review.', reviewStatus: 'reviewed' },
  { id: 'source.akkad.weiss', title: 'The Genesis and Collapse of the Akkadian Empire: The Accidental Refraction of Historical Law', url: 'https://leilan.yale.edu/sites/default/files/publications/article-specific/weiss_and_courty_1993_genesis_collapse_akkadian_empire_in_liverani_ed_akkad_the_first_world_empire.pdf', publisher: 'Harvey Weiss and Marie-Agnès Courty, in Liverani (ed.), Akkad: The First World Empire (1993), pp. 131–155', accessedOn: '2026-09-22', licenseOrUse: 'Research citation for the Tell Leilan abandonment/aridity explanation; source argument reviewed alongside a recent countercase. No figure reuse.', reviewStatus: 'reviewed' },
  { id: 'source.akkad.isotopes', title: 'Much ado about nothing: assessing the impact of the 4.2 kya event', url: 'https://doi.org/10.15184/aqy.2021.117', publisher: 'Arkadiusz Sołtysiak et al., Antiquity 95 (2021)', accessedOn: '2026-09-22', licenseOrUse: 'Open research citation; archaeological background, isotope results and conclusions close-reviewed. Figures require attribution and separate placement review.', reviewStatus: 'reviewed' },
  { id: 'source.akkad.capital-review', title: 'Where Was the City of Akkade?', url: 'https://kokushikan.repo.nii.ac.jp/records/15919', publisher: 'Kawakami, Al-Rāfidān 44 (2023)', accessedOn: '2026-09-22', licenseOrUse: 'Research citation for unsettled capital-location proposals; no map reproduction.', reviewStatus: 'reviewed' },
];

export const akkadClaims: Claim[] = [
  { id: 'claim.akkad.period', statement: 'About 2350–2150 BCE is a rounded teaching frame for the Akkadian period, not an exact interval for every site.', kind: 'interpretation', certainty: 'moderate', sourceIds: ['source.akkad.met-period'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.capital-location', statement: 'Agade is named in ancient records but its exact archaeological location has not been securely identified.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.akkad.capital-review', 'source.akkad.sargon-inscription'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.conquest-claims', statement: 'Sargon’s royal inscription claims victories over Uruk, Ur and Umma and says citizens of Agade held governorships.', kind: 'observation', certainty: 'high', sourceIds: ['source.akkad.sargon-inscription'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.winning-and-governing', statement: 'A military victory and continued government are different; governing places across distance required officials, supplies and relationships with local people.', kind: 'interpretation', certainty: 'moderate', sourceIds: ['source.akkad.sargon-inscription', 'source.akkad.leilan', 'source.akkad.urkesh'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.leilan-administration', statement: 'Tell Leilan preserves an Akkadian-period fortified administrative building, grain-processing spaces, sealings and tablets.', kind: 'observation', certainty: 'high', sourceIds: ['source.akkad.leilan'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.leilan-work', statement: 'Grain processing and record keeping at Leilan show labor and supplies behind distant rule without revealing every worker’s experience.', kind: 'interpretation', certainty: 'moderate', sourceIds: ['source.akkad.leilan'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.taram-sealings', statement: 'Seal impressions found in the Urkesh palace name Tar’am-Agade as Naram-Sin’s daughter.', kind: 'observation', certainty: 'high', sourceIds: ['source.akkad.urkesh'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.seal-example', statement: 'The Met displays an Akkadian-period cylinder seal with a modern impression of its design; it is not a Tar’am-Agade sealing or a find from Urkesh.', kind: 'observation', certainty: 'high', sourceIds: ['source.akkad.met-seal-example'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.urkesh-relationship', statement: 'Tar’am-Agade’s sealings establish a royal-family connection at Urkesh but do not alone settle whether Akkad directly governed the city.', kind: 'interpretation', certainty: 'moderate', sourceIds: ['source.akkad.urkesh'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.stele-image', statement: 'Naram-Sin’s surviving victory stele depicts the king above and larger than his soldiers and the people they defeat.', kind: 'observation', certainty: 'high', sourceIds: ['source.akkad.louvre-stele'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.stele-afterlife', statement: 'The stele is associated with Sippar, was later taken to Susa and given a second inscription there; much of its Akkadian inscription is lost.', kind: 'observation', certainty: 'high', sourceIds: ['source.akkad.louvre-stele'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.uneven-change', statement: 'Late-third-millennium settlement changes differed across northern Mesopotamian sites, including abandonment at Leilan and continued occupation elsewhere.', kind: 'interpretation', certainty: 'moderate', sourceIds: ['source.akkad.leilan', 'source.akkad.isotopes'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.drought-limits', statement: 'Aridity may have harmed some northern places, but the evidence does not establish one sudden drought that ended Akkadian rule everywhere.', kind: 'interpretation', certainty: 'contested', sourceIds: ['source.akkad.weiss', 'source.akkad.isotopes'], reviewStatus: 'reviewed' },
];

export const akkadPrompts: UnderstandingPrompt[] = [
  {
    id: 'prompt.akkad.local-arrangements', lessonId, kind: 'supported-selection', required: true,
    question: 'At Leilan, archaeologists found a fortified administrative building with grain-processing rooms and tablets. At Urkesh, they found seal impressions naming a daughter of an Akkadian ruler. What is the strongest conclusion?',
    hint: 'Ask what the finds show at each place before deciding whether the two cities were governed in the same way.',
    explanation: 'Leilan has evidence of an Akkadian administrative center and its work. The Urkesh sealings show a royal-family tie, but her exact role and the city’s political arrangement remain uncertain. Distant power could involve different local relationships.',
    options: [
      { id: 'option.akkad.different-ties', label: 'Both places had Akkadian connections, but the evidence points to different or uncertain arrangements.', feedback: 'Yes. The Leilan building and the Urkesh sealings show different kinds of connection; they cannot be flattened into one identical province.' },
      { id: 'option.akkad.identical-provinces', label: 'Both cities had identical Akkadian offices because a royal name appears in each place.', feedback: 'A royal name or family tie does not establish every office and practice in a city. Leilan has stronger evidence for an administrative installation.' },
      { id: 'option.akkad.no-connection', label: 'Neither city had a meaningful Akkadian connection.', feedback: 'The Leilan complex and the Urkesh sealings are material evidence of connections; the question is what kind of relationship each supports.' },
    ],
  },
  {
    id: 'prompt.akkad.holding-power', lessonId, kind: 'concise-explanation', required: true, minimumResponseLength: 20,
    question: 'Sargon’s inscription says he defeated several cities. Why would a victory alone not tell us how Akkadian rulers kept power? Use one example from Leilan or Urkesh.',
    hint: 'Think about what people would have to keep doing after soldiers left a city.',
    explanation: 'For example: a ruler could claim a victory, but continued rule needed people to collect and process grain, keep records and manage work. Leilan preserves evidence for those activities in an administrative complex. Urkesh shows a tie to the royal family, although the exact political arrangement is uncertain. A victory claim alone cannot tell us how each city was governed.',
  },
];

const sections: Lesson['sections'] = [
  {
    id: 'section.akkad.place-and-question', heading: 'Akkad in Mesopotamia', purpose: 'Locate the lesson and make the distinction between conquering and governing concrete.',
    modules: [
      { id: 'module.akkad.opening-question', type: 'prose', claimIds: ['claim.akkad.winning-and-governing'], sourceIds: ['source.akkad.sargon-inscription', 'source.akkad.leilan'], body: 'A ruler can win a battle in one day. Keeping power in another city is a different challenge. Someone must carry out decisions when the ruler is far away. How did Akkadian rulers try to do that?' },
      akkadLocatorVisual,
      { id: 'module.akkad.opening-context', type: 'prose', claimIds: ['claim.akkad.period', 'claim.akkad.capital-location', 'claim.akkad.winning-and-governing'], sourceIds: ['source.akkad.met-period', 'source.akkad.capital-review', 'source.akkad.sargon-inscription', 'source.akkad.leilan'], body: 'This story begins in Mesopotamia, the region around the Tigris and Euphrates rivers in and around present-day Iraq. Around 2350–2150 BCE, rulers associated with a city called Agade, also called Akkad, claimed power over several cities and regions. The capital is known from texts, but archaeologists have not securely located it. We can locate the wider region without pretending to know its exact spot.\n\nAn empire is a form of rule in which a center asserts power over other communities. It is more than one ruler with a large city: holding power across distance is the problem we will follow. Earlier, Kerma showed that contact between places did not automatically mean one ruled the other. Here we ask what evidence would show a stronger political connection.' },
    ],
  },
  {
    id: 'section.akkad.conquest-claims', heading: 'Sargon’s conquest claims', purpose: 'Attribute a royal account and distinguish a reported victory from durable control.',
    modules: [
      { id: 'module.akkad.sargon-claims', type: 'prose', claimIds: ['claim.akkad.conquest-claims', 'claim.akkad.winning-and-governing'], sourceIds: ['source.akkad.sargon-inscription'], body: 'A royal inscription names Sargon as king of Agade. It says he defeated Uruk, Ur and Umma—cities that had their own histories and rulers. It also says people from Agade held governorships. A governor is someone appointed to administer a place on a ruler’s behalf.\n\nThose words tell us what Sargon’s court wanted recorded: victories and the appointment of people loyal to the center. The text survives for us as a scholarly reconstruction from multiple copies, not as a single complete stone with a known original setting. We should read its message seriously without turning every victory into a solid, permanent patch of color on a map. What happened in a city after a battle needs evidence from that place.' },
      { id: 'module.akkad.claim-and-test', type: 'knowledge', eyebrow: 'What we can know', title: 'What we can know', body: 'A ruler’s words and local remains answer different questions.', claimIds: ['claim.akkad.conquest-claims', 'claim.akkad.winning-and-governing'], sourceIds: ['source.akkad.sargon-inscription', 'source.akkad.leilan'], items: [
        { label: 'It can show', detail: 'The inscription reports Sargon’s victories and governorships.' },
        { label: 'It can support', detail: 'Buildings, sealings and records at a local site support a picture of continuing work there.' },
        { label: 'It cannot prove alone', detail: 'That every city was governed in the same way, or for the same length of time.' },
        { label: 'It cannot recover', detail: 'How every worker and conquered family experienced that rule.' },
      ] },
    ],
  },
  {
    id: 'section.akkad.leilan-administration', heading: 'Governing at Tell Leilan', purpose: 'Show administrative buildings, grain and records as continued work behind distant rule.',
    modules: [
      { id: 'module.akkad.leilan', type: 'prose', claimIds: ['claim.akkad.leilan-administration', 'claim.akkad.leilan-work'], sourceIds: ['source.akkad.leilan'], body: 'Far north of the southern cities named in Sargon’s text, excavators at Tell Leilan found a fortified building they identify as an Akkadian administrative center. Its rooms included spaces for processing grain. Clay sealings and tablets are traces of people keeping track of goods and work. Across the street, a room with practice tablets may have trained people to write records.\n\nImagine the repeated work, not just the walls: farmers grew grain; people carried it in, processed it and recorded amounts. The building and objects show that organized activity continued at this site. They do not tell us every worker’s name, whether that person wanted to work there, or whether all other cities had the same arrangement.' },
      { id: 'module.akkad.leilan-work', type: 'knowledge', eyebrow: 'Who did the work', title: 'Who did the work', body: 'Keeping authority at Leilan depended on activities beyond a ruler’s victory.', claimIds: ['claim.akkad.leilan-work'], sourceIds: ['source.akkad.leilan'], items: [
        { label: 'Grow and bring grain', detail: 'Food had to reach the people and buildings using it.' },
        { label: 'Process and store it', detail: 'Rooms and ovens point to repeated handling of grain.' },
        { label: 'Record and seal', detail: 'Tablets and sealings helped officials keep track of activities.' },
      ] },
    ],
  },
  {
    id: 'section.akkad.urkesh-ties', heading: 'A royal connection at Urkesh', purpose: 'Use a named woman and local sealings to compare forms of imperial presence.',
    modules: [
      { id: 'module.akkad.urkesh', type: 'prose', claimIds: ['claim.akkad.taram-sealings', 'claim.akkad.urkesh-relationship'], sourceIds: ['source.akkad.urkesh'], body: 'Another northern city, Urkesh, gives us a different clue. In its palace, excavators found clay seal impressions naming Tar’am-Agade. The inscription identifies her as the daughter of Naram-Sin, a later Akkadian ruler. A seal was rolled or pressed into soft clay to mark a closure or record. These impressions were found in a place where the seals had been used, not merely in a later story about her.' },
      akkadSealExampleVisual,
      { id: 'module.akkad.urkesh-limits', type: 'prose', claimIds: ['claim.akkad.taram-sealings', 'claim.akkad.urkesh-relationship'], sourceIds: ['source.akkad.urkesh'], body: 'The excavators think Tar’am-Agade may have been queen in a relationship with a local ruler. They also consider another possibility involving a priestly role and Akkadian administration. The impressions establish a royal family connection at the site; they do not settle her exact position or prove that Urkesh was governed like Leilan.\n\nTar’am-Agade is a named person besides the king, but her sealings still come from elite life. Most people at Urkesh did not leave records that name them. Comparing the two sites helps us ask what kind of connection each actually shows.' },
    ],
  },
  {
    id: 'section.akkad.naram-sin-stele', heading: 'Naram-Sin’s victory stele', purpose: 'Read a surviving royal artwork as purposeful self-presentation, then name its limits.',
    modules: [
      { id: 'module.akkad.stele-intro', type: 'prose', claimIds: ['claim.akkad.stele-image'], sourceIds: ['source.akkad.louvre-stele'], body: 'Naram-Sin’s court also presented power through art. A tall carved stone, called a stele, commemorated one of his victories. Its scene includes soldiers and people being defeated. We can examine the ruler’s message without celebrating the violence.' },
      akkadSteleVisual,
      { id: 'module.akkad.stele-limits', type: 'prose', claimIds: ['claim.akkad.stele-image', 'claim.akkad.stele-afterlife'], sourceIds: ['source.akkad.louvre-stele'], body: 'The ruler’s size and position make him the center of the scene. The stele is evidence of how royal power was presented, not a complete report of the fighting or of government afterward. It was associated with Sippar, then taken to Susa. A later ruler added writing about that removal; much of the original writing is lost.\n\nThe buildings and sealings from Leilan and Urkesh answer a different question: what traces of continuing relationships did rulers leave at particular places?' },
    ],
  },
  {
    id: 'section.akkad.regional-change', heading: 'Changes in different regions', purpose: 'Resolve the question without a uniform collapse or monocausal drought story.',
    modules: [
      { id: 'module.akkad.regional-change', type: 'prose', claimIds: ['claim.akkad.uneven-change', 'claim.akkad.drought-limits', 'claim.akkad.winning-and-governing'], sourceIds: ['source.akkad.leilan', 'source.akkad.weiss', 'source.akkad.isotopes'], body: 'Akkadian rulers did not keep the same reach forever. At Tell Leilan, the large administrative center was eventually abandoned. Other northern settlements changed in different ways; some continued to be occupied. The end of one center is not the disappearance of every community in a region.\n\nSome researchers connect Leilan’s abandonment and other northern changes to drier conditions. Others find evidence that food practices continued at several sites during the same broad period. Drying may have mattered in some places, but the evidence does not establish one sudden drought that ended Akkadian rule everywhere. Political relationships could change as well.\n\nThe question we began with has no single tool as its answer. Rulers could claim victories, appoint people, move supplies and form ties with local elites. Those methods depended on workers and communities far from the royal center. The record is strongest for some places and people, and much weaker for others. That is why a picture of an empire needs more than a victory inscription or one border line.' },
    ],
  },
  {
    id: 'section.akkad.understanding', heading: 'Explain Akkadian rule', purpose: 'Use local evidence and explain what ruling at distance required.',
    modules: [
      { id: 'module.akkad.local-check', type: 'prompt', promptId: 'prompt.akkad.local-arrangements', claimIds: ['claim.akkad.leilan-administration', 'claim.akkad.urkesh-relationship'], sourceIds: ['source.akkad.leilan', 'source.akkad.urkesh'] },
      { id: 'module.akkad.holding-check', type: 'prompt', promptId: 'prompt.akkad.holding-power', claimIds: ['claim.akkad.conquest-claims', 'claim.akkad.winning-and-governing'], sourceIds: ['source.akkad.sargon-inscription', 'source.akkad.leilan', 'source.akkad.urkesh'] },
    ],
  },
];

export const akkadLesson: Lesson = {
  id: lessonId, legacyAliases: [], status: 'draft',
  title: 'Akkad and the Problem of Empire', masthead: 'c. 2350–2150 BCE', place: 'Mesopotamia · present-day Iraq and neighboring regions',
  chronology: { startYear: -2350, endYear: -2150, display: 'c. 2350–2150 BCE', approximate: true },
  significance: 'Akkadian rulers claimed far-reaching victories, but keeping power across different cities depended on officials, supplies and local relationships.',
  learningOutcome: 'You explored why winning cities and governing them are different, and how local evidence can test a ruler’s claim.',
  orientationMapModuleId: 'module.akkad.locator',
  sectionIdsRequired: sections.map((section) => section.id), sections,
  claimIds: akkadClaims.map((claim) => claim.id), sourceIds: akkadSources.map((source) => source.id), mediaIds: akkadMedia.map((media) => media.id), promptIds: akkadPrompts.map((prompt) => prompt.id),
};

export const akkadContent: AuthoredContentModule = { sources: akkadSources, claims: akkadClaims, media: akkadMedia, lessons: [akkadLesson], prompts: akkadPrompts };
