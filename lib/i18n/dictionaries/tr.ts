import type { Dictionary } from "../types";

export const tr: Dictionary = {
  nav: {
    home: "Ana Sayfa",
    about: "Hakkımızda",
    events: "Etkinlikler",
    team: "Ekibimiz",
    contact: "İletişim",
    skipToContent: "İçeriğe atla",
    clubLogoAria: "AISS Kulübü ana sayfası",
    openMenu: "Gezinme menüsünü aç",
    closeMenu: "Gezinme menüsünü kapat",
    mainNavigationAria: "Ana gezinme",
    languageAriaLabel: "Dil seçin",
    switchToEn: "İngilizceye geç",
    switchToTr: "Türkçeye geç",
    joinClub: "Kulübe Katıl",
  },
  hero: {
    heading: "Akademik merakı gerçek dünya yapay zeka etkisiyle buluşturuyoruz.",
    description:
      "Pratik geliştirme yoluyla yapay zekanın sınırlarını genişletmek için iş birliği yapan lisans mühendisleri ve araştırmacılardan oluşan bir topluluk.",
    exploreEvents: "Etkinlikleri Keşfet",
    readAboutUs: "Hakkımızda",
  },
  about: {
    ticker: "Merak ve İş Birliği ile Gelişen Zeka",
    focusAreasTitle: "Temel Odak Alanları",
    focusAreas: [
      {
        id: "ml-fundamentals",
        index: "01",
        title: "Makine Öğrenimi",
        description:
          "Temel öğrenme algoritmaları, gradyan optimizasyonu, kayıp yüzeyi geometrisi ve model değerlendirme metriklerini temiz PyTorch uygulamalarıyla inceliyoruz.",
        topics: ["İstatistiksel Öğrenme", "Gradyan Yöntemleri", "PyTorch"],
      },
      {
        id: "vision-robotics",
        index: "02",
        title: "Bilgisayarlı Görü",
        description:
          "Algısal temsilleri gerçek zamanlı fiziksel sistemlerle buluşturarak uzamsal zeka, görsel SLAM ve gömülü sinir ağı çıkarımını kapsıyoruz.",
        topics: ["Uzamsal Zeka", "Uçta Çıkarım", "ROS 2"],
      },
      {
        id: "responsible-ai",
        index: "03",
        title: "Sorumlu Yapay Zeka",
        description:
          "Algoritmik adillik, güvenlik denetimi ve veri seti kaynak yönetimini otonom sistemler için temel mühendislik spesifikasyonları olarak ele alıyoruz.",
        topics: ["Algoritmik Adillik", "Güvenlik Denetimi", "Yönetişim"],
      },
    ],
    showMoreMetrics: "Daha fazla kulüp metriği göster ↓",
    showLessMetrics: "Daha az metrik göster ↑",
    stats: [
      {
        id: "workshops",
        value: "[Doğrulanmış atölye sayısı]",
        label: "Uygulamalı Atölyeler",
        detail: "PyTorch laboratuvarları, model mimarisi derinlemesine incelemeleri ve sistem kodlama maratonları.",
        isPlaceholder: true,
      },
      {
        id: "members",
        value: "[Doğrulanmış üye sayısı]",
        label: "Aktif Katılımcılar",
        detail: "Bilgisayar bilimleri, veri ve mühendislik alanlarında lisans ve lisansüstü öğrenciler.",
        isPlaceholder: true,
      },
      {
        id: "working-groups",
        value: "[Doğrulanmış çalışma grubu sayısı]",
        label: "Özel Çalışma Grupları",
        detail: "Makine öğrenimi temelleri, görü sistemleri ve yapay zeka politikası alanlarında bağımsız kollar.",
        isPlaceholder: true,
      },
      {
        id: "events",
        value: "[Doğrulanmış yıllık etkinlik sayısı]",
        label: "Yıllık Hackathon'lar",
        detail: "Üniversite geneline açık geliştirme yarışmaları ve araştırma sempozyumları.",
        isPlaceholder: true,
      },
    ],
  },
  events: {
    ticker: "Akademik Takvim ve Çalışma Oturumları",
    featuredBadge: "Öne Çıkan Oturum // Sıradaki",
    timelineBadge: "Dönem Takvimi // Tüm Oturumlar",
    sessionsListed: "OTURUM LİSTELENDİ",
    carouselLabel: "Dönem takvimi etkinlikleri",
    categories: {
      workshop: "ATÖLYE",
      talk: "SEMİNER",
      buildSession: "GELİŞTİRME OTURUMU",
    },
    status: {
      upcoming: "YAKLAŞAN",
      archived: "ARŞİVLENDİ",
    },
    countdown: {
      completed: "TAMAMLANDI",
      inProgress: "DEVAM EDİYOR",
      daysUnit: "G",
      hoursUnit: "S",
      minutesUnit: "DK",
      left: "KALDI",
      ariaRemaining: "Kalan süre",
    },
    card: {
      locationLabel: "Konum:",
      leadLabel: "Yürütücü:",
      freeEntry: "Öğrencilere ücretsiz katılım →",
      showMore: "Daha fazla göster",
      showLess: "Daha az göster",
      transformerAlt: "Transformer yapay sinir ağı mimarisi şematik diyagramı",
    },
    timelineImages: {
      "featured-1": "Transformer yapay sinir ağı mimarisi şematik diyagramı",
      "evt-1": "Büyük dil modeli ince ayar veri boru hattı şematik diyagramı",
      "evt-2": "Bilgisayarlı görü ve OpenCV görüntü işleme boru hattı şematik diyagramı",
      "evt-3": "Yapay zeka etiği ve veri yönetişimi çerçevesi şematik diyagramı",
      default: "Yapay zeka teknik oturumu şematik diyagramı",
    },
    states: {
      errorTitle: "Akademik oturumlara şu anda ulaşılamıyor",
      networkError: "Kulüp etkinlikleri yüklenirken ağ hatası oluştu.",
      defaultError: (status: number) => `Etkinlikler yüklenemedi (HTTP ${status}).`,
      retry: "Tekrar Dene",
      emptyTitle: "Şu anda yayınlanmış oturum bulunmuyor",
      emptyMessage: "Yaklaşan atölyeler, seminerler ve geliştirme oturumları için yakında tekrar kontrol edin.",
    },
    featuredEvent: {
      id: "featured-1",
      title: "Yaklaşan Atölye: Transformer Mimarilerine Giriş",
      date: "28 EKİM",
      time: "18:00 – 20:00",
      location: "Oda 402 // Kampüs Laboratuvarı",
      lead: "Öğrenci Araştırma Grubu",
      category: "WORKSHOP",
      description:
        "Öz-dikkat (self-attention) mekanizmalarının ve pratik PyTorch tensör operasyonlarının uygulamalı analizi. Temel Python bilgisine sahip tüm öğrencilere açıktır.",
      status: "upcoming",
    },
    timelineEvents: [
      {
        id: "featured-1",
        title: "Yaklaşan Atölye: Transformer Mimarilerine Giriş",
        date: "28 EKİM",
        time: "18:00 – 20:00",
        location: "Oda 402 // Kampüs Laboratuvarı",
        lead: "Öğrenci Araştırma Grubu",
        category: "WORKSHOP",
        description:
          "Öz-dikkat (self-attention) mekanizmalarının ve pratik PyTorch tensör operasyonlarının uygulamalı analizi. Temel Python bilgisine sahip tüm öğrencilere açıktır.",
        status: "upcoming",
      },
      {
        id: "evt-1",
        title: "Yaklaşan Geliştirme: Açık Kaynak LLM İnce Ayar (Fine-Tuning) Maratonu",
        date: "12 KASIM",
        time: "14:00 – 17:30",
        location: "Oda 204 // Mühendislik Binası",
        lead: "Makine Öğrenimi Kolu",
        category: "BUILD SESSION",
        description:
          "Yerel donanım ve üniversite bilgi işlem kümelerinde parametre verimli ince ayar (LoRA) boru hatları kurmaya yönelik işbirlikli maraton.",
        status: "upcoming",
      },
      {
        id: "evt-2",
        title: "Geçmiş Atölye: OpenCV ile Bilgisayarlı Görünün Temelleri",
        date: "08 EKİM",
        time: "17:00 – 19:00",
        location: "Oda 402 // Kampüs Laboratuvarı",
        lead: "Robotik Çalışma Grubu",
        category: "WORKSHOP",
        description:
          "Eksiksiz Python kod örnekleriyle görüntü dönüşümleri, kenar algılama ve gerçek zamanlı web kamerası izleme algoritmaları ele alındı.",
        status: "past",
      },
      {
        id: "evt-3",
        title: "Geçmiş Seminer: Modern Yapay Zekada Etik ve Veri Yönetişimi",
        date: "24 EYLÜL",
        time: "18:00 – 19:30",
        location: "B Oditoryumu // Ana Kampüs",
        lead: "Teknoloji & Politika Semineri",
        category: "TALK",
        description:
          "Öğrenci liderliğindeki makine öğrenimi projelerinde algoritmik önyargı, veri soy kütüğü ve güvenlik değerlendirmeleri üzerine panel tartışması.",
        status: "past",
      },
    ],
  },
  team: {
    ticker: "Ekibimizle Tanışın",
    srOnlyTitle: "Ekibimizle Tanışın",
    showcaseLabel: "AISS Kulübü ekip üyeleri tanıtımı",
    showingMemberSr: (current, total, name, role) =>
      `${total} ekip üyesinden ${current}. gösteriliyor: ${name}${role ? `, ${role}` : ""}`,
    prevMember: "Önceki ekip üyesi",
    nextMember: "Sonraki ekip üyesi",
    slidesTablistLabel: "Ekip üyesi slaytları",
    goToSlideAria: (index, name) => `${index}. slayta git: ${name}`,
    photoAlt: (name) => `${name} fotoğrafı`,
    memberRoles: {
      "selen-y": "Eş Lider & Frontend Geliştirici",
      "mohamad-barakat": "Kulüp Lideri & Sistem Mimarı",
      "zeynep-a": "Çekirdek Ekip & Frontend Geliştirici",
      "gizem-a": "Çekirdek Ekip & Frontend Geliştirici",
      "nisa-c": "Çekirdek Ekip & Frontend Geliştirici",
      "meryem-b": "Çekirdek Ekip & Frontend Geliştirici",
      "yagmur-d": "Çekirdek Ekip & Frontend Geliştirici",
    },
    faqTitle: "Sıkça Sorulan Sorular",
    faqItems: [
      {
        id: "faq-1",
        question: "AISS Kulübü nedir ve kimler katılabilir?",
        answer:
          "AISS Kulübü (Yapay Zeka ve Akıllı Sistemler Kulübü), açık bir üniversite laboratuvarı ve işbirlikçi çalışma topluluğudur. Bölüm veya sınıf fark etmeksizin makine öğrenimi, akıllı sistemler, yazılım geliştirme veya mühendislik araştırmalarına ilgi duyan tüm öğrenciler toplantılarımıza ve açık geliştirme oturumlarımıza katılabilir.",
      },
      {
        id: "faq-2",
        question: "Öğrenci ekipleri bu kod tabanında nasıl iş birliği yapıyor?",
        answer:
          "Yapılandırılmış Git iş akışlarını takip ediyoruz: her öğrenci mühendis atanmış bir eğitim dalına (student/<name>) ve özel bir bileşen modülüne sahiptir. Tutarlı geliştirme ortamları için yerel Docker kapsayıcıları kullanıyor, git diff'lerini dikkatle inceliyor ve lider incelemeleriyle main dalını hedefleyen çekme istekleri (PR) açıyoruz.",
      },
      {
        id: "faq-3",
        question: "İletişim formu veya web sitesi herhangi bir kişisel veri topluyor mu?",
        answer:
          "Hayır. Ekip ilkelerimiz (AGENTS.md) doğrultusunda, iletişim formu ön uç düzeyinde bir eğitim simülasyonudur. Gönderimler kesinlikle ağ üzerinden iletilmez, veritabanlarına kaydedilmez veya tarayıcı depolamasına ya da sunucu dosyalarına kaydedilmez.",
      },
      {
        id: "faq-4",
        question: "Yaklaşan atölyelere ve hackathon'lara nasıl katılabilirim?",
        answer:
          "Yaklaşan tüm oturumlar yukarıdaki Etkinlikler takviminde yayınlanmaktadır. Planlanan kampüs laboratuvar oturumlarımıza doğrudan katılabilir veya üniversite öğrenci kanallarımız üzerinden iletişime geçebilirsiniz. Açık çalışma grupları için ön kayıt veya ücret gerekmemektedir.",
      },
      {
        id: "faq-5",
        question: "Şu anda hangi araç ve teknolojileri araştırıyoruz?",
        answer:
          "Web platformumuz Next.js (App Router), TypeScript, Tailwind CSS ve Docker ile geliştirilmiştir. Yapay zeka ve makine öğrenimi projelerinde üyelerimiz Python, PyTorch, Hugging Face transformer kütüphaneleri ve yerel açık ağırlıklı model mimarileriyle çalışmaktadır.",
      },
    ],
  },
  contact: {
    badge: "AISS MÜHENDİSLİK KULÜBÜ 2026",
    heading: "Birlikte akıllı sistemler geliştirelim.",
    directLineTitle: "Doğrudan Teknik İletişim",
    directLineDesc1:
      "Mühendislik topluluğumuz; gerçek dünya yapay zeka sistemleri, donanım yazılımları ve işbirlikli açık kaynak araçlar geliştirmeye tutkulu tüm öğrencilere açıktır.",
    directLineDesc2:
      "Projenizi, atölye sorularınızı veya üyelik ilginizi bu formu kullanarak iletebilirsiniz. Çekirdek ekibimiz gelen mesajları günlük olarak incelemektedir.",
    facultyLocation: "Mühendislik ve Doğa Bilimleri Fakültesi – Lab 3",
    stats: {
      members: "Üye",
      projects: "Proje",
      focusLabs: "Odak Lab",
    },
    responseTime: {
      title: "Ortalama Yanıt Süresi",
      desc: "Gelen mesajları hafta içi günlerde inceliyoruz. Genellikle 24 ila 48 saat içinde yanıt bekleyebilirsiniz.",
    },
    form: {
      fullName: "Ad Soyad",
      universityEmail: "Üniversite E-postası",
      areaOfInterest: "İlgi Alanı",
      message: "Mesaj",
      required: "ZORUNLU",
      namePlaceholder: "Örn. Ada Lovelace",
      emailPlaceholder: "ogrenci@universite.edu.tr",
      selectInterestPlaceholder: "Bir ilgi alanı seçin",
      interests: {
        ml: "Makine Öğrenimi",
        robotics: "Robotik",
        joining: "Ekibe Katılma",
        general: "Genel Bilgi",
      },
      messagePlaceholder:
        "Sorularınızı, araştırma fikirlerinizi veya AISS Kulübü ile neden iş birliği yapmak istediğinizi paylaşın...",
      errors: {
        nameRequired: "Lütfen adınızı ve soyadınızı girin.",
        nameMin: "Ad soyad en az 2 karakter olmalıdır.",
        nameMax: "Ad soyad en fazla 100 karakter olabilir.",
        emailRequired: "Lütfen üniversite e-postanızı girin.",
        emailInvalid:
          "Lütfen geçerli bir üniversite e-posta adresi girin (örn. ad@universite.edu.tr).",
        emailMax: "E-posta adresi en fazla 254 karakter olabilir.",
        interestRequired: "Lütfen bir ilgi alanı seçin.",
        messageRequired: "Lütfen mesajınızı girin.",
        messageMin: "Mesajınız en az 10 karakter olmalıdır.",
        messageMax: "Mesajınız en fazla 3000 karakter olabilir.",
        serverError: "Mesaj gönderilemedi. Lütfen tekrar deneyin.",
        networkError: "Ağ hatası: Sunucuya bağlanılamadı. Lütfen bağlantınızı kontrol edip tekrar deneyin.",
      },
      submitting: "Gönderiliyor...",
      submit: "Mesaj Gönder",
      success: {
        title: "Mesajınız Alındı",
        desc: "AISS Kulübü ile iletişime geçtiğiniz için teşekkürler! Mesajınız çekirdek ekibimiz için kaydedildi. Gelen mesajları günlük olarak inceliyoruz.",
        button: "Yeni Mesaj Gönder",
      },
    },
  },
  footer: {
    clubTitle: "AISS — Yapay Zeka ve Akıllı Sistemler",
    clubDesc:
      "Yapay zeka, akıllı sistemler ve uygulamalı mühendisliği keşfeden öğrenci liderliğindeki bir topluluk.",
    copyright: "© 2026 AISS Kulübü. Tüm hakları saklıdır.",
    backToTop: "Başa dön",
    logoAlt: "AISS Kulübü Logosu",
    footerAria: "Site Alt Bilgisi",
    navAria: "Alt Bilgi Navigasyonu",
  },
  join: {
    backToHome: "← AISS Ana Sayfa",
    universityTag: "AISS · Üsküdar Üniversitesi",
    title: "Kulübe Katıl.",
    description:
      "Bir sonraki projeniz bir toplulukla başlar. Üniversitenin SKS sistemi üzerinden resmi kulüp üyeliğinizi tamamlayın.",
    readyCard: {
      title: "Katılmaya hazır mısınız?",
      sksButton: "Resmi SKS web sitesini aç ↗",
      needHelp: "Katılmak için yardıma mı ihtiyacınız var? Adımları takip edin ↓",
    },
    option1: {
      badge: "Seçenek 1 · Telefonunuzda",
      title: "Üsküdar Uni uygulamasını kullanın",
      platform: "iPhone & Android",
      tapToEnlarge: "Büyütmek için görsele dokunun.",
      welcome: {
        title: "AISS'e hoş geldiniz.",
        prompt: "Bizimle birlikte üretmek ister misiniz? Katıldıktan sonra, ",
        contactLink: "ekibe kendinizi tanıtın",
        targetTopic: " ve ne üzerinde çalışmak istediğinizi bize bildirin.",
      },
    },
    steps: [
      {
        number: "01",
        title: "Üsküdar Uni uygulamasını açın",
        body: "iPhone veya Android'de üniversite uygulamasında oturum açın. Hızlı Menü'yü açıp SKS'yi seçin.",
        image: "/join-guide/quick-menu.png",
        alt: "SKS kutucuğunun yer aldığı Üsküdar Uni Hızlı Menüsü",
        caption: "Hızlı Menü → SKS",
      },
      {
        number: "02",
        title: "Kulübümüzü bulun",
        body: "Kulüplerde Ara bölümünde Yapay Zeka Kulübü veya AISS yazın. Yapay Zeka Kulübü'nü ve mor AI logomuzu arayın.",
        image: "/join-guide/club-list.png",
        alt: "SKS kulüp listesinde örnek Kayıtlı rozeti ile gösterilen Yapay Zeka Kulübü",
        caption: "Katıldıktan sonra kulübümüz Kulüplerim altında görünür.",
      },
      {
        number: "03",
        title: "Katıl butonuna dokunun",
        body: "Kulübü açıp Katıl'a dokunun. Üniversite yönergelerini takip edin. Onaylamak için Kayıtlı ibaresini veya kulübün Kulüplerim altında yer aldığını kontrol edin.",
        image: null,
        alt: "",
        caption: "Resmi üyelik SKS'de tamamlanır.",
      },
    ],
    option2: {
      badge: "Seçenek 2 · Tarayıcınızda",
      title: "SKS web sitesinden katılın",
      steps: [
        "Öğrenci Kulüpleri ↗ sayfasını açın.",
        "Yapay Zeka Kulübü aramasını yapın. Numaralandırılmış sayfaları geziyorsanız 5. sayfayı kontrol edin; liste sırası değişebilir.",
        "Kulübümüzü açın ve resmi üye formunu doldurun. Üniversite öğrenci numaranızı, üniversite e-postanızı ve şifrenizi talep edebilir.",
        "Üniversitenin aydınlatma metnini okuyun, gerekli onayı işaretleyin ve Sign Up / Katıl butonuna basın.",
      ],
      imageAlt:
        "Öğrenci numarası, e-posta ve şifre alanları boş olan resmi SKS Yapay Zeka Kulübü kayıt diyaloğu",
      imageCaption:
        "Üniversite web sitesinden referans. Etiketler dile göre farklılık gösterebilir. Büyütmek için dokunun.",
    },
    disclaimer: {
      title: "Üyelik işlemleri yalnızca resmi üniversite kanallarında gerçekleşir.",
      body: "Üniversite kimlik bilgilerinizi yalnızca resmi Üsküdar Uni uygulamasında veya resmi üniversite web sitesinde girin. AISS kesinlikle üniversite şifrenizi istemez. İletişim formumuzu göndermek sizi kulüp üyesi yapmaz.",
      ariaLabel: "Üyelik bilgileri",
    },
  },
  notFound: {
    errorCode: "Hata 404",
    title: "Sayfa Bulunamadı",
    description: "Aradığınız sayfa mevcut değil veya taşınmış olabilir.",
    returnHome: "Ana Sayfaya Dön",
  },
};
