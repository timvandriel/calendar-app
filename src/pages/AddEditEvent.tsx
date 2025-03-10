import React, { useState, useEffect } from 'react';
import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonLabel, IonInput, IonSelect, IonSelectOption,
    IonButton, IonItem, IonButtons, IonBackButton, IonToast,
    IonDatetime, IonModal, IonFooter
} from '@ionic/react';
import { RouteComponentProps, useHistory } from 'react-router';
import { sampleEvents, Event } from '../data/mockData';
import { useLocation } from 'react-router-dom';

interface AddEditEventProps extends RouteComponentProps<{
    id?: string;
}> { }

const AddEditEvent: React.FC<AddEditEventProps> = ({ match }) => {
    const eventId = match.params.id;
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const dateParam = queryParams.get('date');

    // Create a proper date object from the parameter and then format it
    // to avoid timezone issues when parsing the string
    const preselectedDate = dateParam ? (() => {
        const dateParts = dateParam.split('-');
        if (dateParts.length === 3) {
            // Create date at noon to avoid timezone shifts
            const year = parseInt(dateParts[0]);
            const month = parseInt(dateParts[1]) - 1; // JS months are 0-indexed
            const day = parseInt(dateParts[2]);
            const date = new Date(year, month, day, 12, 0, 0);
            return date.toISOString().split('T')[0];
        }
        return dateParam;
    })() : new Date().toISOString().split('T')[0];

    const isEditing = !!eventId;
    const history = useHistory();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // State for modals
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    // Temporary state for time selection (before confirming)
    const [tempStartTime, setTempStartTime] = useState('');
    const [tempEndTime, setTempEndTime] = useState('');
    const [tempDate, setTempDate] = useState('');

    // State for form fields - using ISO strings instead of Date objects
    // Now using preselectedDate if available
    const [formData, setFormData] = useState<{
        id: string;
        title: string;
        date: string;
        start_time: string;
        end_time: string;
        location: string;
        description: string;
        urgency: number;
        color: string;
        reminder: { push_notification: boolean; reminder_time: number };
    }>({
        id: '',
        title: '',
        date: preselectedDate || new Date().toISOString().split('T')[0],
        start_time: new Date().toISOString().split('T')[1].slice(0, 5),
        end_time: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString().split('T')[1].slice(0, 5),
        location: '',
        description: '',
        urgency: 1,
        color: '',
        reminder: { push_notification: false, reminder_time: 0 },
    });

    // If editing, pre-fill the form with event data
    useEffect(() => {
        if (isEditing && eventId) {
            const eventToEdit = sampleEvents.find((event) => event.id === eventId);
            if (eventToEdit) {
                // Convert Date objects to string format if needed
                const formattedEvent = {
                    ...eventToEdit,
                    date: eventToEdit.date instanceof Date
                        ? eventToEdit.date.toISOString().split('T')[0]
                        : String(eventToEdit.date),
                    start_time: eventToEdit.start_time instanceof Date
                        ? eventToEdit.start_time.toISOString().split('T')[1].slice(0, 5)
                        : String(eventToEdit.start_time),
                    end_time: eventToEdit.end_time instanceof Date
                        ? eventToEdit.end_time.toISOString().split('T')[1].slice(0, 5)
                        : String(eventToEdit.end_time),
                };
                setFormData(formattedEvent);
            }
        }
        // No need for separate eventDate state since we're using formData.date directly
    }, [eventId, isEditing]);

    // Handle input changes
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;

        if (name === "reminder_time") {
            // Special handling for nested reminder object
            setFormData((prevData) => ({
                ...prevData,
                reminder: {
                    ...prevData.reminder,
                    reminder_time: value
                }
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    // Format date for display
    const formatDateForDisplay = (dateString: string) => {
        if (!dateString) return '';

        // Parse the date parts manually to avoid timezone issues
        const [year, month, day] = dateString.split('-').map(Number);

        // Create a date object using local timezone (month is 0-based in JS)
        const date = new Date(year, month - 1, day);

        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // Format time for display
    const formatTimeForDisplay = (timeString: string) => {
        if (!timeString) return '';
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    // Handle form submission
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form data
        if (!formData.title) {
            setToastMessage('Please enter a title for the event');
            setShowToast(true);
            return;
        }

        if (isEditing) {
            console.log('Event edited:', formData);
            // You'd likely update the event in your state or API here
            setToastMessage('Event updated successfully!');
        } else {
            console.log('New event added:', formData);
            // Add the new event to your state or API here
            setToastMessage('Event added successfully!');
        }

        setShowToast(true);

        // Navigate after submission - short delay to show toast
        setTimeout(() => {
            history.push('/events');
        }, 1500);
    };

    // Open date picker
    const openDatePicker = () => {
        setTempDate(formData.date);
        setShowDatePicker(true);
    };

    // Confirm date selection
    const confirmDateSelection = () => {
        if (tempDate) {
            setFormData(prev => ({
                ...prev,
                date: tempDate
            }));
        }
        setShowDatePicker(false);
    };

    // Open start time picker
    const openStartTimePicker = () => {
        setTempStartTime(formData.start_time);
        setShowStartTimePicker(true);
    };

    // Confirm start time selection
    const confirmStartTimeSelection = () => {
        if (tempStartTime) {
            setFormData(prev => ({
                ...prev,
                start_time: tempStartTime
            }));
        }
        setShowStartTimePicker(false);
    };

    // Open end time picker
    const openEndTimePicker = () => {
        setTempEndTime(formData.end_time);
        setShowEndTimePicker(true);
    };

    // Confirm end time selection
    const confirmEndTimeSelection = () => {
        if (tempEndTime) {
            setFormData(prev => ({
                ...prev,
                end_time: tempEndTime
            }));
        }
        setShowEndTimePicker(false);
    };

    // Handle temporary time changes
    const handleTempTimeChange = (value: string | null | undefined, timeType: 'start' | 'end') => {
        if (value) {
            const timeString = value.split('T')[1].slice(0, 5);
            if (timeType === 'start') {
                setTempStartTime(timeString);
            } else {
                setTempEndTime(timeString);
            }
        }
    };

    // Handle temporary date changes
    const handleTempDateChange = (value: string | null | undefined) => {
        if (value) {
            setTempDate(value.split('T')[0]);
        }
    };

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
                    <h2>{isEditing ? 'Edit Event Details' : 'Add New Event'}</h2>
                    <form onSubmit={handleFormSubmit}>
                        <IonItem>
                            <IonLabel position="stacked">Title</IonLabel>
                            <IonInput
                                type="text"
                                name="title"
                                value={formData.title}
                                onIonChange={handleInputChange}
                                required
                            />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Description</IonLabel>
                            <IonInput
                                type="text"
                                name="description"
                                value={formData.description}
                                onIonChange={handleInputChange}
                            />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Location</IonLabel>
                            <IonInput
                                type="text"
                                name="location"
                                value={formData.location}
                                onIonChange={handleInputChange}
                            />
                        </IonItem>

                        {/* Date Selection with Custom Format */}
                        <IonItem button onClick={openDatePicker}>
                            <IonLabel position="stacked">Date</IonLabel>
                            <IonInput
                                readonly
                                value={formatDateForDisplay(formData.date)}
                            />
                        </IonItem>

                        {/* Time Selection with Custom Format */}
                        <IonItem button onClick={openStartTimePicker}>
                            <IonLabel position="stacked">Start Time</IonLabel>
                            <IonInput
                                readonly
                                value={formatTimeForDisplay(formData.start_time)}
                            />
                        </IonItem>

                        <IonItem button onClick={openEndTimePicker}>
                            <IonLabel position="stacked">End Time</IonLabel>
                            <IonInput
                                readonly
                                value={formatTimeForDisplay(formData.end_time)}
                            />
                        </IonItem>

                        <IonItem>
                            <IonLabel position="stacked">Urgency</IonLabel>
                            <IonSelect
                                name="urgency"
                                value={formData.urgency}
                                onIonChange={handleInputChange}
                            >
                                <IonSelectOption value={1}>Low</IonSelectOption>
                                <IonSelectOption value={2}>Medium</IonSelectOption>
                                <IonSelectOption value={3}>High</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Reminder</IonLabel>
                            <IonSelect
                                name="reminder_time"
                                value={formData.reminder.reminder_time}
                                onIonChange={handleInputChange}
                            >
                                <IonSelectOption value={0}>No reminder</IonSelectOption>
                                <IonSelectOption value={15}>15 minutes</IonSelectOption>
                                <IonSelectOption value={30}>30 minutes</IonSelectOption>
                                <IonSelectOption value={60}>1 hour</IonSelectOption>
                                <IonSelectOption value={120}>2 hours</IonSelectOption>
                            </IonSelect>
                        </IonItem>

                        <IonButton expand="full" type="submit" className="ion-margin-top">
                            {isEditing ? 'Update Event' : 'Add Event'}
                        </IonButton>
                    </form>
                </div>

                {/* Date Picker Modal */}
                <IonModal isOpen={showDatePicker} onDidDismiss={() => setShowDatePicker(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Select Date</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowDatePicker(false)}>Cancel</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <IonDatetime
                            value={tempDate || formData.date}
                            onIonChange={e => handleTempDateChange(e.detail.value)}
                            displayFormat="MMM DD, YYYY"
                            presentation="date"
                        />
                    </IonContent>
                    <IonFooter>
                        <IonToolbar>
                            <IonButton expand="block" onClick={confirmDateSelection}>
                                Confirm
                            </IonButton>
                        </IonToolbar>
                    </IonFooter>
                </IonModal>

                {/* Start Time Picker Modal */}
                <IonModal isOpen={showStartTimePicker} onDidDismiss={() => setShowStartTimePicker(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Select Start Time</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowStartTimePicker(false)}>Cancel</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <IonDatetime
                            value={`2023-01-01T${tempStartTime || formData.start_time}`}
                            onIonChange={e => handleTempTimeChange(e.detail.value, 'start')}
                            displayFormat="h:mm A"
                            pickerFormat="h:mm A"
                            presentation="time"
                            minuteValues="0,15,30,45"
                        />
                    </IonContent>
                    <IonFooter>
                        <IonToolbar>
                            <IonButton expand="block" onClick={confirmStartTimeSelection}>
                                Confirm
                            </IonButton>
                        </IonToolbar>
                    </IonFooter>
                </IonModal>

                {/* End Time Picker Modal */}
                <IonModal isOpen={showEndTimePicker} onDidDismiss={() => setShowEndTimePicker(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Select End Time</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowEndTimePicker(false)}>Cancel</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <IonDatetime
                            value={`2023-01-01T${tempEndTime || formData.end_time}`}
                            onIonChange={e => handleTempTimeChange(e.detail.value, 'end')}
                            displayFormat="h:mm A"
                            pickerFormat="h:mm A"
                            presentation="time"
                            minuteValues="0,15,30,45"
                        />
                    </IonContent>
                    <IonFooter>
                        <IonToolbar>
                            <IonButton expand="block" onClick={confirmEndTimeSelection}>
                                Confirm
                            </IonButton>
                        </IonToolbar>
                    </IonFooter>
                </IonModal>

                <IonToast
                    isOpen={showToast}
                    onDidDismiss={() => setShowToast(false)}
                    message={toastMessage}
                    duration={2000}
                    position="bottom"
                />
            </IonContent>
        </IonPage>
    );
};

export default AddEditEvent;