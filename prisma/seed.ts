#!/usr/bin/env tsx
import { prisma } from '../lib/prisma';
import { fallbackImage } from '@/lib/utils';

const CATEGORIES = ['T-Shirts','Hoodies','Sweatshirts','Caps','Mugs','Posters','Canvas Prints','Phone Cases','Tote Bags','Stickers','Wall Art','Accessories'];
const BRANDS = ['New Nation','Studio Line','Community'];

const SEED_PRODUCTS = [
  { name:'Essential Logo Tee', category:'T-Shirts', price:2999, brand:'New Nation' },
  { name:'Oversized Hoodie', category:'Hoodies', price:5499, brand:'New Nation' },
  { name:'Classic Cap', category:'Caps', price:2499, brand:'New Nation' },
  { name:'Ceramic Mug', category:'Mugs', price:1999, brand:'New Nation' },
  { name:'Studio Poster', category:'Posters', price:3499, brand:'Studio Line' },
  { name:'Canvas Print', category:'Canvas Prints', price:6999, brand:'Studio Line' },
  { name:'Phone Case', category:'Phone Cases', price:2499, brand:'Community' },
  { name:'Tote Bag', category:'Tote Bags', price:3299, brand:'New Nation' },
  { name:'Sticker Pack', category:'Stickers', price:999, brand:'Community' },
  { name:'Wall Art Panel', category:'Wall Art', price:5999, brand:'Studio Line' },
  { name:'Sweatshirt', category:'Sweatshirts', price:4999, brand:'New Nation' },
  { name:'Lanyard', category:'Accessories', price:1499, brand:'Community' },
];

async function main() {
  for (const p of SEED_PRODUCTS) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60);
    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        name: p.name,
        category: p.category,
        brand: p.brand,
        price: p.price,
        description: `Premium ${p.category.toLowerCase()} from ${p.brand}.`,
        images: [fallbackImage(p.name)],
        tags: [p.category.toLowerCase(), 'printful'],
        featured: Math.random() > 0.5,
      },
    });
  }
  console.log('Seeded products.');
}
main().catch(e => console.error(e)).finally(() => prisma.$disconnect());