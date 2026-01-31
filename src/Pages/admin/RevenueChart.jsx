import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  Tooltip,
  Label,
} from "recharts";

// Colors for each bar
const colors = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#E91E63",
  "#9C27B0",
  "#3F51B5",
];

// Custom Triangle Path
const getPath = (x, y, width, height) => {
  return `
    M${x},${y + height}
    C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3} ${x + width / 2},${y}
    C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width},${y + height}
    Z
  `;
};

// Custom Triangle Bar Component
const TriangleBar = (props) => {
  const { x, y, width, height, index } = props;
  const fill = colors[index % colors.length];
  return (
    <path
      d={getPath(Number(x), Number(y), Number(width), Number(height))}
      fill={fill}
      stroke="none"
    />
  );
};

// Label with dynamic color matching each bar
const CustomColorLabel = (props) => {
  const fill = colors[(props.index ?? 0) % colors.length];
  return <Label {...props} fill={fill} />;
};

export default function RevenueChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md w-full">
        <h2 className="font-semibold mb-4">Revenue Chart</h2>
        <div className="flex flex-col justify-center items-center gap-4 h-75">
          <h3 className="text-2xl">No Data Found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="font-semibold mb-4 text-gray-800">Event Revenue Chart</h2>

      <BarChart
        style={{
          width: "100%",
          maxWidth: "700px",
          maxHeight: "70vh",
          aspectRatio: 1.618,
        }}
        responsive
        data={data}
        margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip cursor={{ fillOpacity: 0.5 }} />

        <XAxis dataKey="eventName" />
        <YAxis />

        <Bar
          dataKey="revenue"
          shape={TriangleBar}
          isAnimationActive={true}
          animationDuration={1200}>
          <LabelList content={CustomColorLabel} position="top" />
        </Bar>
      </BarChart>
    </div>
  );
}
