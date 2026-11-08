import { useEffect, useMemo, useState } from "react";
import {
  Route,
  MapPin,
  Navigation,
  Clock3,
  Gauge,
  AlertTriangle,
  Compass,
  ArrowRight,
  Mountain
} from "lucide-react";
import { MARS_REGIONS } from "./marsData";

const MARS_RADIUS = 3389.5;

function calculateDistance(start, end) {
  const toRad = (value) => (value * Math.PI) / 180;

  const lat1 = toRad(start.latitude);
  const lat2 = toRad(end.latitude);
  const deltaLat = toRad(end.latitude - start.latitude);
  const deltaLon = toRad(end.longitude - start.longitude);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return MARS_RADIUS * c;
}

function formatDuration(hours) {
  const days = Math.floor(hours / 24);
  const remainingHours = Math.floor(hours % 24);

  if (days > 0) {
    return `${days} dias e ${remainingHours} horas`;
  }

  return `${remainingHours} horas`;
}

export default function MarswalkPlanner({ onRouteChange }) {
  const [startId, setStartId] = useState("arcadia");
  const [endId, setEndId] = useState("jezero");
  const [speed, setSpeed] = useState(4);

  const start = MARS_REGIONS.find((item) => item.id === startId);
  const end = MARS_REGIONS.find((item) => item.id === endId);

  const distance = useMemo(() => {
    if (!start || !end || start.id === end.id) return 0;
    return calculateDistance(start, end);
  }, [start, end]);

  const duration = distance / speed;

  useEffect(() => {
    if (!start || !end || start.id === end.id) {
      onRouteChange?.(null);
      return;
    }

    onRouteChange?.({
      start: {
        id: start.id,
        latitude: start.latitude,
        longitude: start.longitude,
        name: start.name
      },
      end: {
        id: end.id,
        latitude: end.latitude,
        longitude: end.longitude,
        name: end.name
      }
    });
  }, [start, end, onRouteChange]);

  const selectStyle = {
    width: "100%",
    background: "#111b2b",
    color: "#e5edf8",
    border: "1px solid #293d56",
    borderRadius: 10,
    padding: "13px 12px",
    fontSize: 14,
    outline: "none",
    cursor: "pointer"
  };

  const cardStyle = {
    background: "linear-gradient(145deg, #121e30, #0d1726)",
    border: "1px solid #263a52",
    borderRadius: 14,
    padding: 17
  };

  return (
    <section
      style={{
        marginTop: 28,
        padding: 22,
        borderRadius: 18,
        background: "#0d1522",
        border: "1px solid #26374d",
        color: "#e7eef9",
        display: "flex",
        flexDirection: "column",
        gap: 20
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <div
            style={{
              width: 43,
              height: 43,
              borderRadius: 12,
              background: "rgba(83, 195, 240, 0.12)",
              color: "#61c9f4",
              display: "grid",
              placeItems: "center"
            }}
          >
            <Route size={23} />
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
              MISSION PLANNING
            </div>
            <h2 style={{ margin: "5px 0 0", fontSize: 21 }}>
              Planejador Marswalk
            </h2>
          </div>
        </div>

        <span
          style={{
            fontSize: 10,
            letterSpacing: 1,
            color: "#75d7b0",
            background: "rgba(66, 190, 143, 0.10)",
            border: "1px solid rgba(66, 190, 143, 0.25)",
            padding: "7px 10px",
            borderRadius: 20
          }}
        >
          <span style={{ marginRight: 6 }}>●</span>
          SIMULAÇÃO ATIVA
        </span>
      </div>

      <p style={{ color: "#9aabc0", margin: 0, fontSize: 13, lineHeight: 1.6 }}>
        Configure um deslocamento preliminar entre regiões de Marte e
        visualize a trajetória aproximada no globo.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 14
        }}
      >
        <label style={{ display: "grid", gap: 9 }}>
          <span
            style={{
              color: "#a9bdd4",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1
            }}
          >
            <MapPin size={14} style={{ verticalAlign: "middle", marginRight: 7 }} />
            PONTO DE PARTIDA
          </span>

          <select
            value={startId}
            onChange={(event) => setStartId(event.target.value)}
            style={selectStyle}
          >
            {MARS_REGIONS.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "grid", gap: 9 }}>
          <span
            style={{
              color: "#a9bdd4",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 1
            }}
          >
            <Navigation size={14} style={{ verticalAlign: "middle", marginRight: 7 }} />
            DESTINO
          </span>

          <select
            value={endId}
            onChange={(event) => setEndId(event.target.value)}
            style={selectStyle}
          >
            {MARS_REGIONS.map((region) => (
              <option key={region.id} value={region.id}>
                {region.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
            gap: 10
          }}
        >
          <span style={{ color: "#a9bdd4", fontSize: 12 }}>
            <Gauge size={16} style={{ verticalAlign: "middle", marginRight: 7 }} />
            Velocidade média estimada
          </span>

          <strong style={{ color: "#65d4ff", fontSize: 17 }}>
            {speed} km/h
          </strong>
        </div>

        <input
          type="range"
          min="1"
          max="6"
          step="1"
          value={speed}
          onChange={(event) => setSpeed(Number(event.target.value))}
          style={{
            width: "100%",
            accentColor: "#54c8f4",
            cursor: "pointer"
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#71859d",
            fontSize: 10,
            marginTop: 7
          }}
        >
          <span>1 km/h</span>
          <span>6 km/h</span>
        </div>
      </div>

      {start?.id === end?.id ? (
        <div
          style={{
            padding: 15,
            borderRadius: 12,
            background: "rgba(255, 181, 74, 0.08)",
            border: "1px solid rgba(255, 181, 74, 0.25)",
            color: "#ffc16c",
            fontSize: 13
          }}
        >
          Escolha regiões diferentes para calcular uma rota.
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: 12
            }}
          >
            <div style={cardStyle}>
              <div style={{ color: "#8da5bd", fontSize: 11, marginBottom: 12 }}>
                <Route size={15} style={{ verticalAlign: "middle", marginRight: 6 }} />
                DISTÂNCIA EM LINHA RETA
              </div>
              <strong style={{ fontSize: 25, color: "#68d5ff" }}>
                {distance.toLocaleString("pt-BR", {
                  maximumFractionDigits: 1
                })}
              </strong>
              <span style={{ color: "#8da5bd", fontSize: 12, marginLeft: 6 }}>
                km
              </span>
            </div>

            <div style={cardStyle}>
              <div style={{ color: "#8da5bd", fontSize: 11, marginBottom: 12 }}>
                <Clock3 size={15} style={{ verticalAlign: "middle", marginRight: 6 }} />
                TEMPO MATEMÁTICO
              </div>
              <strong style={{ fontSize: 22, color: "#b69cff" }}>
                {formatDuration(duration)}
              </strong>
              <div style={{ color: "#8da5bd", fontSize: 11, marginTop: 5 }}>
                {duration.toFixed(1)} horas de deslocamento
              </div>
            </div>
          </div>

          <div
            style={{
              ...cardStyle,
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap"
            }}
          >
            <div style={{ color: "#65d4ff" }}>
              <Compass size={21} />
            </div>

            <div style={{ flex: 1, minWidth: 130 }}>
              <div style={{ fontSize: 10, color: "#8199b2", marginBottom: 5 }}>
                TRAJETO SELECIONADO
              </div>
              <strong style={{ fontSize: 13 }}>{start.name}</strong>
            </div>

            <ArrowRight size={19} color="#61c9f4" />

            <div style={{ flex: 1, minWidth: 130 }}>
              <div style={{ fontSize: 10, color: "#8199b2", marginBottom: 5 }}>
                DESTINO
              </div>
              <strong style={{ fontSize: 13 }}>{end.name}</strong>
            </div>
          </div>
        </>
      )}

      <div
        style={{
          padding: 15,
          borderRadius: 12,
          background: "rgba(255, 177, 74, 0.07)",
          border: "1px solid rgba(255, 177, 74, 0.22)",
          display: "flex",
          alignItems: "flex-start",
          gap: 11
        }}
      >
        <AlertTriangle
          size={19}
          color="#ffb45f"
          style={{ flexShrink: 0, marginTop: 2 }}
        />

        <div>
          <strong style={{ color: "#ffc16c", fontSize: 12 }}>
            Rota preliminar
          </strong>
          <p
            style={{
              color: "#aebbd0",
              fontSize: 12,
              lineHeight: 1.6,
              margin: "5px 0 0"
            }}
          >
            O cálculo utiliza a distância sobre uma esfera aproximada de Marte.
            Não considera obstáculos, inclinação, terreno, paradas ou condições
            reais de deslocamento.
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "#7f96ad",
          fontSize: 11
        }}
      >
        <Mountain size={15} />
        Estimativa matemática, não previsão operacional de missão.
      </div>
    </section>
  );
}