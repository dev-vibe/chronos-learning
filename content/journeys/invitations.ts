import type { JourneyInvitation } from '../../src/domains/contracts';

// Production invitations stay empty until an optional destination journey is fully
// reviewed and published. Tests assemble authored fixtures around this boundary.
export const journeyInvitations: JourneyInvitation[] = [];
