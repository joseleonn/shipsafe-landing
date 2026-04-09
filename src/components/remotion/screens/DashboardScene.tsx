import { Img, staticFile } from "remotion";
import { SCREENSHOTS } from "../constants";
import { TapIndicator } from "../overlays/TapIndicator";
import { HighlightBox } from "../overlays/HighlightBox";

export function DashboardScene() {
  return (
    <div style={{ position: "relative", width: 360, height: 780 }}>
      <Img
        src={staticFile(SCREENSHOTS.dashboard)}
        style={{ width: 360, height: 780 }}
      />
      <TapIndicator x={120} y={330} delay={10} />
      <HighlightBox x={18} y={250} w={324} h={280} delay={15} />
    </div>
  );
}
