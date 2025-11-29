/* eslint-disable jsx-a11y/alt-text */
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Estilos CSS-in-JS para PDF
const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: 'Helvetica' },
  header: { marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#ea580c' }, // Naranja BurgerApp
  subtitle: { fontSize: 10, color: '#64748b' },
  
  section: { margin: 10, padding: 10, borderTop: '1px solid #e2e8f0' },
  
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, borderBottom: '1px dashed #cbd5e1', paddingBottom: 5 },
  
  totalSection: { marginTop: 20, paddingTop: 10, borderTop: '2px solid #0f172a' },
  totalText: { fontSize: 14, fontWeight: 'bold' },
  
  footer: { position: 'absolute', bottom: 30, left: 0, right: 0, textAlign: 'center', fontSize: 10, color: '#94a3b8' },
});

// EL COMPONENTE
export const OrderInvoice = ({ order }: { order: any }) => {
  const createdDate = new Date(order.createdAt).toLocaleDateString();
  
  // Helper para formatear dinero
  const formatMoney = (amount: any) => `$${Number(amount).toFixed(2)}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* HEADER */}
        <View style={styles.header}>
            <View>
                <Text style={styles.title}>BurgerApp</Text>
                <Text style={styles.subtitle}>El mejor delivery de Charallave</Text>
                <Text style={styles.subtitle}>RIF: J-123456789</Text>
            </View>
            <View>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>ORDEN #{order.id}</Text>
                <Text style={styles.subtitle}>Fecha: {createdDate}</Text>
                <Text style={styles.subtitle}>Estado: {order.status}</Text>
            </View>
        </View>

        {/* DATOS CLIENTE */}
        <View style={styles.section}>
            <Text style={{fontSize: 10, color: '#64748b', marginBottom: 5}}>DATOS DEL CLIENTE:</Text>
            <Text>Nombre: {order.customerName}</Text>
            <Text>Teléfono: {order.phone}</Text>
            <Text>Dirección: {order.address}</Text>
            <Text>Método Pago: {order.paymentMethod.toUpperCase()} {order.paymentRef ? `(Ref: ${order.paymentRef})` : ''}</Text>
        </View>

        {/* TABLA ITEMS */}
        <View style={styles.section}>
            <Text style={{fontSize: 10, color: '#64748b', marginBottom: 10}}>DETALLE DE CONSUMO:</Text>
            {/* Renderizamos items (recordar que 'items' es JSON en la DB) */}
            {(Array.isArray(order.items) ? order.items : []).map((item: any, i: number) => (
                <View key={i} style={styles.itemRow}>
                    <Text style={{width: '60%'}}>{item.quantity}x  {item.name}</Text>
                    <Text style={{width: '40%', textAlign: 'right'}}>{formatMoney(item.price * item.quantity)}</Text>
                </View>
            ))}
        </View>

        {/* TOTALES */}
        <View style={styles.totalSection}>
            <View style={styles.row}>
                <Text style={styles.totalText}>TOTAL A PAGAR:</Text>
                <Text style={styles.totalText}>{formatMoney(order.total)}</Text>
            </View>
            <Text style={{fontSize: 10, marginTop: 5}}>* Tasa de cambio referencial sujeta al día de pago.</Text>
        </View>

        {/* FOOTER */}
        <Text style={styles.footer}>Gracias por tu compra • BurgerApp 2025 • www.burgerapp.com</Text>

      </Page>
    </Document>
  );
};