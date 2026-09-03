import { assembleContent } from './assemble';
import { earlyWritingSystemsContent } from './lessons/early-writing-systems';
import { caralAndeanUrbanismContent } from './lessons/caral-andean-urbanism';
import { egyptNileStateContent } from './lessons/egypt-nile-state';
import { pyramidsPowerStateLaborContent } from './lessons/pyramids-power-and-state-labor';
import { farmingSettlementsContent } from './lessons/farming-settlements';
import { homoSapiensOriginsContent } from './lessons/homo-sapiens-origins';
import { migrationsAncientDnaContent } from './lessons/migrations-and-interbreeding';
import { sahulCrossingContent } from './lessons/sahul-crossing';
import { manyBeginningsOfFarmingContent } from './lessons/many-beginnings-of-farming';
import { urukContent } from './lessons/uruk';
import { worldHistoryJourney } from './journeys/world-history';
import { journeyInvitations } from './journeys/invitations';

export const chronosContent = assembleContent(
  [homoSapiensOriginsContent, migrationsAncientDnaContent, sahulCrossingContent, manyBeginningsOfFarmingContent, farmingSettlementsContent, urukContent, earlyWritingSystemsContent, egyptNileStateContent, caralAndeanUrbanismContent, pyramidsPowerStateLaborContent],
  [worldHistoryJourney],
  journeyInvitations,
);

export const { sources, claims, media, prompts, lessons, journeys, invitations, cards } = chronosContent;
