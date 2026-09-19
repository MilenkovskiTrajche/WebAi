import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { useLanguage } from "../i18n/LanguageContext";
import { LogoMark } from "../components/Logo";
import { restaurant, reviews } from "../config/restaurant";
export default function Home() {
  const { t } = useLanguage();
  return (
    <main id="main">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span />
            {t.since}
          </p>
          <h1>
            {t.hero1}
            <br />
            <em>{t.hero2}</em>
          </h1>
          <p className="hero-description">{t.intro}</p>
          <a className="button" href="/menu">
            {t.explore}
            <ArrowUpRight size={19} />
          </a>
          <a className="quiet-link" href="#location">
            {t.find}
            <ArrowRight size={15} />
          </a>
        </div>
        <figure className="hero-image">
          <img
            src="/images/restaurant/bezisten-dragor-1024.webp"
            srcSet="/images/restaurant/bezisten-dragor-640.webp 640w, /images/restaurant/bezisten-dragor-1024.webp 1024w"
            sizes="(max-width: 680px) 88vw, 44vw"
            width="1024"
            height="1536"
            alt={t.heroImageAlt}
            fetchPriority="high"
          />
          <div className="photo-label">{t.place}</div>
          <figcaption>{t.heroImageCaption}</figcaption>
          <div className="year-seal" aria-hidden="true">
            <span>EST.</span>
            <strong>1992</strong>
            <span>BITOLA</span>
          </div>
        </figure>
      </section>
      <div className="place-strip">
        <span>БЕЗИСТЕН</span>
        <span className="diamond">✦</span>
        <span>BITOLA</span>
        <span className="diamond">✦</span>
        <span>DRAGOR</span>
        <span className="diamond">✦</span>
        <span>SAAT KULA</span>
      </div>
      <section className="menu-invitation">
        <p className="eyebrow">{t.menuLabel}</p>
        <h2>{t.menuTitle}</h2>
        <p>{t.menuText}</p>
        <a className="button button-light" href="/menu">
          {t.explore}
          <ArrowUpRight size={18} />
        </a>
        <LogoMark decorative className="invitation-mark" />
      </section>
      {reviews.length > 0 && (
        <section className="reviews">
          <h2>{t.reviews}</h2>
          {reviews.map((r) => (
            <blockquote key={`${r.author}-${r.date}`}>
              <p>{r.text}</p>
              <cite>
                {r.author} · {r.rating}/5 ·{" "}
                <a href={r.sourceUrl} target="_blank" rel="noreferrer">
                  {r.source}
                </a>
              </cite>
            </blockquote>
          ))}
        </section>
      )}
      <section id="location" className="location-section">
        <div>
          <p className="eyebrow">{t.place}</p>
          <h2>{t.locationTitle}</h2>
          <p>{t.locationText}</p>
          {restaurant.address ? (
            <p>{restaurant.address}</p>
          ) : (
            <p className="pending">{t.detailsPending}</p>
          )}
          <div className="contact-links">
            {restaurant.phone && (
              <a href={`tel:${restaurant.phone.replace(/\s/g, "")}`}>
                {restaurant.phone}
              </a>
            )}
            {restaurant.mapsUrl && (
              <a href={restaurant.mapsUrl} target="_blank" rel="noreferrer">
                {t.maps}
                <ArrowUpRight size={18} />
              </a>
            )}
          </div>
          {restaurant.hours && (
            <p>
              {t.hours}: {restaurant.hours}
            </p>
          )}
        </div>
        <div className="location-graphic" aria-hidden="true">
          <div className="river">DRAGOR</div>
          <div className="map-line line-one" />
          <div className="map-line line-two" />
          <div className="map-line line-three" />
          <div className="map-marker">
            <MapPin size={25} />
            <span>BEZISTEN</span>
          </div>
          <span className="map-clock">SAAT KULA</span>
          <span className="map-caption">BITOLA</span>
        </div>
      </section>
    </main>
  );
}
