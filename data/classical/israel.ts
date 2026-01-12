import { NodeContent } from '../../types';

export const CLASSICAL_ISRAEL: Record<string, NodeContent> = {
  'david': {
    summary:
      "Around 1000 BCE, in the hills of ancient Canaan, a shepherd boy who once killed a giant would become the greatest king in Israelite history. David transformed a collection of feuding tribes into a unified kingdom, conquered the fortress city of Jerusalem, and established a dynasty that would shape three major religions. But his story is far from a simple tale of heroism—it's filled with triumph and tragedy, brilliant strategy and terrible mistakes, making him one of history's most human leaders.\n\n" +
      "Before David, the Israelite tribes were loosely united under King Saul, constantly fighting off enemies like the Philistines (seafaring warriors with iron weapons). Young David first gained fame by defeating the Philistine champion Goliath with a sling and stone—a story that entered legend. But David's success made Saul jealous, forcing David to become an outlaw hiding in caves. When Saul died in battle around 1010 BCE, David was crowned king of Judah (the southern tribes). Seven years later, after a civil war, the northern tribes also accepted him as king, finally uniting all twelve tribes of Israel under one ruler.\n\n" +
      "David's greatest strategic move was capturing Jerusalem around 1000 BCE. This hilltop fortress city sat right on the border between north and south and belonged to no tribe—the perfect neutral capital. David made it the 'City of David' and brought the Ark of the Covenant there, making Jerusalem both a political and religious center. He then embarked on military campaigns that expanded Israel's borders dramatically. He defeated the Philistines, conquered the Moabites and Ammonites, and pushed north into Syria. For the first time, Israel controlled trade routes and collected tribute from neighboring kingdoms. David organized a professional army, established an administration, and turned a tribal confederation into a real state.\n\n" +
      "But the Biblical accounts don't hide David's flaws. He committed adultery with Bathsheba and arranged her husband's death in battle—an act the prophet Nathan condemned publicly. Family tragedies followed: his son Amnon assaulted his half-sister Tamar, another son Absalom murdered Amnon and later rebelled against David, nearly taking the throne. David spent his final years as a frail old man while his sons competed for succession. Yet despite these failures, tradition remembers David as Israel's ideal king—brave, passionate, repentant, a warrior who also wrote psalms. He established Jerusalem as an eternal capital (still fought over 3,000 years later), created a kingdom that his son Solomon would turn into an empire, and became the model king in Jewish, Christian, and Islamic tradition. Christians believe the promised Messiah would come from David's lineage, making this ancient shepherd-king central to religions practiced by billions today.",
    funFact:
      "According to tradition, King David wrote many of the Psalms—ancient songs and poems still sung in churches and synagogues today. Psalm 23 ('The Lord is my shepherd') is one of the most famous poems ever written, composed by a king who started his life as an actual shepherd!",
    people: [
      {
        name: "King David",
        role: "Second King of United Israel",
        category: "Leader",
        description:
          "Former shepherd and warrior who united the twelve tribes of Israel, conquered Jerusalem, and established a dynasty that shaped Judaism, Christianity, and Islam. Remembered as a warrior-poet who wrote psalms and a flawed but repentant king.",
        born: "c. 1040 BCE",
        died: "c. 970 BCE",
        achievements: [
          "United the twelve tribes of Israel into one kingdom",
          "Conquered Jerusalem and made it Israel's capital",
          "Defeated the Philistines and expanded Israel's borders",
          "Brought the Ark of the Covenant to Jerusalem",
          "Established the Davidic dynasty and wrote many Psalms"
        ],
        legacy: "Model of the ideal king in Jewish tradition. Christians believe Jesus descended from David's line. His establishment of Jerusalem as a holy city affects global politics even today, 3,000 years later.",
        imageUrl: "/images/classical/king_david.jpg"
      },
      {
        name: "King Saul",
        role: "First King of Israel",
        category: "Leader",
        description:
          "Israel's first king who united the tribes but grew jealous of David's success. Died fighting the Philistines around 1010 BCE, paving the way for David's kingship.",
        born: "c. 1080 BCE",
        died: "c. 1010 BCE",
        imageUrl: "/images/classical/king_saul.jpg"
      },
      {
        name: "Bathsheba",
        role: "Queen of Israel",
        category: "Leader",
        description:
          "Wife of Uriah the Hittite, later wife of David after a scandal that the prophet Nathan publicly condemned. Mother of Solomon, who would succeed David as king.",
        imageUrl: "/images/classical/bathsheba.jpg"
      },
      {
        name: "Prophet Nathan",
        role: "Royal Prophet",
        category: "Religious",
        description:
          "Bold prophet who confronted King David about his affair with Bathsheba by telling a parable about a rich man stealing a poor man's lamb. When David condemned the rich man, Nathan declared 'You are that man!'—one of history's most dramatic truth-to-power moments.",
        imageUrl: "/images/classical/prophet_nathan.jpg"
      }
    ],
    inventions: [
      {
        name: "Unified Israelite Kingdom",
        description: "Political structure uniting twelve previously independent tribes under one monarchy",
        category: "Government",
        problem: "Twelve Israelite tribes were loosely connected and weak against organized enemies like the Philistines",
        solution: "David united north and south by conquering a neutral capital (Jerusalem), establishing central administration, and creating a professional army",
        impact: "Created a kingdom that lasted 400+ years and established Jerusalem as one of history's most significant cities"
      },
      {
        name: "Jerusalem as Sacred Capital",
        description: "Establishing a neutral city as both political and religious center",
        category: "Government",
        problem: "Each tribe had its own territory and sacred sites, making unity difficult",
        solution: "Captured Jerusalem (which belonged to no tribe) and brought the Ark of the Covenant there, creating a shared holy site",
        impact: "Made Jerusalem the eternal capital of Jewish identity and sacred to billions of Christians and Muslims today"
      }
    ],
    places: [
      {
        name: "Jerusalem (City of David)",
        description: "Ancient fortress city on the border between northern and southern tribes",
        location: "Judean Hills, modern Israel/Palestine",
        significance: "David conquered this neutral city around 1000 BCE and made it Israel's capital. It remains one of the world's most contested and sacred cities, holy to Jews, Christians, and Muslims.",
        lore: "The 'City of David' was built on a steep hill with natural defenses. David's men entered through a water shaft, capturing it from the Jebusites. Today, archaeologists still debate which ruins belong to David's original city."
      },
      {
        name: "Hebron",
        description: "Ancient city where David was first crowned king of Judah",
        location: "Southern Judea",
        significance: "David ruled from Hebron for seven years before conquering Jerusalem. It's also the traditional burial place of Abraham, making it sacred in Jewish tradition."
      }
    ],
    resources: [
      {
        title: "The Real King David - Documentary",
        type: "Video",
        searchQuery: "King David ancient Israel documentary",
        isCore: true,
        description: "Archaeological and historical look at the real David behind the Biblical stories"
      },
      {
        title: "The Psalms of David",
        type: "Video",
        searchQuery: "Psalms of David explained for kids",
        isCore: false,
        description: "Understanding the ancient songs and poems attributed to King David"
      },
      {
        title: "Archaeology of David's Jerusalem",
        type: "Article",
        searchQuery: "City of David archaeological discoveries",
        isCore: false,
        description: "What archaeologists have found (and debated) about David's capital city"
      }
    ],
    quiz: {
      title: "King David's Kingdom",
      questions: [
        {
          id: "david_q1",
          text: "What was David's most important strategic move as king?",
          options: [
            "Defeating Goliath with a sling",
            "Conquering Jerusalem and making it the capital",
            "Writing the Psalms",
            "Building the First Temple"
          ],
          correctIndex: 1,
          explanation: "Capturing Jerusalem was brilliant strategy. This neutral city belonged to no tribe, making it a perfect capital that united north and south. David brought the Ark of the Covenant there, making it both a political and religious center."
        },
        {
          id: "david_q2",
          text: "What makes David's Biblical story unusual for an ancient king?",
          options: [
            "It only talks about his victories",
            "It hides all his military defeats",
            "It honestly describes his mistakes and moral failures",
            "It claims he never died"
          ],
          correctIndex: 2,
          explanation: "Unlike most ancient royal propaganda, the Biblical accounts of David don't hide his flaws. They describe his adultery, his arrangement of Uriah's death, his family tragedies, and his repentance—making him remarkably human for an ancient hero-king."
        },
        {
          id: "david_q3",
          text: "Why is David important to Christianity and Islam, not just Judaism?",
          options: [
            "He conquered their holy cities",
            "He wrote their holy books",
            "Christians believe Jesus descended from David; Muslims honor him as a prophet",
            "He invented their religious practices"
          ],
          correctIndex: 2,
          explanation: "David's legacy extends across three religions. Christians believe Jesus was 'Son of David'—the promised Messiah from David's lineage. Muslims honor Dawud (David) as a prophet and righteous king. His impact on religious history is enormous."
        }
      ],
      rewardArtifact: {
        id: "davids_harp",
        name: "David's Harp",
        description: "Legendary instrument the shepherd-king played while composing Psalms",
        rarity: "Epic"
      }
    }
  }
};
