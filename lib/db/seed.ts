import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "./index";
import { news } from "./schema";

const sampleNews = [
  {
    title: "Annual Technology Summit 2024",
    content: "Join us for our annual technology summit featuring keynote speakers from leading tech companies. This year's theme focuses on AI innovation and sustainable technology solutions. The event will include workshops, networking sessions, and product demonstrations.",
    author: "Sarah Johnson",
    category: "Technology",
  },
  {
    title: "Community Health Fair",
    content: "Our organization is hosting a free community health fair this Saturday. Services include health screenings, vaccinations, nutrition counseling, and fitness assessments. All community members are welcome to attend.",
    author: "Dr. Michael Chen",
    category: "Health",
  },
  {
    title: "Environmental Conservation Workshop",
    content: "Learn about sustainable practices and environmental conservation in our upcoming workshop. Topics include renewable energy, waste reduction, and local ecosystem preservation. Registration is required.",
    author: "Emily Rodriguez",
    category: "Environment",
  },
  {
    title: "Youth Leadership Program Launch",
    content: "We're excited to announce the launch of our new youth leadership program. This initiative aims to empower young people through mentorship, skill-building workshops, and community service opportunities.",
    author: "James Wilson",
    category: "Education",
  },
  {
    title: "Cultural Festival 2024",
    content: "Celebrate diversity at our annual cultural festival featuring music, dance, food, and art from around the world. This family-friendly event promotes cultural understanding and community unity.",
    author: "Aisha Patel",
    category: "Culture",
  },
  {
    title: "Business Networking Breakfast",
    content: "Connect with local business leaders and entrepreneurs at our monthly networking breakfast. This event provides opportunities for collaboration, partnership, and professional growth.",
    author: "Robert Thompson",
    category: "Business",
  },
];

async function seed() {
  console.log("Seeding database...");

  try {
    // Clear existing data
    await db.delete(news);

    // Insert sample news
    await db.insert(news).values(sampleNews);

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
