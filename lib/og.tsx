import { ImageResponse } from "next/og";

import { brandEntity } from "@/lib/site";

export const ogImageSize = {
  width: 1200,
  height: 630
};

export const ogImageContentType = "image/png";

export function createBrandImageResponse({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background:
            "linear-gradient(180deg, rgba(253,251,248,1) 0%, rgba(245,239,230,1) 100%)",
          color: "#111111",
          fontFamily: "serif"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top right, rgba(131,104,74,0.18), transparent 34%)"
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 32,
            border: "1px solid rgba(17,17,17,0.08)",
            borderRadius: 36
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            padding: "58px 68px"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 22,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "#83684a"
              }}
            >
              {eyebrow}
            </div>
            <div
              style={{
                display: "flex",
                maxWidth: 760,
                marginTop: 26,
                fontSize: 76,
                lineHeight: 1.04,
                fontWeight: 500
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: "flex",
                maxWidth: 760,
                marginTop: 24,
                fontSize: 28,
                lineHeight: 1.5,
                color: "#4a4a4a"
              }}
            >
              {description}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 22,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase"
                }}
              >
                {brandEntity.name}
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 10,
                  fontSize: 20,
                  color: "#5a5a5a"
                }}
              >
                {brandEntity.positioning}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                padding: "12px 18px",
                borderRadius: 999,
                border: "1px solid rgba(17,17,17,0.1)",
                background: "rgba(255,255,255,0.7)",
                fontSize: 18,
                color: "#5a5a5a"
              }}
            >
              {brandEntity.url.replace("https://", "")}
            </div>
          </div>
        </div>
      </div>
    ),
    ogImageSize
  );
}

export function createBrandIconResponse() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(180deg, rgba(253,251,248,1) 0%, rgba(239,231,220,1) 100%)",
          color: "#111111",
          borderRadius: 32,
          border: "10px solid rgba(17,17,17,0.08)",
          fontSize: 220,
          fontWeight: 700
        }}
      >
        O
      </div>
    ),
    {
      width: 512,
      height: 512
    }
  );
}
