// src/data/mockData.ts

export const sampleEvents = [
    {
        id: "1",
        title: "Event 1",
        date: new Date("2025-03-01T09:00:00Z"),
        start_time: new Date("2025-03-01T10:00:00Z"),
        end_time: new Date("2025-03-01T11:00:00Z"),
        location: "New York",
        description: "Sample event 1 description.",
        urgency: 5,
        color: "#FF5733",
        reminder: {
            push_notification: true,
            reminder_time: 30, // reminder 30 minutes before the event
        }
    },
    {
        id: "2",
        title: "Event 2",
        date: new Date("2025-03-02T12:00:00Z"),
        start_time: new Date("2025-03-02T13:00:00Z"),
        end_time: new Date("2025-03-02T14:00:00Z"),
        location: "San Francisco",
        description: "Sample event 2 description.",
        urgency: 7,
        color: "#33FF57",
        reminder: {
            push_notification: false,
            reminder_time: 60, // reminder 60 minutes before the event
        }
    }
];

export const sampleHolidays = [
    {
        id: "1",
        name: "Holiday 1",
        date: new Date("2025-03-01T00:00:00Z"),
        country: "USA",
        color: "#FF5733"
    },
    {
        id: "2",
        name: "Holiday 2",
        date: new Date("2025-03-02T00:00:00Z"),
        country: "USA",
        color: "#33FF57"
    }
];
