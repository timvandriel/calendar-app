import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import UpcomingEvents from './pages/UpcomingEvents';
import CalendarPage from './pages/CalendarPage';
import AddEditEvent from './pages/AddEditEvent';
import EventDetail from './pages/EventDetail';
import ErrorBoundary from './components/ErrorBoundary';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */
/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';
/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  console.log("App is running");

  return (
    <IonApp>
      <ErrorBoundary>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path='/events' component={UpcomingEvents} />
            <Route exact path='/calendar' component={CalendarPage} />
            <Route exact path='/add-event' component={AddEditEvent} />
            <Route exact path='/edit-event/:id?' component={AddEditEvent} />
            <Route exact path='/event-detail/:id' component={EventDetail} />
            <Redirect exact from='/' to='/events' />
          </IonRouterOutlet>
        </IonReactRouter>
      </ErrorBoundary>
    </IonApp>
  );
};

export default App;