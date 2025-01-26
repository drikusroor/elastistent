import { useState, useEffect, useRef, useCallback } from "react";
import { X, PlusCircle, Share2, Redo2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import ViewToggle from "./components/ViewToggle";
import { useTranslation } from "react-i18next";
import { FEATURES } from "./config";
import LanguageButtons from "./components/LanguageButtons";
import Logo from "./components/Logo";
import { TeethGrid } from "./components/TeethGrid";
import { Elastic, ElasticPoint, TimeType } from "./types";

const teethLayout = {
  topLeft: [18, 17, 16, 15, 14, 13, 12, 11],
  topRight: [21, 22, 23, 24, 25, 26, 27, 28],
  bottomLeft: [48, 47, 46, 45, 44, 43, 42, 41],
  bottomRight: [31, 32, 33, 34, 35, 36, 37, 38],
}

const ELASTIC_TYPES = [
  { id: 0, name: "Rabbit", color: "#FF5555", thickness: 3, icon: "🐰" },
  { id: 1, name: "Chipmunk", color: "#5555CC", thickness: 4, icon: "🐿️" },
  { id: 2, name: "Fox", color: "#44DD44", thickness: 5, icon: "🦊" },
];

// Create a mapping for the time options
const TIME_OPTIONS: { [key: string]: string } = {
  a: "24h",
  d: "daytime",
  n: "nighttime",
};

type ToothRef = {
  [key: number]: HTMLButtonElement;
};

const ElasticPlacer = () => {
  const { t } = useTranslation();
  const [isMirrorView, setIsMirrorView] = useState(false);
  const [elastics, setElastics] = useState<Elastic[]>([]);
  const [currentElastic, setCurrentElastic] = useState<ElasticPoint[]>([]);
  const [currentElasticType, setCurrentElasticType] = useState<number>(
    ELASTIC_TYPES[0].id
  );
  const [currentElasticTime, setCurrentElasticTime] = useState<TimeType>("a");
  const [shareUrl, setShareUrl] = useState("");
  const [disabledTeeth, setDisabledTeeth] = useState<number[]>([]);
  const [onHoverListItem, setOnHoverListItem] = useState<number | null>(null);
  const toothRefs = useRef<ToothRef>({});
  const svgRef = useRef<SVGSVGElement>(null);
  const initialLoadDone = useRef(false);

  // Load from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const savedElastics = params.get("e");
    const savedDisabledTeeth = params.get("t");
    const savedMirrorView = params.get("m");

    if (savedElastics) {
      try {
        let parsedElastics = JSON.parse(savedElastics);
        // Convert old format (if needed) to numeric IDs:
        parsedElastics = parsedElastics.map((el: any) => {
          // If el.type is a string name, convert to numeric id
          if (typeof el.type === "string") {
            const foundType =
              ELASTIC_TYPES.find((et) => et.name === el.type) ||
              ELASTIC_TYPES[0];
            el.type = foundType.id;
          }
          return el;
        });
        setElastics(parsedElastics);
      } catch (error) {
        console.error("Error parsing elastics from URL:", error);
      }
    }

    if (FEATURES.DISABLE_TEETH && savedDisabledTeeth) {
      try {
        const parsedDisabledTeeth = JSON.parse(savedDisabledTeeth);
        setDisabledTeeth(parsedDisabledTeeth);
      } catch (error) {
        console.error("Error parsing disabled teeth from URL:", error);
      }
    }

    if (FEATURES.MIRROR_VIEW && savedMirrorView) {
      setIsMirrorView(savedMirrorView === "1");
    }

    initialLoadDone.current = true;
  }, []);

  // Update URL
  useEffect(() => {
    if (initialLoadDone.current) {
      const params = new URLSearchParams();
      if (elastics.length > 0) {
        params.set("e", JSON.stringify(elastics));
      }
      if (FEATURES.DISABLE_TEETH && disabledTeeth.length > 0) {
        params.set("t", JSON.stringify(disabledTeeth));
      }
      if (FEATURES.MIRROR_VIEW) {
        params.set("m", isMirrorView ? "1" : "0");
      }
      const newUrl = `${window.location.origin}${window.location.pathname}${params.toString() ? "?" + params.toString() : ""
        }`;
      window.history.pushState({ path: newUrl }, "", newUrl);
      setShareUrl(newUrl);
    }
  }, [elastics, disabledTeeth, isMirrorView]);

  useEffect(() => {
    if (initialLoadDone.current) {
      // Small delay to ensure DOM is updated
      requestAnimationFrame(() => {
        drawElastics();
      });
    }
  }, [elastics, initialLoadDone, onHoverListItem]);

  const toothAlreadyInElastic = useCallback(
    (toothNumber: number) => {
      return elastics.some((elastic) => elastic.teeth.some(t => t.tooth === toothNumber));
    },
    [elastics]
  );

  const handleToothClick = useCallback(
    (number: number, outside: boolean) => {
      if (
        !FEATURES.ALLOW_MULTIPLE_ELASTICS_PER_TOOTH &&
        toothAlreadyInElastic(number)
      ) {
        return;
      }

      if (!FEATURES.DISABLE_TEETH || !disabledTeeth.includes(number)) {
        setCurrentElastic((prev) => {
          const newElastic = { tooth: number, outside };
          return prev.some((t) => t.tooth === number)
            ? prev.filter((t) => t.tooth !== number)
            : [...prev, newElastic];
        });
      }
    },
    [disabledTeeth, toothAlreadyInElastic]
  );

  const handleToothToggle = useCallback((number: number) => {
    if (FEATURES.DISABLE_TEETH) {
      setDisabledTeeth((prev) =>
        prev.includes(number)
          ? prev.filter((n) => n !== number)
          : [...prev, number]
      );
      setCurrentElastic((prev) => prev.filter((n) => n.tooth !== number));
    }
  }, []);

  const addElastic = useCallback(() => {
    if (currentElastic.length > 1) {
      const newElastic = {
        teeth: currentElastic,
        type: currentElasticType,
        time: currentElasticTime,
      };

      setElastics((prev) => [...prev, newElastic]);
      setCurrentElastic([]);
    }
  }, [currentElastic, currentElasticType, currentElasticTime]);

  const removeElastic = useCallback((index: number) => {
    setElastics((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const resetAll = useCallback(() => {
    setElastics([]);
    setCurrentElastic([]);
    setDisabledTeeth([]);
    setIsMirrorView(false);
    window.history.pushState(
      { path: window.location.pathname },
      "",
      window.location.pathname
    );
    setShareUrl(window.location.origin + window.location.pathname);
  }, []);

  const setToothRef = useCallback((number: number, outside: boolean, ref: HTMLButtonElement) => {
    const toothRefKey = outside ? number * -1 : number;
    toothRefs.current[toothRefKey] = ref;
  }, []);

  const drawElastics = useCallback(() => {
    if (!svgRef.current) return;

    // Clear previous lines
    while (svgRef.current.firstChild) {
      svgRef.current.removeChild(svgRef.current.firstChild);
    }

    // Draw new lines for each elastic
    elastics.forEach((elastic, index) => {
      if (!svgRef.current) return;

      const shouldHighlight = onHoverListItem === index;

      const elasticTypeConfig =
        ELASTIC_TYPES.find((et) => et.id === elastic.type) || ELASTIC_TYPES[0];
      const svgRect = svgRef.current.getBoundingClientRect();
      const points = elastic.teeth
        .map((elasticPoint) => {
          const toothRefKey = elasticPoint.outside ? elasticPoint.tooth * -1 : elasticPoint.tooth;
          const rect = toothRefs.current[toothRefKey]?.getBoundingClientRect();
          if (!rect) return null;

          const baseX = rect.left - svgRect.left + rect.width / 2;
          let x = isMirrorView ? svgRect.width - baseX : baseX;
          let y = rect.top - svgRect.top + rect.height / 2;

          return {
            x,
            y,
          };
        })
        .filter((point) => point !== null) as { x: number; y: number }[];

      if (points.length > 1) {
        const path = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "path"
        );
        const d = points
          .map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`)
          .join(" ");

        if (shouldHighlight) {
          // draw a shadow behind the line
          const shadow = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
          );
          shadow.setAttribute("d", d);
          shadow.setAttribute("fill", "none");
          shadow.setAttribute("stroke", "#000");
          shadow.setAttribute(
            "stroke-width",
            (elasticTypeConfig.thickness + 4).toString()
          );
          shadow.setAttribute("stroke-opacity", "0.5");
          // round line ends & joins
          shadow.setAttribute("stroke-linecap", "round");
          shadow.setAttribute("stroke-linejoin", "round");
          svgRef.current.appendChild(shadow);

          // draw an opaque circle behind every point
          points.forEach((point) => {
            const circle = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "circle"
            );
            circle.setAttribute("cx", point.x.toString());
            circle.setAttribute("cy", point.y.toString());
            circle.setAttribute("r", "10");
            circle.setAttribute("fill", elasticTypeConfig.color);
            circle.setAttribute("stroke", "#000");
            circle.setAttribute("stroke-width", "2");
            circle.setAttribute("stroke-opacity", "0.5");
            svgRef.current?.appendChild(circle);
          });
        }

        path.setAttribute("d", d);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", elasticTypeConfig.color);
        path.setAttribute(
          "stroke-width",
          elasticTypeConfig.thickness.toString()
        );
        // round line ends & joins
        path.setAttribute("stroke-linecap", "round");
        path.setAttribute("stroke-linejoin", "round");

        // Add a title for hover tooltip
        const title = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "title"
        );
        title.textContent = `${t("elastics.elasticTooltip", {
          type: elastic.type,
          teeth: elastic.teeth.join(" → "),
        })}`;
        path.appendChild(title);

        svgRef.current.appendChild(path);
      }
    });
  }, [elastics, isMirrorView, t, onHoverListItem]);

  useEffect(() => {
    const handleResize = () => {
      drawElastics();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [drawElastics]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator
        .share({
          title: t("share.title"),
          url: shareUrl,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      navigator.clipboard.writeText(shareUrl).then(
        () => {
          alert(t("share.copied"));
        },
        (err) => {
          console.error(t("share.copyError"), err);
        }
      );
    }
  }, [shareUrl, t]);

  return (
    <div className="container mx-auto sm:p-4 md:p-8">
      <div className="sm:rounded-xl lg:grid grid-cols-2 pt-4 sm:p-4 md:p-8 bg-jort drop-shadow-xl">
        <h1
          data-testid="title"
          className="text-2xl col-span-2 font-bold mb-4 text-center text-white uppercase flex items-center justify-center"
        >
          <Logo className="inline-block w-8" />
          {t("title")}
        </h1>

        <div>

          {/* View Toggle */}
          {FEATURES.MIRROR_VIEW && (
            <ViewToggle
              isMirrorView={isMirrorView}
              onToggle={() => setIsMirrorView((prev) => !prev)}
            />
          )}

          {/* Legend for Teeth */}
          {(FEATURES.HIGHLIGHT_SPECIAL_TEETH || FEATURES.DISABLE_TEETH) && (
            <div className="bg-white p-4 rounded-lg mb-4 flex flex-wrap gap-4 justify-center">
              {FEATURES.HIGHLIGHT_SPECIAL_TEETH && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-200 rounded"></div>
                    <span>{t("legend.middleIncisors")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-purple-200 rounded"></div>
                    <span>{t("legend.canines")}</span>
                  </div>
                </>
              )}
              {FEATURES.DISABLE_TEETH && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                  <span>{t("legend.disabledTeeth")}</span>
                </div>
              )}
            </div>
          )}

          {/* Legend for Elastics */}
          <div className="bg-white p-4 rounded-lg mb-4">
            <div className="flex flex-wrap gap-4">
              {ELASTIC_TYPES.map((etype) => (
                <div
                  key={etype.id}
                  className="flex items-center gap-2 drop-shadow-xs"
                >
                  <svg width="30" height="10">
                    <line
                      x1="0"
                      y1="5"
                      x2="30"
                      y2="5"
                      stroke={etype.color}
                      strokeWidth={etype.thickness}
                    />
                  </svg>
                  <span>{etype.icon}</span>
                  <span className="text-xs sm:text-base">
                    {t("legend.elasticType", { type: etype.name })}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Teeth Grid */}
        <TeethGrid
          svgRef={svgRef}
          teethLayout={teethLayout}
          currentElastic={currentElastic}
          disabledTeeth={disabledTeeth}
          handleToothClick={handleToothClick}
          handleToothToggle={handleToothToggle}
          setToothRef={setToothRef}
          isMirrorView={isMirrorView}
        />
      </div>

      <div className="mx-auto mt-4 flex flex-col sm:flex-row justify-center md:justify-between items-center sm:items-start gap-4 md:min-w-72 md:p-8">
        <div className="flex flex-col gap-4">
          {/* Elastic type selection as buttons */}
          <div className="flex gap-2">
            {ELASTIC_TYPES.map((etype) => (
              <button
                key={etype.id}
                onClick={() => setCurrentElasticType(etype.id)}
                style={
                  currentElasticType === etype.id
                    ? { backgroundColor: etype.color }
                    : { borderColor: etype.color }
                }
                className={`px-4 py-2 rounded border
          ${currentElasticType === etype.id
                    ? "text-white border-black"
                    : "bg-white text-black"
                  }`}
                title={t("elastics.typeOption", { type: etype.name })}
              >
                {etype.icon && (
                  <span className="bg-white rounded-full p-0.5 mr-1">
                    {etype.icon}
                  </span>
                )}
                <span className={`${etype.icon ? "text-sm" : ""}`}>
                  {t("elastics.typeOption", { type: etype.name })}
                </span>
              </button>
            ))}
          </div>

          {/* Time-based selection */}
          {FEATURES.TIME_BASED_ELASTICS && (
            <div className="flex gap-2">
              {Object.keys(TIME_OPTIONS).map((time) => (
                <button
                  key={time}
                  onClick={() => setCurrentElasticTime(time as TimeType)}
                  className={`px-4 py-2 rounded border ${currentElasticTime === time
                    ? "bg-blue-500 text-white"
                    : "bg-white text-black"
                    }`}
                >
                  {t(`elastics.timeOption.${TIME_OPTIONS[time]}`)}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={addElastic}
            className={`w-full bg-jort text-white px-4 py-2 rounded flex flex-row items-center gap-2 ${currentElastic.length < 2 ? "opacity-30 cursor-not-allowed" : ""
              }`}
            disabled={currentElastic.length < 2}
            title={
              currentElastic.length < 2
                ? t("tooltips.selectTeeth")
                : t("tooltips.addElastic")
            }
          >
            <PlusCircle size={16} />
            {t("buttons.addElastic")}
          </button>

          <button
            onClick={resetAll}
            className="w-full bg-red-500 text-white px-4 py-2 rounded flex flex-row items-center gap-2"
          >
            <Redo2 size={16} />
            {t("buttons.restart")}
          </button>

          <button
            onClick={handleShare}
            className="w-full bg-green-500 text-white px-4 py-2 rounded flex flex-row items-center gap-2"
          >
            <Share2 size={16} />
            {t("buttons.share")}
          </button>
        </div>
        <div className="mx-auto">
          <QRCodeSVG value={shareUrl} size={196} />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{t("elastics.title")}</h2>

          {elastics.length === 0 && (
            <p className="text-gray-500 text-sm">{t("elastics.none")}</p>
          )}

          {elastics.map((elastic, index) => {
            const etype =
              ELASTIC_TYPES.find((et) => et.id === elastic.type) ||
              ELASTIC_TYPES[0];
            return (
              <div
                key={index}
                className={`flex items-center justify-between my-2 p-1 rounded w-full ${onHoverListItem === index ? "bg-gray-200" : ""
                  }`}
                onMouseEnter={() => setOnHoverListItem(index)}
                onMouseLeave={() => setOnHoverListItem(null)}
              >
                <span className="mr-2">
                  {t("elastics.elastic", {
                    number: index + 1,
                    teeth: elastic.teeth.map((t) => t.tooth).join(" → "),
                  })}
                  &nbsp;-{" "}
                  {t("elastics.elasticTypeDisplay", { type: etype.name })}&nbsp;
                  <span
                    style={{ display: "inline-block", verticalAlign: "middle" }}
                  >
                    <svg
                      width="30"
                      height="10"
                      style={{ verticalAlign: "middle" }}
                    >
                      <line
                        x1="0"
                        y1="5"
                        x2="30"
                        y2="5"
                        stroke={etype.color}
                        strokeWidth={etype.thickness}
                      />
                    </svg>
                  </span>
                  {FEATURES.TIME_BASED_ELASTICS && (
                    <span
                      className="ml-2 text-sm text-gray-600"
                      title={t(`elastics.timeOption.${elastic.time}`)}
                    >
                      {elastic.time === "a"
                        ? "🏪"
                        : elastic.time === "d"
                          ? "☀️"
                          : "😴"}
                    </span>
                  )}
                </span>
                <button
                  title={t("buttons.removeElastic")}
                  onClick={() => removeElastic(index)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  <X size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <small className="block text-center mt-8 text-gray-500">
        {t("footer.copyright", { year: new Date().getFullYear() })}
        &nbsp;
        <a
          href="https://kokokoding.nl"
          target="_blank"
          rel="noopener noreferrer"
          className="text-jort hover:underline"
        >
          Koko Koding
        </a>
      </small>

      <LanguageButtons />
    </div>
  );
};

export default ElasticPlacer;
