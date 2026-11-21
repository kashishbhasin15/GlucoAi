
import type {
  AgeGroupStat,
  BarDatum,
  RateRow
} from '../types';


// Convert age statistics to 3D bar chart data
export const toAgeBars = (
  stats: AgeGroupStat[]
): BarDatum[] =>

  stats.map(item => ({
    label: item.age,
    value: item.encounters,

    lines: [
      `Encounters|${item.encounters.toLocaleString()}`,
      `Share|${item.share}%`,
      `Readmission|${item.readmitRate}%`,
      `Avg stay|${item.avgStay} days`
    ]
  }));


// Age filters
export const BANDS = [
  'All ages',
  'Under 50',
  '50–69',
  '70+'
];


export function filterBand<T extends { age: string }>(
  rows: T[],
  band: string
): T[] {

  return rows.filter(row => {

    const age = parseInt(row.age, 10);

    if (band === 'Under 50') {
      return age < 50;
    }

    if (band === '50–69') {
      return age >= 50 && age < 70;
    }

    if (band === '70+') {
      return age >= 70;
    }

    return true;
  });
}


// Weighted average
export function wavg<T extends { encounters: number }>(
  rows: T[],
  key: keyof T
): number {

  const total = rows.reduce(
    (sum, row) => sum + row.encounters,
    0
  );

  if (!total) {
    return 0;
  }

  return rows.reduce(
    (sum, row) =>
      sum + Number(row[key]) * row.encounters,
    0
  ) / total;
}


// Combine counts across selected age groups
export function combineCounts(
  groups: RateRow[][]
): RateRow[] {

  const result = new Map<string, number>();

  groups.flat().forEach(row => {

    result.set(
      row.name,
      (result.get(row.name) ?? 0) + row.value
    );

  });

  return Array.from(
    result,
    ([name, value]) => ({
      name,
      value
    })
  );
}


// Combine rates using encounter-weighted averages
export function combineRates(
  groups: RateRow[][]
): RateRow[] {

  const result = new Map<
    string,
    {
      weightedRate: number;
      count: number;
    }
  >();

  groups.flat().forEach(row => {

    const count = row.n ?? 0;

    const current = result.get(row.name) ?? {
      weightedRate: 0,
      count: 0
    };

    current.weightedRate += row.value * count;
    current.count += count;

    result.set(row.name, current);

  });

  return Array.from(result, ([name, row]) => ({

    name,

    value: row.count
      ? Number(
          (row.weightedRate / row.count).toFixed(2)
        )
      : 0,

    n: row.count

  }));
}
