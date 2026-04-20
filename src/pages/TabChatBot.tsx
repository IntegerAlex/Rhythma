import { useContext, useState, useRef, useEffect } from "react";
import {
  IonContent,
  IonPage,
  IonButton,
  IonIcon,
  IonTextarea,
  IonSpinner,
} from "@ionic/react";
import { sendOutline, chatbubbleEllipsesOutline } from "ionicons/icons";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeContext, CyclesContext, SettingsContext } from "../state/Context";
import {
  getDaysBeforePeriod,
  getPhase,
  getOvulationStatus,
  getPregnancyChance,
} from "../state/CalculationLogics";

interface ChatMessage {
  id: number;
  role: "user" | "bot";
  text: string;
  timestamp: Date;
}

const botResponses: Record<string, string[]> = {
  period: [
    "A typical menstrual period lasts 3-7 days. Tracking your cycle helps identify patterns and predict future periods.",
    "Period pain (dysmenorrhea) is common. Heat pads, light exercise, and staying hydrated can help ease discomfort.",
    "Light to medium flow is normal. If you experience very heavy bleeding, consult a healthcare professional.",
  ],
  cycle: [
    "The average menstrual cycle is 28 days, but cycles between 21-35 days are considered normal.",
    "Your cycle has four phases: menstruation, follicular, ovulation, and luteal. Each phase brings hormonal changes.",
    "Stress, diet changes, and illness can temporarily affect cycle length. Tracking helps you notice these patterns.",
  ],
  ovulation: [
    "Ovulation typically occurs around day 14 of a 28-day cycle, but this varies. Signs include mild cramping, cervical mucus changes, and a slight temperature rise.",
    "You are most fertile in the 5 days before ovulation and on the day of ovulation itself.",
    "Ovulation predictor kits (OPKs) detect the LH surge that happens 24-36 hours before ovulation.",
  ],
  pms: [
    "PMS (premenstrual syndrome) symptoms include mood swings, bloating, breast tenderness, and fatigue, usually occurring 1-2 weeks before your period.",
    "Exercise, limiting caffeine and salt, and getting enough sleep can help manage PMS symptoms.",
    "If PMS severely impacts your daily life, it could be PMDD (premenstrual dysphoric disorder). A doctor can help with treatment options.",
  ],
  pain: [
    "Mild to moderate cramping before and during your period is normal. Try heat therapy, gentle movement, or over-the-counter pain relievers.",
    "Severe pain that disrupts daily activities is not something you should just endure. It can be a sign of conditions like endometriosis. Please see a doctor.",
    "Staying hydrated and maintaining a balanced diet rich in magnesium and omega-3s may help reduce period pain.",
  ],
  flow: [
    "A normal period involves losing about 30-80 ml of blood over the entire period. Using 3-6 pads or tampons per day is typical.",
    "Clots smaller than a quarter are usually normal. Larger clots or very heavy flow should be discussed with a healthcare provider.",
    "Flow can vary from cycle to cycle. Stress, diet changes, and hormonal fluctuations can all affect flow.",
  ],
  pregnancy: [
    "The days around ovulation are your fertile window. Tracking your cycle can help you understand when you're most likely to conceive.",
    "If you're trying to conceive, tracking basal body temperature (BBT) and cervical mucus alongside your cycle dates can improve timing.",
    "If you've missed a period and may be pregnant, take a home pregnancy test and see a doctor for confirmation.",
  ],
  nutrition: [
    "During your period, focus on iron-rich foods (leafy greens, legumes, meat) to replenish what's lost. Vitamin C helps with iron absorption.",
    "Magnesium-rich foods like dark chocolate, nuts, and avocado may help reduce PMS symptoms and cramping.",
    "Reducing processed foods, excess sugar, and alcohol in the week before your period can help stabilize mood and energy.",
  ],
  exercise: [
    "Light to moderate exercise during your period can actually reduce cramps by releasing endorphins. Walking, yoga, and swimming work well.",
    "You might feel more energetic during the follicular phase (after your period). This is a great time for higher-intensity workouts.",
    "Listen to your body. Some days rest is the best option. Gentle stretching or yoga are great low-impact choices.",
  ],
  mood: [
    "Hormonal fluctuations throughout your cycle affect mood and energy. Estrogen rises in the follicular phase, often boosting mood, while the luteal phase can bring lower energy.",
    "Tracking your mood alongside your cycle can help you identify patterns and plan your schedule around your natural energy rhythms.",
    "If mood changes are severe, talking to a mental health professional or your doctor can help. Hormonal therapies and lifestyle changes can make a big difference.",
  ],
  default: [
    "I'm your Rhythma health assistant! I can help with questions about periods, ovulation, PMS, nutrition, exercise, and mood. What would you like to know?",
    "That's a great question about your health! For personalized medical advice, always consult a healthcare professional. I can share general wellness information — just ask!",
    "I'm here to help you understand your cycle better. Try asking about topics like period pain, ovulation timing, PMS, or nutrition for your cycle.",
  ],
};

