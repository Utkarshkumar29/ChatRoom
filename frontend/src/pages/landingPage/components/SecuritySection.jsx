import React from 'react';


const SecuritySection = () => {
  const certifications = [
  {
    name: "SOC 2 Type II",
    icon: "Shield",
    description: "Independently audited security controls",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1a8098a6b-1764655584180.png",
    imageAlt: "SOC 2 Type II certification badge showing shield with checkmark for security compliance"
  },
  {
    name: "GDPR Compliant",
    icon: "Globe",
    description: "European data protection standards",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ac71e81a-1764661555606.png",
    imageAlt: "GDPR compliance badge with European Union stars and data protection symbol"
  },
  {
    name: "ISO 27001",
    icon: "Award",
    description: "Information security management",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_16de233b7-1764661555596.png",
    imageAlt: "ISO 27001 certification badge showing international standards organization seal"
  },
  {
    name: "HIPAA Ready",
    icon: "FileCheck",
    description: "Healthcare data protection",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_156d04b04-1764671100544.png",
    imageAlt: "HIPAA compliance badge with medical cross and security shield for healthcare data"
  }];


  const securityFeatures = [
  {
    icon: <i class="fa-regular fa-lock"></i>,
    title: "End-to-End Encryption",
    description: "All messages and files encrypted with AES-256 in transit and at rest"
  },
  {
    icon: <i class="fa-regular fa-key"></i>,
    title: "Two-Factor Authentication",
    description: "Additional security layer with TOTP, SMS, or hardware keys"
  },
  {
    icon: <i class="fa-regular fa-user-check"></i>,
    title: "Role-Based Access",
    description: "Granular permissions control who can see and do what"
  },
  {
    icon: <i class="fa-regular fa-chart-line"></i>,
    title: "Audit Logs",
    description: "Complete activity tracking for compliance and security monitoring"
  },
  {
    icon: <i class="fa-regular fa-database"></i>,
    title: "Data Residency",
    description: "Choose where your data is stored to meet regional requirements"
  },
  {
    icon: <i class="fa-regular fa-arrows-rotate"></i>,
    title: "Automatic Backups",
    description: "Daily encrypted backups with point-in-time recovery"
  }];


  const trustMetrics = [
  { value: "99.9%", label: "Uptime SLA" },
  { value: "24/7", label: "Security Monitoring" },
  { value: "< 1 min", label: "Incident Response" },
  { value: "Zero", label: "Data Breaches" }];


  return (
    <section id="security" className="py-12 md:py-16 lg:py-24 bg-[#FAFBFC] ">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
            Enterprise-Grade Security & Compliance
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Your data security is our top priority. ChatFlow Pro meets the highest industry standards.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12 lg:mb-16">
          {certifications?.map((cert, index) =>
          <div key={index} className="bg-card rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-full overflow-hidden">
                <img
                src={cert?.image}
                alt={cert?.imageAlt}
                className="w-full h-full object-cover" />

              </div>
              <h3 className="text-base md:text-lg font-bold text-foreground mb-2">{cert?.name}</h3>
              <p className="text-sm md:text-base text-muted-foreground">{cert?.description}</p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12 lg:mb-16">
          {securityFeatures?.map((feature, index) =>
          <div key={index} className="bg-card rounded-xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  {feature?.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
                    {feature?.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    {feature?.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12 lg:mb-16">
          {trustMetrics?.map((metric, index) =>
          <div key={index} className="bg-card rounded-xl p-4 md:p-6 text-center shadow-lg">
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">
                {metric?.value}
              </p>
              <p className="text-sm md:text-base text-muted-foreground">{metric?.label}</p>
            </div>
          )}
        </div>

        <div className="bg-[#F7FAFC] rounded-2xl p-6 md:p-8 lg:p-10">
          <div className="grid lg:grid-cols-2 gap-6 md:gap-8 items-center">
            <div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground mb-4 md:mb-6">
                Trusted by Security-Conscious Organizations
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6">
                From healthcare to finance, organizations with the strictest security requirements trust ChatFlow Pro to protect their sensitive communications.
              </p>
              <div className="space-y-3 md:space-y-4">
                {[
                "Regular third-party security audits",
                "Penetration testing and vulnerability assessments",
                "24/7 security operations center monitoring",
                "Incident response team on standby",
                "Compliance with industry-specific regulations"]?.
                map((item, index) =>
                <div key={index} className="flex items-center gap-3">
                    <i class="fa-regular fa-circle-check text-[#38A169] "></i>
                    <span className="text-sm md:text-base text-foreground">{item}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-card rounded-xl p-6 md:p-8 shadow-xl">
              <h4 className="text-lg md:text-xl font-bold text-foreground mb-4">
                Security Documentation
              </h4>
              <div className="space-y-3">
                {[
                { name: "Security Whitepaper", icon: <i class="fa-solid fa-file-lines"></i> },
                { name: "Compliance Certifications", icon: <i class="fa-solid fa-award"></i> },
                { name: "Privacy Policy", icon: <i class="fa-solid fa-shield"></i> },
                { name: "Data Processing Agreement", icon: <i class="fa-solid fa-file-circle-check"></i> }]?.
                map((doc, index) =>
                <button
                  key={index}
                  className="w-full flex items-center justify-between p-3 md:p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors">

                    <div className="flex items-center gap-3">
                      {doc?.icon}
                      <span className="text-sm md:text-base text-foreground">{doc?.name}</span>
                    </div>
                    <i class="fa-solid fa-download"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default SecuritySection;