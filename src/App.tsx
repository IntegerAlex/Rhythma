// © 2025 Akshat kotpalliwar – GPLv3 license
// © 2025 Irina Sorokina – MIT-style license

import { useCallback, useContext, useEffect, useState, Suspense } from "react";
import { Redirect, Route, useLocation } from "react-router-dom";
import {
  IonApp,
  setupIonicReact,
  IonHeader,
  IonContent,
  IonRouterOutlet,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useTranslation } from "react-i18next";
import { StackHandler, StackProvider, StackTheme } from '@stackframe/react';

import TabsContainer from "./components/TabsContainer";
import { stackClientApp } from "./stack";
import "./App.css";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

import { storage } from "./data/Storage";

import type { Cycle } from "./data/ClassCycle";
import { getMaxStoredCountOfCycles } from "./state/CalculationLogics";
import { CyclesContext, ThemeContext, SettingsContext } from "./state/Context";
import { Menu } from "./modals/Menu";
import { isNewVersionAvailable } from "./data/AppVersion";
import { configuration } from "./data/AppConfiguration";

import {
  requestPermission,
  clearAllDeliveredNotifications,
  removePendingNotifications,
  createNotifications,
} from "./utils/notifications";

setupIonicReact();

const Badge = () => {
  const theme = useContext(ThemeContext).theme;
  // NOTE: Ionic's badge can't be empty and need some text in it,
  //       that's why I decided to write my own badge component
  return (
    <div
      style={{
        position: "fixed",
        left: 42,
        top: 0,
        backgroundColor: `var(--ion-color-opposite-${theme})`,
        minWidth: 10,
        minHeight: 10,
        borderRadius: 10,
      }}
    />
  );
};



function HandlerRoutes() {
  const location = useLocation();
  return (
    <StackHandler app={stackClientApp} location={location.pathname} fullPage />
  );
}

interface AppProps {
  theme?: string;
}

