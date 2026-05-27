import { NodeContent } from '../../../types';

export const FOUNDATIONS_EUROPE: Record<string, NodeContent> = {
  'cycladic_culture': {
    summary:
      "Long before classical Greece, the small Cycladic islands in the Aegean Sea become a world of sailors, marble carvers, farmers, fishers, and traders. The islands do not have huge river valleys like Egypt or Mesopotamia. They have harbors, winds, stone, metal sources nearby, and short sea crossings. That geography matters. In the Early Bronze Age, boats turn scattered islands into stepping-stones between mainland Greece, Crete, Anatolia, and the wider eastern Mediterranean.\n\n" +
      "Cycladic culture is most famous for marble figures: smooth human forms with folded arms, tilted heads, and faces that often show only a long nose. They look modern to us, but they were not modern art. Most were found in graves, though many were looted before archaeologists could study them properly. That missing context is a big problem. Were the figures ancestors, mourners, deities, companions for the dead, or something else? Good historians resist pretending the answer is settled.\n\n" +
      "The islands also produced musicians, metal tools, pottery, stone vessels, and fortified or planned settlements. The site of Keros and the nearby islet of Dhaskalio have become especially important in recent research. Excavations show a major ritual and building center where people brought broken marble objects from many islands. Dhaskalio also had impressive architecture and evidence for metalworking. That means Cycladic people were not isolated villagers making pretty statues. They were organizing movement, memory, craft, and ceremony across the sea.\n\n" +
      "Cycladic culture asks a sharp question: how can small islands become big historical players? The answer is connection. Boats moved obsidian, copper, marble, food, songs, styles, and people. Art made identity visible. Ritual gatherings turned scattered communities into a shared world. Even when their own writing is absent, the objects they left behind show a society that knew how to use the sea as a road.",
    funFact:
      "Many Cycladic figures were originally painted with details such as eyes, hair, jewelry, or tattoos, but most of that paint has faded away.",
    people: [
      {
        name: "Cycladic Marble Carver",
        role: "Island Sculptor",
        category: "Artist",
        description:
          "A craftsperson who shapes hard white marble into folded-arm figures, vessels, and other objects using stone tools, abrasives, patience, and a sharp sense of form.",
        achievements: [
          "Created some of the most recognizable art of the Early Bronze Age Aegean",
          "Worked marble into smooth figures without iron tools",
          "Helped build a shared island style across separate communities"
        ],
        legacy:
          "Cycladic carvers show that small communities could produce art with a long afterlife, even when we cannot fully recover its original meaning.",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Marble_seated_harp_player_MET_DP266958.jpg/770px-Marble_seated_harp_player_MET_DP266958.jpg",
        imageFit: "contain"
      },
      {
        name: "Aegean Boat Captain",
        role: "Island Navigator",
        category: "Explorer",
        description:
          "A sailor who reads winds, currents, stars, coastlines, and island silhouettes to move people and goods through the Aegean. Travel by boat made the Cyclades feel connected instead of remote.",
        achievements: [
          "Linked islands with mainland Greece, Crete, and Anatolia",
          "Moved marble, pottery, food, metal, and ritual objects",
          "Turned the Aegean Sea into a route rather than a barrier"
        ],
        legacy:
          "Island navigators helped create the maritime habits that later Aegean cultures, including the Minoans and Greeks, would build upon.",
        imageUrl: "https://www.metmuseum.org/art/collection/search/254587",
        imageFit: "contain"
      },
      {
        name: "Keros Ritual Gatherer",
        role: "Pilgrim or Participant",
        category: "Commoner",
        description:
          "A person who travels to Keros carrying broken pieces of special marble objects. Archaeology suggests people gathered there from different islands, but the exact beliefs behind the ritual remain uncertain.",
        achievements: [
          "Participated in shared island ceremonies",
          "Helped create a ritual center visited by many communities",
          "Left evidence that movement and belief linked the Cyclades"
        ],
        legacy:
          "The Keros gatherer reminds us that ordinary participants, not just chiefs, can create a sacred landscape.",
        imageUrl: "https://www.cam.ac.uk/research/news/ancient-greek-island-was-the-site-of-one-of-the-worlds-earliest-maritime-sanctuaries",
        imageFit: "contain"
      }
    ],
    inventions: [
      {
        name: "Folded-Arm Marble Figure",
        description: "A stylized Cycladic human figure carved from island marble",
        category: "Art",
        date: "c. 2800-2300 BCE",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Marble_seated_harp_player_MET_DP266958.jpg/770px-Marble_seated_harp_player_MET_DP266958.jpg",
        imageFit: "contain",
        problem:
          "Communities need durable symbols for memory, burial, identity, or ritual, but the meaning must be carried without writing.",
        solution:
          "Carve marble figures with repeated body forms and, originally, painted details that could signal identity, beauty, or sacred meaning.",
        impact:
          "Cycladic figures became a shared visual language across the islands and remain a powerful case study in how much context looting can destroy."
      },
      {
        name: "Island Maritime Network",
        description: "A web of boat routes connecting small Aegean communities",
        category: "Transportation",
        date: "Early Bronze Age",
        imageUrl: "https://www.metmuseum.org/essays/early-cycladic-art-and-culture",
        imageFit: "contain",
        problem:
          "Small islands have limited farmland and resources, so no single island can easily supply everything its people want or need.",
        solution:
          "Use seafaring to connect harbors, exchange materials, and gather people for rituals and trade.",
        impact:
          "The network made the Cyclades influential far beyond their size and helped shape later Aegean maritime cultures."
      }
    ],
    places: [
      {
        name: "Cyclades",
        description:
          "A cluster of islands in the central Aegean Sea, including Naxos, Paros, Keros, Syros, and many smaller islands.",
        location: "Aegean Sea, between mainland Greece, Crete, and Anatolia",
        significance:
          "Their location made the islands natural stepping-stones for Bronze Age travel, trade, and cultural exchange.",
        imageUrl: "https://www.metmuseum.org/essays/early-cycladic-art-and-culture",
        imageFit: "contain"
      },
      {
        name: "Keros and Dhaskalio",
        description:
          "A ritual center and nearby built-up islet where archaeologists have found broken marble objects, architecture, and evidence for craft activity.",
        location: "Small islands in the central Cyclades, Greece",
        significance:
          "Recent excavations show that Early Bronze Age islanders could organize large gatherings, long-distance movement, and complex building projects.",
        imageUrl: "https://www.cam.ac.uk/research/news/ancient-greek-island-was-the-site-of-one-of-the-worlds-earliest-maritime-sanctuaries",
        imageFit: "contain"
      }
    ],
    resources: [
      {
        title: "Early Cycladic Art and Culture - The Met",
        type: "Article",
        url: "https://www.metmuseum.org/essays/early-cycladic-art-and-culture",
        isCore: true,
        description:
          "Museum overview of Cycladic island life, marble figures, graves, seafaring, and archaeological uncertainty."
      },
      {
        title: "Marble Seated Harp Player - The Met",
        type: "Article",
        url: "https://www.metmuseum.org/art/collection/search/254587",
        isCore: true,
        description:
          "Primary object page for a Cycladic musician figure, useful for discussing art, music, and ritual."
      },
      {
        title: "Keros Maritime Sanctuary - University of Cambridge",
        type: "Article",
        url: "https://www.cam.ac.uk/research/news/ancient-greek-island-was-the-site-of-one-of-the-worlds-earliest-maritime-sanctuaries",
        isCore: false,
        description:
          "Research news on Keros and Dhaskalio, emphasizing ritual gathering and maritime organization."
      },
      {
        title: "Male Harp Player - Getty Explore Ancient Worlds",
        type: "Article",
        url: "https://exploreancientworlds.getty.edu/art-objects/male-harp-player-of-the-early-spedos-type",
        isCore: false,
        description:
          "Student-friendly object page explaining a Cycladic harp player and how archaeologists interpret Cycladic culture."
      }
    ],
    quiz: {
      title: "Aegean Island Network Protocol",
      description: "Show how small islands became powerful connectors in the Bronze Age.",
      collectibleCards: [
        { type: 'person', index: 0, id: 'cycladic_culture_person_marble_carver' },
        { type: 'person', index: 1, id: 'cycladic_culture_person_boat_captain' },
        { type: 'invention', index: 0, id: 'cycladic_culture_invention_marble_figure' },
        { type: 'invention', index: 1, id: 'cycladic_culture_invention_maritime_network' },
        { type: 'place', index: 1, id: 'cycladic_culture_place_keros_dhaskalio' }
      ],
      questions: [
        {
          id: "cycladic_culture_q1",
          text: "Where did Cycladic culture develop?",
          options: [
            "The central Aegean islands",
            "The Nile Delta",
            "The Andes Mountains",
            "The Yellow River valley"
          ],
          correctIndex: 0,
          explanation:
            "The Cyclades are islands in the central Aegean Sea. Their position made boats, harbors, and short sea crossings central to daily life."
        },
        {
          id: "cycladic_culture_q2",
          text: "What are Cycladic folded-arm figures usually made from?",
          options: [
            "Bronze",
            "Marble",
            "Papyrus",
            "Fired brick"
          ],
          correctIndex: 1,
          explanation:
            "Cycladic figures were commonly carved from marble. Their smooth white surfaces often lost the painted details they once had."
        },
        {
          id: "cycladic_culture_q3",
          text: "Why are many Cycladic figures hard to interpret?",
          options: [
            "No examples have survived",
            "Many were looted, so their archaeological context was lost",
            "They all include long written labels",
            "They were made only in modern times"
          ],
          correctIndex: 1,
          explanation:
            "Looting removes objects from graves or settlements without recording where they were found. That destroys clues about use, date, and meaning."
        },
        {
          id: "cycladic_culture_q4",
          text: "What recent research site has changed how scholars view Cycladic organization?",
          options: [
            "Keros and Dhaskalio",
            "Rome",
            "Giza",
            "Mohenjo-Daro"
          ],
          correctIndex: 0,
          explanation:
            "Keros and Dhaskalio show that Cycladic islanders organized ritual gatherings, building projects, and craft activity across island communities."
        },
        {
          id: "cycladic_culture_q5",
          text: "Why were boats so important in the Cyclades?",
          options: [
            "The islands were connected by rivers",
            "Boats turned the sea into a travel and trade route",
            "No one lived near the coast",
            "Boats replaced all farming"
          ],
          correctIndex: 1,
          explanation:
            "Island life depends on movement. Boats helped people exchange food, stone, metal, ideas, and ritual objects."
        },
        {
          id: "cycladic_culture_q6",
          text: "Which lesson is best supported by Cycladic archaeology?",
          options: [
            "Small islands cannot influence history",
            "Only literate societies can be complex",
            "Art, travel, and ritual can connect communities without writing",
            "All Bronze Age cultures were ruled by pharaohs"
          ],
          correctIndex: 2,
          explanation:
            "Cycladic people left little writing, but their art, settlements, and ritual deposits show organized and connected communities."
        },
        {
          id: "cycladic_culture_q7",
          text: "What is one reason historians avoid a single certain meaning for Cycladic figures?",
          options: [
            "Their exact ritual role is debated",
            "They were all found with instruction manuals",
            "They were made of plastic",
            "They only show animals"
          ],
          correctIndex: 0,
          explanation:
            "The figures may have been connected to burial, identity, ritual, or belief, but the evidence does not let historians settle on one simple answer."
        }
      ]
    }
  },
  'otzi': {
    heroImageUrl: "/images/lessons/otzi_hero.png",
    heroImageFit: "cover",
    summary:
      "Around 3300 BCE, a man now nicknamed Otzi climbs through a high Alpine pass near today's Italy-Austria border. He is not wandering empty-handed. His gear is a portable survival system: a copper axe with a yew handle, a flint dagger, a long unfinished bow, arrows in different stages of repair, a grass cloak, leather clothing stitched from several animals, fire-starting material, birch-bark containers, and fungi that may have helped with medicine or tinder. In a world without roads, maps, or rescue teams, every object has to earn its place.\n\n" +
      "Then the evidence turns dark. Otzi has a flint arrowhead lodged in his left shoulder, a deep cut on one hand, and blood traces linked to several people on his gear. Scientists cannot replay the final hour like a movie, but the clues point to violence, injury, and flight or pursuit. He eats a heavy final meal of ibex, red deer, einkorn wheat, and fat, then dies high at Tisenjoch. Snow and ice seal him away. Most prehistoric people leave only bones, stone tools, or pottery. Otzi leaves skin, hair, clothing, food, tools, tattoos, disease evidence, and a crime scene.\n\n" +
      "That is why the 1991 discovery mattered so much. Two hikers first thought they had found a modern accident victim. Radiocarbon dating revealed something stranger: a naturally preserved Copper Age man more than 5,000 years old. Since then, researchers have studied his DNA, stomach contents, pollen, tattoos, teeth, parasites, wounds, and equipment. The results make the Copper Age feel less blurry. Otzi lived among farming communities but still hunted, traveled, and carried mountain-ready gear. He was lactose intolerant, had worn joints, and probably suffered from intestinal parasites. His tattoos cluster near painful areas of the body, which may suggest treatment rather than decoration, though the exact purpose is debated.\n\n" +
      "Otzi's lesson is not just an ancient murder mystery. It is evidence literacy in one frozen body. A copper axe shows metalworking and status. Repair kits show planning. Pollen and food show movement through landscapes. Wounds show conflict. DNA shows ancestry and health, but not his name, language, personality, or the full reason he died. The ice preserved more than a person. It preserved a warning: the past is most powerful when we let artifacts speak clearly, without pretending they answer every question.",
    funFact:
      "Otzi had 61 tattoos, mostly simple lines and crosses. Many sit near his lower back, knees, ankles, and other worn or painful joints.",
    people: [
      {
        name: "Otzi the Iceman",
        role: "Copper Age Mountain Traveler",
        category: "Explorer",
        description:
          "A man who died in the Alps around 3300 BCE and was preserved by ice with his clothing, tools, food remains, wounds, and tattoos. He gives historians a rare person-level view of Copper Age Europe.",
        achievements: [
          "Carried one of the best-preserved prehistoric tool kits ever found",
          "Shows how farming, hunting, metal tools, and mountain travel overlapped in Copper Age Europe",
          "Preserved evidence of health, diet, clothing, injury, and ancestry"
        ],
        legacy:
          "Otzi is one of the most studied ancient individuals in the world because his body connects archaeology, medicine, genetics, and forensic science.",
        imageUrl: "https://www.iceman.it/wp-content/uploads/2016/09/01_iceman_mummy.jpg",
        imageFit: "contain"
      },
      {
        name: "Alpine Tool Maker",
        role: "Copper Age Craftsperson",
        category: "Worker",
        description:
          "A skilled maker who understands wood, flint, hide, plant fiber, and copper. Otzi's gear shows that survival depended on many crafts working together.",
        achievements: [
          "Shaped wood for bows, axe handles, and arrow shafts",
          "Prepared leather and plant fiber for clothing and containers",
          "Maintained repairable gear for travel through dangerous terrain"
        ],
        legacy:
          "The tool maker represents the practical intelligence behind prehistoric technology: carefully chosen materials fitted to real problems.",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/ReconstructedOetziAxe.jpg",
        imageFit: "contain"
      },
      {
        name: "Alpine Farmer-Herder",
        role: "Mountain Community Member",
        category: "Commoner",
        description:
          "A person from the farming and herding world around the Alps. Otzi's wheat, animal-hide clothing, and copper axe point to communities that mixed fields, livestock, hunting, and exchange.",
        achievements: [
          "Grew or traded for einkorn wheat and other farm products",
          "Raised or processed animals for hide, meat, and equipment",
          "Moved through mountain routes that linked valleys and communities"
        ],
        legacy:
          "Otzi's world was not simply hunter-gatherer or farmer. It was a mixed landscape where people combined old skills with new materials.",
        imageUrl: "https://www.iceman.it/wp-content/uploads/2016/09/07_clothing.jpg",
        imageFit: "cover"
      }
    ],
    inventions: [
      {
        name: "Alpine Survival Kit",
        description: "A portable set of tools, clothing, containers, repair materials, and fire-starting gear.",
        category: "Tool",
        date: "c. 3300 BCE",
        imageUrl: "https://www.iceman.it/wp-content/uploads/2016/09/11_tools.jpg",
        imageFit: "contain",
        problem: "Mountain travel is risky. A broken bowstring, wet fire starter, torn shoe, or dull blade can become life-threatening.",
        solution:
          "Carry a layered kit: knife, bow, arrows, axe, containers, cordage, tinder, spare parts, and clothing made from several animals and plant materials.",
        impact:
          "The kit reveals planning, repair culture, and detailed environmental knowledge before states, roads, or written instructions."
      },
      {
        name: "Copper Axe",
        description: "A nearly pure copper blade hafted into a yew handle.",
        category: "Technology",
        date: "c. 3300 BCE",
        imageUrl: "https://commons.wikimedia.org/wiki/Special:Redirect/file/ReconstructedOetziAxe.jpg",
        imageFit: "contain",
        problem: "Stone tools work, but metal can hold a sharp edge, be reshaped, and signal access to valuable materials and craft networks.",
        solution:
          "Smelt and shape copper into a blade, then fix it into a wooden handle with binding and adhesive.",
        impact:
          "Otzi's axe is key evidence that metal tools and exchange networks had reached Alpine communities by the Copper Age."
      },
      {
        name: "Therapeutic Tattooing",
        description: "Simple tattoos placed near worn or painful parts of the body.",
        category: "Medicine",
        date: "c. 3300 BCE",
        imageUrl: "https://www.iceman.it/wp-content/uploads/2016/09/06_tattoos.jpg",
        imageFit: "contain",
        problem:
          "People living hard physical lives suffered joint pain, back pain, injuries, and chronic illness without modern medicine.",
        solution:
          "Mark or treat painful areas with repeated lines and crosses made by inserting pigment into the skin.",
        impact:
          "The exact purpose is debated, but Otzi's tattoos show that body treatment, pain, and medical thinking have very deep roots."
      }
    ],
    places: [
      {
        name: "Tisenjoch Pass",
        description:
          "The high Alpine pass where Otzi died and was preserved by ice until hikers found him in 1991.",
        imageUrl: "https://www.iceman.it/wp-content/uploads/2016/09/03_finding_place.jpg",
        imageFit: "cover",
        location: "Otztal Alps, near the modern Italy-Austria border",
        significance:
          "The site turned a death in the mountains into an archaeological time capsule, preserving organic materials that normally decay."
      },
      {
        name: "South Tyrol Museum of Archaeology",
        description:
          "The museum in Bolzano, Italy, where Otzi and his equipment are conserved and studied.",
        imageUrl: "https://www.iceman.it/wp-content/uploads/2016/09/02_museum.jpg",
        imageFit: "cover",
        location: "Bolzano, South Tyrol, Italy",
        significance:
          "Its controlled cold chamber keeps the mummy stable while researchers continue to study the body and artifacts."
      }
    ],
    resources: [
      {
        title: "Otzi the Iceman",
        type: "Video",
        url: "https://www.youtube.com/watch?v=Lr9jXJE363w",
        isCore: true,
        description:
          "Introductory video overview of Otzi, his discovery, and why his preserved body matters for understanding Copper Age life."
      },
      {
        title: "Otzi the Iceman - South Tyrol Museum of Archaeology",
        type: "Article",
        url: "https://www.iceman.it/en/oetzi/the-iceman/",
        isCore: true,
        description:
          "Official museum overview of Otzi, his discovery, preservation, equipment, health, and historical importance."
      },
      {
        title: "The Equipment - South Tyrol Museum of Archaeology",
        type: "Article",
        url: "https://www.iceman.it/en/equipment/",
        isCore: false,
        description:
          "Official object-level guide to Otzi's clothing, tools, containers, weapons, and repair materials."
      },
      {
        title: "The Iceman's Last Meal - Current Biology",
        type: "Article",
        url: "https://www.cell.com/current-biology/fulltext/S0960-9822(18)30703-6",
        isCore: false,
        description:
          "Open scientific article reconstructing Otzi's final meal from stomach contents; advanced but excellent evidence."
      }
    ],
    quiz: {
      title: "Ice Archive Investigation",
      description: "Use the evidence from Otzi's body and gear to reconstruct Copper Age life.",
      collectibleCards: [
        { type: 'person', index: 0, id: 'otzi_person_iceman' },
        { type: 'person', index: 1, id: 'otzi_person_tool_maker' },
        { type: 'invention', index: 0, id: 'otzi_invention_survival_kit' },
        { type: 'invention', index: 1, id: 'otzi_invention_copper_axe' },
        { type: 'invention', index: 2, id: 'otzi_invention_therapeutic_tattooing' }
      ],
      questions: [
        {
          id: "otzi_q1",
          text: "Why is Otzi unusually valuable to archaeologists?",
          options: [
            "He left behind only a stone monument",
            "His body, clothing, tools, food remains, wounds, and tattoos were preserved together",
            "He wrote a diary about his travels",
            "He was the first king of Europe"
          ],
          correctIndex: 1,
          explanation:
            "Most Copper Age evidence is fragmentary. Otzi preserves a whole evidence package: body, gear, food, injuries, and context."
        },
        {
          id: "otzi_q2",
          text: "What does Otzi's copper axe show?",
          options: [
            "Metal tools had reached Alpine communities by the Copper Age",
            "Iron was common in Europe",
            "Otzi lived in the Roman Empire",
            "Stone tools had completely disappeared"
          ],
          correctIndex: 0,
          explanation:
            "The axe is strong evidence for copper technology and exchange networks, but it does not mean everyone had metal tools."
        },
        {
          id: "otzi_q3",
          text: "Which clue points most directly to violence in Otzi's final hours?",
          options: [
            "A flint arrowhead lodged in his shoulder",
            "His grass cloak",
            "His birch-bark containers",
            "His einkorn wheat"
          ],
          correctIndex: 0,
          explanation:
            "The arrowhead and other injuries are the strongest evidence that Otzi died after a violent encounter."
        },
        {
          id: "otzi_q4",
          text: "Why do historians avoid claiming they know exactly why Otzi died?",
          options: [
            "There is no evidence at all",
            "The evidence shows injury, movement, and conflict, but not the full motive or sequence",
            "Scientists refuse to study him",
            "His body was found in a written tomb"
          ],
          correctIndex: 1,
          explanation:
            "Good evidence can still have limits. Otzi tells us a lot about what happened to his body, but not the whole human story behind the attack."
        },
        {
          id: "otzi_q5",
          text: "What makes Otzi's tattoos historically interesting?",
          options: [
            "They spell his name",
            "They are placed near worn or painful parts of his body",
            "They show a map of the Alps",
            "They are painted on his clothing"
          ],
          correctIndex: 1,
          explanation:
            "Many tattoos cluster near joints and the lower back, which is why researchers discuss possible therapeutic uses."
        }
      ]
    }
  },  'stonehenge': {
    summary:
      "Stonehenge looks like a simple stone circle, but it’s actually the final stage of a project that took centuries.\n\n" +
      "Early builders dig a circular ditch and bank. Later, they haul in massive upright stones (sarsens) and smaller “bluestones” from far-away quarries, including in Wales. They arrange them in circles and horseshoes, carefully aligning some stones with the sunrise and sunset on the longest and shortest days of the year.\n\n" +
      "Stonehenge sits within a larger sacred landscape of burial mounds, processional paths, and other monuments. People likely gathered here for rituals tied to the sun, seasons, ancestors, and maybe healing. There is no writing, so we have to read the stones and bones to guess what they believed.",
    funFact:
      "Some of the smaller bluestones were dragged over 200 kilometers from their source—without wheels or trucks.",
    people: [
      {
        name: "Stonehenge Organizer",
        role: "Community Leader",
        category: "Leader",
        description:
          "Helps gather labor, food, and materials for multi-generation building projects at Stonehenge.",
        imageUrl: "/images/dawn_of_civilization/stonehenge_leader.jpg"
      },
      {
        name: "Neolithic Engineer",
        role: "Stone Mover",
        category: "Scientist",
        description:
          "Figures out how to transport, raise, and balance multi-ton stones using simple tools and teamwork.",
        imageUrl: "/images/dawn_of_civilization/stone_mover.jpg"
      }
    ],
    inventions: [
      {
        name: "Post-and-Lintel Megaliths",
        description: "Upright stones topped with horizontal stones, forming stable gateways.",
        category: "Architecture",
        imageUrl: "/images/dawn_of_civilization/stonehenge_arch.jpg",
        problem: "How to create a lasting, monumental structure using only simple tools and local materials.",
        solution:
          "Use large upright stones with carefully shaped tops and matching grooves in the horizontal lintels.",
        impact:
          "Creates one of the most iconic and long-lasting stone monuments in the world."
      }
    ],
    places: [
      {
        name: "Salisbury Plain Ritual Landscape",
        description:
          "An area filled with monuments, paths, and burial mounds that includes Stonehenge.",
        imageUrl: "/images/dawn_of_civilization/salisbury_plain.jpg",
        location: "Wiltshire, England",
        significance:
          "Shows that Stonehenge wasn’t alone—it was part of a whole region of sacred and social sites."
      }
    ],
    resources: [
      {
        title: "Stonehenge: What We Know",
        type: "Video",
        searchQuery: "Stonehenge documentary kids",
        isCore: true,
        description:
          "Short video explaining the phases of Stonehenge and the latest theories about its purpose."
      },
      {
        title: "Life and Death Near Stonehenge",
        type: "Article",
        searchQuery: "archaeology life near Stonehenge burials",
        isCore: false,
        description:
          "Looks at human remains from the area to understand who built and used the monument."
      }
    ]
  },
  'minoans': {
    summary:
      "On the island of Crete, a seafaring culture we call the Minoans builds large palace complexes at places like Knossos, Phaistos, and Malia.\n\n" +
      "These palaces have storerooms full of giant jars, workshops, and big courtyards that may have hosted ceremonies or games. Colorful wall paintings show ships, dolphins, athletic youths, and people vaulting over bulls. The Minoans use writing systems (Cretan hieroglyphic and Linear A), but we haven’t fully decoded them, so their own words are still mostly silent.\n\n" +
      "The Minoans trade widely across the eastern Mediterranean. Later Greek myths about King Minos, the Minotaur, and a labyrinth may be warped memories of this powerful island culture, combined with pure storytelling flair.",
    funFact:
      "Some Minoan art shows people of all genders wearing elaborate outfits and jewelry, which has sparked many theories about their social roles—and a lot of arguments.",
    people: [
      {
        name: "Minoan Sea Captain",
        role: "Merchant Navigator",
        category: "Explorer",
        description:
          "Sails between Crete, Egypt, and the Levant, carrying goods and news across the sea.",
        imageUrl: "/images/dawn_of_civilization/minoan_captain.jpg"
      }
    ],
    inventions: [
      {
        name: "Palace Complex",
        description:
          "A multi-story structure with storerooms, workshops, and ceremonial spaces linked together.",
        category: "Architecture",
        imageUrl: "/images/dawn_of_civilization/minoan_palace.jpg",
        problem: "How to coordinate storage, production, and ritual at the heart of a trading society.",
        solution:
          "Build large, interconnected complexes that act as both economic and religious centers.",
        impact:
          "Influences later Greek ideas about royal palaces and central courtyards."
      }
    ],
    places: [
      {
        name: "Knossos",
        description:
          "The largest Minoan palace site, often identified with the legendary palace of King Minos.",
        imageUrl: "/images/dawn_of_civilization/knossos.jpg",
        location: "Crete, Greece",
        significance:
          "Shows the scale and creativity of Minoan architecture and art, including the famous bull-leaping frescoes."
      }
    ],
    resources: [
      {
        title: "Minoan Civilization",
        type: "Video",
        searchQuery: "Minoan civilization Knossos documentary",
        isCore: true,
        description: "Overview of Minoan palaces, art, and trade."
      },
      {
        title: "Linear A: The Undeciphered Script of Crete",
        type: "Article",
        searchQuery: "Linear A undeciphered script",
        isCore: false,
        description:
          "Short article about the Minoan script we still can’t read—and what that means for history."
      }
    ]
  },
  'mycenaeans': {
    summary:
      "On mainland Greece, warrior elites build fortified palace centers at places like Mycenae, Pylos, and Tiryns.\n\n" +
      "Their palaces have megarons (great halls), storerooms, workshops, and archives of clay tablets written in Linear B—a script that turns out to be an early form of Greek used mostly for accounting. The Mycenaeans bury elites with gold masks, weapons, and jewelry. They trade widely and sometimes fight with other Bronze Age powers.\n\n" +
      "Later Greek myths about heroic kings, long wars, and giant walls likely preserve blurry echoes of this world. When the Bronze Age collapses, these palaces burn and Linear B disappears for centuries. Greece enters a so-called “Dark Age,” where writing is lost until a new alphabet appears much later.",
    funFact:
      "The huge stones in Mycenaean walls were so big that later Greeks joked only the one-eyed giants called Cyclopes could have lifted them—hence the term “Cyclopean walls.”",
    people: [
      {
        name: "Mycenaean Wanax",
        role: "Palace King",
        category: "Leader",
        description:
          "Rules from the palace, commands warriors, and directs religious festivals.",
        imageUrl: "/images/dawn_of_civilization/mycenaean_king.jpg"
      },
      {
        name: "Linear B Scribe",
        role: "Record Keeper",
        category: "Scientist",
        description:
          "Writes on wet clay tablets to track grain, oil, weapons, and workers for the palace.",
        imageUrl: "/images/dawn_of_civilization/linearb_scribe.jpg"
      }
    ],
    inventions: [
      {
        name: "Linear B Script",
        description: "A syllabic script used to write an early form of Greek.",
        category: "Literature",
        imageUrl: "/images/dawn_of_civilization/linearb_tablet.jpg",
        problem: "Palaces need to track resources and labor precisely.",
        solution:
          "Adapt a writing system to record names, goods, and numbers in the Greek language.",
        impact:
          "Earliest written Greek we know of, though mostly boring admin notes—not epics."
      }
    ],
    places: [
      {
        name: "Mycenae",
        description:
          "A hilltop fortress with giant stone walls, a palace, and rich tombs.",
        imageUrl: "/images/dawn_of_civilization/mycenae.jpg",
        location: "Peloponnese, Greece",
        significance:
          "Key site for understanding the Mycenaean world that later Greeks associated with legendary heroes."
      }
    ],
    resources: [
      {
        title: "The Mycenaeans",
        type: "Video",
        searchQuery: "Mycenaean civilization documentary",
        isCore: true,
        description: "Overview of Mycenaean palaces, warfare, and links to later Greek myths."
      }
    ]
  },
  'trojan_war': {
    summary:
      "According to Greek epics like the Iliad, a long war is fought between Greek heroes and the city of Troy after a prince of Troy carries off a Greek queen. The stories are full of gods, superhuman warriors, and dramatic speeches.\n\n" +
      "Archaeology shows there really was an important city at Hisarlik in northwest Turkey, sitting on a key trade route. It was destroyed and rebuilt several times, including around the Late Bronze Age. Hittite texts also mention a city and region that might be Troy under different names.\n\n" +
      "Most historians think the “Trojan War” we know from Homer is a blend: possibly some real conflicts over a real city plus centuries of retelling, exaggerating, and reshaping. For students, it’s a great case study in how myth and history can mix, and how later cultures turn distant wars into grand stories about honor and fate.",
    funFact:
      "The archaeological site of Troy has at least nine major layers of cities stacked on top of each other—“Troy” was not one city, but many built on the same spot.",
    people: [
      {
        name: "Homer (traditional author)",
        role: "Epic Poet (maybe)",
        category: "Artist",
        description:
          "The name later Greeks gave to the poet (or poets) who composed the Iliad and Odyssey, turning older war stories into epic poetry.",
        imageUrl: "/images/dawn_of_civilization/homer.jpg"
      },
      {
        name: "Trojan City Ruler",
        role: "Local King",
        category: "Leader",
        description:
          "A real Bronze Age ruler defending a wealthy port city at Hisarlik, whose struggles were later mythologized.",
        imageUrl: "/images/dawn_of_civilization/troy_king.jpg"
      }
    ],
    inventions: [
      {
        name: "Heroic Epic Tradition",
        description:
          "Turning old war stories into long poems exploring bravery, rage, honor, and grief.",
        category: "Literature",
        imageUrl: "/images/dawn_of_civilization/iliad_scroll.jpg",
        problem: "Memories of war fade or get scattered unless organized into powerful stories.",
        solution:
          "Compose structured epics that bards can perform, preserving both events and emotions across generations.",
        impact:
          "Shapes Greek identity and later Western literature’s ideas of “heroism” and “tragic flaw.”"
      }
    ],
    places: [
      {
        name: "Hisarlik (Troy)",
        description:
          "The hill where multiple versions of the city we call Troy were built and destroyed.",
        imageUrl: "/images/dawn_of_civilization/troy_ruins.jpg",
        location: "Northwest Turkey",
        significance:
          "Connects a legendary war to a real strategic city that controlled access between seas."
      }
    ],
    resources: [
      {
        title: "Troy: Myth and Reality",
        type: "Video",
        searchQuery: "Troy myth and reality documentary",
        isCore: true,
        description:
          "Explores what archaeology can tell us about the real city behind the legend."
      }
    ]
  }
};
