import { useState } from "react";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";
import Input from "../../components/Common/Input";
import Button from "../../components/Common/Button";
import Card from "../../components/Common/Card";

const contactInfo = [
  { icon: HiMail, label: "Email", value: "support@runcrew.com" },
  { icon: HiPhone, label: "Phone", value: "+91 98765 43210" },
  { icon: HiLocationMarker, label: "Office", value: "Bandra Kurla Complex, Mumbai, Maharashtra 400051" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="participant-page">
        <div className="participant-page-header">
          <p className="section-label">Get in touch</p>
          <h1>We’re here to help.</h1>
          <p>Have a question about an event or your registration? Send us a message.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          <div className="space-y-5">
            {contactInfo.map(({ icon: Icon, label, value }) => (
              <Card key={label} className="rounded-2xl">
                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 flex items-center justify-center bg-brand/10 text-brand shrink-0"
                    style={{ clipPath: "polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)" }}>
                    <Icon className="text-lg" />
                  </span>
                  <div>
                    <h3 className="text-white font-semibold text-sm uppercase tracking-wider">{label}</h3>
                    <p className="text-gray-400 text-sm mt-1">{value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {sent ? (
            <Card className="panel--lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-green-400 text-xl font-display mb-2">Message Sent!</p>
                <p className="text-gray-400 text-sm">We&apos;ll get back to you within 24 hours.</p>
              </div>
            </Card>
          ) : (
            <Card className="panel--lg">
              <form onSubmit={handleSubmit}>
                <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <Input label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
                <div className="form-field mb-4">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-textarea h-32"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" variant="primary" size="lg" className="w-full justify-center" showArrow={false}>
                  Send Message
                </Button>
              </form>
            </Card>
          )}
        </div>
    </div>
  );
}
