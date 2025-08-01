import WorldMap from '@/Components/ui/world-map';
import type { Visit } from '@/types/visits';
import { useMemo } from 'react';
import { useTheme } from '../../contexts/theme-provider';

export function WorldMapVisits({ visits }: { visits: Visit[] }) {
    const { theme } = useTheme();
    console.log(theme);

    const points = useMemo(
        () =>
            Array.from(
                new Map(
                    visits
                        .filter(
                            (visit) =>
                                visit.location &&
                                Array.isArray(visit.location.ll) &&
                                visit.location.ll.length === 2 &&
                                typeof visit.location.ll[0] === 'number' &&
                                typeof visit.location.ll[1] === 'number'
                        )
                        .map((visit) => [
                            `${visit.location.ll[0]},${visit.location.ll[1]}`,
                            {
                                lat: visit.location?.ll[0],
                                lng: visit.location?.ll[1],
                                label:
                                    visit.location?.city ||
                                    visit.location?.country ||
                                    'Unknown',
                            },
                        ])
                ).values()
            ),
        [visits]
    );

    return (
        <div className=" dark:bg-black bg-white w-fit border rounded-2xl overflow-hidden p-2 grow">
            <WorldMap dots={points} visits={visits} theme={theme} />
        </div>
    );
}
