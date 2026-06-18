// Run: npx tsx lib/vaastu/engine.test.ts
import { calculate } from './engine';

let passed = 0, failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✅  ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌  ${name}: ${(e as Error).message}`);
    failed++;
  }
}

function eq<T>(actual: T, expected: T, label?: string) {
  if (actual !== expected)
    throw new Error(`${label ? label + ': ' : ''}expected ${String(expected)}, got ${String(actual)}`);
}

function inRange(value: number, min: number, max: number, label?: string) {
  if (value < min || value > max)
    throw new Error(`${label ? label + ': ' : ''}expected ${value} to be in [${min}, ${max}]`);
}

console.log('\nVastu Score Engine\n');

// ─────────────────────────────────────────────────────────────────────────────

test('ideal home scores 100', () => {
  // All rooms in their best direction → every weight fully earned
  const r = calculate([
    { room: 'entrance', direction: 'NE' },   // ideal (22 pts)
    { room: 'kitchen',  direction: 'SE' },   // ideal (20 pts)
    { room: 'bedroom',  direction: 'SW' },   // ideal (18 pts)
    { room: 'pooja',    direction: 'NE' },   // ideal (14 pts)
    { room: 'toilet',   direction: 'NW' },   // ideal (14 pts)
    { room: 'living',   direction: 'N'  },   // ideal (12 pts)
  ]);
  eq(r.total, 100, 'score');
  eq(r.verdict, 'Excellent', 'verdict');
  eq(r.rooms.every(room => room.tier === 'ideal'), true, 'all tiers ideal');
});

test('poorly-placed home scores ~20', () => {
  // entrance W (okay=65 → 14.3) + kitchen E (neutral=30 → 6.0) + rest avoid=0 → 20.3 → 20
  const r = calculate([
    { room: 'entrance', direction: 'W'  },
    { room: 'kitchen',  direction: 'E'  },
    { room: 'bedroom',  direction: 'NE' },
    { room: 'pooja',    direction: 'SW' },
    { room: 'toilet',   direction: 'NE' },
    { room: 'living',   direction: 'S'  },
  ]);
  inRange(r.total, 18, 23, 'score');
  eq(r.verdict, 'Poor', 'verdict');
});

test('all-avoid home scores 0', () => {
  const r = calculate([
    { room: 'entrance', direction: 'S'  },
    { room: 'kitchen',  direction: 'NE' },
    { room: 'bedroom',  direction: 'NE' },
    { room: 'pooja',    direction: 'S'  },
    { room: 'toilet',   direction: 'NE' },
    { room: 'living',   direction: 'S'  },
  ]);
  eq(r.total, 0, 'score');
  eq(r.verdict, 'Poor', 'verdict');
  eq(r.rooms.every(room => room.tier === 'avoid'), true, 'all tiers avoid');
});

test('mostly-ideal home with a few okay rooms is still Good', () => {
  // entrance N(ideal=22) + kitchen NW(okay→13) + bedroom W(okay→11.7)
  // + pooja E(okay→9.1) + toilet NW(ideal→14) + living W(okay→7.8) = 77.6 → 78
  const r = calculate([
    { room: 'entrance', direction: 'N'  },
    { room: 'kitchen',  direction: 'NW' },
    { room: 'bedroom',  direction: 'W'  },
    { room: 'pooja',    direction: 'E'  },
    { room: 'toilet',   direction: 'NW' },
    { room: 'living',   direction: 'W'  },
  ]);
  inRange(r.total, 60, 79, 'score');
  eq(r.verdict, 'Good', 'verdict');
});

test('each room result has label, remedy, directionLabel, and valid contribution', () => {
  const r = calculate([
    { room: 'entrance', direction: 'N'  },
    { room: 'kitchen',  direction: 'SE' },
    { room: 'bedroom',  direction: 'SW' },
    { room: 'pooja',    direction: 'NE' },
    { room: 'toilet',   direction: 'NW' },
    { room: 'living',   direction: 'N'  },
  ]);
  for (const room of r.rooms) {
    if (!room.label)         throw new Error(`${room.room}: missing label`);
    if (!room.remedy)        throw new Error(`${room.room}: missing remedy`);
    if (!room.directionLabel) throw new Error(`${room.room}: missing directionLabel`);
    if (room.contribution < 0 || room.contribution > room.weight)
      throw new Error(`${room.room}: contribution ${room.contribution} outside [0, ${room.weight}]`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────

console.log(`\n  ${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
