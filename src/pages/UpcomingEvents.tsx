import React, { useState, useEffect } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton } from '@ionic/react';
import { sampleEvents } from '../data/mockData';

interface Event {
    id: string;
    title: string;
    date: Date;
    start_time: Date;
    end_time: Date;
    location: string;
    description: string;
    urgency: number;
    color: string;
    reminder: {
        push_notification: boolean;
        reminder_time: number;
    };
}

const UpcomingEvents: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            console.log("Sample events: ", sampleEvents);

            // Ensure the dates are valid Date objects
            const processedEvents = sampleEvents.map(event => ({
                ...event,
                date: event.date instanceof Date ? event.date : new Date(event.date),
                start_time: event.start_time instanceof Date ? event.start_time : new Date(event.start_time),
                end_time: event.end_time instanceof Date ? event.end_time : new Date(event.end_time)
            }));

            setEvents(processedEvents);
        } catch (err) {
            console.error("Error setting events:", err);
            setError("Failed to load events. Please check console for details.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Safe date formatter
    const formatDate = (date: Date) => {
        try {
            return date.toLocaleDateString();
        } catch (err) {
            console.error("Error formatting date:", err);
            return "Invalid date";
        }
    };

    console.log("Events state:", events);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Upcoming Events</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {loading ? (
                    <div className="ion-padding">Loading events...</div>
                ) : error ? (
                    <div className="ion-padding">{error}</div>
                ) : (
                    <IonList>
                        {events.length === 0 ? (
                            <div className="ion-padding">No events available</div>
                        ) : (
                            events.map((event) => (
                                <IonItem key={event.id}>
                                    <IonLabel>
                                        <h2>{event.title}</h2>
                                        <p>{formatDate(event.date)}</p>
                                        <p>{event.description}</p>
                                    </IonLabel>
                                    <IonButton routerLink={`/event-detail/${event.id}`} color="primary">View</IonButton>
                                </IonItem>
                            ))
                        )}
                    </IonList>
                )}
            </IonContent>
        </IonPage>
    );
};

export default UpcomingEvents;