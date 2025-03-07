import React, { Component, ErrorInfo, ReactNode } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle } from '@ionic/react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error("Uncaught error:", error, errorInfo);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                <IonPage>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>Something went wrong</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent className="ion-padding">
                        <h2>An error occurred</h2>
                        <p>Please try again or contact support if the problem persists.</p>
                        <pre style={{ whiteSpace: 'pre-wrap', color: 'red' }}>
                            {this.state.error?.toString()}
                        </pre>
                        <button
                            onClick={() => this.setState({ hasError: false, error: null })}
                            style={{
                                margin: '10px 0',
                                padding: '8px 16px',
                                backgroundColor: '#3880ff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px'
                            }}
                        >
                            Try Again
                        </button>
                    </IonContent>
                </IonPage>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;