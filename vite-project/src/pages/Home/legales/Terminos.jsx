import React from "react";
import { useSelector } from "react-redux";
import { STORE_CONFIG } from "../../../config/storeConfig";
import "./legales.css";

// Plantilla genérica de Términos y Condiciones para e-commerce en
// Argentina (Ley de Defensa del Consumidor 24.240, botón de
// arrepentimiento — Resolución 424/2020). Toma nombre/WhatsApp/
// dirección de Personalización, igual que Nav/Footer, para no tener
// que tocar este archivo al reusar el sitio para otro cliente.
// Recomendación: que un abogado la revise antes de un lanzamiento
// real, sobre todo el punto de cambios/devoluciones si difiere de lo
// que ya dice /DevolucionCambio.
const Terminos = () => {

  const configuracion = useSelector((state) => state.configuracion);

  const nombreTienda = configuracion?.nombre_tienda || STORE_CONFIG.name;
  const whatsapp = configuracion?.whatsapp || STORE_CONFIG.whatsapp;
  const direccion = configuracion?.direccion || STORE_CONFIG.address;

  return (
    <div className="contenedor legal-page">
      <div className="tarjeta legal-tarjeta">

        <h1>Términos y Condiciones</h1>
        <p className="legal-actualizado">
          Última actualización: {new Date().toLocaleDateString("es-AR", { year: "numeric", month: "long" })}
        </p>

        <h2>1. Identificación del vendedor</h2>
        <p>
          Este sitio es operado por <strong>{nombreTienda}</strong>
          {direccion ? `, con domicilio en ${direccion}` : ""}. Podés
          contactarnos por WhatsApp
          {whatsapp ? (
            <> al <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">{whatsapp}</a></>
          ) : " a través de los medios publicados en el sitio"}.
        </p>

        <h2>2. Aceptación de los términos</h2>
        <p>
          Al navegar y realizar una compra en este sitio, aceptás estos
          Términos y Condiciones y nuestra{" "}
          <a href="/politica-de-privacidad">Política de Privacidad</a>.
          Si no estás de acuerdo, te pedimos que no utilices el sitio.
        </p>

        <h2>3. Productos y precios</h2>
        <p>
          Los precios publicados están expresados en pesos argentinos
          (ARS) e incluyen los impuestos correspondientes, salvo que se
          indique lo contrario. Nos reservamos el derecho de modificar
          precios y stock disponible sin aviso previo; el precio válido
          es el vigente al momento de confirmar la compra. Las imágenes
          son ilustrativas y pueden presentar variaciones leves de color
          respecto del producto real.
        </p>

        <h2>4. Proceso de compra y métodos de pago</h2>
        <p>
          La compra se confirma al finalizar el checkout, ya sea
          coordinando el pago por WhatsApp o pagando online a través de
          Mercado Pago. En el caso de pagos con Mercado Pago, el pedido
          queda confirmado únicamente cuando Mercado Pago notifica el
          pago como aprobado; hasta ese momento el pedido figura como
          pendiente.
        </p>

        <h2>5. Envíos y entregas</h2>
        <p>
          Los costos y plazos de envío se muestran antes de confirmar la
          compra y varían según la provincia y localidad de destino.
          También ofrecemos la opción de retiro en local, sin costo de
          envío. No nos hacemos responsables por demoras atribuibles a
          la empresa de transporte una vez despachado el pedido.
        </p>

        <h2>6. Derecho de arrepentimiento, cambios y devoluciones</h2>
        <p>
          De acuerdo con el artículo 34 de la Ley de Defensa del
          Consumidor (24.240), en las compras realizadas a distancia
          tenés derecho a revocar la aceptación dentro de los 10 (diez)
          días corridos desde la entrega del producto, sin costo ni
          responsabilidad alguna. Para ejercer este derecho, o para
          consultar nuestra política particular de cambios por talle o
          modelo, escribinos por WhatsApp o revisá el detalle en{" "}
          <a href="/DevolucionCambio">Cambios y Devoluciones</a>.
        </p>

        <h2>7. Propiedad intelectual</h2>
        <p>
          Las imágenes, textos, logo y demás contenido de este sitio
          pertenecen a {nombreTienda} o a sus proveedores y no pueden
          reproducirse sin autorización.
        </p>

        <h2>8. Limitación de responsabilidad</h2>
        <p>
          Hacemos nuestro mejor esfuerzo para mantener la información
          del sitio actualizada y correcta, pero no garantizamos que
          esté libre de errores. No respondemos por daños indirectos
          derivados del uso del sitio, salvo los casos en que la ley
          aplicable no permita esta limitación.
        </p>

        <h2>9. Modificaciones</h2>
        <p>
          Podemos actualizar estos Términos y Condiciones en cualquier
          momento; los cambios rigen desde su publicación en esta
          página.
        </p>

        <h2>10. Legislación aplicable</h2>
        <p>
          Estos Términos se rigen por las leyes de la República
          Argentina. Ante cualquier conflicto, las partes se someten a
          los tribunales ordinarios competentes del domicilio del
          consumidor.
        </p>

      </div>
    </div>
  );
};

export default Terminos;
