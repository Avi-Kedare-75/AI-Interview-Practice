"use client";

import { motion } from "motion/react";
import { faqItems } from "@/data/mock";

export default function FAQSection() {
  return (
    <section id="faq" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold font-heading sm:text-4xl">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything you need to know about the platform and how it works.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          {faqItems.map((item) => (
            <details key={item.id} className="group border border-border rounded-lg bg-card/50 overflow-hidden">
              <summary className="flex cursor-pointer items-center justify-between px-6 py-4 font-medium text-foreground hover:text-primary transition-colors">
                {item.question}
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">
                  ▼
                </span>
              </summary>
              <div className="px-6 pb-4 pt-0 text-muted-foreground">
                {item.answer}
              </div>
            </details>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
