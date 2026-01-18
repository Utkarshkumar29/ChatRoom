import React from 'react'

const ProblemSection = () => {
  const chaosProblems = [
    {
      icon: <i class="fa-regular fa-message text-[#E53E3E] text-[20px] "></i>,
      title: "Scattered Messages",
      description: "Important discussions lost across Slack, Teams, email, and text messages"
    },
    {
      icon: <i class="fa-regular fa-bell text-[#E53E3E] text-[20px]"></i>,
      title: "Notification Overload",
      description: "Constant interruptions from multiple platforms killing productivity"
    },
    {
      icon: <i class="fa-solid fa-magnifying-glass text-[#E53E3E] text-[20px]"></i>,
      title: "Lost Information",
      description: "Spending hours searching for decisions made weeks ago"
    },
    {
      icon: <i class="fa-solid fa-users text-[#E53E3E] text-[20px]"></i>,
      title: "Context Switching",
      description: "Jumping between 5+ tools just to follow one conversation"
    }
  ];

  const organizedSolutions = [
    {
      icon: <i class="fa-regular fa-folder-open text-[#38A169]  text-[20px]"></i>,
      title: "Dedicated Rooms",
      description: "Every project gets its own organized space with clear structure"
    },
    {
      icon: <i class="fa-solid fa-shield-halved text-[#38A169]  text-[20px]"></i>,
      title: "Role-Based Access",
      description: "Control who sees what with granular permission management"
    },
    {
      icon: <i class="fa-solid fa-box-archive text-[#38A169]  text-[20px]"></i>,
      title: "Searchable History",
      description: "Find any message, file, or decision in seconds with powerful search"
    },
    {
      icon: <i class="fa-solid fa-bolt text-[#38A169]  text-[20px]"></i>,
      title: "Single Platform",
      description: "Everything your team needs in one professional workspace"
    }
  ];

  return (
    <section id="problem" className="py-12 md:py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-[#2D3748] mb-4 md:mb-6">
            Stop Drowning in Communication Chaos
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-[#718096] max-w-3xl mx-auto">
            Your team deserves better than scattered messages and lost conversations
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 ">
          <div className="bg-[#E53E3E]/5 rounded-2xl p-6 md:p-8 lg:p-10 border-2 border-destructive/20">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-destructive/20 rounded-full flex items-center justify-center">
                <i class="fa-solid fa-triangle-exclamation text-[#E53E3E]  text-[24px] "></i>
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#2D3748]">The Problem</h3>
            </div>

            <div className="space-y-4 md:space-y-6">
              {chaosProblems?.map((problem, index) => (
                <div key={index} className="bg-[#FFFFFF] rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-destructive/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      {problem?.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base md:text-lg font-semibold text-[#2D3748] mb-2">{problem?.title}</h4>
                      <p className="text-sm md:text-base text-[#718096]">{problem?.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 md:mt-8 p-4 md:p-6 bg-destructive/10 rounded-xl">
              <p className="text-sm md:text-base text-[#2D3748] font-medium text-center">
                <span className="text-[#E53E3E] font-bold">60% of teams</span> report losing critical information in scattered communication tools
              </p>
            </div>
          </div>

          <div className="bg-[#38A169]/5 rounded-2xl p-6 md:p-8 lg:p-10 border-2 border-success/20">
            <div className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-success/20 rounded-full flex items-center justify-center">
                <i class="fa-regular fa-circle-check text-[#38A169] text-[30px] "></i>
              </div>
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#2D3748]">The Solution</h3>
            </div>

            <div className="space-y-4 md:space-y-6">
              {organizedSolutions?.map((solution, index) => (
                <div key={index} className="bg-[#FFFFFF] rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      {solution?.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base md:text-lg font-semibold text-[#2D3748] mb-2">{solution?.title}</h4>
                      <p className="text-sm md:text-base text-[#718096]">{solution?.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 md:mt-8 p-4 md:p-6 bg-success/10 rounded-xl">
              <p className="text-sm md:text-base text-[#2D3748] font-medium text-center">
                <span className="text-[#38A169] font-bold">40% faster decisions</span> with organized, searchable conversations
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;