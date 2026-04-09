import { Img, staticFile } from "remotion";
import { SCREENSHOTS } from "../constants";
import { HighlightBox } from "../overlays/HighlightBox";

export function MenuScene() {
  return (
    <div style={{ position: "relative", width: 360, height: 780 }}>
      <Img
        src={staticFile(SCREENSHOTS.menu)}
        style={{ width: 360, height: 780 }}
      />
      {/* Highlight the full module list */}
      <HighlightBox x={15} y={155} w={340} h={570} delay={15} />
    </div>
  );
}
