const StickyNavigationBar=()=>{
    return(
        <div className=" max-w-[1600px] flex w-full h-[80px] items-center ">
            <div className=" px-[64px] flex justify-between w-full ">
                <span className=" text-[24px] text-[#1E3A5F] font-semibold transition-transform duration-250 ease-out hover:text-[#4A90B8] ">DualChat</span>
            <div className=" flex gap-10 font-medium text-[16px] transallition-transform duration-250 ease-out text-[#2D3748] hover:text-[#1E3A5F] ">
                <span className=" cursor-pointer ">Solution</span>
                <span className=" cursor-pointer ">Features</span>
                <span className=" cursor-pointer ">Demo</span>
                <span className=" cursor-pointer ">Pricing</span>
                <span className=" cursor-pointer ">Security</span>
                <span className=" cursor-pointer ">Contact</span>
            </div>
            <div>Login/SignUp</div>
            </div>
        </div>
    )
}

export default StickyNavigationBar;