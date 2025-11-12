import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Bookmark } from 'lucide-react-native'; // Usaremos el icono de marcador
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- Datos de Ejemplo para los Productos Guardados ---
const SAVED_ITEMS = [
    {
        id: '1',
        name: 'Cosco Roll',
        price: '130.00',
        descriptionInside: 'Filadelfia, pepino, aguacate y pollo.',
        descriptionOutside: 'Gratinado especial de queso manchego con tocino.',
        imageUrl: 'URL_IMAGEN_COSCO_ROLL', // Reemplaza
    },
    {
        id: '2',
        name: 'Okinawa',
        price: '130.00',
        descriptionInside: 'Gratinado de la casa con camarón y res.',
        descriptionOutside: 'Filadelfia, aguacate y ajonjolí.',
        imageUrl: 'URL_IMAGEN_OKINAWA', // Reemplaza
    },
    // Añade más elementos según sea necesario
];

// --- Componente de la Tarjeta de Producto Guardado ---
const SavedItemCard = ({ item }) => (
    <View style={cardStyles.container}>
        <Image 
            source={{ uri: item.imageUrl }} 
            style={cardStyles.image}
        />
        <View style={cardStyles.infoContainer}>
            <View style={cardStyles.headerRow}>
                <Text style={cardStyles.title}>{item.name}</Text>
                <Text style={cardStyles.price}>${item.price}</Text>
            </View>
            
            {/* ➡️ APLICACIÓN DE numberOfLines={2} ⬅️ */}
            <Text 
                style={cardStyles.description}
                numberOfLines={2} // Limita a un máximo de 2 líneas
            >
                **Dentro:** {item.descriptionInside}
            </Text>
            
            {/* ➡️ APLICACIÓN DE numberOfLines={2} ⬅️ */}
            <Text 
                style={cardStyles.description}
                numberOfLines={1} // Limita a un máximo de 2 líneas
            >
                **Fuera:** {item.descriptionOutside}
            </Text>
        </View>
        
        {/* Icono de Marcador/Guardado (banderita) */}
        <TouchableOpacity style={cardStyles.bookmarkButton}>
            <Bookmark size={24} color="#007bff" fill="#007bff" />
        </TouchableOpacity>
    </View>
);

// --- Pantalla Principal de Guardados ---
const SavedScreen = () => {
    const insets = useSafeAreaInsets();

    const renderItem = ({ item }) => <SavedItemCard item={item} />;

    return (
        <View style={styles.container}>
            {/* Header con título y soporte para SafeArea */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <Text style={styles.headerTitle}>Guardados</Text>
            </View>
            <View style={styles.separator} />

            {/* Lista de Elementos Guardados */}
            <FlatList
                data={SAVED_ITEMS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

// --- Estilos para la Tarjeta de Producto (Card) ---
const cardStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 15,
        marginVertical: 8,
        // Sombra suave para que se vea como una tarjeta flotante
        shadowColor: '#00000077',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 15,
        backgroundColor: '#eee', // Placeholder
        resizeMode: 'cover',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
        flexShrink: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 5,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
        flexShrink: 1, // Permite que el título se encoja si es largo
    },
    price: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
    },
    description: {
        fontSize: 12,
        color: '#666',
        lineHeight: 16,
    },
    bookmarkButton: {
        position: 'absolute',
        top: 10,
        right: 15,
        // El icono de Lucide ya está en el JSX de la tarjeta
    },
});

// --- Estilos de la Pantalla Principal ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5', // Fondo gris claro para diferenciar las tarjetas
    },
    header: {
        alignItems: 'center',
        paddingBottom: 10,
        backgroundColor: 'white',
        paddingHorizontal: 15,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
    },
    listContent: {
        paddingVertical: 10,
    },
});

export default SavedScreen;