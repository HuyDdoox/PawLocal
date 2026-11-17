const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const Product = require('../models/Product');

dotenv.config({ path: __dirname + '/../../.env' });

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed] Connected to MongoDB');

    // Clean existing
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Create Categories
    const categories = await Category.insertMany([
      { name: 'Thức Ăn Hạt', slug: 'thuc-an-hat', petType: 'all' },
      { name: 'Pate & Súp Thưởng', slug: 'pate-sup-thuong', petType: 'all' },
      { name: 'Phụ Kiện & Đồ Chơi', slug: 'phu-kien-do-choi', petType: 'all' },
      { name: 'Vệ Sinh & Chăm Sóc', slug: 've-sinh-cham-soc', petType: 'all' },
    ]);

    const [catHat, catPate, catPhuKien, catVeSinh] = categories;

    // Create Products
    const products = [
      {
        name: 'Hạt Royal Canin Medium Puppy (3kg)',
        description: 'Dinh dưỡng cân bằng đặc chế cho chó con từ 2-12 tháng tuổi, tăng đề kháng và phát triển cơ bắp.',
        price: 365000,
        stock: 25,
        image: '/uploads/products/default-product.svg',
        category: catHat._id,
        petTypes: ['dog'],
        isAvailable: true,
      },
      {
        name: 'Hạt Cho Mèo Royal Canin Kitten (2kg)',
        description: 'Hỗ trợ hệ tiêu hóa nhạy cảm và hệ miễn dịch non nớt của mèo con dưới 12 tháng.',
        price: 320000,
        stock: 18,
        image: '/uploads/products/default-product.svg',
        category: catHat._id,
        petTypes: ['cat'],
        isAvailable: true,
      },
      {
        name: 'Hạt Chó Vị Bò & Rau Củ SmartHeart (3kg)',
        description: 'Thức ăn hạt cho chó trưởng thành bổ sung Omega 3 & 6 cho bộ lông bóng mượt.',
        price: 185000,
        stock: 40,
        image: '/uploads/products/default-product.svg',
        category: catHat._id,
        petTypes: ['dog'],
        isAvailable: true,
      },
      {
        name: 'Pate Mèo Ciao Churu Vị Cá Hồi (Gói 4 thanh)',
        description: 'Súp thưởng dinh dưỡng cao cấp từ Nhật Bản, bổ sung nước và kích thích ăn ngon cho mèo.',
        price: 45000,
        stock: 120,
        image: '/uploads/products/default-product.svg',
        category: catPate._id,
        petTypes: ['cat'],
        isAvailable: true,
      },
      {
        name: 'Pate Chó Cesar Vị Thịt Bò & Gan (100g)',
        description: 'Pate ướt thơm ngon hảo hạng dành cho chó cảnh mọi lứa tuổi.',
        price: 38000,
        stock: 50,
        image: '/uploads/products/default-product.svg',
        category: catPate._id,
        petTypes: ['dog'],
        isAvailable: true,
      },
      {
        name: 'Dây Dắt Chó Kèm Vòng Cổ Dù Siêu Bền',
        description: 'Chất liệu vải dù êm ái, trợ lực tay cầm, kèm móc khóa inox chống gỉ.',
        price: 85000,
        stock: 30,
        image: '/uploads/products/default-product.svg',
        category: catPhuKien._id,
        petTypes: ['dog'],
        isAvailable: true,
      },
      {
        name: 'Cần Câu Chuột Kêu Bắt Mồi Cho Mèo',
        description: 'Đồ chơi kích thích phản xạ săn mồi và vận động cho mèo trong nhà.',
        price: 35000,
        stock: 65,
        image: '/uploads/products/default-product.svg',
        category: catPhuKien._id,
        petTypes: ['cat'],
        isAvailable: true,
      },
      {
        name: 'Cát Vệ Sinh Đậu Nành Tofu Cho Mèo (6L)',
        description: 'Khử mùi vượt trội, vón nhanh, không bụi, xả được trực tiếp vào bồn cầu.',
        price: 115000,
        stock: 45,
        image: '/uploads/products/default-product.svg',
        category: catVeSinh._id,
        petTypes: ['cat'],
        isAvailable: true,
      },
      {
        name: 'Sữa Tắm Khử Mùi & Dưỡng Lông SOS (530ml)',
        description: 'Hương thơm lưu hương 7 ngày, công thức dịu nhẹ dưỡng da và lông mềm mượt.',
        price: 130000,
        stock: 22,
        image: '/uploads/products/default-product.svg',
        category: catVeSinh._id,
        petTypes: ['dog', 'cat'],
        isAvailable: true,
      },
      {
        name: 'Lược Chải Lông Chó Mèo Nút Bấm Tự Động Rụng Lông',
        description: 'Răng kim loại bọc nhựa massage da, bấm nút nhả lông rụng nhanh chóng và tiện lợi.',
        price: 65000,
        stock: 35,
        image: '/uploads/products/default-product.svg',
        category: catPhuKien._id,
        petTypes: ['dog', 'cat'],
        isAvailable: true,
      },
    ];

    await Product.insertMany(products);
    console.log(`[Seed] Seeded ${categories.length} categories and ${products.length} products successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedProducts();
