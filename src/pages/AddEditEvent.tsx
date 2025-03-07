import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons } from '@ionic/react';
import { RouteComponentProps } from 'react-router';

interface AddEditEventProps extends RouteComponentProps<{
    id?: string;
}> { }

const AddEditEvent: React.FC<AddEditEventProps> = ({ match }) => {
    const eventId = match.params.id;
    const isEditing = !!eventId;

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/events" />
                    </IonButtons>
                    <IonTitle>{isEditing ? 'Edit Event' : 'Add Event'}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className="ion-padding">
                    <h2>{isEditing ? 'Edit Event Form' : 'Add Event Form'}</h2>
                    <p>Form implementation will go here.</p>
                    {isEditing && <p>Editing event with ID: {eventId}</p>}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default AddEditEvent;