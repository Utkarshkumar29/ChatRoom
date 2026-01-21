import React from 'react';



const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Security', href: '#security' },
      { label: 'Integrations', href: '#' },
      { label: 'API Documentation', href: '#' }],

    company: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Press Kit', href: '#' },
      { label: 'Contact', href: '#contact' }],

    resources: [
      { label: 'Help Center', href: '#' },
      { label: 'Community', href: '#' },
      { label: 'Tutorials', href: '#' },
      { label: 'Webinars', href: '#' },
      { label: 'Status', href: '#' }],

    legal: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'GDPR', href: '#' },
      { label: 'Compliance', href: '#' }]

  };

  const socialLinks = [
    { icon: <i class="fa-brands fa-x-twitter"></i>, href: '#', label: 'Twitter' },
    { icon: <i class="fa-brands fa-linkedin"></i>, href: '#', label: 'LinkedIn' },
    { icon: <i class="fa-brands fa-facebook"></i>, href: '#', label: 'Facebook' },
    { icon: <i class="fa-brands fa-instagram"></i>, href: '#', label: 'Instagram' },
    { icon: <i class="fa-brands fa-youtube"></i>, href: '#', label: 'YouTube' }];


  const trustBadges = [
    {
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_138fe6762-1764670064095.png",
      imageAlt: "SOC 2 Type II certification badge with shield and security checkmark"
    },
    {
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ac71e81a-1764661555606.png",
      imageAlt: "GDPR compliance badge with European Union stars and data protection symbol"
    },
    {
      image: "https://img.rocket.new/generatedImages/rocket_gen_img_195489c66-1764667420316.png",
      imageAlt: "ISO 27001 certification badge showing international standards seal"
    }];


  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 mb-8 md:mb-12">
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <div className="nav-logo mb-4">ChatFlow Pro</div>
            <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 max-w-sm">
              Transform team chaos into organized conversations. The professional chat platform built for modern teams.
            </p>
            <div className="flex gap-3 md:gap-4">
              {socialLinks?.map((social) =>
                <a
                  key={social?.label}
                  href={social?.href}
                  className="w-8 h-8 md:w-10 md:h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social?.label}>

                  {social?.icon}
                </a>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm md:text-base font-semibold text-foreground mb-3 md:mb-4">
              Product
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks?.product?.map((link) =>
                <li key={link?.label}>
                  <a
                    href={link?.href}
                    className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors">

                    {link?.label}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm md:text-base font-semibold text-foreground mb-3 md:mb-4">
              Company
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks?.company?.map((link) =>
                <li key={link?.label}>
                  <a
                    href={link?.href}
                    className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors">

                    {link?.label}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm md:text-base font-semibold text-foreground mb-3 md:mb-4">
              Resources
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks?.resources?.map((link) =>
                <li key={link?.label}>
                  <a
                    href={link?.href}
                    className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors">

                    {link?.label}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-sm md:text-base font-semibold text-foreground mb-3 md:mb-4">
              Legal
            </h4>
            <ul className="space-y-2 md:space-y-3">
              {footerLinks?.legal?.map((link) =>
                <li key={link?.label}>
                  <a
                    href={link?.href}
                    className="text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors">

                    {link?.label}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 md:pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4">
              {trustBadges?.map((badge, index) =>
                <img
                  key={index}
                  src={badge?.image}
                  alt={badge?.imageAlt}
                  className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover" />

              )}
            </div>

            <div className="text-center md:text-right">
              <p className="text-xs md:text-sm text-muted-foreground">
                &copy; {currentYear} ChatFlow Pro. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Made with <i class="fa-regular fa-heart text-red-600 "></i> for better team communication
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>);

};

export default Footer;