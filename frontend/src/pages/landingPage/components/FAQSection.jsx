import React, { useState } from 'react';



const FAQSection = () => {
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How secure is ChatFlow Pro?",
      answer: "ChatFlow Pro is built with enterprise-grade security. We're SOC 2 Type II certified, GDPR compliant, and ISO 27001 certified. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We offer role-based access control, two-factor authentication, and regular security audits. Your data is stored in geographically distributed data centers with automatic backups and 99.9% uptime SLA.",
      icon: <i class="fa-solid fa-shield"></i>,
      tags: ["Security", "Compliance"]
    },
    {
      id: 2,
      question: "Can we migrate from Slack or Microsoft Teams?",
      answer: "Yes! We provide comprehensive migration tools and dedicated support to help you transition smoothly. Our migration service includes: automated message history import, file transfer with preserved structure, user account mapping, and room/channel recreation. Most migrations complete within 24-48 hours with zero downtime. We also offer a parallel running period where you can use both platforms simultaneously.",
      icon: <i class="fa-solid fa-arrows-rotate"></i>,
      tags: ["Migration", "Integration"]
    },
    {
      id: 3,
      question: "What integrations are available?",
      answer: "ChatFlow Pro integrates with 100+ popular business tools including Google Workspace, Microsoft 365, Salesforce, Jira, GitHub, Trello, Asana, Zoom, and more. We offer a robust REST API and webhooks for custom integrations. Our Zapier integration enables connections to 3,000+ additional apps. Enterprise plans include custom integration development support.",
      icon: <i class="fa-solid fa-plug"></i>,
      tags: ["Integrations", "API"]
    },
    {
      id: 4,
      question: "How does pricing work for growing teams?",
      answer: "Our pricing scales with your team size and offers volume discounts. You only pay for active users, and you can add or remove members anytime with prorated billing. Annual plans save 20% compared to monthly billing. We offer a 14-day free trial with full feature access and no credit card required. Enterprise plans (500+ users) include custom pricing and dedicated account management.",
      icon: <i class="fa-solid fa-indian-rupee-sign"></i>,
      tags: ["Pricing", "Billing"]
    },
    {
      id: 5,
      question: "What kind of support do you provide?",
      answer: "All plans include email support with 24-hour response time. Professional and Enterprise plans get priority support with 4-hour response time, live chat, and phone support during business hours. Enterprise customers receive a dedicated account manager, quarterly business reviews, and 24/7 emergency support. We also provide comprehensive documentation, video tutorials, and a community forum.",
      icon: <i class="fa-regular fa-headphones"></i>,
      tags: ["Support", "Training"]
    },
    {
      id: 6,
      question: "Can we customize ChatFlow Pro for our needs?",
      answer: "Yes! ChatFlow Pro offers extensive customization options including: custom branding (logo, colors, domain), room templates for consistent structure, custom permission roles, automated workflows, and custom fields. Enterprise plans include white-labeling options, custom feature development, and dedicated infrastructure. Our API enables deep customization for specific business processes.",
      icon: <i class="fa-solid fa-gear"></i>,
      tags: ["Customization", "Enterprise"]
    },
    {
      id: 7,
      question: "How does file storage and retention work?",
      answer: "Each user gets 10GB of storage included in their plan, with unlimited retention by default. Files are automatically organized by room and searchable across your entire workspace. We support all common file types with automatic previews for images, PDFs, and documents. Version history tracks file changes. Enterprise plans offer custom storage limits and advanced retention policies for compliance requirements.",
      icon: <i class="fa-regular fa-hard-drive"></i>,
      tags: ["Storage", "Files"]
    },
    {
      id: 8,
      question: "Is there a mobile app?",
      answer: "Yes! ChatFlow Pro offers native iOS and Android apps with full feature parity to the web version. Mobile apps support push notifications, offline message access, file uploads from your device, and biometric authentication. Messages sync instantly across all devices. The mobile experience is optimized for on-the-go communication while maintaining the organized structure of your workspace.",
      icon: <i class="fa-solid fa-mobile-screen"></i>,
      tags: ["Mobile", "Apps"]
    }
  ];

  const toggleFAQ = (id) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <section id="faq" className="py-12 md:py-16 lg:py-24 bg-muted">
      <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground">
            Everything you need to know about ChatFlow Pro
          </p>
        </div>

        <div className="space-y-4">
          {faqs?.map((faq) => (
            <div
              key={faq?.id}
              className="bg-card rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl"
            >
              <button
                onClick={() => toggleFAQ(faq?.id)}
                className="w-full text-left p-4 md:p-6 flex items-start gap-4 hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  {faq?.icon} 
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-semibold text-foreground mb-2 pr-8">
                    {faq?.question}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {faq?.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <i className={`text-muted-foreground flex-shrink-0 transition-transform ${expandedFAQ === faq?.id ? 'fa-angle-up' : 'fa-angle-down'}`}></i>
                  
              </button>

              {expandedFAQ === faq?.id && (
                <div className="px-4 md:px-6 pb-4 md:pb-6 pl-16 md:pl-20">
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {faq?.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 md:mt-12 text-center">
          <p className="text-sm md:text-base text-muted-foreground mb-4">
            Still have questions?
          </p>
          <button className=' flex items-center gap-2 mx-auto px-[24px] py-[8px] rounded-lg border border-gray-300 hover:bg-[#FF6B47] hover:text-white transition-transform duration-300 ' variant="outline" size="lg" iconName="Mail" iconPosition="left">
            <i class="fa-regular fa-envelope"></i>
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;