'use client';
import { useState } from 'react';
import PromoBar from '@/components/PromoBar';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const CONTENT = {
  en: {
    eyebrow: 'Legal',
    title: 'Shining Brows Expert — Privacy Policy',
    effective: 'Effective date: 29 June 2026',
    intro:
      'This Privacy Policy explains how Shining Brows Academy ("we", "us") handles personal data collected through the Shining Brows Expert mobile application (the "App"). It is provided alongside our KVKK Information Notice, which sets out additional rights for users in Türkiye.',
    sections: [
      {
        heading: '1. Who We Are',
        body: [
          'The App is operated by Güzide Korkmaz, trading as Shining Brows Academy. For any privacy-related questions or requests, you can contact us at contact@shiningbrowsacademy.com.',
        ],
      },
      {
        heading: '2. Data We Collect',
        body: [
          'Account information: first name, last name, email address, phone number. Collected when you sign up or update your profile.',
          'User-uploaded photos: profile photo and portfolio images you choose to upload to the App.',
          'We do not collect precise location, payment information, contacts, microphone, calendar or browsing history.',
        ],
      },
      {
        heading: '3. How We Use Your Data',
        body: [
          'To create and secure your expert account and authenticate you when you sign in.',
          'To display your profile and portfolio to other users of the App and on the Shining Brows expert map at shiningbrowsacademy.com/experts.',
          'To respond to support requests and notify you about important changes to the service.',
          'To meet legal obligations and to protect the App against fraud and abuse.',
        ],
      },
      {
        heading: '4. Service Providers',
        body: [
          'We rely on the following processors to operate the App. They process personal data only on our behalf and under contractual data-protection obligations:',
          '• Clerk, Inc. (United States) — user authentication and account management. Receives your name, email, phone and password hash.',
          '• Render Services, Inc. (United States) — hosts the App backend. Processes data in transit and at rest.',
          '• Supabase, Inc. (United States / European Union) — database and file storage. Stores profile fields and the photos you upload.',
          'Each of these providers is located outside Türkiye. By using the App, you understand that your personal data will be transferred to and processed in these jurisdictions.',
        ],
      },
      {
        heading: '5. Sharing & Disclosure',
        body: [
          'We do not sell your personal data. We do not share your personal data with advertisers.',
          'We may disclose personal data if required to do so by law, a court order, or a binding request from a public authority, or to protect the rights, property or safety of Shining Brows Academy, our users, or others.',
        ],
      },
      {
        heading: '6. Data Retention',
        body: [
          'We retain your personal data for as long as your account is active. If you delete your account, we delete or anonymize your data within a reasonable period, except where we are required to keep certain information by applicable law.',
        ],
      },
      {
        heading: '7. Your Rights',
        body: [
          'Depending on where you live, you have the right to access, correct, delete or export your personal data, and to withdraw consent you have given. To exercise these rights, write to contact@shiningbrowsacademy.com from the email address associated with your account.',
          'Users in Türkiye have additional rights under KVKK Article 11 — see our KVKK Information Notice at shiningbrowsacademy.com/kvkk.',
        ],
      },
      {
        heading: '8. Children',
        body: [
          'The App is not intended for children under 16, and we do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us so we can delete it.',
        ],
      },
      {
        heading: '9. Security',
        body: [
          'We rely on industry-standard measures including TLS encryption in transit, encrypted storage at rest at our providers, and access controls limited to authorized personnel. No system can be guaranteed 100% secure, but we work to protect your data appropriately to its sensitivity.',
        ],
      },
      {
        heading: '10. Changes to This Policy',
        body: [
          'We may update this Privacy Policy from time to time. When we do, we will update the effective date at the top of this page and, where appropriate, notify you within the App.',
        ],
      },
      {
        heading: '11. Contact',
        body: [
          'For any questions about this Privacy Policy or how we handle your personal data, contact us at contact@shiningbrowsacademy.com.',
        ],
      },
    ],
  },
  tr: {
    eyebrow: 'Yasal',
    title: 'Shining Brows Expert — Gizlilik Politikası',
    effective: 'Yürürlük tarihi: 29 Haziran 2026',
    intro:
      'Bu Gizlilik Politikası, Shining Brows Academy ("biz") tarafından Shining Brows Expert mobil uygulaması ("Uygulama") üzerinden toplanan kişisel verilerin nasıl işlendiğini açıklar. Bu metin, Türkiye\'deki kullanıcılar için ek haklar tanıyan KVKK Aydınlatma Metni ile birlikte sunulmaktadır.',
    sections: [
      {
        heading: '1. Kim Olduğumuz',
        body: [
          'Uygulama, Shining Brows Academy adı altında faaliyet gösteren Güzide Korkmaz tarafından işletilmektedir. Gizlilikle ilgili her türlü soru ve talebiniz için contact@shiningbrowsacademy.com adresinden bize ulaşabilirsiniz.',
        ],
      },
      {
        heading: '2. Topladığımız Veriler',
        body: [
          'Hesap bilgileri: ad, soyad, e-posta adresi ve telefon numarası. Kayıt olurken veya profilinizi güncellerken alınır.',
          'Yüklenen fotoğraflar: profil fotoğrafınız ve Uygulamaya yüklemeyi tercih ettiğiniz portföy görselleri.',
          'Hassas konum, ödeme bilgisi, rehber, mikrofon, takvim veya tarayıcı geçmişi gibi verileri toplamıyoruz.',
        ],
      },
      {
        heading: '3. Verilerinizi Nasıl Kullanıyoruz',
        body: [
          'Uzman hesabınızı oluşturmak, güvenli hâle getirmek ve oturum açtığınızda kimliğinizi doğrulamak için.',
          'Profilinizi ve portföyünüzü Uygulamadaki diğer kullanıcılara ve shiningbrowsacademy.com/experts üzerindeki uzman haritasında görüntülemek için.',
          'Destek taleplerinize yanıt vermek ve hizmette önemli değişiklikler olduğunda sizi bilgilendirmek için.',
          'Yasal yükümlülükleri yerine getirmek ve Uygulamayı kötüye kullanım ile dolandırıcılığa karşı korumak için.',
        ],
      },
      {
        heading: '4. Hizmet Sağlayıcılar',
        body: [
          'Uygulamanın çalışması için aşağıdaki veri işleyenlerden yararlanıyoruz. Bunlar kişisel verileri yalnızca bizim adımıza ve sözleşmesel veri koruma yükümlülükleri altında işler:',
          '• Clerk, Inc. (Amerika Birleşik Devletleri) — kullanıcı kimlik doğrulama ve hesap yönetimi. Ad, e-posta, telefon ve şifre özeti (hash) alır.',
          '• Render Services, Inc. (Amerika Birleşik Devletleri) — Uygulama sunucularının barındırılması. Veriyi aktarımda ve depolanırken işler.',
          '• Supabase, Inc. (Amerika Birleşik Devletleri / Avrupa Birliği) — veritabanı ve dosya depolama. Profil alanlarını ve yüklediğiniz fotoğrafları saklar.',
          'Bu sağlayıcıların hepsi Türkiye dışında bulunmaktadır. Uygulamayı kullanarak kişisel verilerinizin bu ülkelere aktarılacağını ve burada işleneceğini kabul etmiş olursunuz.',
        ],
      },
      {
        heading: '5. Paylaşım',
        body: [
          'Kişisel verilerinizi satmıyoruz ve reklam verenlerle paylaşmıyoruz.',
          'Yasanın, mahkeme kararının veya bir kamu otoritesinin bağlayıcı talebinin gerektirdiği hâllerde; Shining Brows Academy\'nin, kullanıcılarımızın ya da üçüncü kişilerin hak, mülkiyet veya güvenliğini korumak amacıyla kişisel verileri açıklayabiliriz.',
        ],
      },
      {
        heading: '6. Saklama',
        body: [
          'Kişisel verileriniz, hesabınız aktif olduğu sürece saklanır. Hesabınızı silmeniz hâlinde verileriniz, yürürlükteki mevzuatın zorunlu kıldığı saklama süreleri saklı kalmak üzere makul süre içinde silinir veya anonim hâle getirilir.',
        ],
      },
      {
        heading: '7. Haklarınız',
        body: [
          'Bulunduğunuz ülkeye göre kişisel verilerinize erişme, düzeltme, silme veya taşıma ve daha önce verdiğiniz açık rızayı geri çekme haklarına sahip olabilirsiniz. Bu haklarınızı kullanmak için hesabınızla ilişkili e-posta adresinden contact@shiningbrowsacademy.com adresine yazabilirsiniz.',
          'Türkiye\'deki kullanıcılar KVKK m.11 kapsamında ek haklara sahiptir — ayrıntılar için shiningbrowsacademy.com/kvkk adresindeki KVKK Aydınlatma Metnine bakınız.',
        ],
      },
      {
        heading: '8. Çocuklar',
        body: [
          'Uygulama 16 yaş altı çocuklara yönelik değildir ve bilerek çocuklardan kişisel veri toplamayız. Bir çocuğun bize kişisel veri sağladığını düşünüyorsanız lütfen bizimle iletişime geçin; veriyi silelim.',
        ],
      },
      {
        heading: '9. Güvenlik',
        body: [
          'Aktarım sırasında TLS şifreleme, sağlayıcılarımızda dinlenme hâlinde şifreli depolama ve yetkili personelle sınırlı erişim kontrolleri dâhil sektör standardı önlemlere güveniyoruz. Hiçbir sistem %100 güvenli garanti edilemez; ancak verilerinizin hassasiyetiyle orantılı koruma sağlamak için çalışıyoruz.',
        ],
      },
      {
        heading: '10. Politikadaki Değişiklikler',
        body: [
          'Bu Gizlilik Politikasını zaman zaman güncelleyebiliriz. Güncelleme yaptığımızda bu sayfanın üst kısmındaki yürürlük tarihini değiştirir ve uygun olduğunda Uygulama içinden sizi bilgilendiririz.',
        ],
      },
      {
        heading: '11. İletişim',
        body: [
          'Bu Gizlilik Politikası veya kişisel verilerinizin nasıl işlendiği hakkındaki sorularınız için contact@shiningbrowsacademy.com adresinden bize ulaşabilirsiniz.',
        ],
      },
    ],
  },
};

export default function ExpertPortalPrivacyPolicyPage() {
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
              fontSize: 'clamp(34px, 4.6vw, 64px)',
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
