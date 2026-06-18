import type { Direction, RoomInput, RoomResult, ScoreResult, ScoreTier, VerdictLevel } from './types';
import { DIRECTION_LABELS, ROOM_CONFIGS } from './rules';

const TIER_POINTS: Record<ScoreTier, number> = {
  ideal:   100,
  okay:     65,
  neutral:  30,
  avoid:     0,
};

function getTier(direction: Direction, config: (typeof ROOM_CONFIGS)[keyof typeof ROOM_CONFIGS]): ScoreTier {
  if (config.ideal.includes(direction)) return 'ideal';
  if (config.okay.includes(direction))  return 'okay';
  if (config.avoid.includes(direction)) return 'avoid';
  return 'neutral';
}

/**
 * Score a home given one direction per room.
 * Returns a 0–100 total, an overall verdict, and a per-room breakdown.
 *
 * Weights: entrance 22 + kitchen 20 + bedroom 18 + pooja 14 + toilet 14 + living 12 = 100.
 * An all-ideal home scores exactly 100; all-avoid scores 0.
 */
export function calculate(inputs: RoomInput[]): ScoreResult {
  const rooms: RoomResult[] = inputs.map(({ room, direction }) => {
    const config = ROOM_CONFIGS[room];
    const tier   = getTier(direction, config);
    const points = TIER_POINTS[tier];
    const contribution = (points * config.weight) / 100;
    return {
      room,
      label: config.label,
      icon:  config.icon,
      direction,
      directionLabel: DIRECTION_LABELS[direction],
      tier,
      points,
      weight: config.weight,
      contribution,
      remedy: config.remedies[tier],
    };
  });

  const total   = Math.round(rooms.reduce((sum, r) => sum + r.contribution, 0));
  const verdict: VerdictLevel =
    total >= 80 ? 'Excellent' :
    total >= 60 ? 'Good'      :
    total >= 40 ? 'Fair'      : 'Poor';

  return { total, verdict, rooms };
}
