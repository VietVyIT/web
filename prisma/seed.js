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
  const apple = await prisma.brand.upsert({ where: { slug: 'apple' }, update: {}, create: { name: 'Apple', slug: 'apple' } });
  const samsung = await prisma.brand.upsert({ where: { slug: 'samsung' }, update: {}, create: { name: 'Samsung', slug: 'samsung' } });
  const asus = await prisma.brand.upsert({ where: { slug: 'asus' }, update: {}, create: { name: 'ASUS', slug: 'asus' } });
  const sony = await prisma.brand.upsert({ where: { slug: 'sony' }, update: {}, create: { name: 'Sony', slug: 'sony' } });
  const xiaomi = await prisma.brand.upsert({ where: { slug: 'xiaomi' }, update: {}, create: { name: 'Xiaomi', slug: 'xiaomi' } });
  const dell = await prisma.brand.upsert({ where: { slug: 'dell' }, update: {}, create: { name: 'Dell', slug: 'dell' } });
  const lenovo = await prisma.brand.upsert({ where: { slug: 'lenovo' }, update: {}, create: { name: 'Lenovo', slug: 'lenovo' } });
  const marshall = await prisma.brand.upsert({ where: { slug: 'marshall' }, update: {}, create: { name: 'Marshall', slug: 'marshall' } });
  const lg = await prisma.brand.upsert({ where: { slug: 'lg' }, update: {}, create: { name: 'LG', slug: 'lg' } });

  // 5. Categories
  const catDienThoai = await prisma.category.upsert({ where: { slug: 'dien-thoai' }, update: {}, create: { name: 'Điện thoại', slug: 'dien-thoai' } });
  const catLaptop = await prisma.category.upsert({ where: { slug: 'laptop' }, update: {}, create: { name: 'Laptop', slug: 'laptop' } });
  const catTablet = await prisma.category.upsert({ where: { slug: 'tablet' }, update: {}, create: { name: 'Tablet', slug: 'tablet' } });
  const catTaiNghe = await prisma.category.upsert({ where: { slug: 'tai-nghe' }, update: {}, create: { name: 'Tai nghe', slug: 'tai-nghe' } });
  const catSmartwatch = await prisma.category.upsert({ where: { slug: 'smartwatch' }, update: {}, create: { name: 'Smartwatch', slug: 'smartwatch' } });
  const catManHinh = await prisma.category.upsert({ where: { slug: 'man-hinh' }, update: {}, create: { name: 'Màn hình', slug: 'man-hinh' } });

  // 6. Seed Products with Variants
  const productsData = [
    // --- ĐIỆN THOẠI ---
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
      name: 'Xiaomi 14 Ultra 512GB Leica',
      slug: 'xiaomi-14-ultra-512gb-leica',
      modelCode: 'MI14U-512',
      description: 'Hệ thống 4 camera Leica 50MP cảm biến 1-inch, Snapdragon 8 Gen 3 đỉnh cao, sạc nhanh 90W HyperCharge.',
      brandId: xiaomi.id,
      categoryId: catDienThoai.id,
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
      variants: [
        { sku: 'MI14U-BLACK', color: 'Đen Da Cao Cấp', memory: '16GB/512GB', listedPrice: 32990000, salePrice: 29990000, stock: 12 },
        { sku: 'MI14U-WHITE', color: 'Trắng Gốm', memory: '16GB/512GB', listedPrice: 32990000, salePrice: 29990000, stock: 9 }
      ]
    },
    {
      name: 'iPhone 15 128GB Pink',
      slug: 'iphone-15-128gb-pink',
      modelCode: 'IP15-128',
      description: 'Màn hình Dynamic Island đột phá, camera chính 48MP siêu nét, cổng USB-C tiện lợi.',
      brandId: apple.id,
      categoryId: catDienThoai.id,
      imageUrl: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80',
      variants: [
        { sku: 'IP15-128-PINK', color: 'Hồng Pastel', memory: '128GB', listedPrice: 22990000, salePrice: 19490000, stock: 25 },
        { sku: 'IP15-128-BLUE', color: 'Xanh Nhạt', memory: '128GB', listedPrice: 22990000, salePrice: 19490000, stock: 18 }
      ]
    },

    // --- LAPTOP ---
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
      name: 'Dell XPS 16 9640 Core Ultra 7',
      slug: 'dell-xps-16-9640-core-ultra-7',
      modelCode: 'XPS9640',
      description: 'Kiệt tác thiết kế nhôm nguyên khối, màn hình 4K OLED Cảm ứng, vi xử lý AI Intel Core Ultra 7 155H.',
      brandId: dell.id,
      categoryId: catLaptop.id,
      imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop&q=80',
      variants: [
        { sku: 'DELL-XPS16-SILVER', color: 'Platinum Silver', memory: '32GB/1TB', listedPrice: 65990000, salePrice: 59990000, stock: 4 }
      ]
    },
    {
      name: 'Lenovo ThinkPad X1 Carbon Gen 12',
      slug: 'lenovo-thinkpad-x1-carbon-gen-12',
      modelCode: 'X1C-G12',
      description: 'Huyền thoại doanh nhân siêu nhẹ 1.09kg, bàn phím gõ đỉnh nhất thế giới, độ bền chuẩn quân đội.',
      brandId: lenovo.id,
      categoryId: catLaptop.id,
      imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop&q=80',
      variants: [
        { sku: 'THINKPAD-X1-G12', color: 'Black Carbon', memory: '16GB/512GB', listedPrice: 52990000, salePrice: 48990000, stock: 6 }
      ]
    },

    // --- TABLET ---
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
      name: 'Samsung Galaxy Tab S9 Ultra 5G',
      slug: 'samsung-galaxy-tab-s9-ultra-5g',
      modelCode: 'SM-X916B',
      description: 'Màn hình khổng lồ 14.6 inch Dynamic AMOLED 2X, chống nước chuẩn IP68, kèm sẵn bút S-Pen chuyên nghiệp.',
      brandId: samsung.id,
      categoryId: catTablet.id,
      imageUrl: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80',
      variants: [
        { sku: 'TABS9U-5G-GREY', color: 'Graphite', memory: '12GB/256GB', listedPrice: 32990000, salePrice: 27990000, stock: 8 }
      ]
    },

    // --- TAI NGHE ---
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
    },
    {
      name: 'AirPods Pro 2 USB-C (2023)',
      slug: 'airpods-pro-2-usbc',
      modelCode: 'MTJV3',
      description: 'Chíp H2 nâng cấp chống ồn chủ động gấp 2 lần, tính năng Âm thanh thích ứng thông minh và hộp sạc cổng USB-C.',
      brandId: apple.id,
      categoryId: catTaiNghe.id,
      imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
      variants: [
        { sku: 'AIRPODS-PRO-2', color: 'White', memory: 'N/A', listedPrice: 6190000, salePrice: 5690000, stock: 40 }
      ]
    },
    {
      name: 'Marshall Major IV Bluetooth Wireless',
      slug: 'marshall-major-iv-bluetooth',
      modelCode: 'MAJOR-IV',
      description: 'Thiết kế cổ điển đậm chất Rock N Roll, thời lượng pin trâu lên tới 80+ giờ phát nhạc liên tục, sạc không dây tiện lợi.',
      brandId: marshall.id,
      categoryId: catTaiNghe.id,
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80',
      variants: [
        { sku: 'MARSHALL-M4-BLK', color: 'Black Classic', memory: 'N/A', listedPrice: 4290000, salePrice: 3690000, stock: 30 }
      ]
    },

    // --- SMARTWATCH ---
    {
      name: 'Apple Watch Ultra 2 GPS + Cellular 49mm',
      slug: 'apple-watch-ultra-2-49mm',
      modelCode: 'MREX3',
      description: 'Khung vỏ Titan siêu bền, màn hình sáng 3000 nits cao nhất lịch sử Apple Watch, GPS tần số kép cực chính xác.',
      brandId: apple.id,
      categoryId: catSmartwatch.id,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      variants: [
        { sku: 'AW-ULTRA2-ALPINE', color: 'Dây Alpine Cam', memory: '49mm', listedPrice: 21990000, salePrice: 19990000, stock: 14 }
      ]
    },
    {
      name: 'Samsung Galaxy Watch 7 44mm BT',
      slug: 'samsung-galaxy-watch-7-44mm',
      modelCode: 'SM-L310',
      description: 'Theo dõi chỉ số sức khỏe BioActive thế hệ mới, đo nhịp tim, giấc ngủ thông minh cùng vi xử lý 3nm mạnh mẽ.',
      brandId: samsung.id,
      categoryId: catSmartwatch.id,
      imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80',
      variants: [
        { sku: 'GW7-44-GREEN', color: 'Xanh Quân Đội', memory: '44mm', listedPrice: 7990000, salePrice: 6990000, stock: 22 }
      ]
    },

    // --- MÀN HÌNH & KHÁC ---
    {
      name: 'Màn Hình Cong Gaming LG UltraGear 34 inch OLED 175Hz',
      slug: 'man-hinh-lg-ultragear-34-oled',
      modelCode: '34GS95QE',
      description: 'Tấm nền OLED cong 800R quyến rũ, tốc độ phản hồi 0.03ms siêu tốc, dải màu DCI-P3 98.5% chân thực.',
      brandId: lg.id,
      categoryId: catManHinh.id,
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
      variants: [
        { sku: 'LG-34-OLED', color: 'Đen Gaming', memory: 'WQHD (3440x1440)', listedPrice: 29990000, salePrice: 25990000, stock: 6 }
      ]
    }
  ];

  for (const item of productsData) {
    const prod = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        description: item.description,
        brandId: item.brandId,
        categoryId: item.categoryId
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

  console.log('Seed with 16+ rich products completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
