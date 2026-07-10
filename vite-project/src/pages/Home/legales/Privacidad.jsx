import React from "react";
import { useSelector } from "react-redux";
import { STORE_CONFIG } from "../../../config/storeConfig";
import "./legales.css";

// Plantilla genérica de Política de Privacidad para e-commerce en
// Argentina (Ley de Protección de Datos Personales 25.326). Mismo
// criterio que Terminos.jsx: toma el nombre de la tienda de
// Personalización, y se recomienda revisión legal antes de un
// lanzamiento real.
const Privacidad = () => {

  const configuracion = useSelector((state) => state.configuracion);
  const nombreTienda = configuracion?.nombre_tienda || STORE_CONFIG.name;

  return (
    <div className="contenedor legal-page">
      <div className="tarjeta legal-tarjeta">

        <h1>Política de Privacidad</h1>
        <p className="legal-actualizado">
          Última actualización: {new Date().toLocaleDateString("es-AR", { year: "numeric", month: "long" })}
        </p>

        <h2>1. Qué datos recopilamos</h2>
        <p>
          Cuando comprás, creás una cuenta o nos contactás, podemos
          recopilar: nombre, email, teléfono, dirección de envío,
          provincia y ciudad. Si pagás con Mercado Pago, los datos de
          tu tarjeta o medio de pago son procesados directamente por
          Mercado Pago — nunca los recibimos ni los almacenamos
          nosotros.
        </p>

        <h2>2. Para qué usamos tus datos</h2>
        <ul>
          <li>Procesar y confirmar tus pedidos.</li>
          <li>Coordinar el envío o retiro de tu compra.</li>
          <li>Enviarte confirmaciones y novedades sobre el estado de tu pedido por email o WhatsApp.</li>
          <li>Responder tus consultas.</li>
          <li>Cumplir obligaciones legales e impositivas.</li>
        </ul>

        <h2>3. Con quién compartimos tus datos</h2>
        <p>
          No vendemos tus datos personales. Los compartimos únicamente
          con los proveedores necesarios para operar el sitio: Mercado
          Pago (procesamiento de pagos), nuestro servicio de envío de
          emails transaccionales, y la empresa de transporte elegida
          para tu envío (solo nombre, dirección y teléfono).
        </p>

        <h2>4. Cookies y almacenamiento local</h2>
        <p>
          Usamos almacenamiento local del navegador (localStorage) para
          recordar el contenido de tu carrito y mantener tu sesión
          iniciada. No usamos cookies de terceros con fines
          publicitarios.
        </p>

        <h2>5. Tus derechos (Ley 25.326)</h2>
        <p>
          Como titular de tus datos, tenés derecho a acceder,
          rectificar, actualizar y solicitar la supresión de tus datos
          personales. Para ejercer estos derechos escribinos por
          WhatsApp o a nuestro email de contacto. La Agencia de Acceso a
          la Información Pública, en su carácter de Órgano de Control
          de la Ley 25.326, tiene la atribución de atender las quejas y
          reclamos que interpongan quienes resulten afectados en sus
          derechos por incumplimiento de las normas vigentes en materia
          de protección de datos personales.
        </p>

        <h2>6. Seguridad y conservación</h2>
        <p>
          Tomamos medidas razonables para proteger tus datos personales
          contra accesos no autorizados. Conservamos la información de
          tus pedidos durante el tiempo necesario para cumplir fines
          contables, impositivos y legales.
        </p>

        <h2>7. Menores de edad</h2>
        <p>
          Este sitio está dirigido a mayores de 18 años. No recopilamos
          intencionalmente datos de menores de edad sin consentimiento
          de sus padres o tutores.
        </p>

        <h2>8. Cambios en esta política</h2>
        <p>
          Podemos actualizar esta Política de Privacidad en cualquier
          momento; los cambios rigen desde su publicación en esta
          página. Te recomendamos revisarla periódicamente.
        </p>

        <h2>9. Contacto</h2>
        <p>
          Ante cualquier duda sobre el tratamiento de tus datos
          personales, podés escribirnos por los medios de contacto
          publicados en {nombreTienda}.
        </p>

      </div>
    </div>
  );
};

export default Privacidad;
