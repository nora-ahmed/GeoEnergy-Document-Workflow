
import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  FileCheck2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/useAuth";
import LanguageSwitcher from "../../components/common/LanguageSwitcher";
import "./LoginPage.css";

const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const { user, isLoading, login } = useAuth();
  const navigate = useNavigate();

  const isArabic = i18n.language === "ar";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return <div className="login-loading">{t("common.loading")}</div>;
  }

  if (user) {
    return (
      <Navigate
        to={user.role === "Manager" ? "/manager" : "/engineer"}
        replace
      />
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const loggedInUser = await login({ username, password });

      navigate(
        loggedInUser.role === "Manager" ? "/manager" : "/engineer"
      );
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401 || err.response?.status === 400) {
          setError(t("auth.invalidCredentials"));
        } else {
          setError(
            err.response?.data?.message ||
            err.response?.data?.title ||
            t("auth.unexpectedError")
          );
        }
      } else {
        setError(t("auth.unexpectedError"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <div className="brand-content">
          <div className="brand-logo">
            <div className="brand-logo-icon">
              <FileCheck2 size={27} />
            </div>
            <span>{t("app.name")}</span>
          </div>

          <div className="brand-message">
            <span className="brand-eyebrow">
              {t("auth.brandEyebrow")}
            </span>

            <h1>{t("auth.brandTitle")}</h1>

            <p>{t("auth.brandDescription")}</p>
          </div>

          <div className="brand-feature">
            <div className="feature-icon">
              <ShieldCheck size={21} />
            </div>

            <div>
              <strong>{t("auth.secureTitle")}</strong>
              <span>{t("auth.secureDescription")}</span>
            </div>
          </div>
        </div>

        <div className="brand-decoration decoration-one" />
        <div className="brand-decoration decoration-two" />

        <div className="brand-footer">
          © 2026 GeoEnergy Group. {t("common.allRightsReserved")}
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-form-container">
          <div className="login-language">
            <LanguageSwitcher />
          </div>

          <div className="mobile-brand">
            <div className="brand-logo-icon">
              <FileCheck2 size={24} />
            </div>
            <span>{t("app.name")}</span>
          </div>

          <div className="login-heading">
            <span className="login-eyebrow">
              {t("auth.welcomeBack")}
            </span>

            <h2>{t("auth.loginTitle")}</h2>

            <p>{t("auth.loginSubtitle")}</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <div className="form-field">
              <label htmlFor="username">
                {t("auth.username")}
              </label>

              <input
                id="username"
                type="text"
                placeholder={t("auth.usernamePlaceholder")}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div className="form-field">
              <div className="password-label-row">
                <label htmlFor="password">
                  {t("auth.password")}
                </label>
              </div>

              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.passwordPlaceholder")}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? t("auth.hidePassword")
                      : t("auth.showPassword")
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            <button
              className="login-submit"
              type="submit"
              disabled={isSubmitting}
            >
              <span>
                {isSubmitting
                  ? t("auth.signingIn")
                  : t("auth.loginButton")}
              </span>

              {!isSubmitting && (
                <ArrowRight
                  size={19}
                  className={isArabic ? "login-arrow-rtl" : ""}
                />
              )}
            </button>
          </form>

          <div className="login-security">
            <ShieldCheck size={17} />
            <span>{t("auth.securityMessage")}</span>
          </div>

          <p className="login-copyright">
            © 2026 GeoEnergy Group
          </p>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
