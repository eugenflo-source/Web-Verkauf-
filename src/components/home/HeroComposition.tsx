import { ChatScreen, DashboardScreen, WebsiteScreen } from "@/components/mockups/screens";

/**
 * Komposition aus Website-, Dashboard- und Assistenten-Vorschau.
 * Alle Ebenen skalieren über Container-Einheiten, damit die Darstellung
 * auf dem Smartphone genauso aufgeräumt bleibt wie auf dem Desktop.
 */
export function HeroComposition() {
  return (
    <div
      role="img"
      aria-label="Vorschau: Website eines lokalen Unternehmens, ein Finanz-Dashboard und ein KI-Assistent, der Anfragen einordnet"
      className="relative mx-auto aspect-[1/1.22] w-full max-w-[72rem] sm:aspect-[16/9.4]"
    >
      {/* Lichtquelle hinter der Komposition */}
      <div aria-hidden className="absolute left-1/2 top-[20%] -z-10 h-[60%] w-[70%] -translate-x-1/2 rounded-full bg-accent-strong/20 blur-[90px]" />

      {/* Website */}
      <div className="absolute left-0 top-0 w-[92%] sm:left-[2%] sm:top-[8%] sm:w-[66%]">
        <div className="mock aspect-[16/10.5] [animation:float_12s_ease-in-out_infinite]">
          <div className="mock-canvas h-full">
            <WebsiteScreen />
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <div className="absolute right-0 top-[33%] w-[74%] sm:top-[2%] sm:w-[44%]">
        <div className="mock aspect-[16/10.5] [animation:float_10s_ease-in-out_-3s_infinite]">
          <div className="mock-canvas h-full !text-[2.3cqw]">
            <DashboardScreen title="Auswertung" />
          </div>
        </div>
      </div>

      {/* KI-Assistent */}
      <div className="absolute bottom-0 left-0 w-[70%] sm:bottom-[1%] sm:left-auto sm:right-[5%] sm:w-[36%]">
        <div className="glass-strong sheen rounded-[1.1rem] p-1 [animation:float_9s_ease-in-out_-6s_infinite]">
          <div className="mock aspect-[10/8]">
            <div className="mock-canvas h-full !text-[3.4cqw]">
              <ChatScreen animated />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
