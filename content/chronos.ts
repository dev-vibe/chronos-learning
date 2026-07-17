import { assembleContent } from './assemble';
import { earlyWritingSystemsContent } from './lessons/early-writing-systems';
import { farmingSettlementsContent } from './lessons/farming-settlements';
import { urukContent } from './lessons/uruk';
import { worldHistoryJourney } from './journeys/world-history';

export const chronosContent = assembleContent(
  [farmingSettlementsContent, urukContent, earlyWritingSystemsContent],
  [worldHistoryJourney],
);

export const { sources, claims, media, prompts, lessons, journeys, cards } = chronosContent;
