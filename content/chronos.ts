import { assembleContent } from './assemble';
import { earlyWritingSystemsContent } from './lessons/early-writing-systems';
import { farmingSettlementsContent } from './lessons/farming-settlements';
import { homoSapiensOriginsContent } from './lessons/homo-sapiens-origins';
import { migrationsAncientDnaContent } from './lessons/migrations-and-interbreeding';
import { manyBeginningsOfFarmingContent } from './lessons/many-beginnings-of-farming';
import { urukContent } from './lessons/uruk';
import { worldHistoryJourney } from './journeys/world-history';
import { journeyInvitations } from './journeys/invitations';

export const chronosContent = assembleContent(
  [homoSapiensOriginsContent, migrationsAncientDnaContent, manyBeginningsOfFarmingContent, farmingSettlementsContent, urukContent, earlyWritingSystemsContent],
  [worldHistoryJourney],
  journeyInvitations,
);

export const { sources, claims, media, prompts, lessons, journeys, invitations, cards } = chronosContent;
