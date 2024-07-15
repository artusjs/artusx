import { useEffect } from 'react';

const clearMarks = (mark: string) => {
  performance.getEntriesByName(mark, 'mark').forEach((entry) => {
    console.debug('clearMarks.entry', entry.name);
    performance.clearMarks(entry.name);
  });
};

const clearMeasures = (measure: string) => {
  performance.getEntriesByName(measure, 'measure').forEach((entry) => {
    console.debug('clearMeasures.entry', entry.name);
    performance.clearMeasures(entry.name);
  });
};

export const useMeasure = (name: string, start: string, end: string) => {
  if (!name || !start || !end) {
    return;
  }

  clearMarks(end);

  console.debug('useMeasure.mark', end);
  performance.mark(end);

  useEffect(() => {
    const measure = () => {
      const customMeasure = performance.measure(name, start, end);
      console.debug('useMeasure.customMeasure', customMeasure.name, customMeasure.duration, customMeasure);
    };

    measure();

    return () => {
      clearMarks(start);
      clearMarks(end);
      clearMeasures(name);
    };
  }, []);

  return {};
};
