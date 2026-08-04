import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Citrus, Droplets, Sprout } from "lucide-react";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story of New Creation Soda Works — two brothers, a backyard carbonation rig, and a stubborn belief in real ingredients.",
};

const VALUES = [
  {
    icon: Sprout,
    title: "Real ingredients",
    body: "Cane sugar, real juice, actual hops. If we can't pronounce it, it doesn't go in the can.",
  },
  {
    icon: Droplets,
    title: "Small batches",
    body: "We carbonate in small runs so every flavor lands the way it did on the test bench.",
  },
  {
    icon: Citrus,
    title: "Joyful fizz",
    body: "Soda should be fun. Nostalgic flavors, grown-up balance, zero apology.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="dot-grid">
        <div className="container section">
          <p className="eyebrow">Our story</p>
          <h1 className={styles.hero}>
            Two brothers, one stubborn idea: soda made the hard way.
          </h1>
          <p className="lead" style={{ maxWidth: "52ch" }}>
            New Creation Soda Works started in a garage with a secondhand
            carbonation rig and a fridge full of failed experiments. We wanted a
            soda we'd actually be proud to hand our friends — so we built one.
          </p>
        </div>
      </section>

      <section className="container">
        <div className={styles.prose}>
          <p>
            It began the way a lot of good things do: with a complaint. The soda
            on the shelf was either loaded with corn syrup and dye, or it was so
            precious it forgot to taste good. We figured there had to be a middle
            path — flavors that felt like the root beer and cream soda we grew up
            on, made with ingredients we'd be happy to read off the label.
          </p>
          <p>
            So we taught ourselves to carbonate. The first batches were flat,
            then over-carbonated, then weirdly salty. But somewhere around batch
            forty, <strong>Parakey</strong> — our key lime cream soda — clicked,
            and we knew we weren't going back to our day jobs.
          </p>
          <p>
            Today New Creation makes cane-sugar craft sodas, zero-proof sparkling
            hopwater for the folks skipping the booze, and bar-quality margarita
            mixes for the folks who aren't. Same obsession, three ways to enjoy
            it. We still taste every flavor against the original bench notes, and
            we still make it in small batches, because that's the only way we
            know how to keep it honest.
          </p>
        </div>
      </section>

      <section className="container section">
        <div style={{ marginBottom: "2rem" }}>
          <p className="eyebrow">What we believe</p>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)" }}>
            Three rules we won't break
          </h2>
        </div>
        <div className={styles.values}>
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className={styles.value}>
                <span className={styles.valueIcon}>
                  <Icon size={20} />
                </span>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueBody}>{v.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 88 }}>
        <div className={styles.cta}>
          <div>
            <h2 className={styles.ctaTitle}>Taste the difference</h2>
            <p className="muted">
              Browse the full lineup or get the specs in the partner portal.
            </p>
          </div>
          <div className="row" style={{ gap: "0.75rem", flexWrap: "wrap" }}>
            <Button href="/products" variant="coral">
              Explore the sodas
            </Button>
            <Button href="/login" variant="outline">
              Partner sign in
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
