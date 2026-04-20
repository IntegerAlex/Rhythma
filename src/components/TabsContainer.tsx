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
  IonContent,
} from '@ionic/react';
import { Route } from 'react-router-dom';
import { menuOutline, chatbubbleEllipsesOutline, bagHandleOutline, calendarOutline, listOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';

import TabHome from '../pages/TabHome';
import TabDetails from '../pages/TabDetails';
import TabChatBot from '../pages/TabChatBot';
import TabShop from '../pages/TabShop';
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
            <Route exact path="/tabs/chat">
              <TabChatBot />
            </Route>
            <Route exact path="/tabs/shop">
              <TabShop />
            </Route>
          </IonRouterOutlet>
          <IonTabBar
            className={theme}
            slot="bottom"
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
              <IonIcon icon={calendarOutline} />
              <IonLabel>{t("Home")}</IonLabel>
            </IonTabButton>
            <IonTabButton
              tab="details"
              href="/tabs/details"
              className={`${theme} details-tab`}
            >
              <IonIcon icon={listOutline} />
              <IonLabel>{t("Details")}</IonLabel>
            </IonTabButton>
            <IonTabButton
              tab="chat"
              href="/tabs/chat"
              className={`${theme} chat-tab`}
            >
              <IonIcon icon={chatbubbleEllipsesOutline} />
              <IonLabel>{t("Chat")}</IonLabel>
            </IonTabButton>
            <IonTabButton
              tab="shop"
              href="/tabs/shop"
              className={`${theme} shop-tab`}
            >
              <IonIcon icon={bagHandleOutline} />
              <IonLabel>{t("Shop")}</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonContent>
    </IonPage>
  );
};

export default TabsContainer; 