import { db } from "./index";
import { moderatorRules } from "./schema";

async function seed() {
  // NOTE: Admin users are no longer seeded here. They are Supabase Auth
  // users (created in Dashboard -> Authentication -> Users, or via
  // supabase.auth.signUp) that are then granted admin access by inserting
  // their auth user id into the admin_users table. See supabase_migration.sql
  // and the make_admin.sql helper for that step.

  // Seed rules if none
  const existingRules = await db.select().from(moderatorRules);
  if (existingRules.length === 0) {
    const rulesToInsert = [
      {
        orderIndex: 1,
        title: "Бусдыг хүндлэх",
        description: "Бусдыг хүндлэх. ADMIN-тай хүндэтгэлтэй харьцах.",
      },
      {
        orderIndex: 2,
        title: "KARMA 100K-аас дээш зөрчил",
        description: "KARMA 100K-аас дээш мөнгөн дүнтэй ACCOUNT алдсан тохиолдолд зөвхөн 100% нотлох баримтад үндэслэн ажиллана. Заавал ADMIN-ийн зөвшөөрөл авна. Зөвшөөрөлгүй KARMA хийсэн тохиолдолд MODERATOR/ADMIN эрхийг шууд хурааж Ban хийнэ.",
      },
      {
        orderIndex: 3,
        title: "Маргаан үүсгэхгүй байх",
        description: "MODERATOR эсвэл ADMIN хоорондоо маргалдсан тохиолдолд танил, танил бишээс үл хамааран эрхийг шууд хурааж Ban хийнэ.",
      },
      {
        orderIndex: 4,
        title: "Дүрэм зөрчих",
        description: "Дүрэм зөрчиж асуудал гаргасан MODERATOR-д урьдчилан сануулахгүйгээр эрхийг нь хураана.",
      },
      {
        orderIndex: 5,
        title: "Оройн цагаар @everyone хориглоно",
        description: "Орой 18:00 цагаас хойш @everyone ашиглахыг хориглоно. Зөрчсөн тохиолдолд MODERATOR/ADMIN эрхийг шууд хураана.",
      },
      {
        orderIndex: 6,
        title: "Хувийн мэдээлэл хамгаалах",
        description: "ADMIN болон MODERATOR нь хэрэглэгчийн хувийн мэдээллийг нийтэд дэлгэхийг хатуу хориглоно. Зөрчсөн тохиолдолд эрхийг шууд хурааж Ban хийнэ.",
      },
      {
        orderIndex: 7,
        title: "Идэвхгүй байдал",
        description: "7 хоног идэвхгүй болсон MODERATOR-ийн эрхийг шууд хураана. Хэрэв хувийн шалтгаантай бол урьдчилан мэдэгдсэн байх ёстой.",
      },
      {
        orderIndex: 8,
        title: "Spam пост",
        description: "Spam постуудыг тогтмол устгана.",
      },
      {
        orderIndex: 9,
        title: "Давхардсан пост",
        description: "Нэг постыг олон удаа нийтэлсэн хэрэглэгчийг шууд Ban хийнэ.",
      },
      {
        orderIndex: 10,
        title: "Profile зураггүй хэрэглэгч",
        description: "Profile зураггүй хэрэглэгчийн постыг зөвшөөрөхгүй.",
      },
      {
        orderIndex: 11,
        title: "Comment хяналт",
        description: "Пост бүрийн comment-ийг тогтмол шалгана.",
      },
      {
        orderIndex: 12,
        title: "+18 Контент",
        description: "+18 контент илэрвэл шууд устгаж хэрэглэгчийг Ban хийнэ.",
      },
      {
        orderIndex: 13,
        title: "+18 Аниме контент",
        description: "+18 агуулгатай аниме зурагтай постыг зөвшөөрөхгүй.",
      }
    ];

    await db.insert(moderatorRules).values(rulesToInsert);
    console.log("Rules seeded");
  } else {
    console.log("Rules already seeded");
  }
}

seed()
  .then(() => {
    console.log("Seed complete");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
