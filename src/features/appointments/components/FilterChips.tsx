import { ThemedText } from "@/src/shared/components/themed/ThemedText";
import { AppointmentStatus } from "@/src/shared/types/common.types";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../../settings/hooks/useTheme";

type FilterType = AppointmentStatus | "all";

interface FilterChipsProps {
  filters: FilterType[];
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  getFilterLabel: (filter: FilterType) => string;
  getFilterIcon: (filter: FilterType) => string;
}

export function FilterChips({
  filters,
  selectedFilter,
  onFilterChange,
  getFilterLabel,
  getFilterIcon,
}: FilterChipsProps) {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterScrollView}
      contentContainerStyle={styles.filterContainer}
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.filterChip,
            {
              backgroundColor:
                selectedFilter === filter ? theme.primary : theme.card,
              borderColor: theme.border,
            },
          ]}
          onPress={() => onFilterChange(filter)}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name={getFilterIcon(filter) as any}
            size={18}
            color={selectedFilter === filter ? "#FFF" : theme.text}
          />
          <ThemedText
            style={[
              styles.filterText,
              { color: selectedFilter === filter ? "#FFF" : theme.text },
            ]}
          >
            {getFilterLabel(filter)}
          </ThemedText>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  filterScrollView: {
    flexGrow: 0,
    flexShrink: 0,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
    flexShrink: 0,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
    flexShrink: 0,
  },
});
