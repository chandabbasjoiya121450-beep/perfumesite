"use client";

import React, { useState } from "react";
import { StoreLayout } from "@/components/layout/StoreLayout";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Surface } from "@/components/ui/Surface";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
  };

  return (
    <StoreLayout>
      <div className="py-16 sm:py-24">
        <Container size="narrow">
          <SectionHeading
            eyebrow="Personal Concierge"
            title="Connect With Our Atelier"
            description="Our fragrance specialists are available for bespoke scent consultations, private appointments, and order assistance."
            align="center"
            className="mb-12"
          />

          <Surface variant="white" radius="card" className="p-8 sm:p-10 border border-soft-stone">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-champagne/15 text-champagne mx-auto flex items-center justify-center font-serif text-xl">
                  ✓
                </div>
                <h3 className="font-serif text-2xl text-charcoal">
                  Inquiry Dispatched
                </h3>
                <p className="text-xs sm:text-sm text-muted-taupe max-w-md mx-auto leading-relaxed">
                  Thank you, {name}. Your inquiry has been routed to our chief fragrance concierge. A specialist will respond to <span className="text-charcoal font-medium">{email}</span> within one business day.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage("");
                  }}
                  className="mt-4 text-xs uppercase tracking-wider text-charcoal underline hover:text-champagne transition-colors"
                >
                  Send another inquiry &rarr;
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Your Name"
                    placeholder="Alexander Wright"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Input
                    label="Email Address"
                    placeholder="alexander@example.com"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Input
                  label="Subject"
                  placeholder="Bespoke Consultation / Scent Inquiry"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
                <div>
                  <label className="block text-xs uppercase font-medium tracking-wider text-muted-taupe mb-2">
                    Inquiry Details
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How may our fragrance concierge assist you today?"
                    className="w-full p-4 text-sm bg-pure-white text-charcoal rounded-input border border-soft-stone focus:border-charcoal focus:ring-1 focus:ring-champagne focus:outline-none"
                  />
                </div>
                <div className="pt-2">
                  <Button variant="primary" size="md" pill className="w-full sm:w-auto px-8">
                    Submit Inquiry
                  </Button>
                </div>
              </form>
            )}
          </Surface>

          {/* Concierge Details & Atelier Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 text-center text-xs text-muted-taupe">
            <div className="p-4 bg-pure-white/50 border border-soft-stone rounded-card">
              <span className="text-[10px] uppercase tracking-widest text-champagne font-semibold block mb-1">
                Atelier Location
              </span>
              <p className="text-charcoal font-medium">Place Vendôme</p>
              <p>75001 Paris, France</p>
            </div>
            <div className="p-4 bg-pure-white/50 border border-soft-stone rounded-card">
              <span className="text-[10px] uppercase tracking-widest text-champagne font-semibold block mb-1">
                Concierge Line
              </span>
              <p className="text-charcoal font-medium">+1 (800) 835-6731</p>
              <p>Mon–Fri, 9am–7pm CET</p>
            </div>
            <div className="p-4 bg-pure-white/50 border border-soft-stone rounded-card">
              <span className="text-[10px] uppercase tracking-widest text-champagne font-semibold block mb-1">
                Direct Correspondence
              </span>
              <p className="text-charcoal font-medium">concierge@velore.com</p>
              <p>24h Guaranteed Reply</p>
            </div>
          </div>
        </Container>
      </div>
    </StoreLayout>
  );
}
