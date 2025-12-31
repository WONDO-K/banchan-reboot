declare module "react-gauge-chart" {
  import { ComponentType } from "react";

  interface GaugeChartProps {
    id: string;
    className?: string;
    style?: React.CSSProperties;
    animate?: boolean;
    animDelay?: number;
    nrOfLevels?: number;
    percent?: number;
    arcPadding?: number;
    arcWidth?: number;
    colors?: string[];
    textColor?: string;
    needleColor?: string;
    needleBaseColor?: string;
    hideText?: boolean;
    arcsLength?: number[];
    formatTextValue?: (value: string) => string;
    textStyle?: React.CSSProperties;
  }

  const GaugeChart: ComponentType<GaugeChartProps>;
  export default GaugeChart;
}
