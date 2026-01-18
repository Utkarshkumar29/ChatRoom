import React, { useState, useEffect } from 'react';


const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
  {
    id: 1,
    name: "Jennifer Martinez",
    role: "Project Manager",
    company: "TechCorp Solutions",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1f3820b2b-1763297543823.png",
    avatarAlt: "Professional headshot of Hispanic woman with dark hair wearing navy blazer and pearl necklace",
    quote: "ChatFlow Pro transformed how our team communicates. We\'ve reduced email volume by 70% and project completion time by 40%. The organized room structure keeps everyone on the same page.",
    rating: 5,
    verified: true
  },
  {
    id: 2,
    name: "Robert Chen",
    role: "Engineering Lead",
    company: "DataFlow Systems",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a7561ea2-1763295644596.png",
    avatarAlt: "Professional headshot of Asian man with black hair wearing charcoal suit and glasses",
    quote: "As an engineering team, we needed something more organized than Slack but less complex than enterprise tools. ChatFlow Pro hit the sweet spot. The search functionality alone saves us hours every week.",
    rating: 5,
    verified: true
  },
  {
    id: 3,
    name: "Amanda Thompson",
    role: "Operations Director",
    company: "Global Logistics Inc",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_16e75c406-1763294340369.png",
    avatarAlt: "Professional headshot of Caucasian woman with blonde hair wearing teal blazer",
    quote: "We manage 15 different projects simultaneously. ChatFlow Pro's room organization and member management features keep everything structured. Our team productivity increased by 35% in the first month.",
    rating: 5,
    verified: true
  },
  {
    id: 4,
    name: "Marcus Williams",
    role: "IT Manager",
    company: "SecureNet Technologies",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_18d854688-1763295573707.png",
    avatarAlt: "Professional headshot of African American man with short hair wearing navy suit and red tie",
    quote: "Security was our top concern. ChatFlow Pro's SOC 2 certification and granular permission controls gave us confidence. The migration from our old system was seamless with excellent support.",
    rating: 5,
    verified: true
  },
  {
    id: 5,
    name: "Lisa Anderson",
    role: "Marketing Director",
    company: "Creative Minds Agency",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_159a69e51-1763293590610.png",
    avatarAlt: "Professional headshot of Caucasian woman with red hair wearing burgundy blazer",
    quote: "Our creative team loves the file sharing integration. We can share designs, get feedback, and iterate all in one place. The conversation history is searchable, so we never lose important decisions.",
    rating: 5,
    verified: true
  },
  {
    id: 6,
    name: "David Park",
    role: "Product Manager",
    company: "InnovateTech",
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_13a48293d-1763296098326.png",
    avatarAlt: "Professional headshot of Asian man with black hair wearing gray suit and blue shirt",
    quote: "ChatFlow Pro bridges the gap between casual chat and formal project management. Our cross-functional teams collaborate more effectively, and stakeholders can easily follow project progress.",
    rating: 5,
    verified: true
  }];


  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials?.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials?.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials?.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials?.length) % testimonials?.length);
    setIsAutoPlaying(false);
  };

  return (
    <section id="testimonials" className="py-12 md:py-16 lg:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
            Trusted by Teams Worldwide
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            See how ChatFlow Pro is transforming team communication across industries
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl bg-[#FFFFFF] shadow-2xl">
            <div className="relative min-h-[400px] md:min-h-[450px] lg:min-h-[500px] p-6 md:p-8 lg:p-12">
              {testimonials?.map((testimonial, index) =>
              <div
                key={testimonial?.id}
                className={`absolute inset-0 p-6 md:p-8 lg:p-12 transition-opacity duration-500 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`
                }>
                    
                  <div className="flex flex-col items-center text-center h-full justify-center">
                    <img src={testimonial?.avatar} alt={testimonial?.avatarAlt} className=' w-[100px] h-[100px] rounded-full ' />

                    
                    <div className="flex items-center gap-1 my-4">
                      {[...Array(testimonial?.rating)]?.map((_, i) =>
                        <i class="fa-solid fa-star text-yellow-400 "></i>
                    )}
                    </div>

                    <blockquote className="text-base md:text-lg lg:text-xl text-foreground mb-6 md:mb-8 max-w-3xl leading-relaxed">
                      "{testimonial?.quote}"
                    </blockquote>

                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-base md:text-lg font-semibold text-foreground">
                          {testimonial?.name}
                        </p>
                        {testimonial?.verified &&
                      <></>
                      }
                      </div>
                      <p className="text-sm md:text-base text-muted-foreground">
                        {testimonial?.role} at {testimonial?.company}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-[#FFFFFF] rounded-full shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Previous testimonial">

            <i class="fa-solid fa-angle-left"></i>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-[#FFFFFF] rounded-full shadow-lg flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Next testimonial">

            <i class="fa-solid fa-angle-right"></i>
          </button>

          <div className="flex justify-center gap-2 mt-6 md:mt-8">
            {testimonials?.map((_, index) =>
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
              index === currentIndex ? 'bg-primary w-6 md:w-8' : 'bg-muted-foreground/30'}`
              }
              aria-label={`Go to testimonial ${index + 1}`} />

            )}
          </div>
        </div>

        <div className="mt-8 md:mt-12 lg:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          <div className="text-center p-4 md:p-6 bg-[#FFFFFF] rounded-xl shadow-xl">
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">4.9/5</p>
            <p className="text-sm md:text-base text-muted-foreground">Average Rating</p>
          </div>
          <div className="text-center p-4 md:p-6 bg-[#FFFFFF] rounded-xl shadow-xl">
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">12K+</p>
            <p className="text-sm md:text-base text-muted-foreground">Active Teams</p>
          </div>
          <div className="text-center p-4 md:p-6 bg-[#FFFFFF] rounded-xl shadow-xl">
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">500K+</p>
            <p className="text-sm md:text-base text-muted-foreground">Daily Messages</p>
          </div>
          <div className="text-center p-4 md:p-6 bg-[#FFFFFF] rounded-xl shadow-xl">
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-2">99.9%</p>
            <p className="text-sm md:text-base text-muted-foreground">Uptime SLA</p>
          </div>
        </div>
      </div>
    </section>);

};

export default TestimonialsCarousel;