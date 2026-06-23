import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import axios from "axios";

import styles from "../styles/MercadoPagoButton.module.css";

const MP_PUBLIC_KEY =
    "APP_USR-86f3d1a9-4907-4398-9aa3-c15a4ec927d2";

const MercadoPagoButton = ({
    carrito,
}) => {
    const [preferenceId, setPreferenceId] =
        useState(null);

    const walletRef = useRef(null);

    /*
    ==========================
    CREAR PREFERENCE
    ==========================
    */

    useEffect(() => {
        const createPreference =
            async () => {
                if (!carrito?.length) {
                    setPreferenceId(null);
                    return;
                }

                try {
                    const productos =
                        carrito.map(
                            (producto) => ({
                                id:
                                    producto.id,

                                nombre:
                                    producto.nombre,

                                cantidad:
                                    producto.cantidad_elegida ||
                                    1,
                            })
                        );

                    const response =
                        await axios.post(
                            "http://localhost:3004/mp/create_preference",
                            productos
                        );

                    setPreferenceId(
                        response.data.id
                    );
                } catch (error) {
                    console.error(
                        "Error creando preferencia:",
                        error
                    );

                    setPreferenceId(null);
                }
            };

        createPreference();
    }, [carrito]);

    /*
    ==========================
    RENDER SDK MP
    ==========================
    */

    useEffect(() => {
        if (!preferenceId) return;

        const renderWallet = () => {
            if (!window.MercadoPago)
                return;

            if (walletRef.current) {
                walletRef.current.innerHTML =
                    "";
            }

            const mp =
                new window.MercadoPago(
                    MP_PUBLIC_KEY
                );

            mp.checkout({
                preference: {
                    id: preferenceId,
                },

                render: {
                    container:
                        "#wallet_container",

                    label:
                        "Pagar con Mercado Pago",
                },
            });
        };

        const sdkExistente =
            document.getElementById(
                "mercadopago-sdk"
            );

        if (!sdkExistente) {
            const script =
                document.createElement(
                    "script"
                );

            script.src =
                "https://sdk.mercadopago.com/js/v2";

            script.id =
                "mercadopago-sdk";

            script.onload =
                renderWallet;

            document.body.appendChild(
                script
            );
        } else {
            renderWallet();
        }

        return () => {
            if (walletRef.current) {
                walletRef.current.innerHTML =
                    "";
            }
        };
    }, [preferenceId]);

    if (!preferenceId) return null;

    return (
        <div className={styles.container}>
            <h4 className={styles.title}>
                Pago online
            </h4>

            <div
                id="wallet_container"
                ref={walletRef}
                className={styles.wallet}
            />
        </div>
    );
};

export default MercadoPagoButton;