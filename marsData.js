
// ======================================================
// NOVASTRIUM — MARS SCIENTIFIC DATABASE
// Banco regional, fontes e metadados científicos.
// Distingue dados reais, evidências e informações
// que ainda precisam de validação em escala local.
// ======================================================

export const MARS_REGIONS = [
  {
    id: "arcadia",
    name: "Arcadia Planitia",
    subtitle: "Planície do hemisfério norte",
    latitude: 46.0,
    longitude: 190.0,

    description:
      "Arcadia Planitia é uma extensa planície do hemisfério norte. Partes da região apresentam evidências orbitais de gelo de água próximo à superfície. Isso torna a região importante para investigar recursos que poderiam apoiar futuras missões humanas. A presença e a profundidade do gelo precisam ser verificadas em escala local.",

    terrain:
      "Planície ampla, com superfícies relativamente suaves em escala regional. Existem crateras, depósitos superficiais e variações locais que precisam ser examinadas com imagens de maior resolução.",

    resources: [
      "Possíveis depósitos de gelo de água subterrâneo em partes da região.",
      "Materiais superficiais para estudos geológicos.",
      "Potencial para investigação de recursos locais, ainda não quantificados."
    ],

    elevation:
      "A topografia regional pode ser estudada com MOLA. A altitude exata de cada ponto exige consulta a um produto topográfico georreferenciado.",

    temperature:
      "Latitude elevada e ambiente frio. As condições térmicas variam conforme estação, horário e propriedades da superfície.",

    science: [
      "Investigar a distribuição de possíveis depósitos de gelo.",
      "Comparar dados de radar orbital e imagens da superfície.",
      "Estudar a relação entre relevo e depósitos superficiais.",
      "Identificar áreas de interesse para futuras pesquisas de recursos."
    ],

    risks: [
      "A presença de gelo não é uniforme em toda a região.",
      "Poeira e depósitos superficiais podem dificultar a interpretação do terreno.",
      "Crateras, blocos e irregularidades locais exigem inspeção detalhada.",
      "Condições térmicas e iluminação precisam ser avaliadas por localização e estação."
    ],

    investigation: {
      priority: "Investigação de recursos",
      evidence:
        "Evidências orbitais de gelo próximo à superfície em partes da região.",
      uncertainty:
        "A profundidade, concentração, continuidade e acessibilidade do gelo não são determinadas pela visualização global."
    },

    evidenceType: "Evidência orbital regional",
    dataStatus: "Evidência científica; validação local necessária",

    sourceLabel: "NASA JPL — Follow the Water",
    source:
      "https://www.jpl.nasa.gov/news/where-should-future-astronauts-land-on-mars-follow-the-water/",

    relatedDatasets: ["mola", "sharad", "hirise", "water-ice"]
  },

  {
    id: "deuteronilus",
    name: "Deuteronilus Mensae",
    subtitle: "Terrenos glaciais do norte",
    latitude: 40.0,
    longitude: 25.0,

    description:
      "Deuteronilus Mensae é uma região de transição entre planícies e terrenos antigos. Apresenta mesas, vales, escarpas e formas de relevo associadas a processos glaciais. Seus depósitos são importantes para investigar a história do gelo em Marte.",

    terrain:
      "Paisagem irregular, com mesas, encostas, vales e depósitos lobados. As mudanças de altitude e inclinação podem influenciar a escolha de trajetos de exploração.",

    resources: [
      "Possíveis depósitos ricos em gelo associados a formas glaciais.",
      "Materiais geológicos que registram processos de transporte e deposição.",
      "Feições superficiais úteis para investigar a evolução climática marciana."
    ],

    elevation:
      "O relevo apresenta variações regionais significativas. MOLA ajuda a estudar o contexto topográfico, mas trajetos exigem modelos de maior resolução.",

    temperature:
      "Região de latitude média a alta do hemisfério norte. O ambiente é frio e varia conforme estação e exposição solar.",

    science: [
      "Investigar depósitos lobados e possíveis geleiras cobertas por detritos.",
      "Comparar feições glaciais com dados de radar orbital.",
      "Estudar a evolução dos depósitos de gelo.",
      "Investigar registros de mudanças climáticas em Marte."
    ],

    risks: [
      "Escarpas e encostas podem limitar a circulação.",
      "Mesas e vales criam mudanças locais de relevo.",
      "Detritos podem dificultar a identificação direta de materiais subterrâneos.",
      "A escolha de rotas exige análise de inclinação e obstáculos."
    ],

    investigation: {
      priority: "Investigação geológica e glacial",
      evidence:
        "Feições geomorfológicas associadas a processos glaciais e depósitos possivelmente ricos em gelo.",
      uncertainty:
        "A composição e a espessura dos depósitos precisam ser avaliadas com dados orbitais específicos."
    },

    evidenceType: "Interpretação geomorfológica regional",
    dataStatus: "Evidência científica; validação local necessária",

    sourceLabel: "NASA JPL — Follow the Water",
    source:
      "https://www.jpl.nasa.gov/news/where-should-future-astronauts-land-on-mars-follow-the-water/",

    relatedDatasets: ["mola", "sharad", "hirise", "water-ice"]
  },

  {
    id: "jezero",
    name: "Cratera Jezero",
    subtitle: "Antigo sistema lacustre e deltaico",
    latitude: 18.4,
    longitude: 77.7,

    description:
      "A Cratera Jezero preserva evidências de um antigo ambiente lacustre, incluindo um delta formado pela entrada de água no passado. É explorada pelo rover Perseverance, da NASA, e possui grande importância para estudos de geologia, sedimentação e habitabilidade antiga.",

    terrain:
      "Cratera de impacto com bordas, depósitos sedimentares, leques deltaicos, canais antigos e diferentes unidades geológicas. Existem áreas relativamente planas e setores mais acidentados.",

    resources: [
      "Rochas sedimentares que registram antigos ambientes com água.",
      "Minerais importantes para estudos de processos químicos antigos.",
      "Amostras geológicas investigadas pelo rover Perseverance."
    ],

    elevation:
      "Existem diferenças de altitude entre a borda, o interior e as estruturas deltaicas. A análise de elevação e declividade exige dados topográficos apropriados.",

    temperature:
      "Localizada em latitude relativamente baixa para Marte. As condições térmicas continuam extremas e variam com estação e horário.",

    science: [
      "Investigar a história do antigo lago.",
      "Estudar os sedimentos e minerais do delta.",
      "Analisar rochas que podem preservar registros de ambientes antigos.",
      "Acompanhar os resultados científicos e as amostras estudadas pelo Perseverance."
    ],

    risks: [
      "Bordas da cratera e encostas podem apresentar inclinações importantes.",
      "Rochas e crateras menores podem dificultar a circulação.",
      "Depósitos sedimentares e dunas exigem avaliação detalhada.",
      "Importância científica não significa adequação automática para pouso humano."
    ],

    investigation: {
      priority: "Investigação científica e geológica",
      evidence:
        "Estruturas deltaicas, depósitos sedimentares e registros de um antigo ambiente lacustre.",
      uncertainty:
        "A avaliação de cada trajeto exige imagens e dados topográficos de alta resolução."
    },

    evidenceType: "Observação orbital e investigação robótica",
    dataStatus: "Região explorada por missão robótica",

    sourceLabel: "NASA Mars 2020 — Perseverance",
    source:
      "https://mars.nasa.gov/mars2020/mission/where-is-the-rover/",

    relatedDatasets: ["mola", "hirise", "perseverance"]
  }
];

