import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { sampleEvents } from '../data/mockData';

interface EventDetailProps extends RouteComponentProps<{
    id: string;
}> { }

const EventDetail: React.FC<EventDetailProps> = ({ match }) => {
    const eventId = match.params.id;
    const event = sampleEvents.find(e => e.id === eventId);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/events" />
                    </IonButtons>
                    <IonTitle>Event Details</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className="ion-padding">
                    {event ? (
                        <>
                            <h1>{event.title}</h1>
                            <p><strong>Date:</strong> {event.date.toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {event.start_time.toLocaleTimeString()} - {event.end_time.toLocaleTimeString()}</p>
                            <p><strong>Location:</strong> {event.location}</p>
                            <p><strong>Description:</strong> {event.description}</p>
                            <p><strong>Urgency:</strong> {event.urgency}/10</p>
                        </>
                    ) : (
                        <p>Event not found with ID: {eventId}</p>
                    )}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default EventDetail;