const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial database data...');

  // 1. Admin User
  const adminPasswordHash = bcrypt.hashSync('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@techstore.vn' },
    update: {
      passwordHash: adminPasswordHash,
      role: 'ADMIN'
    },
    create: {
      email: 'admin@techstore.vn',
      fullName: 'Quản trị viên TechStore',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      phone: '0901234567'
    }
  });
  console.log('Admin user seeded:', admin.email);

  // 2. Customer User
  const customerPasswordHash = bcrypt.hashSync('Khach@123', 10);
  const customer = await prisma.user.upsert({
    where: { email: 'khachhang@techstore.vn' },
    update: {
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER'
    },
    create: {
      email: 'khachhang@techstore.vn',
      fullName: 'Khách hàng Demo',
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER',
      phone: '0909876543'
    }
  });
  console.log('Customer user seeded:', customer.email);

  // 3. Address for Customer
  const defaultAddress = await prisma.address.findFirst({
    where: { userId: customer.id }
  });
  if (!defaultAddress) {
    await prisma.address.create({
      data: {
        userId: customer.id,
        recipient: 'Khách hàng Demo',
        phone: '0909876543',
        line1: '123 Đường Lê Lợi, Phường Bến Nghé',
        ward: 'Phường Bến Nghé',
        district: 'Quận 1',
        city: 'TP. Hồ Chí Minh',
        isDefault: true
      }
    });
    console.log('Default address seeded for customer.');
  }

  // 4. Brands
  const apple = await prisma.brand.upsert({
    where: { slug: 'apple' },
    update: {},
    create: { name: 'Apple', slug: 'apple' }
  });
  const samsung = await prisma.brand.upsert({
    where: { slug: 'samsung' },
    update: {},
    create: { name: 'Samsung', slug: 'samsung' }
  });
  const asus = await prisma.brand.upsert({
    where: { slug: 'asus' },
    update: {},
    create: { name: 'ASUS', slug: 'asus' }
  });
  const sony = await prisma.brand.upsert({
    where: { slug: 'sony' },
    update: {},
    create: { name: 'Sony', slug: 'sony' }
  });

  // 5. Categories
  const catDienThoai = await prisma.category.upsert({
    where: { slug: 'dien-thoai' },
    update: {},
    create: { name: 'Điện thoại', slug: 'dien-thoai' }
  });
  const catLaptop = await prisma.category.upsert({
    where: { slug: 'laptop' },
    update: {},
    create: { name: 'Laptop', slug: 'laptop' }
  });
  const catTablet = await prisma.category.upsert({
    where: { slug: 'tablet' },
    update: {},
    create: { name: 'Tablet', slug: 'tablet' }
  });
  const catTaiNghe = await prisma.category.upsert({
    where: { slug: 'tai-nghe' },
    update: {},
    create: { name: 'Tai nghe', slug: 'tai-nghe' }
  });

  // 6. Seed Products with Variants
  const productsData = [
    {
      name: 'iPhone 16 Pro Max 256GB',
      slug: 'iphone-16-pro-max-256gb',
      modelCode: 'IP16PM-256',
      description: 'Chíp A18 Pro siêu mạnh mẽ, màn hình Super Retina XDR 6.9 inch, thiết kế Titan sa mạc sang trọng.',
      brandId: apple.id,
      categoryId: catDienThoai.id,
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80',
      variants: [
        { sku: 'IP16PM-256-DESERT', color: 'Titan Sa Mạc', memory: '256GB', listedPrice: 34990000, salePrice: 33490000, stock: 15 },
        { sku: 'IP16PM-256-NATURAL', color: 'Titan Tự Nhiên', memory: '256GB', listedPrice: 34990000, salePrice: 33490000, stock: 20 }
      ]
    },
    {
      name: 'Samsung Galaxy S24 Ultra 512GB',
      slug: 'samsung-galaxy-s24-ultra-512gb',
      modelCode: 'SM-S928B',
      description: 'Quyền năng Galaxy AI, camera 200MP zoom 100x, bút S-Pen tích hợp, khung viền Titan cao cấp.',
      brandId: samsung.id,
      categoryId: catDienThoai.id,
      imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
      variants: [
        { sku: 'S24U-512-GREY', color: 'Titan Xám', memory: '512GB', listedPrice: 37490000, salePrice: 31990000, stock: 10 },
        { sku: 'S24U-512-BLACK', color: 'Titan Đen', memory: '512GB', listedPrice: 37490000, salePrice: 31990000, stock: 8 }
      ]
    },
    {
      name: 'MacBook Pro 14 M3 Pro (18GB/512GB)',
      slug: 'macbook-pro-14-m3-pro-18gb-512gb',
      modelCode: 'MRX33',
      description: 'Màn hình Liquid Retina XDR 120Hz, chip Apple M3 Pro 11-core CPU, màu Đen Không Gian cuốn hút.',
      brandId: apple.id,
      categoryId: catLaptop.id,
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
      variants: [
        { sku: 'MBP14-M3P-BLACK', color: 'Space Black', memory: '18GB/512GB', listedPrice: 49990000, salePrice: 46990000, stock: 5 }
      ]
    },
    {
      name: 'ASUS ROG Strix G16 RTX 4070',
      slug: 'asus-rog-strix-g16-rtx-4070',
      modelCode: 'G614JI',
      description: 'Laptop Gaming đỉnh cao với Intel Core i9-13980HX, GPU RTX 4070 8GB, màn hình QHD+ 240Hz sắc nét.',
      brandId: asus.id,
      categoryId: catLaptop.id,
      imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&auto=format&fit=crop&q=80',
      variants: [
        { sku: 'ROG-G16-4070', color: 'Eclipse Gray', memory: '16GB/1TB', listedPrice: 45990000, salePrice: 41990000, stock: 7 }
      ]
    },
    {
      name: 'iPad Pro 11 inch M4 OLED 256GB',
      slug: 'ipad-pro-11-inch-m4-oled-256gb',
      modelCode: 'MVE73',
      description: 'Thiết kế siêu mỏng 5.3mm, màn hình Ultra Retina XDR Tandem OLED đột phá, chíp Apple M4 cực đại.',
      brandId: apple.id,
      categoryId: catTablet.id,
      imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
      variants: [
        { sku: 'IPAD-M4-11-BLACK', color: 'Space Black', memory: '256GB', listedPrice: 28990000, salePrice: 27490000, stock: 12 }
      ]
    },
    {
      name: 'Tai nghe Chống Ồn Sony WH-1000XM5',
      slug: 'tai-nghe-sony-wh-1000xm5',
      modelCode: 'WH1000XM5',
      description: 'Công nghệ chống ồn tốt nhất thị trường với 8 micro, thời lượng pin tới 30 giờ, âm thanh Hi-Res tuyệt đỉnh.',
      brandId: sony.id,
      categoryId: catTaiNghe.id,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      variants: [
        { sku: 'SONY-XM5-BLACK', color: 'Black', memory: 'N/A', listedPrice: 8490000, salePrice: 6990000, stock: 25 },
        { sku: 'SONY-XM5-SILVER', color: 'Silver', memory: 'N/A', listedPrice: 8490000, salePrice: 6990000, stock: 18 }
      ]
    }
  ];

  for (const item of productsData) {
    const prod = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        description: item.description
      },
      create: {
        name: item.name,
        slug: item.slug,
        modelCode: item.modelCode,
        description: item.description,
        brandId: item.brandId,
        categoryId: item.categoryId
      }
    });

    // Add Image
    await prisma.productImage.createMany({
      data: [{
        productId: prod.id,
        url: item.imageUrl,
        isThumbnail: true,
        displayOrder: 1
      }],
      skipDuplicates: true
    });

    // Add Variants
    for (const v of item.variants) {
      await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {
          listedPrice: v.listedPrice,
          salePrice: v.salePrice,
          stock: v.stock
        },
        create: {
          productId: prod.id,
          sku: v.sku,
          color: v.color,
          memory: v.memory,
          listedPrice: v.listedPrice,
          salePrice: v.salePrice,
          stock: v.stock
        }
      });
    }
  }

  console.log('Seed with rich products completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