export function getBotResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes("period") || msg.includes("menstrual") || msg.includes("bleed")) {
    const responses = botResponses.period;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  if (msg.includes("cycle") || msg.includes("phase")) {
    const responses = botResponses.cycle;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  if (msg.includes("ovulat") || msg.includes("fertile") || msg.includes("egg")) {
    const responses = botResponses.ovulation;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  if (msg.includes("pms") || msg.includes("premenstrual") || msg.includes("pmdd")) {
    const responses = botResponses.pms;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  if (msg.includes("pain") || msg.includes("cramp") || msg.includes("ache")) {
    const responses = botResponses.pain;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  if (msg.includes("flow") || msg.includes("heavy") || msg.includes("light") || msg.includes("clot")) {
    const responses = botResponses.flow;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  if (msg.includes("pregnan") || msg.includes("conceiv") || msg.includes("baby")) {
    const responses = botResponses.pregnancy;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  if (msg.includes("eat") || msg.includes("food") || msg.includes("diet") || msg.includes("nutriti")) {
    const responses = botResponses.nutrition;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  if (msg.includes("exercise") || msg.includes("workout") || msg.includes("gym") || msg.includes("yoga")) {
    const responses = botResponses.exercise;
    return responses[Math.floor(Math.random() * responses.length)];
  }
  if (msg.includes("mood") || msg.includes("emotion") || msg.includes("anxi") || msg.includes("depress")) {
    const responses = botResponses.mood;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  const responses = botResponses.default;
  return responses[Math.floor(Math.random() * responses.length)];
}

const QUICK_PROMPTS = [
  "How long is a normal period?",
  "When do I ovulate?",
  "How to ease cramps?",
  "What is PMS?",
  "Foods to eat on my period?",
];

const TabChatBot = () => {
  const { t } = useTranslation();
  const theme = useContext(ThemeContext).theme;
  const cycles = useContext(CyclesContext).cycles;
  const maxNumberOfDisplayedCycles =
    useContext(SettingsContext).maxNumberOfDisplayedCycles;

  const cycleInfo = getDaysBeforePeriod(cycles, maxNumberOfDisplayedCycles);
  const phase = cycles.length > 0 ? getPhase(cycles, maxNumberOfDisplayedCycles) : null;
  const ovulationStatus = cycles.length > 0 ? getOvulationStatus(cycles, maxNumberOfDisplayedCycles) : null;
  const pregnancyChance = cycles.length > 1 ? getPregnancyChance(cycles, maxNumberOfDisplayedCycles) : null;

  const getContextualGreeting = () => {
    if (cycles.length === 0) {
      return "Hi! I'm your Rhythma health assistant 💜 Start by marking your period dates, then I can give you personalized cycle insights!";
    }
    const parts = [`Hi! I'm your Rhythma health assistant 💜`];
    const daysText = typeof cycleInfo.days === "string" ? cycleInfo.days : String(cycleInfo.days);
    parts.push(`Currently: ${daysText}.`);
    if (phase) parts.push(`You're in the ${phase.title} phase.`);
    if (ovulationStatus) parts.push(`Ovulation: ${ovulationStatus}.`);
    if (pregnancyChance) parts.push(`Pregnancy chance: ${pregnancyChance}.`);
    parts.push(`How can I help you today?`);
    return parts.join(" ");
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      role: "bot",
      text: getContextualGreeting(),
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current && typeof messagesEndRef.current.scrollIntoView === "function") {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const trimmedText = text.trim();

    setMessages((prev) => {
      const userMsg: ChatMessage = {
        id: prev.length,
        role: "user",
        text: trimmedText,
        timestamp: new Date(),
      };
      return [...prev, userMsg];
    });
    setInputText("");
    setIsTyping(true);

    // Simulate bot thinking delay
    setTimeout(() => {
      setMessages((prev) => {
        const botMsg: ChatMessage = {
          id: prev.length,
          role: "bot",
          text: getBotResponse(text),
          timestamp: new Date(),
        };
        return [...prev, botMsg];
      });
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  };

  const isBasic = theme === "basic";
  const bgColor = `var(--ion-color-background-${theme})`;
  const cardBg = isBasic ? "#fff" : "var(--ion-color-calendar-dark)";
  const userBubbleBg = `var(--ion-color-dark-${theme})`;
  const botBubbleBg = isBasic ? "var(--ion-color-light-basic)" : "var(--ion-color-transparent-dark)";
  const textColor = `var(--ion-color-text-${theme})`;

  return (
    <IonPage style={{ backgroundColor: bgColor }}>
      <div id="wide-screen" className={theme}>
        <IonContent color={`transparent-${theme}`}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              padding: "12px 12px 0 12px",
            }}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
                paddingTop: 8,
              }}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 4 }}
              >
                <IonIcon
                  icon={chatbubbleEllipsesOutline}
                  style={{
                    fontSize: 28,
                    color: `var(--ion-color-dark-${theme})`,
                  }}
                />
              </motion.div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: "bold",
                    color: textColor,
                  }}
                >
                  Rhythma Assistant
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: 12,
                    color: "var(--ion-color-medium)",
                  }}
                >
                  Your personal cycle health guide
                </p>
              </div>
            </motion.div>

            {/* Quick prompts */}
            <div
              style={{
                display: "flex",
                gap: 8,
                overflowX: "auto",
                paddingBottom: 8,
                marginBottom: 8,
                scrollbarWidth: "none",
              }}
            >
              {QUICK_PROMPTS.map((prompt, i) => (
                <motion.button
                  key={prompt}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  whileTap={{ scale: 0.93 }}
                  onClick={() => sendMessage(prompt)}
                  style={{
                    flexShrink: 0,
                    padding: "6px 14px",
                    borderRadius: 20,
                    border: `1.5px solid var(--ion-color-dark-${theme})`,
                    background: "transparent",
                    color: `var(--ion-color-dark-${theme})`,
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {prompt}
                </motion.button>
              ))}
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                paddingBottom: 8,
                scrollbarWidth: "none",
              }}
            >
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      display: "flex",
                      justifyContent:
                        msg.role === "user" ? "flex-end" : "flex-start",
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "78%",
                        padding: "10px 14px",
                        borderRadius:
                          msg.role === "user"
                            ? "18px 18px 4px 18px"
                            : "18px 18px 18px 4px",
                        background:
                          msg.role === "user" ? userBubbleBg : botBubbleBg,
                        color:
                          msg.role === "user"
                            ? "#fff"
                            : textColor,
                        fontSize: 14,
                        lineHeight: 1.5,
                        boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                      }}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        padding: "10px 16px",
                        borderRadius: "18px 18px 18px 4px",
                        background: botBubbleBg,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <IonSpinner
                        name="dots"
                        style={{
                          color: `var(--ion-color-dark-${theme})`,
                          width: 32,
                          height: 16,
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 8,
                padding: "8px 0 16px 0",
              }}
            >
              <div
                style={{
                  flex: 1,
                  background: cardBg,
                  borderRadius: 20,
                  border: `1.5px solid var(--ion-color-dark-${theme})`,
                  overflow: "hidden",
                }}
              >
                <IonTextarea
                  value={inputText}
                  onIonInput={(e) => setInputText(e.detail.value ?? "")}
                  placeholder={t("Ask about your cycle...")}
                  autoGrow
                  rows={1}
                  style={{
                    "--padding-start": "14px",
                    "--padding-end": "14px",
                    "--padding-top": "8px",
                    "--padding-bottom": "8px",
                    fontSize: 14,
                    color: textColor,
                    "--background": "transparent",
                    "--border-width": "0",
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(inputText);
                    }
                  }}
                />
              </div>
              <motion.div
                whileTap={{ scale: 0.88 }}
                whileHover={{ scale: 1.05 }}
              >
                <IonButton
                  shape="round"
                  color={`dark-${theme}`}
                  disabled={!inputText.trim() || isTyping}
                  onClick={() => sendMessage(inputText)}
                  style={{ "--padding-start": "12px", "--padding-end": "12px" }}
                >
                  <IonIcon icon={sendOutline} />
                </IonButton>
              </motion.div>
            </motion.div>
          </div>
        </IonContent>
      </div>
    </IonPage>
  );
};

export default TabChatBot;
