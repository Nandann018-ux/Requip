import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const users = [
    {
      firstName: 'Nandan',
      lastName: 'Acharya',
      email: 'nandan@example.com',
      primaryMobile: '9876543210',
      secondaryMobile: '9123456789',
      aadhaarNumber: '123412341234',
      panNumber: 'ABCDE1234F',
      dateOfBirth: new Date('2000-01-15'),
      placeOfBirth: 'Bangalore',
      currentAddress: '123 MG Road, Bangalore, Karnataka 560001',
      permanentAddress: '456 Brigade Road, Bangalore, Karnataka 560001',
    },
    {
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya@example.com',
      primaryMobile: '8765432109',
      aadhaarNumber: '567856785678',
      panNumber: 'FGHIJ5678K',
      dateOfBirth: new Date('1998-05-20'),
      placeOfBirth: 'Mumbai',
      currentAddress: '789 Andheri West, Mumbai, Maharashtra 400053',
      permanentAddress: '789 Andheri West, Mumbai, Maharashtra 400053',
    },
  ];

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
    console.log(`Created user: ${user.firstName} ${user.lastName}`);
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
