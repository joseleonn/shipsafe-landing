import { Img, staticFile } from "remotion";
import { SCREENSHOTS } from "../constants";
import { TapIndicator } from "../overlays/TapIndicator";
import { HighlightBox } from "../overlays/HighlightBox";

export function ChecklistScene() {
  return (
    <div style={{ position: "relative", width: 360, height: 780 }}>
      <Img
        src={staticFile(SCREENSHOTS.checklist)}
        style={{ width: 360, height: 780 }}
      />
      {/* Tap on the OK button */}
      <TapIndicator x={100} y={410} delay={10} />
      {/* Highlight the question + OK/NO OK/N/A buttons area */}
      <HighlightBox x={22} y={230} w={316} h={310} delay={15} />
    </div>
  );
}
