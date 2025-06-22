import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// Register font
Font.register({
  family: "IRANSans",
  src: "/fonts/IRANSans(FaNum).ttf", // adjust path if needed
});

// Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "IRANSans",
    fontSize: 12,
    direction: "rtl",
    paddingTop: 80,
    paddingBottom: 60,
    paddingHorizontal: 40,
    lineHeight: 1.5,
  },
  header: {
    position: "absolute",
    top: 20,
    left: 40,
    right: 40,
    height: 60,
    flexDirection: "row-reverse",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#aaa",
    paddingBottom: 5,
  },
  logo: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  headerText: {
    flex: 1,
    textAlign: "right",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 40,
    right: 40,
    height: 40,
    borderTopWidth: 1,
    borderColor: "#aaa",
    justifyContent: "center",
    alignItems: "center",

  },
  footerText: {
    flex: 1,
    textAlign: "right",
    fontSize: 16,
    fontWeight: "bold",
  },
  table: {
    borderWidth: 1,
    borderColor: "#bfbfbf",
    marginTop: 20,
  },
  tableRow: {
    flexDirection: "row-reverse",
  },
  tableColHeader: {
    backgroundColor: "#eeeeee",
    borderRightWidth: 1,
    borderColor: "#bfbfbf",
    padding: 5,
  },
  tableCol: {
    borderRightWidth: 1,
    borderColor: "#bfbfbf",
    padding: 5,
  },
  tableCellHeader: {
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCell: {
    textAlign: "center",
  },
});

const Header = () => (
  <View style={styles.header}>
    <Image style={styles.logo} src="/images/logo.png" />
    <Text style={styles.headerText}>گزارش ثبت فرودگاه</Text>
  </View>
);

const Footer = () => (
  <View style={styles.footer} fixed>
    {/* <Text
      style={styles.footerText}
      render={({ pageNumber, totalPages }) =>
        `صفحه ${pageNumber} از ${totalPages}`
      }
    /> */}
    <Text style={styles.headerText}>footer</Text>
  </View>
);

export function TablePDF({
  headers,
  list,
}: {
  headers: string[];
  list: Record<string, any>[];
}) {
  const colWidth = `${100 / headers.length}%`;

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <Header />
        <Footer />

        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.tableRow}>
            {headers.map((header, index) => (
              <View
                key={index}
                style={{ ...styles.tableColHeader, width: colWidth }}
              >
                <Text style={styles.tableCellHeader}>{header}</Text>
              </View>
            ))}
          </View>

          {/* Data Rows */}
          {list.map((item, rowIndex) => (
            <View style={styles.tableRow} key={rowIndex}>
              {headers.map((header, colIndex) => (
                <View
                  key={colIndex}
                  style={{ ...styles.tableCol, width: colWidth }}
                >
                  <Text style={styles.tableCell}>
                    {item[header] !== undefined ? item[header].toString() : ""}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
