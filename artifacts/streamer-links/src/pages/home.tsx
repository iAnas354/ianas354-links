import { useState, useEffect } from "react";
import { SiX, SiTiktok, SiDiscord, SiKick } from "react-icons/si";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio, Clock, Users, Gamepad2, Flame } from "lucide-react";
import logoSrc from "@assets/Logo_1780178451261.png";

type LiveStatus = "loading" | "live" | "offline";

function useLiveStatus(channel: string): LiveStatus {
  const [status, setStatus] = useState<LiveStatus>("loading");

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      try {
        const res = await fetch(
          `https://corsproxy.io/?https://kick.com/api/v2/channels/${channel}`,
          { signal: AbortSignal.timeout(6000) }
        );
        if (!res.ok) throw new Error("bad response");
        const data = await res.json();
        if (!cancelled) {
          setStatus(data?.livestream ? "live" : "offline");
        }
      } catch {
        if (!cancelled) setStatus("offline");
      }
    };

    check();
    const id = setInterval(check, 60_000);
    return () => { cancelled = true; clearInterval(id); };
  }, [channel]);

  return status;
}

export default function Home() {
  const liveStatus = useLiveStatus("ianas354");

  return (
    <div
      className="min-h-[100dvh] w-full bg-background relative overflow-hidden text-foreground flex flex-col items-center"
      dir="rtl"
      lang="ar"
    >

      {/* 3D Logo Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {[
          { top: "8%",  left: "5%",  size: 260, dur: "18s", delay: "0s",    opacity: 0.055 },
          { top: "55%", left: "72%", size: 200, dur: "22s", delay: "-7s",   opacity: 0.045 },
          { top: "30%", left: "55%", size: 320, dur: "28s", delay: "-12s",  opacity: 0.035 },
          { top: "72%", left: "10%", size: 180, dur: "16s", delay: "-4s",   opacity: 0.04  },
          { top: "15%", left: "80%", size: 140, dur: "20s", delay: "-9s",   opacity: 0.05  },
        ].map((item, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: item.top,
              left: item.left,
              width: item.size,
              height: item.size,
              opacity: item.opacity,
              animation: `spin3d ${item.dur} linear ${item.delay} infinite`,
              transformStyle: "preserve-3d",
              perspective: "800px",
              filter: "blur(0.5px)",
            }}
          >
            <img
              src={logoSrc}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "contain", transformStyle: "preserve-3d" }}
            />
          </div>
        ))}
      </div>

      {/* CSS for 3d spin */}
      <style>{`
        @keyframes spin3d {
          0%   { transform: perspective(600px) rotateY(0deg)   rotateX(15deg) scale(1); }
          25%  { transform: perspective(600px) rotateY(90deg)  rotateX(-8deg) scale(1.05); }
          50%  { transform: perspective(600px) rotateY(180deg) rotateX(15deg) scale(1); }
          75%  { transform: perspective(600px) rotateY(270deg) rotateX(-8deg) scale(1.05); }
          100% { transform: perspective(600px) rotateY(360deg) rotateX(15deg) scale(1); }
        }
      `}</style>

      {/* Ambient glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-accent/20 blur-[120px] rounded-full pointer-events-none" />

      <main className="w-full max-w-2xl px-6 py-12 md:py-20 z-10 flex flex-col gap-6">

        {/* ── الملف الشخصي ── */}
        <section className="flex flex-col items-center text-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-accent opacity-75 group-hover:opacity-100 blur transition duration-500" />
            <Avatar className="w-32 h-32 border-4 border-background relative">
              <AvatarImage src={logoSrc} alt="iAnas354" />
              <AvatarFallback className="text-4xl font-bold">IA</AvatarFallback>
            </Avatar>
            {/* نقطة البث المباشر */}
            <div className={`absolute bottom-0 right-2 w-5 h-5 rounded-full border-4 border-background transition-colors duration-500 ${
              liveStatus === "live" ? "bg-[#53fc18] animate-pulse" :
              liveStatus === "offline" ? "bg-zinc-500" : "bg-zinc-700"
            }`} />
          </div>

          <div className="flex flex-col gap-1 items-center">
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
                iAnas354
              </h1>
              <LiveBadge status={liveStatus} />
            </div>
            <p className="text-muted-foreground font-medium text-lg max-w-md">
              يبدأ البث كل ليلة — تعال وانضم إلى الدردشة
            </p>
            <p className="text-white/25 text-xs tracking-widest uppercase mt-0.5">iAnas354.com</p>
          </div>
        </section>

        {/* ── بطاقة البث ── */}
        <section className="animate-in fade-in slide-in-from-bottom-10 duration-700 delay-150 fill-mode-both">
          <a href="https://kick.com/iAnas354" target="_blank" rel="noopener noreferrer">
            <Card className={`bg-secondary/50 border-white/5 backdrop-blur-md overflow-hidden relative group transition-all duration-300 ${
              liveStatus === "live"
                ? "border-[#53fc18]/30 hover:shadow-[0_0_32px_-6px_#53fc18]"
                : "hover:border-white/10"
            }`}>
              <div className={`absolute top-0 right-0 w-1 h-full transition-colors duration-500 ${
                liveStatus === "live" ? "bg-[#53fc18]" : "bg-zinc-600"
              }`} />
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300">
                    <SiKick className={`w-6 h-6 transition-colors duration-500 ${liveStatus === "live" ? "text-[#53fc18]" : "text-zinc-400"}`} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">البث على كيك</p>
                    <p className="font-bold text-white leading-none">kick.com/iAnas354</p>
                  </div>
                </div>
                <StreamStatusPill status={liveStatus} />
              </CardContent>
            </Card>
          </a>
        </section>

        {/* ── صف المعلومات ── */}
        <section className="grid grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-200 fill-mode-both">
          {[
            { icon: <Gamepad2 className="w-4 h-4" />, label: "FPS / أكشن", sub: "النوع الرئيسي" },
            { icon: <Clock className="w-4 h-4" />,    label: "٩ م – متأخر",  sub: "وقت البث" },
            { icon: <Flame className="w-4 h-4" />,    label: "يومياً",        sub: "الجدول" },
          ].map((item, i) => (
            <Card key={i} className="bg-secondary/30 border-white/5 backdrop-blur-md">
              <CardContent className="p-3 flex flex-col gap-1 items-center text-center">
                <div className="text-primary">{item.icon}</div>
                <p className="font-bold text-sm leading-tight">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.sub}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* ── روابط التواصل ── */}
        <section className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-300 fill-mode-both">
          <SocialLink
            href="https://kick.com/iAnas354"
            icon={<SiKick className="w-6 h-6" />}
            label="كيك"
            subLabel="شاهدني مباشرة"
            color="hover:bg-[#53fc18] hover:text-black hover:border-[#53fc18]"
            glowColor="group-hover:shadow-[0_0_28px_-4px_#53fc18]"
          />
          <SocialLink
            href="https://x.com/iAnas354"
            icon={<SiX className="w-5 h-5" />}
            label="تويتر / X"
            subLabel="@iAnas354 — مقاطع، جدول وتحديثات"
            color="hover:bg-white hover:text-black hover:border-white"
            glowColor="group-hover:shadow-[0_0_28px_-4px_#ffffff]"
          />
          <SocialLink
            href="https://discord.gg/DyaXaXAeB4"
            icon={<SiDiscord className="w-6 h-6" />}
            label="ديسكورد"
            subLabel="سيرفر المجتمع — دردشة، فعاليات والمزيد"
            color="hover:bg-[#5865F2] hover:border-[#5865F2]"
            glowColor="group-hover:shadow-[0_0_28px_-4px_#5865F2]"
          />
          <SocialLink
            href="https://tiktok.com/@iAnas3544"
            icon={<SiTiktok className="w-5 h-5" />}
            label="تيك توك"
            subLabel="@iAnas3544 — أبرز اللحظات والمقاطع المضحكة"
            color="hover:bg-[#00f2fe] hover:text-black hover:border-[#00f2fe]"
            glowColor="group-hover:shadow-[0_0_28px_-4px_#00f2fe]"
          />
        </section>

        {/* ── عن البث ── */}
        <section className="animate-in fade-in slide-in-from-bottom-14 duration-700 delay-400 fill-mode-both">
          <Card className="bg-transparent border-white/8 text-center px-6 py-7">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Users className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-base tracking-wide uppercase text-white/70">عن البث</h3>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-lg mx-auto">
              لاعب FPS محترف وصاحب أجواء لا مثيل لها. أبث كل ليلة من ألعاب رانكد المجنونة إلى ألعاب القصة الهادئة. المجتمع هو كل شيء — انضم إلى الديسكورد، قل مرحباً في الدردشة، وهيا نلعب سوياً!
            </p>
          </Card>
        </section>

        {/* ── تذييل الصفحة ── */}
        <div className="flex flex-col items-center gap-1 animate-in fade-in duration-700 delay-500 fill-mode-both">
          <p className="text-center text-white/20 text-xs tracking-widest uppercase">
            iAnas354.com
          </p>
          <p className="text-center text-white/30 text-xs font-medium">
            صنعه أنس
          </p>
        </div>

      </main>
    </div>
  );
}

function LiveBadge({ status }: { status: LiveStatus }) {
  if (status === "loading") {
    return (
      <Badge className="bg-zinc-700 text-zinc-300 text-xs font-bold px-2 py-0.5 uppercase tracking-wider">
        •••
      </Badge>
    );
  }
  if (status === "live") {
    return (
      <Badge className="animate-pulse bg-[#53fc18] hover:bg-[#53fc18] text-black text-xs font-bold px-2 py-0.5 uppercase tracking-wider">
        مباشر
      </Badge>
    );
  }
  return (
    <Badge className="bg-zinc-700/80 hover:bg-zinc-700/80 text-zinc-400 text-xs font-bold px-2 py-0.5 uppercase tracking-wider">
      غير متصل
    </Badge>
  );
}

function StreamStatusPill({ status }: { status: LiveStatus }) {
  if (status === "loading") {
    return (
      <div className="hidden md:flex items-center gap-2 text-sm font-medium text-zinc-400 bg-zinc-800/60 px-3 py-1 rounded-full">
        <div className="w-2 h-2 rounded-full bg-zinc-500 animate-pulse" />
        جاري التحقق…
      </div>
    );
  }
  if (status === "live") {
    return (
      <div className="hidden md:flex items-center gap-2 text-sm font-medium text-[#53fc18] bg-[#53fc18]/10 px-3 py-1 rounded-full">
        <Radio className="w-4 h-4 animate-pulse" />
        مباشر الآن
      </div>
    );
  }
  return (
    <div className="hidden md:flex items-center gap-2 text-sm font-medium text-zinc-400 bg-zinc-800/60 px-3 py-1 rounded-full">
      <div className="w-2 h-2 rounded-full bg-zinc-500" />
      غير متصل
    </div>
  );
}

function SocialLink({
  href, icon, label, subLabel, color, glowColor
}: {
  href: string; icon: React.ReactNode; label: string;
  subLabel?: string; color: string; glowColor: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-testid={`link-${label}`}
      className={`group relative flex items-center justify-between p-4 w-full rounded-xl border border-white/10 bg-secondary/30 backdrop-blur-sm transition-all duration-300 ease-out overflow-hidden hover:-translate-y-1 hover:scale-[1.02] ${color} ${glowColor}`}
    >
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        <div className="flex flex-col text-right">
          <span className="font-bold text-lg leading-tight tracking-wide">{label}</span>
          {subLabel && (
            <span className="text-xs opacity-70 font-medium group-hover:opacity-90">{subLabel}</span>
          )}
        </div>
      </div>
      <div className="opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 relative z-10">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" /><path d="m12 19-7-7 7-7" />
        </svg>
      </div>
    </a>
  );
}
