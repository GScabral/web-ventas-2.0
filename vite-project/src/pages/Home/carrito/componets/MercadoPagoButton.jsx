import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import { crearPreferenciaMP } from "../../../../redux/action";
import styles from "../styles/MercadoPagoButton.module.css";

// Antes este componente armaba el pago directo desde el carrito del
// navegador, sin pasar por ningún Pedido guardado en la base — un pago
// hecho por ese camino no quedaba registrado en el sistema ni descontaba
// stock. Ahora recibe el id de un pedido YA CREADO (ver useCheckout.js:
// primero se llama a addPedido, y solo si el cliente elige pagar con
// Mercado Pago se monta este botón con ese id).
const MercadoPagoButton = ({
    pedidoId,
}) => {
    const [preferenceId, setPreferenceId] = useState(null);
    const [publicKey, setPublicKey] = useState(null);
    const [error, setError] = useState("");

    const walletRef = useRef(null);

    /*
    ==========================
    CREAR PREFERENCE
    ==========================
    */

    useEffect(() => {
        const crear = async () => {
            if (!pedidoId) {
                setPreferenceId(null);
                return;
            }

            try {
                const data = await crearPreferenciaMP(pedidoId);
                setPreferenceId(data.id);
                setPublicKey(data.publicKey);
            } catch (err) {
                console.error("Error creando preferencia:", err);
                setError(
                    err.response?.data?.error ||
                    "No pudimos generar el link de pago. Intentá de nuevo."
                );
                setPreferenceId(null);
            }
        };

        crear();
    }, [pedidoId]);

    /*
    ==========================
    RENDER SDK MP
    ==========================
    */

    useEffect(() => {
        if (!preferenceId || !publicKey) return;

        const renderWallet = () => {
            if (!window.MercadoPago) return;

            if (walletRef.current) {
                walletRef.current.innerHTML = "";
            }

            const mp = new window.MercadoPago(publicKey);

            mp.checkout({
                preference: {
                    id: preferenceId,
                },

                render: {
                    container: "#wallet_container",
                    label: "Pagar con Mercado Pago",
                },
            });
        };

        const sdkExistente = document.getElementById("mercadopago-sdk");

        if (!sdkExistente) {
            const script = document.createElement("script");
            script.src = "https://sdk.mercadopago.com/js/v2";
            script.id = "mercadopago-sdk";
            script.onload = renderWallet;
            document.body.appendChild(script);
        } else {
            renderWallet();
        }

        return () => {
            if (walletRef.current) {
                walletRef.current.innerHTML = "";
            }
        };
    }, [preferenceId, publicKey]);

    if (error) {
        return <p className={styles.error}>{error}</p>;
    }

    if (!preferenceId) {
        return <p className={styles.cargando}>Preparando el pago...</p>;
    }

    return (
        <div className={styles.container}>
            <h4 className={styles.title}>Pago online</h4>

            <div
                id="wallet_container"
                ref={walletRef}
                className={styles.wallet}
            />
        </div>
    );
};

export default MercadoPagoButton;
