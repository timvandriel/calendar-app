import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonItemSliding,
    IonItemOptions,
    IonItemOption
} from '@ionic/react';
import { chevronBackOutline, chevronForwardOutline, add } from 'ionicons/icons';
import { sampleEvents, sampleHolidays } from '../data/mockData';
import './CalendarPage.css';
import '../theme/variables.css';
import { useHistory } from 'react-router-dom';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase-config';

// Define interfaces for our data types
interface Reminder {
    push_notification: boolean;
    reminder_time: number; // Minutes before event
}

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
    reminder: Reminder;
}

interface Holiday {
    id: string;
    name: string;
    date: Date;
    country: string;
    color: string;
}

const CalendarPage: React.FC = () => {
    // State for current displayed month/year
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    // State for selected day
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    // State for events (using your mock data)
    const [events, setEvents] = useState<Event[]>(sampleEvents);
    // State for holidays (using your mock data)
    const [holidays, setHolidays] = useState<Holiday[]>(sampleHolidays);

    // Fetch Holidays from the API (Nager.Date) - without using the data
    useEffect(() => {
        const fetchHolidays = async () => {
            try {
                const response = await fetch('https://date.nager.at/api/v3/NextPublicHolidaysWorldwide');
                const holidaysData = await response.json();
                console.log('API hit: Nager.Date holidays data:', holidaysData);
            } catch (error) {
                console.error('Error fetching holidays:', error);
            }
        };

        fetchHolidays();
    }, []);  // This will run once when the component mounts


    // Fetch Events from Firestore - without using the data
    useEffect(() => {
        const fetchEventsFromFirestore = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'events'));
                console.log('Firestore hit: Events data:', querySnapshot);
                querySnapshot.forEach((doc) => {
                    console.log('Event:', doc.id, doc.data()); // Log each event
                });
            } catch (error) {
                console.error('Error fetching events from Firestore:', error);
            }
        };

        fetchEventsFromFirestore();
    }, []);  // This will run once when the component mounts


    // Navigate to previous month
    const goToPreviousMonth = (): void => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(prevDate.getMonth() - 1);
            return newDate;
        });
    };

    // Navigate to next month
    const goToNextMonth = (): void => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(prevDate.getMonth() + 1);
            return newDate;
        });
    };

    // Format date for display
    const formatMonthYear = (date: Date): string => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    // Calendar generation functions
    const getDaysInMonth = (year: number, month: number): number => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number): number => {
        return new Date(year, month, 1).getDay();
    };

    // Handle day selection
    const handleDayClick = (day: number): void => {
        // Create date at noon to avoid timezone issues
        const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day, 12, 0, 0);
        setSelectedDate(selectedDate);
    };

    // Helper function to check if a date is today
    const isToday = (year: number, month: number, day: number): boolean => {
        const today = new Date();
        return today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;
    };

    // Helper function to check if a date is selected
    const isDateSelected = (year: number, month: number, day: number): boolean => {
        return selectedDate !== null &&
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === month &&
            selectedDate.getFullYear() === year;
    };

    // Check if a day has events
    const hasDayEvents = (day: number): boolean => {
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return events.some(event =>
            event.date.getDate() === checkDate.getDate() &&
            event.date.getMonth() === checkDate.getMonth() &&
            event.date.getFullYear() === checkDate.getFullYear()
        );
    };

    // Check if a day has holidays
    const hasDayHolidays = (day: number): boolean => {
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return holidays.some(holiday =>
            holiday.date.getDate() === checkDate.getDate() &&
            holiday.date.getMonth() === checkDate.getMonth() &&
            holiday.date.getFullYear() === checkDate.getFullYear()
        );
    };

    // Get events for selected date
    const getEventsForDate = (date: Date | null): Event[] => {
        if (!date) return [];
        return events.filter(event =>
            event.date.getDate() === date.getDate() &&
            event.date.getMonth() === date.getMonth() &&
            event.date.getFullYear() === date.getFullYear()
        );
    };

    // Get holidays for selected date
    const getHolidaysForDate = (date: Date | null): Holiday[] => {
        if (!date) return [];
        return holidays.filter(holiday =>
            holiday.date.getDate() === date.getDate() &&
            holiday.date.getMonth() === date.getMonth() &&
            holiday.date.getFullYear() === date.getFullYear()
        );
    };

    // Generate calendar days
    const renderCalendarDays = (): JSX.Element[] => {
        const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
        const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

        const days: JSX.Element[] = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();

            const dateIsToday = isToday(currentYear, currentMonth, day);
            const dateIsSelected = isDateSelected(currentYear, currentMonth, day);
            const hasEvents = hasDayEvents(day);
            const hasHolidays = hasDayHolidays(day);

            days.push(
                <div
                    key={day}
                    className={`calendar-day 
            ${dateIsToday ? 'today' : ''} 
            ${dateIsSelected ? 'selected' : ''} 
            ${hasEvents ? 'has-events' : ''}
            ${hasHolidays ? 'has-holidays' : ''}`
                    }
                    onClick={() => handleDayClick(day)}
                >
                    {day}
                    {hasEvents && <div className="event-indicator"></div>}
                    {hasHolidays && <div className="holiday-indicator"></div>}
                </div>
            );
        }

        return days;
    };

    const history = useHistory();
    const handleAddEvent = () => {
        if (!selectedDate) return;

        // Format the date properly
        const formattedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;

        // Use template literals with backticks
        history.push(`/add-event?date=${formattedDate}`);
    };

    const handleDelete = (id: string) => {
        setEvents(events.filter(event => event.id !== id));
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot='start'>
                        <IonButton routerLink='/events'>
                            <IonIcon icon={chevronBackOutline} />
                        </IonButton>
                    </IonButtons>
                    <IonTitle className='centered-header'>Calendar</IonTitle>
                    <IonButton slot='end' onClick={handleAddEvent} fill="clear">
                        <IonIcon icon={add} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {/* Month navigation */}
                <div className="calendar-header">
                    <IonButtons>
                        <IonButton onClick={goToPreviousMonth}>
                            <IonIcon icon={chevronBackOutline} />
                        </IonButton>
                        <h2>{formatMonthYear(currentDate)}</h2>
                        <IonButton onClick={goToNextMonth}>
                            <IonIcon icon={chevronForwardOutline} />
                        </IonButton>
                    </IonButtons>
                </div>

                {/* Calendar grid */}
                <div className="calendar-container">
                    <div className="calendar-weekdays">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                    </div>
                    <div className="calendar-days">
                        {renderCalendarDays()}
                    </div>
                </div>

                {/* Selected day events */}
                {selectedDate && (
                    <IonCard className="selected-day-card">
                        <IonCardHeader>
                            <IonCardTitle>
                                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                            {/* Display holidays */}
                            {getHolidaysForDate(selectedDate).length > 0 && (
                                <>
                                    <h3>Holidays</h3>
                                    <IonList>
                                        {getHolidaysForDate(selectedDate).map(holiday => (
                                            <IonItem key={holiday.id}>
                                                <IonLabel>{holiday.name}</IonLabel>
                                                <IonBadge color="primary">{holiday.country}</IonBadge>
                                            </IonItem>
                                        ))}
                                    </IonList>
                                </>
                            )}

                            {/* Display events */}
                            {getEventsForDate(selectedDate).length > 0 && (
                                <>
                                    <h3>Events</h3>
                                    <IonList>
                                        {getEventsForDate(selectedDate).map(event => (
                                            <IonItemSliding key={event.id}>
                                                <IonItemOptions side="start">
                                                    <IonItemOption color="danger" onClick={() => handleDelete(event.id)}>
                                                        Delete
                                                    </IonItemOption>
                                                </IonItemOptions>
                                                <IonItem>
                                                    <IonLabel>
                                                        <h2>{event.title}</h2>
                                                        <p>{event.start_time.toLocaleTimeString()} - {event.end_time.toLocaleTimeString()}</p>
                                                    </IonLabel>
                                                </IonItem>
                                            </IonItemSliding>
                                        ))}
                                    </IonList>
                                </>
                            )}
                        </IonCardContent>
                    </IonCard>
                )}
            </IonContent>
        </IonPage>
    );
};

export default CalendarPage;
