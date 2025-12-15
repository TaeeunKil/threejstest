import { useState } from "react";
import "./App.css";
import RobotVisualization from "./components/RobotVisualization";
import JointSliders from "./components/JointSliders";

function App() {
  // 초기 관절 각도 (도 단위) - 굽혀진 자세
  const [jointAngles, setJointAngles] = useState<number[]>([
    0, // J0 (Base): 정면
    -45, // J1 (Shoulder): 앞으로 45도
    90, // J2 (Elbow): 위로 90도
    0, // J3 (Wrist1): 중립
    -45, // J4 (Wrist2): 앞으로 45도
    0, // J5 (Wrist3): 중립
  ]);

  const handleJointAngleChange = (index: number, angle: number) => {
    const newAngles = [...jointAngles];
    newAngles[index] = angle;
    setJointAngles(newAngles);
  };

  const handleReset = () => {
    // 기본 굽혀진 자세로 리셋
    setJointAngles([0, -45, 90, 0, -45, 0]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Three.js Demo</h1>
      </header>
      <main className="app-main">
        <RobotVisualization jointAngles={jointAngles} />
        <JointSliders
          jointAngles={jointAngles}
          onJointAngleChange={handleJointAngleChange}
          onReset={handleReset}
        />
      </main>
    </div>
  );
}

export default App;
