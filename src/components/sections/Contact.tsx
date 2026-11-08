import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Copy,
  Check,
  AlertCircle,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';
import { BRAND_INFO } from '../../constants/content';
import type { ContactFormData, FormStatus } from '../../types';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

export const Contact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    inquiryType: 'commercial',
    message: '',
  });

  const [formStatus, setFormStatus] = useState<FormStatus>({
    submitted: false,
    success: false,
    message: '',
    isSubmitting: false,
  });

  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading
      gsap.fromTo(
        '.contact-section .section-header',
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 82%',
            once: true,
          },
        }
      );

      // Editorial info side
      gsap.fromTo(
        '.contact-editorial-info',
        { opacity: 0, x: 30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.85,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: '.contact-editorial-split',
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Form side
      gsap.fromTo(
        '.contact-form-container',
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.85,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: '.contact-editorial-split',
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Channel cards stagger
      gsap.fromTo(
        '.contact-channel-card',
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: '.info-channels-grid',
            start: 'top 82%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'يرجى استكمال الحقول الإلزامية المطلوبة (الاسم، البريد، ورقم الهاتف).',
        isSubmitting: false,
      });
      return;
    }

    setFormStatus((prev) => ({ ...prev, isSubmitting: true }));

    // Demo Mode Simulation with full transparency
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        success: true,
        message:
          'تم استلام بيانات استفساركم بنجاح (بيئة العرض التوضيحية - Demo Mode). نؤكد التزامنا التام بالسرية المهنية، وسيتواصل معكم فريق التنسيق قريبًا.',
        isSubmitting: false,
      });
    }, 850);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      inquiryType: 'commercial',
      message: '',
    });
    setFormStatus({
      submitted: false,
      success: false,
      message: '',
      isSubmitting: false,
    });
  };

  return (
    <section id="contact" className="section contact-section">
      <div className="container">
        <SectionHeading
          badge="قنوات الاتصال المؤسسي"
          title="تواصل مع مِيثاق"
          description="نسعد باستقبال استفسارات قطاع الأعمال والمستثمرين والأفراد وترتيب جلسات الاستشارة المباشرة."
        />

        {/* Premium Split Layout: Editorial Info Intro on Left/Start + Carefully Styled Form on Right/End */}
        <div className="contact-editorial-split">
          {/* Editorial Info Side (1.05fr) */}
          <div className="contact-editorial-info">
            <div className="info-editorial-header">
              <span className="editorial-eyebrow">حوار قانوني مباشر وموثوق</span>
              <h3 className="info-main-title">
                نستمع باهتمام، <br />
                <span className="gold-gradient-text">ونجيب بدقة ومسؤولية.</span>
              </h3>
              <p className="info-narrative-paragraph">
                سواء كنت تؤسس لكيان استثماري جديد، أو تعيد صياغة عقودك وشراكاتك التجارية، أو تواجه
                نزاعًا يتطلب بناء استراتيجية قضائية محكمة، يسعدنا مناقشة خياراتك بكل وضوح وشفافية.
              </p>
            </div>

            <div className="info-channels-grid">
              {/* Phone Card */}
              <div className="contact-channel-card surface-card">
                <div className="channel-icon-box">
                  <Phone size={20} />
                </div>
                <div className="channel-body">
                  <span className="channel-label">الهاتف الموحد للاستشارات</span>
                  <span className="channel-value" dir="ltr">
                    {BRAND_INFO.phone}
                  </span>
                  <button
                    type="button"
                    className="channel-copy-btn"
                    onClick={() => handleCopy(BRAND_INFO.phone, 'phone')}
                  >
                    {copiedField === 'phone' ? (
                      <>
                        <Check size={13} className="check-green" /> تم نسخ الرقم
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> نسخ رقم الهاتف
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Email Card */}
              <div className="contact-channel-card surface-card">
                <div className="channel-icon-box">
                  <Mail size={20} />
                </div>
                <div className="channel-body">
                  <span className="channel-label">البريد الإلكتروني المعتمد</span>
                  <span className="channel-value" dir="ltr">
                    {BRAND_INFO.email}
                  </span>
                  <button
                    type="button"
                    className="channel-copy-btn"
                    onClick={() => handleCopy(BRAND_INFO.email, 'email')}
                  >
                    {copiedField === 'email' ? (
                      <>
                        <Check size={13} className="check-green" /> تم نسخ البريد
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> نسخ البريد الإلكتروني
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Address Card */}
              <div className="contact-channel-card surface-card">
                <div className="channel-icon-box">
                  <MapPin size={20} />
                </div>
                <div className="channel-body">
                  <span className="channel-label">المقر الرئيسي بالرياض</span>
                  <p className="channel-address">{BRAND_INFO.address}</p>
                </div>
              </div>

              {/* Working Hours Card */}
              <div className="contact-channel-card surface-card">
                <div className="channel-icon-box">
                  <Clock size={20} />
                </div>
                <div className="channel-body">
                  <span className="channel-label">أوقات العمل واستقبال المواعيد</span>
                  <span className="channel-time">{BRAND_INFO.workingHours}</span>
                  <span className="channel-note">{BRAND_INFO.consultationNote}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Carefully Styled Form Side (1.25fr) */}
          <div className="contact-form-container surface-card">
            <div className="form-card-header">
              <div className="form-badge-icon">
                <MessageSquare size={18} />
              </div>
              <div className="form-titles">
                <h4 className="form-card-title">نموذج طلب الاستشارة والمراسلة</h4>
                <span className="form-card-sub">يتم التعامل مع جميع البيانات بسرية مهنية مطلقة</span>
              </div>
            </div>

            {formStatus.submitted && formStatus.success ? (
              <div className="contact-form-success">
                <div className="success-badge-circle">
                  <CheckCircle size={38} className="success-svg" />
                </div>
                <h4 className="success-lead-title">تم استلام طلبكم بنجاح</h4>
                <p className="success-lead-desc">{formStatus.message}</p>

                <div className="demo-mode-alert">
                  <AlertCircle size={15} />
                  <span>تنويه المعاينة: النموذج يعمل حاليًا في نمط العرض التوضيحي (Demo Mode).</span>
                </div>

                <Button variant="secondary" size="md" onClick={resetForm}>
                  إرسال استفسار آخر
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form-actual" noValidate>
                {formStatus.submitted && !formStatus.success && (
                  <div className="form-warning-banner">
                    <AlertCircle size={16} />
                    <span>{formStatus.message}</span>
                  </div>
                )}

                <div className="form-fields-grid">
                  <div className="form-field-item">
                    <label htmlFor="contact-fullName" className="field-caption">
                      الاسم الكامل أو اسم المنشأة <span className="field-req">*</span>
                    </label>
                    <input
                      id="contact-fullName"
                      name="fullName"
                      type="text"
                      required
                      placeholder="مثال: شركة الأفق للاستثمار"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="field-text-input"
                    />
                  </div>

                  <div className="form-field-item">
                    <label htmlFor="contact-email" className="field-caption">
                      البريد الإلكتروني <span className="field-req">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="field-text-input"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="form-fields-grid">
                  <div className="form-field-item">
                    <label htmlFor="contact-phone" className="field-caption">
                      رقم الهاتف / الجوال للتواصل <span className="field-req">*</span>
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="05XXXXXXXX أو +966..."
                      value={formData.phone}
                      onChange={handleChange}
                      className="field-text-input"
                      dir="ltr"
                    />
                  </div>

                  <div className="form-field-item">
                    <label htmlFor="contact-inquiryType" className="field-caption">
                      نوع المسألة أو الاستشارة
                    </label>
                    <select
                      id="contact-inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="field-select-input"
                    >
                      <option value="commercial">القانون التجاري وقانون الشركات</option>
                      <option value="contracts">صياغة العقود والاتفاقيات</option>
                      <option value="litigation">التقاضي وتسوية المنازعات</option>
                      <option value="consultation">الاستشارات القانونية الاستراتيجية</option>
                      <option value="realestate">القانون العقاري والمعاملات العقارية</option>
                      <option value="ip">الملكية الفكرية والعلامات التجارية</option>
                      <option value="other">استفسار قانوني عام</option>
                    </select>
                  </div>
                </div>

                <div className="form-field-item">
                  <label htmlFor="contact-message" className="field-caption">
                    ملخص المسألة أو النقاط المراد بحثها
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    placeholder="يرجى تدوين موجز عن طبيعة الموضوع والوثائق المتوفرة..."
                    value={formData.message}
                    onChange={handleChange}
                    className="field-textarea-input"
                  />
                </div>

                <div className="form-confidentiality-notice">
                  <ShieldCheck size={16} className="notice-shield" />
                  <span>تخضع المراسلات لبروتوكول السرية المهنية المعمول به في مِيثاق.</span>
                </div>

                <div className="form-submit-wrapper">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={formStatus.isSubmitting}
                    icon={<Send size={18} />}
                    iconPosition="start"
                  >
                    {formStatus.isSubmitting ? 'جاري الإرسال والمراجعة...' : 'إرسال طلب الاستشارة'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
