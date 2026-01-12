import { NodeContent } from '../../types';

export const FOUNDATIONS_AMERICAS_AFRICA: Record<string, NodeContent> = {
  'kerma': {
    summary:
      "South of Egypt, along the Nile in what is now Sudan, another powerful kingdom grows at a site we call Kerma.\n\n" +
      "Kerma has huge mudbrick buildings, including a massive round structure called a deffufa, plus rich burials with imported goods. For centuries, Kerma controls trade routes for gold, ivory, cattle, and exotic products. Egyptian texts often describe Nubians mainly as enemies or sources of slaves, but archaeology shows something different: a complex state with its own kings, art, and traditions.\n\n" +
      "Sometimes Kerma fights Egypt; sometimes the two trade or make alliances. Power shifts back and forth along the Nile. This reminds us that African history is not just a side story to Egypt—it’s many river kingdoms rising and falling, influencing each other in both war and peace.",
    funFact:
      "Some royal Kerma tombs included hundreds of sacrificed cattle arranged in neat rows—an enormous display of wealth and power.",
    people: [
      {
        name: "King of Kerma",
        role: "River Kingdom Ruler",
        category: "Leader",
        description:
          "A Nubian king who controlled trade, armies, and sacred ceremonies in the kingdom south of Egypt.",
        imageUrl: "/images/dawn_of_civilization/kerma_king.jpg"
      }
    ],
    inventions: [
      {
        name: "Deffufa Monument",
        description: "A massive mudbrick religious structure at the heart of Kerma.",
        category: "Architecture",
        imageUrl: "/images/dawn_of_civilization/deffufa.jpg",
        problem: "How to create a permanent, sacred center for rituals in a mudbrick-building culture.",
        solution:
          "Build huge, thick mudbrick towers and platforms that rise above the flat plain.",
        impact:
          "Shows that monumental building in the Nile Valley wasn’t limited to Egyptian stone pyramids."
      }
    ],
    places: [
      {
        name: "Kerma City",
        description:
          "A capital city with palaces, massive mudbrick monuments, and rich cemeteries.",
        imageUrl: "/images/dawn_of_civilization/kerma_city.jpg",
        location: "Northern Sudan",
        significance:
          "Proves that a powerful Nubian state flourished alongside, and sometimes against, ancient Egypt."
      }
    ],
    resources: [
      {
        title: "The Kingdom of Kerma",
        type: "Video",
        searchQuery: "Kerma Nubian kingdom documentary",
        isCore: true,
        description:
          "Intro to Nubian Kerma and how it interacted with Egypt."
      },
      {
        title: "Nubia: Egypt’s Rival on the Nile",
        type: "Article",
        searchQuery: "Kerma kingdom Nubia archaeology",
        isCore: false,
        description:
          "Article that explains why historians now treat Kerma as a major civilization, not just Egypt’s neighbor."
      }
    ]
  },
  'bantu_migration': {
    summary:
      "In West-Central Africa, groups of Bantu-speaking farmers begin slow, multi-century migrations that will reshape the language map of half a continent.\n\n" +
      "They bring with them farming techniques for crops like yams and, later, ironworking skills. Over generations, they move south and east, sometimes following rivers, sometimes pushing into forest regions. Along the way, they meet and mix with local hunter-gatherers and herders.\n\n" +
      "This isn’t one big marching army; it’s many small family groups moving, settling, staying, or moving again. The result, centuries later, is that hundreds of related Bantu languages are spoken across central, eastern, and southern Africa.",
    funFact:
      "Today, more than 200 million people speak a Bantu language—an echo of migrations that began over 3,000 years ago.",
    people: [
      {
        name: "Bantu Village Elder",
        role: "Community Leader",
        category: "Leader",
        description:
          "Helps decide when to stay put and when to move on in search of better land and water.",
        imageUrl: "/images/dawn_of_civilization/bantu_elder.jpg"
      }
    ],
    inventions: [
      {
        name: "Mixed Farming-Herding Economy",
        description:
          "Combining crops and livestock in flexible ways as families move into new environments.",
        category: "Economy",
        imageUrl: "/images/dawn_of_civilization/bantu_farming.jpg",
        problem: "Relying on only one food source is risky in changing climates.",
        solution:
          "Grow crops, keep animals, and adjust the mix as you move into forests, savannas, or highlands.",
        impact:
          "Supports population growth and allows communities to expand into many kinds of landscapes."
      }
    ],
    places: [
      {
        name: "Congo Forest Frontiers",
        description:
          "Edges of the central African rainforests where farming techniques meet dense woodland environments.",
        imageUrl: "/images/dawn_of_civilization/congo_frontier.jpg",
        location: "Central Africa",
        significance:
          "Highlights the adaptability of migrating families and how cultures change as they encounter new ecosystems."
      }
    ],
    resources: [
      {
        title: "The Bantu Migrations",
        type: "Video",
        searchQuery: "Bantu migrations explained animation",
        isCore: true,
        description:
          "Animated overview of how Bantu-speaking peoples spread across Africa."
      }
    ]
  },
  'olmec': {
    summary:
      "On the Gulf Coast of what is now Mexico, the Olmec build ceremonial centers with large platforms, plazas, and ballcourts long before the Aztecs or Maya.\n\n" +
      "They are famous for their colossal stone heads—massive sculptures with helmeted faces, likely representing rulers or important ballplayers. The Olmec farm maize, beans, and squash, carve jade, and create distinctive art with swirling, powerful figures.\n\n" +
      "Older textbooks sometimes called the Olmec a “mother culture” of later Mesoamerican civilizations. Modern scholars tend to see them more as one important “older sister” among several cultures sharing and trading ideas. Either way, they show that complex, city-like centers in the Americas go back much earlier than many people realize.",
    funFact:
      "Some colossal Olmec heads weigh more than 20 tons—moving them without wheels or big draft animals took serious planning and teamwork.",
    people: [
      {
        name: "Olmec Ruler",
        role: "Sacred King",
        category: "Leader",
        description:
          "A leader likely shown in the colossal heads, wearing a helmet-like headdress and commanding both ritual and political power.",
        imageUrl: "/images/dawn_of_civilization/olmec_ruler.jpg"
      }
    ],
    inventions: [
      {
        name: "Colossal Head Sculpture",
        description:
          "Giant basalt heads carved with individualized facial features and headgear.",
        category: "Art",
        imageUrl: "/images/dawn_of_civilization/olmec_head.jpg",
        problem: "How to show and reinforce the power of rulers in a landscape with no writing yet.",
        solution:
          "Carve enormous, realistic heads from stone and place them in important ceremonial spaces.",
        impact:
          "Becomes one of the most striking and mysterious forms of ancient American art, inspiring later cultures."
      }
    ],
    places: [
      {
        name: "San Lorenzo and La Venta",
        description:
          "Major Olmec centers with platforms, ritual spaces, and multiple colossal heads.",
        imageUrl: "/images/dawn_of_civilization/olmec_center.jpg",
        location: "Gulf Coast, Mexico",
        significance:
          "Show that complex social and religious centers existed in Mesoamerica during our Bronze Age era."
      }
    ],
    resources: [
      {
        title: "The Olmec: Early Mesoamerican Civilization",
        type: "Video",
        searchQuery: "Olmec civilization colossal heads documentary",
        isCore: true,
        description:
          "Visual overview of Olmec art, cities, and influence."
      }
    ]
  }
};