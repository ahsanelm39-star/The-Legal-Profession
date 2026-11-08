import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, ArrowUpLeft, BookOpen, Calendar, ArrowLeft } from 'lucide-react';
import { INSIGHTS_SECTION } from '../../constants/content';
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
      gsap.fromTo(
        '.article-editorial-block',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.18,
          ease: 'power3.out',
          clearProps: 'opacity,transform',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const featuredArticle =
    INSIGHTS_SECTION.articles.find((a) => a.isFeatured) || INSIGHTS_SECTION.articles[0];
  const secondaryArticles = INSIGHTS_SECTION.articles.filter((a) => a.id !== featuredArticle.id);

  return (
    <section id="insights" ref={sectionRef} className="section insights-section">
      <div className="container">
        <SectionHeading
          badge="الإنتاج الفكري والمعرفي"
          title={INSIGHTS_SECTION.heading}
          description={INSIGHTS_SECTION.supporting}
        />

        {/* Editorial Publication Layout: 1 Large Featured + 2 Secondary Asymmetric */}
        <div className="insights-editorial-layout">
          {/* Large Featured Article (1.35fr) */}
          <article className="article-editorial-block featured-article-card surface-card">
            <div className="featured-article-top">
              <span className="featured-flag">مقال تحليلي مختار</span>
              <div className="featured-meta">
                <span className="meta-item">
                  <Clock size={14} /> {featuredArticle.readTime}
                </span>
                <span className="meta-item">
                  <Calendar size={14} /> {featuredArticle.date}
                </span>
              </div>
            </div>

            <div className="featured-visual-frame" aria-hidden="true">
              <div className="visual-graphic-inner">
                <BookOpen size={36} className="visual-book-icon" />
                <span className="visual-tag-label">{featuredArticle.category}</span>
              </div>
            </div>

            <div className="featured-article-body">
              <h3 className="featured-article-title">{featuredArticle.title}</h3>
              <p className="featured-article-summary">{featuredArticle.summary}</p>

              <div className="featured-takeaways-preview">
                <span className="takeaways-label">أهم محاور الدراسة:</span>
                <ul className="takeaways-preview-list">
                  {featuredArticle.keyTakeaways.slice(0, 2).map((takeaway, i) => (
                    <li key={i} className="takeaway-preview-item">
                      <span className="bullet-point" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="featured-article-action">
                <button
                  type="button"
                  className="editorial-read-btn primary"
                  onClick={() => onSelectArticle(featuredArticle)}
                >
                  <span>اقرأ المقال كاملاً</span>
                  <ArrowUpLeft size={18} className="read-btn-arrow" />
                </button>
              </div>
            </div>
          </article>

          {/* Secondary Articles Column (1fr, stacked) */}
          <div className="secondary-articles-stack">
            {secondaryArticles.map((article) => (
              <article
                key={article.id}
                className="article-editorial-block secondary-article-card surface-card"
              >
                <div className="secondary-article-header">
                  <span className="secondary-category-chip">{article.category}</span>
                  <span className="secondary-read-time">
                    <Clock size={13} /> {article.readTime}
                  </span>
                </div>

                <h4 className="secondary-article-title">{article.title}</h4>
                <p className="secondary-article-summary">{article.summary}</p>

                <div className="secondary-article-footer">
                  <button
                    type="button"
                    className="editorial-read-btn secondary"
                    onClick={() => onSelectArticle(article)}
                  >
                    <span>استعراض المحتوى والتحليل</span>
                    <ArrowLeft size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
