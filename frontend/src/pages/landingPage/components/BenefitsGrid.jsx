import { useState } from "react";

const BenefitGrid = () => {

    const benefits = [
        {
            id: 'realtime',
            icon: <i class="fa-solid fa-bolt text-[20px] text-white "></i>,
            title: 'Real-Time Messaging',
            stat: '99.9% uptime',
            shortDesc: 'Instant message delivery with enterprise-grade reliability',
            longDesc: 'Experience lightning-fast communication with sub-second message delivery. Our infrastructure ensures your team stays connected with 99.9% uptime SLA, automatic failover, and real-time presence indicators. Messages sync instantly across all devices, so your team never misses a beat.',
            features: ['Sub-second delivery', 'Offline message queue', 'Read receipts', 'Typing indicators']
        },
        {
            id: 'organized',
            icon: <i class="fa-regular fa-folder-open text-[20px] text-white "></i>,
            title: 'Organized Room Structure',
            stat: '60% fewer lost messages',
            shortDesc: 'Dedicated spaces for every project and team',
            longDesc: 'Say goodbye to scattered conversations. Create unlimited rooms for projects, departments, or topics. Each room maintains its own message history, file library, and member list. Nested channels and custom categories keep everything organized exactly how your team works.',
            features: ['Unlimited rooms', 'Custom categories', 'Room templates', 'Archive management']
        },
        {
            id: 'management',
            icon: <i class="fa-solid fa-users text-white "></i>,
            title: 'Advanced Member Management',
            stat: '5 permission levels',
            shortDesc: 'Granular control over who sees and does what',
            longDesc: 'Maintain security and organization with role-based access control. Assign admin, moderator, member, guest, or custom roles with specific permissions. Control message editing, file sharing, room creation, and member invitations at a granular level.',
            features: ['Role-based access', 'Custom permissions', 'Bulk user management', 'Guest access control']
        },
        {
            id: 'files',
            icon: <i class="fa-regular fa-file-lines text-white "></i>,
            title: 'Integrated File Sharing',
            stat: '10GB per user',
            shortDesc: 'Share and organize files without leaving the conversation',
            longDesc: 'Upload, share, and organize files directly in your conversations. Automatic file previews, version history, and powerful search make finding documents effortless. Files stay in context with the discussions that matter, with 10GB storage per user and unlimited retention.',
            features: ['File previews', 'Version history', 'Advanced search', 'Unlimited retention']
        }
    ];

    const [openBenefitIndex, setOpenBenefitIndex] = useState(null)

    const handleBenefitClick = (index) => {
        if (openBenefitIndex == index) {
            setOpenBenefitIndex(null)
        } else {
            setOpenBenefitIndex(index)
        }
    }

    return (
        <section className=" py-24 h-full ">
            <div className=" max-w-7xl w-full flex flex-col gap-10 justify-center items-center mx-auto h-full ">

                <div className=" flex flex-col gap-6 items-center justify-center  ">
                    <h1 className=" md:text-3xl lg:text-5xl font-bold ">Everything Your Team Needs to Succeed</h1>
                    <p className=" max-w-3xl text-xl text-center">Powerful features designed to eliminate communication chaos and boost productivity</p>
                </div>

                <div className=" grid grid-cols-1 lg:grid-cols-2 gap-6 w-full h-full px-[24px] ">
                    {benefits.map((benefit, index) => {
                        return (
                            <div onClick={() => handleBenefitClick(index)} className=" bg-white px-[24px] py-[16px] w-full  rounded-xl shadow-xl flex flex-col gap-5 hover:bg-white/10 hover:shadow-2xl transition-transform duration-300 cursor-pointer ">
                                <div className=" w-full flex items-center justify-between gap-2 ">
                                    <span className=" flex justify-center items-center bg-[#2D3748] w-[80px] h-[60px] rounded-lg ">{benefit?.icon}</span>
                                    <div className=" w-full flex flex-col  ">
                                        <span className=" text-xl font-bold text-[#2D3748] ">{benefit?.title}</span>
                                        <span className=" text-[12px] text-[#E53E3E] font-medium  ">{benefit?.stat}</span>
                                    </div>
                                    <span className={` ${openBenefitIndex==index && " rotate-180"} `}><i class="fa-solid fa-angle-down"></i></span>
                                </div>
                                <p className=" text-[16px] text-[#718096] ">{benefit?.shortDesc}</p>

                                {openBenefitIndex == index && (
                                    <>
                                        <hr className="border border-[#718096]" />

                                        <div className=" flex flex-col gap-4 ">
                                            <p className="  text-[14px] text-[#718096] font-medium ">
                                                {benefit?.longDesc}
                                            </p>
                                            <div className=" grid grid-cols-2 gap-2 ">
                                                {benefit?.features?.map((feature, index) => {
                                                    return (
                                                        <div key={index} className=" flex gap-2 ">
                                                            <i className="fa-regular fa-circle-check text-[#38A169] "></i>
                                                            <span className="text-sm text-[#718096] ">{feature}</span>
                                                        </div>
                                                    );
                                                })}

                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>

                <div className="mt-8 md:mt-12 lg:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 w-full px-[24px] ">
                    <div className="text-center p-4 md:p-6 bg-white rounded-xl shadow-xl ">
                        <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">40%</p>
                        <p className="text-sm md:text-base text-muted-foreground">Faster Decisions</p>
                    </div>
                    <div className="text-center p-4 md:p-6 bg-white rounded-xl shadow-xl ">
                        <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">60%</p>
                        <p className="text-sm md:text-base text-muted-foreground">Fewer Lost Messages</p>
                    </div>
                    <div className="text-center p-4 md:p-6 bg-white rounded-xl shadow-xl ">
                        <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">85%</p>
                        <p className="text-sm md:text-base text-muted-foreground">User Satisfaction</p>
                    </div>
                    <div className="text-center p-4 md:p-6 bg-white rounded-xl shadow-xl ">
                        <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">12K+</p>
                        <p className="text-sm md:text-base text-muted-foreground">Active Teams</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BenefitGrid