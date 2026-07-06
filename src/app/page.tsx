"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, ShieldCheck, CheckCircle2, ChevronRight, Share2, Users, Lock, Zap, Award, Server } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[128px]" />
      </div>

      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-gold" />
          <span className="font-semibold text-lg tracking-wide">MODERATOR<span className="text-gold">PRO</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/rules" className="text-sm font-medium text-white/70 hover:text-white transition">Дүрэм</Link>
          <Link href="/admin/login" className="text-sm font-medium text-white/70 hover:text-white transition">Админ</Link>
          <Link href="/apply" className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-medium transition backdrop-blur-md">
            Өргөдөл гаргах
          </Link>
        </div>
      </nav>

      <main className="w-full max-w-6xl mx-auto px-6 pt-32 pb-20 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-gold/30 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-gold">Элсэлт нээлттэй байна</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          <span className="gold-gradient">Тэргүүлэх модератор</span> болоорой
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mb-10"
        >
          Манай элит модераторын багт нэгдээрэй. Доорх 3 нийгэмлэгт бүгдэд нь <strong className="text-white">30,000₮</strong>-өөр модератор болох боломжтой.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-20"
        >
          <Link href="/apply" className="px-8 py-4 bg-gold hover:bg-gold-hover text-black font-bold rounded-xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]">
            Модератороор өргөдөл гаргах
            <ChevronRight className="w-5 h-5" />
          </Link>
          <Link href="/rules" className="px-8 py-4 glass hover:bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 transition-all font-medium">
            Дүрэм журам үзэх
          </Link>
        </motion.div>

        {/* Facebook Groups Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="w-full mb-32"
        >
          <h2 className="text-2xl font-semibold mb-3">Манай нийгэмлэгүүд</h2>
          <p className="text-white/50 mb-10 max-w-2xl">Тус тусад нь биш — доорх 3 группд <span className="text-gold font-medium">бүгдэд нь</span> модератор болохын тулд нэгтгэн <strong className="text-white">30,000₮</strong> төлнө.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GroupCard name="Групп нэг" members="300K+" url="https://www.facebook.com/share/g/1DoJ5tjLXZ/" delay={0.1} />
            <GroupCard name="Групп хоёр" members="293K+" url="https://www.facebook.com/share/g/1E89gkyFnY/" delay={0.2} />
            <GroupCard name="Групп гурав" members="217K+" url="https://www.facebook.com/share/g/1DEvyz94Rp/" delay={0.3} />
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
        >
          <FeatureCard icon={ShieldCheck} title="Баталгаажсан хувийн мэдээлэл" desc="Аюулгүй байдлыг хангах нарийвчилсан баталгаажуулалт." delay={0.1} />
          <FeatureCard icon={Lock} title="Аюулгүй баталгаажуулалт" desc="Мэдээллийг шифрлэж, найдвартай хадгална." delay={0.2} />
          <FeatureCard icon={Zap} title="Түргэн шийдвэрлэлт" desc="Өргөдлийг 24 цагийн дотор хянан үзнэ." delay={0.3} />
          <FeatureCard icon={Award} title="Тэргүүлэх модератор" desc="Онцгой тэмдэг, нэр хүндтэй эрх мэдэл." delay={0.4} />
          <FeatureCard icon={Users} title="Итгэмжлэгдсэн баг" desc="Нийгэмлэг удирдах элит багийн нэг болоорой." delay={0.5} />
          <FeatureCard icon={Server} title="Аюулгүй сервер" desc="Дээд зэргийн үүлэн технологиор хамгаалагдсан." delay={0.6} />
        </motion.div>
      </main>
    </div>
  );
}

function GroupCard({ name, members, url, delay }: { name: string; members: string; url: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass-card rounded-2xl p-6 flex flex-col items-center text-center group animated-border hover:-translate-y-2 transition-transform duration-300"
    >
      <div className="w-16 h-16 rounded-full bg-[#1877F2]/10 flex items-center justify-center mb-4 group-hover:bg-[#1877F2]/20 transition-colors">
        <Share2 className="w-8 h-8 text-[#1877F2]" />
      </div>
      <h3 className="text-xl font-semibold mb-1">{name}</h3>
      <p className="text-gold font-bold text-2xl mb-6">{members} <span className="text-sm text-white/50 font-normal">гишүүн</span></p>
      <a href={url} target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
        Групп нээх
        <ChevronRight className="w-4 h-4" />
      </a>
    </motion.div>
  );
}

function FeatureCard({ icon: Icon, title, desc, delay }: { icon: any; title: string; desc: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass rounded-2xl p-6 border border-white/5 hover:border-gold/30 transition-colors"
    >
      <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4 text-gold">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-white/60">{desc}</p>
    </motion.div>
  );
}
