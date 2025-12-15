import { useState, useEffect } from 'react';
import './JointSliders.css';

interface JointSlidersProps {
  jointAngles: number[];
  onJointAngleChange: (index: number, angle: number) => void;
  onReset: () => void;
}

const JOINT_NAMES = ['Base', 'Shoulder', 'Elbow', 'Wrist1', 'Wrist2', 'Wrist3'];
const JOINT_RANGES = [
  { min: -180, max: 180 }, // Base
  { min: -180, max: 180 }, // Shoulder
  { min: -180, max: 180 }, // Elbow
  { min: -180, max: 180 }, // Wrist1
  { min: -180, max: 180 }, // Wrist2
  { min: -180, max: 180 }, // Wrist3
];

export default function JointSliders({
  jointAngles,
  onJointAngleChange,
  onReset,
}: JointSlidersProps) {
  const [inputValues, setInputValues] = useState<string[]>(
    jointAngles.map((angle) => angle.toFixed(2))
  );

  const handleInputChange = (index: number, value: string) => {
    setInputValues((prev) => {
      const newValues = [...prev];
      newValues[index] = value;
      return newValues;
    });
  };

  const handleInputBlur = (index: number) => {
    const value = parseFloat(inputValues[index]);
    if (!isNaN(value)) {
      const clampedValue = Math.max(
        JOINT_RANGES[index].min,
        Math.min(JOINT_RANGES[index].max, value)
      );
      onJointAngleChange(index, clampedValue);
      setInputValues((prev) => {
        const newValues = [...prev];
        newValues[index] = clampedValue.toFixed(2);
        return newValues;
      });
    } else {
      // 유효하지 않은 값이면 원래 값으로 복원
      setInputValues((prev) => {
        const newValues = [...prev];
        newValues[index] = jointAngles[index].toFixed(2);
        return newValues;
      });
    }
  };

  const handleInputKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur(index);
      e.currentTarget.blur();
    }
  };

  // jointAngles가 변경되면 inputValues도 업데이트
  useEffect(() => {
    setInputValues(jointAngles.map((angle) => angle.toFixed(2)));
  }, [jointAngles]);

  return (
    <div className="joint-sliders">
      <div className="joint-sliders-header">
        <h3 className="joint-sliders-title">관절각도</h3>
        <button className="reset-btn" onClick={onReset}>
          초기화
        </button>
      </div>
      {JOINT_NAMES.map((name, index) => (
        <div key={index} className="joint-slider-item">
          <label className="joint-slider-label">
            <span className="joint-name">{name}:</span>
            <input
              type="number"
              className="joint-value-input"
              value={inputValues[index]}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onBlur={() => handleInputBlur(index)}
              onKeyDown={(e) => handleInputKeyDown(index, e)}
              min={JOINT_RANGES[index].min}
              max={JOINT_RANGES[index].max}
              step="0.01"
            />
          </label>
          <div className="joint-slider-controls">
            <button
              className="joint-slider-btn"
              onClick={() =>
                onJointAngleChange(
                  index,
                  Math.max(JOINT_RANGES[index].min, jointAngles[index] - 1)
                )
              }
            >
              −
            </button>
            <input
              type="range"
              className="joint-slider"
              min={JOINT_RANGES[index].min}
              max={JOINT_RANGES[index].max}
              value={jointAngles[index]}
              onChange={(e) => {
                const newValue = parseFloat(e.target.value);
                onJointAngleChange(index, newValue);
                setInputValues((prev) => {
                  const newValues = [...prev];
                  newValues[index] = newValue.toFixed(2);
                  return newValues;
                });
              }}
            />
            <button
              className="joint-slider-btn"
              onClick={() =>
                onJointAngleChange(
                  index,
                  Math.min(JOINT_RANGES[index].max, jointAngles[index] + 1)
                )
              }
            >
              +
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

