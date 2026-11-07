import React, { useState } from 'react';
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
} from 'lucide-react';
import { BRAND_INFO } from '../../constants/content';
import type { ContactFormData, FormStatus } from '../../types';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import './Contact.css';

export const Contact: React.FC = () => {
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
        message: 'يرجى استكمال الحقول الإلزامية المطلوبة للمتابعة.',
        isSubmitting: false,
      });
      return;
    }

    setFormStatus((prev) => ({ ...prev, isSubmitting: true }));

    // Simulate client-side demo submission with clear transparency
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        success: true,
        message:
          'تم استلام بيانات استفساركم بنجاح (وضع العرض التجريبي). نؤكد التزامنا بالسرية التامة وسيتواصل معكم فريق العمل قريبًا.',
        isSubmitting: false,
      });
    }, 900);
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
          badge="قنوات الاتصال المباشر"
          title="تواصل مع"
          highlight="مِيثاق"
          description="نسعد باستقبال طلبات الاستشارة والاستفسارات المهنية عبر قنواتنا المعتمدة."
        />

        <div className="contact-layout-grid">
          {/* Form Side (1.2fr) */}
          <div className="contact-form-side surface-card">
            <div className="form-inner-header">
              <h3 className="form-headline">نموذج طلب التنسيق والاستفسار</h3>
              <p className="form-subtext">
                يرجى تدوين ملخص مسألتكم وسيتم توجيهها للقسم المختص بأسرع وقت.
              </p>
            </div>

            {formStatus.submitted && formStatus.success ? (
              <div className="contact-success-state">
                <div className="success-icon-badge">
                  <CheckCircle size={40} className="icon-success" />
                </div>
                <h4 className="success-heading">تم إرسال الاستفسار بنجاح</h4>
                <p className="success-desc">{formStatus.message}</p>
                <div className="demo-notice-chip">
                  <AlertCircle size={15} />
                  <span>ملاحظة تقنية: تم تفعيل هذا النموذج في بيئة المعاينة (Demo Mode).</span>
                </div>
                <Button variant="secondary" size="md" onClick={resetForm}>
                  إرسال استفسار جديد
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-actual-form" noValidate>
                {formStatus.submitted && !formStatus.success && (
                  <div className="form-error-banner">
                    <AlertCircle size={16} />
                    <span>{formStatus.message}</span>
                  </div>
                )}

                <div className="form-grid-two">
                  <div className="form-field">
                    <label htmlFor="contact-fullName" className="field-label">
                      الاسم الكامل أو اسم المنشأة <span className="req">*</span>
                    </label>
                    <input
                      id="contact-fullName"
                      name="fullName"
                      type="text"
                      required
                      placeholder="مثال: شركة التطوير العقاري"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-email" className="field-label">
                      البريد الإلكتروني <span className="req">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="form-grid-two">
                  <div className="form-field">
                    <label htmlFor="contact-phone" className="field-label">
                      رقم الهاتف / الجوال <span className="req">*</span>
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="05XXXXXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                      dir="ltr"
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="contact-inquiryType" className="field-label">
                      نوع الاستفسار أو القضية
                    </label>
                    <select
                      id="contact-inquiryType"
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="commercial">القانون التجاري وتأسيس الكيانات</option>
                      <option value="contracts">صياغة ومراجعة العقود والاتفاقيات</option>
                      <option value="litigation">التقاضي والتحكيم وفض المنازعات</option>
                      <option value="realestate">القانون العقاري والتطوير</option>
                      <option value="ip">الملكية الفكرية والعلامات التجارية</option>
                      <option value="other">استشارة قانونية أخرى</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label htmlFor="contact-message" className="field-label">
                    ملخص المسألة أو الاستفسار القانوني <span className="req">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    placeholder="يرجى ذكر موجز للوقائع والنقاط الجوهرية المراد بحثها..."
                    value={formData.message}
                    onChange={handleChange}
                    className="form-textarea"
                  />
                </div>

                <div className="form-security-reassurance">
                  <ShieldCheck size={16} className="reassurance-icon" />
                  <span>تخضع جميع المراسلات لاتفاقية سرية مهنية صارمة ولا يُفشى أي جزء منها.</span>
                </div>

                <div className="form-submit-row">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={formStatus.isSubmitting}
                    icon={<Send size={18} />}
                    iconPosition="start"
                  >
                    {formStatus.isSubmitting ? 'جاري التحقق والإرسال...' : 'إرسال طلب الاستشارة'}
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Contact Information Cards (1fr) */}
          <div className="contact-info-side">
            {/* Phone Card */}
            <div className="info-feature-card surface-card">
              <div className="info-card-icon-box">
                <Phone size={22} />
              </div>
              <div className="info-card-content">
                <span className="info-card-label">الهاتف الموحد للاستشارات</span>
                <span className="info-card-value" dir="ltr">{BRAND_INFO.phone}</span>
                <button
                  type="button"
                  className="info-copy-action"
                  onClick={() => handleCopy(BRAND_INFO.phone, 'phone')}
                >
                  {copiedField === 'phone' ? (
                    <>
                      <Check size={14} className="copied-icon" /> تم نسخ الرقم
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> نسخ رقم الهاتف
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Email Card */}
            <div className="info-feature-card surface-card">
              <div className="info-card-icon-box">
                <Mail size={22} />
              </div>
              <div className="info-card-content">
                <span className="info-card-label">البريد الإلكتروني المعتمد</span>
                <span className="info-card-value" dir="ltr">{BRAND_INFO.email}</span>
                <button
                  type="button"
                  className="info-copy-action"
                  onClick={() => handleCopy(BRAND_INFO.email, 'email')}
                >
                  {copiedField === 'email' ? (
                    <>
                      <Check size={14} className="copied-icon" /> تم نسخ البريد
                    </>
                  ) : (
                    <>
                      <Copy size={14} /> نسخ البريد الإلكتروني
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Address Card */}
            <div className="info-feature-card surface-card">
              <div className="info-card-icon-box">
                <MapPin size={22} />
              </div>
              <div className="info-card-content">
                <span className="info-card-label">المقر الرئيسي</span>
                <p className="info-card-address">{BRAND_INFO.address}</p>
                <span className="info-sub-hint">مكتب معتمد ومرخص</span>
              </div>
            </div>

            {/* Working Hours Card */}
            <div className="info-feature-card surface-card">
              <div className="info-card-icon-box">
                <Clock size={22} />
              </div>
              <div className="info-card-content">
                <span className="info-card-label">أوقات العمل الرسمية</span>
                <span className="info-card-value-small">{BRAND_INFO.workingHours}</span>
                <span className="info-sub-hint">{BRAND_INFO.consultationNote}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
