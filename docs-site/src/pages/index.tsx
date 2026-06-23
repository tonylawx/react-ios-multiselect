import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";
import DemoBox from "../components/DemoBox";
import { MultiDemo } from "../components/demos";

function Feature({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div style={{ padding: "0.5rem 0" }}>
      <Heading as="h3">{title}</Heading>
      <p>{children}</p>
    </div>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <header style={{ textAlign: "center", padding: "3rem 1rem 2rem" }}>
        <Heading as="h1">{siteConfig.title}</Heading>
        <p style={{ fontSize: "1.15rem", opacity: 0.85, maxWidth: 640, margin: "0.5rem auto" }}>
          {siteConfig.tagline}
        </p>
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            Get started
          </Link>
          <Link className="button button--secondary button--lg" to="/playground">
            Try the playground
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "1rem 1rem 4rem" }}>
        <DemoBox title="A real, interactive component — tap the trigger">
          <MultiDemo />
        </DemoBox>

        <section style={{ marginTop: "2rem" }}>
          <Feature title="Native iOS feel">
            Keyboard-aware bottom sheet, momentum scrolling, iOS-blue selected state with
            a filled checkmark — exactly like iOS Settings.
          </Feature>
          <Feature title="Single & multi in one component">
            The <code>multiple</code> prop switches the value/onChange signature and the
            commit behavior. No second component to learn.
          </Feature>
          <Feature title="Virtualized">
            Only the visible window + overscan of rows mount. 2,000 options scroll as
            smoothly as 20.
          </Feature>
          <Feature title="Zero runtime dependencies">
            Only <code>react</code> / <code>react-dom</code> as peers. No UI library, no
            icon pack. Icons are inline SVG; classes are a 3-line <code>cn()</code>.
          </Feature>
          <Feature title="Agent-friendly">
            Stable <code>data-rios-*</code> selectors on every element, full ARIA, and an
            AI contributor workflow with enforced disclosure. See the{" "}
            <Link to="/docs/agent-guide">agent guide</Link>.
          </Feature>
        </section>

        <section style={{ marginTop: "2rem" }}>
          <Heading as="h3">Install</Heading>
          <pre><code className="language-bash">bun add react-ios-multiselect</code></pre>
        </section>
      </main>
    </Layout>
  );
}
