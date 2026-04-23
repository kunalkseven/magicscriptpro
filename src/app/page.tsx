"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Sparkles, Zap, TrendingUp, Mic, Calendar, BarChart3, Users, Globe,
  Play, ArrowRight, Check, ChevronDown, Star, Shield, Bolt,
  Cpu, Layers, Eye, Target, Clock, Trophy, Crown, Rocket,
  MessageSquare, Hash, Repeat, Send, PenTool, Brain,
  Menu, X, ExternalLink, Camera, Video, Briefcase
} from "lucide-react";

/* ================================================================
   ANIMATION VARIANTS
   ================================================================ */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ================================================================
   SECTION WRAPPER (scroll-triggered reveal)
   ================================================================ */
function Section({ children, className = "", id = "" }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
      className={`section ${className}`}
    >
      {children}
    </motion.section>
  );
}

/* ================================================================
   HEADER
   ================================================================ */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Agency", href: "#agency" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      className="header"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: "0 var(--container-padding)",
        transition: "all 0.3s ease",
        background: scrolled ? "rgba(6,7,11,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-subtle)" : "1px solid transparent",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        {/* Logo */}
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: "var(--gradient-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 20px rgba(108,71,255,0.3)"
          }}>
            <Sparkles size={20} color="white" />
          </div>
          <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Creator<span style={{ color: "var(--primary-light)" }}>AI</span> Pro
          </span>
        </a>

        {/* Desktop Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 8 }} className="desktop-nav">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="btn-ghost" style={{ fontSize: "0.9rem", textDecoration: "none", borderRadius: 8, color: "var(--text-secondary)" }}>
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }} className="desktop-nav">
          <a href="#pricing" className="btn btn-secondary btn-sm" style={{ textDecoration: "none" }}>
            Sign In
          </a>
          <a href="#pricing" className="btn btn-primary btn-sm" style={{ textDecoration: "none" }}>
            Start Free <ArrowRight size={16} />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mobile-nav-btn"
          style={{
            display: "none", background: "none", border: "none",
            color: "var(--text-primary)", cursor: "pointer", padding: 8
          }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              overflow: "hidden",
              background: "rgba(6,7,11,0.95)",
              backdropFilter: "blur(20px)",
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            <div className="container" style={{ padding: "20px var(--container-padding)" }}>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    display: "block", padding: "14px 0",
                    color: "var(--text-secondary)", textDecoration: "none",
                    fontSize: "1rem", borderBottom: "1px solid var(--border-subtle)"
                  }}
                >
                  {link.label}
                </a>
              ))}
              <div style={{ display: "flex", gap: 12, paddingTop: 20 }}>
                <a href="#pricing" className="btn btn-primary" style={{ flex: 1, textDecoration: "none", textAlign: "center" }}>
                  Start Free
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-btn { display: block !important; }
        }
      `}</style>
    </motion.header>
  );
}

/* ================================================================
   HERO SECTION
   ================================================================ */
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const platforms = [
    { icon: Camera, label: "Instagram", color: "#E4405F" },
    { icon: Video, label: "YouTube", color: "#FF0000" },
    { icon: Briefcase, label: "LinkedIn", color: "#0A66C2" },
  ];

  return (
    <section ref={ref} style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 72, overflow: "hidden" }}>
      {/* Background mesh gradients */}
      <motion.div style={{ y: bgY }} className="mesh-bg">
        <div className="mesh-orb" style={{ width: 700, height: 700, top: "-10%", left: "20%", background: "radial-gradient(circle, rgba(108,71,255,0.12) 0%, transparent 70%)" }} />
        <div className="mesh-orb" style={{ width: 500, height: 500, top: "30%", right: "-5%", background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)" }} />
        <div className="mesh-orb" style={{ width: 400, height: 400, bottom: "-5%", left: "5%", background: "radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 70%)" }} />
      </motion.div>

      {/* Grid pattern */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 0, opacity: 0.03,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }} />

      <motion.div style={{ opacity }} className="container" >
        <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          {/* Badge */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
            <span className="badge" style={{ marginBottom: 28, display: "inline-flex" }}>
              <Sparkles size={14} /> #1 AI Content Tool for Indian Creators
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1} className="heading-xl" style={{ marginBottom: 24 }}>
            Turn Trends into{" "}
            <span className="text-gradient">Viral Scripts</span>
            <br />
            <span style={{ color: "var(--text-secondary)", fontWeight: 600 }}>
              In Your Voice. In Hinglish.
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2} className="body-lg" style={{ maxWidth: 640, margin: "0 auto 36px", color: "var(--text-secondary)" }}>
            The only AI content engine that learns YOUR tone from past posts, scrapes trending topics
            in real-time, and generates production-ready scripts — in Hindi, English, or Hinglish.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3} style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
            <a href="#pricing" className="btn btn-primary btn-lg" style={{ textDecoration: "none" }}>
              Start Free — No Credit Card <ArrowRight size={18} />
            </a>
            <a href="#how-it-works" className="btn btn-secondary btn-lg" style={{ textDecoration: "none" }}>
              <Play size={18} /> Watch Demo
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            {/* Stars */}
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />
              ))}
              <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginLeft: 4 }}>4.9/5</span>
            </div>
            <div style={{ width: 1, height: 20, background: "var(--border-default)" }} />
            <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              Trusted by <strong style={{ color: "var(--text-primary)" }}>5,000+</strong> Indian creators
            </span>
            <div style={{ width: 1, height: 20, background: "var(--border-default)" }} className="hide-mobile" />
            <div style={{ display: "flex", gap: 8 }} className="hide-mobile">
              {platforms.map((p) => (
                <div key={p.label} style={{ width: 28, height: 28, borderRadius: 6, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <p.icon size={14} color={p.color} />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={5}
            style={{ marginTop: 60, position: "relative" }}
          >
            <div style={{
              position: "absolute", inset: -2, borderRadius: 20,
              background: "linear-gradient(135deg, rgba(108,71,255,0.3), transparent 40%, transparent 60%, rgba(255,107,53,0.2))",
              filter: "blur(1px)",
            }} />
            <div style={{
              position: "relative",
              borderRadius: 18,
              overflow: "hidden",
              background: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
              boxShadow: "0 20px 80px rgba(0,0,0,0.5), 0 0 60px rgba(108,71,255,0.1)",
            }}>
              {/* Fake browser chrome */}
              <div style={{
                padding: "12px 16px", background: "var(--bg-elevated)",
                borderBottom: "1px solid var(--border-subtle)",
                display: "flex", alignItems: "center", gap: 8
              }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 99, background: "#EF4444" }} />
                  <div style={{ width: 12, height: 12, borderRadius: 99, background: "#F59E0B" }} />
                  <div style={{ width: 12, height: 12, borderRadius: 99, background: "#22C55E" }} />
                </div>
                <div style={{
                  flex: 1, marginLeft: 12, height: 28, borderRadius: 6,
                  background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: "0.75rem", color: "var(--text-muted)"
                }}>
                  app.creatoraipro.com/dashboard
                </div>
              </div>
              {/* Dashboard content mock */}
              <div style={{ padding: 24, minHeight: 380 }}>
                <DashboardMock />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <style jsx>{`
        @media (max-width: 640px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </section>
  );
}

/* Dashboard mock UI inside hero */
function DashboardMock() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20 }}>
      {/* Sidebar mock */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }} className="hide-on-small">
        {[
          { icon: Zap, label: "Dashboard", active: true },
          { icon: TrendingUp, label: "Hot Topics" },
          { icon: PenTool, label: "Script Writer" },
          { icon: Hash, label: "Captions" },
          { icon: Calendar, label: "Calendar" },
          { icon: BarChart3, label: "Analytics" },
          { icon: Brain, label: "Voice DNA" },
        ].map((item) => (
          <div key={item.label} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
            borderRadius: 8, fontSize: "0.85rem", fontWeight: item.active ? 600 : 400,
            background: item.active ? "rgba(108,71,255,0.12)" : "transparent",
            color: item.active ? "var(--primary-light)" : "var(--text-muted)",
            border: item.active ? "1px solid rgba(108,71,255,0.2)" : "1px solid transparent"
          }}>
            <item.icon size={16} />
            {item.label}
          </div>
        ))}
      </div>

      {/* Main content area */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Top stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { label: "Scripts Generated", value: "1,247", change: "+12%", color: "var(--primary-light)" },
            { label: "Engagement Rate", value: "8.4%", change: "+3.2%", color: "var(--success)" },
            { label: "Trends Tracked", value: "58", change: "+5 new", color: "var(--accent)" },
          ].map((stat) => (
            <div key={stat.label} style={{
              background: "rgba(255,255,255,0.03)", borderRadius: 10,
              padding: "14px 16px", border: "1px solid var(--border-subtle)"
            }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text-primary)" }}>{stat.value}</span>
                <span style={{ fontSize: "0.7rem", color: stat.color, fontWeight: 600 }}>{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Script generation area */}
        <div style={{
          background: "rgba(255,255,255,0.02)", borderRadius: 12,
          padding: "18px 20px", border: "1px solid var(--border-subtle)",
          flex: 1
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>🔥 Trending Now — Generate Script</span>
            <span className="badge" style={{ fontSize: "0.65rem", padding: "4px 10px" }}>AI Powered</span>
          </div>
          {/* Fake trending topics */}
          {[
            { topic: "iPhone 16 Pro Review in 60 Seconds", score: 94, platform: "Reels" },
            { topic: "5 AI Tools That Replace Your Entire Team", score: 89, platform: "YouTube" },
            { topic: "Morning Routine That Made Me ₹1 Lakh/Month", score: 86, platform: "Shorts" },
          ].map((topic, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 12px", borderRadius: 8, marginBottom: 6,
              background: i === 0 ? "rgba(108,71,255,0.06)" : "transparent",
              border: i === 0 ? "1px solid rgba(108,71,255,0.15)" : "1px solid transparent",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: `rgba(${i === 0 ? "108,71,255" : i === 1 ? "255,107,53" : "34,197,94"},0.15)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.7rem", fontWeight: 700, color: i === 0 ? "var(--primary-light)" : i === 1 ? "var(--accent)" : "var(--success)"
                }}>
                  {topic.score}
                </div>
                <span style={{ fontSize: "0.8rem", color: "var(--text-primary)" }}>{topic.topic}</span>
              </div>
              <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", background: "rgba(255,255,255,0.05)", padding: "3px 8px", borderRadius: 4 }}>{topic.platform}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .hide-on-small { display: none !important; }
        }
      `}</style>
    </div>
  );
}

/* ================================================================
   LOGO WALL
   ================================================================ */
function LogoWall() {
  const logos = ["YouTube", "Instagram", "LinkedIn", "Twitter/X", "Spotify", "Threads"];
  return (
    <Section className="" id="logos">
      <div className="container" style={{ textAlign: "center" }}>
        <motion.p variants={fadeUp} className="body-sm" style={{ marginBottom: 24, textTransform: "uppercase", letterSpacing: "0.08em", fontSize: "0.75rem" }}>
          Generate content for all major platforms
        </motion.p>
        <motion.div variants={fadeUp} custom={1} style={{
          display: "flex", justifyContent: "center", alignItems: "center",
          gap: "clamp(24px, 5vw, 56px)", flexWrap: "wrap", opacity: 0.4
        }}>
          {logos.map((logo) => (
            <span key={logo} style={{ fontSize: "1rem", fontWeight: 600, letterSpacing: "-0.01em", color: "var(--text-secondary)" }}>
              {logo}
            </span>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

/* ================================================================
   PROBLEM SECTION
   ================================================================ */
function ProblemSection() {
  const problems = [
    {
      icon: Clock, title: "6–10 Hours Wasted Weekly",
      desc: "Staring at a blank page, manually researching trends, and rewriting scripts from scratch — every single time.",
    },
    {
      icon: Globe, title: "Generic AI, No Indian Context",
      desc: "ChatGPT and Jasper don't understand Hinglish slang, Indian trends, or local cultural references that make content viral.",
    },
    {
      icon: Target, title: "Your Voice Gets Lost",
      desc: "AI-generated content sounds robotic and generic. Your audience notices. Engagement drops. Followers unsubscribe.",
    },
    {
      icon: Layers, title: "10 Tools, Zero Integration",
      desc: "One tool for trends, another for writing, one for scheduling, another for analytics. The workflow is broken.",
    },
  ];

  return (
    <Section id="problem">
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 56px" }}>
          <motion.span variants={fadeUp} className="badge" style={{ marginBottom: 16 }}>
            <Bolt size={14} /> The Creator's Problem
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="heading-lg" style={{ marginBottom: 16 }}>
            Great Creators Shouldn't Be<br />
            <span className="text-gradient">Content Factories</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="body-lg">
            You became a creator to share ideas, not to spend hours writing scripts. Here's what's killing your workflow:
          </motion.p>
        </div>

        <div className="grid-2" style={{ maxWidth: 900, margin: "0 auto" }}>
          {problems.map((p, i) => (
            <motion.div key={p.title} variants={scaleIn} custom={i} className="card" style={{ display: "flex", gap: 16 }}>
              <div className="feature-icon feature-icon-accent">
                <p.icon size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: 8, color: "var(--text-primary)" }}>{p.title}</h3>
                <p className="body-md" style={{ fontSize: "0.9rem" }}>{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ================================================================
   HOW IT WORKS
   ================================================================ */
function HowItWorksSection() {
  const steps = [
    {
      num: "01", icon: Users, title: "Connect Your Profiles",
      desc: "Link your Instagram, YouTube, or LinkedIn. We import your past content to learn your unique voice.",
      color: "var(--primary-light)"
    },
    {
      num: "02", icon: Brain, title: "AI Learns Your Voice",
      desc: "Our Voice DNA engine analyzes your vocabulary, tone, sentence patterns, and cultural references — creating a unique fingerprint.",
      color: "var(--accent)"
    },
    {
      num: "03", icon: TrendingUp, title: "Discover Hot Topics",
      desc: "Real-time trend intelligence scrapes viral content across platforms, clustered by your niche and scored by viral potential.",
      color: "var(--success)"
    },
    {
      num: "04", icon: Send, title: "Generate, Edit, Publish",
      desc: "One click generates a production-ready script in YOUR voice. Edit in-browser, schedule, and auto-publish — all from one dashboard.",
      color: "var(--info)"
    },
  ];

  return (
    <Section id="how-it-works">
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 64px" }}>
          <motion.span variants={fadeUp} className="badge" style={{ marginBottom: 16 }}>
            <Rocket size={14} /> Simple 4-Step Workflow
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="heading-lg" style={{ marginBottom: 16 }}>
            From Blank Page to{" "}
            <span className="text-gradient">Published Post</span>
            <br />in Under 5 Minutes
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="body-lg">
            No learning curve. No prompt engineering. Just pick a trend and let AI do the heavy lifting — in your voice.
          </motion.p>
        </div>

        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative" }}>
          {/* Connecting line */}
          <div style={{
            position: "absolute", left: 32, top: 0, bottom: 0, width: 2,
            background: "linear-gradient(180deg, var(--primary), var(--accent), var(--success), var(--info))",
            opacity: 0.2
          }} className="hide-mobile" />

          {steps.map((step, i) => (
            <motion.div key={step.num} variants={fadeUp} custom={i} style={{
              display: "flex", gap: 28, marginBottom: i < steps.length - 1 ? 48 : 0,
              position: "relative"
            }}>
              {/* Step number circle */}
              <div style={{
                width: 64, height: 64, borderRadius: "50%", flexShrink: 0,
                background: `rgba(${step.color === "var(--primary-light)" ? "108,71,255" : step.color === "var(--accent)" ? "255,107,53" : step.color === "var(--success)" ? "34,197,94" : "59,130,246"},0.1)`,
                border: `2px solid ${step.color}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.8rem", fontWeight: 800, color: step.color, letterSpacing: "0.05em",
                position: "relative", zIndex: 1
              }}>
                {step.num}
              </div>

              <div style={{ flex: 1, paddingTop: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <step.icon size={20} color={step.color} />
                  <h3 className="heading-sm" style={{ margin: 0 }}>{step.title}</h3>
                </div>
                <p className="body-md" style={{ maxWidth: 500 }}>{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </Section>
  );
}

/* ================================================================
   FEATURES SECTION
   ================================================================ */
function FeaturesSection() {
  const features = [
    {
      icon: Brain, title: "Voice DNA Fingerprinting",
      desc: "Upload past Reels or paste captions. AI extracts your vocabulary, sentence patterns, CTA style, and emotional tone — then applies it to every script.",
      tag: "UNIQUE", iconClass: "feature-icon-primary"
    },
    {
      icon: TrendingUp, title: "Real-Time Trend Intelligence",
      desc: "Scrapes YouTube Trending, Instagram Explore, and Twitter — clusters topics by your niche and scores each by viral potential.",
      tag: "LIVE", iconClass: "feature-icon-accent"
    },
    {
      icon: PenTool, title: "AI Script Writer",
      desc: "Generate production-ready scripts with hooks, timestamps, B-roll suggestions, and CTAs. In Hindi, English, or Hinglish. With Devanagari toggle.",
      tag: "CORE", iconClass: "feature-icon-info"
    },
    {
      icon: Hash, title: "Caption & Hashtag AI",
      desc: "One-click captions with 30 hyper-targeted hashtags. Platform-specific formatting for Instagram, YouTube, and LinkedIn.",
      tag: "SMART", iconClass: "feature-icon-success"
    },
    {
      icon: Eye, title: "Competitor Analyzer",
      desc: "Enter any handle — get their top viral posts, hook breakdowns, posting schedules, and content gaps YOU can fill.",
      tag: "INTEL", iconClass: "feature-icon-primary"
    },
    {
      icon: Calendar, title: "Visual Content Calendar",
      desc: "Drag-and-drop scheduling across platforms. Color-coded by content type. Bulk import. Repeating series. Team collaboration.",
      tag: "PLAN", iconClass: "feature-icon-accent"
    },
    {
      icon: Repeat, title: "1 Video → 5 Content Pieces",
      desc: "Upload a Reel or podcast. Auto-generate LinkedIn post, Twitter thread, blog draft, email snippet, and carousel text.",
      tag: "REPURPOSE", iconClass: "feature-icon-info"
    },
    {
      icon: BarChart3, title: "Performance Analytics Flywheel",
      desc: "Post metrics feed back into recommendations. Learn which hooks, lengths, and topics work best for YOUR audience. Gets smarter over time.",
      tag: "MOAT", iconClass: "feature-icon-success"
    },
    {
      icon: Send, title: "Direct Publishing",
      desc: "Auto-publish to Instagram, YouTube, and LinkedIn from CreatorAI Pro. Optimal timing AI suggests the best post times.",
      tag: "NEW", iconClass: "feature-icon-primary"
    },
  ];

  return (
    <Section id="features">
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 56px" }}>
          <motion.span variants={fadeUp} className="badge" style={{ marginBottom: 16 }}>
            <Cpu size={14} /> Powerful Features
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="heading-lg" style={{ marginBottom: 16 }}>
            Everything You Need to{" "}
            <span className="text-gradient">Create, Schedule & Grow</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="body-lg">
            Not just another AI writer. A complete content operations platform built natively for Indian creators.
          </motion.p>
        </div>

        <div className="grid-3">
          {features.map((f, i) => (
            <motion.div key={f.title} variants={scaleIn} custom={i} className="gradient-border" style={{ padding: 28 }}>
              <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", marginBottom: 14 }}>
                <div className={`feature-icon ${f.iconClass}`}>
                  <f.icon size={24} />
                </div>
                <span style={{
                  fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em",
                  padding: "3px 8px", borderRadius: 4,
                  background: "rgba(108,71,255,0.1)", color: "var(--primary-light)"
                }}>
                  {f.tag}
                </span>
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: 8, color: "var(--text-primary)" }}>{f.title}</h3>
              <p className="body-sm" style={{ lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ================================================================
   STATS BAR
   ================================================================ */
function StatsBar() {
  const stats = [
    { value: "5,000+", label: "Active Creators" },
    { value: "2.4M+", label: "Scripts Generated" },
    { value: "10×", label: "Faster Workflow" },
    { value: "98%", label: "Hinglish Accuracy" },
  ];

  return (
    <Section>
      <div className="container">
        <motion.div variants={fadeUp} style={{
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0,
          background: "var(--bg-surface)", borderRadius: "var(--radius-xl)",
          border: "1px solid var(--border-subtle)", overflow: "hidden"
        }}>
          {stats.map((s, i) => (
            <div key={s.label} className="stat-item" style={{
              borderRight: i < 3 ? "1px solid var(--border-subtle)" : "none"
            }}>
              <div className="stat-number text-gradient">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .stat-item { border-right: none !important; border-bottom: 1px solid var(--border-subtle); }
        }
      `}</style>
    </Section>
  );
}

/* ================================================================
   AGENCY SECTION
   ================================================================ */
function AgencySection() {
  const agencyFeatures = [
    { icon: Users, title: "Multi-Creator Seats", desc: "Manage 25+ creators under one agency account" },
    { icon: Shield, title: "Role-Based Access", desc: "Owner → Manager → Creator permission levels" },
    { icon: Check, title: "Approval Workflows", desc: "Manager creates → Creator approves → Auto-publish" },
    { icon: Crown, title: "White-Label Reports", desc: "PDF/CSV exports with your agency branding" },
    { icon: Calendar, title: "Unified Calendar", desc: "See all creators' schedules in one view" },
    { icon: BarChart3, title: "Agency Analytics", desc: "Cross-creator performance dashboards" },
  ];

  return (
    <Section id="agency">
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          {/* Left: Content */}
          <div>
            <motion.span variants={fadeUp} className="badge" style={{ marginBottom: 16, background: "rgba(255,107,53,0.12)", color: "var(--accent-light)", borderColor: "rgba(255,107,53,0.2)" }}>
              <Trophy size={14} /> For Agencies & Teams
            </motion.span>
            <motion.h2 variants={fadeUp} custom={1} className="heading-lg" style={{ marginBottom: 16 }}>
              One Dashboard for{" "}
              <span className="text-gradient-accent">All Your Creators</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} className="body-lg" style={{ marginBottom: 32 }}>
              Manage 50+ creators, approve scripts, generate white-label reports, and track cross-creator analytics — from one agency dashboard.
            </motion.p>

            {/* ROI Calculator */}
            <motion.div variants={fadeUp} custom={3} style={{
              background: "rgba(255,107,53,0.06)", borderRadius: "var(--radius-lg)",
              border: "1px solid rgba(255,107,53,0.15)", padding: 24, marginBottom: 28
            }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--accent)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                💰 ROI Calculator
              </div>
              <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                20 creators × 4 scripts/week × 6 hrs/script ={" "}
                <strong style={{ color: "var(--text-primary)" }}>480 hrs/week saved</strong>
                <br />
                That's <strong style={{ color: "var(--accent)" }}>₹2,88,000/month</strong> in content team costs — replaced by one ₹4,999/mo plan.
              </div>
            </motion.div>

            <motion.div variants={fadeUp} custom={4}>
              <a href="#pricing" className="btn btn-accent btn-lg" style={{ textDecoration: "none" }}>
                Start Agency Trial <ArrowRight size={18} />
              </a>
            </motion.div>
          </div>

          {/* Right: Feature cards */}
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {agencyFeatures.map((f, i) => (
                <motion.div key={f.title} variants={scaleIn} custom={i} className="card" style={{ padding: 20 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 8,
                    background: "rgba(255,107,53,0.1)", border: "1px solid rgba(255,107,53,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12,
                    color: "var(--accent-light)"
                  }}>
                    <f.icon size={18} />
                  </div>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: 600, marginBottom: 6, color: "var(--text-primary)" }}>{f.title}</h4>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .container > div { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </Section>
  );
}

/* ================================================================
   TESTIMONIALS
   ================================================================ */
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Priya Sharma", handle: "@priyacreates", avatar: "PS",
      text: "CreatorAI Pro literally cut my content creation time by 80%. The Hinglish scripts sound EXACTLY like how I talk. My followers couldn't tell the difference!",
      stat: "28K followers gained", platform: "Instagram", rating: 5,
    },
    {
      name: "Rajesh Kumar", handle: "@techrajesh", avatar: "RK",
      text: "The trend intelligence is insane. I was the first creator in my niche to cover 3 viral topics last month. My views went from 10K to 150K average.",
      stat: "15× more views", platform: "YouTube", rating: 5,
    },
    {
      name: "Sneha Patel", handle: "@contentqueensneha", avatar: "SP",
      text: "As an agency managing 15 creators, the multi-seat dashboard and approval workflows saved us from hiring 2 additional content managers. Game changer.",
      stat: "₹3L/month saved", platform: "Agency", rating: 5,
    },
    {
      name: "Arjun Menon", handle: "@arjuntalks", avatar: "AM",
      text: "Best tool for Indian creators, period. The Voice DNA feature is so accurate — it even picks up my Malayali-English mix and uses it perfectly in scripts.",
      stat: "10× faster workflow", platform: "LinkedIn", rating: 5,
    },
  ];

  return (
    <Section id="testimonials">
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 56px" }}>
          <motion.span variants={fadeUp} className="badge" style={{ marginBottom: 16 }}>
            <MessageSquare size={14} /> Creator Love
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="heading-lg" style={{ marginBottom: 16 }}>
            Trusted by India's{" "}
            <span className="text-gradient">Top Creators</span>
          </motion.h2>
        </div>

        <div className="grid-2" style={{ maxWidth: 1000, margin: "0 auto" }}>
          {testimonials.map((t, i) => (
            <motion.div key={t.name} variants={scaleIn} custom={i} className="card" style={{ position: "relative" }}>
              {/* Rating stars */}
              <div style={{ display: "flex", gap: 3, marginBottom: 16 }}>
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={14} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>

              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>
                &ldquo;{t.text}&rdquo;
              </p>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: "var(--gradient-primary)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.8rem", fontWeight: 700, color: "white"
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>{t.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{t.handle}</div>
                  </div>
                </div>
                <div style={{
                  padding: "4px 10px", borderRadius: 6, fontSize: "0.7rem", fontWeight: 700,
                  background: "rgba(34,197,94,0.1)", color: "var(--success)",
                  border: "1px solid rgba(34,197,94,0.2)"
                }}>
                  {t.stat}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ================================================================
   PRICING SECTION
   ================================================================ */
function PricingSection() {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: "Free", price: { monthly: 0, annual: 0 }, popular: false,
      desc: "Try the engine — no commitment",
      features: [
        "3 scripts/month", "5 captions/month", "1 competitor scan",
        "Basic trend feed", "Email support"
      ],
      cta: "Get Started Free", ctaClass: "btn btn-secondary btn-lg"
    },
    {
      name: "Creator", price: { monthly: 399, annual: 299 }, popular: false,
      desc: "For solo creators who post consistently",
      features: [
        "50 scripts/month", "50 captions/month", "10 competitor scans",
        "Voice DNA profiling", "Content calendar", "Hinglish support",
        "Priority support"
      ],
      cta: "Start Creator Plan", ctaClass: "btn btn-secondary btn-lg"
    },
    {
      name: "Pro", price: { monthly: 999, annual: 799 }, popular: true,
      desc: "For full-time creators who want the edge",
      features: [
        "Unlimited scripts", "Unlimited captions", "Unlimited scans",
        "Voice DNA + refinement", "Direct publishing", "Performance analytics",
        "Content repurposing", "3 team seats", "24/7 priority support"
      ],
      cta: "Start Pro Plan", ctaClass: "btn btn-primary btn-lg"
    },
    {
      name: "Agency", price: { monthly: 4999, annual: 3999 }, popular: false,
      desc: "For agencies managing multiple creators",
      features: [
        "Everything in Pro", "25 creator seats", "White-label reports",
        "Approval workflows", "Agency analytics dashboard",
        "Role-based access control", "Custom onboarding", "Dedicated account manager"
      ],
      cta: "Start Agency Trial", ctaClass: "btn btn-accent btn-lg"
    },
  ];

  return (
    <Section id="pricing">
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: 700, margin: "0 auto 40px" }}>
          <motion.span variants={fadeUp} className="badge" style={{ marginBottom: 16 }}>
            <Crown size={14} /> Simple Pricing
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="heading-lg" style={{ marginBottom: 16 }}>
            Plans That Grow{" "}
            <span className="text-gradient">With You</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="body-lg">
            Start free, upgrade when you're ready. All plans include Hinglish support and AI-powered everything.
          </motion.p>
        </div>

        {/* Toggle */}
        <motion.div variants={fadeUp} custom={3} style={{ display: "flex", justifyContent: "center", marginBottom: 48, alignItems: "center", gap: 16 }}>
          <div className="pricing-toggle">
            <button className={!annual ? "active" : ""} onClick={() => setAnnual(false)}>Monthly</button>
            <button className={annual ? "active" : ""} onClick={() => setAnnual(true)}>Annual</button>
          </div>
          {annual && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--success)", background: "rgba(34,197,94,0.1)", padding: "4px 12px", borderRadius: 99 }}
            >
              Save up to 25%
            </motion.span>
          )}
        </motion.div>

        <div className="grid-4" style={{ alignItems: "start" }}>
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              variants={scaleIn}
              custom={i}
              className={plan.popular ? "animated-gradient-border" : "gradient-border"}
              style={{
                padding: 0,
                position: "relative",
                background: plan.popular ? "var(--bg-card)" : "var(--bg-card)",
              }}
            >
              {plan.popular && (
                <div style={{
                  position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                  background: "var(--gradient-primary)", color: "white",
                  padding: "4px 16px", borderRadius: 99, fontSize: "0.7rem", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap",
                  boxShadow: "0 4px 16px rgba(108,71,255,0.3)"
                }}>
                  Most Popular
                </div>
              )}

              <div style={{ padding: "32px 28px" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>{plan.name}</div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                  <span style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
                    ₹{annual ? plan.price.annual : plan.price.monthly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>/month</span>
                  )}
                </div>
                {annual && plan.price.monthly > 0 && (
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textDecoration: "line-through", marginBottom: 4 }}>
                    ₹{plan.price.monthly}/month
                  </div>
                )}
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 24 }}>{plan.desc}</p>

                <a href="#" className={plan.ctaClass} style={{ textDecoration: "none", width: "100%", marginBottom: 24 }}>
                  {plan.cta}
                </a>

                <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 20 }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <Check size={16} color="var(--success)" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ================================================================
   FAQ SECTION
   ================================================================ */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does Voice DNA work?",
      a: "Upload your past Reels or paste 10+ captions/scripts. Our AI (powered by GPT-4o + Whisper) analyzes your vocabulary, sentence patterns, emotional tone, CTA style, and cultural references — creating a unique Voice DNA fingerprint. Every script we generate is then filtered through this profile so it sounds authentically like you."
    },
    {
      q: "Does it support Hindi and Hinglish?",
      a: "Absolutely! We're the only AI content tool built natively for Indian languages. We support pure Hindi (Devanagari script), pure English, and Hinglish (Roman script). You can toggle between Devanagari and Roman transliteration in the script editor."
    },
    {
      q: "How is this different from ChatGPT or Jasper?",
      a: "ChatGPT and Jasper are generic AI writing tools. CreatorAI Pro is built specifically for Indian content creators. We offer: (1) Voice DNA that learns YOUR tone, (2) Real-time Indian trend intelligence, (3) Hinglish-native scripts, (4) Direct publishing to Instagram/YouTube/LinkedIn, (5) Performance analytics that make recommendations smarter over time. Plus, we're priced in INR at 5-10× less than Western tools."
    },
    {
      q: "Can I publish directly from CreatorAI Pro?",
      a: "Yes! Connect your Instagram, YouTube, and LinkedIn accounts. You can schedule and auto-publish Reels, Shorts, and posts directly from our content calendar. We also suggest optimal posting times based on your audience engagement history."
    },
    {
      q: "What if I manage multiple creators?",
      a: "Our Agency plan supports up to 25 creator seats with role-based access (Owner → Manager → Creator). Each creator gets their own Voice DNA profile. Managers can create content, send it for creator approval, and track cross-creator analytics — all from one dashboard."
    },
    {
      q: "Is my data safe? Do you share my content?",
      a: "Your content is yours. We never use your scripts, Voice DNA, or analytics data to train AI models or share with third parties. All data is encrypted at rest and in transit. You can delete your account and all associated data at any time."
    },
    {
      q: "What platforms do you scrape for trends?",
      a: "We pull trending data from YouTube Trending (via official API), Instagram Explore (via official Graph API), Twitter/X Trends, and Google Trends India. All through official APIs or ethical data providers — nothing that violates platform terms of service."
    },
    {
      q: "Can I try before I pay?",
      a: "Yes! Our Free plan gives you 3 scripts and 5 captions per month — no credit card required. That's enough to see the quality difference. When you're ready to go pro, upgrade in one click with UPI, cards, or net banking."
    },
    {
      q: "Do you offer annual billing?",
      a: "Yes! Switch to annual billing and save up to 25%. Annual plans also include priority onboarding and bonus credits. You can switch between monthly and annual at any time from your billing settings."
    },
    {
      q: "What happens if I hit my script limit?",
      a: "You'll see a friendly usage meter in your dashboard showing how many scripts you have left. When you hit the limit, you can either wait for the next billing cycle reset, or upgrade to a higher plan instantly. We'll never cut you off mid-script."
    },
  ];

  return (
    <Section id="faq">
      <div className="container" style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <motion.span variants={fadeUp} className="badge" style={{ marginBottom: 16 }}>
            <MessageSquare size={14} /> FAQ
          </motion.span>
          <motion.h2 variants={fadeUp} custom={1} className="heading-lg">
            Got Questions?{" "}
            <span className="text-gradient">We've Got Answers</span>
          </motion.h2>
        </div>

        <motion.div variants={fadeUp} custom={2}>
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <button className="faq-question" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
                <span>{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={20} color="var(--text-muted)" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="faq-answer">{faq.a}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </Section>
  );
}

/* ================================================================
   CTA BANNER
   ================================================================ */
function CTABanner() {
  return (
    <Section>
      <div className="container">
        <motion.div
          variants={fadeUp}
          style={{
            position: "relative", borderRadius: "var(--radius-xl)", padding: "clamp(40px, 6vw, 80px)",
            textAlign: "center", overflow: "hidden",
            background: "linear-gradient(135deg, rgba(108,71,255,0.15) 0%, rgba(168,85,247,0.1) 50%, rgba(255,107,53,0.08) 100%)",
            border: "1px solid rgba(108,71,255,0.2)",
          }}
        >
          {/* Glow orbs */}
          <div style={{
            position: "absolute", width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(108,71,255,0.15), transparent 70%)",
            top: "-50%", left: "-10%", filter: "blur(60px)"
          }} />
          <div style={{
            position: "absolute", width: 300, height: 300, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,107,53,0.1), transparent 70%)",
            bottom: "-40%", right: "-5%", filter: "blur(60px)"
          }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <h2 className="heading-lg" style={{ marginBottom: 16 }}>
              Ready to Create{" "}
              <span className="text-gradient">10× Faster?</span>
            </h2>
            <p className="body-lg" style={{ maxWidth: 550, margin: "0 auto 32px" }}>
              Join 5,000+ Indian creators who've already transformed their content workflow with AI.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="#pricing" className="btn btn-primary btn-lg" style={{ textDecoration: "none" }}>
                Start Free Today <ArrowRight size={18} />
              </a>
              <a href="#how-it-works" className="btn btn-secondary btn-lg" style={{ textDecoration: "none" }}>
                See How It Works
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

/* ================================================================
   FOOTER
   ================================================================ */
function Footer() {
  const footerLinks = {
    Product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Agency Plan", href: "#agency" },
      { label: "Changelog", href: "#" },
      { label: "Roadmap", href: "#" },
    ],
    Resources: [
      { label: "Blog", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "API Docs", href: "#" },
      { label: "Script Templates", href: "#" },
      { label: "Creator Guides", href: "#" },
    ],
    Company: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  };

  return (
    <footer style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: 64, paddingBottom: 32 }}>
      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: "var(--gradient-primary)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 20px rgba(108,71,255,0.3)"
              }}>
                <Sparkles size={20} color="white" />
              </div>
              <span style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "-0.02em" }}>
                Creator<span style={{ color: "var(--primary-light)" }}>AI</span> Pro
              </span>
            </div>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 300, marginBottom: 20 }}>
              The AI content engine built for the Indian creator economy. Turn trends into viral scripts — in your voice, in Hinglish.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {[Camera, Video, Briefcase].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-subtle)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text-muted)", textDecoration: "none", transition: "all 0.2s"
                }}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
                {category}
              </div>
              {links.map((link) => (
                <a key={link.label} href={link.href} style={{
                  display: "block", fontSize: "0.85rem", color: "var(--text-muted)",
                  textDecoration: "none", marginBottom: 10, transition: "color 0.2s"
                }}>
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <hr className="section-divider" />

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: 24, flexWrap: "wrap", gap: 16
        }}>
          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            © 2026 CreatorAI Pro. All rights reserved.
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-disabled)" }}>Made with</span>
            <span style={{ color: "var(--accent)" }}>❤️</span>
            <span style={{ fontSize: "0.75rem", color: "var(--text-disabled)" }}>in India 🇮🇳</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        footer a:hover { color: var(--text-primary) !important; }
        @media (max-width: 768px) {
          footer .container > div:first-child {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 480px) {
          footer .container > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}

/* ================================================================
   MAIN PAGE
   ================================================================ */
export default function Home() {
  return (
    <main>
      <Header />
      <HeroSection />
      <LogoWall />
      <hr className="section-divider" />
      <ProblemSection />
      <hr className="section-divider" />
      <HowItWorksSection />
      <hr className="section-divider" />
      <FeaturesSection />
      <StatsBar />
      <hr className="section-divider" />
      <AgencySection />
      <hr className="section-divider" />
      <TestimonialsSection />
      <hr className="section-divider" />
      <PricingSection />
      <hr className="section-divider" />
      <FAQSection />
      <CTABanner />
      <Footer />
    </main>
  );
}
