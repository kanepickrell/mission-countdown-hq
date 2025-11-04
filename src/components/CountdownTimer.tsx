import { useEffect, useState } from "react";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const eventDate = new Date("2025-12-06T17:30:00");

  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const distance = eventDate.getTime() - now;

      if (distance < 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      };
    };

    setTimeRemaining(calculateTimeRemaining());

    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="relative">
      {/* HUD Outer Ring */}
      <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] mx-auto">
        {/* Outer Circle with Tick Marks */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
          {/* Background Circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="hsl(187 100% 50% / 0.1)"
            strokeWidth="1"
          />

          {/* Tick Marks */}
          {[...Array(60)].map((_, i) => {
            const angle = (i * 6) * (Math.PI / 180);
            const isLarge = i % 5 === 0;
            const innerRadius = isLarge ? 82 : 85;
            const outerRadius = 90;
            const x1 = 100 + innerRadius * Math.cos(angle);
            const y1 = 100 + innerRadius * Math.sin(angle);
            const x2 = 100 + outerRadius * Math.cos(angle);
            const y2 = 100 + outerRadius * Math.sin(angle);

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="hsl(187 100% 50% / 0.3)"
                strokeWidth={isLarge ? "2" : "1"}
              />
            );
          })}

          {/* Glowing Inner Ring */}
          <circle
            cx="100"
            cy="100"
            r="75"
            fill="none"
            stroke="hsl(187 100% 50%)"
            strokeWidth="2"
            className="pulse-glow"
            style={{ filter: 'drop-shadow(0 0 8px hsl(187 100% 50%))' }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {/* Digital Timer */}
            <div className="font-mono text-4xl md:text-5xl font-bold text-foreground mb-2">
              {formatNumber(timeRemaining.days)}:{formatNumber(timeRemaining.hours)}:
              {formatNumber(timeRemaining.minutes)}:{formatNumber(timeRemaining.seconds)}
            </div>
            <div className="flex justify-between text-xs md:text-sm text-muted-foreground font-mono tracking-wider">
              <span className="flex-1">DAYS</span>
              <span className="flex-1">HRS</span>
              <span className="flex-1">MIN</span>
              <span className="flex-1">SEC</span>
            </div>
          </div>
        </div>

        {/* Corner Brackets */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary"></div>
      </div>
    </div>
  );
};

export default CountdownTimer;
