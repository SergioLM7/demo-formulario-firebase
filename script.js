//Variables
const formulario = document.querySelector("#formDemo");
const listUsers = document.querySelector('.usersList');
const fragment = document.createDocumentFragment();
let objetoDatos = {};


//EVENTOS
//Evento del submit del formulario
formulario.addEventListener(('submit'), (evento) => {
    evento.preventDefault();
    objetoDatos = {
        nombre: formulario.name.value,
        apellido: formulario.surname.value,
        email: formulario.email.value,
        mensaje: formulario.message.value,
        url: formulario.urlImage.value,
    };
    console.log(objetoDatos)

    createData({ ...objetoDatos });

});




// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCw6W16ItqmffU-peo3y6rM8lwWmsZ7B8k",
    authDomain: "fir-firebase-7e96e.firebaseapp.com",
    projectId: "fir-firebase-7e96e",
    storageBucket: "fir-firebase-7e96e.appspot.com",
    messagingSenderId: "467507857731",
    appId: "1:467507857731:web:0bf3d319532aff9fc847f6"
};

firebase.initializeApp(firebaseConfig);// Inicializaar app Firebase

const db = firebase.firestore();// db representa mi BBDD //inicia Firestore

//Función pra guardar datos del form en Firebase
const createData = ({ nombre, apellido, email, mensaje, url }) => {

    db.collection("users")
        .add({ nombre, apellido, email, mensaje, url })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            //printData(nombre, apellido, email, mensaje, url)
            objetoDatos = {};
            formulario.reset();
        })
        .catch((error) => console.error("Error adding document: ", error));
};

//Función para pintar los datos en el DOM
const printData = (nombre, apellido, email, mensaje, url) => {
    const rowUser = document.createElement('LI');

    let h3User = document.createElement('H3');
    h3User.innerHTML = `Usuario: ${nombre}`;
    let picture = document.createElement('img');
    picture.setAttribute('src', url);
    picture.setAttribute('style', 'max-width:250px');
    let nombreApellido = document.createElement('p');
    nombreApellido.innerHTML = `Nombre: ${nombre} ${apellido}`;
    let correo = document.createElement('p');
    correo.innerHTML = `Email: ${email}`;
    let userMessage = document.createElement('P');
    userMessage.innerHTML = `Mensaje: ${mensaje}`;

    fragment.append(h3User, picture, nombreApellido, correo, userMessage);
    rowUser.append(fragment);
    listUsers.append(rowUser);


};

//Función para limpiar la lista de usuarios del DOM
const cleanUsers = () => {
    listUsers.innerHTML = '';
};

//Función para leer todos los datos almacenados en Firebase
const readAll = () => {
    // Limpia la lista para mostrar el resultado
    cleanUsers();
    //Petición a Firestore para leer todos los documentos de la colección album
    db.collection("users")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                console.log(doc.data().nombre);
                printData(doc.data().nombre, doc.data().apellido, doc.data().email, doc.data().mensaje, doc.data().url)
            });

        })
        .catch(() => console.log('Error reading documents'));;
};

//Función para eliminar todos los datos almacenados en Firebase
const deleteAll = () => {
    db.collection('users').get()
        .then(querySnapshot => {
            querySnapshot.docs.forEach(snapshot => {
                snapshot.ref.delete();
            })
            alert(`La base de datos ha sido borrada`);
            //Limpiar el DOM
            cleanUsers();
        })
        .catch(() => console.log('Error al borrar el documento'));

};

//Función para eliminar un usuario concreto en Firebase
const deleteOne = (id) => {
    db.collection('users').doc(id).delete()
        .then(() => {
            alert(`El usuario ${id} ha sido borrado`);
            //Limpiar el DOM
            cleanUsers();
            //Read all de nuevo
            //readAll();
        })
        .catch(() => console.log('Error al borrar el documento'));
};

//EVENTOS
//Evento del botón Read All
document.querySelector("#read-all").addEventListener("click", () => {
    readAll();
});

//Evento del botón Delete All
document.querySelector('#deleteAll').addEventListener('click', () => {
    deleteAll();
});

//Evento del botón Delete 
document.querySelector('#delete').addEventListener('click', () => {
    const id = prompt("Introduce el id a eliminar");
    deleteOne(id);
});