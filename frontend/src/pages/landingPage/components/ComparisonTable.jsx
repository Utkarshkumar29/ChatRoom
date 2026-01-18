import React, { useState } from 'react';


const ComparisonTable = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const platforms = [
    { id: 'all', name: 'All Platforms' },
    { id: 'slack', name: 'Slack' },
    { id: 'teams', name: 'Microsoft Teams' },
    { id: 'discord', name: 'Discord' }
  ];

  const features = [
    {
      category: 'Organization',
      items: [
        {
          feature: 'Dedicated Project Rooms',
          chatflow: true,
          slack: 'Limited',
          teams: true,
          discord: true,
          description: 'Create unlimited organized spaces for projects'
        },
        {
          feature: 'Nested Room Categories',
          chatflow: true,
          slack: false,
          teams: 'Limited',
          discord: true,
          description: 'Hierarchical organization for complex structures'
        },
        {
          feature: 'Custom Room Templates',
          chatflow: true,
          slack: false,
          teams: false,
          discord: false,
          description: 'Pre-configured room setups for consistency'
        }
      ]
    },
    {
      category: 'Member Management',
      items: [
        {
          feature: 'Granular Role Permissions',
          chatflow: true,
          slack: 'Limited',
          teams: true,
          discord: true,
          description: '5+ customizable permission levels'
        },
        {
          feature: 'Guest Access Control',
          chatflow: true,
          slack: true,
          teams: true,
          discord: 'Limited',
          description: 'Secure external collaboration'
        },
        {
          feature: 'Bulk User Management',
          chatflow: true,
          slack: 'Limited',
          teams: true,
          discord: false,
          description: 'Efficient team administration'
        }
      ]
    },
    {
      category: 'File Management',
      items: [
        {
          feature: 'Integrated File Library',
          chatflow: true,
          slack: 'Limited',
          teams: true,
          discord: 'Limited',
          description: 'Organized file storage per room'
        },
        {
          feature: 'Version History',
          chatflow: true,
          slack: false,
          teams: true,
          discord: false,
          description: 'Track file changes over time'
        },
        {
          feature: 'Advanced File Search',
          chatflow: true,
          slack: 'Limited',
          teams: true,
          discord: false,
          description: 'Find files instantly across all rooms'
        }
      ]
    },
    {
      category: 'Security & Compliance',
      items: [
        {
          feature: 'SOC 2 Certification',
          chatflow: true,
          slack: true,
          teams: true,
          discord: false,
          description: 'Enterprise-grade security standards'
        },
        {
          feature: 'GDPR Compliance',
          chatflow: true,
          slack: true,
          teams: true,
          discord: 'Limited',
          description: 'European data protection compliance'
        },
        {
          feature: 'Custom Data Retention',
          chatflow: true,
          slack: 'Paid',
          teams: true,
          discord: false,
          description: 'Control message and file retention'
        }
      ]
    }
  ];

  const renderFeatureValue = (value) => {
    if (value === true) {
      return <i class="fa-regular fa-circle-check text-[#38A169] "></i>;
    } else if (value === false) {
      return <i class="fa-regular fa-circle-xmark text-[#E53E3E] "></i>;
    } else {
      return <span className="text-sm text-warning font-medium">{value}</span>;
    }
  };

  const filteredFeatures = selectedPlatform === 'all' 
    ? features 
    : features?.map(category => ({
        ...category,
        items: category?.items?.filter(item => 
          item?.chatflow !== item?.[selectedPlatform]
        )
      }))?.filter(category => category?.items?.length > 0);

  return (
    <section id="comparison" className="py-12 md:py-16 lg:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
            How ChatFlow Pro Compares
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto mb-6 md:mb-8">
            See why teams are switching from traditional chat platforms
          </p>

          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {platforms?.map((platform) => (
              <button
                key={platform?.id}
                onClick={() => setSelectedPlatform(platform?.id)}
                className={`px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base font-medium transition-all ${
                  selectedPlatform === platform?.id
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card text-foreground hover:bg-muted'
                }`}
              >
                {platform?.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 md:p-6 text-sm md:text-base font-semibold text-foreground">
                    Feature
                  </th>
                  <th className="text-center p-4 md:p-6 text-sm md:text-base font-semibold text-primary">
                    ChatFlow Pro
                  </th>
                  <th className="text-center p-4 md:p-6 text-sm md:text-base font-semibold text-muted-foreground">
                    Slack
                  </th>
                  <th className="text-center p-4 md:p-6 text-sm md:text-base font-semibold text-muted-foreground">
                    Teams
                  </th>
                  <th className="text-center p-4 md:p-6 text-sm md:text-base font-semibold text-muted-foreground">
                    Discord
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFeatures?.map((category, categoryIndex) => (
                  <React.Fragment key={categoryIndex}>
                    <tr className="bg-muted/50">
                      <td colSpan={5} className="p-4 md:p-6">
                        <h3 className="text-base md:text-lg font-bold text-foreground">{category?.category}</h3>
                      </td>
                    </tr>
                    {category?.items?.map((item, itemIndex) => (
                      <tr key={itemIndex} className="border-t border-border hover:bg-muted/30 transition-colors">
                        <td className="p-4 md:p-6">
                          <div>
                            <p className="text-sm md:text-base font-medium text-foreground mb-1">
                              {item?.feature}
                            </p>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              {item?.description}
                            </p>
                          </div>
                        </td>
                        <td className="text-center p-4 md:p-6">
                          {renderFeatureValue(item?.chatflow)}
                        </td>
                        <td className="text-center p-4 md:p-6">
                          {renderFeatureValue(item?.slack)}
                        </td>
                        <td className="text-center p-4 md:p-6">
                          {renderFeatureValue(item?.teams)}
                        </td>
                        <td className="text-center p-4 md:p-6">
                          {renderFeatureValue(item?.discord)}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 md:mt-12 text-center">
          <p className="text-sm md:text-base text-muted-foreground mb-4">
            * Feature comparison based on standard plans as of January 2026
          </p>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <i class="fa-regular fa-circle-check text-[#38A169] "></i>
              <span>Full Support</span>
            </div>
            <div className="flex items-center gap-2">
              <i class="fa-regular fa-circle-xmark text-[#E53E3E] "></i>
              <span>Not Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-warning font-medium">Limited</span>
              <span>Partial Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;