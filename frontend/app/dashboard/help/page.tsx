"use client";

import { useState } from "react";
import { PageShell, SectionHeader, FadeIn } from "@/src/components/dashboard/PageShell";
import { ChevronDown, HelpCircle, Mail, MessageSquare } from "lucide-react";

const faqs = [
  {
    question: "How do I create a study plan?",
    answer:
      "Navigate to Study Planner from the dashboard and click 'Create Plan'. Fill in the subject, topic, deadline, and initial progress. You can update or delete plans anytime.",
  },
  {
    question: "Can I track multiple goals at once?",
    answer:
      "Yes. The Goals page lets you create daily, weekly, monthly, or custom goals. Use the +1 and -1 buttons to update your progress as you go.",
  },
  {
    question: "How does the Pomodoro timer work?",
    answer:
      "The default focus session is 25 minutes. After a focus session completes, you'll automatically get a short break (5 minutes). You can switch modes manually using the buttons above the timer.",
  },
  {
    question: "Where can I see my notifications?",
    answer:
      "Visit the Notifications page to see all your updates. You can mark individual notifications as read or use 'Mark all read' to clear them all at once.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We use cookie-based session authentication and encrypted API calls. Your data is stored securely and never shared with third parties.",
  },
];

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSent, setContactSent] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    setContactForm({ name: "", email: "", message: "" });
    setTimeout(() => setContactSent(false), 4000);
  };

  return (
    <PageShell>
      <FadeIn>
        <SectionHeader label="Support" title="Help & Support" />
      </FadeIn>

      <FadeIn delay={0.05}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
           <div className="glass-card card-shadow rounded-3xl border border-slate-800/70 p-8">
             <div className="mb-4 flex items-center gap-2 text-indigo-300">
               <HelpCircle className="h-5 w-5" />
               <h3 className="text-lg font-semibold text-slate-100">Frequently Asked Questions</h3>
             </div>
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-800/70 bg-slate-900/40"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between p-4 text-left"
                  >
                     <span className="text-base font-medium text-slate-200">{faq.question}</span>
                    <ChevronDown
                      className={`h-4 w-4 flex-shrink-0 text-slate-400 transition-transform ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openIndex === index && (
                    <div className="border-t border-slate-800/70 px-4 pb-4 pt-3">
                       <p className="text-base leading-relaxed text-slate-400">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

           <div className="glass-card card-shadow rounded-3xl border border-slate-800/70 p-8">
             <div className="mb-4 flex items-center gap-2 text-indigo-300">
               <MessageSquare className="h-5 w-5" />
               <h3 className="text-lg font-semibold text-slate-100">Contact Support</h3>
             </div>

            {contactSent ? (
               <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-base text-emerald-200">
                Thanks for reaching out! We&apos;ll get back to you shortly.
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                   <label className="mb-2 block text-base font-medium text-slate-300">Name</label>
                   <input
                     value={contactForm.name}
                     onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                     className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500"
                     required
                   />
                </div>
                <div>
                   <label className="mb-2 block text-base font-medium text-slate-300">Email</label>
                   <input
                     type="email"
                     value={contactForm.email}
                     onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                     className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500"
                     required
                   />
                </div>
                <div>
                   <label className="mb-2 block text-base font-medium text-slate-300">Message</label>
                   <textarea
                     rows={5}
                     value={contactForm.message}
                     onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                     className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-base text-slate-100 outline-none focus:border-indigo-500"
                     required
                   />
                </div>
               <button
                 type="submit"
                 className="flex items-center gap-2 rounded-xl gradient-primary px-5 py-2.5 text-base font-semibold text-white shadow-lg shadow-indigo-900/40 transition-opacity hover:opacity-90"
               >
                  <Mail className="h-4 w-4" />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </FadeIn>
    </PageShell>
  );
}
