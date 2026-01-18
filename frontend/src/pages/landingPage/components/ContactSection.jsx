import React, { useState } from 'react';
import Input from '../../../components/Input';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    teamSize: '',
    phone: '',
    message: '',
    agreeToTerms: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const teamSizeOptions = [
    { value: '1-25', label: '1-25 members' },
    { value: '26-100', label: '26-100 members' },
    { value: '101-250', label: '101-250 members' },
    { value: '251-500', label: '251-500 members' },
    { value: '500+', label: '500+ members' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors?.[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData?.fullName?.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!formData?.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(formData?.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData?.company?.trim()) {
      errors.company = 'Company name is required';
    }

    if (!formData?.teamSize) {
      errors.teamSize = 'Please select your team size';
    }

    if (!formData?.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    return errors;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors)?.length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        company: '',
        teamSize: '',
        phone: '',
        message: '',
        agreeToTerms: false
      });

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 2000);
  };

  const contactMethods = [
    {
      icon: <i class="fa-regular fa-envelope"></i>,
      title: 'Email Us',
      value: 'sales@chatflowpro.com',
      description: 'Get a response within 24 hours'
    },
    {
      icon: <i class="fa-solid fa-phone"></i>,
      title: 'Call Us',
      value: '+91 (555) 123-4567',
      description: 'Mon-Fri, 9AM-6PM IST'
    },
    {
      icon: <i class="fa-regular fa-comment"></i>,
      title: 'Live Chat',
      value: 'Start a conversation',
      description: 'Available during business hours'
    }
  ];

  return (
    <section id="contact" className="py-12 md:py-16 lg:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
            Start Your Free Trial Today
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of teams who've transformed their communication with ChatFlow Pro
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          <div className="space-y-6 md:space-y-8">
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6">
                Get in Touch
              </h3>
              <div className="space-y-4 md:space-y-6">
                {contactMethods?.map((method, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      {method?.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base md:text-lg font-semibold text-foreground mb-1">
                        {method?.title}
                      </h4>
                      <p className="text-sm md:text-base text-primary font-medium mb-1">
                        {method?.value}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {method?.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-accent/10 rounded-2xl p-6 md:p-8 border-2 border-accent/20">
              <div className="flex items-start gap-4">
                <i class="fa-solid fa-gift text-[#FF6B47] "></i>
                <div>
                  <h4 className="text-lg md:text-xl font-bold text-foreground mb-2">
                    Limited Time Offer
                  </h4>
                  <p className="text-sm md:text-base text-muted-foreground mb-4">
                    Sign up now and get 20% off your first year plus a free onboarding session with our team.
                  </p>
                  <div className="flex items-center gap-2 text-xs md:text-sm text-[#FF6B47] font-medium">
                    <i class="fa-regular fa-clock"></i>
                    <span>Offer expires in 7 days</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg">
              <h4 className="text-base md:text-lg font-bold text-foreground mb-4">
                What Happens Next?
              </h4>
              <div className="space-y-4">
                {[
                  { step: 1, text: "We'll send you a confirmation email with your trial details" },
                  { step: 2, text: "Set up your workspace and invite your team members" },
                  { step: 3, text: "Get a personalized onboarding session with our team" },
                  { step: 4, text: "Start organizing your team communication effectively" }
                ]?.map((item) => (
                  <div key={item?.step} className="flex items-start gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs md:text-sm font-bold text-primary-foreground">
                        {item?.step}
                      </span>
                    </div>
                    <p className="text-sm md:text-base text-foreground pt-1">{item?.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-2xl">
            {submitSuccess ? (
              <div className="text-center py-8 md:py-12">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <i class="fa-solid fa-circle-check"></i>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                  Thank You!
                </h3>
                <p className="text-sm md:text-base text-muted-foreground mb-6">
                  We've received your request. Check your email for trial access details and next steps.
                </p>
                <button 
                  variant="outline" 
                  onClick={() => setSubmitSuccess(false)}
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6">
                  Start Your 14-Day Free Trial
                </h3>

                <Input
                  label="Full Name"
                  type="text"
                  placeholder="John Smith"
                  value={formData?.fullName}
                  onChange={(e) => handleInputChange('fullName', e?.target?.value)}
                  error={formErrors?.fullName}
                  required
                />

                <Input
                  label="Work Email"
                  type="email"
                  placeholder="john@company.com"
                  value={formData?.email}
                  onChange={(e) => handleInputChange('email', e?.target?.value)}
                  error={formErrors?.email}
                  required
                />

                <Input
                  label="Company Name"
                  type="text"
                  placeholder="Your Company Inc."
                  value={formData?.company}
                  onChange={(e) => handleInputChange('company', e?.target?.value)}
                  error={formErrors?.company}
                  required
                />

                <input
                  type='select'
                  label="Team Size"
                  placeholder="Select team size"
                  options={teamSizeOptions}
                  value={formData?.teamSize}
                  onChange={(value) => handleInputChange('teamSize', value)}
                  error={formErrors?.teamSize}
                  required
                />

                <Input
                  label="Phone Number (Optional)"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData?.phone}
                  onChange={(e) => handleInputChange('phone', e?.target?.value)}
                />

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    placeholder="Tell us about your team's communication needs..."
                    value={formData?.message}
                    onChange={(e) => handleInputChange('message', e?.target?.value)}
                    rows={4}
                    className="w-full px-4 py-3 bg-muted rounded-lg text-sm md:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className=' flex items-center gap-2 '>
                    <input
                  type='checkbox'
                  label="I agree to the Terms of Service and Privacy Policy"
                  checked={formData?.agreeToTerms}
                  onChange={(e) => handleInputChange('agreeToTerms', e?.target?.checked)}
                  error={formErrors?.agreeToTerms}
                  required
                />
                <span>I agree to the Terms of Service and Privacy Policy</span>
                </div>

                <button
                  type="submit"
                  variant="default"
                  size="lg"
                  className=" bg-[#FF6B47] text-white py-[12px] rounded-lg flex items-center justify-center gap-2 cta-button w-full"
                  loading={isSubmitting}
                  iconName="Rocket"
                  iconPosition="left"
                >
                    <i class="fa-solid fa-rocket"></i>
                  {isSubmitting ? 'Processing...' : 'Start Free Trial'}
                </button>

                <p className="text-xs md:text-sm text-center text-muted-foreground">
                  No credit card required • Cancel anytime • Full feature access
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;