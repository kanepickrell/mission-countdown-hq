import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, Lock, Gamepad2, Pizza, Gift, Users, Clock, Trophy, Calendar, CheckCircle2, Shirt } from "lucide-react";
import CountdownTimer from "@/components/CountdownTimer";
import RSVPModal from "@/components/RSVPModal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getLeaderboard, getTotalUsers, getUserByReferralCode, type User } from "@/lib/supabase";

// Add this tiny component near the top of the file (above Index)
const TopSecretStrip = ({ position = "top" }: { position?: "top" | "bottom" }) => (
  <div
    className={[
      "w-full z-50 select-none",
      position === "top" ? "sticky top-0" : ""
    ].join(" ")}
    aria-label="Document classification: TOP SECRET"
  >
    {/* thin rule */}
    <div className="h-0.5 w-full bg-destructive/70" />
    {/* red band */}
    <div className="relative bg-destructive text-destructive-foreground">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between py-2 md:py-2.5 font-mono">
          <span className="text-[10px] md:text-xs tracking-[0.25em] opacity-80">
            AUTHORIZED PERSONNEL ONLY
          </span>
          <span className="text-base md:text-xl font-extrabold tracking-[0.35em]">
            TOP&nbsp;SECRET
          </span>
          <span className="text-[10px] md:text-xs tracking-[0.25em] opacity-80">
            HANDLE VIA SECURE CHANNELS
          </span>
        </div>
      </div>

      {/* stamp overlay */}
      <span
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <span className="rotate-[-6deg] border-2 border-destructive-foreground/60 text-destructive-foreground/70
                          px-3 py-1 font-display text-xs md:text-sm tracking-[0.25em]
                          bg-destructive/10 backdrop-blur-[1px]">

        </span>
      </span>
    </div>
    {/* thin rule */}
    <div className="h-0.5 w-full bg-destructive/70" />
  </div>
);



