import React, { useState, useEffect } from 'react';


const PricingCalculator = () => {
  const [teamSize, setTeamSize] = useState(50);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [calculatedPrice, setCalculatedPrice] = useState({ monthly: 0, annual: 0, savings: 0 });

  const pricingTiers = [
    { min: 1, max: 25, pricePerUser: 12 },
    { min: 26, max: 100, pricePerUser: 10 },
    { min: 101, max: 250, pricePerUser: 8 },
    { min: 251, max: 500, pricePerUser: 6 },
    { min: 501, max: Infinity, pricePerUser: 5 }
  ];

  useEffect(() => {
    const tier = pricingTiers?.find(t => teamSize >= t?.min && teamSize <= t?.max);
    const monthlyTotal = teamSize * tier?.pricePerUser;
    const annualTotal = monthlyTotal * 12 * 0.8;
    const savings = (monthlyTotal * 12) - annualTotal;

    setCalculatedPrice({
      monthly: monthlyTotal,
      annual: annualTotal,
      savings: savings
    });
  }, [teamSize]);

  const roiMetrics = [
    {
      icon: <i class="fa-regular fa-clock"></i>,
      label: 'Time Saved',
      value: `${Math.round(teamSize * 2.5)} hours/month`,
      description: 'Reduced time searching for information'
    },
    {
      icon: <i class="fa-solid fa-arrow-trend-up"></i>,
      label: 'Productivity Gain',
      value: '40%',
      description: 'Faster decision-making process'
    },
    {
      icon: <i class="fa-regular fa-envelope"></i>,
      label: 'Email Reduction',
      value: '70%',
      description: 'Less internal email volume'
    },
    {
      icon: <i class="fa-solid fa-indian-rupee-sign"></i>,
      label: 'Annual ROI',
      value: `$${Math.round(teamSize * 1200)?.toLocaleString()}`,
      description: 'Based on productivity improvements'
    }
  ];

  const handleTrialClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="pricing" className="py-12 md:py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
            Calculate Your Investment & ROI
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-[#718096] max-w-3xl mx-auto">
            See how ChatFlow Pro delivers value for your team size
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
          <div className="bg-card rounded-2xl shadow-2xl p-6 md:p-8 lg:p-10">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6 md:mb-8">
              Pricing Calculator
            </h3>

            <div className="space-y-6 md:space-y-8">
              <div>
                <label className="block text-sm md:text-base font-medium text-foreground mb-3 md:mb-4">
                  Team Size: <span className="text-primary font-bold">{teamSize} members</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="500"
                  value={teamSize}
                  onChange={(e) => setTeamSize(parseInt(e?.target?.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs md:text-sm text-[#718096] mt-2">
                  <span>1</span>
                  <span>100</span>
                  <span>250</span>
                  <span>500+</span>
                </div>
              </div>

              <div className=' '>
                <label className="block text-sm md:text-base font-medium text-foreground mb-3 md:mb-4">
                  Billing Cycle
                </label>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`p-3 md:p-4 rounded-lg text-sm md:text-base font-medium transition-all ${
                      billingCycle === 'monthly' ?'bg-[#1E3A5F] text-[#FFFFFF] shadow-lg' :'bg-[#F7FAFC] text-[#2D3748] hover:bg-[#F7FAFC]/80'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle('annual')}
                    className={`p-3 md:p-4 rounded-lg text-sm md:text-base font-medium transition-all relative ${
                      billingCycle === 'annual' ?'bg-[#1E3A5F] text-[#FFFFFF] shadow-lg' :'bg-[#F7FAFC] text-[#2D3748] hover:bg-[#F7FAFC]/80'
                    }`}
                  >
                    Annual
                    <span className="absolute -top-2 -right-2 bg-[#38A169] text-[#FFFFFF] text-xs px-2 py-1 rounded-full">
                      Save 20%
                    </span>
                  </button>
                </div>
              </div>

              <div className="bg-[#F7FAFC] rounded-xl p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm md:text-base text-[#718096]">
                    {billingCycle === 'monthly' ? 'Monthly Cost' : 'Annual Cost'}
                  </span>
                  <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary">
                    ${billingCycle === 'monthly' 
                      ? calculatedPrice?.monthly?.toLocaleString() 
                      : calculatedPrice?.annual?.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs md:text-sm">
                  <span className="text-[#718096]">Per user per month</span>
                  <span className="font-semibold text-foreground">
                    ${(billingCycle === 'monthly' ? calculatedPrice?.monthly / teamSize : calculatedPrice?.annual / (teamSize * 12))?.toFixed(2)}
                  </span>
                </div>
                {billingCycle === 'annual' && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center justify-between text-xs md:text-sm">
                      <span className="text-success font-medium">Annual Savings</span>
                      <span className="text-success font-bold">
                        ${calculatedPrice?.savings?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button 
                variant="default" 
                size="lg"
                className="bg-[#FF6B47] w-full px-[24px] py-[16px] text-white rounded-lg " 
                iconName="Rocket"
                iconPosition="left" 
                onClick={handleTrialClick}
              >
                Start 14-Day Free Trial
              </button>

              <div className="text-center text-xs md:text-sm text-[#718096]">
                No credit card required • Cancel anytime • Full feature access
              </div>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="bg-[#FFFFFF] rounded-2xl shadow-lg p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6">
                Your Expected ROI
              </h3>
              <div className="grid gap-4 md:gap-6">
                {roiMetrics?.map((metric, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-[#1E3A5F]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      {metric?.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm md:text-base text-[#718096] mb-1">{metric?.label}</p>
                      <p className="text-xl md:text-2xl font-bold text-foreground mb-1">{metric?.value}</p>
                      <p className="text-xs md:text-sm text-[#718096]">{metric?.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#FF6B47]/10 rounded-2xl p-6 md:p-8 border-2 border-[#FF6B47]/20">
              <div className="flex items-start gap-4">
                <i class="fa-solid fa-indian-rupee-sign text-orange-500 text-[28px] "></i>
                <div>
                  <h4 className="text-lg md:text-xl font-bold text-foreground mb-2">
                    Enterprise Plans Available
                  </h4>
                  <p className="text-sm md:text-base text-[#718096] mb-4">
                    For teams over 500 members, we offer custom enterprise solutions with dedicated support, advanced security features, and volume discounts.
                  </p>
                  <button variant="outline" size="sm" iconName="Mail" className=' border border-gray-400 px-[12px] py-[4px] rounded-lg flex gap-2 items-center text-[#718096] '>
                    <i class="fa-regular fa-envelope"></i>
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#FFFFFF] rounded-2xl shadow-lg p-6 md:p-8">
              <h4 className="text-base md:text-lg font-bold text-foreground mb-4">
                What's Included
              </h4>
              <div className="space-y-3">
                {[
                  'Unlimited chat rooms and channels',
                  'Advanced member management',
                  '10GB storage per user',
                  'Full message history and search',
                  'File sharing and previews',
                  'Role-based permissions',
                  'Priority support',
                  'SOC 2 & GDPR compliance'
                ]?.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <i class="fa-regular fa-circle-check text-[#38A169] "></i>
                    <span className="text-sm md:text-base text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingCalculator;