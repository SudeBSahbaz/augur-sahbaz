import Header from "@/components/Header";
import { Link } from "@/i18n/navigation";
import { setRequestLocale } from "next-intl/server";

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);

  const isTurkish = locale === "tr";

  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      <Header />

      <section className="px-5 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="text-sm font-bold text-[#B28A42] transition hover:text-[#0B2748]"
          >
            ← {isTurkish ? "ANA SAYFAYA DÖN" : "BACK TO HOME"}
          </Link>

          <div className="mt-8 border border-slate-200 bg-white p-6 sm:p-10">
            <p className="text-sm font-bold tracking-[0.18em] text-[#B28A42]">
              {isTurkish ? "KİŞİSEL VERİLER" : "PERSONAL DATA"}
            </p>

            <h1 className="mt-4 text-3xl font-bold leading-tight text-[#0B2748] sm:text-4xl">
              {isTurkish
                ? "KVKK Aydınlatma Metni"
                : "Privacy Notice"}
            </h1>

            <div className="mt-8 space-y-8 text-base leading-7 text-slate-600">
              {isTurkish ? (
                <>
                  <section>
                    <h2 className="text-xl font-bold text-[#0B2748]">
                      1. Veri Sorumlusu
                    </h2>

                    <p className="mt-3">
                      Bu internet sitesi üzerinden işlenen kişisel veriler
                      bakımından veri sorumlusu A. Uğur Şahbaz&apos;dır.
                      Kişisel verilerinizle ilgili sorularınız için
                      ugursahbaz05@yahoo.com adresinden iletişime
                      geçebilirsiniz.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-[#0B2748]">
                      2. İşlenen Kişisel Veriler
                    </h2>

                    <p className="mt-3">
                      İletişim formunu kullanmanız halinde ad-soyad,
                      e-posta adresi, isteğe bağlı olarak firma bilgisi ve
                      mesajınız kapsamında tarafınızca paylaşılan bilgiler
                      işlenmektedir.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-[#0B2748]">
                      3. Kişisel Verilerin İşlenme Amaçları
                    </h2>

                    <p className="mt-3">
                      Kişisel verileriniz; iletişim talebinizin alınması,
                      tarafınıza dönüş yapılması, olası danışmanlık ve iş
                      birliği görüşmelerinin yürütülmesi ve internet sitesi
                      üzerinden iletilen taleplerin yönetilmesi amaçlarıyla
                      kullanılmaktadır.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-[#0B2748]">
                      4. Verilerin Toplanma Yöntemi
                    </h2>

                    <p className="mt-3">
                      Kişisel verileriniz, bu internet sitesindeki iletişim
                      formuna bilgilerinizi girmeniz ve formu göndermeniz
                      yoluyla elektronik ortamda elde edilmektedir.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-[#0B2748]">
                      5. Hizmet Sağlayıcılar
                    </h2>

                    <p className="mt-3">
                      İletişim formundan gönderilen mesajların e-posta olarak
                      iletilebilmesi için teknik e-posta hizmet sağlayıcıları
                      kullanılabilir. Bu sağlayıcılar yalnızca hizmetin
                      sunulması için gerekli ölçüde verileri işleyebilir.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-[#0B2748]">
                      6. Haklarınız
                    </h2>

                    <p className="mt-3">
                      6698 sayılı Kişisel Verilerin Korunması Kanunu
                      kapsamında kişisel verilerinizin işlenip işlenmediğini
                      öğrenme, işlenmişse buna ilişkin bilgi talep etme,
                      düzeltilmesini veya şartları oluştuğunda silinmesini
                      isteme ve Kanun kapsamında sahip olduğunuz diğer
                      haklara ilişkin taleplerinizi
                      ugursahbaz05@yahoo.com adresine iletebilirsiniz.
                    </p>
                  </section>
                </>
              ) : (
                <>
                  <section>
                    <h2 className="text-xl font-bold text-[#0B2748]">
                      1. Data Controller
                    </h2>

                    <p className="mt-3">
                      A. Uğur Şahbaz is the data controller for personal
                      information processed through this website. You may
                      contact ugursahbaz05@yahoo.com regarding your personal
                      data.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-[#0B2748]">
                      2. Personal Data We Process
                    </h2>

                    <p className="mt-3">
                      When you use the contact form, we may process your full
                      name, email address, optional company information and
                      any personal information you choose to include in your
                      message.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-[#0B2748]">
                      3. Why We Process Your Data
                    </h2>

                    <p className="mt-3">
                      Your information is used to receive and respond to your
                      enquiry, conduct potential consultancy or business
                      discussions and manage requests submitted through the
                      website.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-[#0B2748]">
                      4. How We Collect Your Data
                    </h2>

                    <p className="mt-3">
                      Personal data is collected electronically when you enter
                      information into the contact form and submit it through
                      this website.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-[#0B2748]">
                      5. Service Providers
                    </h2>

                    <p className="mt-3">
                      Technical email service providers may be used to deliver
                      messages submitted through the contact form. Such
                      providers may process information only to the extent
                      necessary to provide the relevant service.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-xl font-bold text-[#0B2748]">
                      6. Your Rights
                    </h2>

                    <p className="mt-3">
                      You may contact ugursahbaz05@yahoo.com to request
                      information about personal data processed through this
                      website and to exercise applicable rights concerning
                      access, correction or deletion of your personal data.
                    </p>
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}