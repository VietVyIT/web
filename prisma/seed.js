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

  // 4. Sample Categories & Brand
  const appleBrand = await prisma.brand.upsert({
    where: { slug: 'apple' },
    update: {},
    create: { name: 'Apple', slug: 'apple' }
  });

  const phoneCategory = await prisma.category.upsert({
    where: { slug: 'dien-thoai' },
    update: {},
    create: { name: 'Điện thoại', slug: 'dien-thoai' }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
