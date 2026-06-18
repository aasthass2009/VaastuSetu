import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Room-by-Room Vastu Guide | VaastuSetu",
  description:
    "Learn the ideal Vastu direction for every room — Main Entrance, Kitchen, Master Bedroom, Pooja Room, Bathroom, and Living Room — with practical no-demolition remedies.",
};

// ── Data ─────────────────────────────────────────────────────────────────────

const ROOM_GUIDES = [
  {
    key: "entrance",
    icon: "🚪",
    label: "Main Entrance",
    idealDirs: "North · North-East · East",
    badgeColor: "bg-green-50 text-green-800",
    weight: "22 / 100 pts",
    whyItMatters:
      "The main entrance is the single most important Vastu element in any home. It is the primary gateway through which prana — life force energy — enters the dwelling. Its direction sets the tone for every room behind it. An east, north, or north-east entrance invites health, prosperity, and spiritual clarity. A south or south-west entrance requires prompt remedial attention.",
    dos: [
      "Keep the entrance brightly lit at all times, including a light directly above the door",
      "Place a clean, natural-fibre doormat (jute or cotton) at the threshold",
      "Add a polished brass nameplate or a small Ganesha figurine facing inward",
      "Grow a flowering plant or place fresh flowers on one side of the door",
    ],
    donts: [
      "Don't pile shoes or footwear at the entrance — it symbolically blocks incoming energy",
      "Don't place a mirror directly facing the main door — it deflects prana back out",
      "Don't allow clutter, dead plants, or broken items near the door",
      "Don't keep the entrance dark, damp, or poorly maintained",
    ],
    remedy:
      "If your entrance faces south or south-west: hang a Vastu energy pyramid above the outer door frame, place a brass Ganesha just inside the door, and keep the area brightly lit with warm (not cool-blue) lighting. A camphor block in a corner near the entrance — replaced monthly — helps redirect energy. A copper bell above the door and a heavy brass doormat are also effective.",
  },
  {
    key: "kitchen",
    icon: "🍳",
    label: "Kitchen",
    idealDirs: "South-East (Ideal) · North-West (Acceptable)",
    badgeColor: "bg-orange-50 text-orange-800",
    weight: "20 / 100 pts",
    whyItMatters:
      "The kitchen represents the fire element (Agni) and governs the family's health, vitality, and nourishment. The south-east corner — the Agni zone — is its natural home, where fire energy is most potent. A misplaced kitchen (especially in the north-east or south-west) creates elemental conflict that can manifest as recurring health issues or financial instability.",
    dos: [
      "Always cook facing east — this aligns you with solar energy and is believed to enhance the food's vitality",
      "Keep the cooking stove in the south-east corner of the kitchen",
      "Use orange, earthy yellow, or terracotta accents in the kitchen colour scheme",
      "Keep the north-east corner of the kitchen light, open, and clutter-free",
    ],
    donts: [
      "Don't place the stove and sink directly next to or touching each other — separate fire and water by at least 30 cm",
      "Don't locate the stove in the north-east corner of the kitchen",
      "Don't cook facing south — this is considered particularly inauspicious",
      "Don't store overflowing waste bins or mops in the kitchen's north or east area",
    ],
    remedy:
      "If your kitchen is not in the south-east: place a red or orange lamp in the south-east corner of the kitchen to strengthen the fire element. Burn a small diya (oil lamp) in that corner each morning. Always cook facing east regardless of where the stove sits. Painting one kitchen wall in earthy yellow or terracotta helps balance the energy.",
  },
  {
    key: "bedroom",
    icon: "🛏️",
    label: "Master Bedroom",
    idealDirs: "South-West (Ideal) · South · West",
    badgeColor: "bg-purple-50 text-purple-800",
    weight: "18 / 100 pts",
    whyItMatters:
      "The master bedroom is where the family head rests, and its Vastu determines the quality of sleep, relationship harmony, and the occupant's sense of authority. The south-west provides grounding earth energy — the most stable zone in Vastu. Sleeping in the north-east or east can cause restlessness, sleep disorders, and a feeling of instability over time.",
    dos: [
      "Sleep with your head pointing south — this aligns with the earth's magnetic field and promotes deep rest",
      "Place the bed in the south-west corner of the room, leaving space on at least two sides",
      "Keep heavy furniture (wardrobe, chest) on the south and west walls",
      "Use warm, earthy colours — terracotta, warm beige, dusty rose — for walls and bedding",
    ],
    donts: [
      "Never sleep with your head pointing north — this creates chronic sleep disturbance and, over time, health issues",
      "Don't place a mirror directly facing the bed — cover wardrobe mirrors at night",
      "Don't keep electronic devices (phones, laptops) on the bedside table or near your head",
      "Don't place a TV on the east or north-east wall of the bedroom",
    ],
    remedy:
      "If your master bedroom is not in the south-west: place a rose quartz crystal on the south-west side of the bed for relationship harmony and grounding. Add a heavy item (large bookshelf, storage chest) in the south-west corner of the room. Use earthy, warm tones in the decor. Sleep with your head pointing south regardless of the room's position — this single change makes a significant difference.",
  },
  {
    key: "pooja",
    icon: "🕉️",
    label: "Pooja Room",
    idealDirs: "North-East (Ideal) · East · North",
    badgeColor: "bg-amber-50 text-amber-800",
    weight: "14 / 100 pts",
    whyItMatters:
      "The Pooja room is the spiritual heart of the home. The north-east corner — the Ishaan Kona — is considered the point where divine cosmic energy is most concentrated in any structure. A prayer room here amplifies spiritual practice, mental clarity, and the overall peace of the household. Placing a toilet in the north-east is one of the most serious Vastu defects.",
    dos: [
      "Face east or north-east while praying — this aligns the devotee with the most auspicious energy",
      "Keep the room immaculately clean, fragrant with incense, and well-lit",
      "Offer fresh flowers regularly and maintain a continuously burning diya",
      "Place a small copper or brass water vessel and a clear quartz crystal on the altar",
    ],
    donts: [
      "Never place a toilet, kitchen, or heavy storage in or directly adjacent to the north-east",
      "Don't store non-worship items (shoes, bags, unused boxes) in the Pooja room",
      "Don't place broken or chipped deity idols — repair or respectfully immerse them",
      "Don't face south while praying or place deity images facing south",
    ],
    remedy:
      "If your Pooja room is in a non-ideal direction: place a copper Shri Yantra on the altar and orient the altar itself so you face north-east while praying, regardless of the room's location. Use saffron or white for the walls. Burn camphor or sandalwood incense daily. A clear quartz crystal in the north-east corner of the room helps amplify and purify spiritual energy.",
  },
  {
    key: "toilet",
    icon: "🚿",
    label: "Toilet / Bathroom",
    idealDirs: "North-West · West · South",
    badgeColor: "bg-blue-50 text-blue-800",
    weight: "14 / 100 pts",
    whyItMatters:
      "The toilet and bathroom carry waste energy. Their placement determines whether this energy is safely expelled or allowed to contaminate the home's positive zones. The north-west is the ideal location because the air element here naturally moves things outward. The north-east is the absolute worst placement — a toilet there drains the home's spiritual, mental, and financial energy.",
    dos: [
      "Keep the toilet lid closed at all times when not in use",
      "Keep the toilet door shut — an open door allows waste energy to drift into the home",
      "Place a small bowl of sea salt or Himalayan salt inside the toilet, changing it monthly",
      "Use white, cream, or light grey for the walls and keep the space well-ventilated",
    ],
    donts: [
      "Never place the toilet in the north-east under any circumstances — it is the most severe Vastu defect",
      "Don't leave the bathroom door open habitually",
      "Don't place the toilet in the exact centre of the home (Brahmasthan)",
      "Don't ignore a blocked drain or leaking pipe — they represent stagnant or draining energy",
    ],
    remedy:
      "If your toilet is in the north-east: place a bowl of sea salt or Himalayan salt inside, changing it every 30 days. Always keep the lid closed and the door shut. Paint the walls white or cream. Hang a Vastu energy pyramid on the outer north-east wall. Burn camphor in the north-east zone of the home daily. Place a green plant just outside the toilet door to introduce positive energy nearby.",
  },
  {
    key: "living",
    icon: "🛋️",
    label: "Living Room",
    idealDirs: "North · East · North-East",
    badgeColor: "bg-teal-50 text-teal-800",
    weight: "12 / 100 pts",
    whyItMatters:
      "The living room is where family conversations happen, guests are received, and collective energy is shaped. Its Vastu influences social harmony, family relationships, and the general atmosphere of the home. North and east placements allow morning light and prosperity energy to flow into the most-used social space, while south-west living rooms can feel heavy and create friction.",
    dos: [
      "Place heavy sofas and entertainment units against the south and west walls",
      "Keep the north and east sides of the room lighter and more open",
      "Introduce green plants (money plant, jade, lucky bamboo) in the north or north-east corner",
      "Hang uplifting, positive art — flowing water, green landscapes, sunrise — on north or east walls",
    ],
    donts: [
      "Don't place thorny plants (cacti) inside the home — they introduce agitated energy",
      "Don't hang images depicting battle, grief, or darkness on any wall of the living room",
      "Don't clutter the north-east corner with heavy furniture or storage",
      "Don't place the television on the north wall — the south-east wall is better for electronics",
    ],
    remedy:
      "If your living room is in the south or south-west: place a large mirror on the north or east wall to expand and reflect positive energy. Introduce multiple green plants. Place a Vastu pyramid under the centre carpet. Use cool, light colours — whites, creams, soft blues — on the south and west walls to counterbalance the heaviness of those zones. A small water feature in the north-east corner is especially effective.",
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function RoomGuidesPage() {
  return (
    <div className="bg-cream-200">
      {/* Hero */}
      <section className="bg-brand-indigo px-6 py-20 text-center md:py-28">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3 font-body text-sm font-medium uppercase tracking-[0.2em] text-brand-gold">
            Room-by-Room Guide
          </p>
          <h1 className="mb-6 font-heading text-5xl font-semibold leading-tight text-cream-200 md:text-6xl">
            Vastu for Every{" "}
            <span className="text-brand-saffron">Room in Your Home</span>
          </h1>
          <p className="mx-auto max-w-2xl font-body text-lg leading-relaxed text-cream-300">
            Each room governs a different dimension of life. Discover the ideal
            directions, what to do and avoid, and practical no-demolition
            remedies for any placement.
          </p>
        </div>
      </section>

      {/* Intro strip */}
      <div className="bg-brand-indigo border-t border-white/10">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 px-6 py-6 text-center">
          {[
            { label: "6 Rooms Covered", icon: "🏠" },
            { label: "No Demolition Needed", icon: "🔧" },
            { label: "Classical Vastu Sources", icon: "📜" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="text-lg">{item.icon}</span>
              <span className="font-body text-sm text-cream-300">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Room guide accordion */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl space-y-4">
          {ROOM_GUIDES.map((room) => (
            <details
              key={room.key}
              className="group rounded-2xl border border-cream-300 bg-white open:shadow-md transition-shadow"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 select-none">
                <div className="flex items-center gap-4 min-w-0">
                  <span className="text-3xl shrink-0" aria-hidden>
                    {room.icon}
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-heading text-xl font-semibold text-brand-indigo leading-tight">
                      {room.label}
                    </h2>
                    <span
                      className={`mt-1 inline-block rounded-full px-2.5 py-0.5 font-body text-xs font-medium ${room.badgeColor}`}
                    >
                      {room.idealDirs}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="hidden font-body text-xs text-indigo-400 sm:block">
                    {room.weight}
                  </span>
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5 shrink-0 text-indigo-400 transition-transform duration-200 group-open:rotate-180"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </summary>

              {/* Expanded content */}
              <div className="border-t border-cream-300 px-6 pb-6 pt-5">
                {/* Why it matters */}
                <div className="mb-5">
                  <h3 className="mb-2 font-heading text-base font-semibold text-brand-indigo">
                    Why it matters
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-indigo-800">
                    {room.whyItMatters}
                  </p>
                </div>

                {/* Dos and don'ts */}
                <div className="mb-5 grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-semibold text-green-700">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs">
                        ✓
                      </span>
                      Do
                    </h3>
                    <ul className="space-y-2">
                      {room.dos.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 font-body text-sm text-indigo-800"
                        >
                          <span className="mt-0.5 shrink-0 text-green-600">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-3 flex items-center gap-2 font-heading text-sm font-semibold text-red-700">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs">
                        ✗
                      </span>
                      Avoid
                    </h3>
                    <ul className="space-y-2">
                      {room.donts.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 font-body text-sm text-indigo-800"
                        >
                          <span className="mt-0.5 shrink-0 text-red-400">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* No-demolition remedy */}
                <div className="rounded-xl bg-amber-50 border border-amber-200 px-5 py-4">
                  <h3 className="mb-1.5 flex items-center gap-2 font-heading text-sm font-semibold text-amber-800">
                    <span>✦</span>
                    No-Demolition Remedy
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-amber-900">
                    {room.remedy}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-indigo px-6 py-16 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-4 font-heading text-3xl font-semibold text-cream-200">
            See how your home scores
          </h2>
          <p className="mb-8 font-body text-base text-cream-300">
            Use our free Vastu Score tool to get a personalised room-by-room
            analysis and remedies tailored to your home.
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-brand-saffron hover:bg-saffron-600"
            >
              <Link href="/vaastu-score">Get Your Vastu Score</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-cream-300 text-cream-200 hover:bg-cream-200/10 hover:text-cream-200"
            >
              <Link href="/faq">Read the FAQ</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
