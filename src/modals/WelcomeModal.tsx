import { useContext, useRef, useState } from "react";
import {
  IonButton,
  IonContent,
  IonLabel,
  IonModal,
  useIonAlert,
  IonCol,
  IonDatetime,
  IonList,
  IonItem,
  IonIcon,
} from "@ionic/react";
import { checkmarkOutline } from "ionicons/icons";
import { useTranslation } from "react-i18next";
import {
  formatISO,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfToday,
  subMonths,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import { CyclesContext, ThemeContext } from "../state/Context";
import { getNewCyclesHistory } from "../state/CalculationLogics";
import {
  getCurrentTranslation,
  changeTranslation,
  supportedLanguages,
} from "../utils/translation";
import { changeDateTimeLocale } from "../utils/datetime";
import { storage } from "../data/Storage";

interface PropsWelcomeModal {
  isOpen: boolean;
  setIsOpen: (newIsOpen: boolean) => void;
}

const Welcome = (props: PropsWelcomeModal) => {
  const datetimeRef = useRef<null | HTMLIonDatetimeElement>(null);
  const [confirmAlert] = useIonAlert();
  const updateCycles = useContext(CyclesContext).updateCycles;
  const theme = useContext(ThemeContext).theme;
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedLanguage, setSelectedLanguage] = useState(
    getCurrentTranslation(),
  );

  const { t } = useTranslation();

  const handleLanguageSelect = async (lang: string) => {
    setSelectedLanguage(lang);
    await changeTranslation(lang);
    changeDateTimeLocale(lang);
    await storage.set.language(lang);
  };

  return (
    <IonModal
      isOpen={props.isOpen}
      backdropDismiss={false}
      className={`glass-modal ${theme === "dark" ? "dark-theme" : ""}`}
    >
      <IonContent
        className="ion-padding"
        color="none"
        style={{ "--background": "transparent" }}
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <div
                style={{
                  marginTop: "20px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                <IonLabel
                  style={{
                    fontSize: "30px",
                    marginTop: "20px",
                    color: `var(--ion-color-text-${theme})`,
                    fontWeight: "900",
                  }}
                  mode="md"
                >
                  Select Language
                </IonLabel>
              </div>

              <div
                className={`glass-card ${theme === "dark" ? "dark-theme" : ""}`}
                style={{
                  marginTop: "30px",
                  maxHeight: "60vh",
                  overflowY: "auto",
                  borderRadius: "20px",
                }}
              >
                <IonList style={{ background: "transparent" }}>
                  {Array.from(supportedLanguages).map(([code, name]) => (
                    <IonItem
                      key={code}
                      button
                      onClick={() => {
                        handleLanguageSelect(code).catch(err => console.error(err));
                      }}
                      style={{
                        "--background":
                          selectedLanguage === code
                            ? `rgba(139, 92, 246, 0.15)`
                            : "transparent",
                      }}
                      lines="none"
                    >
                      <IonLabel
                        style={{
                          color: `var(--ion-color-text-${theme})`,
                          fontWeight: selectedLanguage === code ? "700" : "500",
                        }}
                      >
                        {name}
                      </IonLabel>
                      {selectedLanguage === code && (
                        <IonIcon
                          icon={checkmarkOutline}
                          slot="end"
                          color="primary"
                        />
                      )}
                    </IonItem>
                  ))}
                </IonList>
              </div>

              <div
                style={{
                  marginTop: "auto",
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <IonButton
                  className="main glass-btn"
                  color="primary"
                  onClick={() => setStep(2)}
                  style={{
                    "--border-radius": "20px",
                    "--box-shadow": "0 4px 16px rgba(139, 92, 246, 0.4)",
                    fontSize: "16px",
                    fontWeight: "700",
                    height: "48px",
                  }}
                >
                  {t("Continue")}
                </IonButton>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <div
                style={{
                  marginTop: "20px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                <IonLabel
                  style={{
                    fontSize: "30px",
                    marginTop: "20px",
                    color: `var(--ion-color-text-${theme})`,
                    fontWeight: "900",
                  }}
                  mode="md"
                >
                  {t("Welcome to Peri")}
                </IonLabel>
              </div>
              <div style={{ marginTop: "20px", marginBottom: "25px" }}>
                <IonLabel
                  style={{ textAlign: "center" }}
                  mode="md"
                >
                  <p
                    style={{
                      fontSize: "15px",
                      color: `var(--ion-color-text-${theme})`,
                      opacity: 0.8,
                    }}
                  >
                    {t("Mark the days of your")}
                  </p>
                  <p
                    style={{
                      fontSize: "16px",
                      color: `var(--ion-color-text-${theme})`,
                      fontWeight: "700",
                    }}
                  >
                    {t("last period")}
                  </p>
                </IonLabel>
              </div>
              <div style={{ marginBottom: "20px", flex: 1 }}>
                <IonDatetime
                  className={`welcome-calendar-${theme}`}
                  ref={datetimeRef}
                  presentation="date"
                  locale={getCurrentTranslation()}
                  size="cover"
                  mode="md"
                  min={formatISO(startOfMonth(subMonths(startOfToday(), 6)))}
                  max={formatISO(startOfToday())}
                  multiple
                  firstDayOfWeek={1}
                  isDateEnabled={(isoDateString) => {
                    return (
                      startOfDay(parseISO(isoDateString)) <= startOfToday()
                    );
                  }}
                  style={{
                    background: "rgba(255, 255, 255, 0.4)",
                    backdropFilter: "blur(16px)",
                    borderRadius: "24px",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.05)",
                  }}
                />
              </div>
              <IonCol style={{ display: "flex", justifyContent: "center" }}>
                <IonButton
                  className="main glass-btn"
                  mode="md"
                  color="primary"
                  onClick={() => {
                    if (datetimeRef.current?.value) {
                      const periodDaysString = (
                        datetimeRef.current.value as string[]
                      ).map((isoDateString) => {
                        return parseISO(isoDateString).toString();
                      });

                      updateCycles(getNewCyclesHistory(periodDaysString));
                      props.setIsOpen(false);
                    } else {
                      confirmAlert({
                        header: `${t("Continue")}?`,
                        cssClass: `${theme}`,
                        message: t("Forecast will not be generated."),
                        buttons: [
                          {
                            text: t("cancel"),
                            role: "cancel",
                            cssClass: `${theme}`,
                          },
                          {
                            text: "OK",
                            role: "confirm",
                            cssClass: `${theme}`,
                            handler: () => {
                              props.setIsOpen(false);
                            },
                          },
                        ],
                      }).catch((err) => console.error(err));
                    }
                  }}
                  style={{
                    "--border-radius": "20px",
                    "--box-shadow": "0 4px 16px rgba(139, 92, 246, 0.4)",
                    fontSize: "16px",
                    fontWeight: "700",
                    height: "48px",
                  }}
                >
                  {t("Continue")}
                </IonButton>
              </IonCol>
            </motion.div>
          )}
        </AnimatePresence>
      </IonContent>
    </IonModal>
  );
};

export default Welcome;
