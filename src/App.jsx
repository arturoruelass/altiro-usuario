import { useState, useEffect, useCallback } from "react";

/* ============================================================
   alTiro — Prototipo Completo App Usuario (35 pantallas)
   Tecnológico de Monterrey | Equipo 5
   ============================================================ */

// ─── DESIGN TOKENS ───
const C = {
  primary: "#1A7A4B",
  primaryLight: "#E8F5EE",
  primaryDark: "#0F5C35",
  accent: "#E8732A",
  accentLight: "#FFF3EC",
  accentHover: "#D4631F",
  bg: "#F7F8FA",
  white: "#FFFFFF",
  card: "#FFFFFF",
  border: "#E8ECF0",
  textPrimary: "#1A1D21",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  star: "#F59E0B",
  danger: "#EF4444",
  dangerLight: "#FEF2F2",
  success: "#10B981",
  successLight: "#ECFDF5",
  shadow: "0 2px 12px rgba(0,0,0,0.06)",
  shadowLg: "0 8px 32px rgba(0,0,0,0.10)",
};

// ─── SCREEN NAMES ───
const S = {
  SPLASH: "splash", OB1: "ob1", OB2: "ob2", OB3: "ob3",
  LOGIN: "login", OTP: "otp", COMPLETE_PROFILE: "completeProfile",
  HOME: "home", SUBCATEGORY: "subcategory",
  ADDRESS: "address", TECHNICIANS: "technicians",
  TECH_DETAIL: "techDetail", SUMMARY: "summary",
  CONTEXTUAL_CHAT: "contextChat", PAYMENT_METHOD: "paymentMethod",
  CONFIRM_REQUEST: "confirmRequest",
  TECH_EN_ROUTE: "techEnRoute", ARRIVAL: "arrival",
  SERVICE_AGREEMENT: "serviceAgreement", IN_PROGRESS: "inProgress",
  COMPLETION: "completion",
  RATING: "rating", RECEIPT: "receipt", TIP: "tip",
  MY_SERVICES: "myServices", SERVICE_DETAIL: "serviceDetail",
  PROFILE_HUB: "profileHub", EDIT_PROFILE: "editProfile",
  SAVED_ADDRESSES: "savedAddresses", PAYMENT_METHODS: "paymentMethods",
  FAVORITE_TECHS: "favoriteTechs", REVIEWS_RECEIVED: "reviewsReceived",
  SETTINGS: "settings",
  HELP_CENTER: "helpCenter", DISPUTE: "dispute",
  NOTIFICATIONS: "notifications", ERROR_STATE: "errorState",
};

// ─── MOCK DATA ───
const SERVICES = [
  { id: "plomeria", name: "Plomería", icon: "🔧", color: "#1A7A4B" },
  { id: "electricidad", name: "Electricidad", icon: "⚡", color: "#E8732A" },
  { id: "cerrajeria", name: "Cerrajería", icon: "🔑", color: "#7C3AED" },
  { id: "carpinteria", name: "Carpintería", icon: "🪚", color: "#B45309" },
  { id: "albanileria", name: "Albañilería", icon: "🧱", color: "#DC2626" },
  { id: "pintura", name: "Pintura", icon: "🎨", color: "#2563EB" },
  { id: "herreria", name: "Herrería", icon: "⚒️", color: "#475569" },
  { id: "fumigacion", name: "Fumigación", icon: "🧴", color: "#059669" },
  { id: "jardineria", name: "Jardinería", icon: "🌿", color: "#16A34A" },
];

const SUBCATEGORIES = {
  plomeria: ["Fuga de agua", "Instalación de boiler", "Destape de drenaje", "Reparación de WC", "Instalación de tinaco", "Mantenimiento general"],
  electricidad: ["Corto circuito", "Instalación de contactos", "Cambio de cableado", "Instalación de lámparas", "Tablero eléctrico", "Apagones parciales"],
  cerrajeria: ["Apertura de puerta", "Cambio de cerradura", "Copia de llave", "Cerradura digital", "Reja de seguridad"],
  carpinteria: ["Mueble a medida", "Reparación de puerta", "Closet/vestidor", "Piso de madera", "Cocina integral"],
  albanileria: ["Remodelación", "Construcción de barda", "Impermeabilización", "Piso y azulejo", "Ampliación"],
  pintura: ["Interior", "Exterior", "Fachada", "Acabados decorativos", "Impermeabilizante"],
  herreria: ["Portón", "Ventanas", "Barandal", "Reja de seguridad", "Estructura metálica"],
  fumigacion: ["Cucarachas", "Termitas", "Roedores", "Alacranes", "Fumigación general"],
  jardineria: ["Poda", "Diseño de jardín", "Sistema de riego", "Mantenimiento mensual", "Limpieza de terreno"],
};

const TECHNICIANS = [
  { id: 1, name: "Carlos Mendoza", specialty: "Plomería", rating: 4.9, jobs: 234, price: 490, eta: "25 min", distance: "3.2 km", verified: true, photo: "👨‍🔧", reviews: 187, responseTime: "~5 min", completionRate: "98%", certifications: ["CONOCER EC0586", "Rotoplas Certificado"], portfolio: ["Reparación de fuga en cocina", "Instalación de calentador solar", "Destape de drenaje principal"] },
  { id: 2, name: "Roberto Jiménez", specialty: "Plomería", rating: 4.7, jobs: 156, price: 550, eta: "35 min", distance: "5.1 km", verified: true, photo: "👷", reviews: 124, responseTime: "~10 min", completionRate: "96%", certifications: ["CONOCER EC0586"], portfolio: ["Mantenimiento de cisternas", "Instalación de WC", "Reparación de tubería de cobre"] },
  { id: 3, name: "Miguel Ángel Torres", specialty: "Plomería", rating: 4.5, jobs: 89, price: 420, eta: "20 min", distance: "2.1 km", verified: true, photo: "🧑‍🔧", reviews: 67, responseTime: "~8 min", completionRate: "94%", certifications: ["Capacitación CMIC"], portfolio: ["Instalación de tinacos", "Reparación de llaves", "Cambio de mangueras"] },
];

const PAST_SERVICES = [
  { id: 1001, type: "Plomería", subtype: "Fuga de agua", tech: "Carlos Mendoza", date: "10 May 2026", status: "completado", amount: 540, rating: 5 },
  { id: 1002, type: "Electricidad", subtype: "Instalación de contactos", tech: "Ana Gutiérrez", date: "28 Abr 2026", status: "completado", amount: 380, rating: 4 },
  { id: 1003, type: "Cerrajería", subtype: "Cambio de cerradura", tech: "Pedro Ramírez", date: "15 Abr 2026", status: "cancelado", amount: 0, rating: null },
];

const USER_REVIEWS = [
  { from: "Carlos Mendoza", rating: 5, text: "Excelente cliente, muy amable y puntual.", date: "10 May 2026" },
  { from: "Ana Gutiérrez", rating: 5, text: "Casa limpia y organizada, facilita mucho el trabajo.", date: "28 Abr 2026" },
  { from: "Luis Hernández", rating: 4, text: "Buen trato, un poco difícil de encontrar la dirección.", date: "2 Mar 2026" },
];

// ─── REUSABLE COMPONENTS ───

const StatusBar = () => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 20px 4px", fontSize: 12, fontWeight: 600, color: C.textPrimary }}>
    <span>9:41</span>
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      <span style={{ fontSize: 10 }}>●●●●</span>
      <span style={{ fontSize: 10 }}>WiFi</span>
      <span style={{ fontSize: 11 }}>🔋</span>
    </div>
  </div>
);

const NavHeader = ({ title, onBack, rightAction, rightIcon }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderBottom: `1px solid ${C.border}` }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {onBack && <button onClick={onBack} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", padding: 0, color: C.textPrimary }}>←</button>}
      <span style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary }}>{title}</span>
    </div>
    {rightAction && <button onClick={rightAction} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: C.textSecondary }}>{rightIcon || "⋯"}</button>}
  </div>
);

const BottomNav = ({ active, onNavigate }) => {
  const tabs = [
    { id: "home", label: "Inicio", icon: "🏠", screen: S.HOME },
    { id: "services", label: "Mis servicios", icon: "📋", screen: S.MY_SERVICES },
    { id: "profile", label: "Perfil", icon: "👤", screen: S.PROFILE_HUB },
  ];
  return (
    <div style={{ display: "flex", borderTop: `1px solid ${C.border}`, background: C.white, paddingBottom: 8 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onNavigate(t.screen)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "10px 0 4px", background: "none", border: "none", cursor: "pointer", color: active === t.id ? C.primary : C.textMuted, fontWeight: active === t.id ? 700 : 400, fontSize: 10, transition: "all 0.2s" }}>
          <span style={{ fontSize: 20 }}>{t.icon}</span>
          <span>{t.label}</span>
          {active === t.id && <div style={{ width: 20, height: 3, borderRadius: 2, background: C.primary, marginTop: 2 }} />}
        </button>
      ))}
    </div>
  );
};

