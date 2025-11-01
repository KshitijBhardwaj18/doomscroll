// weekly-graph.tsx
import { View, Text, StyleSheet } from "react-native";

// Type definitions
interface DayData {
  date: number; // Day of month (5, 6, 7, etc.)
  day: string; // Day abbreviation (MON, TUE, etc.)
  doomMinutes: number; // Yellow segment (doom scrolling minutes)
  maxMinutes: number; // Total possible/maximum (for scaling)
}

interface WeeklyGraphProps {
  weekData?: DayData[]; // Optional prop to customize the week
}

export function WeeklyGraph({ weekData }: WeeklyGraphProps) {
  // Demo data - hackathon week ending Oct 31
  const defaultData: DayData[] = [
    { date: 25, day: "MON", doomMinutes: 0, maxMinutes: 120 },
    { date: 26, day: "TUE", doomMinutes: 0, maxMinutes: 120 },
    { date: 27, day: "WED", doomMinutes: 0, maxMinutes: 120 },
    { date: 28, day: "THU", doomMinutes: 0, maxMinutes: 120 },
    { date: 29, day: "FRI", doomMinutes: 0, maxMinutes: 120 },
    { date: 30, day: "SAT", doomMinutes: 0, maxMinutes: 120 },
    { date: 31, day: "SUN", doomMinutes: 87, maxMinutes: 120 }, // Oct 31 - Hackathon end
  ];

  const data = weekData || defaultData;
  const maxBarHeight = 200; // Maximum height in pixels for bars
  const maxMinutes = Math.max(...data.map((d) => d.maxMinutes));

  // Helper function to calculate bar heights
  const getHeight = (minutes: number) => {
    return (minutes / maxMinutes) * maxBarHeight;
  };

  // Helper function to get day abbreviation
  const getDayAbbrev = (day: string) => {
    return day.substring(0, 3).toUpperCase();
  };

  return (
    <View className="bg-secondary rounded-2xl p-5 my-2">
      <View className="flex-row justify-around items-end">
        {data.map((day, index) => {
          const barHeight = getHeight(day.doomMinutes);
          const maxHeight = getHeight(day.maxMinutes);

          return (
            <View key={index} className="items-center flex-1">
              {/* Bar Container (background) */}
              <View
                className="w-4 bg-gray-800 rounded-lg mb-2 relative overflow-hidden"
                style={{ height: maxHeight, minHeight: 40 }}
              >
                {/* Yellow bar with diagonal stripes (doom scrolling) */}
                <View
                  style={[
                    styles.doomBar,
                    {
                      height: barHeight,
                    },
                  ]}
                >
                  {/* Diagonal stripes overlay */}
                  <View>
                    {[...Array(15)].map((_, i) => (
                      <View
                        key={i}
                        style={[
                          {
                            left: i * 10 - 5,
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </View>

              {/* Labels */}
              <View className="items-center mt-1">
                <Text
                  style={{ fontFamily: "Poppins_600SemiBold" }}
                  className="text-xs text-white mb-0.5"
                >
                  {day.date}
                </Text>
                <Text
                  style={{ fontFamily: "Poppins_400Regular" }}
                  className="text-[10px] text-gray-500 uppercase"
                >
                  {getDayAbbrev(day.day)}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  doomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fbbf24", // Yellow/Amber for doom scrolling
    borderRadius: 8,
    overflow: "hidden",
  },
});
