import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const ReportPDF = ({ report }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>{report.createdBy}</Text>
        <Text>{report.createdAt}</Text>
        {/* Agrega otros campos del reporte aquí */}
      </View>
    </Page>
  </Document>
);

export default ReportPDF;