// ======================================================
// CONFIGURAÇÃO DAS CAMADAS DO MAPA
// ======================================================

export const MARS_DATA = {
  baseLayer: {
    id: "mola-global",
    name: "MOLA Global Color Hillshade",

    // Endpoint oficial NASA Mars Trek WMTS.
    // O App.jsx atual utiliza este prefixo para
    // carregar os tiles globais 0.jpg e 1.jpg.
    url:
      "https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/default/default028mm/0/0/",

    capabilitiesUrl:
      "https://trek.nasa.gov/tiles/Mars/EQ/Mars_MGS_MOLA_ClrShade_merge_global_463m/1.0.0/WMTSCapabilities.xml",

    agency: "NASA / JPL Mars Trek",
    resolution: "463 m/pixel",
    type: "Color hillshade",
    status: "real-data-source",

    description:
      "Visualização global de relevo construída a partir de dados MOLA. É uma representação sombreada da topografia, não uma leitura direta de altitude em cada pixel."
  },

  layers: [
    {
      id: "mola",
      name: "MOLA — Altimetria",
      category: "TOPOGRAFIA",
      description:
        "Dados de altimetria laser usados para estudar elevação e topografia global.",
      agency: "NASA / PDS",
      datasetUrl:
        "https://pds-geosciences.wustl.edu/missions/mgs/mola.html",
      status: "catalog"
    },
    {
      id: "hirise",
      name: "HiRISE — Imagens orbitais",
      category: "IMAGENS DE ALTA RESOLUÇÃO",
      description:
        "Imagens orbitais de alta resolução úteis para investigar crateras, rochas e formas de terreno.",
      agency: "NASA / University of Arizona",
      datasetUrl: "https://hirise.lpl.arizona.edu/",
      status: "catalog"
    },
    {
      id: "sharad",
      name: "SHARAD — Radar orbital",
      category: "SUBSUPERFÍCIE",
      description:
        "Dados de radar usados para investigar estruturas e materiais abaixo da superfície.",
      agency: "NASA / PDS Geosciences",
      datasetUrl:
        "https://pds-geosciences.wustl.edu/missions/mro/sharad.htm",
      status: "catalog"
    },
    {
      id: "water-ice",
      name: "Treasure Map for Water Ice on Mars",
      category: "GELO DE ÁGUA",
      description:
        "Produto de referência para investigar regiões onde gelo de água próximo à superfície pode existir.",
      agency: "NASA / JPL",
      datasetUrl:
        "https://science.nasa.gov/resource/treasure-map-for-water-ice-on-mars/",
      status: "catalog"
    }
  ]
};

