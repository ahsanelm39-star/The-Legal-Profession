import React, { useEffect } from 'react';
import { X, Calendar, Clock, BookOpen, CheckCircle2 } from 'lucide-react';
import type { InsightArticle } from '../../types';
import { Button } from './Button';
import './ArticleModal.css';

interface ArticleModalProps {
  article: InsightArticle | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (article) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [article, onClose]);

  if (!article) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="إغلاق النافذة">
          <X size={20} />
        </button>

        <div className="modal-header">
          <div className="modal-tags">
            <span className="modal-category">{article.category}</span>
            <span className="modal-meta-item">
              <Clock size={14} /> {article.readTime}
            </span>
            <span className="modal-meta-item">
              <Calendar size={14} /> {article.date}
            </span>
          </div>
          <h2 id="modal-title" className="modal-title">
            {article.title}
          </h2>
        </div>

        <div className="modal-body">
          <div className="modal-lead-box">
            <BookOpen className="lead-icon" size={24} />
            <p className="modal-lead-text">{article.summary}</p>
          </div>

          <div className="modal-content-paragraphs">
            {article.content.map((p, index) => (
              <p key={index} className="modal-paragraph">
                {p}
              </p>
            ))}
          </div>

          <div className="modal-takeaways-box">
            <h3 className="takeaways-title">أهم المحاور والتوصيات القانونية:</h3>
            <ul className="takeaways-list">
              {article.keyTakeaways.map((item, index) => (
                <li key={index} className="takeaway-item">
                  <CheckCircle2 size={18} className="takeaway-icon" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="modal-footer">
          <div className="modal-disclaimer">
            <span>تنبيه: هذا المقال للأغراض الثقافية ونشر الوعي القانوني ولا يُعد استشارة قانونية مخصصة.</span>
          </div>
          <Button variant="secondary" size="sm" onClick={onClose}>
            إغلاق المقال
          </Button>
        </div>
      </div>
    </div>
  );
};
