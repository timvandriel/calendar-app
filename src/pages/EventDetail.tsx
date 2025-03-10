import React from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonButton,
    IonItem,
    IonLabel,
    IonAlert,
    IonBadge,
    useIonRouter,
    useIonToast
} from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import { sampleEvents } from '../data/mockData';

interface EventDetailProps extends RouteComponentProps<{
    id: string;
}> { }

const EventDetail: React.FC<EventDetailProps> = ({ match }) => {
    const eventId = match.params.id;
    const event = sampleEvents.find(e => e.id === eventId);
    const router = useIonRouter();
    const [presentToast] = useIonToast();
    const [showAlert, setShowAlert] = React.useState(false);

    const getUrgencyText = (urgency: number) => {
        switch (urgency) {
            case 1: return 'Low';
            case 2: return 'Moderate';
            case 3: return 'Urgent';
            default: return 'Unknown';
        }
    };

    const getUrgencyColor = (urgency: number) => {
        switch (urgency) {
            case 1: return 'success'; // green
            case 2: return 'warning'; // yellow
            case 3: return 'danger';  // red
            default: return 'medium';
        }
    };

    const handleEdit = () => {
        router.push(`/edit-event/${eventId}`);
    };

    const handleDelete = () => {
        setShowAlert(true);
    };

    const confirmDelete = () => {
        // Delete logic would go here
        // deleteEvent(eventId);

        presentToast({
            message: 'Event deleted successfully',
            duration: 2000,
            color: 'success'
        });

        router.push('/events');
    };

    if (!event) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton defaultHref="/events" />
                        </IonButtons>
                        <IonTitle>Event Not Found</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <p>Event not found with ID: {eventId}</p>
                    <IonButton expand="block" routerLink="/events">Return to Events</IonButton>
                </IonContent>
            </IonPage>
        );
    }

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

            <IonContent className="ion-padding">
                <IonCard>
                    <IonCardContent>
                        <h1>{event.title}</h1>

                        <IonItem lines="none">
                            <IonLabel>
                                <h2>Date:</h2>
                                <p>{event.date.toLocaleDateString()}</p>
                            </IonLabel>
                        </IonItem>

                        <IonItem lines="none">
                            <IonLabel>
                                <h2>Time:</h2>
                                <p>{event.start_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {event.end_time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            </IonLabel>
                        </IonItem>

                        <IonItem lines="none">
                            <IonLabel>
                                <h2>Location:</h2>
                                <p>{event.location}</p>
                            </IonLabel>
                        </IonItem>

                        <IonItem lines="none">
                            <IonLabel>
                                <h2>Description:</h2>
                                <p>{event.description}</p>
                            </IonLabel>
                        </IonItem>

                        <IonItem lines="none">
                            <IonLabel>
                                <h2>Priority:</h2>
                            </IonLabel>
                            <IonBadge color={getUrgencyColor(event.urgency)}>
                                {getUrgencyText(event.urgency)}
                            </IonBadge>
                        </IonItem>
                    </IonCardContent>
                </IonCard>

                <div className="ion-padding">
                    <IonButton expand="block" color="warning" onClick={handleEdit}>
                        Edit
                    </IonButton>

                    <IonButton expand="block" color="danger" onClick={handleDelete} className="ion-margin-top">
                        Delete
                    </IonButton>
                </div>

                <IonAlert
                    isOpen={showAlert}
                    onDidDismiss={() => setShowAlert(false)}
                    header="Confirm Delete"
                    message="Are you sure you want to delete this event?"
                    buttons={[
                        {
                            text: 'Cancel',
                            role: 'cancel',
                        },
                        {
                            text: 'Delete',
                            role: 'destructive',
                            handler: confirmDelete
                        }
                    ]}
                />
            </IonContent>
        </IonPage>
    );
};

export default EventDetail;