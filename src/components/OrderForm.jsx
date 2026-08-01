import { useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

const CONTACT_EMAIL = "sulyssweets24@gmail.com";

const inputClass =
  "w-full rounded-xl border border-mauve/30 bg-white/70 px-4 py-2.5 text-sm text-plum placeholder:text-plum/40 outline-none transition-colors focus:border-mauve-dark focus:bg-white";
const labelClass = "mb-1.5 block text-xs font-medium tracking-wide text-mauve-dark uppercase";

export default function OrderForm() {
  const { t } = useLanguage();
  const { orderForm } = t;

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    orderTypeIndex: 0,
    details: "",
  });
  const [sent, setSent] = useState(false);

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const orderType = orderForm.orderTypes[values.orderTypeIndex];
    const subject = orderForm.email.subject(orderType, values.name);
    const divider = "─".repeat(32);

    const formattedDate = values.eventDate
      ? new Date(`${values.eventDate}T00:00:00`).toLocaleDateString(orderForm.email.dateLocale, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

    const bodyLines = [
      orderForm.email.heading,
      divider,
      "",
      `${orderForm.email.name}        ${values.name}`,
      `${orderForm.email.email}       ${values.email}`,
      values.phone && `${orderForm.email.phone}       ${values.phone}`,
      formattedDate && `${orderForm.email.eventDate}  ${formattedDate}`,
      `${orderForm.email.orderType}  ${orderType}`,
      "",
      divider,
      orderForm.email.details,
      "",
      values.details,
      "",
      divider,
    ].filter((line) => line !== false);

    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
    window.location.href = mailto;
    setSent(true);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-10 max-w-xl rounded-3xl border border-mauve/30 bg-gradient-to-br from-ivory to-[#ecdcc0] px-6 py-7 text-left shadow-[0_1px_1px_rgba(61,43,57,0.08),0_10px_18px_-8px_rgba(61,43,57,0.18),0_20px_32px_-16px_rgba(61,43,57,0.25),inset_0_1px_0_rgba(255,255,255,0.7)] sm:px-8"
    >
      <p className="text-center text-xs font-medium tracking-[0.3em] text-mauve-dark uppercase">
        {orderForm.eyebrow}
      </p>
      <h3 className="mt-2 text-center font-display text-2xl text-plum">{orderForm.title}</h3>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="name">
            {orderForm.nameLabel}
          </label>
          <input
            id="name"
            type="text"
            required
            value={values.name}
            onChange={handleChange("name")}
            className={inputClass}
            placeholder={orderForm.namePlaceholder}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="email">
            {orderForm.emailLabel}
          </label>
          <input
            id="email"
            type="email"
            required
            value={values.email}
            onChange={handleChange("email")}
            className={inputClass}
            placeholder={orderForm.emailPlaceholder}
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="phone">
            {orderForm.phoneLabel} <span className="normal-case text-plum/40">{orderForm.optional}</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={values.phone}
            onChange={handleChange("phone")}
            className={inputClass}
            placeholder={orderForm.phonePlaceholder}
          />
        </div>

        <div className="min-w-0">
          <label className={labelClass} htmlFor="eventDate">
            {orderForm.eventDateLabel} <span className="normal-case text-plum/40">{orderForm.optional}</span>
          </label>
          <input
            id="eventDate"
            type="date"
            value={values.eventDate}
            onChange={handleChange("eventDate")}
            className={`${inputClass} min-w-0 max-w-full appearance-none`}
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="orderType">
            {orderForm.interestLabel}
          </label>
          <select
            id="orderType"
            value={values.orderTypeIndex}
            onChange={(e) => setValues((v) => ({ ...v, orderTypeIndex: Number(e.target.value) }))}
            className={inputClass}
          >
            {orderForm.orderTypes.map((type, i) => (
              <option key={type} value={i}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="details">
            {orderForm.detailsLabel}
          </label>
          <textarea
            id="details"
            required
            rows={4}
            value={values.details}
            onChange={handleChange("details")}
            className={`${inputClass} resize-none`}
            placeholder={orderForm.detailsPlaceholder}
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-plum px-9 py-3.5 text-sm tracking-wide text-cream uppercase transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg"
      >
        {orderForm.submit}
      </button>

      <p className="mt-3 text-center text-xs text-plum/60">
        {sent ? orderForm.noteAfterSend : orderForm.noteBeforeSend}
      </p>
    </form>
  );
}
