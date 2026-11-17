const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/../../.env' });

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Service = require('../models/Service');
const Pet = require('../models/Pet');
const Order = require('../models/Order');
const Booking = require('../models/Booking');
const Banner = require('../models/Banner');
const Blog = require('../models/Blog');

const seedAll = async (shouldExit = true) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('[SeedAll] Connected to MongoDB:', process.env.MONGO_URI);
    }

    // 1. Clean all collections
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Service.deleteMany({}),
      Pet.deleteMany({}),
      Order.deleteMany({}),
      Booking.deleteMany({}),
      Banner.deleteMany({}),
      Blog.deleteMany({}),
    ]);
    console.log('[SeedAll] Cleaned old database collections');

    // 2. Create Users (Admin & Customer)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Password123!', salt);

    const [admin, customer] = await User.insertMany([
      {
        name: 'Quản Trị Viên PawLocal',
        email: 'admin@pawlocal.com',
        passwordHash,
        phone: '0909123456',
        address: '88 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
        role: 'admin',
      },
      {
        name: 'Nguyễn Văn Khách',
        email: 'customer@pawlocal.com',
        passwordHash,
        phone: '0988776655',
        address: '123 Lê Lợi, Phường Bến Thành, Quận 1, TP.HCM',
        role: 'customer',
      },
    ]);
    console.log('[SeedAll] Created Admin and Customer accounts');

    // 3. Create Categories & Banners
    const categories = await Category.insertMany([
      { id: 1, name: 'Thức Ăn Hạt', slug: 'thuc-an-hat', icon: 'fa-solid fa-bowl-food', order: 1, petType: 'all' },
      { id: 2, name: 'Pate & Súp Thưởng', slug: 'pate-sup-thuong', icon: 'fa-solid fa-fish', order: 2, petType: 'all' },
      { id: 3, name: 'Phụ Kiện & Đồ Chơi', slug: 'phu-kien-do-choi', icon: 'fa-solid fa-baseball', order: 3, petType: 'all' },
      { id: 4, name: 'Vệ Sinh & Chăm Sóc', slug: 've-sinh-cham-soc', icon: 'fa-solid fa-soap', order: 4, petType: 'all' },
    ]);
    const [catHat, catPate, catPhuKien, catVeSinh] = categories;

    await Banner.insertMany([
      {
        id: 1,
        title: 'PAWLOCAL SPA & GROOMING 2026',
        subtitle: 'Ưu đãi đặt lịch tắm cắt tỉa giảm ngay 25% cho Boss',
        image: '/images/banners/hero-banner.jpg',
        link: '/booking',
        order: 1,
      },
      {
        id: 2,
        title: 'DINH DƯỠNG THÚ CƯNG CAO CẤP',
        subtitle: 'Hạt & Pate nhập khẩu chính hãng - Đồng hành cùng sức khỏe thú cưng',
        image: '/images/banners/feature-banner.jpg',
        link: '/products',
        order: 2,
      },
    ]);
    console.log('[SeedAll] Created Banners & Categories');

    // 4. Create Products
    const products = await Product.insertMany([
      {
        id: 1,
        name: 'Hạt Royal Canin Medium Puppy (3kg)',
        slug: 'hat-royal-canin-medium-puppy-3kg',
        categoryId: 1,
        categorySlug: 'thuc-an-hat',
        description: 'Dinh dưỡng cân bằng đặc chế cho chó con từ 2-12 tháng tuổi, tăng đề kháng và phát triển cơ bắp.',
        price: 365000,
        oldPrice: 420000,
        hot: true,
        rating: 4.9,
        stock: 25,
        image: '/images/products/hat-royal-canin-puppy.jpg',
        category: catHat._id,
        petTypes: ['dog'],
        isAvailable: true,
      },
      {
        id: 2,
        name: 'Hạt Cho Mèo Royal Canin Kitten (2kg)',
        slug: 'hat-cho-meo-royal-canin-kitten-2kg',
        categoryId: 1,
        categorySlug: 'thuc-an-hat',
        description: 'Hỗ trợ hệ tiêu hóa nhạy cảm và hệ miễn dịch non nớt của mèo con dưới 12 tháng.',
        price: 320000,
        oldPrice: 380000,
        hot: true,
        rating: 4.8,
        stock: 18,
        image: '/images/products/hat-royal-canin-kitten.jpg',
        category: catHat._id,
        petTypes: ['cat'],
        isAvailable: true,
      },
      {
        id: 3,
        name: 'Hạt Chó Vị Bò & Rau Củ SmartHeart (3kg)',
        slug: 'hat-cho-vi-bo-rau-cu-smartheart-3kg',
        categoryId: 1,
        categorySlug: 'thuc-an-hat',
        description: 'Thức ăn hạt cho chó trưởng thành bổ sung Omega 3 & 6 cho bộ lông bóng mượt.',
        price: 185000,
        oldPrice: 220000,
        hot: false,
        rating: 4.7,
        stock: 40,
        image: '/images/products/hat-smartheart.jpg',
        category: catHat._id,
        petTypes: ['dog'],
        isAvailable: true,
      },
      {
        id: 4,
        name: 'Pate Mèo Ciao Churu Vị Cá Hồi (Gói 4 thanh)',
        slug: 'pate-meo-ciao-churu-vi-ca-hoi',
        categoryId: 2,
        categorySlug: 'pate-sup-thuong',
        description: 'Súp thưởng dinh dưỡng cao cấp từ Nhật Bản, bổ sung nước và kích thích ăn ngon cho mèo.',
        price: 45000,
        oldPrice: 55000,
        hot: true,
        rating: 5.0,
        stock: 120,
        image: '/images/products/pate-ciao-churu.jpg',
        category: catPate._id,
        petTypes: ['cat'],
        isAvailable: true,
      },
      {
        id: 5,
        name: 'Pate Chó Cesar Vị Thịt Bò & Gan (100g)',
        slug: 'pate-cho-cesar-vi-thit-bo-gan-100g',
        categoryId: 2,
        categorySlug: 'pate-sup-thuong',
        description: 'Pate ướt thơm ngon hảo hạng dành cho chó cảnh mọi lứa tuổi.',
        price: 38000,
        oldPrice: 45000,
        hot: false,
        rating: 4.6,
        stock: 4, // Low stock demo (< 5)
        image: '/images/products/pate-cesar.jpg',
        category: catPate._id,
        petTypes: ['dog'],
        isAvailable: true,
      },
      {
        id: 6,
        name: 'Dây Dắt Chó Kèm Vòng Cổ Dù Siêu Bền',
        slug: 'day-dat-cho-kem-vong-co-du-sieu-ben',
        categoryId: 3,
        categorySlug: 'phu-kien-do-choi',
        description: 'Chất liệu vải dù êm ái, trợ lực tay cầm, kèm móc khóa inox chống gỉ.',
        price: 85000,
        oldPrice: 110000,
        hot: false,
        rating: 4.7,
        stock: 30,
        image: '/images/products/day-dat-cho.jpg',
        category: catPhuKien._id,
        petTypes: ['dog'],
        isAvailable: true,
      },
      {
        id: 7,
        name: 'Cần Câu Chuột Kêu Bắt Mồi Cho Mèo',
        slug: 'can-cau-chuot-keu-bat-moi-cho-meo',
        categoryId: 3,
        categorySlug: 'phu-kien-do-choi',
        description: 'Đồ chơi kích thích phản xạ săn mồi và vận động cho mèo trong nhà.',
        price: 35000,
        oldPrice: 50000,
        hot: false,
        rating: 4.5,
        stock: 65,
        image: '/images/products/can-cau-meo.jpg',
        category: catPhuKien._id,
        petTypes: ['cat'],
        isAvailable: true,
      },
      {
        id: 8,
        name: 'Cát Vệ Sinh Đậu Nành Tofu Cho Mèo (6L)',
        slug: 'cat-ve-sinh-dau-nanh-tofu-cho-meo-6l',
        categoryId: 4,
        categorySlug: 've-sinh-cham-soc',
        description: 'Khử mùi vượt trội, vón nhanh, không bụi, xả được trực tiếp vào bồn cầu.',
        price: 115000,
        oldPrice: 140000,
        hot: true,
        rating: 4.9,
        stock: 3, // Low stock demo (< 5)
        image: '/images/products/cat-tofu.jpg',
        category: catVeSinh._id,
        petTypes: ['cat'],
        isAvailable: true,
      },
      {
        id: 9,
        name: 'Sữa Tắm Khử Mùi & Dưỡng Lông SOS (530ml)',
        slug: 'sua-tam-khu-mui-duong-long-sos-530ml',
        categoryId: 4,
        categorySlug: 've-sinh-cham-soc',
        description: 'Hương thơm lưu hương 7 ngày, công thức dịu nhẹ dưỡng da và lông mềm mượt.',
        price: 130000,
        oldPrice: 160000,
        hot: false,
        rating: 4.8,
        stock: 22,
        image: '/images/products/sua-tam-sos.jpg',
        category: catVeSinh._id,
        petTypes: ['dog', 'cat'],
        isAvailable: true,
      },
      {
        id: 10,
        name: 'Lược Chải Lông Chó Mèo Nút Bấm Tự Động Rụng Lông',
        slug: 'luoc-chai-long-cho-meo-nut-bam-tu-dong',
        categoryId: 3,
        categorySlug: 'phu-kien-do-choi',
        description: 'Răng kim loại bọc nhựa massage da, bấm nút nhả lông rụng nhanh chóng và tiện lợi.',
        price: 65000,
        oldPrice: 90000,
        hot: false,
        rating: 4.7,
        stock: 35,
        image: '/images/products/luoc-chai-long.jpg',
        category: catPhuKien._id,
        petTypes: ['dog', 'cat'],
        isAvailable: true,
      },
    ]);
    console.log('[SeedAll] Created 10 Products');

    // 5. Create Grooming Services
    const services = await Service.insertMany([
      {
        name: 'Tắm Sấy Khử Mùi & Thư Giãn',
        description: 'Quy trình tắm 5 bước: chải tơ rối, tắm xà phòng thảo mộc dịu nhẹ khử mùi hôi, dưỡng xả mượt lông, sấy êm ái và vắt tuyến hôi sạch sẽ.',
        basePrice: 150000,
        durationMinutes: 45,
        petTypes: ['dog', 'cat'],
        isActive: true,
      },
      {
        name: 'Cắt Tỉa Lông Tạo Kiểu Toàn Diện',
        description: 'Tạo kiểu theo yêu cầu (kiểu gấu bông Teddy, kiểu sư tử, kiểu gọn mát), vệ sinh tai, cạo lông đệm chân và vùng nhạy cảm.',
        basePrice: 280000,
        durationMinutes: 90,
        petTypes: ['dog', 'cat'],
        isActive: true,
      },
      {
        name: 'Cắt Mài Móng & Vệ Sinh Tai',
        description: 'Cắt tỉa móng gọn gàng không gây chảy máu, mài giũa tròn mịn tránh cào xước, nhỏ dung dịch vệ sinh và nhổ lông tai sạch khuẩn.',
        basePrice: 80000,
        durationMinutes: 30,
        petTypes: ['dog', 'cat'],
        isActive: true,
      },
      {
        name: 'Combo Spa Trọn Gói Hoàng Gia',
        description: 'Trọn gói đầy đủ: Tắm khoáng nóng thảo dược, ủ phục hồi lông hư tổn, cắt tỉa thẩm mỹ, cắt mài móng, vệ sinh tai răng và xịt nước hoa cao cấp.',
        basePrice: 390000,
        durationMinutes: 120,
        petTypes: ['dog', 'cat'],
        isActive: true,
      },
    ]);
    console.log('[SeedAll] Created 4 Services');

    // 6. Create Customer Pets
    const pets = await Pet.insertMany([
      {
        owner: customer._id,
        name: 'Milo',
        species: 'dog',
        breed: 'Golden Retriever',
        weightKg: 14.5,
        photo: '/uploads/pets/default-pet.svg',
        notes: 'Bé rất hiếu động, thích được chải lông lưng.',
      },
      {
        owner: customer._id,
        name: 'Bơ',
        species: 'cat',
        breed: 'Mèo Anh Lông Ngắn',
        weightKg: 4.2,
        photo: '/uploads/pets/default-pet.svg',
        notes: 'Bé hơi nhát nước, cần tắm nước ấm nhẹ.',
      },
    ]);
    console.log('[SeedAll] Created 2 Pets for Customer');

    // 7. Create Demo Orders
    await Order.insertMany([
      {
        user: customer._id,
        items: [
          {
            product: products[0]._id,
            name: products[0].name,
            price: products[0].price,
            quantity: 1,
            image: products[0].image,
          },
          {
            product: products[3]._id,
            name: products[3].name,
            price: products[3].price,
            quantity: 2,
            image: products[3].image,
          },
        ],
        subtotal: 455000,
        deliveryFee: 0,
        total: 455000,
        status: 'completed',
        paymentMethod: 'COD',
        shippingAddress: {
          recipientName: customer.name,
          phone: customer.phone,
          address: customer.address,
          note: 'Giao giờ hành chính',
        },
      },
      {
        user: customer._id,
        items: [
          {
            product: products[1]._id,
            name: products[1].name,
            price: products[1].price,
            quantity: 1,
            image: products[1].image,
          },
        ],
        subtotal: 320000,
        deliveryFee: 0,
        total: 320000,
        status: 'processing',
        paymentMethod: 'COD',
        shippingAddress: {
          recipientName: customer.name,
          phone: customer.phone,
          address: customer.address,
          note: 'Gọi trước 15 phút',
        },
      },
      {
        user: customer._id,
        items: [
          {
            product: products[7]._id,
            name: products[7].name,
            price: products[7].price,
            quantity: 2,
            image: products[7].image,
          },
        ],
        subtotal: 230000,
        deliveryFee: 20000,
        total: 250000,
        status: 'pending',
        paymentMethod: 'COD',
        shippingAddress: {
          recipientName: customer.name,
          phone: customer.phone,
          address: customer.address,
          note: 'Nhà có chuông cửa',
        },
      },
    ]);
    console.log('[SeedAll] Created 3 Demo Orders (completed, processing, pending)');

    // 8. Create Demo Bookings
    const today = new Date().toISOString().split('T')[0];
    await Booking.insertMany([
      {
        user: customer._id,
        pet: pets[0]._id,
        service: services[1]._id,
        date: today,
        timeSlot: '09:00',
        status: 'confirmed',
        price: services[1].basePrice,
        note: 'Cắt tỉa gọn kiểu Teddy',
      },
      {
        user: customer._id,
        pet: pets[1]._id,
        service: services[0]._id,
        date: today,
        timeSlot: '14:30',
        status: 'pending',
        price: services[0].basePrice,
        note: 'Tắm xà phòng dịu nhẹ',
      },
      {
        user: customer._id,
        pet: pets[0]._id,
        service: services[2]._id,
        date: '2026-11-10',
        timeSlot: '10:30',
        status: 'completed',
        price: services[2].basePrice,
        note: 'Đã hoàn thành tuần trước',
      },
    ]);
    console.log('[SeedAll] Created 3 Demo Bookings (today confirmed, today pending, completed)');

    // 8. Create Blogs (Lab 4 & Asm 1)
    await Blog.insertMany([
      {
        id: 1,
        title: 'Bí Quyết Chăm Sóc Lông Chó Poodle Tròn Đẹp Như Gấu Bông',
        slug: 'bi-quyet-cham-soc-long-cho-poodle',
        image: '/images/blogs/cham-soc-long-cho-poodle.jpg',
        excerpt: 'Hướng dẫn chải lông, sấy phồng và chọn dầu tắm thảo mộc giúp lông Poodle luôn bông xù không bị vón cục.',
        content: 'Chó Poodle sở hữu bộ lông xoăn quý phái nhưng rất dễ bị rối và bết nếu không được chăm sóc đúng cách. Định kỳ 2-3 ngày bạn nên dùng lược kim chải tơ một lần từ chân lông ra ngọn. Khi tắm, hãy dùng nước ấm 35-37 độ và sữa tắm thảo dược dưỡng ẩm, sau đó sấy ngược chiều lông kết hợp lược tròn để tạo độ phồng tối đa.',
        date: '15/11/2026',
        views: 340,
      },
      {
        id: 2,
        title: 'Tháp Dinh Dưỡng Khoa Học Cho Mèo Con Dưới 12 Tháng Tuổi',
        slug: 'thap-dinh-duong-cho-meo-con',
        image: '/images/blogs/dinh-duong-cho-meo-con.jpg',
        excerpt: 'Cân bằng giữa hạt khô, pate ướt và súp thưởng để mèo con phát triển xương và khung người cứng cáp.',
        content: 'Giai đoạn dưới 12 tháng tuổi là thời kỳ vàng quyết định tầm vóc và đề kháng của mèo. Bạn nên kết hợp 60% năng lượng từ hạt giàu đạm (Royal Canin Kitten) và 40% từ thức ăn ướt (Pate Ciao, súp thưởng) để bổ sung đủ nước cho thận, phòng ngừa sỏi bàng quang từ sớm.',
        date: '12/11/2026',
        views: 280,
      },
      {
        id: 3,
        title: 'Mẹo Tắm Cho Mèo Tại Nhà Cực Nhàn Không Bị Cào Xước',
        slug: 'meo-tam-cho-meo-tai-nha',
        image: '/images/blogs/bi-quyet-tam-cho-meo-khong-so-nuoc.jpg',
        excerpt: 'Phương pháp làm quen với nước ấm, xoa dịu tâm lý và sấy lông êm ái khiến boss hợp tác ngoan ngoãn.',
        content: 'Hầu hết các boss mèo đều hoảng sợ trước tiếng vòi xịt mạnh và máy sấy ồn ào. Bí quyết là chuẩn bị sẵn chậu nước ấm nông ngập vừa chân, dùng khăn thấm nước vuốt nhẹ lên lưng thay vì xối trực tiếp. Luôn thưởng pate sau khi tắm để tạo phản xạ có điều kiện tích cực.',
        date: '10/11/2026',
        views: 520,
      },
    ]);
    console.log('[SeedAll] Created 3 Pet Care Blogs with Slugs');

    console.log('🎉 [SeedAll] ALL DATA SEEDED SUCCESSFULLY!');
    if (shouldExit) {
      process.exit(0);
    }
  } catch (error) {
    console.error('[SeedAll Error]', error);
    if (shouldExit) {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = seedAll;

if (require.main === module) {
  seedAll(true);
}
