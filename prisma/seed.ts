import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, UserRole } from "../lib/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const consultantData = [
  {
    email: "dr.meera.iyer@vaastusetu.com",
    name: "Dr. Meera Iyer",
    city: "Bangalore",
    bio: "PhD in Vedic Architecture from Mysore University. 18 years of residential and temple Vastu consultancy across South India. Specialises in energy-zone mapping and remedial corrections without structural changes.",
    specialisations: ["Residential", "Temples & Spiritual Spaces", "Remedial Vastu"],
    languages: ["English", "Kannada", "Tamil", "Hindi"],
    experienceYears: 18,
    ratingAvg: 4.9,
    ratingCount: 312,
    hourlyRateINR: 4500,
  },
  {
    email: "arjun.sharma@vaastusetu.com",
    name: "Arjun Sharma",
    city: "Jaipur",
    bio: "Trained under the Jaipur Vastu Vidyalaya lineage. Focuses on commercial properties, office layouts, and plot selection for new construction. Known for combining classical Vastu Shastra with modern architectural software.",
    specialisations: ["Commercial", "Office & Workspace", "Plot & Construction"],
    languages: ["English", "Hindi", "Rajasthani"],
    experienceYears: 12,
    ratingAvg: 4.7,
    ratingCount: 198,
    hourlyRateINR: 3500,
  },
  {
    email: "sunita.kulkarni@vaastusetu.com",
    name: "Sunita Kulkarni",
    city: "Mumbai",
    bio: "Former architect turned Vastu consultant. Brings a rare blend of technical drafting expertise and traditional Vastu knowledge. Specialises in apartment complexes and urban high-rises where classical rules require adaptation.",
    specialisations: ["Residential", "Apartments & High-rise", "Interior Vastu"],
    languages: ["English", "Marathi", "Hindi"],
    experienceYears: 9,
    ratingAvg: 4.8,
    ratingCount: 156,
    hourlyRateINR: 3000,
  },
  {
    email: "rajan.nambiar@vaastusetu.com",
    name: "Rajan Nambiar",
    city: "Thrissur",
    bio: "Third-generation Vastu practitioner from Kerala, schooled in the Thachu Shastra tradition. Specialises in wellness centres, hospitals, and healing spaces. Fluent in Sanskrit Vastu texts and their practical interpretation.",
    specialisations: ["Wellness & Healthcare", "Hospitality", "Heritage Properties"],
    languages: ["English", "Malayalam", "Tamil"],
    experienceYears: 22,
    ratingAvg: 4.95,
    ratingCount: 89,
    hourlyRateINR: 6000,
  },
];

async function main() {
  console.log("Seeding consultants…");

  for (const c of consultantData) {
    const { email, name, city, bio, specialisations, languages, experienceYears, ratingAvg, ratingCount, hourlyRateINR } = c;

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        clerkId: `seed_${email}`,
        email,
        name,
        role: UserRole.CONSULTANT,
      },
    });

    await prisma.consultant.upsert({
      where: { userId: user.id },
      update: { city, bio, specialisations, languages, experienceYears, ratingAvg, ratingCount, hourlyRateINR },
      create: {
        userId: user.id,
        city,
        bio,
        specialisations,
        languages,
        experienceYears,
        ratingAvg,
        ratingCount,
        hourlyRateINR,
        isAvailable: true,
      },
    });

    console.log(`  ✓ ${name} (${email})`);
  }

  console.log("\nDone. 4 consultants seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
