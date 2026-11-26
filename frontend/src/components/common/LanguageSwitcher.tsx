import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = async () => {
    const newLanguage = i18n.language === "en" ? "ar" : "en";

    await i18n.changeLanguage(newLanguage);

    localStorage.setItem("language", newLanguage);

    document.documentElement.lang = newLanguage;
    document.documentElement.dir =
      newLanguage === "ar" ? "rtl" : "ltr";
  };

  return (
    <button
      className="language-switcher"
      onClick={changeLanguage}
      type="button"
      aria-label="Change language"
      title="Change language"
    >
      <Languages size={18} />
      <span>{i18n.language === "en" ? "العربية" : "English"}</span>
    </button>
  );
};

export default LanguageSwitcher;