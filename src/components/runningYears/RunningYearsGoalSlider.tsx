import { DraggableAgeSlider } from './DraggableAgeSlider';
import {
  RUNNING_YEARS_GOAL_AGE_MAX,
  RUNNING_YEARS_GOAL_AGE_MIN,
} from '../../config/runningYearsGoals';

type RunningYearsGoalSliderProps = {
  value: number;
  min?: number;
  max?: number;
  onChange?: (age: number) => void;
  onChangeEnd?: (age: number) => void;
  readOnly?: boolean;
};

/** Goal-age slider — interactive on goal screen, display-only on main. */
export function RunningYearsGoalSlider({
  value,
  min = RUNNING_YEARS_GOAL_AGE_MIN,
  max = RUNNING_YEARS_GOAL_AGE_MAX,
  onChange,
  onChangeEnd,
  readOnly = false,
}: RunningYearsGoalSliderProps) {
  return (
    <DraggableAgeSlider
      value={value}
      min={min}
      max={max}
      onChange={onChange}
      onChangeEnd={onChangeEnd}
      labelMode={readOnly ? 'main-fixed' : 'anchors'}
      variant="main"
      readOnly={readOnly}
    />
  );
}
