import { useState } from "react";
import { Smartphone, QrCode, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../../../context/AuthContext";

export default function CardDobleFactor() {
  const { is2FAEnabled, toggle2FA } = useAuth();
  const [showQRModal, setShowQRModal] = useState(false);

  const handleToggle = () => {
    if (!is2FAEnabled) {
      setShowQRModal(true);
    } else {
      toggle2FA(false);
      toast.info("Autenticación en Dos Pasos desactivada");
    }
  };

  const confirmActivation = () => {
    toggle2FA(true);
    setShowQRModal(false);
    toast.success("2FA activado correctamente en tu cuenta");
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Smartphone size={18} className="text-emerald-500" />{" "}
              Autenticación 2FA
            </h3>
            <span
              className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                is2FAEnabled
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
              }`}
            >
              {is2FAEnabled ? "Activo" : "Inactivo"}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
            Protege tu cuenta con un código generado por Google Authenticator o
            Authy al iniciar sesión.
          </p>
        </div>

        {is2FAEnabled ? (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2
              size={16}
              className="text-emerald-500 flex-shrink-0"
            />
            <span>
              Tu cuenta requiere verificación de 6 dígitos en cada login.
            </span>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-1">
            <QrCode size={24} className="mx-auto text-slate-400" />
            <p className="text-[11px] text-slate-400">
              El código QR aparecerá al activar
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Habilitar 2FA
          </span>
          <input
            type="checkbox"
            checked={is2FAEnabled}
            onChange={handleToggle}
            className="h-5 w-5 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-900 cursor-pointer focus:outline-none"
            style={{ accentColor: "var(--color-primary)" }}
          />
        </div>
      </div>

      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4 border border-slate-200 dark:border-slate-700 text-center animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Configurar Google Authenticator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Escanea este código QR desde tu aplicación autenticadora para
              vincular tu cuenta:
            </p>

            <div className="p-4 bg-white rounded-lg border border-slate-200 inline-block shadow-inner">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/EduGestion:Director?secret=JBSWY3DPEHPK3PXP"
                alt="QR 2FA"
                className="w-36 h-36 mx-auto"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowQRModal(false)}
                className="w-1/2 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmActivation}
                className="w-1/2 py-2 text-xs font-semibold text-white rounded-lg transition-colors shadow-sm"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Confirmar Activación
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
