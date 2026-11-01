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
  { id: 'source.akkad.sargon-retinue', title: 'RIME 2.01.01.11 composite, P461937', url: 'https://cdli.earth/artifacts/461937', publisher: 'Cuneiform Digital Library Initiative / RIME', accessedOn: '2026-09-23', licenseOrUse: 'Research citation and short attributed quotation; Sumerian version col. v lines 9–13 and 34–37 and Akkadian version col. vi lines 11–16 and 41–44 close-reviewed. Scholarly composite without an original findspot or image on the record.', reviewStatus: 'reviewed' },
  { id: 'source.akkad.possehl-meluhha', title: 'The Middle Asian Interaction Sphere', url: 'https://www.penn.museum/sites/expedition/the-middle-asian-interaction-sphere/', publisher: 'Gregory L. Possehl, Expedition magazine (2007), Penn Museum', accessedOn: '2026-09-23', licenseOrUse: 'Research citation for the identification of Dilmun, Magan and Meluhha; opening section on the Gulf trading lands close-reviewed. No image reuse.', reviewStatus: 'reviewed' },
  { id: 'source.akkad.smarthistory-stele', title: 'Victory Stele of Naram-Sin', url: 'https://smarthistory.org/victory-stele-of-naram-sin/', publisher: 'Dr. Beth Harris and Dr. Steven Zucker, Smarthistory', accessedOn: '2026-09-23', licenseOrUse: 'Research citation for the horned helmet as a sign of divinity, the depicted enemies and the stele’s removal by Shutruk-Nahhunte; transcript close-reviewed. No image or video reuse.', reviewStatus: 'reviewed' },
  { id: 'source.akkad.curse-etcsl', title: 'The cursing of Agade (ETCSL t.2.1.5), English translation', url: 'https://etcsl.orinst.ox.ac.uk/section2/tr215.htm', publisher: 'Electronic Text Corpus of Sumerian Literature, University of Oxford', accessedOn: '2026-09-23', licenseOrUse: 'Research citation and brief paraphrase of a later literary composition; lines 100–175 (temple attack and Gutians) and 272–281 (grass on the towpaths, closing praise) close-reviewed. Later tradition, not a record of events.', reviewStatus: 'reviewed' },
  { id: 'source.akkad.met-seal-use', title: 'Cylinder seal and modern impression: geometric design, 62.70.76', url: 'https://www.metmuseum.org/art/collection/search/325481', publisher: 'The Metropolitan Museum of Art', accessedOn: '2026-11-01', licenseOrUse: 'Research citation for how cylinder seals were used (mark of ownership or identification; impressed on clay closing jars, doors and baskets, or rolled onto tablets); catalogue text close-reviewed. Early Dynastic object, not Akkadian; no image used.', reviewStatus: 'reviewed' },
  { id: 'source.akkad.britannica-empire', title: 'Empire Definition & Meaning', url: 'https://www.britannica.com/dictionary/empire', publisher: 'Britannica Dictionary, Encyclopaedia Britannica, Inc.', accessedOn: '2026-11-01', licenseOrUse: 'Research citation for the everyday meaning of “empire” (lands or regions controlled by one ruler or government) in the term definition; definition 1 close-reviewed. No text reproduced beyond paraphrase.', reviewStatus: 'reviewed' },
  { id: 'source.akkad.britannica-mesopotamia', title: 'History of Mesopotamia', url: 'https://www.britannica.com/place/Mesopotamia-historical-region-Asia', publisher: 'Encyclopaedia Britannica, Inc.', accessedOn: '2026-11-01', licenseOrUse: 'Research citation for the meaning and extent of Mesopotamia (land between the Tigris and Euphrates; now eastern Syria, southeastern Turkey and most of Iraq); opening section close-reviewed.', reviewStatus: 'reviewed' },
  { id: 'source.akkad.curse-cdli', title: 'CDLI Literary 000375 (Curse of Agade) composite, P469679', url: 'https://cdli.earth/artifacts/469679', publisher: 'Cuneiform Digital Library Initiative, after J. S. Cooper, The Curse of Agade (1983)', accessedOn: '2026-09-23', licenseOrUse: 'Research citation for the Old Babylonian date (c. 1900–1600 BCE) and multi-site witnesses of the poem; record metadata close-reviewed.', reviewStatus: 'reviewed' },
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
  { id: 'claim.akkad.agade-quay', statement: 'A Sargon inscription says boats of Meluhha, Magan and Dilmun were tied up at the quay of Agade.', kind: 'observation', certainty: 'high', sourceIds: ['source.akkad.sargon-retinue'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.trade-places', statement: 'Scholars identify Meluhha with the Indus civilization, Magan with present-day Oman and nearby areas, and Dilmun with Bahrain and the nearby Arabian shore.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.akkad.possehl-meluhha'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.sea-to-sea', statement: 'Sargon’s inscription says the god Enlil gave him the land from the Upper Sea to the Lower Sea.', kind: 'observation', certainty: 'high', sourceIds: ['source.akkad.sargon-inscription'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.bread-boast', statement: 'A Sargon inscription says 5,400 men ate bread before him daily.', kind: 'observation', certainty: 'high', sourceIds: ['source.akkad.sargon-retinue'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.leilan-walls', statement: 'The Akkadian administrative building at Tell Leilan had walls up to 6.6 meters thick; its grain-processing rooms held ovens mostly 1 to 3 meters across, and plant residue from the work covered every floor.', kind: 'observation', certainty: 'high', sourceIds: ['source.akkad.leilan'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.leilan-official', statement: 'The Akkadian conquest displaced Leilan’s local elite, and sealings show an Akkadian šabra official directing agricultural and construction projects.', kind: 'interpretation', certainty: 'moderate', sourceIds: ['source.akkad.leilan'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.barley-ration', statement: 'Akkadian administrative texts set two sila of barley, roughly two liters, as a laborer’s standard daily ration.', kind: 'observation', certainty: 'high', sourceIds: ['source.akkad.leilan'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.leilan-schoolroom', statement: 'A schoolroom at Leilan held round tablets with a few practice signs in Old Akkadian script, perhaps used to train local officials.', kind: 'interpretation', certainty: 'moderate', sourceIds: ['source.akkad.leilan'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.leilan-unfinished', statement: 'The last Akkadian building project at Leilan was abandoned before completion, with basalt boulders left several meters from a partly built wall; by no later than about 2140 BCE Tell Leilan lay in ruins.', kind: 'observation', certainty: 'high', sourceIds: ['source.akkad.leilan'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.urkesh-find', statement: 'In August 1999, on what was planned as the last day of work in that area of the Urkesh royal palace, excavators began finding the inscribed sealings; Tar’am-Agade’s small seal, about 3 cm high, had been rolled on clay closing a door in the palace of Urkesh’s Hurrian rulers.', kind: 'observation', certainty: 'high', sourceIds: ['source.akkad.urkesh'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.taram-name', statement: 'The name Tar’am-Agade means “She loves Akkad”; the excavators read it as a political statement.', kind: 'interpretation', certainty: 'moderate', sourceIds: ['source.akkad.urkesh'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.stele-details', statement: 'The limestone stele is about 2 meters tall; its inscription names victories over the Lullubi, and it shows Akkadian soldiers on a wooded mountain with Naram-Sin in a horned helmet.', kind: 'observation', certainty: 'high', sourceIds: ['source.akkad.louvre-stele', 'source.akkad.smarthistory-stele'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.horned-helmet', statement: 'In Akkadian art, a horned helmet was a sign of divinity.', kind: 'interpretation', certainty: 'high', sourceIds: ['source.akkad.smarthistory-stele'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.stele-booty', statement: 'In the twelfth century BCE the Elamite king Shutruk-Nahhunte took the stele from Sippar to Susa as war booty and had an inscription carved on its mountain saying so; excavators found it at Susa in 1898.', kind: 'observation', certainty: 'high', sourceIds: ['source.akkad.louvre-stele', 'source.akkad.smarthistory-stele'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.curse-of-agade', statement: 'The Curse of Agade, a Sumerian poem known from Old Babylonian copies made centuries after Naram-Sin, blames Agade’s ruin on his attack on Enlil’s temple and describes grass growing on the city’s canal towpaths.', kind: 'later-tradition', certainty: 'high', sourceIds: ['source.akkad.curse-etcsl', 'source.akkad.curse-cdli'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.stele-term', statement: 'A stele is an upright stone monument or marker, often carved with writing or pictures in relief.', kind: 'observation', certainty: 'high', sourceIds: ['source.akkad.smarthistory-stele'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.cylinder-seal-use', statement: 'Mesopotamian cylinder seals marked ownership or identity; they were pressed into clay closing jars, doors and baskets, or rolled onto clay tablets.', kind: 'observation', certainty: 'high', sourceIds: ['source.akkad.met-seal-use'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.empire-term', statement: 'An empire is a group of countries or regions controlled by one ruler or one government.', kind: 'observation', certainty: 'high', sourceIds: ['source.akkad.britannica-empire'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.mesopotamia-term', statement: 'Mesopotamia is the land between the Tigris and Euphrates rivers, now eastern Syria, southeastern Turkey and most of Iraq.', kind: 'observation', certainty: 'high', sourceIds: ['source.akkad.britannica-mesopotamia'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.lullubi', statement: 'The Lullubi were a mountain people who lived in the eastern region of Mesopotamia.', kind: 'observation', certainty: 'moderate', sourceIds: ['source.akkad.smarthistory-stele'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.susa-location', statement: 'Susa, where Shutruk-Nahhunte took the stele, is in what is now Iran.', kind: 'observation', certainty: 'high', sourceIds: ['source.akkad.smarthistory-stele'], reviewStatus: 'reviewed' },
  { id: 'claim.akkad.northern-sites', statement: 'Tell Leilan and Urkesh (Tell Mozan) lie close together on the Habur Plains of present-day northeastern Syria.', kind: 'observation', certainty: 'high', sourceIds: ['source.akkad.leilan', 'source.akkad.map-leilan', 'source.akkad.map-urkesh'], reviewStatus: 'reviewed' },
];

export const akkadPrompts: UnderstandingPrompt[] = [
  {
    id: 'prompt.akkad.urkesh-difference', bestOptionId: 'option.akkad.princess-seal', lessonId, kind: 'supported-selection', required: true,
    question: 'At Tell Leilan, an official sent by Akkad ran the farm work. What was different at Urkesh?',
    hint: 'Look back at the part about Urkesh. Whose name was on the clay in the palace?',
    explanation: 'At Leilan, Akkad pushed the city’s own rulers aside and put its own official in charge. Urkesh kept its own rulers, but a daughter of Akkad’s king used her seal in their palace, perhaps as the local king’s wife.',
    options: [
      { id: 'option.akkad.princess-seal', label: 'A princess from Akkad used her seal in the palace.', feedback: 'Yes. Urkesh kept its own rulers, and Tar’am-Agade, the daughter of Akkad’s king, used her seal in their palace.' },
      { id: 'option.akkad.governor-from-agade', label: 'Akkad made one of its own people governor of the city.', feedback: 'Sargon made his own people governors of some cities. Look back at the part about Urkesh: who still ruled it?' },
      { id: 'option.akkad.soldiers-palace', label: 'Soldiers from Akkad moved into the palace to guard it.', feedback: 'Look back at the part about Urkesh. What did the excavators dig up in the palace?' },
    ],
  },
  {
    id: 'prompt.akkad.staying-in-charge', lessonId, kind: 'concise-explanation', required: true, minimumResponseLength: 20,
    question: 'Akkad’s army could win a city in a single battle. Why was staying in charge of a city like Tell Leilan so much more work? Write one or two sentences, using one thing you read about Leilan.',
    hint: 'Start with: “After the battle, Akkad’s official at Leilan still had to…”',
    explanation: 'A strong answer says that winning took one battle, but staying in charge took work every day: an Akkadian official directing the farm work, ovens turning grain into food, a ration of barley for every worker, and people keeping records. One detail from Leilan is enough.',
  },
];

const sections: Lesson['sections'] = [
  {
    id: 'section.akkad.place-and-question', heading: 'Akkad in Mesopotamia', purpose: 'Locate the lesson and make the distinction between conquering and governing concrete.',
    modules: [
      { id: 'module.akkad.opening-question', type: 'prose', claimIds: ['claim.akkad.agade-quay', 'claim.akkad.trade-places', 'claim.akkad.capital-location'], sourceIds: ['source.akkad.sargon-retinue', 'source.akkad.possehl-meluhha', 'source.akkad.capital-review'], body: '[[Sargon]], king of Akkad, wanted everyone to know how far his power reached. His scribes wrote down his boasts for others to read. One boast says that boats from lands as far away as the Indus Valley, Oman and Bahrain were tied up at the docks of [[Agade]], his capital.\n\nArchaeologists would love to stand on those docks. Nobody knows where they are. Agade, the city that gave the kingdom of Akkad its name, has never been found for certain.' },
      akkadLocatorVisual,
      { id: 'module.akkad.opening-context', type: 'prose', claimIds: ['claim.akkad.period', 'claim.akkad.capital-location', 'claim.akkad.winning-and-governing', 'claim.akkad.empire-term'], sourceIds: ['source.akkad.met-period', 'source.akkad.capital-review', 'source.akkad.sargon-inscription', 'source.akkad.leilan', 'source.akkad.britannica-empire'], body: 'Agade stood somewhere in [[Mesopotamia]], in present-day Iraq. Between about 2350 and 2150 BCE, Sargon and the kings after him, such as [[Naram-Sin]], claimed to rule cities that had long ruled themselves. When one ruler claims power over many lands and peoples like this, historians call it an [[empire]].\n\nWinning those cities was the easy part. A battle could be won in a day. Staying in charge after the army went home took officials, food and the help of local people, day after day. This lesson goes to two cities far to the north to see how Akkad did it.' },
    ],
  },
  {
    id: 'section.akkad.conquest-claims', heading: 'Sargon’s conquest claims', purpose: 'Attribute a royal account and distinguish a reported victory from durable control.',
    modules: [
      { id: 'module.akkad.sargon-claims', type: 'prose', claimIds: ['claim.akkad.conquest-claims', 'claim.akkad.sea-to-sea', 'claim.akkad.bread-boast', 'claim.akkad.winning-and-governing'], sourceIds: ['source.akkad.sargon-inscription', 'source.akkad.sargon-retinue'], body: 'Copies of [[Sargon’s]] boasts survive, written down by ancient scribes. What they say is loud. Sargon defeated old cities such as Uruk and Ur, each with its own gods and kings. The god Enlil, the inscription says, gave him the land from one sea to the other. And his own people from Agade were made governors, running those cities for him.\n\nAnother inscription adds a boast about food: 5,400 men ate bread in front of him every day. The number is a boast, but it points at a real problem. Bread for 5,400 people meant grain grown, carried, ground and baked by someone, every day.\n\nThese boasts are Sargon’s side of the story: what he wanted people to remember. To see what happened in a city after the soldiers left, archaeologists dig in the cities themselves.' },
    ],
  },
  {
    id: 'section.akkad.leilan-administration', heading: 'Governing at Tell Leilan', purpose: 'Show administrative buildings, grain and records as continued work behind distant rule.',
    modules: [
      { id: 'module.akkad.leilan', type: 'prose', claimIds: ['claim.akkad.leilan-administration', 'claim.akkad.leilan-official', 'claim.akkad.leilan-walls', 'claim.akkad.barley-ration', 'claim.akkad.leilan-schoolroom', 'claim.akkad.leilan-work'], sourceIds: ['source.akkad.leilan'], body: 'Far to the north of Uruk, on the plains of present-day Syria, the archaeologists digging at [[Tell Leilan]] found what staying in charge looked like on the ground. After Akkad conquered the city, its own ruling families were pushed aside. Clay sealings, lumps of clay stamped with an official’s seal, show an Akkadian official, called a [[šabra]], now directing farm work and building projects. At the center stood a building with walls as much as 6.6 meters thick.\n\nMuch of the work inside was about grain. Room after room held ovens, many of them 1 to 3 meters across, used so heavily that a fine layer of leftover plant bits from the grain covered every floor. Akkadian records say each worker got about two liters of barley, a grain, every day. Multiply that by every worker, every day, and you see why the official needed a building like this. Across the street, a schoolroom held clay tablets with a little practice writing on them. The excavators think it may have trained local officials to keep the new records.\n\nAt Leilan, staying in charge meant putting an Akkadian official over the city and feeding its workers, every single day.' },
      { id: 'module.akkad.leilan-work', type: 'knowledge', eyebrow: 'Who did the work', title: 'Who did the work', body: 'Holding Leilan was daily work, done by many hands. Most of them belonged to farmers and workers whose names nobody wrote down.', claimIds: ['claim.akkad.leilan-work', 'claim.akkad.leilan-walls', 'claim.akkad.leilan-official'], sourceIds: ['source.akkad.leilan'], items: [
        { label: 'Grow and bring grain', detail: 'Farmers raised the barley, and someone carried it in.' },
        { label: 'Process and bake', detail: 'Rooms of large ovens turned it into food, day after day.' },
        { label: 'Record and seal', detail: 'Scribes kept tablets; officials sealed clay to track goods and orders.' },
      ] },
    ],
  },
  {
    id: 'section.akkad.urkesh-ties', heading: 'A royal connection at Urkesh', purpose: 'Use a named woman and local sealings to compare forms of imperial presence.',
    modules: [
      { id: 'module.akkad.urkesh', type: 'prose', claimIds: ['claim.akkad.northern-sites', 'claim.akkad.urkesh-find', 'claim.akkad.taram-sealings', 'claim.akkad.taram-name'], sourceIds: ['source.akkad.urkesh', 'source.akkad.leilan', 'source.akkad.map-leilan', 'source.akkad.map-urkesh'], body: 'Not far from [[Leilan]], the city of [[Urkesh]] tells a different story. Urkesh kept its own rulers. In August 1999, on what was meant to be the last day of digging in one part of their royal palace, excavators began finding lumps of clay stamped with writing. They kept digging. The marks named [[Tar’am-Agade]], daughter of [[Naram-Sin]], king of Akkad. Her name means “She loves Akkad.”\n\nThe marks came from her small [[cylinder seal]], about 3 centimeters high, rolled across clay that closed a door in the palace.' },
      akkadSealExampleVisual,
      { id: 'module.akkad.urkesh-limits', type: 'prose', claimIds: ['claim.akkad.taram-sealings', 'claim.akkad.urkesh-relationship'], sourceIds: ['source.akkad.urkesh'], body: 'Why was a princess from Akkad sealing doors in another king’s palace? The excavators think she was queen of Urkesh, married to its ruler, so the two royal families were joined by marriage. They also weigh another idea: that she served as a priestess beside an official from Akkad. Either way, Akkad’s royal family had one of its own inside the palace at Urkesh.\n\nSo Akkad’s kings reached into different cities in different ways. Leilan got an Akkadian official. Urkesh got a princess.' },
    ],
  },
  {
    id: 'section.akkad.naram-sin-stele', heading: 'Naram-Sin’s victory stele', purpose: 'Show how Naram-Sin had himself carved as god-like, and how a later king carried the stone off to boast about himself.',
    modules: [
      { id: 'module.akkad.stele-intro', type: 'prose', claimIds: ['claim.akkad.stele-term', 'claim.akkad.stele-image', 'claim.akkad.stele-details', 'claim.akkad.horned-helmet', 'claim.akkad.lullubi'], sourceIds: ['source.akkad.louvre-stele', 'source.akkad.smarthistory-stele'], body: 'Look closely at the carving below. It is a [[stele]], a tall carved stone, made to celebrate [[Naram-Sin’s]] victory over the [[Lullubi]], a mountain people. His soldiers climb a wooded mountain. Below them, their enemies fall, flee or lie beneath the king’s feet. Above them all stands Naram-Sin, larger than anyone else, wearing a horned helmet, which in Akkadian art was a sign of the gods.' },
      akkadSteleVisual,
      { id: 'module.akkad.stele-limits', type: 'prose', claimIds: ['claim.akkad.stele-image', 'claim.akkad.horned-helmet', 'claim.akkad.stele-booty', 'claim.akkad.susa-location'], sourceIds: ['source.akkad.louvre-stele', 'source.akkad.smarthistory-stele'], body: 'The king’s message was clear: this victory made him more than a man. Anyone who stood before the stone saw a king who looked like a god. The Lullubi appear only as the people beneath his feet; no account of their own survives. This is winning the way a king wanted it seen: one great moment, with the king on top. The ovens at Leilan tell the other half of the story.\n\nThe stone kept boasting long after Naram-Sin was gone. About a thousand years later, [[Shutruk-Nahhunte]], a king of Elam, in present-day Iran, carried it home as war booty and had his own words carved onto the mountain, saying he had taken it. Naram-Sin’s boast became Shutruk-Nahhunte’s boast too.' },
    ],
  },
  {
    id: 'section.akkad.regional-change', heading: 'How Akkad’s power ended', purpose: 'Show that Akkadian power came apart in different ways in different places, and how people later remembered its fall.',
    modules: [
      { id: 'module.akkad.regional-change', type: 'prose', claimIds: ['claim.akkad.leilan-unfinished', 'claim.akkad.uneven-change', 'claim.akkad.drought-limits', 'claim.akkad.curse-of-agade', 'claim.akkad.winning-and-governing', 'claim.akkad.capital-location'], sourceIds: ['source.akkad.leilan', 'source.akkad.weiss', 'source.akkad.isotopes', 'source.akkad.curse-etcsl', 'source.akkad.curse-cdli', 'source.akkad.capital-review'], body: 'Akkadian power did not last. At [[Tell Leilan]], the last Akkadian building project, a large building on stone foundations, was never finished. Excavators found big stone blocks lying a few meters from a half-built wall, where the builders had left them. By about 2140 BCE, Leilan lay in ruins.\n\nWhy did places like Leilan empty out? Nobody knows for sure. Some researchers think a drier climate ruined farms that depended on rain. Others point to nearby towns where people went on living and eating much as before in those same years, which makes dry weather look like only part of the answer. The answer was probably different from one place to the next.\n\nPeople in Mesopotamia wanted an explanation too. Centuries later, scribes copied a poem now called the Curse of Agade. In it, [[Naram-Sin]] attacks the temple of the god Enlil, and the angry gods send invaders and curse his city until grass grows long on the paths beside its canals. The poem was written long after Naram-Sin’s time, so it shows how people remembered Akkad’s fall: as the gods punishing Naram-Sin for attacking their temple.\n\n[[Sargon’s]] boasts made winning sound like the whole story. Staying in charge took officials and ovens, barley and a princess far from home, and it worked differently in each city. [[Agade]] itself, the city that gave the empire its name, is still waiting to be found.' },
    ],
  },
  {
    id: 'section.akkad.understanding', heading: 'Explain Akkadian rule', purpose: 'Use local evidence and explain what ruling at distance required.',
    modules: [
      { id: 'module.akkad.local-check', type: 'prompt', promptId: 'prompt.akkad.urkesh-difference', claimIds: ['claim.akkad.leilan-official', 'claim.akkad.urkesh-find', 'claim.akkad.taram-sealings', 'claim.akkad.urkesh-relationship'], sourceIds: ['source.akkad.leilan', 'source.akkad.urkesh'] },
      { id: 'module.akkad.holding-check', type: 'prompt', promptId: 'prompt.akkad.staying-in-charge', claimIds: ['claim.akkad.winning-and-governing', 'claim.akkad.leilan-official', 'claim.akkad.leilan-administration', 'claim.akkad.barley-ration'], sourceIds: ['source.akkad.sargon-inscription', 'source.akkad.leilan', 'source.akkad.urkesh'] },
    ],
  },
];

const placeSection = 'section.akkad.place-and-question';
const claimsSection = 'section.akkad.conquest-claims';
const leilanSection = 'section.akkad.leilan-administration';
const urkeshSection = 'section.akkad.urkesh-ties';
const steleSection = 'section.akkad.naram-sin-stele';

export const akkadTerms: NonNullable<Lesson['terms']> = [
  { id: 'term.akkad.sargon', label: 'Sargon', aliases: ['Sargon’s'], kind: 'person', featured: true, primarySectionId: claimsSection,
    gloss: 'King of Akkad who boasted of conquering cities',
    definition: 'King of Akkad, ruling from Agade. His inscriptions boast that he beat old cities such as Uruk and Ur and put men from Agade in charge.',
    claimIds: ['claim.akkad.conquest-claims'], sourceIds: ['source.akkad.sargon-inscription'] },
  { id: 'term.akkad.naram-sin', label: 'Naram-Sin', aliases: ['Naram-Sin’s'], kind: 'person', featured: true, primarySectionId: steleSection,
    gloss: 'A later king of Akkad, shown on the stele',
    definition: 'A later king of Akkad. His victory stele shows him in a horned helmet, a sign of the gods, and his daughter’s seal turns up at Urkesh.',
    claimIds: ['claim.akkad.stele-details', 'claim.akkad.horned-helmet', 'claim.akkad.taram-sealings'], sourceIds: ['source.akkad.louvre-stele', 'source.akkad.smarthistory-stele', 'source.akkad.urkesh'] },
  { id: 'term.akkad.taram-agade', label: 'Tar’am-Agade', aliases: ['Tar’am-Agade’s'], kind: 'person', featured: true, primarySectionId: urkeshSection,
    gloss: 'A princess of Akkad, named on clay at Urkesh',
    definition: 'A daughter of King Naram-Sin, whose name means “She loves Akkad.” Her seal was rolled on clay that closed a door in the palace at Urkesh.',
    claimIds: ['claim.akkad.taram-sealings', 'claim.akkad.urkesh-find', 'claim.akkad.taram-name'], sourceIds: ['source.akkad.urkesh'] },
  { id: 'term.akkad.shutruk-nahhunte', label: 'Shutruk-Nahhunte', kind: 'person', primarySectionId: steleSection,
    definition: 'A king of Elam who, in the 1100s BCE, carried Naram-Sin’s stele off to Susa, in what is now Iran, as war booty.',
    claimIds: ['claim.akkad.stele-booty', 'claim.akkad.susa-location'], sourceIds: ['source.akkad.louvre-stele', 'source.akkad.smarthistory-stele'] },
  { id: 'term.akkad.lullubi', label: 'Lullubi', kind: 'people', primarySectionId: steleSection,
    definition: 'A mountain people who lived east of Mesopotamia. Naram-Sin’s stele celebrates beating them, and shows them falling before his army.',
    claimIds: ['claim.akkad.lullubi', 'claim.akkad.stele-details', 'claim.akkad.stele-image'], sourceIds: ['source.akkad.smarthistory-stele', 'source.akkad.louvre-stele'] },
  { id: 'term.akkad.agade', label: 'Agade', kind: 'place', featured: true, primarySectionId: placeSection,
    gloss: 'The Akkadian kings’ capital, never found',
    definition: 'The capital city of Sargon and the kings after him. Ancient writings name it, but nobody has found where it was.',
    claimIds: ['claim.akkad.capital-location', 'claim.akkad.conquest-claims'], sourceIds: ['source.akkad.capital-review', 'source.akkad.sargon-inscription'] },
  { id: 'term.akkad.mesopotamia', label: 'Mesopotamia', kind: 'place', primarySectionId: placeSection,
    definition: 'The land between the Tigris and Euphrates rivers. Today it is mostly in Iraq, with parts in Syria and Turkey.',
    claimIds: ['claim.akkad.mesopotamia-term'], sourceIds: ['source.akkad.britannica-mesopotamia'] },
  { id: 'term.akkad.tell-leilan', label: 'Tell Leilan', aliases: ['Leilan'], kind: 'place', featured: true, primarySectionId: leilanSection,
    gloss: 'Northern city where an Akkadian official took charge',
    definition: 'An ancient city in present-day northeastern Syria. Under Akkadian rule it had a thick-walled building full of ovens, sealings and tablets.',
    claimIds: ['claim.akkad.northern-sites', 'claim.akkad.leilan-administration', 'claim.akkad.leilan-walls'], sourceIds: ['source.akkad.leilan', 'source.akkad.map-leilan'] },
  { id: 'term.akkad.urkesh', label: 'Urkesh', kind: 'place', featured: true, primarySectionId: urkeshSection,
    gloss: 'Northern city that kept its own rulers',
    definition: 'An ancient city near Tell Leilan that kept its own kings. Clay marks found in its palace name Tar’am-Agade, a princess from Akkad.',
    claimIds: ['claim.akkad.northern-sites', 'claim.akkad.urkesh-find', 'claim.akkad.taram-sealings'], sourceIds: ['source.akkad.urkesh', 'source.akkad.map-urkesh'] },
  { id: 'term.akkad.empire', label: 'empire', kind: 'word', featured: true, primarySectionId: placeSection,
    gloss: 'Many lands ruled by one ruler or government',
    definition: 'A group of lands or peoples controlled by one ruler or one government.',
    claimIds: ['claim.akkad.empire-term'], sourceIds: ['source.akkad.britannica-empire'] },
  { id: 'term.akkad.stele', label: 'stele', kind: 'word', featured: true, primarySectionId: steleSection,
    gloss: 'A tall carved stone set up to be seen',
    definition: 'A tall stone slab set upright, often carved with writing or pictures. Naram-Sin’s stele shows him winning a battle.',
    claimIds: ['claim.akkad.stele-term', 'claim.akkad.stele-image'], sourceIds: ['source.akkad.smarthistory-stele', 'source.akkad.louvre-stele'] },
  { id: 'term.akkad.cylinder-seal', label: 'cylinder seal', kind: 'word', primarySectionId: urkeshSection,
    definition: 'A small carved stone cylinder. Rolled across wet clay, it left a picture that showed whose it was, on jars, doors or tablets.',
    claimIds: ['claim.akkad.cylinder-seal-use'], sourceIds: ['source.akkad.met-seal-use'] },
  { id: 'term.akkad.sabra', label: 'šabra', kind: 'word', primarySectionId: leilanSection,
    definition: 'An official who worked for the Akkadian kings. At Tell Leilan, sealings show a šabra directing farm work and building projects.',
    claimIds: ['claim.akkad.leilan-official'], sourceIds: ['source.akkad.leilan'] },
];

export const akkadLesson: Lesson = {
  id: lessonId, legacyAliases: [], status: 'published',
  title: 'Akkad and the Problem of Empire', masthead: 'c. 2350–2150 BCE', place: 'Mesopotamia · present-day Iraq and neighboring regions',
  chronology: { startYear: -2350, endYear: -2150, display: 'c. 2350–2150 BCE', approximate: true },
  significance: 'Akkadian rulers claimed far-reaching victories, but keeping power across different cities depended on officials, supplies and local relationships.',
  learningOutcome: 'You explored why winning cities and governing them are different, and how local evidence can test a ruler’s claim.',
  orientationMapModuleId: 'module.akkad.locator',
  sectionIdsRequired: sections.map((section) => section.id), sections,
  claimIds: akkadClaims.map((claim) => claim.id), sourceIds: akkadSources.map((source) => source.id), mediaIds: akkadMedia.map((media) => media.id), promptIds: akkadPrompts.map((prompt) => prompt.id),
  terms: akkadTerms,
};

export const akkadContent: AuthoredContentModule = { sources: akkadSources, claims: akkadClaims, media: akkadMedia, lessons: [akkadLesson], prompts: akkadPrompts };
