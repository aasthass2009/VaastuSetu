// ── EDITABLE CONFIG ──────────────────────────────────────────────────────────
// All Vastu scoring rules live here. Edit weights, directions, or remedies
// without touching engine.ts.
// ─────────────────────────────────────────────────────────────────────────────

import type { Direction, RoomConfig, RoomType } from './types';

export const DIRECTIONS: Direction[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

export const DIRECTION_LABELS: Record<Direction, string> = {
  N:  'North',
  NE: 'North-East',
  E:  'East',
  SE: 'South-East',
  S:  'South',
  SW: 'South-West',
  W:  'West',
  NW: 'North-West',
};

export const ROOM_CONFIGS: Record<RoomType, RoomConfig> = {
  // ─── Main Entrance (weight 22) ─────────────────────────────────────────
  entrance: {
    label: 'Main Entrance',
    icon: '🚪',
    weight: 22,
    ideal: ['N', 'NE', 'E'],
    okay:  ['W', 'NW'],
    avoid: ['SE', 'S', 'SW'],
    remedies: {
      ideal:
        'Your main entrance is beautifully positioned. Enhance it with fresh flowers or a small indoor plant near the door, a polished brass name-plate, and keep the threshold well-lit at all times.',
      okay:
        'A workable entrance. Brighten the doorway with warm lighting, add a copper or brass bell, and place a small Ganesha figurine facing inward to invite positive energy.',
      neutral:
        'Place a Vastu yantra plate on the wall near the entrance. Add a large mirror on the north or east wall inside. Keep the entrance clutter-free and introduce a green plant by the door.',
      avoid:
        'Hang a Vastu pyramid on the wall behind the door inside. Place a camphor cube in a corner near the entrance and light it once a week. A bright light above the door and a heavy brass doorbell can help redirect energy flow.',
    },
  },

  // ─── Kitchen (weight 20) ───────────────────────────────────────────────
  kitchen: {
    label: 'Kitchen',
    icon: '🍳',
    weight: 20,
    ideal: ['SE'],
    okay:  ['NW'],
    avoid: ['NE', 'SW'],
    remedies: {
      ideal:
        'Your kitchen enjoys excellent Vastu positioning. Keep the cooking stove in the south-east corner and always face east while cooking for maximum benefit.',
      okay:
        'A decent kitchen direction. Face east while cooking, keep the stove away from the sink to prevent fire–water conflict, and place a red or orange accent in the south-east corner.',
      neutral:
        'Place the stove in the south-east corner and always cook facing east. Introduce yellow or orange accents — a curtain or container set — to balance the fire element.',
      avoid:
        'Place a red bulb or warm orange light in the south-east corner. Occasionally burn camphor. Paint one wall in a soft earthy yellow and ensure the stove is as far from the north-east corner as possible.',
    },
  },

  // ─── Master Bedroom (weight 18) ────────────────────────────────────────
  bedroom: {
    label: 'Master Bedroom',
    icon: '🛏️',
    weight: 18,
    ideal: ['SW'],
    okay:  ['S', 'W'],
    avoid: ['NE', 'E'],
    remedies: {
      ideal:
        'Your master bedroom is in the most restful Vastu position. Sleep with your head pointing south or east for deep, rejuvenating sleep.',
      okay:
        'A comfortable bedroom direction. Sleep with your head pointing south and use warm, earthy tones — browns, terracottas — to enhance grounding energy.',
      neutral:
        'Place your bed in the south-west corner of the bedroom and sleep with your head pointing south. Avoid mirrors directly facing the bed and use heavy, grounding fabrics in warm colours.',
      avoid:
        'Move the bed to the south-west corner of the room. Sleep with your head pointing south or west. Remove mirrors facing the bed, place a rose quartz crystal on the bedside table, and keep electronic devices away from the head of the bed.',
    },
  },

  // ─── Pooja Room (weight 14) ────────────────────────────────────────────
  pooja: {
    label: 'Pooja Room',
    icon: '🕉️',
    weight: 14,
    ideal: ['NE'],
    okay:  ['E', 'N'],
    avoid: ['S', 'SW', 'SE'],
    remedies: {
      ideal:
        'Your prayer room is perfectly situated. Keep it clean, fragrant with incense, and lit with diyas during puja hours for maximum spiritual benefit.',
      okay:
        'A good direction for worship. Face east or north-east while praying, use white or light yellow for the walls, and offer fresh flowers daily.',
      neutral:
        'Place the prayer altar in the north-east corner of the room. Use a yellow or white silk cloth on the altar and burn camphor during morning prayers to purify the space.',
      avoid:
        'Place a copper Shri Yantra or small pyramid in the north-east corner. Use saffron-coloured curtains, add a natural crystal such as clear quartz, and burn camphor or sandalwood incense daily to energetically realign the space.',
    },
  },

  // ─── Toilet / Bathroom (weight 14) ────────────────────────────────────
  toilet: {
    label: 'Toilet / Bathroom',
    icon: '🚿',
    weight: 14,
    ideal: ['NW', 'W', 'S'],
    okay:  ['N'],
    avoid: ['NE', 'SE'],
    remedies: {
      ideal:
        'Your toilet is in a Vastu-compliant location. Keep it clean, well-ventilated, and place a small bowl of sea salt inside to absorb residual negative energy (replace monthly).',
      okay:
        'An acceptable toilet direction. Ensure good ventilation, use light colours (white or cream), and keep a small bowl of sea salt near the toilet, replacing it each month.',
      neutral:
        'Paint the toilet walls white or light grey. Keep a small bowl of Himalayan salt to absorb negativity, always keep the toilet lid closed, and add ventilation if none exists.',
      avoid:
        'Keep the toilet door always closed. Place a Vastu salt bowl (sea or Himalayan salt) inside and change it every 30 days. Paint the walls white or cream, use copper-toned fixtures to counter negative energy, and add a green plant just outside the toilet door.',
    },
  },

  // ─── Living Room (weight 12) ───────────────────────────────────────────
  living: {
    label: 'Living Room',
    icon: '🛋️',
    weight: 12,
    ideal: ['N', 'E', 'NE'],
    okay:  ['NW', 'W'],
    avoid: ['S', 'SW'],
    remedies: {
      ideal:
        'Your living room enjoys an ideal Vastu direction — perfect for family harmony. Enhance it with natural light, live plants, and uplifting art on the north or east wall.',
      okay:
        'A comfortable living space direction. Place heavier furniture against the south or west wall and keep the north and east area light and open.',
      neutral:
        'Arrange seating so the family faces north or east when seated. Place a small water feature in the north-east corner and introduce green plants along the east or north wall.',
      avoid:
        'Place a Vastu pyramid under the central carpet. Add a large mirror on the north or east wall to reflect positive energy. Introduce live plants throughout and use cool, calming colours — whites, creams, light blues — on the south and west walls.',
    },
  },
};
