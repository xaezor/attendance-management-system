"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface AttendanceChartProps {
  data: any[]
}

export function AttendanceChart({ data = [] }: AttendanceChartProps) {
  // If no data is provided, use empty array
  const chartData = data.length > 0 ? data : []

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 0,
        }}
      >
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => {
            // Format date if it's an ISO string
            if (typeof value === "string" && value.includes("T")) {
              return new Date(value).toLocaleDateString()
            }
            return value
          }}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
          domain={[0, 100]}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border border-[#2a3366] bg-[#111936] p-2 shadow-md">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-gray-400">Date</span>
                      <span className="font-bold text-white">
                        {typeof payload[0].payload.date === "string" && payload[0].payload.date.includes("T")
                          ? new Date(payload[0].payload.date).toLocaleDateString()
                          : payload[0].payload.date}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-gray-400">Attendance</span>
                      <span className="font-bold text-white">{payload[0].value}%</span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Line
          type="monotone"
          dataKey="percentage"
          stroke="#3b82f6"
          strokeWidth={2}
          activeDot={{
            r: 6,
            style: { fill: "#3b82f6", opacity: 0.8 },
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
