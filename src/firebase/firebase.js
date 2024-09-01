// Importar las funciones necesarias de los SDK de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD58ZbzB13KAoj8nQ4DWEvZiKeX3IirN44",
    authDomain: "ecommerce-react-5c51c.firebaseapp.com",
    projectId: "ecommerce-react-5c51c",
    storageBucket: "ecommerce-react-5c51c.appspot.com",
    messagingSenderId: "347644672492",
    appId: "1:347644672492:web:1270231840ec1d8f23e8c9"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

// Exportar las instancias para usarlas en otros módulos
export { app, db };
