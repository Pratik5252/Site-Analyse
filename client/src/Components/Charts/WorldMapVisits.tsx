import WorldMap from "@/Components/ui/world-map";
import { dummyVisitData } from "@/__mocks__/dummyVisitData";
import type { Visit } from "@/types/visits";
import { useMemo } from "react";

export function WorldMapVisits({ visits }: { visits: Visit[] }) {
  const points = useMemo(
    () =>
      Array.from(
        new Map(
          dummyVisitData.visits
            .filter(
              (visit) =>
                visit.location &&
                Array.isArray(visit.location.ll) &&
                visit.location.ll.length === 2 &&
                typeof visit.location.ll[0] === "number" &&
                typeof visit.location.ll[1] === "number"
            )
            .map((visit) => [
              `${visit.location.ll[0]},${visit.location.ll[1]}`,
              {
                lat: visit.location?.ll[0],
                lng: visit.location?.ll[1],
                label:
                  visit.location?.city || visit.location?.country || "Unknown",
              },
            ])
        ).values()
      ),
    [visits]
  );

  return (
    <div className=" dark:bg-black bg-white w-fit border rounded-2xl overflow-hidden p-2 grow">
      {/* <div className="max-w-7xl mx-auto text-center">
        <p className="font-bold text-xl md:text-4xl dark:text-white text-black">
          Visitor Locations
        </p>
        <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto py-4">
          Showing unique cities from your visitor data.
        </p>
      </div> */}
      <WorldMap dots={points} visits={visits} />
    </div>
  );
}
