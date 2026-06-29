'use client';
import { useState } from 'react';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const CONTENT = {
  tr: {
    eyebrow: 'Yasal',
    title: 'KVKK Aydınlatma Metni',
    effective: 'Yürürlük tarihi: 29 Haziran 2026',
    intro:
      '6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, Shining Brows Expert mobil uygulaması ("Uygulama") ve shiningbrowsacademy.com web sitesi kapsamında işlediğimiz kişisel verileriniz hakkında sizi bilgilendirmek isteriz.',
    sections: [
      {
        heading: '1. Veri Sorumlusu',
        body: [
          'Veri Sorumlusu: Güzide Korkmaz (Shining Brows Academy)',
          'İletişim: contact@shiningbrowsacademy.com',
        ],
      },
      {
        heading: '2. İşlenen Kişisel Veriler',
        body: [
          'Kimlik ve iletişim verisi: ad, soyad, e-posta adresi, telefon numarası.',
          'Görsel veri: Uygulama üzerinden tarafınızca yüklenen fotoğraflar (profil görseli, portföy/uygulama içeriği).',
        ],
      },
      {
        heading: '3. Kişisel Verilerin İşlenme Amaçları',
        body: [
          'Shining Brows Expert uygulamasında hesabınızın oluşturulması ve kimlik doğrulamanın gerçekleştirilmesi.',
          'Uzman profilinizin ve portföy fotoğraflarınızın platformda görüntülenebilir hâle getirilmesi.',
          'Destek taleplerinizin ve bildirimlerinizin karşılanması.',
          'İlgili mevzuattan doğan yasal yükümlülüklerin yerine getirilmesi.',
        ],
      },
      {
        heading: '4. İşlemenin Hukuki Sebepleri',
        body: [
          'Açık rızanız (özellikle fotoğraf yükleme ve yayımlanması bakımından — KVKK m.5/1).',
          'Bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması (hesap oluşturma — KVKK m.5/2-c).',
          'Veri sorumlusunun meşru menfaati (hizmet güvenliği, dolandırıcılığın önlenmesi — KVKK m.5/2-f).',
        ],
      },
      {
        heading: '5. Kişisel Verilerin Aktarımı ve Yurt Dışına Aktarım',
        body: [
          'Kişisel verileriniz, hizmetin sunulabilmesi amacıyla aşağıdaki yurt dışı kaynaklı hizmet sağlayıcılar üzerinde işlenmektedir:',
          '• Clerk, Inc. (Amerika Birleşik Devletleri) — kullanıcı kimlik doğrulama ve hesap yönetimi.',
          '• Render Services, Inc. (Amerika Birleşik Devletleri) — sunucu ve uygulama altyapısı.',
          '• Supabase, Inc. (Amerika Birleşik Devletleri / Avrupa Birliği) — veritabanı ve dosya depolama.',
          'Bu aktarım KVKK m.9 kapsamında açık rızanıza dayalı olarak gerçekleştirilmektedir. Sağlayıcılar uluslararası kabul görmüş güvenlik standartlarına (TLS şifreleme, erişim kontrolleri vb.) uygun veri koruma önlemleri uygulamaktadır.',
        ],
      },
      {
        heading: '6. Saklama Süresi',
        body: [
          'Kişisel verileriniz, hesabınız aktif olduğu sürece ve ilgili mevzuatın öngördüğü zorunlu saklama süreleri boyunca saklanır. Hesabınızı sildirmeniz hâlinde verileriniz, yasal zorunluluklar saklı kalmak üzere makul süre içinde silinir veya anonim hâle getirilir.',
        ],
      },
      {
        heading: '7. KVKK Madde 11 Kapsamındaki Haklarınız',
        body: [
          'Kanun gereği veri sorumlusuna başvurarak;',
          'a) Kişisel verilerinizin işlenip işlenmediğini öğrenme,',
          'b) İşlenmişse buna ilişkin bilgi talep etme,',
          'c) İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,',
          'ç) Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,',
          'd) Eksik veya yanlış işlenmişse düzeltilmesini isteme,',
          'e) Kanunun 7. maddesinde öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini isteme,',
          'f) Yukarıdaki işlemlerin verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme,',
          'g) İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme,',
          'ğ) Kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme haklarına sahipsiniz.',
        ],
      },
      {
        heading: '8. İletişim',
        body: [
          'KVKK kapsamındaki başvurularınızı contact@shiningbrowsacademy.com adresine iletebilirsiniz. Başvurularınız, KVKK ve ilgili mevzuat çerçevesinde değerlendirilerek en geç 30 (otuz) gün içinde sonuçlandırılacaktır.',
        ],
      },
    ],
  },
  en: {
    eyebrow: 'Legal',
    title: 'KVKK Information Notice',
    effective: 'Effective date: 29 June 2026',
    intro:
      'Under Turkish Personal Data Protection Law No. 6698 ("KVKK"), we hereby inform you about how we process your personal data in connection with the Shining Brows Expert mobile application ("App") and shiningbrowsacademy.com.',
    sections: [
      {
        heading: '1. Data Controller',
        body: [
          'Data Controller: Güzide Korkmaz (Shining Brows Academy)',
          'Contact: contact@shiningbrowsacademy.com',
        ],
      },
      {
        heading: '2. Personal Data Processed',
        body: [
          'Identity and contact data: first name, last name, email address, phone number.',
          'Visual data: photos uploaded by you through the App (profile picture, portfolio / work samples).',
        ],
      },
      {
        heading: '3. Purposes of Processing',
        body: [
          'Creating your account and authenticating you on the Shining Brows Expert application.',
          'Making your expert profile and portfolio photos visible on the platform.',
          'Handling support requests and notifications.',
          'Fulfilling legal obligations arising from applicable legislation.',
        ],
      },
      {
        heading: '4. Legal Bases',
        body: [
          'Your explicit consent (in particular for uploading and publishing photos — KVKK Art. 5/1).',
          'Necessary for the establishment or performance of a contract (account creation — KVKK Art. 5/2-c).',
          'Legitimate interests of the controller (service security, fraud prevention — KVKK Art. 5/2-f).',
        ],
      },
      {
        heading: '5. Data Sharing & Cross-Border Transfers',
        body: [
          'Your personal data is processed via the following international service providers in order to deliver the service:',
          '• Clerk, Inc. (United States) — user authentication and account management.',
          '• Render Services, Inc. (United States) — server and application infrastructure.',
          '• Supabase, Inc. (United States / European Union) — database and file storage.',
          'These transfers are carried out under KVKK Art. 9 on the basis of your explicit consent. All providers apply internationally recognized security measures (TLS encryption, access controls, etc.) for the protection of your data.',
        ],
      },
      {
        heading: '6. Retention',
        body: [
          'Your personal data is retained for as long as your account is active and for any mandatory retention periods required by applicable legislation. Upon account deletion, your data is deleted or anonymized within a reasonable period, subject to any legal retention obligations.',
        ],
      },
      {
        heading: '7. Your Rights Under KVKK Art. 11',
        body: [
          'Under the Law you have the right to apply to the data controller and:',
          'a) Learn whether your personal data is being processed,',
          'b) Request information if it has been processed,',
          'c) Learn the purpose of processing and whether it is used in accordance with that purpose,',
          'd) Know the third parties to whom data has been transferred domestically or abroad,',
          'e) Request correction if processed incompletely or inaccurately,',
          'f) Request deletion or destruction within the conditions set out in Article 7,',
          'g) Request notification of the above actions to third parties to whom data has been transferred,',
          'h) Object to a result arising against you by analysis exclusively through automated systems,',
          'i) Request compensation if you suffer damage due to unlawful processing.',
        ],
      },
      {
        heading: '8. Contact',
        body: [
          'You can submit your KVKK requests to contact@shiningbrowsacademy.com. Requests will be evaluated under KVKK and applicable legislation, and responded to within 30 (thirty) days at the latest.',
        ],
      },
    ],
  },
};

