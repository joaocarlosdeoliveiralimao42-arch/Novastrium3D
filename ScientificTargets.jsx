import { useState } from "react";
import {
  Target,
  Snowflake,
  Layers3,
  Waves,
  MapPin,
  ArrowUpRight,
  CheckCircle2
} from "lucide-react";

export const SCIENTIFIC_TARGETS = [
  {
    id: "arcadia-ice",
    regionId: "arcadia",
    name: "Arcadia Planitia",
    focus: "Investigação de gelo subsuperficial",
    category: "Voláteis e recursos",
    latitude: 46.0,
    longitude: 190.0,
    question:
      "Onde existem indícios de gelo raso e quais dados orbitais precisam ser cruzados para confirmar sua extensão?",
    rationale:
      "A região é estudada por seu interesse em gelo de água em latitudes médias. O alvo representa uma região de referência, não um depósito pontual confirmado.",
    evidence: "Interesse científico regional",
    color: "#63d8ff",
    icon: Snowflake,
    source: "NASA Mars Exploration Program"
  },
  {
    id: "deuteronilus-glaciers",
    regionId: "deuteronilus",
    name: "Deuteronilus Mensae",
    focus: "Formas de relevo relacionadas a gelo",
    category: "Geomorfologia glacial",
    latitude: 40.0,
    longitude: 25.0,
    question:
      "Que padrões de relevo ajudam a investigar a possível história de fluxo de gelo e a evolução da paisagem?",
    rationale:
      "A região apresenta mesas, escarpas e formas de terreno associadas a processos glaciais. A interpretação deve ser verificada com imagens e dados topográficos.",
    evidence: "Alvo de investigação geomorfológica",
    color: "#b69cff",
    icon: Layers3,
    source: "NASA Mars Reconnaissance Orbiter"
  },
  {
    id: "jezero-delta",
    regionId: "jezero",
    name: "Cratera Jezero",
    focus: "Delta antigo e rochas sedimentares",
    category: "Astrobiologia e geologia",
    latitude: 18.4,
    longitude: 77.7,
    question:
      "Quais camadas sedimentares preservam melhor a história da água e quais amostras ajudam a testar hipóteses sobre habitabilidade passada?",
    rationale:
      "O delta de Jezero é um dos principais alvos de investigação do rover Perseverance. A escolha de um ponto exato exige análise de imagens e contexto local.",
    evidence: "Região explorada pelo Perseverance",
    color: "#ffb45f",
    icon: Waves,
    source: "NASA Mars 2020 / Perseverance"
  }
];

export default function ScientificTargets({ onSelectTarget }) {
  const [selectedTarget, setSelectedTarget] = useState(null);

  return (
    <section
      style={{
        marginTop: 22,
        padding: 20,
        borderRadius: 18,
        border: "1px solid #26374d",
        background: "linear-gradient(145deg, #101b2a, #0b1420)",
        color: "#e7eef9"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            color: "#6bd5ff",
            background: "rgba(99,216,255,.11)"
          }}
        >
          <Target size={22} />
        </div>

        <div>
          <div
            style={{
              color: "#6cbfe9",
              fontSize: 10,
              letterSpacing: 2,
              fontWeight: 700
            }}
          >
            SCIENCE TARGET SELECTION
          </div>
          <h2 style={{ margin: "4px 0 0", fontSize: 20 }}>
            Alvos científicos
          </h2>
        </div>
      </div>

      <p
        style={{
          color: "#9aabc0",
          fontSize: 13,
          lineHeight: 1.6,
          margin: "10px 0 17px"
        }}
      >
        Selecione uma região para consultar seu foco científico e destacar
        sua localização regional no globo.
      </p>

      <div style={{ display: "grid", gap: 11 }}>
        {SCIENTIFIC_TARGETS.map((target) => {
          const Icon = target.icon;
          const active = selectedTarget?.id === target.id;

          return (
            <button
              key={target.id}
              type="button"
              onClick={() => {
                setSelectedTarget(target);
                onSelectTarget?.(target);
              }}
              aria-pressed={active}
              style={{
                width: "100%",
                textAlign: "left",
                padding: 15,
                borderRadius: 13,
                border: active
                  ? `1px solid ${target.color}`
                  : "1px solid #263a52",
                background: active
                  ? "rgba(77, 156, 197, .12)"
                  : "#111b2b",
                color: "#e7eef9",
                cursor: "pointer",
                display: "grid",
                gap: 10
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11
                }}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    display: "grid",
                    placeItems: "center",
                    color: target.color,
                    background: `${target.color}18`,
                    flexShrink: 0
                  }}
                >
                  <Icon size={19} />
                </span>

                <span style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ display: "block", fontSize: 14 }}>
                    {target.name}
                  </strong>
                  <span
                    style={{
                      display: "block",
                      color: "#9aabc0",
                      fontSize: 11,
                      marginTop: 3
                    }}
                  >
                    {target.focus}
                  </span>
                </span>

                {active ? (
                  <CheckCircle2 size={18} color={target.color} />
                ) : (
                  <ArrowUpRight size={17} color="#8095ac" />
                )}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                <span
                  style={{
                    color: target.color,
                    fontSize: 10,
                    padding: "5px 8px",
                    borderRadius: 20,
                    background: `${target.color}13`,
                    border: `1px solid ${target.color}35`
                  }}
                >
                  {target.category}
                </span>

                <span
                  style={{
                    color: "#93a6bc",
                    fontSize: 10,
                    padding: "5px 8px",
                    borderRadius: 20,
                    background: "#172438"
                  }}
                >
                  {target.evidence}
                </span>
              </div>

              {active && (
                <div
                  style={{
                    borderTop: "1px solid #2a3c52",
                    paddingTop: 11,
                    display: "grid",
                    gap: 9
                  }}
                >
                  <div>
                    <strong style={{ color: "#c9d8e8", fontSize: 11 }}>
                      QUESTÃO CIENTÍFICA
                    </strong>
                    <p
                      style={{
                        color: "#aabbd0",
                        fontSize: 12,
                        lineHeight: 1.55,
                        margin: "5px 0 0"
                      }}
                    >
                      {target.question}
                    </p>
                  </div>

                  <div>
                    <strong style={{ color: "#c9d8e8", fontSize: 11 }}>
                      JUSTIFICATIVA
                    </strong>
                    <p
                      style={{
                        color: "#aabbd0",
                        fontSize: 12,
                        lineHeight: 1.55,
                        margin: "5px 0 0"
                      }}
                    >
                      {target.rationale}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "#7f96ad",
                      fontSize: 10
                    }}
                  >
                    <MapPin size={13} />
                    Referência regional: {target.latitude.toFixed(1)}°,
                    {" "}{target.longitude.toFixed(1)}°
                  </div>

                  <div style={{ color: "#7189a3", fontSize: 10 }}>
                    Fonte temática: {target.source}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 14,
          padding: 12,
          borderRadius: 10,
          background: "rgba(255, 180, 95, .07)",
          border: "1px solid rgba(255, 180, 95, .2)",
          color: "#b9a88f",
          fontSize: 11,
          lineHeight: 1.55
        }}
      >
        <strong style={{ color: "#ffc16c" }}>
          Nota de precisão:
        </strong>{" "}
        as coordenadas são referências regionais aproximadas, não pontos
        de pouso, amostragem ou operação validados. A escolha final exige
        análise de produtos orbitais de maior resolução.
      </div>
    </section>
  );
}