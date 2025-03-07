import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/react';

const CalendarPage: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Calendar</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className="ion-padding">
                    <h2>Calendar View</h2>
                    <p>Calendar implementation will go here.</p>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default CalendarPage;