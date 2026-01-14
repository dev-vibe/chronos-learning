import { NodeContent } from '../../../types';

export const FOUNDATIONS_LEVANT: Record<string, NodeContent> = {
  'abraham': {
    summary:
      "Stories about a man named Abram/Abraham appear in the Hebrew Bible. In these stories, he leaves his home in Mesopotamia and travels to Canaan because one God calls him to go.\n\n" +
      "This God makes a covenant—a sacred agreement—with Abraham, promising land and many descendants in exchange for loyalty and obedience. Abraham’s life is full of tests, family drama, and encounters with both kings and ordinary people. Later traditions see him as a founding ancestor of the Israelites, and indirectly of Judaism, Christianity, and Islam.\n\n" +
      "Historically, it’s hard to match one person to archaeology here. The stories were written down long after the time they describe and blend memory, faith, and storytelling. What we can say is that they reflect real Middle Bronze Age life in the Levant: herders, small city-states, oaths, and long journeys between Mesopotamia and Canaan.",
    funFact:
      "Different traditions remember Abraham in different ways—but almost all of them agree that hospitality (treating guests well) is one of his key virtues.",
    people: [
      {
        name: "Abraham",
        role: "Patriarch",
        category: "Leader",
        description:
          "A semi-nomadic herder and clan leader who becomes a central figure in the sacred stories of later religions.",
        imageUrl: "/images/dawn_of_civilization/abraham.jpg"
      }
    ],
    inventions: [
      {
        name: "Covenant Tradition",
        description: "A sacred promise or treaty between God and humans, sealed with rituals.",
        category: "Religion",
        imageUrl: "/images/dawn_of_civilization/covenant.jpg",
        problem:
          "How do you express a relationship between a powerful God and a small human group in a way people can remember and act on?",
        solution:
          "Use a covenant—an agreement with signs, promises, and obligations on both sides.",
        impact:
          "Becomes a central idea in later religious thought about law, loyalty, and identity."
      }
    ],
    places: [
      {
        name: "Canaan",
        description:
          "Region of hills and plains between Mesopotamia and Egypt, dotted with small cities and farms.",
        imageUrl: "/images/dawn_of_civilization/canaan.jpg",
        location: "Roughly modern Israel, Palestine, Lebanon, and surrounding areas",
        significance:
          "The setting for many of the Abraham stories and a crossroads of trade and cultures."
      }
    ],
    resources: [
      {
        title: "Abraham: Between Story and History",
        type: "Article",
        searchQuery: "Abraham historical context Middle Bronze Age Canaan",
        isCore: false,
        description:
          "Explains what archaeology can and can’t tell us about the world behind the Abraham stories."
      }
    ]
  },
  'hittites': {
    summary:
      "In central Anatolia, the Hittites build a kingdom that becomes one of the great powers of the Late Bronze Age.\n\n" +
      "Their capital, Hattusa, is surrounded by thick walls and decorated gates. They adopt cuneiform writing for many records and use their own picture-script on monuments. Hittite armies are known for their chariots and for being tough opponents of Egypt, Mitanni, and other neighbors.\n\n" +
      "Hittite law codes show a mix of strict and surprisingly mild rules compared to some other Near Eastern law systems. They also seem to be early experimenters with iron, though iron is still rare and special at this time.",
    funFact:
      "For a long time, many historians thought the Hittites were just a name in the Bible. It wasn’t until archaeologists uncovered Hattusa that their empire became real again.",
    people: [
      {
        name: "Hittite Great King",
        role: "Imperial Ruler",
        category: "Leader",
        description:
          "Negotiates treaties, leads armies, and manages a patchwork of vassal states and allies.",
        imageUrl: "/images/dawn_of_civilization/hittite_king.jpg"
      },
      {
        name: "Hittite Charioteer",
        role: "Elite Warrior",
        category: "Warrior",
        description:
          "Drives a two- or three-man chariot in battle, coordinating speed, archery, and close combat.",
        imageUrl: "/images/dawn_of_civilization/hittite_chariot.jpg"
      }
    ],
    inventions: [
      {
        name: "Diplomatic Treaties",
        description:
          "Detailed agreements between kings, including oaths, terms, and lists of gods as witnesses.",
        category: "Government",
        imageUrl: "/images/dawn_of_civilization/hittite_treaty.jpg",
        problem: "Big empires need more than just force to manage other powerful neighbors.",
        solution:
          "Write formal treaties that promise peace, alliances, or shared borders—and back them up with sacred oaths.",
        impact:
          "Influences later treaty traditions, including the famous Egyptian–Hittite peace treaty after the Battle of Kadesh."
      }
    ],
    places: [
      {
        name: "Hattusa",
        description:
          "The fortified capital of the Hittite Empire, with temples, palaces, and carved gates.",
        imageUrl: "/images/dawn_of_civilization/hattusa.jpg",
        location: "Near modern Boğazkale, Turkey",
        significance:
          "The archives found here revealed the Hittites’ laws, letters, and international politics."
      }
    ],
    resources: [
      {
        title: "The Hittites: Lost Empire",
        type: "Video",
        searchQuery: "Hittites Hattusa documentary",
        isCore: true,
        description:
          "Documentary on how the Hittite Empire rose, ruled, and disappeared."
      }
    ]
  },
  'kadesh': {
    summary:
      "Around 1274 BCE, two superpowers clash near the city of Kadesh: Egypt under Ramesses II and the Hittite Empire under Muwatalli II.\n\n" +
      "Both sides bring large armies with hundreds of chariots. Ramesses’ scribes later depict him as a nearly solo superhero who turns the tide in battle. Hittite records suggest a more balanced outcome. Modern historians think the battle was essentially a draw, with both armies suffering heavy losses.\n\n" +
      "The more important result comes afterward: Egypt and the Hittites eventually sign a written peace treaty, agreeing not to fight, to return runaway subjects, and to support each other in some crises. Copies survive in both Egyptian hieroglyphs and Hittite cuneiform, making it one of the earliest known peace treaties in history.",
    funFact:
      "A version of the Egyptian–Hittite peace treaty is displayed at the United Nations headquarters as an ancient example of diplomacy.",
    people: [
      {
        name: "Ramesses II",
        role: "Egyptian Pharaoh",
        category: "Leader",
        description:
          "A long-ruling king who presented himself as a mighty warrior at Kadesh, regardless of the messy truth.",
        imageUrl: "/images/dawn_of_civilization/ramesses.jpg"
      },
      {
        name: "Muwatalli II",
        role: "Hittite Great King",
        category: "Leader",
        description:
          "Commands the Hittite forces at Kadesh and negotiates peace once both sides realize endless war is too costly.",
        imageUrl: "/images/dawn_of_civilization/muwatalli.jpg"
      }
    ],
    inventions: [
      {
        name: "Formal Peace Treaty",
        description:
          "A written agreement between rival empires that sets rules for peace and mutual aid.",
        category: "Government",
        imageUrl: "/images/dawn_of_civilization/kadesh_treaty.jpg",
        problem: "Continuous war drains resources and threatens both empires.",
        solution:
          "Negotiate a detailed treaty, have both sides swear oaths before their gods, and carve the text into durable materials.",
        impact:
          "Shows that even in an age of chariots and conquest, diplomacy and written agreements matter."
      }
    ],
    places: [
      {
        name: "Kadesh",
        description:
          "A strategically placed city on trade routes between Egypt, the Hittites, and the Levant.",
        imageUrl: "/images/dawn_of_civilization/kadesh_city.jpg",
        location: "Modern Syria, near the Orontes River",
        significance:
          "So important that two great empires were willing to risk huge battles to control it."
      }
    ],
    resources: [
      {
        title: "Battle of Kadesh",
        type: "Video",
        searchQuery: "Battle of Kadesh Ramesses Hittites documentary",
        isCore: true,
        description:
          "Explains the battle, the propaganda, and the peace treaty that followed."
      }
    ]
  },
  'phoenicians': {
    summary:
      "Along the eastern Mediterranean coast, city-states like Tyre, Sidon, and Byblos specialize in seafaring trade. Later Greeks call their people Phoenicians.\n\n" +
      "Phoenician ships carry timber, metals, glass, purple-dyed cloth, and other goods across the sea. They establish trading posts and colonies, including Carthage in North Africa. To keep business moving, they use a simple but powerful tool: an alphabet with around 22 letters for consonant sounds.\n\n" +
      "This alphabet is much easier to learn than complex pictorial systems. Greeks adapt it, adding symbols for vowels. Later, the Latin, Hebrew, and Arabic scripts all grow out of this idea. In other words: a lot of the letters you’re reading right now have ancient Phoenician grandparents.",
    funFact:
      "The famous purple dye the Phoenicians sold came from thousands of crushed sea snails—and smelled absolutely awful during production.",
    people: [
      {
        name: "Phoenician Navigator",
        role: "Sea Trader",
        category: "Explorer",
        description:
          "Sails across the Mediterranean, guided by stars and coastlines, connecting distant ports.",
        imageUrl: "/images/dawn_of_civilization/phoenician_sailor.jpg"
      },
      {
        name: "Phoenician Scribe",
        role: "Letter Writer",
        category: "Scientist",
        description:
          "Uses the alphabet to record deals, labels, and inscriptions quickly and efficiently.",
        imageUrl: "/images/dawn_of_civilization/phoenician_scribe.jpg"
      }
    ],
    inventions: [
      {
        name: "Phoenician Alphabet",
        description:
          "A streamlined set of letter signs representing consonant sounds.",
        category: "Literature",
        imageUrl: "/images/dawn_of_civilization/phoenician_alphabet.jpg",
        date: "c. 1050 BCE",
        problem:
          "Complex scripts are hard and time-consuming to learn, limiting who can write.",
        solution:
          "Use a small set of letters for sounds, leaving most vowels to be guessed from context.",
        impact:
          "Makes writing more accessible and becomes the ancestor of many modern alphabets."
      }
    ],
    places: [
      {
        name: "Tyre",
        description:
          "A powerful Phoenician island-city known for trade, shipbuilding, and purple dye.",
        imageUrl: "/images/dawn_of_civilization/tyre.jpg",
        location: "Coast of modern Lebanon",
        significance:
          "Illustrates how a small coastal city can punch far above its weight in world history through trade and navigation."
      }
    ],
    resources: [
      {
        title: "The Phoenicians and the Alphabet",
        type: "Video",
        searchQuery: "Phoenicians alphabet trade documentary",
        isCore: true,
        description:
          "Explains Phoenician trade and how their alphabet spread."
      }
    ]
  },
  'zoroastrianism': {
    summary:
      "In ancient Iran, a religious teacher later called Zoroaster (or Zarathustra) develops ideas that will shape beliefs across the region.\n\n" +
      "He teaches that there is one supreme god, Ahura Mazda, who represents truth, light, and goodness. Opposed to Ahura Mazda is a destructive spirit associated with lies and chaos. Humans are not bystanders—they must choose sides through their thoughts, words, and actions.\n\n" +
      "Zoroastrianism emphasizes free will, moral responsibility, and a final judgment after death. It talks about heaven- and hell-like states and a future renewal of the world where good ultimately wins. Later Persian empires adopt it as an official religion, and some of its ideas echo into Judaism, Christianity, and Islam.",
    funFact:
      "Traditional Zoroastrians practice “sky burial,” leaving bodies exposed in special towers so vultures, not earth or fire, handle the remains—respecting earth, water, and fire as sacred.",
    people: [
      {
        name: "Zoroaster (Zarathustra)",
        role: "Religious Reformer",
        category: "Leader",
        description:
          "A spiritual teacher whose ideas about good and evil, free will, and judgment influenced later religions.",
        imageUrl: "/images/dawn_of_civilization/zoroaster.jpg"
      }
    ],
    inventions: [
      {
        name: "Cosmic Dualism",
        description:
          "A worldview that sees the universe as a battleground between truth/order and lie/chaos.",
        category: "Religion",
        imageUrl: "/images/dawn_of_civilization/zoroastrian_symbol.jpg",
        problem:
          "People struggle to understand why a good world includes so much suffering and injustice.",
        solution:
          "Explain reality as a temporary struggle between a good creator and a destructive opponent, with humans playing a role.",
        impact:
          "Shapes later thinking about good vs. evil and personal moral responsibility."
      }
    ],
    places: [
      {
        name: "Fire Temples",
        description:
          "Zoroastrian worship sites where a sacred fire is tended continually as a symbol of truth and purity.",
        imageUrl: "/images/dawn_of_civilization/fire_temple.jpg",
        location: "Ancient Iran and beyond",
        significance:
          "Serve as centers of worship and community, and as visible signs of a faith centered on light and truth."
      }
    ],
    resources: [
      {
        title: "Who Was Zoroaster?",
        type: "Video",
        searchQuery: "Zoroaster Zoroastrianism origins explained",
        isCore: true,
        description:
          "Intro to Zoroaster’s life (as far as we know) and core teachings."
      },
      {
        title: "Zoroastrianism’s Influence on Later Religions",
        type: "Article",
        searchQuery: "Zoroastrianism influence on Judaism Christianity Islam",
        isCore: false,
        description:
          "Explores how ideas about judgment, angels, and evil may have crossed between traditions."
      }
    ]
  }
};