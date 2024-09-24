# GESTOR DE FUTBOL

Proyecto del frontal de la aplicación de Pesca - PESCAPP

# ARQUETIPO BASE DE LA APLICACIÓN

## Librerías JS que se utilizan

### Plop

<code>npm install plop</code>

Librería que se utiliza para hacer un arquetipo de los componentes nuevos que se vayan a crear. De esta forma, se
automatiza la creación de componentes siguiendo un mismo patrón.

<b>Archivos utilizados:</b>
<ul>
<li><b>plopfile.js</b>: Archivo en el que se configura el directorio en el que se va a crear el componente específico. También se pueden definir funciones auxiliares que se ejecutarán al crear el componente y se pueden utilizar en el arquetipo.  </li>
<li><b>plop-templates</b>: Directorio en el que se almacenan los arquetipos que se utilizarán en la creación del componente.  </li>
</ul>

<b>Comandos para creación de componentes:</b><code>plop component-name</code>

### I18Next

<code>npm install react-i18next</code>

Librería que se utiliza para utilizar el multiidioma en la aplicación.

En el caso de este arquetipo, en el fichero <code>index.js</code> se encuentra la configuración de la librería, la cual
se ejecuta al iniciar la aplicación. Se pueden configurar los idiomas que se desee establecer en la aplicación.

Para utilizarlo en los diferentes ficheros, se debe utilizar el siguiente hook: <code>const { t, i18n } =
useTranslation("common");</code>

Para modificar el idioma, la librería proporciona una función específica: <code>i18n.changeLanguage(idioma)</code>

### Prime React

<code>npm install primereact</code>

Librería de componentes ya predefinidos para su uso mediante parametrización en React. En la
página https://primereact.org/ se pueden consultar los diferentes componentes existentes.

### Bootstrap

<code>npm install bootstrap</code>

Librería que proporciona una serie de clases CSS para su uso.

###Axios

<code>npm install axios</code>

Librería que se utiliza para hacer llamadas REST a web services. 

###KINDE AUTH

<code>npm i  @kinde-oss/kinde-auth-react</code>

Libreria que aporta el SDK necesario para utilizar Kinde como proveedor de autenticación de usuarios.

## COMPONENTES PROPIOS Y ESTRUCTURAS DE DATOS

### BASIC BUTTON

Botón básico de la aplicación. Para invocar a este componente, se le tiene que pasar un objeto con los siguientes
campos:

    const button = {
        icon: "pi pi-check",
        className: "prueba",
        onClick: () => {
            alert("Se ha clicado el botón")
        }
    };

### TABLE COMPONENT

Componente para la creación de tablas dinámicas en la aplicación. Para crear estas tablas, el componente que las invoque debe tener los siguietes objectos: 

    const tableProps = {
        data: products,
        selectedData: selectedProduct,
        onChangeSelectedDataEvent: (e) => {
            setSelectedProduct(e.value);
            console.log(e.value);
        },
        columns: tableColumns,
        rows: 5,
        rowsPerPageOptions: [5, 10, 25, 50]
    };

dónde, el objeto <i>columns</i>, debe contener un array de los siguientes objetos: 

    const tableColumns = [
        {field: "id", header: `${t('t.id')}`},
        {field: "title", header: `${t('t.name')}`},
        {field: "date", header: `${t('t.date')}`},
        {field: "lunar_phase", header: `${t('t.lunar_phase')}`},
        {field: "water_temperature", header: `${t('t.water_temperature')}`}
    ];

El campo <i>field</i> ha de coincidir con los campos de los identificadores de los datos de la tabla. 

