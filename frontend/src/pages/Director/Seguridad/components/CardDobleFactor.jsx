// src/pages/Director/Seguridad/components/CardDobleFactor.jsx
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
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Smartphone size={18} className="text-emerald-500 shrink-0" />
              <span>Autenticación 2FA</span>
            </h3>
            <span
              className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                is2FAEnabled
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60"
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

        <div className="my-2">
          {is2FAEnabled ? (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
              <CheckCircle2
                size={16}
                className="text-emerald-500 shrink-0 mt-0.5"
              />
              <span>
                Tu cuenta requiere verificación de 6 dígitos en cada inicio de
                sesión.
              </span>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-center space-y-1">
              <QrCode size={24} className="mx-auto text-slate-400" />
              <p className="text-[11px] text-slate-400">
                El código QR aparecerá al activar
              </p>
            </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
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

      {/* Modal QR Responsivo */}
      {showQRModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-sm p-5 sm:p-6 space-y-4 border border-slate-200 dark:border-slate-700 text-center animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Configurar Google Authenticator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Escanea este código QR desde tu aplicación autenticadora para
              vincular tu cuenta:
            </p>

            <div className="p-3 bg-white rounded-xl border border-slate-200 inline-block shadow-inner">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/EduGestion:Director?secret=JBSWY3DPEHPK3PXP"
                alt="QR 2FA"
                className="w-32 h-32 sm:w-36 sm:h-36 mx-auto"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowQRModal(false)}
                className="w-1/2 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmActivation}
                className="w-1/2 py-2.5 text-xs font-semibold text-white rounded-xl transition-all shadow-xs hover:opacity-90 active:scale-95"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