export default function KvkkPage() {
  const [locale, setLocale] = useState('tr');
  const [menuOpen, setMenuOpen] = useState(false);
  const c = CONTENT[locale];

  return (
    <>
      <PromoBar hidden={menuOpen} locale={locale} />
      <Nav locale={locale} onLocaleChange={setLocale} onMenuChange={setMenuOpen} />
      <main className="bg-charcoal text-ivory pt-28 md:pt-36 pb-24 md:pb-32 min-h-screen">
        <article className="max-w-3xl mx-auto px-7 md:px-10">
          <span
            className="font-nav uppercase text-ivory/55"
            style={{ fontSize: '11px', letterSpacing: '0.32em' }}
          >
            {c.eyebrow}
          </span>
          <h1
            className="mt-4 font-display text-ivory"
            style={{
              fontSize: 'clamp(36px, 5vw, 72px)',
              lineHeight: 1.05,
              fontWeight: 400,
            }}
          >
            {c.title}
          </h1>
          <p
            className="mt-3 font-nav text-ivory/55"
            style={{ fontSize: '13px', letterSpacing: '0.06em' }}
          >
            {c.effective}
          </p>
          <p
            className="mt-8 font-nav font-light text-ivory/85"
            style={{ fontSize: 'clamp(15px, 1.05vw, 17px)', lineHeight: 1.85 }}
          >
            {c.intro}
          </p>

          {c.sections.map((s, i) => (
            <section key={i} className="mt-12">
              <h2
                className="font-display italic text-ivory"
                style={{
                  fontSize: 'clamp(22px, 2.4vw, 32px)',
                  lineHeight: 1.15,
                  fontWeight: 500,
                }}
              >
                {s.heading}
              </h2>
              <div className="mt-4 space-y-4">
                {s.body.map((p, j) => (
                  <p
                    key={j}
                    className="font-nav font-light text-ivory/82"
                    style={{ fontSize: 'clamp(15px, 1.05vw, 17px)', lineHeight: 1.85 }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </article>
      </main>
      <Footer locale={locale} />
    </>
  );
}
