import React, { useState } from 'react';
import user from "../../../assets/images/photo-1494790108377-be9c29b29330.jpg";

const SolutionPreview = () => {
  const [activeFeature, setActiveFeature] = useState('rooms');

  const features = {
    rooms: {
      title: "Organized Chat Rooms",
      description: "Create dedicated spaces for every project, team, or topic. No more scattered conversations.",
      icon: <i class="fa-regular fa-folder-open"></i>,
      color: "#1E3A5F",
      preview: {
        title: "Marketing Campaign Q1",
        members: 12,
        messages: [
        {
          user: "Emma Thompson",
          avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_16e75c406-1763294340369.png",
          avatarAlt: "Professional headshot of Caucasian woman with blonde hair wearing teal blazer",
          message: "Campaign assets are ready for review",
          time: "2 min ago"
        },
        {
          user: "David Park",
          avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1fe8a4833-1763295664840.png",
          avatarAlt: "Professional headshot of Asian man with black hair wearing navy suit",
          message: "Budget approved! Let\'s move forward",
          time: "5 min ago"
        }]

      }
    },
    members: {
      title: "Member Management",
      description: "Control access with role-based permissions. Admins, members, and guests all in one place.",
      icon: <i class="fa-solid fa-users"></i>,
      color: "#4A90B8",
      preview: {
        title: "Team Members",
        members: 8,
        roles: [
        { name: "Admin", count: 2, color: "#E53E3E" },
        { name: "Member", count: 5, color: "#1E3A5F" },
        { name: "Guest", count: 1, color: "#718096" }]

      }
    },
    files: {
      title: "Integrated File Management",
      description: "Share, organize, and find files instantly. Everything stays in context with conversations.",
      icon: <i class="fa-regular fa-file-lines"></i>,
      color: "#FF6B47",
      preview: {
        title: "Recent Files",
        files: [
        { name: "Q1_Budget.xlsx", size: "2.4 MB", type: "spreadsheet" },
        { name: "Campaign_Brief.pdf", size: "1.8 MB", type: "document" },
        { name: "Design_Mockup.fig", size: "5.2 MB", type: "design" }]

      }
    },
    search: {
      title: "Powerful Search",
      description: "Find any message, file, or decision in seconds. Full-text search across all your rooms.",
      icon: <i class="fa-solid fa-magnifying-glass"></i>,
      color: "#38A169",
      preview: {
        title: "Search Results",
        results: [
        { text: "Budget approved for Q1 campaign", room: "Marketing", date: "Jan 2, 2026" },
        { text: "Design mockups ready for review", room: "Product", date: "Jan 1, 2026" }]

      }
    }
  };

  return (
    <section id="solution" className="py-12 md:py-16 lg:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
            Experience Organized Communication
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore how ChatFlow Pro transforms chaotic conversations into structured, productive discussions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
          <div className="space-y-4 md:space-y-6">
            {Object.entries(features)?.map(([key, feature]) =>
            <button
              key={key}
              onClick={() => setActiveFeature(key)}
              className={`w-full text-left p-4 md:p-6 rounded-xl transition-all ${
              activeFeature === key ?
              'bg-[#FFFFFF] shadow-lg scale-105' :
              'bg-[#FFFFFF]/50 hover:bg-[#FFFFFF] hover:shadow-md'}`
              }>

                <div className="flex items-start gap-3 md:gap-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0 `
                }
                style={activeFeature === key ? { backgroundColor: feature.color, color:"#FFFFFF" } : undefined}
                >
                    
                  {feature.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg lg:text-xl font-semibold text-foreground mb-2">
                      {feature?.title}
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {feature?.description}
                    </p>
                  </div>
                  {activeFeature==key ? <i class="fa-solid fa-caret-right"></i>:<i class="fa-solid fa-caret-down"></i>}
                </div>
              </button>
            )}
          </div>

          <div className="bg-card rounded-2xl shadow-2xl p-4 md:p-6 lg:p-8 min-h-[400px] md:min-h-[500px]">
            {activeFeature === 'rooms' &&
            <div className="space-y-4 md:space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-foreground">
                      {features?.rooms?.preview?.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {features?.rooms?.preview?.members} members
                    </p>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#1E3A5F] text-white rounded-lg flex items-center justify-center">
                    <i class="fa-solid fa-hashtag"></i>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4">
                  {features?.rooms?.preview?.messages?.map((msg, index) =>
                <div key={index} className="bg-[#e8f5fd] rounded-lg p-3 md:p-4 hover:bg-[#e8f5fd]/80 transition-colors">
                      <div className="flex items-start gap-3">
                        <img src={user} className=" w-[40px] h-[40px] rounded-full object-cover " />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm md:text-base font-medium text-foreground">{msg?.user}</p>
                            <span className="text-xs text-muted-foreground">{msg?.time}</span>
                          </div>
                          <p className="text-sm md:text-base text-muted-foreground">{msg?.message}</p>
                        </div>
                      </div>
                    </div>
                )}
                </div>
              </div>
            }

            {activeFeature === 'members' &&
            <div className="space-y-4 md:space-y-6">
                <h3 className="text-lg md:text-xl font-semibold text-foreground">
                  {features?.members?.preview?.title}
                </h3>
                <div className="space-y-3 md:space-y-4">
                  {features?.members?.preview?.roles?.map((role, index) =>
                <div key={index} className="bg-[#e8f5fd] rounded-lg p-4 md:p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 md:w-12 md:h-12 bg-${role?.color} rounded-lg flex items-center justify-center`} style={{backgroundColor:role?.color}}>
                            <i class="fa-solid fa-shield-halved text-white  "></i>
                          </div>
                          <div>
                            <p className="text-base md:text-lg font-semibold text-foreground">{role?.name}</p>
                            <p className="text-sm text-muted-foreground">{role?.count} members</p>
                          </div>
                        </div>
                        
                      </div>
                    </div>
                )}
                </div>
              </div>
            }

            {activeFeature === 'files' &&
            <div className="space-y-4 md:space-y-6">
                <h3 className="text-lg md:text-xl font-semibold text-foreground">
                  {features?.files?.preview?.title}
                </h3>
                <div className="space-y-3 md:space-y-4">
                  {features?.files?.preview?.files?.map((file, index) =>
                <div key={index} className="bg-[#e8f5fd] rounded-lg p-4 md:p-6 hover:bg-[#e8f5fd]/80 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#E53E3E] rounded-lg flex items-center justify-center flex-shrink-0">
                            <i class="fa-regular fa-file-lines text-white"></i>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm md:text-base font-medium text-foreground truncate">{file?.name}</p>
                          <p className="text-xs md:text-sm text-muted-foreground">{file?.size}</p>
                        </div>
                        
                      </div>
                    </div>
                )}
                </div>
              </div>
            }

            {activeFeature === 'search' &&
            <div className="space-y-4 md:space-y-6">
                <div className="relative">
                  <i class="fa-regular fa-calendar absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-muted-foreground"></i>
                  <input
                  type="text"
                  placeholder="Search messages, files, and more..."
                  className="w-full pl-10 md:pl-12 pr-4 py-3 md:py-4 bg-[#e8f5fd] rounded-lg text-sm md:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />

                </div>
                <div className="space-y-3 md:space-y-4">
                  {features?.search?.preview?.results?.map((result, index) =>
                <div key={index} className="bg-[#e8f5fd] rounded-lg p-4 md:p-6 hover:bg-[#e8f5fd]/80 transition-colors cursor-pointer">
                      <p className="text-sm md:text-base text-foreground mb-2">{result?.text}</p>
                      <div className="flex items-center gap-4 text-xs md:text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <i class="fa-solid fa-hashtag"></i>
                          {result?.room}
                        </span>
                        <span className="flex items-center gap-1">
                          <i class="fa-regular fa-calendar"></i>
                          {result?.date}
                        </span>
                      </div>
                    </div>
                )}
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </section>);

};

export default SolutionPreview;