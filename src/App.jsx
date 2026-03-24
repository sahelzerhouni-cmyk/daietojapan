import { useState, useEffect } from "react";

const TDEE = 2050;
const MEAL_KCAL = 825;
const TAPIS_KCAL = 300;
const MUSCU_KCAL = 250;
const WORKOUT_KCAL = TAPIS_KCAL + MUSCU_KCAL; // 550 kcal séance complète
const STEPS_KCAL = 300;
const DEFICIT_PER_MEAL = TDEE - MEAL_KCAL;
const GOAL_KG = 7;
const GOAL_KCAL = GOAL_KG * 7700;

const START_DATE = new Date("2026-03-22");

function getCalendar() {
  const WORKOUTS_ROTATION = ["Pecs + Triceps","Dos + Biceps","Jambes + Fessiers","Épaules + Abdos","Full body léger"];
  const MEALS_ROTATION = [1,2,3,4,5,6,7];
  const REST_DAYS = [5, 11, 17]; // indices dans le cycle de 7

  const days = [];
  const totalDays = 60;
  let workoutIdx = 0, mealIdx = 0, cycleDay = 0;

  for (let i = 0; i < totalDays; i++) {
    const d = new Date(START_DATE);
    d.setDate(START_DATE.getDate() + i);
    const dayNames = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];
    const monthNames = ["Jan","Fév","Mar","Avr","Mai","Juin","Juil","Août","Sep","Oct","Nov","Déc"];
    const isRest = cycleDay % 7 === 5 || cycleDay % 7 === 0 && cycleDay > 0 && (cycleDay / 7) % 2 === 0 
      ? false
      : REST_DAYS.includes(cycleDay % 18);

    // Simple rest pattern: every 6th and 12th day in each 18-day block
    const blockPos = i % 18;
    const rest = blockPos === 5 || blockPos === 11 || blockPos === 17;

    days.push({
      date: `${d.getDate()} ${monthNames[d.getMonth()]}`,
      day: dayNames[d.getDay()],
      meal: rest ? null : MEALS_ROTATION[mealIdx % 7],
      workout: rest ? null : WORKOUTS_ROTATION[workoutIdx % 5],
      rest,
    });

    if (!rest) { workoutIdx++; mealIdx++; }
    cycleDay++;
  }
  return days;
}

const CALENDAR = getCalendar();

const MEALS = {
  1: { name: "Bowl poulet grillé", calories: 800, protein: 110, ingredients: [{ item: "Blanc de poulet", qty: "300g" },{ item: "Riz basmati", qty: "60g sec → 150g cuit" },{ item: "Brocolis", qty: "200g" },{ item: "Œufs", qty: "2" },{ item: "Sauce soja", qty: "1 c.à.s" },{ item: "Citron", qty: "1/2" }] },
  2: { name: "Steak haché & patate douce", calories: 850, protein: 105, ingredients: [{ item: "Steak haché 5%", qty: "250g" },{ item: "Patate douce", qty: "200g" },{ item: "Haricots verts", qty: "200g" },{ item: "Parmesan râpé", qty: "30g" },{ item: "Œufs", qty: "2" },{ item: "Huile d'olive", qty: "1 c.à.c" }] },
  3: { name: "Saumon & lentilles", calories: 900, protein: 100, ingredients: [{ item: "Pavé de saumon", qty: "250g" },{ item: "Lentilles", qty: "80g sec → 200g cuit" },{ item: "Épinards frais", qty: "150g" },{ item: "Ail", qty: "2 gousses" },{ item: "Yaourt grec nature", qty: "150g" },{ item: "Huile d'olive", qty: "1 c.à.c" }] },
  4: { name: "Poulet curry express", calories: 850, protein: 105, ingredients: [{ item: "Cuisses de poulet désossées", qty: "300g" },{ item: "Lait de coco light", qty: "200ml" },{ item: "Curry en poudre", qty: "1 c.à.s" },{ item: "Riz basmati", qty: "60g sec → 150g cuit" },{ item: "Courgettes", qty: "200g" },{ item: "Huile d'olive", qty: "1 c.à.c" }] },
  5: { name: "Omelette XXL dinde", calories: 750, protein: 100, ingredients: [{ item: "Œufs", qty: "6" },{ item: "Dinde émincée", qty: "150g" },{ item: "Poivrons", qty: "150g" },{ item: "Fromage râpé", qty: "50g" },{ item: "Salade verte", qty: "1 portion" },{ item: "Huile d'olive", qty: "1 c.à.c" }] },
  6: { name: "Thon & pâtes complètes", calories: 800, protein: 105, ingredients: [{ item: "Thon en boîte (égoutté)", qty: "240g (2 boîtes)" },{ item: "Pâtes complètes", qty: "70g sec → 150g cuit" },{ item: "Tomates cerises", qty: "150g" },{ item: "Olives noires", qty: "30g" },{ item: "Huile d'olive", qty: "1 c.à.s" }] },
  7: { name: "Bœuf sauté asiatique", calories: 800, protein: 110, ingredients: [{ item: "Bavette de bœuf", qty: "250g" },{ item: "Riz basmati", qty: "60g sec → 150g cuit" },{ item: "Poivrons", qty: "100g" },{ item: "Oignons", qty: "100g" },{ item: "Brocoli", qty: "100g" },{ item: "Œufs", qty: "2" },{ item: "Sauce soja", qty: "2 c.à.s" }] },
};

