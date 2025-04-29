package com.railease.trains.entity;

public enum TrainDaysOfWeek {
    MONDAY("Monday", "Mon", 1),
    TUESDAY("Tuesday", "Tue", 2),
    WEDNESDAY("Wednesday", "Wed", 3),
    THURSDAY("Thursday", "Thu", 4),
    FRIDAY("Friday", "Fri", 5),
    SATURDAY("Saturday", "Sat", 6),
    SUNDAY("Sunday", "Sun", 7);

    private final String fullName;
    private final String shortName;
    private final int dayNumber;

    TrainDaysOfWeek(String fullName, String shortName, int dayNumber) {
        this.fullName = fullName;
        this.shortName = shortName;
        this.dayNumber = dayNumber;
    }


    // Getters
    public String getFullName() {
        return fullName;
    }

    public String getShortName() {
        return shortName;
    }

    public int getDayNumber() {
        return dayNumber;
    }

    // Utility methods
    public boolean isWeekend() {
        return this == SATURDAY || this == SUNDAY;
    }

    public boolean isWeekday() {
        return !isWeekend();
    }

    public TrainDaysOfWeek next() {
        return values()[(this.ordinal() + 1) % values().length];
    }

    public TrainDaysOfWeek previous() {
        return values()[(this.ordinal() - 1 + values().length) % values().length];
    }


    public static TrainDaysOfWeek fromString(String text) {
        for (TrainDaysOfWeek day : TrainDaysOfWeek.values()) {
            if (day.fullName.equalsIgnoreCase(text) ||
                    day.shortName.equalsIgnoreCase(text)) {
                return day;
            }
        }
        throw new IllegalArgumentException("No enum constant for: " + text);
    }

    @Override
    public String toString() {
        return fullName;
    }
}