const Index = () => {
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get("ref") || undefined;

  const [rsvpModalOpen, setRsvpModalOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [referrer, setReferrer] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (referralCode) {
      getUserByReferralCode(referralCode).then(setReferrer);
    }
  }, [referralCode]);

  const loadData = async () => {
    try {
      const [leaders, count] = await Promise.all([
        getLeaderboard(5),
        getTotalUsers(),
      ]);
      setLeaderboard(leaders);
      setTotalUsers(count);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const missionCards = [
    { icon: Lock, title: "ESCAPE ROOM", description: "Crack codes. Solve puzzles. Beat the clock." },
    { icon: Gamepad2, title: "EPIC GAMES", description: "Compete for glory. Earn team points" },
    { icon: Pizza, title: "FUEL STATION", description: "Dinner & Snacks Provided. Zero cost to you." },
    { icon: Gift, title: "WHITE ELEPHANT", description: "Swap gifts, steal prizes, pure chaos." },
  ];

  const timeline = [
    { time: "17:30", civilianTime: "5:30 PM", event: "Infiltration & Dinner" },
    { time: "18:00", civilianTime: "6:00 PM", event: "Worship & Briefing" },
    { time: "18:30", civilianTime: "6:30 PM", event: "Escape Room Rotations + Mini Games" },
    { time: "21:15", civilianTime: "9:15 PM", event: "White Elephant" },
    { time: "22:00", civilianTime: "10:00 PM", event: "Extraction (Pickup)" },
  ];

  const essentialInfo = [
    { icon: Gift, title: "BRING", desc: "Wrapped gift $10-15 for White Elephant" },
    { icon: Shirt, title: "WEAR", desc: "Casual, comfortable clothing" },
    { icon: Pizza, title: "DIETARY", desc: "Pizza, chicken, and veggie options available. Have allergies? Note them in your RSVP." },
  ];

  const faqs = [
    {
      q: "What if I don't know anyone?",
      a: "Perfect! You'll be placed on a team and make new friends. Everyone starts somewhere, and our leaders are here to make sure you feel welcome from minute one.",
    },
    {
      q: "How do teams work?",
      a: "Teams of 5-6 will rotate through escape rooms together. You can form your own team or we'll pair you up. Either way, you're in for an epic night.",
    },
    {
      q: "Do I really need to bring a gift?",
      a: "Yes! White Elephant is one of the highlights. Bring a wrapped gift ($10-15) that's funny, useful, or awesome. Good ideas: Bluetooth speaker, snack basket, funny mug, cozy blanket, trendy socks, portable charger, gift cards. Bad ideas: Used items, inside jokes nobody gets, anything that could offend.",
    },
    {
      q: "What if I don't make top 5?",
      a: "Everyone who invites at least 1 friend gets early access to team selection! Plus, recruiting friends means you get to experience the night with YOUR crew. That's the real prize.",
    },
  ];

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-secondary";
    if (rank === 2) return "text-slate-300";
    if (rank === 3) return "text-amber-600";
    return "text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <TopSecretStrip position="top" />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center tech-grid scanline">
        <div className="absolute inset-0 bg-gradient-radial from-card/50 to-transparent"></div>

        <div className="relative z-10 text-center px-4 py-20">
          {referrer && (
            <div className="mb-6 bg-success/10 border border-success/30 p-4 rounded-lg max-w-md mx-auto">
              <p className="text-success font-semibold">
                ✓ Invited by {referrer.first_name} {referrer.last_name}
              </p>
              <p className="text-sm text-muted-foreground">They'll get credit when you RSVP!</p>
            </div>
          )}

          <div className="mb-6">
            <span className="text-primary text-s md:text-base font-display tracking-[0.3em] uppercase">
              X-MAS Mission Briefing
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-extrabold text-foreground mb-4 tracking-tight">
            ARRIVAL 2025
          </h1>

          <p className="text-primary text-xl md:text-2xl lg:text-3xl font-display tracking-wider mb-12">
            HOPE IS COMING
          </p>

          <CountdownTimer />

          <div className="mt-12">
            <Button
              size="lg"
              onClick={() => setRsvpModalOpen(true)}
              className="bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-display text-xl tracking-wider px-12 py-7 button-shine glow-cyan"
            >
              ACCEPT MISSION ▶
            </Button>

            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>{loading ? "..." : totalUsers} students already deployed</span>
            </div>

            <p className="mt-6 text-muted-foreground text-sm">
              Never been? No problem.<br />
              New students welcome. Friends encouraged.
            </p>
          </div>

          <div className="mt-12 space-y-1 font-mono text-sm md:text-base text-muted-foreground">
            <p>DATE: <span className="text-primary">SATURDAY, DECEMBER 6th</span></p>
            <p>TIME: <span className="text-primary">17:30 HOURS (5:30 PM)</span></p>
            <p>LOCATION: <span className="text-primary">ALAMO HEIGHTS BAPTIST CHURCH <br></br>6501 Broadway, Alamo Heights, TX 78209</span></p>
          </div>

          <div className="mt-16 animate-bounce">
            <ChevronDown className="w-8 h-8 text-primary mx-auto" />
          </div>
        </div>
      </section>

      {/* LIVE STATS BAR */}
      <section className="bg-card border-t border-primary/30 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="animate-count-up">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Users className="w-8 h-8 text-primary" />
                <span className="text-4xl font-mono font-bold text-foreground">
                  {loading ? "..." : totalUsers}
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-mono tracking-wide">AGENTS DEPLOYED</p>
            </div>
            <div className="animate-count-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center justify-center gap-3 mb-2">
                <Clock className="w-8 h-8 text-destructive" />
                <span className="text-4xl font-mono font-bold text-foreground">
                  {Math.ceil((new Date("2025-12-6").getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-mono tracking-wide">DAYS UNTIL LAUNCH</p>
            </div>
            <div className="animate-count-up" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center justify-center gap-3 mb-2">
                <Trophy className="w-8 h-8 text-secondary" />
                <span className="text-4xl font-mono font-bold text-foreground">
                  {Math.max(0, 5 - leaderboard.filter(u => u.recruit_count > 0).length)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground font-mono tracking-wide">VIP PRIZES</p>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION BRIEFING */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl md:text-5xl font-display text-center mb-4 text-primary tracking-wider">
            YOUR MISSION BRIEF
          </h2>
          <div className="h-1 w-32 bg-primary mx-auto mb-16"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {missionCards.map((card, index) => (
              <Card
                key={index}
                className="bg-card border border-primary/20 p-8 text-center hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,217,255,0.3)] hud-brackets group"
              >
                <card.icon className="w-16 h-16 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-display text-foreground mb-2 tracking-wide">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </Card>
            ))}
          </div>

          <p className="text-center text-2xl md:text-3xl text-foreground mt-12 font-display tracking-wide">
            One night. High stakes. <span className="text-secondary">Zero cost.</span>
          </p>
        </div>
      </section>

      {/* TOP RECRUITERS LEADERBOARD */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-secondary glow-gold" />
            <h2 className="text-4xl md:text-5xl font-display text-primary tracking-wider">
              MISSION LEADERS
            </h2>
          </div>
          <div className="h-1 w-32 bg-secondary mx-auto mb-12"></div>

          <Card className="bg-card border-2 border-primary/30 p-6 hud-brackets">
            {loading ? (
              <div className="text-center text-muted-foreground py-8">Loading leaderboard...</div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Be the first to recruit and claim the #1 spot!
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((leader, index) => (
                  <div
                    key={leader.id}
                    className="flex items-center justify-between p-4 bg-background/60 border-b border-primary/10 last:border-0 hover:bg-background transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`text-3xl font-mono font-bold ${getRankColor(index + 1)}`}>
                        {index + 1}
                      </span>
                      <span className="text-lg font-semibold text-foreground">
                        {leader.first_name} {leader.last_name.charAt(0)}.
                      </span>
                    </div>
                    <span className="text-2xl font-mono text-primary font-bold">{leader.recruit_count}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div className="mt-8 text-center">
            <Button
              onClick={() => setRsvpModalOpen(true)}
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-display text-lg tracking-wider px-8 py-6"
            >
              RSVP TO COMPETE ▶
            </Button>
          </div>
        </div>
      </section>

      {/* RECRUIT & WIN PRIZES */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-10 h-10 text-secondary glow-gold" />
            <h2 className="text-4xl md:text-5xl font-display text-secondary tracking-wider">
              RECRUIT & WIN
            </h2>
          </div>
          <div className="h-1 w-32 bg-secondary mx-auto mb-12"></div>

          <Card className="bg-card border-2 border-secondary/50 p-8 hud-brackets glow-gold">
            <p className="text-center text-xl text-foreground mb-6 font-display">
              Top 5 recruiters unlock exclusive perks:
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                <p className="text-lg text-foreground">
                  <span className="font-semibold">2 Bonus Clues</span> during Escape Room
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                <p className="text-lg text-foreground">
                  <span className="font-semibold">Extra Swap</span> in White Elephant
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                <p className="text-lg text-foreground">
                  <span className="font-semibold">$25 Starbucks or Dairy Queen</span> Gift Card
                </p>
              </div>
            </div>

            {leaderboard.length > 0 && (
              <p className="text-center text-muted-foreground mb-6">
                Current leader: <span className="text-secondary font-semibold">
                  {leaderboard[0].first_name} {leaderboard[0].last_name.charAt(0)}.
                </span> with {leaderboard[0].recruit_count} invites.<br />
                Think you can beat them?
              </p>
            )}

            <div className="text-center">
              <Button
                onClick={() => setRsvpModalOpen(true)}
                variant="outline"
                className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-display text-lg tracking-wider px-8 py-6"
              >
                SIGN UP & ACTIVATE RECRUITING LINK ▶
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* MISSION TIMELINE */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-display text-center mb-4 text-primary tracking-wider">
            MISSION TIMELINE
          </h2>
          <p className="text-center text-muted-foreground mb-12 font-mono">DECEMBER 6th, 2025</p>

          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/30"></div>

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="relative flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-primary flex flex-col items-center justify-center z-10 glow-cyan shrink-0">
                    <span className="font-mono font-bold text-primary-foreground text-base">{item.time}</span>
                    <span className="font-mono text-primary-foreground/70 text-xs">{item.civilianTime}</span>
                  </div>
                  <div className="flex-1 bg-card border border-primary/20 p-4 hud-brackets">
                    <p className="text-lg font-semibold text-foreground">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ESSENTIAL INFO */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-4xl md:text-5xl font-display text-center mb-16 text-primary tracking-wider">
            ESSENTIAL INFO
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {essentialInfo.map((info, index) => (
              <Card key={index} className="bg-card border border-primary/20 p-8 text-center hover:-translate-y-1 transition-all">
                <info.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-display text-primary mb-2 tracking-wide">{info.title}</h3>
                <p className="text-muted-foreground">{info.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-display text-center mb-16 text-primary tracking-wider">
            MISSION QUESTIONS
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-primary/20 px-6 py-2 rounded hud-brackets"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-primary hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 px-4 bg-gradient-radial from-card to-background text-center">
        <div className="container mx-auto max-w-4xl">
          <p className="text-3xl md:text-4xl font-display text-foreground mb-2 tracking-wide">
            Time is running out.
          </p>
          <p className="text-3xl md:text-4xl font-display text-primary mb-12 tracking-wide">
            Accept your mission.
          </p>

          <Button
            size="lg"
            onClick={() => setRsvpModalOpen(true)}
            className="bg-gradient-to-br from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-display text-2xl tracking-wider px-16 py-8 button-shine glow-cyan"
          >
            RSVP NOW ▶
          </Button>

          <div className="mt-8 flex flex-col items-center gap-4">
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-card border-t border-primary/30 py-12 px-4">
        <div className="container mx-auto text-center space-y-6">

          <p className="text-lg text-foreground">
            Questions? Text us at <span className="text-primary font-mono">(937) 831-6954</span>
          </p>

          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Privacy: We'll only use your info for event updates
          </p>
        </div>
      </footer>

      <RSVPModal open={rsvpModalOpen} onOpenChange={setRsvpModalOpen} referralCode={referralCode} />
    </div>
  );
};

export default Index;