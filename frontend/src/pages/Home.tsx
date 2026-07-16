import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, ShoppingBag, Award, ShieldCheck, ArrowRight, Star, Cpu, MessageSquare, TrendingUp } from 'lucide-react';

const Home: React.FC = () => {
  const { t } = useTranslation();

  const statistics = [
    { label: 'Enrolled Students', value: '1,200+', icon: BookOpen, color: 'text-sky-400' },
    { label: 'Graduates Certified', value: '950+', icon: Award, color: 'text-amber-400' },
    { label: 'Products In-Stock', value: '5,000+', icon: ShoppingBag, color: 'text-emerald-400' },
    { label: 'Google Rating Score', value: '4.9 ★', icon: Star, color: 'text-rose-400' },
  ];

  const coreServices = [
    {
      title: 'Computer Training Academy',
      description: 'Upgrade your digital skills with our specialized courses including COA, Python, Tally, DCA, and Hardware networking. Available in English & Tamil.',
      link: '/courses',
      cta: t('home.explore_courses'),
      icon: BookOpen,
      bg: 'from-sky-500/10 to-blue-600/10 border-sky-500/20',
      iconBg: 'bg-sky-500/15 text-sky-400',
    },
    {
      title: 'Electronics & Stationery Store',
      description: 'Explore our catalog of computer components, mouse controls, keyboard devices, writing tools, and electronic utilities at unbeatable retail prices.',
      link: '/store',
      cta: t('home.shop_now'),
      icon: ShoppingBag,
      bg: 'from-emerald-500/10 to-teal-600/10 border-emerald-500/20',
      iconBg: 'bg-emerald-500/15 text-emerald-400',
    },
  ];

  const features = [
    {
      title: 'Bilingual Support',
      desc: 'All course syllabi, manuals, and lectures are available in both English and Tamil to guarantee seamless understanding.',
      icon: Cpu,
    },
    {
      title: 'POS Barcode Scans',
      desc: 'Our in-store registers support barcode integrations to execute hyper-fast billing and checkout.',
      icon: TrendingUp,
    },
    {
      title: 'GST Tax Invoicing',
      desc: 'Automatically generated invoice layouts itemizing CGST and SGST calculations for compliance.',
      icon: ShieldCheck,
    },
    {
      title: 'AI Recommendation Bot',
      desc: 'Need advice? Consult our intelligent chatbot for course matches and component specifications.',
      icon: MessageSquare,
    },
  ];

  const testimonials = [
    {
      name: 'Ramesh Kumar',
      role: 'Python Programming Student',
      rating: 5,
      comment: 'The training materials in Tamil made learning complex coding principles very simple. The tutors are highly supportive!',
    },
    {
      name: 'Priya Dharshini',
      role: 'Customer',
      rating: 5,
      comment: 'Found premium computer accessories at great rates. The billing was fast and the GST invoice details were completely printed.',
    },
  ];

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      {/* Hero Section */}
      <section className="relative text-center py-10 md:py-16 flex flex-col items-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl -z-10 animate-pulse-subtle"></div>
        
        <div className="flex items-center gap-2 px-3 py-1 bg-sky-500/10 border border-sky-500/20 rounded-full text-xs font-semibold text-sky-400 mb-6 uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          MSME & GST Registered Institute
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl leading-tight">
          {t('home.hero_title')} <span className="text-gradient">Pradeepa Info Tech</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          {t('home.hero_subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md px-4">
          <Link
            to="/courses"
            className="px-8 py-4 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl font-bold shadow-lg shadow-sky-600/20 hover:shadow-sky-500/30 transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>{t('home.explore_courses')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/store"
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700/80 text-white border border-slate-700 rounded-2xl font-bold transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <span>{t('home.shop_now')}</span>
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
          </Link>
        </div>
      </section>

      {/* Dual Tracks Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {coreServices.map((service, index) => {
          const Icon = service.icon;
          return (
            <div
              key={index}
              className={`p-8 md:p-10 rounded-3xl border bg-gradient-to-br ${service.bg} flex flex-col justify-between hover:shadow-2xl hover:shadow-slate-950/20 transition-all duration-300 group`}
            >
              <div>
                <div className={`p-4 w-fit rounded-2xl ${service.iconBg} mb-6`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-4 font-display">
                  {service.title}
                </h2>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8">
                  {service.description}
                </p>
              </div>
              <Link
                to={service.link}
                className="inline-flex items-center gap-2 text-sm font-bold text-sky-400 hover:text-sky-300 transition-colors"
              >
                <span>{service.cta}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          );
        })}
      </section>

      {/* Key Features Grid */}
      <section className="flex flex-col gap-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-100 mb-4">
            Why Choose Pradeepa Info Tech?
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Providing legal business certifications, interactive technology frameworks, and fully accessible courses.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-slate-800/40 border border-slate-700/50 hover:border-sky-500/30 rounded-2xl transition-all duration-250 flex flex-col gap-4 group"
              >
                <div className="p-3 bg-slate-900 border border-slate-800 w-fit rounded-xl text-sky-400 group-hover:text-sky-300 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-200 font-display">
                  {feature.title}
                </h3>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Counter Statistics Section */}
      <section className="bg-slate-950/50 border border-slate-800/60 rounded-3xl py-10 px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {statistics.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="flex flex-col items-center text-center gap-2">
              <div className={`p-2.5 rounded-lg bg-slate-900 border border-slate-800 ${stat.color} mb-1`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-2xl md:text-3xl font-extrabold text-slate-100 font-display">
                {stat.value}
              </span>
              <span className="text-xs md:text-sm text-slate-500 font-medium">
                {stat.label}
              </span>
            </div>
          );
        })}
      </section>

      {/* Testimonials Review Slider */}
      <section className="flex flex-col gap-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-100 mb-4">
            Student & Customer Reviews
          </h2>
          <p className="text-slate-400 text-sm">
            Read positive statements shared by our local computer students and stationery shoppers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((test, idx) => (
            <div
              key={idx}
              className="p-8 bg-slate-800/25 border border-slate-800 rounded-3xl flex flex-col justify-between gap-6"
            >
              <p className="text-slate-300 italic text-sm md:text-base leading-relaxed">
                "{test.comment}"
              </p>
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-bold text-slate-200 text-sm md:text-base">{test.name}</span>
                  <span className="text-xs text-slate-500">{test.role}</span>
                </div>
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
