import { Img, staticFile } from "remotion";
import { SCREENSHOTS } from "../constants";
import { TapIndicator } from "../overlays/TapIndicator";
import { HighlightBox } from "../overlays/HighlightBox";

export function AnalyticsScene() {
  return (
    <div style={{ position: "relative", width: 360, height: 780 }}>
      <Img
        src={staticFile(SCREENSHOTS.analytics)}
        style={{ width: 360, height: 780 }}
      />
      <TapIndicator x={180} y={240} delay={10} />
      <HighlightBox x={28} y={60} w={304} h={340} delay={15} />
    </div>
  );
}
