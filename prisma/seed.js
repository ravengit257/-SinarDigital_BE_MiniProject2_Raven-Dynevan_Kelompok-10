import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');


  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Action',
        description: 'Action movies',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Comedy',
        description: 'Comedy movies',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Romance',
        description: 'Romance movies',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Animated',
        description: 'Animated movies',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Thriller',
        description: 'Thriller movies',
      },
    }),
  ]);

  console.log('✅ Categories created:', categories.length);

  const products = [

    { name: 'Frozen', description: 'Anna dan Elsa menghadapi keajaiban es dan perjalanan emosional tentang keluarga dan keberanian',  categoryId: categories[3].id },
    { name: 'Moana', description: 'Moana berlayar melintasi samudera untuk menyelamatkan desanya dan menemukan jati dirinya', categoryId: categories[3].id },
    { name: 'Barbie"', description: 'Barbie memulai petualangan ke dunia nyata dalam kisah penuh humor dan kehidupan modern', categoryId: categories[2].id },
    { name: 'The Hunger Games', description: 'Katniss Everdeen berjuang dalam kompetisi mematikan demi bertahan hidup',  categoryId: categories[0].id },
    { name: 'Avengers', description: 'Para superhero bersatu untuk melawan ancaman global dari Loki dan pasukan Chitauri', categoryId: categories[0].id },

  
    { name: 'Iron Man', description: 'Tony Stark menjadi Iron Man setelah penculikan yang mengubah hidupnya',  categoryId: categories[0].id },
    { name: 'Transformers', description: 'Pertarungan antara Autobots dan Decepticons untuk menyelamatkan Bumi',  categoryId: categories[0].id },
    { name: 'Zootopia', description: 'Dunia hewan antropomorfik penuh misteri yang mengharuskan officer Judy Hopps memecahkannya',  categoryId: categories[3].id },
    { name: 'Minions', description: 'Petualangan lucu para Minion sebelum bertemu dengan Gru',  categoryId: categories[3].id },
    { name: 'Toy Story 4', description: 'Woody dan Forky memulai perjalanan emosional menemukan arti menjadi mainan', categoryId: categories[3].id },

  
    { name: 'John Wick', description: 'John Wick membalas dendam terhadap sindikat kriminal yang merenggut segalanya darinya',  categoryId: categories[0].id },
    { name: 'Coco', description: 'Miguel melakukan perjalanan ke alam arwah untuk mengungkap kisah keluarganya',  categoryId: categories[3].id },
    { name: 'Inside Out', description: 'Kisah emosional tentang lima emosi utama yang mengatur pikiran seorang gadis kecil', categoryId: categories[3].id },
    { name: 'Wonder Woman ', description: 'Putri Amazon, Diana, menemukan kekuatannya saat menghadapi perang dunia',  categoryId: categories[0].id },
    { name: 'Black Panther', description: 'T Challa menjadi Raja Wakanda dan melindungi negerinya dari ancaman baru', categoryId: categories[0].id },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(' Products created:', products.length);
  console.log(' Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(' Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });