import React from 'react';
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
} from '@ionic/react';
import { Route, Redirect } from 'react-router-dom';
import { menuOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';

import TabHome from '../pages/TabHome';
import TabDetails from '../pages/TabDetails';
import Badge from './Badge';

interface TabsContainerProps {
  theme: string;
  needUpdate: boolean;
}

const TabsContainer: React.FC<TabsContainerProps> = ({ theme, needUpdate }) => {
  const { t } = useTranslation();

  return (
    <IonPage>
      <IonHeader
        class="ion-no-border"
        style={{
          backgroundColor: `var(--ion-color-background-${theme})`,
        }}
      >
      </IonHeader>
      <IonContent id="tabs-content" color={`background-${theme}`}>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/tabs/home">
              <TabHome />
            </Route>
            <Route exact path="/tabs/details">
              <TabDetails />
            </Route>
          </IonRouterOutlet>
          <IonTabBar
            className={theme}
            slot="top"
            color={`transparent-${theme}`}
          >
            <IonTabButton
              tab="menu"
              href="#"
              className="menu-button"
            >
              <IonMenuButton>
                <IonIcon
                  color={`dark-${theme}`}
                  icon={menuOutline}
                  size="large"
                />
                {needUpdate && <Badge />}
              </IonMenuButton>
            </IonTabButton>
            <IonTabButton
              tab="home"
              href="/tabs/home"
              className={`${theme} home-tab`}
            >
              <IonLabel>{t("Home")}</IonLabel>
            </IonTabButton>
            <IonTabButton
              tab="details"
              href="/tabs/details"
              className={`${theme} details-tab`}
            >
              <IonLabel>{t("Details")}</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonContent>
    </IonPage>
  );
};

export default TabsContainer; 