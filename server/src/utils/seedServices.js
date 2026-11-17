const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Service = require('../models/Service');

dotenv.config({ path: __dirname + '/../../.env' });

const seedServices = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[Seed] Connected to MongoDB');

    await Service.deleteMany({});

    const services = [
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
    ];

    await Service.insertMany(services);
    console.log(`[Seed] Seeded ${services.length} grooming services successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedServices();
