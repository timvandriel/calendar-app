import React, { useState, useEffect } from 'react';
import {
    IonIcon, IonItemOptions, IonItemOption, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
    IonButton, IonButtons, IonItemSliding
} from '@ionic/react';
import { sampleEvents } from '../data/mockData';
import { calendarOutline, add } from 'ionicons/icons';

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

    const handleDelete = (id: string) => {
        setEvents(events.filter(event => event.id !== id));
    };

    console.log("Events state:", events);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton routerLink="/calendar">
                            <IonIcon icon={calendarOutline} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle style={{ textAlign: 'center', flex: 1 }}>Upcoming</IonTitle>
                    <IonButtons slot="end">
                        <IonButton routerLink="/add-event" color="primary">
                            <IonIcon icon={add} />
                        </IonButton>
                    </IonButtons>
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
                                <IonItemSliding key={event.id}>
                                    <IonItem button routerLink={`/event-detail/${event.id}`}>
                                        <IonLabel>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {/* Circle representing urgency */}
                                                <div
                                                    style={{
                                                        width: '10px',
                                                        height: '10px',
                                                        borderRadius: '50%',
                                                        backgroundColor:
                                                            event.urgency === 3 ? '#28a745' :  // Green for low urgency
                                                                event.urgency === 2 ? '#ffc107' :  // Yellow for medium urgency
                                                                    event.urgency === 1 ? '#dc3545' :  // Red for high urgency
                                                                        '#6c757d', // Default gray
                                                        marginRight: '10px'
                                                    }}
                                                />
                                                <h2>{event.title}</h2>
                                            </div>
                                            <p>{formatDate(event.date)}</p>
                                            <p>{event.description}</p>
                                        </IonLabel>
                                    </IonItem>

                                    <IonItemOptions side="end">
                                        <IonItemOption color="warning" routerLink={`/edit-event/${event.id}`}>
                                            Edit
                                        </IonItemOption>
                                        <IonItemOption color="danger" onClick={() => handleDelete(event.id)}>
                                            Delete
                                        </IonItemOption>
                                    </IonItemOptions>
                                </IonItemSliding>
                            ))
                        )}
                    </IonList>
                )}
            </IonContent>
        </IonPage>
    );
};

export default UpcomingEvents;
