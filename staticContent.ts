import { NodeContent } from './types';
import { FOUNDATIONS_YOUNGER_DRYAS } from './data/foundations/younger_dryas';
import { FOUNDATIONS_MESOPOTAMIA } from './data/foundations/mesopotamia';
import { FOUNDATIONS_EGYPT } from './data/foundations/egypt';
import { FOUNDATIONS_ASIA } from './data/foundations/asia';
import { FOUNDATIONS_EUROPE } from './data/foundations/europe';
import { FOUNDATIONS_LEVANT } from './data/foundations/levant';
import { FOUNDATIONS_AMERICAS_AFRICA } from './data/foundations/americas_africa';
import { FOUNDATIONS_GENERAL } from './data/foundations/general';
import { CLASSICAL_PERSIA } from './data/classical/persia';
import { CLASSICAL_ISRAEL } from './data/classical/israel';
import { CLASSICAL_AMERICAS } from './data/classical/americas';
import { CLASSICAL_GREECE } from './data/classical/greece';
import { CLASSICAL_ROME } from './data/classical/rome';

export const STATIC_CONTENT: Record<string, NodeContent> = {
  ...FOUNDATIONS_YOUNGER_DRYAS,
  ...FOUNDATIONS_MESOPOTAMIA,
  ...FOUNDATIONS_EGYPT,
  ...FOUNDATIONS_ASIA,
  ...FOUNDATIONS_EUROPE,
  ...FOUNDATIONS_LEVANT,
  ...FOUNDATIONS_AMERICAS_AFRICA,
  ...FOUNDATIONS_GENERAL,
  ...CLASSICAL_PERSIA,
  ...CLASSICAL_ISRAEL,
  ...CLASSICAL_AMERICAS,
  ...CLASSICAL_GREECE,
  ...CLASSICAL_ROME,
};