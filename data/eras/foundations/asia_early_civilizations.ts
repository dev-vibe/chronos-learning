import { NodeContent } from '../../../types';

export const FOUNDATIONS_ASIA: Record<string, NodeContent> = {
  'indus_script': {
    summary:
      "Small carved seals from the Indus Valley show animals and short lines of mysterious symbols. We’re pretty sure this is writing, but it doesn’t look like any script we already know.\n\n" +
      "Most inscriptions are only a handful of characters long, and we have no bilingual “decoder key” like the Rosetta Stone. Computer studies show that the symbols follow patterns like language, not random doodles, but nobody has cracked the code for sure.\n\n" +
      "Because of this, the inner life of the Indus civilization is silent to us. We can see their careful city planning, bricks, drains, and trade goods—but we don’t know what they called themselves, what their laws were, or which gods they honored. The script is a locked door, waiting for someone to find the key.",
    funFact:
      "Some Indus seals show a unicorn-like animal that may not match any real creature—possibly a mythical or symbolic beast.",
    people: [
      {
        name: "Seal Carver",
        role: "Engraver",
        category: "Artist",
        description:
          "Carves tiny images and symbols into hard stone seals that are used to mark goods and documents.",
        imageUrl: "/images/dawn_of_civilization/indus_seal_carver.jpg"
      },
      {
        name: "Modern Epigrapher",
        role: "Script Decoder",
        category: "Scientist",
        description:
          "A modern scholar who tries to understand the Indus signs using math, linguistics, and pattern analysis.",
        imageUrl: "/images/dawn_of_civilization/epigrapher.jpg"
      }
    ],
    inventions: [
      {
        name: "Indus Seal Script",
        description: "A system of signs used on seals and pottery, probably representing names or titles.",
        category: "Literature",
        imageUrl: "/images/dawn_of_civilization/indus_script.jpg",
        problem: "Traders and officials need to label goods and prove who they belong to.",
        solution:
          "Create a system of repeated signs to stamp onto clay and mark ownership or origin.",
        impact:
          "Shows that the Indus world had sophisticated communication systems, even though the exact messages are still a mystery."
      }
    ],
    places: [
      {
        name: "Harappa Seal Workshops",
        description:
          "Areas in Indus cities where large numbers of seals and sealings have been found together.",
        imageUrl: "/images/dawn_of_civilization/harappa_workshop.jpg",
        location: "Punjab region, Pakistan",
        significance:
          "Hints at organized production of official seals, not just random private artwork."
      }
    ],
    resources: [
      {
        title: "Mystery of the Indus Script",
        type: "Video",
        searchQuery: "Indus script undeciphered writing documentary",
        isCore: true,
        description:
          "Overview of what we know—and don’t know—about this still-undeciphered writing system."
      },
      {
        title: "Can Computers Crack the Indus Script?",
        type: "Article",
        searchQuery: "computer analysis indus script entropy patterns",
        isCore: false,
        description:
          "Explains how modern tech is being used to study patterns in the Indus symbols."
      }
    ]
  },
  'indus_cities': {
    summary:
      "Along the Indus River and its tributaries, people build cities like Mohenjo-Daro and Harappa with a level of planning that would impress a modern city engineer.\n\n" +
      "Streets run in a grid pattern. Many houses have their own bathrooms and drains that connect to covered sewers under the streets. There are large public buildings, including a “Great Bath,” granaries, and possible assembly halls. Bricks are almost perfectly standardized in size from city to city.\n\n" +
      "What we don’t see are giant palaces or huge temples towering over everyone. This makes historians think the Indus civilization might have been organized differently from Egypt or Mesopotamia—maybe with more emphasis on merchants, councils, or citywide cooperation instead of one all-powerful king.",
    funFact:
      "Some Indus houses had trash chutes built into the wall, so people could slide garbage out into the street rather than carry it through the house.",
    people: [
      {
        name: "Indus City Planner",
        role: "Urban Architect",
        category: "Scientist",
        description:
          "Helps lay out streets, drains, and building plots so the city functions smoothly.",
        imageUrl: "/images/dawn_of_civilization/indus_planner.jpg"
      },
      {
        name: "Indus Merchant",
        role: "Trader",
        category: "Explorer",
        description:
          "Trades beads, cotton cloth, and other goods up and down the river and across the sea.",
        imageUrl: "/images/dawn_of_civilization/indus_merchant.jpg"
      }
    ],
    inventions: [
      {
        name: "Urban Drainage Systems",
        description:
          "Covered drains running under streets, connected to household waste outlets.",
        category: "Infrastructure",
        imageUrl: "/images/dawn_of_civilization/indus_drains.jpg",
        problem: "Wastewater and sewage can flood streets and spread disease in dense settlements.",
        solution:
          "Build brick-lined drains with access points and connect them to houses and baths.",
        impact:
          "Shows advanced public health and engineering; some later civilizations had worse drainage than the Indus cities."
      }
    ],
    places: [
      {
        name: "Mohenjo-Daro",
        description:
          "One of the largest Indus cities, with a Great Bath, granaries, and carefully laid-out neighborhoods.",
        imageUrl: "/images/dawn_of_civilization/mohenjo_daro.jpg",
        location: "Sindh, Pakistan",
        significance:
          "Gives us our clearest look at how the Indus people built and organized their cities."
      }
    ],
    resources: [
      {
        title: "Crash Course: Indus Valley Civilization",
        type: "Video",
        searchQuery: "Crash Course World History Indus Valley",
        isCore: true,
        description: "Fast-paced overview of the Indus cities and what makes them unique."
      },
      {
        title: "Plumbing Before Pyramids?",
        type: "Article",
        searchQuery: "Indus Valley drainage and plumbing article",
        isCore: false,
        description:
          "Explains why some historians say the Indus had better plumbing than many later empires."
      }
    ]
  },
  'shang': {
    summary:
      "In northern China, the Shang dynasty rules from a series of walled cities. Their power rests on war, ancestor worship, and control of bronze.\n\n" +
      "Shang elites cast heavy bronze vessels decorated with dragons, masks, and swirling patterns. These vessels are used in rituals involving food, drink, and sometimes human and animal sacrifice. Shang kings also ask questions to their ancestors and gods by heating animal bones and turtle shells until they crack—the famous oracle bones.\n\n" +
      "The questions and answers carved on these bones are our earliest large body of Chinese writing. They tell us about battles, harvests, disease, royal childbirth, and even toothaches. We see a world where kings constantly worry about keeping ancestors happy so that the kingdom stays safe.",
    funFact:
      "Some oracle bone inscriptions may record the very first Chinese character forms of words that are still used today.",
    people: [
      {
        name: "Shang King",
        role: "War Leader and High Priest",
        category: "Leader",
        description:
          "Commands armies, conducts rituals, and interprets messages from royal ancestors.",
        imageUrl: "/images/dawn_of_civilization/shang_king.jpg"
      },
      {
        name: "Bronze Caster",
        role: "Metal Specialist",
        category: "Scientist",
        description:
          "Works in teams to prepare molds and pour molten bronze into heavy ritual vessels.",
        imageUrl: "/images/dawn_of_civilization/shang_caster.jpg"
      }
    ],
    inventions: [
      {
        name: "Piece-Mold Bronze Casting",
        description:
          "A casting technique using clay molds in multiple pieces to create complex shapes and patterns.",
        category: "Technology",
        imageUrl: "/images/dawn_of_civilization/shang_bronze.jpg",
        problem: "Simple casting methods can’t easily create thick, detailed vessels with raised designs.",
        solution:
          "Shape a model, make a clay mold around it, cut the mold into pieces, and reassemble them for casting.",
        impact:
          "Allows incredibly intricate ritual bronzes that display Shang wealth and power."
      }
    ],
    places: [
      {
        name: "Anyang (Yin)",
        description:
          "A late Shang capital city where many oracle bones and royal tombs have been found.",
        imageUrl: "/images/dawn_of_civilization/anyang.jpg",
        location: "Henan Province, China",
        significance:
          "Provides the main archaeological evidence for Shang kings, rituals, and early Chinese writing."
      }
    ],
    resources: [
      {
        title: "The Shang Dynasty and Oracle Bones",
        type: "Video",
        searchQuery: "Shang dynasty oracle bones documentary",
        isCore: true,
        description:
          "Overview of Shang politics, religion, and the oracle bone system."
      }
    ]
  },
  'oracle_bones': {
    summary:
      "Shang kings in China don’t make major decisions without consulting their ancestors and gods. One of their main tools is the oracle bone.\n\n" +
      "Priests or scribes carve a question into a cattle shoulder blade or turtle shell. Questions might be about the weather, hunting, warfare, childbirth, or the king’s health. Then they heat the bone until it cracks. The pattern of cracks is read as an answer. Sometimes the answer and the outcome are carved onto the bone as well.\n\n" +
      "These oracle bones give us direct access to what Shang rulers cared about day-to-day. They also preserve early forms of Chinese characters, making them vital to understanding the roots of one of the world’s longest-lasting writing traditions.",
    funFact:
      "For a while, oracle bones were ground up and sold as “dragon bones” for traditional medicine—until someone noticed they were covered in ancient writing.",
    people: [
      {
        name: "Shang Diviner",
        role: "Ritual Specialist",
        category: "Priest",
        description:
          "Performs the heating, reads the cracks, and helps the king interpret the will of ancestors.",
        imageUrl: "/images/dawn_of_civilization/shang_diviner.jpg"
      }
    ],
    inventions: [
      {
        name: "Oracle Bone Divination System",
        description:
          "A formal method of asking questions to the spirit world, recording both question and answer.",
        category: "Religion",
        imageUrl: "/images/dawn_of_civilization/oracle_bone.jpg",
        problem:
          "Kings want guidance on decisions but also need a way to record what was asked and answered.",
        solution:
          "Combine ritual cracking with written inscriptions on durable bone and shell.",
        impact:
          "Creates a priceless historical record of early Chinese writing and royal concerns."
      }
    ],
    places: [
      {
        name: "Anyang Royal Archives",
        description:
          "Deposits of broken oracle bones buried near Shang ritual sites.",
        imageUrl: "/images/dawn_of_civilization/anyang_bones.jpg",
        location: "Henan Province, China",
        significance:
          "Thousands of bones from here allow scholars to reconstruct Shang history and language."
      }
    ],
    resources: [
      {
        title: "Reading the Bones: Shang Divination",
        type: "Video",
        searchQuery: "oracle bones Shang dynasty explanation",
        isCore: true,
        description:
          "Shows how oracle bones were prepared, cracked, and read."
      }
    ]
  }
};