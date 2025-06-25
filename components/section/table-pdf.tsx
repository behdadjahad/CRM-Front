import { convertDate } from "@/lib/date";
import { dateType } from "@/lib/utils";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";
import { useState } from "react";

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
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },

  footerText: {
    textAlign: "right",
    fontSize: 12,
    marginTop: 5,
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
    width:"fit-content"
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
const reportDate = convertDate(new Date().toISOString(), dateType);
const Header = ({ title }: { title: string }) => (
  <View style={styles.header}>
    <Image style={styles.logo} src="/images/logo.png" />

    {/* Title */}
    <Text style={styles.headerText}>گزارش ثبت {title}</Text>

    {/* Container for Date and Period, aligned right */}
    <View
      style={{
        flexDirection: "column",
        alignItems: "flex-end",
        marginLeft: 10,
      }}
    >
      <Text style={{ fontSize: 10, color: "#555" }}>
        تاریخ گزارش: {reportDate}
      </Text>
      {/* <Text style={{ fontSize: 10, color: "#555" }}>دوره زمانی: {}</Text> */}
    </View>
  </View>
);

export function TablePDF({
  headers,
  list,
  title,
}: {
  headers: string[];
  list: Record<string, any>[];
  title: string;
  }) {
  console.log(list)
  const colWidth = `${100 / headers.length}%`;
  const itemsPerPage = 8;
  const totalPagesOrder = Math.ceil(list.length / itemsPerPage);
  const pages = [];
  for (let i = 0; i < list.length; i += itemsPerPage) {
    pages.push(list.slice(i, i + itemsPerPage));
  }

  return (
    <Document>
      {pages.map((pageItems, pageIndex) => (
        <Page
          key={pageIndex}
          size="A4"
          style={styles.page}
          wrap
          orientation="landscape"
        >
          <Header title={title} />

          <View style={styles.table}>
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

            {/* Data Rows for this page */}
            {pageItems.map((item, rowIndex) => (
              <View style={styles.tableRow} key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <View
                    key={colIndex}
                    style={{ ...styles.tableCol, width: colWidth }}
                  >
                    <Text style={styles.tableCell}>
                      {item[header] !== undefined
                        ? item[header].toString()
                        : ""}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
          <View style={styles.footer}>
            <Text style={styles.footerText}>{`صفحه ی ${
              pageIndex + 1
            } از ${totalPagesOrder}`}</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
}
