import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ShieldCheck, Video, Building, Calendar, ArrowLeft } from 'lucide-react';
import { Button } from './Button';
import './ConsultationModal.css';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ isOpen, onClose }) => {
  const [meetingType, setMeetingType] = useState<'remote' | 'office'>('remote');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('commercial');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setFullName('');
    setPhone('');
    onClose();
  };

  return (
    <div className="consult-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="consult-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="consult-close-btn" onClick={onClose} aria-label="إغلاق">
          <X size={18} />
        </button>

        {!submitted ? (
          <>
            <div className="consult-modal-header">
              <span className="consult-badge">حجز موعد استشارة رسمية</span>
              <h2 className="consult-title">ابدأ ترتيب جلستك القانونية</h2>
              <p className="consult-desc">
                تنعقد جلسات الاستشارة برعاية مستشار مختص بموضوع مسألتك، مع ضمان السرية التامة.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="consult-form">
              {/* Meeting Type Selection */}
              <div className="meeting-type-selector">
                <button
                  type="button"
                  className={`type-option ${meetingType === 'remote' ? 'active' : ''}`}
                  onClick={() => setMeetingType('remote')}
                >
                  <Video size={18} className="type-icon" />
                  <div className="type-text">
                    <span className="type-title">اتصال مرئي مشفر</span>
                    <span className="type-sub">عن بُعد عبر منصة آمنة</span>
                  </div>
                </button>

                <button
                  type="button"
                  className={`type-option ${meetingType === 'office' ? 'active' : ''}`}
                  onClick={() => setMeetingType('office')}
                >
                  <Building size={18} className="type-icon" />
                  <div className="type-text">
                    <span className="type-title">حضور بمقر المكتب</span>
                    <span className="type-sub">الرياض — حي النخيل</span>
                  </div>
                </button>
              </div>

              {/* Form Fields */}
              <div className="consult-field-group">
                <label htmlFor="modal-name" className="consult-label">
                  الاسم الكامل أو اسم المنشأة *
                </label>
                <input
                  id="modal-name"
                  type="text"
                  required
                  placeholder="مثال: شركة الأفق للاستثمار"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="consult-input"
                />
              </div>

              <div className="consult-field-group">
                <label htmlFor="modal-phone" className="consult-label">
                  رقم الهاتف للتنسيق *
                </label>
                <input
                  id="modal-phone"
                  type="tel"
                  required
                  placeholder="05XXXXXXXX أو +966..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="consult-input"
                  dir="ltr"
                />
              </div>

              <div className="consult-field-group">
                <label htmlFor="modal-topic" className="consult-label">
                  مجال الاستشارة
                </label>
                <select
                  id="modal-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="consult-select"
                >
                  <option value="commercial">القانون التجاري والشركات</option>
                  <option value="contracts">صياغة ومراجعة العقود والاتفاقيات</option>
                  <option value="litigation">التقاضي والتحكيم وتسوية النزاعات</option>
                  <option value="realestate">القانون العقاري والتطوير</option>
                  <option value="ip">الملكية الفكرية والابتكار</option>
                  <option value="general">استشارة مؤسسية عامة</option>
                </select>
              </div>

              <div className="consult-privacy-note">
                <ShieldCheck size={16} className="note-icon" />
                <span>نلتزم بأعلى معايير السرية المهنية وعدم إفشاء البيانات وفقًا للأنظمة.</span>
              </div>

              <div className="consult-form-actions">
                <Button type="submit" variant="primary" fullWidth icon={<Calendar size={18} />}>
                  تأكيد إرسال طلب الموعد
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="consult-success-view">
            <div className="success-icon-ring">
              <CheckCircle size={44} className="success-icon" />
            </div>
            <h3 className="success-title">تم استلام طلب الاستشارة بنجاح</h3>
            <p className="success-text">
              شكرًا لثقتكم بمِيثاق. تم تسجيل طلبكم وسيقوم مسؤول التنسيق القانوني بالتواصل معكم هاتفيًا
              لتأكيد الموعد المناسب وتزويدكم برابط الجلسة أو تفاصيل الزيارة.
            </p>
            <div className="success-details-card">
              <div className="success-row">
                <span className="success-row-label">نوع اللقاء:</span>
                <span className="success-row-val">{meetingType === 'remote' ? 'اتصال مرئي مشفر' : 'حضور بمقر المكتب'}</span>
              </div>
              <div className="success-row">
                <span className="success-row-label">مقدم الطلب:</span>
                <span className="success-row-val">{fullName}</span>
              </div>
              <div className="success-row">
                <span className="success-row-label">حالة الطلب:</span>
                <span className="success-row-val success-status">قيد المراجعة والتنسيق</span>
              </div>
            </div>
            <Button variant="secondary" onClick={resetForm} icon={<ArrowLeft size={16} />}>
              إغلاق ومتابعة تصفح الموقع
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
