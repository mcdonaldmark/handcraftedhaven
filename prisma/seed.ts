import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("starting seeding...")

    // 1. Clean database
    await prisma.productImage.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()

    // 2. Create Categories
    const catCeramics = await prisma.category.create({ data: { name: 'Ceramics' } })
    const catTextiles = await prisma.category.create({ data: { name: 'Textiles' } })
    const catWoodwork = await prisma.category.create({ data: { name: 'Woodwork' } })
    const catJewelry = await prisma.category.create({ data: { name: 'Jewelry' } })
    const catCandles = await prisma.category.create({ data: { name: 'Candles' } })
    const catPaintings = await prisma.category.create({ data: { name: 'Paintings' } })
    const catSculptures = await prisma.category.create({ data: { name: 'Sculptures' } })
    const catPhotography = await prisma.category.create({ data: { name: 'Photography' } })
    const catPrints = await prisma.category.create({ data: { name: 'Prints' } })
    const catOther = await prisma.category.create({ data: { name: 'Other' } })



    // 3. Create Artisans
    const artisansData = [
        { name: 'Elena Rodriguez', email: 'elena@haven.com', shopName: "Elena's Pottery", bio: "lorem ipsum dolor sit amet consectetur adipiscing elite, lorem ipsum dolor sit amet consectetur adipiscing elite, lorem ipsum dolor sit amet consectetur adipiscing elite", role: "artisan" },
        { name: 'Marcus Thorne', email: 'marcus@haven.com', shopName: "Marcus Woodwork", bio: "lorem ipsum dolor sit amet consectetur adipiscing elite, lorem ipsum dolor sit amet consectetur adipiscing elite, lorem ipsum dolor sit amet consectetur adipiscing elite", role: "artisan" },
        { name: 'Sarah Jenkins', email: 'sarah@haven.com', shopName: "Sarah's Textiles", bio: "lorem ipsum dolor sit amet consectetur adipiscing elite, lorem ipsum dolor sit amet consectetur adipiscing elite, lorem ipsum dolor sit amet consectetur adipiscing elite", role: "artisan" },
        { name: 'David Chen', email: 'david@haven.com', shopName: "David's Woodwork", bio: "lorem ipsum dolor sit amet consectetur adipiscing elite, lorem ipsum dolor sit amet consectetur adipiscing elite, lorem ipsum dolor sit amet consectetur adipiscing elite", role: "artisan" },
        { name: 'Emily Carter', email: 'emily@haven.com', shopName: "Emily's Textiles", bio: "lorem ipsum dolor sit amet consectetur adipiscing elite, lorem ipsum dolor sit amet consectetur adipiscing elite, lorem ipsum dolor sit amet consectetur adipiscing elite", role: "artisan" },
        { name: 'Michael Brown', email: 'michael@haven.com', shopName: "Michael's Pottery", bio: "lorem ipsum dolor sit amet consectetur adipiscing elite, lorem ipsum dolor sit amet consectetur adipiscing elite, lorem ipsum dolor sit amet consectetur adipiscing elite", role: "artisan" },
    ]

    for (const data of artisansData) {
        const artisan = await prisma.user.create({
            data: {
                ...data,
                password: 'password123',
                role: 'artisan',
            },
        })

        // 4. Create 3-4 products per artisan
        // --- ELENA RODRIGUEZ (Ceramics, Sculptures, Other) ---
        if (data.name === 'Elena Rodriguez') {
            await createProduct(artisan.id, catCeramics.id, 'Handcrafted Clay Vase', 55.00, 'Minimalist clay vase with a matte finish.');
            await createProduct(artisan.id, catSculptures.id, 'Abstract Terra-cotta Figure', 120.00, 'Hand-molded abstract form representing motherhood.');
            await createProduct(artisan.id, catOther.id, 'Pottery Starter Kit', 45.00, 'Everything you need to try clay modeling at home.');
            await createProduct(artisan.id, catCeramics.id, 'Speckled Stoneware Plate', 28.00, 'Durable stoneware with a unique blue speckled glaze.');
            await createProduct(artisan.id, catSculptures.id, 'Ceramic Wall Mask', 85.00, 'Decorative wall art inspired by ancient folklore.');
            await createProduct(artisan.id, catCeramics.id, 'Minimalist Teacup Set', 42.00, 'Set of two handleless cups for traditional tea service.');
        }

        // --- MARCUS THORNE (Woodwork, Sculptures, Prints) ---
        else if (data.name === 'Marcus Thorne') {
            await createProduct(artisan.id, catWoodwork.id, 'Oak Cutting Board', 65.00, 'Durable solid oak with natural oil finish.');
            await createProduct(artisan.id, catSculptures.id, 'Walnut Bird Figurine', 35.00, 'Hand-carved decorative piece from single block.');
            await createProduct(artisan.id, catPrints.id, 'Wood Grain Stamp Print', 25.00, 'Artistic ink print using natural oak texture.');
            await createProduct(artisan.id, catWoodwork.id, 'Mahogany Coaster Set', 30.00, 'Set of 4 water-resistant coasters with cork backing.');
            await createProduct(artisan.id, catWoodwork.id, 'Live Edge Serving Tray', 95.00, 'Rustic cherry wood tray with industrial iron handles.');
            await createProduct(artisan.id, catSculptures.id, 'Geometric Cedar Totem', 150.00, 'Large statement piece carved from aromatic cedar.');
        }

        // --- SARAH JENKINS (Textiles, Jewelry, Prints) ---
        else if (data.name === 'Sarah Jenkins') {
            await createProduct(artisan.id, catTextiles.id, 'Woven Cotton Throw', 85.00, 'Hand-loomed organic cotton for cozy nights.');
            await createProduct(artisan.id, catJewelry.id, 'Bohemian Tassel Earrings', 22.00, 'Hand-dyed silk threads with silver hooks.');
            await createProduct(artisan.id, catPrints.id, 'Textile Pattern Poster', 30.00, 'High-quality print of a traditional loom pattern.');
            await createProduct(artisan.id, catTextiles.id, 'Indigo Shibori Pillow', 45.00, 'Hand-dyed linen using Japanese folding techniques.');
            await createProduct(artisan.id, catJewelry.id, 'Macrame Statement Necklace', 55.00, 'Intricate knotwork with semi-precious stone center.');
            await createProduct(artisan.id, catTextiles.id, 'Wool Winter Scarf', 60.00, 'Extra soft merino wool woven in a classic herringbone.');
        }

        // --- DAVID CHEN (Photography, Paintings, Woodwork) ---
        else if (data.name === 'David Chen') {
            await createProduct(artisan.id, catPhotography.id, 'Misty Mountains Photo', 75.00, 'Limited edition landscape shot on metallic paper.');
            await createProduct(artisan.id, catPaintings.id, 'Ink Wash Pine Tree', 150.00, 'Traditional Sumi-e style painting on rice paper.');
            await createProduct(artisan.id, catWoodwork.id, 'Custom Bamboo Frame', 40.00, 'Handcrafted frame specifically for fine art prints.');
            await createProduct(artisan.id, catPhotography.id, 'Neon Rain Streetscape', 90.00, 'Long exposure night photography of Tokyo streets.');
            await createProduct(artisan.id, catPaintings.id, 'Gold Leaf Crane', 180.00, 'Mixed media piece featuring acrylic and real gold leaf.');
            await createProduct(artisan.id, catPhotography.id, 'Golden Hour Coastline', 65.00, 'Panoramic view of the Pacific coast at sunset.');
        }

        // --- EMILY CARTER (Candles, Jewelry, Ceramics) ---
        else if (data.name === 'Emily Carter') {
            await createProduct(artisan.id, catCandles.id, 'Lavender Honey Soy Candle', 18.00, 'Eco-friendly soy wax with natural essential oils.');
            await createProduct(artisan.id, catJewelry.id, 'Minimalist Gold Ring', 95.00, 'Solid 14k gold band with a hammered finish.');
            await createProduct(artisan.id, catCeramics.id, 'Matcha Whisk Holder', 20.00, 'Keep your matcha whisk in perfect shape.');
            await createProduct(artisan.id, catCandles.id, 'Midnight Forest Candle', 22.00, 'Notes of pine, sandalwood, and fresh moss.');
            await createProduct(artisan.id, catJewelry.id, 'Silver Moon Pendant', 70.00, 'Sterling silver necklace with moonstone inlay.');
            await createProduct(artisan.id, catCandles.id, 'Vanilla Bourbon Diffuser', 35.00, 'Long-lasting scent for any room in a glass bottle.');
        }

        // --- MICHAEL BROWN (Paintings, Prints, Other) ---
        else if (data.name === 'Michael Brown') {
            await createProduct(artisan.id, catPaintings.id, 'Urban Sunset Oil Painting', 210.00, 'Vibrant oil on canvas showing the city skyline.');
            await createProduct(artisan.id, catPrints.id, 'Modern Cityscape Card Set', 15.00, 'Set of 10 postcards featuring urban sketches.');
            await createProduct(artisan.id, catOther.id, 'Artisan Painting Palette', 50.00, 'Hand-turned wooden palette for professional artists.');
            await createProduct(artisan.id, catPaintings.id, 'Abstract Ocean Study', 130.00, 'Acrylic painting exploring blue textures and movement.');
            await createProduct(artisan.id, catPrints.id, 'Limited Edition Giclee Print', 60.00, 'Archival quality reproduction of the "Urban Sunset".');
            await createProduct(artisan.id, catOther.id, 'Custom Sketchbook Case', 40.00, 'Leather-bound protective sleeve for artists on the go.');
        }
    }

    console.log('Seeding finished successfully.')
}

async function createProduct(artisanId: string, categoryId: string, name: string, price: number, desc: string) {
    await prisma.product.create({
        data: {
            name,
            description: desc,
            price,
            artisanId,
            categoryId,
            images: {
                create: [
                    { url: `https://picsum.photos/seed/${name}/600/600`, alt: `${name} main view` },
                    { url: `https://picsum.photos/seed/${name}2/600/600`, alt: `${name} detail` },
                    { url: `https://picsum.photos/seed/${name}3/600/600`, alt: `${name} detail` }
                ]
            }
        }
    })
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })