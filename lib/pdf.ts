import html2canvas from 'html2canvas';

export async function getChartImage(id: string): Promise<string | null> {
  const el = document.getElementById(id);
  if (!el) return null;

  const canvas = await html2canvas(el, { useCORS: true });
  return canvas.toDataURL('image/png');
}
export async function captureAllCharts(): Promise<string[]> {
  const chartIds = ['gauge-chart','sale-bar-chart',"report-table","multiple-bar-chart","progress-bar-0","progress-bar-1"];
  const images = [];

  for (const id of chartIds) {
    const img = await getChartImage(id);
    if (img) images.push(img);
  }

  return images;
}