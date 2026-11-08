
import { useEffect, useState } from "react";
import { Image, ExternalLink, Search, LoaderCircle } from "lucide-react";

const REGION_SEARCH = {
  arcadia: "Arcadia Planitia Mars",
  deuteronilus: "Deuteronilus Mensae Mars",
  jezero: "Jezero Crater Mars"
};

export default function MarsImagery({ region }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!region) return;

    const controller = new AbortController();

    async function searchImages() {
      setLoading(true);
      setError("");
      setImages([]);

      const location = REGION_SEARCH[region.id] || `${region.name} Mars`;
      const query = `${location} NASA Mars`;

      try {
        const url =
          `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}` +
          "&media_type=image&page_size=8";

        const response = await fetch(url, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("Não foi possível consultar o catálogo da NASA.");
        }

        const result = await response.json();

        const items = (result.collection?.items || [])
          .map((item) => {
            const data = item.data?.[0];
            const thumbnail = item.links?.find(
              (link) => link.rel === "preview"
            )?.href;

            if (!data || !thumbnail) return null;

            return {
              id: data.nasa_id,
              title: data.title || "Imagem de Marte",
              date: data.date_created
                ? data.date_created.slice(0, 10)
                : "Data não informada",
              description: data.description || "",
              thumbnail,
              details: `https://images.nasa.gov/details/${data.nasa_id}`
            };
          })
          .filter(Boolean);

        setImages(items);

        if (items.length === 0) {
          setError("Nenhuma imagem encontrada para esta pesquisa.");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Não foi possível carregar as imagens. Tente novamente.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    searchImages();

    return () => controller.abort();
  }, [region?.id, region?.name]);

  return (
    <section className="mars-imagery">
      <div className="imagery-heading">
        <div>
          <span className="eyebrow">NASA IMAGE LIBRARY</span>
          <h3>Imagens da região</h3>
        </div>
        <Image size={21} />
      </div>

      <p className="imagery-description">
        Pesquisa de imagens relacionadas à região selecionada
        no catálogo público de imagens da NASA.
      </p>

      {loading && (
        <div className="imagery-status">
          <LoaderCircle className="imagery-spinner" size={20} />
          Consultando imagens da NASA...
        </div>
      )}

      {error && (
        <div className="imagery-status imagery-error">
          {error}
        </div>
      )}

      {!loading && images.length > 0 && (
        <div className="imagery-grid">
          {images.map((item) => (
            <article className="imagery-card" key={item.id}>
              <a
                href={item.details}
                target="_blank"
                rel="noreferrer"
                className="imagery-image-link"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  loading="lazy"
                />
              </a>

              <div className="imagery-card-info">
                <strong>{item.title}</strong>
                <span>{item.date}</span>

                <a
                  href={item.details}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver na NASA <ExternalLink size={13} />
                </a>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="imagery-footer">
        <Search size={13} />
        Resultados do catálogo NASA. A localização e o instrumento
        de cada imagem devem ser conferidos nos metadados.
      </div>
    </section>
  );
}
