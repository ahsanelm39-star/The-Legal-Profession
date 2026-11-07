import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, ArrowUpLeft, BookOpen } from 'lucide-react';
import { INSIGHT_ARTICLES } from '../../constants/content';
import type { InsightArticle } from '../../types';
import { SectionHeading } from '../ui/SectionHeading';
import './Insights.css';

gsap.registerPlugin(ScrollTrigger);

interface InsightsProps {
  onSelectArticle: (article: InsightArticle) => void;
}

export const Insights: React.FC<InsightsProps> = ({ onSelectArticle }) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.insight-article-card', {
        scrollTrigger: {
          trigger: '.insights-cards-grid',
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.18,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="insights" ref={sectionRef} className="section insights-section">
      <div className="container">
        <SectionHeading
          badge="الإنتاج الفكري والمعرفي"
          title="رؤى قانونية"
          highlight="ومعرفة مستمرة"
          description="أوراق ومقالات تحليلية تواكب أحدث المستجدات التنظيمية والتشريعية لخدمة مجتمع الأعمال."
        />

        <div className="insights-cards-grid">
          {INSIGHT_ARTICLES.map((article) => (
            <article key={article.id} className="insight-article-card surface-card">
              <div className="article-meta-header">
                <span className="article-category-badge">{article.category}</span>
                <span className="article-time-badge">
                  <Clock size={13} />
                  <span>{article.readTime}</span>
                </span>
              </div>

              <div className="article-illustration-graphic" aria-hidden="true">
                <div className="graphic-inner-pattern">
                  <BookOpen size={28} className="graphic-book-icon" />
                  <span className="graphic-line-deco" />
                </div>
              </div>

              <h3 className="article-title">{article.title}</h3>
              <p className="article-summary-text">{article.summary}</p>

              <div className="article-card-footer">
                <button
                  type="button"
                  className="article-read-btn"
                  onClick={() => onSelectArticle(article)}
                >
                  <span>اقرأ المقال كاملاً</span>
                  <ArrowUpLeft size={16} className="read-arrow-icon" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
