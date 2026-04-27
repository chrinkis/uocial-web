"use client";

import { Anchor, Stack, Text, Title } from "@mantine/core";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useMantineTheme } from "@mantine/core";
import "./style.css";

function AnimatedLogo() {
  const sGroupRef = useRef<SVGGElement>(null);
  const theme = useMantineTheme();
  const primaryColor = theme.colors[theme.primaryColor][6];

  useEffect(() => {
    if (!sGroupRef.current) return;

    // Matrix values
    const socialMatrix = [
      -1.7409792, 0.00716268, -0.04147025, -1.2823104, 496.06407, 842.92315,
    ];
    const uocialMatrix = [
      -0.09213464, -1.6082172, 1.3825962, -0.10048097, -525.59452, 590.37671,
    ];

    const state = { matrix: [...uocialMatrix] };

    // Create timeline that repeats
    const tl = gsap.timeline({ repeat: -1 });

    tl.to(state.matrix, {
      duration: 1.5,
      delay: 1,
      endArray: socialMatrix,
      ease: "power2.inOut",
      onUpdate: () => {
        const [a, b, c, d, e, f] = state.matrix;
        sGroupRef.current?.setAttribute(
          "transform",
          `matrix(${String(a)},${String(b)},${String(c)},${String(d)},${String(e)},${String(f)})`,
        );
      },
    }).to(state.matrix, {
      duration: 1.5,
      delay: 1,
      endArray: uocialMatrix,
      ease: "power2.inOut",
      onUpdate: () => {
        const [a, b, c, d, e, f] = state.matrix;
        sGroupRef.current?.setAttribute(
          "transform",
          `matrix(${String(a)},${String(b)},${String(c)},${String(d)},${String(e)},${String(f)})`,
        );
      },
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <svg
      viewBox="0 0 320 320"
      version="1.1"
      style={{ width: "100%", height: "auto", display: "block" }}
    >
      <defs>
        <rect
          x="177.71098"
          y="392.49835"
          width="194.89891"
          height="235.21831"
          id="rect1"
        />
      </defs>
      <g transform="translate(8.0525623,-12.855337)">
        <g transform="matrix(1.4014535,0,0,1.3487953,-4.6575173,-102.07778)">
          <g transform="matrix(1.0222149,0,0,1.0301433,-6.2171044,-3.4103896)">
            <g transform="matrix(0.81013002,0,0,0.90297583,7.2298449,26.90431)">
              <g
                ref={sGroupRef}
                transform="matrix(-0.09213464,-1.6082172,1.3825962,-0.10048097,-525.59452,590.37671)"
              >
                <text
                  xmlSpace="preserve"
                  style={{
                    fontFamily: "Open Sans",
                    fontSize: "192px",
                    fill: primaryColor,
                    strokeWidth: "25.9465",
                    whiteSpace: "pre",
                  }}
                >
                  <tspan x="177.71094" y="562.61947">
                    S
                  </tspan>
                </text>
              </g>
              <text
                xmlSpace="preserve"
                style={{
                  fontFamily: "Open Sans",
                  fontSize: "23.388px",
                  fill: primaryColor,
                  strokeWidth: "5.21075",
                }}
                x="219.9"
                y="254.4"
                transform="scale(0.96521939,1.0360339)"
              >
                <tspan x="212.24864" y="245.63925">
                  media
                </tspan>
              </text>
              <text
                xmlSpace="preserve"
                style={{
                  fontFamily: "Open Sans",
                  fontSize: "38.5588px",
                  fill: primaryColor,
                  strokeWidth: "5.21075",
                }}
                x="147.69864"
                y="212.52895"
                transform="scale(0.96521939,1.0360339)"
              >
                <tspan x="147.69864" y="212.52895">
                  ocial
                </tspan>
              </text>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

function Logo() {
  const theme = useMantineTheme();

  return (
    <Stack align="center" gap={0}>
      <AnimatedLogo />
      <Text c={theme.primaryColor} ff="Open Sans" fz="1.2rem" fw={700}>
        for University of Crete Students
      </Text>
    </Stack>
  );
}

export default function Page() {
  return (
    <Stack align="center">
      <Logo />

      <Title order={2}>About Uocial</Title>

      <Text size="lg" maw={512} ta="center">
        Uocial (UoC + Social), is a social media platform, specifically designed
        for the needs of UoC students.
      </Text>

      <Text size="lg" maw={512} ta="center">
        At the moment, it offers anonymous posts and comments (aka
        "ανομολόγητα").
      </Text>

      <Text size="lg" maw={512} ta="center">
        It's an{" "}
        <Anchor href="https://github.com/chrinkis/uocial-web">
          open source
        </Anchor>{" "}
        project and it values your privacy!
      </Text>
    </Stack>
  );
}
