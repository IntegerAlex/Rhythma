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
        <IonToolbar style={{ '--background': `var(--ion-color-transparent-${theme})` }}>
          <IonTabBar
            className={theme}
            slot="top"
            color={`transparent-${theme}`}
          >
            <IonTabButton
              tab="menu"
              href="#"
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
              className={theme}
            >
              <IonLabel>{t("Home")}</IonLabel>
            </IonTabButton>
            <IonTabButton
              tab="details"
              href="/tabs/details"
              className={theme}
            >
              <IonLabel>{t("Details")}</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonToolbar>
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
              style={{
                background: `var(--ion-color-transparent-${theme})`,
                border: `var(--ion-color-transparent-${theme})`,
                maxWidth: "30px",
                marginLeft: "15px",
              }}
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
              className={theme}
              style={{ marginLeft: "auto" }}
            >
              <IonLabel>{t("Home")}</IonLabel>
            </IonTabButton>
            <IonTabButton
              tab="details"
              href="/tabs/details"
              className={theme}
              style={{ marginLeft: "15px", marginRight: "20px" }}
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