const Btn = ({ children, onClick, variant = "primary", full = true, size = "md", disabled = false, style: sx = {} }) => {
  const base = { border: "none", borderRadius: 14, cursor: disabled ? "default" : "pointer", fontWeight: 700, transition: "all 0.2s", width: full ? "100%" : "auto", opacity: disabled ? 0.5 : 1, fontFamily: "inherit", ...sx };
  const sizes = { sm: { padding: "10px 16px", fontSize: 13 }, md: { padding: "14px 24px", fontSize: 15 }, lg: { padding: "18px 32px", fontSize: 16 } };
  const variants = {
    primary: { background: C.accent, color: C.white },
    secondary: { background: C.primaryLight, color: C.primary },
    outline: { background: "transparent", color: C.primary, border: `2px solid ${C.primary}` },
    danger: { background: C.danger, color: C.white },
    ghost: { background: "transparent", color: C.textSecondary },
  };
  return <button onClick={disabled ? undefined : onClick} style={{ ...base, ...sizes[size], ...variants[variant] }}>{children}</button>;
};

const Card = ({ children, onClick, style: sx = {} }) => (
  <div onClick={onClick} style={{ background: C.card, borderRadius: 16, padding: 16, boxShadow: C.shadow, border: `1px solid ${C.border}`, cursor: onClick ? "pointer" : "default", transition: "all 0.2s", ...sx }}>
    {children}
  </div>
);

const Stars = ({ rating, size = 18, interactive = false, onChange }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1, 2, 3, 4, 5].map(i => (
      <span key={i} onClick={() => interactive && onChange?.(i)} style={{ fontSize: size, cursor: interactive ? "pointer" : "default", color: i <= rating ? C.star : "#E5E7EB", transition: "transform 0.15s", display: "inline-block" }}>{i <= rating ? "★" : "☆"}</span>
    ))}
  </div>
);

const Badge = ({ children, color = C.primary, bg }) => (
  <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, color, background: bg || (color + "18") }}>{children}</span>
);

