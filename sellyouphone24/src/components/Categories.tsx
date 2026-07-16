"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const categoryData = {
  dresses: [
    { name: "Bandhani Sarees", slug: "bandhani-sarees" },
    { name: "Rajputi Poshak", slug: "rajputi-poshak" },
    { name: "Ghagra Choli", slug: "ghagra-choli" },
    { name: "Kurtis", slug: "kurtis" },
    { name: "Suit Sets", slug: "suit-sets" },
    { name: "Angrakha Dresses", slug: "angrakha-dresses" },
    { name: "Dupattas", slug: "dupattas" },
    { name: "Wedding Collection", slug: "wedding-collection" },
  ],

  "home-interiors": [
    { name: "Wall Decor", slug: "wall-decor" },
    { name: "Paintings", slug: "paintings" },
    { name: "Lamps", slug: "lamps" },
    { name: "Furniture", slug: "furniture" },
    { name: "Curtains", slug: "curtains" },
    { name: "Cushions", slug: "cushions" },
    { name: "Handicrafts", slug: "handicrafts" },
  ],

  bathroom: [
    { name: "Mirrors", slug: "mirrors" },
    { name: "Bath Mats", slug: "bath-mats" },
    { name: "Towels", slug: "towels" },
    { name: "Soap Dispensers", slug: "soap-dispensers" },
    { name: "Storage", slug: "storage" },
    { name: "Accessories", slug: "accessories" },
  ],
};

const Categories = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selected = searchParams.get("category");

  const mainCategory = searchParams.get("mainCategory") || "dresses";

  const categories =
    categoryData[mainCategory as keyof typeof categoryData] ||
    categoryData.dresses;

  const handleChange = (slug: string) => {
    const params = new URLSearchParams(searchParams);

    if (selected === slug) {
      params.delete("category");
    } else {
      params.set("category", slug);
    }

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      <section style={{ padding: "3rem 1rem 2.5rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                display: "block",
                height: 1,
                width: 28,
                background: "#3B6D11",
              }}
            />

            <span
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#3B6D11",
              }}
            >
              Collections
            </span>

            <span
              style={{
                display: "block",
                height: 1,
                width: 28,
                background: "#3B6D11",
              }}
            />
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(28px, 4vw, 36px)",
              fontWeight: 400,
              color: "#1a1a1a",
              lineHeight: 1,
              margin: 0,
            }}
          >
            Shop by{" "}
            <em style={{ fontStyle: "italic", color: "#3B6D11" }}>Category</em>
          </h2>
        </div>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            maxWidth: 280,
            margin: "0 auto 1.75rem",
          }}
        >
          <span
            style={{
              flex: 1,
              height: "0.5px",
              background: "#C0DD97",
            }}
          />

          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#86c050"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 17c0 0 2.5-10 7-10s7 10 7 10" />
            <line x1="12" y1="7" x2="12" y2="3" />
          </svg>

          <span
            style={{
              flex: 1,
              height: "0.5px",
              background: "#C0DD97",
            }}
          />
        </div>

        {/* Pills */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {categories.map((cat) => {
            const isActive = selected === cat.slug;

            return (
              <button
                key={cat.slug}
                onClick={() => handleChange(cat.slug)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "9px 20px",
                  borderRadius: 100,
                  border: isActive ? "1px solid #3B6D11" : "1px solid #C0DD97",
                  background: isActive ? "#3B6D11" : "#ffffff",
                  color: isActive ? "#EAF3DE" : "#27500A",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: isActive ? 500 : 400,
                  letterSpacing: "0.01em",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "#3B6D11";
                    e.currentTarget.style.background = "#EAF3DE";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "#C0DD97";
                    e.currentTarget.style.background = "#ffffff";
                  }
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: isActive ? "#C0DD97" : "#97C459",
                    flexShrink: 0,
                  }}
                />

                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Active label */}
        {selected && (
          <p
            style={{
              textAlign: "center",
              marginTop: "1.25rem",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 14,
              fontStyle: "italic",
              color: "#3B6D11",
              letterSpacing: "0.05em",
              minHeight: 20,
            }}
          >
            Browsing — {categories.find((c) => c.slug === selected)?.name}
          </p>
        )}
      </section>
    </>
  );
};

export default Categories;
