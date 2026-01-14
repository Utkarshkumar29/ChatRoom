import user from "../../../assets/images/photo-1494790108377-be9c29b29330.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className=" relative max-w-[1500px] h-full mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 lg:py-20 ">
        <div className="w-full h-full grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          <div className=" text-left flex gap-10 flex-col ">
            <h1 className=" lg:text-7xl font-bold text-[#2D3748] ">
              Transform Team Chaos Into Organized Conversations
            </h1>

            <span className=" lg:text-xl text-[#718096] ">
              The only professional chat platform that eliminates scattered
              messages and boosts productivity with structured discussions.
            </span>

            <div className=" flex gap-10 ">
              <button
                className=" bg-[#FF6B47] text-white px-[24px] py-[12px] rounded-[8px] 
hover:bg-[#FF6B47]/90 hover:shadow-2xl hover:shadow-[#FF6B47] transition-all duration-300 hover:scale-105 hover:-translate-y-1 "
              >
                Start Free Trail
              </button>
              <button className=" hover:bg-[#FF6B47] text-black hover:text-white border border-gray-200 px-[24px] py-[12px] rounded-[8px] transition-all duration-300 ">
                Watch Live Demo
              </button>
            </div>

            <div className=" flex gap-10 ">
              <div className="  flex items-center gap-2 ">
                <span className="inline-block w-[8px] h-[8px] rounded-full bg-green-500 transition-colors "></span>

                <span className=" text-[#718096]  ">
                  12,847 teams online now
                </span>
              </div>
              <div>
                <span className="  text-[#718096] ">SOC 2 Certified</span>
              </div>
            </div>
          </div>

          <div className=" flex gap-6 flex-col shadow-xl w-[670px] rounded-2xl px-[24px] py-[16px] transition-transform duration-1000 ease-in-out hover:scale-110 ">
            <div className=" bg-blue-100 w-full rounded-xl p-[12px] flex flex-col gap-6 ">
              <div className=" w-full flex gap-4 items-center ">
                <div className=" bg-[#2D3748] w-[50px] h-[50px] rounded-md  text-white flex items-center justify-center text-2xl ">
                  #
                </div>
                <div className=" flex flex-col h-min ">
                  <span className=" text-[16px] font-semibold ">
                    Product Launch 2026
                  </span>
                  <span className=" text-[12px] ">24 members active</span>
                </div>
              </div>
              <div className=" flex-col flex gap-4 ">
                <div className="transition-transform duration-300 ease-out hover:translate-x-2 p-[8px] rounded-lg bg-white flex gap-2 items-center ">
                  <img src={user} className=" w-[40px] h-[40px] rounded-full object-cover " />
                  <div className=" flex flex-col ">
                    <span className="text-xs md:text-sm font-medium text-[#2D3748] ">Sarah Chen</span>
                    <span className=" text-xs text-[#718096] line-clamp-2">
                      Design mockups are ready for review. Check the files
                      section.
                    </span>
                  </div>
                </div>
                <div className=" transition-transform duration-300 ease-out hover:translate-x-2 p-[8px] rounded-lg bg-white flex gap-2 items-center ">
                  <img src={user} className=" w-[40px] h-[40px] rounded-full object-cover " />
                  <div className=" flex flex-col ">
                    <span className="text-xs md:text-sm font-medium text-[#2D3748] ">Michael Rodriguez</span>
                    <span className=" text-xs text-[#718096] line-clamp-2">
                     Great work! I've added my feedback in the comments.
                    </span>
                  </div>
                </div>
                <div className="transition-transform duration-300 ease-out hover:translate-x-2 p-[8px] rounded-lg bg-white flex gap-2 items-center ">
                  <img src={user} className=" w-[40px] h-[40px] rounded-full object-cover " />
                  <div className=" flex flex-col ">
                    <span className="text-xs md:text-sm font-medium text-[#2D3748] ">Sarah Chen</span>
                    <span className=" text-xs text-[#718096] line-clamp-2">
                      Marketing materials approved. Moving to production phase.
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className=" flex items-center gap-3 ">
              <div className="flex items-center h-full">
                <img
                  src={user}
                  className="w-[40px] h-[40px] rounded-full border border-white"
                />
                <img
                  src={user}
                  className="w-[40px] h-[40px] rounded-full border border-white -ml-3"
                />
                <img
                  src={user}
                  className="w-[40px] h-[40px] rounded-full border border-white -ml-3"
                />
                <div className="-ml-3 w-[40px] h-[40px] rounded-full bg-gray-200 text-white flex items-center justify-center text-sm border border-white">
                  21+
                </div>
              </div>

              <span className=" text-sm font-semibold text-[#718096] ">24 members in this room</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
