import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const LiveDemo = () => {
  const [activeRoom, setActiveRoom] = useState('general');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const rooms = [
  { id: 'general', name: 'General Discussion', icon: 'MessageSquare', members: 24 },
  { id: 'product', name: 'Product Launch', icon: 'Rocket', members: 12 },
  { id: 'design', name: 'Design Review', icon: 'Palette', members: 8 }];


  const demoMessages = {
    general: [
    {
      id: 1,
      user: "Alex Johnson",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1cef3e3c2-1763295620422.png",
      avatarAlt: "Professional headshot of Caucasian man with brown hair wearing gray suit and blue tie",
      message: "Team meeting starts in 10 minutes. See you all there!",
      time: "10:30 AM",
      reactions: ['👍', '✅']
    },
    {
      id: 2,
      user: "Maria Garcia",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1631c1677-1763295642190.png",
      avatarAlt: "Professional headshot of Hispanic woman with dark hair wearing burgundy blazer",
      message: "I\'ve uploaded the Q1 report to the files section. Please review before the meeting.",
      time: "10:32 AM",
      reactions: ['👀']
    },
    {
      id: 3,
      user: "James Wilson",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a184de25-1763292715446.png",
      avatarAlt: "Professional headshot of African American man with short hair wearing navy suit",
      message: "Great work on the report, Maria! The metrics look impressive.",
      time: "10:35 AM",
      reactions: ['🎉', '💯']
    }],

    product: [
    {
      id: 1,
      user: "Sarah Chen",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1995e8b9b-1763294899676.png",
      avatarAlt: "Professional headshot of Asian woman with long black hair wearing navy blazer",
      message: "Launch timeline confirmed for March 15th. All systems go!",
      time: "9:15 AM",
      reactions: ['🚀', '✨']
    },
    {
      id: 2,
      user: "Tom Anderson",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_11bb52de7-1763299509621.png",
      avatarAlt: "Professional headshot of Caucasian man with blonde hair wearing charcoal suit",
      message: "Marketing materials are ready. Should I share them here?",
      time: "9:18 AM",
      reactions: ['👍']
    }],

    design: [
    {
      id: 1,
      user: "Emily Davis",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_17784c577-1763297418164.png",
      avatarAlt: "Professional headshot of Caucasian woman with red hair wearing teal blazer",
      message: "New mockups are in Figma. Link in the description.",
      time: "11:00 AM",
      reactions: ['🎨', '👀']
    },
    {
      id: 2,
      user: "Ryan Martinez",
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1c13bd7bb-1763296465559.png",
      avatarAlt: "Professional headshot of Hispanic man with dark hair wearing navy suit",
      message: "Love the color scheme! Can we try a darker shade for the CTA?",
      time: "11:05 AM",
      reactions: ['💡']
    }]

  };

  useEffect(() => {
    setMessages(demoMessages?.[activeRoom]);
  }, [activeRoom]);

  const simulateMessage = () => {
    setIsTyping(true);
    setTimeout(() => {
      const newMessage = {
        id: messages?.length + 1,
        user: "You",
        avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1190b5d8b-1763296654467.png",
        avatarAlt: "Professional headshot of user with friendly smile wearing business casual attire",
        message: "This looks great! I\'m excited to try ChatFlow Pro.",
        time: new Date()?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        reactions: []
      };
      setMessages([...messages, newMessage]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <section id="demo" className="py-12 md:py-16 lg:py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-foreground mb-4 md:mb-6">
            See ChatFlow Pro in Action
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience real-time messaging with organized rooms and seamless collaboration
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-4 h-[500px] md:h-[600px]">
            <div className="lg:col-span-1 bg-muted border-r border-border p-4 md:p-6 overflow-y-auto">
              <h3 className="text-base md:text-lg font-semibold text-foreground mb-4">Chat Rooms</h3>
              <div className="space-y-2">
                {rooms?.map((room) =>
                <button
                  key={room?.id}
                  onClick={() => setActiveRoom(room?.id)}
                  className={`w-full text-left p-3 md:p-4 rounded-lg transition-all ${
                  activeRoom === room?.id ?
                  'bg-primary text-primary-foreground' :
                  'bg-card hover:bg-muted'}`
                  }>

                    <div className="flex items-center gap-3">
                      <Icon
                      name={room?.icon}
                      size={20}
                      className={activeRoom === room?.id ? 'text-primary-foreground' : 'text-muted-foreground'} />

                      <div className="flex-1 min-w-0">
                        <p className={`text-sm md:text-base font-medium truncate ${
                      activeRoom === room?.id ? 'text-primary-foreground' : 'text-foreground'}`
                      }>
                          {room?.name}
                        </p>
                        <p className={`text-xs ${
                      activeRoom === room?.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`
                      }>
                          {room?.members} members
                        </p>
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-3 flex flex-col">
              <div className="p-4 md:p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name={rooms?.find((r) => r?.id === activeRoom)?.icon || 'MessageSquare'} size={24} className="text-primary" />
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-foreground">
                        {rooms?.find((r) => r?.id === activeRoom)?.name}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {rooms?.find((r) => r?.id === activeRoom)?.members} members
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" iconName="Settings">
                    Settings
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                {messages?.map((msg) =>
                <div key={msg?.id} className="flex items-start gap-3">
                    <Image
                    src={msg?.avatar}
                    alt={msg?.avatarAlt}
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full flex-shrink-0" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm md:text-base font-medium text-foreground">{msg?.user}</p>
                        <span className="text-xs text-muted-foreground">{msg?.time}</span>
                      </div>
                      <div className="bg-muted rounded-lg p-3 md:p-4">
                        <p className="text-sm md:text-base text-foreground">{msg?.message}</p>
                      </div>
                      {msg?.reactions?.length > 0 &&
                    <div className="flex gap-2 mt-2">
                          {msg?.reactions?.map((reaction, index) =>
                      <span key={index} className="text-sm md:text-base">{reaction}</span>
                      )}
                        </div>
                    }
                    </div>
                  </div>
                )}

                {isTyping &&
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-muted rounded-full flex items-center justify-center">
                      <Icon name="User" size={20} className="text-muted-foreground" />
                    </div>
                    <div className="bg-muted rounded-lg p-3 md:p-4">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                }
              </div>

              <div className="p-4 md:p-6 border-t border-border">
                <div className="flex gap-2 md:gap-3">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 md:py-3 bg-muted rounded-lg text-sm md:text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />

                  <Button
                    variant="default"
                    size="default"
                    iconName="Send"
                    onClick={simulateMessage}>

                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

};

export default LiveDemo;