import { NodeContent } from '../../../types';

export const CLASSICAL_ROME: Record<string, NodeContent> = {
  'rome_founded': {
    summary:
      "On April 21, 753 BCE—or so the legend goes—a young man named Romulus plowed a furrow around the Palatine Hill in central Italy, marking the sacred boundary of a new city. His twin brother Remus mocked the low walls and jumped over them as a joke. Romulus, in a rage, killed his own brother, declaring 'So perish anyone who leaps over my walls!' This brutal beginning set the tone for Rome—a city that would grow from a small village of shepherds and outlaws into an empire that conquered the Mediterranean world and shaped Western civilization for over a thousand years. The founding of Rome is part history, part legend, but what's undeniable is that something special began on those seven hills along the Tiber River.\n\n" +
      "The legend of Rome's founding is wild. Twin brothers Romulus and Remus were supposedly descended from the Trojan hero Aeneas (connecting Rome to Homer's Troy) and fathered by the war god Mars. As babies, they were thrown into the Tiber River by a usurping king but were saved and nursed by a she-wolf (the famous wolf statue is still Rome's symbol today). Raised by a shepherd, the twins eventually decided to found a city. They disagreed about where—Romulus wanted the Palatine Hill, Remus wanted the Aventine. They watched for signs from the gods: Remus saw six vultures, but Romulus saw twelve. Romulus won, founded his city, and killed his brother for disrespecting it. To populate his new city (which had a serious shortage of women), Romulus invited neighboring Sabines to a festival, then Roman men kidnapped the Sabine women. This 'Rape of the Sabines' eventually led to peace when the kidnapped women intervened to stop war between their fathers and husbands, merging the two peoples. Wild, right?\n\n" +
      "But what really happened? Modern archaeology shows there were indeed Iron Age settlements on Rome's seven hills around 800-700 BCE. These were Latin and Sabine villages that gradually merged into one city. The Tiber River location was strategic—it was the lowest crossing point before the Mediterranean Sea, making it a natural trade hub between the Etruscan cities to the north and Greek colonies to the south. The hills provided defense, and the marshland between them (later drained to become the Roman Forum) became the city's commercial center. Early Rome was influenced heavily by the more advanced Etruscan civilization—they borrowed Etruscan engineering, religious practices, and even their kings (several early Roman kings were Etruscan). Around 509 BCE, Romans expelled their last king and founded the Republic, but that's another story. The point is: Rome started small, borrowed ideas from neighbors, and slowly grew through a combination of military strength, political innovation, and ruthless determination.\n\n" +
      "Why does Rome's founding matter? Because this small city of shepherds and farmers would eventually rule an empire stretching from Britain to Egypt, from Spain to Mesopotamia. Rome gave us concrete (literally—Roman concrete is still used today), aqueducts, roads (many still in use), the arch and dome, the calendar (July and August are named after Julius and Augustus Caesar), Romance languages (French, Spanish, Italian, Portuguese, Romanian), legal systems ('innocent until proven guilty,' 'right to trial'), republican government (Senate and civic participation), and Christianity as a world religion (it spread via Roman infrastructure). Rome's founding is the origin story of Western civilization. The Romans themselves looked back to 753 BCE as Year One of their history, dating everything ab urbe condita ('from the founding of the city'). When Romulus plowed that furrow around the Palatine Hill—whether it actually happened on April 21, 753 BCE or not—he started something that would shape the next 2,000+ years of human history. Not bad for a guy who supposedly was raised by a wolf!",
    funFact:
      "According to legend, baby Romulus and Remus were nursed by a she-wolf after being thrown in the Tiber River! The famous statue 'Capitoline Wolf' shows the wolf nursing the twins—though historians now think the wolf statue is actually Etruscan from 500 BCE, and the twin babies were added during the Renaissance. Still, the she-wolf remains Rome's symbol to this day!",
    people: [
      {
        name: "Romulus",
        role: "Legendary Founder and First King of Rome",
        category: "Leader",
        description:
          "According to legend, son of Mars (god of war) and twin brother of Remus. Founded Rome on the Palatine Hill in 753 BCE after killing his brother in a quarrel. Became Rome's first king, established its early institutions, and ruled for 37 years before mysteriously disappearing in a thunderstorm (supposedly becoming a god).",
        born: "c. 771 BCE (legendary)",
        died: "c. 717 BCE (legendary)",
        achievements: [
          "Founded Rome on April 21, 753 BCE (traditional date)",
          "Established the Roman Senate (council of elders)",
          "Created the legion system for Rome's army",
          "Merged Latin and Sabine peoples into one Roman community",
          "Established Rome's first religious and civic institutions"
        ],
        legacy: "Whether he existed or not, Romulus became the archetypal Roman founder—bold, ruthless, pious, and willing to do whatever it took to make Rome great. His fratricide (killing his brother) set a dark precedent: Rome would achieve greatness through violence.",
        imageUrl: "/images/classical/romulus.jpg"
      },
      {
        name: "Remus",
        role: "Twin Brother of Romulus",
        category: "Leader",
        description:
          "Romulus's twin brother who also survived being thrown in the Tiber and nursed by the she-wolf. When the twins disagreed about where to found their city, Remus lost the contest. He mocked Romulus's walls by jumping over them, and Romulus killed him in anger—making Remus Rome's first casualty.",
        born: "c. 771 BCE (legendary)",
        died: "c. 753 BCE (legendary)",
        legacy: "Remus represents the cost of ambition and the violence underlying Rome's founding. His death shows that Rome was literally built on fratricide—a theme that would repeat in Roman civil wars.",
        imageUrl: "/images/classical/remus.jpg"
      },
      {
        name: "Aeneas (Legendary Ancestor)",
        role: "Trojan Hero",
        category: "Mythical",
        description:
          "Trojan prince who escaped when the Greeks destroyed Troy. According to Virgil's Aeneid, Aeneas sailed to Italy carrying his father and household gods. He became the ancestor of Romulus and Remus, connecting Rome's founding to the legendary Trojan War. This gave Rome a prestigious Greek-connected origin story.",
        achievements: [
          "Escaped Troy's destruction with his family and followers",
          "Founded Lavinium in Italy after divine guidance",
          "Became ancestor of the Roman people through his son Ascanius"
        ],
        legacy: "Gave Rome a mythological pedigree connecting them to Homer's epic world. The Aeneid became Rome's national epic, justifying their destiny to rule.",
        imageUrl: "/images/classical/aeneas.jpg"
      }
    ],
    inventions: [
      {
        name: "Pomerium (Sacred City Boundary)",
        description: "Religious boundary marking the sacred limits of the city",
        category: "Religion",
        problem: "How to define what is 'inside' the city for religious and legal purposes",
        solution: "Romulus allegedly plowed a furrow around the Palatine Hill with a bronze plow, creating a sacred boundary (pomerium). Crossing it with weapons was forbidden; defending it was sacred duty.",
        impact: "Established the concept of sacred civic space. When Remus jumped over the pomerium mockingly, Romulus killed him—showing that city boundaries were inviolable. This concept of sacred civic limits influenced Roman urban planning for centuries."
      },
      {
        name: "Asylum Policy (Sanctuary for Outlaws)",
        description: "Romulus's policy of welcoming refugees, exiles, and fugitives to populate early Rome",
        category: "Government",
        problem: "New city needed population but didn't have enough people",
        solution: "Romulus declared Rome an asylum—a sanctuary where fugitives, runaway slaves, and exiles from other cities could find refuge and become Roman citizens",
        impact: "Gave Rome a diverse population and established Rome's tradition of incorporating outsiders. Unlike Greek cities that jealously guarded citizenship, Rome would eventually grant citizenship to conquered peoples—helping them build an empire."
      },
      {
        name: "Roman Senate (Senatus)",
        description: "Advisory council of elder statesmen",
        category: "Government",
        problem: "Romulus needed advisors and a way to give leading families influence",
        solution: "Created a council of 100 elders (senators) from leading families to advise the king and provide political stability",
        impact: "The Senate became Rome's most important political institution, lasting over 1,000 years through kingdom, republic, and empire. Even emperors respected the Senate's authority (at least symbolically)."
      }
    ],
    places: [
      {
        name: "Palatine Hill",
        description: "Centermost of Rome's seven hills where Romulus founded the city",
        location: "Central Rome, Italy",
        significance: "The birthplace of Rome in 753 BCE (traditional date). Archaeological evidence shows settlements here from around 800 BCE. Later became the location of emperors' palaces—our word 'palace' comes from 'Palatine.' You can still visit the ruins today.",
        lore: "According to legend, Romulus saw twelve vultures circling the Palatine—a sign from the gods that this was the right spot. He plowed the sacred boundary (pomerium) around the hill, and when Remus jumped over it mockingly, Romulus killed him."
      },
      {
        name: "Tiber River",
        description: "River flowing through Rome to the Mediterranean Sea",
        location: "Central Italy",
        significance: "Rome was founded at the lowest crossing point of the Tiber before the sea—a strategic trade location. The river also figures in legend: baby Romulus and Remus were thrown into the Tiber but washed ashore and were saved by the she-wolf.",
        lore: "The Tiber was Rome's lifeline, providing water, transportation, and commerce. But it also flooded regularly—one flood in 15 BCE was so bad that people rowed boats through the Forum!"
      },
      {
        name: "Roman Forum (Future Site)",
        description: "Marshland between Rome's hills that would become the city's civic center",
        location: "Valley between Palatine, Capitoline, and Esquiline Hills",
        significance: "Initially a marshy area, it was drained in the 6th century BCE to become the Forum Romanum—the heart of Roman political, religious, and commercial life. The ruins are one of the world's most famous archaeological sites.",
        lore: "According to legend, the valley between the hills was the site of the reconciliation between Romans and Sabines after the 'Rape of the Sabines.' The kidnapped Sabine women threw themselves between their Roman husbands and Sabine fathers to stop the battle."
      }
    ],
    resources: [
      {
        title: "The Founding of Rome - Romulus and Remus",
        type: "Video",
        url: "https://www.youtube.com/results?search_query=Romulus+and+Remus+founding+of+Rome+for+kids",
        isCore: true,
        description: "The legendary story of the twins raised by a she-wolf who founded Rome"
      },
      {
        title: "Ancient Rome 101",
        type: "Video",
        url: "https://www.youtube.com/results?search_query=ancient+Rome+history+National+Geographic+kids",
        isCore: true,
        description: "Overview of Rome from founding to empire"
      },
      {
        title: "Real History vs Legend: Rome's Founding",
        type: "Video",
        url: "https://www.youtube.com/results?search_query=founding+of+Rome+archaeology+real+history",
        isCore: false,
        description: "What archaeologists actually found on the Palatine Hill and how it compares to legend"
      },
      {
        title: "The Seven Hills of Rome",
        type: "Article",
        url: "https://www.romewise.com/seven-hills-of-rome.html",
        isCore: false,
        description: "Understanding Rome's unique topography and why location mattered"
      }
    ],
    quiz: {
      title: "Rome's Legendary Founding",
      questions: [
        {
          id: "rome_q1",
          text: "According to legend, why did Romulus kill his twin brother Remus?",
          options: [
            "They fought over a woman",
            "Remus mocked Rome's walls by jumping over them",
            "Remus stole Romulus's crown",
            "They disagreed about which gods to worship"
          ],
          correctIndex: 1,
          explanation: "After Romulus won the contest to found the city, Remus mocked his brother's walls by jumping over them. Romulus killed him in rage, declaring 'So perish anyone who leaps over my walls!' This violent beginning foreshadowed Rome's ruthless path to power."
        },
        {
          id: "rome_q2",
          text: "What animal supposedly nursed baby Romulus and Remus?",
          options: [
            "A goat",
            "A she-wolf",
            "A bear",
            "A lioness"
          ],
          correctIndex: 1,
          explanation: "According to legend, after being thrown in the Tiber River, the twin babies were saved and nursed by a she-wolf (lupa). This she-wolf became Rome's symbol and appears on countless statues, coins, and emblems even today—2,700+ years later!"
        },
        {
          id: "rome_q3",
          text: "What made Rome's location strategically important?",
          options: [
            "It was on the coast with a natural harbor",
            "It was the lowest crossing point of the Tiber River before the sea",
            "It had gold mines nearby",
            "It was hidden in the mountains"
          ],
          correctIndex: 1,
          explanation: "Rome was founded at the lowest ford (crossing point) of the Tiber River before it reached the Mediterranean. This made it a natural trade hub connecting Etruscan cities in the north with Greek colonies in the south. Geography helped make Rome great."
        },
        {
          id: "rome_q4",
          text: "What was Romulus's solution to the new city's shortage of women?",
          options: [
            "He invited neighboring Sabine families to a festival and Roman men kidnapped the women",
            "He paid other cities to send women",
            "He waited for women to arrive naturally",
            "He forced men to stay single"
          ],
          correctIndex: 0,
          explanation: "The infamous 'Rape (kidnapping) of the Sabines': Romulus invited the neighboring Sabine people to a festival, then Roman men grabbed and carried off the Sabine women. Eventually the kidnapped women intervened to make peace between their fathers and husbands, merging the two peoples. It's a disturbing story that shows early Rome's ruthless pragmatism."
        }
      ],
      rewardArtifact: {
        id: "capitoline_wolf",
        name: "Capitoline She-Wolf Statuette",
        description: "Replica of Rome's most famous symbol—the she-wolf nursing Romulus and Remus",
        rarity: "Epic"
      }
    }
  }
};
