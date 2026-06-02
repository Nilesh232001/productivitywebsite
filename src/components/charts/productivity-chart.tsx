"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { productivityTrend } from "@/lib/mock-data";

export function ProductivityChart() {
  const mounted = useMounted();

  if (!mounted) {
    return <div className="h-72 w-full" />;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer height="100%" minHeight={1} minWidth={1} width="100%">
        <LineChart data={productivityTrend} margin={{ left: -18, right: 10, top: 10 }}>
          <CartesianGrid stroke="#dbe4df" strokeDasharray="4 4" />
          <XAxis dataKey="day" stroke="#66756f" tickLine={false} />
          <YAxis stroke="#66756f" tickLine={false} />
          <Tooltip contentStyle={{ borderColor: "#dbe4df", borderRadius: 8 }} />
          <Line dataKey="score" stroke="#1f6b4f" strokeWidth={3} type="monotone" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StudyChart() {
  const mounted = useMounted();

  if (!mounted) {
    return <div className="h-64 w-full" />;
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer height="100%" minHeight={1} minWidth={1} width="100%">
        <BarChart data={productivityTrend} margin={{ left: -18, right: 10, top: 10 }}>
          <CartesianGrid stroke="#dbe4df" strokeDasharray="4 4" />
          <XAxis dataKey="day" stroke="#66756f" tickLine={false} />
          <YAxis stroke="#66756f" tickLine={false} />
          <Tooltip contentStyle={{ borderColor: "#dbe4df", borderRadius: 8 }} />
          <Bar dataKey="study" fill="#3279a8" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
