import { AbsoluteFill } from "remotion";
import { TOTAL_FRAMES } from "./constants";
import { ScreenSlide } from "./ScreenSlide";
import { DashboardScene } from "./screens/DashboardScene";
import { AnalyticsScene } from "./screens/AnalyticsScene";
import { ChecklistScene } from "./screens/ChecklistScene";
import { MenuScene } from "./screens/MenuScene";

export { TOTAL_FRAMES };

const scenes = [
  <DashboardScene key="dashboard" />,
  <AnalyticsScene key="analytics" />,
  <ChecklistScene key="checklist" />,
  <MenuScene key="menu" />,
];

export default function PhoneShowcase() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#f3f4f6" }}>
      {scenes.map((scene, i) => (
        <ScreenSlide key={i} index={i}>
          {scene}
        </ScreenSlide>
      ))}
    </AbsoluteFill>
  );
}
