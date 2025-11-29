/* eslint-disable jsx-a11y/alt-text */
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica', fontSize: 10 },
  header: { fontSize: 18, marginBottom: 20, fontWeight: 'bold', textAlign: 'center' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderBottom: 1, borderColor: '#e2e8f0', padding: 5 },
  tableRow: { flexDirection: 'row', padding: 5, borderBottom: 1, borderColor: '#f1f5f9' },
  col1: { width: '10%' },
  col2: { width: '40%' },
  col3: { width: '20%' },
  col4: { width: '15%' },
  col5: { width: '15%' },
});

export const DailyReport = ({ orders, revenue }: { orders: any[], revenue: number }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>REPORTE DE VENTAS - BURGERAPP</Text>
      <Text style={{ marginBottom: 10 }}>Fecha de Emisión: {new Date().toLocaleDateString()}</Text>
      <Text style={{ marginBottom: 20 }}>Total Ingresos Periodo: ${Number(revenue).toFixed(2)}</Text>

      <View style={styles.tableHeader}>
        <Text style={styles.col1}>ID</Text>
        <Text style={styles.col2}>CLIENTE</Text>
        <Text style={styles.col3}>MÉTODO</Text>
        <Text style={styles.col4}>FECHA</Text>
        <Text style={styles.col5}>TOTAL</Text>
      </View>

      {orders.map((o) => (
        <View key={o.id} style={styles.tableRow}>
          <Text style={styles.col1}>#{o.id}</Text>
          <Text style={styles.col2}>{o.customerName}</Text>
          <Text style={styles.col3}>{o.paymentMethod}</Text>
          <Text style={styles.col4}>{new Date(o.createdAt).toLocaleDateString()}</Text>
          <Text style={styles.col5}>${Number(o.total).toFixed(2)}</Text>
        </View>
      ))}
    </Page>
  </Document>
);