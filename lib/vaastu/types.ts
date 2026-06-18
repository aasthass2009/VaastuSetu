export type Direction = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
export type RoomType = 'entrance' | 'kitchen' | 'bedroom' | 'pooja' | 'toilet' | 'living';
export type ScoreTier = 'ideal' | 'okay' | 'neutral' | 'avoid';
export type VerdictLevel = 'Excellent' | 'Good' | 'Fair' | 'Poor';

export interface RoomConfig {
  label: string;
  icon: string;
  weight: number;   // contributes up to `weight` points out of 100
  ideal: Direction[];
  okay: Direction[];
  avoid: Direction[];
  remedies: Record<ScoreTier, string>;
}

export interface RoomInput {
  room: RoomType;
  direction: Direction;
}

export interface RoomResult {
  room: RoomType;
  label: string;
  icon: string;
  direction: Direction;
  directionLabel: string;
  tier: ScoreTier;
  points: number;        // raw direction score 0–100
  weight: number;
  contribution: number;  // points * weight / 100
  remedy: string;
}

export interface ScoreResult {
  total: number;         // 0–100
  verdict: VerdictLevel;
  rooms: RoomResult[];
}

