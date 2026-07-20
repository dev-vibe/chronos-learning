import { assembleContent } from './assemble';
import { earlyWritingSystemsContent } from './lessons/early-writing-systems';
import { farmingSettlementsContent } from './lessons/farming-settlements';
import { urukContent } from './lessons/uruk';
import { worldHistoryJourney } from './journeys/world-history';
import { journeyInvitations } from './journeys/invitations';

export const chronosContent = assembleContent(
  [farmingSettlementsContent, urukContent, earlyWritingSystemsContent],
  [worldHistoryJourney],
  journeyInvitations,
);

export const { sources, claims, media, prompts, lessons, journeys, invitations, cards } = chronosContent;
