export type KnowledgeChunk = {
  sourceId: string;
  title: string;
  content: string;
};

export const KNOWLEDGE_CHUNKS: KnowledgeChunk[] = [
  {
    sourceId: "vastu-intro",
    title: "Introduction to Vastu Shastra",
    content: `Vastu Shastra is one of the oldest sciences of architecture and spatial design, rooted in the ancient Vedic texts of India. The word "Vastu" means dwelling or site, and "Shastra" means scripture or science. Together, Vastu Shastra translates to the science of harmonious living environments.

The core principle of Vastu is that every structure, whether a home, office, or temple, sits within a field of cosmic energy. By aligning rooms, entrances, and furniture with the flow of this energy — governed by the five elements (Pancha Bhuta) and the eight directions (Ashta Disha) — a dwelling can support the health, prosperity, and well-being of its occupants.

Vastu Shastra describes the Vaastu Purusha, the cosmic being whose body is superimposed over every piece of land. The north-east represents the head (sacred, never burden it with heavy structures), while the south-west represents the feet (stable, ideal for heavy rooms like the master bedroom).

Modern Vastu practitioners distinguish between structural Vastu (placement of rooms, walls, doors) and remedial Vastu (crystals, plants, colors, yantras) for homes that cannot be rebuilt. Most Vastu corrections can be made without demolition, using energy tools and symbolic adjustments.

Vastu is a respected, living tradition practiced by millions of Indian families across generations. Its recommendations emerge from centuries of empirical observation about how directional energy affects human mood, health, and fortune.`,
  },

  {
    sourceId: "pancha-bhuta",
    title: "Pancha Bhuta — Five Elements in Vastu",
    content: `The five elements (Pancha Bhuta) are the foundation of Vastu Shastra. Every direction, every room, and every material is linked to one of these elements.

Earth (Prithvi) — governs the south-west direction. It represents stability, grounding, and permanence. The master bedroom belongs in the south-west because earth energy provides restful, deep sleep and a sense of security for the family head.

Water (Jala) — governs the north-east direction. It represents flow, intuition, and spiritual clarity. Water features, underground tanks, and wells should be placed in the north or north-east. The north-east is also the ideal corner for a Pooja room or meditation space.

Fire (Agni) — governs the south-east direction. It represents energy, transformation, and action. The kitchen belongs in the south-east because fire energy supports cooking, digestion, and vitality. All electrical equipment, generators, and boilers also do well in the south-east.

Air (Vayu) — governs the north-west direction. It represents movement, communication, and social connections. Guest rooms, toilets, and garages fare well in the north-west because air energy is transient — guests come and go, and waste flows outward.

Space (Akasha) — governs the central zone (Brahmasthan). The centre of any home should remain open and uncluttered. A heavy pillar, staircase, or toilet in the centre disrupts the free flow of cosmic energy throughout the home.

Balancing these five elements through thoughtful placement is the heart of good Vastu.`,
  },

  {
    sourceId: "eight-directions",
    title: "Ashta Disha — Eight Directions in Vastu",
    content: `Vastu Shastra divides space into eight directions, each ruled by a deity and carrying specific energetic qualities.

North (Uttara) — ruled by Kubera, the god of wealth. This direction attracts financial prosperity and career advancement. Keep the north zone open and free of heavy walls. Living rooms, offices, and study areas thrive here.

North-East (Ishaan) — ruled by Ishana (Shiva). The most sacred and spiritually potent direction. Place the Pooja room, meditation space, or a small water feature here. Never locate a toilet, kitchen, or garbage area in the north-east.

East (Purva) — ruled by Indra, the king of gods. The direction of the rising sun brings health, vitality, and new beginnings. Entrances, large windows, and children's rooms benefit from east placement. Maximum morning sunlight should enter from the east.

South-East (Agneya) — ruled by Agni, the fire god. The ideal zone for the kitchen, electrical panels, and heat-generating equipment. Fire energy here supports digestion and vitality.

South (Dakshina) — ruled by Yama, the god of death and order. The south should be solid and heavy. It is not a good direction for entrances or light. The south wall should have minimal windows and be higher or more solid than the north wall.

South-West (Nairitya) — ruled by Niriti (earth demon). The earth zone. Heavy, stable, and grounding. Best for the master bedroom and heavy storage. The family head sleeping here gains authority and stability.

West (Paschima) — ruled by Varuna, the water god. Gains, completion, and creativity live here. Guest rooms, dining areas, and children's study rooms do well in the west.

North-West (Vayu) — ruled by Vayu, the wind god. Movement and transition define this zone. Good for guest bedrooms, bathrooms, and garages.`,
  },

  {
    sourceId: "north-zone",
    title: "North Zone — Wealth and Career Energy",
    content: `The north direction in Vastu is ruled by Kubera, the celestial treasurer. Keeping this zone open, bright, and clutter-free is one of the most powerful ways to support financial flow in a home.

Ideal uses for the north zone: living rooms, offices, home workspaces, lounge areas, and any room associated with transactions or conversations about money.

Never place a toilet, septic tank, kitchen, or staircase in the north zone, as these structures block the wealth energy flowing into the home.

No-demolition remedies to activate the north zone:
- Place a small flowing water feature (fountain or aquarium) in the north of the living room. Moving water in the north directly activates Kubera energy.
- Hang a mirror on the north wall to double the open space and symbolically expand prosperity.
- Use cool colours — blue, green, or white — in north-facing rooms.
- Place green plants (money plant, jade plant, or lucky bamboo) in the north or north-east corner of the living room or home office.
- Remove clutter from the north wall. Heavy furniture or blocked passages in the north slow financial energy.
- A green-coloured entrance mat placed at the north or north-east entrance invites prosperity.

If a toilet exists in the north zone, counteract it by placing a bowl of sea salt inside the toilet and changing it monthly. Hang a Vastu pyramid on the north wall outside the toilet. Paint the toilet walls white or cream and always keep the lid closed.`,
  },

  {
    sourceId: "south-zone",
    title: "South Zone — Stability and Ancestors",
    content: `The south direction is ruled by Yama, the god of dharma and order. In Vastu, the south represents solidity, stability, and connection to ancestors. A heavy, well-structured south wall protects the home and its occupants.

Ideal uses for the south zone: master bedroom (west or south of the south-west ideal), storage rooms, and heavy furniture placement.

The south is the least favourable direction for entrances, kitchens, and Pooja rooms. A south-facing main entrance requires specific remedies.

Properties and remedies for the south zone:
- Keep the south wall taller, thicker, or more closed compared to the north wall. More closed walls in the south = better energy containment.
- Heavy furniture (wardrobes, bookshelves, large sofas) should be placed against the south or south-west wall.
- If the main entrance faces south, place a Vastu pyramid above the outer door, brighten the doorway with warm yellow or orange lighting, and add a brass Ganesha facing inward near the entrance.
- Earth colours — terracotta, ochre, deep red — resonate well with south-zone rooms.
- If the bedroom is in the south, ensure the head of the bed points south or east (never north) for restful sleep.
- A brass wind chime hung near a south entrance helps redirect the heavy energy.`,
  },

  {
    sourceId: "east-zone",
    title: "East Zone — Health and New Beginnings",
    content: `The east direction is ruled by Indra, the king of the gods. It is the direction of the sunrise, representing light, health, vitality, and new beginnings. In Vastu, the east is one of the most auspicious directions for entrances and openings.

Ideal uses for the east zone: main entrance, living rooms, children's bedrooms, study rooms, meditation spaces, and prayer areas when the north-east is not available.

Vastu principles for the east zone:
- Maximize windows and openings on the east wall to allow morning sunlight into the home. Sunlight from the east is considered the most health-giving.
- Do not block the east wall with heavy furniture or tall bookshelves. Keep the east zone relatively open.
- The east is the second-best direction for a main entrance (after north and north-east).
- If children's bedrooms are in the east, their studies and overall energy tend to be vibrant.

No-demolition remedies for the east zone:
- Keep the east side of each room free of heavy furniture.
- Paint east-facing walls in green or light earthy tones to invoke the wood energy of the east.
- Place a crystal (clear quartz or green aventurine) on the windowsill of east-facing windows to amplify morning light energy.
- Tulsi plant (holy basil) placed near an east-facing window is considered especially auspicious in Indian Vastu tradition.`,
  },

  {
    sourceId: "north-east-zone",
    title: "North-East Zone (Ishaan Kona) — Sacred Corner",
    content: `The north-east corner, called Ishaan Kona, is the most spiritually potent zone in any home. Ruled by Ishana (a form of Shiva), it is where divine cosmic energy enters the dwelling. This corner governs spiritual growth, mental clarity, education, and spiritual well-being.

Ideal uses for the north-east: Pooja room, meditation corner, small water feature, underground water tank, crystal altar, or open space (the corner should ideally remain light and open).

What to strictly avoid in the north-east corner:
- Toilet or bathroom — this is the single most harmful Vastu defect. A toilet in the north-east drains spiritual and mental energy from the home.
- Kitchen — fire in the water/spiritual zone creates conflict between elements.
- Heavy storage, garbage bins, dustbins, or clutter.
- Stairs — heavy structure here presses on the "head" of the Vaastu Purusha.
- Master bedroom — while it can be used with strong remedies, it is not recommended.

No-demolition remedies if a toilet exists in the north-east:
- Place a large bowl of sea salt inside the toilet, changing it every 30 days (the salt absorbs negative energy).
- Paint the walls of the toilet white or light cream.
- Always keep the toilet lid closed and the door shut.
- Place a small clear quartz crystal or a Shri Yantra in the room immediately adjacent to the toilet, on the north-east side.
- Burn camphor in the north-east area of the home daily to cleanse the energy.
- Place a Vastu energy pyramid on the outer north-east wall.

For an otherwise open north-east: introduce a small flowing water feature or a plant (tulsi, lucky bamboo) to activate the divine energy of this corner.`,
  },

  {
    sourceId: "south-east-zone",
    title: "South-East Zone (Agneya Kona) — Fire and Energy",
    content: `The south-east corner is called the Agneya Kona, meaning the fire corner. It is ruled by Agni, the Vedic fire god, and governs energy, transformation, health, and digestion. This zone is associated with the fire element (Agni) in Pancha Bhuta.

Ideal uses for the south-east: kitchen, cooking area, electrical panels, transformer or power backup unit, water heaters, boilers, ovens, fireplace, and any heat-generating appliances.

Vastu principles for the south-east:
- The kitchen in the south-east is highly auspicious. Always cook facing east — this aligns the cook's back to the south and draws maximum solar energy.
- The cooking stove should ideally be in the south-east corner of the kitchen, never in the north-east (fire conflicts with water/spiritual energy) or the south-west (fire conflicts with earth).
- Never place a water tank, water feature, or sump in the south-east — fire and water in the same zone create conflict that manifests as financial loss or health issues.

No-demolition remedies for a kitchen not in the south-east:
- Place a red or orange accent (curtain, vase, or container set) in the south-east corner of the kitchen to strengthen fire energy regardless of the kitchen's overall location.
- Use red, orange, or earthy-yellow colours on the kitchen walls.
- Always cook facing east, even if the stove placement is not ideal.
- Burn a small candle or diya in the south-east corner of the kitchen daily.
- Place the stove as far from the north-east corner as possible.
- Avoid placing a sink directly next to or touching the stove — keep fire and water separated by at least a foot of counter space.`,
  },

  {
    sourceId: "south-west-zone",
    title: "South-West Zone (Nairitya Kona) — Stability and the Family Head",
    content: `The south-west corner, called Nairitya Kona, is ruled by Niriti and represents the earth element. It is the heaviest, most stable zone in any home. The family head — the primary breadwinner or the senior-most member — should occupy this zone for a home to function with harmony and authority.

Ideal uses for the south-west: master bedroom, heavy storage, ancestral photographs or heirlooms, and heavy furniture.

What to avoid in the south-west: main entrance (a south-west entrance is one of the most challenging Vastu defects), kitchen, underground water tank, or sump.

Sleeping guidelines for the south-west bedroom:
- The bed should be placed in the south-west corner of the room (not touching the wall, but close).
- Sleep with the head pointing south (feet north) for deep, restoring sleep. The second-best option is head east.
- Never sleep with the head pointing north — it creates sleep disturbances, restlessness, and over time can affect health.
- Keep mirrors away from direct view of the sleeping body; a mirror that reflects the sleeping person is inauspicious.
- Heavy furniture (wardrobes, shelves) belongs on the south and west walls. Keep the north and east walls of the bedroom lighter.

No-demolition remedies for a bedroom not in the south-west:
- Place a rose quartz crystal on the bedside table on the south-west side of the bed.
- Use earthy colours — terracotta, warm brown, deep ochre — in the bedroom to invoke earth energy.
- Place heavy items (a heavy bookshelf, large chest) in the south-west corner of the room.
- Add a Vastu pyramid under the mattress in the south-west corner.`,
  },

  {
    sourceId: "north-west-zone",
    title: "North-West Zone (Vayu Kona) — Air and Movement",
    content: `The north-west corner is called the Vayu Kona, governed by the wind god Vayu. It represents movement, transition, communication, and social activity. Things placed in the north-west tend to be transient rather than permanent.

Ideal uses for the north-west: guest bedroom, bathroom, garage, storeroom, grain storage, and rooms used by people who frequently travel or visit.

The air energy of the north-west means that people sleeping in a north-west bedroom tend to travel frequently or feel a sense of restlessness. For this reason, young adults preparing to leave home, or frequent travellers, are well-suited to a north-west bedroom. The master bedroom, however, should not be in the north-west as it disrupts the stability of the family head.

Vastu principles for the north-west:
- A bathroom or toilet in the north-west is one of the most Vastu-neutral placements for such a facility.
- Keep the north-west bedroom in light, airy colours — whites, light blues, and greys.
- If the north-west bathroom is heavily used, place a small bowl of sea salt inside to absorb stagnant energy.
- A north-west guest room naturally encourages guests to leave on time (a gentle Vastu benefit for the host).
- Avoid placing the family's main treasury, safe, or financial documents in the north-west — the air energy of this zone doesn't support wealth retention.

No-demolition remedies for unwanted heaviness in the north-west:
- Hang silver-toned wind chimes in the north-west to keep the air energy flowing.
- Place white or silver decor elements to invoke the air quality.`,
  },

  {
    sourceId: "entrance-guide",
    title: "Main Entrance — The Gateway of Energy",
    content: `The main entrance is the single most important Vastu element in any home. It is the primary doorway through which prana (life force energy) enters the dwelling. A well-positioned entrance amplifies every positive Vastu element inside the home; a poorly positioned entrance can undermine even an otherwise excellent Vastu layout.

Best entrance directions (from most to least ideal):
1. North-East — the most auspicious entrance, invites divine and financial energy
2. North — attracts wealth and career opportunities
3. East — brings health, vitality, and sunrise energy
4. North-West — acceptable with remedies; can cause occupant restlessness
5. West — moderate; brings completion and creative energy

Entrances to avoid:
- South-East — fire energy at the main entrance creates conflict, health challenges, and arguments in the home
- South — heavy, Yama energy; can bring legal troubles or chronic obstacles
- South-West — the most challenging entrance direction; associated with persistent difficulties and financial drain

Remedies for a south-facing or south-west entrance:
- Hang a Vastu energy pyramid above the outer door frame.
- Place a bright, warm-toned light (orange or gold) directly above the door.
- Put a brass Ganesha figurine or nameplate facing inward near the entrance.
- Keep the entrance area immaculate and clutter-free at all times.
- Place a camphor block in a corner near the door and replace it monthly.
- Add a potted plant (preferably a flowering one) on the left side of the entrance when facing outward.

General entrance Vastu tips:
- The entrance door should open inward (clockwise rotation) and swing fully.
- The threshold should always be well-lit — even at night. Light above the door activates positive energy.
- A clean, fresh doormat in a natural material (jute, cotton) at the entrance invites positive energy.
- Avoid shoes piled outside the entrance door — this symbolically blocks incoming energy.`,
  },

  {
    sourceId: "kitchen-guide",
    title: "Kitchen Vastu — The Heart of Health and Prosperity",
    content: `The kitchen represents the fire element (Agni) and governs health, vitality, and the family's overall well-being. The Agneya (south-east) corner is the ideal location because fire energy is most potent here.

Ideal kitchen placement: South-East
Acceptable: North-West (with remedies)
Avoid: North-East, South-West, Centre of home

Cooking direction matters greatly in Vastu. Always cook facing east — this means the stove should be on the south or south-east wall so the cook faces east. Cooking while facing east aligns the chef with solar energy and is believed to enhance health and the nutritional quality of food.

Key Vastu rules for the kitchen:
- The cooking stove should not touch the north-east wall. Keep it in the south-east or south section of the kitchen.
- Never place the stove directly opposite the sink or refrigerator — this creates a fire-water conflict.
- Maintain at least one foot (30cm) of counter space between the stove and any water source.
- The refrigerator does well in the north-west or south-west of the kitchen.
- Storage (pantry, overhead cabinets) is best on the south and west walls.
- Keep the north-east corner of the kitchen light, open, and clean — never store heavy items there.

Colours for the kitchen: orange, earthy yellow, light cream, or terracotta invoke fire element energy. Avoid blue or black in the kitchen.

No-demolition remedies for a kitchen in a non-ideal zone:
- Place a red or orange lamp in the south-east corner of the kitchen.
- Cook facing east regardless of stove position by rearranging or rotating the cooking area.
- Add a red or orange accent — a curtain, tea towels, or storage containers — to strengthen the fire element.
- Place a Vastu pyramid in the south-east corner of the kitchen.
- Burn a small diya (oil lamp) in the south-east corner of the kitchen each morning.`,
  },

  {
    sourceId: "bedroom-guide",
    title: "Master Bedroom Vastu — Rest, Authority, and Partnership",
    content: `The master bedroom profoundly affects the health, relationship quality, and sense of authority of the couple or primary occupant. The south-west zone provides the most stable, grounding energy for deep rest and relationship harmony.

Ideal master bedroom placement: South-West
Acceptable: South, West
Avoid: North-East, East, Centre (Brahmasthan), directly above the kitchen

Bed placement within the bedroom:
- Place the bed in the south-west corner of the room, leaving space on at least two sides.
- The head of the bed should point south or east. Never place the head of the bed pointing north — this creates sleep disturbance, restlessness, and over time, health issues, because the north pole repels the natural magnetic current in the human body.
- Head pointing west is neutral but less ideal. Head pointing south is the most restorative.

Furniture and layout rules:
- Heavy furniture (wardrobes, dressers, almirah) belongs against the south and west walls.
- Keep the north and east walls lighter — smaller furniture or open space.
- Mirrors: avoid placing a mirror directly facing the bed. A mirror that reflects the sleeping body is considered one of the most common Vastu defects. If you have a mirror on the wardrobe door, keep it covered with a cloth at night or rearrange so it doesn't reflect the bed.
- Avoid placing electronic devices (phones, tablets, laptops) on the bedside table or near the head of the bed.

Colours for the master bedroom: warm, earthy tones — terracotta, warm beige, dusty rose, muted gold. These invoke earth energy and support restful sleep.

No-demolition remedies for a bedroom in a non-ideal zone:
- Place a rose quartz crystal on the south-west side of the bed for relationship harmony.
- Use heavy, grounding fabrics — thick cotton, linen, or velvet — for bedding and curtains.
- Add a Vastu pyramid under the mattress in the south-west corner.
- Remove all electronic devices from the bedroom or at minimum keep them at least 3 feet from the head.`,
  },

  {
    sourceId: "pooja-guide",
    title: "Pooja Room Vastu — Sacred Space and Spiritual Energy",
    content: `The Pooja room (prayer room or altar) is the spiritual heart of a home. It should be placed in the direction of highest cosmic energy. The north-east is the most sacred and ideal location for a Pooja room in Vastu Shastra.

Ideal Pooja room placement: North-East (Ishaan Kona — most sacred)
Acceptable: East, North
Avoid: South, South-West, South-East, directly above or below the kitchen or toilet, inside a bedroom (ideally it's a separate room or dedicated alcove)

Rules for the Pooja room:
- The prayer altar should be placed so the devotee faces east or north-east while praying. This aligns the worshipper with auspicious cosmic energy.
- The deity idols or images should face west (so they face the east-praying devotee) or east (facing west-praying devotee). Never place deities facing south.
- Idols should not touch the north-east wall directly — leave a small gap.
- The Pooja room door should remain open during prayer and closed at other times.
- Keep the room clean, fragrant, and well-lit at all times. Clutter, dust, or broken items in the Pooja room create negative energy.
- Avoid storing non-worship items (shoes, bags, unused items) in the Pooja room.

What to place in the Pooja room:
- Fresh or dried flowers changed regularly
- Incense (sandalwood, jasmine, or rose are considered especially pure)
- Diyas or oil lamps (a continuously burning lamp, if maintained, is highly auspicious)
- A small copper or brass water vessel
- Clear quartz crystal for amplifying spiritual energy

No-demolition remedies for a Pooja room in a non-ideal zone:
- Place a copper Shri Yantra on the altar.
- Use saffron, yellow, or white for the walls of the prayer area.
- Burn camphor or sandalwood incense daily.
- Ensure the altar faces north-east, even if the room itself is in a different direction.`,
  },

  {
    sourceId: "toilet-guide",
    title: "Toilet and Bathroom Vastu — Managing Negative Energy",
    content: `In Vastu Shastra, the toilet and bathroom represent spaces of water release and waste, which carry lower vibrational energy. Their placement is important to prevent this energy from spreading into the home's positive zones.

Ideal toilet/bathroom placement: North-West, West, South
Acceptable: North (with care)
Avoid: North-East (most harmful), South-East, Centre of home (Brahmasthan)

Critical rule: Never place a toilet in the north-east. The north-east is the most sacred zone of the home. A toilet here depletes spiritual, mental, and financial energy from the occupants and is considered one of the most severe Vastu defects.

Vastu guidelines for toilets:
- The toilet seat should ideally be positioned so the user faces north or south (never east or west, as facing east or west while using the toilet is considered disrespectful to the sacred directions).
- Keep the toilet door always closed. An open toilet door allows waste energy to flow back into the home.
- Keep the toilet lid closed when not in use.
- Good ventilation (window or exhaust fan) is essential. Stagnant air in the toilet amplifies negative energy.
- Use light colours — white, cream, or light grey — for toilet walls. Avoid dark, heavy colours.

No-demolition remedies for a toilet in the north-east:
- Place a bowl of sea salt or Himalayan salt inside the toilet. The salt absorbs the negative energy. Change it every 30 days.
- Burn camphor in the north-east zone of the home (outside the toilet) every day.
- Paint the toilet walls white or cream.
- Hang a Vastu energy pyramid on the outer north-east wall facing the toilet.
- Place a small green plant just outside the toilet door to introduce positive energy.
- Never keep the toilet door open — keep it firmly shut at all times.

For a toilet in the south-east (fire zone):
- Place a bowl of salt inside.
- Add a small copper vessel with water in the south-east corner nearest to the toilet (in an adjacent room) to balance the conflicted energy.`,
  },

  {
    sourceId: "living-room-guide",
    title: "Living Room Vastu — Harmony, Guests, and Social Energy",
    content: `The living room is the centre of family interaction and the space that most guests experience. Its Vastu greatly affects family relationships, social standing, and the general atmosphere of the home.

Ideal living room placement: North, East, or North-East
Acceptable: North-West, West
Avoid: South, South-West

Furniture arrangement in the living room:
- Heavy sofas and entertainment units should be placed against the south and west walls. Keep the north and east walls lighter and more open.
- The main seating arrangement should ideally face north or east — family members seated facing north or east absorb auspicious energy during conversations.
- A centre table should be square or rectangular; avoid sharp-cornered tables pointing towards seating.
- The television should be on the south-east wall (fire element governs electronics).

Plants and decor for the living room:
- Place green plants on the north or east side of the living room. Money plant, jade plant, lucky bamboo, and peace lily are especially auspicious.
- Avoid thorny or sharp-leaved plants (cacti, cactus-like succulents) inside the home — they are believed to introduce aggression.
- Artwork on the north or east wall should depict uplifting scenes — flowing water, green landscapes, or sunrise. Avoid images depicting violence, dark animals, or struggle.
- A small water feature (indoor fountain or aquarium) in the north-east corner of the living room activates wealth energy.
- Mirrors on the north or east wall effectively expand the perceived size of the room and double the positive energy.

No-demolition remedies for a south or south-west living room:
- Place a large mirror on the north or east wall of the living room.
- Introduce multiple green plants.
- Use cool, calming colours (white, cream, light blue) on south and west walls.
- Place a Vastu pyramid under the centre carpet.`,
  },

  {
    sourceId: "no-demolition-remedies",
    title: "No-Demolition Vastu Remedies — Correcting Without Construction",
    content: `One of the most practical aspects of modern Vastu is that many defects can be corrected without structural changes. These "remedial Vastu" tools work by introducing balancing energies into a space.

Crystals:
- Clear quartz: a universal energy amplifier. Place in the north-east or any room that feels heavy. Cleanses and purifies.
- Rose quartz: the stone of love and harmony. Place in the south-west bedroom or relationship zone for partnership harmony.
- Amethyst: promotes calm and mental clarity. Good for study rooms or north-east zones.
- Black tourmaline: protective energy. Place near the main entrance or in a south-west corner to ground and protect.

Sea salt and Himalayan salt:
Sea salt is a powerful Vastu remedy for absorbing negative energy. Place small bowls of rock salt or sea salt:
- In a toilet located in a Vastu-sensitive zone (change monthly)
- In corners of rooms that feel heavy or stagnant (change monthly)
- Near the main entrance in an inconspicuous dish (change weekly)

Vastu yantras and pyramids:
- A copper Shri Yantra on the north-east wall activates prosperity and spiritual energy.
- Vastu energy pyramids placed in defective zones (like a toilet in the north-east wall) help redirect harmful energy.
- A pair of brass Vastu turtles (Feng Shui crossover) placed in the north activates career and financial energy.

Plants:
- Tulsi (holy basil): the most sacred Vastu plant. Place in the north, north-east, or east, ideally near a window. Never place tulsi in the bedroom.
- Money plant: north or north-east for wealth activation. Keep it healthy and growing.
- Lucky bamboo: north or east for career and positive energy.
- Avoid artificial flowers — fresh or living plants carry prana; dried or artificial plants do not.

Mirrors: Place on north or east walls to expand and reflect positive energy. Avoid mirrors facing the main door directly, facing beds, or on south walls.

Lighting: Brightening dark corners (especially north-east, east, and north) is one of the simplest Vastu corrections. Use warm-toned (not cold blue) lighting throughout the home.`,
  },

  {
    sourceId: "vastu-colours",
    title: "Vastu Colours — Using Colour to Balance Directional Energy",
    content: `Colour is one of the most accessible Vastu remedies. Each direction resonates with specific colours that align with its governing element. Painting walls in the right colours can significantly strengthen or correct the energy of a zone.

North (water and earth element):
Best colours: green, blue-green, light blue, white.
Green activates wealth energy in the north. Blue-green connects to water flow and abundance.
Avoid: red, orange, bright yellow (fire colours conflict with north's water energy).

North-East (water and space element):
Best colours: white, cream, light yellow, pale blue.
This sacred zone should be light and pure — heavy or dark colours suppress its spiritual energy.
Avoid: red, dark blue, black.

East (fire-air element):
Best colours: light green, emerald green, earthy brown.
Green honours the wood/growth energy of the east. Morning light colours work well here.

South-East (fire element):
Best colours: orange, red, bright yellow, earthy terracotta.
These fire colours amplify the Agni energy of the kitchen zone.
Avoid: blue, black, white (water colours suppress fire here).

South (earth element):
Best colours: earthy tones — terracotta, warm red, coral, deep ochre.
The south is a grounding, stable zone that benefits from warm, earthy hues.

South-West (earth element):
Best colours: yellow, earthy brown, warm beige, muted gold.
These colours strengthen the earth energy of the most stable zone.

West (space element):
Best colours: white, silver, grey, metallic tones.
The west appreciates the clean, open qualities of space-related colours.

North-West (air element):
Best colours: white, off-white, silver, pale grey, light blue.
Air energy colours are light and unobtrusive. Avoid heavy, dark colours here.

Centre (Brahmasthan — space element):
Best colours: white, cream, or very light tones. The centre of the home should be as open and light as possible. Avoid dark or heavy colours in any central space.`,
  },

  {
    sourceId: "vastu-prosperity",
    title: "Vastu for Prosperity — Activating Wealth Energy in Your Home",
    content: `Vastu Shastra offers many practical ways to activate financial energy in a home without structural changes. The north direction (ruled by Kubera, the treasurer of the gods) is the primary wealth zone.

Activating the north zone for financial prosperity:
- Keep the north side of the home lighter than the south side — fewer walls, more open space.
- Place a small flowing water feature (indoor fountain, aquarium) in the north of the main living area. Moving water in the north directly channels Kubera's energy.
- A mirror on the north wall symbolically doubles the wealth space.
- Money plant or jade plant growing in the north or north-east corner keeps prosperity energy flowing.
- Do not store trash, waste bins, or clutter in the north zone.

The Locker or Safe (wealth storage):
- Place the home safe or locker in the south-west section of the home — the earth zone provides stability for financial assets.
- The safe door should open towards the north. When you open the safe, you should be facing north (Kubera's direction), symbolically bringing wealth into view.

Common Vastu defects that cause financial instability:
1. Main entrance in the south or south-west — place a Vastu pyramid above the door, brighten the entrance.
2. Toilet in the north — place salt inside, keep the door shut, hang a pyramid on the outer north wall.
3. Underground water sump in the south-east or south-west — counteract with a small water element in the north-east.
4. Broken items kept in the home — remove or repair immediately. Broken mirrors, clocks, and appliances represent stagnant energy.
5. Leaking taps — fix them. Leaking water symbolises financial drain.

For a home office: face north or east while working. The north connects to Kubera energy during work, and the east brings clarity and new opportunities.`,
  },

  {
    sourceId: "vastu-health",
    title: "Vastu for Health — Directional Energy and Well-Being",
    content: `Vastu Shastra has specific guidance for supporting the physical health and mental well-being of occupants. The east direction, ruled by the sun god Indra, is the primary health zone.

East zone guidelines for health:
- Maximise windows and openings on the east side of the home to allow morning sunlight to enter. Morning sunlight (before 10am) has positive effects on vitamin D, circadian rhythms, and mood.
- A main entrance in the east is highly auspicious for health and vitality.
- Children's bedrooms in the east tend to support physical energy and academic clarity.

Sleep and the master bedroom:
- Head pointing south for sleep is the most Vastu-recommended sleeping direction. The human body's magnetic axis aligns better with a south-pointing head.
- Never sleep with the head pointing north — this creates sleep disturbance, low energy, and over time, health deterioration according to Vastu tradition.
- Keep electronic devices away from the sleeping area. Phones and tablets near the head disrupt sleep quality.
- Remove any overhead beams directly above the bed if possible; if structural beams run above the sleeping position, hang a Vastu crystal or use a canopy to visually break their energy.

Mental health and the north-east:
- The north-east corner supports mental clarity, calm, and spiritual well-being. A meditation corner or Pooja room in the north-east benefits mental health.
- A toilet or heavy storage in the north-east can manifest as chronic stress, anxiety, or unclear thinking in the occupants.

Kitchen Vastu for health:
- Always cook facing east. The fire element in the south-east, combined with the cook facing the sunrise direction, is believed to maximise the vital energy (prana) of prepared food.
- Keep the kitchen and storage areas clean and organised. Stale or expired food creates stagnant energy.

Water and the north-east:
- Drinking water storage (jug, water purifier) placed in the north-east of the kitchen keeps the water energetically pure according to Vastu principles.`,
  },
];