const App = (props: AppProps) => {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [theme, setTheme] = useState(props.theme ?? "basic");

  const { t, i18n } = useTranslation();
  const [needUpdate, setNeedUpdate] = useState(false);
  const [notificationsStatus, setNotificationsStatus] = useState(false);
  const [maxNumberOfDisplayedCycles, setMaxNumberOfDisplayedCycles] =
    useState(6);

  const changeLanguage = useCallback(
    (lng: string) => {
      i18n.changeLanguage(lng).catch((err) => console.error(err));
    },
    [i18n],
  );

  const updateCycles = useCallback(
    async (newCycles: Cycle[]) => {
      try {
        const slicedCycles = newCycles.slice(
          0,
          getMaxStoredCountOfCycles(maxNumberOfDisplayedCycles),
        );
        setCycles(slicedCycles);
        await storage.set.cycles(slicedCycles);

        if (configuration.features.notifications && notificationsStatus) {
          await clearAllDeliveredNotifications();
          await removePendingNotifications();
          await createNotifications(cycles, maxNumberOfDisplayedCycles);
        }
      } catch (err) {
        console.error("Error updating cycles", err);
      }
    },
    [cycles, maxNumberOfDisplayedCycles, notificationsStatus],
  );

  const updateTheme = useCallback((newTheme: string) => {
    if (newTheme === "light") {
      newTheme = "basic";
    }
    setTheme(newTheme);
    storage.set.theme(newTheme).catch((err) => console.error(err));
    const metaStatusBarColorAndroid = document.querySelector(
      "meta[name=theme-color]",
    );
    if (metaStatusBarColorAndroid) {
      metaStatusBarColorAndroid.setAttribute(
        "content",
        newTheme === "basic" ? "#eae7ff" : "#1f1f1f",
      );
    }
    const metaStatusBarColorIOS = document.querySelector(
      "meta[name=apple-mobile-web-app-status-bar-style]",
    );
    if (metaStatusBarColorIOS) {
      metaStatusBarColorIOS.setAttribute(
        "content",
        newTheme === "basic" ? "default" : "black",
      );
    }
  }, []);

  const updateNotificationsStatus = useCallback(
    async (newStatus: boolean) => {
      try {
        setNotificationsStatus(newStatus);
        await storage.set.notifications(newStatus);
        console.log(
          `Notification has been switched to ${newStatus ? "on" : "off"}`,
        );

        if (newStatus) {
          await createNotifications(cycles, maxNumberOfDisplayedCycles);
        } else {
          await removePendingNotifications();
        }
      } catch (err) {
        console.error("Error updating notification status", err);
      }
    },
    [cycles, maxNumberOfDisplayedCycles],
  );

  const updateMaxNumberOfDisplayedCycles = useCallback(
    async (newValue: number) => {
      try {
        setMaxNumberOfDisplayedCycles(newValue);
        await storage.set.maxNumberOfDisplayedCycles(newValue);
        console.log(`maxDisplayedCycles has been switched to ${newValue}`);
      } catch (err) {
        console.error(err);
      }
    },
    [],
  );

  useEffect(() => {
    if (!configuration.features.useCustomVersionUpdate) {
      return;
    }

    isNewVersionAvailable()
      .then((newVersionAvailable) => {
        if (!newVersionAvailable) {
          return;
        }
        setNeedUpdate(true);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    storage.get
      .cycles()
      .then(setCycles)
      .catch((err) =>
        console.error(`Can't get cycles ${(err as Error).message}`),
      );

    storage.get
      .language()
      .then((res) => {
        changeLanguage(res);
      })
      .catch((err) =>
        console.error(`Can't get language ${(err as Error).message}`),
      );

    storage.get
      .theme()
      .then(setTheme)
      .catch((err) => {
        console.error(`Can't get theme ${(err as Error).message}`);
        storage.set.theme(theme).catch((err) => console.error(err));
      });

    storage.get
      .notifications()
      .then(setNotificationsStatus)
      .catch((err) => {
        console.error(
          `Can't get notifications status ${(err as Error).message}`,
        );
        // Notifications are off by default
        storage.set.notifications(false).catch((err) => console.error(err));
      });

    storage.get.lastNotificationId().catch((err) => {
      console.error(`Can't get lastNotificationId ${(err as Error).message}`);
      storage.set.lastNotificationId(0).catch((err) => console.error(err));
    });

    storage.get
      .maxNumberOfDisplayedCycles()
      .then(setMaxNumberOfDisplayedCycles)
      .catch((err) => {
        console.error(`Can't get maxDisplayedCycles ${(err as Error).message}`);
        storage.set
          .maxNumberOfDisplayedCycles(maxNumberOfDisplayedCycles)
          .catch((err) => console.error(err));
      });
  }, [changeLanguage, theme, maxNumberOfDisplayedCycles]);

  useEffect(() => {
    if (!configuration.features.notifications || !notificationsStatus) {
      return;
    }

    requestPermission().catch((err) => {
      console.error("Error request permission notifications", err);
    });
  }, [notificationsStatus]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CyclesContext.Provider
        value={{
          cycles,
          updateCycles: (newCycles) => {
            updateCycles(newCycles).catch((err) => console.error(err));
          },
        }}
      >
        <ThemeContext.Provider value={{ theme, updateTheme }}>
          <SettingsContext.Provider
            value={{
              notificationsStatus,
              updateNotificationsStatus: (newStatus) => {
                updateNotificationsStatus(newStatus).catch((err) =>
                  console.error(err),
                );
              },
              maxNumberOfDisplayedCycles,
              updateMaxNumberOfDisplayedCycles: (newValue) => {
                updateMaxNumberOfDisplayedCycles(newValue).catch((err) =>
                  console.error(err),
                );
              },
            }}
          >
            <IonApp>
              <Menu contentId="main-content-router-outlet" />
              <IonReactRouter>
                <IonRouterOutlet id="main-content-router-outlet">
                  <Route
                    path="/tabs"
                  >
                    <TabsContainer theme={theme} needUpdate={needUpdate} />
                  </Route>
                  <Route exact path="/">
                    <Redirect to="/tabs/home" />
                  </Route>
                </IonRouterOutlet>
              </IonReactRouter>
            </IonApp>
          </SettingsContext.Provider>
        </ThemeContext.Provider>
      </CyclesContext.Provider>
    </Suspense>
  );
};

export default App;
