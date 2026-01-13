import { db } from '@/lib/db';
import { news } from '@/lib/db/schema';

const sampleNews = [
  {
    title: 'Annual Tech Conference 2024',
    content: 'Join us for our annual technology conference featuring keynote speakers from leading tech companies. This year we will focus on AI, cloud computing, and cybersecurity.',
    author: 'John Smith',
    organization: 'Tech Innovators Inc.',
    eventDate: new Date('2024-06-15T10:00:00Z'),
  },
  {
    title: 'Summer Networking Event',
    content: 'Network with industry professionals at our summer networking event. Enjoy refreshments, engaging discussions, and opportunities to connect with peers.',
    author: 'Sarah Johnson',
    organization: 'Business Professionals Association',
    eventDate: new Date('2024-07-20T18:00:00Z'),
  },
  {
    title: 'Workshop: Modern Web Development',
    content: 'Learn the latest trends in web development including React, Next.js, and TypeScript. Hands-on workshop with practical examples and Q&A session.',
    author: 'Mike Chen',
    organization: 'Developer Community Hub',
    eventDate: new Date('2024-08-10T14:00:00Z'),
  },
  {
    title: 'Charity Fundraiser Gala',
    content: 'Support local charities at our annual fundraising gala. Enjoy dinner, live music, and auctions. All proceeds go to supporting education initiatives.',
    author: 'Emily Davis',
    organization: 'Community Outreach Foundation',
    eventDate: new Date('2024-09-05T19:00:00Z'),
  },
  {
    title: 'Innovation Summit 2024',
    content: 'Explore cutting-edge innovations in technology, healthcare, and sustainability. Panel discussions, product demos, and networking opportunities.',
    author: 'Robert Wilson',
    organization: 'Innovation Labs',
    eventDate: new Date('2024-10-12T09:00:00Z'),
  },
];

async function seed() {
  try {
    console.log('Seeding database...');
    
    // Insert sample news
    await db.insert(news).values(sampleNews);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
