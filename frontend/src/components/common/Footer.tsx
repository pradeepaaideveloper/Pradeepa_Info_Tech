import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Clock, Award, ShieldCheck } from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Info Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-wider text-sky-400 font-display">
              Pradeepa Info Tech
            </span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Authorized Computer Training Center & Digital Product Store. Empowering students with modern technologies and providing high-quality computer accessories.
          </p>
          <div className="flex flex-wrap gap-3 mt-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md text-[10px] font-bold text-sky-400 uppercase">
              <Award className="w-3.5 h-3.5" /> MSME Registered
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md text-[10px] font-bold text-emerald-400 uppercase">
              <ShieldCheck className="w-3.5 h-3.5" /> GST Compliant
            </span>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Quick Links
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <Link to="/" className="hover:text-sky-400 transition-colors">
                {t('nav.home')}
              </Link>
            </li>
            <li>
              <Link to="/courses" className="hover:text-sky-400 transition-colors">
                {t('nav.courses')}
              </Link>
            </li>
            <li>
              <Link to="/store" className="hover:text-sky-400 transition-colors">
                {t('nav.store')}
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-sky-400 transition-colors">
                {t('nav.about')}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-sky-400 transition-colors">
                {t('nav.contact')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Popular Courses Column */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Featured Training
          </h3>
          <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
            <li className="hover:text-sky-400 transition-colors cursor-pointer">Office Automation (COA)</li>
            <li className="hover:text-sky-400 transition-colors cursor-pointer">HDCA & DCA</li>
            <li className="hover:text-sky-400 transition-colors cursor-pointer">Python Programming</li>
            <li className="hover:text-sky-400 transition-colors cursor-pointer">Web Development (HTML/CSS/JS)</li>
            <li className="hover:text-sky-400 transition-colors cursor-pointer">Tally Prime & GST Accounting</li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Contact Details
          </h3>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <span>
                123, Main Road, Near Bus Stand,<br />
                District Head Post Office area,<br />
                Tamil Nadu, India.
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4.5 h-4.5 text-sky-400" />
              <a href="tel:+919876543210" className="hover:text-sky-400 transition-colors">
                +91 98765 43210
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4.5 h-4.5 text-sky-400" />
              <a href="mailto:info@pradeepainfotech.com" className="hover:text-sky-400 transition-colors">
                info@pradeepainfotech.com
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="w-4.5 h-4.5 text-sky-400" />
              <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
            </li>
          </ul>
        </div>

      </div>

      <hr className="border-slate-900 my-8 max-w-7xl mx-auto" />

      {/* Trademark / Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
        <div>
          &copy; {new Date().getFullYear()} Pradeepa Info Tech. All rights reserved.
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-slate-400 transition-colors">GST Tax Policies</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
