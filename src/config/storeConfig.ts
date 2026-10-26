/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Palette,
  Sparkles,
  Compass,
  Layers,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react';

/**
 * =======================================================================
 * ملف الإعدادات الموحّد لمعرض الأثاث (Furniture Showroom Configuration)
 * =======================================================================
 * لتخصيص هذا القالب لأي عميل أو معرض أثاث جديد:
 * عدّل فقط القيم الواردة في هذا الملف دون الحاجة لتعديل باقي ملفات الواجهة.
 */

export interface CategoryItem {
  id: string;
  name: string;
  tagline: string;
  image: string;
}

export interface ProductItem {
  id: number;
  name: string;
  category: string;
  categoryId: string;
  description: string;
  features: string[];
  dimensions: string;
  image: string;
  priceStatus?: string;
}

export interface GalleryItem {
  title: string;
  category: string;
  image: string;
  span: string;
}

export interface WhyChooseUsItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export interface ClientReviewItem {
  name: string;
  city: string;
  rating: number;
  text: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface StoreConfig {
  // الهوية الأساسية
  brand: {
    name: string;
    subname: string;
    description: string;
    country: string;
    locationShort: string;
    locationDetailed: string;
    locationDirectionsNote: string;
    workingHoursShort: string;
    workingHoursDetailed: string;
    topBannerNotice: string;
    foundationBadgeTitle: string;
    foundationBadgeSubtitle: string;
  };

  // بيانات الاتصال وواتساب
  contact: {
    // رقم الواتساب بالصيغة الدولية بدون (+) أو أصفار في البداية (مثال لمصر: 201012345678)
    whatsappNumber: string;
    displayPhone: string;
    isDemoNumber: boolean;
    demoNotice: string;
    email?: string;
    socialLinks?: {
      facebook?: string;
      instagram?: string;
      tiktok?: string;
    };
  };

  // إعدادات وتخصيص واجهة الافتتاحية (Hero)
  hero: {
    kicker: string[];
    headline: string;
    subheadline: string;
    backgroundImage: string;
    primaryCtaText: string;
    secondaryCtaText: string;
    trustBadges: string[];
  };

  // أقسام الأثاث
  categories: CategoryItem[];

  // المنتجات المميزة
  featuredProducts: ProductItem[];

  // نصوص ورسائل القسم الفارغ (الذي لم تتوفر له منتجات بعد)
  emptyCategoryNotice: {
    message: string;
    whatsappCtaText: string;
    viewAllCtaText: string;
  };

  // معرض الصور والتصميمات
  galleryItems: GalleryItem[];

  // قسم من نحن
  about: {
    kicker: string;
    headline: string;
    introLead: string;
    bodyParagraph: string;
    image: string;
    badgeTitle: string;
    badgeSubtitle: string;
    pillars: Array<{
      title: string;
      desc: string;
    }>;
  };

  // لماذا تختارنا؟
  whyChooseUs: WhyChooseUsItem[];

  // آراء العملاء
  reviews: {
    items: ClientReviewItem[];
    disclaimer: string;
  };

  // الأسئلة الشائعة
  faqs: FaqItem[];

  // تفعيل أو تعطيل أقسام الموقع
  sections: {
    topBanner: boolean;
    hero: boolean;
    categories: boolean;
    featuredProducts: boolean;
    gallery: boolean;
    about: boolean;
    whyUs: boolean;
    reviews: boolean;
    faq: boolean;
    contact: boolean;
    floatingWhatsApp: boolean;
  };

  // التذييل
  footer: {
    copyrightYear: number;
    copyrightNotice: string;
  };
}

export const storeConfig: StoreConfig = {
  // 1. الهوية الأساسية للمعرض
  brand: {
    name: 'النجار فيرنيتشر',
    subname: 'Al-Najjar · Luxury Living',
    description: 'صالة عرض أثاث رائدة في مصر تقدم تصاميم عصرية تجمع بين فخامة المظهر وراحة الاستخدام وأصالة الأخشاب الطبيعية.',
    country: 'جمهورية مصر العربية',
    locationShort: 'جمهورية مصر العربية',
    locationDetailed: 'جمهورية مصر العربية — صالة العرض الرئيسية',
    locationDirectionsNote: 'تواصل معنا لمعرفة أقرب فرع وطريقة الوصول المباشرة',
    workingHoursShort: '10 ص – 10 م يوميًا',
    workingHoursDetailed: 'يوميًا من 10:00 صباحًا حتى 10:00 مساءً',
    topBannerNotice: 'معرض النجار فيرنيتشر — صناعة فاخرة وتصاميم عصرية في مصر',
    foundationBadgeTitle: 'حرفية مصرية',
    foundationBadgeSubtitle: 'نجمع بين تراث النجارة المصرية العريق وأحدث خطوط الموضة العالمية في الديكور والأثاث.',
  },

  // 2. بيانات الاتصال وواتساب
  contact: {
    whatsappNumber: '201012345678',
    displayPhone: '+20 10 1234 5678',
    isDemoNumber: true,
    demoNotice: 'رقم تجريبي مخصص للعرض البرمجي والمعاينة فقط (يمكن تعديله لأي عميل من هذا الملف)',
    email: undefined, // اختياري: يمكن كتابة البريد مثل 'info@example.com'
    socialLinks: {
      facebook: undefined,
      instagram: undefined,
      tiktok: undefined,
    },
  },

  // 3. افتتاحية الموقع (Hero Section)
  hero: {
    kicker: ['تشكيلات 2026 الحصرية', 'جودة تنفيذ راقية', 'خامات طبيعية منتقاة'],
    headline: 'بيتك يستحق الأفضل',
    subheadline: 'اكتشف تشكيلات متنوعة من الأثاث تجمع بين الأناقة والراحة والتصميم العصري، بتفاصيل متقنة تعكس ذوقك الرفيع في كل زاوية.',
    backgroundImage: '/src/assets/images/card_living_1793021788895.webp',
    primaryCtaText: 'استكشف منتجاتنا المميزة',
    secondaryCtaText: 'تواصل مع المعرض',
    trustBadges: [
      'أخشاب طبيعية ممتازة',
      'تصاميم تناسب المساحات الحديثة',
      'أقمشة فاخرة سهلة العناية',
      'استشارات اختيار المقاسات',
    ],
  },

  // 4. أقسام الأثاث المتكاملة
  categories: [
    {
      id: 'bedrooms',
      name: 'غرف النوم',
      tagline: 'أجواء استرخاء ملكية بتشطيبات هادئة',
      image: '/src/assets/images/card_bedroom_1793021790984.webp',
    },
    {
      id: 'living',
      name: 'غرف المعيشة',
      tagline: 'دفء اللقاءات العائلية وأناقة المساحات',
      image: '/src/assets/images/card_living_1793021788895.webp',
    },
    {
      id: 'sofas',
      name: 'الانتريهات والركنات',
      tagline: 'أقمشة فاخرة وراحة استثنائية تدوم',
      image: '/src/assets/images/cat_sofa_1793022362933.webp',
    },
    {
      id: 'dining',
      name: 'غرف السفرة',
      tagline: 'طاولات طعام تحتفي بالضيافة الراقية',
      image: '/src/assets/images/card_dining_1793021789260.webp',
    },
    {
      id: 'kids',
      name: 'غرف الأطفال',
      tagline: 'بيئة مرحة ومبتكرة تناسب كل مرحلة',
      image: '/src/assets/images/cat_kids_1793022362083.webp',
    },
    {
      id: 'offices',
      name: 'المكاتب المنزلية',
      tagline: 'تصميم عملي يدعم التركيز والإنتاجية',
      image: '/src/assets/images/cat_office_1793022362217.webp',
    },
    {
      id: 'tv-units',
      name: 'وحدات التلفزيون',
      tagline: 'بساطة عصرية لتنظيم أنيق ومثالي',
      image: '/src/assets/images/cat_tv_1793022362727.webp',
    },
    {
      id: 'wardrobes',
      name: 'الدواليب ووحدات التخزين',
      tagline: 'تقسيمات ذكية وجودة استثنائية',
      image: '/src/assets/images/cat_wardrobe_1793022362676.webp',
    },
  ],

  // 5. المنتجات المميزة (البيانات المعتمدة للمنتجات المتوفرة حاليًا)
  featuredProducts: [
    {
      id: 1,
      name: 'طقم انتريه «سيرين» المودرن',
      category: 'الانتريهات والركنات',
      categoryId: 'sofas',
      description: 'طقم انتريه ثلاثي وثنائي مع فوتيه فخم بأقمشة بوكليه محايدة وقواعد خشبية صلبة.',
      features: ['إسفنج فائق الكثافة 35', 'قماش بوكليه معالج ضد البقع', 'هيكل خشب زان أحمر'],
      dimensions: 'كنبة رئيسية 240×95 سم · فوتيه 90×85 سم',
      image: '/src/assets/images/cat_sofa_1793022362933.webp',
      priceStatus: 'عند الطلب حسب المقاس',
    },
    {
      id: 2,
      name: 'غرفة نوم ماستر «رويال بيج»',
      category: 'غرف النوم',
      categoryId: 'bedrooms',
      description: 'سرير كينج مبطن بقماش كتان ترابي مع دولاب مفصلي مدمج بإضاءة هادئة وكمودينو معلق.',
      features: ['ظهر سرير مبطن بحرفية', 'دواليب بنظام هيدروليك ناعم', 'أخشاب طبيعية مقاومة'],
      dimensions: 'مقاس المرتبة 180×200 سم · دولاب 260×220 سم',
      image: '/src/assets/images/card_bedroom_1793021790984.webp',
      priceStatus: 'عند الطلب حسب المقاس',
    },
    {
      id: 3,
      name: 'طقم سفرة «أريا» مع 6 مقاعد',
      category: 'غرف السفرة',
      categoryId: 'dining',
      description: 'طاولة طعام خشبية أنيقة بحواف بيضاوية ناعمة مع مقاعد مريحة مكسوة بقماش فاخر.',
      features: ['سطح قشرة بلوط طبيعي', 'كراسي مريحة لأسفل الظهر', 'تشطيب مطفي أنيق'],
      dimensions: 'طاولة 200×95 سم ارتفاع 76 سم',
      image: '/src/assets/images/card_dining_1793021789260.webp',
      priceStatus: 'عند الطلب حسب المقاس',
    },
    {
      id: 4,
      name: 'صالون معيشة «أورورا» الرحب',
      category: 'غرف المعيشة',
      categoryId: 'living',
      description: 'كنبة زاوية عصرية مع طاولة قهوة منخفضة بتناسق لوني ترابي يملأ البيت بالحميمية.',
      features: ['مخدات محشوة بريش صناعي ناعم', 'مساند ذراع مريحة', 'طاولة متطابقة الخامة'],
      dimensions: 'كنبة حرف L بطول 310×190 سم',
      image: '/src/assets/images/card_living_1793021788895.webp',
      priceStatus: 'عند الطلب حسب المقاس',
    },
    {
      id: 5,
      name: 'مكتب «نورديك» المريح مع كرسي شبكي',
      category: 'المكاتب المنزلية',
      categoryId: 'offices',
      description: 'مكتب عمل عصري بسطح خشبي دافئ وأرجل حديدية معالجة باللون الأسود المطفي.',
      features: ['مجرى منظم للأسلاك', 'خشب طبيعي يتحمل الاستخدام اليومي', 'تصميم خفيف بصريًا'],
      dimensions: 'عرض 140 سم · عمق 70 سم · ارتفاع 75 سم',
      image: '/src/assets/images/cat_office_1793022362217.webp',
      priceStatus: 'عند الطلب حسب المقاس',
    },
    {
      id: 6,
      name: 'وحدة تلفزيون «مينيمال» المعلقة',
      category: 'وحدات التلفزيون',
      categoryId: 'tv-units',
      description: 'وحدة كونسول شاشة جدارية مع درف تخزين سفلية مخفية ورفوف عرض للديكورات الراقية.',
      features: ['أبواب تفتح بنظام اللمس (Push-to-open)', 'فتحات خلفية مخفية للكابلات', 'طلاء حراري متين'],
      dimensions: 'عرض 220 سم · عمق 40 سم · ارتفاع 35 سم',
      image: '/src/assets/images/cat_tv_1793022362727.webp',
      priceStatus: 'عند الطلب حسب المقاس',
    },
  ],

  // 6. نصوص ورسائل القسم الذي لا يحتوي على منتجات حاليًا
  emptyCategoryNotice: {
    message: 'نعمل على تجهيز تشكيلات هذا القسم. تواصل معنا للاستفسار عن المنتجات المتاحة.',
    whatsappCtaText: 'استفسار عبر واتساب عن منتجات القسم',
    viewAllCtaText: 'عرض كافة المعروضات المتوفرة',
  },

  // 7. معرض الصور والتصاميم
  galleryItems: [
    {
      title: 'تناغم غرفة المعيشة العصرية',
      category: 'غرف المعيشة',
      image: '/src/assets/images/card_living_1793021788895.webp',
      span: 'col-span-12 md:col-span-7',
    },
    {
      title: 'ركن السفرة الدافئ',
      category: 'غرف السفرة',
      image: '/src/assets/images/card_dining_1793021789260.webp',
      span: 'col-span-12 md:col-span-5',
    },
    {
      title: 'جناح النوم الماستر الفاخر',
      category: 'غرف النوم',
      image: '/src/assets/images/hero_bedroom_1793021789479.webp',
      span: 'col-span-12 md:col-span-5',
    },
    {
      title: 'تفاصيل انتريه مريح وعصري',
      category: 'الانتريهات',
      image: '/src/assets/images/cat_sofa_1793022362933.webp',
      span: 'col-span-12 md:col-span-7',
    },
    {
      title: 'مكتب العمل المنزلي الهادئ',
      category: 'المكاتب',
      image: '/src/assets/images/cat_office_1793022362217.webp',
      span: 'col-span-12 md:col-span-6',
    },
    {
      title: 'وحدة جدارية مع كونسول أنيق',
      category: 'وحدات التلفزيون',
      image: '/src/assets/images/cat_tv_1793022362727.webp',
      span: 'col-span-12 md:col-span-6',
    },
  ],

  // 8. قسم من نحن
  about: {
    kicker: 'هويتنا ورؤيتنا',
    headline: 'عن معرض «النجار فيرنيتشر»',
    introLead: 'انطلق معرض النجار فيرنيتشر من شغف حقيقي بإعادة تعريف مفهوم الأثاث المنزلي في مصر؛ حيث نرى أن قطعة الأثاث ليست مجرد مظهر خارجي، بل هي مساحة تجمع العائلة، ومصدر للراحة اليومية، وانعكاس لذوق أصحاب البيت.',
    bodyParagraph: 'نركز في صالتنا على انتقاء خامات الأخشاب الصلبة، والأقمشة المعالجة، والآليات الحركية السلسة التي تعيش طويلاً. نحرص على تقديم مشورة واقعية لكل عميل ليختار ما يناسب مساحته الفعلية وميزانيته دون تكلف أو مبالغة.',
    image: '/src/assets/images/hero_bedroom_1793021789479.webp',
    badgeTitle: 'حرفية مصرية',
    badgeSubtitle: 'نجمع بين تراث النجارة المصرية العريق وأحدث خطوط الموضة العالمية في الديكور والأثاث.',
    pillars: [
      {
        title: 'الراحة والعملية',
        desc: 'أبعاد مدروسة تلائم الاستخدام اليومي المستمر',
      },
      {
        title: 'أصالة الخامات',
        desc: 'خشب زان طبيعي وتشطيبات عالية المتانة',
      },
      {
        title: 'علاقة مستدامة',
        desc: 'اهتمام ومتابعة وتواصل مستمر بعد البيع',
      },
    ],
  },

  // 9. لماذا تختارنا؟
  whyChooseUs: [
    {
      icon: Palette,
      title: 'تنوع التصميمات العصرية',
      desc: 'مجموعات متجددة تلائم مختلف الأذواق المعاصرة والكلاسيكية الراقية وتمنح منزلك شخصية مميزة.',
    },
    {
      icon: Sparkles,
      title: 'الاهتمام بأدق التفاصيل',
      desc: 'عناية فائقة باختيار الأقمشة، وقوة الهياكل، وسلامة الزوايا والتشطيبات النهائية يدويًا.',
    },
    {
      icon: Compass,
      title: 'الراحة والعملية اليومية',
      desc: 'دراسة هندسية لأبعاد كل قطعة لتوفر أقصى درجات الراحة وسهولة الاستخدام والحركة داخل البيت.',
    },
    {
      icon: Layers,
      title: 'المساعدة في اختيار الأنسب',
      desc: 'فريقنا مستعد دائمًا لتقديم النصائح حول تناسق المقاسات والألوان وتوزيع الأثاث بما يلائم غرفتك.',
    },
    {
      icon: MessageCircle,
      title: 'سهولة التواصل والمتابعة',
      desc: 'تواصل فوري وسريع عبر واتساب لمناقشة التفاصيل والإجابة عن استفساراتك بكل وضوح وشفافية.',
    },
  ],

  // 10. آراء العملاء
  reviews: {
    items: [
      {
        name: 'م. أحمد الشريف',
        city: 'القاهرة الجديدة',
        rating: 5,
        text: 'الخامات والتشطيب فاقوا توقعاتي، تناسق ألوان الانتريه مع دهانات الصالون كان رائعًا وفريق المعرض كان في غاية التعاون في كل استفسار.',
      },
      {
        name: 'سارة عبد الرحمن',
        city: 'الشيخ زايد',
        rating: 5,
        text: 'غرفة النوم مريحة جدًا، والمقاسات كانت دقيقة تمامًا لمساحة غرفتي. التعامل راقٍ وسريع عبر الواتساب وسعدت جدًا بالتجربة.',
      },
      {
        name: 'د. طارق محمود',
        city: 'المعادي',
        rating: 5,
        text: 'أعجبتني بساطة التصميم ومتانة الخشب الطبيعي في السفرة والمكتب. قيمة جمالية وعملية حقيقية تستحق كل التقدير.',
      },
    ],
    disclaimer: '* تنويه: الآراء والأسماء الواردة أعلاه هي نماذج توضيحية لغرض المعاينة والعرض التجريبي.',
  },

  // 11. الأسئلة الشائعة
  faqs: [
    {
      q: 'كيف يمكنني الاستفسار عن سعر وتفاصيل أي قطعة أثاث؟',
      a: 'يمكنك ببساطة الضغط على زر «اسأل عن السعر» بجوار أي منتج، وسيتم تحويلك فورًا إلى محادثة واتساب مع فريق المعرض متضمنة اسم المنتج، لنجيبك فورًا بالأسعار والمقاسات المتاحة.',
    },
    {
      q: 'كيف أتعرف على المقاسات المناسبة لمساحة غرفتي؟',
      a: 'نوفر أبعادًا إرشادية لكل قطعة موضحة في بطاقتها، كما يمكنك إرسال أبعاد غرفتك عبر واتساب وسيقوم مستشار الديكور لدينا بإرشادك للقطع والتوزيع الأنسب.',
    },
    {
      q: 'هل تتوفر ألوان وتصميمات وخامات مختلفة للقطعة الواحدة؟',
      a: 'نعم، يتوفر لدينا كتالوج متنوع لعينات الأقمشة الفاخرة ودرجات قشرة الأخشاب الطبيعية، ويمكنك طلب استعراض الخيارات المتاحة عند تواصلك معنا.',
    },
    {
      q: 'أين يقع مقر المعرض وما هي مواعيد الزيارة؟',
      a: 'صالة العرض ترحب بكم في مصر يوميًا من الساعة 10:00 صباحًا حتى 10:00 مساءً. يرجى التواصل معنا عبر واتساب أو الهاتف لتزويدكم بالعنوان الدقيق وترتيب الزيارة.',
    },
    {
      q: 'هل يمكن الاستفسار عن نوعية الأخشاب والإسفنج المستخدم؟',
      a: 'بكل تأكيد، نحن نؤمن بالشفافية الكاملة ونعتمد أخشاب الزان الطبيعية والإسفنج عالي الكثافة، ويسعدنا مشاركة كافة المواصفات الفنية معك قبل أي خطوة.',
    },
  ],

  // 12. آلية إظهار أو إخفاء أي قسم اختياري (Section Visibility Toggles)
  sections: {
    topBanner: true,
    hero: true,
    categories: true,
    featuredProducts: true,
    gallery: true,
    about: true,
    whyUs: true,
    reviews: true,
    faq: true,
    contact: true,
    floatingWhatsApp: true,
  },

  // 13. التذييل وحقوق النشر
  footer: {
    copyrightYear: 2026,
    copyrightNotice: 'جميع الحقوق محفوظة لغرض العرض التجريبي والمهني.',
  },
};

/**
 * دالة مساعدة لتوليد روابط محادثة واتساب المجهزة بنص استفسار مخصص
 */
export function getWhatsAppUrl(text: string): string {
  const base = `https://wa.me/${storeConfig.contact.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function getProductInquiryUrl(productName: string): string {
  const text = `مرحبًا معرض ${storeConfig.brand.name}، أود الاستفسار عن تفاصيل وسعر ومقاسات: ${productName}`;
  return getWhatsAppUrl(text);
}

export function getCategoryInquiryUrl(categoryName: string): string {
  const text = `مرحبًا معرض ${storeConfig.brand.name}، أود الاستفسار عن التشكيلات والمنتجات المتاحة في قسم: ${categoryName}`;
  return getWhatsAppUrl(text);
}
