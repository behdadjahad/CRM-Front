import { Document, Page, Image, Text } from '@react-pdf/renderer';

export function ReportPDF({ chartImages }: { chartImages: string[] }) {
  return (
    <Document>
      <Page size="A4" style={{ padding: 20 }}>
        {chartImages.map((img, index) => (
          <Image
            key={index}
            src={img}
            style={{ marginBottom: 15, width: '100%', height: 'auto' }}
         
          />
        ))}
      </Page>
    </Document>
  );
}
