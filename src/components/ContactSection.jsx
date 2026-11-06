import { CalendarClock, Check, Mail, Phone } from "lucide-react";
import Reveal from "./Reveal";
import OrderForm from "./OrderForm";
import SectionHeading from "./SectionHeading";
import { InstagramIcon } from "./icons";
import { useLanguage } from "../i18n/LanguageContext";

const CONTACT_EMAIL = "sulyssweets24@gmail.com";
const PHONE_DISPLAY = "347-859-5181";
const PHONE_HREF = "tel:+13478595181";

export default function ContactSection() {
  const { t } = useLanguage();

  const channels = [
    { icon: Mail, label: t.contact.emailLabel, value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
    { icon: Phone, label: t.contact.phoneLabel, value: PHONE_DISPLAY, href: PHONE_HREF },
    {
      icon: InstagramIcon,
      label: "Instagram",
      value: "@sulys_sweets",
      href: "https://www.instagram.com/sulys_sweets",
      external: true,
    },
  ];

  return (
    <section id="contact" className="bg-cream/85 px-5 py-24 backdrop-blur-md sm:px-8 sm:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SectionHeading eyebrow={t.contact.eyebrow} title={t.contact.title} align="left">
            {t.contact.paragraph}
          </SectionHeading>

          <Reveal delay={250} className="mt-10">
            <p className="text-center text-[11px] font-medium tracking-[0.3em] text-mauve-dark uppercase lg:text-left">
              {t.contact.reachUs}
            </p>
            <ul className="mt-4 space-y-3">
              {channels.map(({ icon: Icon, label, value, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-4 rounded-2xl border border-mauve/20 bg-ivory/60 px-4 py-3 transition-all duration-300 hover:border-mauve/50 hover:bg-ivory"
                  >
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-plum text-cream transition-transform duration-300 group-hover:scale-105">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[11px] tracking-wide text-plum/55 uppercase">{label}</span>
                      <span className="block truncate text-sm text-plum">{value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={350} className="mt-8 rounded-[1.75rem] bg-plum p-6 text-cream">
            <p className="text-[11px] font-medium tracking-[0.3em] text-mauve uppercase">{t.contact.orderInfoTitle}</p>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/85">
              {t.contact.orderInfo.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-mauve" aria-hidden="true" />
                  {item}
                </li>
              ))}
              <li className="flex items-start gap-2.5">
                <CalendarClock className="mt-0.5 h-4 w-4 flex-shrink-0 text-mauve" aria-hidden="true" />
                {t.contact.leadTime}
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <OrderForm />
        </Reveal>
      </div>
    </section>
  );
}