// ======================================================
// CATÁLOGO DE FONTES CIENTÍFICAS
// ======================================================

export const DATA_SOURCES = [
  {
    id: "mola",
    category: "TOPOGRAFIA",
    name: "MOLA — Mars Orbiter Laser Altimeter",
    description:
      "Instrumento da missão Mars Global Surveyor usado para medir a topografia de Marte por altimetria laser.",
    agency: "NASA / PDS Geosciences",
    url:
      "https://pds-geosciences.wustl.edu/missions/mgs/mola.html",
    dataType: "Altimetria",
    coverage: "Global",
    status: "Fonte científica"
  },
  {
    id: "hirise",
    category: "IMAGENS DE ALTA RESOLUÇÃO",
    name: "HiRISE — Mars Reconnaissance Orbiter",
    description:
      "Imagens orbitais de alta resolução úteis para investigar crateras, rochas, dunas e características locais.",
    agency: "NASA / University of Arizona",
    url: "https://hirise.lpl.arizona.edu/",
    dataType: "Imagem orbital",
    coverage: "Áreas imageadas",
    status: "Catálogo científico"
  },
  {
    id: "sharad",
    category: "SUBSUPERFÍCIE",
    name: "SHARAD — Shallow Radar",
    description:
      "Instrumento de radar orbital usado para investigar estruturas e materiais abaixo da superfície marciana.",
    agency: "NASA / PDS Geosciences",
    url:
      "https://pds-geosciences.wustl.edu/missions/mro/sharad.htm",
    dataType: "Radar",
    coverage: "Faixas observadas pelo instrumento",
    status: "Catálogo científico"
  },
  {
    id: "water-ice",
    category: "GELO DE ÁGUA",
    name: "Treasure Map for Water Ice on Mars",
    description:
      "Produto de referência para investigar possíveis depósitos de gelo de água próximo à superfície.",
    agency: "NASA / JPL",
    url:
      "https://science.nasa.gov/resource/treasure-map-for-water-ice-on-mars/",
    dataType: "Mapa de distribuição de gelo",
    coverage: "Cobertura definida pelo produto",
    status: "Produto científico de referência"
  },
  {
    id: "perseverance",
    category: "MISSÃO ROBÓTICA",
    name: "Mars 2020 — Perseverance",
    description:
      "Missão robótica que investiga a geologia e a história ambiental da Cratera Jezero.",
    agency: "NASA",
    url:
      "https://mars.nasa.gov/mars2020/",
    dataType: "Dados de missão e observações de superfície",
    coverage: "Área de operação do rover",
    status: "Missão científica"
  },
  {
    id: "mars-trek",
    category: "MAPA GLOBAL",
    name: "NASA Mars Trek — WMTS",
    description:
      "Serviço de mapas em tiles para visualizar mosaicos e produtos cartográficos de Marte.",
    agency: "NASA / JPL",
    url: "https://trek.nasa.gov/mars/",
    dataType: "Serviço cartográfico",
    coverage: "Depende da camada selecionada",
    status: "Serviço de mapas"
  }
];

// ======================================================
// PORTAIS OFICIAIS
// ======================================================

export const OFFICIAL_LINKS = [
  {
    name: "NASA Mars Trek",
    url: "https://trek.nasa.gov/mars/"
  },
  {
    name: "NASA Planetary Data System",
    url: "https://pds.nasa.gov/"
  },
  {
    name: "USGS Astrogeology",
    url: "https://astrogeology.usgs.gov/"
  },
  {
    name: "NASA Mars Exploration",
    url: "https://mars.nasa.gov/"
  },
  {
    name: "NASA HiRISE",
    url: "https://hirise.lpl.arizona.edu/"
  }
];

// ======================================================
// METADADOS E LIMITAÇÕES CIENTÍFICAS
// ======================================================

export const SCIENTIFIC_METADATA = {
  coordinateSystem: "Latitude e longitude planetocêntricas",
  longitudeConvention: "Leste positivo; valores de 0° a 360°",
  baseMap: "MOLA Global Color Hillshade",
  baseMapResolution: "463 m/pixel",

  importantLimitations: [
    "Os pontos das regiões são referências geográficas aproximadas.",
    "A camada global MOLA não substitui modelos topográficos locais de alta resolução.",
    "A presença regional de gelo não confirma sua existência em um ponto específico.",
    "Imagens orbitais precisam ser verificadas quanto à cobertura e à resolução.",
    "O catálogo de fontes não significa que todas as camadas estejam ativas no mapa.",
    "Nenhuma informação deste banco certifica a segurança de um local de pouso ou trajeto tripulado."
  ],

  projectScope:
    "Ferramenta de exploração e planejamento preliminar. Não é um sistema certificado de navegação ou segurança para missões tripuladas."
};

// Compatibilidade com versões anteriores do projeto.
export const PLACES = MARS_REGIONS;
