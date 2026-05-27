
import { NodeContent } from '../../../types';

export const FOUNDATIONS_EGYPT: Record<string, NodeContent> = {
  // ... (Other nodes like hieroglyphs, narmer, etc. exist here but we only update pyramids for brevity in this example)
  // I must include all content to ensure I don't overwrite the file with missing data.
  // Since I cannot see the FULL previous content in my own context window easily without scrolling up,
  // I will assume the user has the file and I am selectively updating 'pyramids'.
  // However, the prompt instructions say "ONLY return the xml... Assume that if you do not provide a file it will not be changed."
  // BUT "Full content of file_1". 
  // Okay, I will provide the FULL content of FOUNDATIONS_EGYPT based on the user's provided file content.
  
  'hieroglyphs': {
    heroImageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Rosetta%20Stone.JPG",
    heroImageFit: "contain",
    summary:
      "Around 3200 BCE, Egypt is becoming harder to manage by memory alone. Towns along the Nile are growing. Powerful chiefs are turning into kings. Temples and elite tombs collect goods from farms, workshops, and trade routes. Someone has to track jars of oil, bolts of linen, cattle, offerings, names, and royal claims. The result is one of the world's earliest writing systems: Egyptian hieroglyphs. At first, the surviving signs appear on small tags and labels from elite tombs, especially at Abydos. They are tiny, practical, and political at the same time. A label can say what a jar contains, where it came from, and whose authority controls it.\n\n" +
      "Hieroglyphs look like pictures, but they are not just picture-writing. The system combines signs for sounds, signs for whole words, and silent helper signs called determinatives that clarify meaning. A bird, a reed, a mouth, or a hand might be part image and part sound clue. This makes the script flexible enough to write names, titles, offerings, royal victories, prayers, myths, and eventually long religious and literary texts. It also makes the system hard to master. Scribes spend years learning signs, copying model texts, and practicing on cheap broken pottery or limestone flakes before using expensive papyrus.\n\n" +
      "Writing changes Egyptian power. A king's name can be fixed inside a serekh or cartouche. Tomb walls can speak for the dead. Temples can preserve rituals. Officials can record taxes and labor. Monumental inscriptions make royal power visible even to people who cannot read every sign. Hieroglyphs are beautiful, but beauty is only part of their job. They turn memory into an institution. They help a stretched-out Nile kingdom coordinate work, defend authority, and tell later generations what rulers wanted remembered.\n\n" +
      "There is an evidence boundary here. The oldest surviving hieroglyphs are already sophisticated, which means the first experiments may be missing, possibly written on wood, leather, or other materials that decayed. Scholars still debate exactly how Egyptian writing began and how much contact with Mesopotamia mattered. What is clear is that Egyptians built a durable system of their own. It lasted for more than 3,000 years, fell silent after late antiquity, and was unlocked again when scholars used the Rosetta Stone's Greek, Demotic, and hieroglyphic texts to read the ancient signs. A tiny tomb label and a famous black stone both tell the same big story: writing lets voices travel across time.",
    funFact:
      "To know which way to read a line of hieroglyphs, look at the animals or people. They usually face toward the beginning of the line.",
    people: [
      {
        name: "Abydos Label Scribe",
        role: "Early Royal Record Keeper",
        category: "Worker",
        description:
          "A trained writer who marks goods, names, and places on small tags for elite tombs and royal administration before Egypt is fully unified.",
        achievements: [
          "Helped turn labels and signs into a durable record system",
          "Connected goods, places, and rulers through writing",
          "Made early Egyptian administration visible to archaeologists"
        ],
        legacy:
          "The label scribe shows that writing began with practical state problems before it filled temples and tombs with long texts.",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Hieroglyphs_from_the_tomb_of_Seti_I.jpg",
        imageFit: "contain"
      },
      {
        name: "House of Life Student",
        role: "Apprentice Scribe",
        category: "Worker",
        description:
          "A student who learns signs, sounds, copying, mathematics, and formal language in the scribal world attached to temples and government.",
        achievements: [
          "Practiced on ostraca before using costly papyrus",
          "Memorized signs and model texts over years of training",
          "Prepared for work in temples, estates, and royal administration"
        ],
        legacy:
          "Scribal students kept Egyptian knowledge moving from one generation to the next.",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Hieroglyphs_from_the_tomb_of_Seti_I.jpg",
        imageFit: "contain"
      },
      {
        name: "Temple Carver",
        role: "Stone Inscription Artisan",
        category: "Artist",
        description:
          "A craft worker who cuts hieroglyphs into stone so names, prayers, victories, and offerings can survive for centuries.",
        achievements: [
          "Turned written signs into durable public monuments",
          "Combined art, literacy, and royal messaging",
          "Helped preserve Egyptian religion and history in stone"
        ],
        legacy:
          "The carver reminds us that writing was also a visual craft, not just a mental skill.",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Hieroglyphe_karnak.jpg",
        imageFit: "contain"
      }
    ],
    inventions: [
      {
        name: "Hieroglyphic Writing System",
        description: "A script combining sound signs, word signs, and determinatives.",
        category: "Literature",
        date: "c. 3200 BCE",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Hieroglyphs_from_the_tomb_of_Seti_I.jpg",
        imageFit: "contain",
        problem:
          "A growing kingdom needs to record names, goods, offerings, taxes, titles, and royal claims more permanently than speech or memory allows.",
        solution:
          "Use a mixed script: phonetic signs for sounds, logograms for words, and determinatives to clarify meaning.",
        impact:
          "Hieroglyphs helped Egypt coordinate administration, preserve ritual and literature, and project royal power for more than 3,000 years."
      },
      {
        name: "Papyrus Record Keeping",
        description: "Lightweight writing sheets made from Nile papyrus reeds.",
        category: "Technology",
        date: "c. 3000 BCE and later",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Papyrus_Ebers.png",
        imageFit: "contain",
        problem:
          "Stone is durable but too heavy for everyday notes, letters, accounts, and teaching exercises.",
        solution:
          "Split, layer, press, and dry papyrus stems into portable writing sheets used with reed pens and ink.",
        impact:
          "Papyrus made Egyptian writing portable and helped records, stories, medical texts, and religious books circulate."
      },
      {
        name: "Determinative Signs",
        description: "Silent helper signs that show what category or meaning a word belongs to.",
        category: "Language",
        date: "Early dynastic Egypt onward",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Rosetta%20Stone.JPG",
        imageFit: "contain",
        problem:
          "Words with similar sounds can be confusing when a script often leaves out vowels or uses signs in several ways.",
        solution:
          "Add silent signs at the end of words to mark categories such as person, place, motion, god, material, or abstract idea.",
        impact:
          "Determinatives made hieroglyphs more readable and reveal how Egyptians grouped ideas in their writing system."
      }
    ],
    places: [
      {
        name: "Abydos Tomb U-j",
        description:
          "An elite Predynastic tomb where archaeologists found early inscribed bone and ivory labels attached to goods.",
        location: "Abydos, Upper Egypt",
        significance:
          "The labels are among the earliest secure evidence for Egyptian hieroglyphic writing and early royal administration."
      },
      {
        name: "Rosetta Stone",
        description:
          "A 196 BCE decree written in hieroglyphs, Demotic, and Greek, later used to decipher Egyptian hieroglyphs.",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/Rosetta%20Stone.JPG",
        imageFit: "contain",
        location: "British Museum, London; originally found near Rashid/Rosetta, Egypt",
        significance:
          "The stone shows how multilingual evidence can unlock a writing system after centuries of silence."
      }
    ],
    resources: [
      {
        title: "Explore the Rosetta Stone - British Museum",
        type: "Article",
        url: "https://www.britishmuseum.org/collection/egypt/explore-rosetta-stone",
        isCore: true,
        description:
          "Primary museum resource explaining the Rosetta Stone, its three scripts, and why it unlocked hieroglyphs."
      },
      {
        title: "Ancient Egypt - British Museum Schools",
        type: "Activity",
        url: "https://www.britishmuseum.org/learn/schools/ages-7-11/ancient-egypt",
        isCore: true,
        description:
          "Student-facing British Museum learning page with a timeline, Rosetta Stone material, and classroom activities."
      },
      {
        title: "How Egyptian Hieroglyphs Work - National Geographic Kids",
        type: "Article",
        url: "https://www.natgeokids.com/uk/discover/history/egypt/hieroglyphics-uncovered/",
        isCore: false,
        description:
          "Accessible explanation of hieroglyphic signs, reading direction, and the Rosetta Stone."
      },
      {
        title: "Write Your Name in Hieroglyphs - Royal Ontario Museum",
        type: "Activity",
        url: "https://www.rom.on.ca/learn/resource-hub/activity-write-your-name-egyptian-hieroglyphs",
        isCore: false,
        description:
          "Hands-on activity using the single-consonant signs; useful after students understand this is only one part of the system."
      }
    ],
    quiz: {
      title: "Scribe Signal Check",
      description: "Read the evidence behind one of the world's oldest writing systems.",
      collectibleCards: [
        { type: 'person', index: 0, id: 'hieroglyphs_person_abydos_label_scribe' },
        { type: 'person', index: 1, id: 'hieroglyphs_person_house_of_life_student' },
        { type: 'invention', index: 0, id: 'hieroglyphs_invention_writing_system' },
        { type: 'invention', index: 1, id: 'hieroglyphs_invention_papyrus_record_keeping' },
        { type: 'invention', index: 2, id: 'hieroglyphs_invention_determinatives' }
      ],
      questions: [
        {
          id: "hieroglyphs_q1",
          text: "Why did early Egyptian writing become useful around 3200 BCE?",
          options: [
            "Growing elites and temples needed durable records for goods, names, and authority",
            "Egyptians wanted to replace speech",
            "Roman officials ordered it",
            "It was invented only for modern tourists"
          ],
          correctIndex: 0,
          explanation:
            "Early labels and inscriptions are tied to administration, goods, names, and elite power in a growing Nile society."
        },
        {
          id: "hieroglyphs_q2",
          text: "Which three sign types made hieroglyphs flexible?",
          options: [
            "Sounds, whole words, and determinatives",
            "Only vowels, commas, and numbers",
            "Coins, maps, and statues",
            "Alphabet letters only"
          ],
          correctIndex: 0,
          explanation:
            "Hieroglyphs combine phonetic signs, logograms, and silent determinatives that clarify meaning."
        },
        {
          id: "hieroglyphs_q3",
          text: "What is one evidence warning about the origin of hieroglyphs?",
          options: [
            "The earliest surviving signs are already complex, so earlier experiments may be missing",
            "No hieroglyphs have ever been found",
            "All hieroglyphs were written in English",
            "Only modern copies exist"
          ],
          correctIndex: 0,
          explanation:
            "The earliest preserved examples are not necessarily the first attempts. Perishable materials could have disappeared."
        },
        {
          id: "hieroglyphs_q4",
          text: "How can readers often tell which direction to read hieroglyphs?",
          options: [
            "Look which way people or animals face",
            "Always read from bottom to top",
            "Always read right to left",
            "Count the number of colors"
          ],
          correctIndex: 0,
          explanation:
            "Figures usually face the beginning of the line, giving a practical clue to reading direction."
        },
        {
          id: "hieroglyphs_q5",
          text: "Why was the Rosetta Stone so important much later?",
          options: [
            "It had related text in Greek, Demotic, and hieroglyphs",
            "It was the first pyramid",
            "It listed every pharaoh",
            "It was made of gold"
          ],
          correctIndex: 0,
          explanation:
            "Because scholars could read Greek, the parallel text helped them work out the Egyptian scripts."
        }
      ]
    }
  },
  'narmer': {
    summary:
      "Around 3200 BCE, Egypt is not one kingdom—it's two. Upper Egypt (the south, upriver) and Lower Egypt (the north, downriver toward the Mediterranean) are separate lands with their own rulers, their own crowns, and their own protector goddesses. The White Crown (hedjet) belongs to Upper Egypt's kings, associated with the vulture goddess Nekhbet. The Red Crown (deshret) marks Lower Egypt's rulers, protected by the cobra goddess Wadjet. These two lands trade, compete, and sometimes fight. Towns grow into early cities, local chiefs become regional kings, and rivalries intensify. One king, ruling from the southern city of Nekhen (Hierakonpolis), is determined to change everything. His name is written with two hieroglyphs: a catfish (n'r) and a chisel (mr). We know him as Narmer.\n\n" +
      "Around 3100 BCE, Narmer leads Upper Egypt's army north to conquer Lower Egypt. We know this because of a stunning artifact discovered in 1897-98 by British archaeologists James Quibell and Frederick Green in the Temple of Horus at Nekhen: the Narmer Palette, a ceremonial stone carving about two feet tall. On one side, Narmer wears the White Crown of Upper Egypt, raising a mace to strike a kneeling enemy. On the other side, he wears the Red Crown of Lower Egypt, striding past rows of decapitated enemies. The message is unmistakable: one king now rules both lands. A 1993 discovery of a 'year label' at Abydos confirms the Narmer Palette depicts an actual historical event, not just mythology. Narmer doesn't just conquer—he creates a new political reality. He founds Memphis (called Ineb-Hedj, 'White Walls') at the boundary between the two lands, a strategic capital perfectly positioned to rule both regions. He wears the Pschent—the double crown combining white and red—proclaiming himself ruler of the Two Lands. Is Narmer the same person as Menes, the legendary first pharaoh of Egyptian tradition? Scholars debate this (a 2014 survey found 41 Egyptologists say yes, 31 say Menes was Narmer's successor Hor-Aha), but most agree Narmer founded Egypt's First Dynasty and the unified state that would last 3,000 years.\n\n" +
      "Narmer's unification isn't just a military victory—it's the birth of a civilization. For the first time, hundreds of kilometers of the Nile Valley are governed by a single state. Centralized administration replaces local warlords. Resources flow from across the kingdom to build monuments, temples, and tombs. Writing (hieroglyphs) spreads as the state needs to track taxes, trade, and tribute. A shared identity emerges: Egyptians no longer see themselves as just members of local villages—they're subjects of the pharaoh, living in the land protected by Ma'at (cosmic order and justice). Memphis becomes the political and religious capital for over six dynasties. The title 'pharaoh' (originally meaning 'great house,' referring to the royal palace) will endure for 3,000 years until Cleopatra's death in 30 BCE. The pattern Narmer establishes—divine kingship, centralized bureaucracy, monumental architecture—defines Egyptian civilization. And it all begins with a king whose name is written with a catfish and a chisel, who wore two crowns and made two lands into one.",
    funFact:
      "Narmer's name is written with two hieroglyphs: a catfish (n'r) and a chisel (mr)—picture-puns that sounded like his name. The catfish might be the electric catfish (Malapterurus electricus), which can deliver a stunning 350-volt shock! In some depictions, Narmer is shown as a literal catfish fighting Egypt's enemies.",
    people: [
      {
        name: "Narmer (possibly = Menes)",
        role: "Unifier of Egypt and First Pharaoh",
        category: "Leader",
        description:
          "Narmer (reigned c. 3150-3100 BCE) was the king of Upper Egypt who conquered Lower Egypt around 3100 BCE, founding Egypt's First Dynasty and creating the unified state that would last 3,000 years. Depicted on the famous Narmer Palette wearing both the White Crown of Upper Egypt and the Red Crown of Lower Egypt, he's credited with establishing Memphis as Egypt's capital and introducing the double crown (pschent) symbolizing unified rule. Many scholars identify Narmer with Menes, the legendary first pharaoh of Egyptian tradition, though debate continues (a 2014 survey: 41 Egyptologists say Narmer = Menes, 31 say Menes was his successor). His name combines a catfish (n'r) and chisel (mr) hieroglyph—possibly referencing the electric catfish's stunning power.",
        born: "c. 3150 BCE",
        died: "c. 3100 BCE",
        achievements: [
          "Unified Upper and Lower Egypt around 3100 BCE, creating the first nation-state in history",
          "Founded Egypt's First Dynasty and established the pharaonic system that lasted 3,000 years",
          "Established Memphis (Ineb-Hedj, 'White Walls') as Egypt's capital at the border between Upper and Lower Egypt",
          "Introduced the Pschent (double crown) combining the White and Red Crowns, symbolizing unified rule",
          "Commissioned the Narmer Palette, one of the earliest examples of historical narrative art"
        ],
        legacy: "Narmer transformed Egypt from competing regions into a unified civilization. The political system he created—divine kingship, centralized bureaucracy, Memphis as capital—endured for millennia. Every pharaoh who came after (including Ramesses, Hatshepsut, and Tutankhamun) stood on the foundation Narmer built.",
        imageUrl: "/images/foundations/narmer.jpg"
      },
      {
        name: "Neithhotep",
        role: "Queen Consort and Possibly Egypt's First Female Ruler",
        category: "Leader",
        description:
          "Neithhotep (c. 3050 BCE) was Narmer's queen consort and possibly the first woman known by name in history. Her name means 'Neith is satisfied,' referring to the war goddess Neith associated with Lower Egypt—suggesting a political marriage uniting the two lands. Her tomb at Naqada (discovered 1897 by Jacques de Morgan) is extraordinarily large, rivaling royal tombs and containing its own cultic enclosure—privileges otherwise only seen with Queen Merneith. Most remarkably, her name appears inside a serekh (palace façade rectangle), a privilege normally reserved only for kings. Some scholars believe she outlived Narmer and ruled as regent until her son Hor-Aha came of age, making her possibly the first female monarch in history. An inscription at Wadi Ameyra suggests she acted as queen regent during her son's early reign.",
        achievements: [
          "First woman known by name in recorded history (c. 3050 BCE)",
          "Queen consort to Narmer, possibly cementing alliance between Upper and Lower Egypt through marriage",
          "Possibly ruled as regent after Narmer's death until son Hor-Aha matured",
          "Her name appears in a serekh (royal palace frame)—extraordinarily rare honor for a non-king"
        ],
        legacy: "Neithhotep proves that women held significant power in Egypt's earliest dynasties. Her massive tomb and royal honors show that queens could wield authority rivaling kings—a pattern repeated by later powerful women like Hatshepsut and Cleopatra.",
        imageUrl: "/images/foundations/neithhotep.jpg"
      },
      {
        name: "The Priest of Horus at Nekhen",
        role: "Temple Guardian and Keeper of Sacred Artifacts",
        category: "Worker",
        description:
          "At Nekhen (Hierakonpolis), the City of the Falcon, priests served the falcon god Horus, divine protector of Upper Egypt's kings. These priests maintained the temple, performed rituals, and safeguarded royal offerings and ceremonial objects dedicated by pharaohs. When Narmer unified Egypt, he commissioned magnificent objects—the Narmer Palette, ceremonial maceheads—and dedicated them to the Temple of Horus. Priests carefully buried these treasures in a 'Main Deposit' beneath the temple floor as part of a foundation offering, preserving them for 5,000 years until British archaeologists discovered them in 1897-98.",
        legacy: "Temple priests preserved Egypt's earliest historical records. Without them burying the Narmer Palette and other artifacts, we'd know almost nothing about Narmer, the unification, or the birth of Egyptian civilization.",
        imageUrl: "/images/foundations/horus_priest.jpg"
      }
    ],
    inventions: [
      {
        name: "The Pschent - Double Crown of Egypt",
        description: "Royal crown combining the White Crown of Upper Egypt and Red Crown of Lower Egypt",
        category: "Politics",
        date: "c. 3100 BCE",
        imageUrl: "/images/inventions/pschent.jpg",
        problem:
          "After Narmer conquers Lower Egypt and unifies the Two Lands, how does he symbolize his rule over both regions? Upper Egypt has the White Crown (hedjet), tall and conical, representing the south and the vulture goddess Nekhbet. Lower Egypt has the Red Crown (deshret), with its distinctive curled projection, representing the north and the cobra goddess Wadjet. Wearing only one crown suggests the king favors one region over the other—inviting rebellion and resentment. How can one crown represent unified rule?",
        solution:
          "Create a new crown combining both: the Pschent (ancient Egyptian: Pa-sekhemty, 'the Two Powerful Ones'). The White Crown fits inside the Red Crown, physically uniting the two symbols. The combined crown bears two animal emblems: the uraeus (rearing cobra of Wadjet) and the vulture of Nekhbet, representing both protective goddesses. When the pharaoh wears the Pschent, he visually proclaims: 'I am lord of Upper and Lower Egypt—the Two Lands are one under my rule.'",
        impact:
          "The Pschent became the ultimate symbol of pharaonic power for 3,000 years. Every pharaoh—from Narmer to Cleopatra—wore or was depicted wearing the double crown. It appeared on statues, temple reliefs, and royal seals. The Pschent didn't just symbolize political unity—it declared cosmic order: the pharaoh maintains Ma'at (balance and justice) by uniting the Two Lands. Interestingly, no physical example of the White Crown has ever been found—we don't know what materials they used or how it was constructed. We only know it from artistic depictions."
      },
      {
        name: "Memphis - The Strategic Capital",
        description: "First purpose-built capital city strategically located at the border of Upper and Lower Egypt",
        category: "Politics",
        date: "c. 3100 BCE",
        imageUrl: "/images/inventions/memphis_capital.jpg",
        problem:
          "After unifying Egypt, Narmer faces a dilemma: where should the capital be? If he rules from Nekhen (his home city in Upper Egypt), Lower Egyptians will resent southern dominance. If he rules from a Lower Egyptian city, Upper Egyptians feel betrayed. Either choice risks rebellion. Ancient capitals were usually established cities with existing infrastructure—but they carried regional identities. How do you create a capital that represents unified Egypt, not one region's victory over another?",
        solution:
          "Build a brand-new capital at the border between Upper and Lower Egypt. Narmer founds Memphis (originally called Ineb-Hedj, 'White Walls,' referring to the whitewashed brick palace walls) at the apex of the Nile Delta—where the river splits into multiple channels. This location is symbolically perfect: it's literally where the two lands meet. It's also strategically brilliant: Memphis controls trade and travel between north and south, sits at the junction of river and delta, and can project power in all directions. According to tradition, Narmer diverted the Nile to create dry land for the city—a legendary feat demonstrating the pharaoh's control over nature itself.",
        impact:
          "Memphis became Egypt's political and administrative capital for over 1,000 years, serving as the seat of power for six consecutive dynasties during the Old Kingdom (when the pyramids were built). Even when later pharaohs moved the capital elsewhere (Thebes, Amarna, Pi-Ramesses), Memphis remained economically and religiously vital, home to the temple of Ptah, the creator god. The city's strategic location made it a crossroads of trade and culture. Memphis proved that a capital city isn't just where the king happens to live—it's a deliberate political statement. By placing the capital at the border, Narmer signaled that unified Egypt was more than Upper Egypt's conquest of the north—it was a new entity, the Two Lands made one."
      },
      {
        name: "The Narmer Palette - Historical Narrative Art",
        description: "Ceremonial stone carving depicting the unification of Egypt through symbolic imagery",
        category: "Art",
        date: "c. 3100 BCE",
        imageUrl: "/images/inventions/narmer_palette.jpg",
        problem:
          "Narmer has conquered Lower Egypt and unified the Two Lands—but how does he communicate this achievement to his subjects, many of whom can't read the newly invented hieroglyphs? How does he legitimize his rule, showing that the gods approve? How does he create a lasting record that will endure for millennia, telling future generations what he accomplished?",
        solution:
          "Commission a ceremonial palette—a carved stone slab about two feet tall, shaped like a cosmetics-grinding palette but far too large for practical use. On one side, depict Narmer wearing the White Crown of Upper Egypt, raising a mace to strike a kneeling northern enemy, with the falcon god Horus (divine protector of kings) presenting him with captives. On the reverse, show Narmer wearing the Red Crown of Lower Egypt, striding past rows of decapitated enemies, their severed heads placed between their legs. Include hieroglyphs identifying Narmer by name (catfish + chisel). The imagery is brutal but clear: Narmer has conquered both lands, the gods approve, and resistance is futile. Dedicate this masterpiece to the Temple of Horus at Nekhen, where priests will preserve it.",
        impact:
          "The Narmer Palette is one of the earliest examples of historical narrative art—visual storytelling carved in stone. It establishes artistic conventions that Egyptian art will follow for 3,000 years: hierarchical scale (the king is largest), symbolic crowns, gods appearing beside the pharaoh, and brutal imagery of defeated enemies. Discovered in 1897-98 by British archaeologists, it's now one of the most famous artifacts in Egyptian archaeology. A 1993 discovery of a 'year label' depicting the same scene confirms the Palette represents an actual historical event, not just mythology. The Narmer Palette proves that from Egypt's very beginning, pharaohs understood the power of art as propaganda—and that stone outlasts memory."
      }
    ],
    places: [
      {
        name: "Memphis (Ineb-Hedj, 'White Walls')",
        description:
          "The first capital of unified Egypt, founded by Narmer around 3100 BCE at the strategic border between Upper and Lower Egypt at the apex of the Nile Delta. Originally called Ineb-Hedj ('White Walls'), referring to the brilliant whitewashed brick walls of the royal palace. The location was symbolically perfect—literally where Upper Egypt meets Lower Egypt—and strategically brilliant, controlling trade and travel between north and south. According to tradition, Narmer diverted the Nile itself to create dry land for the city. Memphis served as Egypt's political and administrative capital for over 1,000 years, through the Old Kingdom when the pyramids were built. It remained Egypt's economic and religious center even when later dynasties moved the capital, home to the great temple of Ptah, the creator god. Greek historian Herodotus called Memphis 'the most prosperous city in Egypt.'",
        location: "Approximately 20 km south of modern Cairo, Egypt, at the apex of the Nile Delta",
        significance:
          "Memphis was more than a capital—it was a political statement. By placing the seat of power at the border between Upper and Lower Egypt rather than in a conquered city, Narmer signaled that unified Egypt was a new entity, not just Upper Egypt's conquest of the north. The city's strategic location at the junction of river and delta made it the crossroads of Egyptian trade and culture for millennia. Today, the ruins of Memphis are a UNESCO World Heritage Site, though most of the ancient city lies buried under silt and modern settlements.",
        imageUrl: "/images/places/memphis.jpg"
      },
      {
        name: "Hierakonpolis (Nekhen) - City of the Falcon",
        description:
          "Ancient Upper Egyptian city in southern Egypt, about 100 km south of Luxor, that served as the religious and political capital of Upper Egypt before unification (c. 3200-3100 BCE). Called Nekhen by Egyptians, the Greeks later renamed it Hierakonpolis ('City of Hawks/Falcons'). Home to the Temple of Horus, the falcon god who was the divine protector of Upper Egypt's kings. Narmer likely ruled from Nekhen before conquering Lower Egypt. After unification, Narmer dedicated magnificent ceremonial objects to the Temple of Horus here, including the famous Narmer Palette and ceremonial maceheads. British archaeologists James Quibell and Frederick Green excavated the temple in 1897-98 and discovered the 'Main Deposit'—a cache of hundreds of objects buried beneath the temple floor as foundation offerings. Among these treasures were the Narmer Palette, the Scorpion Macehead (belonging to a predecessor), and other crucial artifacts documenting Egypt's unification.",
        location: "Near modern Kom el-Ahmar, Upper Egypt, about 100 km south of Luxor",
        significance:
          "Hierakonpolis is where Egyptian unification became visible. The Narmer Palette, discovered here in 1897-98, is one of the most important documents of early Egyptian history—visual proof of the unification of Upper and Lower Egypt. The Temple of Horus remained a religious center for thousands of years, used as late as the Ptolemaic Period (305-30 BCE). The 'Main Deposit' discoveries revolutionized understanding of Egypt's earliest dynasties. Without the priests of Horus carefully burying these treasures for preservation, we'd know almost nothing about Narmer or the unification.",
        imageUrl: "/images/places/hierakonpolis.jpg"
      }
    ],
    resources: [
      {
        title: "Narmer's Reign: The Epic Beginnings of Ancient Egypt (Video)",
        type: "Video",
        url: "https://www.ancient-origins.net/videos/narmer-first-pharaoh-video-0020229",
        isCore: true,
        description:
          "Documentary exploring how Narmer unified Upper and Lower Egypt around 3100 BCE, founding the First Dynasty and creating the pharaonic system that lasted 3,000 years."
      },
      {
        title: "The Narmer Palette Explained - Smarthistory",
        type: "Article",
        url: "https://smarthistory.org/palette-of-king-narmer/",
        isCore: true,
        description:
          "Detailed analysis of the famous Narmer Palette, explaining its imagery, symbolism, and what it tells us about Egypt's unification. From Smarthistory's art history experts."
      },
      {
        title: "Egypt's First Pharaohs Loved Catfish - National Geographic",
        type: "Article",
        url: "https://www.nationalgeographic.com/history/history-magazine/article/egypts-first-pharaohs-loved-catfish-and-worshipped-them",
        isCore: false,
        description:
          "Fascinating article about the significance of catfish in early Egyptian symbolism, including why Narmer's name includes a catfish hieroglyph and the electric catfish's cultural importance."
      },
      {
        title: "Unification of Upper and Lower Egypt - Study.com Lesson",
        type: "Article",
        url: "https://study.com/academy/lesson/the-unification-of-upper-lower-egypt.html",
        isCore: false,
        description:
          "Educational lesson suitable for students covering the historical context of Egypt's unification, Narmer's role, and the impact on Egyptian civilization."
      }
    ],
    quiz: {
      title: "Unification Protocol",
      description: "Prove your knowledge of Egypt's unification and earn the double crown artifact.",
      questions: [
        {
          id: "narmer_q1",
          text: "What did Narmer achieve around 3100 BCE?",
          options: [
            "Built the Great Pyramid",
            "Unified Upper and Lower Egypt",
            "Invented hieroglyphs",
            "Defeated the Hittites"
          ],
          correctIndex: 1,
          explanation:
            "Narmer unified Upper Egypt (the south) and Lower Egypt (the north) around 3100 BCE, creating the first unified Egyptian state. This marked the beginning of Egypt's First Dynasty and 3,000 years of pharaonic civilization."
        },
        {
          id: "narmer_q2",
          text: "What does the Narmer Palette show?",
          options: [
            "Instructions for making paint",
            "Narmer wearing both the White and Red Crowns, symbolizing rule over Upper and Lower Egypt",
            "A recipe for bread and beer",
            "A map of ancient Egypt"
          ],
          correctIndex: 1,
          explanation:
            "The Narmer Palette shows Narmer wearing the White Crown of Upper Egypt on one side and the Red Crown of Lower Egypt on the other, symbolizing his conquest and unification of both lands. It's one of the earliest examples of historical narrative art."
        },
        {
          id: "narmer_q3",
          text: "What was the Pschent?",
          options: [
            "An ancient Egyptian weapon",
            "The double crown combining the White and Red Crowns",
            "A type of pyramid",
            "A sacred river boat"
          ],
          correctIndex: 1,
          explanation:
            "The Pschent (Pa-sekhemty, 'the Two Powerful Ones') was the double crown combining the White Crown of Upper Egypt inside the Red Crown of Lower Egypt. It symbolized the pharaoh's rule over the unified Two Lands and was worn by Egyptian kings for 3,000 years."
        },
        {
          id: "narmer_q4",
          text: "Where did Narmer establish Egypt's first unified capital?",
          options: [
            "Thebes",
            "Alexandria",
            "Memphis (Ineb-Hedj, 'White Walls')",
            "Giza"
          ],
          correctIndex: 2,
          explanation:
            "Narmer founded Memphis (originally called Ineb-Hedj, 'White Walls') at the border between Upper and Lower Egypt. This strategic location—where the Nile Delta begins—symbolically and practically unified the Two Lands. Memphis served as Egypt's capital for over 1,000 years."
        },
        {
          id: "narmer_q5",
          text: "What two hieroglyphs make up Narmer's name?",
          options: [
            "A bird and a snake",
            "A catfish and a chisel",
            "An eye and a hand",
            "A sun and a moon"
          ],
          correctIndex: 1,
          explanation:
            "Narmer's name is written with a catfish (n'r) and a chisel (mr)—picture-puns that sounded like his name. The catfish might represent the electric catfish, which can deliver a stunning 350-volt shock! In some art, Narmer appears as a literal catfish fighting enemies."
        },
        {
          id: "narmer_q6",
          text: "Who was Neithhotep?",
          options: [
            "Narmer's military general",
            "A foreign invader",
            "Narmer's queen consort, possibly Egypt's first female ruler",
            "The architect who built Memphis"
          ],
          correctIndex: 2,
          explanation:
            "Neithhotep was Narmer's queen consort and the first woman known by name in history. Her enormous tomb and the fact that her name appears in a royal serekh (normally reserved only for kings) suggest she may have ruled as regent after Narmer died—possibly making her Egypt's first female monarch."
        },
        {
          id: "narmer_q7",
          text: "Is Narmer the same person as Menes, the legendary first pharaoh?",
          options: [
            "Yes, definitely—all scholars agree",
            "Probably—a 2014 survey found 41 Egyptologists say yes, 31 say Menes was Narmer's successor",
            "No—they lived centuries apart",
            "Menes never existed"
          ],
          correctIndex: 1,
          explanation:
            "Most Egyptologists believe Narmer and Menes are the same person, but debate continues. A 2014 survey: 41 experts identified Narmer as Menes, while 31 said Menes was Narmer's successor Hor-Aha. Either way, Narmer unified Egypt and founded the First Dynasty around 3100 BCE."
        }
      ]
    }
  },
  'imhotep': {
    summary:
      "Before Imhotep, most elite Egyptians are buried in mastabas—flat, rectangular tombs built from mudbrick. Under Pharaoh Djoser, Imhotep, a talented official and architect, tries something radically new.\n\n" +
      "He stacks mastaba shapes on top of each other, building a six-layered stone structure: the Step Pyramid at Saqqara. Around it, he designs courtyards, chapels, and dummy buildings for the king to “use” in the afterlife. This requires careful planning, a steady supply of cut stone, and strict organization of labor.\n\n" +
      "Imhotep becomes legendary. Later Egyptians remember him as a master of magic and medicine; eventually, he is even worshipped as a god of wisdom. His real achievement is more down-to-earth but still incredible: proving that Egyptians can build giant stone monuments that will last for millennia.",
    funFact:
      "Imhotep is one of the very few non-royal Egyptians from this early period whose name we still know—most architects stayed anonymous.",
    people: [
      {
        name: "Imhotep",
        role: "Architect of Kings",
        category: "Scientist",
        description:
          "Brilliant designer and official credited with creating the first stone pyramid for Pharaoh Djoser.",
        imageUrl: "/images/dawn_of_civilization/imhotep.jpg",
        achievements: ["Designed the Step Pyramid", "Pioneered stone architecture", "Worshipped as a god"],
        legacy: "The father of Egyptian stone architecture."
      },
      {
        name: "Djoser",
        role: "Pharaoh",
        category: "Leader",
        description:
          "The king who trusted Imhotep with a bold, experimental tomb design that changed Egyptian architecture forever.",
        imageUrl: "/images/dawn_of_civilization/djoser.jpg"
      }
    ],
    inventions: [
      {
        name: "Step Pyramid Design",
        description:
          "A layered stone pyramid built by stacking mastaba levels, creating the first large-scale stone monument.",
        category: "Architecture",
        imageUrl: "/images/dawn_of_civilization/step_pyramid.jpg",
        date: "c. 2630 BCE",
        problem: "Mudbrick tombs erode over time and don’t shout royal power very loudly.",
        solution:
          "Switch to stone and stack multiple levels to create a towering, permanent tomb.",
        impact:
          "Sets the stage for the smooth-sided pyramids at Giza and centuries of monumental Egyptian building."
      }
    ],
    places: [
      {
        name: "Saqqara Necropolis",
        description:
          "A vast cemetery complex near Egypt’s early capitals, home to Djoser’s Step Pyramid.",
        imageUrl: "/images/dawn_of_civilization/saqqara.jpg",
        location: "West of modern Cairo, Egypt",
        significance:
          "Shows the evolution of Egyptian royal tombs from simple mastabas to experimental pyramids."
      }
    ],
    resources: [
      {
        title: "Djoser’s Step Pyramid",
        type: "Video",
        searchQuery: "Djoser Step Pyramid Imhotep documentary",
        isCore: true,
        description: "Explainer on how Imhotep’s design changed Egyptian architecture."
      },
      {
        title: "Imhotep: Architect, Priest, God",
        type: "Article",
        searchQuery: "Imhotep architect later deified",
        isCore: false,
        description:
          "Short article tracing how a real architect became a legendary healing god."
      }
    ]
  },
  'pyramids': {
    summary:
      "Around 2560 BCE, on the Giza plateau near modern Cairo, Pharaoh Khufu ordered the construction of the largest stone structure humans had ever built. When completed 20 years later, the Great Pyramid stood 146.5 meters (481 feet) tall—the tallest human-made structure in the world for the next 3,800 years. It contains roughly 2.3 million limestone blocks, each weighing 2-15 tons, precisely cut and fitted together with gaps so thin you can't slide a credit card between them. The base covers 13 acres and is almost perfectly level—off by less than 2 centimeters across the entire foundation. The sides are aligned to true north with astonishing accuracy (off by only 3/60th of a degree). This wasn't just a tomb. It was a declaration: the pharaoh commands resources, labor, and engineering on a scale no one had ever seen. It was meant to inspire awe, and 4,500 years later, it still does.\n\n" +
      "How was it built? For centuries, wild theories abounded—aliens, lost technology, slaves driven by whips. Modern archaeology tells a more human story. During the Nile's annual flood season (July-October), when farmland was underwater and farmers couldn't work, they served in labor teams for the state, receiving food rations in exchange. Estimates suggest 10,000-20,000 workers at peak construction. They lived in worker villages near Giza, with evidence of decent housing, medical care (surgeons set broken bones), and varied diets (bread, beer, meat, fish). These weren't slaves—they were paid Egyptian citizens doing rotating state service, some leaving graffiti like 'The Friends of Khufu Gang' or 'The Drunkards of Menkaure.' Stone was quarried locally (limestone) and from across the Nile (fine white Tura limestone for casing stones, granite from Aswan 800 km away). Workers moved blocks on wooden sleds over sand—recent experiments show wetting the sand reduced friction by 50%. Ramps likely spiraled around the pyramid as it rose, though the exact method is still debated. Inside, passages lead to the King's Chamber, built with massive granite beams weighing 50 tons, somehow maneuvered into place hundreds of feet above ground.\n\n" +
      "But the Great Pyramid wasn't alone. Nearby stand two other massive pyramids: Khafre's (slightly smaller but appears taller because it's on higher ground) and Menkaure's (much smaller). Dozens of smaller pyramids for queens and officials, massive mortuary temples, and the enigmatic Great Sphinx (a limestone monument with a lion's body and a pharaoh's face) complete the Giza complex. Originally, all three main pyramids were covered in smooth, polished white limestone casing stones that reflected sunlight like mirrors—imagine them gleaming brilliantly across the desert, visible for miles. Over millennia, earthquakes and stone robbers stripped most casing stones (used to build medieval Cairo), leaving the rough, stepped cores we see today. But a few casing stones remain at Khafre's peak, hinting at their former glory. The pyramids weren't just tombs—they were resurrection machines. Egyptians believed the pharaoh's body, preserved by mummification and sealed inside, would journey through the underworld and be reborn as a star. The pyramid's shape may represent the sun's rays descending to Earth, or a stairway to heaven. After 4,500 years, the pyramids still dominate the Giza skyline, reminders that humans with Bronze Age technology—no iron, no wheels, no pulleys—could create something nearly eternal.",
    funFact:
      "The Great Pyramid was the tallest human-made structure in the world for 3,800 years—until England's Lincoln Cathedral overtook it in 1311 CE. The casing stones were so smooth and polished that medieval Arab historians wrote you couldn't even insert a knife blade between them.",
    people: [
      {
        name: "Khufu (Cheops)",
        role: "Pharaoh and Commissioner of the Great Pyramid",
        category: "Leader",
        description:
          "Khufu (reigned c. 2589-2566 BCE) was the second pharaoh of Egypt's Fourth Dynasty, ruling during the Old Kingdom's peak. He ordered the construction of the Great Pyramid as his eternal tomb and resurrection machine. Greek historian Herodotus (writing 2,000 years later) portrayed Khufu as a tyrant who enslaved his people, but modern archaeology shows a more complex picture: a powerful ruler presiding over a wealthy, organized state capable of incredible engineering. Khufu's pyramid complex included temples, causeways, smaller pyramids for queens, and boat pits containing disassembled cedar ships (likely for the pharaoh's journey in the afterlife).",
        born: "c. 2600 BCE",
        died: "c. 2566 BCE",
        achievements: [
          "Commissioned the Great Pyramid of Giza, the only surviving Wonder of the Ancient World",
          "Oversaw 20 years of construction employing tens of thousands of workers",
          "Centralized royal power and resources to an unprecedented degree",
          "Left the tallest human-made structure in the world for the next 3,800 years"
        ],
        legacy: "Khufu's pyramid became the ultimate symbol of ancient Egypt and humanity's ability to create monumental, enduring works. His tomb was looted in antiquity, and his mummy was never found—but his pyramid remains.",
        imageUrl: "/images/foundations/khufu.jpg"
      },
      {
        name: "Hemiunu",
        role: "Vizier and Architect of the Great Pyramid",
        category: "Scientist",
        description:
          "Hemiunu was Khufu's nephew and vizier (prime minister), credited by some Egyptologists as the chief architect and construction manager of the Great Pyramid. His tomb at Giza contains a remarkably lifelike statue showing a prosperous, well-fed official—evidence of his high status. As vizier, Hemiunu would have coordinated the massive logistics: organizing work crews, managing food supplies, overseeing quarries, transporting stones, and solving engineering problems. The precision of the pyramid's construction—aligned to true north within 3 minutes of arc—suggests sophisticated surveying techniques and astronomical knowledge.",
        achievements: [
          "Coordinated logistics for 20,000 workers and millions of stone blocks",
          "Solved unprecedented engineering challenges: foundation leveling, precise alignment, internal chambers",
          "Managed food distribution: workers consumed thousands of loaves of bread and gallons of beer daily"
        ],
        legacy: "Hemiunu represents the genius engineers and administrators who made Egypt's monuments possible. The pyramid wasn't just royal will—it was brilliant planning and execution.",
        imageUrl: "/images/foundations/hemiunu.jpg"
      },
      {
        name: "The Pyramid Builder",
        role: "Seasonal Laborer",
        category: "Worker",
        description:
          "During flood season, farmers across Egypt traveled to Giza to work on the pharaoh's pyramid. They lived in worker villages, received daily rations (10 loaves of bread and jugs of beer per person), worked in rotating crews with names like 'Friends of Khufu' or 'The Drunkards of Menkaure,' and left graffiti on stone blocks marking their teams. Evidence shows they received medical care—surgeons set broken bones, and some workers recovered from injuries. This wasn't slavery; it was state service, a combination of civic duty, religious devotion (helping the god-king), and practical survival (food rations during the season when farms were flooded).",
        legacy: "The pyramid builders prove that monumental construction doesn't require slavery—just organization, shared purpose, and a functioning economy that can feed thousands of non-farmers.",
        imageUrl: "/images/foundations/pyramid_worker.jpg"
      }
    ],
    inventions: [
      {
        name: "Precision Stone Masonry and Surveying",
        description: "Techniques for cutting, moving, and placing massive stone blocks with extraordinary accuracy",
        category: "Science",
        imageUrl: "/images/inventions/stone_masonry.jpg",
        date: "c. 2560 BCE",
        problem:
          "How do you cut 2.3 million limestone blocks to precise dimensions, transport some weighing 50+ tons, and stack them into a structure 146 meters tall that doesn't collapse? How do you align it perfectly to true north and level the foundation across 13 acres? Ancient Egyptians had no iron tools (only copper chisels and bronze saws), no wheels for heavy loads, no pulleys, and no modern surveying equipment.",
        solution:
          "Quarry workers used copper tools and wooden wedges soaked in water (the wood expands, splitting stone along natural cracks). They moved blocks on wooden sleds over wetted sand (reduces friction by 50%, proven by experiment). They leveled the foundation by cutting trenches, filling them with water, and marking water level as a reference. They aligned to north by tracking stars (probably using a merkhet, a sighting tool). They used ramps (probably spiraling around the pyramid) to raise blocks as construction rose. Inside chambers used massive granite beams, some weighing 50 tons, lifted into place hundreds of feet up.",
        impact:
          "Egyptian masonry techniques set standards for precision and durability. The pyramids have survived 4,500 years with minimal damage (mostly from stone robbers, not structural failure). These techniques spread to later civilizations: Greek and Roman engineers studied Egyptian monuments. The methods also required mathematical knowledge (geometry for slopes and angles, astronomy for alignment, logistics for planning resources over decades)—advancing human knowledge of engineering and organization."
      },
      {
        name: "State-Organized Mass Labor",
        description: "System for mobilizing, feeding, housing, and coordinating tens of thousands of workers",
        category: "Politics",
        imageUrl: "/images/inventions/labor_organization.jpg",
        date: "c. 2600 BCE",
        problem:
          "How do you employ 10,000-20,000 workers for 20+ years? Where do they live? What do they eat? How do you prevent chaos, crime, and disease? How do you coordinate work crews so blocks arrive in the right order? A project this size had never been attempted—villages rarely had more than a few hundred people.",
        solution:
          "Build worker villages near Giza with housing, bakeries, breweries, and medical facilities. Rotate crews during flood season when farmers are idle. Pay workers in rations: bread, beer, meat, fish, vegetables—enough to feed families. Organize workers into named gangs (like 'Friends of Khufu') for motivation and accountability. Station scribes to record deliveries, track rations, and prevent corruption. Have foremen coordinate work crews like an assembly line: quarrying, transporting, and placing stones continuously.",
        impact:
          "This system proved the state could mobilize vast resources for decades-long projects. It required sophisticated bureaucracy (scribes, overseers, ration distribution), creating the administrative machinery of civilization. Later empires—Persia, Rome, China—copied Egypt's model for massive construction projects (roads, aqueducts, walls). The pyramid-building system also demonstrates that monumental architecture doesn't require slavery—it requires organization, surplus food production, and a shared sense of purpose (or at least, acceptance of the pharaoh's authority)."
      },
      {
        name: "Casing Stone Technology",
        description: "Polished white limestone casing that covered pyramids, making them gleam like mirrors",
        category: "Architecture",
        imageUrl: "/images/inventions/casing_stones.jpg",
        date: "c. 2560 BCE",
        problem:
          "The pyramid's core is rough limestone blocks. How do you create a smooth, gleaming surface visible from miles away? How do you protect the structure from erosion?",
        solution:
          "Quarry fine white Tura limestone from across the Nile. Cut it into casing blocks that fit together perfectly—gaps so small you can't insert a knife blade. Polish the outer surface until it reflects sunlight like a mirror. The result: a gleaming white monument that dominates the landscape and symbolizes divine radiance. The peak (pyramidion) was possibly covered in electrum (gold-silver alloy) or gold, making it shine even brighter.",
        impact:
          "The casing stones transformed pyramids from impressive to awe-inspiring. They reflected the sun's rays, visible for miles, symbolically connecting the pharaoh to the sun god Ra. Unfortunately, most casing stones were stripped over millennia—earthquakes loosened them, and medieval Egyptians quarried them to build Cairo. Only a few remain at Khafre's peak, hinting at the original glory. But the technology influenced later architecture: polished stone facades became symbols of power and permanence worldwide."
      }
    ],
    places: [
      {
        name: "Giza Pyramid Complex",
        description:
          "The iconic plateau west of the Nile near modern Cairo, dominated by three massive pyramids (Khufu, Khafre, Menkaure), the Great Sphinx, dozens of smaller pyramids for queens and nobles, mortuary temples, causeways, and worker villages. The complex covers about 3 square kilometers and represents the peak of Old Kingdom pyramid construction (c. 2589-2504 BCE).",
        location: "Giza plateau, outskirts of modern Cairo, Egypt",
        significance:
          "Giza is the most iconic archaeological site in the world. The Great Pyramid (Khufu's) is the only surviving Wonder of the Ancient World. The complex demonstrates the organizational power of the Old Kingdom pharaohs, the sophistication of Egyptian engineering, and the religious belief in the afterlife. For 4,500 years, these monuments have inspired wonder, speculation, and sometimes wild theories (aliens, Atlantis, etc.)—but modern archaeology reveals an even more impressive truth: humans built them with determination, ingenuity, and organization.",
        imageUrl: "/images/places/giza_complex.jpg"
      },
      {
        name: "Workers' Village at Giza",
        description:
          "Archaeological site discovered in 1990s, containing remains of barracks, bakeries, breweries, medical facilities, and workshops where pyramid builders lived. Evidence shows workers ate well (bread, beer, beef, mutton, fish), received medical care (surgeons set broken bones), and lived in organized, if cramped, quarters. Graffiti on stones shows work crews had names like 'Friends of Khufu' or 'The Drunkards of Menkaure'—evidence of team spirit and perhaps competition between gangs.",
        location: "Near Giza plateau, Egypt (excavated in 1990s)",
        significance:
          "The workers' village revolutionized understanding of pyramid construction. For centuries, historians assumed slaves built the pyramids under brutal conditions (influenced by Herodotus and biblical narratives). The archaeological evidence shows a different story: paid workers, state-organized labor, decent (if hard) conditions, and evidence of shared purpose. This doesn't mean life was easy—hauling stones in the Egyptian sun was backbreaking—but it wasn't slavery. It was citizens serving the state, fed and housed in return.",
        imageUrl: "/images/places/giza_workers_village.jpg"
      }
    ],
    resources: [
      {
        title: "Decoding the Great Pyramid - PBS NOVA",
        type: "Video",
        url: "https://www.pbs.org/video/decoding-the-great-pyramid-4eeiz9/",
        isCore: true,
        description:
          "PBS NOVA documentary revealing new archaeological evidence showing the stunning engineering of the Great Pyramid. Features the discovery of a 'lost city' where workers lived and the logbook of a labor team that delivered limestone blocks."
      },
      {
        title: "Who Built the Egyptian Pyramids? Not Slaves - Discover Magazine",
        type: "Article",
        url: "https://www.discovermagazine.com/planet-earth/who-built-the-egyptian-pyramids-not-slaves",
        isCore: true,
        description:
          "Explains the archaeological evidence showing pyramid builders were skilled Egyptian citizens doing seasonal state service, not enslaved people. Details the workers' village, their diet, medical care, and honorable burials near the pyramids."
      },
      {
        title: "The Great Pyramid of Giza - World History Encyclopedia",
        type: "Article",
        url: "https://www.worldhistory.org/Great_Pyramid_of_Giza/",
        isCore: false,
        description:
          "Comprehensive article covering the Great Pyramid's construction, engineering precision (aligned to true north within 3 minutes of arc, base level within 2 cm), historical context, and lasting legacy as the only surviving Wonder of the Ancient World."
      },
      {
        title: "Pyramids of Giza - Khan Academy",
        type: "Article",
        url: "https://www.khanacademy.org/humanities/ap-art-history/ancient-mediterranean-ap/ancient-egypt-ap/a/pyramids-of-giza",
        isCore: false,
        description:
          "Student-friendly overview of the three main pyramids at Giza (Khufu, Khafre, Menkaure), how they were built, their astronomical alignments, and their role in Egyptian beliefs about the afterlife and divine kingship."
      }
    ],
    quiz: {
      title: "Pyramid Engineering Protocol",
      description: "Demonstrate your understanding of pyramid construction to unlock the pharaoh's artifact.",
      questions: [
        {
          id: "pyramid_q1",
          text: "Who commissioned the Great Pyramid of Giza?",
          options: ["Ramses II", "Tutankhamun", "Khufu", "Cleopatra"],
          correctIndex: 2,
          explanation:
            "Pharaoh Khufu (reigned c. 2589-2566 BCE) commissioned the Great Pyramid as his tomb. It took about 20 years to build and remained the world's tallest structure for 3,800 years."
        },
        {
          id: "pyramid_q2",
          text: "What were the pyramids originally covered with?",
          options: [
            "Gold leaf",
            "Polished white limestone casing stones",
            "Blue ceramic tiles",
            "Red granite"
          ],
          correctIndex: 1,
          explanation:
            "Pyramids were originally covered with smooth, polished white Tura limestone casing stones that reflected sunlight like mirrors. Most were stripped over millennia to build medieval Cairo, leaving the rough stepped cores we see today."
        },
        {
          id: "pyramid_q3",
          text: "How did workers move the massive stone blocks?",
          options: [
            "With alien technology",
            "By levitation using sound waves",
            "On wooden sleds over wetted sand",
            "With iron cranes and pulleys"
          ],
          correctIndex: 2,
          explanation:
            "Workers pulled massive blocks on wooden sleds. Experiments show wetting the sand in front of the sled reduced friction by 50%, making it much easier to move. Ancient Egyptians didn't have iron, wheels for heavy loads, or pulleys—just ingenuity and organization."
        },
        {
          id: "pyramid_q4",
          text: "Who built the pyramids?",
          options: [
            "Enslaved people forced to work",
            "Paid Egyptian workers doing seasonal state service",
            "Prisoners of war",
            "Foreign laborers hired from other countries"
          ],
          correctIndex: 1,
          explanation:
            "Archaeological evidence from the workers' village shows pyramid builders were paid Egyptian citizens, mostly farmers doing rotating state service during flood season. They received food rations, housing, and medical care. This wasn't slavery—it was organized state labor."
        },
        {
          id: "pyramid_q5",
          text: "How tall was the Great Pyramid originally?",
          options: [
            "100 meters (328 feet)",
            "146.5 meters (481 feet)",
            "200 meters (656 feet)",
            "300 meters (984 feet)"
          ],
          correctIndex: 1,
          explanation:
            "The Great Pyramid originally stood 146.5 meters (481 feet) tall—the tallest human-made structure in the world for 3,800 years until Lincoln Cathedral surpassed it in 1311 CE. Today it's slightly shorter (138 meters) due to loss of the capstone and some erosion."
        },
        {
          id: "pyramid_q6",
          text: "Why is the Great Pyramid aligned almost perfectly to true north?",
          options: [
            "By pure luck",
            "Ancient Egyptians used magnetic compasses",
            "They used astronomical observations to track stars",
            "Aliens aligned it"
          ],
          correctIndex: 2,
          explanation:
            "Ancient Egyptians aligned the pyramid to true north by tracking stars, probably using a merkhet (sighting tool). The alignment is accurate to within 3/60th of a degree—astonishingly precise without modern instruments."
        },
        {
          id: "pyramid_q7",
          text: "What is the Great Sphinx?",
          options: [
            "A natural rock formation",
            "A monument with a lion's body and a pharaoh's face, carved from limestone",
            "A temple dedicated to Ra",
            "A fortification to protect the pyramids"
          ],
          correctIndex: 1,
          explanation:
            "The Great Sphinx is a massive limestone monument with a lion's body and a pharaoh's face (probably Khafre, who built the second pyramid at Giza). It was carved from a single limestone outcrop and is one of the largest monolithic statues in the world."
        }
      ]
    }
  },
  'hatshepsut': {
    summary:
      "Hatshepsut starts as queen and regent for her young stepson, Thutmose III. Over time, she takes on full pharaonic titles and is depicted like a traditional king—wearing the kilt, false beard, and crown.\n\n" +
      "Her reign is mostly peaceful and prosperous. She repairs temples, sponsors building projects, and famously sends a trade expedition to Punt, a distant land rich in incense, gold, and exotic animals. Her terraced mortuary temple at Deir el-Bahri is one of the most beautiful in Egypt, blending into the cliffs behind it.\n\n" +
      "After her death, some later rulers try to erase her memory by chipping away her name and images. For a while, historians were fooled. Archaeology has since brought her back into the story as one of Egypt’s most capable rulers.",
    funFact:
      "Reliefs from Hatshepsut’s Punt expedition show the queen of Punt with very swollen legs and body—possibly a realistic depiction of a disease, which is rare in royal art.",
    people: [
      {
        name: "Hatshepsut",
        role: "Female Pharaoh",
        category: "Leader",
        description:
          "A powerful ruler who expanded trade, built impressive temples, and navigated gender expectations in a male-dominated royal system.",
        imageUrl: "/images/dawn_of_civilization/hatshepsut.jpg"
      },
      {
        name: "Senenmut",
        role: "Royal Advisor",
        category: "Leader",
        description:
          "A trusted official who helped oversee Hatshepsut’s building projects and possibly her daughter’s education.",
        imageUrl: "/images/dawn_of_civilization/senenmut.jpg"
      }
    ],
    inventions: [
      {
        name: "Long-Distance Trade Expedition to Punt",
        description:
          "An organized state-sponsored voyage to a distant land for luxury goods.",
        category: "Economy",
        imageUrl: "/images/dawn_of_civilization/punt_expedition.jpg",
        problem: "Egypt desires incense, exotic woods, and animals that don’t grow along the Nile.",
        solution:
          "Send fleets down the Red Sea to trade directly with Punt, bringing back live trees, animals, and treasure.",
        impact:
          "Strengthens Egypt’s economy and international reputation without starting a war."
      }
    ],
    places: [
      {
        name: "Deir el-Bahri Temple",
        description:
          "Hatshepsut’s terraced mortuary temple, carved into the cliffs above the Nile.",
        imageUrl: "/images/dawn_of_civilization/deir_el_bahri.jpg",
        location: "West Bank, Luxor, Egypt",
        significance:
          "A masterpiece of Egyptian architecture and a billboard for Hatshepsut’s achievements."
      }
    ],
    resources: [
      {
        title: "Hatshepsut: The Woman Who Was King",
        type: "Video",
        searchQuery: "Hatshepsut documentary female pharaoh",
        isCore: true,
        description:
          "Tells Hatshepsut’s story and how her legacy was nearly erased."
      }
    ]
  },
  'akhenaten': {
    summary:
      "Akhenaten (born Amenhotep IV) shakes Egypt’s religious and artistic system like almost no one else.\n\n" +
      "He promotes the Aten, the sun disk, above all other gods, changes his name to reflect this, and builds a new capital city, Akhetaten (modern Amarna). Art from his reign looks different: figures have elongated heads and soft bodies; the royal family is shown in intimate scenes under the Aten’s rays.\n\n" +
      "Some scholars describe his reforms as an early form of monotheism; others see it more as a radical royal cult. Either way, his changes disrupt the enormous economic and political power of the traditional temples. After his death, his experiments are rolled back, and many of his images are smashed or buried. His story is a reminder that religious revolutions can come from the top—and that they can fail.",
    funFact:
      "Because later rulers tried so hard to erase Akhenaten, modern archaeologists had to piece him together like a puzzle from broken statues, abandoned city ruins, and foreign letters.",
    people: [
      {
        name: "Akhenaten",
        role: "Heretic Pharaoh",
        category: "Leader",
        description:
          "A pharaoh who tried to reshape Egyptian religion around the Aten and broke many artistic traditions.",
        imageUrl: "/images/dawn_of_civilization/akhenaten.jpg"
      },
      {
        name: "Nefertiti",
        role: "Great Royal Wife",
        category: "Leader",
        description:
          "A powerful queen who appears beside Akhenaten in many scenes and may have ruled in her own right late in the period.",
        imageUrl: "/images/dawn_of_civilization/nefertiti.jpg"
      }
    ],
    inventions: [
      {
        name: "Amarna Artistic Style",
        description:
          "A new visual style that shows the royal family in more relaxed, sometimes exaggerated forms.",
        category: "Art",
        imageUrl: "/images/dawn_of_civilization/amarna_art.jpg",
        problem: "Traditional art is stiff and focused on timeless perfection.",
        solution:
          "Show the royal family in flowing poses, with visible emotions and family moments under Aten’s rays.",
        impact:
          "Creates one of the most recognizable and debated art styles in Egyptian history."
      }
    ],
    places: [
      {
        name: "Akhetaten (Amarna)",
        description:
          "A new capital city built by Akhenaten in the desert and abandoned shortly after his death.",
        imageUrl: "/images/dawn_of_civilization/amarna_city.jpg",
        location: "Middle Egypt, east bank of the Nile",
        significance:
          "Frozen in time, it gives archaeologists a detailed look at city life and royal experiments during his short-lived revolution."
      }
    ],
    resources: [
      {
        title: "Akhenaten and the Aten",
        type: "Video",
        searchQuery: "Akhenaten Aten religion documentary",
        isCore: true,
        description:
          "Explores Akhenaten’s religious reforms and their impact on Egypt."
      }
    ]
  },
  'tut': {
    summary:
      "Tutankhamun becomes pharaoh as a child in the middle of religious chaos created by Akhenaten’s reforms. His original name, Tutankhaten (“Living image of Aten”), is changed to Tutankhamun (“Living image of Amun”) as the old gods and temples are restored.\n\n" +
      "Tut doesn’t rule very long and was a minor king in his own time compared to giants like Ramesses II. But in 1922, his small tomb is found almost intact, packed with treasures: golden shrines, chariots, furniture, jewelry, and his famous gold mask.\n\n" +
      "Because grave robbers missed his tomb, Tutankhamun unexpectedly becomes the most famous pharaoh in modern times. His tomb gives us detailed evidence about royal life, burial customs, and craft skills in the New Kingdom—things other, more important kings lost when their tombs were looted.",
    funFact:
      "Tutankhamun’s tomb was hidden partly because workers from a later tomb dumped building rubble right over its entrance, accidentally protecting it for 3,000 years.",
    people: [
      {
        name: "Tutankhamun",
        role: "Boy King",
        category: "Leader",
        description:
          "A young pharaoh who helped restore traditional gods and became world-famous because his tomb stayed mostly untouched.",
        imageUrl: "/images/dawn_of_civilization/tutankhamun.jpg"
      },
      {
        name: "Howard Carter",
        role: "Archaeologist",
        category: "Scientist",
        description:
          "The modern archaeologist who discovered Tut’s tomb in 1922 after years of searching.",
        imageUrl: "/images/dawn_of_civilization/howard_carter.jpg"
      }
    ],
    inventions: [
      {
        name: "Nested Coffins and Shrines",
        description:
          "Multiple layers of coffins and shrines around the mummy, like Russian nesting dolls in gold.",
        category: "Art",
        imageUrl: "/images/dawn_of_civilization/tut_coffins.jpg",
        problem: "The king’s body and soul must be protected and honored in the afterlife.",
        solution:
          "Enclose the mummy in layers of coffins and gilded shrines, covered in spells and symbols.",
        impact:
          "Shows how much effort and wealth New Kingdom Egypt poured into a single royal burial."
      }
    ],
    places: [
      {
        name: "Valley of the Kings",
        description:
          "A remote valley where many New Kingdom pharaohs, including Tut, were buried in rock-cut tombs.",
        imageUrl: "/images/dawn_of_civilization/valley_of_kings.jpg",
        location: "West Bank, Luxor, Egypt",
        significance:
          "Replaced pyramids as the main royal burial site, partly to hide graves from robbers (which didn’t always work)."
      }
    ],
    resources: [
      {
        title: "Tutankhamun: The Boy King",
        type: "Video",
        searchQuery: "Tutankhamun tomb discovery documentary kids",
        isCore: true,
        description:
          "Kid-friendly documentary about the discovery and treasures of Tutankhamun’s tomb."
      }
    ]
  }
};