const WORKOUTS = {
  "Pecs + Triceps": { color: "#00e676", groups: [{ name: "PECTORAUX", exercises: [{ id: "chest_press", name: "Chest Press machine (prise neutre)", machine: "Chest Press assis", sets: "4 × 12", tip: "Prise neutre, omoplates serrées" },{ id: "pec_fly", name: "Pec Fly machine (écartés)", machine: "Pec Deck / Pec Fly", sets: "3 × 15", tip: "Serrer 2 sec en contraction" },{ id: "incline_press", name: "Incline Chest Press machine", machine: "Incline Chest Press ou câbles", sets: "3 × 12", tip: "Prise neutre, cible haut des pecs" }] },{ name: "TRICEPS", exercises: [{ id: "triceps_corde", name: "Extension triceps poulie (corde)", machine: "Poulie haute + corde", sets: "4 × 15", tip: "Prise neutre, coudes collés au corps" },{ id: "pushdown", name: "Pushdown poulie (pronation)", machine: "Poulie haute + barre V", sets: "3 × 15", tip: "Paumes vers le bas, pas de supination" }] }] },
  "Dos + Biceps": { color: "#e040fb", groups: [{ name: "DOS", exercises: [{ id: "lat_pulldown", name: "Lat Pulldown prise neutre", machine: "Lat Pulldown + poignée neutre", sets: "4 × 12", tip: "Remplace les tractions, zéro stress coude" },{ id: "seated_row", name: "Tirage poulie basse prise large", machine: "Poulie basse + barre large", sets: "4 × 12", tip: "Prise pronation large, écarte les coudes, cible le milieu du dos" },{ id: "poulie_basse_dos", name: "Tirage horizontal poulie basse", machine: "Poulie basse + poignée triangle", sets: "3 × 12", tip: "Dos droit, tirer vers le nombril" }] },{ name: "BICEPS", exercises: [{ id: "curl_marteau", name: "Curl poulie basse unilatéral", machine: "Poulie basse + poignée simple", sets: "3 × 15", tip: "Prise neutre, amplitude réduite si gêne, un bras à la fois" },{ id: "curl_machine", name: "Curl machine prise neutre", machine: "Curl machine", sets: "3 × 15", tip: "Si douleur : SKIP" }] }] },
  "Jambes + Fessiers": { color: "#ffea00", groups: [{ name: "QUADRICEPS / ISCHIOS", exercises: [{ id: "leg_press", name: "Presse à cuisses", machine: "Leg Press 45° ou horizontale", sets: "4 × 12", tip: "Pieds largeur épaules, descendre à 90°" },{ id: "leg_ext", name: "Leg Extension", machine: "Leg Extension machine", sets: "3 × 15", tip: "Serrer les quadriceps en haut" },{ id: "leg_curl", name: "Leg Curl", machine: "Leg Curl couché ou assis", sets: "3 × 15", tip: "Mouvement contrôlé, pas d'à-coup" }] },{ name: "FESSIERS / MOLLETS", exercises: [{ id: "hip_thrust", name: "Hip Thrust", machine: "Hip Thrust machine ou Smith", sets: "4 × 12", tip: "Serrer fessiers en haut, 2 sec pause" },{ id: "calf_raise", name: "Mollets debout", machine: "Calf Raise machine ou Smith", sets: "3 × 20", tip: "Amplitude complète" }] }] },
  "Épaules + Abdos": { color: "#ff5252", groups: [{ name: "ÉPAULES", exercises: [{ id: "shoulder_press", name: "Shoulder Press machine", machine: "Shoulder Press assis", sets: "4 × 12", tip: "Ne pas verrouiller les coudes en haut" },{ id: "lateral_raise", name: "Élévations latérales poulie", machine: "Poulie basse + poignée", sets: "3 × 15", tip: "Léger, coude légèrement fléchi" },{ id: "rear_delt", name: "Rear Delt machine (oiseau)", machine: "Reverse Pec Fly", sets: "3 × 15", tip: "S'asseoir face au dossier du Pec Fly" }] },{ name: "ABDOS", exercises: [{ id: "crunch_machine", name: "Crunch machine", machine: "Ab Crunch machine assis", sets: "4 × 20", tip: "Expirer en crunchant, mouvement court" },{ id: "releve_genoux", name: "Relevé de genoux", machine: "Chaise romaine ou au sol", sets: "3 × 15", tip: "Si douleur coude → faire au sol" }] }] },
  "Full body léger": { color: "#448aff", groups: [{ name: "FULL BODY (50-60% du max, tempo lent)", exercises: [{ id: "fb_chest", name: "Chest Press léger", machine: "Chest Press machine", sets: "3 × 15", tip: "Focus squeeze pecs" },{ id: "fb_lat", name: "Lat Pulldown léger", machine: "Lat Pulldown prise neutre", sets: "3 × 15", tip: "Mouvement lent et contrôlé" },{ id: "fb_leg", name: "Leg Press léger", machine: "Leg Press", sets: "3 × 15", tip: "Amplitude complète" },{ id: "fb_shoulder", name: "Shoulder Press léger", machine: "Shoulder Press machine", sets: "3 × 15", tip: "Récupération active" }] }] },
};

