import Layout from "@theme/Layout";
import DemoBox from "../components/DemoBox";
import { SingleDemo, MultiDemo, IconDemo, DisabledDemo, ThemedDemo } from "../components/demos";

export default function Playground(): JSX.Element {
  return (
    <Layout title="Playground" description="Interactive demos of react-ios-multiselect">
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem 1rem 4rem" }}>
        <h1>Playground</h1>
        <p>
          Live, interactive demos. Tap any trigger to open the iOS-style sheet.
          The mobile bottom sheet is designed for touch, but works with a mouse here.
        </p>

        <h2>Single-select</h2>
        <DemoBox title="Tap a row to select and close">
          <SingleDemo />
        </DemoBox>

        <h2>Multi-select with search</h2>
        <DemoBox title="Toggle rows; tap ✓ to commit, ✕ to cancel">
          <MultiDemo />
        </DemoBox>

        <h2>Leading icons</h2>
        <DemoBox title="option.icon renders to the left of the label">
          <IconDemo />
        </DemoBox>

        <h2>Themed (purple accent)</h2>
        <DemoBox title="Override --rios-color-accent / --rios-color-selected">
          <ThemedDemo />
        </DemoBox>

        <h2>Disabled</h2>
        <DemoBox title="A disabled trigger cannot open the sheet">
          <DisabledDemo />
        </DemoBox>
      </main>
    </Layout>
  );
}