const InputField = ({ label, placeholder, value, onChange, type = "text", icon }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.textSecondary, marginBottom: 6 }}>{label}</label>}
    <div style={{ display: "flex", alignItems: "center", border: `1.5px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", background: C.white, gap: 8 }}>
      {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange?.(e.target.value)} style={{ border: "none", outline: "none", flex: 1, fontSize: 14, fontFamily: "inherit", color: C.textPrimary, background: "transparent" }} />
    </div>
  </div>
);

const ProgressDots = ({ current, total }) => (
  <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
    {Array.from({ length: total }, (_, i) => (
      <div key={i} style={{ width: i === current ? 24 : 8, height: 8, borderRadius: 4, background: i === current ? C.primary : "#D1D5DB", transition: "all 0.3s" }} />
    ))}
  </div>
);

const SectionTitle = ({ children, action, onAction }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
    <span style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary }}>{children}</span>
    {action && <button onClick={onAction} style={{ background: "none", border: "none", color: C.primary, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{action}</button>}
  </div>
);

const EmptyState = ({ icon, title, subtitle }) => (
  <div style={{ textAlign: "center", padding: "40px 20px" }}>
    <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
    <div style={{ fontSize: 16, fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>{title}</div>
    <div style={{ fontSize: 13, color: C.textMuted }}>{subtitle}</div>
  </div>
);

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
export default function AlTiroApp() {
  const [screen, setScreen] = useState(S.SPLASH);
  const [history, setHistory] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSubcat, setSelectedSubcat] = useState(null);
  const [selectedTech, setSelectedTech] = useState(null);
  const [rating, setRating] = useState(0);
  const [tipAmount, setTipAmount] = useState(0);
  const [obStep, setObStep] = useState(0);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [paymentSelected, setPaymentSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const [selectedTags, setSelectedTagsLocal] = useState([]);

  const nav = useCallback((s) => {
    setHistory(h => [...h, screen]);
    setScreen(s);
    if (s === S.HOME) setActiveTab("home");
    if (s === S.MY_SERVICES) setActiveTab("services");
    if (s === S.PROFILE_HUB) setActiveTab("profile");
  }, [screen]);

  const back = useCallback(() => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(h => h.slice(0, -1));
      setScreen(prev);
      if (prev === S.HOME) setActiveTab("home");
      if (prev === S.MY_SERVICES) setActiveTab("services");
      if (prev === S.PROFILE_HUB) setActiveTab("profile");
    }
  }, [history]);

  const resetFlow = () => {
    setSelectedService(null);
    setSelectedSubcat(null);
    setSelectedTech(null);
    setRating(0);
    setTipAmount(0);
    setAgreementAccepted(false);
    setPaymentSelected(null);
    setHistory([]);
    setScreen(S.HOME);
    setActiveTab("home");
  };

  // Auto-advance splash
  useEffect(() => {
    if (screen === S.SPLASH) {
      const t = setTimeout(() => setScreen(S.OB1), 2000);
      return () => clearTimeout(t);
    }
  }, [screen]);

  const showNav = [S.HOME, S.MY_SERVICES, S.SERVICE_DETAIL, S.PROFILE_HUB, S.EDIT_PROFILE, S.SAVED_ADDRESSES, S.PAYMENT_METHODS, S.FAVORITE_TECHS, S.REVIEWS_RECEIVED, S.SETTINGS, S.HELP_CENTER, S.NOTIFICATIONS].includes(screen);

  // ─── SCREEN RENDERERS ───

  const renderSplash = () => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: `linear-gradient(145deg, ${C.primary} 0%, ${C.primaryDark} 100%)`, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
      <div style={{ fontSize: 48, marginBottom: 8 }}>🐦</div>
      <div style={{ fontSize: 36, fontWeight: 800, color: C.white, letterSpacing: -1 }}>alTiro</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>Servicios de confianza</div>
      <div style={{ position: "absolute", bottom: 60, display: "flex", gap: 4 }}>
        {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.5)", animation: `pulse 1.2s ${i * 0.2}s infinite` }} />)}
      </div>
    </div>
  );

  const renderOnboarding = (step) => {
    const slides = [
      { icon: "🔍", title: "Técnicos verificados", desc: "Todos nuestros técnicos pasan por un proceso de verificación de identidad, antecedentes y certificaciones profesionales.", bg: C.primaryLight },
      { icon: "🛡️", title: "Pago seguro", desc: "Tu pago se retiene hasta que confirmes que el servicio fue completado satisfactoriamente. Sin sorpresas.", bg: C.accentLight },
      { icon: "⭐", title: "Garantía de servicio", desc: "Sistema de calificación bidireccional y acuerdo de servicio firmado antes de cada trabajo. Transparencia total.", bg: "#F0F4FF" },
    ];
    const s = slides[step];
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.white }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 32px", background: s.bg, margin: 16, borderRadius: 24 }}>
          <div style={{ fontSize: 72, marginBottom: 24 }}>{s.icon}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.textPrimary, textAlign: "center", marginBottom: 12 }}>{s.title}</div>
          <div style={{ fontSize: 15, color: C.textSecondary, textAlign: "center", lineHeight: 1.6 }}>{s.desc}</div>
        </div>
        <div style={{ padding: "20px 24px 32px" }}>
          <ProgressDots current={step} total={3} />
          <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
            {step > 0 && <Btn variant="ghost" full={false} onClick={() => { setObStep(step - 1); setScreen([S.OB1, S.OB2, S.OB3][step - 1]); }}>Atrás</Btn>}
            <Btn onClick={() => { if (step < 2) { setObStep(step + 1); setScreen([S.OB1, S.OB2, S.OB3][step + 1]); } else nav(S.LOGIN); }}>
              {step < 2 ? "Siguiente" : "Comenzar"}
            </Btn>
          </div>
        </div>
      </div>
    );
  };

  const renderLogin = () => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.white, padding: 24 }}>
      <div style={{ marginTop: 20, marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 28 }}>🐦</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: C.primary }}>alTiro</span>
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: C.textPrimary, marginBottom: 4 }}>Bienvenido</div>
        <div style={{ fontSize: 14, color: C.textSecondary }}>Inicia sesión o crea tu cuenta</div>
      </div>
      <InputField label="Número de teléfono" placeholder="442 123 4567" icon="📱" />
      <Btn onClick={() => nav(S.OTP)}>Continuar con teléfono</Btn>
      <div style={{ textAlign: "center", margin: "20px 0", color: C.textMuted, fontSize: 13 }}>— o continúa con —</div>
      <div style={{ display: "flex", gap: 12 }}>
        <Btn variant="outline" onClick={() => nav(S.OTP)}>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>🔵 Google</span>
        </Btn>
        <Btn variant="outline" onClick={() => nav(S.OTP)}>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>⚫ Apple</span>
        </Btn>
      </div>
      <div style={{ marginTop: "auto", textAlign: "center", fontSize: 11, color: C.textMuted, lineHeight: 1.6 }}>
        Al continuar, aceptas nuestros <span style={{ color: C.primary, fontWeight: 600 }}>Términos de Servicio</span> y <span style={{ color: C.primary, fontWeight: 600 }}>Política de Privacidad</span>
      </div>
    </div>
  );

  const renderOTP = () => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.white }}>
      <NavHeader title="Verificación" onBack={back} />
      <div style={{ padding: 24, flex: 1 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Ingresa el código</div>
        <div style={{ fontSize: 14, color: C.textSecondary, marginBottom: 32 }}>Enviamos un SMS al <strong>442 •••• 4567</strong></div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 32 }}>
          {[1, 4, 7, 2].map((n, i) => (
            <div key={i} style={{ width: 52, height: 56, borderRadius: 12, border: `2px solid ${i < 4 ? C.primary : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: C.textPrimary }}>{n}</div>
          ))}
        </div>
        <Btn onClick={() => nav(S.COMPLETE_PROFILE)}>Verificar</Btn>
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: C.textMuted }}>
          ¿No recibiste el código? <span style={{ color: C.primary, fontWeight: 600, cursor: "pointer" }}>Reenviar</span>
        </div>
      </div>
    </div>
  );

  const renderCompleteProfile = () => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", background: C.white }}>
      <NavHeader title="Completar perfil" onBack={back} />
      <div style={{ padding: 24, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, border: `3px dashed ${C.primary}`, cursor: "pointer" }}>📷</div>
        </div>
        <InputField label="Nombre completo" placeholder="Francisco García" icon="👤" />
        <InputField label="Correo electrónico" placeholder="francisco@email.com" icon="✉️" type="email" />
        <InputField label="Dirección principal" placeholder="Av. Universidad 100, Juriquilla" icon="📍" />
        <div style={{ marginTop: "auto", paddingTop: 16 }}>
          <Btn onClick={() => { setActiveTab("home"); setHistory([]); setScreen(S.HOME); }}>Guardar y continuar</Btn>
        </div>
      </div>
    </div>
  );

  // ─── MAIN FLOW ───

  const renderHome = () => (
    <div style={{ flex: 1, background: C.bg, overflowY: "auto" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryDark} 100%)`, padding: "20px 20px 28px", borderRadius: "0 0 28px 28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>🐦</span>
              <span style={{ fontSize: 18, fontWeight: 800, color: C.white }}>alTiro</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.white }}>Hola, Francisco 👋</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>¿Qué servicio necesitas hoy?</div>
          </div>
          <button onClick={() => nav(S.NOTIFICATIONS)} style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.15)", border: "none", fontSize: 18, cursor: "pointer", color: C.white, position: "relative" }}>
            🔔
            <div style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: 4, background: C.accent }} />
          </button>
        </div>
        {/* Emergency button */}
        <button onClick={() => { setSelectedService(SERVICES[0]); nav(S.ADDRESS); }} style={{ width: "100%", padding: "14px 20px", borderRadius: 14, background: "rgba(232,115,42,0.9)", border: "none", color: C.white, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          🚨 Emergencia — Necesito ayuda ahora
        </button>
      </div>

      <div style={{ padding: "20px 16px" }}>
        {/* Service Grid */}
        <SectionTitle>Servicios disponibles</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
          {SERVICES.map(s => (
            <Card key={s.id} onClick={() => { setSelectedService(s); nav(S.SUBCATEGORY); }} style={{ padding: 14, textAlign: "center", cursor: "pointer" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: s.color + "12", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 8px" }}>{s.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.textPrimary }}>{s.name}</div>
            </Card>
          ))}
        </div>

        {/* Recent */}
        <SectionTitle action="Ver todo" onAction={() => nav(S.MY_SERVICES)}>Servicios recientes</SectionTitle>
        {PAST_SERVICES.slice(0, 2).map(ps => (
          <Card key={ps.id} onClick={() => nav(S.SERVICE_DETAIL)} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
              {SERVICES.find(s => s.name === ps.type)?.icon || "🔧"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{ps.subtype}</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>{ps.tech} · {ps.date}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary }}>${ps.amount}</div>
              <Badge color={ps.status === "completado" ? C.success : C.danger}>{ps.status === "completado" ? "✓ Completado" : "✕ Cancelado"}</Badge>
            </div>
          </Card>
        ))}

        {/* Promo */}
        <Card style={{ marginTop: 16, background: `linear-gradient(135deg, ${C.accentLight} 0%, #FFF 100%)`, border: `1px solid ${C.accent}30` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 32 }}>🎉</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>¡Primer servicio con 20% OFF!</div>
              <div style={{ fontSize: 12, color: C.textSecondary }}>Usa el código ALTIRO20 en tu próximo servicio</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderSubcategory = () => (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
      <NavHeader title={selectedService?.name || "Servicio"} onBack={back} />
      <div style={{ padding: "16px 16px 24px", flex: 1, overflowY: "auto" }}>
        <div style={{ fontSize: 15, color: C.textSecondary, marginBottom: 16 }}>¿Qué tipo de servicio necesitas?</div>
        {(SUBCATEGORIES[selectedService?.id] || []).map((sub, i) => (
          <Card key={i} onClick={() => { setSelectedSubcat(sub); nav(S.ADDRESS); }} style={{ marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: (selectedService?.color || C.primary) + "12", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{selectedService?.icon}</div>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{sub}</span>
            </div>
            <span style={{ color: C.textMuted, fontSize: 18 }}>›</span>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAddress = () => (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
      <NavHeader title="Ubicación y horario" onBack={back} />
      <div style={{ padding: 16, flex: 1, overflowY: "auto" }}>
        {/* Map placeholder */}
        <div style={{ height: 180, borderRadius: 16, background: `linear-gradient(135deg, #E8F5EE 0%, #D1FAE5 100%)`, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 40, height: 40, borderRadius: 20, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontSize: 18, boxShadow: `0 4px 12px ${C.primary}40` }}>📍</div>
          <div style={{ position: "absolute", bottom: 12, left: 12, background: C.white, borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 600 }}>Querétaro Centro</div>
        </div>

        <SectionTitle>Dirección del servicio</SectionTitle>
        <Card style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center" }}>🏠</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Mi casa</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>Av. Universidad 100, Juriquilla, 76230</div>
            </div>
            <span style={{ color: C.primary, fontWeight: 700, fontSize: 18 }}>✓</span>
          </div>
        </Card>
        <Card style={{ marginBottom: 16, border: `1.5px dashed ${C.border}`, background: C.bg }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", padding: "4px 0" }}>
            <span style={{ color: C.primary, fontSize: 18 }}>＋</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.primary }}>Agregar nueva dirección</span>
          </div>
        </Card>

        <SectionTitle>¿Cuándo lo necesitas?</SectionTitle>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          {["Lo antes posible", "Programar"].map((opt, i) => (
            <button key={i} style={{ flex: 1, padding: "12px 16px", borderRadius: 12, border: `2px solid ${i === 0 ? C.primary : C.border}`, background: i === 0 ? C.primaryLight : C.white, fontSize: 13, fontWeight: 600, color: i === 0 ? C.primary : C.textSecondary, cursor: "pointer" }}>
              {i === 0 ? "⚡ " : "📅 "}{opt}
            </button>
          ))}
        </div>

        <div style={{ marginTop: "auto", paddingTop: 20 }}>
          <Btn onClick={() => nav(S.TECHNICIANS)}>Buscar técnicos disponibles</Btn>
        </div>
      </div>
    </div>
  );

  const renderTechnicians = () => (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
      <NavHeader title="Técnicos disponibles" onBack={back} />
      <div style={{ padding: "8px 16px", display: "flex", gap: 8 }}>
        {["⭐ Mejor valorados", "💰 Precio", "⏱ Más cerca"].map((f, i) => (
          <button key={i} style={{ padding: "8px 12px", borderRadius: 20, border: `1.5px solid ${i === 0 ? C.primary : C.border}`, background: i === 0 ? C.primaryLight : C.white, fontSize: 11, fontWeight: 600, color: i === 0 ? C.primary : C.textSecondary, cursor: "pointer", whiteSpace: "nowrap" }}>{f}</button>
        ))}
      </div>
      <div style={{ padding: 16, flex: 1, overflowY: "auto" }}>
        {TECHNICIANS.map(t => (
          <Card key={t.id} onClick={() => { setSelectedTech(t); nav(S.TECH_DETAIL); }} style={{ marginBottom: 12, cursor: "pointer" }}>
            <div style={{ display: "flex", gap: 14 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, position: "relative" }}>
                {t.photo}
                {t.verified && <div style={{ position: "absolute", bottom: -2, right: -2, width: 18, height: 18, borderRadius: 9, background: C.success, border: `2px solid ${C.white}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: C.white }}>✓</div>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{t.specialty} · {t.distance}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 16, fontWeight: 800, color: C.primary }}>${t.price}</div>
                    <div style={{ fontSize: 10, color: C.textMuted }}>MXN est.</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 8, alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Stars rating={Math.floor(t.rating)} size={12} />
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{t.rating}</span>
                  </div>
                  <span style={{ fontSize: 11, color: C.textMuted }}>🛠 {t.jobs} trabajos</span>
                  <span style={{ fontSize: 11, color: C.textMuted }}>⏱ {t.eta}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTechDetail = () => {
    const t = selectedTech || TECHNICIANS[0];
    return (
      <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <NavHeader title="Perfil del técnico" onBack={back} rightIcon="♡" rightAction={() => {}} />
        <div style={{ padding: 16 }}>
          {/* Header card */}
          <Card style={{ textAlign: "center", marginBottom: 16, padding: 24 }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 12px" }}>{t.photo}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: C.textPrimary }}>{t.name}</div>
            <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 8 }}>{t.specialty} · Querétaro</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 12 }}>
              <Stars rating={Math.floor(t.rating)} size={16} />
              <span style={{ fontWeight: 700, fontSize: 14 }}>{t.rating}</span>
              <span style={{ fontSize: 12, color: C.textMuted }}>({t.reviews} reseñas)</span>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 16 }}>
              <Badge color={C.success}>✓ Verificado</Badge>
              <Badge color={C.primary}>{t.completionRate} completado</Badge>
            </div>
          </Card>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
            {[
              { val: t.jobs, label: "Trabajos" },
              { val: t.responseTime, label: "Respuesta" },
              { val: t.eta, label: "Llegada est." },
            ].map((s, i) => (
              <Card key={i} style={{ textAlign: "center", padding: 14 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.primary }}>{s.val}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{s.label}</div>
              </Card>
            ))}
          </div>

          {/* Certifications */}
          <SectionTitle>Certificaciones</SectionTitle>
          <Card style={{ marginBottom: 16 }}>
            {t.certifications.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < t.certifications.length - 1 ? `1px solid ${C.border}` : "none" }}>
                <span style={{ fontSize: 16 }}>🏅</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{c}</span>
              </div>
            ))}
          </Card>

          {/* Portfolio */}
          <SectionTitle>Portafolio de trabajos</SectionTitle>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 16, paddingBottom: 4 }}>
            {t.portfolio.map((p, i) => (
              <div key={i} style={{ minWidth: 140, height: 100, borderRadius: 12, background: `linear-gradient(135deg, ${[C.primaryLight, C.accentLight, "#F0F4FF"][i % 3]} 0%, #FFF 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 12, textAlign: "center", fontSize: 11, fontWeight: 600, color: C.textSecondary, border: `1px solid ${C.border}` }}>
                {p}
              </div>
            ))}
          </div>

          {/* Price */}
          <Card style={{ marginBottom: 16, background: C.primaryLight, border: `1px solid ${C.primary}30` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, color: C.textSecondary }}>Precio estimado</div>
                <div style={{ fontSize: 24, fontWeight: 800, color: C.primary }}>${t.price} <span style={{ fontSize: 14, fontWeight: 600 }}>MXN</span></div>
              </div>
              <div style={{ fontSize: 12, color: C.textMuted }}>*Sujeto a inspección</div>
            </div>
          </Card>

          <Btn onClick={() => nav(S.SUMMARY)}>Seleccionar a {t.name.split(" ")[0]}</Btn>
        </div>
      </div>
    );
  };

  const renderSummary = () => {
    const t = selectedTech || TECHNICIANS[0];
    return (
      <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <NavHeader title="Resumen de solicitud" onBack={back} />
        <div style={{ padding: 16 }}>
          <Card style={{ marginBottom: 16 }}>
            <SectionTitle>Servicio solicitado</SectionTitle>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: (selectedService?.color || C.primary) + "12", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{selectedService?.icon || "🔧"}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{selectedService?.name || "Plomería"}</div>
                <div style={{ fontSize: 13, color: C.textMuted }}>{selectedSubcat || "Fuga de agua"}</div>
              </div>
            </div>
          </Card>

          <Card style={{ marginBottom: 16 }}>
            <SectionTitle>Técnico asignado</SectionTitle>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{t.photo}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{t.name}</div>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <Stars rating={Math.floor(t.rating)} size={11} />
                  <span style={{ fontSize: 12, color: C.textMuted }}>{t.rating}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card style={{ marginBottom: 16 }}>
            <SectionTitle>Ubicación y horario</SectionTitle>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>📍 Av. Universidad 100, Juriquilla</div>
            <div style={{ fontSize: 13, color: C.textMuted }}>⚡ Lo antes posible · Llegada est. {t.eta}</div>
          </Card>

          {/* Upload photos */}
          <Card style={{ marginBottom: 16 }}>
            <SectionTitle>Material de diagnóstico</SectionTitle>
            <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 12 }}>Sube fotos del problema para un mejor diagnóstico</div>
            <div style={{ display: "flex", gap: 10 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 72, height: 72, borderRadius: 12, border: `2px dashed ${i === 0 ? C.primary : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: i === 0 ? 14 : 24, color: i === 0 ? C.primary : C.textMuted, background: i === 0 ? C.primaryLight : C.bg, cursor: "pointer" }}>
                  {i === 0 ? <span style={{ textAlign: "center", lineHeight: 1.2 }}>📷<br/><span style={{ fontSize: 9 }}>Agregar</span></span> : "+"}
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ marginBottom: 16 }}>
            <SectionTitle>Descripción del problema</SectionTitle>
            <textarea placeholder="Describe tu problema con el mayor detalle posible..." style={{ width: "100%", height: 80, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: 12, fontSize: 13, fontFamily: "inherit", resize: "none", outline: "none", boxSizing: "border-box" }} />
          </Card>

          <Btn onClick={() => nav(S.CONTEXTUAL_CHAT)}>Enviar al técnico</Btn>
        </div>
      </div>
    );
  };

  const renderContextChat = () => {
    const t = selectedTech || TECHNICIANS[0];
    return (
      <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
        <NavHeader title={`Chat con ${t.name.split(" ")[0]}`} onBack={back} />
        <div style={{ background: C.accentLight, padding: "8px 16px", fontSize: 12, color: C.accent, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
          ⓘ Este chat solo está activo durante el servicio
        </div>
        <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
          {/* Chat messages */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {/* System */}
            <div style={{ textAlign: "center", fontSize: 11, color: C.textMuted, margin: "8px 0" }}>Solicitud enviada · Hoy 10:32 AM</div>
            {/* Tech */}
            <div style={{ display: "flex", gap: 8, maxWidth: "80%" }}>
              <div style={{ width: 28, height: 28, borderRadius: 14, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{t.photo}</div>
              <div style={{ background: C.white, borderRadius: "4px 16px 16px 16px", padding: 12, boxShadow: C.shadow, fontSize: 13 }}>
                Hola Francisco, vi las fotos. Parece una fuga en la unión del tubo. Llevo la herramienta necesaria. ¿El agua está cortada?
              </div>
            </div>
            {/* User */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ background: C.primary, color: C.white, borderRadius: "16px 4px 16px 16px", padding: 12, maxWidth: "80%", fontSize: 13 }}>
                Sí, ya cerré la llave de paso. Te espero 👍
              </div>
            </div>
            {/* Tech */}
            <div style={{ display: "flex", gap: 8, maxWidth: "80%" }}>
              <div style={{ width: 28, height: 28, borderRadius: 14, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{t.photo}</div>
              <div style={{ background: C.white, borderRadius: "4px 16px 16px 16px", padding: 12, boxShadow: C.shadow, fontSize: 13 }}>
                Perfecto. Voy en camino, llego en ~25 minutos. 🚗
              </div>
            </div>
          </div>
        </div>
        {/* Input */}
        <div style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}`, background: C.white, display: "flex", gap: 8 }}>
          <button style={{ width: 40, height: 40, borderRadius: 12, background: C.bg, border: "none", fontSize: 18, cursor: "pointer" }}>📷</button>
          <div style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: 20, padding: "10px 14px", fontSize: 13 }}>Escribe un mensaje...</div>
          <button style={{ width: 40, height: 40, borderRadius: 20, background: C.primary, border: "none", color: C.white, fontSize: 16, cursor: "pointer" }}>➤</button>
        </div>
        <div style={{ padding: "8px 16px 12px" }}>
          <Btn onClick={() => nav(S.PAYMENT_METHOD)}>Confirmar y seleccionar pago</Btn>
        </div>
      </div>
    );
  };

  const renderPaymentMethod = () => (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
      <NavHeader title="Método de pago" onBack={back} />
      <div style={{ padding: 16, flex: 1 }}>
        <div style={{ fontSize: 15, color: C.textSecondary, marginBottom: 16 }}>Selecciona cómo deseas pagar</div>
        {[
          { id: "card", icon: "💳", name: "Tarjeta •••• 4532", sub: "Visa · Expira 08/27" },
          { id: "transfer", icon: "🏦", name: "Transferencia bancaria", sub: "SPEI · Pago inmediato" },
          { id: "mercadopago", icon: "🟦", name: "Mercado Pago", sub: "Saldo disponible" },
        ].map(pm => (
          <Card key={pm.id} onClick={() => setPaymentSelected(pm.id)} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 14, cursor: "pointer", border: `2px solid ${paymentSelected === pm.id ? C.primary : C.border}` }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{pm.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{pm.name}</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>{pm.sub}</div>
            </div>
            <div style={{ width: 22, height: 22, borderRadius: 11, border: `2px solid ${paymentSelected === pm.id ? C.primary : C.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {paymentSelected === pm.id && <div style={{ width: 12, height: 12, borderRadius: 6, background: C.primary }} />}
            </div>
          </Card>
        ))}
        <Card style={{ marginBottom: 16, border: `1.5px dashed ${C.border}`, background: C.bg, cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
            <span style={{ color: C.primary }}>＋</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.primary }}>Agregar método de pago</span>
          </div>
        </Card>
        <div style={{ marginTop: "auto" }}>
          <Btn onClick={() => nav(S.CONFIRM_REQUEST)} disabled={!paymentSelected}>Continuar</Btn>
        </div>
      </div>
    </div>
  );

  const renderConfirmRequest = () => {
    const t = selectedTech || TECHNICIANS[0];
    return (
      <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <NavHeader title="Confirmar solicitud" onBack={back} />
        <div style={{ padding: 16 }}>
          <Card style={{ marginBottom: 16, padding: 20 }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.textSecondary }}>Total estimado</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: C.primary }}>$540.00 <span style={{ fontSize: 16 }}>MXN</span></div>
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
              {[
                { label: "Servicio", val: `$${t.price}.00` },
                { label: "Comisión alTiro (10%)", val: `$${Math.round(t.price * 0.1)}.00` },
                { label: "IVA (16%)", val: `$${Math.round(t.price * 0.1 * 0.16)}.00` },
              ].map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13, color: C.textSecondary }}>
                  <span>{row.label}</span>
                  <span style={{ fontWeight: 600 }}>{row.val}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ marginBottom: 12, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
              <span>🔧</span><span style={{ fontWeight: 600 }}>{selectedService?.name || "Plomería"}</span><span style={{ color: C.textMuted }}>· {selectedSubcat || "Fuga de agua"}</span>
            </div>
          </Card>
          <Card style={{ marginBottom: 12, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
              <span>{t.photo}</span><span style={{ fontWeight: 600 }}>{t.name}</span><Stars rating={Math.floor(t.rating)} size={10} />
            </div>
          </Card>
          <Card style={{ marginBottom: 12, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
              <span>📍</span><span>Av. Universidad 100, Juriquilla</span>
            </div>
          </Card>
          <Card style={{ marginBottom: 12, padding: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
              <span>💳</span><span>Visa •••• 4532</span>
            </div>
          </Card>

          <Card style={{ marginBottom: 16, background: C.successLight, border: `1px solid ${C.success}30` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: C.primaryDark }}>
              <span style={{ fontSize: 18 }}>🛡️</span>
              <span><strong>Pago protegido:</strong> Tu dinero se retiene hasta que confirmes que el servicio se completó satisfactoriamente.</span>
            </div>
          </Card>

          <Btn onClick={() => nav(S.TECH_EN_ROUTE)}>Confirmar servicio</Btn>
        </div>
      </div>
    );
  };

  // ─── DURING SERVICE ───

  const renderTechEnRoute = () => {
    const t = selectedTech || TECHNICIANS[0];
    return (
      <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
        <NavHeader title="Técnico en camino" />
        <div style={{ height: 200, background: `linear-gradient(135deg, #E8F5EE 0%, #D1FAE5 100%)`, position: "relative" }}>
          <div style={{ position: "absolute", bottom: 60, left: "30%", fontSize: 24 }}>🚗</div>
          <div style={{ position: "absolute", bottom: 30, right: "20%", width: 16, height: 16, borderRadius: 8, background: C.accent, border: `3px solid ${C.white}` }} />
          <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, background: C.white, borderRadius: 12, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: C.shadow }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Llegada estimada</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: C.primary }}>{t.eta}</span>
          </div>
        </div>
        <div style={{ padding: 16, flex: 1 }}>
          <Card style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{t.photo}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>{t.specialty} · En camino</div>
              </div>
              <button style={{ width: 40, height: 40, borderRadius: 12, background: C.primaryLight, border: "none", fontSize: 18, cursor: "pointer" }}>💬</button>
            </div>
          </Card>

          <Card style={{ marginBottom: 16, padding: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Estado del servicio</div>
            {["Solicitud confirmada", "Técnico en camino", "Técnico llegó", "Servicio en progreso"].map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
                <div style={{ width: 24, height: 24, borderRadius: 12, background: i < 2 ? C.success : C.bg, border: `2px solid ${i < 2 ? C.success : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.white }}>{i < 2 ? "✓" : ""}</div>
                <span style={{ fontSize: 13, fontWeight: i === 1 ? 700 : 400, color: i <= 1 ? C.textPrimary : C.textMuted }}>{step}</span>
              </div>
            ))}
          </Card>

          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="outline" onClick={() => nav(S.ARRIVAL)}>Chat con técnico</Btn>
            <Btn variant="danger" full={false} size="sm" onClick={() => nav(S.HOME)}>Cancelar</Btn>
          </div>
          <div style={{ marginTop: 12 }}>
            <Btn variant="secondary" onClick={() => nav(S.ARRIVAL)}>Simular: Técnico llegó ›</Btn>
          </div>
        </div>
      </div>
    );
  };

  const renderArrival = () => {
    const t = selectedTech || TECHNICIANS[0];
    return (
      <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
        <NavHeader title="Confirmación de llegada" onBack={back} />
        <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 96, height: 96, borderRadius: 24, background: C.successLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, marginBottom: 16 }}>🏠</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.textPrimary, textAlign: "center", marginBottom: 4 }}>¡{t.name.split(" ")[0]} ha llegado!</div>
          <div style={{ fontSize: 14, color: C.textSecondary, textAlign: "center", marginBottom: 32 }}>Confirma que el técnico se encuentra en tu domicilio</div>
          <div style={{ width: "100%", maxWidth: 300 }}>
            <Btn onClick={() => nav(S.SERVICE_AGREEMENT)}>✓ Confirmar llegada</Btn>
            <div style={{ height: 10 }} />
            <Btn variant="ghost" onClick={back}>El técnico aún no llega</Btn>
          </div>
        </div>
      </div>
    );
  };

  const renderServiceAgreement = () => {
    const t = selectedTech || TECHNICIANS[0];
    return (
      <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <NavHeader title="Acuerdo de servicio" onBack={back} />
        <div style={{ background: C.accentLight, padding: "10px 16px", fontSize: 12, color: C.accent, fontWeight: 600 }}>
          ⚠️ Ambas partes deben aceptar antes de iniciar el trabajo
        </div>
        <div style={{ padding: 16 }}>
          <Card style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{t.photo}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>Presupuesto tras inspección</div>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Trabajos a realizar:</div>
              {[
                "Reparación de fuga en unión de tubería de cocina",
                "Cambio de empaque deteriorado",
                "Revisión de presión en línea de agua",
              ].map((w, i) => (
                <div key={i} style={{ display: "flex", alignItems: "start", gap: 8, marginBottom: 6 }}>
                  <span style={{ color: C.success, marginTop: 2 }}>✓</span>
                  <span style={{ fontSize: 13, color: C.textPrimary }}>{w}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Materiales incluidos</div>
            {[
              { item: "Empaque universal 1/2\"", cost: "$35" },
              { item: "Cinta teflón", cost: "$15" },
              { item: "Silicón sellador", cost: "$45" },
            ].map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 2 ? `1px solid ${C.border}` : "none", fontSize: 13 }}>
                <span>{m.item}</span>
                <span style={{ fontWeight: 600 }}>{m.cost}</span>
              </div>
            ))}
          </Card>

          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Desglose de costos</div>
            {[
              { label: "Mano de obra", val: "$395.00" },
              { label: "Materiales", val: "$95.00" },
              { label: "Comisión alTiro (10%)", val: "$49.00" },
              { label: "IVA", val: "$7.84" },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13, color: C.textSecondary }}>
                <span>{r.label}</span><span style={{ fontWeight: 600 }}>{r.val}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0", marginTop: 8, borderTop: `2px solid ${C.primary}`, fontSize: 16, fontWeight: 800, color: C.primary }}>
              <span>Total</span><span>$546.84 MXN</span>
            </div>
          </Card>

          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>Tiempo estimado</div>
            <div style={{ fontSize: 13, color: C.textSecondary }}>⏱ Aproximadamente 45 minutos</div>
          </Card>

          {/* Difference alert */}
          <Card style={{ marginBottom: 16, background: "#FFFBEB", border: "1px solid #F59E0B30" }}>
            <div style={{ display: "flex", alignItems: "start", gap: 8 }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <div style={{ fontSize: 12, color: "#92400E" }}>
                <strong>Diferencia con estimado inicial:</strong> El presupuesto subió $56.84 respecto al estimado ($490). Esto se debe a los materiales adicionales detectados en la inspección.
              </div>
            </div>
          </Card>

          <div onClick={() => setAgreementAccepted(!agreementAccepted)} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, cursor: "pointer" }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${agreementAccepted ? C.primary : C.border}`, background: agreementAccepted ? C.primary : C.white, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontSize: 12 }}>{agreementAccepted && "✓"}</div>
            <span style={{ fontSize: 13, color: C.textPrimary }}>Acepto el acuerdo de servicio y los costos detallados</span>
          </div>

          <Btn onClick={() => nav(S.IN_PROGRESS)} disabled={!agreementAccepted}>Aceptar y comenzar servicio</Btn>
          <div style={{ height: 8 }} />
          <Btn variant="outline" onClick={back}>Rechazar y negociar</Btn>
        </div>
      </div>
    );
  };

  const renderInProgress = () => {
    const t = selectedTech || TECHNICIANS[0];
    return (
      <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
        <NavHeader title="Servicio en progreso" />
        <div style={{ flex: 1, padding: 16 }}>
          <Card style={{ marginBottom: 16, background: C.primaryLight, border: `2px solid ${C.primary}30` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: C.white, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{t.photo}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{t.name}</div>
                <Badge color={C.success}>● Trabajando</Badge>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 16, background: C.white, borderRadius: 12 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: C.primary, fontVariantNumeric: "tabular-nums" }}>00:32:15</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>Tiempo transcurrido</div>
              </div>
            </div>
          </Card>

          <Card style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Progreso del servicio</div>
            {[
              { step: "Inspección completada", done: true },
              { step: "Reparación de fuga", done: true },
              { step: "Cambio de empaque", done: false },
              { step: "Revisión de presión", done: false },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}>
                <div style={{ width: 22, height: 22, borderRadius: 11, background: s.done ? C.success : C.bg, border: `2px solid ${s.done ? C.success : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.white }}>{s.done ? "✓" : ""}</div>
                <span style={{ fontSize: 13, color: s.done ? C.textPrimary : C.textMuted, textDecoration: s.done ? "none" : "none" }}>{s.step}</span>
              </div>
            ))}
          </Card>

          <div style={{ display: "flex", gap: 10 }}>
            <Btn variant="outline" onClick={() => {}}>💬 Chat</Btn>
            <Btn variant="danger" full={false} size="sm">🚨 Problema</Btn>
          </div>
          <div style={{ marginTop: 12 }}>
            <Btn variant="secondary" onClick={() => nav(S.COMPLETION)}>Simular: Servicio terminado ›</Btn>
          </div>
        </div>
      </div>
    );
  };

  const renderCompletion = () => {
    const t = selectedTech || TECHNICIANS[0];
    return (
      <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: 88, height: 88, borderRadius: 44, background: C.successLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, marginBottom: 16 }}>✅</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.textPrimary, marginBottom: 4 }}>¡Servicio completado!</div>
        <div style={{ fontSize: 14, color: C.textSecondary, marginBottom: 8, textAlign: "center" }}>{t.name} ha marcado el servicio como terminado</div>
        <Card style={{ width: "100%", marginBottom: 16, marginTop: 8 }}>
          <div style={{ fontSize: 13, marginBottom: 8 }}>Verifica que se cumplió con el acuerdo:</div>
          {["Reparación de fuga en tubería", "Cambio de empaque", "Revisión de presión"].map((w, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
              <div style={{ width: 20, height: 20, borderRadius: 6, background: C.success, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.white }}>✓</div>
              <span style={{ fontSize: 13 }}>{w}</span>
            </div>
          ))}
        </Card>
        <Card style={{ width: "100%", marginBottom: 16, background: C.primaryLight, border: `1px solid ${C.primary}30` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Total cobrado</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: C.primary }}>$546.84 MXN</span>
          </div>
        </Card>
        <Btn onClick={() => nav(S.RATING)}>Confirmar y calificar</Btn>
        <div style={{ height: 8, width: "100%" }} />
        <Btn variant="outline" onClick={() => nav(S.DISPUTE)}>Reportar problema</Btn>
      </div>
    );
  };

  // ─── POST SERVICE ───

  const renderRating = () => {
    const t = selectedTech || TECHNICIANS[0];
    const tags = ["Puntual", "Limpio", "Buen precio", "Profesional", "Amable", "Eficiente"];
    return (
      <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <NavHeader title="Califica el servicio" />
        <div style={{ padding: 16, flex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: 18, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 8px" }}>{t.photo}</div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{t.name}</div>
            <div style={{ fontSize: 13, color: C.textMuted }}>¿Cómo fue tu experiencia?</div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <Stars rating={rating} size={36} interactive onChange={setRating} />
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 20 }}>
            {tags.map(tag => {
              const sel = selectedTags.includes(tag);
              return (
                <button key={tag} onClick={() => setSelectedTagsLocal(sel ? selectedTags.filter(t => t !== tag) : [...selectedTags, tag])} style={{ padding: "8px 16px", borderRadius: 20, border: `1.5px solid ${sel ? C.primary : C.border}`, background: sel ? C.primaryLight : C.white, fontSize: 13, fontWeight: 600, color: sel ? C.primary : C.textSecondary, cursor: "pointer" }}>
                  {tag}
                </button>
              );
            })}
          </div>

          <textarea placeholder="Escribe tu reseña (opcional)..." style={{ width: "100%", height: 80, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: 12, fontSize: 13, fontFamily: "inherit", resize: "none", outline: "none", marginBottom: 12, boxSizing: "border-box" }} />

          <Card style={{ marginBottom: 16, border: `1.5px dashed ${C.border}`, background: C.bg, cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
              <span>📷</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.primary }}>Agregar foto del resultado</span>
            </div>
          </Card>

          <Btn onClick={() => nav(S.RECEIPT)} disabled={rating === 0}>Enviar calificación</Btn>
        </div>
      </div>
    );
  };

  const renderReceipt = () => {
    const t = selectedTech || TECHNICIANS[0];
    return (
      <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <NavHeader title="Recibo digital" />
        <div style={{ padding: 16 }}>
          <Card style={{ padding: 24, marginBottom: 16 }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>🐦</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: C.primary }}>alTiro</span>
              </div>
              <div style={{ fontSize: 13, color: C.textMuted }}>Comprobante de servicio</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>ID: #ALT-2026-001847</div>
            </div>
            <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "12px 0", marginBottom: 12 }}>
              {[
                { l: "Servicio", v: selectedService?.name || "Plomería" },
                { l: "Subcategoría", v: selectedSubcat || "Fuga de agua" },
                { l: "Técnico", v: t.name },
                { l: "Fecha", v: "27 Feb 2026" },
                { l: "Duración", v: "45 minutos" },
                { l: "Ubicación", v: "Juriquilla, Querétaro" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13 }}>
                  <span style={{ color: C.textMuted }}>{r.l}</span>
                  <span style={{ fontWeight: 600 }}>{r.v}</span>
                </div>
              ))}
            </div>
            <div>
              {[
                { l: "Mano de obra", v: "$395.00" },
                { l: "Materiales", v: "$95.00" },
                { l: "Comisión (10%)", v: "$49.00" },
                { l: "IVA", v: "$7.84" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", fontSize: 13, color: C.textSecondary }}>
                  <span>{r.l}</span><span>{r.v}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 0", marginTop: 8, borderTop: `2px solid ${C.primary}`, fontSize: 17, fontWeight: 800, color: C.primary }}>
                <span>Total</span><span>$546.84 MXN</span>
              </div>
            </div>
          </Card>

          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <Btn variant="outline" size="sm">📄 Descargar PDF</Btn>
            <Btn variant="outline" size="sm">📧 Enviar por correo</Btn>
          </div>

          <Btn onClick={() => nav(S.TIP)}>Continuar</Btn>
        </div>
      </div>
    );
  };

  const renderTip = () => {
    const t = selectedTech || TECHNICIANS[0];
    return (
      <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, marginBottom: 12 }}>{t.photo}</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.textPrimary, marginBottom: 4 }}>¿Deseas dejar propina?</div>
        <div style={{ fontSize: 14, color: C.textSecondary, marginBottom: 24, textAlign: "center" }}>Tu propina va 100% al técnico</div>

        <div style={{ display: "flex", gap: 12, marginBottom: 24, width: "100%", justifyContent: "center" }}>
          {[20, 50, 100].map(amt => (
            <button key={amt} onClick={() => setTipAmount(amt)} style={{ width: 72, height: 72, borderRadius: 16, border: `2px solid ${tipAmount === amt ? C.primary : C.border}`, background: tipAmount === amt ? C.primaryLight : C.white, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: tipAmount === amt ? C.primary : C.textPrimary }}>${amt}</span>
              <span style={{ fontSize: 10, color: C.textMuted }}>MXN</span>
            </button>
          ))}
        </div>

        <div style={{ width: "100%" }}>
          <Btn onClick={resetFlow}>{tipAmount > 0 ? `Dejar $${tipAmount} de propina` : "Continuar sin propina"}</Btn>
          {tipAmount > 0 && (
            <div style={{ marginTop: 8 }}>
              <Btn variant="ghost" onClick={() => { setTipAmount(0); resetFlow(); }}>No, gracias</Btn>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ─── MY SERVICES ───

  const renderMyServices = () => (
    <div style={{ flex: 1, background: C.bg, overflowY: "auto" }}>
      <div style={{ padding: "16px 16px 8px" }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.textPrimary, marginBottom: 4 }}>Mis servicios</div>
        <div style={{ fontSize: 13, color: C.textMuted }}>Historial completo de tus servicios</div>
      </div>
      <div style={{ display: "flex", gap: 8, padding: "8px 16px" }}>
        {["Todos", "Completados", "Cancelados"].map((f, i) => (
          <button key={f} style={{ padding: "8px 14px", borderRadius: 20, border: `1.5px solid ${i === 0 ? C.primary : C.border}`, background: i === 0 ? C.primaryLight : C.white, fontSize: 12, fontWeight: 600, color: i === 0 ? C.primary : C.textSecondary, cursor: "pointer" }}>{f}</button>
        ))}
      </div>
      <div style={{ padding: 16 }}>
        {PAST_SERVICES.map(ps => (
          <Card key={ps.id} onClick={() => nav(S.SERVICE_DETAIL)} style={{ marginBottom: 10, cursor: "pointer" }}>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: ps.status === "completado" ? C.successLight : C.dangerLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                {SERVICES.find(s => s.name === ps.type)?.icon || "🔧"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{ps.subtype}</div>
                  <Badge color={ps.status === "completado" ? C.success : C.danger}>{ps.status}</Badge>
                </div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{ps.tech} · {ps.date}</div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: C.primary }}>${ps.amount} MXN</span>
                  {ps.rating && <Stars rating={ps.rating} size={12} />}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderServiceDetail = () => (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <NavHeader title="Detalle del servicio" onBack={back} />
      <div style={{ padding: 16 }}>
        <Card style={{ marginBottom: 16, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: C.successLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🔧</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>Fuga de agua</div>
              <div style={{ fontSize: 13, color: C.textMuted }}>Plomería · 10 May 2026</div>
            </div>
            <Badge color={C.success} bg={C.successLight}>Completado</Badge>
          </div>
          {[
            { l: "Técnico", v: "Carlos Mendoza" },
            { l: "Duración", v: "45 minutos" },
            { l: "Ubicación", v: "Av. Universidad 100, Juriquilla" },
            { l: "Método de pago", v: "Visa •••• 4532" },
            { l: "Total", v: "$540.00 MXN" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < 4 ? `1px solid ${C.border}` : "none", fontSize: 13 }}>
              <span style={{ color: C.textMuted }}>{r.l}</span>
              <span style={{ fontWeight: 600 }}>{r.v}</span>
            </div>
          ))}
        </Card>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <Btn variant="secondary" onClick={() => {}}>📄 Ver recibo</Btn>
          <Btn variant="outline" onClick={() => nav(S.DISPUTE)}>⚠ Reportar</Btn>
        </div>
        <Btn onClick={() => { setSelectedTech(TECHNICIANS[0]); nav(S.ADDRESS); }}>🔄 Recontratar a Carlos</Btn>
      </div>
    </div>
  );

  // ─── PROFILE ───

  const renderProfileHub = () => (
    <div style={{ flex: 1, background: C.bg, overflowY: "auto" }}>
      <div style={{ background: C.white, padding: "20px 16px", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>👨</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.textPrimary }}>Francisco García</div>
            <div style={{ fontSize: 13, color: C.textMuted }}>francisco@email.com</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <Stars rating={4} size={12} />
              <span style={{ fontSize: 12, fontWeight: 600 }}>4.8</span>
              <span style={{ fontSize: 11, color: C.textMuted }}>· 3 servicios</span>
            </div>
          </div>
          <button onClick={() => nav(S.EDIT_PROFILE)} style={{ width: 36, height: 36, borderRadius: 10, background: C.bg, border: "none", fontSize: 14, cursor: "pointer" }}>✏️</button>
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        {[
          { icon: "👤", label: "Editar perfil", screen: S.EDIT_PROFILE },
          { icon: "📍", label: "Direcciones guardadas", screen: S.SAVED_ADDRESSES },
          { icon: "💳", label: "Métodos de pago", screen: S.PAYMENT_METHODS },
          { icon: "❤️", label: "Técnicos favoritos", screen: S.FAVORITE_TECHS },
          { icon: "⭐", label: "Reseñas recibidas", screen: S.REVIEWS_RECEIVED },
        ].map((item, i) => (
          <Card key={i} onClick={() => nav(item.screen)} style={{ marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{item.label}</span>
            </div>
            <span style={{ color: C.textMuted }}>›</span>
          </Card>
        ))}

        <div style={{ height: 8 }} />
        {[
          { icon: "❓", label: "Centro de ayuda", screen: S.HELP_CENTER },
          { icon: "⚙️", label: "Configuración", screen: S.SETTINGS },
        ].map((item, i) => (
          <Card key={i} onClick={() => nav(item.screen)} style={{ marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{item.label}</span>
            </div>
            <span style={{ color: C.textMuted }}>›</span>
          </Card>
        ))}

        <div style={{ padding: "16px 0 32px" }}>
          <Btn variant="ghost" onClick={() => setScreen(S.LOGIN)}>
            <span style={{ color: C.danger }}>Cerrar sesión</span>
          </Btn>
        </div>
      </div>
    </div>
  );

  const renderEditProfile = () => (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
      <NavHeader title="Editar perfil" onBack={back} />
      <div style={{ padding: 16, flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>👨</div>
            <div style={{ position: "absolute", bottom: -4, right: -4, width: 28, height: 28, borderRadius: 14, background: C.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: C.white, border: `2px solid ${C.white}` }}>📷</div>
          </div>
        </div>
        <InputField label="Nombre completo" placeholder="Francisco García" value="Francisco García" icon="👤" />
        <InputField label="Teléfono" placeholder="442 123 4567" value="442 123 4567" icon="📱" />
        <InputField label="Correo electrónico" placeholder="francisco@email.com" value="francisco@email.com" icon="✉️" />
        <div style={{ marginTop: "auto" }}>
          <Btn onClick={back}>Guardar cambios</Btn>
        </div>
      </div>
    </div>
  );

  const renderSavedAddresses = () => (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
      <NavHeader title="Direcciones" onBack={back} />
      <div style={{ padding: 16 }}>
        {[
          { icon: "🏠", name: "Mi casa", addr: "Av. Universidad 100, Juriquilla, 76230" },
          { icon: "🏢", name: "Oficina", addr: "Blvd. Bernardo Quintana 500, Centro Sur" },
        ].map((a, i) => (
          <Card key={i} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{a.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{a.name}</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>{a.addr}</div>
            </div>
            <button style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer" }}>✏️</button>
          </Card>
        ))}
        <Card style={{ border: `1.5px dashed ${C.border}`, background: C.bg, cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
            <span style={{ color: C.primary }}>＋</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.primary }}>Agregar dirección</span>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderPaymentMethods = () => (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
      <NavHeader title="Métodos de pago" onBack={back} />
      <div style={{ padding: 16 }}>
        {[
          { icon: "💳", name: "Visa •••• 4532", sub: "Expira 08/27", primary: true },
          { icon: "🏦", name: "BBVA •••• 7891", sub: "Débito", primary: false },
        ].map((pm, i) => (
          <Card key={i} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{pm.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{pm.name}</div>
              <div style={{ fontSize: 12, color: C.textMuted }}>{pm.sub}</div>
            </div>
            {pm.primary && <Badge color={C.primary}>Principal</Badge>}
          </Card>
        ))}
        <Card style={{ border: `1.5px dashed ${C.border}`, background: C.bg, cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
            <span style={{ color: C.primary }}>＋</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.primary }}>Agregar tarjeta</span>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderFavoriteTechs = () => (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
      <NavHeader title="Técnicos favoritos" onBack={back} />
      <div style={{ padding: 16 }}>
        {TECHNICIANS.slice(0, 2).map(t => (
          <Card key={t.id} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{t.photo}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Stars rating={Math.floor(t.rating)} size={11} />
                <span style={{ fontSize: 12, color: C.textMuted }}>{t.specialty}</span>
              </div>
            </div>
            <Btn variant="secondary" full={false} size="sm" onClick={() => { setSelectedTech(t); nav(S.ADDRESS); }}>Contratar</Btn>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderReviewsReceived = () => (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <NavHeader title="Reseñas recibidas" onBack={back} />
      <div style={{ padding: 16 }}>
        <Card style={{ marginBottom: 16, textAlign: "center", padding: 20 }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: C.primary }}>4.8</div>
          <Stars rating={5} size={18} />
          <div style={{ fontSize: 13, color: C.textMuted, marginTop: 4 }}>Basado en 3 reseñas de técnicos</div>
        </Card>
        {USER_REVIEWS.map((r, i) => (
          <Card key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{r.from}</span>
              <Stars rating={r.rating} size={12} />
            </div>
            <div style={{ fontSize: 13, color: C.textSecondary, marginBottom: 4 }}>{r.text}</div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{r.date}</div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
      <NavHeader title="Configuración" onBack={back} />
      <div style={{ padding: 16 }}>
        {[
          { icon: "🔔", label: "Notificaciones", toggle: true },
          { icon: "🌐", label: "Idioma", val: "Español" },
          { icon: "📄", label: "Términos y condiciones" },
          { icon: "🔒", label: "Política de privacidad" },
          { icon: "ℹ️", label: "Acerca de alTiro", val: "v1.0.0" },
        ].map((item, i) => (
          <Card key={i} style={{ marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{item.label}</span>
            </div>
            {item.toggle ? (
              <div style={{ width: 44, height: 24, borderRadius: 12, background: C.primary, padding: 2, cursor: "pointer" }}>
                <div style={{ width: 20, height: 20, borderRadius: 10, background: C.white, marginLeft: 20, transition: "margin 0.2s" }} />
              </div>
            ) : (
              <span style={{ fontSize: 13, color: C.textMuted }}>{item.val || "›"}</span>
            )}
          </Card>
        ))}
        <div style={{ padding: "24px 0" }}>
          <Btn variant="danger" size="sm" onClick={() => {}}>Eliminar mi cuenta</Btn>
        </div>
      </div>
    </div>
  );

  // ─── SUPPORT ───

  const renderHelpCenter = () => (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <NavHeader title="Centro de ayuda" onBack={back} />
      <div style={{ padding: 16 }}>
        <InputField placeholder="Buscar en ayuda..." icon="🔍" />
        <SectionTitle>Preguntas frecuentes</SectionTitle>
        {[
          "¿Cómo funciona el pago protegido?",
          "¿Qué pasa si el técnico no llega?",
          "¿Cómo cancelo un servicio?",
          "¿Cómo solicito un reembolso?",
          "¿Los técnicos están verificados?",
        ].map((q, i) => (
          <Card key={i} style={{ marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{q}</span>
            <span style={{ color: C.textMuted }}>›</span>
          </Card>
        ))}
        <div style={{ marginTop: 20 }}>
          <SectionTitle>¿Necesitas más ayuda?</SectionTitle>
          <Btn variant="outline" onClick={() => {}}>💬 Contactar soporte</Btn>
        </div>
      </div>
    </div>
  );

  const renderDispute = () => (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <NavHeader title="Reportar problema" onBack={back} />
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 15, color: C.textSecondary, marginBottom: 16 }}>Selecciona el tipo de problema</div>
        {[
          "El trabajo no se completó correctamente",
          "Hubo daños en mi propiedad",
          "El cobro fue diferente al acordado",
          "El técnico no se presentó",
          "Otro problema",
        ].map((p, i) => (
          <Card key={i} style={{ marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 20, height: 20, borderRadius: 10, border: `2px solid ${C.border}` }} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>{p}</span>
          </Card>
        ))}
        <div style={{ marginTop: 16 }}>
          <InputField label="Describe el problema" placeholder="Proporciona todos los detalles relevantes..." />
        </div>
        <Card style={{ marginBottom: 16, border: `1.5px dashed ${C.border}`, background: C.bg, cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
            <span>📷</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.primary }}>Agregar evidencia fotográfica</span>
          </div>
        </Card>
        <Btn onClick={back}>Enviar reporte</Btn>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <NavHeader title="Notificaciones" onBack={back} />
      <div style={{ padding: 16 }}>
        {[
          { icon: "✅", title: "Servicio completado", desc: "Tu servicio de plomería con Carlos fue completado exitosamente.", time: "Hace 2h", unread: true },
          { icon: "⭐", title: "Nueva reseña", desc: "Carlos Mendoza te dejó una reseña de 5 estrellas.", time: "Hace 3h", unread: true },
          { icon: "🎉", title: "¡Bienvenido a alTiro!", desc: "Tu cuenta ha sido verificada. Ya puedes solicitar servicios.", time: "Ayer", unread: false },
          { icon: "💰", title: "Promoción especial", desc: "20% de descuento en tu primer servicio con código ALTIRO20.", time: "Hace 3 días", unread: false },
        ].map((n, i) => (
          <Card key={i} style={{ marginBottom: 8, background: n.unread ? C.primaryLight : C.white, border: n.unread ? `1px solid ${C.primary}20` : `1px solid ${C.border}` }}>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: n.unread ? C.white : C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{n.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{n.title}</span>
                  <span style={{ fontSize: 11, color: C.textMuted }}>{n.time}</span>
                </div>
                <div style={{ fontSize: 12, color: C.textSecondary, marginTop: 2 }}>{n.desc}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>📡</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: C.textPrimary, marginBottom: 4 }}>Sin conexión</div>
      <div style={{ fontSize: 14, color: C.textSecondary, textAlign: "center", marginBottom: 24 }}>Verifica tu conexión a internet e intenta de nuevo</div>
      <Btn full={false} onClick={resetFlow}>Reintentar</Btn>
    </div>
  );

  // ─── SCREEN ROUTER ───
  const renderScreen = () => {
    switch (screen) {
      case S.SPLASH: return renderSplash();
      case S.OB1: return renderOnboarding(0);
      case S.OB2: return renderOnboarding(1);
      case S.OB3: return renderOnboarding(2);
      case S.LOGIN: return renderLogin();
      case S.OTP: return renderOTP();
      case S.COMPLETE_PROFILE: return renderCompleteProfile();
      case S.HOME: return renderHome();
      case S.SUBCATEGORY: return renderSubcategory();
      case S.ADDRESS: return renderAddress();
      case S.TECHNICIANS: return renderTechnicians();
      case S.TECH_DETAIL: return renderTechDetail();
      case S.SUMMARY: return renderSummary();
      case S.CONTEXTUAL_CHAT: return renderContextChat();
      case S.PAYMENT_METHOD: return renderPaymentMethod();
      case S.CONFIRM_REQUEST: return renderConfirmRequest();
      case S.TECH_EN_ROUTE: return renderTechEnRoute();
      case S.ARRIVAL: return renderArrival();
      case S.SERVICE_AGREEMENT: return renderServiceAgreement();
      case S.IN_PROGRESS: return renderInProgress();
      case S.COMPLETION: return renderCompletion();
      case S.RATING: return renderRating();
      case S.RECEIPT: return renderReceipt();
      case S.TIP: return renderTip();
      case S.MY_SERVICES: return renderMyServices();
      case S.SERVICE_DETAIL: return renderServiceDetail();
      case S.PROFILE_HUB: return renderProfileHub();
      case S.EDIT_PROFILE: return renderEditProfile();
      case S.SAVED_ADDRESSES: return renderSavedAddresses();
      case S.PAYMENT_METHODS: return renderPaymentMethods();
      case S.FAVORITE_TECHS: return renderFavoriteTechs();
      case S.REVIEWS_RECEIVED: return renderReviewsReceived();
      case S.SETTINGS: return renderSettings();
      case S.HELP_CENTER: return renderHelpCenter();
      case S.DISPUTE: return renderDispute();
      case S.NOTIFICATIONS: return renderNotifications();
      case S.ERROR_STATE: return renderErrorState();
      default: return renderHome();
    }
  };

  // ─── PHONE FRAME ───
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#F0F2F5", fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif", padding: 16 }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 0; height: 0; }
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; } }
        button:active { transform: scale(0.97); }
        input::placeholder, textarea::placeholder { color: ${C.textMuted}; }
      `}</style>

      {/* Screen map label */}
      <div style={{ marginBottom: 12, textAlign: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.primary, textTransform: "uppercase", letterSpacing: 2, marginBottom: 4 }}>alTiro · Prototipo App Usuario</div>
        <div style={{ fontSize: 11, color: "#9CA3AF" }}>
          Pantalla: <strong style={{ color: C.textPrimary }}>{screen}</strong> · {history.length > 0 && <button onClick={back} style={{ background: "none", border: "none", color: C.primary, cursor: "pointer", fontWeight: 600, fontSize: 11 }}>← Regresar</button>}
          {" "}<button onClick={resetFlow} style={{ background: "none", border: "none", color: C.accent, cursor: "pointer", fontWeight: 600, fontSize: 11 }}>⟲ Inicio</button>
          {" "}<button onClick={() => nav(S.ERROR_STATE)} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 11 }}>Error</button>
        </div>
      </div>

      {/* Phone */}
      <div style={{ width: 375, height: 812, borderRadius: 44, background: C.white, boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)", overflow: "hidden", display: "flex", flexDirection: "column", position: "relative" }}>
        {/* Notch */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 160, height: 30, background: "#000", borderRadius: "0 0 20px 20px", zIndex: 10 }} />
        
        <div style={{ height: 30 }} />
        <StatusBar />
        
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {renderScreen()}
        </div>

        {showNav && <BottomNav active={activeTab} onNavigate={nav} />}

        {/* Home indicator */}
        <div style={{ display: "flex", justifyContent: "center", paddingBottom: 8, paddingTop: 4, background: showNav ? C.white : "transparent" }}>
          <div style={{ width: 134, height: 5, borderRadius: 3, background: "#000", opacity: 0.2 }} />
        </div>
      </div>

      {/* Screen counter */}
      <div style={{ marginTop: 12, fontSize: 11, color: "#9CA3AF", textAlign: "center" }}>
        35 pantallas · Navegación completa · Equipo 5 · Tec de Monterrey
      </div>
    </div>
  );
}
