import React from "react";

// Red de seguridad de toda la app: si cualquier componente lanza un
// error al renderizar, en vez de dejar la pantalla en blanco (React
// desmonta todo el árbol ante un error no atrapado), mostramos un
// mensaje amable con la opción de recargar. Sin esto, un solo bug de
// render en cualquier pantalla tira abajo el sitio entero — y si pasa
// en pleno checkout, es una venta perdida.
//
// Tiene que ser un componente de clase: los error boundaries no se
// pueden escribir con hooks (React no expone todavía un equivalente a
// componentDidCatch en función).
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hayError: false };
    }

    static getDerivedStateFromError() {
        return { hayError: true };
    }

    componentDidCatch(error, info) {
        // Queda logueado en la consola del navegador para poder
        // diagnosticar. Si más adelante se suma un servicio de
        // monitoreo (Sentry, etc.), este es el lugar para reportarlo.
        console.error("Error atrapado por ErrorBoundary:", error, info);
    }

    render() {
        if (this.state.hayError) {
            return (
                <div
                    style={{
                        minHeight: "60vh",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "16px",
                        padding: "40px 20px",
                        textAlign: "center",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                >
                    <h1 style={{ fontSize: "22px", margin: 0, color: "#1c2029" }}>
                        Algo salió mal
                    </h1>
                    <p style={{ margin: 0, color: "#646d7a", maxWidth: "420px" }}>
                        Tuvimos un problema al mostrar esta página. Probá recargar;
                        si sigue pasando, escribinos y lo resolvemos.
                    </p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        style={{
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "8px",
                            background: "#ff6b35",
                            color: "#fff",
                            fontWeight: 700,
                            cursor: "pointer",
                        }}
                    >
                        Recargar la página
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