function RestTimer({ seconds, color }) {
  const [active, setActive] = useState(false);
  const [remaining, setRemaining] = useState(seconds);
  useEffect(() => {
    if (!active) return;
    if (remaining <= 0) { setActive(false); setRemaining(seconds); return; }
    const t = setTimeout(() => setRemaining(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [active, remaining, seconds]);
  const start = () => { setRemaining(seconds); setActive(true); };
  const stop = () => { setActive(false); setRemaining(seconds); };
  const pct = remaining / seconds;
  const r = 12, circ = 2 * Math.PI * r;
  return (
    <button onClick={active ? stop : start} title={active ? "Arrêter" : `Démarrer ${seconds}s`}
      style={{ background: active ? `${color}22` : "transparent", border: active ? `1px solid ${color}66` : "1px dashed #444", borderRadius: 6, padding: "3px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
      <svg width={28} height={28} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
        <circle cx={14} cy={14} r={r} fill="none" stroke="#222" strokeWidth={3} />
        <circle cx={14} cy={14} r={r} fill="none" stroke={active ? color : "#444"} strokeWidth={3}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.9s linear" }} />
      </svg>
      <span style={{ fontSize: 12, fontWeight: 700, color: active ? color : "#666" }}>{active ? `${remaining}s` : `${seconds}s`}</span>
    </button>
  );
}

function WeightInput({ exerciseId, dayIndex, allWeights, onSave }) {
  const key = `${dayIndex}_${exerciseId}`;
  const saved = allWeights[key];
  const [value, setValue] = useState(saved || "");
  const [editing, setEditing] = useState(false);
  useEffect(() => { setValue(allWeights[`${dayIndex}_${exerciseId}`] || ""); }, [dayIndex, exerciseId, allWeights]);
  const lastWeight = (() => {
    for (let i = dayIndex - 1; i >= 0; i--) {
      const prev = allWeights[`${i}_${exerciseId}`];
      if (prev) return { weight: prev, dayLabel: CALENDAR[i].date };
    }
    return null;
  })();
  const handleSave = () => { onSave(key, value); setEditing(false); };
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {editing ? (
          <>
            <input type="number" inputMode="decimal" value={value} onChange={e => setValue(e.target.value)} placeholder="kg"
              style={{ width: 70, padding: "6px 8px", background: "#0f3460", border: "1px solid #448aff", borderRadius: 6, color: "#fff", fontSize: 14, fontWeight: 700, textAlign: "center", outline: "none" }}
              autoFocus onKeyDown={e => { if (e.key === "Enter") handleSave(); }} />
            <span style={{ color: "#888", fontSize: 12 }}>kg</span>
            <button onClick={handleSave} style={{ background: "#00e676", border: "none", borderRadius: 6, padding: "6px 12px", color: "#0a0a1a", fontWeight: 700, fontSize: 12, cursor: "pointer" }}>✓</button>
            <button onClick={() => { setEditing(false); setValue(saved || ""); }} style={{ background: "none", border: "1px solid #666", borderRadius: 6, padding: "6px 10px", color: "#888", fontSize: 12, cursor: "pointer" }}>✕</button>
          </>
        ) : (
          <button onClick={() => setEditing(true)}
            style={{ background: saved ? "#00e67622" : "#ffffff08", border: saved ? "1px solid #00e67644" : "1px dashed #444", borderRadius: 6, padding: "5px 12px", color: saved ? "#00e676" : "#666", fontSize: 12, fontWeight: saved ? 700 : 400, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            {saved ? <>⚖️ {saved} kg</> : <>+ Poids</>}
          </button>
        )}
      </div>
      {lastWeight && !saved && <p style={{ margin: "4px 0 0", fontSize: 10, color: "#ffea00" }}>📊 Dernier : {lastWeight.weight} kg ({lastWeight.dayLabel})</p>}
      {lastWeight && saved && (
        <p style={{ margin: "4px 0 0", fontSize: 10, color: parseFloat(saved) > parseFloat(lastWeight.weight) ? "#00e676" : parseFloat(saved) < parseFloat(lastWeight.weight) ? "#ff5252" : "#888" }}>
          {parseFloat(saved) > parseFloat(lastWeight.weight) ? `📈 +${(parseFloat(saved) - parseFloat(lastWeight.weight)).toFixed(1)} kg` : parseFloat(saved) < parseFloat(lastWeight.weight) ? `📉 ${(parseFloat(saved) - parseFloat(lastWeight.weight)).toFixed(1)} kg` : `➡️ Même charge`} vs {lastWeight.dayLabel}
        </p>
      )}
    </div>
  );
}

function DeficitBar({ completed, steps, mealDone }) {
  // Calculate cumulative deficit
  let totalDeficit = 0;
  for (let i = 0; i < CALENDAR.length; i++) {
    const d = CALENDAR[i];
    if (d.rest) continue;
    const mealChecked = mealDone?.[i];
    const workoutChecked = completed?.[i];
    const stepsChecked = steps?.[i];
    if (mealChecked) totalDeficit += DEFICIT_PER_MEAL;
    if (workoutChecked) totalDeficit += WORKOUT_KCAL;
    if (stepsChecked) totalDeficit += STEPS_KCAL;
  }
  const pct = Math.min(totalDeficit / GOAL_KCAL, 1);
  const kgLost = (totalDeficit / 7700).toFixed(2);
  const milestones = [0.25, 0.5, 0.75, 1];

  const getColor = (p) => {
    if (p < 0.33) return "#448aff";
    if (p < 0.66) return "#00e676";
    if (p < 0.9) return "#ffea00";
    return "#ff5252";
  };
  const color = getColor(pct);

  const getRank = (p) => {
    if (p < 0.1) return { label: "RECRUE", icon: "🥉" };
    if (p < 0.25) return { label: "SOLDAT", icon: "⚔️" };
    if (p < 0.5) return { label: "GUERRIER", icon: "🛡️" };
    if (p < 0.75) return { label: "ÉLITE", icon: "🔥" };
    if (p < 1) return { label: "LÉGENDE", icon: "⚡" };
    return { label: "MISSION ACCOMPLIE", icon: "🏆" };
  };
  const rank = getRank(pct);

  return (
    <div style={{ background: "linear-gradient(135deg, #16213e, #1a1a2e)", border: `1px solid ${color}44`, borderRadius: 16, padding: "16px", margin: "8px 12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div>
          <span style={{ fontSize: 18 }}>{rank.icon}</span>
          <span style={{ color, fontWeight: 800, fontSize: 14, marginLeft: 6, letterSpacing: 1 }}>{rank.label}</span>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ color, fontWeight: 800, fontSize: 20 }}>−{kgLost} kg</span>
          <span style={{ color: "#666", fontSize: 11, display: "block" }}>/ −{GOAL_KG} kg objectif</span>
        </div>
      </div>

      {/* Bar */}
      <div style={{ position: "relative", background: "#0a0a1a", borderRadius: 12, height: 22, overflow: "hidden", border: "1px solid #ffffff11" }}>
        <div style={{ height: "100%", width: `${pct * 100}%`, background: `linear-gradient(90deg, #448aff, ${color})`, borderRadius: 12, transition: "width 0.6s ease", position: "relative", boxShadow: `0 0 12px ${color}66` }}>
          {pct > 0.08 && <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 11, fontWeight: 700, color: "#0a0a1a" }}>{Math.round(pct * 100)}%</span>}
        </div>
        {/* Milestones */}
        {milestones.map(m => (
          <div key={m} style={{ position: "absolute", left: `${m * 100}%`, top: 0, bottom: 0, width: 2, background: pct >= m ? "#ffffff44" : "#ffffff22", transform: "translateX(-1px)" }}>
            <span style={{ position: "absolute", bottom: -16, left: "50%", transform: "translateX(-50%)", fontSize: 9, color: pct >= m ? "#fff" : "#444", whiteSpace: "nowrap" }}>
              {m === 1 ? "🏆" : `−${(GOAL_KG * m).toFixed(1)}kg`}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", fontSize: 10, color: "#666" }}>
        <span>Déficit cumulé : {Math.round(totalDeficit).toLocaleString()} kcal</span>
        <span>Objectif : {GOAL_KCAL.toLocaleString()} kcal</span>
      </div>
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState(null);
                    const [tab, setTab] = useState("workout");
  const [allWeights, setAllWeights] = useState({});
  const [bodyWeight, setBodyWeight] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingBW, setEditingBW] = useState(false);
  const [bwValue, setBwValue] = useState("");
  const [completed, setCompleted] = useState({}); // workout done
  const [mealDone, setMealDone] = useState({});   // meal done
  const [water, setWater] = useState({});
  const [steps, setSteps] = useState({});
  const [visibleStart, setVisibleStart] = useState(0);
  const VISIBLE = 22;

  useEffect(() => {
    async function load() {
      try {
        const r = await window.storage.get("sechage-all-data");
        if (r) {
          const d = JSON.parse(r.value);
          setAllWeights(d.weights || {});
          setBodyWeight(d.bodyweight || {});
          setCompleted(d.completed || {});
          setMealDone(d.mealDone || {});
          setWater(d.water || {});
          setSteps(d.steps || {});
        }
      } catch (e) {}
      setLoading(false);
    }
    load();
  }, []);

  const persist = async (w, bw, comp, md, wat, st) => {
    try {
      await window.storage.set("sechage-all-data", JSON.stringify({ weights: w, bodyweight: bw, completed: comp, mealDone: md, water: wat, steps: st }));
    } catch (e) {}
  };

  const saveWeight = async (key, value) => {
    const u = { ...allWeights };
    if (value) u[key] = value; else delete u[key];
    setAllWeights(u);
    persist(u, bodyWeight, completed, mealDone, water, steps);
  };

  const saveBodyWeight = async (dayIndex, value) => {
    const u = { ...bodyWeight };
    if (value) u[dayIndex] = value; else delete u[dayIndex];
    setBodyWeight(u); setBwValue(""); setEditingBW(false);
    persist(allWeights, u, completed, mealDone, water, steps);
  };

  const toggleCompleted = async (dayIndex) => {
    const u = { ...completed, [dayIndex]: !completed[dayIndex] };
    setCompleted(u);
    persist(allWeights, bodyWeight, u, mealDone, water, steps);
  };

  const toggleMeal = async (dayIndex) => {
    const u = { ...mealDone, [dayIndex]: !mealDone[dayIndex] };
    setMealDone(u);
    persist(allWeights, bodyWeight, completed, u, water, steps);
  };

  const toggleSteps = async (dayIndex) => {
    const u = { ...steps, [dayIndex]: !steps[dayIndex] };
    setSteps(u);
    persist(allWeights, bodyWeight, completed, mealDone, water, u);
  };

  const saveWater = async (dayIndex, count) => {
    const u = { ...water, [dayIndex]: count };
    setWater(u);
    persist(allWeights, bodyWeight, completed, mealDone, u, steps);
  };

  const entry = selected !== null ? CALENDAR[selected] : null;
  const meal = entry && entry.meal ? MEALS[entry.meal] : null;
  const workout = entry && entry.workout ? WORKOUTS[entry.workout] : null;

  const bwEntries = Object.entries(bodyWeight).map(([k, v]) => ({ day: parseInt(k), weight: parseFloat(v) })).filter(e => !isNaN(e.weight)).sort((a, b) => a.day - b.day);
  const startWeight = bwEntries.length > 0 ? bwEntries[0].weight : null;
  const currentWeight = bwEntries.length > 0 ? bwEntries[bwEntries.length - 1].weight : null;
  const weightLoss = startWeight && currentWeight ? (startWeight - currentWeight).toFixed(1) : null;

  const completedCount = Object.keys(completed).filter(k => completed[k] || mealDone[k]).length;
  const visibleDays = CALENDAR.slice(visibleStart, visibleStart + VISIBLE);

  if (loading) return (
    <div style={{ background: "#0a0a1a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#00e676", fontSize: 16 }}>Chargement...</p>
    </div>
  );

  return (
    <div style={{ background: "#0a0a1a", minHeight: "100vh", color: "#e0e0e0", fontFamily: "'Segoe UI', system-ui, sans-serif", paddingBottom: 32 }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)", padding: "20px 16px 12px", borderBottom: "2px solid #00e676" }}>
        <h1 style={{ margin: 0, fontSize: 22, textAlign: "center", letterSpacing: 2 }}>
          <span style={{ color: "#00e676" }}>OPÉRATION</span> <span style={{ color: "#448aff" }}>JAPAN</span>
        </h1>
        <p style={{ margin: "4px 0 0", textAlign: "center", fontSize: 13, color: "#ff5252", fontWeight: 700 }}>OBJECTIF −7 KG</p>
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#888", marginBottom: 4 }}>
            <span>{completedCount} jours actifs</span>
            {weightLoss && <span style={{ color: parseFloat(weightLoss) > 0 ? "#00e676" : "#ff5252" }}>{parseFloat(weightLoss) > 0 ? `−${weightLoss}` : `+${Math.abs(parseFloat(weightLoss)).toFixed(1)}`} kg depuis J1</span>}
          </div>
        </div>
      </div>

      {/* Deficit Bar */}
      <DeficitBar completed={completed} steps={steps} mealDone={mealDone} />

      {/* Calendar nav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 12px 0" }}>
        <button onClick={() => setVisibleStart(Math.max(0, visibleStart - VISIBLE))} disabled={visibleStart === 0}
          style={{ background: visibleStart === 0 ? "transparent" : "#16213e", border: "1px solid #1a2744", borderRadius: 8, padding: "6px 14px", color: visibleStart === 0 ? "#333" : "#fff", cursor: visibleStart === 0 ? "default" : "pointer", fontSize: 13 }}>← Préc</button>
        <span style={{ fontSize: 11, color: "#666" }}>J{visibleStart + 1} – J{Math.min(visibleStart + VISIBLE, CALENDAR.length)}</span>
        <button onClick={() => setVisibleStart(Math.min(CALENDAR.length - VISIBLE, visibleStart + VISIBLE))} disabled={visibleStart + VISIBLE >= CALENDAR.length}
          style={{ background: visibleStart + VISIBLE >= CALENDAR.length ? "transparent" : "#16213e", border: "1px solid #1a2744", borderRadius: 8, padding: "6px 14px", color: visibleStart + VISIBLE >= CALENDAR.length ? "#333" : "#fff", cursor: visibleStart + VISIBLE >= CALENDAR.length ? "default" : "pointer", fontSize: 13 }}>Suiv →</button>
      </div>

      {/* Calendar grid */}
      <div style={{ padding: "8px 8px 4px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
          {visibleDays.map((d, vi) => {
            const i = visibleStart + vi;
            const isSelected = selected === i;
            const wColor = d.workout ? WORKOUTS[d.workout]?.color : "#ff5252";
            const isDone = completed[i] || mealDone[i];
            return (
              <button key={i} onClick={() => { setSelected(i); setTab("meal"); }}
                style={{ background: isSelected ? "linear-gradient(135deg, #0f3460, #1a1a4e)" : d.rest ? "linear-gradient(135deg, #3e1a1a, #2a1010)" : isDone ? "linear-gradient(135deg, #0a2a0a, #162216)" : "#16213e", border: isSelected ? `2px solid ${wColor}` : isDone ? "1px solid #00e67644" : "1px solid #1a2744", borderRadius: 8, padding: "8px 4px", cursor: "pointer", textAlign: "center", transition: "all 0.15s", transform: isSelected ? "scale(1.05)" : "scale(1)", boxShadow: isSelected ? `0 0 12px ${wColor}44` : "none", position: "relative" }}>
                {isDone && <div style={{ position: "absolute", top: 3, right: 5, fontSize: 10, color: "#00e676" }}>✓</div>}
                <div style={{ fontSize: 9, color: "#888", fontWeight: 600, textTransform: "uppercase" }}>{d.day}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: d.rest ? "#ff5252" : "#fff", margin: "2px 0" }}>{d.date.split(" ")[0]}</div>
                <div style={{ fontSize: 8, color: "#666" }}>{d.date.split(" ")[1]}</div>
                {d.rest ? <div style={{ fontSize: 9, color: "#ff5252", fontWeight: 700, marginTop: 4 }}>REST</div>
                  : <div style={{ fontSize: 8, color: wColor, fontWeight: 600, marginTop: 4, lineHeight: 1.2 }}>{d.workout}</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day detail */}
      {entry && (
        <div style={{ padding: "8px 12px 24px" }}>
          <div style={{ background: "linear-gradient(135deg, #16213e, #1a1a2e)", borderRadius: 16, border: `1px solid ${entry.rest ? "#ff5252" : (WORKOUTS[entry.workout]?.color || "#448aff")}44`, overflow: "hidden" }}>
            {/* Day header */}
            <div style={{ padding: "14px 16px", background: entry.rest ? "#3e1a1a" : "#0f346022", borderBottom: "1px solid #ffffff11" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: 20, color: "#fff" }}>{entry.date} <span style={{ fontSize: 13, color: "#666", fontWeight: 400 }}>J{selected + 1}</span></h2>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: entry.rest ? "#ff5252" : (WORKOUTS[entry.workout]?.color || "#888"), fontWeight: 600 }}>
                    {entry.rest ? "REPOS COMPLET" : entry.workout}
                  </p>
                </div>
                {/* Quick checks */}
                {!entry.rest && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ textAlign: "center" }}>
                      <button onClick={() => toggleMeal(selected)}
                        style={{ background: mealDone[selected] ? "#00e676" : "transparent", border: mealDone[selected] ? "none" : "2px solid #444", borderRadius: 8, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: mealDone[selected] ? "#0a0a1a" : "#444", fontWeight: 700 }}>🍽️</button>
                      <div style={{ fontSize: 8, color: mealDone[selected] ? "#00e676" : "#444", marginTop: 2 }}>Repas</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <button onClick={() => toggleCompleted(selected)}
                        style={{ background: completed[selected] ? "#448aff" : "transparent", border: completed[selected] ? "none" : "2px solid #444", borderRadius: 8, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: completed[selected] ? "#0a0a1a" : "#444", fontWeight: 700 }}>💪</button>
                      <div style={{ fontSize: 8, color: completed[selected] ? "#448aff" : "#444", marginTop: 2 }}>Séance</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <button onClick={() => toggleSteps(selected)}
                        style={{ background: steps[selected] ? "#ffea00" : "transparent", border: steps[selected] ? "none" : "2px solid #444", borderRadius: 8, width: 36, height: 36, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: steps[selected] ? "#0a0a1a" : "#444", fontWeight: 700 }}>🚶</button>
                      <div style={{ fontSize: 8, color: steps[selected] ? "#ffea00" : "#444", marginTop: 2 }}>10k pas</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Déficit du jour */}
              {!entry.rest && (
                <div style={{ marginTop: 10, background: "#0a0a1a44", borderRadius: 8, padding: "8px 12px" }}>
                  {(() => {
                    let d = 0;
                    if (mealDone[selected]) d += DEFICIT_PER_MEAL;
                    if (completed[selected]) d += WORKOUT_KCAL;
                    if (steps[selected]) d += STEPS_KCAL;
                    const max = DEFICIT_PER_MEAL + WORKOUT_KCAL + STEPS_KCAL;
                    return (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: 11, color: "#888" }}>Déficit aujourd'hui</span>
                        <span style={{ fontWeight: 700, fontSize: 14, color: d === max ? "#00e676" : d > 0 ? "#ffea00" : "#666" }}>
                          {d > 0 ? `−${d.toLocaleString()} kcal` : "—"}
                          {d === max && " 🔥"}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Water */}
              <div style={{ marginTop: 10 }}>
                {(() => {
                  const GOAL = 5;
                  const count = water[selected] || 0;
                  const ml = count * 600;
                  return (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 11, color: "#888" }}>💧 {ml} ml / 3 000 ml</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: count >= GOAL ? "#00e676" : "#448aff" }}>{count}/{GOAL} gourdes</span>
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        {Array.from({ length: GOAL }).map((_, i) => (
                          <button key={i} onClick={() => saveWater(selected, i < count ? i : i + 1)}
                            style={{ background: i < count ? "#448aff" : "#0a0a1a", border: `1px solid ${i < count ? "#448aff" : "#333"}`, borderRadius: 6, width: 32, height: 36, cursor: "pointer", fontSize: 16, transition: "all 0.15s" }}>
                            {i < count ? "💧" : "🫙"}
                          </button>
                        ))}
                        {count > 0 && <button onClick={() => saveWater(selected, 0)} style={{ background: "none", border: "none", color: "#555", fontSize: 11, cursor: "pointer" }}>reset</button>}
                      </div>
                      {count >= GOAL && <p style={{ margin: "6px 0 0", fontSize: 10, color: "#00e676", fontWeight: 700 }}>✅ Hydratation atteinte !</p>}
                    </div>
                  );
                })()}
              </div>

              {/* Body weight */}
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, color: "#888" }}>⚖️ Poids :</span>
                {editingBW ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <input type="number" inputMode="decimal" step="0.1" value={bwValue} onChange={e => setBwValue(e.target.value)} placeholder="kg" autoFocus
                      onKeyDown={e => { if (e.key === "Enter") saveBodyWeight(selected, bwValue); }}
                      style={{ width: 60, padding: "4px 6px", background: "#0f3460", border: "1px solid #448aff", borderRadius: 4, color: "#fff", fontSize: 13, fontWeight: 700, textAlign: "center", outline: "none" }} />
                    <button onClick={() => saveBodyWeight(selected, bwValue)} style={{ background: "#00e676", border: "none", borderRadius: 4, padding: "4px 8px", color: "#0a0a1a", fontWeight: 700, fontSize: 11, cursor: "pointer" }}>✓</button>
                    <button onClick={() => { setEditingBW(false); setBwValue(""); }} style={{ background: "none", border: "1px solid #666", borderRadius: 4, padding: "4px 6px", color: "#888", fontSize: 11, cursor: "pointer" }}>✕</button>
                  </div>
                ) : (
                  <button onClick={() => { setEditingBW(true); setBwValue(bodyWeight[selected] || ""); }}
                    style={{ background: bodyWeight[selected] ? "#448aff22" : "transparent", border: bodyWeight[selected] ? "1px solid #448aff44" : "1px dashed #444", borderRadius: 4, padding: "3px 10px", color: bodyWeight[selected] ? "#448aff" : "#666", fontSize: 12, fontWeight: bodyWeight[selected] ? 700 : 400, cursor: "pointer" }}>
                    {bodyWeight[selected] ? `${bodyWeight[selected]} kg` : "+ Peser"}
                  </button>
                )}
                {bodyWeight[selected] && startWeight && selected > 0 && (
                  <span style={{ fontSize: 10, color: parseFloat(bodyWeight[selected]) < startWeight ? "#00e676" : "#ff5252", fontWeight: 600 }}>
                    {parseFloat(bodyWeight[selected]) < startWeight ? `−${(startWeight - parseFloat(bodyWeight[selected])).toFixed(1)}` : `+${(parseFloat(bodyWeight[selected]) - startWeight).toFixed(1)}`} kg depuis J1
                  </span>
                )}
              </div>
            </div>

                          {entry.rest ? (
              <div style={{ padding: 24 }}>
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 48, marginBottom: 8 }}>🛌</div>
                  <p style={{ color: "#ff5252", fontWeight: 700, fontSize: 18, margin: 0 }}>Journée de repos</p>
                  <p style={{ color: "#888", fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>Pas de salle · Glacer les coudes 10 min · OMAD maintenu</p>
                </div>
                {/* Steps on rest day */}
                <div style={{ background: "#0a0a1a", borderRadius: 10, padding: 14, marginBottom: 12, border: "1px solid #ffea0033" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ margin: 0, color: "#ffea00", fontWeight: 700, fontSize: 14 }}>🚶 10 000 pas</p>
                      <p style={{ margin: "4px 0 0", color: "#888", fontSize: 12 }}>Même les jours de repos · +300 kcal</p>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <button onClick={() => toggleSteps(selected)}
                        style={{ background: steps[selected] ? "#ffea00" : "transparent", border: steps[selected] ? "none" : "2px solid #444", borderRadius: 8, width: 44, height: 44, cursor: "pointer", fontSize: 20, color: steps[selected] ? "#0a0a1a" : "#444", fontWeight: 700 }}>🚶</button>
                      <div style={{ fontSize: 9, color: steps[selected] ? "#ffea00" : "#444", marginTop: 2 }}>{steps[selected] ? "✓ fait" : "à faire"}</div>
                    </div>
                  </div>
                </div>
                {/* Water on rest day */}
                <div style={{ background: "#0a0a1a", borderRadius: 10, padding: 14, border: "1px solid #448aff33" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "#888" }}>💧 Hydratation</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: (water[selected] || 0) >= 5 ? "#00e676" : "#448aff" }}>{(water[selected] || 0) * 600} / 3000 ml</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                    {Array.from({ length: 5 }).map((_, i) => {
                      const count = water[selected] || 0;
                      return (
                        <button key={i} onClick={() => saveWater(selected, i < count ? i : i + 1)}
                          style={{ background: i < count ? "#448aff" : "#0a0a1a", border: `1px solid ${i < count ? "#448aff" : "#333"}`, borderRadius: 6, width: 32, height: 36, cursor: "pointer", fontSize: 16 }}>
                          {i < count ? "💧" : "🫙"}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", borderBottom: "1px solid #ffffff11" }}>
                  {["workout", "meal"].map(t => (
                    <button key={t} onClick={() => setTab(t)}
                      style={{ flex: 1, padding: "12px", background: "none", border: "none", borderBottom: tab === t ? `2px solid ${t === "meal" ? "#00e676" : "#448aff"}` : "2px solid transparent", color: tab === t ? "#fff" : "#666", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                      {t === "meal" ? "🍽️ Repas" : "💪 Muscu"}
                    </button>
                  ))}
                </div>

                <div style={{ padding: 16 }}>
                  {tab === "meal" && meal && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                        <h3 style={{ margin: 0, color: "#00e676", fontSize: 16 }}>{meal.name}</h3>
                        <div style={{ display: "flex", gap: 6 }}>
                          <span style={{ background: "#00e67622", color: "#00e676", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{meal.calories} kcal</span>
                          <span style={{ background: "#448aff22", color: "#448aff", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700 }}>{meal.protein}g prot</span>
                        </div>
                      </div>
                      <p style={{ fontSize: 12, color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Liste de courses</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {meal.ingredients.map((ing, j) => (
                          <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#0a0a1a", padding: "10px 14px", borderRadius: 8, borderLeft: "3px solid #00e676" }}>
                            <span style={{ color: "#e0e0e0", fontSize: 14 }}>{ing.item}</span>
                            <span style={{ color: "#00e676", fontWeight: 700, fontSize: 13, whiteSpace: "nowrap", marginLeft: 12 }}>{ing.qty}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: 16, background: "#ffea0011", border: "1px solid #ffea0033", borderRadius: 8, padding: "10px 14px" }}>
                        <p style={{ margin: 0, fontSize: 11, color: "#ffea00" }}>⏰ Manger après la séance pour maximiser la récupération</p>
                      </div>
                    </div>
                  )}

                  {tab === "workout" && workout && (
                    <div>
                      <div style={{ background: "#0a0a1a", borderRadius: 10, padding: 14, marginBottom: 16, border: "1px solid #ff525244" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 24 }}>🏃</span>
                          <div>
                            <p style={{ margin: 0, color: "#ff5252", fontWeight: 700, fontSize: 14 }}>TAPIS INCLINÉ — 30 min</p>
                            <p style={{ margin: "4px 0 0", color: "#888", fontSize: 12 }}>Inclinaison 12% · Vitesse 5 km/h</p>
                          </div>
                        </div>
                      </div>
                      {workout.groups.map((group, gi) => (
                        <div key={gi} style={{ marginBottom: 16 }}>
                          <div style={{ background: `${workout.color}22`, padding: "8px 12px", borderRadius: "8px 8px 0 0", borderLeft: `3px solid ${workout.color}` }}>
                            <p style={{ margin: 0, color: workout.color, fontWeight: 700, fontSize: 13 }}>{group.name}</p>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            {group.exercises.map((ex, ei) => (
                              <div key={ei} style={{ background: "#0a0a1a", padding: "12px 14px", borderLeft: `3px solid ${workout.color}33`, borderRadius: ei === group.exercises.length - 1 ? "0 0 8px 8px" : 0 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                  <div style={{ flex: 1 }}>
                                    <p style={{ margin: 0, color: "#fff", fontWeight: 600, fontSize: 13 }}>{ex.name}</p>
                                    <p style={{ margin: "4px 0 0", color: "#448aff", fontSize: 11 }}>🏋️ {ex.machine}</p>
                                    <p style={{ margin: "3px 0 0", color: "#888", fontSize: 10, fontStyle: "italic" }}>{ex.tip}</p>
                                  </div>
                                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, marginLeft: 10 }}>
                                    <div style={{ background: `${workout.color}22`, color: workout.color, padding: "4px 10px", borderRadius: 6, fontWeight: 700, fontSize: 13, whiteSpace: "nowrap" }}>{ex.sets}</div>
                                    <RestTimer seconds={90} color={workout.color} />
                                  </div>
                                </div>
                                <WeightInput exerciseId={ex.id} dayIndex={selected} allWeights={allWeights} onSave={saveWeight} />
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      <div style={{ background: "#ff525211", border: "1px solid #ff525233", borderRadius: 8, padding: "10px 14px" }}>
                        <p style={{ margin: 0, fontSize: 11, color: "#ff5252", fontWeight: 600 }}>⚠️ TENDINITE COUDE — Prise neutre partout · Pas de tractions · Pas de DC barre · Glacer après</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {!entry && (
        <div style={{ padding: 32, textAlign: "center" }}>
          <p style={{ color: "#666", fontSize: 14 }}>👆 Clique sur un jour pour voir le détail</p>
        </div>
      )}
    </div>
  );
}